---
category: IT
article: false
order: 10
---

# final 关键字

`final` 表示最终的，不可变的

- `final` 修饰的类不能被继承

- `final` 修饰的方法不能被覆盖（重写）

- `final` 修饰的变量，一旦赋值就不能重新赋值

- `final` 修饰的实例变量必须在对象初始化时手动赋值

- `final` 修饰的实例变量一般和 [static](./static.md) 联合使用：称之为常量

- `final` 修饰的引用，一旦指向某个对象后，不能再指向其他对象。但指向的对象内部的数据是可以修改的

我们可以查看 `String` 的源码，`public final class String` 定义 `String` 的时候用的就是 `final`，因此我们写的代码无法继承 `String` 

```java
public class Test {
}

final class MyString extends String { // Cannot inherit from final 'java.lang.String'

}

class SubString extends MyString { // Cannot inherit from final 'com.mw.MyString'

}
```

---

`final` 修饰的方法不能被覆盖（重写）

```java
class A {

    public final void w() {
        System.out.println("我是一个 w 方法，你们无法覆盖");
    }
}

class B extends A {

    public void w() { // 'w()' cannot override 'w()' in 'com.mw.A'; overridden method is final
        System.out.println("我是一个 w 方法，你们无法覆盖");
    }
}
```

---

`final` 修饰的变量，一旦赋值就不能重新赋值

```java
class A {

    public static void main(String[] args) {

        int i = 10;
        i = 100;

        final double Π = 3.14;
        Π = 3.1415926; // Cannot assign a value to final variable 'Π'

        final int k;
        k = 10; // 首次初始化是可以的
        k = 100; // Variable 'k' might already have been assigned to 再次重新赋值是不允许的
    }
}
```

---

`final` 修饰的实例变量必须在对象初始化时手动赋值

实例变量在什么时候有值？在构造方法执行，对象创建的时候系统就已经赋默认值了。因此如果在对象初始化的时候不手动赋值，那么使用 `final` 修饰的实例变量的值就永远是默认值（只能赋值一次，不能修改）

```java
class User {

    final String name; // Variable 'name' might not have been initialized 不允许采用系统默认值
}
```

```java
class User {

    final String name = "zhangsan";
}
```

`final` 修饰的实例变量必须在构造方法执行完之前手动赋上值

```java
class User {

    final String name;

    public User(String name) {
        this.name = name;
    }
}
```

---

`final` 修饰的实例变量不能修改，那么意味着不管创建多少个对象，该类的实例变量的值都是不变的，因此可以配合 `static` 关键字进行使用，这就是著名的“常量”

定义了一个 `Math` 数学类，希望 Π 的值不变，加上 `final` 关键字，给实例变量手动初始化值。这样的设计并不合理。因为每创建一个 `Math` 类型的对象都要给实例变量 Π 开辟空间，所以建议加上 `static` 关键字

```java
class Math {

//    final double Π = 3.1415926;

    public static final double MATH_PATH = 3.1415926;
    
    public static void main(String[] args) {

        new Math();

        new Math();
    }
}
```

---

`final` 修饰的引用

```java
public class Product {

    private String name;

    private double price;

    public Product() {
    }

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
```

`final` 修饰的变量一旦赋值，不能重新赋值，只不过现在的 `product` 的值存的是对象的内存地址，代表指向了一个对象，就不能再指向别的对象了。至于对象里面的属性值是可以修改的，此修改并不影响对象的内存地址

```java
public class Test {

    public static void main(String[] args) {

        final Product product = new Product("test", 10.0);
        product.setName("test2");

        product = new Product(); // Cannot assign a value to final variable 'product'
    }
}
```