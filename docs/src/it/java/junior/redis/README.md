---
category: IT
article: false
---

# 初识 Redis

官网：[https://redis.io](https://redis.io/)

Redis 是一种 Key-Value 类型的内存数据库，类似于 memcached，但是具有更多的特性。它的整个数据库操作在内存中进行，通过异步操作将数据库数据定期写入硬盘进行保存。由于是纯内存操作，因此 Redis 具有出色的性能，每秒可以处理超过 10 万次读写操作，是已知性能最快的 Key-Value DB。除此之外，Redis 最大的魅力在于其支持保存多种数据结构，并且单个 value 的最大限制是 1GB，不像 memcached
只能保存 1MB 的数据，因此 Redis 可以用来实现很多有用的功能。Redis 默认有16个数据库，类似于数组下标是从零开始，初始默认使用零号库，支持统一的密码管理，所有库都是同样密码，要么都能连接，要么一个也连接不上。Redis 默认端口是 6379

Redis 的优点主要包括：

- 速度快：因为数据存在内存中，类似于 HashMap，查找和操作的时间复杂度都是 O(1)

- 持久化：定期通过异步操作把数据库数据写到硬盘上进行保存

- 支持丰富的数据类型：支持 string、list、set、sorted set、hash

- 支持事务：操作都是原子性，所谓的原子性就是对数据的更改要么全部执行，要么全部不执行

- 丰富的特性：可用于缓存、消息、按 key 设置过期时间，过期后将会自动删除等

Redis 可视化工具：

- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/)

