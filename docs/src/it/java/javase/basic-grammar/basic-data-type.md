---
category: IT
article: false
order: 8
---

# 基本数据类型

关于默认值：Java 语言中变量必须先声明，再赋值，才能使用。对于局部变量来说必须手动赋值，而对于成员变量来说，如果没有手动赋值，系统会自动赋默认值。所有引用数据类型的默认值都是 null


![](https://img.sherry4869.com/blog/it/java/javase/4.png)

## 整数型

byte：小整数

short：中等大小整数

int：Java最常用的整数

long：极大或极小的整数，如果超过 long 使用 `BigInteger`（引用数据类型）

### 整数型数据的四种表示形式

1. 十进制表示法：以数字 0-9 组成的常数，默认为十进制表示法。例如 `int a = 10;`

2. 二进制表示法：以 0b 或 0B 开头的常数，由 0 和 1 组合而成。例如 `int b = 0b101;`

3. 八进制表示法：以 0 开头的常数，由数字 0-7 组成。例如 `int c = 012;`

4. 十六进制表示法：以 0x 或 0X 开头的常数，由 0-9 和 A-F（大小写均可）组成。例如 `int d = 0x1F;`

```java
public class IntTest {
    
    public static void main(String[] args) {
        
        int a = 10;
        int b = 0b10;
        int c = 010;
        int d = 0x10;
        System.out.println(a); // 10
        System.out.println(b); // 2
        System.out.println(c); // 8
        System.out.println(d); // 16
        System.out.println(a + b + c + d); // 36
    }
}
```

### 自动类型转换

Java 中任何一个整数型字面量都会默认被当做 int 类型来处理。如果在整数型字面量后面添加 L 或者 l，那么这个整数型字面量就会被当做 long 类型来处理了（最好用大写 L，因为小写 l 会和数字 1 有点像）

Java 中允许小容量的数据直接赋值给大容量的变量：byte < short < int < long < float < double

```java
public class IntTest {
    
    public static void main(String[] args) {

        /**
         * 这个没有类型转换
         * = 是赋值运算符，= 的右边先执行
         * 程序先执行右边，分配一块空间去存储 100 这个数字，给 100 分配的是 4 个字节（当做 int 来处理）
         * a 变量正好也是 4 个字节。所以不存在类型转换
         */
        int a = 100;
        
        // ----------

        /**
         * 100 是 4 个字节
         * b（long 类型） 是 8 个字节
         * 小容量可以自动赋值给大容量，叫做自动类型转换
         */
        long b = 100;
        
        // ----------

        // 100L 一上来就是分配 8 个字节。所以这里不存在类型转换
        long c = 100L;

        // ----------

        // 2147483647 一上来就被当做 int 来处理，4 个字节。d 是 8 个字节。存在自动类型转换
        long d = 2147483647;
        System.out.println(d);

        // ----------

        /**
         * 错误: 整数太大（不是 long 存不下）
         * 原因是：2147483648默认被当做 int 来处理，分配 4 个字节。4 个字节本身是无法存储 2147483648
         */
        //long e = 2147483648;
        //System.out.println(e);

        // 怎么解决？添加一个 L 变成 long 类型
        long e = 2147483648L;
        System.out.println(e);

        // ----------
        
        // 自动类型转换
        double d = 1;
        System.out.println(d); // 1.0
    }
}
```

### 强制类型转换

Java 中大容量是无法直接转换成小容量的。因为这种操作可能会导致精度损失，所以这种行为交给了程序员来决定，当然这种后果自然是程序员自己去承担。因此在代码中需要程序员自己亲手加上强制类型转换符，程序才能编译通过

强制类型转换时，底层二进制是如何变化的？原则：制砍掉左侧多余的二进制

强制类型转换时，精度可能会损失，也可能不会损失，这要看具体的数据是否真的超出了强转后的类型的取值范围

- 55L 强制转换成 int：

  55L 的二进制（long 类型有 8 个字节）：

  00000000 00000000 00000000 00000000 00000000 00000000 00000000 00110111

  强转成 int 类型（4 个字节）：

  00000000 00000000 00000000 00110111

- 128 强制转换成 byte：

  `int k = 128;`（4 个字节）：

  00000000 00000000 00000000 10000000

  `byte e = (byte) k;`（1 个字节）:

  10000000

  计算机存的是补码，-128 的原码和补码都是 10000000，因此 128 强转成 byte 后变成 -128

- 129 强制转换成 byte：

  `int m = 129;`（4 个字节）：

  00000000 00000000 00000000 10000001

  `byte n = (byte) m;`（1 个字节）：

  计算机存的是补码，10000001 转换成原码，符号位不变，其余取反为 11111110 最后加一为 11111111 得到 -127

```java
public class IntTest {
    
    public static void main(String[] args) {

        long x = 1000L;
        /**
         * 大容量是无法直接转换成小容量的
         * 错误: 不兼容的类型：从 long 转换到 int 可能会有损失
         */
        //int y = x;

        // 强制类型转换
        int y = (int) x;

        // ----------

        long a = 55L;
        int b = (int) a;
        System.out.println("b = " + b); // 55

        // ----------

        int k = 128;
        byte e = (byte) k;
        System.out.println("e = " + e); // -128

        // ----------

        int m = 129;
        byte n = (byte) m;
        System.out.println("n = " + n); // -127
    }
}
```

在 Java 中有这样一个规定，当整数型字面量没有超出 byte 的范围：可以直接赋值给 byte 类型的变量

`byte b = 1;` 或 `byte b = 127;` // 这是允许的

很显然，这是一种编译优化。同时也是为了方便程序员写代码

如果超出了范围，例如：

`byte b = 128;` // 编译报错

这样就会报错，需要做强制类型转换，例如：

`byte b = (byte) 128;` // -128

在整数类型中，除了 byte 有这个待遇之外，short 同样也是支持的。也就是说如果整数型字面量没有超出 short 取值范围时，也是支持直接赋值的

`short s = 32767;` // 这是允许的

`short s = 32768;` // 编译报错

这样就会报错，需要做强制类型转换，例如：

`short s = (short) 32768;` // -32768

### int 类型做运算

两个 int 类型的数据做运算，最终的结果还是 int 类型

在 Java 中，多种数据类型混合运算时，各自先转换成容量最大的类型，再做运算

```java
public class IntTest {

    public static void main(String[] args) {

        int a = 10;
        int b = 3;

        /**
         * 应该是这样的结果：3.33333333333333333333...
         * 但 Java 中不是，结果是 int 类型的 3
         */
        System.out.println(a / b); // 3

        // ----------

        byte x = 10;
        int y = 3;
        long z = 100L;
        // 编译报错。
        //int result = x + y + z;
        
        // 修改
        long result = x + y + z;
        System.out.println(result);
    }
}
```

### 编译器的小心思

```java
public class IntTest {

    public static void main(String[] args) {

        /**
         * 这条语法规则需要记住：byte 和 short 混合运算的时候，各自先转换成 int 再做运算
         * byte + byte --> int
         * byte + short --> int
         * short + short --> int
         */
        short m = 10;
        byte n = 10;
        
        // 编译器报错。最后结果是 int 类型，不能使用 short 类型变量接收
        //short result = m + n;
        
        int result = m + n;
        System.out.println("result = " + result);

        // ----------

        /**
         * 编译优化：以下代码 10/3，在都是字面量的时候，编译阶段编译器会直接计算出结果是 3，而 3 没有超出 byte 的取值范围，所以可以直接赋值
         * 编译之后的 class 文件中直接就是：byte b = 3;
         */
        byte b = 10 / 3;
        System.out.println(b);

        // ----------

        byte x = 10;
        byte y = 3;
        /**
         * 编译器报错
         * x 和 y 都是变量的情况下，编译器是无法在编译阶段得出结果的，编译器只能检测到结果是 int 类型
         * int 类型不能直接赋值给 byte 类型变量。除非手动做强制类型转换 byte c = (byte) (x / y);
         */
        //byte c = x / y;
        
        // 修改
        int c = x / y;

        // ----------

        byte e = 3;
        /**
         * 编译报错，首先编译器在编译阶段是不做等号运算符运算的
         * 只要有一个变量在，编译器就不知道变量里存的是什么，只知道是一个 byte 类型的变量，变量具体的值是不知道的
         * 因此编译阶段只知道 10 / e 结果是 int 类型。所以编译就会报 int 转换到 byte 可能会有精度损失错误
         */
        //byte f = 10 / e;

        // 第一种修改方式：
        //int f = 10 / e;

        /**
         * 第二种修改方式：
         * 这是错误的，这里只是把 10 强转成 byte 类型，但 byte 和 byte 类型做运算依旧是 int 类型
         */
        //byte f = (byte) 10 / e;

        // 这是正确的修改方式
        byte f = (byte) (10 / e);
    }
}
```

## 浮点型

float：单精度，占用 4 个字节，精度为 7 位小数

double：双精度，占用 8 个字节，精度为 15 位小数，Java 中最常用的浮点类型。如果超过了 double 使用 `BigDecimal`（引用数据类型）

Java 中，浮点型字面量默认被当作 double 类型，如果要当作 float 类型，需要在字面量后面添加 F 或者 f

```java
public class FloatTest {

    public static void main(String[] args) {

        // 不存在类型转换。
        double d = 3.14;

        // ----------

        /**
         * 编译报错
         * 3.14 默认是 double 类型，8 个字节
         * f 变量是 4 个字节。大容量不能直接转换成小容量
         */
        //float f = 3.14;

        // 第一种修改方案
        //float f = 3.14F;

        // 第二种修改方案
        //float f2 = (float) 3.14;
        
        // ----------

        double x = 1.5656856894;
        System.out.println(x); // 1.5656856894
        
        float y = 1.5656856894F;
        System.out.println(y); // 1.5656856
    }
}
```

### 浮点型数据的两种表示形式

十进制表示法：

double x = 1.23;

double y = 0.23;

double z = .23;

科学计数法：

double x = 0.123E2; // 0.123 * 10 的平方

double y = 123.34E-2; // 123.34 / 10 的平方

```java
public class FloatTest {

    public static void main(String[] args) {

        double x = 1.23;
        double y = 0.23;
        double z = .23;

        System.out.println(x); // 1.23
        System.out.println(y); // 0.23
        System.out.println(z); // 0.23

        // ----------

        double a = 0.123E2;
        System.out.println(a); // 12.3

        double b = 123.34E-2;
        System.out.println(b); // 1.2334
    }
}
```

### 浮点型数据存储原理

为什么说 float（4 个字节，32位） 比 long（8 个字节，64位） 要大

符号位：0 表示正数，1 表示负数

指数位：不管是 float 类型还是 double 类型，指数位 8bit 对应的底数是 2。小数 0.123E30，其中 30 就是指数，表示 0.123 * 10 的 30 次幂。所以也有把指数位叫做偏移量。而指数位 8bit 不是指最大取值范围到 2^8 = 256，浮点数指数取值范围是 -126 ~ 127，因此最大偏移量是 127

尾数位：浮点数的小数部分的有效数字。例如 0.00123，那么尾数位存储 123 对应的二进制

从浮点型数据存储原理上可以看到，二进制中的指数位决定了数字呈指数级增大（127 和 2^127 不是一个概念）。因此 float 虽然是 4 个字节，但却可以表示比 long 更大的数值，因此 float 的容量比 long 的容量要大

![IEEE 754](https://img.sherry4869.com/blog/it/java/javase/5.png)

一旦有浮点型数据参与运算得出的结果，一定不要使用“==”与其它数字进行相等比较

主要原因是：任何浮点型数据，在计算机底层存储的都是它的近似值

```java
public class FloatTest {

    public static void main(String[] args) {

        double a = 6.9;

        double b = 3.0;

        double c = a / b;

        System.out.println("c = " + c); // c = 2.3000000000000003

        System.out.println(c == 2.3); // false

        //if (c == 2.3) {
        //    System.out.println("相等");
        //}

        if (c - 2.3 < 0.00000001) {
            System.out.println("相等");
        }
    }
}
```

## 布尔型

在 Java 中，boolean 值只有 true 和 false，没有 1 和 0 这一说

boolean 类型的数据主要用在逻辑判断，条件判断...

```java
public class BooleanTest {

    public static void main(String[] args) {

        // 不兼容的类型：int 无法转换为 boolean
        //boolean flag = 1;

        boolean flag = true;

        boolean gender = true;
        if (gender) {
            System.out.println("男士");
        } else {
            System.out.println("女士");
        }

        int a = 100;
        int b = 200;
        if (a > b) {
            System.out.println(a + ">" + b);
        } else {
            System.out.println(a + "<" + b);
        }
    }
}
```

## 字符型

char：单个字符，'A'，'a'，'国'

占用两个字节，0~65535，和 short 容量相同，但 char 可以取更大的整数

单个字符，使用单引号括起来，不能是多个字符

char 类型统一采用的字符编码方式是 Unicode 编码

char 可以存储一个汉字

`char c = '';` 这是不允许的

`char c = '\u0000';` 这表示一个空字符，也是 char 的默认值。\u0000 是一个 Unicode 码。空字符与空格字符是不同的，空字符表示什么也没有，空格字符表示一个空格，空格的 Unicode 是 \u0020

```java
public class CharTest {

    public static void main(String[] args) {

        char c1 = 'A';
        char c2 = 'B';
        System.out.println(c1); // A
        System.out.println(c2); // B

        char c3 = 'a';
        System.out.println(c3); // a
        char c4 = '中';
        System.out.println(c4); // 中
        
        // ----------

        // 错误：不兼容的类型: String 无法转换为 char
        //char c5 = "国";

        // 编译错误
        //char c6 = 'ab';

        // 错误: 空字符文字
        //char c7 = '';

        // ----------

        char x = '\u0000'; // 一个空字符
        System.out.print(x + "abc"); // abc
    }
}
```

### 转义字符

`\t`：表示制表符，相当于按下 Tab 键

`\n`：表示换行符

`\"`：表示双引号（"）

`\'`：表示单引号（'）

`\\`：表示反斜线（\）本身


```java
public class CharTest {

    public static void main(String[] args) {

        // 这是一个普通的 t 字符
        char c1 = 't';

        // ----------

        /**
         * 按说应该编译报错。因为看到的是一个字符串。不是字符
         * 但是编译通过了，说明这是 1 个字符
         * 这个字符叫做：制表符。tab
         * \ 反斜杠在java语言中具有转义功能。把普通的 t 字符转义成了制表符 tab
         */
        char c2 = '\t';
        System.out.println("abc" + c2 + "def");

        // ----------
        
        // \n 换行符
        System.out.print("hello\n");
        System.out.print("world\n");
        System.out.print("test\n\n\n\n\n\n");

        // ----------

        // 需求：输出一个双引号到控制台
        //System.out.println("""); // 编译报错
        System.out.println("\"");
        System.out.println("\"\"");
        System.out.println('"');

        // ----------

        // 需求：输出一个单引号到控制台
        System.out.println("'");
        
        //System.out.println('''); // 编译错误
        System.out.println('\'');

        // 字符 char 只能是单个字符
        //System.out.println('\'\'');

        // ----------

        // 需求：输出一个反斜杠到控制台。 \
        //System.out.println("\"); // 编译错误

        // 在 Java 中两个 \\ ，最终转换完成之后是一个普通的 \ 字符
        System.out.println("\\");
    }
}
```

### 字符编码

字符编码是人为规定的文字与二进制之间的转换关系

在早期计算机系统中，字符编码主要采用的是 ASCII 编码，采用 1 个字节编码，最多可以表示 256（-128~127 以及 0） 个字符（实际上 ASCII 码表只用了 128 个）

程序员需要记住以下几个常用的 ASCII 码：

a 对应的 ASCII 码：97

A 对应的 ASCII 码：65

0 对应的 ASCII 码：48

### 乱码是如何产生的

字符在计算机系统中，编码（Encoding）和解码（Decoding）是两个常用的概念，分别表示将字符转换为二进制数据和将二进制数据转换为字符

字符 a 按照 ASCII 编码 -> 0110 0001

0110 0001 按照 ASCII 解码 -> 字符 a

乱码是指在字符编码和解码的过程中，由于编码和解码所采用的字符集不一致（例如编码用的是 UTF-8，解码用的是 GBK），或者编码和解码所采用的字符集不支持某些字符，导致最终显示的字符与原始字符不一致。为了避免乱码的问题，我们需要统一使用一个字符集，并且在进行字符编码和解码时要保持一致

![](https://img.sherry4869.com/blog/it/java/javase/6.png)

### 常见的字符编码

- ASCII 编码（American Standard Code for Information Interchange：美国信息交换标准编码）：采用 1 个字节编码，包括字母、数字、符号和控制字符等

- Latin-1 编码（ISO 8859-1），采用 1 个字节编码。该编码方式是为了表示欧洲语言（如荷兰语、西班牙语、法语、德语等）中的字符而设计的，共支持 256 个字符

- ANSI 编码（American National Standards Institute：美国国家标准协会）：采用 1 个字节编码，支持英文、拉丁文等字符。两个 ANSI 码可以表示一个汉字

- Unicode 编码：可表示所有语言的字符。采用了十六进制表示，占用 2 个字节或 4 个字节，最多可表示超过一百万个字符（使用这种方式是有点浪费空间的，例如英文字符 a 其实采用一个字节存储就够了）Java 用的就是 Unicode 编码

- UTF-8 编码（Unicode Transformation Format，8-bit）：基于 Unicode 编码的可变长度字符编码，能够支持多语言和国际化的需求，使用 1~4 个字节来表示一个字符，是目前 Web 开发中最常用的字符编码方式（一个英文字母 1 个字节，一个汉字 3 个字节）

- UTF-16 编码：基于 Unicode 编码的可变长度字符编码，使用 2 或 4 个字节来表示一个字符，应用于很多较早的系统和编程语言中（一个英文字母 2 个字节。一个汉字 4 个字节）

- UTF-32 编码：基于 Unicode 编码的固定长度字符编码，其特点是每个字符占用 4 个字节

- GB2312 编码（小）：是中国国家标准的简体中文字符集，使用 2 个字节来表示一个汉字，是 GBK 编码的前身

- GBK 编码（Guo Biao Ku）（中）：是针对中文设计的一个汉字编码方式，使用 2 个字节来表示一个汉字，能够表示中国内地的所有汉字

- GB18030 编码（大）：是中国国家标准 GB 18030-2005《信息技术 中文编码字符集》中规定的字符集编码方案，用于取代 GB2312 和 GBK 编码

- Big5 编码（大五码）：是台湾地区的繁体中文字符集，使用 2 个字节来表示一个汉字，适用于使用繁体中文的应用场景

```java
public class CharTest {

    public static void main(String[] args) {

        char c1 = 'A';
        System.out.println(c1); // A

        // \\u 后面是一个十六进制的数字，这个十六进制是字符对应的 Unicode 码
        // \u0041 表面看是一个字符串，实际上只是一个字符
        char c2 = '\u0041';
        System.out.println(c2); // A

        char x = '\u4e2d';
        System.out.println(x); // 中

        // -------

        /**
         * 当整数型字面量没有超出 char 的取值范围，可以直接将其赋值给 char 类型的变量
         * 97 是 int类型，占 4 个字节，默认是不能直接转小容量 char 类型 2 个字节的
         * 但当声明 char 类型变量的时候，如果值是一个整数型字面量，那么这个字面量会被当做 ASCII 码值来处理
         */
        char c3 = 97;
        System.out.println(c3); // a
        
        // 和之前提到的当整数型字面量没有超出 byte 的范围，可以直接赋值给 byte 类型的变量，short 同样也是支持的
        byte b = 1;
        short s = 1;

        char c4 = 65535;
        //char c5 = 65536; // 错误的，超出范围了
    }
}
```

总结：当整数型字面量没有超出 byte short char 的范围，可以直接将其赋值给 byte short char 类型的变量

char 类型变量定义有三种方式：

- `char c = 'A';`

- `char c = '\u0041';`

- `char c = 65;`

### char 参与的运算

```java
public class CharTest {

    public static void main(String[] args) {
        
        /**
         * 有一个运算规则需要记住：
         * byte short char 做混合运算的时候，各自先转换成 int 类型再做运算
         */
        System.out.println('a' + 1); // 98

        char x = 'a' + 1; // 这里算出来的也是 98，但有个赋值登号，因此这里做了一个类型转型，把 98 赋值给了 char 类型的变量，最后会变成字符型，98 对应的字符是 b
        System.out.println(x); // b

        byte b = 1;
        short s = 1;
        char c = 1;
        // byte short char 做混合运算的时候，各自先转换成 int 类型再做运算。从 int 转换到 short 可能会有精度损失，不能从大容量直接转换到小容量
        //short num = b + s + c;

        // 第一种修改方式
        // int num = b + s + c;

        // 第二种修改方式
        short num = (short) (b + s + c);

        // ----------

        // 多种数据类型混合运算的时候，各自先转换成最大的再做运算

        int k = 100;
        short e = 200;
        long f = 300L;
        double d = 3.0;

        // 错误的，从 double 转换到 long 可能会有损失
        //long result = k + e + f + d;

        double result = k + e + f + d;
    }
}
```

## 练习题

```java
/**
请定义合理的变量用来存储个人信息（姓名、年龄、性别、联系电话），并编写程序定义这些变量，给变量赋值，并打印输出。输出效果如下
姓名		年龄		性别		联系电话
张三		20		    男		    12545457585
李四		30		    女		    15622525855
*/
public class DataTypeHomework {

    public static void main(String[] args) {

        String name1 = "张三";
        int age1 = 20;
        char gender1 = '男';
        String tel1 = "12545457585";

        String name2 = "李四";
        int age2 = 30;
        char gender2 = '女';
        String tel2 = "15622525855";

        System.out.println("姓名\t年龄\t性别\t联系电话");
        System.out.println(name1 + "\t" + age1 + "\t" + gender1 + "\t" + tel1);
        System.out.println(name2 + "\t" + age2 + "\t" + gender2 + "\t" + tel2);
    }
}
```

```java
/**
有两个变量 a 和 b，a 变量中存储的数据 100，b 变量中存储的数据 200，请编写程序交换两个变量中的数据
让 a 变量存储 200，让 b 变量存储 100。并且计算两个 int 类型数据的和，要求最终输出 200+100=300 的效果
*/
public class DataTypeHomework {
    
    public static void main(String[] args) {
        
        int a = 100;
        int b = 200;

        // 交换位置
        int temp = a;
        a = b;
        b = temp;

        int result = a + b;

        System.out.println(a + "+" + b + "=" + result);

        // 掌握字符串的拼接技巧。（将变量拼接到一个字符串当中）
        String name = "jackson";
        System.out.println("登录成功，欢迎" + name + "回来");
    }
}
```

```java
/**
 总结：基本数据类型转换规则
 1. 8 种基本数据类型中除了 boolean 类型之外，剩下 7 个都是可以互相转换的
 2. 小容量可以自动转换成大容量，称为自动类型转换，容量从小到大排序：
    byte < short < int < long < float < double
           char  <
 3. 大容量不能自动转换成小容量，必须添加强制类型转换符，编译才能通过。但是运行时可能损失精度
 4. 当整数型字面量没有超出 byte short char 的范围时，可以直接将其赋值给 byte short char 类型的变量
 5. byte short char 混合运算时，各自先转换成 int 再做运算
 6. 多种数据类型混合运算时，各自先转换成最大的容量，再做运算
 */
public class DataTypeHomework {
    
    public static void main(String[] args) {
        
        // 通过
        short s = 100;
        // 大容量不能直接赋值给小容量。s - 99 是 int 类型，int 类型不能直接赋值给 short 类型
        s = s - 99;
        // 通过
        byte b = 100;
        // 大容量不能直接赋值给小容量。b + 1 是 int 类型，int 类型不能直接赋值给 byte 类型
        b = b + 1;
        // 通过
        char c = 'a';
        // 通过
        int i = 20;
        // 通过
        float f = .3F;
        // 通过
        double d = c + i + f;
        // 通过
        byte b1 = 11;
        // 通过
        short s1 = 22;
        // byte short char 混合运算时，各自先转换成 int 再做运算，因此 b1 + s1 为 int 类型，int 类型不能直接赋值给 short 类型
        short x = b1 + s1;
    }
}
```