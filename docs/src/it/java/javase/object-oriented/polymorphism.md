---
category: IT
article: false
order: 8
---

# 多态

关于基本数据类型之间的类型转换

小容量转换成大容量，叫做自动类型转换

```text
int i = 100;
long x = i;
```

大容量转换成小容量，不能自动转换，必须添加强制类型转换符才行，叫做强制类型转换

```text
long x = 100;
int i = (int) x;
```

除了基本数据类型之间的类型转换之外，对于引用数据类型来说，也可以进行类型转换。只不过在做转换的时候不叫自动转换和强制类型转换，我们一般称为“向上转型”和“向下转型”

不管是向上转型还是向下转型，想让编译器通过的前提是两者必须有继承关系才可以。如果两者连继承关系都没有，那么编译器就会报错

## 向上转型

向上转型（upcasting）：子类 ---> 父类

子类型的对象可以赋值给一个父类型的引用（父类型引用指向子类型对象）

::: tabs

@tab Animal

```java
public class Animal {

    public void eat() {
        System.out.println("正在吃东西");
    }

    public void move() {
        System.out.println("正在移动");
    }
}
```

@tab Cat

```java
public class Cat extends Animal {

    @Override
    public void move() {
        System.out.println("猫在走猫步");
    }
    
}
```

@tab Bird

```java
public class Bird extends Animal {

    @Override
    public void move() {
        System.out.println("鸟儿在飞翔");
    }
    
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建对象（不使用多态）
        Animal animal = new Animal();
        animal.eat();
        animal.move();

        Cat cat = new Cat();
        cat.eat();
        cat.move();

        Bird bird = new Bird();
        bird.eat();
        bird.move();
    }
}
```

正在吃东西  
正在移动  
正在吃东西  
猫在走猫步  
正在吃东西  
鸟儿在飞翔

:::

使用向上转型

```java
public class Test {

    public static void main(String[] args) {

        // 向上转型
        Animal animal = new Cat();
        animal.move(); // 猫在走猫步
    }
}
```

对于 Java 而言，程序永远有两个重要的阶段，第一阶段是编译阶段，如果编译都通不过的话就别说运行了，因为运行的前提是编译通过。第二阶段是运行阶段

在编译的时候，编译器只知道 `animal` 的类型是 `Animal` 类型。因此在编译阶段就会去 `Animal` 类中找有没有 `move()` 方法，如果有 `move()` 方法，那么就发生静态绑定，编译通过。在编译的时候 `animal.move()` 方法绑定的是 `Animal` 类中的 `move()` 方法

在运行的时候，才会在 JVM 堆内存中开辟空间来创建对象，此时我们得分清楚，到底是谁在 `move()`。在运行的时候，堆内存中真实的 Java 对象是 `Cat` 类型。想让 `move()` 这个行为发生，必须有对象的存在，具体是对象是谁呢，那肯定是堆里面的 `Cat` 对象。所以 `move()` 的行为一定是 `Cat` 对象发生的，因此运行的时候会自动调用 `Cat` 对象的 `move()` 方法。这种绑定称为运行期绑定/动态绑定

因为编译阶段是一种状态，运行的时候是另外一种状态，因此得名【多态】

父类型引用指向子类型对象，这个就是多态机制最核心的语法

---

```java
public class Cat extends Animal {

    @Override
    public void move() {
        System.out.println("猫在走猫步");
    }

    /**
     这个方法/行为是子类特有的，父类没有
     */
    public void catchMouse() {
        System.out.println("猫在抓老鼠");
    }
    
}
```

```java
public class Test {

    public static void main(String[] args) {

        // 向上转型
        Animal animal = new Cat();
        animal.move(); // 猫在走猫步

        animal.catchMouse();
        
    }
}
```

`animal.catchMouse();` 在编译阶段就已经报错了，因为编译器只知道 `animal` 是 `Animal` 类型，所以去 `Animal` 类中去找 `catchMouse()` 方法了。结果没有找到，无法完成静态绑定，编译报错

假如现在就是要让 `animal` 去调用 `catchMouse()` 方法，怎么办？此时就需要用到向下转型

