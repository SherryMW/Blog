---
category: IT
order: 2
article: false
---

# 封装统一响应类

封装统一响应类属于软件开发中的通用设计模式和最佳实践，目的是为了简化代码，提高代码的可维护性，并确保系统的一致性。这是一个在软件开发中非常常见地实践，特别是在构建 Web 服务和 API 时。涉及到的知识点如下：

1. 设计模式：通常采用设计模式中的“包装器模式”或“策略模式”等，通过封装响应信息的类来实现统一的响应结构

2. 面向对象设计原则：遵循面向对象设计原则，如单一职责原则（SRP）、开闭原则（OCP）等，确保类的设计具有高内聚性和低耦合性

3. 异常处理：统一响应类通常与异常处理结合使用，确保在发生异常时也能返回统一格式的错误信息

4. RESTful API 设计：在 Web 开发中，封装统一响应类与设计 RESTful API 相关。定义一致的 API 响应格式有助于客户端代码的统一处理

5. 代码规范和可维护性：使用统一响应类有助于保持代码的一致性，提高代码的可读性和可维护性

## 普通封装

::: tabs

@tab DataResult.java

```java
import lombok.Data;

@Data
public class DataResult<T> {

    private Integer code; // 响应状态码

    private T data; // 响应的业务数据

    private String message; // 响应提示语

    public static <T> DataResult success(T data) {
        DataResult<T> result = new DataResult<>();
        result.code = ResponseCode.SUCCESS.getCode();
        result.data = data;
        result.message = ResponseCode.SUCCESS.getMessage();
        return result;
    }

    public static <T> DataResult fail(int code, String message) {
        DataResult<T> result = new DataResult<>();
        result.code = code;
        result.message = message;
        return result;
    }
}
```

@tab ResponseCode.java

```java
public enum ResponseCode {

    SUCCESS(0, "响应成功"),

    //服务端服务异常以 500 开头
    SYSTEM_ERROR(500000, "服务异常，请稍后再试"),
    OPERATION_ERROR(500001, "操作失败，请稍后再试"),

    //客户端服务异常以 400 开头
    DATA_PARAM_ERROR(400000, "参数异常"),
    ACCOUNT_ALREADY_EXISTS(400001, "账号已存在，请登录"),
    ACCOUNT_NOT_FOUND(400002, "账号不存在"),
    ACCOUNT_LOCK(400003, "账号已锁定，请联系管理员解锁"),
    ACCOUNT_ERROR(400004, "账户密码不匹配"),
    TOKEN_ERROR(401000, "token 已失效,请重新登录");

    private final int code;

    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

@tab TestController.java

```java
@RestController
public class TestController {

    @GetMapping("/hello")
    public DataResult<String> hello(){
        return DataResult.success("hello world");
    }
}
```

响应内容：

```json
{
  "code": 0,
  "data": "hello world",
  "message": "响应成功"
}
```

:::

## 自定义全局处理控制器

`ResponseBodyAdvice` 是 Spring 框架中的一个接口，用于全局处理响应体（Response Body）的内容。它允许开发者在将响应体发送到客户端之前对其进行修改或包装

```java
public interface ResponseBodyAdvice<T> {
    
    boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType);

    @Nullable
    T beforeBodyWrite(@Nullable T body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response);
}
```

主要包括两个方法：

- `supports` 方法：

    该方法用于判断是否支持对当前请求的响应体进行处理。当返回 true 时，beforeBodyWrite 方法会被调用，允许对响应体进行修改

    - `returnType`：表示响应体的方法参数信息

    - `converterType`：表示将要使用的消息转换器的类型

- `beforeBodyWrite` 方法：

    该方法在将响应体写回客户端之前被调用，允许对响应体进行修改或包装。这个方法返回的值就是最终写回客户端的响应体

    - `body`：原始的响应体

    - `returnType`：响应体的方法参数信息

    - `selectedContentType`：响应体的媒体类型

    - `selectedConverterType`：将要使用的消息转换器的类型

    - `request`：请求信息

    - `response`：响应信息

`@RestControllerAdvice` 是 Spring Framework 提供的 `@ControllerAdvice` 和 `@ResponseBody` 的组合注解，用于定义全局性的控制器增强（Controller Advice）类。它主要用于集中处理全局性的异常处理和全局性的响应数据封装

以下是一个简单的示例：

```java
import com.mw.common.DataResult;
import lombok.SneakyThrows;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import javax.annotation.Resource;

