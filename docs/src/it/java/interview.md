---
category: IT
article: false
---

# 面试题

## Java 基础

### Java 有哪些循环语句

1. for 循环

    ```text
    for (初始化语句; 循环条件; 迭代语句) {
        // 循环体
    }
    ```

2. while 循环

    ```text
    while (循环条件) {
        // 循环体
    }
    ```

3. do-while 循环

    ```text
    do {
        // 循环体
    } while (循环条件);
    ```

4. 增强 for 循环（foreach 循环）

    ```text
    for (元素类型 元素变量 : 遍历对象) {
        // 循环体
    }
    ```

### Java 集合

- List

    - ArrayList：动态数组实现，支持快速随机访问

    - LinkedList：双向链表实现，适用于频繁插入和删除操作

    - Vector：类似于 ArrayList，但是是线程安全的，通常不推荐使用，可以使用 ArrayList 替代

- Set

    - HashSet：基于哈希表实现，不保证元素的顺序

    - LinkedHashSet：具有可预知迭代顺序的 HashSet

    - TreeSet：基于红黑树实现，按照自然顺序或者指定比较器排序

- Map

    - HashMap：基于哈希表实现，无序

    - LinkedHashMap：具有可预知迭代顺序的 HashMap

    - TreeMap：基于红黑树实现，按照自然顺序或者指定比较器排序

- Queue

    - PriorityQueue：非阻塞、非线程安全、无边界，支持优先级队列实现类。

    - ConcurrentLinkedQueue：非阻塞、线程安全、无边界，基于链接节点的队列实现类

    - ArrayBlockingQueue：阻塞、线程安全、有边界，创建的时候指定大小，一旦创建容量不可改变实现类，默认是不保证线程的公平性，不允许向队列中插入 null 元素

    - LinkedBlockingQueue：阻塞、线程安全、可选有边界，一个由链表结构组成的可选有界阻塞队列实现类，如果未指定容量，那么容量将等于 Integer.MAX_VALUE

    - PriorityBlockingQueue：阻塞、线程安全、无边界，支持优先级排序的无边界阻塞队列实现类

    - DelayQueue：阻塞、线程安全、无边界，使用优先级队列实现的无界阻塞队列实现类，只有在延迟期满时才能从中提取元素

    - SynchronousQueue：阻塞、线程安全、无数据队列，不存储元素、没有内部容量的阻塞队列实现类

    - LinkedBlockingDeque：阻塞、线程安全、无边界，由链表结构组成的可选范围双向阻塞队列实现类，如果未指定容量，那么容量将等于 Integer.MAX_VALUE

- Deque

    - ArrayDeque：双端队列的数组实现

### 开发中为什么要用到接口

- 抽象和实现分离：接口提供了一种将抽象与实现分离的机制。通过定义接口，可以明确规定类应该提供哪些方法，但无需实现这些方法的具体细节。这有助于降低代码的耦合度，使系统更易于维护和扩展

- 多态性：接口允许通过多态性实现代码的灵活性。通过接口，可以在不考虑实际实现的情况下，使用不同类的对象，提高代码的灵活性和可复用性

- 实现多继承：接口支持多继承，一个类可以实现多个接口。这种机制在需要继承多个不同功能的情况下非常有用，避免了 Java 中单继承的限制

- 接口的动态代理：接口可以与动态代理结合使用，实现一些横切关注点（cross-cutting concerns），如事务管理、日志记录等。这种机制使得代码更易于维护和扩展

- 约定编程：接口提供了一种约定编程的机制，定义了类应该实现的方法，使得开发者在设计和实现类时有一个明确的契约。这有助于提高代码的一致性和可读性

- 代码组织和模块化：接口有助于代码的组织和模块化。通过将相关的方法定义在接口中，可以更清晰地组织代码结构，提高系统的可维护性

### 抽象类和接口的区别

- 继承

    - 抽象类：使用关键字 `abstract` 定义的类，可以包含抽象方法和具体方法。一个类只能继承一个抽象类

    - 接口：使用关键字 `interface` 定义的接口，只包含抽象方法和常量。一个类可以实现多个接口

- 构造函数

    - 抽象类：可以有构造函数，且构造函数可以有参数和方法体

    - 接口：不能有构造函数，因为接口不能被实例化

