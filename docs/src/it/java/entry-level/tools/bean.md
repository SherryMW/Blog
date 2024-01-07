---
category: IT
article: false
---

# JavaBean

确保工程中有以下依赖：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
</dependency>
```

## 获取getter和setter

```java
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    private static final Pattern GET_PATTERN = Pattern.compile("^get[A-Z].*");
    private static final Pattern SET_PATTERN = Pattern.compile("^set[A-Z].*");

    /**
     * 获取对象中的所有 getter 方法
     *
     * @param obj 要获取方法的对象
     * @return 包含所有 getter 方法的列表
     */
    public static List<Method> getGetterMethods(Object obj) {
        List<Method> getterMethods = new ArrayList<>();
        Method[] methods = obj.getClass().getMethods();

        for (Method method : methods) {
            Matcher matcher = GET_PATTERN.matcher(method.getName());
            if (matcher.matches() && method.getParameterTypes().length == 0) { // 标准的 getter 方法是不带参数的方法
                getterMethods.add(method);
            }
        }
        return getterMethods;
    }

    /**
     * 获取对象中的所有 setter 方法
     *
     * @param obj 要获取方法的对象
     * @return 包含所有 setter 方法的列表
     */
    public static List<Method> getSetterMethods(Object obj) {
        List<Method> setterMethods = new ArrayList<>();
        Method[] methods = obj.getClass().getMethods();

        for (Method method : methods) {
            Matcher matcher = SET_PATTERN.matcher(method.getName());
            if (matcher.matches() && method.getParameterTypes().length == 1) { // 正则校验以及检查一个方法是否只有一个参数（因为 setter 方法通常只有一个参数，用于设置属性的新值）
                setterMethods.add(method);
            }
        }
        return setterMethods;
    }

    /**
     * 示例用法
     */
    public static void main(String[] args) {
        // 示例用法
        Person person = new Person();
        List<Method> getterMethods = getGetterMethods(person);
        List<Method> setterMethods = getSetterMethods(person);

        System.out.println("Getter 方法:");
        for (Method method : getterMethods) {
            System.out.println("Getter 方法名: " + method.getName());
        }

        System.out.println("Setter 方法:");
        for (Method method : setterMethods) {
            System.out.println("Setter 方法名: " + method.getName());
        }
    }

    /**
     * 示例中的 Person 类
     */
    public static class Person {
        private String name;
        private int age;

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
}
```

打印结果：

```text
Getter 方法:
Getter 方法名: getName
Getter 方法名: getAge
Getter 方法名: getClass
Setter 方法:
Setter 方法名: setName
Setter 方法名: setAge
```

## Map

### JavaBean 转 Map

`BeanMap.create` 用于创建一个能够操作 JavaBean 属性的 `Map`。这个 `Map` 允许你通过键值对的方式访问和修改 JavaBean 对象的属性，而无需直接调用对象的 `getter` 和 `setter` 方法。这个方法返回的 `Map` 类型是 `BeanMap`

```java
import org.springframework.cglib.beans.BeanMap;

public class BeanMapExample {
    
    public static void main(String[] args) throws Exception {
        // 创建一个简单的 JavaBean 对象
        Person person = new Person();
        person.setName("John");
        person.setAge(25);

        // 使用 BeanMap.create 创建 BeanMap
        BeanMap beanMap = BeanMap.create(person);

        // 通过 Map 操作 JavaBean 的属性
        System.out.println("Original Name: " + beanMap.get("name"));

        // 修改属性值
        beanMap.put("name", "Jane");

        // 通过 Map 获取修改后的属性值
        System.out.println("Updated Name: " + beanMap.get("name"));

        // 通过 Map 操作 JavaBean 的其他属性
        System.out.println("Age: " + beanMap.get("age"));
    }

    public static class Person {
        private String name;
        private int age;

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
}
```

### Map 转 JavaBean

`mapToBean` 方法接受一个 `Map` 和目标 `Class`，然后使用反射实例化一个新的 JavaBean 对象，最后通过 `BeanMap.create(bean).putAll(map)` 将 `Map` 中的键值对映射到 JavaBean 对象的属性

```java
import org.springframework.cglib.beans.BeanMap;
import org.springframework.objenesis.instantiator.util.ClassUtils;

import java.util.HashMap;
import java.util.Map;

public class BeanMapExample {

