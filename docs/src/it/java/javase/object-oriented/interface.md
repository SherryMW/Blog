---
category: IT
article: false
order: 13
---

# 接口

在以后的实际开发当中，模块与模块之间想达到低耦合度，扩展能力强，通常开发模式都是多态 + 接口

## 基础语法

- 接口（interface）在 Java 中表示一种规范或契约，它定义了一组抽象方法和常量，用来描述一些实现这个接口的类应该具有哪些行为和属性。接口和类一样，也是一种引用数据类型

- 接口怎么定义？`[修饰符列表] interface 接口名 {}`

- 抽象类是半抽象的，接口是完全抽象的。接口没有构造方法，也无法实例化

- JDK8 之前接口中只能定义：常量 + 抽象方法。接口中常量的 `public static final` 可以省略。接口中抽象方法的 `abstract` 可以省略。接口中所有的方法和变量都是 `public` 修饰的

- 接口和接口之间可以多继承

- 类和接口的关系我们叫做实现。使用 `implements` 关键字进行接口的实现

- 一个类可以实现多个接口。语法是：`class 类 implements 接口A, 接口B {}`

- 一个非抽象的类实现接口必须将接口中所有的抽象方法全部实现（强制要求，不然编译器会报错）

- Java8 之后，接口中允许出现默认方法和静态方法

  - 引入默认方法是为了解决接口演变问题：接口可以定义抽象方法，但不能实现这些方法。所有实现接口的类都必须实现这些抽象方法，这会导致接口升级的问题：当我们向接口添加或删除一个抽象方法时，这会破坏该接口原有的所有实现，所有调用该接口的用户都必须修改其实现代码才能适应更改。这就是所谓的“接口演变”问题

  - 引入的静态方法只能使用本接口名来访问，无法使用实现类的类名来访问

- JDK9 之后允许接口中定义私有的实例方法（为默认方法服务的）和私有的静态方法（为静态方法服务的）

- 所有的接口隐式的继承 Object。因此接口也可以调用 Object 类的相关方法

接口文件在编译完成后也是生成 `.class` 文件

```java
public interface MyInterface {
    
}
```

```java
public class Test {

    public static void main(String[] args) {

        // 因为接口也是一个引用数据类型，所以也可以把接口定义成引用数据类型的变量
        MyInterface myInterface = null;
    }
}
```

---

抽象类是半抽象的，接口是完全抽象的。接口没有构造方法，也无法实例化

```java
public interface MyInterface {

    // Not allowed in interface
    public MyInterface() {
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        new MyInterface(); // 'MyInterface' is abstract; cannot be instantiated
    }
}
```

---

JDK8 之前接口中只能定义：常量 + 抽象方法。接口中常量的 `public static final` 可以省略。接口中抽象方法的 `abstract` 可以省略。接口中所有的方法和变量都是 `public` 修饰的

```java
public interface MyInterface {

    public static final int num = 1;

    int num2 = 2;

    public abstract void m1();

    void m2();
}
```

`num` 和 `num2` 都是 `public static final` 常量

`m1()` 和 `m2()` 都是抽象方法

```java
public class Test {

    public static void main(String[] args) {

        System.out.println(MyInterface.num);
        System.out.println(MyInterface.num2);
    }
}
```

---

接口和接口之间可以多继承

```java
interface A {

}

interface B {

}

interface C extends A, B {

}
```

---

类和接口的关系我们叫做实现。使用 `implements` 关键字进行接口的实现。implement 表示实现，加了复数表示可以实现多个接口的意思

一个类可以实现多个接口。语法是：`class 类 implements 接口A, 接口B {}`

一个非抽象的类实现接口必须将接口中所有的抽象方法全部实现（强制要求，不然编译器会报错）

```java
public interface MyInterface {

    public static final int num = 1;

    int num2 = 2;

    public abstract void m1();

    void m2();
}

interface A {

    void a();
}

interface B {

    void b();
}

interface C extends A, B {

    void c();
}

class MyInterfaceImpl implements C, MyInterface {

    @Override
    public void a() {
        System.out.println("a 执行了");
    }

    @Override
    public void b() {
        System.out.println("b 执行了");
    }

    @Override
    public void c() {
        System.out.println("c 执行了");
    }

    @Override
    public void m1() {
        System.out.println("m1 执行了");
    }

    @Override
    public void m2() {
        System.out.println("m2 执行了");
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        MyInterfaceImpl myInterface = new MyInterfaceImpl();
        myInterface.a();
        myInterface.b();
        myInterface.c();
        myInterface.m1();
        myInterface.m2();
    }
}
```

