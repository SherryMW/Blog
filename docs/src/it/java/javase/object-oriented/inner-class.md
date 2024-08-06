---
category: IT
article: false
order: 15
---

# 内部类

- 什么是内部类？定义在一个类中的类

    例如 `ArrayList` 源码里定义的一些内部类：

    ```text
    private class Itr implements Iterator<E> {...} // 实例内部类
    
    private class ListItr extends Itr implements ListIterator<E> {...} // 实例内部类
  
    private static class SubList<E> extends AbstractList<E> implements RandomAccess {...} // 静态内部类
    ```

- 什么时候使用内部类？

  - 一个类用到了另外一个类，而这两个类的联系比较密切，但是如果把这两个类定义为独立的类，不但增加了类的数量，也不利于代码的阅读和维护

  - 内部类可以访问外部类的私有成员（`A` 类中有一个 `B` 类，`B` 类可以访问 `A` 类定义的私有成员），这样可以将相关的类和接口隐藏在外部类的内部，从而提高封装性

  - 匿名内部类是指没有名字的内部类，通常用于定义一个只使用一次的类，比如在事件处理中（Swing GUI）

- 内部类包括哪几种？

  - 静态内部类：和静态变量一个级别

    - 静态内部类如何实例化：`OuterClass.StaticInnerClass staticInnerClass = new OuterClass.StaticInnerClass();`

    - 无法直接访问外部类中实例变量和实例方法

- 实例内部类：和实例变量一个级别

  - 实例内部类如何实例化：`OuterClass.InnerClass innerClass = new OuterClass().new InnerClass();`

  - 可以直接访问外部类中所有的实例变量、实例方法、静态变量、静态方法

- 局部内部类：和局部变量一个级别

  - 局部内部类

  - 从 Java8 开始，不需要手动添加 `final` 了，JVM 会自动添加

- 匿名内部类：特殊的局部内部类，没有名字，只能用一次

## 静态内部类

在静态内部类中，无法直接访问外部类的实例成员

```java
public class OuterClass {

    // 静态变量
    private static int i = 100;

    // 实例变量
    private int j = 200;

    // 静态方法
    private static void m1() {
        System.out.println("外部类的 m1 静态方法执行了");
    }

    // 实例方法
    private void m2() {
        System.out.println("外部类的 m2 实例方法执行了");
    }

    /**
     * 静态内部类
     * 对于静态内部来说，访问控制修饰符在这里都可以使用
     */
    private static class InnerClass {

        public void m3() {
            System.out.println(i);
            System.out.println(j); // 非静态字段 j 不能从静态上下文中引用
            m1();
            m2(); // 不能从静态上下文引用非静态方法 m2
        }
    }
}
```

调用内部类的实例方法和静态方法：

```java
public class OuterClass {

    // 静态变量
    private static int i = 100;

    // 实例变量
    private int j = 200;

    // 静态方法
    private static void m1() {
        System.out.println("外部类的 m1 静态方法执行了");
    }

    // 实例方法
    private void m2() {
        System.out.println("外部类的 m2 实例方法执行了");
    }

    /**
     * 静态内部类
     * 对于静态内部来说，访问控制修饰符在这里都可以使用
     */
    public static class InnerClass {

        public void m3() {
            System.out.println(i);
            m1();
        }

        public static void m4() {
            System.out.println(i);
            m1();
        }
    }

    public static void main(String[] args) {
        
        InnerClass innerClass = new InnerClass();
        innerClass.m3();

        InnerClass.m4();
    }
}
```

```java
public class OuterClassTest {

    public static void main(String[] args) {

        // 创建内部类对象
        OuterClass.InnerClass innerClass = new OuterClass.InnerClass();
        // 调用实例方法
        innerClass.m3();

        // 调用内部类静态方法
        OuterClass.InnerClass.m4();
    }
}
```

## 实例内部类

实例内部类中可以直接访问外部类的实例成员和静态成员

