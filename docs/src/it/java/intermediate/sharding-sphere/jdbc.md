---
category: IT
order: 3
article: false
---

# ShardingSphere-JDBC

ShardingSphere-JDBC 定位为轻量级 Java 框架，在 Java 的 JDBC 层提供的额外服务。 它使用客户端直连数据库，以 JAR 包形式提供服务，无需额外部署和依赖，可理解为增强版的 JDBC 驱动，完全兼容 JDBC 和各种 ORM 框架

- 适用于任何基于 JDBC 的 ORM 框架，如：JPA，Hibernate，Mybatis，Spring JDBC Template 或直接使用 JDBC

- 支持任何第三方的数据库连接池，如：DBCP，C3P0，BoneCP，HikariCP 等

- 支持任意实现 JDBC 规范的数据库，目前支持 MySQL，PostgreSQL，Oracle，SQLServer 以及任何可使用 JDBC 访问的数据库

![](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/jdbc/img.png)

[ShardingSphere 5.1.2 官方文档](https://shardingsphere.apache.org/document/5.1.2/cn/overview/)

[ShardingSphere 5.2.1 官方文档](https://shardingsphere.apache.org/document/5.2.1/cn/overview/)

## 相关依赖

::: tabs

@tab 5.1.2 pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.12.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mw</groupId>
    <artifactId>ShardingSphere-JDBC</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>ShardingSphere-JDBC</name>
    <description>ShardingSphere-JDBC</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.shardingsphere</groupId>
            <artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>
            <version>5.1.2</version>
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

@tab 5.2.1 pom

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.12.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mw</groupId>
    <artifactId>ShardingSphere-JDBC</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>ShardingSphere-JDBC</name>
    <description>ShardingSphere-JDBC</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.apache.shardingsphere</groupId>
            <artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>
            <version>5.2.1</version>
        </dependency>

        <dependency>
            <groupId>org.yaml</groupId>
            <artifactId>snakeyaml</artifactId>
            <version>1.33</version>
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

:::

## 读写分离

### 准备服务器

参考 [一主多从配置](/it/java/intermediate/sharding-sphere/mysql-zctb/#一主多从)

### 相关配置

::: tabs

@tab 5.1.2 properties

```properties
# 服务端口
server.port=8085
# 应用名称
spring.application.name=ShardingSphere-JDBC
# 开发环境设置
spring.profiles.active=dev
# 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
spring.shardingsphere.mode.type=Memory

# 配置真实数据源
spring.shardingsphere.datasource.names=master,slave1,slave2
# 配置主服务器 master 数据源
spring.shardingsphere.datasource.master.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.master.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.master.jdbc-url=jdbc:mysql://${ip}:3307/db_user
spring.shardingsphere.datasource.master.username=root
spring.shardingsphere.datasource.master.password=123456
# 配置从服务器 slave1 数据源
spring.shardingsphere.datasource.slave1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.slave1.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.slave1.jdbc-url=jdbc:mysql://${ip}:3308/db_user
spring.shardingsphere.datasource.slave1.username=root
spring.shardingsphere.datasource.slave1.password=123456
# 配置从服务器 slave2 数据源
spring.shardingsphere.datasource.slave2.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.slave2.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.slave2.jdbc-url=jdbc:mysql://${ip}:3309/db_user
spring.shardingsphere.datasource.slave2.username=root
spring.shardingsphere.datasource.slave2.password=123456

# 读写分离配置
# 读写分离逻辑数据源名称 readwrite_ds（自定义）；读写分离类型：静态 Static，动态 Dynamic
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.type=Static
# 写数据源名称
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.props.write-data-source-name=master
# 读数据源名称，多个从数据源用逗号分隔
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.props.read-data-source-names=slave1,slave2

# 负载均衡算法配置
# 负载均衡算法名称 alg_round（自定义）
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.load-balancer-name=alg_round
# 负载均衡算法类型：轮询算法 ROUND_ROBIN，随机访问算法 RANDOM，权重访问算法 WEIGHT
spring.shardingsphere.rules.readwrite-splitting.load-balancers.alg_round.type=ROUND_ROBIN

# 打印 SQL
spring.shardingsphere.props.sql-show=true
```

@tab 5.1.2 yaml

```yaml
spring:
  application:
    # 应用名称
    name: ShardingSphere-JDBC
  profiles:
    # 开发环境配置
    active: dev
  shardingsphere:
    mode:
      # 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
      type: Memory
    datasource:
      # 配置真实数据源
      names: master,slave1,slave2
      # 配置主服务器 master 数据源
      master:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3307/db_user
        username: root
        password: 123456
      # 配置从服务器 slave1 数据源
      slave1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3308/db_user
        username: root
        password: 123456
      # 配置从服务器 slave2 数据源
      slave2:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3309/db_user
        username: root
        password: 123456
    rules:
      # 读写分离配置
      readwrite-splitting:
        data-sources:
          # 读写分离逻辑数据源名称 readwrite_ds（自定义）
          readwrite_ds:
            # 读写分离类型：静态 Static，动态 Dynamic
            type: Static
            props:
              # 写数据源名称
              write-data-source-name: master
              # 读数据源名称，多个从数据源用逗号分隔
              read-data-source-names: slave1,slave2
            # 负载均衡算法名称（自定义）
            load-balancer-name: alg_round
        # 负载均衡算法配置
        load-balancers:
          alg_round:
            # 负载均衡算法类型：轮询算法 ROUND_ROBIN，随机访问算法 RANDOM，权重访问算法 WEIGHT
            type: ROUND_ROBIN
    props:
      # 打印 SQL
      sql-show: true
server:
  # 服务端口
  port: 8085
```

@tab 5.2.1 properties

```properties
# 服务器端口号
server.port=8085
# 应用名称
spring.application.name=ShardingSphere-JDBC
# 开发环境设置
spring.profiles.active=dev
# 运行模式类型：单机模式 Standalone；集群模式 Cluster
spring.shardingsphere.mode.type=Standalone
# 久化仓库配置
spring.shardingsphere.mode.repository.type=JDBC

# 配置真实数据源
spring.shardingsphere.datasource.names=master,slave1,slave2
# 配置主服务器 master 数据源
spring.shardingsphere.datasource.master.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.master.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.master.jdbc-url=jdbc:mysql://${ip}:3307/db_user
spring.shardingsphere.datasource.master.username=root
spring.shardingsphere.datasource.master.password=123456
# 配置从服务器 slave1 数据源
spring.shardingsphere.datasource.slave1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.slave1.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.slave1.jdbc-url=jdbc:mysql://${ip}:3308/db_user
spring.shardingsphere.datasource.slave1.username=root
spring.shardingsphere.datasource.slave1.password=123456
# 配置从服务器 slave2 数据源
spring.shardingsphere.datasource.slave2.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.slave2.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.slave2.jdbc-url=jdbc:mysql://${ip}:3309/db_user
spring.shardingsphere.datasource.slave2.username=root
spring.shardingsphere.datasource.slave2.password=123456

# 读写分离配置
# 读写分离逻辑数据源名称 readwrite_ds（自定义）；读写分离类型：静态 static-strategy；动态 dynamic-strategy
# 写数据源名称
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.static-strategy.write-data-source-name=master
# 读数据源名称，多个从数据源用逗号分隔
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.static-strategy.read-data-source-names=slave1,slave2

# 负载均衡算法配置
# 负载均衡算法名称 alg_round（自定义）
spring.shardingsphere.rules.readwrite-splitting.data-sources.readwrite_ds.load-balancer-name=alg_round
# 负载均衡算法类型：轮询算法 ROUND_ROBIN，随机访问算法 RANDOM，权重访问算法 WEIGHT
spring.shardingsphere.rules.readwrite-splitting.load-balancers.alg_round.type=ROUND_ROBIN

# 打印 SQL
spring.shardingsphere.props.sql-show=true
```

@tab 5.2.1 yaml

```yaml
spring:
  application:
    # 应用名称
    name: ShardingSphere-JDBC
  profiles:
    # 开发环境配置
    active: dev
  shardingsphere:
    mode:
      # 运行模式类型：单机模式 Standalone；集群模式 Cluster
      type: Standalone
      # 久化仓库配置
      repository:
        type: JDBC
    datasource:
      # 配置真实数据源
      names: master,slave1,slave2
      # 配置主服务器 master 数据源
      master:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3307/db_user
        username: root
        password: 123456
      # 配置从服务器 slave1 数据源
      slave1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3308/db_user
        username: root
        password: 123456
      # 配置从服务器 slave2 数据源
      slave2:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3309/db_user
        username: root
        password: 123456
    rules:
      # 读写分离配置
      readwrite-splitting:
        data-sources:
          # 读写分离逻辑数据源名称 readwrite_ds（自定义）
          readwrite_ds:
            # 读写分离类型：静态 static-strategy；动态 dynamic-strategy
            static-strategy:
              # 写库数据源名称
              write-data-source-name: master
              # 读库数据源名称，多个从数据源用逗号分隔
              read-data-source-names: slave1,slave2
            # 负载均衡算法名称 alg_round（自定义）
            load-balancer-name: alg_round
        # 负载均衡算法配置
        load-balancers:
          alg_round:
            # 负载均衡算法类型：轮询算法 ROUND_ROBIN，随机访问算法 RANDOM，权重访问算法 WEIGHT
            type: ROUND_ROBIN
    props:
      # 打印 SQL
      sql-show: true
server:
  # 服务端口
  port: 8085
```

:::

### 写入测试

```java
@SpringBootTest
public class ShardingSphereJdbcApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testInsert() {
        User user = new User();
        user.setUname("test");
        userMapper.insert(user);
    }
}
```

```text
Logic SQL: INSERT INTO t_user  ( uname )  VALUES  ( ? )
Actual SQL: master ::: INSERT INTO t_user  ( uname )  VALUES  ( ? ) ::: [test]
```

Logic（逻辑）SQL 指的是应用程序在数据源 readwrite_ds 里执行的 SQL，通过 ShardingSphere-JDBC 来判断 readwrite_ds 数据源中（master，slave1，slave2）的写数据源是什么

Actual（实际）SQL 往主服务器 master 数据源中执行写入 SQL

### 事务测试

::: tabs

@tab 未开启事务
```java
@SpringBootTest
public class ShardingSphereJdbcApplicationTests {

    @Autowired
    private UserMapper userMapper;
    
    @Test
    public void testTrans(){
        User user = new User();
        user.setUname("test2");
        userMapper.insert(user);

        List<User> users = userMapper.selectList(null);
    }
}
```

```text
Logic SQL: INSERT INTO t_user  ( `uname` )  VALUES  ( ? )
Actual SQL: master ::: INSERT INTO t_user  ( `uname` )  VALUES  ( ? ) ::: [test2]

Logic SQL: SELECT  id,uname  FROM t_user
Actual SQL: slave1 ::: SELECT  id,uname  FROM t_user
```

日志里显示 Actual SQL 的写操作是在写服务器 master 中执行，读操作是在读服务器 slave1 中执行

@tab 开启事务
```java
@SpringBootTest
public class ShardingSphereJdbcApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    @Transactional
    public void testTrans(){
        User user = new User();
        user.setUname("test2");
        userMapper.insert(user);

        List<User> users = userMapper.selectList(null);
    }
}
```

```text
Logic SQL: INSERT INTO t_user  ( uname )  VALUES  ( ? )
Actual SQL: master ::: INSERT INTO t_user  ( uname )  VALUES  ( ? ) ::: [test2]

Logic SQL: SELECT  id,uname  FROM t_user
Actual SQL: master ::: SELECT  id,uname  FROM t_user

Rolled back transaction for test
```

`@Transactional` 注解的作用是定义一个数据库事务的范围，它可以控制事务的传播行为、隔离级别、超时时间等属性。在 Spring Boot 测试中，如果使用了 `@Transactional` 注解，那么测试方法结束后，默认会回滚事务，以避免对数据库造成污染。如果想要提交事务，可以使用 @Commit 或 @Rollback(false) 注解

ShardingSphere-JDBC 在主从模型中如果使用了 `@Transactional` 注解，那么默认会选择主库进行操作，并且不会切换到从库。这是为了保证主从库间的事务一致性和完整性，避免跨服务的分布式事务

:::

### 负载均衡测试

```java
@SpringBootTest
public class ShardingSphereJdbcApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testSelectAll() {
        List<User> users = userMapper.selectList(null);
        List<User> users2 = userMapper.selectList(null);
    }
}
```

```text
Logic SQL: SELECT  id,uname  FROM t_user
Actual SQL: slave1 ::: SELECT  id,uname  FROM t_user

Logic SQL: SELECT  id,uname  FROM t_user
Actual SQL: slave2 ::: SELECT  id,uname  FROM t_user
```

## 垂直分片

### 准备服务器

![服务器规划：使用 Docker 创建容器](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/jdbc/img.png)

- 服务器：容器名 mw-server-user，端口 3301

- 服务器：容器名 mw-server-order，端口 3302

1. 创建 mw-server-user 容器

    ```shell
    docker run -d -p 3301:3306 \
    -v /mw/server/user/conf:/etc/mysql/conf.d \
    -v /mw/server/user/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-server-user \
    mysql:8.0.31
    ```
   
2. 进入 MySQL 容器并登录账户

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-server-user env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行登录账户
    mysql -u root -p
    ```

3. 创建 db_user 数据库

    ```sql
    create database db_user;
    use db_user;
    create table t_user (
    id bigint auto_increment,
    uname varchar(30),
    primary key (id)
    );
    ```

---
   
1. 创建 mw-server-order 容器

    ````shell
    docker run -d -p 3302:3306 \
    -v /mw/server/order/conf:/etc/mysql/conf.d \
    -v /mw/server/order/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-server-order \
    mysql:8.0.31
    ````

2. 进入 MySQL 容器并登录账户

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-server-order env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行登录账户
    mysql -u root -p
    ```
   
3. 创建 db_order 数据库

    ```sql
    create database db_order;
    use db_order;
    create table t_order (
    id bigint auto_increment,
    order_no varchar(30),
    user_id bigint,
    amount decimal(10,2),
    primary key(id)
    );
    ```

### 相关配置

::: tabs

@tab 5.1.2 properties

```properties
# 服务端口
server.port=8085
# 应用名称
spring.application.name=ShardingSphere-JDBC
# 开发环境设置
spring.profiles.active=dev
# 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
spring.shardingsphere.mode.type=Memory

# 配置真实数据源
spring.shardingsphere.datasource.names=server-user,server-order
# 配置第 1 个数据源
spring.shardingsphere.datasource.server-user.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-user.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-user.jdbc-url=jdbc:mysql://${ip}:3301/db_user
spring.shardingsphere.datasource.server-user.username=root
spring.shardingsphere.datasource.server-user.password=123456
# 配置第 2 个数据源
spring.shardingsphere.datasource.server-order.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-order.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-order.jdbc-url=jdbc:mysql://${ip}:3302/db_order
spring.shardingsphere.datasource.server-order.username=root
spring.shardingsphere.datasource.server-order.password=123456

# 数据分片规则配置（数据节点配置）
# spring.shardingsphere.rules.sharding.tables.<table-name>.actual-data-nodes=值；<table-name>：逻辑表名（@TableName("t_user")）
# 值由数据源名 + 表名组成，以小数点分隔
spring.shardingsphere.rules.sharding.tables.t_user.actual-data-nodes=server-user.t_user
spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes=server-order.t_order

# 打印 SQL
spring.shardingsphere.props.sql-show=true
```

@tab 5.1.2 yaml

```yaml
spring:
  application:
    # 应用名称
    name: ShardingSphere-JDBC
  profiles:
    # 开发环境配置
    active: dev
  shardingsphere:
    mode:
      # 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
      type: Memory
    datasource:
      # 配置真实数据源
      names: server-user,server-order
      server-user:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3301/db_user
        username: root
        password: 123456
      server-order:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3302/db_order
        username: root
        password: 123456
    rules:
      sharding:
        # 数据分片规则配置（数据节点配置）
        tables:
          # 逻辑表名称（@TableName("t_user")）
          t_user:
            # 由数据源名 + 表名组成
            actual-data-nodes: server-user.t_user
          # 逻辑表名称（@TableName("t_order")）
          t_order:
            # 由数据源名 + 表名组成
            actual-data-nodes: server-order.t_order
    props:
      # 打印 SQL
      sql-show: true
server:
  # 服务端口
  port: 8085
```

@tab 5.2.1 properties

```properties
# 服务端口
server.port=8085
# 应用名称
spring.application.name=ShardingSphere-JDBC
# 开发环境设置
spring.profiles.active=dev
# 运行模式类型：单机模式 Standalone；集群模式 Cluster
spring.shardingsphere.mode.type=Standalone
# 久化仓库配置
spring.shardingsphere.mode.repository.type=JDBC

# 配置真实数据源
spring.shardingsphere.datasource.names=server-user,server-order
# 配置第 1 个数据源
spring.shardingsphere.datasource.server-user.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-user.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-user.jdbc-url=jdbc:mysql://${ip}:3301/db_user
spring.shardingsphere.datasource.server-user.username=root
spring.shardingsphere.datasource.server-user.password=123456
# 配置第 2 个数据源
spring.shardingsphere.datasource.server-order.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-order.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-order.jdbc-url=jdbc:mysql://${ip}:3302/db_order
spring.shardingsphere.datasource.server-order.username=root
spring.shardingsphere.datasource.server-order.password=123456

# 数据分片规则配置（数据节点配置）
# spring.shardingsphere.rules.sharding.tables.<table-name>.actual-data-nodes=值；<table-name>：逻辑表名（@TableName("t_user")）
# 值由数据源名 + 表名组成，以小数点分隔
spring.shardingsphere.rules.sharding.tables.t_user.actual-data-nodes=server-user.t_user
spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes=server-order.t_order

# 打印 SQL
spring.shardingsphere.props.sql-show=true
```

@tab 5.2.1 yaml

```yaml
spring:
  application:
    # 应用名称
    name: ShardingSphere-JDBC
  profiles:
    # 开发环境配置
    active: dev
  shardingsphere:
    mode:
      # 运行模式类型：单机模式 Standalone；集群模式 Cluster
      type: Standalone
      # 久化仓库配置
      repository:
        type: JDBC
    datasource:
      # 配置真实数据源
      names: server-user,server-order
      server-user:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3301/db_user
        username: root
        password: 123456
      server-order:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://${ip}:3302/db_order
        username: root
        password: 123456
    rules:
      sharding:
        # 数据分片规则配置（数据节点配置）
        tables:
          # 逻辑表名称（@TableName("t_user")）
          t_user:
            # 由数据源名 + 表名组成
            actual-data-nodes: server-user.t_user
          # 逻辑表名称（@TableName("t_order")）
          t_order:
            # 由数据源名 + 表名组成
            actual-data-nodes: server-order.t_order
    props:
      # 打印 SQL
      sql-show: true
server:
  # 服务端口
  port: 8085
```

:::

逻辑表 t_user 和 t_order 映射到真实的数据节点 server-user.t_user 和 server-order.t_order。在应用程序中只要是针对 t_user 逻辑表进行 CRUD 操作时，ShardingSphere-JDBC 就会把所有执行指令路由到 server-user 数据源的 t_user 真实表上

### 垂直分库测试

```java
@SpringBootTest
public class ShardingSphereJdbcApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Test
    @Transactional
    public void testInsertUserAndOrder(){
        User user = new User();
        user.setUname("test3");
        userMapper.insert(user);

        Order order = new Order();
        order.setOrderNo("001");
        order.setUserId(user.getId());
        order.setAmount(new BigDecimal(100));
        orderMapper.insert(order);
    }
}
```

```text
Logic SQL: INSERT INTO t_user  ( uname )  VALUES  ( ? )
Actual SQL: server-user ::: INSERT INTO t_user  ( uname )  VALUES  (?) ::: [test3]

Logic SQL: INSERT INTO t_order  ( order_no, user_id, amount )  VALUES  ( ?, ?, ? )
Actual SQL: server-order ::: INSERT INTO t_order  ( order_no, user_id, amount )  VALUES  (?, ?, ?) ::: [001, 1, 100]

Rolled back transaction for test
```

## 水平分片

### 准备服务器

把用于测试测试垂直分片的 mw-server-order 容器停止运行，创建 mw-server-order0，mw-server-order1 两个 MySQL 容器，并分别创建两张 order 分片数据表

![服务器规划：使用 docker 创建容器](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/jdbc/img_1.png)

- 服务器：容器名 mw-server-order0，端口 3310

- 服务器：容器名 mw-server-order1，端口 3311

1. 创建 mw-server-order0 容器

    ```shell
    docker run -d -p 3310:3306 \
    -v /mw/server/order0/conf:/etc/mysql/conf.d \
    -v /mw/server/order0/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-server-order0 \
    mysql:8.0.31
    ```

2. 进入 MySQL 容器并登录账户

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-server-order env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行登录账户
    mysql -u root -p
    ```
   
3. 创建 db_order 数据库

    注意：水平分片的 ID 需要在业务层实现，不能依赖数据库的主键自增

    ```sql
    create database db_order;
    use db_order;
    create table t_order0 (
    id bigint,
    order_no varchar(30),
    user_id bigint,
    amount decimal(10,2),
    primary key(id)
    );
    create table t_order1 (
    id bigint,
    order_no varchar(30),
    user_id bigint,
    amount decimal(10,2),
    primary key(id)
    );
    ```

---

1. 创建 mw-server-order1 容器

    ```shell
    docker run -d -p 3311:3306 \
    -v /mw/server/order1/conf:/etc/mysql/conf.d \
    -v /mw/server/order1/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-server-order1 \
    mysql:8.0.31
    ```

2. 进入 MySQL 容器并登录账户

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-server-order env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行登录账户
    mysql -u root -p
    ```

3. 创建 db_order 数据库

   注意：水平分片的 ID 需要在业务层实现，不能依赖数据库的主键自增

    ```sql
    create database db_order;
    use db_order;
    create table t_order0 (
    id bigint,
    order_no varchar(30),
    user_id BIGINT,
    amount decimal(10,2),
    primary key(id)
    );
    create table t_order1 (
    id bigint,
    order_no varchar(30),
    user_id bigint,
    amount decimal(10,2),
    primary key(id)
    );
    ```

### 相关配置

::: tabs

@tab 5.1.2 properties

```properties
# 应用名称
spring.application.name=ShardingSphere-JDBC
# 服务端口
server.port=8085
# 开发环境配置
spring.profiles.active=dev

# 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
spring.shardingsphere.mode.type=Memory
spring.shardingsphere.datasource.names=server-user,server-order0,server-order1

spring.shardingsphere.datasource.server-user.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-user.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-user.jdbc-url=jdbc:mysql://${ip}:3301/db_user
spring.shardingsphere.datasource.server-user.username=root
spring.shardingsphere.datasource.server-user.password=123456

spring.shardingsphere.datasource.server-order0.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-order0.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-order0.jdbc-url=jdbc:mysql://${ip}:3310/db_order
spring.shardingsphere.datasource.server-order0.username=root
spring.shardingsphere.datasource.server-order0.password=123456

spring.shardingsphere.datasource.server-order1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.server-order1.driver-class-name=com.mysql.jdbc.Driver
spring.shardingsphere.datasource.server-order1.jdbc-url=jdbc:mysql://${ip}:3311/db_order
spring.shardingsphere.datasource.server-order1.username=root
spring.shardingsphere.datasource.server-order1.password=123456

# 数据分片规则配置（数据节点配置）由数据源名 + 表名组成，以小数点分隔
# 逻辑表名称 t_user
spring.shardingsphere.rules.sharding.tables.t_user.actual-data-nodes=server-user.t_user

# 由数据源名 + 表名组成，以小数点分隔。多个表以逗号分隔，支持 inline 表达式
spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes=server-order$->{0..1}.t_order$->{0..1}
# 分库策略配置：分片列名称 user_id；分片算法名称（自定义）alg_mod
spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-column=user_id
spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-algorithm-name=alg_mod
# 分表策略配置（当一个数据源有多张表时，根据策略把数据分配到不同的表当中）分片列名称 order_no；分片算法名称（自定义）alg_hash_mod
spring.shardingsphere.rules.sharding.tables.t_order.table-strategy.standard.sharding-column=order_no
spring.shardingsphere.rules.sharding.tables.t_order.table-strategy.standard.sharding-algorithm-name=alg_hash_mod
# 分布式序列策略配置：分布式序列列名称 id；分布式序列算法名称 alg_snowflake
spring.shardingsphere.rules.sharding.tables.t_order.key-generate-strategy.column=id
spring.shardingsphere.rules.sharding.tables.t_order.key-generate-strategy.key-generator-name=alg_snowflake

# 由数据源名 + 表名组成，以小数点分隔。多个表以逗号分隔，支持 inline 表达式
spring.shardingsphere.rules.sharding.tables.t_order_item.actual-data-nodes=server-order$->{0..1}.t_order_item$->{0..1}
# 分库策略配置：分片列名称 user_id；分片算法名称（自定义）alg_mod
spring.shardingsphere.rules.sharding.tables.t_order_item.database-strategy.standard.sharding-column=user_id
spring.shardingsphere.rules.sharding.tables.t_order_item.database-strategy.standard.sharding-algorithm-name=alg_mod
# 分表策略配置（当一个数据源有多张表时，根据策略把数据分配到不同的表当中）分片列名称 order_no；分片算法名称（自定义）alg_hash_mod
spring.shardingsphere.rules.sharding.tables.t_order_item.table-strategy.standard.sharding-column=order_no
spring.shardingsphere.rules.sharding.tables.t_order_item.table-strategy.standard.sharding-algorithm-name=alg_hash_mod
# 分布式序列策略配置：分布式序列列名称 id；分布式序列算法名称 alg_snowflake
spring.shardingsphere.rules.sharding.tables.t_order_item.key-generate-strategy.column=id
spring.shardingsphere.rules.sharding.tables.t_order_item.key-generate-strategy.key-generator-name=alg_snowflake

# 数据节点可不配置，默认情况下向所有数据源广播
spring.shardingsphere.rules.sharding.tables.t_dict.actual-data-nodes=server-user.t_dict,server-order$->{0..1}.t_dict

# 分片算法配置
# 分片算法类型：使用了标准分片算法中的行表达式分片算法 INLINE
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_inline_userid.type=INLINE
# 分片算法的行表达式
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_inline_userid.props.algorithm-expression=server-order$->{user_id % 2}
# 分片算法类型：使用了自动分片算法中的取模分片算法 MOD
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_mod.type=MOD
# 分片数量（数据源数量）
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_mod.props.sharding-count=2
# 分片算法类型：使用了自动分片算法中的取模分片算法 MOD
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.type=HASH_MOD
# 分片数量（数据源数量）
spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.props.sharding-count=2

# 分布式序列算法配置
# 分布式序列算法类型：雪花算法 SNOWFLAKE
spring.shardingsphere.rules.sharding.key-generators.alg_snowflake.type=SNOWFLAKE

# 绑定表配置
spring.shardingsphere.rules.sharding.binding-tables[0]=t_order,t_order_item

# 广播表配置
spring.shardingsphere.rules.sharding.broadcast-tables[0]=t_dict

# 打印 SQL
spring.shardingsphere.props.sql-show=true
```

@tab 5.1.2 yaml

```yaml
spring:
  application:
    # 应用名称
    name: ShardingSphere-JDBC
  profiles:
    # 开发环境配置
    active: dev
  shardingsphere:
    mode:
      # 运行模式类型：内存模式 Memory；单机模式 Standalone；集群模式 Cluster
      type: Memory
    datasource:
      # 配置真实数据源
      names: server-user,server-order0,server-order1
      server-user:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://ip:3301/db_user
        username: root
        password: 123456
      server-order0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://ip:3310/db_order
        username: root
        password: 123456
      server-order1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.jdbc.Driver
        jdbc-url: jdbc:mysql://ip:3311/db_order
        username: root
        password: 123456
    rules:
      sharding:
        # 数据分片规则配置（数据节点配置）
        tables:
          # 逻辑表名称
          t_user:
            # 由数据源名 + 表名组成，以小数点分隔
            actual-data-nodes: server-user.t_user
          # 逻辑表名称
          t_order:
            # 由数据源名 + 表名组成，以小数点分隔。多个表以逗号分隔，支持 inline 表达式
            # actual-data-nodes: server-order0.t_order0,server-order0.t_order1,server-order1.t_order0,server-order1.t_order1
            actual-data-nodes: server-order$->{0..1}.t_order$->{0..1}
            # 分库策略配置
            database-strategy:
              standard:
                # 分片列名称
                sharding-column: user_id
                # 分片算法名称（自定义）
                sharding-algorithm-name: alg_mod
            # 分表策略配置（当一个数据源有多张表时，根据策略把数据分配到不同的表当中）
            table-strategy:
              standard:
                # 分片列名称
                sharding-column: order_no
                # 分片算法名称（自定义）
                sharding-algorithm-name: alg_hash_mod
            # 分布式序列策略配置
            key-generate-strategy:
              # 分布式序列列名称
              column: id
              # 分布式序列算法名称
              key-generator-name: alg_snowflake
        # 分片算法配置
        sharding-algorithms:
          alg_inline_userid:
            # 分片算法类型：使用了标准分片算法中的行表达式分片算法 INLINE
            type: INLINE
            # 分片算法属性配置
            props:
              # 分片算法的行表达式
              algorithm-expression: server-order$->{user_id % 2}
          alg_mod:
            # 分片算法类型：使用了自动分片算法中的取模分片算法 MOD
            type: MOD
            props:
              # 分片数量（数据源数量）
              sharding-count: 2
          alg_hash_mod:
            # 分片算法类型：使用了自动分片算法中的哈希取模分片算法 HASH_MOD
            type: HASH_MOD
            props:
              # 分片数量（数据源数量）
              sharding-count: 2
        # 分布式序列算法配置
        key-generators:
          alg_snowflake:
            # 分布式序列算法类型：雪花算法 SNOWFLAKE
            type: SNOWFLAKE
    props:
      # 打印 SQL
      sql-show: true
server:
  # 服务端口
  port: 8085
```

:::

[行表达式使用说明](https://shardingsphere.apache.org/document/5.1.2/cn/features/sharding/concept/inline-expression/)

`spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes: server-order$->{0..1}.t_order$->{0..1}`

---

[ShardingShpere 5.1.2 内置算法文档](https://shardingsphere.apache.org/document/5.1.2/cn/user-manual/shardingsphere-jdbc/builtin-algorithm/)

[ShardingShpere 5.2.1 内置算法文档](https://shardingsphere.apache.org/document/5.2.1/cn/user-manual/common-config/builtin-algorithm/)

- 分库策略配置

    分片列名称，根据 user_id 进行分片：  
    `spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-column=user_id`
    
    分片算法名称 alg_inline_userid（自定义）：  
    `spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-algorithm-name=alg_inline_userid`

- 分表策略配置

    分片列名称，根据 order_no 进行分片：  
    `spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-column=order_no`

    分片算法名称 alg_mod（自定义）：  
    `spring.shardingsphere.rules.sharding.tables.t_order.database-strategy.standard.sharding-algorithm-name=alg_mod`

- 分片算法配置

    - 行表达式分片算法
  
      分片算法类型：使用了标准分片算法中的行表达式分片算法 INLINE  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_inline_userid.type=INLINE`
    
      分片算法属性配置，分片算法的行表达式：order 表中当 user_id 值为偶数时，数据插入 server-order0 数据源，当 user_id 值为奇数时，数据插入 server-order1 数据源。这样分片的好处是，同一个用户的订单数据，一定会被插入到同一台服务器上，查询一个用户的订单时效率较高  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_inline_userid.props.algorithm-expression=server-order$->{user_id % 2}`
    
    - 取模分片算法

      分片算法类型：使用了自动分片算法中的取模分片算法 MOD  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_mod.type=MOD`
    
      分片算法属性配置，配置分片数量（数据源数量）  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_mod.props.sharding-count=2`

    - 哈希取模分片算法

      分片算法类型：使用了自动分片算法中的哈希取模分片算法 HASH_MOD。当想对字符串值做取模运算时，可以使用哈希取模分片算法  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.type=HASH_MOD`

      分片算法属性配置，配置分片数量（数据源数量）  
      `spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.props.sharding-count=2`

### 水平分库测试

**在未配置水平分库算法时测试：**

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {
    
    @Autowired
    private OrderMapper orderMapper;

    @Test
    @Transactional
    public void testInsertOrder() {
        Order order = new Order();
        order.setOrderNo("001");
        order.setUserId(1L);
        order.setAmount(new BigDecimal(100));
        orderMapper.insert(order);
    }
}
```

```text
org.mybatis.spring.MyBatisSystemException: nested exception is org.apache.ibatis.exceptions.PersistenceException:  
Error updating database.  Cause: java.lang.IllegalStateException: Insert statement does not support sharding table routing to multiple data nodes.
```

在未配置分库算法配置时，插入语句不支持将分片数据路由到不同的数据节点中，也就是说当前插入的这条记录究竟是向 server-order0 数据源中的 t_order0 表或 t_order1 表插入还是说向 server-order1 数据源中的 t_order0 表或 t_order1 表插入，应用程序判断不出来。因为 Order 类映射的 @TableName("t_order") 是一个逻辑表名，并不指向真实表

先测试单个数据节点是否好使。修改配置文件为单个数据节点：`spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes=server-order0.t_order0` 并再次运行测试用例

```text
org.springframework.dao.DataIntegrityViolationException:  
Error updating database.  Cause: java.sql.SQLException: Field 'id' doesn't have a default value
```

在数据库表中没有给主键设置任何主键自增策略，在业务代码级别上也没有去插入 ID 值，因此 ID 为空

在 Order 类上的主键 ID 成员变量上新增 MyBatis Plus 分布式 ID 主键策略 `@TableId(type = IdType.ASSIGN_ID)`

```text
Logic SQL: INSERT INTO t_order  ( id, order_no, user_id, amount )  VALUES  ( ?, ?, ?, ? )
Actual SQL: server-order0 ::: INSERT INTO t_order0  ( id, order_no, user_id, amount )  VALUES  (?, ?, ?, ?) ::: [1633002541862031361, 001, 1, 100]

Rolled back transaction for test
```

分别测试剩下三个数据分片（server-order0.t_order1，server-order1.t_order0，server-order1.t_order1）数据源中的节点是否可用

---

**在已配置水平分库算法时测试：**

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {
    
    @Autowired
    private OrderMapper orderMapper;

    @Test
    @Transactional
    public void testInsertOrderDatabaseStrategy() {
        for (long i = 0; i < 4; i++) {
            Order order = new Order();
            order.setOrderNo("001");
            order.setUserId(i + 1);
            order.setAmount(new BigDecimal(100));
            orderMapper.insert(order);
        }
    }
}
```

```text
SQL: INSERT INTO t_order  ( id, order_no, user_id, amount )  VALUES  ( ?, ?, ?, ? )
Cause: java.lang.IllegalStateException: Insert statement does not support sharding table routing to multiple data nodes.
```

配置分库策略后但没有配置分表策略，因此不知道是向 t_order0 表插入记录还是 t_order1 表插入记录，因此先固定一张数据表测试

修改配置文件：`spring.shardingsphere.rules.sharding.tables.t_order.actual-data-nodes=server-order$->{0..1}.t_order0`

```text
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633737396220567554, 001, 1, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633737400343568385, 001, 2, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633737400729444353, 001, 3, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633737400989491202, 001, 4, 100]
```

通过配置标准分片算法中的行表达式分片算法 INLINE，分片算法的行表达式： `server-order$->{user_id % 2}` 后测试当 user_id 为基数（1，3）时，数据插入到了 server-order1 数据源中，当 user_id 为偶数（2，4）时，数据插入到了 server-order0 数据源中

通过配置自动分片算法中的取模分片算法 MOD，分片数量 2（数据源数量）后的测试和上述 INLINE 行表达式 `server-order$->{user_id % 2}` 结果一样，都是判断 user_id 的基偶值来判断往那个数据源当中插入数据

### 水平分表测试

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {
    
    @Autowired
    private OrderMapper orderMapper;

    @Test
    @Transactional
    public void testInsertOrderTableStrategy() {
        for (long i = 100; i < 104; i++) {
            Order order = new Order();
            order.setOrderNo("Order" + i);
            order.setUserId(1L); //固定用户id，相当于指定往 server-order1 数据源插入数据
            order.setAmount(new BigDecimal(100));
            orderMapper.insert(order);
        }
    }
}
```

如果分表策略配置中的分片算法设置为取模分片算法 MOD，将会报错：

```text
SQL: INSERT INTO t_order  ( id, order_no, user_id, amount )  VALUES  ( ?, ?, ?, ? )
Cause: java.lang.NumberFormatException: For input string: "xxx100"
```

因为取模分片算法数据类型为 int ，因此可以使用哈希取模分片算法

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Test
    public void testHashMod() {
        System.out.println("Order100".hashCode() % 2); //1
        System.out.println("Order101".hashCode() % 2); //0
        System.out.println("Order102".hashCode() % 2); //1
        System.out.println("Order103".hashCode() % 2); //0
    }
}
```

```properties
spring.shardingsphere.rules.sharding.tables.t_order_item.table-strategy.standard.sharding-column=order_no

spring.shardingsphere.rules.sharding.tables.t_order_item.table-strategy.standard.sharding-algorithm-name=alg_hash_mod

spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.type=HASH_MOD

spring.shardingsphere.rules.sharding.sharding-algorithms.alg_hash_mod.props.sharding-count=2
```

再次运行测试用例：

```text
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633760239339659265, Order100, 1, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633760241973682177, Order101, 1, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633760242103705602, Order102, 1, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1633760242166620162, Order103, 1, 100]
```

测试用例中指定了 user_id 为 1，因此该用例没有根据 user_id 进行分库，而是为了测试分表操作对 order_no 做哈希取模运算

### 水平分库分表查询

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Test
    public void testInsertOrderDatabaseTableStrategy() {
        for (long i = 1; i < 5; i++) {
            Order order = new Order();
            order.setOrderNo("Order" + i);
            order.setUserId(1L);
            order.setAmount(new BigDecimal(100));
            orderMapper.insert(order);
        }

        for (long i = 5; i < 9; i++) {
            Order order = new Order();
            order.setOrderNo("Order" + i);
            order.setUserId(2L);
            order.setAmount(new BigDecimal(100));
            orderMapper.insert(order);
        }
    }
}
```

```text
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021508097470466, Order1, 1, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021511306113026, Order2, 1, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021511499051009, Order3, 1, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order1 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021511624880130, Order4, 1, 100]

Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021511817818114, Order5, 2, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021512593764353, Order6, 2, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order1  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021512719593473, Order7, 2, 100]
Logic SQL: INSERT INTO t_order  ( id,order_no,user_id,amount )  VALUES  ( ?,?,?,? )
Actual SQL: server-order0 ::: INSERT INTO t_order0  ( id,order_no,user_id,amount )  VALUES  (?, ?, ?, ?) ::: [1634021512916725761, Order8, 2, 100]
```

分库策略使用取模分片算法，因此当 user_id 值为 1 的数据都插入到 server-order1 数据源中，user_id 值为 2 的数据都插入到 server-order0 数据源中；分表策略使用哈希取模算法，因此当 order_no 的哈希取模值为 1 的数据都插入到 t_order 1 表中， order_no 的哈希取模值为 0 的数据都插入到 t_order0 表中

---

当查询所有订单表记录时，实际 SQL 会根据分库分表策略查询所有数据源中的所有分表记录

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private OrderMapper orderMapper;

    @Test
    public void testShardingSelectAll() {
        List<Order> orders = orderMapper.selectList(null);
        orders.forEach(System.out::print);
    }
}
```

```text
Logic SQL: SELECT  id,order_no,user_id,amount  FROM t_order

Actual SQL: server-order0 ::: SELECT  id,order_no,user_id,amount  FROM t_order0 UNION ALL SELECT  id,order_no,user_id,amount  FROM t_order1
Actual SQL: server-order1 ::: SELECT  id,order_no,user_id,amount  FROM t_order0 UNION ALL SELECT  id,order_no,user_id,amount  FROM t_order1
```

---

当根据 user_id 来查询订单记录时，因为分库策略中配置的分片列是 user_id ，因此当查询值为 1 的 user_id 时将会查询 server-order1 的数据源

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private OrderMapper orderMapper;
    
    @Test
    public void testShardingSelectByUserId() {
        List<Order> orders = orderMapper.selectList(new QueryWrapper<Order>().eq("user_id", 1L));
        orders.forEach(System.out::println);
    }
}
```

```text
Logic SQL: SELECT  id,order_no,user_id,amount  FROM t_order WHERE (user_id = ?)

Actual SQL: server-order1 ::: SELECT  id,order_no,user_id,amount  FROM t_order0 WHERE (user_id = ?) UNION ALL SELECT  id,order_no,user_id,amount  FROM t_order1  WHERE (user_id = ?) ::: [1, 1]
```

## 分布式序列算法

### 实现动机

传统数据库软件开发中，主键自动生成技术是基本需求。而各个数据库对于该需求也提供了相应的支持，比如 MySQL 的自增键，Oracle 的自增序列等。数据分片后，不同数据节点生成全局唯一主键是非常棘手的问题。同一个逻辑表内的不同实际表之间的自增键由于无法互相感知而产生重复主键。虽然可通过约束自增主键初始值和步长的方式避免碰撞，但需引入额外的运维规则，使解决方案缺乏完整性和可扩展性

目前有许多第三方解决方案可以完美解决这个问题，如 UUID 等依靠特定算法自生成不重复键，或者通过引入主键生成服务等。为了方便用户使用、满足不同用户不同使用场景的需求， Apache ShardingSphere 不仅提供了内置的分布式主键生成器，例如 UUID、SNOWFLAKE，还抽离出分布式主键生成器的接口，方便用户自行实现自定义的自增主键生成器

[ShardingSphere 分布式主键文档](https://shardingsphere.apache.org/document/5.1.2/cn/features/sharding/concept/key-generator/)

### 雪花算法 SNOWFLAKE

#### 实现原理

在同一个进程中，它首先是通过时间位保证不重复，如果时间相同则是通过序列位保证。 同时由于时间位是单调递增的，且各个服务器如果大体做了时间同步，那么生成的主键在分布式环境可以认为是总体有序的，这就保证了对索引字段的插入的高效性。例如 MySQL 的 Innodb 存储引擎的主键

使用雪花算法生成的主键，二进制表示形式包含 4 部分，从高位到低位分表为：1bit 符号位、41bit 时间戳位、10bit 工作进程位以及 12bit 序列号位

- 符号位（1bit）

  预留的符号位，恒为零

- 时间戳位（41bit）

  41 位的时间戳可以容纳的毫秒数是 2 的 41 次幂，一年所使用的毫秒数是 365 * 24 * 60 * 60 * 1000。通过计算可知：
  ```text
  Math.pow(2, 41) / (365 * 24 * 60 * 60 * 1000L);
  ```
  结果约等于 69.73 年。Apache ShardingSphere 的雪花算法的时间纪元从 2016年11月1日 零点开始，可以使用到 2086 年，相信能满足绝大部分系统的要求

- 工作进程位（10bit）

  该标志在 Java 进程内是唯一的，如果是分布式应用部署应保证每个工作进程的 id 是不同的。该值默认为 0，可通过属性设置

- 序列号位（12bit）

  该序列是用来在同一个毫秒内生成不同的 ID。如果在这个毫秒内生成的数量超过 4096 (2 的 12 次幂)，那么生成器会等待到下个毫秒继续生成

![雪花算法主键的详细结构图](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/jdbc/img_2.png)

#### 时钟回拨

服务器时钟回拨会导致产生重复序列，因此默认分布式主键生成器提供了一个最大容忍的时钟回拨毫秒数。如果时钟回拨的时间超过最大容忍的毫秒数阈值，则程序报错；如果在可容忍的范围内，默认分布式主键生成器会等待时钟同步到最后一次主键生成的时间后再继续工作。最大容忍的时钟回拨毫秒数的默认值为 0，可通过属性设置

### 分布式序列配置

[ShardingSphere 分布式序列算法配置文档](https://shardingsphere.apache.org/document/5.1.2/cn/user-manual/shardingsphere-jdbc/builtin-algorithm/keygen/)

水平分片需要关注全局序列，因为不能简单的使用基于数据库的主键自增

这里有两种方案：一种是基于 MyBatisPlus 的 id 策略；一种是 ShardingSphere-JDBC 的全局序列配置

- 基于MyBatisPlus的id策略：将 Order 类的 id 配置 `@TableId(type = IdType.ASSIGN_ID)` 注解

- 基于 ShardingSphere-JDBC 的全局序列配置：和 MyBatisPlus 的主键策略二选一
  ```properties
  # 分布式序列策略配置
  # 分布式序列列名称
  spring.shardingsphere.rules.sharding.tables.t_order.key-generate-strategy.column=id
  # 分布式序列算法名称 alg_snowflake（自定义）
  spring.shardingsphere.rules.sharding.tables.t_order.key-generate-strategy.key-generator-name=alg_snowflake
  # 分布式序列算法配置
  # 分布式序列算法类型
  spring.shardingsphere.rules.sharding.key-generators.alg_snowflake.type=SNOWFLAKE
  ```

  MyBatisPlus 主键策略中 `IdType.ASSIGN_ID` 的优先级比 `IdType.AUTO` 要高

  ```java
  @TableName("t_order")
  @Data
  public class Order {
  
      //当配置了 ShardingSphere-JDBC 的分布式序列时，自动使用 ShardingSphere-JDBC 的分布式序列
      //当没有配置 ShardingSphere-JDBC 的分布式序列时，自动依赖数据库的主键自增策略
      @TableId(type = IdType.AUTO)
      //@TableId(type = IdType.ASSIGN_ID) //指定主键生成策略使用雪花算法（默认策略）
      private Long id;

      private String orderNo;

      private Long userId;

      private BigDecimal amount;
  }
  ```

## 多表关联

### 创建关联表

在 server-order0、server-order1 服务器中分别创建两张订单详情表 t_order_item0、t_order_item1

需求：希望同一个用户的订单表和订单详情表中的数据都在同一个数据源中，避免跨库关联，因此这两张表我们使用相同的分片策略。在 t_order_item 中我们也需要创建 order_no 和 user_id 这两个分片键

```sql
create table t_order_item0(
    id bigint,
    order_no varchar(30),
    user_id bigint,
    price decimal(10,2),
    `count` int,
    primary key(id)
);

CREATE TABLE t_order_item1(
    id bigint,
    order_no varchar(30),
    user_id bigint,
    price decimal(10,2),
    `count` int,
    primary key(id)
);
```

### 相关配置

t_order_item 的分片表、分片策略、分布式序列策略和 t_order 一致

```java
@TableName("t_order_item")
@Data
public class OrderItem {

    //当配置了 ShardingSphere-JDBC 的分布式序列时，自动使用 ShardingSphere-JDBC 的分布式序列
    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    private Long userId;

    private BigDecimal price;

    private Integer count;
}
```

```java
@Mapper
public interface OrderItemMapper extends BaseMapper<OrderItem> {

}
```

### 测试

先把原先 server-order0 和 server-order1 数据源中的 t_order0 和 t_order1 数据表给清空，然后执行下面的测试用例

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Test
    public void testInsertOrderAndOrderItem() {
        for (long i = 1; i < 5; i++) {
            Order order = new Order();
            order.setOrderNo("Order" + i);
            order.setUserId(1L);
            orderMapper.insert(order);
            //模拟一个订单有多个订单项
            for (int j = 1; j < 3; j++) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderNo("Order" + i);
                orderItem.setUserId(1L);
                orderItem.setPrice(new BigDecimal(10));
                orderItem.setCount(2);
                orderItemMapper.insert(orderItem);
            }
        }
        for (long i = 5; i < 9; i++) {
            Order order = new Order();
            order.setOrderNo("Order" + i);
            order.setUserId(2L);
            orderMapper.insert(order);
            //模拟一个订单有多个订单项
            for (int j = 1; j < 3; j++) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderNo("Order" + i);
                orderItem.setUserId(2L);
                orderItem.setPrice(new BigDecimal(20));
                orderItem.setCount(3);
                orderItemMapper.insert(orderItem);
            }
        }
    }
}
```

```sql
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651947315396608, 'Order6', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651947424448513, 'Order6', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651948078759936, 'Order8', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651948196200449, 'Order8', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651946975657985, 'Order5', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651947088904192, 'Order5', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651947659329537, 'Order7', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651947780964352, 'Order7', 2, 20.00, 3);
INSERT INTO `db_order`.`t_order0` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651947206344705, 'Order6', 2, NULL);
INSERT INTO `db_order`.`t_order0` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651947902599169, 'Order8', 2, NULL);
INSERT INTO `db_order`.`t_order1` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651946677862400, 'Order5', 2, NULL);
INSERT INTO `db_order`.`t_order1` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651947541889024, 'Order7', 2, NULL);

INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651945729949696, 'Order2', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651945876750337, 'Order2', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651946463952896, 'Order4', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item0` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651946568810497, 'Order4', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651945360850945, 'Order1', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651945511845888, 'Order1', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651946094854145, 'Order3', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order_item1` (`id`, `order_no`, `user_id`, `price`, `count`) VALUES (841651946254237696, 'Order3', 1, 10.00, 2);
INSERT INTO `db_order`.`t_order0` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651945625092097, 'Order2', 1, NULL);
INSERT INTO `db_order`.`t_order0` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651946359095297, 'Order4', 1, NULL);
INSERT INTO `db_order`.`t_order1` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651944903671808, 'Order1', 1, NULL);
INSERT INTO `db_order`.`t_order1` (`id`, `order_no`, `user_id`, `amount`) VALUES (841651945985802240, 'Order3', 1, NULL);
```

## 绑定表

指分片规则一致的一组分片表。使用绑定表进行多表关联查询时，必须使用**分片键**进行关联，否则会出现笛卡尔积关联或跨库关联，从而影响查询效率

需求：查询每个订单的订单号和总订单金额

先验证 SQL 写的是否正确：

```sql
select
	o.order_no,
	SUM( i.price * i.count ) as amount 
from
	t_order0 o
	join t_order_item0 i on o.order_no = i.order_no 
