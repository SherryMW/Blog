---
category: IT
tag: 
  - Java
  - 支付
order: 3
article: false
---

# 支付对接

## 引入支付参数

支付参数包含：  
APPID（公众号/小程序/移动应用的APPID）  
商户号（商户平台后台-账户中心-个人信息-登录账号）  
商户API证书序号（商户平台后台-账户中心-API安全-管理证书-API证书管理-证书序列号）  
商户私钥文件（[获取商户API证书](https://kf.qq.com/faq/161222NneAJf161222U7fARv.html) 证书文件夹里的 apiclient_key.pem）  
APIv3密钥（[获取APIv3密钥](https://kf.qq.com/faq/180830E36vyQ180830AZFZvu.html) 这是一个对称加密的密钥）

::: details 创建支付参数属性文件 src/main/resources/wxpay.properties
```properties
# APPID
wxpay.appid=wx74862e0dfcf69954
# 商户号
wxpay.mch-id=1558950191
# 商户API证书序列号
wxpay.mch-serial-no=34345964330B66427E0D3D28826C4993C77E631F
# 商户私钥文件
wxpay.private-key-path=apiclient_key.pem
# APIv3密钥
wxpay.api-v3-key=UDuLFDcmy5Eb6o0nTNZdu6ek4DDh4K8B

# 微信服务器地址
wxpay.domain=https://api.mch.weixin.qq.com
# 接收结果通知地址
# 注意：每次重新启动ngrok，都需要根据实际情况修改这个配置
wxpay.notify-domain=https://500c-219-143-130-12.ngrok.io

# APIv2密钥
wxpay.partnerKey: T6m9iK73b0kn9g5v426MKfHQH7X8rKwb
```
:::

::: details 创建读取属性配置文件的配置类
```java
@Configuration
@PropertySource("classpath:wxpay.properties") //读取属性配置文件
@ConfigurationProperties(prefix = "wxpay") //读取wxpay节点
@Data
@Slf4j
public class WxPayConfig {

    // 商户号
    private String mchId;

    // 商户API证书序列号
    private String mchSerialNo;

    // 商户私钥文件
    private String privateKeyPath;

    // APIv3密钥
    private String apiV3Key;

    // APPID
    private String appid;

    // 微信服务器地址
    private String domain;

    // 接收结果通知地址
    private String notifyDomain;

    // APIv2密钥
    private String partnerKey;

}
```
IDEA 提示未配置 Spring Boot 配置注解处理器的处理方法：[查看详情](https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/html/appendix-configuration-metadata.html#configuration-metadata-annotation-processor-setup)

IDEA 把 wxpay.properties 配置成 Spring Boot 配置文件：打开项目结构界面（Ctrl+Alt+Shift+S）-> 模块 -> Srping -> Configuration Files -> 点击上方最右边的自定义 Spring Boot 配置按钮 -> 点击 ＋ 号添加自定义配置文件 -> 添加 wxpay.properties -> 应用
:::

## 加载商户私钥

商户端用私钥对传输信息进行签名后向微信平台发送请求，微信平台接收到商户端请求后需要使用商户的公钥进行验签

::: details 引入微信支付SDK
```xml
<dependency>
    <groupId>com.github.wechatpay-apiv3</groupId>
    <artifactId>wechatpay-apache-httpclient</artifactId>
    <version>0.4.8</version>
</dependency>
```
:::

## 获取平台证书和验签器

微信支付平台用私钥对传输信息进行签名后向商户端发送请求，商户端使用微信支付平台的公钥进行验签。
而微信支付平台的的公钥是从微信支付平台的数字证书中获取的，因此商户端要获取微信支付平台的数字证书并创建签名验证器

## 获取HttpClient对象

## API字典和接口规则

## 内网穿透

微信支付平台向我们的开发服务器发送请求的时候，我们开发服务器必须有一个微信可以访问的外网地址。
而我们的开发机一般都是局域网环境的，是没有独立ip的，因此需要通过内网穿透的方式将开发机映射到外网

## APIv3