a 执行了  
b 执行了  
c 执行了  
m1 执行了  
m2 执行了

---

在使用了接口之后，为了降低程序的耦合度，一定要让接口和多态联合起来使用（父类型引用指向子类型对象）

有很多初学者对 `Animal animal = new Cat();` 可以理解，但对于 `MyInterface myInterface = new MyInterfaceImpl();` 难以理解，那是因为 `Animal animal = new Cat();` 两边都是一个类。而 `MyInterface myInterface = new MyInterfaceImpl();` 则一边是接口，一边是类

```java
public class Test {

    public static void main(String[] args) {

        MyInterface myInterface = new MyInterfaceImpl();
        
        // 编译器只知道 myInterface 的类型是 MyInterface，因此会去 MyInterface 里找，但该接口只有 m1 和 m2 方法，因此报错也是正常的。如果就是想调用的话，就得做向下转型
        /**
        myInterface.a();
        myInterface.b();
        myInterface.c();
        */
        
        // 面向接口去调用的，接口里面有的就可以调用，接口里面没有的就不能调用
        myInterface.m1();
        myInterface.m2();
    }
}
```

---

Java8 之后，接口中允许出现默认方法：引入默认方法是为了解决接口演变问题：接口可以定义抽象方法，但不能实现这些方法。所有实现接口的类都必须实现这些抽象方法，这会导致接口升级的问题：当我们向接口添加或删除一个抽象方法时，这会破坏该接口原有的所有实现，所有调用该接口的用户都必须修改其实现代码才能适应更改。这就是所谓的“接口演变”问题

默认方法：在接口中定义的默认方法，所有实现该接口的类都不需要强制要求实现接口中的默认方法（因为默认方法是有大括号方法体的，已经在接口中内部实现了）

```java
public interface MyInterface {

    // 默认方法
    default void defaultMethod() {
        System.out.println("MyInterface 接口中的默认方法 defaultMethod 执行了");
    }

    default void defaultMethod2() {
        System.out.println("MyInterface 接口中的默认方法 defaultMethod2 执行了");
    }
}

class MyInterfaceImpl implements MyInterface {

    @Override
    public void defaultMethod() {
        MyInterface.super.defaultMethod();
        System.out.println("MyInterfaceImpl 实现类中的默认方法 defaultMethod 执行了");
    }
    
    // 可以不实现默认方法，因此不重写 defaultMethod2 方法编译器也不会报错
}
```

```java
public class Test {

    public static void main(String[] args) {

        MyInterfaceImpl myInterface = new MyInterfaceImpl();
        /**
         调用默认方法，执行结果：
         MyInterface 接口中的默认方法 defaultMethod 执行了
         MyInterfaceImpl 实现类中的默认方法 defaultMethod 执行了
         */
        myInterface.defaultMethod();

        /**
         实现类不主动重写接口定义的默认方法也可以调用
         执行结果：
         MyInterface 接口中的默认方法 defaultMethod2 执行了
         */
        myInterface.defaultMethod2();
        
    }
}
```

Java8 之后，接口中允许出现静态方法：引入接口可以定义静态方法，但这个静态方法只能使用该接口名来调用，无法使用实现类的类名来访问（接口也可以当工具类来使用了，因为工具类里的方法基本都是定义成静态的）

```java
public interface MyInterface {

    // 静态方法
    static void staticMethod() {
        System.out.println("MyInterface 接口中的静态方法 staticMethod 执行了");
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        MyInterface.staticMethod(); // MyInterface 接口中的静态方法 staticMethod 执行了
    }
}
```

---

假如接口里的默认方法和静态方法代码量特别多，就会显得特别臃肿，我们平时的编程习惯会把冗余的代码进行拆分，但拆解的方法又不想让外部调用，只想让当前接口调用

因此 JDK9 之后允许接口中定义私有的实例方法（为默认方法服务的）和私有的静态方法（为静态方法服务的）

::: tabs

@tab MyInterface

