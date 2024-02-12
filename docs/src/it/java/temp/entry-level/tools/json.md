---
category: IT
article: false
---

# JSON

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.util.StringUtils;

import java.text.SimpleDateFormat;


public class JsonUtil {

    private static ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.setSerializationInclusion(JsonInclude.Include.ALWAYS); // 设置对象的所有字段全部列入，即使字段为 null 也会被序列化
        objectMapper.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false); // 取消默认转换时间戳形式
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false); // 忽略空对象转换为 JSON 字符串的错误
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")); // 设置所有日期格式为 yyyy-MM-dd HH:mm:ss
        // 忽略 在json字符串中存在，但是在java对象中不存在对应属性的情况。防止错误
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); // 忽略在 JSON 字符串中存在，但在 Java 对象中不存在对应属性的情况，防止反序列化出错
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true); // 置精度的转换问题
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true); // 允许将单个值视为数组
    }

    /**
     * 将对象转换为 JSON 字符串
     */
    public static <T> String obj2String(T obj) {
        if (obj == null) {
            return null;
        }
        try {
            // 如果输入对象已经是字符串类型，则直接返回该字符串；否则使用 objectMapper.writeValueAsString(obj) 将对象序列化为 JSON 字符串
            return obj instanceof String ? (String) obj : objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将对象转换为 JSON 字符串，但生成的 JSON 字符串会格式化，包含换行符，以提高可读性
     * 通常用于测试和学习，不建议在生产环境中使用，因为格式化会增加 JSON 体积和大小
     */
    public static <T> String obj2StringPretty(T obj) {
        if (obj == null) {
            return null;
        }
        try {
            return obj instanceof String ? (String) obj : objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将 JSON 字符串转换为指定类型的对象
     */
    public static <T> T string2Obj(String str, Class<T> clazz) {
        if (StringUtils.isEmpty(str) || clazz == null) {
            return null;
        }
        try {
            // 如果目标类是字符串类型，则直接返回输入字符串；否则使用 objectMapper.readValue(str, clazz) 反序列化 JSON 字符串为目标对象
            return clazz.equals(String.class) ? (T) str : objectMapper.readValue(str, clazz);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 支持泛型集合的反序列化
     */
    public static <T> T string2Obj(String str, Class<?> collectionClass, Class<?>... elementClasses) {
        /**
         * 获取 ObjectMapper 的 TypeFactory 对象。TypeFactory 是 Jackson 中负责构建类型信息的工厂类
         * 通过 TypeFactory 的 constructParametricType 方法构建参数化类型。该方法接受两个参数：
         *    collectionClass: 表示泛型集合的基础类型，即集合的类型，如 List.class
         *    elementClasses: 表示集合中元素的类型，可以是多个类型。在泛型集合中，这些元素类型构成了参数化类型的实际类型参数
         * 例如，如果要构建一个 List<String> 类型的 JavaType 对象，可以使用以下代码：JavaType stringListType = objectMapper.getTypeFactory().constructParametricType(List.class, String.class);
         * 这里，List.class 表示泛型集合的基础类型，而 String.class 表示集合中元素的类型。stringListType 就是一个表示 List<String> 类型的 JavaType 对象
         */
        JavaType javaType = objectMapper.getTypeFactory().constructParametricType(collectionClass, elementClasses);
        try {
            // 反序列化 JSON 字符串为泛型集合
            return objectMapper.readValue(str, javaType);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

调用示例：

```java
import java.util.ArrayList;
import java.util.List;

public class JsonUtilExample {

    public static void main(String[] args) {
        // 示例对象
        Person person = new Person("John Doe", 30, "john@example.com");

        // 1. 对象转为 JSON 字符串
        String jsonString = JsonUtil.obj2String(person);
        System.out.println("JSON String: " + jsonString);

        // 2. 对象转为格式化的 JSON 字符串
        String prettyJsonString = JsonUtil.obj2StringPretty(person);
        System.out.println("Formatted JSON String:\n" + prettyJsonString);

        // 3. JSON 字符串转为对象
        String personJson = "{\"name\":\"Jane Doe\",\"age\":25,\"email\":\"jane@example.com\"}";
        Person parsedPerson = JsonUtil.string2Obj(personJson, Person.class);
        System.out.println("Parsed Person: " + parsedPerson);

        // 4. JSON 字符串转为泛型集合
        String jsonArray = "[{\"name\":\"Alice\",\"age\":28,\"email\":\"alice@example.com\"},{\"name\":\"Bob\",\"age\":35,\"email\":\"bob@example.com\"}]";
        List<Person> personList = JsonUtil.string2Obj(jsonArray, ArrayList.class, Person.class);
        System.out.println("Parsed Person List: " + personList);
    }

    public static class Person {
        private String name;
        private int age;
        private String email;

        public Person() {
        }

        public Person(String name, int age, String email) {
            this.name = name;
            this.age = age;
            this.email = email;
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

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        @Override
        public String toString() {
            return "Person{" + "name='" + name + '\'' + ", age=" + age + ", email='" + email + '\'' + '}';
        }
    }
}
```

打印结果：

```text
JSON String: {"name":"John Doe","age":30,"email":"john@example.com"}
Formatted JSON String:
{
  "name" : "John Doe",
  "age" : 30,
  "email" : "john@example.com"
}
Parsed Person: Person{name='Jane Doe', age=25, email='jane@example.com'}
Parsed Person List: [Person{name='Alice', age=28, email='alice@example.com'}, Person{name='Bob', age=35, email='bob@example.com'}]
```