---
category: IT
article: false
order: 6
---

# 课程总结

- 学会使用 SpringBoot + MyBatis 完成 JavaWeb 项目的搭建

- 学会一个电商秒杀项目的基本流程及代码实现

后续的实战课程中会讲解到本地缓存、集中式缓存、redis 等技术

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/3.png)

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/4.png)

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/5.png)

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/6.png)

## 出错调试

- 先确认问题点：环境问题、UI展示问题、接口问题、服务问题、配置问题

- 调试：断点调试、日志调试

- 互联网寻找答案

## 拓展思维

多商品、多个渠道的库存、多种秒杀活动的模型怎么实现？

## 遗留问题

如何支撑亿级秒杀流量？

- 如何发现容量问题：容量问题具体出现在哪

- 如何使得系统水平扩展：例如现在系统支持 100TPS 的流量，那如果部署到 100 台服务器上可以支持 10000TPS 吗

- 查询效率低下：商品详情页每次都会通过操作数据库去拿到 itemDO

- 活动开始前页面被疯狂刷新：刷新界面意味着重复调用活动、商品等所有链路的接口，这样的性能消耗其实是没有意义的

- 库存行锁问题：下单链路最怕的就是对热点库存的“减”操作，这个“减”操作会对数据库的行锁带来一个巨大的问题（同一个时间只有一个事务可以对数据库进行“减”操作，其余所有事务都要排队）

- 下单操作多，缓慢问题：下单的链路非常多，是否有优化的空间

- 浪涌流量如何解决：像大浪一样突然一个峰值流量进来，没有任何的预热和准备，甚至想加缓存也心有余而力不足。因为它是一个浪涌的状况，瞬间就会把缓存失效掉，并且涌入到后端的服务器当中

## 源码下载

[源码下载](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/spike.zip)

[SQL下载](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/spike.sql)