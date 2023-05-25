---
date: 2022-03-28
category: IT
---

# Swagger

协议、错误处理和代码模块化只是您的团队在构建出色的 API 之前需要解决的一些问题。Swagger 提供了用于快速原型设计和构建 API 功能的工具

<!-- more -->

## Swagger V3

引入相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <version>3.0.0</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-boot-starter</artifactId>
        <version>3.0.0</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>3.0.0</version>
    </dependency>
</dependencies>
```

在 Swagger V3 中，你只需要引入相应的 Swagger 依赖，无需显式创建一个配置类，就可以启动项目后通过访问 `http://ip:port/swagger-ui/index.html` 来查看 Swagger UI 界面

![](https://img.sherry4869.com/blog/it/swagger/img.png)

## Swagger V2

引入相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <version>2.9.2</version>
    </dependency>

    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>2.9.2</version>
    </dependency>
</dependencies>
```

创建配置类

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket createApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo()) // 设置 API 的基本信息
                .select() // 用于指定要包含在 API 文档中的接口和路径
                .apis(RequestHandlerSelectors.basePackage("com.mw.controller")) // 筛选出要包含在API文档中的接口，你可以使用不同的条件和过滤器来定义所需的接口
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("示例 API") // API 文档的标题
                .description("这是一个示例 API 的文档") // API 文档的描述
                .version("1.0") // API 的版本号
                .termsOfServiceUrl("https://example.com/terms") // 服务条款的 URL
                .license("Apache License 2.0") // API 的许可证信息
                .licenseUrl("https://example.com/license") // 许可证的 URL
                .contact("John Doe", "john.doe@example.com") // API 负责人的联系方式，通常包括名称和邮箱
                .build();
    }
}
```

`new Docket(DocumentationType.SWAGGER_2).apis()` 方法可以接受一个 `Predicate<RequestHandler>` 类型的参数，该参数用于筛选出要包含在API文档中的接口。你可以使用不同的条件和过滤器来定义所需的接口

1. `apis(RequestHandlerSelectors.any())`：包括所有的接口

2. `apis(RequestHandlerSelectors.basePackage("com.example.controllers"))`：包括指定包下的接口

3. `apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))`：包括带有特定注解（例如 `@RestController`）的接口

4. `apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))`：包括带有特定注解（例如 `@ApiOperation`）的接口方法

启动项目后访问 `http://ip:port/swagger-ui.html` 来查看 Swagger UI 界面

![](https://img.sherry4869.com/blog/it/swagger/img_2.png)

## 常用注解

### @Api

用于描述整个 API 或 API 的一组相关接口。可以添加在控制器类上，用于提供 API 的标题、描述等信息

常用参数：

- `value`：API 的简要描述

- `tags`：API 所属的标签（分类），可以是一个或多个标签

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {
    // ...
}
```

### @ApiOperation

用于描述单个接口的操作信息。可以添加在具体的方法上，用于提供接口的标题、描述、请求方法等信息

常用参数：

- `value`：操作的简要描述

- `notes`：操作的详细描述

- `tags`：操作所属的标签（分类），可以是一个或多个标签

- `httpMethod`：操作的 HTTP 方法，如 GET、POST、PUT、DELETE 等

- `response`：操作的响应类型

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @ApiOperation(value = "Get user by ID", notes = "Returns a single user based on ID")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        // ...
    }
}
```

### @ApiParam

用于描述接口参数的信息。可以添加在方法的参数上，用于提供参数的名称、描述、类型、是否必需等信息

常用参数：

- `name`：参数的名称

- `value`：参数的简要描述

- `defaultValue`：参数的默认值

- `required`：参数是否为必需，默认为 false

- `allowableValues`：参数的允许值范围

- `dataType`：参数的数据类型

- `paramType`：参数的类型，如 path、query、body 等

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @ApiOperation(value = "Add a new user")
    @PostMapping("/")
    public void addUser(@ApiParam(value = "User object", required = true) @RequestBody User user) {
        // ...
    }
}
```

### @ApiModel

用于描述数据模型（DTO、实体类等）。可以添加在实体类上，用于提供数据模型的名称、描述等信息

常用参数：

- `value`：数据模型的名称

- `description`：数据模型的描述

示例：

```java
@ApiModel(value = "User", description = "User entity")
public class User {
    // ...
}
```

### @ApiModelProperty

用于描述数据模型的属性。可以添加在实体类的字段上，用于提供属性的名称、描述、数据类型等信息

常用参数：

- `value`：属性的简要描述

- `name`：属性的名称

- `example`：属性的示例值

- `dataType`：属性的数据类型

- `required`：属性是否为必需，默认为 false

示例：

```java
public class User {
    
    @ApiModelProperty(value = "User ID")
    private Long id;

    @ApiModelProperty(value = "Username", example = "john")
    private String username;
}
```

### @ApiResponse

用于描述接口的响应信息。可以添加在方法上，用于提供响应的状态码、描述、响应数据类型等信息

常用参数：

- `code`：响应的状态码

- `message`：响应的简要描述

- `response`：响应的数据类型

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @ApiOperation(value = "Delete a user")
    @DeleteMapping("/{id}")
    @ApiResponse(code = 204, message = "User deleted successfully")
    public void deleteUser(@PathVariable Long id) {
        // ...
    }
}
```

### @ApiResponses

用于描述多个接口响应的信息。可以添加在方法上，用于提供多个 `@ApiResponse` 注解，定义不同的响应

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @ApiOperation(value = "Delete a user")
    @DeleteMapping("/{id}")
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "User deleted successfully"),
            @ApiResponse(code = 404, message = "User not found")
    })
    public void deleteUser(@PathVariable Long id) {
        // ...
    }
}
```

### @ApiIgnore

用于忽略不需要暴露为API的接口或方法。可以添加在控制器类或方法上，用于指示 Swagger 忽略该接口或方法

`@ApiIgnore` 注解没有定义任何参数，它只是一个标记注解，将其添加到需要忽略的接口或方法上即可

示例：

```java
@Api(value = "User API", tags = "User Management")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @ApiOperation(value = "Add a new user")
    @PostMapping("/")
    public void addUser(@ApiIgnore @RequestBody User user) {
        // ...
    }

    @ApiOperation(value = "Update user")
    @PutMapping("/{id}")
    public void updateUser(@PathVariable Long id, @ApiIgnore @RequestBody User user) {
        // ...
    }

    @ApiOperation(value = "Delete user")
    @DeleteMapping("/{id}")
    @ApiIgnore
    public void deleteUser(@PathVariable Long id) {
        // ...
    }

    @ApiIgnore
    public void internalMethod() {
        // This method will be ignored by Swagger
    }
}
```

在上述示例中，`@ApiIgnore` 注解被添加到了需要忽略的接口、方法或类上。这些被标记的元素将不会出现在生成的 Swagger 文档中，从而隐藏起来