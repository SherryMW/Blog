---
category: IT
order: 1
article: false
---

# JWT

官网：[https://jwt.io](https://jwt.io/)

## 传统 Session 校验

Session 校验机制是一种在 Web 应用程序中确保用户身份验证和授权的方法。它通常涉及到以下步骤：

1. 用户登录：用户在网站上输入用户名和密码进行登录。一旦用户成功登录，服务器会验证用户提供的凭证，并在服务器端创建一个称为“会话（Session）”的数据结构

2. 生成 Session ID：服务器为该用户生成一个唯一的 Session ID，通常是一个长字符串，用于唯一标识该用户的会话。这个 Session ID 会与用户的其他信息一起存储在服务器端

3. 发送 Session ID 到客户端：服务器将生成的 Session ID 发送到客户端，通常是通过 HTTP 响应的 Cookie 头。这个 Cookie 通常包含了 Session ID 以及其他必要的信息，如过期时间等

4. 客户端存储 Session ID：客户端浏览器收到 Session ID 后，通常会将其存储在本地，以便在后续的 HTTP 请求中发送给服务器

5. 每次请求携带 Session ID：每当用户在浏览器中请求与该会话关联的网页时，浏览器都会自动将存储的 Session ID 发送到服务器。服务器通过检查 Session ID，可以识别请求的用户

6. 服务器端验证 Session ID：服务器在接收到带有 Session ID 的请求时，会检查该 Session ID 是否存在以及是否有效。这通常涉及到在服务器端存储一个会话存储，以便根据 Session ID 检索用户相关信息

7. Session 超时处理：为了安全起见，会话通常具有一个过期时间。一旦过期，用户将需要重新登录。服务器可以通过定期清理过期的会话来维护系统的性能和安全性

8. 注销：用户可以选择注销，此时服务器会使相应的会话无效，用户需要重新登录

需要注意的是，虽然传统的 Session 校验机制是一种常见的方式，但它也有一些安全性和可伸缩性的问题。例如，可能存在 Session 劫持或会话固定等攻击。因此，在实施这些机制时，开发人员需要注意安全最佳实践，如使用 HTTPS 来加密通信，并定期更新 Session ID 等

## Token 校验

Token 身份验证机制是另一种用于确保用户身份验证和授权的方法，与传统的 Session 机制不同。以下是使用 Token 的身份验证过程的详细描述：

1. 用户登录：用户在网站上输入用户名和密码进行登录

2. 生成 Token：服务器通过对用户提供的凭证进行验证，如果验证成功，会生成一个 Token 作为用户身份的标识符。Token 通常是一个长字符串，可以包含加密的用户信息和其他元数据

3. 发送 Token 到客户端：服务器将生成的 Token 发送到客户端，通常是通过 HTTP 响应的 Authorization 头。这个 Token 是客户端在后续请求中证明身份的凭证

4. 客户端存储 Token：客户端收到 Token 后，通常将其存储在本地，例如在浏览器的 LocalStorage 或在移动应用的内存中

5. 每次请求携带 Token：每当用户在浏览器中请求与身份验证相关的资源时，客户端会在请求中包含 Token，通常通过 Authorization 头

6. 服务器端验证 Token：服务器在接收到带有 Token 的请求时，会解析 Token 并验证其有效性。这通常涉及到使用密钥对 Token 进行签名验证，并检查 Token 是否在有效期内

7. Token 超时处理：Token 通常具有一个过期时间，一旦过期，用户需要重新登录。客户端和服务器都应该处理 Token 过期的情况，可以通过刷新 Token 或要求用户重新登录来解决

8. 注销：由于 Token 通常是无状态的，注销通常是通过让客户端删除存储的 Token 来实现。如果需要强制用户注销，可以考虑使用黑名单或在服务器端使 Token 失效

Token 被认为是无状态的，主要是因为 Token 本身包含了所有必要的信息，以便在服务器端验证和处理请求，而服务器并不需要在自己的存储中保留关于用户状态的信息。这与传统的基于 Session 的认证机制有所不同，后者在服务器端需要维护会话状态

下面是一些关于 Token 无状态性的主要理由：

1. 信息完备性：Token 包含了所有必要的信息，包括用户标识、授权信息、声明等。因此，服务器端无需在本地存储用户的相关信息，而可以通过解析 Token 中的信息完成身份验证和授权操作

2. 无需服务器端存储：与传统的 Session 机制不同，服务器端不需要在数据库或其他地方维护关于用户的会话信息。每次请求都包含了足够的信息，服务器可以直接从 Token 中提取所需的信息

3. 分布式系统适用：由于 Token 本身包含了所有必要的信息，因此它非常适合在分布式系统中进行身份验证。不同的服务节点可以独立地验证 Token，而无需共享会话状态

4. 可伸缩性：由于服务器端无需维护会话状态，Token 机制在构建高度可伸缩的系统时更具优势。无需考虑会话同步、共享状态等问题，每个服务节点可以独立地验证 Token

总体而言，Token 机制相对于 Session 机制更为灵活，特别适用于分布式系统和无状态的 API 服务。它可以与不同的身份验证提供者（如OAuth）结合使用，并支持跨多个应用程序和平台的身份验证

## 什么是 JWT

JSON Web Token（JWT） 是一种开放标准 （[RFC 7519](https://tools.ietf.org/html/rfc7519)），它定义了一种紧凑且独立的方式，可在各方之间以 JSON 对象的形式安全地传输信息。由于该信息经过数字签名，因此可以验证和信任。JWT 可以使用密文（HMAC 算法）或使用 RSA 或 ECDSA 的公钥/私钥对进行签名。

虽然 JWT 也可以加密，以在各方之间提供保密性，但我们将重点关注签名令牌。已签名的令牌可以验证其中所含声明的完整性，而加密令牌则可以向其他各方隐藏这些声明。当使用公钥/私钥对对令牌进行签名时，签名还会证明只有持有私钥的一方才是签名的一方

## 何时应使用 JWT

下面是 JSON Web Token 有用的一些方案：

- **授权**：这是使用 JWT 的最常见方案。用户登录后，每个后续请求都将包含 JWT，允许用户访问该令牌允许的路由、服务和资源。单点登录是当今广泛使用 JWT 的一项功能，因为它的开销很小，并且能够轻松地跨不同域使用

- **信息交换**：JSON Web Token 是在各方之间安全传输信息的好方法。由于可以对 JWT 进行签名（例如，使用公钥/私钥对），因此您可以确定发送者是他们所说的人。此外，由于签名是使用标头和有效负载计算的，因此您还可以验证内容是否未被篡改

## JWT 结构

在其紧凑的形式中，JSON Web Token 由三部分组成，用 `.` 分隔，它们是：

- Header

- Payload

- Signature

因此，JWT 通常如下所示：

`xxxxx.yyyyy.zzzzz`

让我们解析不同的部分：

### Header（头部）

Header 通常由两部分组成：Token 的类型（JWT）和正在使用的签名算法，例如 HMAC SHA256 或 RSA。

例如：

```json
{
"alg":"HS256",
"type":"JWT"
}
```

然后，此 JSON 经过 Base64Url 编码，形成 JWT 的第一部分：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

### Payload（载荷）

Token 的第二部分是有效负载，其中包含声明。声明是关于实体（通常是用户）和其他数据的语句。 声明分为三种类型：注册声明、公共声明和私人声明

- [**注册**](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)声明：这些是一组预定义的声明，这些声明不是强制性的，但建议提供一组有用的、可互操作的声明。其中一些是：**iss**（发行人）、**exp**（到期时间）、**sub**（主题）、**aud**（受众）及[其他](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1)

- [**公共**](https://datatracker.ietf.org/doc/html/rfc7519#section-4.2)声明：这些声明可以由使用 JWT 的人随意定义。但为了避免冲突，应在 [IANA JSON Web Token 注册表](https://www.iana.org/assignments/jwt/jwt.xhtml)中定义它们，或将其定义为包含防冲突命名空间的 URI

- [**私人**](https://datatracker.ietf.org/doc/html/rfc7519#section-4.3)声明：这些是自定义声明，用于在同意使用它们的各方之间共享信息，既不是注册声明，也不是公开声明

有效负载示例如下：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

然后，对有效负载进行 Base64Url 编码，以形成 JSON Web Token 的第二部分

eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

::: warning
对于已签名的令牌，此信息虽然可以防止篡改，但任何人都可以读取。不要将机密信息放在 JWT 的有效负载或标头元素中，除非它是加密的
:::

### Signature（签名）

要创建签名部分，您必须获取编码的标头、编码的有效负载、密钥、标头中指定的算法，并对其进行签名

使用头部中指定的算法和秘钥将 Header 和 Payload 用 Base64URL 编码后，再用点(`.`)连接起来。然后使用签名算法和密钥对这个字符串进行签名，以验证 Token 的完整性和来源。生成签名的时候需要指定一个密码（secret），该密码保存在服务器中，并且不能向用户公开

例如，如果要使用 HMAC SHA256 算法，则将按以下方式创建签名：

```scss
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

签名用于验证信息在传输过程中是否被更改，如果是用私钥签名的令牌，签名还可以验证 JWT 的发送者是否如其所言

签名结果：SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

### 把所有的东西放在一起

输出结果是三个 Base64-URL 字符串，中间用点隔开，可在 HTML 和 HTTP 环境中轻松传递，与基于 XML 的标准（如 SAML）相比更加紧凑

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

如果您想使用 JWT 并将这些概念付诸实践，可以使用 [jwt.io Debugger](https://jwt.io/#debugger-io) 来解码、验证和生成 JWT

## JWT 如何工作

在身份验证中，当用户使用其凭据成功登录时，将返回 JSON Web Token。由于 Token 是凭据，因此必须非常小心地防止安全问题。通常，Token 的保留时间不应超过所需的时间

[由于缺乏安全性，您也不应将敏感会话数据存储在浏览器存储中](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)

每当用户想要访问受保护的路由或资源时，用户代理都应发送 JWT，通常在 **Authorization** 标头中使用 **Bearer** 架构。标头的内容应如下所示：

```text
Authorization: Bearer <token>
```

在某些情况下，这可以是一种无状态授权机制。服务器的受保护路由会检查授权（Authorization）头中是否存在有效的 JWT，如果存在，用户就可以访问受保护的资源。如果 JWT 包含必要的数据，就可以减少某些操作对数据库的查询需求，但情况并非总是如此

请注意，如果通过 HTTP 标头发送 JWT 标记，应尽量避免其过大。有些服务器不接受超过 8 KB 的标头。如果你想在 JWT 标记中嵌入过多信息，比如包含用户的所有权限，那么你可能需要一个替代解决方案，比如 [Auth0 Fine-Grained Authorization](https://auth0.com/fine-grained-authorization)

如果在授权（Authorization）标头中发送令牌，跨源资源共享（CORS）就不会有问题，因为它不使用 cookie

下图显示了如何获取 JWT 并将其用于访问 API 或资源：

![](https://img.sherry4869.com/blog/it/java/junior/tools/jwt/img.png)

1. 应用程序或客户端向授权服务器提出授权请求。这是通过不同的授权流之一来完成的。例如，一个典型的兼容 [OpenID Connect](http://openid.net/connect/) 的网络应用程序将使用授权代码流通过 `/oauth/authorize` 端点[进行授权](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)

2. 授予授权后，授权服务器会向应用程序返回访问令牌

3. 应用程序使用访问令牌访问受保护的资源（如 API）

请注意，使用签名令牌时，令牌中包含的所有信息都会向用户或其他方公开，即使他们无法更改它。这意味着您不应将机密信息放入令牌中

## 在项目中使用 JWT

引入相关依赖及配置

::: tabs

@tab pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
</dependencies>
```

@tab application.properties

```properties
# JWT 密钥
jwt.secret-key=blog.sherry4869.com
# JWT 过期时间 1小时
jwt.exp-time=PT1H
```

为了安全起见，不同环境下的密钥建议设置成不一样的

:::

### 创建 JWT 工具类

```java
@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.exp-time}")
    private Duration expTime;

    /**
     * 签发 token
     *
     * @param subject JWT 主体
     * @param claims  JWT 声明 
     * @return JWT 字符串
     */
    public String createToken(String subject, Map<String, Object> claims) {
        JwtBuilder builder = Jwts.builder();
        if (StringUtils.hasLength(subject)) {
            builder.setSubject(subject); // 设置主体（subject）。主体表示令牌所代表的实体或主体。这个主体可以是用户的唯一标识符、用户名或其他与实体相关的标识
        }
        if (claims != null) {
            builder.addClaims(claims); // 用于添加声明（claims）到 JWT 中。声明可以包含用户身份、访问权限、角色、过期时间等信息
        }
        long currentTimeMillis = System.currentTimeMillis();
        builder.setIssuedAt(new Date(currentTimeMillis)); // 表示令牌的创建时间为当前时间戳
        long millis = expTime.toMillis();
        if (millis > 0) { // 如果过期时间大于 0
            long expMillis = currentTimeMillis + millis;
            builder.setExpiration(new Date(expMillis)); // 设置令牌过期时间
        }
        if (StringUtils.hasLength(secretKey)) {
            builder.signWith(SignatureAlgorithm.HS256, secretKey); // 使用 HS256 算法和提供的密钥对 JWT 进行签名。这将生成一个带有签名的 JWT，以确保在后续验证过程中可以验证其真实性和完整性
        }
        return builder.compact(); // 生成最终的 JWT 字符串
    }

    /**
     * 解析 token
     */
    public Claims pareToken(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        } catch (Exception e) {
            log.error("pareToken error:{}", e);
        }
        return claims;
    }

    /**
     * 验证 JWT 的有效性
     */
    public boolean validateToken(String token) {
        Claims claims = pareToken(token);
        if (claims != null) {
            Date expiration = claims.getExpiration();
            return expiration.after(new Date());
        }
        return false;
    }

    /**
     * 获取 token 中的主体
     */
    public String getSubject(String token) {
        Claims claims = pareToken(token);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
    }

}
```

::: info parseClaimsJws(String claimsJws)
该方法用于解析一个已签名的 JWT 字符串，并返回一个 `Jws<Claims>` 对象。`Jws<Claims>` 表示一个已签名的 JWT，包含了 JWT 的头部、载荷和签名信息。通过调用 `getBody()` 方法，可以获取 JWT 的声明部分（Claims）

适用于已签名的 JWT，它会验证 JWT 的签名，并返回包含签名验证信息的 `Jws<Claims>` 对象

如果您需要验证签名并获取签名验证信息，可以使用该方法
:::

::: info parseClaimsJwt(String claimsJwt)
该方法用于解析一个只包含声明（Claims）的 JWT 字符串，并返回一个 `Jwt<Header, Claims>` 对象。`Jwt<Header, Claims>` 是一个通用的 JWT 对象，它包含了 JWT 的头部（Header）和声明（Claims）部分

适用于只包含声明的 JWT，它不会验证签名，只返回包含 JWT 头部和声明的 `Jwt<Header, Claims>` 对象

如果您只关心 JWT 的声明部分，并不需要进行签名验证，可以使用该方法
:::

测试工具类：

```java
@SpringBootTest
public class TestJwt {

    @Resource
    private JwtUtil jwtUtil;

    @Test
    public void testJwt() {
        Map<String, Object> map = new HashMap<>();
        map.put("role", "admin");
        String token = jwtUtil.createToken("123", map);
        System.out.println(token);
        System.out.println("exp = " + jwtUtil.validateToken(token));
        System.out.println("subject = " + jwtUtil.getSubject(token));
        System.out.println("claims = " + jwtUtil.pareToken(token));
    }
    
}
```

打印结果：

```text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIxOTY0MTcsImV4cCI6MTcwMjIwMDAxN30.oJyUeoBcoWZoRuobw9NIXSEK5xeymmIxVcUN4Kje_cg
exp = true
subject = 123
claims = {sub=123, role=admin, iat=1702196417, exp=1702200017}
```

### 配置过滤器

::: tabs

@tab TokenFilter.java

```java
public class TokenFilter implements Filter {

    static final String[] EXCLUDE_URLS = {"/api/user/login", "/api/user/register"}; //过滤器白名单接口

    @Resource
    private JwtUtil jwtUtil;

    @Resource
    private ObjectMapper objectMapper;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request; // 获取请求对象，以便后续获取请求信息
        String requestURI = httpServletRequest.getRequestURI(); // 获取 HTTP 请求的统一资源标识符（URI），即请求的路径部分
        if (Stream.of(EXCLUDE_URLS).noneMatch(requestURI::startsWith)) { //如果当前请求地址不匹配白名单接口地址的话则需要进行 Token 过滤验证
            String token = httpServletRequest.getHeader("Authorization"); // 从请求头中获取名为 "Authorization" 的头信息，即 Token
            if (StringUtils.isEmpty(token) || !jwtUtil.validateToken(token)) { // 判断 Token 是否为空或者经过 JwtUtil 验证。如果 Token 为空或者验证不通过，返回 Token 错误的响应
                // 如果 Token 验证不通过，将错误信息返回给客户端。这里使用了 DataResult 类来封装响应数据，以及 ObjectMapper 将 DataResult 对象转换为 JSON 字符串
                DataResult dataResult = DataResult.fail(ResponseCode.TOKEN_ERROR.getCode(), ResponseCode.TOKEN_ERROR.getMessage());
                response.getOutputStream().write(objectMapper.writeValueAsString(dataResult).getBytes(StandardCharsets.UTF_8));
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                return;
            }
        }
        // 如果 Token 验证通过，或者请求在白名单中，通过 chain.doFilter(request, response); 将请求传递给下一个过滤器或目标资源
        chain.doFilter(request, response);
    }
}
```

@tab FilterConfig.java

过滤器策略配置类，指定哪些资源是受保护的

```java
@Configuration // 这个注解表示这是一个配置类，用于定义 Spring Bean
public class FilterConfig {

    @Bean
    public TokenFilter tokenFilter() { // 这个方法创建并返回一个 TokenFilter 的实例，将其声明为一个 Spring Bean。这个 Bean 将会被 Spring 容器管理
        return new TokenFilter();
    }

    @Bean
    public FilterRegistrationBean tokenFilterBean(TokenFilter tokenFilter) { // FilterRegistrationBean 是 Spring 提供的用于配置过滤器的辅助类。它允许你以编程方式配置过滤器
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(tokenFilter); // 通过调用 setFilter 方法，将 TokenFilter 注册到 FilterRegistrationBean 中
        filterRegistrationBean.setName("tokenFilter"); // 设置过滤器的名称为 "tokenFilter"
        filterRegistrationBean.addUrlPatterns("/api/*"); // 通过 addUrlPatterns 方法，指定了需要经过 TokenFilter 过滤器处理的 URL 模式。在这里，所有以 "/api/" 开头的请求都会经过 TokenFilter 进行处理
        return filterRegistrationBean; // 最后，将配置好的 FilterRegistrationBean 返回，这个 Bean 将被 Spring 容器管理
    }
}
```

:::

### 前端请求头携带 Token

参考代码：

::: tabs

@tab src/utils/request.ts

```ts {17-22,32-37}
import router from "@/router";
import { useUserStore } from "@/store/userStore";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

const userStore = useUserStore();

const instance = axios.create({
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
    baseURL: 'http://localhost:8080'
})

/**
 * 请求拦截器
 */
instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    if (userStore.token) { // 从状态管理中取出 Token 添加进请求头中
        request.headers.Authorization = userStore.token;
    }
    return request;
})
/**
 * 响应拦截器
 */
instance.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 200) {
        if (response.data.code === 0) { // 后端成功响应
            return response.data; // 直接获取后端响应对象中的 data 业务数据
        }
        ElMessage.error(response.data.message); // 将后端响应的错误信息提示给用户
        if (response.data.code === 401000) { // Token 失效需要把用户状态信息给清空
            userStore.setUserId("");
            userStore.setUserName("");
            userStore.setToken("");
            location.reload(); // 重新加载界面通过导航守卫重定向到登录界面
        }
    }
    return Promise.reject(response.statusText);
}, (error) => {
    // if (error.response.status === 404) {
    //     router.push('/404');
    // }
    ElMessage.error(error.message);
    return Promise.reject(error.message);
})

export default instance
```

@tab src/store/userStore.ts

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useUserStore = defineStore('userStoreId', () => {
    const userId = ref<string>("");
    const userName = ref<string>("");
    const token = ref<string>("");

    const setUserId = (value: string) => {
        userId.value = value
    }
    const setUserName = (value: string) => {
        userName.value = value
    }
    const setToken = (value: string) => {
        token.value = value
    }

    return {
        userId,
        userName,
        token,
        setUserId,
        setUserName,
        setToken
    }
}, { persist: true })
```

:::

虽然配置了请求拦截器，但前端还是可以绕过 Token 认证直接访问已知界面

例如用户把浏览器本地缓存中用户状态信息对应的键值给删除，接着不访问 `${ip}:${port}/login` 路径进行登录，而是直接访问主页 `${ip}:${port}/home`，此时主页是可以访问成功的，虽然业务数据没有加载出来（后端配置了过滤器），这样的行为我们是不能认可的

我们可以通过[导航守卫](/it/vue-router/guide/advanced/navigation-guards.md)安全认证来解决这个问题