    public static void main(String[] args) throws Exception {
        // 创建一个示例的Map
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("name", "John Doe");
        dataMap.put("age", 30);

        // 调用mapToBean方法将Map映射到一个JavaBean对象
        Person person = mapToBean(dataMap, Person.class);

        // 输出映射后的JavaBean对象的属性值
        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());
    }

    public static <T> T mapToBean(Map<String, ?> map, Class<T> clazz) {
        T bean = ClassUtils.newInstance(clazz);
        BeanMap.create(bean).putAll(map);
        return bean;
    }

    public static class Person {
        private String name;
        private int age;

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
}
```

## List

### JavaBean 转 `List<Map>`

```java
import com.mw.commons.utils.bean.BeanMapUtils;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // 假设有一个包含不同类型对象的列表
        List<Person> peoples = Arrays.asList(new Person("John", 25), new Person("Jane", 30));
        // 调用 beansToMaps 方法进行转换
        List<Map<String, Object>> maps = beansToMaps(peoples);
        // 打印转换后的结果
        for (Map<String, Object> map : maps) {
            System.out.println(map);
        }
    }

    public static <T> List<Map<String, Object>> beansToMaps(List<T> beans) {
        if (CollectionUtils.isEmpty(beans)) {
            return Collections.emptyList();
        }
        /**
         * beans 是一个列表，通过调用 stream() 方法将其转换为流。这样可以使用流操作对列表中的元素进行处理
         * map 是一个中间操作，它接受一个函数作为参数，该函数将每个元素映射到另一个元素。在这里，BeanMapUtils::beanToMap 是一个方法引用，表示将 beanToMap 方法应用于流中的每个元素。这就是说，对于列表中的每个对象，都会调用 beanToMap 方法
         * collect 是一个终端操作，它接受将流元素累积到一个可变结果容器中的收集器。在这里，Collectors.toList() 是一个收集器，用于将流中的元素收集到一个 List 中
         */
        return beans.stream().map(BeanMapUtils::beanToMap).collect(Collectors.toList());
    }

    public static class Person {
        private String name;
        private int age;

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
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
}
```

### `List<Map>` 转 JavaBean

```java
import org.springframework.cglib.beans.BeanMap;
import org.springframework.objenesis.instantiator.util.ClassUtils;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        // 假设有一个包含不同类型的 Map 对象的列表
        List<Map<String, ?>> maps = new ArrayList<>();

        Map<String, Object> map1 = new HashMap<>();
        map1.put("name", "John");
        map1.put("age", 25);

        Map<String, Object> map2 = new HashMap<>();
        map2.put("name", "Jane");
        map2.put("age", 30);

        maps.add(map1);
        maps.add(map2);

        // 调用 mapsToBeans 方法进行转换
        List<Person> people = mapsToBeans(maps, Person.class);
        // 打印转换后的结果
        for (Person person : people) {
            System.out.println("Name: " + person.getName() + ", Age: " + person.getAge());
        }
    }

    public static class Person {
        private String name;
        private int age;

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

    public static <T> List<T> mapsToBeans(List<? extends Map<String, ?>> maps, Class<T> clazz) {
        if (CollectionUtils.isEmpty(maps)) {
            return Collections.emptyList();
        }
        /**
         * maps 是一个列表，通过调用 stream() 方法将其转换为流。这样可以使用流操作对列表中的元素进行处理
         * map 是一个中间操作，它接受一个函数作为参数，该函数将每个流元素映射为另一个元素。在这里，e -> mapToBean(e, clazz) 是一个 Lambda 表达式，表示将 mapToBean 方法应用于流中的每个元素 (e)。这就是说，对于列表中的每个 Map 对象，都会调用 mapToBean 方法，将其转换为指定类型的对象
         * collect 是一个终端操作，它接受将流元素累积到一个可变结果容器中的收集器。在这里，Collectors.toList() 是一个收集器，用于将流中的元素收集到一个 List 中
         */
        return maps.stream().map(e -> mapToBean(e, clazz)).collect(Collectors.toList());
    }

    public static <T> T mapToBean(Map<String, ?> map, Class<T> clazz) {
        T bean = ClassUtils.newInstance(clazz);
        BeanMap.create(bean).putAll(map);
        return bean;
    }
}
```