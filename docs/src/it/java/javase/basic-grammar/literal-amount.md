---
category: IT
article: false
order: 3
---

# 字面量

## 什么是字面量

字面量指的是在程序中直接使用的数据，字面量是 Java 中最基本的表达式，不需要进行计算或转换，直接使用即可

## Java 中有哪些字面量

1. 整数型：10、-5、0、100

2. 浮点型：3.14、-0.5、1.0

3. 布尔型：true、false

4. 字符型：'a'、'b'、'c'、'1'、'2'、'国'

5. 字符串型："Hello"、"World"、"Java"、"你好"

## 加号运算符 +

作用 1：求和。当加号两边都是数字时进行求和运算

作用 2：字符串拼接。当加号两边有任意一边是字符串类型时会进行字符串拼接，结果还是一个字符串

```java
public class PlusTest {
    public static void main(String[] args) {
        // 求和
        System.out.println(10 + 20); // 30
        // 字符串拼接
        System.out.println("10" + 20); // "1020"
        // 一个表达式中出现多个加号，如果没有小括号，遵循从左向右
        System.out.println(10 + 20 + "30"); // "3030"
        // 添加了小括号优先级比较高，这两个 + 号都是字符串拼接
        System.out.println(10 + (20 + "30")); // "102030"
        
        System.out.println("10" + 20 + 30); // "102030"
        System.out.println("10" + (20 + 30)); // "1050"
    }
}
```