group by
	o.order_no
```

运行结果：

```text
Order6	120.00
Order8	120.00
```

### 相关配置

```properties
spring.shardingsphere.rules.sharding.binding-tables[0]=t_order,t_order_item
```

把测试 SQL 语句复制到 `@Select` 注解里面，把实际表名改成逻辑表名。以数组形式来写 SQL 的话 `@Select` 会自动把字符串数组里的元素结尾补上空格并拼接成 SQL 语句

```java
@Mapper
public interface OrderMapper extends BaseMapper<Order> {

    @Select({"SELECT o.order_no, SUM(i.price * i.count) AS amount",
            "FROM t_order o JOIN t_order_item i ON o.order_no = i.order_no",
            "GROUP BY o.order_no"})
    List<OrderVo> getOrderAmount();

}
```

### 测试

当未配置 `spring.shardingsphere.rules.sharding.binding-tables[0]=t_order,t_order_item` 时执行测试用例：

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private OrderMapper orderMapper;

    @Test
    public void testGetOrderAmount() {
        List<OrderVo> orderAmountList = orderMapper.getOrderAmount();
        orderAmountList.forEach(System.out::println);
    }
}
```

```text
Logic SQL: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order o JOIN t_order_item i ON o.order_no = i.order_no GROUP BY o.order_no

Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
```