什么时候我们会考虑使用向下转型？当调用的方法是子类特有的方法

## 向下转型

向下转型（downcasting）：父类 ---> 子类

父类型的引用可以转换为子类型的引用，但需要加强制类型转换符

```java
public class Test {

    public static void main(String[] args) {

        // 向上转型
        Animal animal = new Cat();
        animal.move(); // 猫在走猫步

        // 向下转型
        Cat cat = (Cat) animal;
        cat.catchMouse();

        /**
         大前提：不管是向上转型还是向下转型，两种类型之间必须要有继承关系，没有继承关系，编译器就会报错
         */
        Bird bird = new Bird();
//        Cat cat2 = (Cat) bird;
        
    }
}
```

---

思考：`Bird bird = (Bird) animal;` 存在的问题

```java
public class Test {

    public static void main(String[] args) {

        // 向上转型
        Animal animal = new Cat();
        // 向下转型
        Bird bird = (Bird) animal;
    }
}
```

为什么在编译阶段可以通过？因为 `animal` 是 `Animal` 类型，`Animal` 和 `Bird` 之间存在继承关系，语法上来说没有问题，所以就可以编译通过

为什么在运行阶段会出现 ClassCastException（类型转换异常）？因为运行的时候堆中真实存在的对象是 `Cat` 类型对象，`Cat` 无法转换成 `Bird`，所以出现类型转换异常

应该如何避免这类异常？使用 `instanceof` 运算符可以解决 ClassCastException 异常

### instanceof

`instanceof` 运算符的语法规则：

- `instanceof` 运算符的结果一定是 `true` / `false`

- 语法格式：(引用 instanceof 类型) 例如：(a instanceof Cat)

  - 结果为 true 表示 `a` 引用指向的对象是 `Cat` 类型

  - 结果为 false 表示 `a` 引用指向的对象不是 `Cat` 类型

做向下转型之前，为了避免发生 ClassCastException 异常的发生，建议使用 `instanceof` 运算符进行判断

```java
public class Test {

    public static void main(String[] args) {

        // 向上转型
        Animal animal = new Cat();
        // 向下转型
        if (animal instanceof Bird) { // 在程序运行期动态判断：如果 animal 引用指向的堆内存对象确实是 Bird 的话，那么就可以做向下类型转换
            Bird bird = (Bird) animal;
        }
        
    }
}
```

---

需求：程序运行阶段动态确定对象，如果对象是 `Cat`，请抓老鼠，如果对象是 `Bird` 请唱歌

::: tabs

@tab Animal

```java
public class Animal {

    public void eat() {
        System.out.println("正在吃东西");
    }

    public void move() {
        System.out.println("正在移动");
    }
}
```

@tab Cat

```java
public class Cat extends Animal {

    @Override
    public void move() {
        System.out.println("猫在走猫步");
    }

    public void catchMouse() {
        System.out.println("猫在抓老鼠");
    }
    
}
```

@tab Bird

```java
public class Bird extends Animal {

    @Override
    public void move() {
        System.out.println("鸟儿在飞翔");
    }

    public void sing() {
        System.out.println("鸟在唱歌");
    }
    
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Animal animal = new Cat();
        if (animal instanceof Cat) {
            Cat cat = (Cat) animal;
            cat.catchMouse();
        } else if (animal instanceof Bird) {
            Bird bird = (Bird) animal;
            bird.sing();
        }
    }
}
```

:::

## 软件开发七大原则

软件开发原则旨在引导软件行业的从业者在代码设计和开发过程中，遵循一些基本原则，以达到高质量、易维护、易扩展、安全性强等目标。软件开发原则与具体的编程语言无关，属于软件设计方面的知识

1. 开闭原则（Open-Closed Principle，OCP）：一个软件实体应该对扩展开放，对修改关闭。即在不修改原有代码的基础上，通过添加新的代码来扩展功能（最基本的原则，其他原则都是为了这个原则服务的）

2. 单一职责原则：一个类只负责单一的职责，也就是一个类只有一个引起它变化的原因

