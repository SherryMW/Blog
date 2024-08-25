---
category: IT
article: false
order: 1
---

# 概述

官网：[https://kafka.apache.org](https://kafka.apache.org/)

源码仓库地址：[https://github.com/apache/kafka](https://github.com/apache/kafka)

Kafka 是由 Scala 语言编写而成，Scala 运行在 Java 虚拟机上，并兼容现有的 Java 程序，因此部署 Kafka 的时候，需要先安装 JDK 环境



启动 Docker

```shell
systemctl start docker
```

```shell
systemctl stop docker
```

Docker 启动 kafka

```shell
docker run -p 9092:9092 apache/kafka:3.8.0
```

Docker 启动 kafka（支持外部链接启动的命令）

```shell
docker run --volume /opt/kafka/docker:/mnt/shared/config -p 9092:9092 apache/kafka:3.8.0
```

创建主题

```shell
cd /usr/local/kafka_2.13-3.8.0/bin

./kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
```