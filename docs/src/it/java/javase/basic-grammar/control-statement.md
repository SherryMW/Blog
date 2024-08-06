---
category: IT
article: false
order: 10
---

# 控制语句

控制语句：用于控制程序的执行流程，改变程序执行的次序

- 分支语句

  - `if` 语句

  - `switch` 语句

- 循环语句

  - `for` 循环

  - `while` 循环

  - `do while` 循环

- 跳转语句

  - `break` 语句

  - `continue` 语句

## if

`if` 语句的第一种写法：

```text
if (布尔表达式) {
    分支语句
}
```

原理：如果布尔表达式为 `true`，则执行分支语句。如果为 `false`，则不执行

注意：对于 `if` 语句来说，如果分支中只有一条 Java 语句，大括号可以省略，但为了程序的可读性，不建议省略

编写一个程序，输入一个人的年龄 age，如果他的年龄大于等于 18 岁，则输出“你已经成年了”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {
        
        System.out.println("请输入你的年龄：");
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();
        if (age >= 18) {
            System.out.println("你已经成年了");
        }
    }
}
```

---

`if` 语句的第二种写法：

```text
if (布尔表达式) {
    分支语句1
} else {
    分支语句2
}
```

原理：如果布尔表达式为 `true`，则执行分支1，如果为 `false`，则执行分支2

编写一个程序，输入一个学生的分数 score，如果学生的分数大于等于 60，则输出“你已经及格了”，如果学生的分数小于 60，则输出“很抱歉，你不及格”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        System.out.println("请输入你的年龄：");
        Scanner scanner = new Scanner(System.in);
        double score = scanner.nextDouble();
        if (score >= 60) {
            System.out.println("你已经及格了");
        } else {
            System.out.println("很抱歉，你不及格");
        }
    }
}
```

编写一个程序，输入一个数字 num，判断它是否为 7 的倍数。如果是则输出“num 是 7 的倍数”，否则输出“num 不是 7 的倍数”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        System.out.println("请输入一个数字：");
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        if (num % 7 == 0) {
            System.out.println(num + "是7的倍数");
        } else {
            System.out.println(num + "不是7的倍数");
        }
    }
}
```

编写一个程序，输入一个数字 num，判断它是否同时为 3 的倍数和 5 的倍数。如果是则输出“num 既是 3 的倍数又是 5 的倍数”，否则输出“num 不同时是 3 的倍数和 5 的倍数”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        System.out.println("请输入一个数字：");
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        if (num % 3 == 0 && num % 5 == 0) {
            System.out.println(num + "是 3 的倍数和 5 的倍数");
        } else {
            System.out.println(num + "不是 3 的倍数和 5 的倍数");
        }
    }
}
```

编写程序模拟用户登录，用户名和密码正确则登录成功，反之则登录失败（输入用户名是 admin，密码是 abc123，表示登录成功）

注意：字符串的比较不能使用 `==`，必须手动调用 `equals` 方法来进行比较

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.println("欢迎用户使用本系统，请先进行用户登录");
        System.out.print("请输入用户名：");
        String username = s.next();
        System.out.print("请输入密码：");
        String password = s.next();

        if ("admin".equals(username) && "abc123".equals(password)) {
            System.out.println("登录成功");
        } else {
            System.out.println("用户名不存在或密码错误，登录失败");
        }
    }
}
```

---

`if` 语句的第三种写法：

```text
if (布尔表达式) {
    分支语句1
} else if (布尔表达式) {
    分支语句2
} else if (布尔表达式) {
    分支语句3
}
```

原理：从上往下依次判断布尔表达式，只要遇到布尔表达式为 `true`，则执行对应的分支，然后结束整个 `if` 语句。如果布尔表达式都是 `false`，没有分支执行

---

`if` 语句的第四种写法：

```text
if (布尔表达式) {
    分支语句1
} else if (布尔表达式) {
    分支语句2
} else if (布尔表达式) {
    分支语句3
} else {
    分支语句4
}
```

原理：从上往下依次判断布尔表达式，只要遇到布尔表达式为 `true`，则执行对应的分支，然后结束整个 `if` 语句。如果布尔表达式都是 `false`，则执行最后的 `else` 分支

编写一个程序，输入一个数字 num，判断它是否为正数、负数或零，并输出对应的信息。例如，如果 num 是正数，则输出“num 是正数”，如果 num 是负数，则输出“num 是负数”，如果 num 等于 0，则输出“num 等于 0”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        System.out.print("请输入一个数字：");
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        if (num == 0) {
            System.out.println(num + "等于0");
        } else if (num < 0) {
            System.out.println(num + "是负数");
        } else {
            System.out.println(num + "是正数");
        }
    }
}
```

编写一个程序，输入一个学生的分数 score（百分制），根据成绩的不同输出不同的评价

如果学生的分数大于等于 90 分，则输出“你的成绩很优秀”

如果分数大于等于 80 分但小于 90 分，则输出“你的成绩良好”

如果分数大于等于 70 分但小于 80 分，则输出“你的成绩中等”

如果分数大于等于 60 分但小于 70 分，则输出“你的成绩及格”；否则输出“你的成绩不及格”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        System.out.print("请输入一个数字：");
        Scanner scanner = new Scanner(System.in);
        double score = scanner.nextDouble();
        if (score < 0 || score > 100) {
            System.out.println("你输入的成绩不合法");
            return; // 直接结束当前方法
        }
        
        // 程序如果能够执行到这里，说明成绩一定是合法的
        
//        if (score >= 90) {
//            System.out.println("你的成绩很优秀");
//        } else if (score >= 80 && score < 90) {
//            System.out.println("你的成绩良好");
//        } else if (score >= 70 && score < 80) {
//            System.out.println("你的成绩中等");
//        } else if (score >= 60 && score < 70) {
//            System.out.println("你的成绩及格");
//        } else {
//            System.out.println("你的成绩不及格");
//        }
        
        // 第一次改进，如果 score >= 90 布尔表达式为 false，那么 score 一定小于 90，因此 第二个布尔表达式就不需要写 score < 90 了，以此类推
        
