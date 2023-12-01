---
category: IT
tag: Java
article: false
---

# 泛型

## 什么是泛型

要搞清楚泛型，我们必须先得了解在没有泛型之前我们是如何解决问题的。比如我们现在需要创建一个 `Printer` 类，用来打印 `Integer` 类型的变量：

```java
public class IntegerPrinter {
    Integer content;

    IntegerPrinter(Integer content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

接着我们在 `main` 函数中调用一下：

```java
public class Main {
    public static void main(String[] args) {
        IntegerPrinter printer = new IntegerPrinter(123);
        printer.print();
    }
}
```

此时如果我们想要打印 `String` 类型的变量呢？显而易见我们不能再使用 `IntegerPrinter` 这个类了，需要重新创建一个打印字符串的 `Printer` 类：

```java
public class StringPrinter {
    String content;

    StringPrinter(String content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

接着我们在 `main` 函数中调用一下：

```java
public class Main {
    public static void main(String[] args) {
        StringPrinter printer = new StringPrinter("hello world");
        printer.print();
    }
}
```

这里我们会发现一个问题：如果我们想再新打印其他类型的变量，必须要新建对应类型的类，这样的话会给代码带来很多的重复性，这是我们必须要避免的

也正因为如此，所以我们引入了 Generics（泛型）这样的一个概念，以至于我们可以只要创建一个类，就可以处理所有的类型

## 声明泛型

如何来声明一个 Generics（泛型） 的类呢？我们只需要在类的 Curly Braces（主体大括号）和类名之间用一个 Angel Brackets（尖括号）包裹类型变量名即可

```java
public class Printer<T> {
    T content;

    Printer(T content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

我们用 `T` 这个类型参数来声明泛型类，代表着这个类可以传入任何类型的参数。它来源于英文单词 "Type" 的首字母。选择 `T` 主要是因为它简短而且容易理解，同时不与其他已有的标识符冲突

在泛型编程中，通常使用单个字母来表示泛型类型参数，以表示它是一个占位符，可以在使用时替换为实际的类型。除了 `T` 之外，其他一些常见的泛型类型参数包括：

- `E`: 表示元素 (常用于集合类，比如 `List<E>` 表示元素的列表)

- `K`: 表示键 (通常用于映射，比如 `Map<K, V>` 表示键值对的映射)

- `V`: 表示值

- `S`, `U`, `V` 等：通常用于第二、第三、第四个泛型类型参数，以此类推

至于 `T` 具体是什么类型，其实是由外面调用的时候来决定的，相当于把类型参数本身当成是一个特殊的参数

我们在 `main` 函数中调用一下新写的 `Printer`：

```java
public class Main {
    public static void main(String[] args) {
        Printer<Integer> printer = new Printer<>(123);
        printer.print();
    }
}
```

如果我们想打印一个 `String` 类型的变量时，此时我们不需要再去写一个 `StringPrinter` 类，只需要重新定义一个新的类型即可：

```java
public class Main {
    public static void main(String[] args) {
        Printer<String> printer = new Printer<>("hello world");
        printer.print();
    }
}
```

::: warning 警告
需要注意一下：尖括号里面的类型参数不能为 Java 的 primitive type（基本数据类型）例如 `int`，`float`，`string`，我们必须使用经过包装后的类型，比如 `int` 对应的是 `Integer`，`float` 对应的是 `Float`，`string` 对应的是 `String` 等等
:::

如果我们要传递多个参数，可以添加多个占位符，例如：

```java
public class Printer<T, K> {
    T content;
    
    K content2;

    Printer(T content, K content2) {
        this.content = content;
        this.content2 = content2;
    }

    public void print() {
        System.out.println(content);
        System.out.println(content2);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Printer<String, Integer> printer = new Printer<>("hello world", 123);
        printer.print();
    }
}
```

## 类型约束

::: tabs

@tab Vehicle

```java
public class Vehicle {
    String brand;

    String color;

    public String getBrand() {
        return brand;
    }

    public String getColor() {
        return color;
    }
}
```

@tab Car

```java
public class Car extends Vehicle implements Thing {
    Integer price;

    String name;

    public Car() {

    }

    public Car(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }
}
```

@tab Bus

```java
public class Bus extends Vehicle {
    Integer passenger;

    public Bus() {

    }

    public Bus(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }
}
```

@tab Thing

```java
public interface Thing {

}
```

:::

我们实际在做项目的时候，可能这个类型参数不需要满足所有的类型，因此我们可以对 `T` 类型参数做一些约束，这在 Java 中我们称作为 bounded generics（有界限的泛型）。例如传入的参数类型必须是某一个类型的子类型我们可以使用 `extends`

这样做有一个好处：因为显式声明传入的参数是 `Vehicle` 的子类，所以意味着可以调用继承 `Vehicle` 的方法

```java
public class Printer<T extends Vehicle> {
    T content;

    Printer(T content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
        System.out.println(content.getBrand());
    }
}
```

现在我们传入的参数类型必须也是 `Vehicle` 或者 `Vehicle` 的子类，例如 `Car` 或者 `Bus`

```java
public class Main {
    public static void main(String[] args) {
        Printer<Car> printer = new Printer<>(new Car());
        printer.print();
    }
}
```

我们也可以用接口的方式来约束：

```java
public class Printer<T extends Vehicle & Thing> {
    T content;

    Printer(T content) {
        this.content = content;
    }

    public void print() {
        System.out.println(content);
    }
}
```

此时 `T` 参数类型必须是 `Vehicle` 或 `Vehicle` 的子类且实现了 `Thing` 接口，因此在 `Printer` 传递的参数中就只能使用 `Car` 了，因为只有 `Car` 同时继承了 `Vehicle` 类且实现了 `Thing` 接口

需要注意的是：当同时使用类和接口做约束时，类必须要放在接口前面，因为 Java 解释器会认为 `T` 类型必须是一个类，而不是一个接口。正确的语法规定是将类名放在 `extends` 之后，接口名紧随其后

```java
public class Printer<T extends Thing & Vehicle> { // 报错

}
```

## 类型安全问题

我们看下面这个例子：

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(123);
        list.add(456);
        System.out.println(list);
    }
}
```

如果我们想要把 `List` 里面的元素类型从 `Integer` 换成 `String`：

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        System.out.println(list);
    }
}
```

我们能不能在一个列表里面放任何类型的元素呢？假设我们定义为 `Object`：

```java
public class Main {
    public static void main(String[] args) {
        List<Object> list = new ArrayList<>();
        list.add(123);
        list.add("hello");
        System.out.println(list);
    }
}
```

此时编译器并没有报错，但是我们非常不建议在 Java 里这样做，因为这会带来一个 type-safe（类型安全）的问题。当我们尝试把 `String` 类型的元素给取出来：

```java
public class Main {
    public static void main(String[] args) {
        List<Object> list = new ArrayList<>();
        list.add(123);
        list.add("hello");
        // String item = list.get(0); // 此时编译器报错提示提供的是一个Object类型，并不是一个String类型，因此返回值不能为String
        // 因此我们需要进行一个类型强制转换
        String item = (String) list.get(0);
        String item2 = (String) list.get(1); // 当我们想取第二个Integer类型的元素的时候，这样写虽然编译器并不会报错，但在程序运行时会报一个ClassCastException的错误
        
        System.out.println(list);
    }
}
```

泛型的工作方式是在编译阶段进行类型检查的，而不是运行时。上述的案例出现的运行时类型安全问题就可以使用泛型进行优化处理，泛型也经常用在函数上，我们称之为 generic method，假设我们现在有一个需求，需要写一个 `print` 方法去打印任意的变量：

```java
public class Main {