3. 里氏替换原则：子类对象可以替换其父类对象出现的任何地方，并且保证原有程序的正确性

4. 接口隔离原则：客户端不应该依赖它不需要的接口

5. 依赖倒置原则：高层模块不应该依赖底层模块，它们都应该依赖于抽象接口。换言之，面向接口编程

6. 迪米特原则：一个对象应该对其他对象保持最少地了解。即一个类应该对自己需要耦合或调用的类知道得最少

7. 合成复用原则：尽量使用对象组合和聚合，而不是继承来达到复用的目的。组合和聚合可以在获取外部对象的方法中被调用，是一种运行时关联，而继承则是一种编译时关联

### 多态在开发中的作用

1. 降低程序的耦合度，提高程序的扩展力（高内聚，低耦合）

2. 尽量使用多态，面向抽象编程，不要面向具体编程

分析以下程序在设计上有哪些可以优化改进的地方：

以下是一个主人喂猫的程序：

::: tabs

@tab Cat

```java
public class Cat {

    public void eat() {
        System.out.println("猫吃鱼");
    }
}
```

@tab Master

```java
public class Master {

    public void feed(Cat cat) {
        cat.eat();
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建宠物对象
        Cat cat = new Cat();
        // 创建主人对象
        Master master = new Master();
        // 主人喂猫
        master.feed(cat);
    }
}
```

猫吃鱼

@tab

:::

这个案例没有使用多态机制，不符合 OCP（开闭原则）。假如主人不想喂猫了，想喂狗了，此时程序就需要做功能扩展，目前 `Master` 类定义的 `feed()` 方法只能喂猫。OCP 倡导的是：进行功能扩展的时候，最好不要修改原有的代码（对修改关闭，对扩展开放）

```java
public class Dog {

    public void eat() {
        System.out.println("狗啃骨头");
    }
}
```

因此不能把 `feed()` 方法中的参数 `Cat` 类直接修改成 `Dog` 类（耦合度高）

```java
public class Master {

    public void feed(Dog dog) {
        dog.eat();
    }
}
```

也不能直接新增一个喂狗的方法（耦合度高）

```java
public class Master {

    public void feed(Cat cat) {
        cat.eat();
    }

    public void feed(Dog dog) {
        dog.eat();
    }
}
```

使用多态机制：

::: tabs

@tab Pet

```java
public class Pet {

    public void eat() {
    }
}
```

@tab Cat

```java
public class Cat extends Pet {

    @Override
    public void eat() {
        System.out.println("猫吃鱼");
    }
}
```

@tab Dog

```java
public class Dog extends Pet {

    @Override
    public void eat() {
        System.out.println("狗啃骨头");
    }
}
```

@tab Master

```java
public class Master {

    public void feed(Pet pet) { // 解耦合
        pet.eat();
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建宠物对象
        Pet pet = new Cat();
        Pet pet2 = new Dog();
        // 创建主人对象
        Master master = new Master();
        // 主人喂猫
        master.feed(pet); // 子类型的对象可以赋值给一个父类型的引用（父类型引用指向子类型对象）
        // 主人喂狗
        master.feed(pet2); // 子类型的对象可以赋值给一个父类型的引用（父类型引用指向子类型对象）
    }
}
```

:::

程序在编译的时候知道 `feed(Pet pet)` 的参数类型是 `Pet`，运行的时候知道 `pet.eat()` 具体调用的 `eat()` 方法究竟是 `Cat` 还是 `Dog` 类中重写的 `eat()` 方法

这个案例使用多态机制后，如果后续主人想喂养其他动物，例如兔子、蛇、鳄鱼，都不需要去修改 `feed(Pet pet)` 方法，只需要创建对应的动物类

```java
public class Snake extends Pet{

    @Override
    public void eat() {
        System.out.println("蛇吞象");
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        // 创建宠物对象
        Snake snake = new Snake();
        // 创建主人对象
        Master master = new Master();
        // 主人喂蛇
        master.feed(snake);
    }
}
```

尽量面向抽象编程，不要面向具体编程

面向抽象编程的好处？降低耦合度，提高扩展性