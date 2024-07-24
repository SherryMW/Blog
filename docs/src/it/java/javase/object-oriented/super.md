---
category: IT
article: false
order: 9
---

# super 关键字

- `super` 关键字要和 [this](./this.md) 关键字对比来学习。`this` 代表的是当前对象。`super` 代表的是当前对象中的父类型特征

- 因为 `super` 是当前对象中的父类型特征，所以 `super` 是无法使用在静态上下文中的

- `super.` 大部分情况下是可以省略的。什么时候不能省略？当父类和子类中定义了相同的属性（实例变量）或者相同方法（实例方法）时，如果需要在子类中访问父类的属性或方法时，`super.` 不能省略

- `this` 可以单独输出，`super` 不能单独输出：`this` 保存的是当前对象的地址，是一个引用，存储在栈帧的局部变量表里（是变量就可以输出）而 `super` 保存的不是一个内存地址，而是当前对象的父类型特征，不能单独输出（A 可以继承 B，B 可以继承 C，C 可以继承 D，`this` 代表当前对象，而 `super` 对于这种多重继承就无法判断了）

- `super(实参)`：通过子类的构造方法调用父类的构造方法，目的是为了完成父类型特征的初始化

- 当一个构造方法第一行没有显示的调用 `super(实参)`，也没有显示的调用 `this(实参)`，系统会自动调用 `super()`。因此一个类中的无参构造方法建议显示的定义出来

- `super(实参)` 这个语法只能出现在构造方法第一行，和 `this` 一样，因此 `super` 和 `this` 不能共存

- 在 Java 语言中只要 `new` 对象，Object 的无参构造方法一定会执行

::: tabs

@tab Person

```java
public class Person {

    String name; // 姓名

    int age; // 年龄

    String email; // 邮件

    String address; // 地址

    public Person() {
    }

    public Person(String name, int age, String email, String address) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
```

@tab Teacher

```java
public class Teacher extends Person {

    double salary; // 老师特有的属性：工资

    public Teacher() {
    }

    public Teacher(String name, int age, String email, String address, double salary) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
        this.salary = salary;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public void display() {
//        System.out.println(name);
//        System.out.println(age);
//        System.out.println(email);
//        System.out.println(address);
//        System.out.println(salary);

        System.out.println(super.name);
        System.out.println(super.age);
        System.out.println(super.email);
        System.out.println(super.address);
        System.out.println(this.salary);
    }

    public static void test() {
        System.out.println(super.name); // 静态上下文中无法引用 super
        System.out.println(this.salary); // 静态上下文中无法引用 this
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        // 创建 Teacher 对象
        Teacher teacher = new Teacher("张三", 20, "zhangsan@163.com", "北京朝阳", 10000.0);
        teacher.display();
    }
}
```

:::

`super` 代表了什么？当前对象中的父类型特征

`super` 可以看作是当前对象的一部分

因为 `super` 是当前对象中的父类型特征，所以 `super` 是无法使用在静态上下文中的

