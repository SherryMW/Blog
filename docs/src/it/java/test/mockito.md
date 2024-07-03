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

- 设置 Mock 对象行为：你可以使用 Mockito 提供的 `when()` 和 `thenReturn()`、`thenThrow()` 方法来设置 Mock 对象的行为。这允许你指定当某个方法被调用时应该返回什么值，或者抛出什么异常

- 注解支持：Mockito 提供了一些注解来简化测试代码的编写，例如 `@Mock` 用于标记 Mock 模拟对象，`@InjectMocks` 用于标记被测试对象等

## 相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

在 spring-boot-starter-test 里已经默认引入了 Mockito 的相关依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.8.2</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>4.5.1</version>
        <scope>compile</scope>
    </dependency>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <version>4.5.1</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

::: tip

在 IDEA 中可以在当前类任意代码块中点击鼠标右键 ->【Generate】（或者使用快捷键 Alt+Insert）->【Test】创建测试用例

```java
public class Demo {
    
    public int add(int a, int b) {
        return a + b;
    }
}
```

![](https://img.sherry4869.com/blog/it/java/test/mockito/img.png)

```java
import org.junit.jupiter.api.Test;

class DemoTest {
    
    @Test
    void add() {

    }
}
```

:::

## 基本使用

### mock

```java
public static <T> T mock(Class<T> classToMock)
```

`mock()` 方法接受一个 Class 对象作为参数，并返回一个模拟的类型为 `T` 的对象。这个对象是传入类的一个虚拟实现，可以用于测试中模拟真实对象的行为

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Random;

class DemoTest {

    @Test
    public void mockTest() {
        Random mock = Mockito.mock(Random.class);
        System.out.println(mock.nextInt());
    }
}
```

在上述的测试代码中，使用 Mockito 创建了一个 Random 类的 Mock 对象，并调用了它的 `nextInt()` 方法。由于 `nextInt()` 方法是一个虚拟的方法调用，Mockito 默认情况下会返回类型的默认值。对于 `nextInt()` 方法，它的默认返回值是 0。如果方法返回值是布尔类型，那么默认值就是 false，以此类推

所以，无论你运行多少次测试，结果都会是 0。这并不表示 Mockito 创建的 Mock 对象出现了问题，而是因为你没有为 `nextInt()` 方法指定具体的行为，它默认返回了 0

如果你希望 `nextInt()` 方法返回不同的值，你可以使用 Mockito 提供的 [when()](#when) 方法来配置 Mock 对象的行为。例如：

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Random;

class DemoTest {

    @Test
    public void mockTest() {
        Random mock = Mockito.mock(Random.class);
        Mockito.when(mock.nextInt()).thenReturn(123);
        System.out.println(mock.nextInt());
    }
}
```

在这个示例中，我们使用 `when(mock.nextInt()).thenReturn(123)` 来指定当调用 `nextInt()` 方法时应该返回值 123。这样，输出结果就不再是 0，而是 123

### when

`when()` 用于指定 Mock 对象方法的行为。它通常与 `thenReturn()`、`thenThrow()` 等方法一起使用，用于为 Mock 对象的方法调用设置返回值、抛出异常等行为

下面是一些关于 `when()` 方法的示例用法：

1. 模拟返回值：

    ```java
    Mockito.when(mockObject.method()).thenReturn(expectedValue);
    ```
    
    这个语法表示当调用 `mockObject` 对象的 `method()` 方法时，可以使用 `thenReturn()` 方法指定返回预设值，可以是任意类型的值

2. 模拟 void 方法：

    ```java
    Mockito.doNothing().when(mockObject).voidMethod();
    ```
    
    对于 `void` 方法，Mockito 不支持直接使用 `when()` 方法，而是使用 `doNothing()` 方法结合 `when()` 方法来模拟 `void` 方法

3. 模拟抛出异常：

    ```java
    Mockito.when(mockObject.method()).thenThrow(Exception.class);
    ```

   通过 `thenThrow()` 方法可以指定当调用 `mockObject` 对象的 `method()` 方法时抛出异常

   如果方法的返回是 void，则需要使用 `doThrow()`抛出异常

    ```java
    Mockito.doThrow(Exception.class).when(mockObject).method();
    ```

### @Mock

`@Mock` 注解用于在测试中创建 Mock 对象。它的作用类似于使用 `Mockito.mock()` 方法手动创建 Mock 对象，但是更加简洁方便

下面是一个使用 `@Mock` 注解的示例：

::: tabs

@tab Demo

```java
public class Demo {

    public int add(int a, int b) {
        System.out.println(123);
        return a + b;
    }
}
```

@tab DemoTest

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

class DemoTest {

    @Mock
    private Demo demo;

    @Test
    public void mockTest() {
        System.out.println(demo.add(1,2).thenReturn(3));
    }
}
```

:::

### @InjectMocks

`@InjectMocks` 注解用于自动注入被测试类（被测对象）中的依赖。它可以将被测类中标记了 `@Mock` 注解的字段自动注入到被测试对象中

具体来说，使用 `@InjectMocks` 注解的场景通常是这样的：你有一个类需要进行单测/单测覆盖率，这个类中依赖了其他类（例如服务、工具类等），你使用 `@Mock` 注解创建了这些依赖的模拟对象，然后使用 `@InjectMocks` 注解标记被测试类，Mockito 将自动将模拟对象注入到被测试对象中

下面是一个使用 `@InjectMocks` 注解的示例：

假设我们有一个 CalculatorServiceImpl 类，它依赖了一个 MathService 服务：

```java
@Service
public class CalculatorServiceImpl {

    @Autowired
    private MathService mathService;

    public int add(int a, int b) {
        return mathService.add(a, b);
    }
}
```

我们想要对 CalculatorServiceImpl 类进行单元测试，但是 CalculatorServiceImpl 类依赖了 MathService，我们可以使用 `@Mock` 注解创建 MathService 的模拟对象，并使用 `@InjectMocks` 注解让模拟对象注入到 CalculatorServiceImpl 中：

```java
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

class CalculatorTest {

    @InjectMocks
    private CalculatorServiceImpl calculatorServiceImplMock;
    
    @Mock
    private MathService mathServiceMock;

    @Test
    public void testAdd() {
        // 设置 mathService.add() 方法的返回值
        Mockito.when(mathServiceMock.add(2, 3)).thenReturn(5);
        calculatorServiceImplMock.add(2, 3);
    }
}
```

### @MockBean

在集成测试中，你可能需要启动整个 Spring 应用上下文，并希望替换其中的一些 bean 以进行隔离测试。`@MockBean` 能够在 Spring 上下文中创建和注入模拟对象，替换实际的 bean

如果你的测试依赖于 Spring 框架，那么 `@MockBean` 是最佳选择

```java
@Configuration
public class UcsRocketMqProducersConfiguration {

    @Bean(name = "userBehaviorOneidDataFactory")
    public MQProduceFactory userBehaviorOneidDataProducers(UcsRocketMessageMqConfigProperties ucsRocketMessageMqConfigProperties) {
        MQProduceFactory mqProduceFactory = new MQProduceFactory();
        mqProduceFactory.setConfigUrl(ucsRocketMessageMqConfigProperties.getRocketUrl());
        mqProduceFactory.setAppName(ucsRocketMessageMqConfigProperties.getUserBehaviorOneidData().getAppName());
        mqProduceFactory.setTopicName(ucsRocketMessageMqConfigProperties.getUserBehaviorOneidData().getTopicName());
        mqProduceFactory.setClientVersion(ucsRocketMessageMqConfigProperties.getUserBehaviorOneidData().getClientVersion());
        return mqProduceFactory;
    }
}
```

目前要单测覆盖 `sendUserBehaviorTimeDataMsg()` 方法，主要就是要获取到注入的 userBehaviorOneidDataFactory 对象

```java {15}
@Service
public class UcsRocketMqProductManager {

    @Autowired
    @Qualifier(value = "userBehaviorOneidDataFactory")
    MQProduceFactory userBehaviorOneidDataFactory;

    public void sendUserBehaviorTimeDataMsg(UcsBehaviorStreamDto ucsBehaviorStreamDto) {
        if (ucsBehaviorStreamDto == null) {
            return;
        }
        String jsonString = null;
        try {
            jsonString = BehaviorJSON.toJSONString(ucsBehaviorStreamDto);
            SendResult send = userBehaviorOneidDataFactory.send(jsonString, ucsRocketMessageMqConfigProperties.getUserBehaviorOneidData().getTimeOut());
            log.info("用户行为最新时间数据发MQ，结果：{}", send.getSendStatus());
        } catch (Exception e) {
            log.error("sendUserBehaviorTimeDataMsg发送失败：{}", LogSecrecyUtils.logEncrypt(jsonString), e);
        }
    }
}
```

这里需要使用到 @MockBean 注解

```java {9-11}
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class JacocoTest {

    @Autowired
    UcsRocketMqProductManager ucsRocketMqProductManager;

    @MockBean
    @Qualifier(value = "userBehaviorOneidDataFactory")
    MQProduceFactory userBehaviorOneidDataFactory;

    @Test
    public void sendUserBehaviorTimeDataMsgTest() {
        try {
            SendResult sendResult = new SendResult();
            Mockito.when(userBehaviorOneidDataFactory.send(anyString(), anyLong())).thenReturn(sendResult);
            UcsBehaviorStreamDto ucsBehaviorStreamDto = new UcsBehaviorStreamDto();
            ucsRocketMqProductManager.sendUserBehaviorTimeDataMsg(ucsBehaviorStreamDto);
        } catch (Exception e) {
            log.error("异常", e);
        }
    }
}
```

## 模拟静态方法

::: info

org.mockito.exceptions.base.MockitoException:
The used MockMaker SubclassByteBuddyMockMaker does not support the creation of static mocks

Mockito's inline mock maker supports static mocks based on the Instrumentation API.
You can simply enable this mock mode, by placing the 'mockito-inline' artifact where you are currently using 'mockito-core'.
Note that Mockito's inline mock maker is not supported on Android.

:::

如果我们使用的 Mockito 版本低于 5，我们还需要显示的添加 Mockito 的 mock maker 内联依赖关系

::: tip

Starting with version 2.7.6, we offer the 'mockito-inline' artifact that enables inline mock making without configuring the MockMaker extension file. To use this, add the `mockito-inline` instead of the `mockito-core` artifact as follows:

从 2.7.6 版开始，我们提供了 mockito-inline 工具，无需配置 MockMaker 扩展文件即可进行内联模拟制作。要使用它，请添加 mockito-inline 依赖

:::

[https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#48](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#48)

```xml
<dependencies>
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-inline</artifactId>
        <version>4.5.1</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

::: tabs

@tab StaticUtils

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

@tab StaticUtilsTest

```java
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Arrays;

class StaticUtilsTest {

    @Test
    public void rangeTest() {
        MockedStatic<StaticUtils> mockStatic = Mockito.mockStatic(StaticUtils.class);
        mockStatic.when(() -> StaticUtils.range(1, 5)).thenReturn(Arrays.asList(10, 11, 12));
    }

    @Test
    public void nameTest() {
        MockedStatic<StaticUtils> mockStatic = Mockito.mockStatic(StaticUtils.class);
        mockStatic.when(StaticUtils::name).thenReturn("lisi");
    }
}
```

:::

以上的测试用例中，运行单个测试方法的话是不会报错的，例如【Run 'rangeTest()' with Coverage】或者【Run 'nameTest()' with Coverage】。但如果运行整个测试类【Run 'StaticUtilsTest' with Coverage】，那么第二个测试方法 `nameTest()` 将会报错：

```text
org.mockito.exceptions.base.MockitoException: 
For com.mw.mockito.StaticUtils, static mocking is already registered in the current thread

To create a new mock, the existing static mock registration must be deregistered
```

在使用 `mockStatic()` 的时候，我们要对 Mock 出来的对象在使用完毕后进行关闭。因为 `mockStatic()` 的源码里面其实是用了 Thread 去开启 Mock。因此要使用 try-with-resources 对声明的 Mock 对象在其使用结束后自动关闭资源：

```java
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import java.util.Arrays;

class StaticUtilsTest {

    @Test
    public void rangeTest() {
        try (MockedStatic<StaticUtils> mockStatic = Mockito.mockStatic(StaticUtils.class)) {
            mockStatic.when(() -> StaticUtils.range(1, 5)).thenReturn(Arrays.asList(10, 11, 12));
        }
    }

    @Test
    public void nameTest() {
        try (MockedStatic<StaticUtils> mockStatic = Mockito.mockStatic(StaticUtils.class)) {
            mockStatic.when(StaticUtils::name).thenReturn("lisi");
        }
    }
}
```

## 模拟构造

在 Mockito 3.4.0 及更高版本中引入了 `MockConstruction` 功能，它允许在测试代码中临时修改和控制对象的构造函数行为。这对于测试依赖于外部资源或需要模拟复杂对象构建过程的情况非常有用

### 模拟无参构造

让我们先创建一个简单的 Fruit 类，这将是我们第一个单元测试的重点：

```java
public class Fruit {

    public String getName() {
        return "Apple";
    }

    public String getColour() {
        return "Red";
    }
}
```

现在，让我们继续编写测试，在测试中模拟调用 Fruit 类的构造函数：

```java
class FruitTest {
    
    @Test
    public void givenMockedContructor_whenFruitCreated_thenMockIsReturned() {
        try (MockedConstruction<Fruit> mock = Mockito.mockConstruction(Fruit.class)) {
            Fruit fruit = new Fruit();
            Mockito.when(fruit.getName()).thenReturn("Banana");
            Mockito.when(fruit.getColour()).thenReturn("Yellow");

            List<Fruit> constructed = mock.constructed();
            System.out.println(constructed.get(0).getName()); // Banana
            System.out.println(constructed.get(0).getColour()); // Yellow
        }
    }
}
```

为了模拟对象构造，我们使用 `Mockito.mockConstruction()` 方法。该方法使用一个非抽象 Java 类来表示我们将要模拟的构造。在本例中，它是一个 Fruit 类

我们在 `try-with-resources` 块中定义了这一点。这意味着，当我们的代码在 `try` 语句中调用 Fruit 对象的构造函数时，它将返回一个 Mock 对象。我们需要注意的是，在我们的作用域代码块之外，构造函数不会被 Mockito 模拟

### 模拟有参构造

另一个常见的用例是能够处理需要参数的构造函数

值得庆幸的是，`mockedConstruction` 提供了一种机制，允许我们访问传递给构造函数的参数，让我们为 WaterTank 添加一个新的构造函数：

```java {9-11}
public class WaterTank {

    private int mils;

    public WaterTank() {
        this.mils = 25;
    }

    public WaterTank(int mils) {
        this.mils = mils;
    }

    public boolean isEspresso() {
        return getMils() < 50;
    }

    public int getMils() {
        return mils;
    }

    public void setMils(int mils) {
        this.mils = mils;
    }
}
```

同样，让我们为 Coffee 应用程序添加一个新的构造函数：

```java {12-15}
public class CoffeeMachine {

    private Grinder grinder;

    private WaterTank tank;

    public CoffeeMachine() {
        this.grinder = new Grinder();
        this.tank = new WaterTank();
    }

    public CoffeeMachine(int mils) {
        this.grinder = new Grinder();
        this.tank = new WaterTank(mils);
    }

    public String makeCoffee() {
        String type = this.tank.isEspresso() ? "Espresso" : "Americano";
        return String.format("Finished making a delicious %s made with %s beans", type, this.grinder.getBeans());
    }
}
```

最后，我们可以再增加一个测试：

```java
@SpringBootTest
class CoffeeMachineTest{
    
    @Test
    public void givenMockedContructorWithArgument_whenCoffeeMade_thenMockDependencyReturned() {
        try (MockedConstruction<WaterTank> mockTank = Mockito.mockConstruction(WaterTank.class,
                (mock, context) -> {
                    Mockito.when(mock.getMils()).thenReturn((Integer) context.arguments().get(0));
                });
             MockedConstruction<Grinder> mockGrinder = Mockito.mockConstruction(Grinder.class)) {

            CoffeeMachine machine = new CoffeeMachine(100);

            WaterTank waterTank = mockTank.constructed().get(0);
            Grinder grinder = mockGrinder.constructed().get(0);

            Mockito.when(waterTank.isEspresso()).thenReturn(false);
            Mockito.when(grinder.getBeans()).thenReturn("Kenyan");

            System.out.println(mockTank.constructed().get(0).getMils()); // 100
            System.out.println(machine.makeCoffee()); // Finished making a delicious Americano made with Kenyan beans
        }
    }
}
```

这次，我们使用 lambda 表达式来处理带有参数的 WaterTank 构造函数。lambda 接收 Mock 实例和构造上下文，允许我们访问传递给构造函数的参数。这样我们可以使用这些参数为 `getMils()` 方法设置所需的行为

### 在另一个类中模拟构造

更现实的情况是，我们有一个正在测试的类，该类内部创建了一些我们想要模拟的对象。通常情况下，我们会在被测类的构造函数中创建新对象的实例，以便在测试中模拟这些对象。在本例中，我们将了解如何做到这一点

让我们先来定义一个简单的咖啡制作应用程序：

::: tabs

@tab CoffeeMachine

```java
public class CoffeeMachine {

    private Grinder grinder;
    
    private WaterTank tank;

    public CoffeeMachine() {
        this.grinder = new Grinder();
        this.tank = new WaterTank();
    }

    public String makeCoffee() {
        String type = this.tank.isEspresso() ? "Espresso" : "Americano";
        return String.format("Finished making a delicious %s made with %s beans", type, this.grinder.getBeans());
    }
}
```

@tab Grinder

```java
public class Grinder {

    private String beans;

    public Grinder() {
        this.beans = "Guatemalan";
    }

    public String getBeans() {
        return beans;
    }

    public void setBeans(String beans) {
        this.beans = beans;
    }
}
```

@tab WaterTank

```java
public class WaterTank {

    private int mils;

    public WaterTank() {
        this.mils = 25;
    }

    public boolean isEspresso() {
        return getMils() < 50;
    }

    public int getMils() {
        return mils;
    }

    public void setMils(int mils) {
        this.mils = mils;
    }
}
```

:::

在这个示例中，我们的 CoffeeMachine 会在构建时创建磨豆机和咖啡罐。我们有一个 `makeCoffee()` 方法，该方法会打印出关于冲泡咖啡的信息

现在，我们可以继续编写几个测试：

```java
@SpringBootTest
class CoffeeMachineTest {

    @Test
    public void givenNoMockedContructor_whenCoffeeMade_thenRealDependencyReturned() {
        CoffeeMachine machine = new CoffeeMachine();
        System.out.println(coffeeMachine.makeCoffee()); // Finished making a delicious Espresso made with Guatemalan beans
    }
}
```

在第一个测试中，我们将检查当我们不使用 `mockConstruction` 时，我们的咖啡机是否会返回内部的真实依赖关系

现在让我们看看如何返回这些依赖项的模拟：

```java
@SpringBootTest
class CoffeeMachineTest{

    @Test
    public void givenMockedContructor_whenCoffeeMade_thenMockDependencyReturned() {
        try (MockedConstruction<WaterTank> mockTank = Mockito.mockConstruction(WaterTank.class);
             MockedConstruction<Grinder> mockGrinder = Mockito.mockConstruction(Grinder.class)) {

            CoffeeMachine coffeeMachine = new CoffeeMachine();
            WaterTank waterTank = mockTank.constructed().get(0);
            Grinder grinder = mockGrinder.constructed().get(0);

            Mockito.when(waterTank.isEspresso()).thenReturn(false);
            Mockito.when(grinder.getBeans()).thenReturn("Peruvian");
            System.out.println(coffeeMachine.makeCoffee()); // Finished making a delicious Americano made with Peruvian beans
        }
    }
}
```

在此测试中，当我们调用 Grinder 和 WaterTank 的构造函数时，我们使用 `mockConstruction()` 返回模拟实例。然后，我们使用标准的 `when` 符号指定这些模拟的期望值

这一次，当我们运行测试时，Mockito 会确保 Grinder 和 WaterTank 的构造函数返回具有指定行为的模拟实例，从而允许我们隔离测试 `makeCoffee()` 方法

## 私有方法

在实际开发中我们在编写单测覆盖率时可能会遇到私有方法的代码块代难以被覆盖

```java
public class CoffeeMachine {

    private void machine(Grinder grinder, WaterTank waterTank) {
        // ...
    }
}
```

```java
@SpringBootTest
class CoffeeMachineTest {

    private static final Logger log = LoggerFactory.getLogger(CoffeeMachineTest.class);

    @Test
    public void privateTest() {
        try {
            Class<CoffeeMachine> coffeeMachineClass = CoffeeMachine.class;
            Method getSSLSocketFactory = coffeeMachineClass.getDeclaredMethod("machine", Grinder.class, WaterTank.class);
            getSSLSocketFactory.setAccessible(true);
            Grinder grinder = new Grinder();
            WaterTank waterTank = new WaterTank();
            // ...
            getSSLSocketFactory.invoke(coffeeMachineClass.newInstance(), grinder, waterTank);
        } catch (Exception e) {
            log.error("异常", e);
        }
    }
}
```

假如私有方法里还依赖了其他的服务：

```java
@Service
public class CoffeeMachineServiceImpl {

    @Autowired
    private CoffeeMachineRepository coffeeMachineRepository;

    private void infoSave(Grinder grinder, WaterTank waterTank) {
        // ...
        int result = coffeeMachineRepository.save(grinder, waterTank);
    }
}
```

```java
@SpringBootTest
class CoffeeMachineTest {

    private static final Logger log = LoggerFactory.getLogger(CoffeeMachineTest.class);

    @InjectMocks
    private CoffeeMachineServiceImpl coffeeMachineServiceImplMock;
    
    @Mock
    private CoffeeMachineRepository coffeeMachineRepositoryMock;

    @Test
    public void privateTest() {
        try {
            Class<CoffeeMachine> coffeeMachineClass = CoffeeMachine.class;
            Method getSSLSocketFactory = coffeeMachineClass.getDeclaredMethod("infoSave", Grinder.class, WaterTank.class);
            getSSLSocketFactory.setAccessible(true);
            Grinder grinder = new Grinder();
            WaterTank waterTank = new WaterTank();
            // ...
            Mockito.when(coffeeMachineRepositoryMock.save(grinder,waterTank)).thenReturn(0);
            getSSLSocketFactory.invoke(coffeeMachineServiceImplMock, grinder, waterTank);
        } catch (Exception e) {
            log.error("异常", e);
        }
    }
}
```

## 私有变量

`ReflectionTestUtils.setField` 是 Spring 框架提供的一个工具方法，主要用于在测试过程中通过反射设置对象的字段值

假设有一个类 `MyClass`，其中有一个私有字段 `privateField`：

```java
public class MyClass {
    
    private String privateField;

    public String getPrivateField() {
        return privateField;
    }
}
```

在测试类中，可以使用 `ReflectionTestUtils.setField` 来设置这个私有字段的值：

```java
public class MyClassTest {

    @Test
    public void testSetPrivateField() {
        MyClass myObject = new MyClass();
        // 设置私有字段的值
        ReflectionTestUtils.setField(myObject, "privateField", "new value");
    }
}
```

## 重复调用问题

在实际开发中，一个实现类可能会重复调用同一个服务，且每次返回不同的结果：

```java
@Service
public class CoffeeMachineServiceImpl {

    @Autowired
    private CoffeeMachineRepository coffeeMachineRepository;

    public Grinder updateGrinder(String bean) {
        // ...
        Grinder grinder = coffeeMachineRepository.selectGrinderByBean(bean);
        coffeeMachineRepository.updateGrinder(bean);
        Grinder grinder2 = coffeeMachineRepository.selectGrinderByBean(bean);
        // ...
    }
}
```

```java
@SpringBootTest
class CoffeeMachineTest {

    private static final Logger log = LoggerFactory.getLogger(CoffeeMachineTest.class);

    @InjectMocks
    private CoffeeMachineServiceImpl coffeeMachineServiceImplMock;

    @Mock
    private CoffeeMachineRepository coffeeMachineRepositoryMock;
    
    @Test
    public void privateTest() {
        try {
            Grinder grinder = new Grinder();
            grinder.setBean("Peruvian");
            Mockito.when(coffeeMachineRepositoryMock.selectGrinderByBean(Mockito.anyString())).thenReturn(grinder);
            Grinder grinder2 = new Grinder();
            grinder2.setBean("Guatemalan");
            Mockito.when(coffeeMachineRepositoryMock.selectGrinderByBean(Mockito.anyString())).thenReturn(grinder2);
            coffeeMachineServiceImplMock.updateGrinder("test");
        } catch (Exception e) {
            log.error("异常", e);
        }
    }
}
```

如果我们采用以上的 Mock 做法则达不到预期结果，因为程序只会采用最后一次的模拟结果 grinder2，因此我们需要修改成以下的写法，第一次模拟对象返回值是 grinder，第二次则是 grinder2：

```java
@SpringBootTest
class CoffeeMachineTest {

    private static final Logger log = LoggerFactory.getLogger(CoffeeMachineTest.class);

    @InjectMocks
    private CoffeeMachineServiceImpl coffeeMachineServiceImplMock;

    @Mock
    private CoffeeMachineRepository coffeeMachineRepositoryMock;

    @Test
    public void privateTest() {
        try {
            Grinder grinder = new Grinder();
            grinder.setBean("Peruvian");
            Grinder grinder2 = new Grinder();
            grinder2.setBean("Guatemalan");
            Mockito.when(coffeeMachineRepositoryMock.selectGrinderByBean(Mockito.anyString())).thenReturn(grinder, grinder2);
            coffeeMachineServiceImplMock.updateGrinder("test");
        } catch (Exception e) {
            log.error("异常", e);
        }
    }
}
```

## 返回值为空的问题

在实际开发中，可能会遇到 Mock 对象返回值为空的问题。因此我们需要检查 Mock 对象调用方法的入参值在断点调试中是否为空。其次如果方法的返回值为对象，先查看 Mock 对象方法入参类型，如果是对象，则需要使用 `Mockito.any()`，如果参数是 String 类型，使用 `Mockito.anyString()`，以此类推