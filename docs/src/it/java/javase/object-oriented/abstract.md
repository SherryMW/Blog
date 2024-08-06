---
category: IT
article: false
order: 12
---

# 抽象类

- 什么时候考虑将类定义为抽象类？如果类中有些方法无法实现或者没有意义，可以将方法定义为抽象方法，类定义为抽象类。这样在抽象类中只提供公共代码，具体地实现强行交给子类去做。比如一个 `Person` 类中有一个问候方法 `greet()`，但是不同国家的人问候的方式不同，因此 `greet()` 方法具体实现应该交给子类

- 抽象类如何定义？`abstract class 类名 {}`

- 抽象方法如何定义？`abstract 方法返回值类型 方法名(形参);`

- 抽象类有构造方法，但无法实例化

- 抽象类中不一定有抽象方法，但如果有抽象方法的类必须定义为抽象类 

- 一个非抽象的类继承抽象类，必须将抽象方法进行实现/重写

- `abstract` 关键字不能和 `private`、`final`、`static` 关键字共存

---

创建一个名为 `Person` 的类，在其定义 `greet()` 方法用于问候对方。在此基础上，创建一个名为 `EnglishPerson` 的子类和一个名为 `ChinesePerson` 的子类，分别使用英文和中文的问候方式对方来重写 `greet()` 方法。最后在 `main` 方法中创建 `EnglishPerson` 对象和 `ChinesePerson` 对象，使用 `greet()` 方法进行问候

```java
public class Person {

    public void greet() {

    }
}
```

对于 `Person` 类中的这个 `greet()` 方法，其实我们不知道里面具体实现要写什么，也没办法去写。因为在真正问候的时候，如果是中国人，说的是中文；如果是美国人，说的就是英语，如此类推

```java
public class Person { // 父类（所有公共属性 + 公共方法的集合）

    private String name;

    private int age;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    /**
     * 显示人类的信息
     * 不管是中国人还是美国人，父类实现的这个方法都能通用
     */
    public void display() {
        System.out.println("姓名:" + name + "，年龄:" + age);
    }

    /**
     * 问候的方法，不同国家的人问候的方式肯定是不同的
     * 因此具体怎么问候，Person 类中是不确定，无法实现的
     * 针对这种方法既然不确定具体的实现是什么，那么就不应该给实现
     * 在 Java 中，只要一个方法带着大括号，不管大括号里有什么，表示的是一种实现
     *
     * 因此像这种无法确定实现的方法，建议定义为抽象方法
     */
    public void greet() {

    }

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

因此对于 `Person` 类中的 `greet()` 方法，你在里面写代码就是一种错误（不应该有方法体，因为方法体代表的是一种具体地实现）。具体的问候应该交给子类去实现，因此就不需要在 `greet()` 方法中写方法体的大括号，然后在返回值类型前加上 `abstract` 关键字，此时该方法就变成了一个抽象方法。当一个类中定义了抽象方法，那么这个类理应也是一个抽象类，在定义类的时候也需要写上 `abstract` 关键字来表示该类是一个抽象类

抽象方法怎么定义：修饰符列表中添加 `abstract` 关键字，不能有方法体，最后以分号“;”结束。`public` 和 `abstract` 关键字的顺序没有要求

如果一个类中出现了抽象方法，那么这个类也要定义成抽象类

```java
public abstract class Person {

    public abstract void greet();
}
```

抽象类中有个强制的语法要求：如果子类继承了抽象类，那么子类必须重写抽象类中的抽象方法，不然编译器会报错

既然抽象方法无法在父类中实现，那么继承该父类的子类就得必须强制实现父类的抽象方法

::: tabs

@tab Person

```java
public abstract class Person {

    private String name;

    private int age;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    /**
     * 显示人类的信息
     * 不管是中国人还是美国人，父类实现的这个方法都能通用
     */
    public void display() {
        System.out.println("姓名:" + name + "，年龄:" + age);
    }

