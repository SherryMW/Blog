---
category: IT
tag: Java
order: 3
article: false
---

# 支付对接

## APIv3 认证机制

微信支付 APIv3 只接受已经开通微信支付账号的商户请求，并使用数字签名对接口的调用方进行认证。数字签名是通过数学算法或者某种方式运算得到的电子签章，可以确定请求的完整性和真实性。微信支付使用SHA-256 with RSA作为数字签名的算法。同样的，微信支付 APIv3 也会对应答进行签名，商户可以通过签名确定应答是来自微信支付

**商户API证书：** 是指由商户申请的，用来证实商户身份的。证书中包含商户号、证书序列号、证书有效期、公钥等信息，证书由证书授权机构(Certificate Authority ，简称CA)签发，以防证书被伪造或篡改。商户需下载证书工具生成证书请求串，并将证书请求串提交到商户平台后才能获得商户API证书文件。如何获取请见 [商户API证书](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay3_1.shtml#part-0)

**商户API私钥：** 商户申请商户API证书时，会生成商户私钥，并保存在本地证书文件夹的文件 apiclient_key.pem 中。私钥也可以通过工具从商户的 p12 证书中导出。请妥善保管好你的商户私钥文件。注：不要把私钥文件暴露在公共场合，如上传到Github，写在客户端代码等

**平台证书：** 平台证书是指由微信支付负责申请的，包含微信支付平台标识、公钥信息的证书。有效期默认5年。商户可以使用平台证书中的公钥进行应答签名的验证。微信支付平台证书请调用 [获取平台证书接口](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/wechatpay5_1.shtml)

**声明所使用的证书：** 某些情况下，将需要更新密钥对和证书。为了保证更换过程中不影响API的使用，请求和应答的HTTP头部中包括证书序列号 ，以声明签名或者加密所用的密钥对和证书
- 商户签名使用**商户私钥**，证书序列号包含在请求HTTP头部的  Authorization的serial_no
- 微信支付签名使用**微信支付平台私钥**，证书序列号包含在应答HTTP头部的 Wechatpay-Serial
- 商户上送敏感信息时使用**微信支付平台公钥**加密，证书序列号包含在请求HTTP头部的 Wechatpay-Serial

**证书序列号：** 每个证书都有一个由CA颁发的唯一编号，即证书序列号。如果读取到的序列号是10进制整形需要转换为大写的16进制 [证书相关](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay7_0.shtml)

**APIv3 密钥：** 微信支付在处理回调通知以及平台证书下载接口中，为防止报文被他人恶意篡改，服务器会对关键信息进行了 AES-256-GCM 加密。 APIv3 密钥就是加密时使用的对称密钥，商户收到报文后，要解密出明文，解密过程中用的key就是 APIv3 密钥。（注意：APIv3密钥属于敏感信息，请妥善保管不要泄露，如果怀疑信息泄露，请重设密钥。）

API 密钥对应V2版本的API

APIv3 密钥对应V3版本的API

## 前期准备

### 引入支付参数

支付参数包含：

**APPID：** 公众号/小程序/移动应用的APPID

**商户号：** 商户平台 -> 账户中心 -> 个人信息 -> 登录账号

**商户API证书序号：** 商户平台 -> 账户中心 -> API安全 -> 管理证书 -> API证书管理 -> 证书序列号

**商户私钥文件：** 证书文件夹里的 apiclient_key.pem

**APIv3 密钥：** 商户平台 -> 账户中心 -> API安全

创建支付参数属性文件 wxpay.properties

```properties
# APPID
wxpay.appid=wx74862e0dfcf69954
# 商户号
wxpay.merchant-id=1558950191
# 商户API证书序列号
wxpay.merchant-serial-number=34345964330B66427E0D3D28826C4993C77E631F
# 商户私钥文件
wxpay.merchant-private-key=apiclient_key.pem
# APIv3密钥
wxpay.api-v3-key=UDuLFDcmy5Eb6o0nTNZdu6ek4DDh4K8B

# 微信服务器地址
wxpay.domain=https://api.mch.weixin.qq.com
# 接收结果通知地址
# 注意：每次重新启动ngrok，都需要根据实际情况修改这个配置
wxpay.notify-domain=https://500c-219-143-130-12.ngrok.io
```

创建读取属性配置文件的配置类

```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取本地属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取属性配置文件的 wxpay 节点
@Data
@Slf4j
public class WxPayConfig {

    //商户号
    private String merchantId;

    //商户API证书序列号
    private String merchantSerialNumber;

    //商户私钥文件
    private String merchantPrivateKey;

    //APIv3密钥
    private String apiV3Key;

    //APPID
    private String appid;

    //微信服务器地址
    private String domain;

    //接收结果通知地址
    private String notifyDomain;

}
```
IDEA 提示未配置 Spring Boot 配置注解处理器的处理方法：[查看详情](https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/html/appendix-configuration-metadata.html#configuration-metadata-annotation-processor-setup)

IDEA 把 wxpay.properties 配置成 Spring Boot 配置文件：打开项目结构界面（Ctrl+Alt+Shift+S）-> 模块 -> Srping -> Configuration Files -> 自定义 Spring Boot 配置 -> 点击 ＋ 号添加自定义配置文件 -> 添加 wxpay.properties -> 应用

### 加载商户私钥

配置商户API证书序号以及加载商户私钥的目的：商户用私钥对请求信息进行签名后向微信平台发送请求，微信支付平台会根据商户证书序列号找到对应的证书，从证书中解密出商户公钥，用公钥对商户的请求进行验签

![](https://img.sherry4869.com/blog/it/java/intermediate/pay/weixin/payment-docking/img.png)

使用官方提供的 [SDK&工具](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay6_0.shtml) 帮助我们完成开发

引入微信支付SDK

```xml
<dependency>
    <groupId>com.github.wechatpay-apiv3</groupId>
    <artifactId>wechatpay-apache-httpclient</artifactId>
    <version>0.3.0</version>
</dependency>
```

[wechatpay-apache-httpclient](https://github.com/wechatpay-apiv3/wechatpay-apache-httpclient) 实现了请求签名的生成和应答签名的验证

创建获取商户私钥文件

```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取本地属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取属性配置文件的 wxpay 节点
@Data
@Slf4j
public class WxPayConfig {
    /**
     * 获取商户的私钥文件
     */
    private PrivateKey getPrivateKey(String filename) {
        try {
            return PemUtil.loadPrivateKey(new FileInputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException("商户私钥文件不存在", e);
        }
    }
}
```

### 获取验签器和HttpClient对象

微信支付平台用私钥对传输信息进行签名后向商户发送请求，商户使用微信支付平台的公钥进行验签。
公钥为了防止被冒用，是不能在直接在网上分发的，而是通过数字证书的形式进行分发。
因此公钥是从微信支付平台的数字证书中获取的，商户需要获取微信支付平台的数字证书并创建签名验证器进行验签

获取签名验证器和微信支付HTTP请求对象

wechatpay-apache-httpclient版本 = 0.3.0
```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取本地属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取属性配置文件的 wxpay 节点
@Data
@Slf4j
public class WxPayConfig {
    
    @Bean
    public ScheduledUpdateCertificatesVerifier getVerifier() {
        log.info("获取签名验证器");
        //获取商户私钥
        PrivateKey privateKey = getPrivateKey(privateKeyPath);
        //私钥签名对象
        PrivateKeySigner privateKeySigner = new PrivateKeySigner(merchantSerialNumber, privateKey);
        //身份认证对象
        WechatPay2Credentials wechatPay2Credentials = new WechatPay2Credentials(merchantId, privateKeySigner);
        // 使用定时下载和更新商户对应的微信支付平台证书的签名验证器，不需要传入证书
        ScheduledUpdateCertificatesVerifier verifier = new ScheduledUpdateCertificatesVerifier(wechatPay2Credentials, apiV3Key.getBytes(StandardCharsets.UTF_8));
        return verifier;
    }

    @Bean(name = "wxPayClient")
    public CloseableHttpClient getWxPayClient(ScheduledUpdateCertificatesVerifier verifier) {
        log.info("获取微信支付HTTP远程请求对象");
        //获取商户私钥
        PrivateKey privateKey = getPrivateKey(privateKeyPath);
        WechatPayHttpClientBuilder builder = WechatPayHttpClientBuilder.create().withMerchant(merchantId, merchantSerialNumber, privateKey).withValidator(new WechatPay2Validator(verifier));
        //... 接下来，你仍然可以通过builder设置各种参数，来配置你的HttpClient
        //通过WechatPayHttpClientBuilder构造的HttpClient，会自动的处理签名和验签，并进行证书自动更新
        CloseableHttpClient httpClient = builder.build();
        return httpClient;
    }
}
```

wechatpay-apache-httpclient版本 >= 0.4.0
```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取本地属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取属性配置文件的 wxpay 节点
@Data
@Slf4j
public class WxPayConfig {
    
    @Bean
    public Verifier getVerifier() throws Exception {
        log.info("获取签名验证器");
        //获取证书管理器实例
        CertificatesManager certificatesManager = CertificatesManager.getInstance();
        //商户私钥
        PrivateKey privateKey = getPrivateKey(merchantPrivateKey);
        //私钥签名对象
        PrivateKeySigner privateKeySigner = new PrivateKeySigner(merchantSerialNumber, privateKey);
        //身份认证对象
        WechatPay2Credentials wechatPay2Credentials = new WechatPay2Credentials(merchantId, privateKeySigner);
        //对称加密的密钥
        byte[] bytes = apiV3Key.getBytes(StandardCharsets.UTF_8);
        //向证书管理器增加需要自动更新平台证书的商户信息
        certificatesManager.putMerchant(merchantId, wechatPay2Credentials, bytes);
        //... 若有多个商户号，可继续调用putMerchant添加商户信息
        //从证书管理器中得到的验签器替代默认的验签器。它会定时下载和更新商户对应的微信支付平台证书
        Verifier verifier = certificatesManager.getVerifier(merchantId);
        return verifier;
    }

    @Bean(name = "wxPayClient")
    public CloseableHttpClient getWxPayClient(Verifier verifier) {
        log.info("获取微信支付HTTP远程请求对象");
        WechatPayHttpClientBuilder builder = WechatPayHttpClientBuilder.create().withMerchant(merchantId, merchantSerialNumber, getPrivateKey(merchantPrivateKey)).withValidator(new WechatPay2Validator(verifier));
        //... 接下来，你仍然可以通过builder设置各种参数，来配置你的HttpClient
        //通过WechatPayHttpClientBuilder构造的HttpClient，会自动的处理商户的签名和验签，并进行证书自动更新
        CloseableHttpClient httpClient = builder.build();
        return httpClient;
    }
}
```

### 内网穿透

微信支付平台向我们的开发服务器发送请求的时候，我们开发服务器必须有一个微信可以访问的外网地址

对于内网来说，其不是不能主动访问公网端口，而是不能反过来有效的被公网访问。内网穿透的主要思路就是利用这一点，让在内网的节点主动访问一个拥有公网IP地址的服务器，并由中间服务器搭桥，打通经过该服务器从其他主机到 NAT 之后节点的隧道

端口映射是 NAT 的一种，它将外网主机的 IP 地址的一个端口映射到内网中一台机器，提供相应的服务。当用户访问该 IP 的这个端口时，服务器自动将请求映射到对应局域网内部的机器上

内网穿透工具：

[Ngrok](https://ngrok.com/)

需要挂梯子

可以使用GitHub账号关联登录，免费版每次重启服务后内网穿透映射地址都会发生改变

[花生壳](https://hsk.oray.com/)
- 关注服务号绑定手机号码注册，设置登录密码
- 为了响应《互联网域名管理办法》，通过6元支付凭证对体验版用户进行HTTPS网站认证，以配合公安部门对涉黄、涉非、私服等违法行为的打击
- 实名认证（上传身份证正反面 + 人脸识别）
- 配置内网穿透映射 [花生壳域名诊断不同情况的处理办法](https://service.oray.com/question/5901.html) 若按照官方文档方法排查问题未得到解决试试关闭防火墙，或者电话联系在线客服
- 创建应用后内网穿透映射地址不会改变

## Native支付

![支付业务流程时序图](https://img.sherry4869.com/blog/it/java/intermediate/pay/weixin/payment-docking/img_1.png)

### Native下单

商户调用Native支付下单接口，微信支付系统后台返回二维码链接参数`code_url`，商户后台系统将`code_url`参数生成二维码图片，用户使用微信客户端扫码后发起支付，`code_url`有效期为2小时，过期后扫码不能再发起支付

[Native支付开发指引](https://pay.weixin.qq.com/wiki/doc/apiv3/open/pay/chapter2_7_2.shtml)

[Native下单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_1.shtml)

商户后台下单接口，响应二维码链接和订单号码给商户前台

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private WxPayConfig wxPayConfig;

    @Resource
    private CloseableHttpClient wxPayClient;
    
    @Override
    public Map<String, Object> nativePay(Long productId) throws Exception {
        log.info("Native生成订单");
        //TODO: 创建订单按生产业务逻辑来写
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setTitle("支付测试");
        orderInfo.setOrderNo(OrderNoUtils.getOrderNo()); //订单号
        orderInfo.setProductId(productId);
        orderInfo.setTotalFee(100); //单位：分
        orderInfo.setOrderStatus("未支付");
        
        log.info("调用统一下单API");
        HttpPost httpPost = new HttpPost("https://api.mch.weixin.qq.com/v3/pay/transactions/native");
        // 请求body参数
        Map<String, Object> paramsMap = new HashMap();
        paramsMap.put("appid", wxPayConfig.getAppid()); //应用ID
        paramsMap.put("mchid", wxPayConfig.getMerchantId()); //直连商户号
        paramsMap.put("description", orderInfo.getTitle()); //商品描述
        paramsMap.put("out_trade_no", orderInfo.getOrderNo()); //商户订单号
        paramsMap.put("notify_url", "https://500c-219-143-130-12.ngrok.io/api/wx-pay/native/notify"); //通知地址
        Map<String, Object> amountMap = new HashMap();
        amountMap.put("total", orderInfo.getTotalFee()); //总金额
        amountMap.put("currency", "CNY"); //货币类型
        paramsMap.put("amount", amountMap); //订单金额信息
        ObjectMapper mapper = new ObjectMapper();
        String jsonParams = mapper.writeValueAsString(paramsMap);
        log.info("请求参数：" + jsonParams);
        //将请求体参数设置到请求对象中
        StringEntity entity = new StringEntity(jsonParams, "utf-8");
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        //完成商户私钥计算签名和微信平台公钥验证签名步骤
        CloseableHttpResponse response = wxPayClient.execute(httpPost);
        try {
            String bodyString = EntityUtils.toString(response.getEntity()); //响应体
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("处理成功，返回结果：" + bodyString);
            } else if (statusCode == 204) {
                log.info("处理成功，无返回Body");
            } else {
                log.info("Native下单失败，响应码：" + statusCode + " 返回结果：" + bodyString);
                throw new IOException("request failed");
            }
            Map<String, String> bodyMap = new ObjectMapper().readValue(bodyString, HashMap.class);
            String codeUrl = bodyMap.get("code_url"); //二维码
            //结果集
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("codeUrl", codeUrl);
            resultMap.put("orderNo", orderInfo.getOrderNo());
            return resultMap;
        } finally {
            response.close();
        }
    }
}
```

请求参数：
```json
{"amount":{"total":100,"currency":"CNY"},"mchid":"1558950191","out_trade_no":"ORDER_20230121223445094","appid":"wx74862e0dfcf69954","description":"支付测试","notify_url":"https://500c-219-143-130-12.ngrok.io/api/wx-pay/native/notify"}
```

处理成功，返回结果：
```json
{"code_url":"weixin://wxpay/bizpayurl?pr=bD1hINuzz"}
```

商户前台把微信支付系统后台响应的二维码链接生成二维码图片

前端工程需要引入 `vue-qriously` 依赖
```json
{
  "dependencies": {
    "vue-qriously": "^1.1.1"
  }
}
```

```vue
<el-dialog>
  <qriously :size="300" :value="codeUrl" />
</el-dialog>

```

::: details 签名流程

设置日志级别：
```yaml
logging:
  level:
    root: debug
```

[签名生成](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml)

**构造签名串：**

HTTP请求方法  
URL  
请求时间戳  
请求随机串  
请求报文主体

```text
引用：com.wechat.pay.contrib.apache.httpclient.auth.WechatPay2Credentials#getToken

c.w.p.c.a.h.auth.WechatPay2Credentials   : authorization message=
[POST
/v3/pay/transactions/native
1674370321
7mMDN9hfOsopc64nhGGOQO7bUBdqUIHp
{"amount":{"total":100,"currency":"CNY"},"mchid":"1558950191","out_trade_no":"ORDER_20230121223445094","appid":"wx74862e0dfcf69954","description":"支付测试","notify_url":"https://500c-219-143-130-12.ngrok.io/api/wx-pay/native/notify"}
]
```

**计算签名值：**

使用商户私钥对待签名串进行 SHA256 with RSA 签名，并对签名结果进行 Base64 编码得到签名值

引用：com.wechat.pay.contrib.apache.httpclient.auth.PrivateKeySigner#sign

**设置HTTP头：**

微信支付商户 APIv3 要求请求通过 HTTP Authorization 头来传递签名。 Authorization 由认证类型和签名信息两个部分组成

Authorization: 认证类型 签名信息

认证类型：目前为 WECHATPAY2-SHA256-RSA2048

签名信息：

- 发起请求的商户（包括直连商户、服务商或渠道商）的商户号 mchid
- 商户API证书序列号 serial_no，用于声明所使用的证书
- 请求随机串 nonce_str
- 时间戳 timestamp
- 签名值 signature

签名信息：
```text
c.w.p.c.a.h.auth.WechatPay2Credentials   : authorization token=
[mchid="1558950191",
nonce_str="7mMDN9hfOsopc64nhGGOQO7bUBdqUIHp",
timestamp="1674370321",
serial_no="34345964330B66427E0D3D28826C4993C77E631F",
signature="itrixyIigckUQsnELsyIYljgtx0Fu4updMqoQx7s9u5huw7cN7Mm6T9QBPQ156UYWRqxGgFoJ7NTm6JDncTgqGi3boysBQnkP3UoOIYBiw+UQU1t28nvpbCG+zXRhjFXn8q4g5bNE7c6c3UOuKK+dTCNBXiGcF6C32XkYkWCkl+kXpWTV3y6JKGfx2mD0RvDg0Pgz67VZzQRDdbY2T6Iqr2WWSFl2GKsNvTjIq5+kidmXflteC2PuUb85W44TGdNXYrmuzCGytVPtH6RqjbwzfQ+KMEydzLTR3MjDGUVKwwXISi2JnJyX53Aimubt+QdsMfFu77t+YcVgN5AeyWzHg=="
]
```

构建HTTP请求头：
```text
http-outgoing-2 >> Authorization: WECHATPAY2-SHA256-RSA2048 mchid="1558950191",nonce_str="7mMDN9hfOsopc64nhGGOQO7bUBdqUIHp",timestamp="1674370321",serial_no="34345964330B66427E0D3D28826C4993C77E631F",signature="itrixyIigckUQsnELsyIYljgtx0Fu4updMqoQx7s9u5huw7cN7Mm6T9QBPQ156UYWRqxGgFoJ7NTm6JDncTgqGi3boysBQnkP3UoOIYBiw+UQU1t28nvpbCG+zXRhjFXn8q4g5bNE7c6c3UOuKK+dTCNBXiGcF6C32XkYkWCkl+kXpWTV3y6JKGfx2mD0RvDg0Pgz67VZzQRDdbY2T6Iqr2WWSFl2GKsNvTjIq5+kidmXflteC2PuUb85W44TGdNXYrmuzCGytVPtH6RqjbwzfQ+KMEydzLTR3MjDGUVKwwXISi2JnJyX53Aimubt+QdsMfFu77t+YcVgN5AeyWzHg=="
```

引用：com.wechat.pay.contrib.apache.httpclient.SignatureExec#executeWithSignature

把请求发送给微信支付服务器 Host: api.mch.weixin.qq.com

处理成功，返回结果：
```json
{"code_url":"weixin://wxpay/bizpayurl?pr=bD1hINuzz"}
```

:::

::: details 验证应答签名流程

[获取平台证书列表](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/wechatpay5_1.shtml)

增加需要自动更新平台证书的商户信息

引用：com.wechat.pay.contrib.apache.httpclient.cert.CertificatesManager#putMerchant

下载和更新平台证书

引用：com.wechat.pay.contrib.apache.httpclient.cert.CertificatesManager#downloadAndUpdateCert

获取商户号为merchantId的验签器

引用：com.wechat.pay.contrib.apache.httpclient.cert.CertificatesManager#getVerifier

[验证签名](https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_1.shtml)

引用：com.wechat.pay.contrib.apache.httpclient.auth.WechatPay2Validator#validate

**构造验签名串**

引用：com.wechat.pay.contrib.apache.httpclient.auth.WechatPay2Validator#buildMessage

首先，商户先从应答中获取以下信息

- HTTP头 Wechatpay-Timestamp 中的应答时间戳
- HTTP头 Wechatpay-Nonce 中的应答随机串
- 应答主体（response Body），需要按照接口返回的顺序进行验签，错误的顺序将导致验签失败

Wechatpay-Timestamp: 1674370324  
Wechatpay-Nonce: a235ecdebc96cd27e09df011a958751e  
response Body：{"code_url":"weixin://wxpay/bizpayurl?pr=PlRzPDvzz"}

**获取应答签名**

String signature = response.getFirstHeader(WECHAT_PAY_SIGNATURE).getValue();

微信支付的应答签名通过HTTP头 Wechatpay-Signature 传递
```text
org.apache.http.headers: http-outgoing-2 << Wechatpay-Signature: OxSz8rXwYO8pLWKnxlMMa0Busnsk5LGeMjilCevKWQ1Kw6D1hyriCj+buw8g6Lf+l3iI7deNu1i3b3zGO2gZ/Alb29BdTb08rz2xFPCo5tncnSvOiPf/SdcGjVbOw7qrzTQq97dKo7jjML5pd9zj7opm2QPdMDNN8jVXVz27x35SgT4tUSTlszfrUqMhD8pslT7kp+D1j2HGIMUjlgOQr4hhYYhE5UV8qdPcjoR8rqO861dZ7iy01DVqMA1NvamsN1uTkIdrXKPD6T0bspCXGHGjeu3/xsIfJtJ6X8jiuUjVNP/T05BhM5UgakrlT8EaU289mm/NW181N5nD22d3RQ==
```

**验证签名**

引用：com.wechat.pay.contrib.apache.httpclient.auth.CertificatesVerifier#verify(java.security.cert.X509Certificate, byte[], java.lang.String)

sun.security.rsa.RSASignature#engineVerify

```text
protected boolean engineVerify(byte[] var1) throws SignatureException {
    if (this.publicKey == null) {
        throw new SignatureException("Missing public key");
    } else if (var1.length != RSACore.getByteLength(this.publicKey)) {
        throw new SignatureException("Signature length not correct: got " + var1.length + " but was expecting " + RSACore.getByteLength(this.publicKey));
    } else {
        byte[] var2 = this.getDigestValue(); //对构造验签名串做摘要计算，得到摘要字符串
        try {
            byte[] var3 = RSACore.rsa(var1, this.publicKey); //使用公钥对应答签名做RSA解密运算
            byte[] var4 = this.padding.unpad(var3);
            byte[] var5 = decodeSignature(this.digestOID, var4); //var5是var3解密后得到的摘要字符串
            return MessageDigest.isEqual(var2, var5); //比对var2和var5两个摘要字符串是否一致
        } catch (BadPaddingException var6) {
            return false;
        } catch (IOException var7) {
            throw new SignatureException("Signature encoding error", var7);
        }
    }
}
```
:::

### 支付通知

微信支付通过支付通知接口将用户支付成功消息通知给商户

[支付通知API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_5.shtml)

支付通知的完整请求参数示例
```json
{
  "id": "c0bb3e59-a165-5927-89bc-c0d1709cb415",
  "create_time": "2023-01-25T22:52:52+08:00",
  "resource_type": "encrypt-resource",
  "event_type": "TRANSACTION.SUCCESS",
  "summary": "支付成功",
  "resource": {
    "original_type": "transaction",
    "algorithm": "AEAD_AES_256_GCM",
    "ciphertext": "vUaKvc/4ccUB433YsSE5/aOg5A4peokfFHjnYE6dygOqA0wCDXEegLay78c3oE55HPwlx1qX50ofxgDpxoc0gW7M5TCuPFjNqFoU9Ty6LfxaGGLN+ox88Ng3cJhiqjkHT6n1VM8nK7NLl4NgfNGXFQhyP1M+mTbU4ou3V9c2Y2VEHGwg83fqxYQU+f6PKadnw0CbPghqjzqf3vj3Cpu2VFJ+YBMTLBFDNKzOyt09C7KXgO1+bsPIWJ6yeIwQo/PUZ9g7M2Ikc+E/5Qm35x9XBvMXKGPz72bx0rkvTbdmhyS5UXFZwYku7KINAiRHq+//OEry3d8gmD7XKwSP+nvtML3Gu7T/xpIZkp7tGF8H/KKKFN1OKvgObCUaGKg5vWpq7vJCsk0eCYO7eQ2C5WVCNUSaicmJpk2M0rv0oFTYy6h6G66+4za2A2nRT3GPIxPR/12JRR3aYy4d17QD5Z376jd+1ydTMhZF0Gds/aN36CKK6vcCL7TWNxnp07vJpmMFgjRSGG0hbd8buRFEOlRGgTC23nyAhrwySq1JsFbrm6n4Bm3TiA7D0FaT31zDW5+XWLDF+WE0hg==",
    "associated_data": "transaction",
    "nonce": "H3aExJLzSvvf"
  }
}
```

支付通知接口

wechatpay-apache-httpclient版本 = 0.3.0
```java
@CrossOrigin
@RestController
@RequestMapping("/api/wx-pay")
@Api(tags = "微信支付API")
@AllArgsConstructor
@Slf4j
public class WxPayController {

    private final WxPayService wxPayService;

    private WxPayConfig wxPayConfig;
    
    @PostMapping("/native/notify")
    public String nativeNotify(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            //处理通知参数
            String jsonBody = HttpUtils.readData(request);
            log.info("支付通知的完整请求参数 ===> jsonBody{}", jsonBody);
            Map<String, Object> mapBody = new ObjectMapper().readValue(jsonBody, HashMap.class);
            String id = (String) mapBody.get("id");
            log.info("支付通知id===>{}", id);
            //验签
            boolean validate = new WechatPay2ValidatorForRequest(wxPayConfig.getVerifier(), id, jsonBody).validate(request);
            if (!validate) {
                log.info("支付通知验签失败");
                response.setStatus(500);
                resultMap.put("code", "ERROR");
                resultMap.put("message", "通知验签失败");
                return new ObjectMapper().writeValueAsString(resultMap);
            }
            log.info("支付通知验签成功");
            //处理订单
            wxPayService.processOrder(mapBody);
            response.setStatus(200);
            resultMap.put("code", "SUCCESS");
            resultMap.put("message", "成功");
            return new ObjectMapper().writeValueAsString(resultMap);
        } catch (Exception e) {
            response.setStatus(500);
            resultMap.put("code", "ERROR");
            resultMap.put("message", "失败:" + e.getLocalizedMessage());
            return new ObjectMapper().writeValueAsString(resultMap);
        }
    }
}
```

支付通知验签，参考 com.wechat.pay.contrib.apache.httpclient.auth.WechatPay2Validator
```java
public class WechatPay2ValidatorForRequest {

    protected static final Logger log = LoggerFactory.getLogger(WechatPay2ValidatorForRequest.class);
    protected static final long RESPONSE_EXPIRED_MINUTES = 5; //应答超时时间，单位为分钟
    protected final Verifier verifier;
    protected final String requestId;
    protected final String body;

    public WechatPay2ValidatorForRequest(Verifier verifier, String requestId, String body) {
        this.verifier = verifier;
        this.requestId = requestId;
        this.body = body;
    }

    protected static IllegalArgumentException parameterError(String message, Object... args) {
        message = String.format(message, args);
        return new IllegalArgumentException("parameter error: " + message);
    }

    protected static IllegalArgumentException verifyFail(String message, Object... args) {
        message = String.format(message, args);
        return new IllegalArgumentException("signature verify fail: " + message);
    }

    public final boolean validate(HttpServletRequest request) throws IOException {
        try {
            validateParameters(request); //处理请求参数
            String message = buildMessage(request); //构造验签名串
            String serial = request.getHeader(WECHAT_PAY_SERIAL); //从请求头当中获取平台证书序列号
            String signature = request.getHeader(WECHAT_PAY_SIGNATURE); //从请求头当中获取签名
            //验签
            if (!verifier.verify(serial, message.getBytes(StandardCharsets.UTF_8), signature)) {
                throw verifyFail("serial=[%s] message=[%s] sign=[%s], request-id=[%s]", serial, message, signature, requestId);
            }
        } catch (IllegalArgumentException e) {
            log.warn(e.getMessage());
            return false;
        }
        return true;
    }

    protected final void validateParameters(HttpServletRequest request) {
        //注意: 请确保 HEADER_WECHAT_PAY_TIMESTAMP 是在最后一位
        String[] headers = {WECHAT_PAY_SERIAL, WECHAT_PAY_SIGNATURE, WECHAT_PAY_NONCE, WECHAT_PAY_TIMESTAMP};
        String header = null;
        for (String headerName : headers) {
            header = request.getHeader(headerName);
            if (header == null) {
                throw parameterError("empty [%s], request-id=[%s]", headerName, requestId);
            }
        }
        //遍历都通过后拿到headers最后一个时间戳值，判断请求是否过期
        String timestampStr = header;
        try {
            Instant responseTime = Instant.ofEpochSecond(Long.parseLong(timestampStr));
            //拒绝过期请求
            if (Duration.between(responseTime, Instant.now()).abs().toMinutes() >= RESPONSE_EXPIRED_MINUTES) {
                throw parameterError("timestamp=[%s] expires, request-id=[%s]", timestampStr, requestId);
            }
        } catch (DateTimeException | NumberFormatException e) {
            throw parameterError("invalid timestamp=[%s], request-id=[%s]", timestampStr, requestId);
        }
    }

    protected final String buildMessage(HttpServletRequest request) throws IOException {
        String timestamp = request.getHeader(WECHAT_PAY_TIMESTAMP);
        String nonce = request.getHeader(WECHAT_PAY_NONCE);
        return timestamp + "\n"
                + nonce + "\n"
                + body + "\n";
    }

}
```

处理订单
```java
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
                //处理重复的通知
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

处理订单时解密支付通知对称的加密密文
```java
public class WxPayServiceImpl implements WxPayService {
    
    private String decryptFromResource(Map<String, Object> mapBody) throws GeneralSecurityException {
        log.info("支付通知密文解密");
        //通知数据
        Map<String, String> resourceMap = (Map) mapBody.get("resource");
        //数据密文
        String ciphertext = resourceMap.get("ciphertext");
        //随机字符串
        String nonce = resourceMap.get("nonce");
        //附加数据
        String associatedData = resourceMap.get("associated_data");
        log.info("支付通知密文 ===> {}", ciphertext);
        AesUtil aesUtil = new AesUtil(wxPayConfig.getApiV3Key().getBytes());
        String plainText = aesUtil.decryptToString(associatedData.getBytes(StandardCharsets.UTF_8), nonce.getBytes(StandardCharsets.UTF_8), ciphertext);
        log.info("支付通知密文解密 ===> {}", plainText);
        return plainText;
    }
}
```

```text
密文===>R0Ykoa0OpC2A11FZm6aXIhFAsDJneZBrQKESNDzwVMWJacLps99G99NDUKy9zx7vjYj3YYArurkGfRcD5htBapeisvFP+411zUDCeHrmi8gtRWbMrxVlbUqiBT0M1pUXacDM2aerrE1CsQuv4mBNFYZTPxYAgyeBNli11Um6+HXeeruWlr6FQp+6yby2HJHFX2BQ0M97YQhqED9E5f9I/h8V5r73XID1SpXO33pbwNvU3L20QtfRlV11htEUBEnkIdgOtgMH67HwWaUU9FdSBlRm6jC04iCF7qii7qFakVEfA4GLiACo/4yIX2Xbgx2/2HVM0IS0bXd1H8zNm1USpoGso7x0FusAGvZAjlAM9oSnHccrHIUKlqgL3g9SAwx/aTJfD6DCJXXfhzzBv2Pa0bfGBkwDHT+UtJ5a+I/JR3tuYI4ZuwhSuYNGLql1g6mHS/HM1vNmfYa6RfWKFIgvrIvD/GGXbc7miLyua//8b43hK5IDNUUPR3ftVLaBvrEGcGi3bMJwCP49Pa4SRhmoxwEt5kg6g5bm/XJQ9oKtSxnhSRQLV4ZYB5SSjvB6mNpFFBX6tlduqA==
```

```text
密文解密明文===>{"mchid":"1558950191","appid":"wx74862e0dfcf69954","out_trade_no":"ORDER_20230126161914001","transaction_id":"4200001758202301264137151155","trade_type":"NATIVE","trade_state":"SUCCESS","trade_state_desc":"支付成功","bank_type":"OTHERS","attach":"","success_time":"2023-01-26T16:19:28+08:00","payer":{"openid":"oHwsHuJJFwy_b-pPzs9xf5J1uRWg"},"amount":{"total":1,"payer_total":1,"currency":"CNY","payer_currency":"CNY"}}
```

wechatpay-apache-httpclient版本 >= 0.4.2
```java
@CrossOrigin
@RestController
@RequestMapping("/api/wx-pay")
@Api(tags = "微信支付API")
@AllArgsConstructor
@Slf4j
public class WxPayController {

    private final WxPayService wxPayService;

    private WxPayConfig wxPayConfig;
    
    @PostMapping("/native/notify")
    public String nativeNotify(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            //处理通知参数
            String jsonBody = HttpUtils.readData(request);
            log.info("支付通知的完整请求参数 ===> jsonBody {}", jsonBody);
            Map<String, Object> mapBody = new ObjectMapper().readValue(jsonBody, HashMap.class);
            String id = (String) mapBody.get("id");
            log.info("支付通知id ===> {}", id);
            //构建request，传入必要参数
            NotificationRequest notificationRequest = new NotificationRequest.Builder().withSerialNumber(request.getHeader(WECHAT_PAY_SERIAL))
                    .withNonce(request.getHeader(WECHAT_PAY_NONCE))
                    .withTimestamp(request.getHeader(WECHAT_PAY_TIMESTAMP))
                    .withSignature(request.getHeader(WECHAT_PAY_SIGNATURE))
                    .withBody(jsonBody)
                    .build();
            NotificationHandler notificationHandler = new NotificationHandler(wxPayConfig.getVerifier(), wxPayConfig.getApiV3Key().getBytes(StandardCharsets.UTF_8));
            //验签和解析请求体
            Notification notification = notificationHandler.parse(notificationRequest);
            log.info("支付回调通知结果：" + notification);
            if (notification != null) {
                log.info("支付回调通知验签成功");
            } else {
                log.info("支付回调通知验签失败");
                response.setStatus(500);
                resultMap.put("code", "ERROR");
                resultMap.put("message", "通知验签失败");
                return new ObjectMapper().writeValueAsString(resultMap);
            }
            //处理订单
            wxPayService.processOrder(mapBody);
            response.setStatus(200);
            resultMap.put("code", "SUCCESS");
            resultMap.put("message", "成功");
            return new ObjectMapper().writeValueAsString(resultMap);
        } catch (Exception e) {
            log.error("支付回调通知异常：" + e.getLocalizedMessage());
            response.setStatus(500);
            resultMap.put("code", "ERROR");
            resultMap.put("message", "失败:" + e.getLocalizedMessage());
            return new ObjectMapper().writeValueAsString(resultMap);
        }
    }
}
```

```text
支付回调通知通知结果：Notification{id='de067acc-5412-5861-8b78-037211dfa07a', createTime='2023-02-06T17:46:41+08:00', eventType='TRANSACTION.SUCCESS', resourceType='encrypt-resource', decryptData='{"mchid":"1558950191","appid":"wx74862e0dfcf69954","out_trade_no":"ORDER_20230206174620020","transaction_id":"4200001725202302062534773006","trade_type":"NATIVE","trade_state":"SUCCESS","trade_state_desc":"支付成功","bank_type":"CMB_DEBIT","attach":"","success_time":"2023-02-06T17:46:41+08:00","payer":{"openid":"oHwsHuJJFwy_b-pPzs9xf5J1uRWg"},"amount":{"total":1,"payer_total":1,"currency":"CNY","payer_currency":"CNY"}}', summary='支付成功', resource=Resource{algorithm='AEAD_AES_256_GCM', ciphertext='ETpJu3OW0JlZryCVGsk/5WHaTOG8WrRexERMuE3oVwtmSHizdeCSs+kYqBElseUg0r4Jhp83ueA5LP7rYn+5RKLrxzdPafjLKCDHSS+l2XP7aUWHziI63xeSqV5ECrNVTzGHSZS3LA8Dpli7xp2xrqd6U9PUG8Wxt9Jz0TRarH6l4d+xR43HAluX48K/RsUzeSxVDf8qYyKdMO8yfGuKS4NcSv761RZKc0YMc7zolbmoflDAPphHS3MsO/XGDwVeDq1hLPG11MS0ClHq8UZvwGPHuUS5E5+zEnC7NgEOpzYCeg71PqgYqfwpg+42SC5ktgDgqhrpfu0CSX8lNTBBz0ywZwtWIVpMg4OVeSvqZWlCwFcGRJ3ZdbzqhLhxYdkscommDr0O2ISlafuddViG+Wf0VOh6NJtpC/vET/WAcjrLAIvGYtJOhEzmw+DwnnxyzQU3AJqdtSh0X782CmFt7Gz2RPOHv1/Gq/If7FavklLzjHSbnm8ik4V6skv+UU9yNXJvsO3wpprK/LBMbbWUVIMOC51fxlBTgyNT4ouzzPYfJHRoybUvjB88yyox4WajTzOrwEeApUHjOA==', associatedData='transaction', nonce='ZuaQ2PRaOZvZ', originalType='transaction'}}
```

### 查询订单

[查询订单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_2.shtml)

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {
    
    @Override
    public String queryOrder(String orderNo) throws IOException {
        log.info("查单接口调用 ===> {}", orderNo);
        HttpGet httpGet = new HttpGet("https://api.mch.weixin.qq.com".concat(String.format("/v3/pay/transactions/out-trade-no/%s", orderNo)).concat("?mchid=").concat(wxPayConfig.getMerchantId()));
        httpGet.setHeader("Accept", "application/json");
        //完成签名并执行请求
        CloseableHttpResponse response = wxPayClient.execute(httpGet);
        try {
            String bodyString = EntityUtils.toString(response.getEntity()); //响应体
            return bodyString;
        } finally {
            response.close();
        }
    }
}
```

### 关闭订单

[关闭订单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_3.shtml)

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private WxPayConfig wxPayConfig;
    
    @Resource
    private CloseableHttpClient wxPayClient;

    @Resource
    private OrderInfoService orderInfoService;

    @Override
    public void cancelOrder(String orderNo) throws IOException {
        //调用微信支付的关单接口
        closeOrder(orderNo);
        //更新商户端的订单状态
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setOrderStatus(OrderStatus.CANCEL.getType());
        orderInfoService.update(orderInfo, new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
    }
    
    private void closeOrder(String orderNo) throws IOException {
        log.info("调用关单接口，订单号 ===> {}", orderNo);
        //创建远程请求对象
        String url = "https://api.mch.weixin.qq.com".concat(String.format("/v3/pay/transactions/out-trade-no/%s/close", orderNo));
        HttpPost httpPost = new HttpPost(url);
        //组装json请求体
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("mchid", wxPayConfig.getMerchantId());
        String jsonParams = new ObjectMapper().writeValueAsString(paramsMap);
        log.info("调用关单接口，请求参数 ===> {}", jsonParams);
        //将请求体参数设置到请求对象中
        StringEntity entity = new StringEntity(jsonParams, "utf-8");
        entity.setContentType("application/json");
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        //完成签名并执行请求
        CloseableHttpResponse response = wxPayClient.execute(httpPost);
        try {
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("调用关单接口处理成功200");
            } else if (statusCode == 204) {
                log.info("调用关单接口处理成功，无返回Body204");
            } else {
                log.info("调用关单接口处理失败，响应码 = " + statusCode);
                throw new RuntimeException("调用关单接口处理失败，响应码 = " + statusCode);
            }
        } finally {
            response.close();
        }
    }
}
```

### 申请退款

[申请退款API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_9.shtml)

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private CloseableHttpClient wxPayClient;
    
    @Resource
    private OrderInfoService orderInfoService;
    
    @Resource
    private RefundInfoService refundInfoService;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void refund(String orderNo, String reason) throws IOException {
        log.info("创建退款单记录");
        //根据订单号创建退款单
        RefundInfo refundInfo = refundInfoService.createRefundByOrderNo(orderNo, reason);
        log.info("调用退款API");
        HttpPost httpPost = new HttpPost("https://api.mch.weixin.qq.com/v3/refund/domestic/refunds");
        //请求body参数
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("out_trade_no", orderNo); //订单编号
        paramsMap.put("out_refund_no", refundInfo.getRefundNo()); //退款单编号
        paramsMap.put("reason", reason); //退款原因
        paramsMap.put("notify_url", "https://500c-219-143-130-12.ngrok.io/api/wx-pay/refunds/notify"); //回调通知地址
        Map<String, Object> amountMap = new HashMap<>();
        amountMap.put("refund", refundInfo.getRefund()); //退款金额(分)
        amountMap.put("total", refundInfo.getTotalFee()); //原订单金额
        amountMap.put("currency", "CNY"); //退款币种
        paramsMap.put("amount", amountMap);

        //将参数转换成json字符串
        String jsonParams = new ObjectMapper().writeValueAsString(paramsMap);
        log.info("请求参数===>{}", jsonParams);
        //将请求体参数设置到请求对象中
        StringEntity entity = new StringEntity(jsonParams, "utf-8");
        entity.setContentType("application/json"); //设置请求报文格式
        httpPost.setEntity(entity); //将请求报文放入请求对象
        httpPost.setHeader("Accept", "application/json"); //设置响应报文格式
        //完成签名并执行请求
        CloseableHttpResponse response = wxPayClient.execute(httpPost);
        try {
            String bodyString = EntityUtils.toString(response.getEntity()); //响应体
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("处理成功，退款返回结果：" + bodyString);
            } else if (statusCode == 204) {
                log.info("处理成功，无返回Body");
            } else {
                log.info("退款异常，响应码 = " + statusCode + ",退款返回结果 = " + bodyString);
                throw new RuntimeException("退款异常，响应码 = " + statusCode + ",退款返回结果 = " + bodyString);
            }
            //更新订单状态
            OrderInfo orderInfo = new OrderInfo();
            orderInfo.setOrderStatus(OrderStatus.REFUND_PROCESSING.getType()); //退款中
            orderInfoService.update(orderInfo, new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
            //更新退款单
            refundInfoService.updateRefund(bodyString);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            response.close();
        }
    }
}
```

### 查询单笔退款

[查询单笔退款API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_10.shtml)

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private WxPayConfig wxPayConfig;

    @Resource
    private CloseableHttpClient wxPayClient;
    
    @Override
    public String queryRefund(String refundNo) throws IOException {
        log.info("调用查询退款接口，退款单号 ===> {}", refundNo);
        //创建远程请求对象
        String url = "https://api.mch.weixin.qq.com".concat(String.format("/v3/refund/domestic/refunds/%s", refundNo));
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader("Accept", "application/json"); //设置响应报文格式
        //完成签名并执行请求
        CloseableHttpResponse response = wxPayClient.execute(httpGet);
        try {
            String bodyAsString = EntityUtils.toString(response.getEntity()); //响应体
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("调用查询退款接口成功，查询退款返回结果 = ", bodyAsString);
            } else if (statusCode == 204) {
                log.info("调用查询退款接口成功，无返回Body204");
            } else {
                log.info("查询退款异常，响应码 = " + statusCode + ",查询退款返回结果 = " + bodyAsString);
                throw new RuntimeException("查询退款异常，响应码 = " + statusCode + ",查询退款返回结果 = " + bodyAsString);
            }
            return bodyAsString;
        } finally {
            response.close();
        }
    }
}
```

### 退款结果通知

[退款结果通知API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_11.shtml)

```java
@CrossOrigin
@RestController
@RequestMapping("/api/wx-pay")
@Api(tags = "微信支付API")
@AllArgsConstructor
@Slf4j
public class WxPayController {

    private final WxPayService wxPayService;
    
    private WxPayConfig wxPayConfig;
    
    @PostMapping("/refunds/notify")
    public String refundsNotify(HttpServletRequest request, HttpServletResponse response) throws Exception {
        log.info("退款通知执行");
        Map<String, Object> resultMap = new HashMap<>();
        try {
            //处理通知参数
            String jsonBody = HttpUtils.readData(request);
            log.info("退款结果通知的完整请求参数 ===> jsonBody{}", jsonBody);
            Map<String, Object> mapBody = new ObjectMapper().readValue(jsonBody, HashMap.class);
            String id = (String) mapBody.get("id");
            log.info("退款结果通知id ===> {}", id);
            //构建request，传入必要参数
            NotificationRequest notificationRequest = new NotificationRequest.Builder().withSerialNumber(request.getHeader(WECHAT_PAY_SERIAL))
                    .withNonce(request.getHeader(WECHAT_PAY_NONCE))
                    .withTimestamp(request.getHeader(WECHAT_PAY_TIMESTAMP))
                    .withSignature(request.getHeader(WECHAT_PAY_SIGNATURE))
                    .withBody(jsonBody)
                    .build();
            NotificationHandler notificationHandler = new NotificationHandler(wxPayConfig.getVerifier(), wxPayConfig.getApiV3Key().getBytes(StandardCharsets.UTF_8));
            //验签和解析请求体
            Notification notification = notificationHandler.parse(notificationRequest);
            log.info("退款结果通知：" + notification);
            if (notification != null) {
                log.info("退款结果通知验签成功");
            } else {
                log.info("退款结果通知验签失败");
                response.setStatus(500);
                resultMap.put("code", "ERROR");
                resultMap.put("message", "退款结果通知验签失败");
                return new ObjectMapper().writeValueAsString(resultMap);
            }
            //验签 wechatpay-apache-httpclient = 0.3.0
//            boolean validate = new WechatPay2ValidatorForRequest(wxPayConfig.getVerifier(), id, jsonBody).validate(request);
//            if (!validate) {
//                log.info("退款结果通知验签失败");
//                response.setStatus(500);
//                resultMap.put("code", "ERROR");
//                resultMap.put("message", "退款结果通知验签失败");
//                return new ObjectMapper().writeValueAsString(resultMap);
//            }
//            log.info("退款结果通知验签成功");
            //处理退款单
            wxPayService.processRefund(mapBody);
            response.setStatus(200);
            resultMap.put("code", "SUCCESS");
            resultMap.put("message", "成功");
            return new ObjectMapper().writeValueAsString(resultMap);
        } catch (Exception e) {
            response.setStatus(500);
            resultMap.put("code", "ERROR");
            resultMap.put("message", "失败:" + e.getLocalizedMessage());
            return new ObjectMapper().writeValueAsString(resultMap);
        }
    }
}
```

处理退款单
```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private RefundInfoService refundInfoService;
    
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void processRefund(Map<String, Object> mapBody) throws GeneralSecurityException, JsonProcessingException {
        log.info("创建退款单");
        //解密报文
        String plainText = decryptFromResource(mapBody);
        //将明文转换成map
        Map<String, String> plainTextMap = new ObjectMapper().readValue(plainText, HashMap.class);
        String orderNo = plainTextMap.get("out_trade_no");
        if (lock.tryLock()) {
            try {
                //处理重复的通知
                OrderInfo checkOrder = orderInfoService.getOne(new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
                if (!OrderStatus.REFUND_PROCESSING.getType().equals(checkOrder.getOrderStatus())) {
                    return;
                }
                log.info("更新退款订单状态");
                OrderInfo orderInfo = new OrderInfo();
                orderInfo.setOrderStatus(OrderStatus.REFUND_SUCCESS.getType());
                orderInfoService.update(orderInfo, new LambdaQueryWrapper<OrderInfo>().eq(OrderInfo::getOrderNo, orderNo));
                log.info("记录退款日志");
                refundInfoService.updateRefund(plainText);
            } finally {
                //主动释放锁
                lock.unlock();
            }
        }
    }
}
```

### 申请交易账单/申请资金账单

[申请交易账单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_6.shtml)

[申请资金账单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_7.shtml)

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {
    
    @Resource
    private WxPayConfig wxPayConfig;
    
    @Resource
    private CloseableHttpClient wxPayClient;
    
    @Override
    public String queryBill(String billDate, String type) throws Exception {
        log.info("调用申请账单接口，账单日期{}，账单类型{}", billDate, type);
        String url = "";
        if ("tradebill".equals(type)) {
            url = WxApiType.TRADE_BILLS.getType(); //申请交易账单
        } else if ("fundflowbill".equals(type)) {
            url = WxApiType.FUND_FLOW_BILLS.getType(); //申请资金账单
        } else {
            throw new RuntimeException("不支持的账单类型");
        }
        url = wxPayConfig.getDomain().concat(url).concat("?bill_date=").concat(billDate);
        //创建远程请求对象
        HttpGet httpGet = new HttpGet(url);
        httpGet.setHeader("Accept", "application/json"); //设置响应报文格式
        //使用wxPayClient发送请求得到响应
        CloseableHttpResponse response = wxPayClient.execute(httpGet);
        //获取账单下载地址
        try {
            String bodyString = EntityUtils.toString(response.getEntity()); //响应体
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("调用申请账单接口处理成功200，申请账单返回结果 = " + bodyString);
            } else if (statusCode == 204) {
                log.info("调用申请账单接口处理成功，无返回Body204");
            } else {
                log.info("调用申请账单接口处理失败，响应码 = " + statusCode);
                throw new RuntimeException("调用申请账单接口处理失败，响应码 = " + statusCode);
            }
            Map<String, String> resultMap = new ObjectMapper().readValue(bodyString, HashMap.class);
            return resultMap.get("download_url");
        } finally {
            response.close();
        }
    }
}
```

### 下载账单

[下载账单API](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_4_8.shtml)

```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取wxpay节点
@Data
@Slf4j
public class WxPayConfig {
    
    @Bean(name = "wxPayNoSignClient")
    public CloseableHttpClient getWxPayNoSignClient() {
        //设置响应对象无需签名 (response) -> true
        WechatPayHttpClientBuilder builder = WechatPayHttpClientBuilder.create().withMerchant(merchantId, merchantSerialNumber, getPrivateKey(merchantPrivateKey)).withValidator((response) -> true);
        CloseableHttpClient httpClient = builder.build();
        return httpClient;
    }
}
```

```java
@Service
@Slf4j
public class WxPayServiceImpl implements WxPayService {

    @Resource
    private WxPayConfig wxPayConfig;

    @Resource
    private CloseableHttpClient wxPayNoSignClient;

    @Override
    public String downloadBill(String billDate, String type) throws Exception {
        log.info("调用下载账单接口，账单日期{}，账单类型{}", billDate, type);
        //获取账单url地址
        String downloadUrl = this.queryBill(billDate, type);
        //创建远程请求对象
        HttpGet httpGet = new HttpGet(downloadUrl);
        httpGet.setHeader("Accept", "application/json"); //设置响应报文格式
        //使用wxPayClient发送请求得到响应
        CloseableHttpResponse response = wxPayNoSignClient.execute(httpGet);
        try {
            String bodyString = EntityUtils.toString(response.getEntity()); //响应体
            int statusCode = response.getStatusLine().getStatusCode(); //响应码
            if (statusCode == 200) {
                log.info("调用下载账单接口处理成功200，申请账单返回结果 = " + bodyString);
            } else if (statusCode == 204) {
                log.info("调用下载账单接口处理成功，无返回Body204");
            } else {
                log.info("调用下载账单接口处理失败，响应码 = " + statusCode);
                throw new RuntimeException("调用下载账单接口处理失败，响应码 = " + statusCode);
            }
            return bodyString;
        } finally {
            response.close();
        }
    }
}
```