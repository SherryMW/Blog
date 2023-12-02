---
category: IT
tag: Java
article: false
---

# Lambda 表达式

## 为什么要引入 Lambda 表达式

Lambda 表达式是 Java 函数式编程的核心概念之一，它的出现是用来简化实现函数式接口（Functional Interface），听起来似乎有点抽象，什么又是函数式接口呢？

因此在具体讲到什么是 Lambda 表达式之前，我们先来回顾一下 Interface 接口的基本概念和使用方法：

接口是用来定义一个协议或约定，它只声明方法，但不提供方法的具体实现，我们称这样的方法为抽象方法（Abstract Method）：

```java
public interface Vehicle {
    void start(); // Abstract Method
}
```

方法具体地实现是由实现这个接口的类来提供的：

::: tabs

@tab Car

```java
public class Car implements Vehicle {
    public void start() {
        System.out.println("starting car engine");
    }
}
```

@tab Bus

```java
public class Bus implements Vehicle {
    public void start() {
        System.out.println("starting bus engine");
    }
}
```

@tab Truck

```java
public class Truck implements Vehicle {
    public void start() {
        System.out.println("starting truck engine");
    }
}
```

:::

这样一来，将接口的声明与具体实现分开，业务中就只需要关心方法，而不需要关心具体的实现类，从而实现代码的解耦和模块化

我们再举个例子，假设现在有个需求，通过一个方法来发送多种不同形式的消息，比如既可以发送 Email 邮件消息，又可以发送 SMS 短消息，这种场景就非常适合使用 Interface 来实现：

```java
public interface Message {
    void send();
}
```

我们先创建一个 `Message` 接口，里面定义一个 `send` 抽象方法，接下来我们创建一个 `Email` 类来实现这个 `Message` 接口用来发邮件：

```java
public class Email implements Message {
    @Override
    public void send() {
        System.out.println("This is an email");
    }
}
```

同样的，我们再来创建一个 `Sms` 类来实现 `Message` 接口用来发送短消息：

```java
public class Sms implements Message {
    @Override
    public void send() {
        System.out.println("This is an Sms");
    }
}
```

最后我们返回 `Main` 函数，写一个方法用来负责统一发送消息：

```java
public class Main {
    public static void sendMessage(Message message) {
        message.send();
    }
}
```

因为参数类型为 `Message` 接口，这就意味着不管传入的是 `Email` 对象还是 `Sms` 对象，它们的类都已经各自实现了 `Message` 接口的 `send` 方法。所以 `sendMessage` 方法内部只需要执行 `message` 的 `send` 方法，而不需要关心执行的到底是哪个对象的 `send` 方法，免去了复杂的判断和切换，这也是面向接口编程的一个典型应用场景

我们现在来发送一下邮件消息：

```java
public class Main {
    public static void main(String[] args) {
        Message email = new Email();
        sendMessage(email);
    }
    
    public static void sendMessage(Message message) {
        message.send();
    }
}
```

我们再来尝试一下发送 SMS 消息：

```java
public class Main {
    public static void main(String[] args) {
        Message sms = new Sms();
        sendMessage(sms);
    }
    
    public static void sendMessage(Message message) {
        message.send();
    }
}
```

到这里我们按照传统方法已经正确地实现和使用了接口，但是我们会发现，要发送一条消息每次都需要好几个步骤

比方说上述发送 SMS 的实现步骤：

1. 创建一个实现 `Message` 接口的 `Sms` 类

2. 实现 `Message` 接口的 `send` 方法

3. 实例化一个 sms 对象

4. 最后才可以调用 `sendMessage` 方法进行发送

Lambda 表达式的出现就能帮我们解决这个问题，它能提供一种快速简洁的方式来实现上述接口。接口的抽象方法的具体实现直接在 Lambda 表达式里面定义即可

## 使用 Lambda 表达式

我们来等效实现刚才 `Email` 里的 `send` 方法，语法是用一个括号（Parentheses）一个连字号（Hyphen）加箭头（Arrow）以及大括号（Curly Braces），其中括号指的是 `Email` 里面的 `send` 方法的括号，大括号里面是函数体：

```java
public class Main {
    public static void main(String[] args) {
        sendMessage(() -> {
            System.out.println("This is an email");
        });
    }

    public static void sendMessage(Message message) {
        message.send();
    }
}
```

如果 Lambda 函数体内只包含一个表达式，那么就可以省略大括号：

