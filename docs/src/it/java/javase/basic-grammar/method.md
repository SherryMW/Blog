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

当返回类型是 `void` 的时候，不能编写 `return 值;` 这样的语句。但可以编写 `return;` 语句。主要是用来终止方法的执行。当然也可以不编写 `return;`，具体要看业务逻辑

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

### 方法名

只要是合法的标识符即可

首字母小写，后面每个单词首字母大写

通常情况下方法是一个行为，因此方法名一般是动词。最好是描述了这个方法所实现的功能，起到见名知意，例如 deleteUser、saveUser、login、logout

### 形式参数列表

形式参数列表一般简称为形参，形参的个数是：0~n，多个的话使用英文逗号隔开。对于形参来说，起绝对性作用的是变量类型

方法里面定义的变量是局部变量，方法外面定义的是成员变量（静态成员变量，实例成员变量）

形参的生命周期也比较短，在调用方法的时候分配，方法执行结束的时候分配的空间就释放了

### 方法体

任何一个方法都有一个方法体，方法体用大括号括起来，在大括号中编写 Java 语句

方法体的代码有执行顺序，遵循自上而下

## 方法的调用

当这个方法修饰符列表有 `static` 关键字的时候，调用的语法格式：【类名.方法名(实际参数列表);】

实际参数列表简称为：实参

实参和形参列表必须一一对应：

- 类型要一一对应

- 个数要一一对应

调用方法时，“类名.”什么情况下可以省略？调用者和被调用者在同一个类中时，可以省略

```java
public class MethodTest {
    
    public static void main(String[] args) {
        
        // 调用方法 m1
        MethodTest04.m1();

        // 省略“类名.”
        m1();

        // 调用 m2 方法
        A.m2();

        // 编译报错，找不到 m2 符号，因为是在 MethodTest 类中找的 m2
        //m2();
    }

    public static void m1() {
        System.out.println("m1方法执行了");
    }
}

class A {
    public static void m2() {
        System.out.println("m2方法执行了");
    }
}
```

```java
public class MethodTest {

    // 编译阶段报错，缺少返回语句。编译器只知道 i > 99 是一个 boolean 类型，可能返回 true 或者 false，如果返回 false 的时候，有返回值的 m1 方法就缺少了 return 返回语句
    /**
    public static int m1() {
        int i = 100;
        if (i > 99) {
            return 1;
        }
    }
    */

    // 编译通过，因为 if-else 语句，百分之百会执行其中一个分支，因此编译器会认为这种语法是合规的
    /**
    public static int m1() {
        int i = 100;
        if (i > 99) {
            return 1;
        } else {
            return 0;
        }
    }
    */

    public static int m1() {
        int i = 100;
        if (i > 99) {
            System.out.println("位置1");
            return 1;
            //无法访问的语句
            //System.out.println("位置2");
        }
        System.out.println("位置3");
        return 0;
        // 无法访问的语句
        //System.out.println("位置4");
    }
}
```

系统可以接收用户名和密码，判断用户名和密码，如果用户名是 admin，密码是 abc123，则登录成功。如果用户名或密码不对，请继续让用户输入用户名和密码，直到登录成功

```java
import java.util.Scanner;

public class MethodTest {

    public static void main(String[] args) {

        login();

    }

    public static void login() {
        Scanner scanner = new Scanner(System.in);
        String username, password;
        while (true) {
            System.out.print("请输入账号：");
            username = scanner.next();
            System.out.print("请输入密码：");
            password = scanner.next();
            if (checkLogin(username, password)) {
                System.out.println("登录成功");
                break;
            }
            System.out.println("账号或密码不正确");
        }
    }

    /**
     * 检查用户名和密码是否正确
     * @param username 用户名
     * @param password 密码
     * @return 是否正确
     */
    public static boolean checkLogin(String username, String password) {
        return "admin".equals(username) && "abc123".equals(password);
    }
}
```

使用方法找出 1~100 所有的质数

```java
public class MethodTest {

    public static void main(String[] args) {

        for (int i = 2; i <= 100; i++) {
            if (isPrime(i)) {
                System.out.println(i);
            }
        }
    }

    /**
     * 判断某个数字是否为质数
     * @param number 数字
     * @return true 表示是质数；false 表示不是质数
     */
    public static boolean isPrime(int number) {
        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
}
```

## 方法执行时的内存变化

方法只定义不调用时不会分配内存的。（从 Java 8 开始，方法的字节码指令存储在元空间 metaspace 当中。元空间使用的时本地内存）

