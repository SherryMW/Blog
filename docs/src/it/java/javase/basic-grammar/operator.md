---
category: IT
article: false
order: 9
---

# 运算符

优先级：小括号 > ! > 算符运算符 > 关系运算符 > 逻辑运算符 > 赋值运算符

## 算术运算符

\+ ：求和，字符串拼接，正数

\- ：相减，负数

\* ：乘积

\/ ：商（除以）

\% ：取模（求余数）取模公式：x - x / y * y

\++ ：让变量自身加 1

\-- ：让变量自身减 1

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 10;
        int b = +3; // 默认就是正数，不需要加 + 符号也行
        int c = a + b;
        System.out.println(a + "+" + b + "=" + c); // 13
        
        // ----------

        int d = 10;
        int e = -3;
        int f = d - e;
        System.out.println(d + "-(" + e + ")=" + f); // 13
        
        // ----------

		int x = 10;
		int y = 3;
		System.out.println(x + "*" + y + "=" + x * y); // 30

        // ----------

        int m = 10;
        int n = 3;
        System.out.println(m + "/" + n + "=" + m / n); // 3

        // ----------

        int x = 10;
        int y = 3;
        System.out.println(x % y); // 1

        /**
         x - x / y * y
         -10 - (-10) / 3 * 3
         -10 - (-3) * 3
         -10 - (-9)
         -10 + 9
         -1
         */
        x = -10;
        System.out.println(x % y); // -1

        /**
         x - x / y * y
         10 - 10 / (-3) * (-3)
         10 - (-3) * (-3)
         10 - 9
         1
         */
        x = 10;
        y = -3;
        System.out.println(x % y); // 1

        // ----------

        int i = 10;
        // 一元运算符
        i++;
        System.out.println("i = " + i); // 11

        i = 100;
        i--;
        System.out.println("i = " + i); // 99
    }
}
```

### 加一和减一运算符

- ++ 可以出现在变量前，也可以出现在变量后。++i 或者 i++
   
  - 像 ++ 这种运算符，只有一边有操作数，我们把这种运算符称为：一元运算符

  - a + b，这里的 + 两边有两个操作数，所以这种运算符被称为：二元运算符

- 无论 ++ 出现在变量前，还是变量后，执行结束后，都会让变量中的值自加 1

- 当 ++ 出现在变量后，先赋值后自加 1

- 当 ++ 出现在变量前，先自加 1 后赋值

```java
public class OperatorTest {

    public static void main(String[] args) {

        int i = 10;
        i++;
        System.out.println("i = " + i); // 11

        int a = 10;
        ++a;
        System.out.println("a = " + a); // 11
        
        // ----------
        
        int k = 10;
        int f = k++; // 运算原理：先将 k 中的值赋值给 f，然后 k 变量自己再加 1
        System.out.println("k = " + k); // 11
        System.out.println("f = " + f); // 10

        // ----------
        
        int e = 100;
        int x = ++e; // 运算原理：e 变量先自加 1 ，然后把值赋值给变量 x
        System.out.println("e = " + e); // 101
        System.out.println("x = " + x); // 101

        // ----------
        
        int y = 100;
        /**
         System 是一个类（C:\Program Files\Java\jdk-21\lib\src.zip\java.base\java\lang），out 是一个成员变量 public static final PrintStream out = null;
         可以看到这个成员变量是 PrintStream 类（C:\Program Files\Java\jdk-21\lib\src.zip\java.base\java\io）
         因此System.out.println() 相当于 PrintStream.println()
         源码：
         public void println(int x) {
            if (getClass() == PrintStream.class) {
                writeln(String.valueOf(x));
            } else {
                synchronized (this) {
                    print(x);
                    newLine();
                }
            }
         }
         在 System.out.println(y++); 中 y++ 是先把值赋值给 public void println(int x) 的 x 变量，再自加 1
         因此 System.out.println(y++); 相当于：
         int x = y++;
         System.out.println(x);
         */
        System.out.println(y++); // 100
        // 这里输出的是 y 自加 1 后的值了
        System.out.println(y); // 101
        
        // ----------

        int z = 100;
        System.out.println(++z); // 101
        System.out.println(z); // 101
        
    }
}
```

### 练习题

```java
public class OperatorHomework {

