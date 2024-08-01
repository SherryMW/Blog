---
category: IT
article: false
order: 3
---

# 访问控制权限

|    修饰符    | 同一个类 | 同一个包 | 子类 | 所有类 |
|:---------:|:----:|:----:|:--:|:---:|
|  private  |  √   |      |    |     |
|    缺省     |  √   |  √   |    |     |
| protected |  √   |  √   | √  |     |
|  public   |  √   |  √   | √  |  √  |

- private：私有的，只能在本类中访问

- 缺省：默认的，同一个包下可以访问

- protected：受保护的，子类中可以访问（受保护的通常就是给子孙用的）

- public：公共的，在任何位置都可以访问

- 类中的属性和方法访问权限共有四种：private、缺省、protected、public

- 类的访问权限只有两种：public 和 缺省

- 访问权限控制符不能修饰局部变量

测试 public：

```java
package com.mw.javase.oop1;

public class User {

    // 私有的
    private String name;

    // 缺省的
    int age;

    // 受保护的
    protected String email;

    // 公共的
    public String address;

    public void display() {
        // 本类中都可以访问
        System.out.println(name + age + email + address);
    }
}
```

`Object` 类中的 `clone()` 方法就是使用 protected 修饰的

`protected native Object clone() throws CloneNotSupportedException;`

测试 private：

```java
package com.mw.javase.oop1;

public class Test {

    public static void main(String[] args) {

        User user = new User();
        System.out.println(user.name); // 私有的无法访问（只能在本类中访问）
        System.out.println(user.age); // 缺省的可以访问
        System.out.println(user.email); // 受保护的可以访问
        System.out.println(user.address); // 公共的可以访问
    }
}
```

测试 protected：

```java
package com.mw.javase.oop2;

import com.mw.javase.oop1.User;

public class Vip extends User {

    public void test() {
        System.out.println(this.age); // 缺省的无法访问
        System.out.println(this.email); // 受保护的可以访问（因为 Vip 继承了 User。就算不在同一个包下，只要是子类就可以访问）
    }
}
```