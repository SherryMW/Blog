---
category: IT
article: false
order: 2
---

# 类与对象

## 类

定义类的语法格式：

```text
[修饰符列表] class 类名 {
    类体 = 属性 + 方法
    
    // 属性（实例变量），描述的是状态
    
    // 方法，描述的是行为动作
}
```

为什么要定义类？因为要通过类实例化对象，一个类可以实例化多个 Java 对象，有了对象之后可以让对象与对象之间协作起来形成系统

实例变量是一个对象一份，比如创建 3 个学生对象，每个学生对象中都应该有类中创建的属性

实例变量属于成员变量，成员变量如果没有手动赋值，系统会赋予默认值

|  数据类型   |  默认值   |
|:-------:|:------:|
|  byte   |   0    |
|  short  |   0    |
|   int   |   0    |
|  long   |   0L   |
|  float  |  0.0f  |
| double  |  0.0d  |
| boolean | false  |
|  char   | \u0000 |
| 引用数据类型  |  NULL  |

```java
public class Student {
    
    // 属性：姓名，年龄，性别，它们都是实例变量
    
    // 姓名
    String name;
    
    // 年龄
    int age;
    
    // 性别
    boolean gender;
}
```

## 对象

```java
public class StudentTest01 {

    public static void main(String[] args) {
        
        int i = 10; // 局部变量

        /**
         * 只要定义 Class，它就是一种类型，属于引用数据类型
         * 通过学生类 Student 实例化学生对象
         * Student s1; 是什么？s1 是变量名。Student是一种数据类型名，属于引用数据类型
         * s1 也是一个局部变量，和变量 i 一样
         * i 是 JVM 中栈内存 main 方法栈帧局部变量里，类型是基本数据类型，存的是 10
         * s1 在 JVM 中栈内存 main 方法栈帧局部变量里，类型是引用数据类型
         * s1 存的是 JVM 中堆内存 Student 对象的内存地址
         * 什么是引用？引用本质上是一个变量，这个变量中保存了 Java 对象的内存地址
         *
         * 引用和对象要区分开，对象存在 JVM 堆内存中，引用是保存对象地址的变量
         */
        Student s1 = new Student();
        
        // 既然是学生对象，那么该对象就是一个学生类型，不可能是 String 或者其他基本数据类型
        // String s1 = new Student();

        /**
         * 访问对象的属性
         * 访问实例变量的语法：引用.变量名
         * 两种访问方式：读取和修改
         * 读取：引用.变量名;  s1.name; s1.age; s1.gender
         * 修改：引用.变量名 = 值; s1.name = "张三"; s1.age = 20; s1.gender = true;
         *
         * 对象的实例变量存在堆内存里
         */
        System.out.println("姓名：" + s1.name); // null（String 是引用类型，引用类型的默认值是 null）
        System.out.println("年龄：" + s1.age); // 0（基本数据类型 int 的默认值是 0）
        System.out.println("性别：" + (s1.gender ? "男" : "女")); // 女（基本数据类型 boolean 的默认值是 false）
        
        // 修改对象的属性（修改变量的值就是给变量重新赋值）
        s1.name = "张三";
        s1.age = 20;
        s1.gender = true;

        System.out.println("姓名：" + s1.name); // 张三
        System.out.println("年龄：" + s1.age); // 20
        System.out.println("性别：" + (s1.gender ? "男" : "女")); // 男
        
    }
}
```

