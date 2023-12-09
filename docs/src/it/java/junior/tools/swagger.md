---
category: IT
tag: Java
order: 4
article: false
---

# Swagger

官网：[https://swagger.io](https://swagger.io/)

协议、错误处理和代码模块化只是您的团队在构建出色的 API 之前需要解决的一些问题。Swagger 提供了用于快速原型设计和构建 API 功能的工具

## Swagger V2.0

### 引入相关依赖

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

### 新增配置项

```properties
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```

默认情况下，Spring MVC 使用 URI 模板（uri_template）匹配策略来匹配请求路径，这种策略对大多数情况下都适用。然而，当引入 Swagger 框架时，由于 Swagger 会解析请求路径和参数，使用 URI 模板匹配策略可能会导致路径解析错误或路径重复

为了解决这个问题，需要将路径匹配策略设置为 Ant 路径匹配，即 `spring.mvc.pathmatch.matching-strategy=ant_path_matcher`。Ant 路径匹配更灵活，可以处理带有通配符和占位符的路径模式，能够更准确地匹配和映射请求路径，确保 Swagger 能够正确解析 API 的路径和参数

### 创建配置类

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
                .contact(contact(new Contact("John Doe", "https://example.com", "john.doe@example.com"))) // API 负责人的联系方式，通常包括联系人名称、URL 和电子邮件地址
                .build();
    }
}
```

::: info springfox.documentation.spring.web.plugins.ApiSelectorBuilder#apis

该方法可以接受一个 `Predicate<RequestHandler>` 类型的参数，该参数用于筛选出要包含在 API 文档中的接口。你可以使用不同的条件和过滤器来定义所需的接口

- `apis(RequestHandlerSelectors.any())` 包括所有的接口

- `apis(RequestHandlerSelectors.basePackage("com.example.controllers"))` 包括指定包下的接口

- `apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))` 包括带有特定注解（例如 `@RestController`）的接口

- `apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))` 包括带有特定注解（例如 `@ApiOperation`）的接口方法

:::

启动项目后访问 `http://${ip}:${port}/swagger-ui.html` Swagger UI 界面

![](https://img.sherry4869.com/blog/it/java/junior/tools/swagger/img_2.png)

## Swagger V3.0

### 引入相关依赖

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

### 新增配置项

```properties
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```

默认情况下，Spring MVC 使用 URI 模板（uri_template）匹配策略来匹配请求路径，这种策略对大多数情况下都适用。然而，当引入 Swagger 框架时，由于 Swagger 会解析请求路径和参数，使用 URI 模板匹配策略可能会导致路径解析错误或路径重复

为了解决这个问题，需要将路径匹配策略设置为 Ant 路径匹配，即 `spring.mvc.pathmatch.matching-strategy=ant_path_matcher`。Ant 路径匹配更灵活，可以处理带有通配符和占位符的路径模式，能够更准确地匹配和映射请求路径，确保 Swagger 能够正确解析 API 的路径和参数

---

在 Swagger V3.0 中，无需显式创建一个配置类，就可以直接在启动项目后访问 `http://${ip}:${port}/swagger-ui/index.html` Swagger UI 界面

![](https://img.sherry4869.com/blog/it/java/junior/tools/swagger/img.png)

### 创建配置类

虽说无需显式创建配置类，但如有相关配置需求也可以创建配置类

```java
@Configuration
@EnableOpenApi
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Your API Title") // API 文档的标题
                        .version("1.0.0") // API 的版本号
                        .description("Your API Description") // API 文档的描述
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")) // 许可证的 URL
                );
    }
}
```

## knife4j

Knife4j 是一个集 Swagger2 和 OpenAPI3 为一体的增强解决方案

官网：[https://doc.xiaominfo.com](https://doc.xiaominfo.com/)

### 引入相关依赖

```xml
<!--引入Knife4j的官方start包,该指南选择Spring Boot版本<3.0,开发者需要注意-->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
    <version>4.0.0</version>
</dependency>
```

### 创建配置类

```java
@Configuration
@EnableSwagger2WebMvc
public class Knife4jConfiguration {

    @Bean(value = "docketBean")
    public Docket dockerBean() {
        //指定使用 Swagger2 规范
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(new ApiInfoBuilder()
                        //描述字段支持 Markdown 语法
                        .description("# Knife4j RESTful APIs")
                        .termsOfServiceUrl("https://doc.xiaominfo.com/")
                        .version("1.0")
                        .build())
                .groupName("用户服务") //分组名称
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.github.xiaoymin.knife4j.controller")) //这里指定 Controller 扫描包路径
                .paths(PathSelectors.any())
                .build();
        return docket;
    }
}
```

启动项目后访问 `http://${ip}:${port}/doc.html` Knife4j 的文档地址

![](https://img.sherry4869.com/blog/it/java/junior/tools/swagger/img_4.png)

## 关闭 Swagger

在生产环境中，关闭 Swagger 是一种常见的做法，以防止未经授权的访问和减少潜在的安全风险。以下是一些常用的方法来关闭 Swagger：

1. 使用配置文件：

    在你的应用程序的配置文件中，可以通过设置来禁用 Swagger 相关的功能。具体的设置方式可能因使用的框架和配置文件格式而有所不同。对于 Spring Boot，可以在 `application-prod.properties` 或 `application-prod.yml` 文件中添加以下配置来禁用 Swagger：
    
    ```properties
    springfox.documentation.enabled=false
    ```

2. 使用条件注解：

在 Swagger 配置类上使用条件注解，根据环境或配置的条件来决定是否加载 Swagger 相关的配置。对于 Spring Boot，可以使用 `@Profile` 注解或自定义的条件注解来控制 Swagger 配置类的加载。例如，只在非生产环境下加载 Swagger：

```java
@Configuration
@Profile("!prod")
@EnableOpenApi
//@EnableSwagger2
public class SwaggerConfig {
    // 配置 Swagger
}
```

## 常见问题

![](https://img.sherry4869.com/blog/it/java/junior/tools/swagger/img_3.png)

它指示在使用动态 servlet 注册或 API 位于 API 网关后时无法自动推断 Swagger 资源的基本 URL。基本 URL 是指 Swagger 资源所服务的根路径。例如，如果 API 的访问地址是 http://example.org/api/v2/api-docs ，那么基本 URL 应为 http://example.org/api/

我们检测一下项目中是否配置了一个实现了 `ResponseBodyAdvice` 接口的实现类。该类用于对响应体进行全局处理，如有该类，请查看类中重写的 `supports()` 方法是否返回 `true` 且没有过滤 Swagger 的接口。因为如果 `supports()` 方法返回 `true`，就会执行重写的 `beforeBodyWrite()` 方法，方法里返回的数据封装格式与 Swagger 接口里返回的数据格式不匹配导致获取不了 Swagger 资源的基本 URL

如果是该原因导致的，那么我们就需要在实现类中的 `supports()` 方法里过滤 Swagger 接口

```java
@Slf4j
@RestControllerAdvice
public class RestResponseBodyAdvice implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        // log.info(returnType.getDeclaringClass().getName()); // 用于获取声明响应体的方法的类的全限定名（Fully Qualified Name）当调用 Swagger 接口时，将打印出 springfox.documentation.swagger.web.ApiResourceController 以及 springfox.documentation.swagger2.web.Swagger2ControllerWebMvc
        return !returnType.getDeclaringClass().getName().contains("springfox.documentation"); // 过滤 Swagger 的接口
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // ...
    }
}
```

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