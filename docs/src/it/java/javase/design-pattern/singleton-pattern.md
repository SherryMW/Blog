---
category: IT
article: false
order: 2
---

# 单例模式

单例模式它确保一个类只有一个实例，并提供一个全局访问点

单例模式的应用场景主要有以下几种：

1. 需要频繁实例化然后销毁的对象：如果一个对象需要频繁实例化然后销毁，那么使用单例模式可以节省资源。例如，一个用于生成随机数的对象，如果每次使用都创建一个新的对象，那么会造成资源浪费。使用单例模式，只需要创建一个对象，就可以满足所有需求

2. 创建对象时耗时过多或耗资源过多，但又经常用到的对象：如果一个对象创建时耗时过多或耗资源过多，那么使用单例模式可以提高性能。例如，一个用于访问数据库的对象，如果每次使用都创建一个新的对象，那么会造成数据库连接的频繁建立和销毁，从而降低性能。使用单例模式，只需要创建一个对象，就可以满足所有需求

3. 系统只需要一个实例对象：如果系统只需要一个实例对象，那么使用单例模式可以保证系统的稳定性。例如，一个用于管理系统配置的对象，如果有多个实例，那么可能会导致配置的不一致。使用单例模式，只需要创建一个对象，就可以保证配置的一致性

以下是一些具体的应用示例：

- Windows的任务管理器，只能打开一个任务管理器

- Windows系统的回收站

- 数据库连接池的设计一般也是采用单例模式，因为数据库连接是一种数据库资源。数据库软件系统中使用数据库连接池，主要是节省打开或者关闭数据库连接所引起的效率损耗，这种效率上的损耗还是非常昂贵的，因为可以用单例模式来维护，就可以大大降低这种损耗

- 网站的计数器，一般也是采用单例模式实现，否则难以同步

- 应用程序的日志应用，一般都何用单例模式实现，这一般是由于共享的日志文件一直处于打开状态，因为只能有一个实例去操作，否则内容不好追加

- Web 应用的配置对象的读取，一般也应用单例模式，这个是由于配置文件是共享的资源

需要注意的是，单例模式也有一些缺点，比如：

- 单例模式会导致类的扩展变得困难。因为类只能有一个实例，所以无法通过继承来扩展类的功能

- 单例模式会导致类的测试变得困难。因为类只能有一个实例，所以无法在测试中模拟不同的实例

## 创建单例对象

`Student` 类目前来说肯定不是单例的

```java
public class Student {

}
```

因为它可以创建很多个对象

```java
public class StudentTest {

    public static void main(String[] args) {
        
        Student s1 = new Student();
        System.out.println(s1); // com.mw.javase.Student@2f4d3709

        Student s2 = new Student();
        System.out.println(s2); // com.mw.javase.Student@4e50df2e

        /**
         使用 == 关系运算符可以判断两个对象是否为同一个对象
         int a = 10;
         int b = 10;
         System.out.println(a == b);

         s1 和 s2 实际上有 4 个地址。s1 和 s2 本身有自己的局部变量地址，加上 s1 和 s2 保存的对象地址 
         不管是基本数据类型还是引用数据类型的比较，== 关系运算符比较的是两个变量具体存的值
         a 和 b 存的值都是 10，因此 a == b 为 true
         s1 和 s2 存的是对象的地址，两个地址不一样，不是指向同一个对象，因此 s1 == s2 为 false
         */
        System.out.println(s1 == s2); // false
    }
}
```

如何实现单例？

1. 构造方法私有化

2. 对外提供一个公开的静态方法，用这个方法获取单个实例（因为不能在外部通过实例化来创建对象，所以要使用静态方法进行调用创建）

3. 定义一个静态变量（因为静态方法中不能访问实例变量），在类加载的时候，初始化静态变量（只初始化一次）

### 饿汉式

类加载时对象就创建好了，不管这个对象用还是不用，提前先把对象创建好

```java
public class Singleton {

    private static Singleton singleton = new Singleton(); // 只执行一次，只会创建一个对象

    private Singleton() {
    }

    public static Singleton getInstance(){
        return singleton;
    }
}
```


```java
public class SingletonTest {

    public static void main(String[] args) {
        
        Singleton s1 = Singleton.getInstance();
        System.out.println(s1); // com.mw.javase.Singleton@2f4d3709

        Singleton s2 = Singleton.getInstance();
        System.out.println(s2); // com.mw.javase.Singleton@2f4d3709

        System.out.println(s1 == s2); // true
    }
}
```

### 懒汉式

用到这个对象的时候再创建对象，别在类加载的时候就创建对象

```java
public class Singleton {

    private static Singleton singleton;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (singleton == null) {
            singleton = new Singleton();
            System.out.println("对象创建了"); // 只会输出一次
        }
        return singleton;
    }
}
```

```java
public class SingletonTest {

    public static void main(String[] args) {

        Singleton s1 = Singleton.getInstance();
        System.out.println(s1); // com.mw.javase.Singleton@2f4d3709

        Singleton s2 = Singleton.getInstance();
        System.out.println(s2); // com.mw.javase.Singleton@2f4d3709

        System.out.println(s1 == s2); // true
    }
}
```