//        if (score >= 90) {
//            System.out.println("你的成绩很优秀");
//        } else if (score >= 80) {
//            System.out.println("你的成绩良好");
//        } else if (score >= 70) {
//            System.out.println("你的成绩中等");
//        } else if (score >= 60) {
//            System.out.println("你的成绩及格");
//        } else {
//            System.out.println("你的成绩不及格");
//        }
        
        // 第二次改进
        
        String result = "你的成绩不及格";
        if (score >= 90) {
            result = "你的成绩很优秀";
        } else if (score >= 80) {
            result = "你的成绩良好";
        } else if (score >= 70) {
            result = "你的成绩中等";
        } else if (score >= 60) {
            result = "你的成绩及格";
        }
        System.out.println(result);
    }
}
```

编写一个程序，输入一个年份 year 和一个月份 month，判断这个月份有多少天。判断方法如下：

如果 month 为 1、3、5、7、8、10、12 中的一个，输出“month 有 31 天”

如果 month 为 4、6、9、11 中的一个，输出“month 有 30 天”

如果 month 为 2 并且 year 为闰年，输出“month 有 29 天”（如果一个年份能够被 4 整除但不能被 100 整除，或者能够被 400 整除，那么它就是闰年）

如果 month 为 2 并且 year 不是闰年，输出“month 有 28 天”

```java
import java.util.Scanner;

public class IfTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入年份：");
        int year = scanner.nextInt();
        System.out.println("请输入月份：");
        int month = scanner.nextInt();

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            System.out.println(year + "年" + month + "月有 31 天");
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            System.out.println(year + "年" + month + "月有 30 天");
        } else if (month == 2) {
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                System.out.println(year + "年" + month + "月有 29 天");
            } else {
                System.out.println(year + "年" + month + "月有 28 天");
            }
        }
    }
}
```

## switch

`switch` 语句完整格式：

```text
switch (expression) {
    case value1:
        // 当 expression 的值等于 value1 时，执行这里的代码
        break;
    case value2:
        // 当 expression 的值等于 value2 时，执行这里的代码
        break;
    case value3:
        // 当 expression 的值等于 value3 时，执行这里的代码
        break;
    // ...
    default:
        // 当 expression 的值与所有的 case 语句都不匹配时，执行这里的代码
}
```

其中 `switch (expression)` 中 expression 表达式执行完的结果得是一个值，该值只能是 byte、short、char、int、枚举、字符串类型

`switch` 语句中的 `case` 分支后对比的值必须和 `switch (expression)` 语句中的值是同一类型，或者能够相互转换。该值必须是字面量或 `final` 常量。常量表达式的值在编译时是确定的，这与运行时才确定值的变量不同

`case` 分支可以合并，开发中建议在每个 `case` 分支中都要加上 `break` 语句，以避免 `case` 穿透现象。`break` 语句只要执行，`switch` 语句就会结束

`default` 分支可以放在 `switch` 块的任意位置，但通常建议将 `default` 分支放在所有 `case` 分支的最后面，可读性会更好

`default` 分支不是必须的，但建议写上。在 switch 语句中，一般都应该有一个 `default` 分支，用于处理一些特殊情况，以避免程序报错，提高程序的健壮性

`switch` 语句能做到的，`if` 语句也能做到，但 `if` 语句能做到的，`switch` 语句未必能做到。因为 `switch` 适用于判断固定值，而 `if` 语句适用于判断范围或区间时使用

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        // 编译错误：selector type long is not allowed
        
//         long x = 100L;
//         switch (x) {
//         }

        // 修改
        
//         long x = 100L;
//         switch ((int) x) {
//         }
        
        // ----------

        byte b = 1;
        switch (b) {
        }

        // ----------

        short s = 1;
        switch (s) {
        }

        // ----------

        char c = 'a';
        switch (c) {
        }

        // ----------

        String season = "春季";
        switch (season) {
        }

        // ----------

        // selector type boolean is not allowed
//         boolean sex = true;
//         switch (sex) {
//         }

        // ----------

        /**
         * 编写一个程序，根据输入的月份，输出该月份所属季节
         * 3 4 5 春季
         * 6 7 8 夏季
         * 9 10 11 秋季
         * 12 1 2 冬季
         */
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入月份：");
        
        int month = scanner.nextInt();
//        switch (month) {
//            case 3:
//                System.out.println("春季");
//                break;
//            case 4:
//                System.out.println("春季");
//                break;
//            case 5:
//                System.out.println("春季");
//                break;
//            case 6:
//                System.out.println("夏季");
//                break;
//            case 7:
//                System.out.println("夏季");
//                break;
//            case 8:
//                System.out.println("夏季");
//                break;
//            case 9:
//                System.out.println("秋季");
//                break;
//            case 10:
//                System.out.println("秋季");
//                break;
//            case 11:
//                System.out.println("秋季");
//                break;
//            case 12:
//                System.out.println("冬季");
//                break;
//            case 1:
//                System.out.println("冬季");
//                break;
//            case 2:
//                System.out.println("冬季");
//                break;
//        };
        
        // 优化：case 合并
        
//        switch (month) {
//            case 3:
//            case 4:
//            case 5:
//                System.out.println("春季");
//                break;
//            case 6:
//            case 7:
//            case 8:
//                System.out.println("夏季");
//                break;
//            case 9:
//            case 10:
//            case 11:
//                System.out.println("秋季");
//                break;
//            case 12:
//            case 1:
//            case 2:
//                System.out.println("冬季");
//                break;
//        }
        
        // 优化，增强程序健壮性
        
//        switch (month) {
//            case 3:
//            case 4:
//            case 5:
//                System.out.println("春季");
//                break;
//            case 6:
//            case 7:
//            case 8:
//                System.out.println("夏季");
//                break;
//            case 9:
//            case 10:
//            case 11:
//                System.out.println("秋季");
//                break;
//            case 12:
//            case 1:
//            case 2:
//                System.out.println("冬季");
//                break;
//            default:
//                System.out.println("您输入的季节不存在");
//                return;
//        }
       
        // 优化，提取变量
        
        String season = "您输入的季节不存在";
        switch (month) {
            case 3:
            case 4:
            case 5:
                season = "春季";
                break;
            case 6:
            case 7:
            case 8:
                season = "夏季";
                break;
            case 9:
            case 10:
            case 11:
                season = "秋季";
                break;
            case 12:
            case 1:
            case 2:
                season = "冬季";
                break;
        }
        System.out.println(season);
    }
}
```

