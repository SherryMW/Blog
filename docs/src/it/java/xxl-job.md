---
category: IT
article: false
---

# 分布式调度 XXL-JOB

## 概述

### 什么是任务调度

我们可以思考一下下面业务场景的解决方案：

- 某电商平台需要每天上午 10 点，下午 3 点，晚上 8 点发放一批优惠券

- 某银行系统需要在信用卡到期还款日的前三天进行短信提醒

- 某财务系统需要在每天凌晨 0:10 分结算前一天的财务数据，统计汇总

以上场景就是任务调度所需要解决的问题

**任务调度是为了自动完成特定任务，在约定的特定时刻去执行任务的过程**

### 为什么需要分布式调度

使用 Spring 中提供的注解 `@Scheduled`，也能实现调度的功能。在业务类中方法中贴上 `@Scheduled` 注解，然后在启动类上贴上 `@EnableScheduling` 注解

```java
@Scheduled(cron = "0/20 * * * * ? ")
public void doWork(){
    // doSomething
}
```

感觉 Spring 给我们提供的这个注解可以完成任务调度的功能，好像已经完美解决问题了，为什么还需要分布式呢？

主要有如下这几点原因：

1. 高可用：单机版的定式任务调度只能在一台机器上运行，如果程序或者系统出现异常就会导致功能不可用

2. 防止重复执行: 在单机模式下，定时任务是没什么问题的。但当我们部署了多台服务，同时每台服务又有定时任务时，若不进行合理地控制在同一时间内只有一个定时任务启动执行，定时执行的结果就可能存在混乱和错误了（例如某个定时任务是用来做增加用户积分的操作，集群部署就会导致用户的积分会重复增加）

3. 单机处理极限：原本 1 分钟内需要处理 1 万个订单，但是现在需要 1 分钟内处理 10 万个订单；原来一个统计需要 1 小时，现在业务方需要 10 分钟就统计出来。你也许会说，你也可以多线程、单机多进程处理。的确，多线程并行处理可以提高单位时间的处理效率，但是单机能力毕竟有限，CPU、内存和磁盘始终会有单机处理不过来的情况

### XXL-JOB 介绍

XXL-JOB 是大众点评的一个轻量级分布式任务调度平台。 其核心设计目标是开发迅速、学习简单、轻量级、易扩展。大众点评目前已接入 XXL-JOB，该系统在内部已调度约 100 万次，表现优异

