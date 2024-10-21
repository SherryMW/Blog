---
category: IT
article: false
---

# Optional

Optional 在 JDK8 中引入

## 为什么要引入 Optional

`null` 值在编程中常常是一个令人头疼的问题，处理不好就会导致 `NullPointerException` 空指针异常。为了避免空指针异常，代码中就会充斥着繁琐的 `null` 检查和条件嵌套

`Optional` 的出现帮我们解决了这个问题，它让我们可以更安全优雅地处理可能为空的值，接下来我们就详细讲解下如何正确合理的使用 `Optional`

我们在实际项目中经常会遇到这样的需求，比方说在数据库中通过人名去查找某个用户的详细信息，我们创建两个类：`User` 和 `UserRepository`：

::: tabs

@tab User

```java
public class User {
    private String name;

    private String fullName;

    public User(String name, String fullName) {
        this.name = name;
        this.fullName = fullName;
    }

    public String getName() {
        return name;
    }

    public String getFullName() {
        return fullName;
    }
}
```

@tab UserRepository

```java
public class UserRepository {
    public User findUserByName(String name) {
        if (Objects.equals(name, "Albert")) {
            return new User("Albert", "Albert Shen");
        } else {
            return null;
        }
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        User user = userRepository.findUserByName("Albert");
        System.out.println(user.getFullName());
    }
}
```

:::

那么如果我们来换一个名字查询的话，比方说是“Albert2”，显然这个时候 `findUserByName` 返回的会是 `null`

接着当我们运行 `main` 函数后会抛出空指针异常，因为在 Java 中尝试访问一个空引用的属性，或者调用一个空引用的方法的时候，系统就会抛出 `NullPointerException`

所以为了保证不抛出 `NullPointerException` 代码中就要做一下判断：

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        User user = userRepository.findUserByName("Albert");
        if (user != null) {
            System.out.println(user.getFullName());
        } else {
            User defaultUser = new User("Unknown", "Unknown");
            System.out.println(defaultUser.getFullName());
        }
    }
}
```

在实际项目中我们会处理大量可能为空的值，这样一来代码就会充斥着条件判断，会让代码显得非常臃肿，难以阅读和维护。这就是为什么要引入 `Optional` 的原因

`Optional` 就像是一个容器，盒子，它可以包含某种类型的值，也可以什么都不包含，比如 `null`

并且提供一系列方法（`get()`，`orElse()`，`orElseGet()`，`orElseThrow()`）来方便地操作内部的值

同时 `Optional` 的设计也考虑了函数式编程的原则，可以与 Lambda 表达式和 Stream API 等特性结合使用

![](https://img.sherry4869.com/blog/it/java/entry-level/basics/optional/img.png)

可以优雅地进行一些链式调用，而不用像以往那样用命令式编程（Imperative Programming）的方式编写大量的 `IF` 语句来检查 `null` 值

![](https://img.sherry4869.com/blog/it/java/entry-level/basics/optional/img_2.png)

## Optional 的基本使用方法

我们先来创建一个包含空值的 `Optional` 对象，类似创建一个空的盒子：

```java
public class Main {
    public static void main(String[] args) {
        Optional<Object> optionalBox = Optional.empty();
        System.out.println(optionalBox.isPresent()); // false
        System.out.println(optionalBox.isEmpty()); // true
    }
}
```

使用 `isPresent` 方法来检查 `Optional` 中是否有值，方法返回一个 `boolean` 值，如果 `Optional` 包含非空值，则返回 `true`，否则返回 `false`

在 JDK11 中引入了 `isEmpty` 方法，允许更自然地检查 `Optional` 是否为空，方法返回一个 `boolean` 值，如果是空值则返回 `true`，如果不为空就返回 `false`

我们来创建一个包含值的 `Optional` 对象：

```java
public class Main {
    public static void main(String[] args) {
        String value = "Albert";
        Optional<String> optionalBox = Optional.of(value);
        System.out.println(optionalBox.isPresent()); // true
        System.out.println(optionalBox.isEmpty()); // false
    }
}
```

用 `of` 方法创建的 `Optional` 对象必须包含值，这就意味着你要确保传递给 `of` 方法的值不为 `null`，否则就会抛出 `NullPointerException`。因此主要是用于你能够确定值不为空的场景

所以当碰到这种处理对象不确定是否为 `null` 值的情况下，我们就要用 `ofNullable` 这个方法来创建 `Optional` 对象。这样 `value` 既可以是有值的，也可以视为 `null`，类似于创建的这个盒子里面既可能是空的，也可能是装了东西，有点像薛定谔的猫是不是？

```java
public class Main {
    public static void main(String[] args) {
        Optional<String> optionalBox = Optional.ofNullable(null);
        System.out.println(optionalBox.isPresent()); // false
        System.out.println(optionalBox.isEmpty()); // true
        
        String value = "Albert";
        System.out.println(Optional.ofNullable(value).isPresent()); // true
        System.out.println(Optional.ofNullable(value).isEmpty()); // false
    }
}
```

如果我们想从 `Optional` 这个盒子中把值给取出来，我们可以使用 `get` 方法：

```java
public class Main {
    public static void main(String[] args) {
        String value = "Albert";
        Optional<String> optionalBox = Optional.ofNullable(value);
        System.out.println(optionalBox.get()); // Albert
    }
}
```

这里需要注意一下，虽然使用 `get` 方法取值非常简单和直观，但是一般我们不推荐这么做，因为这并不是 `Optional` 设计的初衷，我们稍后会讲到

我们现在用 `Optional` 来重新实现一下刚刚的例子：

::: tabs

@tab UserRepository

```java
public class UserRepository {
    public Optional<User> findUserByName(String name) {
        if (Objects.equals(name, "Albert")) {
            return Optional.of(new User("Albert", "Albert Shen"));
        } else {
            return Optional.empty();
        }
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        User user = optionalUser.get();
        System.out.println(user.getFullName());
    }
}
```

打印结果：Albert Shen

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert2");
        User user = optionalUser.get();
        System.out.println(user.getFullName());
    }
}
```

