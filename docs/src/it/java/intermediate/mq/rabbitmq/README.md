---
category: IT
article: false
---

# 简介

官网：[https://www.rabbitmq.com](https://www.rabbitmq.com/)

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img.png)

## 安装

1. 安装 Erlang：[https://www.erlang.org/downloads](https://www.erlang.org/downloads)

2. 安装 RabbitMQ：[https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

## 交换机

交换机总共有 4 种类型：

- Direct Exchange

    - 根据消息的路由键（routing key）将消息直接路由到与之绑定的队列

    - 路由键必须与队列绑定时指定的绑定键完全匹配

- Topic Exchange

    - 根据消息的路由键与队列绑定时指定的匹配模式进行匹配

    - 匹配模式可包含通配符：`#` 匹配多个单词，`*` 匹配一个单词，用 `.` 隔开的为一个单词  

        `beijing.#` == `beijing.queue.abc`，`beijing.queue.abc.xyz`
 
        `beijing.*` == `beijing.abc`，`beijing.xyz` 

- Fanout Exchange

    - 将消息广播到与之绑定的所有队列，与路由键无关

    - 路由键在此情况下被忽略

- Headers Exchange

    - 基于消息内容中的 headers 属性进行匹配

    - 在队列绑定时指定一组键值对，路由时需要匹配指定的键值对

## 如何保证消息不丢失

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img_2.png)

1. 确保消息到 MQ

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("/rabbit")
@Slf4j
public class RabbitProducer {

    @Resource
    private RabbitTemplate rabbitTemplate; // Spring 对 RabbitMQ 操作的模板类，提供了一系列发送消息的方法

    @GetMapping("/direct")
    public String direct(@RequestParam String key) {
        String sendMsg = "key(" + key + "),exchange(direct)-" + System.currentTimeMillis(); // 构造发送到交换机的消息
        log.info("生产者发送消息：{}", sendMsg);
        this.rabbitTemplate.convertAndSend("DirectExchange", key, sendMsg); // 使用 RabbitTemplate 向名为 "DirectExchange" 的直连交换机发送消息，指定路由键 为 key，消息内容为 sendMsg
        return "生产者发送消息成功 ->" + sendMsg;
    }
}
```

要确保消息到 MQ，需要发送方确认模式：

```java

```

2. 确保消息路由到正确的队列：路由失败通知

3. 确保消息在队列正确的存储：交换器、队列、消息都需要持久化

4. 确保消息从队列中正确地投递至消费者：手动确认 -> 交给消费者来确认

## 什么是消息队列中的消息重复

## 如何解决消息队列中的重复消息