    public static void main(String[] args) {
        
        int a = 5;
        int b = a++;
        b = a++;
        System.out.println("a = " + a); // 7
        System.out.println("b = " + b); // 6 

        // ----------
        
        int c = 10;
        int d = --c;
        System.out.println("c = " + c); // 9
        System.out.println("d = " + d); // 9
    }
}
```

```java
public class OperatorHomework {

    public static void main(String[] args) {
        
        int i = 10;
        int k = i++ + ++i;
        System.out.println(k); // 22

        // ----------
        
        int f = 10;
        int m = f++ + f;
        System.out.println(m); // 21
        System.out.println(f); // 11
    }
}
```

```java
public class OperatorHomework {
    
    public static void main(String[] args) {
        
        int i = 10;
        i = i++;
        System.out.println(i); // 10（底层实现原理，实际上是找了一个临时的变量，将 10 先存起来一份。再做 ++，最后将 10 再重新覆盖掉 11）

        // 相当于
        int x = 10;
        int temp = x;
        x++;
        x = temp;
        
        // ----------
        
        int j = 10;
        j = ++j;
        System.out.println(j); // 11
    }
}
```

从键盘上接收一个整数三位数，请分别输出它的个位、十位、百位：

```java
public class OperatorHomework {
    
    public static void main(String[] args) {
        
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        System.out.print("请输入一个三位数："); // 123
        int num = scanner.nextInt();

        System.out.println("个位：" + num % 10); // 3
        System.out.println("十位：" + num / 10 % 10); // 2
        System.out.println("百位：" + num / 100); // 1
    }
}
```

681 分钟是多少个小时+多少分钟：

```java
public class OperatorHomework {
    
    public static void main(String[] args) {
        
        int total = 681;

        int h = total / 60;

        int m = total % 60;

        System.out.println(total + "分钟是" + h + "小时" + m + "分钟");
    }
}
```

## 关系运算符

关系运算符又叫比较运算符。主要包括：

\>：大于

\>=：大于等于

\<：小于

\<=：小于等于

\==：等于，比较两个值是否相等

\!=：不等于

所有关系运算符的运算结果都是布尔类型，不是 true 就是 false

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 10;
        int b = 10;
        System.out.println(a > b); // false
        System.out.println(a >= b); // true
        System.out.println(a < b); // false
        System.out.println(a <= b); // true
        System.out.println(a == b); // true
        System.out.println(a != b); // false
    }
}
```

## 逻辑运算符

逻辑运算符两边操作数要求是布尔类型，并且最终运算结果也是一个布尔类型

\&：逻辑与，两边操作数都是 true，结果才为 true；只要其中一边的操作数是 false，结果就是 false。可以翻译成“并且”

\|：逻辑或，两边操作数只要有一个是 true，结果就是 true；两边操作数都是 false，结果就是 false。可以翻译成“或者”

\!：逻辑非，`!false` 结果就是 true，`!true` 结果就是 false

\^：逻辑异或，两边操作数不一样，结果就是 true，例如 `true ^ false` 或者 `false ^ true`

\&&：短路与，和逻辑与的运算结果相同，只是存在一种短路现象（当左边操作数为 false 时，右边操作数不执行）