JVM 在方法调用时会给该方法在栈内存中分配空间，此时发生压栈动作。这个方法的空间被称为栈帧

栈帧中主要包括：局部变量，操作数栈等

方法执行结束时，该栈帧弹栈，方法内存空间释放

```java
public class MethodTest08 {

    public static void main(String[] args) {
        
        System.out.println("main begin");
        m1();
        System.out.println("main over");
    }

    public static void m1() {
        System.out.println("m1 begin");
        m2();
        System.out.println("m1 over");
    }

    public static void m2() {
        System.out.println("m2 begin");
        m3();
        System.out.println("m2 over");
    }

    public static void m3() {
        System.out.println("m3 begin");
        System.out.println("m3 over");
    }
}

/*
main begin
m1 begin
m2 begin
m3 begin
m3 over
m2 over
m1 over
main over
*/
```

![](https://img.sherry4869.com/blog/it/java/javase/13.png)

## 方法重载

方法重载（over load）：编译阶段的一种机制（静态多态）

```java
/**
 当前代码先不使用方法重载，分析一下这样写的代码有什么缺点：
 代码不美观
 不方便调用，程序员需要记忆更多的方法名
 */
public class OverloadTest {

    public static void main(String[] args) {

        sumInt(10, 20);
        sumLong(10L, 20L);
        sumDouble(1.0, 2.0);
    }

    public static void sumInt(int a, int b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }

    public static void sumLong(long a, long b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }

    public static void sumDouble(double a, double b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }
    
}
```

在 Java 语言中允许在一个类中定义多个方法，这些方法的名字可以一致

```java
public class OverloadTest {

    public static void main(String[] args) {

        sum(10, 20);
        sum(10L, 20L);
        sum(1.0, 2.0);
    }

    public static void sum(int a, int b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }

    public static void sum(long a, long b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }

    public static void sum(double a, double b) {
        System.out.println(a + " + " + b + " = " + (a + b));
    }
}
```

当一个程序满足怎样的条件时，代码就构成了方法重载呢？

- 在同一个类中

- 方法名一致

- 形式参数列表不同（类型不同/顺序不同/个数不同）

方法重载是一种在编译阶段的机制，在编译阶段已经完成了方法的绑定。在编译阶段已经确定要调用哪个方法了

```java
public class OverloadTest {

    public static void main(String[] args) {
        
        m1();
        m1("abc");

        m2(10, 20);
        m2(10L, 20L);

        m3("x", 10);
        m3(10, "x");
    }

    // 形参的个数不同
    public static void m1() {
        System.out.println("m1()");
    }

    public static void m1(String s) {
        System.out.println("m1(String s)");
    }

    // 形参类型不同
    public static void m2(int a, int b) {
        System.out.println("m2(int a, int b)");
    }

    public static void m2(long a, long b) {
        System.out.println("m2(long a, long b)");
    }

    // 形参顺序不同
    public static void m3(String s, int a) {
        System.out.println("m3(String s, int a)");
    }

    public static void m3(int a, String s) {
        System.out.println("m3(int a, String s)");
    }

    // 以下这两个方法没有构成方法重载，属于方法重复定义了。语法错误，编译器报错（已经在类 OverloadTest 中定义了方法 doSome(int,int)）
    /**
    public static void doSome(int a, int b) {

    }

    public static void doSome(int x, int y) {

    }
    */
    
}
```

在什么情况下，我们考虑使用方法重载呢？

在一个类中，如果两个方法的功能相似，建议将方法名定义为同一个名字。此时就使用了方法重载机制

## 方法递归

方法的递归调用：方法自己调用自己

```java
public class RecursionTest {

    public static void main(String[] args) {

        recursion();
    }

    public static void recursion() {
        System.out.println("recursion begin");
        recursion();
        System.out.println("recursion over");
    }
}
```

上述的代码在运行阶段会产生很严重的问题：`recursion()` 方法自己调用自己，一直做压栈操作，而没有去弹栈（没有结束条件）。控制台会一直输出“recursion begin”，永远不会输出“recursion over”。因此会导致栈内存溢出的异常 Exception in thread "main" java.lang.StackOverflowError

所有的递归调用必须要有结束条件

在实际开发中，使用方法递归调用即使有的时候存在结束条件，并且结束条件也是合法的，但仍然会发生栈内存溢出的错误，这可能是因为递归太深，栈内存不够而导致的

因此方法的递归调用要谨慎使用。能用循环解决的问题就用循环解决，因为循环语句不需要进行压栈操作，而方法递归需要重复压栈，很耗费栈内存空间

假如在实际开发中，因为方法递归调用发生了栈内存溢出异常，该怎么办？

- 首先可以调整栈内存大小，扩大栈内存空间

    ```text
    java -X
    
    -Xss<size> 设置 Java 线程堆栈大小
    -Xms<size> 设置初始 Java 堆大小
    -Xmx<size> 设置最大 Java 堆大小
    ```

- 如果栈内存空间扩大后，运行一段时间还是出现了栈内存溢出错误，那么说明递归调用的结束条件有问题，需要进行代码的修改

递归的应用场景：在后面要学习到的 IO 流中，写一个程序把电脑 F 盘下所有目录里的文件拷贝到 D 盘。你不知道磁盘中每个目录里有多少个文件以及子目录，因此需要写一个递归程序不断去找目录里头的文件，递归的结束条件是该目录下再也没有子目录了

先不使用递归，计算 1+2+3+4+5+...n 的和

```java
public class RecursionTest01 {

    public static void main(String[] args) {
        
        int result = sum(5);
        System.out.println("result = " + result);
    }

    /**
     * 计算 1 到 n 的和
     */
    public static int sum(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }
}
```

使用递归，计算 1+2+3+4+5+...n 的和

```java
public class RecursionTest02 {

    public static void main(String[] args) {
        
        int result = sum(5); // 5 + 4 + 3 + 2 + 1
        System.out.println("result = " + result);
    }

    /**
     * 计算 1 到 n 的和
     */
    public static int sum(int n) {
        if (n == 1) {
            return 1;
        }
        return n + sum(n - 1);
    }
}
```

伪代码来解释递归流程：

```java
public class RecursionTest03 {

    public static void main(String[] args) {
        
        int result = sum(5);
        System.out.println("result = " + result);
    }

    /**
     * 计算 1 到 n 的和
     */
    public static int sum(int n) {
        if (n == 1) {
            return 1;
        }
        return n + sum(n - 1);
    }
    
    // 以下是伪代码，当 n 为 5 的时候

    public static int sum(int 5) {
        return 5 + sum(4); // 当 sum(4) 有最终结果的时候，才会和 5 相加 
    }

    public static int sum(int 4) {
        return 4 + sum(3);
    }

    public static int sum(int 3) {
        return 3 + sum(2);
    }

    public static int sum(int 2) {
        return 2 + sum(1);
    }

    public static int sum(int 1) {
        if (n == 1) {
            return 1;
        }
    }
    
    // 当 n == 1 的时候，返回 1，因此倒数第二个 sum() 方法里的 return 2 + sum(1); 就等于 return 2 + 1，以此类推下去

    public static int sum(int 5) {
        return 5 + 4 + 3 + 2 + 1;
    }
    
    public static int sum(int 4) {
        return 4 + 3 + 2 + 1;
    }
    
    public static int sum(int 3) {
        return 3 + 2 + 1;
    }
    
    public static int sum(int 2) {
        return 2 + 1;
    }
    
    public static int sum(int 1) {
        if (n == 1) {
            return 1;
        }
    }
}
```

![](https://img.sherry4869.com/blog/it/java/javase/14.png)

使用递归计算 n 的阶乘

```java
public class RecursionTest {

    public static void main(String[] args) {
        int result = factorial(5); // 5 * 4 * 3 * 2 * 1
        System.out.println("result = " + result);
    }

    /**
     * 计算 n 的阶乘
     */
    public static int factorial(int n) {
        if (n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}
```

假如有一对兔子，从出生后第 3 个月起每个月都生一对兔子，小兔子长到第三个月后每个月又生一对兔子，假如兔子都不死，请问第 n 个月后的兔子有多少对

```java
public class RecursionTest {

    public static void main(String[] args) {

        System.out.println(rabbit(6));
    }

    /**
     1 2 3 4 5 6 月份
     1 1 2 3 5 8 兔子对数
     规律：当前数字 = 前两个相邻的数字之和
     这种数字被成为斐波那契数字，斐波那契数字组合起来叫做斐波那契数列
     */
    public static int rabbit(int n) {
        if (n < 3) {
            return 1;
        }
        return rabbit(n - 1) + rabbit(n - 2);
    }
}
```

![](https://img.sherry4869.com/blog/it/java/javase/16.png)

下图展示了 6 月份的递归过程

![](https://img.sherry4869.com/blog/it/java/javase/15.png)