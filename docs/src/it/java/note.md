---
category: IT
tag: Java
sticky: true
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

### CORS

当你在使用 Spring Boot 构建 Web 应用程序时，有时需要处理跨域请求，以允许来自其他域的客户端访问你的应用程序接口。CORS（跨源资源共享）是一种机制，它定义了在跨域访问时浏览器和服务器如何进行通信。以下代码是一个 Spring Boot 配置类中的方法，用于注册一个 CORS 过滤器，以便在应用程序中启用跨域请求

```java
@Configuration
public class CorsWebConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:8080");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        source.registerCorsConfiguration("/**", configuration);
        return new CorsFilter(source);
    }
}
```

首先，使用 @Bean 注解将 corsFilter() 方法标记为一个 Bean，表示它将被 Spring Boot 自动管理和装配。在方法内部，创建了一个 `UrlBasedCorsConfigurationSource` 对象 source，它是 CORS 配置的基础。`UrlBasedCorsConfigurationSource` 是 Spring 提供的一个实现了 `CorsConfigurationSource` 接口的类，用于根据 URL 匹配相应的 CORS 配置

然后，创建一个 `CorsConfiguration` 对象 configuration，它表示一个具体的 CORS 配置。在这里，我们设置了允许访问的来源（addAllowedOrigin），允许的 HTTP 方法（addAllowedMethod），以及允许的请求头（addAllowedHeader）。可以根据需求进行配置，例如可以指定多个允许的来源、方法和请求头

接下来，将 configuration 注册到 source 中，并使用 source 的 `registerCorsConfiguration` 方法将其与 "/*" 路径匹配。这表示所有请求路径都会应用该 CORS 配置。你也可以根据实际需求进行路径匹配的设置

最后，将 source 传递给 `CorsFilter` 构造函数，并将其作为返回值。`CorsFilter` 是 Spring 提供的一个过滤器，用于实现 CORS 功能。返回的 `CorsFilter` 对象将在应用程序启动时由 Spring Boot 自动注册，并对进入的请求进行 CORS 处理