\||：短路或，和逻辑或的运算结果相同，只是存在一种短路现象（当左边操作数为 true 时，右边操作数不执行）

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 100;
        int b = 99;

        System.out.println(a > b & a > ++b); // false
        
        // ----------

        System.out.println(true & true); // true
        System.out.println(true & false); // false
        System.out.println(false & true); // false
        System.out.println(false & false); // false

        // ----------

        System.out.println(true | true); // true
        System.out.println(true | false); // true
        System.out.println(false | true); // true
        System.out.println(false | false); // false

        // ----------
        
        System.out.println(!false); // true
        System.out.println(!true); // false

        // ----------
        
        System.out.println(true ^ false); // true
        System.out.println(false ^ true); // true
        System.out.println(true ^ true); // false
        System.out.println(false ^ false); // false
        
        // ----------

        int x = 99;
        int y = 100;
        // 逻辑与 &
        System.out.println(x > y & x > ++y);
        System.out.println("y = " + y); // 101
        
        int x2 = 99;
        int y2 = 100;
        // 短路与 &&
        System.out.println(x2 > y2 && x2 > ++y2);
        System.out.println("y2 = " + y2); // 100
        
    }
}
```

## 按位运算符

按位运算符用于在二进制位级别上处理整数数据，主要包括：

\<<：左移

\>>：右移

\>>>：无符号右移

\&：按位与

\|：按位或

\^：按位异或

\~：按位取反

注意：按位运算符的操作数必须是整数，否则会出现编译错误

### 左移 <<

它能够将一个二进制数的所有位向左移动指定的位数。左移运算符的运算规则如下：

1. 将二进制数左移 n 位，相当于将数值乘以 2 的 n 次方

    例如，将二进制数 0b1011 左移 2 位，即为 0b101100，相当于将 11 乘以 2 的 2 次方（即 4）得到 44

2. 左移运算符不会改变操作数的符号。左移后，右补 0

3. 左移运算符会对溢出进行截断

```java
public class OperatorTest {

    public static void main(String[] args) {

        /**
         原码：00000000 00000000 00000000 00000001
         反码：00000000 00000000 00000000 00000001
         补码：00000000 00000000 00000000 00000001
    左移 3 位：00000000 00000000 00000000 00001000（补码）
         */
        int a = 1;
        System.out.println(a << 3); // 8（1 * 2 的 3 次方）
        
        // --------

        /**
         原码：00000000 00000000 00000000 10000000
         反码：00000000 00000000 00000000 10000000
         补码：00000000 00000000 00000000 10000000
    左移 2 位：00000000 00000000 00000010 00000000
         */
        int b = 128;
        System.out.println(b << 2); // 512（128 * 2 的 2 次方）

        // ----------

        /**
         原码：10000000 00000000 00000000 01100100
         反码：11111111 11111111 11111111 10011011
         补码：11111111 11111111 11111111 10011100
    左移 2 位：11111111 11111111 11111110 01110000（补码）
         原码：10000000 00000000 00000001 10010000
         */
        int c = -100;
        System.out.println(c << 2); // -400（-100 * 2 的 2 次方）
        
        // ----------
        
        // 怎么让 2 快速 变成 8
        int x = 2;
        System.out.println(x << 2);
        
    }
}
```

### 右移 >>

它能够将一个二进制数的所有位向右移动指定的位数。右移运算符的运算规则如下：

1. 将二进制数右移 n 位，相当于将数值除以 2 的 n 次方

    例如，将二进制数 0b101100 右移 2 位，即为 0b001011，相当于将 44 除以 2 的 2 次方（即 4）得到 11

2. 右移运算符对正数、负数和零的处理方式不同

    对于正数，符号位不变，右移时左补 0

    对于负数，符号位不变，右移时左补 1

    对于零，右移运算符操作后结果仍为零

3. 右移运算符会对溢出进行截断

```java
public class OperatorTest {

    public static void main(String[] args) {

        /**
         原码：00000000 00000000 00000000 00000001
         反码：00000000 00000000 00000000 00000001
         补码：00000000 00000000 00000000 00000001
    右移 2 位：00000000 00000000 00000000 00000000（补码）
         */
        int a = 1;
        System.out.println(a >> 1); // 0
        
        // ----------

        /**
         原码：00000000 00000000 00000000 10000000
         反码：00000000 00000000 00000000 10000000
         补码：00000000 00000000 00000000 10000000
    右移 4 位：00000000 00000000 00000000 00001000（补码）
         */
        int b = 128;
        System.out.println(b >> 4); // 8（128 / 2 的 4 次方）
        
        // ----------

        /**
         原码：10000000 00000000 00000000 10000000
         反码：11111111 11111111 11111111 01111111
         补码：11111111 11111111 11111111 10000000
    右移 4 位：11111111 11111111 11111111 11111000（补码）
         原码：10000000 00000000 00000000 00001000
         */
        int c = -128;
        System.out.println(b >> 4); // -8（-128 / 2 的 4 次方）
    }
}
```

### 无符号右移 >>>

它能够将一个二进制数的所有位向右移动指定的位数，而不考虑符号位。无符号右移运算符的运算规则如下：

1. 将二进制数右移 n 位，相当于将数值除以 2 的 n 次方，并将最高位填充为 0

2. 任意一个数字经过无符号右移之后，最终结果一定是非负数（0 或正整数）

3. 无符号右移运算符对溢出进行截断

```java
public class OperatorTest {

