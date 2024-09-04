---
category: IT
article: false
order: 14
---

# Object

- `java.lang.Object` 是所有的类的超类。Java 中所有类都实现了这个类中的方法

- `Object` 类是我们学习 JDK 类库的第一个类。通过这个类的学习要求掌握会查阅 API（Application Program Interface 应用程序编程接口）帮助文档

- `toString`：将 Java 对象转换成字符串的表示形式

- `equals`：判断两个对象是否相等

- `hashCode`：返回一个对象的哈希值（十进制），通常作为在哈希表中查找该对象的键值。`Object` 类的默认实现是根据对象的内存地址生成一个哈希码（即将对象的内存地址转换为整数作为哈希值）`hashCode()` 方法是为了 `HashMap`、`Hashtable`、`HashSet` 等集合类进行优化而设置的，以便更快地查找和存储对象

- `finalize`：当 Java 对象被回收时，由 GC 自动调用被回收对象的 `finalize` 方法，通常在该方法中完成销毁前的准备

- `clone`：对象的拷贝（浅拷贝、深拷贝）

    - `protected` 修饰的只能在同一个包下或者子类中访问

    - 只有实现了 `Cloneable` 接口的对象才能被克隆

## toString()

`Object` 类设计 `toString` 方法的目的是什么？将 Java 对象转换成字符串的表示形式

`Object` 类默认实现 `toString` 方法的源码：

```java
package java.lang;

public class Object {

    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

`getClass().getName()`：当前类类名

`hashCode()`：源码为 `public native int hashCode();`，`native` 表示本地方法，底层调用了 C++ 编写的动态链接库程序：xxx.dll。我们只需要关注返回值是十进制的 `int` 类型

`Integer.toHexString(hashCode())`：把 `hashCode()` 返回的十进制值转换为十六进制。该值可以看作是对象的内存地址

```java
public class Date {

    private int year;

    private int month;

    private int day;

    public Date() {
        this(1970, 1, 1);
    }

    public Date(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

}
```

```java
public class Test {

    public static void main(String[] args) {

        Date date = new Date();
        String string = date.toString();
        System.out.println(string); // com.mw.javase.oop.Date@2f4d3709
    }
}
```

`toString()` 方法为什么要重写？如果对 `Object` 类默认实现的 `toString()` 方法输出结果不满意，觉得可读性差，可以对其进行重写：

```java {43-46}
public class Date {

    private int year;

    private int month;

    private int day;

    public Date() {
        this(1970, 1, 1);
    }

    public Date(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    @Override
    public String toString() {
        return this.year + "年" + this.month + "月" + this.day + "日";
    }
}
```

---

此外当 `println(Object x)` 输出的是一个引用的时候，会自动调用 `引用.toString()`：

::: tabs

@tab PrintStream

```java {6}
package java.io;

public class PrintStream extends FilterOutputStream implements Appendable, Closeable {

    public void println(Object x) {
        String s = String.valueOf(x);
        if (getClass() == PrintStream.class) {
            // need to apply String.valueOf again since first invocation
            // might return null
            writeln(String.valueOf(s));
        } else {
            synchronized (this) {
                print(s);
                newLine();
            }
        }
    }
}
```

@tab String

```java {6}
package java.lang;

public final class String {

    public static String valueOf(Object obj) {
        return (obj == null) ? "null" : obj.toString();
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Date date = new Date();
        String string = date.toString();
        System.out.println(string); // 1970年1月1日

        Date date1 = new Date();
        System.out.println(date1); // 1970年1月1日

        Date date2 = null;
        System.out.println(date2); // "null"
        System.out.println((date2 == null) ? "null" : date2.toString()); // "null"
        System.out.println(date2.toString()); // Exception in thread "main" java.lang.NullPointerException
    }
}
```

:::

---

`String` 类有没有重写 `toString` 方法？如果不重写，调用 `Object` 类默认实现的 `toString` 方法就会输出 `java.lang.String@十六进制数`

```java
public class Test {