`break` 语句减少的话，会发生 `case` 穿透现象：

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入月份：");
        int month = scanner.nextInt();

        switch (month) {
            case 3:
            case 4:
            case 5:
                System.out.println("春季");
            case 6:
            case 7:
            case 8:
                System.out.println("夏季");
            case 9:
            case 10:
            case 11:
                System.out.println("秋季");
                break;
            case 12:
            case 1:
            case 2:
                System.out.println("冬季");
                break;
            default:
                System.out.println("您输入的季节不存在");
                return;
        }
    }
}
```

如果用户输入数字 3，那么控制台会打印：

```text
春季
夏季
秋季
```

因此写 `switch` 语句记得加 `break`，不然会发生 `case` 穿透现象，只有遇到 `break` 语句或者走到 `default` 语句，`switch` 语句才会结束

---

编写一个程序，根据输入的运算符符号，输出两个数的运算结果。例如输入符号为“+”，则输出两个数的和；输入符号为“-”，则输出两个数的差，以此类推

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        System.out.println("欢迎使用简易版的计算器！");
        Scanner s = new Scanner(System.in);
        System.out.print("请输入第一个数字：");
        int num1 = s.nextInt();
        System.out.print("请输入运算符 + - * / % 中的一个：");
        String operator = s.next();
        System.out.print("请输入第二个数字：");
        int num2 = s.nextInt();
        int result = 0;

        switch (operator) {
            case "+":
                result = num1 + num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                result = num1 / num2;
                break;
            case "%":
                result = num1 % num2;
                break;
            default:
                System.out.println("不支持该运算符");
                return;
        }
        System.out.println(num1 + operator + num2 + "=" + result);
    }
}
```

---

编写一个程序，根据输入的成绩，输出对应的等级。例如输入成绩为 90~100，则输出“优秀”；输入成绩为 70~89，则输出“良好”；输入成绩为 60~69，则输出“及格”；输入成绩为 0~59，则输出“不及格”

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        System.out.println("请输入考试成绩：");
        Scanner s = new Scanner(System.in);
        double score = s.nextDouble();

        int grade = (int) (score / 10);

        switch (grade) {
            case 10:
            case 9:
                System.out.println("优秀");
                break;
            case 8:
            case 7:
                System.out.println("良好");
                break;
            case 6:
                System.out.println("及格");
                break;
            default:
                System.out.println("不及格");
        }
    }
}
```

---

编写一个程序，输入一个年份 year 和一个月份 month，判断这个月份有多少天。判断方法如下：

如果 month 为 1、3、5、7、8、10、12 中的一个，输出“month 有 31 天”

如果 month 为 4、6、9、11 中的一个，输出“month 有 30 天”

如果 month 为 2 并且 year 为闰年，输出“month 有 29 天”（如果一个年份能够被 4 整除但不能被 100 整除，或者能够被 400 整除，那么它就是闰年）

如果 month 为 2 并且 year 不是闰年，输出“month 有 28 天”

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入年份：");
        int year = scanner.nextInt();
        System.out.println("请输入月份：");
        int month = scanner.nextInt();

        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                System.out.println(year + "年" + month + "月有 31 天");
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                System.out.println(year + "年" + month + "月有 30 天");
                break;
            default:
                if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                    System.out.println(year + "年" + month + "月有 29 天");
                } else {
                    System.out.println(year + "年" + month + "月有 28 天");
                }
        }
    }
}
```

### JDK 12 新特性

JDK 12 `switch` 语句不需要书写 `break` 语句，该格式无 `case` 穿透现象

```text
switch (expression) {
    case 1 -> {
    }
    
    case 2 -> {
    }
    
    default -> {
    }
}
```

如果 `case` 分支代码只有一行，那么就可以省略大括号

```text
switch (expression) {
    case 1 -> System.out.println(1);
    case 2 -> System.out.println(2);
    default -> System.out.println("default");
}
```

`case` 分支合并写法：

```text
switch (expression) {
    case 1, 2, 3 -> System.out.println("123");
}
```

编写一个程序，输入一个年份 year 和一个月份 month，判断这个月份有多少天。判断方法如下：

如果 month 为 1、3、5、7、8、10、12 中的一个，输出“month 有 31 天”

如果 month 为 4、6、9、11 中的一个，输出“month 有 30 天”

如果 month 为 2 并且 year 为闰年，输出“month 有 29 天”（如果一个年份能够被 4 整除但不能被 100 整除，或者能够被 400 整除，那么它就是闰年）

如果 month 为 2 并且 year 不是闰年，输出“month 有 28 天”

```java
import java.util.Scanner;

public class SwitchTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入年份：");
        int year = scanner.nextInt();
        System.out.println("请输入月份：");
        int month = scanner.nextInt();

        switch (month) {
            case 1, 3, 5, 7, 8, 10, 12 -> System.out.println(year + "年" + month + "月有 31 天");
            case 4, 6, 9, 11 -> System.out.println(year + "年" + month + "月有 30 天");
            default -> {
                if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                    System.out.println(year + "年" + month + "月有 29 天");
                } else {
                    System.out.println(year + "年" + month + "月有 28 天");
                }
            }
        }
    }
}
```

