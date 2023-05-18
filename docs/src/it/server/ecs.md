---
date: 2022-03-03
category: IT
---

# 云服务器 ECS

记录购买云服务器 ESC、域名注册、 网站备案、SSL 证书申请、LNMP 开发环境搭建过程

<!-- more -->

[云服务器ECS文档](https://help.aliyun.com/product/25365.html)  

## 购买云服务器 ECS

登录访问 [阿里云官网](https://www.aliyun.com/)

![](https://img.sherry4869.com/blog/it/server/ecs/img.png)

导航栏中依次选择【产品】->【计算】->【云服务器】->【云服务器ESC】

![](https://img.sherry4869.com/blog/it/server/ecs/img_1.png)

访问购买界面后根据个人需求购买合适的云服务器ESC（下图为参考配置，可点击放大查看）

[Alibaba Cloud Linux镜像概述](https://help.aliyun.com/document_detail/111881.html)

![](https://img.sherry4869.com/blog/it/server/ecs/img_2.png)

---

[升降配方式](https://help.aliyun.com/document_detail/25437.html) 创建实例后，如果当前实例配置无法满足你的业务需求，你可以修改实例规格（vCPU和内存）、公网带宽配置和数据盘计费方式  

::: info
CentOS 官方已计划停止维护 CentOS 7、CentOS 8 等 Linux 项目，如果你的操作系统后续想得到维护和技术支持，需要将 CentOS 操作系统迁移到其他Linux LTS（长期支持）发行版
:::

[迁移操作系统](https://help.aliyun.com/document_detail/438217.html) 通过 SMC 将 CentOS 7/8 操作系统平滑迁移至 Alibaba Cloud Linux 和龙蜥操作系统（Anolis OS）  

[创建一个快照](https://help.aliyun.com/document_detail/25455.html) 在回滚云盘、修改关键系统文件、更换操作系统前为了数据安全，你可以提前创建快照备份，提高操作容错率    

[更换操作系统（系统盘）](https://help.aliyun.com/document_detail/25436.html) 如果你在创建ECS实例时选择了错误的操作系统，或者在使用过程中需要改用其他操作系统，你可以为 ECS 实例更换新的操作系统  

访问云服务器ECS控制台->选择指定服务器实例ID访问实例详情界面->点击更换操作系统

![](https://img.sherry4869.com/blog/it/server/ecs/img_5.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_3.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_4.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_6.png)

## 域名注册

::: info
在域名没有被发明之前，人们访问网站都是通过 IP 地址，也就是类似 1.1.1.1 这样的一串字符，但是 IP 地址不直观，而且用户记忆十分不方便，于是人们又发明了另一套字符型的地址方案，即所谓的域名地址
:::

访问 [阿里云域名注册](https://wanwang.aliyun.com/domain/searchresult/) 中查询自己想要注册的域名下单购买

![](https://img.sherry4869.com/blog/it/server/ecs/img_7.png)

::: tip
支付前可以通过输入优惠口令获得减免 [优惠口令获取方式](https://help.aliyun.com/document_detail/44007.html)

![](https://img.sherry4869.com/blog/it/server/ecs/img_8.png)
:::

访问 [域名控制台](https://dc.console.aliyun.com/) 管理已注册的域名

### 域名解析

::: info
域名解析就是需要我们手动把域名地址和 IP 地址的对应关系写到 DNS 服务器上，这样别人访问域名地址的时候就可以在 DNS 查询到对于的 IP 地址
:::

::: tip
.com/.net/.cn/.xin/.top/.xyz/.vip/.club/.shop/.wang/.ren 等域名注册成功后必须进行域名实名认证，否则会造成解析不生效，实名认证审核通过后的1-2个工作日解析可恢复使用 [查看详细](https://help.aliyun.com/document_detail/35881.html)
:::

访问 [云解析DNS](https://dns.console.aliyun.com/) 配置界面

在选项卡中选择权威域名点击 **添加域名**

![](https://img.sherry4869.com/blog/it/server/ecs/img_18.png)

域名添加后点击 **解析设置** 进行DNS配置

![](https://img.sherry4869.com/blog/it/server/ecs/img_16.png)

配置二级域名的DNS解析（示例）

![](https://img.sherry4869.com/blog/it/server/ecs/img_17.png)

[添加解析记录配置详解](https://help.aliyun.com/document_detail/29725.htm?spm=a2c4g.11186623.0.0.47a55b8e8icKvj#topic-2035899)

## 网站备案

::: info
网站托管在中国内地的服务器上，你需根据所在省市的管局规则进行ICP备案申请。当你使用阿里云中国内地节点服务器时，你可以在PC端或移动端的阿里云ICP代备案系统中提交ICP备案申请，审核通过便可开通网站访问服务

公安备案的目的就是为了防止在网上从事非法的网站经营活动，打击不良互联网信息的传播，营造一个良好的互联网环境

公安备案审核完成后公安联网会下发一个当地省份开头的公网安备 xxxxx 号，同时还会为网站生成一个网站HTML代码
:::

[ICP 备案流程](https://help.aliyun.com/document_detail/116625.html)

[ICP 备案操作指导（PC端）](https://help.aliyun.com/document_detail/117418.html)

[ICP 备案查询](https://beian.miit.gov.cn/#/Integrated/recordQuery)

访问 [公安机关互联网站安全管理服务平台](https://www.beian.gov.cn/portal/index) 完成注册登录

访问个人主页点击新办网站申请

![](https://img.sherry4869.com/blog/it/server/ecs/img_9.png)

按照实际情况填写

![](https://img.sherry4869.com/blog/it/server/ecs/img_19.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_20.png)

网站基本信息填写参考示例

![](https://img.sherry4869.com/blog/it/server/ecs/img_21.png)

::: tip
如网站提供互联网交互服务需要发送 **博客个人空间服务企业基础信息登记表** 以及 **交互式服务安全检查表** 邮件到指定邮箱进行审核  
提交审核后预计等待两周审核时间，如有审核失败疑问可以拨打当地公网备案客户咨询电话进行咨询
:::

## SSL 免费证书申请

::: info
安全套接字层(SSL) 技术通过加密信息和提供鉴权，保护你的网站安全。一份 SSL 证书包括一个公共密钥和一个私用密钥。公共密钥用于加密信息，私用密钥用于解译加密的信息。浏览器指向一个安全域时，SSL 同步确认服务器和客户端，并创建一种加密方式和一个唯一的会话密钥。它们可以启动一个保证消息的隐私性和完整性的安全会话
:::

- 阿里云个人账号和企业账号均可申请，多个域名可以申请多个免费证书

- 免费证书只能保护一个域名（带 www 和不带 www 可以通用）

- 一个账户限制申请20个免费证书

- 免费证书有效期为1年

访问 [阿里云数字证书管理服务](https://www.aliyun.com/product/cas) 界面中点击 SSL 证书申请免费证书

![](https://img.sherry4869.com/blog/it/server/ecs/img_10.png)

按照实际情况填写

![](https://img.sherry4869.com/blog/it/server/ecs/img_11.png)

访问 [阿里云DNS控制台](https://dns.console.aliyun.com/) 添加DNS解析配置完成验证

![](https://img.sherry4869.com/blog/it/server/ecs/img_12.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_13.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_14.png)

验证成功后阿里云账号绑定的手机号码会收到 SSL 证书已签发成功的短信

::: tip
使用免费 SLL 证书在通过手机端访问网站时会出现类似“该链接经检测无法确定其安全性，请谨慎输入敏感信息”的提示
:::

[安装SSL证书到服务器](https://help.aliyun.com/document_detail/198938.html)

## LNMP 开发环境搭建

::: info
LNMP 是指一组通常一起使用来运行动态网站或者服务器的自由软件名称首字母缩写。L 指 Linux，N 指 Nginx，M 一般指 MySQL，也可以指 MariaDB，P 一般指 PHP，也可以指 Perl 或 Python

- Linux 是一类Unix计算机操作系统的统称，是目前最流行的免费操作系统。代表版本有：debian、centos、ubuntu、fedora、gentoo 等

- Nginx 是一个高性能的HTTP和反向代理服务器，也是一个 IMAP/POP3/SMTP 代理服务器

- Mysql 是一个小型关系型数据库管理系统

- PHP 是一种在服务器端执行的嵌入 HTML 文档的脚本语言

这四种软件均为免费开源软件，组合到一起，成为一个免费、高效、扩展性强的网站服务系统
:::

访问 [宝塔官网](https://www.bt.cn/new/download.html)：2 分钟装好面板，一键管理服务器，集成 LAMP/LNMP 环境安装，网站、FTP、数据库、文件管理、软件安装等功能

[查看详细安装教程](https://www.bt.cn/bbs/thread-79460-1-1.html)

::: tip
系统兼容性推荐：Centos7.x > Debian10 > Ubuntu 20.04 > Centos8 stream > Ubuntu 18.04 > 其它系统
:::

![](https://img.sherry4869.com/blog/it/server/ecs/img_22.png)

Linux面板 7.9.6 在线安装示例

![](https://img.sherry4869.com/blog/it/server/ecs/img_23.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_24.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_25.png)

![](https://img.sherry4869.com/blog/it/server/ecs/img_26.png)

::: tip
如果使用 Alibaba Cloud Linux 操作系统安装宝塔面板和 LNMP 环境套件后访问宝塔面板发现只安装了 Nginx 和宝塔 SSH 终端，其余的软件需要在软件商店中自行搜索安装
:::

## 常见问题

### 服务器 SSH 无法连接

外部探测 22 端口是否可以通信，如果可以通信但 SSH 无法连接的话有可能是内存满了。先通过 vnc 进入看下主机是否可以进入系统，如果无法进入的话，重启服务器可以重新清理一次内存使用（机器重启时间大概在10-15分钟）

- vnc 无法正常进入系统，无法执行指令操作，这种情况只能先重启服务器处理

- 如果涉及到生产环境，可以先用旧主机镜像创建一台临时服务器过度使用，新主机会和旧主机数据一致

  - 先通过旧实例创建自定义镜像 [参考文档](https://help.aliyun.com/document_detail/35109.html)
  
  - 然后通过这个自定义镜像创建一个新的实例 [参考文档](https://help.aliyun.com/document_detail/25465.html)
  
  - 新服务器就和旧主机数据一样，业务方面先访问新主机的 ip 过度使用

- 如果业务涉及到域名访问的话，会涉及到各地域名解析缓存，需要一定时间生效

- 为避免这种情况，后续域名解析到负载均衡 ip，然后给后端主机配置健康检查，识别到某台主机异常时，自动切换到正常主机上