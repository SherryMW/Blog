---
category: IT
article: false
order: 13
---

# import

java.lang 包下不需要手动引入

`import` 语句只能出现在 `package` 语句之下，class 定义之前

`import` 语句可以编写多个

什么时候必须使用 `import` 语句：A 类中使用 B 类，A 类和 B 类不在同一个包下时，并且 B 类也不属于 java.lang 包，就需要在 A 类中使用 `import` 引入 B 类

`import` 语句可以模糊导入：`java.util.*;`

`import` 静态导入：`import static java.lang.System.*;`（不常用，可读性差）

```java
// 静态导入，将 System 类中的所有静态变量和静态方法全部导入
import static java.lang.System.*;

public class ImportTest {

    public static void main(String[] args) {

        out.println("Hello World");
    }
}
```