![](https://img.sherry4869.com/blog/it/java/javase/30.png)

## 什么时候使用 super

假如此时 `Teacher` 类也创建了一个 `name` 属性，那么在 `main` 方法中调用有参构造新建 `Teacher` 对象并初始化的时候，“张三”是赋值给了 `Teacher` 类中的 `name` 属性。此时 `Teacher` 继承的 `Person` 类中的 `name` 也初始化了默认值 `null` 

这里为什么也会给 `Teacher` 继承的 `Person` 类中的 `name` 初始化了默认值？因为 `Teacher` 类中的有参构造第一行默认是 `super();`

`super();` 调用的是父类的无参构造方法，因此就会给属性初始化默认值（调用子类的构造方法会先调用父类的构造方法）

如果在子类中定义了一个在父类中已经定义过的属性/方法，但想在子类中访问父类中已定义过的属性/方法，那么就必须使用 `super`。如果子类中没有定义父类已定义过的属性/方法，那么在子类中不管使用 `this` 或者 `super` 其实都一样，本质都是调用父类的属性/方法

```java {11}
public class Teacher extends Person {

    double salary; // 老师特有的属性：工资
    
    String name; // Teacher 也定义了一个 name 属性

    public Teacher() {
    }

    public Teacher(String name, int age, String email, String address, double salary) {
        super(); // Person 类中的 name 属性会初始化为 null
        this.name = name; // 这里会给 this 当前对象 Teacher 类中的 name 赋值
        this.age = age;
        this.email = email;
        this.address = address;
        this.salary = salary;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public void display() {
        System.out.println(super.name); // null
        System.out.println(super.age); // 20
        System.out.println(super.email); // zhangsan@163.com
        System.out.println(super.address); // 北京朝阳
        System.out.println(this.salary); // 10000.0
    }

}
```

![](https://img.sherry4869.com/blog/it/java/javase/31.png)

---

在 `Person` 类中定义一个 `doSome()` 方法，子类 `Teacher` 重写该方法，重写要求：要求在父类方法的执行基础之上额外再添加一些代码

```java
public class Person {

    String name; // 姓名

    int age; // 年龄

    String email; // 邮件

    String address; // 地址

    public Person() {
    }

    public Person(String name, int age, String email, String address) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
    }

    public void doSome() {
        System.out.println("人类正在干一些事情");
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
```

```java {20}
public class Teacher extends Person {

    double salary; // 老师特有的属性：工资

    public Teacher() {
    }

    public Teacher(String name, int age, String email, String address, double salary) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
        this.salary = salary;
    }

    @Override
    public void doSome() {
        // 重写的要求：要求在父类方法的执行基础之上额外再添加一些代码
        System.out.println("doSome 方法开始执行了");
        super.dosome();
        System.out.println("doSome 方法执行结束了");
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }
    
}
```

---

以下程序中，`CreditAccount` 类继承了 `Account` 类。在子类有参构造方法里给 `actno`、`balance`、`credit` 属性赋值，但在父类 `Account` 里的有参构造已经实现了对 `actno` 和 `balance` 属性赋值的操作（重写编写相同的代码就得不到复用），因此在子类中可以直接调用父类的有参构造方法

```java
public class Account {

    String actno;

    double balance;

    public Account() {
    }

    public Account(String actno, double balance) {
        this.actno = actno;
        this.balance = balance;
    }

    public String getActno() {
        return actno;
    }

    public void setActno(String actno) {
        this.actno = actno;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
```

```java
public class CreditAccount extends Account {
    
    double credit; // 子类特有的属性 信用度: 0.999

    public CreditAccount() {
    }

    public CreditAccount(String actno, double balance, double credit) {
//        this.actno = actno;
//        this.balance = balance;
        // 通过子类的构造方法调用父类的构造方法，引用这个语法的作用：1.代码复用 2.为了“模拟”现实生活中要有儿子得先有父亲 3.给当前对象继承过来的父类型特征进行初始化
        super(actno, balance); // super 语句只能出现在第一行，和 this 一样，因此 super 和 this 不能共存
        this.credit = credit;
    }

    public double getCredit() {
        return credit;
    }

    public void setCredit(double credit) {
        this.credit = credit;
    }
}
```

在实际开发中，`Account` 类中的属性的访问修饰符是定义成 `private` 的，然而一旦定义成 `private`，在子类 `CreditAccount` 的有参构造方法里就不可以写 `this.actno = actno` 或者 `super.actno = actno`。因为父类私有的属性只能在本类中访问。所以此时 `super(actno, balance)` 就派上了用场，可以直接调用父类的有参构造方法进行属性的初始化

---

如果一个类中显示的定义了有参构造方法，那么系统就不再提供默认的无参构造方法

以下程序子类 `CreditAccount` 无参构造方法报错的原因：当一个构造方法第一行没有显示的调用 `super(实参)`，也没有显示的调用 `this(实参)`，系统会自动调用 `super()`。父类 `Account` 的无参构造被注释了，因此报错了

如果不调 `super()`，就不会执行父类的无参构造，如果不执行无参构造，就不会初始化属性的默认值，因此系统会自动调用 `super()`

```java
public class Account {

    String actno;

    double balance;

    /**
    public Account() {
    }
    */

    public Account(String actno, double balance) {
        this.actno = actno;
        this.balance = balance;
    }

    public String getActno() {
        return actno;
    }

    public void setActno(String actno) {
        this.actno = actno;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
```

```java
public class CreditAccount extends Account {
    
    double credit; // 子类特有的属性 信用度: 0.999

    public CreditAccount() {
        // 没有显示的写 super(实参) 时，系统会自动调用 super()
    }

    public CreditAccount(String actno, double balance, double credit) {
        super(actno, balance);
        this.credit = credit;
    }

    public double getCredit() {
        return credit;
    }

    public void setCredit(double credit) {
        this.credit = credit;
    }
}
```

---

验证当不显示写 `super(实参)` 时系统自动调用 `super()`

::: tabs

@tab Account

```java
public class Account {

    String actno;

    double balance;

    public Account() {
        System.out.println("Account 的无参构造方法执行了");
    }

    public Account(String actno, double balance) {
        this.actno = actno;
        this.balance = balance;
    }

    public String getActno() {
        return actno;
    }

    public void setActno(String actno) {
        this.actno = actno;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
```

@tab CreditAccount

```java
public class CreditAccount extends Account {

    double credit; // 子类特有的属性 信用度: 0.999

    public CreditAccount() {
        System.out.println("CreditAccount 的无参构造方法执行了");
    }

    public CreditAccount(String actno, double balance, double credit) {
        super(actno, balance);
        this.credit = credit;
    }

    public double getCredit() {
        return credit;
    }

    public void setCredit(double credit) {
        this.credit = credit;
    }
}
```

@tab Test

```java
public class Test {

    public static void main(String[] args) {

        new CreditAccount();
    }
}
```

Account 的无参构造方法执行了

CreditAccount 的无参构造方法执行了

:::