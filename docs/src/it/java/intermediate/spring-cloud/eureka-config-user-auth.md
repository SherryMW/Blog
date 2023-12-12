---
category: IT
article: false
---

# Eureka 配置用户认证

Spring Cloud 是一个基于 Spring Boot 实现的云应用开发工具，它是若干个框架的集合，提供了全套的分布式系统解决方案。Spring Boot 专注于快速、方便集成的单个个体，而 Spring Cloud 是关注全局的服务治理框架。Eureka 是 Spring Cloud 的一部分，它是一个基于 REST 的服务，用于定位服务，以实现云端中间层服务发现和故障转移。Eureka 是 Netflix 开源的一个组件，Spring Cloud 将其集成在了自己的子项目中

在使用 Spring Cloud Eureka 时如果不配置用户认证的话网站会存在以下几个潜在风险：

- 安全风险：没有用户认证会导致未经授权的用户可以访问 Eureka 服务的注册表，从而获取敏感的应用程序和服务信息。攻击者可能会利用这些信息来发起其他攻击，例如拒绝服务攻击或者利用漏洞攻击应用程序和服务

- 数据泄露：未经认证的用户可以查询 Eureka 注册表中的服务信息，包括服务名称、IP 地址和端口号等敏感信息。攻击者可以利用这些信息来了解系统的结构和架构，从而发起其他攻击

- 数据篡改：未经认证的用户可以更改 Eureka 注册表中的服务信息，例如修改服务名称、IP 地址和端口号等。攻击者可能会利用这些能力来欺骗客户端，从而获取敏感信息或者访问受保护的资源

## 基于 Spring Cloud 1.x 配置

1. 在 Eureka 服务端的 `pom` 文件中添加 Security 依赖

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    ```

2. 修改 Eureka 服务端的应用程序配置文件 `application.properties` 或 `application.yml`

    ```properties
    # 服务端口
    server.port=9090
    # 认证用户名
    spring.security.user.name=name
    # 认证密码（不要设置成弱口令）
    spring.security.user.password=password
    # 应用实例主机名
    eureka.instance.hostname=localhost
    # 是否将自己注册到 Eureka 服务中，如果该应用本身就是注册中心，则不需要再注册自己（集群的时候为true）
    eureka.client.register-with-eureka=false
    # 是否从 Eureka 中获取注册信息，如果该应用本身就是注册中心，则不会在该应用中检索服务信息
    eureka.client.fetch-registry=false
    # 指定 Eureka 服务器的地址，如果服务注册中心为高可用集群时，多个注册中心地址以逗号分隔
    eureka.client.service-url.defaultZone=http://${spring.security.user.name}:${spring.security.user.password}@${eureka.instance.hostname}:${server.port}/eureka/
    ```

    在 Spring Cloud 1.x 版本中，如果使用的是 Security 4.x 版本，则无需配置 `security.basic.enabled=true`，因为它是默认启用的。但是在 Spring Cloud 2.x 版本中，如果使用的是 Security 5.x 版本，则不再默认启用 `security.basic.enabled=true`，而是默认启用表单验证模式。Eureka 在基于 Security 5.x 中配置用户认证需要手动开启 HTTP Basic Authentication

3. 启动 Eureka 服务端进行测试验证

   在浏览器上访问注册中心地址：http://localhost:9090 就会进行 HTTP Basic Authentication

   ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_1.png)

   ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_2.png)

   此时注册中心中提示没有可用的实例，我们可以注册所需的服务

4. 注册服务

   修改需要注册的服务端的应用程序配置文件 `application.properties` 或 `application.yml`

    ```properties
    # 服务端口
    server.port=9091
    # 应用程序名称
    spring.application.name=test
    # 服务提供者使用你指定的 IP 地址去注册
    eureka.instance.prefer-ip-address=true
    # 标识服务实例，默认值为 ${spring.application.name}:${spring.application.instance_id:${server.port}}
    eureka.instance.instance-id=${spring.cloud.client.ip-address}:${server.port}
    # 指定 Eureka 服务器的地址
    eureka.client.service-url.defaultZone=http://name:password@localhost:9090/eureka
    ```

   启动服务后刷新注册中心地址可以看到当前注册的实例列表里有 TEST 实例

   ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_3.png)

## 基于 Spring Cloud 2.x 配置

1. 在 Eureka 服务端的 pom 文件中添加 Security 依赖

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    ```

2. 修改 Eureka 服务端的应用程序配置文件 `application.properties` 或 `application.yml`

    ```properties
    # 服务端口
    server.port=9090
    # 认证用户名
    spring.security.user.name=name
    # 认证密码（不要设置成弱口令）
    spring.security.user.password=password
    # 应用实例主机名
    eureka.instance.hostname=localhost
    # 是否将自己注册到 Eureka 服务中，如果该应用本身就是注册中心，则不需要再注册自己（集群的时候为true）
    eureka.client.register-with-eureka=false
    # 是否从 Eureka 中获取注册信息，如果该应用本身就是注册中心，则不会在该应用中检索服务信息
    eureka.client.fetch-registry=false
    # 指定 Eureka 服务器的地址，如果服务注册中心为高可用集群时，多个注册中心地址以逗号分隔
    eureka.client.service-url.defaultZone=http://${spring.security.user.name}:${spring.security.user.password}@${eureka.instance.hostname}:${server.port}/eureka/
    ```

3. 在 Eureka 服务端新增一个安全认证类

    ```java
    @Configuration
    @EnableWebSecurity
    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            // 禁用 CSRF 防护
            http.csrf().disable();
            // 手动配置用户认证：启用 HTTP 基本身份验证，并要求用户进行身份验证。这意味着如果用户未通过身份验证，则无法访问受保护的资源
            http.authorizeRequests().anyRequest().authenticated().and().httpBasic();
        }
    
    }
    ```
   
    Spring Cloud 2.x 版本中的 Eureka-client 使用了 Spring Security 5.x 版本，而 Spring Security 5.x 版本默认启动了 CSRF 保护。因此任何一次服务请求默认都需要 CSRF 的 Token。而 Eureka-client 将无法向 Eureka-server 注册服务，因为它是一个服务注册中心无法生成 CSRF 令牌。所以需要禁用 CSRF 防护

    但因为 Eureka-server 需要对服务进行身份验证，以确保只有受信任的服务才能注册到 Eureka-server 中。如果不手动配置用户认证，则 Eureka-client 将无法通过身份验证，因此无法向 Eureka-server 注册服务

4. 启动 Eureka 服务端进行测试验证

    在浏览器上访问注册中心地址：http://localhost:9090 就会进行 HTTP Basic Authentication

    ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_1.png)

    ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_2.png)

    此时注册中心中提示没有可用的实例，我们可以注册所需的服务

5. 注册服务

    修改需要注册的服务端的应用程序配置文件 `application.properties` 或 `application.yml`

    ```properties
    # 服务端口
    server.port=9091
    # 应用程序名称
    spring.application.name=test
    # 服务提供者使用你指定的 IP 地址去注册
    eureka.instance.prefer-ip-address=true
    # 标识服务实例，默认值为 ${spring.application.name}:${spring.application.instance_id:${server.port}}
    eureka.instance.instance-id=${spring.cloud.client.ip-address}:${server.port}
    # 指定 Eureka 服务器的地址
    eureka.client.service-url.defaultZone=http://name:password@localhost:9090/eureka
    ```

    启动服务后刷新注册中心地址可以看到当前注册的实例列表里有 TEST 实例

    ![](https://img.sherry4869.com/blog/it/java/intermediate/spring-cloud/img_3.png)