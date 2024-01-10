---
category: IT
order: 1
article: false
---

# 注解

## Async

待更新

## Autowired

待更新

## Controller

待更新

## Component

用于标识一个类作为 Spring 容器管理的组件。通过 `@Component` 注解，Spring会自动扫描并识别这些类，并将其纳入Spring容器进行管理。我们可以简化组件的创建和配置过程，使得应用程序的开发和维护更加方便

- 标识组件：`@Component` 注解将一个类标识为 Spring 容器中的组件。被 `@Component` 注解标记的类将被自动扫描并注册为一个 Bean

- 自动创建实例：当 Spring 容器扫描到被 `@Component` 注解标记的类时，它会自动实例化该类的对象。通过默认的实例化策略，Spring 将创建单例的 Bean 对象

- 自动装配依赖：被 `@Component` 注解标记的类可以通过依赖注入来访问其他被 Spring 管理的 Bean。Spring 容器会自动解析依赖关系，并将相应的 Bean 自动注入到组件中

- 组件扫描：`@Component` 注解与组件扫描（Component Scanning）配合使用。组件扫描是 Spring 容器在启动时自动扫描指定包下的类，识别并注册所有被 `@Component` 注解标记的类为 Bean

- 泛化注解：`@Component` 注解是一个泛化的注解，它还有几个具体的衍生注解，如 [@Service](#service)、[@Repository](#repository) 和 [@Controller](#controller) 等。这些注解提供了更具体的语义，并可用于不同层次的组件（如服务层、数据访问层、控制层）

```java
@Component
public class MyComponent {
    
    public void doSomething() {
        // ...
    }
    
    // ...
}
```

在上述示例中，`MyComponent` 类被标记为 `@Component`，表示它是一个 Spring 容器中的组件。当 Spring 容器启动时，它会自动创建 `MyComponent` 的实例，并将其注册为一个 Bean

::: info
`@Component` 和 `@Bean` 是 Spring 框架中用于创建和管理 Bean 的两种不同方式，它们有以下区别：

- 用途和应用场景：`@Component` 注解用于将类标识为 Spring 容器中的组件，可以扫描并自动创建 Bean 实例。适用于通用的组件创建和管理。`@Bean` 注解用于在配置类中定义方法，该方法负责手动创建和配置 Bean 实例。适用于更细粒度的、定制化的 Bean 创建和配置

- 创建方式：`@Component` 注解通过组件扫描自动创建 Bean 实例，无需显式配置。`@Bean` 注解需要在配置类中手动创建 Bean 实例，通过调用方法返回一个实例

- 配置灵活性：`@Component` 注解提供了一种简单的方式来创建和配置 Bean，但它的配置选项有限。`@Bean` 注解允许在方法级别进行更细粒度的配置，可以设置初始化参数、依赖关系等

- 依赖注入：`@Component` 注解的 Bean 可以通过自动装配 `@Autowired` 进行依赖注入，Spring 容器会自动解析依赖关系并自动注入。`@Bean` 注解的 Bean 通常需要手动进行依赖注入，通过方法参数或其他方式显式指定

- 托管范围：`@Component` 注解默认将 Bean 注册为单例（Singleton）托管，Spring 容器中只有一个实例。`@Bean` 注解可以通过配置 `@Scope` 注解指定不同的托管范围，如单例、原型、会话、请求等

- 所属类：`@Component` 注解可以用于标记类本身，将其注册为 Bean。`@Bean` 注解通常用于配置类中的方法，用于定义和配置具体的 Bean 实例

综上所述，`@Component` 注解适用于通用的组件创建和管理，通过组件扫描自动创建 Bean 实例。`@Bean` 注解适用于更细粒度和定制化的 Bean 创建和配置，需要手动在配置类中定义方法返回 Bean 实例。两者可以根据具体需求灵活使用
:::

## ControllerAdvice

`@ControllerAdvice` 注解用于定义全局的异常处理、数据绑定规则和模型属性的添加。它提供了一种集中管理和配置全局行为的方式，可以在应用的多个控制器中共享配置

- 作用：

    - `@ControllerAdvice` 注解用于定义全局的配置，包括异常处理、数据绑定规则和模型属性的添加

    - 它可以用于全局异常处理、全局数据绑定规则、全局模型属性的添加等场景

- 异常处理：

    - 使用 `@ControllerAdvice` 注解的类可以通过 [@ExceptionHandler](#exceptionhandler) 注解来定义全局的异常处理方法

    - 异常处理方法可以处理特定类型的异常，并返回自定义的错误信息、视图或其他响应

- 数据绑定规则：

    - 使用 `@ControllerAdvice` 注解的类可以通过 [@InitBinder](#initbinder) 注解来定义全局的数据绑定规则

    - `@InitBinder` 注解的方法可以对请求参数进行预处理、数据验证或转换等操作

- 模型属性添加：

    - 使用 `@ControllerAdvice` 注解的类可以通过 [@ModelAttribute](#modelattribute) 注解来定义全局的模型属性

    - `@ModelAttribute` 注解的方法可以在每个请求处理之前向模型中添加属性，使其在所有处理器方法中可用

下面是一个简单示例，展示了 `@ControllerAdvice` 注解的使用：

```java
@ControllerAdvice
public class GlobalControllerAdvice {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        // 处理全局异常，并返回自定义错误信息
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 定义全局数据绑定规则
        binder.setDisallowedFields("id");
    }

    @ModelAttribute
    public void addGlobalAttribute(Model model) {
        // 在模型中添加全局属性
        model.addAttribute("globalAttribute", "Some value");
    }
}
```

在上述示例中，`GlobalControllerAdvice` 类使用了 `@ControllerAdvice` 注解，表示它是一个全局配置类

`handleException()` 方法使用了 `@ExceptionHandler(Exception.class)` 注解，用于处理所有类型的异常。当发生异常时，它将返回一个包含自定义错误信息的 `ResponseEntity` 对象

`initBinder()` 方法使用了 `@InitBinder` 注解，定义了全局的数据绑定规则。在此例中，它设置了禁止绑定名为 "id" 的请求参数

`addGlobalAttribute()` 方法使用了 `@ModelAttribute` 注解，在每个请求处理之前向模型中添加名为 "globalAttribute" 的全局属性

---

- 异常处理（Exception Handling）：

   `@ControllerAdvice` 注解的类可以包含用于处理异常的方法

   使用 `@ExceptionHandler` 注解标记的方法可以处理特定类型的异常，并返回相应的错误信息或进行其他处理

   这些异常处理方法可以针对整个应用程序中的所有控制器生效

    ```java
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.ControllerAdvice;
    import org.springframework.web.bind.annotation.ExceptionHandler;
    
    @ControllerAdvice
    public class GlobalExceptionHandler {
    
        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleException(Exception e) {
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    ```

   参考：[封装异常处理类](response-data-result.md#封装异常处理类)

- 全局响应数据封装：

   除了异常处理，`@ControllerAdvice` 还可以用于全局性的响应数据封装，例如统一添加响应头、统一格式化响应数据等

   使用 `@ModelAttribute` 注解的方法可以在所有控制器方法执行前添加一些模型属性

    ```java
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.ControllerAdvice;
    import org.springframework.web.bind.annotation.ModelAttribute;
    
    @ControllerAdvice
    public class GlobalControllerAdvice {
    
        @ModelAttribute
        public void globalAttributes(Model model) {
            model.addAttribute("globalMessage", "Global Message");
        }
    }
    ```

   参考：[自定义全局处理控制器](response-data-result.md#自定义全局处理控制器)

## ConfigurationProperties

待更新

## EnableAsync

在 Spring 中，异步方法是指可以在调用方法时不阻塞主线程，而是在另一个线程中执行。这对于需要执行长时间操作的方法，如网络调用、文件读写或其他耗时的任务，是非常有用的

`@EnableAsync` 注解是一个配置类级别的注解，通常与 `@Configuration` 注解一起使用。通过在应用程序的配置类上添加 `@EnableAsync`，你告诉 Spring 框架启用异步方法的支持

与 `@EnableAsync` 一起使用的是 `@Async` 注解。`@Async` 注解用于标记方法，告诉 Spring 这个方法应该在一个单独的线程中执行。被标记为 `@Async` 的方法必须位于 `@EnableAsync` 所在的类中或者被另一个通过 `@EnableAsync` 启用了异步支持的配置类中

默认情况下，Spring 使用一个简单的线程池执行异步方法。你也可以在 `@EnableAsync` 上配置一个自定义的 `TaskExecutor`，以更好地控制异步方法的执行。例如：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {
    // 其他配置...

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        return executor;
    }
}
```

在这个例子中，我们创建了一个自定义的 `ThreadPoolTaskExecutor`，并设置了核心线程数、最大线程数以及队列容量

## EnableScheduling

待更新

## ExceptionHandler

待更新

参考：[封装异常处理类](response-data-result.md#封装异常处理类)

## EnableScheduling

`@EnableScheduling` 是 Spring 中用于用于启用计划任务功能的注解，允许在应用程序中定义定时任务，通常与 [@Scheduled](#scheduled) 注解一起使用

```java {10}
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.mw.mapper")
@EnableAsync
@EnableScheduling
public class AdminApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApiApplication.class, args);
    }

}
```

## InitBinder

待更新

## MapperScan

待更新

## ModelAttribute

待更新

## PathVariable

待更新

## Resource

待更新

## Repository

待更新

## ResponseBody

`@ResponseBody` 注解用于将方法的返回值直接作为响应体返回给客户端，而不是通过视图解析器进行视图渲染

- 作用范围：

    - 当 `@ResponseBody` 注解应用在方法上时，表示该方法的返回值将直接作为响应体返回给客户端

    - 当 `@ResponseBody` 注解应用在控制器类上时，表示该控制器类的所有方法的返回值都将直接作为响应体返回给客户端

- 返回值处理：

    - 使用 `@ResponseBody` 注解的方法的返回值可以是任何类型，如对象、集合、字符串等

    - Spring MVC 会将返回值转换为适当的响应格式，如 JSON、XML 等

    - 默认情况下，Spring MVC 使用消息转换器来完成返回值的格式转换，根据请求头中的 `Accept` 属性选择合适的消息转换器

下面是一些示例来说明 `@ResponseBody` 注解的用法：

1. 返回对象：

    ```java
    @Controller
    public class HomeController {
    
        @GetMapping("/user/{id}")
        @ResponseBody
        public User getUser(@PathVariable("id") Long id) {
            // 从数据库中获取用户信息
            User user = userService.getUserById(id);
            return user;
        }
    }
    ```

   在上述示例中，`getUser()` 方法使用 `@ResponseBody` 注解，表示该方法的返回值 `User` 对象将直接作为响应体返回给客户端。Spring MVC 会将 `User` 对象转换为适当的响应格式，并发送给客户端

2. 返回集合：

    ```java
    @Controller
    public class HomeController {
    
        @GetMapping("/users")
        @ResponseBody
        public List<User> getUsers() {
            // 从数据库中获取用户列表
            List<User> users = userService.getAllUsers();
            return users;
        }
    }
    ```

   在上述示例中，`getUsers()` 方法使用 `@ResponseBody` 注解，表示该方法的返回值 `List<User>` 将直接作为响应体返回给客户端。Spring MVC 会将 `List<User>` 转换为适当的响应格式，并发送给客户端

::: info 消息转换器
Spring MVC 使用消息转换器（Message Converter）来处理返回值的转换工作。它根据客户端请求头中的 Accept 属性选择适合的消息转换器，将方法的返回值转换为相应的格式。实现了灵活的内容协商（Content Negotiation）机制。这样客户端可以根据自身需求来选择接受的响应格式，提高了系统的灵活性和可扩展性

具体的响应格式可以是以下几种常见的类型：

1. JSON (JavaScript Object Notation)：用于表示结构化的数据。通常在 RESTful API 中用作数据的传输格式

2. XML (Extensible Markup Language)：一种用于存储和传输数据的标记语言

3. HTML (Hypertext Markup Language)：用于定义网页的结构和内容

4. 文本 (Plain Text)：纯文本格式，不包含任何样式或标记

5. 二进制 (Binary)：例如图片、音频或视频文件等

例如，如果客户端的请求头中指定了 Accept 属性为 `application/json`，那么 Spring MVC 将使用 JSON 消息转换器将方法的返回值转换为 JSON 格式的响应。如果客户端的 Accept 属性为 `application/xml`，则将使用 XML 消息转换器转换为 XML 格式的响应
:::

通过使用 `@ResponseBody` 注解，您可以轻松地将方法的返回值直接作为响应体返回给客户端，而无需经过视图解析器进行视图渲染。这在构建 RESTful API 或需要直接返回数据的场景中非常有用

## RequestParam

待更新

## RestControllerAdvice

`@RestControllerAdvice` 注解用于定义全局的异常处理、数据绑定规则和直接返回响应体的处理器方法。它结合了 [@ControllerAdvice](#controlleradvice) 和 [@ResponseBody](#responsebody) 注解的功能，适用于构建 RESTful API，可以集中管理和配置全局行为，处理器方法的返回值会直接作为响应体返回给客户端

下面是一个示例，展示了使用 `@RestControllerAdvice` 注解和实现 `ResponseBodyAdvice` 接口，在全局范围内对响应体进行统一处理

```java
@RestControllerAdvice
public class RestResponseBodyAdvice implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // 检查是否支持对该类型的响应体进行处理
        // 在这里可以进行一些判断逻辑
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // 在响应体返回之前对其进行处理
        // 在这里可以修改响应数据或添加额外信息
        return body;
    }
}
```

在上述示例中，`RestResponseBodyAdvice` 类实现了 `ResponseBodyAdvice` 接口，并覆写了其中的两个方法：`supports()` 和 `beforeBodyWrite()`

- `supports()` 方法：

    - 这个方法用于判断需要处理的响应体类型

    - 通过 `MethodParameter` 参数可以获取到处理方法的返回类型信息，通过 `converterType` 参数可以获取到消息转换器的类型信息

    - 在这段示例代码中，`supports()` 方法直接返回 `true`，表示对所有类型的响应体进行处理

- `beforeBodyWrite()` 方法：

    - 这个方法在响应体返回之前被调用，用于对响应体进行处理

    - 它接收到原始的响应体 body，可以对其进行修改或添加额外的信息，然后再返回修改后的响应体

    - 除了原始的响应体 body，还可以通过其他参数获取到更多的信息，如 `returnType` 获取返回类型信息，`selectedContentType` 获取选定的媒体类型信息，`request` 获取请求信息，`response` 获取响应信息等

    - 在这段示例代码中，`beforeBodyWrite()` 方法直接返回原始的响应体 body，没有进行任何修改

参考：[自定义全局处理控制器](response-data-result.md#自定义全局处理控制器)

## Service

`@Service` 注解是 Spring 框架中用于标识服务层组件的一种重要注解，它通过自动扫描和自动装配等机制，帮助开发者更方便地管理和使用业务逻辑组件

- 注解参数：`@Service` 注解没有具体的参数，通常直接标注在服务类的类定义上

- 自动扫描和自动装配：在 Spring 应用上下文中，`@Service` 注解通常与自动扫描和自动装配结合使用。通过在配置中启用组件扫描，Spring 将自动发现被 `@Service` 注解标注的服务类，并将其注册为 Spring 管理的 Bean

- 与其他注解的关系：`@Service` 注解通常与其他注解结合使用，例如 [`@Autowired`](#autowired) 用于自动装配其他依赖，或者 [`@Transactional`](#transactional) 用于声明事务行为

- 事务管理：在实际应用中，`@Service` 注解的类通常包含业务逻辑，可能涉及到事务管理。因此，`@Service` 类上经常搭配使用 [`@Transactional`](#transactional) 注解，以便声明事务的边界

- 示例：

    ```java
    import org.springframework.stereotype.Service;
    
    @Service
    public class MyBusinessService {
        // 业务逻辑方法
    }
    ```

## Scheduled

`@Scheduled` 注解表示这是一个定时任务方法，它使用 `cron` 表达式定义了任务的执行时间规则

```java {10}
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.mw.mapper")
@EnableAsync
@EnableScheduling // @EnableScheduling 是 Spring 中用于用于启用 Spring 的计划任务功能的注解，允许在应用程序中定义定时任务
public class AdminApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApiApplication.class, args);
    }

}
```

```java
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;