```java
public interface MyInterface {

    // 默认方法
    default void defaultMethod() {
        System.out.println("MyInterface 接口中的默认方法 defaultMethod 执行了");
        privateMethod();
    }

    // 私有方法
    private void privateMethod() {
        System.out.println("MyInterface 接口中的私有方法 privateMethod 执行了");
    }

    // 静态方法
    static void staticMethod() {
        System.out.println("MyInterface 接口中的静态方法 staticMethod 执行了");
        privateStaticMethod();
    }

    // 私有静态方法
    private static void privateStaticMethod() {
        System.out.println("MyInterface 接口中的私有静态方法 privateStaticMethod 执行了");
    }
}
```

@tab MyInterfaceImpl

```java
class MyInterfaceImpl implements MyInterface {
    
    @Override
    public void defaultMethod() {
        MyInterface.super.defaultMethod();
        System.out.println("MyInterfaceImpl 实现类中的默认方法 defaultMethod 执行了");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        MyInterfaceImpl myInterface = new MyInterfaceImpl();
        myInterface.defaultMethod();

        MyInterface.staticMethod();

    }
}
```

MyInterface 接口中的默认方法 defaultMethod 执行了  
MyInterface 接口中的私有方法 privateMethod 执行了  
MyInterfaceImpl 实现类中的默认方法 defaultMethod 执行了  
MyInterface 接口中的静态方法 staticMethod 执行了  
MyInterface 接口中的私有静态方法 privateStaticMethod 执行了

:::

## 接口的作用

接口的作用：解耦合

- 面向接口调用的称为：接口调用者

- 面向接口实现的称为：接口实现者

- 调用者和实现者通过接口打到了解耦合。也就是说调用者不需要关心具体的实现者，实现者也不需要关心具体的调用者，双方都遵循规范，面向接口进行开发

- 面向抽象编程，面向接口编程，可以降低程序的耦合度，提高程序的扩展力

例如定义电脑类和硬盘类，硬盘提供 `read()` 和 `write()` 方法，电脑去连接硬盘，在不使用接口的情况下分析有哪些设计上的缺点：

::: tabs

@tab Computer

```java
public class Computer {

    public void conn(HardDrive hardDrive) {
        System.out.println("连接设备成功");
        hardDrive.read();
        hardDrive.write();
    }
}
```

@tab HardDrive

```java
public class HardDrive {

    public void read() {
        System.out.println("硬盘开始读数据");
    }

    public void write() {
        System.out.println("硬盘开始写数据");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建硬盘对象
        HardDrive hardDrive = new HardDrive();
        // 创建电脑对象
        Computer computer = new Computer();
        computer.conn(hardDrive);
    }
}
```

连接设备成功  
硬盘开始读数据  
硬盘开始写数据

:::

上述的程序存在一些设计上的缺陷：如果此时电脑想要连接打印机，而不是硬盘，该怎么办？

违背 OCP 开闭原则，`Computer` 类的扩展能力差：`Computer` 类中使用了 `HardDriver` 类和 `Printer` 类，导致 `Computer` 类和 `HardDrive`，`Printer` 耦合度太高，导致扩展力太差

::: tabs

@tab Computer

```java
public class Computer {

    public void conn(HardDrive hardDrive) {
        System.out.println("连接设备成功");
        hardDrive.read();
        hardDrive.write();
    }
    
    // 如果新增一个连接的设备就在 Computer 类里新增对应设备的连接方法，那么 Computer 类会与所有连接设备提高耦合度
    public void conn(Printer printer) {
        System.out.println("连接设备成功");
        printer.read();
        printer.write();
    }
}
```

@tab HardDrive

```java
public class HardDrive {

    public void read() {
        System.out.println("硬盘开始读数据");
    }

    public void write() {
        System.out.println("硬盘开始写数据");
    }
}
```

@tab Printer

```java
public class Printer {

    public void read() {
        System.out.println("打印机开始读数据");
    }

    public void write() {
        System.out.println("打印机开始打印文件");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建电脑对象
        Computer computer = new Computer();

        // 创建硬盘对象
        HardDrive hardDrive = new HardDrive();
        // 电脑连接硬盘
        computer.conn(hardDrive);

        // 创建打印机对象
        Printer printer = new Printer();
        // 电脑连接打印机
        computer.conn(printer);
    }
}
```

连接设备成功  
硬盘开始读数据  
硬盘开始写数据  
连接设备成功  
打印机开始读取数据  
打印机开始写数据

