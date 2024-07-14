---
category: IT
article: false
order: 4
---

# 构造方法

- 构造方法有什么作用？

  - 构造方法的执行分为两个阶段：对象的创建（通过调用构造方法可以完成对象的创建）和对象的初始化（给对象的属性赋值就是对象的初始化）这两个阶段不能颠倒，也不可分割

  - 在 Java 中，当我们使用关键字 `new` 时，就会在内存中创建一个新的对象，虽然对象已经被创建出来了，但还没有被初始化。而初始化则是在执行构造方法体时进行的

- 构造方法如何定义？

  ```text
  [修饰符列表] 构造方法名(形参) {
      构造方法体
  }
  ```

  构造方法名必须和类名一致

  构造方法不需要提供返回值类型，如果提供了返回值类型，那么这个方法就不是构造方法了，而是变成普通方法了

- 构造方法如何调用？

  - new 构造方法名(实参)

  - 构造方法最终执行结束之后，会自动将创建的对象的内存地址返回。但构造方法体中不需要提供 `return` 语句

- 关于无参构造方法：

  - 在 Java 中，如果一个类没有显示的定义任何构造方法，系统会默认提供一个无参构造方法，也被称为缺省构造器。一旦显示的定义了有参构造方法，则缺省构造器将不存在。为了方便对象的创建，建议将缺省构造器显示的定义出来

- 在 Java 中，一个类中可以定义多个构造方法，而且这些构造方法自动构成了方法的重载（overload）

- 构造方法中已经给属性赋值了，为什么还要单独定义 `setter` 方法给属性赋值呢？

  - 在构造方法中赋值是对象第一次创建时属性赋的值。`setter` 方法可以在后期属性的值需要更改时调用

- 关于构造代码块，对象的创建和初始化过程的梳理：

  - `new` 的时候在堆内存中开辟空间，给所有属性赋默认值，完成对象的创建（这个过程是在构造方法体执行前就完成了）

  - 执行构造代码块进行初始化

  - 构造方法体开始执行，标志着开始进行对象的初始化，当构造方法体执行完毕，表示对象初始化完毕

- 构造代码块

  语法格式

  ```text
  {
    
  }
  ```
  
  每次 `new` 对象的时候，都会先执行一次构造代码块。且构造代码块是在构造方法执行之前执行的

- 构造代码块有什么用？如果所有的构造方法在最开始的时候都有相同的一部分代码，不妨将这个公共的代码提取到构造代码块当中，这样代码可以得到复用

```java
public class Student {

    // 构造代码块
    {
        System.out.println("构造代码块执行了");
        System.out.println(this.name); // 这里能够使用 this，说明构造代码块执行之前对象已经创建好了，并且也完成了默认值的赋值
    }

    // 显示的定义无参构造方法
    public Student() {
        System.out.println("Student 类的无参构造方法执行了");
    }

    public Student(String name) {
        this.name = name;
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public Student(String name, int age, boolean sex, String address) {
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.address = address;
    }

    private String name; // 姓名

    private int age; // 年龄

    private boolean sex; // 性别

    private String address; // 家庭住址

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

    public boolean isSex() {
        return sex;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
```

```java
public class ConstructorTest01 {

    public static void main(String[] args) {

        /**
         调用 Student 类的构造方法来完成 Student 类型对象的创建
         以下代码本质上是：通过 new 运算符调用无参数的构造方法来完成对象的实例化
         s1 是一个引用。保存了内存地址指向了堆内存当中的 Student 类型的对象
         这样就完成了学生对象的创建以及初始化
         无参数构造方法没有给属性手动赋值，但是系统会赋默认值
         */
        Student s1 = new Student();

        System.out.println("姓名：" + s1.getName());
        System.out.println("年龄：" + s1.getAge());
        System.out.println("性别：" + (s1.isSex() ? "男" : "女"));
        System.out.println("住址：" + s1.getAddress());

        // 通过调用另一个有参数的构造方法来创建对象，完成对象的初始化
        Student zhangsan = new Student("张三", 20, true, "北京朝阳");
        System.out.println("姓名：" + zhangsan.getName());
        // 修改名字
        zhangsan.setName("张三2");
        System.out.println("姓名：" + zhangsan.getName());
        System.out.println("年龄：" + zhangsan.getAge());
        System.out.println("性别：" + (zhangsan.isSex() ? "男" : "女"));
        System.out.println("住址：" + zhangsan.getAddress());

        Student wangwu = new Student("王五");
        System.out.println("姓名：" + wangwu.getName());
        System.out.println("年龄：" + wangwu.getAge());
        System.out.println("性别：" + (wangwu.isSex() ? "男" : "女"));
        System.out.println("住址：" + wangwu.getAddress());

        Student zhaoliu = new Student("赵六", 30);
        System.out.println("姓名：" + zhaoliu.getName());
        System.out.println("年龄：" + zhaoliu.getAge());
        System.out.println("性别：" + (zhaoliu.isSex() ? "男" : "女"));
        System.out.println("住址：" + zhaoliu.getAddress());
    }
}
```
请定义一个交通工具 Vehicle 类，属性：品牌 brand，速度 speed，尺寸长 length，宽 width，高 height 等。方法：移动 move()，加速 speedUp()，减速 speedDown() 等。最后在测试类中实例化一个交通工具对象，并通过构造方法给它初始化 brand，speed，length，width，height 的值，调用加速，减速的方法对速度进行改变