打印结果：Exception in thread "main" java.util.NoSuchElementException: No value present

:::

如果我们换一个名字来查询，此时抛出了 `NoSuchElementException`。虽然不像之前那样抛出 `NullPointerException`，但由于查询不到对应名字的用户，`Optional` 这个盒子对象里面装的是空值，所以并不能取出 `User` 对象，更不能获得这个 `getFullName` 方法了。因此我们需要做一下判断：

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert2");
        if (optionalUser.isPresent()) {
            System.out.println(optionalUser.get().getFullName());
        } else {
            User defaultUser = new User("Unknown", "Unknown");
            System.out.println(defaultUser.getFullName());
        }
    }
}
```

到目前为止大家就会发现，这边的代码结构和之前的 `if (user != null)` 没有本质上的区别，依旧是用命令式编程（Imperative Programming）的方式在做判断和检查，这显然不是 `Optional` 设计的初衷和正确的使用方法

## Optional 的最佳实践

### orElse

```java
public final class Optional<T> {
    public T orElse(T other) {
        return value != null ? value : other;
    }
}
```

`orElse` 方法的含义是：在 `Optional` 对象有值的情况下就返回相应的值，否则就返回参数里指定的值，类似默认值。其实逻辑和原本用 `if else` 代码块来判断是一样的，只不过表达形式更加优雅一点

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert2");
        User user = optionalUser.orElse(new User("Unknown", "Unknown"));
        System.out.println(user.getFullName());
    }
}
```

### orElseGet

```java
public final class Optional<T> {
    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }
}
```

`orElse` 和 `orElseGet` 在功能上很相似，但执行方式上有所不同，对于 `orElse` 来讲，不管是 `Optional` 对象为空或者非空都会执行传入的参数；而 `orElseGet` 只有在 `Optional` 对象为空的时候才会去执行 `Supplier` 里面的方法，也就是说只有为空的情况下才会去实例化传参里的 `User`

所以当默认值已经确定，并且获取默认值的代价不是很高的时候可以使用 `orElse`，当获取默认值的代价比较高，或者需要进行一些计算或其他的操作时，使用 `orElseGet` 是更好的选择，因为它只有在必要的时候才会执行

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        User user = optionalUser.orElse(new User("Unknown", "Unknown"));
        System.out.println(user.getFullName());
        User user2 = optionalUser.orElseGet(() -> new User("Unknown", "Unknown")); // 使用函数式编程
        System.out.println(user2.getFullName());
    }
}
```

### orElseThrow

```java
public final class Optional<T> {
    public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
    }
}
```

你也可以选择不传递任何参数，如果 `Optional` 对象为空，此时它就会抛出一个 `NoSuchElementException`，和之前直接用 `get` 方法抛出的异常是一样的。或者你可以提供一个异常生成器，根据你的需求抛出特定的异常

`orElseThrow` 方法接收一个 `Supplier` 的函数式接口作为参数，通过实现该接口可以生成并抛出一个自定义的异常

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert2");
        optionalUser.orElseThrow(() -> new RuntimeException("User not found"));
    }
}
```