:::

使用接口的方式解耦合，让电脑和硬盘以及打印机解耦合

定义一个 Usb 接口来解耦合，电脑只需要关心 Usb 接口，是该接口的调用者。而打印机和硬盘都去实现该接口，是该接口的实现者

::: tabs

@tab Usb

```java
/**
 这是一个抽象的 Usb 接口
 调用者是 Computer
 实现者是 HardDrive 和 Printer
 调用者和实现者都是面向 Usb 接口写代码的
 接口将 Computer 和具体的设备解耦合了
 */
public interface Usb {

    void read();

    void write();
}
```

@tab Computer

```java
public class Computer {

    public void conn(Usb usb) {
        System.out.println("设备连接成功");
        usb.read();
        usb.write();
    }

}
```

@tab HardDrive

```java
public class HardDrive implements Usb {

    @Override
    public void read() {
        System.out.println("硬盘开始读数据");
    }

    @Override
    public void write() {
        System.out.println("硬盘开始写数据");
    }
}
```

@tab Printer

```java
public class Printer implements Usb {

    @Override
    public void read() {
        System.out.println("打印机开始读取数据");
    }

    @Override
    public void write() {
        System.out.println("打印机开始写数据");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Computer computer = new Computer();
        computer.conn(new HardDrive());

        computer.conn(new Printer());
    }
}
```

设备连接成功  
硬盘开始读数据  
硬盘开始写数据  
设备连接成功  
打印机开始读取数据  
打印机开始写数据

:::

---

再想想，我们平时去饭店吃饭，这个场景中有没有接口呢？食谱菜单就是接口。顾客就是调用者，厨师就是实现者

::: tabs

@tab FoodMenu

```java
public interface FoodMenu {

    void chineseFood();

    void WesternFood();
}
```

@tab Cooker

```java
public class Cooker implements FoodMenu {

    private String name;

    public Cooker(String name) {
        this.name = name;
    }

    @Override
    public void chineseFood() {
        System.out.println(name + "做的西红柿炒鸡蛋");
    }

    @Override
    public void WesternFood() {
        System.out.println(name + "做的牛排");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

@tab Customer

```java
public class Customer {

    public void order(FoodMenu foodMenu) {
        // 调用的方法都是接口中的方法。面向接口编程，面向抽象编程。降低程序耦合度，提高扩展力
        foodMenu.chineseFood();
        foodMenu.WesternFood();
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Customer customer = new Customer();
        customer.order(new Cooker("张三"));
    }
}
```

:::

## 接口和抽象类如何选择

抽象类和接口虽然在代码角度都能达到相同的效果，但适用的场景不同：

1. 抽象类主要适用于公共代码的提取。当多个类中有共同的属性和方法时，为了达到代码的复用，建议把这几个类提取出来一个父类，在该父类中编写公共的代码。如果有一些方法无法在父类中实现，可以延迟到子类中实现。这样的类就应该使用抽象类

2. 接口主要用于功能的扩展。例如有很多类，一些类需要这个方法，另外一些类不需要这个方法时，可以将该方法定义到接口中。需要这个方法的类就去实现该接口，不需要这个方法的类就可以不实现这个接口。接口主要规定的是行为

---

定义一个动物类 `Animal`，属性包括 `name`，`age`。方法包括 `display()`，`eat()`。`display()` 方法可以有具体地实现，显示动物的基本信息。但因为不同的动物会有不同的吃的方式，因此 `eat()` 方法应该定义为抽象方法，延迟给子类来实现  
定义多个子类，例如：`XiaoYanZi`、`Dog`、`YingWu`。分别继承 `Animal`，实现 `eat()` 方法  
当然，也不是所有动物都会飞，其中只有 `XiaoYanZi` 和 `YingWu` 会飞，请定义一个 `Flyable` 接口，接口中定义 `fly()` 方法。让 `XiaoYanZi` 和 `YingWu` 都能飞  
不是所有的动物都会说话，其中只有 `YingWu` 会说话，请定义一个 `Speakable` 接口，接口中定义 `speak()` 方法。让 `YingWu` 会说话  
编写测试程序，创建各个动物对象，调用 `display()`、`eat()` 方法，能飞的动物让它飞，能说话的动物让它说话

注意：一个类继承某个类的同时可以实现多个接口（单继承多实现）：`class 类 extends 父类 implements 接口 A, 接口 B {}`

注意：当某种类型向下转型为某个接口类型时，接口类型和该类之间可以没有继承关系，编译器不会报错的

::: tabs

@tab Animal

```java
public abstract class Animal {