因为之前配置了分片策略，t_order_item0 订单项表的订单号只会和 t_order0 订单表的订单号做关联，因此 t_order_item0 表中的订单是不会在 t_order1 表中找到的，因此目前出现了笛卡尔积关联，server-order0 和 server-order1 数据源中都分别查询多了 2 次不相关的 SQL

---

当配置 `spring.shardingsphere.rules.sharding.binding-tables[0]=t_order,t_order_item` 时执行测试用例：

```text
Logic SQL: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order o JOIN t_order_item i ON o.order_no = i.order_no GROUP BY o.order_no

Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order0 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order0 o JOIN t_order_item0 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
Actual SQL: server-order1 ::: SELECT o.order_no, SUM(i.price * i.count) AS amount FROM t_order1 o JOIN t_order_item1 i ON o.order_no = i.order_no GROUP BY o.order_no ORDER BY o.order_no ASC
```

如果不配置绑定表：测试的结果为执行了 8 条查询 SQL，多表关联查询会出现笛卡尔积关联

如果配置绑定表：测试的结果为执行了 4 条查询 SQL，多表关联查询不会出现笛卡尔积关联，关联查询效率将大大提升

## 广播表

指所有的分片数据源中都存在的表，表结构及其数据在每个数据库中均完全一致。适用于数据量不大且需要与海量数据的表进行关联查询的场景，例如字典表

