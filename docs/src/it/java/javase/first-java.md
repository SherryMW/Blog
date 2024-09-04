---
category: IT
article: false
---

# 第一个 Java 程序

## 编写第一个 Java 程序

```java
public class HelloWorld {
    public static void main(String[] args) {
        
        System.out.println("Hello World");
    }
}
```

```java
/**
 * public 表示公开的
 * class 表示定义一个类
 * HelloWorld 是给这个类起了个名
 */
public class HelloWorld {
    // 类体

    /**
     * 这是 main 方法，也叫主方法，是 JVM 规定的固定写法。这是程序的入口
     * 对于 main 方法来说能修改的就是 args 这个变量名
     * public 表示公开的
     * static 表示静态的
     * void 表示 main 方法执行之后不返回任何数据
     * @param args 参数
     */
    public static void main(String[] args) {
        
        // 方法体
        
        /**
         * 方法体当中由一行一行的 java 语句组成
         * 任何一条 java 语句都要以分号“;”结尾
         * 方法体当中的代码是有执行顺序的，遵循自上而下的顺序依次逐行执行
         * 在一个 Java 程序中，如果符号是语法的一部分，需要使用英文半角符号，不能使用中文
         */
        
        // 这行代码的作用：将字符串 Hello World 打印输出到控制台，并且输出完之后还会换行
        System.out.println("Hello World");

        // println 会换行，print 不会换行
        System.out.print("abc");
        System.out.print("def");
        
        // 方法体
    }
    
    // System.out.println("Hello World"); // 编译报错，类体中不能直接编写 Java 语句。除定义成员变量以外
    
    // 类体
}
```

## 编译第一个 java 程序

使用 javac 命令来编译，首先确保 javac 命令可以用

- `javac java源文件的路径`

- `javac java源文件的相对路径`

- `javac java源文件的绝对路径`

## 运行第一个 java 程序

使用 java 命令来运行，首先确保 java 命令可以使用

要使用 java 命令首先 DOS 窗口中的当前路径必须切换到 class 文件所在的位置

A.class 类名是 A

HelloWorld.class 类名是 HelloWorld

使用 `java 类名` 命令运行

## Java 的加载与运行

