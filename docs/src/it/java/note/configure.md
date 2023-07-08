---
category: IT
tag: Java
sticky: true
article: false
---

# Java 笔记

<!-- more -->

## 跨源资源共享

跨域（Cross-Origin）指的是在浏览器环境中，通过 JavaScript 发起的网络请求的目标资源与当前页面所属的域（包括协议、主机和端口）不一致的情况。当浏览器在一个域中加载了一个页面，并且该页面中的 JavaScript 代码尝试向不同域的服务器发起请求时，就会出现跨域请求

跨域请求是由浏览器的同源策略（Same-Origin Policy）所限制的安全机制。同源策略要求在默认情况下，网页中的脚本只能访问与其所属的源（协议、主机和端口）相同的资源，而不能直接访问其他域的资源。这是为了防止恶意网站通过跨域请求获取到用户的敏感信息或对其他域进行攻击

跨域请求可以发生在以下情况下：

1. 不同协议：例如从 http://example.com 发起一个请求到 https://example.com

2. 不同主机：例如从 http://example.com 发起一个请求到 http://api.example.com

3. 不同端口：例如从 http://example.com:8080 发起一个请求到 http://example.com:3000

跨域请求会受到浏览器的限制，一般情况下会被浏览器拦截，不允许直接发送跨域请求。但有一些方式可以实现跨域请求，如使用 CORS（跨源资源共享）机制、代理服务器等。需要注意的是，跨域问题仅存在于浏览器环境中，对于服务器之间的通信没有跨域限制。服务器可以自由地进行跨域通信，而不受同源策略的限制

### Java CORS

当你在使用 Spring Boot 构建 Web 应用程序时，有时需要处理跨域请求，以允许来自其他域的客户端访问你的应用程序接口。CORS（跨源资源共享）是一种机制，它定义了在跨域访问时浏览器和服务器如何进行通信

1. 使用 @CrossOrigin 注解

    @CrossOrigin 是 Spring Framework 提供的一个注解，用于在控制器方法上启用跨域请求的支持。通过在控制器类或方法上添加 @CrossOrigin 注解，可以简化跨域配置，并允许指定跨域请求的具体配置参数
    
    使用 @CrossOrigin 注解标记在类级别上，表示该控制器类中的所有请求方法都支持跨域请求
    
    ```java
    @CrossOrigin
    @RestController
    @RequestMapping("/api")
    public class MyController {
    
    }
    ```

   使用 @CrossOrigin 注解标记在方法上，表示该请求方法支持跨域请求
    
    ```java
    @RestController
    @RequestMapping("/api")
    public class MyController {
    
        @CrossOrigin
        @GetMapping("/data")
        public String getData() {
            // 处理逻辑
            return "Data response";
        }
    }
    ```

    该注解提供了一系列属性，可以用来自定义跨域请求的行为：
    
    - value：指定允许跨域请求的来源。可以是一个字符串数组或逗号分隔的多个来源。默认值为 *，表示允许任何来源的请求

        ```text
        @CrossOrigin(value = {"http://localhost:8080", "http://example.com"}) //指定了允许来自 http://localhost:8080 和 http://example.com 两个来源的请求跨域访问该接口
        ```

    - origins：是 value 属性的别名，可以用来指定允许跨域请求的来源。它与 value 属性具有相同的作用，可以接受一个字符串数组或逗号分隔的多个来源
    
    - methods：指定允许的请求方法。可以是一个字符串数组或逗号分隔的多个方法。默认情况下，允许所有的请求方法

        ```text
        @CrossOrigin(methods = {RequestMethod.GET, RequestMethod.POST}) //指定了只允许跨域请求使用 GET 和 POST 两个 HTTP 方法
        ```

    - allowedHeaders：指定允许的请求头。可以是一个字符串数组或逗号分隔的多个请求头。默认值为空，表示允许所有的请求头

        ```text
        @CrossOrigin(allowedHeaders = {"Authorization", "Content-Type"}) //指定了只允许跨域请求携带 Authorization 和 Content-Type 两个请求头
        ```
    
    - exposedHeaders：指定允许暴露给客户端的响应头。可以是一个字符串数组或逗号分隔的多个响应头。默认值为空，表示不允许暴露响应头

        ```text
        @CrossOrigin(exposedHeaders = {"Content-Disposition", "X-Custom-Header"}) //指定了允许暴露给客户端的响应头为 Content-Disposition 和 X-Custom-Header
        ```

    - allowCredentials：指定是否允许发送身份验证凭据（如 cookies）到跨域请求的服务器。在默认情况下，浏览器在跨域请求中不会携带身份凭证，即不会发送 Cookies 等信息

        ```text
        @CrossOrigin(allowCredentials = true) //允许跨域请求携带身份凭证
        ```
       
    - maxAge：指定预检请求的最大有效期（单位为秒）。预检请求是浏览器在发送实际请求之前发送的一种检查机制。默认值为 -1，表示不限制有效期。maxAge 属性是可选的，如果不进行设置，默认情况下预检请求的缓存时间为 1800 秒（即 30 分钟）

        ```text
        @CrossOrigin(maxAge = 3600) //设置了预检请求的缓存时间为 3600 秒（即 1 小时）。这意味着，在 1 小时内，浏览器无需再次发送预检请求，而直接使用之前的缓存结果
        ```