## for

当某段代码片段需要频繁多次执行时，可以采用循环语句

`for` 循环语句的语法结构：

```text
for (初始化表达式; 条件表达式; 更新表达式) {
    循环体;
}
```

初始化表达式最先执行，并且在整个 `for` 循环当中只执行一次

条件表达式的执行结果必须是一个布尔类型的值，要么 `true`，要么 `false`，因为条件表达式直接决定了循环是否继续执行

更新表达式一般是负责更新某个变量值的（防止死循环，因为只有更新了某个变量值，条件表达式才有可能变成 `false`，从而终止循环）

`for` 循环语句执行顺序：

```text
          1            2          4
for (初始化表达式; 条件表达式; 更新表达式) {
    循环体; 3
}

1
2 -> true -> 3 -> 4
2 -> true -> 3 -> 4
2 -> true -> 3 -> 4
2 -> false
```

`for` 后面小括号中的三个表达式都不是必须的，如果说 `for` 循环中三个表达式都不去写，那么就是死循环：

```java
public class ForTest {

    public static void main(String[] args) {

        for (;;) {
            System.out.println("死循环");
        }
    }
}
```

---

```java
public class ForTest {

    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            System.out.print(i + " "); // 0 1 2 3 4 5 6 7 8 9 
        }

        // ----------

        for (int i = 1; i <= 10; i++) {
            System.out.print(i + " "); // 1 2 3 4 5 6 7 8 9 10
        }

        // ----------
        
        for (int i = 10; i > 0; i--) {
            System.out.print(i + " "); // 10 9 8 7 6 5 4 3 2 1 
        }

        // ----------
        
        for (int i = 1; i < 100; i += 10) {
            System.out.print(i + " "); // 1 11 21 31 41 51 61 71 81 91 
        }

        // ----------
        
        for (int i = 100; i > 1; i /= 10) {
            System.out.print(i + " "); // 100 10 
        }
        
        // ----------
        
        int k;
        for (k = 0; k < 10; k++) {
            System.out.print(k + " "); // 0 1 2 3 4 5 6 7 8 9
        }
        System.out.println(k); // 10

        // ----------

        int k = 0;
        for (; k < 10; k++) {
            System.out.print(k + " "); // 0 1 2 3 4 5 6 7 8 9
        }
        System.out.println(k); // 10

        // ----------

        for (int index = 0; index < 10; index++) {
            System.out.print(index + " "); // 0 1 2 3 4 5 6 7 8 9
        }
        // index 变量的作用域在 for 循环语句里，在for 循环语句外访问不了
        System.out.println(index); // 错误：找不到符号
    }
}
```

输出 1~100 中所有的偶数：

```java
public class ForTest {

    public static void main(String[] args) {

        for (int i = 1; i <= 100; i++) {
            if (i % 2 == 0) {
                System.out.println(i);
            }
        }
        
        // 效率高，循环次数较少，而且还不需要使用 if 语句进行判断
        for (int i = 2; i <= 100; i += 2) {
            System.out.println(i);
        }
        
        // 编写程序计算 1~100 所有偶数之和
        int sum = 0;
        for (int i = 2; i <= 100; i += 2) {
            sum += i;
        }
        System.out.println(sum); // 2550
        
        // 编写程序计算 1~100 所有奇数之和
        int sum2 = 0;
        for (int i = 1; i <= 99; i += 2) {
            sum2 += i;
        }
        System.out.println(sum2); // 2500
    }
}
```

输出 100、97、94、91...1：

```java
public class ForTest {

    public static void main(String[] args) {

        for (int i = 100; i >= 1; i -= 3) {
            System.out.println(i);
        }
    }
}
```

计算 n 的阶乘：

```java
import java.util.Scanner;

public class ForTest {

    public static void main(String[] args) {

        System.out.println("请输入一个数字，求该数的阶乘：");
        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        int result = 1;
        for (int i = 1; i <= num; i++) {
            result *= i;
        }
        System.out.println(num + "的阶乘是：" + result); // 120
    }
}
```

## while

`while` 循环语句的语法结构：

```text
while (布尔表达式) {
    循环体;
}
```

执行原理：只要布尔表达式为 `true` 就会一直循环，直到布尔表达式结果为 `false`，循环结束

`while` 循环体的执行次数是：0~n 次

`for` 循环适用于固定的循环次数，`while` 循环适用于不固定的循环次数

```java
public class WhileTest {
    
    public static void main(String[] args) {

//        while (true) {
//            System.out.println("死循环");
//        }

        // 循环体一次都没有执行，因为布尔表达式为 false
        
//        int i = 100;
//        while (i < 100) {
//            System.out.println("i = " + i);
//        }

//        int i = 99;
//        while (i < 100) {
//            System.out.println("i = " + i);
//            i++; // 让 i 值变化，避免死循环
//        }

//        for (int i = 1; i <= 10; i++) {
//            System.out.println("i = " + i);
//        }
        
         // 修改为 while 语句
        
//        int i = 1; // 相当于 for 语句的初始化表达式
//        while (i <= 10) { // 相当于 for 语句的条件表达式
//            System.out.println("i = " + i);
//            i++; // 相当于 for 语句的更新表达式。需要注意 i++ 放的位置，如果放在了 System.out.println("i = " + i); 的上方，那么将会打印输出 2~11，而不是 1~10
//        }
    }
}
```

程序生成 1~100 之间的一个随机数，要求用户猜这个数是多少，程序做出相应的提示，如果猜中了则输出恭喜信息，并记录猜的次数，如果猜错了可以提示用户再猜一次。使用 while 循环实现游戏的主体流程