    public static void main(String[] args) {

        /**
         原码：10000000
         反码：11111111
         补码：10000000
    右移 2 位：00100000
         */
        byte b = -128;
        /**
         为什么输出结果不是 32？
         b >>> 2
         byte 和 int 类型做混合运算。会先将 byte 转换成 int，再做运算
         int b = -128;
         原码：10000000 00000000 00000000 10000000
         反码：11111111 11111111 11111111 01111111
         补码：11111111 11111111 11111111 10000000
    右移 2 位：00111111 11111111 11111111 11100000（补码）
         */
        System.out.println(0b00111111111111111111111111100000); // 1073741792
        
        System.out.println(b >>> 2); // 1073741792

        /**
         强制转换成 byte 类型，依旧是先算 b >>> 2，结果为 00111111 11111111 11111111 11100000
         转换成 byte，从 4 个字节转换成 1 个字节，去掉前面 3 个字节，剩下 11100000（补码）
         补码再转换成原码：11100000 取反 10011111 加一 10100000 最后结果为 -32
         */
        System.out.println((byte) (b >>> 2)); // -32
        
        // ----------

        /**
         原码：10000000 00000000 00000000 01011010
         反码：11111111 11111111 11111111 10100101
         补码：11111111 11111111 11111111 10100110
    右移 3 位：00011111111 11111111 11111111 10100（补码）
         */
        int x = -90;
        System.out.println(0b00011111111111111111111111110100); // 536870900
        System.out.println(x >>> 3); // 536870900

        /**
         原反补码：00000000 00000000 00000000 01011010
        右移 3 位：00000000 00000000 00000000 00001011
         */
        int y = 90;
        System.out.println(y >>> 3); // 11
    }
}
```

### 按位与 &

将两个整数的二进制表示按位进行与运算，只有当相应的二进制位都为 1 时，结果才为 1，否则结果为 0

1 & 1 -> 1

1 & 0 -> 0

0 & 1 -> 0

0 & 0 -> 0

```java
public class OperatorTest {

    public static void main(String[] args) {
        
        int a = 35; // 00100011

        int b = 26; // 00011010

        /**
         00100011
       & 00011010
       ----------
         00000010  
         */
        System.out.println(a & b); // 2
        
        // ----------

        /**
         怎么判断一个数字是否为奇数？
         1：对 2 取模，结果不为 0，表示该数字为奇数
         2：和数字 1 进行按位与操作，结果是 1，表示该数字为奇数
         */
        int num = 35;

        if (num % 2 != 0) {
            System.out.println(num + "是奇数");
        }

        /**
         00100011
       & 00000001
       ----------
         00000001
         */
        if ((num & 1) == 1) {
            System.out.println(num + "是奇数");
        }
        
    }
}
```

### 按位或 |

将两个整数的二进制表示按位进行或运算，只有当相应的二进制位都为 0 时，结果才为 0，否则结果为 1

1 | 1 -> 1
1 | 0 -> 1
0 | 1 -> 1
0 | 0 -> 0

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 35; // 00100011
        
        int b = 27; // 00011011

        /**
         00100011
       | 00011011
       ----------
         00111011
         */
        System.out.println(a | b); // 59
        
        // ----------

        /**
         具体应用：设置标识位
         将 0 这个数字的二进制位低位第 4 个二进制位设置为 1
         00000000 把低位第 4 个二进制位设置为 1：00001000

         0 | (1 << 3)
         00000001 左移 3 位：00001000
         
         00000000
       | 00001000
       ----------
         00001000  
         
         */
        int flag = 0;
        flag = flag | (1 << 3);
        System.out.println(flag); // 8
        
        // 如果需求是把数字 flag 从低位第 11 个二进制位设置为 1，那么就是 flag = flag | (1 << 10);

    }
}
```

### 按位异或 ^