@RestControllerAdvice
public class RestResponseBodyAdvice implements ResponseBodyAdvice {

    private final String stringConverter = "org.springframework.http.converter.StringHttpMessageConverter";

    @Resource
    private ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // 在这里可以判断是否要对当前响应进行处理
        return true;
    }

    @SneakyThrows
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // 当接口返回的类型消息转换器是 StringHttpMessageConverter 时，也就是说返回值类型是 String，因此就不可以直接返回 DataResult，需要转换成 JSON 字符串
        // 在 Spring Boot 中，StringHttpMessageConverter 消息转换器已经默认添加到了消息转换器列表中，它会将请求和响应中的字符串类型数据转换成 Java 中的 String 类型，当接口返回类型是字符串类型，则 StringHttpMessageConverter 会处理该请求，并将请求中的数据转换成 Java 中的 String 类型，如果我们直接返回到是 DataResult 类型就会出现类型转换异常 java.lang.ClassCastException: com.mw.common.DataResult cannot be cast to java.lang.String
        if (stringConverter.equalsIgnoreCase(selectedConverterType.getName())) {
            HttpHeaders headers = response.getHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return objectMapper.writeValueAsString(DataResult.success(body));
        }
        if (body instanceof DataResult) { // 如果响应结果已经是 DataResult 类型，则直接返回
            return body;
        }
        return DataResult.success(body); // 全局配置响应体内容
    }
}
```

如果项目中引入了 Swagger 框架，则需要进行过滤，详情参考 [Swagger 常见问题](../../junior/tools/swagger.md#常见问题)

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mw.common.DataResult;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import javax.annotation.Resource;

@Slf4j
@RestControllerAdvice
public class RestResponseBodyAdvice implements ResponseBodyAdvice {

    private final String stringConverter = "org.springframework.http.converter.StringHttpMessageConverter";
    
    @Resource
    private ObjectMapper objectMapper;

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // log.info(returnType.getDeclaringClass().getName()); // 用于获取声明响应体的方法的类的全限定名（Fully Qualified Name）
        return !returnType.getDeclaringClass().getName().contains("springfox.documentation"); // 过滤 Swagger 接口
    }

    @SneakyThrows
    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // 当接口返回的类型消息转换器是 StringHttpMessageConverter 时，也就是说返回值类型是 String，因此就不可以直接返回 DataResult，需要转换成 JSON 字符串
        // 在 Spring Boot 中，StringHttpMessageConverter 消息转换器已经默认添加到了消息转换器列表中，它会将请求和响应中的字符串类型数据转换成 Java 中的 String 类型，当接口返回类型是字符串类型，则 StringHttpMessageConverter 会处理该请求，并将请求中的数据转换成 Java 中的 String 类型，如果我们直接返回到是 DataResult 类型就会出现类型转换异常 java.lang.ClassCastException: com.mw.common.DataResult cannot be cast to java.lang.String
        if (stringConverter.equalsIgnoreCase(selectedConverterType.getName())) {
            HttpHeaders headers = response.getHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            return objectMapper.writeValueAsString(DataResult.success(body));
        }
        if (body instanceof DataResult) { // 如果响应结果已经是 DataResult 类型，则直接返回
            return body;
        }
        return DataResult.success(body); // 全局配置响应体内容
    }
}
```

在这之后我们的控制层就可以这样编写：

```java
@RestController
public class TestController {

    @GetMapping("/hello")
    public String hello(){
        return "hello world";
    }
}
```

响应内容：

```json
{
  "code": 0,
  "data": "hello world",
  "message": "响应成功"
}
```

## 封装异常处理类

`@ExceptionHandler` 是 Spring Framework 提供的注解，用于处理控制器内部的异常。通过在方法上使用 `@ExceptionHandler` 注解，可以指定该方法用于处理特定异常类的异常

### 全局异常处理

::: tabs