官网：[https://www.xuxueli.com/xxl-job](https://www.xuxueli.com/xxl-job/)

![系统架构图](https://www.xuxueli.com/doc/static/xxl-job/images/img_Qohm.png)

![基本原理](https://img.sherry4869.com/blog/it/java/xxl-job/1.png)

**设计思想**

将调度行为抽象形成“调度中心”公共平台，而平台自身并不承担业务逻辑，“调度中心”负责发起调度请求

将任务抽象成分散的 `JobHandler`，交由“执行器”统一管理，“执行器”负责接收调度请求并执行对应的 `JobHandler` 中业务逻辑

因此，“调度”和“任务”两部分可以相互解耦，提高系统整体稳定性和扩展性

## 快速入门

### 下载

|                                    源码仓库地址                                    | Release Download                                                                                 |
|:----------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------|
|   [https://github.com/xuxueli/xxl-job](https://github.com/xuxueli/xxl-job)   | [https://github.com/xuxueli/xxl-job/releases](https://github.com/xuxueli/xxl-job/releases)       |
| [http://gitee.com/xuxueli0323/xxl-job](http://gitee.com/xuxueli0323/xxl-job) | [https://gitee.com/xuxueli0323/xxl-job/releases](https://gitee.com/xuxueli0323/xxl-job/releases) |

中央仓库地址

```xml
<!-- http://repo1.maven.org/maven2/com/xuxueli/xxl-job-core/ -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>${最新稳定版本}</version>
</dependency>
```

### 初始化调度数据库

请下载项目源码并解压，获取“调度数据库初始化 SQL 脚本”并执行即可

“调度数据库初始化 SQL 脚本”位置在：

```text
/xxl-job/doc/db/tables_xxl_job.sql
```

调度中心支持集群部署，集群情况下各节点务必连接同一个 mysql 实例

如果 mysql 做主从，调度中心集群节点务必强制走主库

### 编译源码

解压源码，按照 maven 格式将源码导入 IDE,，使用 maven 进行编译即可，源码结构如下：

```text
xxl-job-admin：调度中心
xxl-job-core：公共依赖
xxl-job-executor-samples：执行器 Sample 示例（选择合适的版本执行器，可直接使用，也可以参考其并将现有项目改造成执行器）
    xxl-job-executor-sample-springboot：Springboot 版本，通过 Springboot 管理执行器，推荐这种方式
    xxl-job-executor-sample-frameless：无框架版本
```

![](https://img.sherry4869.com/blog/it/java/xxl-job/2.png)

### 配置部署“调度中心”

```text
调度中心项目：xxl-job-admin
作用：统一管理任务调度平台上调度任务，负责触发调度执行，并且提供任务管理平台
```

#### 步骤一：调度中心配置

调度中心配置文件地址：

```text
/xxl-job/xxl-job-admin/src/main/resources/application.properties
```

调度中心配置内容说明：

```properties
### web
server.port=8080
server.servlet.context-path=/xxl-job-admin

### actuator
management.server.servlet.context-path=/actuator
management.health.mail.enabled=false

### resources
spring.mvc.servlet.load-on-startup=0
spring.mvc.static-path-pattern=/static/**
spring.resources.static-locations=classpath:/static/

### freemarker
spring.freemarker.templateLoaderPath=classpath:/templates/
spring.freemarker.suffix=.ftl
spring.freemarker.charset=UTF-8
spring.freemarker.request-context-attribute=request
spring.freemarker.settings.number_format=0.##########
spring.freemarker.settings.new_builtin_class_resolver=safer

### mybatis
mybatis.mapper-locations=classpath:/mybatis-mapper/*Mapper.xml
#mybatis.type-aliases-package=com.xxl.job.admin.core.model

### 调度中心 JDBC 链接：链接地址请保持和所创建的调度数据库的地址一致
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=root_pwd
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

### datasource-pool
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.maximum-pool-size=30
spring.datasource.hikari.auto-commit=true
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.pool-name=HikariCP
spring.datasource.hikari.max-lifetime=900000
spring.datasource.hikari.connection-timeout=10000
spring.datasource.hikari.connection-test-query=SELECT 1
spring.datasource.hikari.validation-timeout=1000

### 报警邮箱
spring.mail.host=smtp.qq.com
spring.mail.port=25
spring.mail.username=xxx@qq.com
spring.mail.from=xxx@qq.com
spring.mail.password=xxx
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory

### 调度中心通讯 TOKEN [选填]：非空时启用
xxl.job.accessToken=default_token

### 调度中心国际化配置 [必填]： 默认为 "zh_CN"/中文简体, 可选范围为 "zh_CN"/中文简体, "zh_TC"/中文繁体 and "en"/英文
xxl.job.i18n=zh_CN

## 调度线程池最大线程配置【必填】
xxl.job.triggerpool.fast.max=200
xxl.job.triggerpool.slow.max=100

### 调度中心日志表数据保存天数 [必填]：过期日志自动清理；限制大于等于 7 时生效，否则, 如 -1，关闭自动清理功能
xxl.job.logretentiondays=30
```

#### 步骤二：部署项目

如果已经正确进行上述配置，可将项目编译打包部署

```text
logback [xxl-job, admin JobScheduleHelper#scheduleThread] INFO  c.x.j.a.c.thread.JobScheduleHelper - >>>>>>>>> init xxl-job admin scheduler success.
```

调度中心访问地址：[http://localhost:8080/xxl-job-admin/toLogin](http://localhost:8080/xxl-job-admin/toLogin) (该地址执行器将会使用到，作为回调地址)

默认登录账号 “admin/123456”, 登录后运行界面如下图所示

![](https://img.sherry4869.com/blog/it/java/xxl-job/3.png)

至此“调度中心”项目已经部署成功

#### 步骤三：调度中心集群（可选）

调度中心支持集群部署，提升调度系统容灾和可用性

调度中心集群部署时，有几点要求和建议：

- DB 配置保持一致

- 集群机器时钟保持一致（单机集群忽视）

- 建议：推荐通过 nginx 为调度中心集群做负载均衡，分配域名。调度中心访问、执行器回调配置、调用 API 服务等操作均通过该域名进行

其他：Docker 镜像方式搭建调度中心：

下载镜像：

```text
// Docker地址：https://hub.docker.com/r/xuxueli/xxl-job-admin/     (建议指定版本号)
docker pull xuxueli/xxl-job-admin
```

创建容器并运行：

```text
/**
* 如需自定义 mysql 等配置，可通过 "-e PARAMS" 指定，参数格式 PARAMS="--key=value  --key2=value2"
* 配置项参考文件：/xxl-job/xxl-job-admin/src/main/resources/application.properties
* 如需自定义 JVM内存参数 等配置，可通过 "-e JAVA_OPTS" 指定，参数格式 JAVA_OPTS="-Xmx512m"
*/
docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai" -p 8080:8080 -v /tmp:/data/applogs --name xxl-job-admin  -d xuxueli/xxl-job-admin:{指定版本}
```

### 配置部署“执行器项目”

创建 SpringBoot 项目并确认 pom 文件中引入了 xxl-job-core 的依赖：

```xml
<!-- http://repo1.maven.org/maven2/com/xuxueli/xxl-job-core/ -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>${最新稳定版本}</version>
</dependency>
```

在配置文件中添加如下配置：

```properties
### 调度中心部署根地址 [选填]：如调度中心集群部署存在多个地址则用逗号分隔。执行器将会使用该地址进行“执行器心跳注册”和“任务结果回调”；为空则关闭自动注册
xxl.job.admin.addresses=http://127.0.0.1:8080/xxl-job-admin
### 执行器通讯 TOKEN [选填]：非空时启用
xxl.job.accessToken=default_token
### 执行器 AppName [选填]：执行器心跳注册分组依据；为空则关闭自动注册
xxl.job.executor.appname=xxl-job-executor-sample
### 执行器注册 [选填]：优先使用该配置作为注册地址，为空时使用内嵌服务 “IP:PORT” 作为注册地址。从而更灵活的支持容器类型执行器动态 IP 和动态映射端口问题
xxl.job.executor.address=
### 执行器IP [选填]：默认为空表示自动获取 IP，多网卡时可手动设置指定 IP，该 IP 不会绑定 Host 仅作为通讯实用；地址信息用于“执行器注册”和“调度中心请求并触发任务”
xxl.job.executor.ip=127.0.0.1
### 执行器端口号 [选填]：小于等于 0 则自动获取：默认端口为 9999，单机部署多个执行器时，注意要配置不同执行器端口
xxl.job.executor.port=9999
### 执行器运行日志文件存储磁盘路径 [选填]：需要对该路径拥有读写权限；为空则使用默认路径
xxl.job.executor.logpath=/data/applogs/xxl-job/jobhandler
### 执行器日志文件保存天数 [选填]：过期日志自动清理, 限制值大于等于 3 时生效; 否则, 如 -1, 关闭自动清理功能
xxl.job.executor.logretentiondays=30
```

添加执行器配置，创建 `XxlJobConfig` 配置对象：

```java
@Configuration
public class XxlJobConfig {

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;
    @Value("${xxl.job.accessToken}")
    private String accessToken;
    @Value("${xxl.job.executor.appname}")
    private String appname;
    @Value("${xxl.job.executor.address}")
    private String address;
    @Value("${xxl.job.executor.ip}")
    private String ip;
    @Value("${xxl.job.executor.port}")
    private int port;
    @Value("${xxl.job.executor.logpath}")
    private String logPath;
    @Value("${xxl.job.executor.logretentiondays}")
    private int logRetentionDays;

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setAddress(address);
        xxlJobSpringExecutor.setIp(ip);
        xxlJobSpringExecutor.setPort(port);
        xxlJobSpringExecutor.setAccessToken(accessToken);
        xxlJobSpringExecutor.setLogPath(logPath);
        xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);
        return xxlJobSpringExecutor;
    }
}
```

添加任务处理类，交给 Spring 容器管理，在处理方法上加上 `@XxlJob` 注解：

```java
@Component
public class SimpleXxlJob {

    @XxlJob("demoJobHandler")
    public void demoJobHandler() throws Exception {
        System.out.println("执行定时任务，执行时间：" + new Date());
    }
}
```

运行执行器程序后，在调度中心平台上可以看到在线的执行器：

![](https://img.sherry4869.com/blog/it/java/xxl-job/4.png)

登录调度中心，在任务管理中新增任务，配置内容如下：

![](https://img.sherry4869.com/blog/it/java/xxl-job/5.png)

接着在操作栏中启动定时调度任务：

![](https://img.sherry4869.com/blog/it/java/xxl-job/6.png)

## GLUE 模式

任务以源码方式维护在调度中心，支持通过 Web IDE 在线更新，实时编译和生效，因此不需要指定 `JobHandler`

GLUE 模式(Java) 运行模式的任务实际上是一段继承自 `IJobHandler` 的 Java 类代码，它在执行器项目中运行，可使用 [@Resource](https://github.com/Resource) / [@Autowire](https://github.com/Autowire) 注入执行器里中的其他服务

在执行器中添加 Service：

```java
@Service
public class HelloService {
    
    public void methodA() {
        System.out.println("执行 MethodA 的方法");
    }

    public void methodB() {
        System.out.println("执行 MethodB 的方法");
    }
}
```

![](https://img.sherry4869.com/blog/it/java/xxl-job/7.png)

通过 GLUE IDE 在线编辑代码：

![](https://img.sherry4869.com/blog/it/java/xxl-job/8.png)

编写内容如下：

```java
package com.xxl.job.service.handler;

import cn.wolfcode.xxljobdemo.service.HelloService;
import com.xxl.job.core.handler.IJobHandler;
import org.springframework.beans.factory.annotation.Autowired;

public class DemoGlueJobHandler extends IJobHandler {
    
    @Autowired
    private HelloService helloService;

    @Override
    public void execute() throws Exception {
        helloService.methodA();
    }
}
```

此时我们可以执行任务调度测试一下。如果执行器的控制台出现 `Exception in thread "xxl-job, EmbedServer bizThreadPool-41653061" java.lang.NoClassDefFoundError: javax/annotation/Resource` 的错误，说明当前你项目中的 JDK 版本在 17 以上，JDK17 已经移除了 `@Resource` 注解（SpringBoot3 要求 JDK17 作为最低版本），因此 xxl-job 会引用不到，需要手动在项目里添加依赖：

```xml
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
</dependency>
```

## 执行器集群

在 IDEA 中设置 SpringBoot 项目运行开启多个集群。启动两个 SpringBoot 程序，需要修改 Tomcat 端口和执行器端口：

Tomcat 端口 8082 程序的命令行参数如下：

```shell
-Dserver.port=8082 -Dxxl.job.executor.port=9998
```

Tomcat 端口 8083 程序的命令行参数如下：

```shell
-Dserver.port=8083 -Dxxl.job.executor.port=9999
```

![](https://img.sherry4869.com/blog/it/java/xxl-job/9.png)

![](https://img.sherry4869.com/blog/it/java/xxl-job/10.png)

![](https://img.sherry4869.com/blog/it/java/xxl-job/11.png)

在任务管理中，修改路由策略，修改成【轮询】：

![](https://img.sherry4869.com/blog/it/java/xxl-job/12.png)

重启任务之后我们可以看到定时任务会在这两台机器中进行轮询的执行

## 调度路由算法

当执行器集群部署时，提供丰富的路由策略，包括：

- FIRST（第一个）：固定选择第一个机器

- LAST（最后一个）：固定选择最后一个机器

- ROUND（轮询）：依次的选择在线的机器发起调度

- RANDOM（随机）：随机选择在线的机器

- CONSISTENT_HASH（一致性HASH）：每个任务按照 Hash 算法固定选择某一台机器，且所有任务均匀散列在不同机器上

- LEAST_FREQUENTLY_USED（最不经常使用）：使用频率最低的机器优先被选举

- FAILOVER（故障转移）：按照顺序依次进行心跳检测，第一个心跳检测成功的机器选定为目标执行器并发起调度

- BUSYOVER（忙碌转移）：按照顺序依次进行空闲检测，第一个空闲检测成功的机器选定为目标执行器并发起调度

- SHARDING_BROADCAST(分片广播)：广播触发对应集群中所有机器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务

## 分片案例

需求：我们现在实现这样的需求，在指定节假日，需要给平台的所有用户去发送祝福的短信

在数据库中导入 `xxl_job_demo.sql` 数据：

[xxl_job_demo.sql](https://img.sherry4869.com/blog/it/java/xxl-job/xxl_job_demo.sql)

添加依赖：

```xml
<!--MyBatis驱动-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>
<!--mysql驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.31</version>
</dependency>
<!--lombok依赖-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.10</version>
</dependency>
```

如果你使用的是 SpringBoot3，那么 `mybatis-spring-boot-starter` 依赖需要升级到 3.0 以上

添加配置：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/xxl_job_demo?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=UTF-8
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.username=root
spring.datasource.password=password
```

添加实体类：

```java
@Data
public class UserMobilePlan {

    private Long id; // 主键
    
    private String username; // 用户名

    private String nickname; // 昵称

    private String phone; // 手机号码

    private String info; // 备注
}
```

添加 `Mapper` 处理类：

```java
@Mapper
public interface UserMobilePlanMapper {

    @Select("select * from t_user_mobile_plan")
    List<UserMobilePlan> selectAll();
}
```

启动类添加 `@MapperScan`，基于包扫描 MyBatis 的接口：

```java {2}
@SpringBootApplication
@MapperScan(basePackages = "com.mw.mapper")
public class XxlJobDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(XxlJobDemoApplication.class, args);
    }

}
```

任务处理实现：

```java
@Component
public class SimpleXxlJob {

    @Autowired
    private UserMobilePlanMapper userMobilePlanMapper;

    @XxlJob("sendMsgHandler")
    public void sendMsgHandler() throws Exception {
        List<UserMobilePlan> userMobilePlans = userMobilePlanMapper.selectAll();
        System.out.println("处理任务数据量：" + userMobilePlans.size());
        long startTime = System.currentTimeMillis();
        userMobilePlans.forEach(item -> {
            try {
                // 模拟发送短信操作
                TimeUnit.MILLISECONDS.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        System.out.println("任务耗时：" + (System.currentTimeMillis() - startTime) + "毫秒");
    }
}
```

调度中心任务配置信息：

![](https://img.sherry4869.com/blog/it/java/xxl-job/13.png)

任务执行结果：

```text
处理任务数据量：2000
任务耗时：31081毫秒
```

**分片概念讲解：**

比如我们的案例中有 2000 条数据，如果不采取分片形式的话，任务只会在一台机器上执行，这样的话需要 30+ 秒才能执行完任务

如果采取分片广播的形式的话，一次任务调度将会广播触发对应集群中所有执行器执行一次任务，同时系统自动传递分片参数；可根据分片参数开发分片任务

![路由策略：分片广播](https://img.sherry4869.com/blog/it/java/xxl-job/14.png)

获取分片参数方式：

```java
// 可参考 Sample 示例执行器中的示例任务 "ShardingJobHandler" 了解试用 
int shardIndex = XxlJobHelper.getShardIndex(); // 分片索引
int shardTotal = XxlJobHelper.getShardTotal(); // 分片总数
```

如果启动了两个执行器，

通过这两个参数，我们可以通过求模取余的方式，分别查询，分别执行，这样的话就可以提高处理的速度

之前 2000 条数据只在一台机器上执行需要 30+ 秒才能完成任务，分片后，有两台机器可以共同完成 2000 条数据，每台机器处理 1000 条数据，这样的话只需要 15+ 秒就能完成任务

**案例改造成任务分片：**

`Mapper` 增加查询方法：

```java {4-5}
@Mapper
public interface UserMobilePlanMapper {
    
    @Select("select * from t_user_mobile_plan where mod(id,#{shardingTotal})=#{shardingIndex}")
    List<UserMobilePlan> selectByMod(@Param("shardingIndex") Integer shardingIndex, @Param("shardingTotal") Integer shardingTotal);

    @Select("select * from t_user_mobile_plan")
    List<UserMobilePlan> selectAll();
}
```

任务处理实现：

```java
@Component
public class SimpleXxlJob {

    @Autowired
    private UserMobilePlanMapper userMobilePlanMapper;

    @XxlJob("sendMsgHandler")
    public void sendMsgHandler() throws Exception {
        int shardIndex = XxlJobHelper.getShardIndex();
        int shardTotal = XxlJobHelper.getShardTotal();
        List<UserMobilePlan> userMobilePlans = null;
        if (shardTotal == 1){
            // 如果没有分片就直接查询所有数据
            userMobilePlans = userMobilePlanMapper.selectAll();
        }else{
            userMobilePlans = userMobilePlanMapper.selectByMod(shardIndex, shardTotal);
        }
        System.out.println("处理任务数据量：" + userMobilePlans.size());
        long startTime = System.currentTimeMillis();
        userMobilePlans.forEach(item -> {
            try {
                // 模拟发送短信操作
                TimeUnit.MILLISECONDS.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        System.out.println("任务耗时：" + (System.currentTimeMillis() - startTime) + "毫秒");
    }
}
```

端口 8082 程序控制台输出：

```text
处理任务数据量：1000
任务耗时：15534毫秒
```

端口 8083 程序控制台输出：

```text
处理任务数据量：1000
任务耗时：15533毫秒
```