- [RESP.app](https://docs.resp.app/)（原名 RedisDesktopManager）

## 在项目中使用 Redis

引入相关依赖及配置

::: tabs

@tab pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
</dependencies>
```

@tab application.properties

```properties
# Redis 服务器的主机名或IP地址
spring.redis.host=localhost
# Redis 服务器的端口号
spring.redis.port=6379
# Redis 服务器的密码
spring.redis.password=
# 连接池最大连接数
spring.redis.lettuce.pool.max-active=20
# 连接池最大空闲连接数
spring.redis.lettuce.pool.max-idle=10
# 连接池最小空闲连接数
spring.redis.lettuce.pool.min-idle=5
# 连接池最大阻塞时间 10秒
spring.redis.lettuce.pool.max-wait=PT10S
# 连接超时时间 10秒
spring.redis.timeout=PT10S
```

:::

### 创建工具类

```java
@Component
public class RedisUtil {

    @Resource
    private RedisTemplate redisTemplate;

    /**
     * 判断 key 是否存在
     */
    public Boolean hasKey(String key) {
        if (StringUtils.hasLength(key)) {
            return redisTemplate.hasKey(key);
        }
        return false;
    }

    /**
     * 判断是否成功删除单个 key
     */
    public Boolean deleteKey(String key) {
        if (StringUtils.hasLength(key)) {
            return redisTemplate.delete(key);
        }
        return false;
    }

    /**
     * 批量删除 key
     */
    public Long deleteKey(Collection<String> keys) {
        return redisTemplate.delete(keys);
    }

    /**
     * 判断 key 是否已过期
     */
    public Boolean expTime(String key, Long timeout, TimeUnit timeUnit) {
        if (StringUtils.hasLength(key) && Objects.nonNull(timeout) && Objects.nonNull(timeout)) {
            return redisTemplate.expire(key, timeout, timeUnit);
        }
        return false;
    }

    /**
     * 移除 key 的过期时间，key 将持久保存
     */
    public Boolean persist(String key) {
        if (StringUtils.hasLength(key)) {
            return redisTemplate.persist(key);
        }
        return false;
    }

    /**
     * 获取键的剩余过期时间
     *
     * @param key      要查询过期时间的键
     * @param timeUnit 时间单位，表示返回结果的时间单位
     * @return 如果键存在并且有剩余过期时间，返回剩余过期时间的长整型数值，根据提供的时间单位进行转换
     * 如果键不存在或者没有设置过期时间，返回 -2
     * 如果键存在但没有剩余过期时间（即永不过期），返回 -1
     */
    public Long getExpire(String key, TimeUnit timeUnit) {
        return redisTemplate.getExpire(key, timeUnit);
    }

    /**
     * 将指定的键值对存储到 Redis 中
     */
    public <T> void set(String key, T value) {
        if (StringUtils.hasLength(key)) {
            redisTemplate.opsForValue().set(key, value);
        }
    }

    /**
     * 从 Redis 中获取与指定键关联的值
     */
    public <T> T get(String key) {
        ValueOperations<String, T> valueOperations = redisTemplate.opsForValue();
        return valueOperations.get(key);
    }

    /**
     * 添加 List 类型的数据
     */
    public <T> void putList(String key, List<T> values) {
        redisTemplate.opsForList().rightPushAll(key, values);
    }

    /**
     * 获取指定 key 的 List 类型的数据
     */
    public <T> List<T> getList(String key, Long start, Long end) {
        ListOperations<String, T> opsForList = redisTemplate.opsForList();
        return opsForList.range(key, start, end);
    }

    /**
     * 添加 Set 类型的数据
     */
    public <T> void putSet(String key, Set<T> values) {
        redisTemplate.opsForSet().add(key, values.toArray());
    }

    /**
     * 获取指定 key 的 Set 类型的数据
     */
    public <T> Set<T> getSet(String key) {
        SetOperations<String, T> opsForSet = redisTemplate.opsForSet();
        return opsForSet.members(key);
    }

    /**
     * 添加 Map 类型的数据
     */
    public <K, V> void putHash(String key, Map<K, V> map) {
        redisTemplate.opsForHash().putAll(key, map);
    }

    /**
     * 获取指定 key 的 Map 类型的数据
     */
    public <K, V> Map<K, V> getHash(String key) {
        HashOperations<String, K, V> opsForHash = redisTemplate.opsForHash();
        return opsForHash.entries(key);
    }

    /**
     * 删除 hash key 内指定字段
     */
    public Long deleteHashKey(String key, String field) {
        return redisTemplate.opsForHash().delete(key, field);
    }

    /**
     * 返回并弹出指定 Key 关联的链表中的最前一个元素，即首部元素
     */
    public <T> T leftPop(final String key) {
        ListOperations<String, T> opsForList = redisTemplate.opsForList();
        return opsForList.leftPop(key);
    }

    /**
     * 返回并弹出指定 Key 关联的链表中的最后一个元素，即尾部元素
     */
    public <T> T rightPop(String key) {
        ListOperations<String, T> opsForList = redisTemplate.opsForList();
        return opsForList.rightPop(key);
    }

}
```

测试工具类：

```java
@SpringBootTest
public class TestRedis {

    @Resource
    private RedisUtil redisUtil;

    @Test
    public void testRedis() {
        redisUtil.set("keyName", "blog.sherry4869.com");
        System.out.println((String) redisUtil.get("keyName"));
    }
}
```

在Redis 可视化工具里可以看到存储的键值有乱码

![](https://img.sherry4869.com/blog/it/java/junior/redis/img.png)

`JdkSerializationRedisSerializer` 是 Redis 提供的一种默认的 Java 序列化方式，它使用 Java 自带的序列化机制将 Java 对象序列化为字节数组进行存储。但是，使用 `dkSerializationRedisSerializer` 存在一些问题。首先，由于 Java 序列化是一种二进制序列化方式，序列化后的字节数组不易阅卖，在可视化工具中就无法正确解析和显示。也不易进行跨平台的数据传输和数据存储。其次，如果对象的类发生变化，例如增加或删除了属性或方法，那么反序列化后的对象可能会出现异常。最后，由于 Java 序列化机制使用反射机制，反序列化过程可能存在安全漏洞，例如通过反序列化攻击

相比之下，`GenericJackson2JsonRedisSerializer` 使用 JSON 格式来序列化 Java 对象，具有更好的跨平台性和易读性，而且可以避免反序列化过程中出现的一些问题。例如，即使对象的类发生了变化，只要保证属性名称和类型匹配，就可以正常反序列化 JSON 字符串。同时，使用 JSON 序列化方式也可以避免一些反序列化攻击

因此，当我们在使用 Redis 存储 Java 对象时，推荐使用 JSON 序列化方式，例如 `GenericJackson2JsonRedisSerializer`。虽然 `JdkSerializationRedisSerializer` 也可以用来序列化 Java 对象，但是存在一些问题，使用时需要注意其可能带来的问题

### 自定义 Redis 序列化方式

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory); // 通过将连接工厂设置给 redisTemplate，它将使用该连接工厂来获取和管理与 Redis 的连接
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer(); // 创建一个作用于键的序列化对象
        GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer(); // 创建一个作用于值的序列化对象
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setValueSerializer(genericJackson2JsonRedisSerializer);
        redisTemplate.setHashValueSerializer(genericJackson2JsonRedisSerializer);
        return redisTemplate;
    }
}
```

再次运行测试方法 `testRedis()`，在 Redis 可视化工具中可以看到存储的键值里没有乱码了

![](https://img.sherry4869.com/blog/it/java/junior/redis/img_2.png)