    private String name;

    private int age;

    public Animal() {
    }

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void display() {
        System.out.println("动物信息>>>姓名：" + name + "，年龄：" + age);
    }

    public abstract void eat();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

@tab Flyable

```java
public interface Flyable {

    void fly();
}
```

@tab Speakable

```java
public interface Speakable {

    void speak();
}
```

@tab Dog

```java
public class Dog extends Animal {

    public Dog(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println(getName() + "吃的方式");
    }
}
```

@tab XiaoYanZi

```java
public class XiaoYanZi extends Animal implements Flyable {

    public XiaoYanZi(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println(getName() + "吃的方式");
    }

    @Override
    public void fly() {
        System.out.println(getName() + "会飞");
    }
}
```

@tab YingWu

```java
public class YingWu extends Animal implements Flyable, Speakable {

    public YingWu(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println(getName() + "吃的方式");
    }

    @Override
    public void fly() {
        System.out.println(getName() + "会飞");
    }

    @Override
    public void speak() {
        System.out.println(getName() + "会说话");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Dog dog = new Dog("小狗", 20);
        XiaoYanZi xiaoyanzi = new XiaoYanZi("小燕子", 20);
        YingWu yingwu = new YingWu("鹦鹉", 20);

        dog.display();
        dog.eat();

        xiaoyanzi.display();
        xiaoyanzi.eat();
        xiaoyanzi.fly();

        yingwu.display();
        yingwu.eat();
        yingwu.fly();
        yingwu.speak();

    }
}
```

动物信息>>>姓名：小狗，年龄：20  
小狗吃的方式  
动物信息>>>姓名：小燕子，年龄：20  
小燕子吃的方式  
小燕子会飞  
动物信息>>>姓名：鹦鹉，年龄：20  
鹦鹉吃的方式  
鹦鹉会飞  
鹦鹉会说话

:::

---

假设你正在编写一个游戏，其中有一些怪物和英雄，并且它们都可以进行战斗。具体来说，每个角色都有自己的名字、生命值、攻击力和防御力，并且可以进行攻击和防御等操作：

创建一个 `Character` 类，它具有名字、生命值、攻击力、防御力属性 以及 `attack()` 和 `defense()` 攻击防御两个方法  
创建一个 `Monster` 类，它继承自 `Character`，具有一个独特的 `reward` 属性，返回这个怪物被打败后可以获得的奖励。它的 `attack()` 和 `defense()` 方法用于进行攻击和防御操作，根据对手的攻击力和自己的防御力计算生命值，并输出攻击和防御的结果。同时，如果自己的生命值降到一定程度上，就会发动愤怒效果，攻击力翻倍  
创建一个 `Hero` 类，它继承了 `Character`，它的 `attack()` 和 `defense()` 方法用于进行攻击和防御操作，根据对手的攻击力和自己的防御力计算生命值，并输出攻击和防御的结果  
创建一些具体的英雄和怪物对象，例如一位攻击力为 3，防御力为 2，生命值为 30，叫做“剑士”的英雄；以及一个攻击力为 4，防御力为 1，生命值为 20，奖励 100 金币，叫做“骷髅王”的怪物  
最后，编写一个测试程序，创建一些角色对象，模拟一些战斗场景，并演示攻击和防御的效果

首先需要捋清楚输出结果：

英雄向怪物发起了攻击，攻击力 x，怪物进行了防御，防御力 x，怪物没有受到任何伤害  
英雄向怪物发起了攻击，攻击力 x，怪物进行了防御，防御力 x，怪物受到 x 点伤害，当前怪物生命值为 x
英雄向怪物发起了进攻，攻击力 x，怪物进行了防御，防御力 x，怪物受到 x 点伤害，当前怪物生命值为 x，怪物愤怒了，攻击力翻倍
英雄向怪物发起了进攻，攻击力 x，怪物进行了防御，防御力 x，怪物受到 x 点伤害，怪物被消灭了，英雄得到了 100 金币的奖励  

::: tabs

@tab Character

```java
public abstract class Character {

    private String name; // 名字

    private int health; // 生命值

    private int attack; // 攻击力

    private int defense; // 防御力

    public Character(String name, int health, int attack, int defense) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }

    public abstract void attack(Character character);

    public abstract void defense(Character character);

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHealth() {
        return health;
    }

    public void setHealth(int health) {
        this.health = health;
    }

    public int getAttack() {
        return attack;
    }

    public void setAttack(int attack) {
        this.attack = attack;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
    }
}
```

@tab Hero

```java
public class Hero extends Character {

    public Hero(String name, int health, int attack, int defense) {
        super(name, health, attack, defense);
    }

    @Override
    public void attack(Character character) {
        // 英雄发起了攻击
        System.out.print(getName() + "向" + character.getName() + "发起了攻击，攻击力 " + getAttack() + "，" + character.getName() + "进行了防御，防御力 " + character.getDefense() + "，");
        // 怪物进行了防御
        character.defense(this);
    }

    @Override
    public void defense(Character character) {
        // 获取受到了多少伤害
        int damage = character.getAttack() - getDefense();
        if (damage <= 0) {
            System.out.println(getName() + "没有受到任何伤害");
            return;
        }
        // 设置生命值
        setHealth(getHealth() - damage);

        System.out.print(getName() + "受到 " + damage + " 点伤害，");
        if (getHealth() <= 0) {
            System.out.print(getName() + "被消灭了");
        } else {
            System.out.print("当前" + getName() + "生命值为 " + getHealth());
        }
        System.out.println();
    }

}
```

@tab Monster

```java
public class Monster extends Character {

    private int reward;

    private boolean isRage;

    public Monster(String name, int health, int attack, int defense, int reward) {
        super(name, health, attack, defense);
        this.reward = reward;
    }

    @Override
    public void attack(Character character) {
        // 怪物发起了攻击
        System.out.print(getName() + "向" + character.getName() + "发起了攻击，攻击力 " + getAttack() + "，" + character.getName() + "进行了防御，防御力 " + character.getDefense() + "，");
        // 英雄进行了防御
        character.defense(this);
    }

    @Override
    public void defense(Character character) {
        // 获取受到了多少伤害
        int damage = character.getAttack() - getDefense();
        if (damage <= 0) {
            System.out.println(getName() + "没有受到任何伤害");
            return;
        }
        // 设置生命值
        setHealth(getHealth() - damage);

        System.out.print(getName() + "受到 " + damage + " 点伤害，");
        if (getHealth() <= 0) {
            System.out.print(getName() + "被消灭了，" + character.getName() + "得到了 " + getReward() + " 金币的奖励");
        } else {
            System.out.print("当前" + getName() + "生命值为 " + getHealth());
            if (getHealth() <= 5 && !isRage) {
                System.out.print("，" + getName() + "愤怒了，攻击力翻倍");
                setAttack(getAttack() * 2);
                setRage(true);
            }
        }
        System.out.println();
    }

    public int getReward() {
        return reward;
    }

    public void setReward(int reward) {
        this.reward = reward;
    }

    public boolean isRage() {
        return isRage;
    }

    public void setRage(boolean rage) {
        isRage = rage;
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Hero hero = new Hero("剑士", 30, 3, 2);

        Monster monster = new Monster("骷髅王", 20, 4, 1, 100);

        hero.attack(monster);
        hero.attack(monster);
        monster.attack(hero);
        hero.attack(monster);
        hero.attack(monster);
        monster.attack(hero);
        hero.attack(monster);
        hero.attack(monster);
    }
}
```

剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，当前骷髅王生命值为 25  
剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，当前骷髅王生命值为 20  
骷髅王向剑士发起了攻击，攻击力 4，剑士进行了防御，防御力 2，剑士受到 2 点伤害，当前剑士生命值为 18  
剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，当前骷髅王生命值为 15  
剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，当前骷髅王生命值为 10  
骷髅王向剑士发起了攻击，攻击力 4，剑士进行了防御，防御力 2，剑士受到 2 点伤害，当前剑士生命值为 16  
剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，当前骷髅王生命值为 5，骷髅王愤怒了，攻击力翻倍  
剑士向骷髅王发起了攻击，攻击力 6，骷髅王进行了防御，防御力 1，骷髅王受到 5 点伤害，骷髅王被消灭了，剑士得到了 100 金币的奖励

:::