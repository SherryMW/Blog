---
category: IT
article: false
order: 11
---

# 方法

方法（Method）是一段可以被重复调用的代码片段，一个方法一般都是一个独立的功能。在 C 语言中叫做函数（Function）

请分析以下程序，这样写有什么问题，缺点是什么

```java
public class MethodTest {

    public static void main(String[] args) {

        // 需求1：请编写程序计算 100 和 200 的和
        int a = 100;
        int b = 200;
        System.out.println(a + " + " + b + " = " + (a + b));

        // 需求1：请编写程序计算 666 和 888 的和
        int i = 666;
        int j = 888;
        System.out.println(i + " + " + j + " = " + (i + j));
        
        // 需求...
    }
}
```

上述程序功能是相同的，都是求两个数的和，但代码写了两遍，代码复用性差，我们应该使用方法（Method）来提高代码的复用性

```java
public class MethodTest {

    public static void main(String[] args) {

        sum(100, 200); // 方法的调用

        sum(666, 888);
        
    }

    /**
     * 方法的定义
     * 定义一个求和功能的方法
     */
    public static void sum(int a, int b) {
        int sum = a + b;
        System.out.println(a + " + " + b + " = " + sum);
    }
}
```

方法只定义，不去调用，是不会执行的。方法要执行的话，肯定是有一个位置调用了这个方法，例如 main 方法是被 JVM 调用的

## 方法的定义

语法格式：

```text
[修饰符列表] 返回值类型 方法名 (形式参数列表) {
    方法体;
}
```

其中修饰符列表不是必须的

### 修饰符列表

目前统一编写 `public static`

### 返回值类型 

返回值类型可以是 Java 语言中任何一种数据类型，包括基本数据类型和引用数据类型。如果方法执行结束的时候不需要返回任何数据给调用者，返回值类型写 `void`。切记不能空着不写返回值类型

- 返回值类型是 `int` 表示：方法结束的时候会返回一个整数给调用者

- 返回值类型是 `String` 表示：方法结束的时候会返回一个字符串给调用者

- 返回值类型是 `void` 表示：方法结束的时候不返回任何数据给调用者

当返回类型是 `void` 的时候，不能编写 `return 值;` 这样的语句。但可以编写 `return;` 语句。主要是用来终止方法的执行，也可以不编写 `return;`，具体看业务的逻辑

当返回值类型不是 `void` 的时候，方法在结束的时候必须使用 `return 值;` 语句来完成数据的返回。此外在方法结束的时候返回的值可以采用变量接收，需要注意变量的类型，变量的类型一定要和返回值类型一致，或者能够自动类型转换

有返回值的方法执行结束，对于调用者来说，可以选择接收返回值，也可以不接收

```java
public class MethodTest {

    public static void main(String[] args) {

    }

    // 编译器启动报错：缺少返回语句。因为返回值类型是 int，那么方法结束的时候必须返回一个整数，但是没有写 return 返回语句来完成数据的返回
    /**
    public static void sum(int a, int b) {

    }
    */

    public static void sum(int a, int b) {
        return a + b;
    }

    // 不兼容的类型：int 无法转换为 boolean
    /**
    public static boolean flag() {
        return 1;
    }
    */
    
    // Cannot return a value from a method with void result type
    /**
     public static void test() {
        return 1;
     }
     */

    // 在返回值为 void 的方法里写 return; 是可以的，因为 return 后面没有跟一个值。写 return; 语句就是为了让方法直接结束
    public static void test() {
        int num = 100;
        if (num > 90) {
            return;
        }
    }
    
}
```