```java
import java.util.Random;
import java.util.Scanner;

public class WhileTest {

    public static void main(String[] args) {

        // 生成一个随机数
        Random random = new Random();

        // 创建键盘扫描器对象
        Scanner scanner = new Scanner(System.in);

        int randomNum = random.nextInt(101); // 从 1-100 随机一个数字

        // 计数器
        int count = 0;

        while (true) {
            System.out.print("请输入你要猜测的数字：");
            int guess = scanner.nextInt();
            count++;
            if (randomNum == guess) {
                System.out.println("恭喜你，猜中了！共猜测了 " + count + " 次");
                break;
            } else if (guess > randomNum) {
                System.out.println("猜大了");
            } else if (guess < randomNum) {
                System.out.println("猜小了");
            }
        }
    }
}
```

## do-while

`do while` 循环语句的语法结构：

```text
do {
    循环体;
} while (布尔表达式);
```

执行原理：先执行一次循环体，再判断布尔表达式，为 `true` 继续循环，直到布尔表达式为 `false`，循环结束

`do while` 循环体的执行次数是：1~n 次

`do while` 循环比较适合用在不管条件是否成立，第一次必须要执行的业务

```java
public class DoWhileTest {

    public static void main(String[] args) {

        do {
            System.out.println("循环体执行了");
        } while (false);

        // 死循环
        
//        do {
//            System.out.println("循环体执行了");
//        } while (true);
        
        int i = 0;
        do {
            i++; // 打印输出 1~10
            System.out.println("i = " + i);
            // i++; // 打印输出 0~9
        } while (i < 10);
    }
}
```

求平均数：要求用户输入一组数字，用 -1 表示输入结束，使用 `do-while` 循环计算这些数字的平均数并输出。要使用一个计数器来记录输入的数字个数，遇到 -1 则终止输入并计算平均数

```java
import java.util.Scanner;

public class DoWhileTest {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入一组数字，求平均数，-1 表示结束：");
        int num; // 用户输入的数字
        int sum = 0; // 求和结果
        int count = 0; // 计数器

        do {
            num = scanner.nextInt();
            if (num == -1) {
                break;
            }
            count++;
            sum += num;
        } while (true);
        System.out.println("平均数为：" + sum + "/" + count + "=" + (sum / count));
    }
}
```

## break

`break` 语句可以使用在 `switch` 语句当中，终止 `switch` 语句的执行

`break` 语句还可以使用在循环语句（`for` `while` `do-while`）中，用来终止循环体的执行

```java
public class BreakTest {

    public static void main(String[] args) {

        // 控制台输出 1 2 3 4。因为 i 值循环到 5 的时候就使用 break 语句终止掉 for 循环了
        
//        for (int i = 1; i <= 10; i++) {
//            if (i == 5) {
//                break;
//            }
//            System.out.println(i + " ");
//        }

        // 控制台输出 1 2 3 4 1 2 3 4。break 语句默认终止离它最近的循环语句（就近原则）
        
//        for (int j = 0; j < 2; j++) {
//            for (int i = 1; i <= 10; i++) {
//                if (i == 5) {
//                    break;
//                }
//                System.out.println(i + " ");
//            }
//        }

        // 控制台输出 1 2 3 4。给 for 语句打上标记后，break 终止指定的 for 循环语句
        
        f1:
        for (int j = 0; j < 2; j++) {
            f2:
            for (int i = 1; i <= 10; i++) {
                if (i == 5) {
                    break f1;
                }
                System.out.println(i + " ");
            }
        }
    }
}
```

### break 和 return

`break`：终止循环

`return`：终止方法，有两种写法

- return 值

- return;

不管是哪一种写法，只要 return 语句执行了，方法必然结束 

```java
public class BreakTest {

    public static void main(String[] args) {

        // 控制台输出 1 2 3 4 以及 Hello World
        
//        for (int i = 1; i <= 10; i++) {
//            if (i == 5) {
//                break;
//            }
//            System.out.println(i + " ");
//        }
//        System.out.println("Hello World");

        // 控制台输出 1 2 3 4。说明 return 语句终止的不是 for 循环语句，而是整个方法
        
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                return;
            }
            System.out.println(i + " ");
        }
        System.out.println("Hello World");
    }
}
```

## continue

`continue` 语句使用在循环语句（`for` `while` `do-while`）中，用来终止当前本次循环，直接进入下一次循环当中继续执行

```java
public class ContinueTest {

    public static void main(String[] args) {

        // 控制台输出 1 2 3 4 6 7 8。当 i 值等于 5 的时候，continue 语句跳过了本次循环体，continue 后面的代码不执行，直接进入下一次循环
        
//        for (int i = 1; i <= 10; i++) {
//            if (i == 5) {
//                continue;
//            }
//            System.out.println(i + " ");
//        }

        // 控制台输出 1 2 3 4 1 2 3 4。把 continue for1; 替换成 break 语句也可以实现相同的效果，都是把 for2 循环给终止掉了
        
        for1:
        for (int j = 0; j < 2; j++) {
            for2:
            for (int i = 1; i <= 10; i++) {
                if (i == 5) {
                    continue for1;
                }
                System.out.println("i = " + i);
            }
        }
    }
}
```

## 练习题

打印九九乘法表

```java
public class ForTest {

//     1 * 1 = 1	
//     1 * 2 = 2	2 * 2 = 4	
//     1 * 3 = 3	2 * 3 = 6	3 * 3 = 9	
//     1 * 4 = 4	2 * 4 = 8	3 * 4 = 12	4 * 4 = 16	
//     1 * 5 = 5	2 * 5 = 10	3 * 5 = 15	4 * 5 = 20	5 * 5 = 25	
//     1 * 6 = 6	2 * 6 = 12	3 * 6 = 18	4 * 6 = 24	5 * 6 = 30	6 * 6 = 36	
//     1 * 7 = 7	2 * 7 = 14	3 * 7 = 21	4 * 7 = 28	5 * 7 = 35	6 * 7 = 42	7 * 7 = 49	
//     1 * 8 = 8	2 * 8 = 16	3 * 8 = 24	4 * 8 = 32	5 * 8 = 40	6 * 8 = 48	7 * 8 = 56	8 * 8 = 64	
//     1 * 9 = 9	2 * 9 = 18	3 * 9 = 27	4 * 9 = 36	5 * 9 = 45	6 * 9 = 54	7 * 9 = 63	8 * 9 = 72	9 * 9 = 81
    
    public static void main(String[] args) {

        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j + " * " + i + " = " + j * i + "\t");
            }
            System.out.println();
        }
    }
}
```

