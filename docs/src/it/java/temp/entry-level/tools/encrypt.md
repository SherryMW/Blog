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

    private static final String[] hexDigits = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};

    private static final String MD5 = "MD5";
    private static final String SHA = "SHA";

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

@tab 测试

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

## AES

### CBC模式

CBC（Cipher Block Chaining）是一种加密模式。在 AES CBC 模式中，数据被分割成块，然后每个块都使用相同的密钥进行加密。下面是 AES CBC 模式加密的基本原理：

- 数据分块：将待加密的数据分割成固定大小的块（通常为128比特块）

- 初始化向量（IV）：每个消息块都使用前一个块的加密结果与当前块的明文异或（XOR）来增加随机性。第一个块使用一个初始化向量（IV）

- 加密：对每个块进行AES加密。由于每个块都使用前一个块的密文作为一部分输入，因此加密是链式的

- 输出：将所有加密后的块组合在一起形成最终的加密结果

在解密时，相反的过程被执行：

- 数据分块：将密文分割成块

- 解密：对每个块进行 AES 解密

- 初始化向量（IV）：每个块都使用前一个块的密文与当前块的解密结果异或（XOR）

- 输出：将所有解密后的块组合在一起形成原始数据

```java
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESUtil {

    /**
     * 使用AES算法对输入的字节数组进行加密
     *
     * @param data 待加密的字符串
     * @param key  AES加密的密钥字符串
     * @return 加密字符串
     */
    public static String encrypt(String data, String key) {
        try {
            // 将待加密的字符串 data 和密钥字符串 key 分别转换为UTF-8编码的字节数组
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES"); // 使用给定的密钥字节数组创建一个SecretKeySpec对象，该对象是一个密钥规范，用于表示AES密钥
            byte[] enCodeFormat = secretKey.getEncoded(); // 从密钥对象中获取密钥的编码格式
            SecretKeySpec secretKeySpec = new SecretKeySpec(enCodeFormat, "AES"); // 使用获取到的密钥编码格式再次创建一个SecretKeySpec对象
            /**
             * 创建一个Cipher对象，用于执行加密操作
             * AES：表示使用 AES 加密算法
             * CBC：表示使用 Cipher Block Chaining 模式。在 CBC 模式中，每个明文块先与前一个密文块进行异或运算，然后再进行加密。这种模式使得每个密文块的加密都依赖于前面所有块的内容，增强了安全性
             * PKCS5Padding：表示使用 PKCS5Padding 填充方案。在 CBC 模式下，如果明文的长度不是块大小的整数倍，就需要进行填充。PKCS5Padding 使用一定的规则向明文末尾添加字节，以确保明文的长度是块大小的整数倍。在AES中，块大小为128位（16字节）
             */
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, new IvParameterSpec(keyBytes)); // 使用加密模式（Cipher.ENCRYPT_MODE）、新的密钥规范对象和初始化向量（IvParameterSpec）来初始化Cipher对象
            byte[] valueByte = cipher.doFinal(dataBytes); // 获取加密后的字节数组
            return Base64.getEncoder().encodeToString(valueByte); // 使用Java的Base64编码工具将加密后的字节数组进行Base64编码，得到最终的加密字符串
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 经过AES加密并以Base64编码的字符串进行解密
     *
     * @param data 经过AES加密并以Base64编码的字符串
     * @param key  AES解密的密钥字符串
     * @return 解密字符串
     */
    public static String decrypt(String data, String key) {
        try {
            byte[] originalData = Base64.getDecoder().decode(data.getBytes()); // 使用Java的Base64解码工具将经过Base64编码的字符串转换为字节数组
            byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8); // 将密钥字符串 key 转换为UTF-8编码的字节数组
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES"); // 使用密钥字节数组创建一个SecretKeySpec对象，该对象是一个密钥规范，用于表示AES密钥
            byte[] enCodeFormat = secretKey.getEncoded(); // 从密钥对象中获取密钥的编码格式
            SecretKeySpec secretKeySpec = new SecretKeySpec(enCodeFormat, "AES"); // 使用获取到的密钥编码格式再次创建一个SecretKeySpec对象
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding"); // 创建一个Cipher对象，用于执行解密操作，在这里，使用"AES/CBC/PKCS5Padding"作为解密算法和填充方案
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(keyBytes)); // 使用解密模式（Cipher.DECRYPT_MODE）、新的密钥规范对象和初始化向量（IvParameterSpec）来初始化Cipher对象
            byte[] valueByte = cipher.doFinal(originalData); // 调用Cipher对象的doFinal方法，将经过Base64解码的字节数组传递给它，并获取解密后的字节数组
            return new String(valueByte); // 使用字符串构造器将解密后的字节数组转换为字符串
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

调用示例：

```java
@SpringBootTest
public class TestAES {

    @Test
    public void test() {
        String encrypt = AESUtil.encrypt("密码123", "acbsdf234sdkjsdf");
        String decrypt = AESUtil.decrypt(encrypt, "acbsdf234sdkjsdf");
        System.out.println("加密后的密文：" + encrypt);
        System.out.println("解密后的明文：" + decrypt);
    }
}
```

打印结果：

```text
加密后的密文：pCnJQzTYSGCXblXwcybiAA==
解密后的明文：密码123
```

### ECB模式

ECB（Electronic Codebook）模式：

- 每个数据块独立加密，相同的明文块始终生成相同的密文块

- 不使用初始化向量，因此相同的明文块将始终生成相同的密文块

- 不适用于加密长文本，因为相同的明文块生成相同的密文块，可能导致一些安全性问题

### CFB模式

CFB（Cipher Feedback）模式：

- 将前一个密文块反馈到加密算法中，产生伪随机流，再与明文异或得到密文

- 允许将分组密码转换为自同步流密码

- 允许对流进行部分解密，而无需解密整个流

### OFB模式

OFB（Output Feedback）模式：

- 类似于 CFB 模式，但是反馈的是加密算法的输出，而不是密文块

- 具有自同步性，允许对流进行部分解密

### CTR模式

CTR（Counter）模式：

- 将每个块与一个递增的计数器（nonce）进行异或，然后使用加密算法加密

- 具有并行处理的能力，因为每个块的加密是独立的

- 适用于高性能和并行化的需求

### GCM模式

GCM（Galois/Counter Mode）模式：

- 在 CTR 模式基础上加入了齐次加法和乘法运算，提供了加密、完整性验证和认证

- 适用于需要同时提供加密和认证的场景，如 TLS

### CCM模式

- 结合 CTR 模式和 CBC-MAC 模式，提供加密和认证功能

- 适用于资源受限的环境，如无线传感器网络

