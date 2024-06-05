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


































