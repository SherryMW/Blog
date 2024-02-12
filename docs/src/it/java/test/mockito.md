---
category: IT
article: false
---

# Mockito

开发文档：[https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

## 介绍

在 Java 开发中，使用 Mock（模拟）对象是进行单元测试的常见做法。Mock 对象是在测试过程中替代真实对象的一种虚拟实现，它们被设计用来模拟真实对象的行为，以便在隔离测试的同时验证被测试对象的功能是否正确

- 解耦依赖：在进行单元测试时，通常希望将被测试对象与其依赖的其他组件解耦。使用 Mock 对象可以替代真实地依赖，使得被测试对象的行为与其他组件的具体实现解耦，从而更容易进行单元测试

- 测试独立性：在单元测试中，希望每个测试都能够独立运行，而不受外部因素的影响。使用 Mock 对象可以避免依赖于外部资源或其他模块的状态，从而保证测试的独立性

- 测试复杂场景：在某些情况下，真实对象可能难以创建或设置到期望的状态，或者可能会引发副作用。使用 Mock 对象可以轻松模拟这些复杂场景，以便更全面地测试被测试对象的行为

- 快速反馈：使用 Mock 对象可以更快地运行测试，因为它们通常不会涉及到外部资源或耗时的操作。这样可以更快地获得测试反馈，加速开发迭代过程

- 提高覆盖率：使用 Mock 对象可以更容易地覆盖被测试对象的各种情况和边界条件，从而提高测试覆盖率。这有助于发现潜在的 bug 和问题，提高代码的质量和可靠性

Mockito 是一个流行的 Java 测试框架，用于创建和管理 Mock 对象，帮助进行单元测试和集成测试。它提供了丰富的 API 和简单易用的语法，使得在测试过程中创建和配置 Mock 对象变得非常方便

- 创建 Mock 对象：Mockito 允许你轻松地创建 Mock 对象，以模拟真实对象的行为。你可以使用 `mock()` 方法来创建一个 Mock 对象，然后使用 Mockito 提供的方法来配置 Mock 对象的行为和预期调用

- 设置 Mock 对象行为：你可以使用 Mockito 提供的 `when()` 和 `thenReturn()` 方法来设置 Mock 对象的行为。这允许你指定当某个方法被调用时应该返回什么值，或者抛出什么异常

- 验证 Mock 对象方法调用：Mockito 提供了丰富的验证功能，用于验证 Mock 对象的方法是否按照预期进行了调用。你可以使用 `verify()` 方法来验证方法的调用次数、参数值等

- Spy 对象：Mockito 还支持创建 Spy 对象，它是真实对象的代理，可以部分模拟其行为。与 Mock 对象不同，Spy 对象保留了被代理对象的真实行为，但也可以进行部分替换

- 注解支持：Mockito 提供了一些注解来简化测试代码的编写，例如 `@Mock` 用于标记 Mock 对象，`@InjectMocks` 用于标记被测试对象等

- 清晰的错误信息：Mockito 提供了清晰和友好的错误消息，当测试失败时，它会给出有用的提示，帮助你快速定位问题所在

- 与 JUnit 和其他测试框架集成：Mockito 可以与 JUnit 和其他流行的测试框架（如 TestNG）无缝集成，使得在单元测试中使用 Mockito 变得更加方便

## 相关依赖

mockito-core：[https://mvnrepository.com/artifact/org.mockito/mockito-core](https://mvnrepository.com/artifact/org.mockito/mockito-core)

junit-jupiter-api：[https://mvnrepository.com/artifact/org.junit.jupiter/junit-jupiter-api](https://mvnrepository.com/artifact/org.junit.jupiter/junit-jupiter-api)

```xml
<dependencies>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>4.5.1</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.8.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

```java
public class Demo {

    public int add(int a, int b) {
        return a + b;
    }
}
```

IDEA 中可以在当前类任意代码块中点击鼠标右键 ->【Generate】（或者使用快捷键 Alt+Insert）->【Test】创建测试用例

![](https://img.sherry4869.com/blog/it/java/test/mockito/img.png)

```java
import org.junit.jupiter.api.Test;

class DemoTest {

    @Test
    void add() {

    }
}
```

## Assertions

Assertions 是 Java 提供的一组断言（assertion）工具，用于在测试中进行条件检查和结果验证。它们位于 `org.junit.jupiter.api.Assertions` 包中，用于编写 JUnit5 测试

下面是一些常见的 Assertions 方法及其用法：

- `Assertions.assertEquals(expected, actual);`：验证两个值是否相等

- `Assertions.assertTrue(condition);`：验证条件是否为 true

- `Assertions.assertFalse(condition);`：验证条件是否为 false

- `Assertions.assertNull(obj);`：验证对象是否为 null

- `Assertions.assertNotNull(obj);`：验证对象是否不为 null

- `Assertions.assertSame(expected, actual);`：验证两个对象引用是否指向不同的对象

- `Assertions.assertThrows(ExpectedException.class, () -> { // 执行可能抛出异常的代码块 });`：验证执行代码块是否抛出了指定类型的异常

- `Assertions.assertArrayEquals(expectedArray, actualArray);`：验证两个数组是否相等

## mock

```java
public static <T> T mock(Class<T> classToMock)
```

mock 方法接受一个 Class 对象作为参数，并返回一个模拟的类型为 T 的对象。这个对象是传入类的一个虚拟实现，可以用于测试中模拟真实对象的行为

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Random;

class DemoTest {

    @Test
    void mockTest() {
        Random mock = Mockito.mock(Random.class);
        System.out.println(mock.nextInt());
    }
}
```

在上述的测试代码中，使用 Mockito 创建了一个 Random 类的 Mock 对象，并调用了它的 `nextInt()` 方法。由于 `nextInt()` 方法是一个虚拟的方法调用，Mockito 默认情况下会返回类型的默认值。对于 `nextInt()` 方法，它的默认返回值是 0

所以，无论你运行多少次测试，结果都会是 0。这并不表示 Mockito 创建的 Mock 对象出现了问题，而是因为你没有为 `nextInt()` 方法指定具体的行为，它默认返回了 0

如果你希望 `nextInt()` 方法返回不同的值，你可以使用 Mockito 提供的 [when](#when) 方法来配置 Mock 对象的行为。例如：

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Random;

class DemoTest {

    @Test
    void mockTest() {
        Random mock = Mockito.mock(Random.class);
        Mockito.when(mock.nextInt()).thenReturn(123);
        System.out.println(mock.nextInt());
    }
}
```

在这个示例中，我们使用 `when(mock.nextInt()).thenReturn(123)` 来指定当调用 `nextInt()` 方法时应该返回 123。这样，输出就不再是 0，而是 123

再来看一个相似例子：

::: tabs

@tab Demo.java

```java
public class Demo {

    public int add(int a, int b) {
        System.out.println(123);
        return a + b;
    }
}
```

@tab DemoTest.java

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

class DemoTest {

    @BeforeEach
    void setUp() {
        System.out.println("----------测试开始----------");
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void after() {
        System.out.println("----------测试结束----------");
    }

    @Test
    void mockTest() {
        Demo demo = Mockito.mock(Demo.class);
        System.out.println(demo.add(1, 2));
    }
}
```

控制台打印结果：

```text
----------测试开始----------
0
----------测试结束----------
```

:::

## spy

`spy()` 是 Mockito 框架提供的一个方法，用于创建一个 Spy 对象。在 Mockito 中，Spy 对象是一个真实对象的代理，它保留了被代理对象的真实行为，但也可以进行部分替换

`spy()` 与 `mock()` 不同的是：

1. 被 spy 的对象会走真实的方法，而 mock 对象不会

2. spy 方法的参数是对象实例，mock 的参数是 class

::: tabs

@tab Demo.java

```java
public class Demo {

    public int add(int a, int b) {
        System.out.println(123);
        return a + b;
    }
}
```

@tab DemoTest.java

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

class DemoTest {

    @BeforeEach
    void setUp() {
        System.out.println("----------测试开始----------");
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void after() {
        System.out.println("----------测试结束----------");
    }

    @Test
    void mockTest() {
        Demo demo = Mockito.spy(new Demo());
        System.out.println(demo.add(1, 2));
    }
}
```

控制台打印结果：

```text
----------测试开始----------
123
3
----------测试结束----------
```

:::

## when

`when()` 是 Mockito 框架提供的一个静态方法，用于指定 Mock 对象方法的行为。它通常与 `thenReturn()`、`thenThrow()` 等方法一起使用，用于为 Mock 对象的方法调用设置返回值、抛出异常等行为

下面是一些关于 `when()` 方法的示例用法：

1. 设置方法返回值：

    ```java
    Mockito.when(mockObject.method()).thenReturn(expectedValue);
    ```
    
    这个语法表示当调用 `mockObject` 对象的 `method()` 方法时，应该返回 `expectedValue`。可以使用 `thenReturn()` 方法指定返回值，可以是任意类型的值

2. 抛出异常：

    ```java
    Mockito.when(mockObject.method()).thenThrow(Exception.class);
    ```
    
    通过 `thenThrow()` 方法可以指定当调用 `mockObject` 对象的 `method()` 方法时抛出异常

    ```java
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.mockito.Mock;
    import org.mockito.MockitoAnnotations;
    
    import java.util.List;
    
    import static org.mockito.Mockito.*;
    
    class DemoTest {
    
        @Mock
        private List<String> mockList;
    
        @BeforeEach
        void setUp() {
            System.out.println("----------测试开始----------");
            MockitoAnnotations.openMocks(this);
        }
    
        @AfterEach
        void after() {
            System.out.println("----------测试结束----------");
        }
    
        @Test
        void mockTest() {
            when(mockList.add("hello")).thenThrow(new RuntimeException());
            mockList.add("hello");
        }
    }
    ```
    
    ```text
    ----------测试开始----------
    ----------测试结束----------
    
    java.lang.RuntimeException
    ```

3. 使用 Answer 设置自定义行为：

    ```java
    Mockito.when(mockObject.method(Mockito.anyString())).thenAnswer(invocation -> {
        String argument = invocation.getArgument(0);
        return argument.length();
    });
    ```
    
    可以使用 `thenAnswer()` 方法结合 Answer 接口来设置自定义行为。在这个示例中，我们根据方法的参数计算返回值

4. 模拟 void 方法：

    ```java
    Mockito.doNothing().when(mockObject).voidMethod();
    ```
    
    对于 `void` 方法，Mockito 不支持直接使用 `when()` 方法，而是使用 `doNothing()` 方法结合 `when()` 方法来模拟 `void` 方法

5. Mock 对象在触发指定行为后调用真实的方法

    ```java
    Mockito.when(mockObject.method()).thenCallRealMethod();
    ```
    
    当调用 `mockObject` 对象的 `method()` 方法时，应该调用真实对象的实现。这意味着 Mockito 不会返回预设的值或执行其他模拟的行为，而是调用真实对象的 `method()` 方法

    ::: tabs
    
    @tab Demo.java
    
    ```java
    public class Demo {
    
        public int add(int a, int b) {
            System.out.println(123);
            return a + b;
        }
    }
    ```
    
    @tab DemoTest.java
    
    ```java
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.Assertions;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.mockito.Mock;
    import org.mockito.MockitoAnnotations;
    
    import static org.mockito.Mockito.*;
    
    class DemoTest {
    
        @Mock
        private Demo demo;
    
        @BeforeEach
        void setUp() {
            System.out.println("----------测试开始----------");
            MockitoAnnotations.openMocks(this);
        }
    
        @AfterEach
        void after() {
            System.out.println("----------测试结束----------");
        }
    
        @Test
        void mockTest() {
            when(demo.add(1, 2)).thenCallRealMethod();
            Assertions.assertEquals(3, demo.add(1, 2));
        }
    }
    ```
    
    控制台打印结果：
    
    ```text
    ----------测试开始----------
    123
    ----------测试结束----------
    ```
    
    :::

## verify

Mockito 的 verify 方法用于验证 Mock 对象的方法是否被正确调用。它允许你检查 Mock 对象的方法是否按照预期进行了调用，并且可以验证方法的调用次数、调用顺序、参数值等

verify 方法的常见用法有两种：

- 验证方法的调用次数：使用 `Mockito.verify(mock对象).方法名(参数)` 来验证方法在测试过程中被调用的次数。例如 `Mockito.verify(mockList).add("hello")` 用于验证 add 方法是否被调用，并且只调用了一次

- 验证方法的参数值：使用 `Mockito.verify(mock对象).方法名(参数)` 结合 `times(int n)` 方法来验证方法的参数值。例如，`Mockito.verify(mockList, times(2)).add("hello")` 用于验证 add 方法是否被调用了两次，并且每次调用时参数为 "hello"

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

class DemoTest {

    @Test
    void mockTest() {
        List<String> mockList = Mockito.mock(List.class);
        // 调用被测试对象的方法
        mockList.add("hello");
        mockList.add("world");
        // 验证方法是否被调用
        Mockito.verify(mockList).add("hello"); // 验证 add 方法被调用过
        Mockito.verify(mockList, Mockito.times(2)).add(Mockito.anyString()); // 验证 add 方法被调用了两次，并且参数可以是任意字符串
        Mockito.verify(mockList, Mockito.never()).remove(Mockito.anyString()); // 验证 remove 方法没有被调用过
    }
}
```

::: tip
在 Java 中，使用 `static import` 语法可以将静态成员（字段或方法）导入到当前类中，从而可以直接使用它们，而不需要使用类名限定符

通过 `import static org.mockito.Mockito.*;` 语句，你可以将 `org.mockito.Mockito` 类中的所有静态方法和字段导入到当前类中。这意味着在当前类中，你可以直接使用 Mockito 类的所有静态方法，而不需要使用 `Mockito.` 前缀
:::

```java
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.mockito.Mockito.*;

class DemoTest {

    @Test
    void mockTest() {
        List<String> mockList = mock(List.class);
        // 调用被测试对象的方法
        mockList.add("hello");
        mockList.add("world");
        // 验证方法是否被调用
        verify(mockList).add("hello"); // 验证 add 方法被调用过
        verify(mockList, times(2)).add(anyString()); // 验证 add 方法被调用了两次，并且参数可以是任意字符串
        verify(mockList, never()).remove(anyString()); // 验证 remove 方法没有被调用过
    }
}
```

## @Mock

`@Mock` 是 Mockito 框架提供的一个注解，用于在测试中创建 Mock 对象。它的作用类似于使用 `Mockito.mock()` 方法手动创建 Mock 对象，但是更加简洁方便

使用 `@Mock` 注解的主要步骤如下：

1. 导入 `@Mock` 注解：

    ```java
    import org.mockito.Mock;
    ```

2. 在测试类中，使用 `@Mock` 注解来标记需要创建 Mock 对象的字段

3. 在测试方法运行之前通常是使用 `@BeforeEach` 注解的方法，调用 `MockitoAnnotations.initMocks(this)`/ `MockitoAnnotations.openMocks(this)` 方法，以初始化标记了 `@Mock` 注解的字段，并创建对应的 Mock 对象

    - 在 Junit5 中，`@Before` 和 `@After` 注解被 `@BeforeEach` 和 `@AfterEach` 所替代

4. 使用初始化后的 Mock 对象进行测试

下面是一个使用 `@Mock` 注解的示例：

::: tabs

@tab Demo.java

```java
public class Demo {

    public int add(int a, int b) {
        System.out.println(123);
        return a + b;
    }
}
```

@tab DemoTest.java

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class DemoTest {

    @Mock
    private Demo demo;

    @BeforeEach
    void setUp() {
        System.out.println("----------测试开始----------");
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void after() {
        System.out.println("----------测试结束----------");
    }

    @Test
    void mockTest() {
        System.out.println(demo.add(1,2));
    }
}
```

控制台打印结果：

```text
----------测试开始----------
0
----------测试结束----------
```

:::

## @Spy

`@Spy` 是 Mockito 框架提供的一个注解，用于在测试中创建 Spy 对象。Spy 对象是真实对象的代理，它保留了被代理对象的真实行为，并允许部分方法的替换

使用 `@Spy` 注解的主要步骤如下：

1. 导入 `@Spy` 注解：

    ```java
    import org.mockito.Spy;
    ```

2. 在测试类中，使用 `@Spy` 注解来标记需要创建 Spy 对象的字段

3. 在测试方法运行之前通常是使用 `@BeforeEach` 注解的方法，调用 `MockitoAnnotations.initMocks(this)`/ `MockitoAnnotations.openMocks(this)` 方法，以初始化标记了 @Spy 注解的字段，并创建对应的 Spy 对象

4. 使用初始化后的 Spy 对象进行测试

下面是一个使用 `@Spy` 注解的示例：

::: tabs

@tab Demo.java

```java
public class Demo {

    public int add(int a, int b) {
        System.out.println(123);
        return a + b;
    }
}
```

@tab DemoTest.java

```java
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Spy;
import org.mockito.MockitoAnnotations;

class DemoTest {

    @Spy
    private Demo demo;

    @BeforeEach
    void setUp() {
        System.out.println("----------测试开始----------");
        MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void after() {
        System.out.println("----------测试结束----------");
    }

    @Test
    void mockTest() {
        System.out.println(demo.add(1,2));
    }
}
```

控制台打印结果：

```text
----------测试开始----------
123
3
----------测试结束----------
```

:::

## @InjectMocks

`@InjectMocks` 是 Mockito 框架提供的一个注解，用于自动注入被测试类（被测对象）中的依赖。它可以将被测类中标记了 `@Mock` 或 `@Spy` 注解的字段自动注入到被测试对象中

具体来说，使用 `@InjectMocks` 注解的场景通常是这样的：你有一个类需要进行单元测试，这个类中依赖了其他类（例如服务、工具类等），你使用 `@Mock` 或 `@Spy` 注解创建了这些依赖的模拟对象或间谍对象，然后使用 `@InjectMocks` 注解标记被测试类，Mockito 将自动将模拟对象或间谍对象注入到被测试对象中

下面是一个使用 `@InjectMocks` 注解的示例：

假设我们有一个 `Calculator` 类，它依赖了一个 `MathService` 类：

```java
public class Calculator {
    private MathService mathService;

    public Calculator(MathService mathService) {
        this.mathService = mathService;
    }

    public int add(int a, int b) {
        return mathService.add(a, b);
    }
}
```

我们想要对 `Calculator` 类进行单元测试，但是 `Calculator` 类依赖了 `MathService`，我们可以使用 `@Mock` 注解创建 `MathService` 的模拟对象，并使用 `@InjectMocks` 注解自动注入到 `Calculator` 类中：

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CalculatorTest {

    @Mock
    private MathService mathService;

    @InjectMocks
    private Calculator calculator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAdd() {
        // 设置 mathService.add() 方法的返回值
        when(mathService.add(2, 3)).thenReturn(5);

        // 调用 calculator.add() 方法进行测试
        int result = calculator.add(2, 3);

        // 验证计算结果是否正确
        assertEquals(5, result);
    }
}
```

在这个示例中，我们使用 `@Mock` 注解创建了 `MathService` 的模拟对象，并使用 `@InjectMocks` 注解标记了 `Calculator` 类。在 `@BeforeEach` 注解的方法中，我们调用了 `MockitoAnnotations.openMocks(this)` 来初始化模拟对象和被测试对象。在测试方法 `testAdd()` 中，我们设置了 `mathService.add()` 方法的返回值，并调用 `calculator.add()` 方法进行测试。通过使用 `@InjectMocks` 注解，`Calculator` 类中的 `mathService` 字段被自动注入，并且可以在测试中正常使用

## Mock 静态方法

Mock 静态方法：[https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#48](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#48)

::: tip
Starting with version 2.7.6, we offer the 'mockito-inline' artifact that enables inline mock making without configuring the MockMaker extension file. To use this, add the `mockito-inline` instead of the `mockito-core` artifact as follows:

从 2.7.6 版开始，我们提供了 "mockito-inline "工具，无需配置 MockMaker 扩展文件即可进行内联模拟制作。要使用它，请添加 "mockito-inline "而不是 "mockito-core "工具，如下所示：
:::

```xml
<dependencies>
    <!--
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>4.5.1</version>
        <scope>test</scope>
    </dependency>
    -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-inline</artifactId>
        <version>4.5.1</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.8.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

请注意，`mockito-core` 与 `mockito-inline` 依赖只能存在一个，不能同时引用

::: tabs

@tab StaticUtils.java

```java
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class StaticUtils {

    /**
     * 有参静态方法，返回指定区间的 Integer List
     * @param start 开始值
     * @param end 结束值
     */
    public static List<Integer> range(int start, int end) {
        return IntStream.range(start, end).boxed().collect(Collectors.toList());
    }

    /**
     * 无参静态方法
     */
    public static String name() {
        return "zhangsan";
    }
}
```

@tab StaticUtilsTest.java

```java
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Arrays;

class StaticUtilsTest {

    @Test
    void rangeTest() {
        MockedStatic<StaticUtils> demo = Mockito.mockStatic(StaticUtils.class);
        demo.when(() -> StaticUtils.range(1, 5)).thenReturn(Arrays.asList(10, 11, 12));
        Assertions.assertTrue(StaticUtils.range(1, 5).contains(10));
    }

    @Test
    void nameTest() {
        MockedStatic<StaticUtils> demo = Mockito.mockStatic(StaticUtils.class);
        demo.when(StaticUtils::name).thenReturn("lisi");
        Assertions.assertEquals("lisi", StaticUtils.name());
    }
}
```

:::

如果是单个测试方法运行的话是不会报错的，但运行 `Run StaticUtilsTest`，会发现第二个测试方法 `nameTest()` 会报错： 

```text
org.mockito.exceptions.base.MockitoException: 
For com.mw.mockito.StaticUtils, static mocking is already registered in the current thread

To create a new mock, the existing static mock registration must be deregistered
```

在使用 `mockStatic()` 的时候，我们要对 mock 出来的对象在使用完毕后进行关闭。因为 `mockStatic()` 的源码里面其实是用了 Thread 去开启 mock

使用 try-with-resources 对声明的 mock 对象在其使用结束后自动关闭资源：

```java
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Arrays;

class StaticUtilsTest {

    @Test
    void rangeTest() {
        try (MockedStatic<StaticUtils> demo = Mockito.mockStatic(StaticUtils.class)) {
            demo.when(() -> StaticUtils.range(1, 5)).thenReturn(Arrays.asList(10, 11, 12));
            Assertions.assertTrue(StaticUtils.range(1, 5).contains(10));
        }
    }

    @Test
    void nameTest() {
        try (MockedStatic<StaticUtils> demo = Mockito.mockStatic(StaticUtils.class)) {
            demo.when(StaticUtils::name).thenReturn("lisi");
            Assertions.assertEquals("lisi", StaticUtils.name());
        }
    }
}
```

## 单测覆盖率

::: tabs

@tab RegistrationServiceImpl.java

```java
public class RegistrationServiceImpl implements RegistrationService {

    SalesDao salesDao = new SalesDao();
    UserDao userDao = new UserDao();

    @Override
    public User register(String name, String phone) throws Exception {
        // 参数校验
        if (name == null || name.length() == 0) {
            throw new ValidationException("number 不能为空");
        }
        if (phone == null || !isValid(phone)) {
            throw new ValidationException("phone 格式错误");
        }
        // 获取手机号归属地编号和运营商编号 然后通过编号找到区域内是 SalesRep
        String areaCode = FindUtils.getAreaCode(phone);
        String operatorCode = FindUtils.getOperatorCode(phone);

        User user;
        try {
            SalesRep rep = salesDao.findRep(areaCode, operatorCode);
            // 最后创建用户，落盘，然后返回
            user = userDao.save(name, phone, rep.getRepId());
        } catch (SQLException e) {
            throw new DAOException("SQLException thrown " + e.getMessage());
        }
        return user;
    }

    private boolean isValid(String phone) {
        String pattern = "^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$";
        boolean flag = phone.matches(pattern);
        return flag;
    }
}
```

@tab FindUtils.java

```java
public class FindUtils {

    public static String getAreaCode(String number) {
        // 具体实现逻辑
        return "a";
    }

    public static String getOperatorCode(String number) {
        // 具体实现逻辑
        return "b";
    }
}
```

@tab SalesDao.java

```java
public class SalesDao {

    public SalesRep findRep(String areaCode, String operatorCode) {
        // 伪代码
        if ("a".equals(areaCode) && "b".equals(operatorCode)) {
            return new SalesRep("Echo");
        }
        return null;
    }
}
```

@tab RegistrationServiceImplTest.java

```java
class RegistrationServiceImplTest {

    @InjectMocks
    @Spy
    private RegistrationServiceImpl registrationService;
    @Mock
    private UserDao userDao;
    @Mock
    private SalesDao salesDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register() throws Exception {
        String name = null;
        String phone = "15071271412";
        try {
            registrationService.register(name, phone);
            Assertions.fail("这里会挂掉");
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof ValidationException);
        }

        name = "一直游到海水变蓝";
        phone = null;
        try {
            registrationService.register(name, phone);
            Assertions.fail("这里会挂掉");
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof ValidationException);
        }

        phone = "15071271412";
        MockedStatic<FindUtils> staticService = Mockito.mockStatic(FindUtils.class);
        staticService.when(() -> FindUtils.getAreaCode(phone)).thenReturn("a");
        staticService.when(() -> FindUtils.getOperatorCode(phone)).thenReturn("b");
        
        // 1.数据库操作正常
        Mockito.when(salesDao.findRep("a", "b")).thenCallRealMethod();
        Mockito.when(userDao.save(name, phone, "Echo")).thenCallRealMethod();
        User user = registrationService.register(name, phone);
        Assertions.assertEquals("Echo", user.getRepId());

        // 2.数据库操作异常
        Mockito.when(userDao.save(name, phone, "Echo")).thenThrow(new SQLException());
        try {
            registrationService.register(name, phone);
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof DAOException);
        }
    }
}
```

:::