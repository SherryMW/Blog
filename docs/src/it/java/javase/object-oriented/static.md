---
category: IT
article: false
order: 6
---

# static 关键字

`static` 修饰的变量叫做静态变量。`static` 修饰的方法叫做静态方法

静态变量在类加载时初始化，存储在堆当中。JVM 规范是把静态变量存储在方法区里，JDK 内部使用的 JVM 实现是 Oracle 公司开发的 HotSpot，在 JDK7 把静态变量存储到堆内存当中

什么情况下把成员变量定义为静态成员变量？当一个属性是对象级别的，这个属性通常定义为实例变量（实例变量是一个对象一份。100个对象就应该有100个空间）例如身高实例变量，每个对象的身高都是不一样的。当一个属性是类级别的（所有对象都有这个属性，并且这个属性的值是一样的）建议将其定义为静态变量，在内存空间上只有一份，节省内存开销

所有静态变量和静态方法，统一使用“类名.”调用，不需要 `new` 对象。虽然可以使用“引用.”来调用，但实际运行时和对象无关，所以不建议这样写，因为这样写会给其他人造成疑惑

使用“引用.”访问静态相关的，即使引用为 `null`，也不会出现空指针异常

静态方法中不能使用 `this` 关键字，因此无法直接访问实例变量和调用实例方法

## 静态变量方法

```java
public class Chinese {

    String idCard; // 身份证号

    String name; // 姓名

    String country = "中国"; // 国籍

    public Chinese(String idCard, String name) {
        this.idCard = idCard;
        this.name = name;
    }

    public void display() {
        System.out.println("身份证号：" + idCard + "，姓名：" + name + "，国籍：" + country);
    }
}
```

```java
public class ChineseTest {

    public static void main(String[] args) {

        // 创建 3 个中国人对象
        Chinese zhangsan = new Chinese("12122322223232", "张三");
        Chinese lisi = new Chinese("12000022223232", "李四");
        Chinese wangwu = new Chinese("12111111123232", "王五");
    }
}
```