广播具有以下特性：

- 插入、更新操作会实时在所有节点上执行，保持各个分片的数据一致性
- 查询操作，只从一个节点获取
- 可以跟任何一个表进行 JOIN 操作

### 相关配置

在 server-order0、server-order1 和 server-user 服务器中分别创建 t_dict 广播表

```sql
create table t_dict(
    id bigint,
    dict_type varchar(200),
    primary key(id)
);
```

```properties
#数据节点可不配置，默认情况下，向所有数据源广播
spring.shardingsphere.rules.sharding.tables.t_dict.actual-data-nodes=server-user.t_dict,server-order$->{0..1}.t_dict

# 广播表配置
spring.shardingsphere.rules.sharding.broadcast-tables[0]=t_dict
```

```java
@TableName("t_dict")
@Data
public class Dict {

    //可以使用 MyBatisPlus 的雪花算法
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String dictType;
}
```

```java
@Mapper
public interface DictMapper extends BaseMapper<Dict> {

}
```

### 测试

广播表插入测试：每个服务器中的 t_dict 表都同时添加了新数据

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private DictMapper dictMapper;

    @Test
    public void testBroadcast() {
        Dict dict = new Dict();
        dict.setDictType("type1");
        dictMapper.insert(dict);
    }
}
```

SQL 日志：

```text
Logic SQL: INSERT INTO t_dict  ( id,dict_type )  VALUES  ( ?,? )

Actual SQL: server-user ::: INSERT INTO t_dict  ( id,dict_type )  VALUES  (?, ?) ::: [1634835933343686657, type1]
Actual SQL: server-order0 ::: INSERT INTO t_dict  ( id,dict_type )  VALUES  (?, ?) ::: [1634835933343686657, type1]
Actual SQL: server-order1 ::: INSERT INTO t_dict  ( id,dict_type )  VALUES  (?, ?) ::: [1634835933343686657, type1]
```

---

广播表查询测试：只从一个节点获取数据（随机负载均衡规则）

```java
@SpringBootTest
class ShardingSphereJdbcApplicationTests {

    @Autowired
    private DictMapper dictMapper;

    @Test
    public void testSelectBroadcast() {
        List<Dict> dicts = dictMapper.selectList(null);
        dicts.forEach(System.out::println);
    }
}
```

```text
Logic SQL: SELECT  id,dict_type  FROM t_dict

Actual SQL: server-order0 ::: SELECT  id,dict_type  FROM t_dict Dict(id=1634835933343686657, dictType=type1)
```