    public abstract void greet();

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

@tab ChinesePerson

```java
public class ChinesePerson extends Person {

    public ChinesePerson() {
    }

    public ChinesePerson(String name, int age) {
        super(name, age);
    }

    @Override
    public void greet() {
        System.out.println("你好，我的名字叫" + getName());
    }
}
```

@tab EnglishPerson

```java
public class EnglishPerson extends Person {

    public EnglishPerson() {
    }

    public EnglishPerson(String name, int age) {
        super(name, age);
    }

    @Override
    public void greet() {
        System.out.println("Hello, My name is " + getName());
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Person englishPerson = new EnglishPerson("Jack", 20);
        englishPerson.greet(); // Hello, My name is Jack

        Person chinesePerson = new ChinesePerson("张三", 20);
        chinesePerson.greet(); // 你好，我的名字叫张三
    }
}
```

:::

---

抽象类虽然有构造方法，但无法实例化

抽象类中构造方法的作用：给子类用的，因为子类在实例化的时候，子类的构造方法会通过 `super()` 调用父类的构造方法

```java
public class Test {

    public static void main(String[] args) {
        
        new Person(); // 'Person' is abstract; cannot be instantiated

        Person englishPerson = new EnglishPerson("Jack", 20);
        englishPerson.greet(); // Hello, My name is Jack

        Person chinesePerson = new ChinesePerson("张三", 20);
        chinesePerson.greet(); // 你好，我的名字叫张三
    }
}
```

---

`abstract` 关键字不能和 `private`、`final`、`static` 关键字共存

`abstract` 关键字为什么不能和 `private` 共存？子类继承抽象类，一定要覆盖抽象类中的抽象方法，然而父类私有的方法子类无法继承，也就不能被覆盖

`abstract` 关键字为什么不能和 `final` 共存？`final` 修饰的方法不能被覆盖（重写）

`abstract` 关键字为什么不能和 `static` 共存？`static` 修饰的方法不能被覆盖（重写）

---

定义一个抽象类 `Shape`，包含属性 `name`、`color` 抽象方法 `area()`，非抽象方法 `display()`。思考为什么 `area()` 方法定义为抽象方法？因为图形可以有圆形正方形等等，每个形状的面积计算方式都不一样，因此无法直接在 `Shape` 类中实现面积的计算

定义一个 `Circle` 类，继承 `Shape` 类，包含一个双精度类型实例变量 `radius`，以及一个构造方法，该构造方法使用 `super` 关键字调用父类 `Shape` 类的构造方法来初始化。`Circle` 类还实现了抽象方法 `area()`，用于计算圆形的面积。定义一个常量类，常量类中定义一个用来专门存储圆周率的常量

定义一个 `Rectangle` 类，继承 `Shape` 类。包含两个双精度类型实例变量 `width` 和 `height`，以及一个构造方法，该构造方法使用 `super` 关键字调用父类 `Shape` 的构造方法来初始化。`Rectangle` 类还实现了抽象方法 `area()`，用于计算矩形的面积

在测试程序的 `main()` 方法中，创建一个 `Circle` 对象、一个 `Rectangle` 对象，并分别调用它们的 `display()` 方法，输出结果

::: tabs

@tab Shape

```java
public abstract class Shape {

    private String name;

    private String color;

    public Shape() {
    }

    public Shape(String name, String color) {
        this.name = name;
        this.color = color;
    }

    /**
     * 计算图形面积
     */
    public abstract double area();

    /**
     * 打印图形信息
     */
    public void display() {
        System.out.println("图形名称：" + getName() + "，图形颜色：" + getColor() + "，图形面积：" + area());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
```

@tab Circle

```java
public class Circle extends Shape {

    private double radius; // 半径

    public Circle(String name, String color, double radius) {
        super(name, color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Constant.PI * radius * radius;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }
}
```

@tab Constant

```java
public class Constant {

    public static final double PI = 3.1415926; // 圆周率
    
}
```

@tab Rectangle

```java
public class Rectangle extends Shape {

    private double width;

    private double height;

    public Rectangle(String name, String color, double width, double height) {
        super(name, color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Shape circle = new Circle("圆形", "白色", 5);
        circle.display();

        Shape rectangle = new Rectangle("矩形", "黑色", 2, 4);
        rectangle.display();
    }
}
```

图形名称：圆形，图形颜色：白色，图形面积：78.539815

图形名称：矩形，图形颜色：黑色，图形面积：8.0

:::