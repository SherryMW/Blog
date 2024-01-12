---
date: 2022-08-15
category: IT
---

# 电商项目架构介绍

<!-- more -->

## 标准的电商基础模块

- 商家：商家入住及授权流程

- 店铺：店铺管理

- 用户：用户注册及登录、用户管理模块

- 品牌：品牌管理、品牌授权

- 类目：三级类目管理 服饰 -> 男装 -> 卫衣

- 属性：颜色、尺寸、自定义属性

- 商品：商品管理、库存管理、运费管理

## 标准的电商应用模块

- 购物车：购物车管理

- 导购：搜索、推荐

- 营销：优惠券、活动

- 交易：订单、支付、退款

- 配送：物流

- 售后：售后、客服

## 系统架构

### 流量入口

#### 前端

![](https://img.sherry4869.com/blog/it/project/ec/img.png)

前端 H5 界面都需要加载静态资源文件，于是把静态资源文件放到 CDN 服务器中，让 H5 可以通过 CDN 去加载前端静态资源文件

因为 CDN 是一个边缘的缓存节点服务，所有它背后会有一个源站的地址，通常会将源站的文件系统放到一个 Nginx 静态资源源站服务器中

在静态资源源站服务器里其实就是磁盘文件系统，所有跟静态文件资源相关的文件都会挂载在上面中。如果用户是第一次访问 CDN 的边缘节点，没有对应的缓存 cache 被命中后，就会往对应的资源服务器回源

#### 后端

![](https://img.sherry4869.com/blog/it/project/ec/img_2.png)

通过两台 LVS 可以达到机房灾备的配置，但是 DNS 节点的更新其实是有缓存时长的，也就是说 DNS 记录的这个节点信息并不能实时的去做对应的切换，因此时效性是比较差的

如果我们采用 CDN 内容资源去代理动态请求就可以解决这个问题。我们把所有的请求解析不交给 DNS 服务器去处理，而是把 H5 发送的请求转发给 CDN 服务器，由 CDN 服务器（内容分发网络）做流量代理。CDN 可以不做 cache 缓存，而是直接回源到对应的 LVS，这样就可以快速切换不同 LVS 公网 IP 达到机房灾备快速响应配置

![](https://img.sherry4869.com/blog/it/project/ec/img_3.png)

### 服务治理

![](https://img.sherry4869.com/blog/it/project/ec/img_4.png)

### 数据选型

数据是整个系统核心，因为我们所有的服务层和流量代理层本质上来说都是无状态的服务，要想让整个服务完成一个 OLTP（OnLine Transaction Processsing 联机事务处理）我们就必须要有数据存储

关系型数据库（MySQL）、NoSQL（ElasticSearch 搜索引擎）、为了增加系统 QPS 吞吐量的 Redis 缓存服务

![](https://img.sherry4869.com/blog/it/project/ec/img_5.png)

## 商品详情查询服务

![](https://img.sherry4869.com/blog/it/project/ec/img_6.png)

![](https://img.sherry4869.com/blog/it/project/ec/img_7.png)

## 商品的领域模型

商品基础、品牌、类目、库存、详情描述、销量、价格、运费

如果我们把上述这些字段都放到同一张商品表里面，不排除这样做没有好处，因为这样的模型非常地简单，查询、存储、加缓存的逻辑都会变得简单。但是随着用户量上涨，业务的不断更新，就会发现这张商品表的结构变得越来越复杂，不同的结构字段之间都会有来回的关系

因此需要用领域驱动设计的方式，不要先从数据库的维度去考量你的应用设计成什么样子。而是应该先从领域模型的维度去拆分清楚商品模型会以哪些领域驱动的维度去做对应的能力，再去考虑数据库的设计

![](https://img.sherry4869.com/blog/it/project/ec/img_8.png)

## 交易的领域模型

业务单、主子商品单、支付单、营销工具

![](https://img.sherry4869.com/blog/it/project/ec/img_9.png)

![](https://img.sherry4869.com/blog/it/project/ec/img_10.png)

![](https://img.sherry4869.com/blog/it/project/ec/img_11.png)