    private static void print(T content) { // 报错
        System.out.println(content);
    }
}
```

上述代码编译器会提示报错，因为 `T` 其实只是一个占位符而已，它在 Java 本身并不是一种明确的类型，因此我们需要告诉 Java 我们使用的是一个泛型，我们只需要在返回值类型之前加一个泛型 `<T>` 标识

```java
public class Main {

    public static void main(String[] args) {
        print("hello world");
        print(123);
        print(456L);
        print(new Car());
    }
    
    private static <T> void print(T content) {
        System.out.println(content);
    }
}
```

我们也可以像之前一样对方法的参数做一些约束：

```java
public class Main {

    public static void main(String[] args) {
        print("hello world"); // no instance(s) of type variable(s) exist so that String conforms to Vehicle
        print(123); // no instance(s) of type variable(s) exist so that String conforms to Vehicle
        print(456L); // no instance(s) of type variable(s) exist so that String conforms to Vehicle
        print(new Car());
    }
    
    private static <T extends Vehicle & Thing> void print(T content) {
        System.out.println(content);
    }
}
```

也可以传递多个参数：

```java
public class Main {
    public static void main(String[] args) {
        print("hello world", 123);
    }

    private static <T, K> void print(T content, K content2) {
        System.out.println(content);
        System.out.println(content2);
    }
}
```

## 通配符

假设我们现在要写一个方法，它能够打印存放 `Integer` 元素的列表：

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(123);
        list.add(456);
        print(list);
    }

    private static <T> void print(List<Integer> content) {
        System.out.println(content);
    }
}
```

