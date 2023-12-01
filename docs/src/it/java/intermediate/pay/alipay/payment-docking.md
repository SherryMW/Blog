---
category: IT
tag: Java
order: 2
article: false
---

# 支付对接

## 名词解释

应用私钥：用来给应用消息进行签名，请务必要妥善保管，避免遗失或泄露

应用公钥：需要提供给支付宝开放平台，平台会对应用发送的消息进行签名验证

支付宝公钥：应用收到支付宝发送的同步、异步消息时，使用支付宝公钥验证签名信息

CSR 文件：CSR 即证书签名请求（Certificate Signing Request），CSR 文件（.csr）是申请证书时所需要的一个数据文件

应用公钥证书：在开放平台上传 CSR 文件后可以获取 CA 机构颁发的应用证书文件（.crt），其中包含了组织/公司名称、应用公钥、证书有效期等内容，一般有效期为 5 年

支付宝公钥证书：用来验证支付宝消息，包含了支付宝公钥、支付宝公司名称、证书有效期等内容，一般有效期为 5 年

支付宝根证书：用来验证支付宝消息，包含了根 CA 名称、根 CA 的公钥、证书有效期等内容

## 电脑网站支付

[接入准备](https://opendocs.alipay.com/open/270/01didh)

### 引入支付参数

创建支付参数属性文件 alipay-sandbox.properties 建议使用自己支付宝账号的沙箱参数

```properties
# 应用ID,你的APPID，收款账号既是你的APPID对应支付宝账号
alipay.app-id=2021000119635499

# 商户PID,卖家支付宝账号ID
alipay.seller-id=2088621957993562

# 支付宝网关
alipay.gateway-url=https://openapi.alipaydev.com/gateway.do

# 商户私钥，你的 PKCS8格式RSA2私钥
alipay.merchant-private-key=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCJPnt6TMZ1A06SMeNxQT0WhGbRd74JBCcdqQt4POzBMJ1NE6U/OiG2xZEnUqYWC2ukkOgZZEvTuWDI9q2aEFN7E2Fcj39JCwRmE0an153JIOkb9L2nngTsAAN7cwLZZ6/dAPnrZjtN0f/HRVBXPSNLBdpoS/pbKRurM2NccZkbTZtluCdt4IvBBjjcV3DJOCYP9yrLTP3HYDxep3HrZCvXuR2Iseb+c6qc4IF/2UKQTz+iavxCy3zJTYbDzD0cL7yC4HmSD7vbNGZvkzZB1RNWt0NILj2LdFG10T7zZahN461FiYozRfD7LDPXqq+uuZMM5i0jpXVrs2MDk6HeS0lJAgMBAAECggEAF87wCrpQ3zGwqqne4+HGYCad046rN9MxmfKeW8Bt7eGqGBnlW7+Q460ITkMHLuHSTZ0ZtnXwtYz+Hj60xPo6ESq+hBkcoqY3oCGN60X7SE3eQoxFblN6VRp3gC3me6KCHpuxv0Vf2lMoxP/gPRINElG0ns03ZCMQerWSchH+1n5xUX/SrsgYDLaHfCxSpGsI/iyjTHXl+KqZeiFoRY+0tlJCTsc6P8JBYEeI5l8Iza/CjxDgFT41B4RksMw9ZEUCwxMiQhqIOThdTxtpA+MpUjoizhngq1xAXMcEz3QlnV7V2icyWjDAAz7bMCISUBa2MLkNWb392/yROKCBcXKYZQKBgQDY5T8QbC3GiUw0IQrVwm1A46zBzMDuQV+a4/2q63f8BBRZcbOluzxuCSfsTIVFKF1eJqpD75+76rB2z39P5xSS2/9SuO9FofV5iUDZuC93mOvR5nwh0rkgizhes81p+i7S9VcQcLTM/gK8ta3VXC3Pv/9bIGlTyFPLS0iMLUJlywKBgQCh/PIjoBFqKWpB6wSTn8hotvvE0WU1XMhm09WnlrMN2O+TuL71PoVS5vhCBgCJW5e3OOOS1K8uYLWaAQY9g/PvzYWLKF7CkCZNTvdds67QMreU9Cfm3jOwUkOibXarJEwY0l52k4xihQ6o8QGvG6XmNw3oq3RX/t/Y0DC84lMKuwKBgQCBQnYIAoBxToe0lXCQnfNgdY8SXEUqeJlShMc7YmM6NPAvsfxfK6vC4///6kaORZUHNEHKhPcMFbyeweBcrRlswGF0WjR2qiPSD4MvfX4EZ4U6rYKS4bNkerPYdI1ZuDjJjl8ZtCF7/XGCJz/25J2Eryauly1OOhf+Etqkd6CXawKBgDlmf4seMm2TBWMcW3/QM9zfUnHY3Ws+WIkPcXs0THiQsbx/z7Lpl6bbz4bdx5zkxusXDpU+JmFhxZgv2r07n9oO0s6P3JxHJjtoywD6Je0Cu8jdh7IodNp7HBpXfaCBeTGmgfC0sh9LFPnKhRU+z9e3FIepEc4Is9uJUmvsKw73AoGAM44/Oz7axzcVEIaD/7jyy1GiaYCmI55qqjocXfbK9QlWDiLnGfbx2UB6BC1y7WD6a9bMpatLXppTDEL+qHX0jUp0u06LQnJi9SAUBcff4LioSJxBrYx6ovYjAEmpoyiW/AAQBJ1oyp1UvpX0avfMa0Hdo1e+YnFEZluCr184uns=

# 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥
alipay.alipay-public-key=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvKoCpGtG31iY2Llj3t8MKRpaVCntnalWmXbKcHCiaYcUUjzcMPH3/tOr5ORK5W1NjuLu9uRrsXqROBmQYN+0y4nea+fU989i2IxtOGR/h2Kvhyyk/lPjNkmgz7K8VqbGGeVzTadPSK49FcrDVEshJ6C92vEKq6TmUfhKgCLiLZ288fHBDRvzUnoj8O/LBXiDroq1zX+DXYCHcQeFljkF5ivyxDZBkWl23hYTtnFClvN5lVLK4d294wyprF7IMv3XhQOfJS+Pr527CsfwT0JE44lyidCvslvn9DSdHdIfTIzHDsIEiDzB/OvRCbwpEA7UGnWQxQf7AusX2TTRQHWW7wIDAQAB

# 接口内容加密秘钥，对称秘钥
alipay.content-key=D8entyfafkkFwtMbUqj3Mw==

# 页面跳转同步通知页面路径
alipay.return-url=http://localhost:8080/#/success

# 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
# 注意：每次重新启动ngrok，都需要根据实际情况修改这个配置
alipay.notify-url=https://a863-180-174-204-169.ngrok.io/api/ali-pay/trade/notify
```

### 引入服务端 SDK

[开发工具包（SDK）下载](https://opendocs.alipay.com/open/02nk0x)

#### 引入依赖

```xml
<dependency>
    <groupId>com.alipay.sdk</groupId>
    <artifactId>alipay-sdk-java</artifactId>
    <version>4.35.45.ALL</version>
</dependency>
```

#### 创建客户端连接对象

公钥方式是指开发者将APPID、应用私钥（private key）、支付宝公钥（alipay public key）配置在代码中对请求内容进行签名，并对支付宝返回的内容进行验签的方法

开放平台 SDK 封装了签名实现，只需在创建 `DefaultAlipayClient` 对象时，设置请求网关（gateway）、应用id（app_id）、应用私钥（private_key）、编码格式（charset）、支付宝公钥（alipay_public_key）、签名类型（sign_type）即可，报文请求时会自动进行签名

```java
@Configuration
@PropertySource("classpath:alipay-sandbox.properties")
public class AlipayClientConfig {

    @Resource
    private Environment config;

    @Bean
    public AlipayClient alipayClient() throws AlipayApiException {
        AlipayConfig alipayConfig = new AlipayConfig();
        //设置网关地址
        alipayConfig.setServerUrl(config.getProperty("alipay.gateway-url"));
        //设置应用APPID
        alipayConfig.setAppId(config.getProperty("alipay.app-id"));
        //设置应用私钥
        alipayConfig.setPrivateKey(config.getProperty("alipay.merchant-private-key"));
        //设置请求格式，固定值json
        alipayConfig.setFormat(AlipayConstants.FORMAT_JSON);
        //设置字符集
        alipayConfig.setCharset(AlipayConstants.CHARSET_UTF8);
        //设置支付宝公钥
        alipayConfig.setAlipayPublicKey(config.getProperty("alipay.alipay-public-key"));
        //设置签名类型
        alipayConfig.setSignType(AlipayConstants.SIGN_TYPE_RSA2);
        //构造client
        AlipayClient alipayClient = new DefaultAlipayClient(alipayConfig);
        return alipayClient;
    }
}
```

[电脑网站支付快速接入](https://opendocs.alipay.com/open/270/105899)

![支付流程时序图](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img.png)

### 统一收单下单并支付页面接口

[API 文档](https://opendocs.alipay.com/open/028r8t?scene=22)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;

    @ApiOperation("统一收单下单并支付页面接口")
    @PostMapping("/trade/page/pay/{productId}")
    public R tradePagePay(@PathVariable Long productId) {
        log.info("统一收单下单并支付界面接口调用");
        //支付宝开放平台接收 request 请求对象后会为开发者生成一个 html 形式的 form 表单，包含自动提交的脚本
        String formStr = aliPayService.tradeCreate(productId);
        //将 form 表单字符串返回给前端程序，前端会调用自动提交脚本，进行表单提交
        //表单会自动提交到 action 属性所指向的支付宝开放平台地址，从而为用户展示一个支付界面
        return R.success().data("formStr", formStr);
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private AlipayClient alipayClient;

    @Resource
    private Environment config;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public String tradeCreate(Long productId) {
        try {
            //创建商户订单
            OrderInfo orderInfo = orderInfoService.createOrderByProductId(productId, PayType.ALIPAY.getType());
            //组装当前业务方法的请求参数
            AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();
            request.setNotifyUrl(config.getProperty("alipay.notify-url")); //支付宝服务器主动通知商户服务器里指定的页面http/https路径
            request.setReturnUrl(config.getProperty("alipay.return-url")); //HTTP/HTTPS开头字符串

            /**
             JSONObject bizContent = new JSONObject();
             bizContent.put("out_trade_no", orderInfo.getOrderNo());
             BigDecimal total = new BigDecimal(orderInfo.getTotalFee().toString()).divide(new BigDecimal("100"));
             bizContent.put("total_amount", total);
             bizContent.put("subject", orderInfo.getTitle());
             bizContent.put("product_code", "FAST_INSTANT_TRADE_PAY");
             //bizContent.put("time_expire", "2022-08-01 22:00:00"); //订单绝对超时时间 格式为yyyy-MM-dd HH:mm:ss。超时时间范围：1m~15d
             */

            AlipayTradePagePayModel model = new AlipayTradePagePayModel();
            model.setOutTradeNo(orderInfo.getOrderNo()); //商户订单号。由商家自定义，64个字符以内，仅支持字母、数字、下划线且需保证在商户端不重复
            BigDecimal total = new BigDecimal(orderInfo.getTotalFee().toString()).divide(new BigDecimal("100")); //把元转换为分 1 ===> 0.01
            model.setTotalAmount(total.toString()); //订单总金额，单位为元，精确到小数点后两位，取值范围为 [0.01,100000000]。金额不能为0
            model.setSubject(orderInfo.getTitle()); //订单标题。注意：不可使用特殊字符，如 /，=，& 等
            model.setProductCode("FAST_INSTANT_TRADE_PAY"); //销售产品码，与支付宝签约的产品码名称。注：目前电脑支付场景下仅支持FAST_INSTANT_TRADE_PAY

            //// 商品明细信息，按需传入
            //JSONArray goodsDetail = new JSONArray();
            //JSONObject goods1 = new JSONObject();
            //goods1.put("goods_id", "goodsNo1");
            //goods1.put("goods_name", "子商品1");
            //goods1.put("quantity", 1);
            //goods1.put("price", 0.01);
            //goodsDetail.add(goods1);
            //bizContent.put("goods_detail", goodsDetail);

            //// 扩展信息，按需传入
            //JSONObject extendParams = new JSONObject();
            //extendParams.put("sys_service_provider_id", "2088511833207846");
            //bizContent.put("extend_params", extendParams);

            //request.setBizContent(bizContent);
            request.setBizModel(model);

            //调用支付宝统一收单下单并支付页面接口
            AlipayTradePagePayResponse response = alipayClient.pageExecute(request);
            if (response.isSuccess()) {
                log.info("支付宝创建支付交易记录成功，返回结果 ===> {}", response.getBody());
                return response.getBody();
            } else {
                log.info("支付宝创建支付交易记录失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                throw new RuntimeException("创建支付交易记录失败");
            }
        } catch (AlipayApiException e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            throw new RuntimeException("创建支付交易记录失败");
        }
    }
}
```

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "formStr": "<form name=\"punchout_form\" method=\"post\" action=\"https://openapi.alipaydev.com/gateway.do?charset=UTF-8&method=alipay.trade.page.pay&sign=EUqi0yoPu0mPwKW998QkULztMgAfLJwu7g2IHC2QKvTBpCl8Gy5OFnyQXtaITVbL0GyEgj%2BmPBonx0aj1WrhxEG2d4tAKma9a5%2FJt%2FZ9LosZgTAjKxnanOxeOeXNWrj%2BAi5mj6zwlMtoJkf683VJqn8UCkCjzsvwRM3YCOVM8ae2M9NLkHRdjsXoEW6dl5i9zUpi8OQGZG5rF2LUjc8rjqd7kmpegv7VxU9EtBwES6FwySK6dgwRNv9GAzVYn5wP1ulFlGwowuyouGOIedw460nitelDzBl2eLYTwZbDQRvrGI3t%2BEEf%2FiK9440zNTR1nmN3cl1Zx8K8WDSC2h92ZQ%3D%3D&version=1.0&app_id=2021000122609912&sign_type=RSA2&timestamp=2022-09-20+15%3A54%3A26&alipay_sdk=alipay-sdk-java-4.35.45.ALL&format=json\">\n<input type=\"hidden\" name=\"biz_content\" value=\"{&quot;out_trade_no&quot;:&quot;ORDER_20220920155426518&quot;,&quot;total_amount&quot;:0.01,&quot;subject&quot;:&quot;测试商品&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;}\">\n<input type=\"submit\" value=\"立即支付\" style=\"display:none\" >\n</form>\n<script>document.forms[0].submit();</script>"
  }
}
```

如果跳转的界面出现“支付存在钓鱼风险！防钓鱼网站方法”的警告提示，关闭浏览器所有窗口，重新打开支付页面窗口即可

[电脑网站支付常见问题](https://opendocs.alipay.com/support/01rfvm)

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img_1.png)

有两种支付方法，可以打开沙箱版的支付宝APP使用买家账号登录扫码支付或者使用沙箱买家账密登录支付

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img_2.png)

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img_3.png)

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img_4.png)

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/alipay/payment-docking/img_5.png)

### 支付异步通知回调

[API 文档](https://opendocs.alipay.com/open/270/105902)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;

    private Environment config;

    private OrderInfoService orderInfoService;

    @ApiOperation("支付异步通知回调接口")
    @PostMapping("/trade/notify")
    public String tradeNotify(@RequestParam Map<String, String> paramsMap) {
        log.info("支付异步通知回调接口通知参数 ===> {}", paramsMap);
        String result = "failure";
        //异步通知验签
        try {
            //验签成功后，按照支付结果异步通知中的描述，对支付结果中的业务内容进行二次校验，校验成功后在response中返回success并继续商户自身业务处理，校验失败返回failure
            boolean signVerified = AlipaySignature.rsaCheckV1(paramsMap, config.getProperty("alipay.alipay-public-key"), AlipayConstants.CHARSET_UTF8, AlipayConstants.SIGN_TYPE_RSA2); //调用SDK验证签名
            if (signVerified) {
                //1.商家需要验证该通知数据中的 out_trade_no 是否为商家系统中创建的订单号
                String outTradeNo = paramsMap.get("out_trade_no");
                OrderInfo orderInfo = orderInfoService.getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, outTradeNo));
                if (orderInfo == null) {
                    log.error("支付异步通知回调接口 ===> 订单不存在！");
                    return result;
                }
                //2.判断 total_amount 是否确实为该订单的实际金额（即商家订单创建时的金额）
                String totalAmount = paramsMap.get("total_amount");
                int totalAmountInt = new BigDecimal(totalAmount).multiply(new BigDecimal("100")).intValue(); //把分转换为元，0.01 ===> 1
                int totalFeeInt = orderInfo.getTotalFee().intValue();
                if (totalAmountInt != totalFeeInt) {
                    log.error("支付异步通知回调接口 ===> 金额校验失败！");
                    return result;
                }
                //3.校验通知中的 seller_id（或者 seller_email) 是否为 out_trade_no 这笔单据的对应的操作方（有的时候，一个商家可能有多个 seller_id/seller_email）
                String sellerId = paramsMap.get("seller_id");
                String sellerIdProperty = config.getProperty("alipay.seller-id"); //对应沙箱环境里的商户PID
                if (!sellerId.equals(sellerIdProperty)) {
                    log.error("支付异步通知回调接口 ===> 商家PID校验失败！");
                    return result;
                }
                //4.验证 app_id 是否为该商家本身
                String appId = paramsMap.get("app_id");
                String appIdProperty = config.getProperty("alipay.app-id");
                if (!appId.equals(appIdProperty)) {
                    log.error("支付异步通知回调接口 ===> 商家APPID校验失败！");
                    return result;
                }
                //在支付宝的业务通知中，只有交易通知状态为 TRADE_SUCCESS 或 TRADE_FINISHED 时，支付宝才会认定为买家付款成功
                String tradeStatus = paramsMap.get("trade_status");
                if (!"TRADE_SUCCESS".equals(tradeStatus)) {
                    log.error("支付异步通知回调接口 ===> 支付未成功！");
                    return result;
                }
                //处理订单业务 更新订单状态 记录支付日志
                aliPayService.processOrder(paramsMap);
                log.info("支付异步通知验签成功！");
                result = "success";
            } else {
                //验签失败则记录异常日志，并在response中返回failure.
                log.error("支付异步通知验签失败！");
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
```

```text
支付异步通知回调接口通知参数 ===> {gmt_create=2022-09-20 17:36:31, charset=UTF-8, gmt_payment=2022-09-20 17:36:38, notify_time=2022-09-20 17:36:40, subject=测试商品, sign=rPOmLQlWGXqvP6e8QOHzaB1ksPMqo8eIwiP38JhbZguHkmMi2xS9r8uhP1MnJZyMyVP45nCSi6JL5B55PJgXH5KSOr60ceJUjuhXV7WBI4NrX/isKr8YeZrBRS/Lb5CS7RHR52Hikln09MN9GQSo37DMRNsnpNESrTemh1ygIKwmqbRoz5e/LoIbvahqjamzmKBLZZXmlNWMQip1JKLGQlYmf+N9St4DXY39CnTvvxyr4cgcWeUquf/fa5C0XBXASevnlARHZwOEd0Irmzjz/44VRVyRfsQERGh7hIzvDo9zBTzoIEJLqmR/7BavpG/5ZwVhpiNTu3f7RZxOoRJLmw==, buyer_id=2088722007804358, invoice_amount=0.01, version=1.0, notify_id=2022092000222173639004350529720424, fund_bill_list=[{"amount":"0.01","fundChannel":"ALIPAYACCOUNT"}], notify_type=trade_status_sync, out_trade_no=ORDER_20220920173620464, total_amount=0.01, trade_status=TRADE_SUCCESS, trade_no=2022091022001404350505696830, auth_app_id=2021000122609912, receipt_amount=0.01, point_amount=0.00, app_id=2021000122609912, buyer_pay_amount=0.01, sign_type=RSA2, seller_id=2088621995192019}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {
    
    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private AlipayClient alipayClient;

    @Resource
    private Environment config;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processOrder(Map<String, String> paramsMap) {
        String orderNo = paramsMap.get("out_trade_no");
        //在对业务数据进行状态检查和处理之前，要采用数据锁进行并发控制，以避免函数重入造成的数据混乱
        //ReentrantLock在获取锁时成功获取返回true，如果获取不到会立即返回false，而Synchronized没有获取到锁后会一直等待。如果是分布式项目则需要用分布式锁
        if (lock.tryLock()) {
            try {
                //处理重复通知
                //接口调用的幂等性：无论接口被调用多少次，以下业务只执行一次
                String orderStatus = orderInfoService.getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo)).getOrderStatus();
                if (OrderStatus.NOTPAY.getType().equals(orderStatus)) {
                    //更新订单状态
                    orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.SUCCESS);
                    //记录支付日志
                    paymentInfoService.createPaymentInfoForAliPay(paramsMap);
                }
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                throw new RuntimeException(e);
            } finally {
                //主动释放锁
                lock.unlock();
            }
        }
    }
}
```

### 统一收单交易关闭接口

[API 文档](https://opendocs.alipay.com/open/028wob)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;
    
    @ApiOperation("取消订单接口")
    @PostMapping("/trade/close/{orderNo}")
    public R cancel(@PathVariable String orderNo) {
        aliPayService.cancelOrder(orderNo);
        return R.success().setMessage("订单已取消");
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private AlipayClient alipayClient;

    @Resource
    private OrderInfoService orderInfoService;
    
    @Override
    public void cancelOrder(String orderNo) {
        //调用支付宝统一收单交易关闭接口
        this.closeOrder(orderNo);
        //更新用户订单状态
        orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.CANCEL);
    }

    private void closeOrder(String orderNo) {
        log.info("支付宝统一收单交易关闭接口调用，订单号 ===> {}", orderNo);
        try {
            AlipayTradeCloseRequest request = new AlipayTradeCloseRequest();
            AlipayTradeCloseModel model = new AlipayTradeCloseModel();
            model.setOutTradeNo(orderNo);
            request.setBizModel(model);
            AlipayTradeCloseResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                //取消订单成功的前提是支付宝已经创建了交易记录
                log.info("支付宝统一收单交易关闭接口调用成功，返回结果 ===> {}", response.getBody());
            } else {
                log.info("支付宝统一收单交易关闭接口调用失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException(e);
        }
    }
}
```

