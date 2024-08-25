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

通过下标来访问，注意 `java.lang.ArrayIndexOutOfBoundsException` 异常

```java
public class ArrayTest {

    public static void main(String[] args) {
        
        int[] arr = {55, 66, 77}; // 数组的第一个元素下标为 0
        System.out.println(arr[3]); // java.lang.ArrayIndexOutOfBoundsException
    }
}
```