```java
public class OuterClass {

    // 实例变量
    private int i = 100;

    // 实例方法
    public void m1() {
        System.out.println("外部类的实例方法 m1 执行了");
    }

    // 静态变量
    private static int j = 200;

    // 静态方法
    public static void m2() {
        System.out.println("外部类的静态方法 m2 执行了");
    }

    // 实例内部类
    public class InnerClass {

        public void x() {
            System.out.println(i); // 实例内部类要创建的话，得先创建外部类的实例，因此是肯定可以访问外部类 OuterClass 的实例成员的
            System.out.println(j); // 这个就更可以访问了，因为都不需要对象，直接使用类名就可以访问
            m1();
            m2();
        }
    }
}
```

```java
public class OuterClassTest {

    public static void main(String[] args) {

        OuterClass.InnerClass innerClass = new OuterClass().new InnerClass();
        innerClass.x();
    }
}
```

## 局部内部类

局部内部类能不能访问外部类的数据，取决于局部内部类所在的方法是否为静态的

如果这个方法是静态的：只能访问外部类中的静态成员

如果这个方法是实例的：都可以访问

局部内部类不能使用访问权限修饰符修饰

局部内部类在访问外部的局部变量时，这个局部变量必须是 `final` 的。只不过从 JDK8 开始，这个 `final` 关键字不需要显示提供的了，系统自动提供

```java
public class OuterClass {

    // 静态变量
    private static int k = 1;

    // 实例变量
    private int f = 2;

    public void m1() {

        // 局部变量
        int i = 100; // 在 JDK8 之前局部内部类在访问局部变量时，该局部变量一定要显示用 final 修饰

        // i = 200; // 如果 i 重新复制，那么局部内部类中就不可以访问了 Variable 'i' is accessed from within inner class, needs to be final or effectively final

        // 局部内部类
        class InnerClass {
            // 实例方法
            public void x() {
                System.out.println(k);
                System.out.println(f);
                System.out.println(i); // 逆向思维，如果 i 不是默认 final 修饰的，那么此时这里输出的就是 100，但又给 i 变量重新赋值 200，那么 innerClass.x(); 一旦调用就是 200，与一开始预想的 100 起矛盾了，因此 Java 的开发者会把局部内部类访问外部的局部变量设计成 final
            }
        }
        // i = 200;

        // 想调用 InnerClass 的 x 方法，得实例化对象
        InnerClass innerClass = new InnerClass();
        innerClass.x();
        // 想执行到上述的两行代码，得调用 m1 方法（实例化外部类的对象）
    }

    public static void m2() {

        // 局部内部类
        class InnerClass {
            // 实例方法
            public void x() {
                System.out.println(k);
                // System.out.println(f); // f 是实例变量，m2 方法是一个静态方法，静态上下文只能访问外面的静态变量
            }
        }
    }
}
```

```java
public class OuterClassTest {

    public static void main(String[] args) {

        OuterClass outerClass = new OuterClass();
        outerClass.m1();
    }
}
```

## 匿名内部类

特殊的局部内部类，没有名字，只能使用一次

不使用匿名内部类：

```java
public class Test {

    public static void main(String[] args) {

        Computer computer = new Computer();
        computer.conn(new Printer());
    }
}

class Computer {

    public void conn(Usb usb) {
        usb.read();
        usb.write();
    }
}

interface Usb {

    void read();

    void write();
}

class Printer implements Usb {

    @Override
    public void read() {
        System.out.println("打印机开始读取数据");
    }

    @Override
    public void write() {
        System.out.println("打印机开始打印");
    }
}
```

使用匿名内部类：

```java
public class Test {

    public static void main(String[] args) {

        Computer computer = new Computer();
        /**
         * 以下 conn 方法参数上的代码做了两件事：
         * 1. 完成了匿名内部类的定义
         * 2. 同时实例化了一个匿名内部类的对象
         */
        computer.conn(new Usb() { // 有大括号表示接口的实现
            @Override
            public void read() {
                System.out.println("read...");
            }

            @Override
            public void write() {
                System.out.println("write...");
            }
        });
    }
}

class Computer {

    public void conn(Usb usb) {
        usb.read();
        usb.write();
    }
}

interface Usb {

    void read();

    void write();
}
```