取消订单成功的前提是支付宝已经创建了交易记录

```json
{
  "alipay_trade_close_response": {
    "code": "40004",
    "msg": "Business Failed",
    "sub_code": "ACQ.TRADE_NOT_EXIST",
    "sub_msg": "交易不存在"
  }
}
```

### 统一收单交易查询

[API 文档](https://opendocs.alipay.com/open/028woa?scene=common)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;

    @ApiOperation("查询订单，测试订单状态用")
    @GetMapping("/query/{orderNo}")
    public R queryOrder(@PathVariable String orderNo) {
        String result = aliPayService.queryOrder(orderNo);
        return R.success().setMessage("订单查询成功").data("result", result);
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private AlipayClient alipayClient;

    @Override
    public String queryOrder(String orderNo) {
        log.info("支付宝统一收单交易查询调用，订单号 ===> {}", orderNo);
        try {
            AlipayTradeQueryRequest request = new AlipayTradeQueryRequest();
            AlipayTradeQueryModel model = new AlipayTradeQueryModel();
            model.setOutTradeNo(orderNo);
            request.setBizModel(model);
            AlipayTradeQueryResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                //查询订单成功的前提是支付宝已经创建了交易记录
                log.info("支付宝统一收单交易查询调用成功，返回结果 ===> {}", response.getBody());
                return response.getBody();
            } else {
                log.info("支付宝统一收单交易查询调用失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
                return null; //订单不存在
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException(e);
        }
    }
}
```

实际情况是需要执行定时任务来主动调用支付宝统一收单交易查询接口，根据订单不同状态做出相应的处理

```java
@Component
@Slf4j
public class AliPayTask {

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private AliPayService aliPayService;

    /**
     * 从第0秒开始每隔30秒执行1次，查询创建超过5分钟且未支付的订单
     */
    @Scheduled(cron = "0/30 * * * * ?")
    public void orderConfirm() {
        log.info("支付宝 orderConfirm 被执行...");
        List<OrderInfo> orderInfoList = orderInfoService.getNoPayOrderByDuration(5, PayType.ALIPAY.getType());
        for (OrderInfo orderInfo : orderInfoList) {
            log.warn("支付宝 orderConfirm 超时订单 ===> 订单号{}", orderInfo.getOrderNo());
            //调用支付宝统一收单交易查询接口核实订单状态
            aliPayService.checkOrderStatus(orderInfo.getOrderNo());
        }
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private PaymentInfoService paymentInfoService;
    
    /**
     * 根据订单号调用支付宝统一收单交易查询接口，核实订单状态
     * 如果订单未创建，则更新商户端订单状态
     * 如果订单未支付，则调用关单接口关闭订单，并更新商户端订单状态
     * 如果订单已支付，则更新商户端订单状态，并记录支付日志
     */
    @Override
    public void checkOrderStatus(String orderNo) {
        log.info("根据订单号调用支付宝统一收单交易查询接口，核实订单状态 ===> {}", orderNo);
        String result = queryOrder(orderNo);
        if (result == null) {
            log.info("核实订单号未创建 ===> 订单号{}", orderNo);
            //更新订单状态
            orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.CLOSED);
        } else {
            HashMap<String, LinkedHashMap> resultMap = JSON.parseObject(result, LinkedHashMap.class);
            LinkedHashMap alipayTradeQueryResponse = resultMap.get("alipay_trade_query_response");
            String tradeStatus = (String) alipayTradeQueryResponse.get("trade_status"); //订单状态
            if (AliPayTradeState.NOTPAY.getType().equals(tradeStatus)) {
                log.info("核实订单号未支付 ===> 订单号{}", orderNo);
                //调用支付宝统一收单交易关闭接口
                closeOrder(orderNo);
                //更新订单状态
                orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.CLOSED);
            } else if (AliPayTradeState.SUCCESS.getType().equals(tradeStatus)) {
                log.info("核实订单号已支付 ===> 订单号{}", orderNo);
                //更新订单状态
                orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.SUCCESS);
                //记录支付日志
                paymentInfoService.createPaymentInfoForAliPay(alipayTradeQueryResponse);
            }
        }
    }
}
```

### 统一收单交易退款接口

[API 文档](https://opendocs.alipay.com/open/028sm9)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;

    @ApiOperation("申请退款")
    @PostMapping("/trade/refund/{orderNo}/{reason}")
    public R refunds(@PathVariable String orderNo, @PathVariable String reason) {
        aliPayService.refund(orderNo, reason);
        return R.success();
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private AlipayClient alipayClient;

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private RefundInfoService refundInfoService;

    @Override
    public void refund(String orderNo, String reason) {
        log.info("支付宝统一收单交易退款接口调用，订单号 ===> {} 原因 ===> {}", orderNo, reason);
        try {
            //创建退款单
            RefundInfo refundInfo = refundInfoService.createRefundByOrderNo(orderNo, reason);
            //组装当前业务方法的请求参数
            AlipayTradeRefundRequest request = new AlipayTradeRefundRequest();
            AlipayTradeRefundModel model = new AlipayTradeRefundModel();
            model.setOutTradeNo(orderNo); //商户订单号
            BigDecimal amount = new BigDecimal(refundInfo.getRefund().toString()).divide(new BigDecimal("100")); //把元转换为分 1 ===> 0.01
            model.setRefundAmount(amount.toString()); //退款金额，不能大于支付金额
            model.setRefundReason(reason); //退款原因（可选）
            request.setBizModel(model);
            //调用统一收单交易退款接口
            AlipayTradeRefundResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                log.info("支付宝统一收单交易退款接口调用成功，返回结果 ===> {}", response.getBody());
                //更新订单状态
                orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.REFUND_SUCCESS);
                //更新退款单
                refundInfoService.updateRefundForAliPay(refundInfo.getRefundNo(), response.getBody(), AliPayTradeState.REFUND_SUCCESS.getType());
            } else {
                log.info("支付宝统一收单交易退款接口调用失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
                //更新订单状态
                orderInfoService.updateStatusByOrderNo(orderNo, OrderStatus.REFUND_ABNORMAL);
                //更新退款单
                refundInfoService.updateRefundForAliPay(refundInfo.getRefundNo(), response.getBody(), AliPayTradeState.REFUND_ERROR.getType());
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### 统一收单交易退款查询

[API 文档](https://opendocs.alipay.com/open/028sma)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;

    @ApiOperation("查询退款，测试用")
    @GetMapping("/trade/fastpay/refund/{orderNo}")
    public R queryRefund(@PathVariable String orderNo) {
        String result = aliPayService.queryRefund(orderNo);
        return R.success().setMessage("查询成功").data("result", result);
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private AlipayClient alipayClient;

    @Override
    public String queryRefund(String orderNo) {
        log.info("支付宝统一收单交易退款查询接口调用，订单号 ===> {}", orderNo);
        try {
            AlipayTradeFastpayRefundQueryRequest request = new AlipayTradeFastpayRefundQueryRequest();
            AlipayTradeFastpayRefundQueryModel model = new AlipayTradeFastpayRefundQueryModel();
            model.setOutTradeNo(orderNo); //商户订单号（如果退款请求的时候传的是商户订单号，查询的时候就需要传递商户订单号）
            model.setOutRequestNo(orderNo); //如果退款请求传递的参数是退款单编号，查询的时候就需要传递退款单编号
            request.setBizModel(model);
            AlipayTradeFastpayRefundQueryResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                log.info("支付宝统一收单交易退款查询接口调用成功，返回结果 ===> {}", response.getBody());
                return response.getBody();
            } else {
                log.info("支付宝统一收单交易退款查询接口调用失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
                return null; //订单不存在
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException("支付宝统一收单交易退款查询接口调用失败 ===> " + e);
        }
    }
}
```

