---
category: IT
article: false
order: 5
---

# this 关键字

- `this` 是一个关键字

- `this` 出现在实例方法中，代表当前对象。语法是 `this.`

- 通过 `this.` 可以访问实例变量，也可以调用实例方法

- `this` 本质上是一个引用，该引用保存了当前对象的内存地址

- `this` 存储在栈帧的局部变量表的第 0 个槽位上

- `this.` 大部分情况下可以省略，但用于区分局部变量和实例变量时不能省略

- `this` 不能出现在静态方法中

- `this(实参)` 语法：

  - 只能出现在构造方法的第一行

  - 通过这种语法可以在构造方法中调用本类中其他的构造方法

  - 作用是代码复用

```java
public class Vip {

    private String name; // 实例变量（实例变量的访问必须通过“引用.”来访问）

    public Vip() {
    }

    public Vip(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void shopping() { // 实例方法
        // this 是一个引用。保存了内存地址指向了当前对象
        //System.out.println(this.name + "在购物");

        // this代表的是当前对象
        System.out.println("shopping-->" + this);
    }

    public static void test() {
        // 编译报错
//        System.out.println(this.name); // this 不能用，static 方法中没有当前对象，因此 static 的方法中不能使用 this
//        System.out.println(name); // name 是实例变量，想访问实例变量必须得有当前对象，静态方法 test 是用“类名.”静态方法名 来访问的，Vip.test(); static 方法中没有当前对象
//        this.shopping(); // this 不能用，static 方法中没有当前对象，因此 static 的方法中不能使用 this
//        shopping(); // shopping 是实例方法，想访问实例方法必须得有当前对象，静态方法 test 是用“类名.”静态方法名 来访问的，Vip.test(); static 方法中没有当前对象

        // 因为 test2 是静态方法，不需要对象的参与，所以可以直接通过“类名.”静态方法名 进行调用
        Vip.test2();
        // 如果在同一个类中，可以省略“类名.”
        test2();

        // 如果实在想在静态方法里访问实例变量和实例方法，那么只能创建一个对象
        Vip vip = new Vip("王五");
        System.out.println(vip.name); // 注意这里得用 引用.实例变量
        vip.shopping();
    }

    public static void test2() {
        System.out.println("test2...");
    }
    
}
```

```java
public class VipTest {

    public static void main(String[] args) {

        Vip zhangsan = new Vip("张三");
        // com.powernode.javase.Vip@2f4d3709
        // 这个输出结果可以等同看做是这个 java 对象的内存地址（只是可以等同看做）
        System.out.println("main-->" + zhangsan);
        zhangsan.shopping();

        Vip lisi = new Vip("李四");
        System.out.println("main-->" + lisi);
        lisi.shopping();

        Vip.test();
    }
}
```

需求：定义一个日期类，代表日期。日期属性包括：年月日。提供两个构造方法，一个是无参数构造方法，当通过无参数构造方法实例化日期对象的时候，默认创建的日期是 1970-01-01。另一个构造方法三个参数，通过传递年月日三个参数来确定一个日期。注意属性要提供封装

```java
public class Date {

    private int year; // 年

    private int month; // 月

    private int day; // 日

    public Date() {
//        this.year = 1970;
//        this.month = 1;
//        this.day = 1;

        // 虽然能编译通过也能运行，但在堆内存中会新建一个对象，那么在 main 方法中的 d1.display(); 将会输出【0年0月0日】
//        new Date(1970, 1, 1);
        
        // 不会创建新的对象，只是通过一个构造方法去调用另外一个构造方法
        this(1970, 1, 1);

        System.out.println("日期创建成功");
    }

    public Date(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    /**
     * 打印日期
     */
    public void display() {
        System.out.println(year + "年" + month + "月" + day + "日");
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }
}
```

```java
public class DateTest {

    public static void main(String[] args) {

        // 创建默认日期对象
        Date d1 = new Date();
        d1.display();

        // 创建指定的日期
        Date d2 = new Date(2008, 8, 8);
        d2.display();
    }
}
```