当我们想打印一个 `String` 元素的列表：

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        print(list);
    }

    private static <T> void print(List<String> content) {
        System.out.println(content);
    }
}
```

这时我们会想到把参数类型统一改成 `List<Object>` 不就好了，因为 `String` 肯定是 `Object` 的子类：

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        print(list); // reason: List<String> is not compatible with List<Object>
    }

    private static <T> void print(List<Object> content) {
        System.out.println(content);
    }
}
```

其实不然，编译器会报错，虽然 `String` 是 `Object` 的子类，但 `List<String>` 不是 `List<Object>` 的子类，他们俩属于 `Collection` 的子类

当遇到这种情况的时候，我们可以引入泛型中 Wildcard（通配符） 的概念，用 Question Mark（`?`） 来表示

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        print(list);
    }

    private static <T> void print(List<?> content) {
        System.out.println(content);
    }
}
```

假设我们不想匹配所有类型，想对类型做一些约束：

```java
public class Main {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("hello");
        list.add("world");
        print(list); // reason: List<String> is not compatible with List<? extends Vehicle>
    }

    private static <T> void print(List<? extends Vehicle> content) {
        System.out.println(content);
    }
}
```

`List<? extends Vehicle>` 表示传递类型必须限定为 `Vehicle` 或 `Vehicle` 的子类，在通配符里面的一种名称就叫做 upper bounded wildcard（上界限通配符）

还有一种概念叫 lower bounded wildcard（下界限通配符），我们用 `super` 关键字来定义，表达的意思是传递类型必须为 `Car` 自己本身或者是它的父类：

```java
public class Main {
    public static void main(String[] args) {
        List<Car> list = new ArrayList<>();
        list.add(new Car());
        print(list);
    }

    private static <T> void print(List<? super Car> content) {
        System.out.println(content);
    }
}
```

## 底层实现

Java 泛型底层实现是类型擦除，这意味着在编译时泛型类型信息会被擦除，而在运行时，程序只知道操作原始类型。这是为了保持与之前版本的 Java 的兼容性，因为泛型是在 Java 5 中引入的

```java
public class Box<T> {
    private T value;

    public void setValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}
```

上述例子在编译时，编译器会将泛型类型 `T` 擦除，生成一个与原始类型相对应的类。例如，在运行时，`Box<Integer>` 和 `Box<String>` 都将被擦除为 `Box`

相比之下 C++ 的泛型是基于模板实现的，模板是一种生成代码的机制，允许你编写一种通用的模板，然后在编译时为特定的类型生成具体的代码

```cpp
#include <iostream>

template <typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    std::cout << add(5, 3) << std::endl;      // 8 (int 类型)
    std::cout << add(3.14, 2.5) << std::endl;  // 5.64 (double 类型)

    return 0;
}
```

在这个例子中，`add` 函数是一个模板函数，可以处理不同类型的参数。在调用时，编译器会根据实际传递的参数类型生成对应的函数代码，实现了类型安全