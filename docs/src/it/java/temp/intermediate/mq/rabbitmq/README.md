---
category: IT
article: false
---

# 简介

官网：[https://www.rabbitmq.com](https://www.rabbitmq.com/)

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img.png)

## 安装

1. 安装 Erlang：[https://www.erlang.org/downloads](https://www.erlang.org/downloads)

2. 配置 Erlang 环境变量：

    变量名：ERLANG_HOME

    变量值：D:\DevelopmentTools\Erlang OTP\bin

    Path：%ERLANG_HOME%

    验证：`erl -version`

3. 安装 RabbitMQ：[https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

    CMD执行：`"D:\DevelopmentTools\RabbitMQ Server\rabbitmq_server-3.12.12\sbin\rabbitmq-plugins.bat" enable rabbitmq_management`

    CMD管理员身份执行：`net stop RabbitMQ && net start RabbitMQ`

4. 访问 RabbitMQ

    默认的端口号：5672

    默认的用户名密码：guest

    管理后台的默认端口号：15672

    http://localhost:15672

## Hello World 示例

首先在 pom 文件中，添加相关依赖：

```xml
<dependency>
   <groupId>com.rabbitmq</groupId>
   <artifactId>amqp-client</artifactId>
   <version>5.7.0</version>
</dependency>
```

下面这段代码演示了如何连接到 RabbitMQ 服务器、创建一个通道、声明一个队列并向该队列发送消息

```java
import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Producer {
    
    private static final String QUEUE_NAME = "hello"; // 声明一个名为QUEUE_NAME的常量，其值为"hello"。这是要发送消息的队列的名称

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory(); // 创建一个ConnectionFactory实例，用于配置连接参数
        factory.setHost("localhost"); // 将主机设置为"localhost"，假设RabbitMQ服务器在本地计算机上运行
        Connection connection = factory.newConnection(); // 使用ConnectionFactory建立与RabbitMQ服务器的连接
        Channel channel = connection.createChannel(); // 创建一个通信通道，通过该通道可以发送或接收消息
        /**
         * 使用指定的参数声明一个名为"hello"的队列。参数是：
         * queue - 队列的名称
         * durable - 如果队列应在代理重新启动时保留
         * exclusive - 如果队列只能由创建它的连接使用
         * autoDelete - 如果队列在最后一个消费者取消订阅时应删除
         * arguments - 队列的其他配置设置（在本例中，null表示没有其他设置） 
         */
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        String message = "Hello World!";
        channel.basicPublish("", QUEUE_NAME, null, message.getBytes()); // 向"hello"队列发布一条消息。消息是将"Hello World!"转换为字节
        System.out.println(" [x] Sent '" + message + "'");
        // 关闭通道和连接以释放资源
        channel.close();
        connection.close();
    }
}
```

运行代码，在 RabbitMQ 管理后台会看到队列新建成功，并且有 1 个消息待消费：

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img_3.png)

新建一个消费者类（Consumer），用来消费这个消息：

```java
import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class Consumer {
    
    private static final String QUEUE_NAME = "hello"; // 声明一个名为 QUEUE_NAME 的常量，其值为 "hello"。这是要监听的队列的名称

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory(); // 创建一个 ConnectionFactory 实例，用于配置连接参数
        factory.setHost("localhost"); // 将主机设置为 "localhost"，假设RabbitMQ服务器在本地计算机上运行
        Connection connection = factory.newConnection(); // 使用 ConnectionFactory 建立与RabbitMQ服务器的连接
        Channel channel = connection.createChannel(); // 创建一个通信通道，通过该通道可以接收消息
        /**
         * 使用指定的参数声明一个名为 "hello" 的队列。参数是：
         * queue - 队列的名称
         * durable - 如果队列应在代理重新启动时保留
         * exclusive - 如果队列只能由创建它的连接使用
         * autoDelete - 如果队列在最后一个消费者取消订阅时应删除
         * arguments - 队列的其他配置设置（在本例中，null表示没有其他设置）
         */
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        // 创建一个消费者实例，继承了 DefaultConsumer。重写了 handleDelivery 方法，该方法在接收到消息时会被调用
        com.rabbitmq.client.Consumer consumer = new DefaultConsumer(channel) {
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 在 handleDelivery 方法中，将消息的字节数组转换为字符串，并打印到控制台
                String message = new String(body, "UTF-8");
                System.out.println("Received Message '" + message + "'");
            }
        };
        // 启动基本的消息消费。在本例中，设置了 autoAck 参数为 true，表示消息在被接收后会被自动确认。如果 autoAck 设置为 false，需要在处理完消息后手动调用 channel.basicAck() 来确认消息
        channel.basicConsume(QUEUE_NAME, true, consumer);
    }
}
```

运行代码，我们会发现控制台输出：`Received Message 'Hello World!'`

此时再看下 RabbitMQ 管理后台，会发现队列“hello”待消费的消息为 0：

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img_4.png)

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
    
    ```java {18,25}
    import org.springframework.amqp.rabbit.connection.ConnectionFactory;
    import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
    import org.springframework.amqp.rabbit.connection.CorrelationData;
    import org.springframework.amqp.rabbit.core.RabbitTemplate;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    
    @Configuration
    public class RabbitConfig {
    
        @Bean
        public ConnectionFactory connectionFactory() {
            CachingConnectionFactory connectionFactory = new CachingConnectionFactory(); // Spring AMQP 提供的连接工厂类，用于创建 RabbitMQ 连接
            connectionFactory.setAddresses("127.0.0.1:5672"); // 设置 RabbitMQ 服务器的地址
            connectionFactory.setUsername("guest"); // 设置连接 RabbitMQ 服务器所需的用户名
            connectionFactory.setPassword("guest"); // 设置连接 RabbitMQ 服务器所需的密码
            connectionFactory.setVirtualHost("/"); // 设置连接 RabbitMQ 服务器时使用的虚拟主机
            connectionFactory.setPublisherConfirms(true); // 启用发送消息的确认模式，即生产者发送消息后，会收到 RabbitMQ 服务器的确认
            return connectionFactory; // 将配置好的 CachingConnectionFactory Bean 返回给 Spring 容器
        }
    
        @Bean
        public RabbitTemplate newRabbitTemplate() {
            RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
            rabbitTemplate.setConfirmCallback(confirmCallback()); // 设置了发布者确认的回调方法
            return rabbitTemplate;
        }
    
        @Bean
        public RabbitTemplate.ConfirmCallback confirmCallback() {
            return new RabbitTemplate.ConfirmCallback() { // 这个接口是RabbitMQ发送消息的确认回调接口，用于处理消息是否成功发送到RabbitMQ服务器
                @Override
                public void confirm(CorrelationData correlationData, boolean b, String s) {
                    if (b) {
                        System.out.println("发送者确认发送给MQ成功");
                    } else {
                        // 处理失败的消息
                        System.out.println("发送者发送给MQ失败，考虑重发：" + s);
                    }
                }
            };
        }
    }
    ```