将两个整数的二进制表示按位进行异或运算，只有当相应的二进制不同，结果才为 1，否则结果为 0

1 ^ 1 -> 0

1 ^ 0 -> 1

0 ^ 1 -> 1

0 ^ 0 -> 0

a ^ b ^ b -> a

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 10; // 00001010

        int b = 3; // 00000011

        /**
         00001010
       ^ 00000011
       ----------
         00001001
         */
        System.out.println(a ^ b); // 9

        /**
         00001001
       ^ 00000011
       ----------
         00001010
         */
        System.out.println(a ^ b ^ b); // 10
        
        // ----------
        
        // 具体应用：加密解密

        int data = 2147483647; // 原始数据，这个数据将来要进行加密的
        // 对以上的 data 数据进行加密
        int key = 483; // 秘钥（私人的，只有我知道这个钥匙）

        // 加密
        int encrypted = data ^ key;
        System.out.println(encrypted); // 2147483164
        
        // 解密
        int decryption = password ^ key;
        System.out.println(decryption); // 2147483647
        
    }
}
```

按位异或运算符具有自反性，所谓的自反性是指：数字 A 连续对数字 B 进行两次按位异或运算之后，可以得到原始的数字 A。因为按位异或运算符具有这样的特征，所以在密码学方面应用广泛。通常使用它可以完成加密和解密操作

### 按位取反 ~

将整数的二进制表示按位进行取反操作，即 0 变为 1，1 变为 0

~1 -> 0

~0 -> 1

```java
public class OperatorTest {

    public static void main(String[] args) {

        int a = 10; // 00000000 00000000 00000000 00001010
        /**
         原反补码：00000000 00000000 00000000 00001010
             取反：11111111 11111111 11111111 11110101（补码）
             原码：10000000 00000000 00000000 00001011
         */
        System.out.println(~a); // -11
        
        // ----------
        
        // 按位取反的具体应用：将某个二进制位清零
        
        int value = 0b1111111111; // 待清 0 的数据（将低位第 4 位清零）

        /**
         00000000 00000000 00000000 00000001 左移 3 位
         00000000 00000000 00000000 00001000 
         */
        int flag = 1 << 3;
        /**
         00000000 00000000 00000000 00001000 取反
         11111111 11111111 11111111 11110111 和 0b1111111111 做按位与操作
       & 00000000 00000000 00000011 11111111
       -------------------------------------
         00000000 00000000 00000011 11110111
         把得出的结果和原本的 value 变量做对比
         11 11110111
         11 11111111
         发现就是把低位第 4 位清零了
         */
        value = value & (~flag);

        System.out.println(value); // 1015
        System.out.println(0b1111110111); // 1015
    }
}
```

## 赋值运算符

- 基本赋值运算符

  - = 等号右边先执行，将直接结果赋值给左边的变量

- 扩展赋值运算符

  - +=、-=、*=、/=、%=、&=、|=、^=、>>=、<<=、>>>=  

  - 以 += 为例。i += 3；表示 i = i + 3;

  - += 就是先 + 后 =，先求和，然后将求和的结果重新赋值

  - 对于扩展赋值运算符来说，有一个非常重要的运算规则需要注意：扩展赋值运算符不会改变运算结果的类型（即使精度损失了，也不会改变运算结果类型）

注意：对于扩展赋值运算符来说，中间不能使用空格

\+= 是正确的

\+ = 是错误的

对于扩展的赋值运算符来说，永远都不会改变运算结果类型。哪怕精度损失

```java
public class OperatorTest {