请设计一个程序，不断的从键盘接收一个正整数或者负整数，要求计算所有正整数的和，如果接收到 0，则程序退出

```java
import java.util.Scanner;

public class ControlTest {

    public static void main(String[] args) {

//        Scanner scanner = new Scanner(System.in);
//        int num, sum = 0;
//        while (true) {
//            System.out.print("请输入一个整数：");
//            num = scanner.nextInt();
//            if (num > 0) {
//                sum += num;
//            } else if (num == 0) {
//                System.out.println("您输入的所有正整数的和是：" + sum);
//                break;
//            }
//        }

        Scanner scanner = new Scanner(System.in);
        int num, sum = 0;
        do {
            System.out.print("请输入一个整数：");
            num = scanner.nextInt();
            if (num > 0) {
                sum += num;
            }
        } while (num != 0);
        System.out.println("您输入的所有正整数的和是：" + sum);

    }
}
```

编写一个程序，打印 1~100 所有的奇数，但跳过所有以数字 3 结尾的数字

```java
public class ControlTest {

    public static void main(String[] args) {

        for (int i = 1; i <= 100; i += 2) {
            if (i % 10 == 3) {
                continue;
            }
            System.out.println(i);
        }
    }
}
```

韩信点兵，三人一组余两人，五人一组余三人，七人一组余四人，请问最少需要多少士兵

```java
public class ControlTest {

    public static void main(String[] args) {

//        int num = 0;
//        while (true) {
//            num++;
//            if (num % 3 == 2 && num % 5 == 3 && num % 7 == 4) {
//                System.out.println(num);
//                break;
//            }
//        }

        int num = 0;
        while (!(num % 3 == 2 && num % 5 == 3 && num % 7 == 4)) {
            num++;
        }
        System.out.println(num);
        
    }
}
```

找出 100 以内的所有质数（能被1和自身整除，不能被其他数字整除的数称之为质数，也叫素数）

```java
public class ForTest {

    public static void main(String[] args) {
        
        // 给出一个数字，起码要判断出这个数字是否为质数
        
//        int num = 7;
//        boolean isPrime = true; // 给一个标记，默认是质数
//        // 因为质数只能被1和自身整除，因此初始化表达式从2开始，条件表达式排除掉自身，把 7 和 2，3，4，5，6 做整除运算，看是否能整除的尽
//        for (int i = 2; i <= num - 1; i++) {
//            if (num % i == 0) {
//                // 能除的尽的就不是质数
//                isPrime = false;
//                break;
//            }
//        }
//        if (isPrime) {
//            System.out.println(num + "是质数");
//        } else {
//            System.out.println(num + "不是质数");
//        }

        // 优化
        
        /**
         * 7 / 2
         * 7 / 3
         * 7 / 4
         * 7 / 5
         * 7 / 6
         * 如果除以的数超过该数的一半，例如 7 去除以 4，5，6，肯定是除不尽的。因此后面这几个数就没必要去做运算了，只需要去除以 7/2 以下的数
         */
//        int num = 7;
//        boolean isPrime = true;
//        for (int i = 2; i <= num / 2; i++) {
//            if (num % i == 0) {
//                isPrime = false;
//                break;
//            }
//        }
//        if (isPrime) {
//            System.out.println(num + "是质数");
//        } else {
//            System.out.println(num + "不是质数");
//        }

        // 找出 100 以内的所有质数
        
//        for (int i = 2; i <= 100; i++) { // 因为 1 不是质数，所以初始化表达式从 2 开始
//            boolean isPrime = true;
//            for (int j = 2; j <= i / 2; j++) {
//                if (i % j == 0) {
//                    // 能除的尽的就不是质数
//                    isPrime = false;
//                    break;
//                }
//            }
//            if (isPrime) {
//                System.out.println(i + "是质数");
//            }
//        }

        // 优化
        
        /**
         * 判断一个数 𝑛 是否为质数，可以通过检查它是否能被小于等于 √𝑛 的所有质数整数。如果 𝑛 不能被这些质数整除，那么 𝑛 就是质数。原因如下：
         * 因数成对出现：任何一个合数（非质数）都可以表示为两个因数的乘积。如果其中一个因数大于 √𝑛，那么另一个因数必然小于 √𝑛（因为两个因数的乘积等于 𝑛）
         * 因此，只需要检查到 √𝑛 为止。如果 𝑛 能小于等于 √𝑛 的某个数整除，那么 𝑛 不是质数，如果不能，则 𝑛 是质数
         * 假设我们要判断 29 是否为质数：
         * 29 的平方根是 5.39。我们只需要检查 2、3、5 是否能整除 29 （这些是小于等于 5 的质数）
         * 29 不能被 2、3、5 整除，所以 29 是质数
         * 这种方法比从 2 检查到 𝑛-1 快得多，因为大大减少了需要检查的数，提高了效率
         */
        for (int i = 2; i <= 100; i++) {
            boolean isPrime = true;
            for (int j = 2; j <= Math.sqrt(i); j++) {
                if (i % j == 0) {
                    // 能除的尽的就不是质数
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                System.out.println(i + "是质数");
            }
        }

    }
}
```

找出 1000 以内的所有质数，输出时每 8 个换一行

