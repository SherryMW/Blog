---
category: IT
article: false
order: 4
---

# 封装

现实世界中的封装：液晶电视也是一种封装好的电视设备，它将电视所需的各项零部件封装在一个整体的外壳中，提供给用户一个简单而便利的使用接口，让用户可以轻松的切换频道，调节音量等。液晶电视内部包含了很多复杂的技术，如显示屏、LED 背光模块、电路板、扬声器等等，而这些内部结构对于大多数普通用户来说是不可见的，用户只需要通过遥控器就可以完成对电视的各种设置和操作，这就是封装的好处

封装是一种将数据和方法加以包装，使之变成了一个独立的实体，并且把它与外部对象隔离开来的机制。具体来说，封装是将一个对象的所有“状态（属性）”以及“行为（方法）”统一封装到一个类当中。从而隐藏了对象内部的具体实现细节，向外界提供了有限的访问接口，以实现对对象的保护和隔离

封装通过限制外部对对象内部的直接访问和修改，保证了数据的安全性，提高了代码的可维护性和可复用性

在代码上如何实现封装：属性私有化，对外提供 `getter` 和 `setter` 方法

---

用户类：先不使用封装机制，分析程序存在哪些问题？User 类型对象的 `age` 属性非常不安全，在外部程序中可以对其随意的访问

```java
public class User {

    int age;
}
```

```java
public class UserTest {

    public static void main(String[] args) {
        
        // 创建 User 对象
        User user = new User();

        // 读 访问 user 对象的 age 属性
        System.out.println("年龄：" + user.age); // 0

        // 改
        user.age = 50;

        System.out.println("年龄：" + user.age); // 50

        /**
         目前 User 类没有进行封装，在外部程序中可以对 User 对象的 age 属性进行随意的访问
         这样非常不安全的，因为现实世界中 age 不可能是负数。如果是真正的业务，-100 不应该能够赋值给 age 变量
         */
        user.age = -100;

        System.out.println("年龄：" + user.age); // -100
    }
}
```

为了保证 User 类型对象的 `age` 属性的安全，我们需要使用封装机制，实现封装的步骤是什么？

1. 属性私有化。什么是私有化？使用 `private` 进行修饰。属性私有化的作用是：禁止外部程序对该属性进行随意的访问，所有被 `private` 修饰的，都是私有的，只能在本类中访问

2. 为了保证外部的程序仍然可以访问 `age` 属性，因此要对外提供公开的访问入口。访问一般包括两种：读（读取属性的值）改（修改属性的值）那么应该对外提供两个方法，一个负责读，一个负责修改

    - 读方法的格式 getter ：`public int getAge () {}`

    - 改方法的格式 setter ：`public void setAge (int age) {}`

```java
public class User {

    private int age;

    /**
     读取 age 属性的值
     getter 方法是绝对安全的。因为这个方法是读取属性的值，不会涉及修改操作
     */
    public int getAge() {
        return age;
    }

    /**
     修改 age 属性的值
     setter 方法当中就需要编写拦截过滤代码，来保证属性的安全
     */
    public void setAge(int age) {
        if (age < 0 || age > 100) {
            System.out.println("对不起，您的年龄值不合法！");
            return;
        }
        /**
         this. 大部分情况下可以省略
         this. 什么时候不能省略？用来区分局部变量和实例变量的时候
         Java 有就近原则，此时有两个 age，一个是局部变量 age，一个是实例变量 age，因此需要用 this 来指定实例变量值，如果不用 this，那么程序会使用最近的局部变量 age
         */
        this.age = age;
    }
}
```

```java
public class UserTest {

    public static void main(String[] args) {

        // 创建 User 对象
        User user = new User();

        // 读
        //int age = user.getAge();
        //System.out.println("年龄：" + age); // 0
        System.out.println("年龄：" + user.getAge()); // 0
        
        // 改
        user.setAge(-100); // 修改失败

        System.out.println("年龄：" + user.getAge()); // 0
    }
}
```

定义一个汽车类，包括属性：品牌、价格、颜色等。并对其中的价格属性进行封装，价格不得高于 50 万，不得低于 20 万

```java
public class Car {

    private String brand; // 品牌

    private int price; // 价格

    private String color; // 颜色

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        if (price < 200000 || price > 500000) {
            System.out.println("价格不合理！");
            return;
        }
        this.price = price;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
```

