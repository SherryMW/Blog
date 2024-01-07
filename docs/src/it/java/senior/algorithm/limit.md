---
category: IT
article: false
---

# 限流

分布式限流是在分布式系统中控制请求流量的一种手段，目的是防止系统因过多的请求而不稳定或宕机。以下是一些常见的分布式限流算法及其介绍：

## 令牌桶算法（Token Bucket）

- 原理：令牌桶算法通过维护一个固定容量的桶，以固定速率往桶里放入令牌。每次请求需要消耗一个令牌，当桶中没有足够令牌时，请求会被限流

- 场景：适用于需要对突发流量进行限制，但仍能保证平均处理速率

- 实现：每隔一段时间往桶中添加一定数量的令牌，请求时尝试获取令牌，如果获取成功则处理请求，否则限流

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class DistributedRateLimiter {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String BUCKET_KEY = "bucket";
    private static final long RATE = 10; // 每秒生成10个令牌
    private static final long CAPACITY = 20; // 桶的容量

    public boolean tryAcquire() {
        long now = System.currentTimeMillis();
        String lastTokenTime = redisTemplate.opsForValue().get(BUCKET_KEY);

        long tokens;
        if (lastTokenTime == null) {
            tokens = CAPACITY;
        } else {
            long elapsedTime = now - Long.parseLong(lastTokenTime);
            tokens = Math.min(CAPACITY, RATE * (elapsedTime / 1000));
        }

        if (tokens < 1) {
            // 桶中没有足够的令牌
            return false;
        } else {
            // 消耗一个令牌
            redisTemplate.opsForValue().set(BUCKET_KEY, String.valueOf(now));
            return true;
        }
    }
}
```

在上述代码中，使用 Redis 作为分布式环境下的共享存储，通过 `StringRedisTemplate` 进行对 Redis 的操作。每个请求到来时，先检查桶中的令牌数量，如果令牌数量足够，则允许通过，并更新桶中的令牌信息

请注意，这只是一个简单的示例，实际项目中需要考虑更多因素，如并发控制、一致性、性能等。不同的限流算法和实现方式也会有所不同

## 漏桶算法（Leaky Bucket）

- 原理：漏桶算法将请求以固定速率处理，多余的请求将被放入一个漏桶中，当漏桶满时，多余的请求会被限流

- 场景：适用于需要固定地请求处理速率，即使请求不均匀也能以固定速率进行处理

- 实现：每个请求进入漏桶，漏桶以恒定速率漏水，如果漏桶满了，则溢出的请求被丢弃或放入队列中

待更新

## 计算器限流算法（Counter）

- 原理：统计单位时间内的请求次数，当请求次数超过设定的阈值时，进行限流

- 场景：适用于对每个请求进行计数，并在达到一定阈值时限制请求，比如在单位时间内允许的请求数

- 实现：使用分布式计数器，每个节点独立维护计数器，通过定期同步或分布式锁保持计数器的一致性

待更新

## 滑动窗口算法（SlidingWindow）

- 原理：将时间划分为多个窗口，每个窗口内记录请求次数，通过滑动窗口的方式计算单位时间内的请求次数，进行限流

- 场景：适用于需要对请求频率进行动态调整的场景，可以应对短时间内的突发流量

- 实现：使用分布式滑动窗口，每个节点独立维护窗口，通过定期同步或分布式锁保持窗口的一致性

待更新