### ifPresent

```java
public final class Optional<T> {
    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }
}
```

`ifPresent` 方法接收一个 `Consumer` 函数式接口（执行某些操作而不返回结果）作为参数，如果 `Optional` 对象含值就会执行 Lambda 表达式，如果 `Optional` 对象为空的话，它将什么都不执行

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        optionalUser.ifPresent(user -> System.out.println(user.getFullName()));
    }
}
```

如果我们希望在 `Optional` 值为空的情况下执行其他操作，就要使用 `ifPresentOrElse`

### ifPresentOrElse

`ifPresentOrElse` 方法是在 JDK9 中引入的

```java
public final class Optional<T> {
    public void ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction) {
        if (value != null) {
            action.accept(value);
        } else {
            emptyAction.run();
        }
    }
}
```

这个方法允许 `Optional` 包含值的时候做一些操作，如果 `Optional` 对象为空时执行另外一个操作。方法接收两个参数，一个为 `Consumer` 的函数式接口，一个为 `Runnable` ，我们依旧用两个 Lambda 表达式来实现一下这两个参数：

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        optionalUser.ifPresentOrElse(user -> System.out.println(user.getFullName()), () -> System.out.println("User not found"));
    }
}
```

查的到用户的时候会打印 “Albert Shen”，当查不到用户时会打印 “User not found”

### filter

如果我们想过滤 `Optional` 对象中的值，根据给定的条件来决定是否保留该值，我们可以使用 `Optional` 中的 `filter` 方法

```java
public final class Optional<T> {
    public Optional<T> filter(Predicate<? super T> predicate) {
        Objects.requireNonNull(predicate);
        if (!isPresent())
            return this;
        else
            return predicate.test(value) ? this : empty();
    }
}
```

`filter` 方法接收一个 `Predicate` 的函数式接口作为参数，该接口用于定义过滤条件，如果值存在且满足条件 `filter` 会返回一个包含原始值的新的 `Optional` 对象，否则就返回一个空的 `Optional` 对象，我们用 Lambda 表达式来实现一下 `Predicate` 函数式接口：

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert2");
        Optional<User> optionalUser2 = optionalUser.filter(user -> user.getFullName().equals("Albert"));
        System.out.println(optionalUser2.isPresent());
    }
}
```

### map

如果我们想对 `Optional` 中的值进行转换，我们可以用 `Optional` 的 `map` 方法

```java
public final class Optional<T> {
    public <U> Optional<U> map(Function<? super T, ? extends U> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Optional.ofNullable(mapper.apply(value));
        }
    }
}
```

`map` 方法用于对 `Optional` 中的值进行转换，并返回一个新的 `Optional` 对象，其中包含了转换后的值。当 `Optional` 包含值时，`map` 方法就会接收一个 `Function` 类型的参数，这个函数会被应用到 `Optional` 中的值上，或者你可以理解为在这个值上执行这个方法，并返回一个新的 `Optional` 对象，里面包含函数执行后的结果。如果 `Optional` 是空的，`map` 方法什么也不会做，直接返回一个空的 `Optional` 对象

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
//        Optional<String> optionalFullName = optionalUser.map(user -> user.getFullName());
        // 用方法引用的方式简化 Lambda 表达式
        Optional<String> optionalFullName = optionalUser.map(User::getFullName);
    }
}
```

这边 `map` 的作用就是执行了 `optionUser` 内部的一个 `user` 的一个 `getFullName` 方法，然后把执行后的结果重新包装到另外一个 `Optional` 对象里面并返回

与 `map` 类似的另一个方法是 `flatMap`

### flatMap

```java
public final class Optional<T> {
    public <U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Objects.requireNonNull(mapper.apply(value));
        }
    }
}
```

它用于扁平化嵌套的 `Optional` 结构，以避免引入不必要的嵌套层级。具体就是 `flatMap` 的转换函数返回的必须是另一个 `Optional` 对象，这就意味着 `flatMap` 方法可以用于嵌套的 `Optional` 情况。它会将两个 `Optional` 对象合并成一个。如果原始的 `Optional` 对象为空，或者转换函数返回的 `Optional` 对象为空，那么最终得到的也是一个空的 `Optional` 对象

::: tabs

@tab User

```java
public class User {
    private String name;

    private String fullName;

    public User(String name, String fullName) {
        this.name = name;
        this.fullName = fullName;
    }

    public String getName() {
        return name;
    }

    public Optional<String> getFullName() {
        return Optional.ofNullable(fullName);
    }
}
```