    public static void main(String[] args) {

        int k = 100;
        // 以下这个代码完成了累加，给 k 再累加 200
        k = k + 200;
        System.out.println("k = " + k); // 300

        int e = 100;
        // 累加效果
        e += 200; // 等同于 e = e + 200;
        System.out.println("e = " + e);

        // ----------

        int x = 10;
        x -= 100;
        System.out.println("x = " + x); // -99

        // ----------

        x = 10;
        x *= 3;
        System.out.println("x = " + x); // 30

        // ----------

        x = 10;
        x /= 3;
        System.out.println("x = " + x); // 3

        // ----------

        x = 10;
        x %= 3;
        System.out.println("x = " + x); // 1
        
        // ----------

        /**
         i += 10; 和 i = i + 10; 完全一样吗？
            i += 10; 自带强制类型转换
            i = i + 10; 没有强制类型转换
		*/
        
        byte m = 10;
        /**
         错误: 不兼容的类型: 从 int 转换到 byte 可能会有损失
         m 是 byte 类型，20 是 int 类型，byte 和 int 类型做混合运算，会先将 byte 转换成 int，再做运算
         */
        //m = m + 20;

        m += 20; // 底层实际上对应的是：m = (byte)(m + 20);
        System.out.println("m = " + m); // 30

        m += 100000; // 底层实际上对应的是：m = (byte)(m + 100000);
        System.out.println("m = " + m); // -66（精度损失）
    }
}
```

## 条件运算符

Java 语言中的条件运算符由 ? 和 : 组成，被成为三元运算符（三目运算符）。它的语法格式为：布尔表达式 ? 表达式1 : 表达式2

当布尔表达式值为 true 时，条件运算符的结果为表达式1的值，否则为表达式2的值。这种运算符常用于简化 `if-else` 语句的代码量

下面是一个条件运算符的简单实例：

`int a = 5, b = 7;`

`int max = (a > b) ? a : b;`

在上述代码中，首先定义了两个变量 a 和 b，然后使用条件运算符比较两个变量的大小，取其中较大值作为变量 max 的值，最后输出结果。当 a > b 的结果为 true 时，条件运算符的结果为表达式1，即 a 的值为变量 max 的值；当 a > b 的结果为 false 时，条件运算符的结果为表达式2，即 b 的值为变量 max 的值

总的来说，条件运算符在 Java 中的使用相对简单，能够减少代码重复和代码量，常用于简单的条件处理和表达式值的判断

```java
public class OperatorTest {

    public static void main(String[] args) {
        
        // 不是一个 Java 语句
        //10；
        
        // 不是一个 Java 语句
        // '男';
        
        boolean gender = false;
        
        // 不是一个 Java 语句
        // gender ? '男' : '女';

        System.out.println(gender ? '男' : '女');

        char c = gender ? '男' : '女';
        System.out.println(c);

        // 错误：不兼容的类型：条件表达式中的类型错误 String 无法转换为 char
        //char c2 = sex ? '男' : "女";

        System.out.println(sex ? '男' : "女");

        String s = sex ? "男" : "女";
        System.out.println(s);
        
        // 请使用三目运算符完成两个数字中较大数字的筛选

        int a = 300;
        int b = 200;

        System.out.println(a > b ? a : b);
        
    }
}
```

## 接收用户键盘输入

```java
public class KeyInput {

    public static void main(String[] args) {
        
        /**
         创建一个键盘扫描器对象
         以下代码中 s 是变量名，名字是随意的，只要是合法的标识符就行
         你可以把现在的 s 叫做 键盘扫描器
         */
        java.util.Scanner s = new java.util.Scanner(System.in);
        System.out.print("请输入一个数字：");
        /**
         程序执行到这里就会停下来，等待键盘的输入。键盘如果没有输入，这里就会一直等待用户输入
         直到用户输入了内容之后，敲回车，这行代码就执行结束了
         s.nextInt() 会专门从键盘上扫描 int 类型的数字，然后将扫描到的数字赋值给 num 变量
         这样就完成了数据从控制台到内存
         针对nextInt()方法来说，只能接收整数数字。输入其他的字符串会报错
         */
        int num = s.nextInt();
        System.out.println("您输入的数字是：" + num);

        // ----------

        System.out.print("请输入一个浮点型数据：");
        /**
         从键盘上接收一个 double 类型的数据
         执行到这里会停下来，等待用户的输入
         */
        double num2 = s.nextDouble();
        System.out.println("您输入的这个浮点数据是：" + num2);

        // ----------

        System.out.print("请输入您的姓名：");
        /**
         从键盘上接收一个字符串，但是接收的是第一个空格之前的内容
         程序执行到这里，等待用户的输入
         */
        String username = s.next(); // jack son
        System.out.println("欢迎您" + username); // 欢迎您jack

        // ----------
        
        System.out.print("请输入您的姓名：");
        /**
         从键盘上接收一个字符串，但是接收的是第一个换行符\n之前的内容
         如果在 next() 或者 nextInt() 或者 nextDouble() 等后面再使用 nextLine() 就会读取缓存中遗留的 \r 回车符
         第一次调用这个方法是读取缓存中遗留的 \r 回车符，除非把这块代码放到 java.util.Scanner s = new java.util.Scanner(System.in); 后就不会出现这个问题
         第二次调用这个方法才会真正地接收用户的输入
         */
        s.nextLine();
        String name = s.nextLine();
        System.out.println("欢迎您" + name);
    }
}
```

```java
public class Compute {
    
