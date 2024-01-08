---
category: IT
article: false
---

# Resilience4j

Resilience4j 是一款专注于帮助 Java 应用程序实现弹性（resilience）和容错性（fault tolerance）的轻量级库。它提供了一组模块，涵盖了常见的弹性模式，包括重试、断路器（Circuit Breaker）、限流、超时控制等，帮助开发者构建更具弹性和容错性的分布式系统

以下是 Resilience4j 的一些主要特点和模块：

- 重试（Retry）：Resilience4j 允许通过 `@Retry` 注解或者直接使用 Retry 组件来定义在方法执行失败时的重试策略。可以配置最大重试次数、重试间隔、重试异常类型等

- 熔断器（Circuit Breaker）：`@CircuitBreaker` 注解和 Circuit Breaker 组件提供了对熔断模式的支持。它能够在一定时间内追踪调用失败的次数，当失败次数达到设定的阈值时，熔断器将打开，阻止对目标方法的调用，避免连锁故障

- 限流（Rate Limiter）：Resilience4j 的 Rate Limiter 组件允许开发者通过 `@RateLimiter` 注解或者直接使用 Rate Limiter 来限制方法的调用频率。可以配置允许的请求数、限流刷新周期等参数

- 超时控制：Resilience4j 提供了超时控制功能，允许在调用外部服务时设置最大等待时间，超过该时间将中断调用并执行降级逻辑

- Bulkhead（舱壁模式）：Bulkhead 模块用于隔离不同的业务功能，防止其中一个功能的问题影响到整个应用。可以配置每个功能的最大并发执行数

- 事件监听：Resilience4j 允许通过事件监听来监听熔断器状态、重试事件等，从而更好地了解系统的运行状态

- 响应缓存：提供了响应缓存功能，允许缓存成功调用的响应，避免重复调用相同的操作

- 灵活的配置：Resilience4j 提供了通过注解、构建器模式或者直接配置文件等多种方式进行配置，使得开发者可以根据实际需求选择最合适的配置方式

引入相关依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>

    <dependency>
        <groupId>io.github.resilience4j</groupId>
        <artifactId>resilience4j-spring-boot2</artifactId>
        <version>1.7.1</version>
    </dependency>
</dependencies>
```

配置文件：

```yaml
server:
  port: 8080

resilience4j:
  retry:                  # 重试机制的配置
    instances:
      retryApi:           # 定义了一个名为 retryApi 的重试实例
        max-attempts: 5   # 当操作失败时，最大重试次数为5次
        wait-duration: 1s # 每次重试之间的等待时间为1秒

  circuitbreaker:                                         # 熔断器配置
    instances:
      circuitBreakerApi:                                  # 定义了一个名为 circuitBreakerApi 的熔断器实例
        register-health-indicator: true                   # 是否将熔断器的状态注册为健康检查指标，这样可以在服务监控中看到其状态
        sliding-window-size: 10                           # 用于计算失败率的滑动窗口大小为10，即最近10次调用的失败情况会被考虑
        permitted-number-of-calls-in-half-open-state: 3   # 当熔断器处于半开状态时，允许的最大调用次数为3次
        sliding-window-type: TIME_BASED                   # 滑动窗口的类型时基于时间的，意味着窗口内的调用是根据时间而不是数量
        minimum-number-of-calls: 5                        # 在进入熔断器之前需要的最小调用次数为5
        wait-duration-in-open-state: 5s                   # 当熔断器打开后（即服务被认为不可用），5秒钟时间内外界的请求都不会发送到目标接口中，直至5秒后再尝试进入半开状态
        failure-rate-threshold: 20                        # 故障率阈值为20%，当失败率达到20%时，熔断器就会打开，阻止进一步的接口调用
        event-consumer-buffer-size: 10                    # 用于存储熔断器相关事件消费者缓冲区的大小为10

  ratelimiter:                    # 限流器配置，用于防止过多的请求涌入系统
    instances:
      flowlimitApi:               # 定义了一个名为 flowlimitApi 的限流器实例
        limit-for-period: 1       # 在限流周期内允许的请求数为1
        limit-refresh-period: 1s  # 限流器的刷新周期为1秒，即每1秒会重置请求计数
        timeout-duration: 100ms   # 请求等待超时的持续时间为100毫秒：最大的等待超时时间，如果接口执行时间超过了100毫秒，则自动中断
```

测试代码：

```java
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Random;

@RestController
@Slf4j
public class FlowLimitController {

    @GetMapping("/retry") // 重试
    @Retry(name = "retryApi", fallbackMethod = "fallback") // 指定了重试实例的名称为 "retryApi"，并指定了当重试失败时的降级方法为 "fallback"。如果重试5次（minimum-number-of-calls）最终还是失败了，将请求“fallback”方法进行兜底的最终结果返回
    public ResponseEntity<String> retryApi() {
        log.info("retryApi call received");
        String ret = new RestTemplate().getForObject("http://localhost:9999/", String.class); // 访问了一个不存在的接口地址
        return new ResponseEntity("success", HttpStatus.OK);
    }

    @GetMapping("/circuitbreaker")
    @CircuitBreaker(name = "circuitBreakerApi", fallbackMethod = "fallback") // 指定了熔断器实例的名称为 "circuitBreakerApi"，并指定了当断路时的降级方法为 "fallback"
    public ResponseEntity circuitBreakerApi() {
        log.info("circuitBreakerApi call received");
        int i = new Random().nextInt(100);
        if (i >= 70) {
            throw new RuntimeException("Unexcepted Exception");
        }
        return new ResponseEntity("success", HttpStatus.OK);
    }

    @GetMapping("/flowlimit")
    @RateLimiter(name = "flowlimitApi", fallbackMethod = "fallback") // 指定了限流器实例的名称为 "flowlimitApi"，并指定了当触发限流时的降级方法为 "fallback"
    public ResponseEntity flowlimitApi() {
        log.info("flowlimitApi call received");
        return new ResponseEntity("success", HttpStatus.OK);
    }

    public ResponseEntity fallback(Throwable throwable) {
        log.info("fallback call received");
        return new ResponseEntity(throwable.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
```

重试测试：

请求 `GET http://localhost:8080/retry` 后的日志输出结果：

```text
GET http://localhost:8080/retry

HTTP/1.1 500 
Content-Type: text/plain;charset=UTF-8
Content-Length: 158
Date: Mon, 08 Jan 2024 07:32:32 GMT
Connection: close

I/O error on GET request for "http://localhost:9999/": Connection refused: connect; nested exception is java.net.ConnectException: Connection refused: connect

INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : retryApi call received
INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : retryApi call received
INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : retryApi call received
INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : retryApi call received
INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : retryApi call received
INFO 21300 --- [nio-8080-exec-1] com.mw.controller.FlowLimitController    : fallback call received
```

当 5 次重试（`max-attempts: 5`）调用完毕后（`wait-duration: 1s` 重试的间隔为 1 秒）还是有异常就会进入 `fallback` 兜底方法返回结果

熔断和限流测试：

熔断和限流涉及到一个并发的处理，可以使用 [JMeter](https://jmeter.apache.org/) 进行测试：

CircuitBreaker 'circuitBreakerApi' is OPEN and does not permit further calls