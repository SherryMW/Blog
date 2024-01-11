---
category: IT
article: false
---

# ReentrantLock

`ReentrantLock` 是 Java 并发包中提供的一种可重入锁，它允许线程在获取锁的同时多次进入同步代码块。下面是关于 `ReentrantLock` 的基本使用方法

## 基本用法

1. 创建锁对象

    在类的成员变量中声明一个 `ReentrantLock` 对象，通常将其声明为 `private` 和 `final`
    
    将 `ReentrantLock` 声明为 `private` 表示该锁的访问权限仅限于当前类，外部类无法直接访问。这是一种封装的做法，可以避免外部直接修改锁的状态，提高代码的可维护性
    
    将 `ReentrantLock` 声明为 `final` 表示该锁的引用不可被修改，即不可重新赋值。这有助于确保在多线程环境下，不会意外地修改锁的引用，从而导致混乱或错误的行为
    
    ```text
    private final ReentrantLock lock = new ReentrantLock();
    ```

2. 获取锁

    使用 `lock()` 方法获取锁，这是一个阻塞方法，如果锁已经被其他线程持有，当前线程将阻塞等待    
    
    ```text
    lock.lock();
    try {
        // 执行需要加锁保护的代码块
    } finally {
        lock.unlock(); // 在 finally 中确保释放锁，以防止发生异常时锁无法释放
    }
    ```

3. 尝试获取锁

    使用 `tryLock()` 方法尝试获取锁，如果锁已经被其他线程持有，当前线程不会阻塞，而是立即返回 `false`
    
    ```text
    if (lock.tryLock()) {
        try {
            // 执行需要加锁保护的代码块
        } finally {
            lock.unlock();
        }
    } else {
        // 获取锁失败的处理逻辑
    }
    ```

4. 可重入性

    `ReentrantLock` 是可重入的，同一线程可以多次获得同一把锁，每次获得都需要对应的释放
    
    ```text
    public void methodA() {
        lock.lock();
        try {
            // 执行需要加锁保护的代码块
            methodB(); // 在同一线程中调用其他方法也可以获得同一把锁
        } finally {
            lock.unlock();
        }
    }
    
    public void methodB() {
        lock.lock();
        try {
            // 执行需要加锁保护的代码块
        } finally {
            lock.unlock();
        }
    }
    ```

5. 条件变量

    `ReentrantLock` 还支持通过 `Condition` 来创建条件变量，以实现线程之间更灵活的通信
    
    ```text
    Condition condition = lock.newCondition();
    
    lock.lock();
    try {
        while (conditionNotMet) {
            condition.await(); // 线程等待条件满足
        }
        // 执行需要加锁保护的代码块
    } finally {
        lock.unlock();
    }
    
    // 在其他地方满足条件时，通知等待的线程
    lock.lock();
    try {
        condition.signal(); // 通知一个等待的线程
        // 或者使用 condition.signalAll() 通知所有等待的线程
    } finally {
        lock.unlock();
    }
    ```

## 示例

支付回调接口中的处理订单逻辑：

```java {5,26,50}
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