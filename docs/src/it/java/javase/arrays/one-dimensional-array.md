---
category: IT
article: false
order: 2
---

# 一维数组

一维数组是线性结构的

如何静态初始化一维数组？

- 数据类型[] 变量名 = new 数据类型[]{元素1, 元素2, 元素3...}：`int[] arr = new int[]{55, 67, 22};`

- 数据类型[] 变量名 = {元素1, 元素2, 元素3...}：`int[] arr = {55, 67, 22};` 或者 `int arr[] = {55, 67, 22};`

如果在创建数组对象的时候，提前知道数组中应该具体存储哪些元素，就可以使用静态初始化

```java
public class ArrayTest {

    public static void main(String[] args) {
        
        // 静态初始化一维数组的第一种方式
        int[] arr = new int[]{55, 66, 77};

        // 静态初始化一维数组的第二种方式
        int[] arr2 = {55, 66, 77};
        // C/C++ 的语言风格
        int arr3[] = {55, 66, 77};
        String[] names = {"Jack", "Luck", "Tom"};
    }
}
```

如何访问数组中的元素？

通过下标来访问，注意 `java.lang.ArrayIndexOutOfBoundsException` 数组下标越界异常。例如数组长度一共就 2（第一个元素下标为 0，第二个元素下标为 1），你却访问数组下标为 2 的元素

```java
public class ArrayTest {

    public static void main(String[] args) {
        
        int[] arr = {55, 66, 77}; // 数组的第一个元素下标为 0

        System.out.println(arr[0]); // 访问数组中的第一个元素

        System.out.println(arr[arr.length - 1]); // 访问数组末尾元素
        
        System.out.println(arr[3]); // java.lang.ArrayIndexOutOfBoundsException
    }
}
```

遍历数组：

```java
public class ArrayTest {

    public static void main(String[] args) {
        
        int[] arr = {55, 66, 77};

        // 顺序遍历
        for (int i = 0; i < arr.length; i++) { // 55 66 77
            System.out.println(arr[i]);
        }
        
        // 倒叙遍历
        for (int i = arr.length - 1; i >= 0; i--) {
            System.out.println(arr[i]);
        }
    }
}
```

增强 `for` 循环 / foreach 循环（JDK5 特性）：

`foreach` 语法结构：

```text
for (数组中元素的数据类型 变量名 : 数组名) {

}
注意：变量名代表数组中的当前循环的元素
```


`foreach` 优点：代码简洁，可读性强

`foreach` 缺点：没有下标


```java
public class ArrayTest {

    public static void main(String[] args) {
        
        int[] arr = {55, 66, 77};

        // 顺序遍历
        for (int i : arr) {
            System.out.println(i);
        }
    }
}
```

一维数组的动态初始化：

什么时候使用动态初始化一维数组呢？当创建数组时，不知道数组中具体存储哪些元素，可以使用动态初始化

语法格式：`数据类型[] 变量名 = new 数据类型[长度];`

动态初始化一维数组之后，数组长度确定，数组中存储的每个元素将采用默认值

|  数据类型   |  默认值   |
|:-------:|:------:|
|  byte   |   0    |
|  short  |   0    |
|   int   |   0    |
|  long   |   0L   |
|  float  |  0.0F  |
| double  |  0.0D  |
| boolean | false  |
|  char   | \u0000 |
| 引用数据类型  |  NULL  |

```java
public class ArrayTest {

    public static void main(String[] args) {

        int[] arr = new int[5];
    }
}
```

练一练：

获取 10 个学生成绩，然后把成绩保存在数组中，遍历数组获得学生成绩，最后计算总分和平均分

```java
public class ArrayTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        double[] scores = new double[10];
        int count = 0;
        for (int i = 0; i < scores.length; i++) {
            System.out.print("请输入第" + (i + 1) + "个学生的成绩：");
            double score = scanner.nextDouble();
            scores[i] = score;
            count += score;
        }
        System.out.println(scores.length + "个学生的总分为：" + count);
        System.out.println(scores.length + "个学生的平均分为：" + (count / scores.length));
    }
}
```

当一维数组中存储引用时的内存图？

::: tabs

@tab Animal

```java
public class Animal {
}
```

@tab Bird

```java
public class Bird extends Animal {

    public void fly() {
        System.out.println("鸟儿在飞翔");
    }
}
```

@tab Cat

```java
public class Cat extends Animal {

    public void catchMouse() {
        System.out.println("猫抓老鼠");
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Bird bird = new Bird();
        Cat cat = new Cat();
        /**
         * 创建一个数组，让该数组既可以存储 Bird，又可以存储 Cat
         * 数组中存储的并不是对象本身，实际上是对象在堆内存当中的地址。存储的是引用（因为数组中每个元素分配的空间大小是一样的，所以不可能存的是对象，每个对象的内存空间都不一样）
         */
        Animal[] animals = {bird, cat, new Bird(), new Cat()};

    }
}
```

:::
