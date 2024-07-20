---
category: IT
article: false
order: 1
---

# 标识符

## 什么是标识符

在 Java 源代码中，程序员有权利自己命名的单词都是标识符

1. 在 Java 中，标识符是用来给变量、方法、类和包等命名的字符序列

2. 标识符的长度没有限制，但是建议使用有意义的、简短的标识符，以提高代码的可读性和可维护性

## 标识符可以标识什么

1. 变量名

2. 方法名

3. 类名、接口名、枚举名、注解名

4. 包名

5. 常量名

6. ...

## 标识符命名规则

1. 标识符可以由字母、数字、下划线（_）和美元符号（$）组成，不能含有其他符号

2. Java 是采用 Unicode 编码，支持全球任何一个国家的语言，所以这里的字母指的是任何一个国家的文字

3. 标识符不能以数字开头

4. 标识符不能是 Java 中的关键字，如 public、class、void 等

5. 标识符是区分大小写的，既 Foo 和 foo 是两个不同的标识符

6. 标识符的长度没有限制，但是 Java 建议使用有意义的、简短的标识符

## 标识符命名规范

1. 见名知意

2. 驼峰式命名方式

3. 类名、接口名、枚举、注解都要首字母大写，后面每个单词首字母大写。如 StudentService、UserService

4. 变量名和方法名：首字母小写，后面的每个单词首字母大写。如 doSome、doOther

5. 常量名：全部大写，每个单词用下划线连接。如 LOGIN_SUCCESS、SYSTEM_ERROR

6. 包名：全部小写