![](https://img.sherry4869.com/blog/it/java/javase/2.png)

加载和运行包含两个阶段，编译阶段和运行阶段。因此 Java 既是编译型语言，也是解释型语言

编译阶段和运行阶段可以在不同的操作系统上完成

编译后删除 Java 源程序，不会影响程序的执行

生成的 Class 文件如果是 A.class，则类名为 A

javac 是负责编译的命令，java 是负责运行的命令

Class 文件是字节码，不是机器码，操作系统无法直接执行，只有 JVM 才能看的懂。JVM 会把 Class 字节码解释成机器码，这样操作系统才能看得懂

JDK：Java Development Kit 是 Java 语言的软件开发工具包（SDK）

JRE：Java Runtime Environment 是 Java 运行时环境，可以让计算机系统运行 Java 应用程序（JDK 安装好之后自带 JRE）

JVM：Java Virtual Machine 是 Java 虚拟机，是运行所有 Java 程序的抽象计算机（JRE 里自带了 JVM）

![](https://img.sherry4869.com/blog/it/java/javase/3.jpg)

## CLASSPATH 环境变量

- CLASSPATH 环境变量是隶属于 Java 语言的，不是 Windows 操作系统的，和 PATH 系统环境变量完全不同

- CLASSPATH 环境变量是给 ClassLoader（类加载器）指路的 

- `java A` 命令执行后，先启动 JVM，JVM 启动 ClassLoader，ClassLoader 会去硬盘上根据 CLASSPATH 环境变量中的路径去搜索 A.class 文件

- 如果没有配置 CLASSPATH 环境变量的话，ClassLoader 默认就从当前路径去搜索 class 字节码文件

- 如果配置了 CLASSPATH 环境变量，例如配置到 C:\Users\Administrator\Desktop，那么 ClassLoad 以后只会在桌面上找字节码文件了，不再从当前路径下找了

如果想让 CLASSPATH 环境变量先从当前路径找，找不到再从指定位置找，那么就可以在配置环境变量的时候，先写上一个点 `.`。两个点 `..` 表示上级路径，一个点 `.` 表示当前路径。接着加上分号与后面的路径做分隔

例如：`.;C:\Users\Administrator\Desktop` 先让类加载器从当前路径下找 class 字节码文件，找不到的话就从桌面上找，依旧找不到就报错

## 编译时乱码的问题

```java
public class HelloWorld {
    public static void main(String[] args) {
        
        System.out.println("你好世界");
    }
}
```

```shell
F:\>javac HelloWorld.java

F:\>java HelloWorld
浣犲ソ涓栫晫
```

因为 JDK21 的编译器默认采用 UTF-8 的编码格式进行编译，电脑上新建的文件采用了 GBK 的编码格式，编码不一致所以导致乱码了。因此需要统一编码格式：

```shell
F:\>javac -encoding UTF-8 HelloWorld.java

F:\>java HelloWorld
你好世界
```

::: tabs

@tab 设计目的

UTF-8

设计用于全球化，支持几乎所有书写系统中的字符，包括各种语言和符号

是 Unicode 的实现之一，Unicode是一种统一的字符集标准，旨在为每个字符分配一个唯一的代码点

---

GBK

设计用于简体中文，支持大量的汉字和部分中文符号

是 GB2312 标准的扩展，最初是为了在中国地区处理汉字而设计

@tab 字节长度

UTF-8

使用 1 到 4 个字节编码一个字符

ASCII 字符（例如英文字母和数字）使用 1 个字节

非 ASCII 字符使用 2 到 4 个字节，字节数随着字符在 Unicode 中的位置增加

---

GBK

使用 1 或 2 个字节编码一个字符

ASCII 字符使用 1 个字节

汉字和其他中文符号使用 2 个字节

@tab 兼容性

UTF-8

与 ASCII 完全兼容，所有的 ASCII 字符在 UTF-8 中仍然使用 1 个字节表示

是互联网和万维网的标准编码方式，广泛应用于网页、邮件和其他跨语言的应用程序中

---

GBK

不与 ASCII 完全兼容，因为汉字编码可能与某些扩展的 ASCII 字符冲突

主要用于 Windows 系统和一些中文软件，尤其是在过去的中文操作系统和应用中较为常见

:::

## Java 程序中的注释

- 注释有什么用？
    
    - Java 中的注释是用于解释和说明代码的文本，它不会被编译器编译，也不会被程序执行

    - 注释可以帮助开发者快速解读程序

- Java 中有三种注释方式

    - 单行注释
    
        ```java
        // 注释内容
        ```

    - 多行注释

        ```java
        /* 
        注释内容
        注释内容
        */
        ``` 

    - javadoc 注释（C:\Program Files\Java\jdk-21\bin\javadoc.exe）

        ```java
        /**
        * @author MW
        * @version 1.0
        * @since 1.0
        */
        ```

- 注释应该怎么写才好？

    - 注释不是越多越好，描述太啰嗦反而不好

    - 注释应该是在合适的位置写注释，简单明了，起到点睛之笔

    - 注释能力的提升需要在开发过程中不停的训练来加以提升

- javadoc 命令的简单使用

    - javadoc 的标记：作者 `@author`、版本号 `@version`、方法参数 `@param`

    - javadoc -d docs -author -version -encoding UTF-8 HelloWorld.java（可以生成 HelloWorld 程序的帮助文档）

## public class 与 class 的区别

- 一个 Java 源文件中可以定义多个 class

- 编译之后，一个 class 就会对应生成一个 class 字节码文件

- 如果一个类是 `public` 的，类名必须要和源文件名保持一致

- `public` 的类可以没有，有的话也只能有一个

- 任何一个 class 中都可以有 `main` 方法，但对于一个软件来说，一般入口只有一个