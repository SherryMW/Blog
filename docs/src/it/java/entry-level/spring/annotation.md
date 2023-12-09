---
category: IT
tag: Java
order: 1
article: false
---

# 注解

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

1. 异常处理（Exception Handling）：

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

   详情参考：[封装异常处理类](response-data-result.md#封装异常处理类)

2. 全局响应数据封装：

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

    详情参考：[自定义全局处理控制器](response-data-result.md#自定义全局处理控制器)

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

## ExceptionHandler

待更新

## InitBinder

待更新

## ModelAttribute

待更新