```java
public class ForTest {

    public static void main(String[] args) {

        // 定义一个计数器
        int count = 0;
        for (int i = 2; i <= 1000; i++) {
            boolean isPrime = true;
            for (int j = 2; j <= Math.sqrt(i); j++) {
                if (i % j == 0) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                // 计数器加一
                count++;
                System.out.print(i + " ");
                if (count % 8 == 0) {
                    System.out.println();
                }
            }
        }
    }
}
```

输入一个正整数 n，计算 1 - 2 + 3 - 4 + 5 - 6 + ... - (n-1) + n 的和

```java
public class ForTest {

    public static void main(String[] args) {

        int n = 100;
        int result = 0;
        for (int i = 1; i <= n; i++) {
            if (i % 2 == 0) {
                result -= i;
            } else {
                result += i;
            }
        }
        System.out.println("result = " + result);
    }
}
```

输出 1 到 1000 之间既能被 5 整除又能被 3 整除的数，并且每行输出 5 个

```java
public class ForTest {

    public static void main(String[] args) {

        int count = 0;
        for (int i = 1; i <= 1000; i++) {
            if (i % 5 == 0 && i % 3 == 0) {
                count++;
                System.out.print(i + " ");
                if (count % 5 == 0) {
                    System.out.println();
                }
            }
        }
    }
}
```

求 100 到 999 之间的水仙花数。水仙花数的每个位上的数字的 3 次幂之和等于它本身

```java
public class ForTest {

    public static void main(String[] args) {

        for (int i = 100; i <= 999; i++) {
            int a = i % 10; // 个位
            int b = i / 10 % 10; // 十位
            int c = i / 100; // 百位
            if (a * a * a + b * b * b + c * c * c == i) {
                System.out.println(i);
            }
        }
    }
}
```

找 1~100 之间的质数，并输出两两相邻的质数差值等于 2 的质数对

```java
public class ForTest {

    /**
     * (3,5)
     * (5,7)
     * (11,13)
     * (17,19)
     * (29,31)
     * (41,43)
     * (59,61)
     * (71,73)
     */

    public static void main(String[] args) {

//        for (int i = 2; i <= 100; i++) {
//            boolean isPrime = true;
//            for (int j = 2; j <= Math.sqrt(i); j++) {
//                if (i % j == 0) {
//                    isPrime = false;
//                    break;
//                }
//            }
//            if (isPrime) {
//                // 如果计算得出是质数了，然后在此质数基础上加二，判断加二后的数是否为质数
//                int num = i + 2;
//                boolean isPrime2 = true;
//                for (int k = 2; k <= Math.sqrt(num); k++) {
//                    if (num % k == 0) {
//                        isPrime2 = false;
//                        break;
//                    }
//                }
//                if (isPrime2) {
//                    System.out.println("(" + i + "," + num + ")");
//                }
//            }
//        }
        
        // 第二种实现方式

        int a = 0;
        int b = 0;
        for (int i = 2; i <= 100; i++) {
            boolean isPrime = true;
            for (int j = 2; j <= Math.sqrt(i); j++) {
                if (i % j == 0) {
                    isPrime = false;
                }
            }
            if (isPrime) {
                if (a == 0 && b == 0) { // 当得到第一个质数的时候放到变量 a 当中
                    a = i;
                } else if (a != 0 && b == 0) { // 把第二个得到的质数放到变量 b 当中
                    b = i;
                }
                if (a != 0 && b != 0) { // 当 a 和 b 都有值的情况
                    if (i == b && b - a == 2) { // 假设当前 i 值为 5 ，当前 a 是 3，b 是 5，因此 5 - 3 == 2，符合条件
                        System.out.println("(" + a + "," + b + ")");
                    } else if (i - b == 2) { // 假设当前 i 值为 7，i - b（5）== 2，符合条件。把原本 b 的值（5）赋值给 a，把 i 的值（7）赋值给 b
                        a = b;
                        b = i;
                        System.out.println("(" + a + "," + b + ")");
                    } else { // 假设当前 i 值为 11，11 - 7 差值不为 2，因此把 11 赋值给 a，把 b 归零，让下一个质数和 a 进行差值运算
                        a = i;
                        b = 0;
                    }
                }
            }
        }
        
    }
}
```

打印指定图形

```java
public class ForTest {

//     ********
//     ********
//     ********
//     ********
//     ********
    
    public static void main(String[] args) {

        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 8; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
```

```java
public class ForTest {

//         ********
//        ********
//       ********
//      ********
//     ********

    public static void main(String[] args) {

//        for (int i = 1; i <= 5; i++) {
//            for (int j = 1; j <= 5 - i; j++) {
//                System.out.print(" ");
//            }
//            for (int j = 1; j <= 8; j++) {
//                System.out.print("*");
//            }
//            System.out.println();
//        }
        
        // 第二种实现方式
        
        /**
         *         i 值：1  2  3  4  5
         * 每行打印总量：12 11 10 9  8
         * 每行打印空格：4  3  2  1  0
         * 每行打印星星：8  8  8  8  8
         */
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 8 + 5 - i; j++) {
                if (5 - i - j >= 0) {
                    System.out.print(" ");
                } else {
                    System.out.print("*");
                }
            }
            System.out.println();
        }
    }
}
```

```java
public class ForTest {

//         *
//        ***
//       *****
//      *******
//     ********* 
    
    public static void main(String[] args) {

//        for (int i = 1; i <= 5; i++) {
//            for (int j = 1; j <= 5 - i; j++) {
//                System.out.print(" ");
//            }
//            for (int j = 1; j <= i * 2 - 1; j++) {
//                System.out.print("*");
//            }
//            System.out.println();
//        }
        
        // 第二种实现方式

        /**
         *         i 值：1 2 3 4 5
         * 每行打印总量：5 6 7 8 9
         * 每行打印空格：4 3 2 1 0
         * 每行打印星星：1 3 5 7 9
         */
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 4 + i; j++) {
                if (5 - i - j >= 0) {
                    System.out.print(" ");
                } else {
                    System.out.print("*");
                }
            }
            System.out.println();
        }
        
    }
}
```

