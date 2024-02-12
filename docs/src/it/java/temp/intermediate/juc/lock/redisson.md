---
category: IT
article: false
---

# Redisson

## 每天早上 9 点秒杀奖品

```java
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

@Service
public class ActivityServiceImpl extends ActivityService{

    @Resource
    private RedisTemplate redisTemplate;

    @Resource
    private Redisson redisson;

    @Override
    public String receivePrize() {
        String rightsId = "123"; // 奖品Id
        String redisKey = "client:activity:prize:stock:"; // Redis 的 key 前缀

        LocalDateTime currentDateTime = LocalDateTime.now(); // 获取当前时间
        /**
         * 最终，midnight 变量包含的是从当前时间到第二天早上8点59分59秒的时间
         * 这个时间点用于设定锁的过期时间，确保锁在该时间过后会被自动释放
         */
        LocalDateTime midnight = currentDateTime.plusDays(1) // 当前时间加一天
                .withHour(8)   // 设置小时为 8
                .withMinute(59) // 设置分钟为 59
                .withSecond(59) // 设置秒数为 59
                .withNano(0);   // 将纳秒部分设置为 0
        /**
         * 使用 redisson 获取分布式锁，确保活动期间每个权益只能被一个用户领取
         */
        RLock[] locks = getLock(redisson, redisKey + rightsId, 10); // 当前设置为奖品一共有10份，获取10把分布式锁
        /**
         * 所有进程一起抢这10把锁，如果10把锁都用完了就不会再执行相关业务了
         */
        for (RLock lock : locks) {
            /**
             * 判断锁是否处于空闲状态，如果是空闲状态，则执行相应的加锁逻辑，进一步执行领取资格校验和其他业务逻辑。这样可以确保在并发环境下，只有一个线程能够成功地获取锁并执行相应的逻辑，避免了多个线程同时操作共享资源的问题
             * 如果返回 false，说明当前锁没有被其他线程或进程占用，可以进行加锁操作
             * 如果返回 true，说明当前锁已被其他线程或进程占用，需要等待锁的释放
             */
            if (!lock.isLocked()) {
                // TODO 领取资格校验（一个用户只能领取一份）
                /**
                 * lock.lock() 方法用于获取分布式锁，它是一个阻塞方法，如果锁已经被其他线程或进程占用，当前线程将被阻塞，直到获取到锁或者超时
                 * ChronoUnit.SECONDS.between(currentDateTime, midnight) 计算了当前时间到 midnight（第二天的早上8点59分59）之间的秒数差。这个值会作为锁的有效期，即锁会在一定时间后自动释放
                 * TimeUnit.SECONDS 指定时间单位为秒
                 */
                lock.lock(ChronoUnit.SECONDS.between(currentDateTime, midnight), TimeUnit.SECONDS);
                int lockStock = 10; // 表示秒杀活动的权益券库存，初始值为10
                int surplusStock = -1; // 表示剩余库存，初始值为-1。在后续的逻辑中，如果 Redis 中存在当前权益券的库存信息，会更新为实际库存值
                /**
                 * 判断 Redis 中是否存在当前日期和权益券ID构成的键
                 * 如果不存在，说明是当天第一次操作该权益券，需要将初始库存数量 lockStock 存入 Redis，并设置有效期为当前时间到第二天早上8点59分59秒之间的秒数差
                 * 如果 Redis 中已经存在当前日期和权益券ID构成的键，说明之前已经有过操作，需要从 Redis 中获取当前奖品的库存量
                 */
                if (!redisTemplate.hasKey(redisKey + LocalDate.now() + rightsId)) {
                    redisTemplate.opsForValue().set(redisKey + LocalDate.now() + rightsId, lockStock, Duration.ofSeconds(ChronoUnit.SECONDS.between(currentDateTime, midnight)));
                } else {
                    // 判断剩余库存是否足够。如果减去一个库存后小于零，说明当前库存已经不足，返回相应的提示信息
                    surplusStock = (int) redisTemplate.opsForValue().get(redisKey + LocalDate.now() + rightsId);
                    if (surplusStock - 1 < 0) {
                        return "手慢了，这个权益已被兑换完了，请明天再来试试哦！";
                    }
                }
                // TODO 扣减库存 UPDATE SET stock_num = stock_num - 1 , receive_num = receive_num + 1 WHERE rights_id = #{rightsId} AND stock_num > 0
                boolean updateStock = true;
                if (updateStock) { // 如果库存扣减成功
                    // 获取当前键的剩余过期时间，这是为了在后续的操作中保持 Redis 中的数据和锁的过期时间一致
                    Long ttl = redisTemplate.getExpire(redisKey + LocalDate.now() + rightsId);
                    /** 
                     * 更新 Redis 中的奖品库存
                     * 如果之前获取库存时 surplusStock 小于 0（即不存在库存记录），则设置为 lockStock - 1 （10-1 = 库存剩余9）
                     * 否则设置为 surplusStock - 1 （第二个用户领取的时候就是先获取到剩余库存=9，因此就是9-1=8，以此类推）
                     */
                    redisTemplate.opsForValue().set(redisKey + LocalDate.now() + rightsId, surplusStock < 0 ? lockStock - 1 : surplusStock - 1, ttl);
                } else {
                    return "手慢了，这个权益已被兑换完了，请明天再来试试哦！";
                }
                // TODO 保存用户领取记录
            }
            return "SUCCESS";
        }
        /**
         * 如果锁未被其他线程持有，执行领取资格校验，并进行权益库存的处理。在处理库存时，首先检查 Redis 缓存中的库存，如果库存已被兑换完，则返回提示信息，否则更新库存信息
         */
    }

    /**
     * 该方法的主要作用是创建一组分布式锁，这些锁可以用于保护共享资源，确保在分布式环境中对资源的访问是同步的
     * name 用来区分奖品
     * count 用来控制锁数量（秒杀奖品的库存数）
     */
    private RLock[] getLock(Redisson redisson, String name, int count) {
        RLock[] locks = new RLock[count];
        for (int i = 0; i < count; i++) { // 使用循环遍历，根据给定的 count 数量，创建相应数量的 RLock 对象
            locks[i] = redisson.getLock(name + "_" + i); // 通过 Redisson 对象获分布式锁，每个 RLock 对象的名字是由传入的 name 和循环索引 i 拼接而成的，确保每个锁有一个唯一的名字
        }
        return locks;
    }
}
```