- 字段

    - 抽象类：可以有实例变量

    - 接口：只能包含 `public static final` 类型的变量，即常量

- 方法实现

    - 抽象类：可以有抽象方法和具体方法。子类继承抽象类时，可以选择性地覆盖（实现）抽象方法，也可以继续使用具体方法

    - 接口：只能包含抽象方法，实现接口的类必须提供对所有抽象方法的实现

- 访问修饰符

    - 抽象类：可以有访问修饰符，可以是 `public`、`protected`、`default` 或 `private`

    - 接口：默认是 `public`，且不允许使用其他修饰符

### 多线程中的异常处理

1. 捕获异常：在多线程代码中使用 `try-catch` 块捕获异常，确保异常不会跨越线程边界，即每个线程独立处理自己的异常

    ```text
    try {
        // 多线程代码
    } catch (Exception e) {
        // 异常处理
    }
    ```

2. 日志记录：使用合适的日志框架记录异常信息，这有助于更好地理解问题和排查错误

    ```text
    try {
        // 多线程代码
    } catch (Exception e) {
        logger.error("Exception in thread: " + Thread.currentThread().getName(), e);
    }
    ```

3. 线程组：在创建线程时，可以将线程加入一个线程组。线程组可以帮助收集线程的未捕获异常

    ```text
    ThreadGroup threadGroup = new ThreadGroup("MyThreadGroup");
    
    Thread myThread = new Thread(threadGroup, () -> {
        // 多线程代码
    });
    ```

4. 使用线程异常处理器（UncaughtExceptionHandler）：Java 提供了 UncaughtExceptionHandler 接口，可以用来处理那些未被捕获的异常。你可以给所有线程设置统一的异常处理器，也可以给每个线程设置特定的异常处理器

    ```text
    Thread myThread = new Thread(() -> {
        // 多线程代码
    });
    
    myThread.setUncaughtExceptionHandler((thread, throwable) -> {
        // 自定义异常处理逻辑
    });
    ```

5. `Future` 和 `Callable`： 如果你使用 `Future` 和 `Callable` 进行多线程编程，可以通过 `Future` 的 `get` 方法捕获异常

    ```text
    ExecutorService executorService = Executors.newFixedThreadPool(5);
    
    Future<?> future = executorService.submit(() -> {
        // 多线程代码
    });
    
    try {
        future.get(); // 获取结果，此处会抛出异常
    } catch (Exception e) {
        // 处理异常
    }
    ```

## Java 中级

### 支付回调接口多次调用如何处理

```java {5,26,29-32,50}
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {
    
    private final ReentrantLock lock = new ReentrantLock();

    @Resource
    private WxPayConfig wxPayConfig;
    
    @Resource
    private OrderInfoService orderInfoService;
    
    @Resource
    private PaymentInfoService paymentInfoService;
    
    @Override
    public void processOrder(Map<String, Object> mapBody) throws GeneralSecurityException, JsonProcessingException {
        log.info("处理订单");
        //解密报文
        String plainText = decryptFromResource(mapBody);
        //将明文转换成map
        Map<String, Object> plainTextMap = new ObjectMapper().readValue(plainText, HashMap.class);
        String orderNo = (String) plainTextMap.get("out_trade_no");
        //在对业务数据进行状态检查和处理之前，要采用数据锁进行并发控制，以避免函数重入造成的数据混乱
        //ReentrantLock在获取锁时成功获取返回true，如果获取不到会立即返回false，而Synchronized没有获取到锁后会一直等待。如果是分布式项目则需要用分布式锁
        if (lock.tryLock()) {
            try {
                // 处理重复的通知，接口调用的幂等性：无论接口被调用多少次，产生的结果是一致的
                OrderInfo checkOrder = orderInfoService.getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
                if (checkOrder != null && OrderStatus.SUCCESS.getType().equals(checkOrder.getOrderStatus())) {
                    return;
                }
                log.info("更新订单状态");
                OrderInfo orderInfo = new OrderInfo();
                orderInfo.setOrderStatus(OrderStatus.SUCCESS.getType());
                orderInfoService.update(orderInfo, new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
                log.info("记录支付日志");
                PaymentInfo paymentInfo = new PaymentInfo();
                paymentInfo.setOrderNo(orderNo); //商户订单号
                paymentInfo.setPaymentType(PayType.WXPAY.getType()); //支付类型
                paymentInfo.setTransactionId((String) plainTextMap.get("transaction_id")); //微信支付订单号
                paymentInfo.setTradeType((String) plainTextMap.get("trade_type")); //交易类型
                paymentInfo.setTradeState((String) plainTextMap.get("trade_state")); //交易状态
                Map<String, Object> amount = (Map) plainTextMap.get("amount");
                paymentInfo.setPayerTotal((Integer) amount.get("payer_total")); //交易金额
                paymentInfo.setContent(plainText); //通知参数
                paymentInfoService.save(paymentInfo);
            } finally {
                //主动释放锁
                lock.unlock();
            }
        }
    }
}
```

