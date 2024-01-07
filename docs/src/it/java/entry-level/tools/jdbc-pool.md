---
category: IT
article: false
---

# 数据库连接池

使用数据库连接池可以减轻数据库服务器的负担，提高系统性能，并提供一种有效的资源管理机制，特别是在需要频繁数据库访问的应用程序中。连接池在实际应用中是一个非常常见和重要的数据库优化手段，以下是数据库连接池的具体作用：

- 连接重用：数据库连接是一种资源，创建和销毁连接会消耗系统资源和时间。连接池会在应用程序启动时预先创建一定数量的数据库连接，并在需要时将它们分配给应用程序。连接使用完毕后，不会立即关闭，而是释放回连接池以便后续重用。这避免了频繁地创建和关闭连接，减轻了数据库服务器的负担

- 连接管理：连接池负责管理连接的状态，包括连接的打开、关闭、空闲等。它确保连接的可用性，并在需要时创建新地连接或关闭闲置的连接。这样可以避免由于未关闭连接或连接泄漏而导致的性能问题

- 性能提升：通过连接池，应用程序可以更有效地利用数据库连接，减少了创建和关闭连接的开销，提高了数据库访问的性能。连接池还可以调整连接的配置，以适应不同负载下的需求，进一步提升性能

- 连接池大小控制：连接池允许配置最大连接数和最小连接数，这样可以灵活地控制连接池的规模。在低负载时，连接池可以缩小规模以减少资源占用；在高负载时，连接池可以扩大规模以满足需求

- 故障恢复：连接池可以监控数据库连接的健康状况，及时检测到失效的连接，并尝试重新建立连接。这提高了系统的稳定性和可靠性

- 事务管理：一些连接池提供了事务管理的支持，可以在事务提交或回滚时处理连接的状态。这确保了事务的一致性，并简化了开发者的工作

```sql
-- 查看 MySQL 当前最大连接数：
SHOW VARIABLES LIKE 'max_connections';
-- 默认最大连接数为 151，修改最大连接数
SET GLOBAL max_connections = 1000;
-- 重启服务 service mysql restart
```

## HikariCP