定义一个银行账户类，包含属性：账户名、余额等。并对其中的余额进行封装，余额不得小于 0。另外定义一个取款方法 `withdraw`，判断取款金额是否合法，另外余额是否充足

```java
public class Account {

    private String actno; // 账号

    private double balance; // 余额

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
        if (balance < 0) {
            System.out.println("对不起，银行卡余额不能小于0");
            return;
        }
        this.balance = balance;
    }

    public void withdraw(double money) {
        // 判断取款金额是否合法
        if (money <= 0){
            System.out.println("取款金额得大于零");
            return;
        }
        // 程序执行到这里，说明取款金额是合法的。此时判断余额是否足够取款
        if (balance < money) {
            System.out.println("余额不够");
            return;
        }
        // 程序执行到这里，说明余额充足
        balance -= money;
        System.out.println("取款" + money + "成功");
    }
}
```

```java
public class AccountTest {

    public static void main(String[] args) {

        // 新建账户对象
        Account act = new Account();

        // 给账户属性赋值
        act.setActno("act-001");
        act.setBalance(100000);

        // 读取账户的属性
        System.out.println("账号：" + act.getActno());
        System.out.println("余额：" + act.getBalance());

        //act.setBalance(-1);
        //act.setBalance(0);
        //System.out.println("余额：" + act.getBalance());

        // 取款
        act.withdraw(50000);

        System.out.println("余额：" + act.getBalance());

        // 继续取款
        act.withdraw(50000);
        System.out.println("余额：" + act.getBalance());

        // 继续取款
        act.withdraw(50000);
    }
}
```

定义一个员工类，包含属性：姓名、年龄、工资等。并对其中的工资进行封装，工资不得低于 800 元。另外定义一个 `raise` 方法用来涨薪，如果涨薪后的工资超过了 10000元，则不再涨薪

```java
public class Employee {
    
    private String name; // 姓名
    
    private int age; // 年龄
    
    private double sal; // 工资

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

    public double getSal() {
        return sal;
    }

    public void setSal(double sal) {
        if (sal < 800) {
            System.out.println("工资不能低于800");
            return;
        }
        this.sal = sal;
    }

    public void raise(double money) {
        if ((sal + money) > 10000) {
            System.out.println("对不起，涨薪失败，因为涨薪后的薪资不能超过一万！");
            return;
        }
        sal += money;
        System.out.println("涨薪成功");
    }
    
}
```

```java
public class EmployeeTest {

    public static void main(String[] args) {

        // 创建员工对象
        Employee emp = new Employee();

        // 给属性赋值
        emp.setName("李四");
        emp.setAge(20);
        emp.setSal(9000);

        // 读取属性的值
        System.out.println("姓名：" + emp.getName());
        System.out.println("年龄：" + emp.getAge());
        System.out.println("工资：" + emp.getSal());

        // 涨薪
        emp.raise(1000);
        System.out.println("工资：" + emp.getSal());

        emp.raise(1);
    }
}
```

定义一个顾客类 `Customer`，包括姓名、生日、性别、联系电话等属性。对所有属性进行封装。然后提供一个购物的 `shopping` 方法，再提供一个付款的 `pay` 方法，在 `shopping` 方法中购物，购物行为在结束前需要完成支付，因此在 `shopping` 方法的最后调用 `pay` 方法。体会实例方法中调用实例方法

```java
public class Customer {

    private String name; // 姓名

    private String birth; // 生日

    private boolean gender; // 性别

    private String tel; // 联系电话

    /**
     * 实例方法（因为没有加static）
     * 这种行为动作是需要对象才能触发的。需要对象才能参与的
     */
    public void shopping() {
        //System.out.println(this.name + "正在疯狂购物!!!");
        // this. 大部分情况下是可以省略的
        System.out.println(name + "正在疯狂购物!!!");
        // 最后要结账（调用付款的方法）
        //this.pay();
        // this. 大部分情况下是可以省略的
        pay();
    }

    /**
     以下代码报错的原因是什么
     带 static 关键字的方法，得用 类名. 调用。用类名调的话，就没使用到对象了，没有当前对象，因此就无法使用实例方法和实例变量
     */
//    public static void test() {
//        System.out.println(this.name + "正在疯狂购物!!!");
//        this.pay();
//    }

    // 实例方法
    public void pay() {
        System.out.println(name + "正在付款....");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBirth() {
        return birth;
    }

    public void setBirth(String birth) {
        this.birth = birth;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }
}
```