## MySQL

### `varchar(100)` 能存储多少个中文

对于 MySQL 5.0 以下的版本，`varchar(100)` 是以字节为单位的。如果使用 UTF-8 编码，每个中文字符通常占用 3 个字节，所以 `varchar(100)` 大约可以存储 33 个中文字符。但是，这可能会根据您的具体编码设置而变化。例如，如果您使用的是 GBK 编码，那么每个中文字符可能只占用 2 个字节。在这种情况下，`varchar(100)` 可以存储 50 个中文字符

对于 MySQL 5.0 及以上的版本，`varchar(n)` 表示 n 个字符，无论是汉字还是英文，MySQL 都能存入 n 个字符。这是因为在这些版本中，`varchar` 的长度是以字符为单位的，而不是字节。所以，如果你使用的是 UTF-8 编码，`varchar(100)` 可以存储 100 个中文字符

### `varchar` 的最大长度是多少

在 MySQL 中，一行数据的最大长度是 65535 个字节。这个长度是所有列共享的，也就是说，所有列的长度加起来不能超过 65535 个字节。因此，虽然理论上 `varchar` 类型的最大长度可以达到 65535 个字节，但实际上，由于需要考虑到其他列的长度，以及每个列的元数据（如是否为空，长度等）所占用的空间，所以每个 `varchar` 字段的长度不可能达到 65535 个字节

### 索引

#### 主键索引

- 定义主键

    - 主键是一个唯一标识表中每一行的列或列的组合。在 MySQL 中，可以在表的创建时或之后使用 `ALTER TABLE` 语句添加主键

    ```sql
    CREATE TABLE example (
        id INT PRIMARY KEY,
        name VARCHAR(50)
    );
    ```

    上面的例子中，`id` 列被定义为主键

- 主键索引的特点

    - 主键索引是一种唯一性索引，确保表中的每个主键值都是唯一的

    - 主键索引默认为聚簇索引，这意味着数据行的物理存储顺序与主键的逻辑顺序一致

- 性能优势

    - 快速查找：由于主键是唯一的，通过主键索引可以快速准确定位一行数据

    - 聚簇索引：主键索引的聚簇特性意味着相邻的主键值在物理上也是相邻存储的，从而提高了范围查询和范围扫描的性能

- 主键的选择

    - 主键通常选择具有唯一性且不会频繁变更的列，例如自增长的整数列

    - 可以使用多列作为主键，这称为复合主键

- 注意事项

    - 主键列不允许有 NULL 值

    - 主键索引对于频繁地插入和更新操作可能会影响性能，因为插入和更新时需要维护索引结构

## 网络编程

### HTTP 和 HTTPS 的区别

HTTP（超文本传输协议）和HTTPS（安全超文本传输协议）是用于在网络上传输数据的两种不同协议。以下是它们的主要区别：

- 安全性

    - HTTP：是一种不安全的协议，数据在传输过程中是未加密的。这意味着敏感信息可能被中间人攻击截取或窃听

    - HTTPS：通过使用 TLS/SSL 协议对数据进行加密，提供了更高的安全性。这使得数据在传输过程中变得更难被窃听或篡改

- 端口

    - HTTP：默认使用端口 80

    - HTTPS：默认使用端口 443

- 证书

    - HTTP：不需要使用证书

    - HTTPS：需要在服务器端配置 SSL 证书，用于验证服务器的身份。这通常是由可信任的第三方证书颁发机构（CA）签发的

- 搜索引擎排名

    - HTTP：在搜索引擎排名中可能会受到一定的影响，因为搜索引擎更倾向于显示安全的网站

    - HTTPS：被认为更安全，有助于提高搜索引擎排名


