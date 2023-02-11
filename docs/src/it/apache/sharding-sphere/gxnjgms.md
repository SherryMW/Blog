---
date: 2022-11-10
category: IT
tag:
  - Java
  - Apache
---

# ShardingSphere 5

互联网业务兴起之后，海量用户加上海量数据的特点，单个数据库服务器已经难以满足业务需要，必须考虑数据库集群的方式来提升性能。高性能数据库集群的第一种方式是**读写分离**，第二种方式是**数据库分片**
<!-- more -->

::: tip
阿里巴巴开发手册 -> MySQL 数据库 -> 建表规约：

单表行数超过 500 万行或者单表容量超过 2GB，才推荐进行分库分表

如果预计三年后的数据量根本达不到这个级别，请不要在创建表时就分库分表
:::

## 读写分离架构

读写分离原理：将数据库读写操作分散到不同的节点上，下面是其基本架构图：

写操作会路由到主机，从机会复制主机的数据，读操作就会被路由到从机