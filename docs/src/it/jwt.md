---
date: 2022-06-01
category: IT
---

# JWT

JWT 全称为 JSON Web Token，是一种用于身份验证的标准。它使用 JSON 格式将信息进行编码，可以被签名和加密。JWT 通常用于 Web 应用程序中，用于验证用户身份

<!-- more -->

## 初识 JWT

JWT 由三部分组成：

- 头部（header）包含了使用的算法和令牌类型等信息，例如：

    ```json
    {
    "alg":"HS256",
    "type":"JWT"
    }
    ```

- 载荷（payload）包含了需要传递的信息，例如：

    ```json
    {
      "sub": "1653945284140511233",
      "iat": 1683016853
    }
    ```

- 签名（signature）用于验证消息的完整性，防止消息被篡改

将 Header 和 Payload 用 Base64URL 编码后，再用点(.)连接起来。然后使用签名算法和密钥对这个字符串进行签名

生成签名的时候需要指定一个密码（secret）。该密码保存在服务器中，并且不能向用户公开。然后使用标头中指定的签名算法根据以下公式生成签名。在计算出签名哈希后，JWT头，有效载荷和签名哈希的三个部分组合成一个字符串，每个部分用"."分隔，就构成整个 JWT 对象。以上三部分都是在服务器定义，当用户登陆成功后，根据用户信息，按照 JWT 规则生成 token 返回给客户端

JWT 的工作流程如下：

1. 用户提供用户名和密码进行登录

2. 服务器验证用户名和密码的正确性，并生成一个 JWT

3. 服务器将 JWT 发送给客户端

4. 客户端将 JWT 存储在本地

5. 客户端在后续的请求中将 JWT 添加到请求头中

6. 服务器验证 JWT 的有效性，并根据其中的信息进行相应的操作

## 引入相关依赖

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

## 新增配置项

```properties
# JWT 密钥
jwt.secret-key=blog.sherry4869.com
# JWT 过期时间 1小时
jwt.exp-time=PT1H
```

## 创建 JWT 工具类

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
            builder.setSubject(subject); // 设置主题（subject）。主题表示令牌所代表的实体或主体。这个主题可以是用户的唯一标识符、用户名或其他与实体相关的标识
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
            SignatureAlgorithm hs256 = SignatureAlgorithm.HS256; // 指定签名算法
            builder.signWith(hs256, DatatypeConverter.parseBase64Binary(secretKey)); // 使用 HS256 算法和提供的密钥对 JWT 进行签名。这将生成一个带有签名的 JWT，以确保在后续验证过程中可以验证其真实性和完整性
        }
        return builder.compact(); // 生成最终的 JWT 字符串
    }

    /**
     * 解析 token
     */
    public Claims pareToken(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(secretKey)).parseClaimsJws(token).getBody();
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
     * 获取 token 中主体
     */
    public String getUserId(String token) {
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

## 测试

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
        System.out.println("exp = " + jwtUtil.validateToken(token));
        System.out.println("userId = " + jwtUtil.getUserId(token));
    }
    
}
```

## 参考资料

官网：[https://jwt.io](https://jwt.io/)