2. 实现 WebMvcConfigurer 接口

    当实现 `WebMvcConfigurer` 接口并重写 `addCorsMappings` 方法时，可以自定义全局的跨域配置
    
    ```java
    @Configuration
    public class CorsConfig implements WebMvcConfigurer {
    
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://example.com", "http://localhost:8080")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization")
                    .allowCredentials(true)
                    .maxAge(3600);
        }
    }
    ```

    首先，我们使用 @Configuration 注解将该类标记为配置类，以便让 Spring 容器加载并应用其中的配置。然后，该类实现了 `WebMvcConfigurer` 接口，并重写了其中的 `addCorsMappings` 方法。这个方法在 Spring MVC 的初始化过程中会被调用，用于配置跨域规则
    
    在 `addCorsMappings` 方法中，我们使用 `CorsRegistry` 对象来进行跨域配置。在示例中，我们使用 `registry` 对象调用 `addMapping` 方法来指定需要进行跨域处理的请求路径，这里是 /api/**，表示以 /api 开头的所有请求都会被跨域处理
    
    接着，我们使用方法链的方式进行一系列的配置：

    - `allowedOrigins` 方法指定了允许的请求来源（域名或URL），在示例中允许的来源包括 http://example.com 和 http://localhost:8080

    - `allowedMethods` 方法指定了允许的请求方法，示例中允许的方法包括 GET、POST、PUT 和 DELETE

    - `allowedHeaders` 方法指定了允许的请求头，示例中使用通配符 * 表示允许所有请求头

    - `exposedHeaders` 方法指定了暴露的响应头，示例中指定了 Authorization 响应头

    - `allowCredentials` 方法指定是否允许携带身份凭证，示例中设置为 true

    - `maxAge` 方法指定了预检请求的缓存时间，示例中设置为 3600 秒（即 1 小时）

3. 使用 CorsFilter 过滤器

    ```java
    @Configuration
    public class CorsWebConfig {
        
        @Bean
        public CorsFilter corsFilter() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.addAllowedOrigin("http://localhost:8080"); //指定放开某个域名访问，如果配置 * 号则是允许所有域名跨域访问
            configuration.addAllowedMethod("*");
            configuration.addAllowedHeader("*");
            source.registerCorsConfiguration("/**", configuration);
            return new CorsFilter(source);
        }
    }
    ```

    首先，使用 @Bean 注解将 `corsFilter()` 方法标记为一个 Bean，表示它将被 Spring Boot 自动管理和装配。在方法内部，创建了一个 `UrlBasedCorsConfigurationSource` 对象 source，它是 CORS 配置的基础。`UrlBasedCorsConfigurationSource` 是 Spring 提供的一个实现了 `CorsConfigurationSource` 接口的类，用于根据 URL 匹配相应的 CORS 配置
    
    然后，创建一个 `CorsConfiguration` 对象 configuration，它表示一个具体的 CORS 配置。在这里，我们设置了允许访问的来源（addAllowedOrigin），允许的 HTTP 方法（addAllowedMethod），以及允许的请求头（addAllowedHeader）。可以根据需求进行配置，例如可以指定多个允许的来源、方法和请求头
    
    接下来，将 configuration 注册到 source 中，并使用 source 的 `registerCorsConfiguration` 方法将其与 "/*" 路径匹配。这表示所有请求路径都会应用该 CORS 配置。你也可以根据实际需求进行路径匹配的设置
    
    最后，将 source 传递给 `CorsFilter` 构造函数，并将其作为返回值。`CorsFilter` 是 Spring 提供的一个过滤器，用于实现 CORS 功能。返回的 `CorsFilter` 对象将在应用程序启动时由 Spring Boot 自动注册，并对进入的请求进行 CORS 处理

::: tip
如果你需要对不同的请求路径或处理器进行个性化的跨域配置，推荐使用实现 WebMvcConfigurer 接口并重写 addCorsMappings 方法的方式。这种方式适用于需要根据具体的请求路径或处理器来个性化配置跨域规则的情况

如果你希望在整个应用程序范围内统一处理跨域请求，推荐使用 CorsFilter 过滤器。这种方式适用于不依赖于 Spring MVC 框架的项目，或者希望在应用程序的所有请求中应用相同的跨域配置
:::

---

过滤器优先级：

```java
@Configuration
public class CorsWebConfig {
    
    @Bean
    public FilterRegistrationBean corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        source.registerCorsConfiguration("/**", configuration);
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(new CorsFilter(source));
        filterRegistrationBean.setOrder(Ordered.LOWEST_PRECEDENCE);
        return filterRegistrationBean;
    }
}
```

`FilterRegistrationBean` 是用于注册过滤器的辅助类，可以通过它来设置过滤器的属性和优先级

使用 `setOrder` 方法设置过滤器的优先级为 `Ordered.HIGHEST_PRECEDENCE`，即最高优先级（值越小，优先级越高）

### 代理服务器

待更新