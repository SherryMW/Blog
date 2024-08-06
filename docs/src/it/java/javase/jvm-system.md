---
category: IT
article: false
---

# JVM 体系结构

JVM 对应了一套规范（Java 虚拟机规范），各大厂商对这个规范都有不同的实现

- JVM 规范是一种抽象的概念，它可以有多种不同的实现，例如：

  - HotSpot：HotSpot 由 Oracle 公司开发，是目前最常用的虚拟机实现，也是默认的 Java 虚拟机，默认包含在 Oracle JDK 和 OpenJDK 中

  - JRockit：JRockit 也是由 Oracle 公司开发。它是一款针对生产环境优化的 JVM 实现，能够提供高性能和可伸缩性

  - IBM JDK：IBM JDK 是 IBM 公司开发的 Java 环境，采用了与 HotSpot 不同的 J9 VM，能够提供更小的内存占用和更迅速的启动时间

  - Azul Zing：Azul Zing 是针对生产环境优化的虚拟机实现，能够提供高性能和实时处理能力，适合于高负载的企业应用和实时分析等场景

  - OpenJ9：OpenJ9 是由 IBM 开发的优化的 Java 虚拟机的实现，支持高度轻量级、低延时的 GC、优化的 JIT 编译器和用于健康度测试的可观察性仪表板

Java 21 虚拟机规范文档：[https://docs.oracle.com/javase/specs/jvms/se21/html/index.html](https://docs.oracle.com/javase/specs/jvms/se21/html/index.html)

## JVM 规范中的运行时数据区

对于初学者要重点研究的是运行时数据区，包括 6 个部分：

1. The pc Register（程序计数器）：是一块较小的内存空间，此计数器记录的是正在执行的虚拟机字节码指令的地址

2. Java Virtual Machine Stacks（Java 虚拟机栈）：Java 虚拟机栈用于存储栈帧。栈帧用于存储局部变量表、操作数栈、动态链接、方法出口等信息

3. Heap（堆）：Java 虚拟机所管理的最大的一块内存。堆内存用于存放 Java 对象实例以及数组。堆是垃圾收集器收集垃圾的主要区域

4. Method Area（方法区）：用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据

5. Run-Time Constant Pool（运行时常量池）：是方法区的一部分，用于存放编译器生成的各种字面量与符号引用（类名、属性名、方法名）

6. Native Method Stacks（本地方法栈）：在本地方法的执行过程中，会使用到本地方法栈。和 Java 虚拟机栈十分相似。`String` 源码里的 `public native String intern();` 调用的是 C++ 写的动态链接库程序，我们把这种没有大括号的方法，且修饰符列表里有 `native` 的方法叫做本地方法

![](https://img.sherry4869.com/blog/it/java/javase/24.png)

总结：这些运行时数据区虽然在功能上有所区别，但在整个 Java 虚拟机启动时都需要被创建，并且在虚拟机运行期间始终存在，直到虚拟机停止运行时被销毁。同时，不同的 JVM 实现对运行时数据区的分配和管理方式也会有所不同，会对性能和功能产生影响

![JVM 规范](https://img.sherry4869.com/blog/it/java/javase/25.png)

## JDK6 HotSpot

年轻代：刚 `new` 出来的对象放在这里

老年代：经过几轮 GC 垃圾回收机制仍然存活的对象

符号引用：类全名，字段全名，方法全名等

这个时期的永久代和堆是相邻的，使用连续的物理内存，但是内存空间是隔离的

永久代的垃圾回收器是和老年代捆绑到一起的，因此无论谁满了，都会触发永久代和老年代的垃圾回收器

![](https://img.sherry4869.com/blog/it/java/javase/26.png)

## JDK7 HotSpot

JDK7 是一个过渡版本，该版本相对于 JDK6 来说，变化如下：

类的静态变量转移到堆内存

字符串常量池转移到堆内存

运行时常量池中的符号引用转移到本地内存

为什么在 JDK7 中启用本地内存？因为在 JDK6 中永久代里面的东西太多了，很容易发生 OOM（Out of Memory）内存溢出错误

![](https://img.sherry4869.com/blog/it/java/javase/27.png)

## Java8 HotSpot

彻底删除永久代（为了避免 OOM 错误的发生）

将方法区的实现转移到本地内存

将符号引用重新放回运行时常量池

![](https://img.sherry4869.com/blog/it/java/javase/28.png)

![](https://img.sherry4869.com/blog/it/java/javase/2.png)