---
category: IT
article: false
---

# 加密

## MD5/SHA 加密

::: tabs

@tab PasswordEncoder.java

```java
package com.mw.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class PasswordEncoder {

    private final static String[] hexDigits = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};

    private final static String MD5 = "MD5";
    private final static String SHA = "SHA";

    private final Object salt;
    private final String algorithm;

    public PasswordEncoder(Object salt) {
        this(salt, MD5);
    }

    public PasswordEncoder(Object salt, String algorithm) {
        this.salt = salt;
        this.algorithm = algorithm;
    }

    /**
     * 将字节转换为16进制
     *
     * @param b 字节
     * @return 16进制字串
     */
    private static String byteToHexString(byte b) {
        int n = b;
        if (n < 0) {
            n = 256 + n;
        }
        int d1 = n / 16;
        int d2 = n % 16;
        return hexDigits[d1] + hexDigits[d2];
    }

    /**
     * 密码加密
     *
     * @param rawPass 明文
     * @return 密文
     */
    public String encode(String rawPass) {
        String result = null;
        try {
            MessageDigest md = MessageDigest.getInstance(algorithm);
            // 加密后的字符串
            result = byteArrayToHexString(md.digest(mergePasswordAndSalt(rawPass).getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
        }
        return result;
    }

    /**
     * 密码匹配验证
     *
     * @param encPass 密文
     * @param rawPass 明文
     */
    public boolean matches(String encPass, String rawPass) {
        String pass1 = "" + encPass;
        String pass2 = encode(rawPass);
        return pass1.equals(pass2);
    }

    private String mergePasswordAndSalt(String password) {
        if (password == null) {
            password = "";
        }
        if ((salt == null) || "".equals(salt)) {
            return password;
        } else {
            return password + "{" + salt + "}";
        }
    }

    /**
     * 转换字节数组为16进制字串
     *
     * @param b 字节数组
     * @return 16进制字串
     */
    private String byteArrayToHexString(byte[] b) {
        StringBuffer resultSb = new StringBuffer();
        for (int i = 0; i < b.length; i++) {
            resultSb.append(byteToHexString(b[i]));
        }
        return resultSb.toString();
    }

}
```

@tab PasswordUtils.java

```java
package com.mw.utils;

import java.util.UUID;

public class PasswordUtils {

    /**
     * 密码匹配验证
     *
     * @param salt    盐
     * @param rawPass 明文
     * @param encPass 密文
     */
    public static boolean matches(String salt, String rawPass, String encPass) {
        return new PasswordEncoder(salt).matches(encPass, rawPass);
    }

    /**
     * 明文密码加密
     *
     * @param rawPass 明文
     * @param salt 盐
     */
    public static String encode(String rawPass, String salt) {
        return new PasswordEncoder(salt).encode(rawPass);
    }

    /**
     * 获取加密盐
     */
    public static String getSalt() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 20);
    }
}
```

@tab TestMD5.java

```java
@SpringBootTest
public class TestMD5 {

    @Test
    public void test() {
        String salt = PasswordUtils.getSalt();
        System.out.println("盐：" + salt);
        String rawPassword = "rawPassword";
        System.out.println("明文：" + rawPassword);
        String encPassword = PasswordUtils.encode(rawPassword, salt);
        System.out.println("密文：" + encPassword);
        boolean matches = PasswordUtils.matches(salt, rawPassword, encPassword);
        System.out.println("校验密码是否正确：" + matches);
    }
}
```

打印结果：

```text
盐：c287d0ba57e24d488dd5
明文：rawPassword
密文：718ee07b0a1a9bb6dcbe523dfeb5b1e1
校验密码是否正确：true
```

:::
