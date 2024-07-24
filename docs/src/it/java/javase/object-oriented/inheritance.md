---
category: IT
article: false
order: 7
---

# 继承

- 继承的作用？

  - 基本作用：代码复用

  - 重要作用：有了继承，才有了方法覆盖和多态机制

- 继承在 Java 中如何实现？

  - `[修饰符列表] class 类名 extends 父类名 {}`

  - `extends` 翻译为扩展，表示子类继承父类后，子类是对父类的扩展

- 继承相关的术语：当 B 类继承 A 类时

  - A 类称为：父类、超类、基类、superclass

  - B 类称为：子类、派生类、subclass

- Java 只支持单继承，一个类只能直接继承一个类

- Java 不支持多继承，但支持多重继承（多层继承）

- 子类继承父类后，除私有的不支持继承、构造方法不支持继承，其它的全部都会继承（公有继承）

- 一个类没有显示继承任何类时，默认继承 `java.lang.yushengju` 类

## extends

先看看下面这个例子有什么设计上的问题：

::: tabs

@tab Person

```java
public class Person {

    String name; // 姓名

    String age; // 年龄

    boolean gender; // 性别

    public void eat() {
        System.out.println(name + "正在吃饭");
    }

    public void run() {
        System.out.println(name + "正在跑步");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

}
```

@tab Teacher

```java
public class Teacher {

    String name; // 姓名

    String age; // 年龄

    boolean gender; // 性别

    double salaries; // 工资

    public void eat() {
        System.out.println(name + "正在吃饭");
    }

    public void run() {
        System.out.println(name + "正在跑步");
    }

    public void teach() {
        System.out.println(name + "正在授课");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public double getSalaries() {
        return salaries;
    }

    public void setSalaries(double salaries) {
        this.salaries = salaries;
    }

}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建 Person 对象
        Person person = new Person();
        person.setName("张三");
        person.eat();
        person.run();

        // 创建 Teacher 对象
        Teacher teacher = new Teacher();
        teacher.setName("李四");
        teacher.eat();
        teacher.run();
        teacher.teach();

    }
}
```

张三正在吃饭  
张三正在跑步  
李四正在吃饭  
李四正在跑步  
李四正在授课

:::

`Teacher` 这个类的设计有优化的地方，像 `name`、`age`、`gender` 这些通用字段已经在 `Person` 类中定义了，就没必要再重复定义多一遍。使用 `extends` 关键字继承 `Person` 类中的属性和方法

```java
public class Teacher extends Person {

    double salaries; // 工资

    public void teach() {
        System.out.println(name + "正在授课");
    }

    public double getSalaries() {
        return salaries;
    }

    public void setSalaries(double salaries) {
        this.salaries = salaries;
    }

}
```

Java 只支持单继承和多重继承（多层继承），不支持多继承

```java
public class Test {

    public static void main(String[] args) {

        C c = new C();
        c.c();
        c.b();
        c.a();
    }
}

class A {

    public void a() {
        System.out.println("A a method invoke");
    }
}

class B extends A {

    public void b() {
        System.out.println("B b method invoke");
    }
}

class C extends B {

    public void c() {
        System.out.println("C c method invoke");
    }
}

// 语法错误，Java 不支持多继承
//class C extends B, A {}
```

为什么 Java 不支持多继承？假设 `C` 类同时继承了 `B` 类和 `A` 类，如果 `B` 类和 `A` 类中都定义了同名的方法 `display()`，那么 `C` 的实例对象调用 `display()` 是不知道调用的是 `B` 类还是 `A` 类的 `display()` 方法

一个类没有显示继承任何类时，默认继承 `java.lang.yushengju` 类

```java
public class Test {
    
    public static void main(String[] args) {

        A a = new A();
        /**
         为什么可以调用下面的这些方法，明明 A 类中什么方法都没有定义
         因为当一个类没有显示继承任何类时，默认继承 Object 类，因此这些方法都是在 Object 类中定义的
         */
        a.hashCode();
        a.toString();
        a.getClass();
        a.notify();
        a.notifyAll();
    }
}

class A {

}
```

## 方法覆盖

方法覆盖（override）又可以称为方法重写（overwrite）