    public static void main(String[] args) {
        
        // 创建键盘扫描器对象
        java.util.Scanner s = new java.util.Scanner(System.in);

        // 输出欢迎信息
        System.out.println("欢迎使用计算器1.0版本：我现在只能帮助你实现加法运算！");
        
        System.out.print("请输入第一个数字：");
        int num1 = s.nextInt();
        System.out.print("请输入第二个数字：");
        int num2 = s.nextInt();
        int result = num1 + num2;
        
        System.out.println(num1 + "+" + num2 + "=" + result);
    }
}
```

## 栈数据结构（Stack）

- 栈结构特点

    - 先进后出

    - 后进先出

- 相关术语

    - 入栈、压栈、push

    - 出栈、弹栈、pop

    - 栈帧

    - 栈顶、栈底

![](https://img.sherry4869.com/blog/it/java/javase/7.jpg)

### 查看程序字节码

在 Java 语言中，任何一个方法执行时，都会专门为这个方法分配所属的内存空间。供这个方法使用

每个方法都有自己独立的内存空间。这个内存空间中有两块比较重要的内存空间：

1. 局部变量表（存储局部变量的）

2. 操作数栈（存储程序运行过程中参与运算的数据）

查看程序的字节码，命令是：`javap -c ReadClass.class`

```java
public class ReadClass {
    
    public static void main(String[] args) {
        
        int i = 10;
    }
}
```

上述代码经过编译后的字节码：

```text {11-12}
Compiled from "ReadClass.java"
public class ReadClass {
  public ReadClass();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: return
}
```

`0: bipush   10`：将 10 这个字面量压入操作数栈当中

`2: istore_1`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 1 号槽位上

![](https://img.sherry4869.com/blog/it/java/javase/8.png)

---

```java
public class ReadClass {
    
    public static void main(String[] args) {
        
        int i = 10;
        int j = i;
    }
}
```

上述代码经过编译后的字节码：

```text {11-14}
Compiled from "ReadClass.java"
public class ReadClass {
  public ReadClass();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: iload_1
       4: istore_2
       5: return
}
```

`0: bipush   10`：将 10 这个字面量压入操作数栈当中

`2: istore_1`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 1 号槽位上

`3: iload_1`：将局部变量表 1 号槽位上的数据复制一份，压入到操作数栈里

`4: istore_2`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 2 号槽位上

![](https://img.sherry4869.com/blog/it/java/javase/9.png)

---

```java
public class ReadClass {
    
    public static void main(String[] args) {
        
        int i = 10;
        int j = i;
        j++;
    }
}
```

上述代码经过编译后的字节码：

```text {11-15}
Compiled from "ReadClass.java"
public class ReadClass {
  public ReadClass();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: iload_1
       4: istore_2
       5: iinc          2, 1
       8: return
}
```

`0: bipush   10`：将 10 这个字面量压入操作数栈当中

`2: istore_1`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 1 号槽位上

`3: iload_1`：将局部变量表 1 号槽位上的数据复制一份，压入到操作数栈里

`4: istore_2`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 2 号槽位上

`5: iinc    2, 1`：将局部变量表的 2 号槽位上的数据加 1

![](https://img.sherry4869.com/blog/it/java/javase/10.png)

---

```java
public class ReadClass {

