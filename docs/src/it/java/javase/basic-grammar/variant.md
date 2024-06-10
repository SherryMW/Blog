---
category: IT
article: false
order: 4
---

# 变量

## 什么是变量

- 变量是内存当中的一块空间。是计算机中存储数据最基本的单元

- 变量三要素

    - 数据类型（决定空间大小）

    - 变量名（只要是合法的标识符即可）

    - 变量值（变量中具体存储的数据，值的数据类型要和声明的数据类型一致）

- 变量的声明、赋值、访问

    - `int i;` // 声明一个整数型的变量，起名 i

    - `i = 100;` // 给变量 i 赋值 100

    - `System.out.println(i);` // 访问 i 变量：读操作

    - `i = 200;` // 访问 i 变量：改操作【给变量 i 重新赋值 200】

```java
public class VarTest {
    
    public static void main(String[] args) {

        // 声明定义一个 int 类型的变量，起名 age，用来存储人的年龄
        int age;

        // 给age变量赋值
        age = 20;

        // 读
        System.out.println("年龄 = " + age);

        // 改（重新赋值）
        age = 30;

        // 读
        System.out.println("年龄 = " + age);

        age = 60;
        System.out.println("年龄 = " + age);

        // 不兼容的类型: String 无法转换为 int
        //age = "50";

        // 定义一个变量，用来存储数学当中的 π
        double π = 3.14;

        System.out.println("圆周率：" + π);


        // 声明一个 String 类型的 name 变量，用来存储人的姓名
        // 变量的声明和赋值可以一块完成
        String name = "jack";
        System.out.println("name = " + name);

        // 可以重新赋值
        name = "lucy";

        System.out.println("name = " + name);
    }
}
```

## 变量的作用

1. 变量的存在会让程序更加便于维护

    `System.out.println(100 + 111);`
    
    `System.out.println(100 + 222);`
    
    以上代码的设计就不如以下的代码：
    
    `int num = 100;`
    
    `System.out.println(num + 111);`
    
    `System.out.println(num + 222);`

2. 变量的存在可以增强程序的可读性

    `System.out.println(3.14 * 10 * 10);`
    
    以上的代码设计就不如以下的代码：
    
    `double π = 3.14;`
    
    `int r = 10;`
    
    `System.out.println(π * r * r);`

```java
public class VarTest {

    public static void main(String[] args) {
		/*		
		System.out.println(100 + 456);
		System.out.println(100 + 111);
		System.out.println(100 + 222);
		System.out.println(100 + 235);
		System.out.println(100 + 789);
		System.out.println(100 + 999);
		System.out.println(100 + 666);
		System.out.println(100 + 888);
		*/

        // 新的需求来了：要计算 50 和后面数字的和
        // 问题：修改的位置太多了。不好维护
		/*
		System.out.println(50 + 456);
		System.out.println(50 + 111);
		System.out.println(50 + 222);
		System.out.println(50 + 235);
		System.out.println(50 + 789);
		System.out.println(50 + 999);
		System.out.println(50 + 666);
		System.out.println(50 + 888);
		*/

        int num = 50;
        System.out.println(num + 456);
        System.out.println(num + 111);
        System.out.println(num + 222);
        System.out.println(num + 235);
        System.out.println(num + 789);
        System.out.println(num + 999);
        System.out.println(num + 666);
        System.out.println(num + 888);

        // 需求：请编写程序，计算半径是10.0cm的圆的面积。
        System.out.println(3.14 * 10.0 * 10.0);

        // 增强可读性
        double π = 3.14;
        double r = 10.0;
        System.out.println(π * r * r);

    }
}
```

## 变量使用的小细节

1. 变量必须先声明，再赋值，才能访问

2. 方法体当中的代码遵循自上而下的顺序依次逐行执行。变量先访问，再声明肯定是不行的

3. 一行代码上可以同时声明多个变量

4. 在同一个作用域当中，变量名不能重名，可以重新赋值

5. 变量值的数据类型必须和变量的数据类型一致，这样是不允许的：`String name = 100;`

```java
public class VarTest {

    public static void main(String[] args) {

        // 变量必须先声明，再赋值，才能访问
        int age;
        // 错误：可能尚未初始化变量 age
        //System.out.println(age);

        //方法体当中的代码遵循自上而下的顺序依次逐行执行，变量先访问，再声明肯定是不行的
        // 错误: 找不到符号
        //System.out.println("name = " + name);
        String name = "jack";

        // 一行代码上可以同时声明多个变量
        // 以下代码含义：声明三个 int 类型的变量 a b c，其中 a 和 b 没有赋值，c 赋值 300
        int a, b, c = 300;
        a = 50;
        System.out.println(a);
        b = 80;
        System.out.println(b);
        System.out.println(c);

        int x = 500, y = 600, z = 700;
        System.out.println(x + y + z);

        // 在同一个作用域当中，变量名不能重名，可以重新赋值
        // 作用域就是有效范围。在 java 中，一个 {} 就是一个作用域
        int i = 100;
        // 错误: 已在方法 main(String[]) 中定义了变量 i
        //int i = 200;

        // 可以重新赋值。
        i = 200;
        System.out.println(i);
    }
}
```

## 变量的作用域

1. 作用域就是变量的有效范围。变量的作用域是怎样的呢？用一句大白话就可以概况了：出了大括号就不认识了

2. 作用域的不同主要是因为声明在不同位置的变量具有不同的生命周期。所谓的生命周期是：从内存开辟到内存释放

3. Java 遵循就近原则

```java
public class VarTest {

    public static void main(String[] args) {

        // age 是 main 方法中声明的。所以作用域是整个 main 方法
        // 在 main 方法体当中是有效的变量
        int age = 20;
        System.out.println("age = " + age);

        int num = 100;

        if (num > 50) {
            int i = 666;
            System.out.println("i = " + (i + age));
        }

        // 错误: 找不到符号
        //System.out.println("i = " + i);
    }

    // 另一个方法
    public static void doSome() {
        // 错误: 找不到符号
        //System.out.println("age = " + age);
    }

}
```

## 变量的分类

变量可以根据定义的/声明的位置来进行分类，可以分为两大类：

- 局部变量

- 成员变量

    - 静态变量

    - 实例变量

```java
public class VarTest {

    public static void main(String[] args) {
        // 凡是在方法体当中定义的变量，一定是局部变量
        // 局部变量只在当前方法体当中有效
        int a = 100;
    }
    
    // 在类体当中定义的变量叫做成员变量
    // 实例变量
    int b = 200;

    // 静态变量
    static int c = 300;
}
```