/**
 * 定时删除临时文件
 */
@Component // @Component 注解将 ScheduleService 类标记为 Spring 组件，使其成为 Spring 管理的 Bean
@Slf4j // @Slf4j 注解是 Lombok 提供的注解，用于生成日志变量 log
public class ScheduleService {

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    /**
     * 清理临时目录下的 Excel 文件
     */
    @Scheduled(cron = "0 */10 * * * ?") // @Scheduled 注解表示这是一个定时任务方法，它使用 cron 表达式定义了任务的执行时间规则。这里的表达式表示每隔 10 分钟执行一次
    private void cleanExcelTemp() {
        log.info("start run cleanExcelTemp schedule");
        Path path = Paths.get(MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel())); // 使用 Paths.get 创建了临时目录的 Path 对象，路径通过 systemConfig 对象获取配置
        try {
            Files.list(path).forEach(pathFile -> { // 使用 Files.list(path) 列出目录下的所有文件，对每个文件进行处理
                // 提取文件名和任务 ID。如果文件名中包含有扩展名且对应的任务 ID 在 Redis 中不存在（下载地址过期），就删除该文件
                String fileName = pathFile.getFileName().toString();
                String taskId = fileName.substring(0, fileName.lastIndexOf("."));
                if (fileName.contains(".") && !redisUtil.hasKey(Constant.EXCEL_OPERATION_TASK_KEY + taskId)) {
                    try {
                        Files.deleteIfExists(pathFile);
                        log.info("delete filename: {}", fileName);
                    } catch (IOException e) {
                        log.error("run cleanExcelTemp schedule delete file error: {}", e);
                    }
                }
            });
        } catch (IOException e) {
            log.error("run cleanExcelTemp schedule error: {}", e);
        }
    }
}
```

## Transactional

待更新