2. 确保消息路由到正确的队列：路由失败通知

    ```java {27,28}
    import org.springframework.amqp.core.ReturnedMessage;
    import org.springframework.amqp.rabbit.connection.ConnectionFactory;
    import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
    import org.springframework.amqp.rabbit.connection.CorrelationData;
    import org.springframework.amqp.rabbit.core.RabbitTemplate;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    
    @Configuration
    public class RabbitConfig {
    
        @Bean
        public ConnectionFactory connectionFactory() {
            CachingConnectionFactory connectionFactory = new CachingConnectionFactory(); // Spring AMQP 提供的连接工厂类，用于创建 RabbitMQ 连接
            connectionFactory.setAddresses("127.0.0.1:5672"); // 设置 RabbitMQ 服务器的地址
            connectionFactory.setUsername("guest"); // 设置连接 RabbitMQ 服务器所需的用户名
            connectionFactory.setPassword("guest"); // 设置连接 RabbitMQ 服务器所需的密码
            connectionFactory.setVirtualHost("/"); // 设置连接 RabbitMQ 服务器时使用的虚拟主机
            connectionFactory.setPublisherConfirms(true); // 启用发送消息的确认模式，即生产者发送消息后，会收到 RabbitMQ 服务器的确认
            return connectionFactory; // 将配置好的 CachingConnectionFactory Bean 返回给 Spring 容器
        }
    
        @Bean
        public RabbitTemplate newRabbitTemplate() {
            RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
            rabbitTemplate.setConfirmCallback(confirmCallback()); // 设置了发布者确认的回调方法
            rabbitTemplate.setMandatory(true); // 开始失败通知
            rabbitTemplate.setReturnsCallback(returnsCallback()); // 消息路由失败通知
            return rabbitTemplate;
        }
    
        @Bean
        public RabbitTemplate.ConfirmCallback confirmCallback() {
            return new RabbitTemplate.ConfirmCallback() { // 这个接口是RabbitMQ发送消息的确认回调接口，用于处理消息是否成功发送到RabbitMQ服务器
                @Override
                public void confirm(CorrelationData correlationData, boolean b, String s) {
                    if (b) {
                        System.out.println("发送者确认发送给MQ成功");
                    } else {
                        // 处理失败的消息
                        System.out.println("发送者发送给MQ失败，考虑重发：" + s);
                    }
                }
            };
        }
    
        @Bean
        public RabbitTemplate.ReturnsCallback returnsCallback() {
            return new RabbitTemplate.ReturnsCallback() {
                @Override
                public void returnedMessage(ReturnedMessage returnedMessage) {
                    System.out.println("无法路由的消息，需要考虑另外处理，这个消息已经丢了");
                    System.out.println("Returned replyText：" + returnedMessage.getReplyText());
                    System.out.println("Returned exchange：" + returnedMessage.getExchange());
                    System.out.println("Returned routingKey：" + returnedMessage.getRoutingKey());
                    System.out.println("Returned Message：" + new String(returnedMessage.getMessage().getBody()));
                }
            };
        }
    }
    ```