![](https://img.sherry4869.com/blog/it/java/javase/17.png)

## 实例变量

```java
public class Vip {

    /**
     * 类 = 属性 + 方法
     * 属性描述的是状态
     * 方法描述的是行为
     */
    
    // 姓名
    String name; // 实例变量(对象变量)
    
    // 年龄
    int age; // 实例变量（对象变量）
    
}
```

```java
public class VipTest {

    public static void main(String[] args) {

        // 创建一个Vip对象
        Vip vip1 = new Vip();

        // 给name和age属性赋值
        vip1.name = "jack";
        vip1.age = 20;

        System.out.println("name = " + vip1.name);
        System.out.println("age = " + vip1.age);

        // 再创建一个Vip对象
        Vip vip2 = new Vip();
        vip2.name = "lisi";
        vip2.age = 15;

        System.out.println("name = " + vip2.name);
        System.out.println("age = " + vip2.age);

        /**
         * 为什么 name 和 age 不能使用“类名.”访问
         * 实例变量要想访问，必须先 new 对象。通过引用来访问实例变量
         * 实例变量是不能通过类名直接访问的
         */
        //System.out.println(Vip.name);
        //System.out.println(Vip.age);
        
    }
}
```

## 实例方法

```java
public class Vip {

    /**
     * 类 = 属性 + 方法
     * 属性描述的是状态
     * 方法描述的是行为
     */
    
    // 姓名
    String name; // 实例变量(对象变量)
    
    // 年龄
    int age; // 实例变量（对象变量）

    /**
     * 通常我们描述一个对象的行为动作时，不加 static 关键字
     * 没有添加 static 的方法被叫做：实例方法
     */
    public void shopping() {
        System.out.println("正在购物！");
    }
    
}
```

```java
public class VipTest {

    public static void main(String[] args) {

        // 创建一个Vip对象
        Vip vip1 = new Vip();

        // 给name和age属性赋值
        vip1.name = "jack";
        vip1.age = 20;

        System.out.println("name = " + vip1.name);
        System.out.println("age = " + vip1.age);
        
        // 实例方法需要使用“引用.”来调用
        vip1.shopping();

        // 再创建一个Vip对象
        Vip vip2 = new Vip();
        vip2.name = "lisi";
        vip2.age = 15;

        System.out.println("name = " + vip2.name);
        System.out.println("age = " + vip2.age);

        // 实例方法需要使用“引用.”来调用
        vip2.shopping();

        // 编译报错。实例方法不能使用“类名.”去调用
        //Vip.shopping();

    }
}
```

定义一个宠物类，属性包括名字，出生日期，性别。有吃和跑的行为。再编写测试程序，创建宠物对象，访问宠物的属性，调用宠物吃和跑的方法

```java
public class Pet {
    
    // 实例变量：属性状态
    
    String name; // 名字
    
    String birth; // 出生日期
    
    char sex; // 性别

    // 实例方法：行为动作
    
    // 吃
    public void eat() {
        System.out.println("宠物在吃东西");
    }

    // 跑
    public void run() {
        System.out.println("宠物在跑步");
    }
}
```

```java
public class PetTest {
    
    public static void main(String[] args) {

        // 创建宠物对象
        Pet dog = new Pet();

        // 给属性赋值
        dog.name = "小黑";
        dog.birth = "2012-10-11";
        dog.sex = '雄';

        // 读取属性的值
        System.out.println("狗狗的名字：" + dog.name);
        System.out.println("狗狗的生日：" + dog.birth);
        System.out.println("狗狗的性别：" + dog.sex);

        // 吃
        dog.eat();

        // 跑
        dog.run();

        // 再创建另外一个宠物对象
        Pet rabbit = new Pet();

        // 给属性赋值
        rabbit.name = "小灰灰";
        rabbit.birth = "2015-10-11";
        rabbit.sex = '雌';

        // 读取属性的值
        System.out.println("兔兔的名字：" + rabbit.name);
        System.out.println("兔兔的生日：" + rabbit.birth);
        System.out.println("兔兔的性别：" + rabbit.sex);

        // 吃
        rabbit.eat();

        // 跑
        rabbit.run();
    }
}
```

## 空指针异常

```java
public class PetTest02 {

    public static void main(String[] args) {

        // 创建宠物对象
        Pet dog = new Pet();

        // 给属性赋值
        dog.name = "小黑";
        dog.birth = "2012-10-11";
        dog.sex = '雄';

        // 读取属性的值
        System.out.println("狗狗的名字：" + dog.name);
        System.out.println("狗狗的生日：" + dog.birth);
        System.out.println("狗狗的性别：" + dog.sex);

        dog = null;

        /**
         * 注意：引用一旦为 null，表示引用不再指向对象了
         * 通过这个为 null 的引用来访问 name 属性，编译可以通过，但运行的时候会报空指针异常 NullPointerException
         * 为什么会出现空指针异常？因为运行的时候会找真正的对象，如果对象不存在了，就会出现这个异常
         */
        System.out.println("狗狗的名字：" + dog.name);

        // 同样会出现空指针异常
        dog.eat();

        // 同样会出现空指针异常
        dog.run();
    }
}
```

![](https://img.sherry4869.com/blog/it/java/javase/18.png)

一开始 dog 引用保存了 Pet 对象的内存地址，当 dog 引用变成 null 的时候，与 Pet 对象的关系就断了，就好像放风筝一样，线断了，风筝飘走了。最后 Pet 对象会被 GC 垃圾回收机制给回收掉

## 参数传递

分析以下程序的输出结果

```java
public class ArgsTest01 {

    public static void main(String[] args) {

        int i = 10;
        /**
         * 调用 add 方法的时候，将 i 传进去，实际上是怎么传的？将 i 变量中保存值 10 复制了一份，传给了 add 方法
         * 相当于
         * int i = 10; // bipush 10：将 10 这个字面量压入操作数栈当中；istore_1：将操作数栈顶元素弹出，将其存储到局部变量表的 1 号槽位上（i）
         * int j = i; // iload_1：将局部变量表 1 号槽位（i）上的数据复制一份，压入到操作数栈里。istore_2：将操作数栈顶元素弹出，然后将其存储到局部变量表 2 号槽位（j）上
         * add(j);
         */
        add(i);
        System.out.println("main--->" + i); // 10
    }

    public static void add(int i) { // 方法的形参是局部变量
        i++;
        System.out.println("add--->" + i); // 11
    }
    
}
```

![](https://img.sherry4869.com/blog/it/java/javase/19.png)

分析以下程序的输出结果

```java
public class User {
    
    int age;
}
```

```java
public class ArgsTest02 {

    public static void main(String[] args) {

        User u = new User();
        u.age = 10;
        /**
         * u 是怎么传递过去的。实际上和 i 原理相同：都是将变量中保存的值传递过去
         * 只不过这里的 u 变量中保存的值比较特殊，是一个对象的内存地址
         */
        add(u);
        System.out.println("main-->" + u.age); // 11
    }

    public static void add(User k) {
        k.age++;
        System.out.println("add-->" + k.age); // 11
    }

}
```

u 存储的是 User 对象的内存地址 0x12，当调用 add 方法的时候，是把 0x12 这个内存地址值复制一份传递过去。此时 k 存储的也是 0x12 这个内存地址值，和 u 指向同一个 User 对象。所以一旦修改了该对象的实例变量值，那么其余引用该对象的变量获取到的也是修改后的值

![](https://img.sherry4869.com/blog/it/java/javase/20.png)

方法调用时，不管是基本数据类型还是引用数据类型，在传递的时候，永远都是把变量里保存的那个值复制一份传递过去

## 初始 this 关键字

```java
public class Student {

    // 属性，实例变量，学生姓名
    String name;

    // 方法：学习的行为（实例方法）
    public void study() {
        /**
         * 如果想让“正在努力的学习”里前面加上动态的名字，例如张三调用该方法，就打印“张三正在努力的学习”；李四调用该方法，就打印“李四正在努力的学习”
         * 就可以在前面加上 name 实例变量，但前面讲过，访问实例变量的语法是【引用.实例变量】得先 new 一个对象，通过引用来访问实例变量
         * 此时可以使用 this 关键字，this 代表当前对象（存的就是当前对象的内存地址）如果是张三调用 study()，那么 this 指的就是张三这个对象；如果是李四调用 study()，那么 this 指的就是李四这个对象
         * this 关键字可以省略，如果直接写一个 name，默认返回就是当前对象的 name
         */
        //System.out.println(this.name + "正在努力的学习！");
        System.out.println(name + "正在努力的学习！");
    }
}
```

```java
public class StudentTest {

    public static void main(String[] args) {

        // 创建学生对象
        Student zhangsan = new Student();
        // zhangsan 是引用，通过“引用.实例变量”来访问实例变量
        zhangsan.name = "张三";
        System.out.println("学生姓名：" + zhangsan.name);
        // 让张三去学习
        zhangsan.study();

        // 创建一个新的学生对象
        Student lisi = new Student();
        lisi.name = "李四";
        System.out.println("学生的姓名：" + lisi.name);
        // 让李四去学习
        lisi.study();
    }
}
```

任何一个实例方法的局部变量表里的 0 号槽位永远存的是 `this`，这个 `this` 保存的是当前对象的内存地址。如果是张三调用的 `study()`，那么 `this` 存的就是张三的对象内存地址；如果是李四调用的 `study()`，那么 `this` 存的就是李四的对象内存地址

![](https://img.sherry4869.com/blog/it/java/javase/21.png)