当订单全额退款后，调用支付宝统一收单交易查询接口时订单状态会显示：TRADE_CLOSED（未付款交易超时关闭，或支付完成后全额退款）

### 查询对账单下载地址

[API 文档](https://opendocs.alipay.com/open/028woc)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/ali-pay")
@Api(tags = "支付宝电脑网站支付")
@AllArgsConstructor
@Slf4j
public class AlipayController {

    private AliPayService aliPayService;
    
    @ApiOperation("获取账单url")
    @GetMapping("/bill/downloadurl/query/{billDate}/{type}")
    public R queryTradeBill(@PathVariable String billDate, @PathVariable String type) {
        String downloadUrl = aliPayService.queryBill(billDate, type);
        return R.success().setMessage("获取账单url成功").data("downloadUrl", downloadUrl);
    }
}
```

```java
@Service
@Slf4j
public class AliPayServiceImpl implements AliPayService {

    @Resource
    private AlipayClient alipayClient;
    
    @Override
    public String queryBill(String billDate, String billType) {
        log.info("支付宝查询对账单下载地址接口调用");
        try {
            AlipayDataDataserviceBillDownloadurlQueryRequest request = new AlipayDataDataserviceBillDownloadurlQueryRequest();
            AlipayDataDataserviceBillDownloadurlQueryModel model = new AlipayDataDataserviceBillDownloadurlQueryModel();
            model.setBillDate(billDate); //账单时间
            model.setBillType(billType); //账单类型
            request.setBizModel(model);
            AlipayDataDataserviceBillDownloadurlQueryResponse response = alipayClient.execute(request);
            if (response.isSuccess()) {
                log.info("支付宝查询对账单下载地址接口调用成功，返回结果 ===> {}", response.getBody());
                return response.getBillDownloadUrl();
            } else {
                log.info("支付宝查询对账单下载地址接口调用失败，返回码 === > {} 返回描述 ===> {}", response.getCode(), response.getMsg());
                throw new RuntimeException("支付宝查询对账单下载地址接口调用失败");
            }
        } catch (AlipayApiException e) {
            throw new RuntimeException(e);
        }
    }
}
```