3. 确保消息在队列正确的存储：交换器、队列、消息都需要持久化

4. 确保消息从队列中正确地投递至消费者：不走自动提交，而是手动确认 -> 交给消费者来确认

## 什么是消息队列中的消息重复

第一类原因：

消息发送端应用的消息重复发送，有以下几种情况

- 消息发送端发送消息给消息中间件，消息中间件收到消息并成功存储，而这时消息中间件出现了问题，导致应用端没有收到消息发送成功的返回因而进行重试产生了重复

- 消息中间件因为负载高响应变慢，成功把消息存储到队列后，返回“成功”这个结果时超时

- 消息中间件将消息成功写入消息存储，在返回结果时网络出现问题，导致应用发送端重试，而重试时网络恢复，由此导致重复

可以看到，通过消息发送端产生消息重复的主要原因时消息成功进入消息存储后，因为各种原因使得消息发送端没有收到“成功”的返回结果，并且又有重试机制，因而导致重复

第二类原因：

消息到达了消息存储，由消息中间件进行向外的投递时产生重复，有以下几种情况

- 消息被投递到消息接收者应用进行处理，处理完毕后应用出问题了，消息中间件不知道消息处理结果，会再次投递

- 消息被投递到消息接收者应用进行处理，处理完毕后网络出现问题了，消息中间件没有收到消息处理结果，会再次投递

- 消息被投递到消息接收者应用进行处理，处理时间比较长，消息中间件因为消息超时会再次投递

- 消息被投递到消息接收者应用进行处理，处理完毕后消息中间件收到结果但是遇到消息存储故障，没能更新投递状态，会再次投递

可以看到，在投递过程中产生的消息重复接收主要是因为消息接收者成功处理完消息后，消息中间件不能及时更新投递状态造成的

## 如何解决消息队列中的重复消息

主要是要求消息接收者来处理这种重复的情况，也就是要求消息接收者的消息处理是幂等操作

对于消息接收端的情况，幂等的含义是采用同样地输入多次调用处理函数，得到同样的结果。例如一个 SQL 操作：`update stat_table set count = 10 where id = 1;`

这个操作多次执行，id 等于 1 的记录中的 count 字段的值都为 10，这个操作就是幂等的，我们不用担心这个操作被重复

再来看另外一个 SQL 操作：`update stat_table set count = count +1 where id = 1;` 这样的 SQL 操作就不是幂等的，一旦重复，结果就会产生变化

因此应对消息重复的办法是，使消息接收端的处理是一个幂等操作。这样的做法降低了消息中间件的整体复杂性，不过也给使用消息中间件的消息接收端应用带来了一定地限制和门槛

### MVCC

多版本并发控制，乐观锁的一种实现，在生产者发送消息时进行数据更新时需要带上数据的版本号，消费者去更新时需要去比较有数据的版本号，版本号不一致的操作无法成功

例如博客点赞次数自动 +1 的接口：`public boolean addCount(Long id, Long version);`

`update blogTable set count = count +1, version = version +1 where id = 321 and version = 123` 每一个 version 只有一次执行成功的机会，一旦失败了生产者必须重新获取数据的最新版本号再次发起更新

但这种并发控制做法其实对我们的业务开发不太友好，因为你要去修改的话需要在生产者发送消息的时候携带上版本号，且 SQL 语句中也要改对应的版本号，包括表也需要加字段

### 去重表

利用数据库表单的特性来实现幂等，常用的一个思路是在表上构建唯一性索引，保证某一类数据一旦执行完毕，后续同样地请求不再重复处理了（利用一张日志表来记录已经处理成功的消息ID，如果新的消息ID已经在日志表中，那么就不需要再处理这条信息）

以电商平台为例子，电商平台上的订单 ID 就是最适合的 token。当用户下单时，会经历多个环节，比如生成订单，减库存，减优惠券等。每一个环节执行时都先检测一下该订单 ID 是否已经执行过这一步骤，对未执行的请求执行操作并缓存结果；而对已经执行过的 ID，则直接返回之前的执行结果，不做任何操作。这样可以最大程度上避免操作的重复执行问题，缓存起来的执行结果也能用于事务的控制

![](https://img.sherry4869.com/blog/it/java/intermediate/mq/rabbitmq/img_5.png)