    public static void main(String[] args) {

        String s = new String("hello world");
        System.out.println(s); // hello world
    }
}
```

说明 `String` 重写了 `toString` 方法

```java
package java.lang;

public final class String {

    public String toString() {
        return this;
    }
}
```

## equals(Object obj)

`Object` 类设计的 `equals` 方法的作用是什么？判断两个对象是否相等。返回值 `true` 代表两个对象相等，`false` 代表两个对象不相等

`Object` 类中对 `equals` 方法的默认实现：

```java
package java.lang;

public class Object {

    public boolean equals(Object obj) {
        return (this == obj);
    }
}
```

`equals` 方法是实例方法（没用 `static` 修饰），哪个对象去调用该方法，那么 `this` 就是指向的就是该对象。如果说 `a.equals(b)`，那么源码中的 `this` 指的就是 `a`，等同于 `return (a == b)`

`==` 运算规则：Java 语言中不会因为 `==` 两边的数据类型不同，不存在基本数据类型就给一套运算规则，引用数据类型就给另外一套规则。而是永远只有一种运算规则【比较两个变量中保存的值是否相等】只不过有的时候这个值是基本数据类型，有的时候这个值是对象的内存地址

例如变量 `a` 和 `b` 的值都为 10，但创建两个变量时虚拟机会给变量开辟对应的空间，有对应的地址值，但 `==` 运算比较的是变量保存的值是否相等

```java
public class Test {

    public static void main(String[] args) {

        int a = 10;
        int b = 10;
        System.out.println(a == b); // true
        int c = 20;
        System.out.println(b == c); // false
    }
}
```

以下代码创建了两个 `Date` 对象，引用变量存的是对象在堆空间里的内存地址，这两个值不相等，因为是两个不同的对象

```java
public class Test {

    public static void main(String[] args) {

        Date date = new Date();
        Date date1 = new Date();
        System.out.println(date); // com.mw.javase.oop.Date@2f4d3709
        System.out.println(date1); // com.mw.javase.oop.Date@4e50df2e
        System.out.println(date.equals(date1)); // false
    }
}
```

因为 `Object` 默认实现的 `equals` 方法比较的是两个对象的内存地址，如果我们希望比较的是对象的内容，只要对象的内容相等，则认为是相等的。此时就可以重写 `equals` 方法：

```java
public class Date {

    private int year;

    private int month;

    private int day;

    public Date() {
        this(1970, 1, 1);
    }

    public Date(int year, int month, int day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    @Override
    public boolean equals(Object obj) {
        /**
         * d1.equals.(d2)
         * this 就是 d1，obj 就是 d2
         */
        if (obj == null) return false; // 如果 this 为空早在外层就报错了，能调用这个方法说明 this 不为空。obj 为空的话那么就是和 this 不相等
        // 能走到这里 obj 一定不是 null
        if (this == obj) return true; // this 和 obj 的内存地址相同，说明是同一个对象
        // 走到这里说明两个对象的内存地址是不相同的，重写 equals 方法的目的就是为了比较对象内容
        // 但是首先得先判断 obj 是否为一个 Date 类型的对象
        if (obj instanceof Date) {
            Date d = (Date) obj;
            return this.year == d.year && this.month == d.month && this.day == d.day;
        }
        return false;
    }
}
```

```java
public class Test {

    public static void main(String[] args) {

        Date date = new Date(1999, 3, 3);
        Date date1 = new Date(1999, 3, 3);
        System.out.println(date.equals(date1)); // true
    }
}
```

### 字符串比较

字符串的比较不能使用 `==`，必须使用 `equals` 方法进行比较

```java
public class Test {

    public static void main(String[] args) {

        String string = new String("hello");
        String string2 = new String("hello");
        // 引用变量存的是对象在堆空间里的内存地址，这两个值不相等，是两个不同的对象。因此使用 == 来比较肯定是 false
        System.out.println(string == string2); // false
    }
}
```

使用 `equals` 来进行比较会发现结果为 `true`

```java
public class Test {