```java
public class ForTest {

//         1
//        121
//       12321
//      1234321
//     123454321
    
    public static void main(String[] args) {

        for (int i = 1; i <= 5; i++) {
            // 空格
            for (int j = 1; j <= 5 - i; j++) {
                System.out.print(" ");
            }
            // 左侧数字
            for (int j = 1; j <= i; j++) {
                System.out.print(j);
            }
            // 右侧数字
            for (int j = i - 1; j > 0; j--) {
                System.out.print(j);
            }
            System.out.println();
        }
    }
}
```

```java
public class ForTest {

//     *********
//      *******
//       *****
//        ***
//         *
//        ***
//       *****
//      *******
//     *********
    
    public static void main(String[] args) {

        // 打印上半部分
        
//        for (int i = 5; i >= 1; i--) {
//            // 打印空格
//            for (int j = 0; j < 5 - i; j++) {
//                System.out.print(" ");
//            }
//            // 打印 *
//            for (int j = 1; j <= i * 2 - 1; j++) {
//                System.out.print("*");
//            }
//            System.out.println();
//        }
        
        // 打印下半部分
        
//        for (int i = 1; i <= 4; i++) {
//            // 打印空格
//            for (int j = 0; j < 4 - i; j++) {
//                System.out.print(" ");
//            }
//            // 打印 *
//            for (int j = 1; j <= i * 2 + 1; j++) {
//                System.out.print("*");
//            }
//            System.out.println();
//        }
        
        // 第二种实现方式

        for (int i = 1; i <= 9; i++) {
            if (i < 5) {
                /**
                 *         i 值：1 2 3 4 5
                 * 每行打印总量：9 8 7 6 5
                 * 每行打印星星：9 7 5 3 1
                 * 每行打印空格：0 1 2 3 4
                 */
                for (int j = 1; j <= 10 - i; j++) {
                    if (j < i) {
                        System.out.print(" ");
                    } else {
                        System.out.print("*");
                    }
                }
                System.out.println();
            } else {
                /**
                 *         i 值：6 7 8 9
                 * 每行打印总量：6 7 8 9
                 * 每行打印星星：3 5 7 9
                 * 每行打印空格：3 2 1 0
                 */
                for (int j = 1; j <= i; j++) {
                    if (10 - i - j > 0) {
                        System.out.print(" ");
                    } else {
                        System.out.print("*");
                    }
                }
                System.out.println();
            }
        }
    }
}
```

猴子第一天摘下若干个桃子，当即吃了一半，还不过瘾，又吃了一个，第二天早上又将剩下的桃子吃了一半，又多吃了一个，以后每天早上都是吃了前一天剩下的一半零一个，到第 10 天早上再吃的时候，发现只剩一个桃子了，问一共有多少个桃子

```java
public class ForTest {

    /**
     * 假设桃子的总数量是：count
     * 第1天：count = count / 2 - 1
     * 第2天：count = count / 2 - 1
     * 第3天：count = count / 2 - 1
     * 第4天：count = count / 2 - 1
     * 第5天：count = count / 2 - 1
     * 第6天：count = count / 2 - 1
     * 第7天：count = count / 2 - 1
     * 第8天：count = count / 2 - 1
     * 第9天：count = count / 2 - 1
     * 第10天：1
     */
    public static void main(String[] args) {
        int count = 1; // 第10天的桃子数量
        // 因为知道第10天桃子的数量，因此倒推的话只需要循环9次就可以知道桃子总数是多少
        for (int i = 1; i <= 9; i++) {
            count = (count + 1) * 2;
        }
        System.out.println("桃子总数" + count);
    }
}
```

100 个和尚吃了 100 个馒头，100 和尚有大和尚和小和尚，一个大和尚能吃 3 个馒头，三个小和尚吃 1 个馒头，问大和尚和小和尚分别有多少个

```java
public class ForTest {

    public static void main(String[] args) {

//        int steamed = 100; // 馒头总数
//        int big = 0; // 大和尚
//        int small = 0; // 小和尚
//        while (true) {
//            if (steamed != 0 && big + small != 100) {
//                steamed -= 4; // 1个大和尚吃了3个馒头，3个小和尚吃了1个馒头
//                big += 1; // 大和尚+1
//                small += 3; // 小和尚+3
//            } else {
//                break;
//            }
//        }
//        System.out.println("大和尚数量：" + big + "，小和尚数量：" + small);

        // 第二种实现方式
        
        for (int i = 1; i <= 33; i++) { // 大和尚最多只能有33个，因为一共有100个和尚和100个馒头 33*3=99，33个大和尚可以吃99个馒头
            int j = 100 - i; // 小和尚数量
            if (i * 3 + j / 3 == 100) { // 1个大和尚吃3个馒头，三个小和尚吃1个馒头
                System.out.println("大和尚数量：" + i + "，小和尚数量：" + j);
            }
        }
    }
}
```

已知 1 只公鸡 5 元，母鸡 3 元，小鸡 1 元 3 只，问 100 元买 100 只鸡有哪些方案

```java
public class ForTest {

    /**
     * 如果拿 100 元买公鸡，最多买 20 只公鸡
     * 如果拿 100 元买母鸡，最多买 33 只母鸡
     * 如果拿 100 元买小鸡，最多买 300 只小鸡
     */
    public static void main(String[] args) {

        for (int i = 0; i <= 20; i++) { // i 是公鸡的数量，公鸡最多 20 个
            for (int j = 0; j <= 33; j++) { // j 是母鸡的数量，母鸡最多 33 个
                int k = 100 - i - j; // 小鸡的数量
                if (k % 3 == 0) {
                    if (i * 5 + j * 3 + k / 3 == 100) {
                        System.out.println("公鸡数量：" + i + "，母鸡数量：" + j + "，小鸡数量：" + k);
                    }
                }
            }
        }
    }
}
```