    public static void main(String[] args) {
        
        int i = 10;
        int j = i++;
    }
}
```

上述代码经过编译后的字节码：

```text {11-15}
Compiled from "ReadClass.java"
public class ReadClass {
  public ReadClass();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: iload_1
       4: iinc          1, 1
       5: istore_2
       8: return
}
```

`0: bipush   10`：将 10 这个字面量压入操作数栈当中

`2: istore_1`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 1 号槽位上

`3: iload_1`：将局部变量表 1 号槽位上的数据复制一份，压入到操作数栈里

`4: iinc    1, 1`：将局部变量表的 1 号槽位上的数据加 1

`5: istore_2`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 2 号槽位上

![](https://img.sherry4869.com/blog/it/java/javase/11.png)

---

```java
public class ReadClass {

    public static void main(String[] args) {
        
        int i = 10;
        int j = ++i;
    }
}
```

上述代码经过编译后的字节码：

```text {11-15}
Compiled from "ReadClass.java"
public class ReadClass {
  public ReadClass();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        10
       2: istore_1
       3: iinc          1, 1
       4: iload_1
       5: istore_2
       8: return
}
```

`0: bipush   10`：将 10 这个字面量压入操作数栈当中

`2: istore_1`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 1 号槽位上

`3: iinc    1, 1`：将局部变量表的 1 号槽位上的数据加 1

`4: iload_1`：将局部变量表 1 号槽位上的数据复制一份，压入到操作数栈里

`5: istore_2`：将操作数栈顶元素弹出，然后将其存储到局部变量表的 2 号槽位上

![](https://img.sherry4869.com/blog/it/java/javase/12.png)

## 练习

编写 Java 代码，输入一个半径值，计算圆的面积和周长，并输出结果。注意：圆的面积公式为 π * r * r，周长公式为 2 * π * r，其中 π 取 3.14

```java
import java.util.Scanner;

public class OperatorHomework {

    public static void main(String[] args) {
        // 1. 接收用户的输入，可以让用户输入一个 double 数据
        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入一个半径值：");
        double r = scanner.nextDouble();

        // 2. 计算圆的面积，定义一个变量：π
        double π = 3.14;
        // 带入公式计算圆的面积
        double area = π * r * r;

        // 3. 计算圆的周长，带入公式计算圆的周长
        double perimeter = 2 * π * r;

        System.out.println("半径值是" + r + "的圆面积是" + area);
        System.out.println("半径值是" + r + "的圆周长是" + perimeter);
    }
}
```

假设变量 a、b、c 分别为 6、9、10，请编写 Java 代码输出它们的最大值

```java
public class OperatorHomework {

    public static void main(String[] args) {

        int a = 6, b = 9, c = 10;
        //int max = (a > b ? a : b) > c ? (a > b ? a : b) : c;
        int max = a > b ? (a > c ? a : c) : (b > c ? b : c);
        System.out.println(max);
    }
}
```

编写 Java 代码，输入三个整数，分别判断第一个数是否大于 0，第二个数是否小于 10，第三个数是否是偶数。如果都满足条件，则输出“三个条件都满足”，否则输出“不满足所有条件”

```java
import java.util.Scanner;

public class OperatorHomework {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);
        System.out.println("请依次输入三个整数：");
        System.out.print("请输入第一个整数：");
        int a = s.nextInt();
        System.out.print("请输入第二个整数：");
        int b = s.nextInt();
        System.out.print("请输入第三个整数：");
        int c = s.nextInt();

        if (a > 0 && b < 10 && c % 2 == 0) {
            System.out.println("三个条件都满足");
        } else {
            System.out.println("不满足所有条件");
        }

        System.out.println((a > 0 && b < 10 && c % 2 == 0) ? "三个条件都满足" : "不满足所有条件");

        System.out.println((a > 0 && b < 10 && c & 1 != 1) ? "三个条件都满足" : "不满足所有条件");
        
    }
}
```
   
编写 Java 代码，输入一个年份，判断它是否是闰年。若该年份能被 4 整除且不能被 100 整除，或者能被 400 整除，则该年份为闰年。输出结果为“该年是闰年”或“该年不是闰年”

```java
import java.util.Scanner;

public class OperatorHomework {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);
        System.out.println("请输入一个年份：");
        int year = s.nextInt();

        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            System.out.println(year + " 是闰年");
        } else {
            System.out.println(year + " 不是闰年");
        }

    }
}
```