```java
public class Main {
    public static void main(String[] args) {
        sendMessage(() -> System.out.println("This is an email"));
    }

    public static void sendMessage(Message message) {
        message.send();
    }
}
```

上述代码还可以简写成这样：

```java
public class Main {
    public static void main(String[] args) {
        Message sms = () -> System.out.println("This is an Sms");
        sms.send();
    }
}
```

如果抽象方法中有多个参数，那么对应的 Lambda 表达式里面就要这么定义：

::: tabs

@tab Message

```java
public interface Message {
    void send(String name, String title);
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        Message sms = (name, title) -> System.out.println("This is an Sms to " + title + " " + name);
        sms.send("MW", "Mr");
    }
}
```

:::

当抽象方法有返回值的情况下：

::: tabs

@tab Message

```java
public interface Message {
    String send(String name, String title);
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        Message sms = (name, title) -> {
            System.out.println("This is an Sms to" + title + " " + name);
            return "success";
        };
        String result = sms.send("MW", "Mr");
        System.out.println(result);
    }
}
```

:::

## Lambda 表达式的约束

Lambda 表达式的使用场景是有限制的，它只能用于有且只有一个抽象方法的接口上，我们称这样的接口为函数式接口（Function Interface）为什么 Java 要这样定义呢？试想一下，一个接口如果有多个抽象方法的话，那么在使用 Lambda 表达式时，Java 将无法确定 Lambda 意图实现哪一个抽象方法

我们也可以在接口顶部使用注解 `@FunctionalInterface` 来表示这是一个函数式接口：

```java
@FunctionalInterface
public interface Message {
    String send(String name, String title);
}
```

注解 `@FunctionalInterface` 是可选的，函数式接口的定义本身并不依赖这个注解，即便你不标注，只要满足函数式接口的定义条件，Java 自动会把它当作是函数式接口，当然在编程过程中我们建议使用 `@FunctionalInterface`，这样的话如果出现多于一个抽象方法，或者是没有抽象方法的话，就会编译报错，便于 Debug，同时开发人员也能更好地理解接口的设计意图 

虽然函数式接口只允许有一个抽象方法，但可以有多个默认方法（default methods）或静态方法（static methods）

::: tabs

@tab Message

```java
@FunctionalInterface
public interface Message {
    String send(String name, String title);

    // 默认方法
    default void myDefaultMethod() {
        System.out.println("Default method implementation");
    }

    // 静态方法
    static void myStaticMethod() {
        System.out.println("Static method implementation");
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        Message sms = (name, title) -> {
            System.out.println("This is an Sms to" + title + " " + name);
            return "success";
        };
        String result = sms.send("MW", "Mr");
        System.out.println(result);

        // 调用默认方法
        sms.myDefaultMethod();
        // 调用静态方法
        Message.myStaticMethod();
    }
}
```

:::

总结：Lambda 表达式归根到底是一种语法糖，用于简化函数式接口的实现，在 Java 的函数式编程中起到了关键的作用。Java 标准库中也包含了许多内置的函数式接口，比如 `Predicate`，`Function`，`Consumer`，`Supplier` 等等，经常与 Stream API 一起使用

::: tabs

@tab Predicate

用于筛选元素

```java
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "orange", "grape", "watermelon");
        Predicate<String> startsWithB = s -> s.startsWith("b");

        List<String> result = words.stream().filter(startsWithB).collect(Collectors.toList());
        System.out.println(result);
    }
}
```

打印结果：`[banana]`

@tab Function

用于将一个类型的值转换为另一个类型

```java
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "orange", "grape", "watermelon");
        Function<String, Integer> lengthMapper = String::length;

        List<Integer> result = words.stream().map(lengthMapper).collect(Collectors.toList());
        System.out.println(result);
    }
}
```

打印结果：`[5, 6, 6, 5, 10]`

@tab Consumer

用于对元素执行某些操作而不返回结果

```java
public class Main {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "orange", "grape", "watermelon");
        Consumer<String> printUpperCase = s -> System.out.print(s.toUpperCase() + " ");
        
        words.forEach(printUpperCase);
    }
}
```

打印结果：APPLE BANANA ORANGE GRAPE WATERMELON

@tab Supplier

用于生成或提供值

```java
public class Main {
    public static void main(String[] args) {
        Supplier<Double> randomSupplier = Math::random;
        double randomNumber = randomSupplier.get();
        System.out.println(randomNumber);
    }
}
```

打印结果：0.9441405931125922

:::