@tab ResponseCode.java

```java
public enum ResponseCode {

    SUCCESS(0, "响应成功"),

    //服务端服务异常以 500 开头
    SYSTEM_ERROR(500000, "服务异常，请稍后再试"),
    OPERATION_ERROR(500001, "操作失败，请稍后再试"),

    //客户端服务异常以 400 开头
    DATA_PARAM_ERROR(400000, "参数异常"),
    ACCOUNT_ALREADY_EXISTS(400001, "账号已存在，请登录"),
    ACCOUNT_NOT_FOUND(400002, "账号不存在"),
    ACCOUNT_LOCK(400003, "账号已锁定，请联系管理员解锁"),
    ACCOUNT_ERROR(400004, "账户密码不匹配"),
    TOKEN_ERROR(401000, "token 已失效,请重新登录");

    private final int code;

    private final String message;

    ResponseCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

@tab RestResponseExceptionHandler.java

```java
@Slf4j
@RestControllerAdvice
public class RestResponseExceptionHandler {

    @ExceptionHandler(Exception.class)
    public DataResult exception(Exception e) {
        log.error("Exception：{}", e);
        return DataResult.fail(ResponseCode.SYSTEM_ERROR.getCode(), ResponseCode.SYSTEM_ERROR.getMessage());
    }
}
```

@tab TestController.java

```java
@RestController
public class TestController {
    
    @GetMapping("/error")
    public String error() {
        int i = 1 / 0;
        return "Test Error";
    }
}
```

响应内容：

```json
{
  "code": 500000,
  "data": null,
  "message": "服务异常，请稍后再试"
}
```

:::

### 自定义业务异常

::: tabs

@tab BusinessException.java

```java
public class BusinessException extends RuntimeException {

    private final int code;

    private final String message;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

@tab RestResponseExceptionHandler.java

```java
@Slf4j
@RestControllerAdvice
public class RestResponseExceptionHandler {

    /**
     * 自定义业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public DataResult BusinessException(BusinessException e) {
        log.error("BusinessException：{}", e);
        return DataResult.fail(e.getCode(), e.getMessage());
    }
}
```

@tab TestBusinessObj.java

```java
@Data
public class TestBusinessObj {

    private String username;

    private String password;

    private Integer age;
}
```

@tab TestController.java

```java
@RestController
public class TestController {

    @PostMapping("/test-business-error")
    public TestBusinessObj testBusError(@RequestBody TestBusinessObj obj) {
        if (!StringUtils.hasLength(obj.getUsername())) {
            throw new BusinessException(500000, "账号不能为空");
        } else if (!StringUtils.hasLength(obj.getPassword())) {
            throw new BusinessException(500000, "密码不能为空");
        }
        return obj;
    }
}
```

请求参数：

```json
{
  "age": 0,
  "username": "",
  "password": ""
}
```

响应内容：

```json
{
  "code": 500000,
  "data": null,
  "message": "账号不能为空"
}
```

:::

### 处理 validation 异常

要使用 validation 校验框架的前提必须先引入相关依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

::: tabs

@tab TestValidObj.java

```java
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class TestValidObj {

    @NotBlank(message = "账号不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码6-20位")
    private String password;

    private Integer age;
}
```

@tab RestResponseExceptionHandler.java

```java
import com.mw.common.DataResult;
import com.mw.common.ResponseCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class RestResponseExceptionHandler {

    /**
     * 处理 valid 异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public DataResult MethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException：{}", e);
        String message = e.getAllErrors().stream().map(ObjectError::getDefaultMessage).collect(Collectors.joining(","));
        return DataResult.fail(ResponseCode.DATA_PARAM_ERROR.getCode(), message);
    }
}
```

@tab TestController.java

```java
@RestController
public class TestController {

    @PostMapping("/test-valid")
    public TestValidObj testValidObj(@RequestBody @Valid TestValidObj obj) {
        return obj;
    }
}
```

请求参数：

```json
{
  "age": 0,
  "username": "",
  "password": ""
}
```

响应内容：

```json
{
  "code": 400000,
  "data": null,
  "message": "账号不能为空,密码不能为空,密码6-20位"
}
```

:::