@tab Main

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        Optional<Optional<String>> s = optionalUser.map(User::getFullName);
        Optional<String> s1 = optionalUser.flatMap(User::getFullName);
    }
}
```

:::

通常情况下如果你只需要对 `Optional` 对象中的值进行转换而不需要嵌套的 `Optional`，那么使用 `map` 方法是更合适的选择。但如果你需要进行一些操作，可能会返回另外一个 `Optional` 对象，那么 `flatMap` 方法更适合

另外在 JDK9 中 `Optional` 还提供了 `stream` 方法，它可以将 `Optional` 对象转换为一个 `Stream` 对象，然后对其中的值进行流操作。如果 `Optional` 对象包含值，那么就将这个值封装到一个 `Stream` 流中；如果 `Optional` 对象为空，那么将创建一个空的 `Stream` 流

```java
public class Main {
    public static void main(String[] args) {
        UserRepository userRepository = new UserRepository();
        Optional<User> optionalUser = userRepository.findUserByName("Albert");
        Stream<String> stream = optionalUser.map(User::getName).stream();
        stream.forEach(System.out::print);
    }
}
```

上述 `map` 的作用其实是对 `optionalUser` 内部的值做了一个转换，通过 `getName` 返回的值重新包装到一个新的 `Optional` 对象里面，接着交给 `stream`，将里面的新值封装到流里面，所以最后返回的就是一个内部包含有类型为 `String` 的一个流

## 使用场景

总的来说：`Optional` 普遍同于方法的返回类型，表示方法可能不返回结果。当你有一个方法可能返回一个值，或者什么都不返回，即返回 `null` 时，你可以使用 `Optional`

```java
public class UserRepository {
    public Optional<User> findUserByName(String name) {
        if (Objects.equals(name, "Albert")) {
            return Optional.of(new User("Albert", "Albert Shen"));
        } else {
            return Optional.empty();
        }
    }
}
```

比方说当你设计一个 API 时，它能引导 API 的使用者，告诉他们这个结果可能不存在，并强制调用者处理这种可能性，可以减少错误的发生

`Optional` 也有一些不推荐的使用场景：

1. 不应该用于类的字段。由于 `Optional` 对象的创建和管理有一定的开销，它们并不适合用作类的字段，使用 `Optional` 作为字段类型会增加内存消耗，并且会使得对象的序列化变得复杂

    ```java
    public class User {
        Optional<String> name;
    }
    ```

2. `Optional` 不应该用作方法的参数，将 Optional 用作方法参数，会使方法的使用和理解变得复杂

    ```java
    public class User {
        public void updateUser(Optional<String> name) {
    
        }
    }
    ```
    
    如果你希望方法接收一个可能为空的值，通常有更好的设计选择，比如方法重载：
    
    ```java
    public class User {
        public void updateUser(String name) {
    
        }
    
        public void updateUser() {
    
        }
    }
    ```

3. 类似于方法参数，`Optional` 也不应该用于构造函数参数，这种做法还会迫使调用者创建 `Optional` 实例

    ```java
    public class User {
        public User(Optional<String> name) {
    
        }
    }
    ```
    
    应该通过构造器重载来解决：
    
    ```java
    public class User {
        public User(String name) {
    
        }
        
        public User {
            
        }
    }
    ```

4. 不应该用作集合的参数类型

    ```java
    public class UserRepository {
        public Optional<List<User>> getUsers() {
            return Optional.ofNullable(getList());
        }
    }
    ```
    
    如果你的方法返回一个集合，而且这个集合可能为空，不应该用 `Optional` 来包装它。集合已经可以很好地处理空集合的情况，没必要用 `Optional` 包装集合
    
    ```java
    public class UserRepository {
        public List<User> getUsers() {
            if (getList() == null) {
                return Collections.emptyList();
            }
            return getList();
        }
    }
    ```

5. 不建议使用 `get` 方法

    ```text
    String value = optionalValue.get(); // 不推荐
    ```
    
    调用 `Optional` 的 `get` 方法前，没有确认值是否存在，可能会导致 `NoSuchElementException`
    
    即使是使用 `isPresent` 和 `get` 的组合，也不是一个最好的选择，这样做其实和直接调用可能为 `null` 的引用没多大区别，因为你仍然需要进行显式的检查以避免异常
    
    ```text
    if (optionalValue.isPresent()) {
        String value = optionalValue.get();
    }
    ```
    
    应当使用 [`orElse`](#orelse)，[`orElseGet`](#orelseget)，[`orElseThrow`](#orelsethrow)，[`ifPresent`](#ifpresent)，[`ifPresentOrElse`](#ifpresentorelse) 等方法