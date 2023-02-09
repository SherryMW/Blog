---
date: 2022-09-10
category: IT
tag:
  - Java
  - 支付
order: 1
---

# 微信支付接入指引

<!-- more -->

[微信支付产品](https://pay.weixin.qq.com/static/product/product_index.shtml)

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img.png)

JSAPI 支付中的 PC 网站场景和 Native 支付的区别在于 JSAPI 支付是用户扫描二维码后自主输入支付金额进行支付。 
而 Native 支付是用户扫描二维码后直接展示由商家指定的支付金额让用户支付

H5 支付是指商户在微信客户端外的移动端网页展示商品或服务，用户在前述页面确认使用微信支付时，商户发起本服务呼起微信客户端进行支付。
主要用于触屏版的手机浏览器请求微信支付的场景。可以方便的从外部浏览器唤起微信支付。说明：要求商户已有H5商城网站，并且已经过ICP备案，即可申请接入

## 注册公众号

访问 [微信公众平台](https://mp.weixin.qq.com) 注册公众号（服务号）

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_1.png)

注册类型为企业/组织，注册成功后在公众号管理平台中的【设置与开发】-【基本配置】中获得 AppID

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_2.png)

目前微信仅支持已完成微信认证的公众号（服务号）绑定商户号开发使用

 [微信认证申请流程（企业类型）](https://kf.qq.com/faq/161220Brem2Q161220uUjERB.html)

## 注册商户号

[选择微信支付对应支付场景](https://pay.weixin.qq.com/static/applyment_guide/applyment_index.shtml)

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_3.png)

### 提交资料

准备好申请材料注册微信支付商户号

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_4.png)

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_5.png)

支付域名和网站域名的ICP注册主体必须与申请商户号的主体一致，如果不一致需要提供 [授权函](https://kf.qq.com/faq/180315EZjIfe180315JFFVVr.html)，授权函需双方加盖公章鲜章； 若ICP备案为个人，则需与商户号营业执照的法人一致，并请该法人在授权函上签字并手印，以上均不受理复印件

### 签署协议

微信会给提交资料的超级管理员的微信号上发送一条签约信息，超级管理员需要进行线上签约后可获取到商户平台的商户号

超级管理员在 [商户平台首页](https://pay.weixin.qq.com/) 上进行扫码登陆后进入商户后台管理的首页界面，点击顶部导航栏中的账户中心，个人信息界面中的登录账号就是商家商户号

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_6.png)

### 绑定场景

微信支付交易发起依赖于公众号、小程序、移动应用（即APPID）与商户号（即MCHID）的绑定关系，因此商户在完成签约后，需要确认当前商户号同AppID的绑定关系，方可使用

[商家商户号与AppID账号关联管理](https://kf.qq.com/faq/1801116VJfua1801113QVNVz.html)

[商户申请接入时，如何确认绑定关系](https://kf.qq.com/faq/180910QZzmaE180910vQJfIB.html)

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_7.png)

## 获取开发中需要的秘钥和证书

[商户平台密码安全](https://kf.qq.com/faq/161222RNRFFN161222VVb6ba.html)

[获取商户API证书](https://kf.qq.com/faq/161222NneAJf161222U7fARv.html)

[设置APIv3秘钥](https://kf.qq.com/faq/180830E36vyQ180830AZFZvu.html)

管理员的操作密码就是在申请商户平台账号时设置的密码

APIv3 版本的所有接口都需要证书；APIv2 版本的高级接口需要证书 如：退款、企业红包、企业付款等

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_8.png)

点击查看证书文件夹，解压xxx_cert.zip压缩包

![](https://img.sherry4869.com/blog/it/java/pay/weixin/payment-guidelines/img_9.png)

::: warning 注意
以上所有API密钥和证书需妥善保管防止泄露
:::

## 申请支付产品

### H5支付产品

[商户申请H5支付权限需要注意哪些规则](https://kf.qq.com/faq/211124JbyEFj211124aeY77F.html)

产品对应网站域名要填写实际的商品详情页，要能体现整个业务的流程，不然可能会被拒。如果项目开发未完成，可以做一些简单的页面，要有支付的按钮和订单详情之类的