[HikariCP](https://github.com/brettwooldridge/HikariCP) 是一个轻量级、高性能的连接池。它被认为是当前性能最好地连接池之一，具有低延迟和高吞吐量的特点。HikariCP 的配置简单，且在大多数场景下表现优秀

```properties
# 数据源类型为 HikariCP
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
# 数据库驱动类
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
#  数据库连接 URL
spring.datasource.url=jdbc:mysql://localhost:3306/mydatabase
#  数据库用户名
spring.datasource.username=root
# 数据库密码
spring.datasource.password=rootpassword
##################    连接池配置    ##################
# 连接超时时间，表示从连接池获取连接的最大等待时间（毫秒）
spring.datasource.hikari.connection-timeout=60000
# 连接校验超时时间，表示在获取连接时，等待连接校验的最大等待时间（毫秒）每隔多久去校验一次连接是否有效
spring.datasource.hikari.validation-timeout=10000
# 连接空闲超时时间，表示连接在连接池中空闲多久后会被回收（毫秒），超时且没有使用则被释放，默认值是10分钟
spring.datasource.hikari.idle-timeout=60000
# 接生命周期最大时间，表示连接在连接池中存在的最大时间（毫秒），超时且没有被使用则被释放，默认值是30分钟
spring.datasource.hikari.max-lifetime=60000
# 连接池的最大连接数，表示连接池中允许存在的最多连接数 当前CPU核数×2
spring.datasource.hikari.maximum-pool-size=24
# 连接池的最小空闲连接数，表示连接池中保持的最小连接数
spring.datasource.hikari.minimum-idle=24
# 是否自动提交事务
spring.datasource.hikari.auto-commit=true
# 用于检测连接是否有效的 SQL 查询语句
spring.datasource.hikari.connection-test-query=select 1
# 连接池的名称
spring.datasource.hikari.pool-name=DataSourceHikariCP
```

## Apache DBCP

[Apache DBCP](https://commons.apache.org/proper/commons-dbcp/)（Database Connection Pool）是 Apache 软件基金会的一个项目，提供了一个简单的数据库连接池实现。虽然不如 HikariCP 性能强大，但在轻量级项目中仍然是一个常见的选择

待更新

## C3P0

[C3P0](https://github.com/swaldman/c3p0) 是一个开源的 JDBC 数据库连接池。它提供了连接池和 JNDI 数据源的实现。C3P0 相对成熟，使用广泛，但在高负载情况下可能不如 HikariCP

待更新

## Tomcat JDBC Pool

[Tomcat JDBC Pool](https://tomcat.apache.org/tomcat-9.0-doc/jdbc-pool.html) 是 Apache Tomcat 项目的一部分。它是一个功能强大的数据库连接池，与 Tomcat 集成良好。它的特点包括支持高并发、低延迟、预处理语句缓存等

待更新

## Druid

[Druid](https://github.com/alibaba/druid) 是阿里巴巴开源的数据库连接池。它不仅提供了连接池功能，还包括了监控、防火墙、日志等一系列功能。Druid 是一个全能的连接池，适用于需要综合性能和监控的应用

### 安装依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.8</version>
</dependency>
```

### 连接池配置

::: tabs

@tab application.properties

```properties
# mysql 配置
# spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# spring.datasource.username=root
# spring.datasource.password=root
# spring.datasource.url=jdbc:mysql://localhost:3306/yourdatabase
# druid 数据库配置
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.druid.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.druid.url=jdbc:mysql://localhost:3306/mydatabase
spring.datasource.druid.username=root
spring.datasource.druid.password=rootpassword
##################    连接池配置    ##################
# 连接池建立时创建的初始化连接数
spring.datasource.druid.initial-size=5
# 连接池中最大的活跃连接数
spring.datasource.druid.max-active=20
# 连接池中最小的活跃连接数
spring.datasource.druid.min-idle=5
# 配置获取连接等待超时的时间
spring.datasource.druid.max-wait=60000
# 打开PSCache，并且指定每个连接上 PSCache 的大小
spring.datasource.druid.pool-prepared-statements=true
spring.datasource.druid.max-pool-prepared-statement-per-connection-size=20
spring.datasource.druid.validation-query=SELECT 1 FROM DUAL
spring.datasource.druid.validation-query-timeout=30000
# 是否在获得连接后检测其可用性
spring.datasource.druid.test-on-borrow=false
# 是否在连接放回连接池后检测其可用性
spring.datasource.druid.test-on-return=false
# 是否在连接空闲一段时间后检测其可用性
spring.datasource.druid.test-while-idle=true
# 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
spring.datasource.druid.time-between-eviction-runs-millis=60000
# 配置一个连接在池中最小生存的时间，单位是毫秒
spring.datasource.druid.min-evictable-idle-time-millis=300000
# 是否启用StatFilter默认值 false
spring.datasource.druid.web-stat-filter.enabled=true
# 是否启用StatViewServlet（监控页面）默认值为false（考虑到安全问题默认并未启动，如需启用建议设置密码或白名单以保障安全）
spring.datasource.druid.stat-view-servlet.enabled=true
spring.datasource.druid.filter.stat.enabled=true
# 监控后台账号和密码
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=admin
```

@tab application.yml

```yaml
spring:
  datasource:
    druid:
      url: jdbc:mysql://localhost:3306/yourdatabase
      username: root
      password: root
      driver-class-name: com.mysql.jdbc.Driver
      ##################    连接池配置    ##################
      # 连接池建立时创建的初始化连接数
      initial-size: 5
      # 连接池中最大的活跃连接数
      max-active: 20
      # 连接池中最小的活跃连接数
      min-idle: 5
      # 配置获取连接等待超时的时间
      max-wait: 60000
      max-pool-prepared-statement-per-connection-size: 20
      # 打开PSCache，并且指定每个连接上 PSCache 的大小
      pool-prepared-statements: true
      validation-query: SELECT 1 FROM DUAL
      query-timeout: 30000
      # 是否在获得连接后检测其可用性
      test-on-borrow: false
      # 是否在连接放回连接池后检测其可用性
      test-on-return: false
      # 是否在连接空闲一段时间后检测其可用性
      test-while-idle: true
      # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
      time-between-eviction-runs-millis: 60000
      # 配置一个连接在池中最小生存的时间，单位是毫秒
      min-evictable-idle-time-millis: 300000
      # 是否启用 StatFilter 默认值 false
      web-stat-filter:
        enabled: true
      filter:
        stat:
          enabled: true
      # 是否启用StatViewServlet（监控页面）默认值为false（考虑到安全问题默认并未启动，如需启用建议设置密码或白名单以保障安全）
      stat-view-servlet:
        enabled: true
        # 设置监控页面的登录名和密码
        login-username: admin
        login-password: admin
```

:::

配置完成后启动工程访问 Durid 监控界面：`http://${ip}:${port}/druid/login.html`