    public static void main(String[] args) {

        String string = new String("hello");
        String string2 = new String("hello");
        System.out.println(string.equals(string2)); // true
    }
}
```

我们知道 `Object` 默认的 `equals` 实现就是使用的 `==` 来比较，现在既然返回 `true`，那么 `String` 类肯定是重写了 `Object` 默认实现的 `equals` 方法

```java
package java.lang;

public final class String {

    public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        return (anObject instanceof String aString) && (!COMPACT_STRINGS || this.coder == aString.coder) && StringLatin1.equals(value, aString.value);
    }
}
```

在高版本的 JDK 当中，字符串底层是用 `byte[]` 来存储的，也就是说一个字符串“abc”会被转换成 `byte[]{ 97, 98, 99 }`

```java
package java.lang;

final class StringLatin1 {

    @IntrinsicCandidate
    public static boolean equals(byte[] value, byte[] other) {
        if (value.length == other.length) { // 长度相等才有比较的意义
            for (int i = 0; i < value.length; i++) {
                if (value[i] != other[i]) { // 只要有一个不相等就返回 false
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
```

---

小练习

::: tabs

@tab User

```java
public class User {

    private String name; // 姓名

    private Address address; // 家庭住址

    public User() {
    }

    public User(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", address=" + address +
                '}';
    }
}
```

@tab Address

```java
public class Address {

    private String city;

    private String street;

    public Address() {
    }

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Override
    public String toString() {
        return "Address{" +
                "city='" + city + '\'' +
                ", street='" + street + '\'' +
                '}';
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Address address = new Address("北京", "大兴");
        User user = new User("张三", address);

        Address address2 = new Address("北京", "大兴");
        User user2 = new User("张三", address2);

        System.out.println(user.equals(user2)); // false
    }
}
```

:::

在不重写 `equals` 方法，此时 `System.out.println(user.equals(user2));` 的结果为 `false`

业务需求觉得：只要人名一样，家庭住址一样，就认为是同一个人

::: tabs

@tab User

```java
public class User {

    private String name; // 姓名

    private Address address; // 家庭住址

    public User() {
    }

    public User(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", address=" + address +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (this == obj) return true;
        if (obj instanceof User) {
            User user = (User) obj;
            /**
             * 字符串 name 要使用 equlas 比较
             * 注意：Address 的 equlas 方法如果不重写的话，那么还是调用 Object 默认实现的 equlas 方法
             */
            return this.name.equals(user.name) && this.address.equals(user.address);
        }
        return false;
    }
}
```

@tab Address

```java
public class Address {

    private String city;

    private String street;

    public Address() {
    }

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Override
    public String toString() {
        return "Address{" +
                "city='" + city + '\'' +
                ", street='" + street + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (this == obj) return true;
        if (obj instanceof Address) {
            Address address = (Address) obj;
            return this.city.equals(address.city) && this.street.equals(address.street);
        }
        return false;
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        Address address = new Address("北京", "大兴");
        User user = new User("张三", address);

        Address address2 = new Address("北京", "大兴");
        User user2 = new User("张三", address2);

        System.out.println(user.equals(user2)); // true
    }
}
```

:::

## hashCode

`hashCode` 返回一个对象的哈希值（十进制），通常作为在哈希表中查找该对象的键值

`Object` 类的默认实现是根据对象的内存地址生成一个哈希码（即将对象的内存地址转换为整数作为哈希值）  

`hashCode()` 方法是为了 `HashMap`、`Hashtable`、`HashSet` 等集合类进行优化而设置的，以便更快地查找和存储对象

```java
package java.lang;

public class Object {

    @IntrinsicCandidate
    public native int hashCode(); // 本地方法，底层调用了 C++ 编写的动态链接库程序：xxx.dll
}
```

测试：

```java
public class Test {

    public static void main(String[] args) {

        Test test = new Test();
        System.out.println(test.hashCode()); // 189568618

        Test test2 = new Test();
        System.out.println(test2.hashCode()); //793589513
    }
}
```

## finalize

`@Deprecated(since="9", forRemoval=true)`：从 JDK9 开始该方法已经过时了，不建议使用

该方法不需要开发者手动去调用，而是由 GC 垃圾回收器负责调用。当一个对象没有引用去指向它的时候，该对象就会在后续被 GC 垃圾回收器给回收释放掉内存空间。在该对象即将被回收时，GC 调用该对象的 `finalize` 方法。

例如当前有个 `a` 对象，该对象即将被 GC 给回收了，GC 会调用 `a.finalize()`

`finalize` 方法的作用可以参考 `static {}` 静态代码块。静态代码块在类加载的时候执行，并且只执行一次，实际上是给开发者准备的一个类加载的时机，如果开发者需要在类加载的时候执行一段代码，就可以把代码写在静态代码块里。同样的思路，`finalize` 方法也是给开发者准备的一个对象回收时机，如果对象在销毁之前还有什么逻辑需要处理的（例如这个对象开了很多个通道链接，那么在对象被销毁的时候，被该对象打开的通道链接就得关闭），那么该逻辑就可以写在 `finalize` 方法体里面，GC 会自动调

```java
package java.lang;

public class Object {

    @Deprecated(since="9", forRemoval=true)
    protected void finalize() throws Throwable { }
}
```

测试：

```java
public class Person {

    @Override
    protected void finalize() throws Throwable {
        System.out.println(this + "即将被回收");
    }
}
```

如果高版本 JDK 遇到 Overrides method that is deprecated and marked for removal in 'java.lang.Object' 的错误，需要在 IDEA 上进行设置

![](https://img.sherry4869.com/blog/it/java/javase/38.png)

虽然说当对象没有被引用后，GC 会自动回收，但需要积攒到一定的量才会触发 GC 垃圾回收器，如果只是少量的几个对象没有被指向引用，是无法测试到的

```java
public class Test {

    public static void main(String[] args) {

        Person person = new Person();
        person = null;
    }
}
```

因此可以写个循环语句创建多个空指向的对象来测试 `finalize` 方法

```java
public class Test {

    public static void main(String[] args) {

        for (int i = 0; i < 10000; i++) {
            Person person = new Person();
            person = null;

            // 建议启动 GC 垃圾回收器
            System.gc();
        }
    }
}
```

com.mw.javase.oop.Person@2e6ffe66即将被回收  
com.mw.javase.oop.Person@3058417a即将被回收  
com.mw.javase.oop.Person@503e0c77即将被回收  
com.mw.javase.oop.Person@48191c43即将被回收

## clone

`clone` 方法作用：对象拷贝。通常在开发中需要保护原对象数据结构。通常复制一份，生成一个新对象，对新对象进行操作

```java
package java.lang;

public class Object {

    @IntrinsicCandidate
    protected native Object clone() throws CloneNotSupportedException; // 受保护的方法，只能给子类使用。且是一个本地方法，底层调用 C++ 动态链接库程序 xx.dll
}
```

测试：

```java
public class User {

    private int age;

    public User() {
    }

    public User(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "age=" + age +
                '}';
    }
}
```

报错原因：`Object` 类中的 `clone` 方法是 `protected` 修饰的，`protected` 修饰的只能在本类、同包、子类中访问

```java
public class Test {

    public static void main(String[] args) {

        User user = new User(20);
        user.clone(); // 'clone()' has protected access in 'java.lang.Object'
    }
}
```

因此在 `User` 本类中是可以调用 `clone` 方法的：

```java {20-22}
public class User {

    private int age;

    public User() {
    }

    public User(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void test() throws CloneNotSupportedException {
        Object clone = this.clone();
    }

    @Override
    public String toString() {
        return "User{" +
                "age=" + age +
                '}';
    }
}
```

因为 `Object` 默认实现的 `clone` 在 `java.lang` 包下，所以想要在自己写的程序中也能调用 `clone` 方法的话，那么必须重写 `clone` 方法：

```java {20-23}
public class User {

    private int age;

    public User() {
    }

    public User(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return "User{" +
                "age=" + age +
                '}';
    }
}
```

```java {7}
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {

        User user = new User();

        Object clone = user.clone();
    }
}
```

但这样做的话 `User` 类和 `Test` 类就必须在同一个包下。因此我们可以把重写的 `clone` 方法的访问修饰符权限升到 `public`

```java {20-23}
public class User {

    private int age;

    public User() {
    }

    public User(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return "User{" +
                "age=" + age +
                '}';
    }
}
```

但运行程序后会发现报了一个异常信息：`Exception in thread "main" java.lang.CloneNotSupportedException: com.mw.javase.oop.User`

凡是参加克隆的对象，必须实现一个标志接口：`Cloneable`

### 浅拷贝

```java {1}
public class User implements Cloneable{

    private int age;

    public User() {
    }

    public User(int age) {
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return "User{" +
                "age=" + age +
                '}';
    }
}
```

```java
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {

        User user = new User(20);
        Object clone = user.clone();
        System.out.println(clone); // User{age=20}

        // 修改克隆后的对象属性值
        User cloneUser = (User) clone;
        cloneUser.setAge(30);
        System.out.println(cloneUser); // User{age=30}
    }
}
```

我们可以看到 `Cloneable` 接口里面没有定义任何方法

Java 中接口包括两大类：

1. 标志型接口，起到标志的作用，例如 JVM 得知 `User` 类实现了 `Cloneable` 接口，那么就知道 `User` 类可以被克隆

2. 普通接口

```java
package java.lang;

public interface Cloneable {
}
```

### 深拷贝

通过以下案例我们得知，浅拷贝是只会复制一个对象，而与之关联的对象就不会再复制。例如只复制了 `User` 对象，但 `User` 对象所关联的 `Address` 对象没有被复制一份出来

::: tabs

@tab User

```java
public class User implements Cloneable{

    private String name;

    private Address address;

    public User() {
    }

    public User(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", address=" + address +
                '}';
    }
}
```

@tab Address

```java
public class Address {

    private String city;

    private String street;

    public Address() {
    }

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Override
    public String toString() {
        return "Address{" +
                "city='" + city + '\'' +
                ", street='" + street + '\'' +
                '}';
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {

        Address address = new Address("北京", "海淀");
        User user1 = new User("张三", address);

        User user2 = (User) user1.clone();

        System.out.println(user1);
        System.out.println(user2);

        user2.getAddress().setCity("天津");
        System.out.println(user1);
        System.out.println(user2);
    }
}
```

User{name='张三', address=Address{city='北京', street='海淀'}}  
User{name='张三', address=Address{city='北京', street='海淀'}}  
User{name='张三', address=Address{city='天津', street='海淀'}}  
User{name='张三', address=Address{city='天津', street='海淀'}}

:::

![](https://img.sherry4869.com/blog/it/java/javase/39.png)

实现深克隆：

::: tabs

@tab User

```java
public class User implements Cloneable {

    private String name;

    private Address address;

    public User() {
    }

    public User(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        // User 要克隆，且与之关联的 Address 对象也需要克隆一份
        User copyUser = (User) super.clone();
        copyUser.setAddress((Address) this.address.clone());
        return copyUser;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", address=" + address +
                '}';
    }
}
```

@tab Address

```java
public class Address implements Cloneable{

    private String city;

    private String street;

    public Address() {
    }

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return "Address{" +
                "city='" + city + '\'' +
                ", street='" + street + '\'' +
                '}';
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) throws CloneNotSupportedException {

        Address address = new Address("北京", "海淀");
        User user1 = new User("张三", address);

        User user2 = (User) user1.clone();

        System.out.println(user1);
        System.out.println(user2);

        user2.getAddress().setCity("天津");
        System.out.println(user1);
        System.out.println(user2);
    }
}
```

User{name='张三', address=Address{city='北京', street='海淀'}}  
User{name='张三', address=Address{city='北京', street='海淀'}}  
User{name='张三', address=Address{city='北京', street='海淀'}}  
User{name='张三', address=Address{city='天津', street='海淀'}}

:::