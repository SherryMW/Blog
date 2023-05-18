---
category: IT
tag:
  - Java
  - Apache
article: false
---

# ShardingSphere-Proxy

ShardingSphere-Proxy 定位为透明化的数据库代理端，通过实现数据库二进制协议，对异构语言提供支持。 目前提供 MySQL 和 PostgreSQL 协议，透明化数据库操作，对 DBA 更加友好

- 向应用程序完全透明，可直接当做 MySQL/PostgreSQL 使用

- 兼容 MariaDB 等基于 MySQL 协议的数据库，以及 openGauss 等基于 PostgreSQL 协议的数据库

- 适用于任何兼容 MySQL/PostgreSQL 协议的的客户端，如：MySQL Command Client, MySQL Workbench, Navicat 等

![](https://img.sherry4869.com/blog/it/apache/sharding-sphere/proxy/img.png)

## 获取方式

目前 ShardingSphere-Proxy 提供了 3 种获取方式

- [ShardingSphere-Proxy 5.1.2 二进制发布包](https://shardingsphere.apache.org/document/5.1.2/cn/user-manual/shardingsphere-proxy/startup/bin/)

- [ShardingSphere-Proxy 5.1.2 Docker](https://shardingsphere.apache.org/document/5.1.2/cn/user-manual/shardingsphere-proxy/startup/docker/)

- [ShardingSphere-Proxy 5.1.2 Helm](https://shardingsphere.apache.org/document/5.1.2/cn/user-manual/shardingsphere-proxy/startup/helm/)

### Windows

[ShardingSphere-Proxy 5.1.2 下载地址](https://archive.apache.org/dist/shardingsphere/5.1.2/)

下载 apache-shardingsphere-5.1.2-shardingsphere-proxy-bin.tar.gz 二进制发布包

1. 解压二进制包

   使用解压软件解压文件到非中文路径目录下，如：D:\software\Apache\apache-shardingsphere-5.1.2-shardingsphere-proxy-bin

2. 添加 MySQL 驱动

   打开命令提示符 CMD 输入 `mysql -V` 查看本机驱动版本，如提示【'mysql'不是内部或外部指令，也不是可运行的程序】，请检查本机的系统环境 PATH 变量中是否添加 MySQL 可运行程序路径，如：C:\Program Files\MySQL\MySQL Server 8.0\bin

   访问 [MySQL 驱动下载界面](https://dev.mysql.com/downloads/connector/j/)：Archives -> 选择和本机相同的 MySQL 版本 -> Platform Independent -> Platform Independent (Architecture Independent), ZIP Archive 下载。下载完毕并解压后打开就能看到 mysql-connector-j-8.0.x.jar 驱动文件

   在 D:\software\Apache\apache-shardingsphere-5.1.2-shardingsphere-proxy-bin 中创建 ext-lib 目录，并把下载好的 MySQL 驱动 JAR 包放至该目录下

3. 修改配置文件

   修改 apache-shardingsphere-5.1.2-shardingsphere-proxy-bin\conf 目录下的 server.yaml 配置文件

   ```yaml
   rules:
   - !AUTHORITY
     users:
       - root@%:root
       - sharding@:sharding
     provider:
         type: ALL_PERMITTED

   props:
    sql-show: true
   ```

4. 启动 ShardingSphere-Proxy

   进入 D:\software\Apache\apache-shardingsphere-5.1.2-shardingsphere-proxy-bin\bin 目录中打开命令提示符 CMD 输入 `start.bat` 指令启动，默认启动端口是 3307 ，修改默认端口的启动指令为：`start.bat ${port}`

5. 远程连接

   打开一个新的命令提示符 CMD 输入 `mysql -h${ip} -P${port} -uroot -proot` 指令

### Linux

[ShardingSphere-Proxy 5.1.2 下载地址](https://archive.apache.org/dist/shardingsphere/5.1.2/)

下载 apache-shardingsphere-5.1.2-shardingsphere-proxy-bin.tar.gz 二进制发布包

1. 解压二进制包

   将二进制包文件上传至 /opt 目录，并解压到当前目录下
   ```shell
   tar -zxvf /opt/apache-shardingsphere-5.1.2-shardingsphere-proxy-bin.tar.gz
   ```

2. 启动 Docker 容器

   ```shell
   docker run -d \
   -v /mw/server/proxy/conf:/opt/shardingsphere-proxy/conf \
   -v /mw/server/proxy/ext-lib:/opt/shardingsphere-proxy/ext-lib \
   -p 3321:3307 \
   --name server-proxy \
   apache/shardingsphere-proxy:5.1.2
   ```

3. 添加 MySQL 驱动

   访问 [MySQL 驱动下载界面](https://dev.mysql.com/downloads/connector/j/)：Archives -> 选择和本机相同的 MySQL 版本 -> Platform Independent -> Platform Independent (Architecture Independent), ZIP Archive 下载。下载完毕并解压后打开就能看到 mysql-connector-j-8.0.x.jar 驱动文件

   把 MySQL 驱动 JAR 包上传到 /mw/server/proxy/ext-lib 目录下

4. 新建配置文件

   在 /mw/server/proxy/conf 目录中新建 server.yaml 配置文件

   ```yaml
   rules:
   - !AUTHORITY
     users:
       - root@%:root
       - sharding@:sharding
     provider:
         type: ALL_PERMITTED

   props:
    sql-show: true
   ```
   
5. 重启容器

   重启容器加载新的配置文件

   ```shell
   docker restart server-proxy
   ```

6. 远程连接

   ```shell
   mysql -h127.0.0.1 -P3321 -uroot -proot
   ```

::: tip 常见问题

容器可以成功的创建并启动，但是无法远程连接。排除防火墙和网络等问题后，进入容器后查看 ShardingSphere-Proxy 的日志，看看是不是因为容器内存不足导致

```shell
docker exec -it server-proxy env LANG=C.UTF-8 /bin/bash
cd /opt/shardingsphere-proxy/logs
tail stdout.log
```

如出现【failed error = Cannot allocate memory】错误则说明容器可分配内存不足。解决方法：创建容器的时候使用 JVM 参数给容器分配合适的内存

需要停止正在运行的容器并删除该容器后再重新创建

```shell
docker stop server-proxy
docker rm server-proxy
```

```shell
docker run -d \
-v /mw/server/proxy/conf:/opt/shardingsphere-proxy/conf \
-v /mw/server/proxy/ext-lib:/opt/shardingsphere-proxy/ext-lib \
-e ES_JAVA_OPTS="-Xmx256m -Xms256m -Xmn128m" \
-p 3321:3307 \
--name server-proxy \
apache/shardingsphere-proxy:5.1.2
```

:::

## 读写分离

服务器准备：参考 [一主多从配置](/it/apache/sharding-sphere/mysql-zctb/#一主多从)

### 代理服务器访问实际数据源

![](https://img.sherry4869.com/blog/it/apache/sharding-sphere/proxy/img_1.png)

1. 新建配置文件

   在 /mw/server/proxy/conf 目录下新增 config-readwrite-splitting.yaml 读写分离配置文件

    ```yaml
    databaseName: readwrite_splitting_db
    
    dataSources:
     write_ds:
       url: jdbc:mysql://${ip}:3307/db_user?serverTimezone=UTC&useSSL=false
       username: root
       password: 123456
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
     read_ds_0:
       url: jdbc:mysql://${ip}:3308/db_user?serverTimezone=UTC&useSSL=false
       username: root
       password: 123456
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
     read_ds_1:
       url: jdbc:mysql://${ip}:3309/db_user?serverTimezone=UTC&useSSL=false
       username: root
       password: 123456
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
    
    rules:
    - !READWRITE_SPLITTING
     dataSources:
       readwrite_ds:
         type: Static
         props:
           write-data-source-name: write_ds
           read-data-source-names: read_ds_0,read_ds_1
         loadBalancerName: random
     loadBalancers:
       random:
         type: RANDOM
    ```

2. 重启容器

   重启容器加载新的配置文件

   ```shell
   docker restart server-proxy
   ```
   
3. 查看日志

   实时查看 ShardingSphere-Proxy 日志

   ```shell
   docker exec -it server-proxy env LANG=C.UTF-8 /bin/bash
   tail -f /opt/shardingsphere-proxy/logs/stdout.log
   ```

4. 远程访问测试

   在本地打开命令提示符 CMD 远程连接，可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL

   ```shell
   mysql -h${ip} -P3321 -uroot -proot
   ```
   
   ---

   数据库列表里能看到在读写分离配置文件中配置的 `databaseName: readwrite_splitting_db` 中间件数据库

   ```sql
   show databases;
   use readwrite_splitting_db;
   show tables;
   ```
   
   ---

   执行查询指令

   ```sql
   select * from t_user;
   select * from t_user;
   ```

   ShardingSphere-Proxy 打印的实际 SQL 日志：

   ```text
   Actual SQL: read_ds_0 ::: SELECT * FROM `t_user` LIMIT 0,1000
   Actual SQL: read_ds_1 ::: SELECT * FROM `t_user` LIMIT 0,1000
   ```
   
   ---
   
   执行插入指令

   ```sql
   insert into t_user(uname) values('wang5');
   ```

   日志：

   ```text
   Actual SQL: write_ds ::: insert into t_user(uname) values('wang5')
   ```

::: tip 常见问题

如果日志中报以下错误：

```text
Caused by: com.mysql.cj.exceptions.CJCommunicationsException: Communications link failure
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:499)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
	at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:61)
	at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:105)
	at com.mysql.cj.exceptions.ExceptionFactory.createException(ExceptionFactory.java:151)
	at com.mysql.cj.exceptions.ExceptionFactory.createCommunicationsException(ExceptionFactory.java:167)
	at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:89)
	at com.mysql.cj.NativeSession.connect(NativeSession.java:144)
	at com.mysql.cj.jdbc.ConnectionImpl.connectOneTryOnly(ConnectionImpl.java:953)
	at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:823)
	... 18 common frames omitted
Caused by: java.net.ConnectException: Connection refused
	at java.base/sun.nio.ch.Net.pollConnect(Native Method)
	at java.base/sun.nio.ch.Net.pollConnectNow(Net.java:672)
	at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(NioSocketImpl.java:542)
	at java.base/sun.nio.ch.NioSocketImpl.connect(NioSocketImpl.java:597)
	at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:327)
	at java.base/java.net.Socket.connect(Socket.java:633)
	at com.mysql.cj.protocol.StandardSocketFactory.connect(StandardSocketFactory.java:155)
	at com.mysql.cj.protocol.a.NativeSocketConnection.connect(NativeSocketConnection.java:63)
	... 21 common frames omitted
```

检查读写分离配置文件 config-readwrite-splitting.yaml 中数据源的 ${ip}、${port} 是否填写正确。如果 ${ip} 写成 127.0.0.1 或者 localhost 的话，请改为你的服务器公网 IP

:::

### 应用程序访问代理服务器

从应用程序中访问 ShardingSphere-Proxy 代理服务器

![](https://img.sherry4869.com/blog/it/apache/sharding-sphere/proxy/img_2.png)

#### 依赖

因为是中间件数据库代理，所以引用 MySQL 依赖即可

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.11</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mw</groupId>
    <artifactId>ShardingSphere-Proxy</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>ShardingSphere-Proxy</name>
    <description>ShardingSphere-Proxy</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.2</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 配置

::: tabs

@tab properties

```properties
# 应用名称
spring.application.name=ShardingSphere-Proxy
# 开发环境设置
spring.profiles.active=dev

# MySQL 数据库连接（ShardingSphere-Proxy）
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://${ip}:3321/readwrite_splitting_db?serverTimezone=GMT%2B8&useSSL=false
spring.datasource.username=root
spring.datasource.password=root

# MyBatis 日志（此处打印的是逻辑 SQL，如果想看实际 SQL 需要在 Docker ShardingSphere-Proxy 容器中查看日志）
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

@tab yaml

```yaml
# 应用名称
spring:
  application:
    name: ShardingSphere-Proxy
  profiles:
    # 开发环境设置
    active: dev
  # MySQL 数据库连接（ShardingSphere-Proxy）
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://${ip}:3321/readwrite_splitting_db?serverTimezone=GMT%2B8&useSSL=false
    username: root
    password: root
mybatis-plus:
  configuration:
    # MyBatis 日志（此处打印的是逻辑 SQL，如果想看实际 SQL 需要在 Docker ShardingSphere-Proxy 容器中查看日志）
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

:::

#### 测试

```java
@SpringBootTest
class ShardingSphereProxyApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testSelect() {
        List<User> users = userMapper.selectList(null);
        users.forEach(System.out::println);
    }
}
```

应用程序控制台打印的逻辑 SQL 日志：

```text
==>  Preparing: SELECT id,uname FROM t_user
```

ShardingSphere-Proxy 打印的实际 SQL 日志：

```text
INFO ShardingSphere-SQL - Actual SQL: read_ds_1 ::: SELECT  id,uname  FROM t_user
```

## 垂直分片

服务器准备：参考 [垂直分片服务器配置](/it/apache/sharding-sphere/jdbc/#垂直分片)

1. 新建配置文件

   在 /mw/server/proxy/conf 目录下新增 config-sharding.yaml 分片配置文件

    ```yaml
    databaseName: sharding_db
    
    dataSources:
     ds_0:
       url: jdbc:mysql://8.134.61.159:3302/db_user?serverTimezone=UTC&useSSL=false
       username: root
       password: sherry4869
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
     ds_1:
       url: jdbc:mysql://8.134.61.159:3301/db_order?serverTimezone=UTC&useSSL=false
       username: root
       password: sherry4869s
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
    
    rules:
    - !SHARDING
     tables:
       t_user:
         actualDataNodes: ds_0.t_user
       t_order:
         actualDataNodes: ds_1.t_order
    ```

2. 重启容器

   ```shell
   docker restart server-proxy
   ```

3. 查看日志

   实时查看 ShardingSphere-Proxy 日志

   ```shell
   docker exec -it server-proxy env LANG=C.UTF-8 /bin/bash
   tail -f /opt/shardingsphere-proxy/logs/stdout.log
   ```

4. 远程访问测试

   在本地打开命令提示符 CMD 远程连接，可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL

   ```shell
   mysql -h${ip} -P3321 -uroot -proot
   ```

   ---

   数据库列表里能看到在分片配置文件中配置的 `databaseName: sharding_db` 中间件数据库

   ```sql
   show databases;
   use sharding_db;
   show tables;
   ```

   ---

   执行查询指令

   ```sql
   select * from t_user;
   select * from t_order;
   ```

   ShardingSphere-Proxy 打印的实际 SQL 日志：

   ```text
   INFO ShardingSphere-SQL - Actual SQL: ds_0 ::: select * from t_user
   INFO ShardingSphere-SQL - Actual SQL: ds_1 ::: select * from t_order
   ```
   
## 水平分片

服务器准备：参考 [水平分片服务器配置](/it/apache/sharding-sphere/jdbc/#水平分片)

1. 修改配置文件

   在 /mw/server/proxy/conf 目录下修改 config-sharding.yaml 分片配置文件

    ```yaml
    databaseName: sharding_db
    
    dataSources:
     ds_user:
       url: jdbc:mysql://8.134.61.159:3301/db_user?serverTimezone=UTC&useSSL=false
       username: root
       password: sherry4869
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
     ds_order0:
       url: jdbc:mysql://8.134.61.159:3310/db_order?serverTimezone=UTC&useSSL=false
       username: root
       password: sherry4869
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
     ds_order1:
       url: jdbc:mysql://8.134.61.159:3311/db_order?serverTimezone=UTC&useSSL=false
       username: root
       password: sherry4869
       connectionTimeoutMilliseconds: 30000
       idleTimeoutMilliseconds: 60000
       maxLifetimeMilliseconds: 1800000
       maxPoolSize: 50
       minPoolSize: 1
    
    rules:
    - !SHARDING
      tables:
        t_user:
          actualDataNodes: ds_user.t_user
        t_order:
          actualDataNodes: ds_order${0..1}.t_order${0..1}
          # 水平分库规则
          databaseStrategy:
            standard:
              shardingColumn: user_id
              shardingAlgorithmName: alg_mod
          # 水平分表规则    
          tableStrategy:
            standard:
              shardingColumn: order_no
              shardingAlgorithmName: alg_hash_mod
          # 主键生成器算法
          keyGenerateStrategy:
            column: id
            keyGeneratorName: snowflake
        t_order_item:
          actualDataNodes: ds_order${0..1}.t_order_item${0..1}
          databaseStrategy:
            standard:
              shardingColumn: user_id
              shardingAlgorithmName: alg_mod
          tableStrategy:
            standard:
              shardingColumn: order_no
              shardingAlgorithmName: alg_hash_mod
          keyGenerateStrategy:
            column: id
            keyGeneratorName: snowflake
      # 绑定表
      bindingTables:
        - t_order,t_order_item
      # 广播表
      broadcastTables:
        - t_dict
      # 分片算法
      shardingAlgorithms:
        alg_inline_userid:
          type: INLINE
          props:
            algorithm-expression: server-order$->{user_id % 2}
        alg_mod:
          type: MOD
          props:
            sharding-count: 2
        alg_hash_mod:
          type: HASH_MOD
          props:
            sharding-count: 2
      # 主键生成策略配置
      keyGenerators:
        snowflake:
          type: SNOWFLAKE
    ```

2. 重启容器

   ```shell
   docker restart server-proxy
   ```

3. 查看日志

   实时查看 ShardingSphere-Proxy 日志

   ```shell
   docker exec -it server-proxy env LANG=C.UTF-8 /bin/bash
   tail -f /opt/shardingsphere-proxy/logs/stdout.log
   ```

4. 远程访问测试

   在本地打开命令提示符 CMD 远程连接，可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL

   ```shell
   mysql -h${ip} -P3321 -uroot -proot
   ```

   ---

   数据库列表里能看到在分片配置文件中配置的 `databaseName: sharding_db` 中间件数据库

   ```sql
   show databases;
   use sharding_db;
   show tables;
   ```
   
   ---

   测试水平分片

   ```sql
   select * from t_order_item;
   ```

   ShardingSphere-Proxy 打印的实际 SQL 日志：

   ```text
   INFO ShardingSphere-SQL - Actual SQL: ds_order0 ::: select * from t_order_item0 UNION ALL select * from t_order_item1
   INFO ShardingSphere-SQL - Actual SQL: ds_order1 ::: select * from t_order_item0 UNION ALL select * from t_order_item1
   ```
   
   ---

   测试水平分片

   ```sql
   select * from t_order;
   ```

   ShardingSphere-Proxy 打印的实际 SQL 日志：   

   ```text
   INFO ShardingSphere-SQL - Actual SQL: ds_order0 ::: select * from t_order0 UNION ALL select * from t_order1
   INFO ShardingSphere-SQL - Actual SQL: ds_order1 ::: select * from t_order0 UNION ALL select * from t_order1
   ```
   
   ---

   广播表查询测试：只从一个节点获取数据（随机负载均衡规则）

   ```sql
   select * from t_dict;
   select * from t_dict;
   ```

   ShardingSphere-Proxy 打印的实际 SQL 日志：

   ```text
   INFO ShardingSphere-SQL - Actual SQL: ds_order0 ::: select * from t_dict
   INFO ShardingSphere-SQL - Actual SQL: ds_user ::: select * from t_dict
   ```