请不要与 [方法重载](../basic-grammar/method.md#方法重载) 搞混淆

什么时候考虑使用方法覆盖？当从父类继承过来的方法，无法满足子类的业务需求时

当满足什么条件的时候构成方法覆盖？

1. 方法覆盖发生在具有继承关系的父子类之间

2. 具有相同的方法名（必须严格一样）

3. 具有相同的形参列表（类型、顺序、个数必须严格一样）

4. 具有相同的返回值类型（可以是子类型）

关于方法覆盖的小细节

1. 当子类将父类方法覆盖后，将来子类对象调用方法的时候，一定会执行覆盖之后的方法

2. 在 Java 中，有一个 `@Override` 注解，这个注解可以在编译阶段检查方法是否覆盖了父类的方法（`@Override` 注解是 JDK5 引入的，用来标注方法，被标注的方法必须是覆盖父类的方法，如果不是覆盖的方法，编译器就会报错。该注解只在编译阶段有用，和运行期无关）

3. 如果覆盖的方法当中的返回值类型是引用数据类型，那么这个返回值类型可以是原类型的子类型（例如父类的一个 `display()` 方法返回值类型是 `Object`，那么子类覆盖的 `display()` 方法返回值类型只要是 `Object` 的子类即可）

4. 访问权限不能变低，可以变高（public protected 默认 private）

5. 抛出的异常不能变多，可以变少

6. 私有方法和构造方法因为不能继承，因此私有方法和构造方法不存在方法覆盖

7. 方法覆盖针对的是实例方法，和静态方法无关

8. 方法覆盖针对的是实例方法，和实例变量无关

::: tabs

@tab Animal

```java
public class Animal {

    /**
     * 动物吃的行为
     */
    public void eat() {
        System.out.println("正在吃东西");
    }

    /**
     * 动物移动的行为
     */
    public void move() {
        System.out.println("正在移动");
    }
}
```

@tab Bird

```java
public class Bird extends Animal {

}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建鸟儿对象
        Bird bird = new Bird();

        // 调用方法
        bird.eat();
        bird.move();
    }
}
```

正在吃东西  
正在移动

:::

`Bird` 类继承了 `Animal` 类，调用了从 `Animal` 类继承过来的 `eat()` 方法和 `move()` 方法。对于 `move()` 方法，对于鸟儿来说更合适的是输出“鸟儿在飞翔”这句话，而不是“正在移动” 

子类对继承过来的方法不满意的话，有权利将方法进行覆盖/重写

```java
public class Bird extends Animal {

    @Override
    public void move() {
        System.out.println("鸟儿在飞翔");
    }
}
```

如果覆盖的方法当中的返回值类型是引用数据类型，那么这个返回值类型可以是原类型的子类型

::: tabs

@tab Animal

```java
public class Animal {

    public Object getObject() {
        return null;
    }
}
```

@tab Bird

```java
public class Bird extends Animal {

    @Override
    public String getObject() {
        return "";
    }
}
```

:::

访问权限不能变低，可以变高

::: tabs

@tab Animal

```java
public class Animal {

    protected Object getObject() {
        return null;
    }
}
```

@tab Bird

```java
public class Bird extends Animal {

    @Override
    public Object getObject() {
        return null;
    }
}
```

:::

抛出的异常不能变多，可以变少

::: tabs

@tab Animal

```java
public class Animal {

    public Object getObject() throws Exception{
        return null;
    }
}
```

@tab Bird

```java
public class Bird extends Animal {

    @Override
    public Object getObject() {
        return null;
    }
}
```

:::

方法覆盖针对的是实例方法，和静态方法无关，静态代码不存在方法覆盖（方法的覆盖和多态机制联合起来才有意义）

::: tabs

@tab Animal

```java
public class Animal {

    public static void test() {
        System.out.println("Animal test method invoke");
    }
}
```

@tab Cat

```java
public class Cat extends Animal {

    // @Override // Static methods cannot be annotated with `@Override`
    public static void test() {
        System.out.println("Cat test method invoke");
    }

}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Animal.test();
        Cat.test(); // 这里给人一种感觉像是方法覆盖（重写），但其实并不是，因为方法覆盖和多态机制联合起来才有意义

        Animal animal = new Cat();
        /**
         虽然可以使用“引用.”来调用，但实际运行时和对象无关，所以不建议这样写，因为这样写会给其他人造成疑惑。这里只是为了展示静态方法和多态没有关系
         这里调用的是 Animal 类的 test 方法，不会去调用 Cat 类的 test 方法
         多态：父类型引用指向子类型对象
         静态方法本身和多态没有关系，因为多态机制需要对象的参与
         静态方法既然和多态没有关系，那么静态方法也就和方法覆盖没有关系了
         */
        animal.test(); 
        
    }
}
```

:::

方法覆盖针对的是实例方法，和实例变量没有关系

变量在编译的时候绑定是哪个类，那么运行的结果就是对应类中定义的值

```java
public class Test {

    public static void main(String[] args) {

        A a = new B();
        /**
         实例变量不存在覆盖这一说法
         a.name 编译阶段绑定的是 A 类的 name 属性，运行的时候也会输出 A 类的 name 属性
         */
        System.out.println(a.name); // 张三
    }
}

class A {
    String name = "张三";
}

class B extends A {
    String name = "李四";
}
```