![](https://img.sherry4869.com/blog/it/java/javase/22.png)

静态变量存储在哪里？静态变量在什么时候初始化？（什么时候开辟空间）

JDK8 之后：静态变量存储在堆内存当中，在类加载时进行初始化

```java
public class Chinese {

    String idCard; // 身份证号

    String name; // 姓名

    static String country = "中国"; // 国籍

    public Chinese(String idCard, String name) {
        this.idCard = idCard;
        this.name = name;
    }

    public void display() {
        System.out.println("身份证号：" + idCard + "，姓名：" + name + "，国籍：" + country);
    }
}
```

```java
public class ChineseTest {

    public static void main(String[] args) {

        // 创建 3 个中国人对象
        Chinese zhangsan = new Chinese("12122322223232", "张三");
        Chinese lisi = new Chinese("12000022223232", "李四");
        Chinese wangwu = new Chinese("12111111123232", "王五");

        // 使用“类名.”访问静态变量
        System.out.println("国籍：" + Chinese.country);
    }
}
```

类加载是在 `main` 方法执行之前执行的。在类加载的时候就会检索类中有没有静态变量，有的话就会在堆内存中开辟空间

![](https://img.sherry4869.com/blog/it/java/javase/23.png)

所有静态变量和静态方法，统一使用“类名.”调用，不需要 `new` 对象。虽然可以使用“引用.”来调用，但实际运行时和对象无关，所以不建议这样写，因为这样写会给其他人造成疑惑

使用“引用.”访问静态相关的，即使引用为 `null`，也不会出现空指针异常

```java
public class Chinese {

    String idCard; // 身份证号

    String name; // 姓名

    static String country = "中国"; // 国籍

    public Chinese(String idCard, String name) {
        this.idCard = idCard;
        this.name = name;
    }

    public void display() {
        System.out.println("身份证号：" + idCard + "，姓名：" + name + "，国籍：" + country);
    }

    // 静态方法
    public static void test() {
        System.out.println("静态方法test执行了");

        // 这个不行，因为静态方法里没有当前对象
        //display();
        //System.out.println(name);

        // 这些可以
        System.out.println(Chinese.country);
        System.out.println(country); // 在同一个类中，“类名.”可以省略

        Chinese.test2();
        test2();
    }

    public static void test2() {

    }

    // 实例方法
    public void doSome() {
        // 正规访问方式
//        System.out.println(this.k);
//        System.out.println(Chinese.f);
//        this.doOther1();
//        Chinese.doOther2();

        // 省略的方式
        System.out.println(k);
        System.out.println(f);
        doOther1();
        doOther2();
    }

    // 实例变量
    int k = 100;

    // 静态变量
    static int f = 1000;

    // 实例方法
    public void doOther1() {
        System.out.println("do other1....");
    }

    // 静态方法
    public static void doOther2() {
        System.out.println("do other2....");
    }
}
```

```java
public class ChineseTest {

    public static void main(String[] args) {

        // 创建 3 个中国人对象
        Chinese zhangsan = new Chinese("12122322223232", "张三");
        Chinese lisi = new Chinese("12000022223232", "李四");
        Chinese wangwu = new Chinese("12111111123232", "王五");

        zhangsan.doSome();

        // 使用“类名.”访问静态变量
        System.out.println("国籍：" + Chinese.country);

        // 静态变量可以采用“引用.”来访问吗？可以（但不建议：会给程序员造成困惑，程序员会认为 country 是一个实例变量）建议还是使用“类名.”来访问。这是正规的
        System.out.println(zhangsan.country);
        System.out.println(lisi.country);
        System.out.println(wangwu.country);

        zhangsan = null;
        lisi = null;
        wangwu = null;

        // 静态变量也可以用“引用.”访问，但是实际运行时和对象无关。以下程序也不会出现空指针异常
        System.out.println(zhangsan.country); // 在实际运行中，程序会找到 zhangsna 这个引用是 Chinese 类型，因此会转换成 Chinese.country
        System.out.println(lisi.country); // 在实际运行中，程序会找到 lisi 这个引用是 Chinese 类型，因此会转换成 Chinese.country
        System.out.println(wangwu.country); // 在实际运行中，程序会找到 wangwu 这个引用是 Chinese 类型，因此会转换成 Chinese.country
        
        // 什么时候会出现空指针异常？一个空引用访问实例相关的变量或方法，都会出现空指针异常
        System.out.println(zhangsan.name);

        Chinese.test();

        // 也不会出现空指针异常。但是这种访问是不建议的。静态方法就应该使用“类名.”来访问
        zhangsan.test();
    }
}
```

## 静态代码块

语法格式：

```text
static {

}
```

静态代码块在类加载时执行，并且只执行一次

一个类中可以编写多个静态代码块，遵循自上而下的顺序依次执行

静态代码块什么时候用？本质上，静态代码块的就是给程序员预留的一个特殊的时间点：类加载时刻。如果你需要在类加载时刻执行一段程序的话，这段代码就可以写到静态代码块当中。例如有这样一个需求：请在类加载时，记录日志。那么记录日志的代码就可以编写到静态代码块当中

```java
public class StaticTest01 {

    // 实例变量
    String name = "zhangsan";

    // 静态变量
    static int i = 10;

    // 静态代码块
    static {
        // 报错原因：在静态上下文中无法直接访问实例相关的数据
        //System.out.println(name);

        // 这个 i 可以访问，是因为 i 变量是静态变量，也是在类加载时初始化
        System.out.println(i);

        System.out.println("静态代码块1执行了");

        /**
         j 无法访问的原因是：程序执行到这里的时候，j 变量不存在
         静态代码块和静态变量都是在同一时刻在类加载时初始化，因此得看代码的先后顺序来决定执行顺序，谁在前就谁先执行
         */
        //System.out.println(j);

        System.out.println("xxxx-xx-xx xx:xx:xx 000 -> StaticTest01.class完成了类加载！");
    }

    // 静态变量
    static int j = 20;

    /**
     实例方法只有手动在调用这个方法的时候，才会执行压栈操作
     此时对象早就已经创建好了，对象创建好的时候实例变量 name2 也已经在局部变量表里开辟好空间了
     */
    public void doSome() {
        System.out.println(name2);
    }

    /**
     在 new 对象的时候，name2 的空间会被开辟出来，至于 doSome 方法是在程序员手动调用的时候才会执行压栈
     两个代码不在同一时刻（不在一个时间线上）创建，因此就不需要代码的先后顺序来决定执行顺序
     */
    String name2 = "lisi";

    static {
        System.out.println("静态代码块2执行了");
    }

    public static void main(String[] args) {
        System.out.println("main execute!");
    }

    static {
        System.out.println("静态代码块3执行了");
    }
}
```