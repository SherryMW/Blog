---
date: 2023-05-26
category: IT
tag:
  - Java
  - Spring
headerDepth: 1
---

# Spring 常用注解

持续更新中

<!-- more -->

## @Controller

`@Controller` 注解用于标识一个类为 Spring MVC 的控制器，它负责处理客户端请求，并根据请求的处理结果返回相应的响应。控制器中的方法通过注解标识请求的 URL 映射关系，并决定返回逻辑视图或具体的数据

- 作用：

    - `@Controller` 注解用于将一个类标识为 Spring MVC 的控制器

    - 控制器负责处理客户端请求并返回相应的响应

- 特点：

    - `@Controller` 注解通常与请求处理方法（也称为处理器方法）一起使用

    - 控制器类中的方法用于处理具体的请求，它们使用注解 [@RequestMapping](#requestmapping) 标识了处理的 URL 映射关系

    - 控制器类通常通过处理器方法返回逻辑视图名称或使用 [@ResponseBody](#responsebody) 注解返回具体的数据，将结果发送给客户端

下面是一个简单的示例来说明 `@Controller` 注解的用法：

```java
@Controller
public class HomeController {

    @RequestMapping("/")
    public String home() {
        return "home";
    }
}
```

在上述示例中，`HomeController` 类使用 `@Controller` 注解标识为一个控制器。`home()` 方法上使用了 [@RequestMapping](#requestmapping) 注解，表示处理根路径 / 的请求。方法的返回值为字符串 "home"，它代表逻辑视图名称，用于指定要渲染的视图模板

当客户端发起根路径 / 的请求时，Spring MVC 将根据 URL 映射关系找到 `HomeController` 类，并调用 `home()` 方法处理请求。然后，根据方法的返回值 "home"，选择相应的视图模板进行渲染，并将生成的 HTML 页面返回给客户端

## @RequestMapping

`@RequestMapping` 注解用于映射请求路径和处理器方法，它可以用在方法级别或类级别上。通过指定请求路径、请求方法等属性，可以精确地将请求映射到对应的处理器方法上

- 作用：

    - `@RequestMapping` 注解用于将一个方法或类与特定的请求路径进行映射

    - 它可以用于处理各种 HTTP 请求，如 GET、POST、PUT、DELETE 等

- 使用位置：

    - `@RequestMapping` 注解可以在方法级别或类级别上使用

    - 在方法级别上使用时，它将指定该方法处理的请求路径，该路径将相对于类级别上的路径

    - 在类级别上使用时，它将指定该类中所有处理器方法的公共请求路径前缀

- 请求路径匹配：

    - 请求路径可以是固定的字符串，也可以包含占位符（例如 `/users/{id}`）

    - 占位符可以使用 [@PathVariable](#pathvariable) 注解绑定到方法参数上，以获取路径中的动态部分

- 请求方法限定：

    - 通过 `method` 属性可以限定处理的请求方法，如 GET、POST、PUT 等

    - 如果未指定 `method` 属性，则默认处理所有的请求方法

下面是一些示例，展示了 `@RequestMapping` 注解的使用：

```java
@Controller
@RequestMapping("/users")
public class UserController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getUsers() {
        // 处理获取用户列表的逻辑
        return "userList";
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public String getUserById(@PathVariable Long id) {
        // 处理根据用户ID获取用户信息的逻辑
        return "userDetail";
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public User createUser(@RequestBody User user) {
        // 处理创建用户的逻辑
        return userService.createUser(user);
    }

    // 其他处理器方法...
}
```

在上述示例中，`UserController` 是一个控制器类，使用 [@Controller](#controller) 注解进行标识。类级别上使用了 `@RequestMapping("/users")` 注解，指定了该类中所有处理器方法的公共请求路径前缀为 "/users"

`getUsers()` 方法使用了 `@RequestMapping(value = "/", method = RequestMethod.GET)` 注解，表示处理 GET 请求的路径为 "/users/"。方法处理获取用户列表的逻辑，并返回逻辑视图名称 "userList"

`getUserById()` 方法使用了 `@RequestMapping(value = "/{id}", method = RequestMethod.GET)` 注解，表示处理 GET 请求的路径为 "/users/{id}"。方法通过 [@PathVariable](#pathvariable) 注解将路径中的占位符 {id} 绑定到方法的参数 id 上，然后处理根据用户 ID 获取用户信息的逻辑，并返回逻辑视图名称 "userDetail"

`createUser()` 方法使用了 `@RequestMapping(value = "/", method = RequestMethod.POST)` 注解，表示处理 POST 请求的路径为 "/users/"。方法使用 [@RequestBody](#responsebody) 注解将请求体中的数据绑定到方法的参数 user 上，然后处理创建用户的逻辑，并以 JSON 格式返回创建的用户对象

## @ResponseBody

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

例如，如果客户端的请求头中指定了 Accept 属性为 application/json，那么 Spring MVC 将使用 JSON 消息转换器将方法的返回值转换为 JSON 格式的响应。如果客户端的 Accept 属性为 application/xml，则将使用 XML 消息转换器转换为 XML 格式的响应
:::

通过使用 `@ResponseBody` 注解，您可以轻松地将方法的返回值直接作为响应体返回给客户端，而无需经过视图解析器进行视图渲染。这在构建 RESTful API 或需要直接返回数据的场景中非常有用

## @RestController

`@RestController` 注解用于标识一个类是 RESTful 风格的控制器，在类级别上使用它相当于同时添加了 [@Controller](#controller) 和 [@ResponseBody](#responsebody) 注解。它简化了编写 RESTful 接口的代码，处理器方法可以直接返回数据作为响应，自动进行序列化为指定的响应格式

- 作用：

    - `@RestController` 注解用于标识一个类是 RESTful 风格的控制器，主要用于构建基于 RESTful 架构风格的 Web 服务
    
    - 它是 `@Controller` 和 `@ResponseBody` 注解的组合，表明该类中的所有处理器方法都会返回数据作为响应，而不是通过视图解析器进行视图渲染

- 请求处理：

    - 处理器方法可以直接返回对象、集合、字符串或其他数据类型，它们将自动转换为相应的响应格式（如 JSON、XML 等），不需要显式地使用 `@ResponseBody` 注解

- 自动序列化：

    - 在 `@RestController` 类中，返回的对象或数据将自动进行序列化为指定的响应格式，如 JSON 或 XML

    - Spring MVC 使用消息转换器（Message Converter）来处理对象到响应格式的转换，根据配置自动选择合适的消息转换器

下面是一个示例，展示了一个使用 `@RestController` 注解的类：

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        // 根据用户ID查询用户信息
        User user = userService.getUserById(id);
        return user;
    }

    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // 创建用户并返回
        userService.createUser(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    // 其他处理器方法...
}
```

在上述示例中，`UserController` 是一个使用 `@RestController` 注解标识的类，它被认为是一个 RESTful 风格的控制器

`getUserById()` 方法使用 `@GetMapping("/{id}")` 注解，表示处理 GET 请求的路径为 "/users/{id}"。方法通过 [@PathVariable](#pathvariable) 注解将路径中的占位符 {id} 绑定到方法的参数 id 上，然后根据用户 ID 查询用户信息，并直接返回用户对象，它将自动序列化为 JSON 格式

`createUser()` 方法使用 `@PostMapping("/")` 注解，表示处理 POST 请求的路径为 "/users/"。方法使用 [@RequestBody](#responsebody) 注解将请求体中的数据绑定到方法的参数 user 上，然后创建用户，并返回创建的用户对象。返回类型为 `ResponseEntity<User>`，它包含了响应状态码和响应体

## @PathVariable

`@PathVariable` 注解用于将请求路径中的变量值绑定到方法参数上，使得我们能够在处理器方法中获取到路径中的动态部分，并根据需要进行业务处理

- 作用：

    - `@PathVariable` 注解用于从请求路径中提取变量的值，并将其绑定到方法的参数上
    
    - 它通常用于处理 RESTful 风格的请求，通过路径中的变量来传递参数

- 使用位置：

    - `@PathVariable` 注解可以在方法参数上使用，用于指定要绑定的路径变量的名称
    
    - 注解的值可以是变量名称，也可以使用 value 属性来指定变量名称

- 绑定方式：

    - `@PathVariable` 注解可以绑定到基本数据类型（如 int、long）、包装类、字符串等类型的参数上

    - Spring MVC 会自动将路径中的变量值进行类型转换，并绑定到方法参数上

下面是一个示例，展示了 `@PathVariable` 注解的使用：

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/{id}")
    public User getUserById(@PathVariable("id") Long userId) {
        // 根据用户ID查询用户信息
        User user = userService.getUserById(userId);
        return user;
    }

    // 其他处理器方法...
}
```

在上述示例中，`getUserById()` 方法使用了 `@GetMapping("/{id}")` 注解，表示处理 GET 请求的路径为 "/users/{id}"。方法的参数上使用了 `@PathVariable("id")` 注解，它将路径中的变量名 "id" 与方法参数 userId 进行绑定

当请求路径为 "/users/123" 时，Spring MVC 会自动将路径中的 "123" 绑定到 userId 参数上，作为方法的输入参数。然后，可以在方法体内根据用户 ID 查询用户信息并返回

## @ControllerAdvice

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

下面是一个示例，展示了 `@ControllerAdvice` 注解的使用：

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

## @RestControllerAdvice

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

- supports() 方法：

    - 这个方法用于判断需要处理的响应体类型

    - 通过 `MethodParameter` 参数可以获取到处理方法的返回类型信息，通过 `converterType` 参数可以获取到消息转换器的类型信息

    - 在这段示例代码中，`supports()` 方法直接返回 true，表示对所有类型的响应体进行处理

- beforeBodyWrite() 方法：

    - 这个方法在响应体返回之前被调用，用于对响应体进行处理

    - 它接收到原始的响应体 body，可以对其进行修改或添加额外的信息，然后再返回修改后的响应体

    - 除了原始的响应体 body，还可以通过其他参数获取到更多的信息，如 `returnType` 获取返回类型信息，`selectedContentType` 获取选定的媒体类型信息，`request` 获取请求信息，`response` 获取响应信息等

    - 在这段示例代码中，`beforeBodyWrite()` 方法直接返回原始的响应体 body，没有进行任何修改

## @ExceptionHandler

`@ExceptionHandler` 注解用于定义处理异常的方法。当控制器中抛出指定类型的异常时，被 `@ExceptionHandler` 注解标记的方法会被调用，用于处理该异常并返回相应的错误信息或视图

- 功能：

    - `@ExceptionHandler` 注解用于定义处理异常的方法

    - 当控制器中抛出指定类型的异常时，被 `@ExceptionHandler` 注解标记的方法会被调用

- 用法：

    - 在控制器类或全局配置类中的方法上添加 `@ExceptionHandler` 注解

    - 注解中指定异常类型，用于匹配抛出的异常

- 特点：

    - 可以在控制器类中定义局部的异常处理方法，也可以在全局配置类中定义全局的异常处理方法

    - 异常处理方法可以返回不同的结果，如自定义错误信息、错误页面或重定向等

    - 支持多个 `@ExceptionHandler` 注解，用于处理不同类型的异常

以下是一个示例，展示了 `@ExceptionHandler` 注解的使用：

```java
public class UserNotFoundException extends RuntimeException {
    
    private String userId;

    public UserNotFoundException(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }
}
```

在上述代码中，`UserNotFoundException` 异常类继承了 `RuntimeException`，表示这是一个运行时异常。它还包含了一个 userId 字段，用于保存找不到的用户的标识

```java
@Controller
public class UserController {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + ex.getUserId());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new UserNotFoundException(userId);
        }
        return ResponseEntity.ok(user);
    }
}
```

在上述示例中，`UserController` 类中定义了一个处理 `UserNotFoundException` 的异常处理方法，使用了 `@ExceptionHandler(UserNotFoundException.class)` 注解

`handleUserNotFoundException()` 方法会在控制器中抛出 `UserNotFoundException` 异常时被调用。它返回一个带有错误信息的 `ResponseEntity` 对象，指定了响应状态码为 404 Not Found

在 `getUser()` 方法中，如果找不到指定的用户，就会抛出 `UserNotFoundException` 异常，然后该异常会被 `handleUserNotFoundException()` 方法捕获并处理

## @InitBinder

`@InitBinder` 注解可以对请求参数进行预处理和格式转换，以确保数据的正确性和一致性。你可以根据具体的业务需求，在 `@InitBinder` 注解的方法中添加适当的绑定器配置，满足数据绑定的特定需求

- 功能：

    - `@InitBinder` 注解用于定义数据绑定规则的方法

    - 这些方法会在控制器中的请求处理方法执行之前被调用，用于对请求参数进行预处理和格式转换

- 用法：

    - 在控制器类中的方法上添加 `@InitBinder` 注解

    - 注解中指定要绑定的请求参数类型或参数名称

- 特点：

    - 可以在控制器类中定义多个 `@InitBinder` 注解的方法，用于处理不同类型或不同名称的请求参数

    - 方法的参数可以是 `WebDataBinder` 类型，用于进行数据绑定和格式转换的配置

    - 可以在 `@InitBinder` 注解的方法中使用各种绑定器方法，如设置忽略字段、注册自定义编辑器等

以下是一个示例，展示了 `@InitBinder` 注解的使用：

````java
@Controller
public class UserController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        // ...
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // ...
    }
}
````

在上述示例中，`UserController` 类中定义了一个使用 `@InitBinder` 注解的方法 `initBinder()`

在 `initBinder()` 方法中，我们创建了一个 `SimpleDateFormat` 对象，并将其注册为 `Date.class` 类型的自定义编辑器。这样，在请求参数绑定时，可以将字符串类型的日期转换为 `Date` 对象，使用指定的日期格式进行绑定

这样，无论是在 `getUser()` 方法中通过路径参数获取日期，还是在 `createUser()` 方法中通过请求体获取日期，都会先经过 `initBinder()` 方法进行日期格式的转换

---

```java
@RestControllerAdvice
public class DataBindingAdvice {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // 在这里定义数据绑定规则
        binder.registerCustomEditor(LocalDate.class, new LocalDateEditor());
    }

    // 自定义 LocalDate 类型的编辑器
    private static class LocalDateEditor extends PropertyEditorSupport {
        
        @Override
        public void setAsText(String text) throws IllegalArgumentException {
            LocalDate date = LocalDate.parse(text);
            setValue(date);
        }
    }
}
```

在上述代码中，`DataBindingAdvice` 类被标记为 `@RestControllerAdvice`，表示它是一个全局的控制器增强类。它使用了 `@InitBinder` 注解来定义数据绑定规则的方法

通过 `binder.registerCustomEditor()` 方法注册了一个自定义的编辑器，用于将字符串类型的日期转换为 `LocalDate` 对象。我们创建了一个名为 `LocalDateEditor` 的内部类，继承自 `PropertyEditorSupport`，并在其中重写了 `setAsText()` 方法。在该方法中，我们使用 `LocalDate.parse()` 方法将字符串解析为 `LocalDate` 对象，并将其设置为属性值

这样，在控制器方法中使用 `LocalDate` 类型的参数时，框架会自动应用我们定义的编辑器进行类型转换和数据绑定

## @ModelAttribute

`@ModelAttribute` 注解可以方便地将方法的返回值或方法参数与模型（Model）进行绑定，实现数据的传递和共享。这在处理表单提交、页面渲染等场景中非常有用

在控制器类中的方法上使用 `@ModelAttribute` 注解时，它具有以下两种用法：

1. 将方法的返回值添加到模型中：

    - 在方法上使用 `@ModelAttribute` 注解，该方法的返回值将被添加到模型中，并以指定的属性名作为键

    - 在视图渲染时，可以通过该属性名在模型中获取对应的值

2. 将方法参数绑定到模型中：

    - 在方法参数上使用 `@ModelAttribute` 注解，该参数将从模型中获取对应的值，并将其绑定到该参数上

    - 当请求中存在与模型中对应属性名的值时，会将该值赋给方法参数；如果不存在，则会创建一个新的对象，并将请求中的值绑定到该对象上

```java
@Controller
@RequestMapping("/users")
public class UserController {

    @ModelAttribute("userInfo")
    public UserInfo getUserInfo() {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("John Doe");
        userInfo.setAge(25);
        return userInfo;
    }

    @GetMapping("/profile")
    public String userProfile(@ModelAttribute("userInfo") UserInfo userInfo) {
        // 在此处使用 userInfo 对象进行处理
        return "profile";
    }
}
```

在上述代码中 `getUserInfo()` 方法使用 `@ModelAttribute` 注解，并指定属性名为 "userInfo"。该方法返回一个 `UserInfo` 对象，并将其添加到模型中

`userProfile()` 方法接受一个名为 userInfo 的 `UserInfo` 对象作为参数，并使用 `@ModelAttribute("userInfo")` 注解将模型中的 "userInfo" 属性绑定到该参数上

在请求 /users/profile 时，Spring 框架会自动从模型中获取名为 "userInfo" 的属性值，并将其作为方法参数 userInfo 的值进行绑定。如果模型中不存在 "userInfo" 属性，则会创建一个新的 UserInfo 对象，并将请求中的值绑定到该对象上