```java
public class Vehicle {

    public Vehicle() {
    }

    public Vehicle(String brand, int speed, int length, int width, int height) {
        this.brand = brand;
        this.speed = speed;
        this.length = length;
        this.width = width;
        this.height = height;
    }

    /**
     * 移动
     */
    public void move() {
        System.out.println(brand + "正在以" + speed + "迈的速度行驶");
    }

    /**
     * 加速
     */
    public void speedUp() {
        System.out.println("加速10迈");
        speed += 10;
        move();
    }

    /**
     * 减速
     */
    public void speedDown() {
        System.out.println("减速10迈");
        this.speed -= 10;
        move();
    }

    private String brand; // 品牌

    private int speed; // 速度

    private int length; // 长（毫米）

    private int width; // 宽（毫米）

    private int height; // 高（毫米）

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
    
}
```

```java
public class VehicleTest {

    public static void main(String[] args) {

        // 创建交通工具对象
        Vehicle sf90 = new Vehicle("SF90", 0, 5200, 1800, 1500);

        // 加速
        sf90.speedUp();

        // 加速
        sf90.speedUp();

        // 减速
        sf90.speedDown();

        // 单独调用 move() 方法
        sf90.move();
    }
}
```

编写 Java 程序，模拟简单的计算器。定义名为 Number 的类，其中有两个 int 类型属性 n1，n2，属性封装。编写构造方法为 n1 和 n2 赋初始值，再为该类定义 加 add()、减 sub()、乘 mul()、除 div() 等实例方法，分别对两个属性执行加、减、乘、除的运算。在 main 方法中创建 Number 类的对象，调用各个方法，并显示计算结果

```java
public class Number {

    private int n1;

    private int n2;

    public Number() {
    }

    public Number(int n1, int n2) {
        this.n1 = n1;
        this.n2 = n2;
    }

    public void add() {
        System.out.println(n1 + "+" + n2 + "=" + (n1 + n2));
    }

    public void sub() {
        System.out.println(n1 + "-" + n2 + "=" + (n1 - n2));
    }

    public void mul() {
        System.out.println(n1 + "*" + n2 + "=" + (n1 * n2));
    }

    public void div() {
        System.out.println(n1 + "/" + n2 + "=" + (n1 / n2));
    }

    public int getN1() {
        return n1;
    }

    public void setN1(int n1) {
        this.n1 = n1;
    }

    public int getN2() {
        return n2;
    }

    public void setN2(int n2) {
        this.n2 = n2;
    }
}
```

```java
public class NumberTest {

    public static void main(String[] args) {

        // 创建 Number 对象
        Number number = new Number(10, 2);

        // 调用相关方法完成加减乘除
        number.add();
        number.sub();
        number.mul();
        number.div();
    }
}
```

定义一个网络用户类，要处理的信息有用户 id、密码、email 地址。在建立类的实例时，把以上三个信息都作为构造方法的参数输入，其中用户 id 和用户密码是必须的，缺省的 email 地址是用户 id 加上字符串“@powernode.com”

不能定义无参数构造方法，提供两个构造方法：一个是两个参数的：id 和用户密码；一个是三个参数的：id 和用户密码和 email

```java
public class NetworkUser {

    private String userId;

    private String password;

    private String email;

    public NetworkUser(String userId, String password) {
        this.userId = userId;
        this.password = password;
        this.email = this.userId + "@powernode.com";
    }

    public NetworkUser(String userId, String password, String email) {
        this.userId = userId;
        this.password = password;
        this.email = email;
    }

    /**
     * 打印网络用户信息
     */
    public void display() {
        System.out.println("用户ID：" + userId + "，密码：" + password + "，邮箱：" + email);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

```java
public class NetworkUserTest {

    public static void main(String[] args) {

        // 新建网络用户对象
        NetworkUser user1 = new NetworkUser("123456", "abc");

        user1.display();

        NetworkUser user2 = new NetworkUser("789456", "abc123", "lisi@123.com");

        user2.display();
    }
}
```