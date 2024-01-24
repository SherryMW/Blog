---
category: IT
order: 1
article: false
---

# Java 并发编程

给一群喜欢插队的人分发任务，你必须小心翼翼地管理他们，以免他们互相踩踏或者乱七八糟地抢夺资源

<!-- more -->

## 进程与线程

假设你正在编写一个文本编辑器的程序。当你打开该程序时，操作系统会为该程序分配一个进程。这个进程拥有独立的内存空间、文件句柄和其他系统资源。在这个程序的执行过程中，可能有多个任务需要同时进行，比如接收用户的输入、显示文本内容、保存文件等。为了实现并发执行这些任务，程序可以创建多个线程。例如，可以创建一个用于接收用户输入的线程，该线程不断监听键盘输入并将输入内容传递给程序。同时，可以创建一个用于显示文本内容的线程，该线程负责将文本显示在屏幕上。还可以创建一个用于保存文件的线程，该线程将文本内容保存到文件中

在这个例子中，整个程序是一个进程，而接收输入、显示文本和保存文件分别是不同的线程。这些线程共享程序的内存空间和其他资源，可以并发执行各自的任务。例如，当用户在键盘上输入时，接收输入的线程可以立即将输入内容传递给程序，而不会阻塞显示文本的线程

---

此时我们可能会有如下疑问：如果电脑的 CPU 是单核单线程的话该如何运行多线程的程序呢？

单核单线程的 CPU 在运行多线程程序时，实际上是通过时间片轮转的方式来模拟多个线程同时执行的效果。时间片轮转是一种调度算法，将 CPU 的执行时间划分成若干个时间片段，每个线程被分配一个时间片段来执行任务。当程序中存在多个线程时，CPU 会快速地在这些线程之间进行切换，每个线程被分配一小段时间片段，然后切换到下一个线程。这个过程在单核单线程的 CPU 上是依次进行的。当一个线程的时间片段用完后，CPU 会保存当前线程的状态，并切换到下一个线程继续执行。这种切换是在微秒级别进行的，速度非常快，看起来像是多个线程同时执行，但实际上是通过快速切换来实现的

## 并发与并行

并发执行：任务 A 执行一段时间，然后切换到任务 B 执行一段时间，再切换回任务 A 继续执行，如此交替进行。任务 A 和任务 B 在时间上重叠执行，但不一定是同时进行的

并行执行：任务 A 和任务 B 在同一时刻同时执行，每个任务都有独立的执行路径和资源。它们可以分别在不同的处理器核心上并行执行

---

需要注意的是，并发和并行不是互斥的，可以同时存在。在一台多核处理器上，可以通过并发的方式执行多个任务，并且每个任务在自己的处理器核心上并行执行

假设有一个程序需要处理大量的数据，可以将这个任务划分为多个子任务，每个子任务处理一部分数据。在一台拥有多个处理器核心的机器上，可以并发地执行这些子任务。并发执行的过程中，每个处理器核心负责执行一个子任务。这些子任务可以交替执行，通过时间片轮转或者调度算法来进行切换。这样，多个子任务在时间上重叠执行，共享 CPU 资源，实现了并发。而在每个处理器核心内部，子任务又可以在其自己的执行路径上并行执行。即使在同一时刻，每个处理器核心可以同时处理不同的数据片段。通过并发和并行的结合，可以充分利用多核处理器的计算能力，提高程序的处理速度和吞吐量。每个处理器核心独立执行一个任务，减少了任务之间的竞争和等待时间，从而提升整体的性能

## 线程状态

当使用多线程编程时，线程可以处于不同的状态，表示线程在不同的阶段和条件下的行为和状态。在 Java 中，线程的状态由 `Thread` 类的内部枚举类 `Thread.State` 定义。下面是对 Java 线程状态的详细描述：

- NEW（新建）：当线程对象被创建但还没有调用 `start()` 方法时，线程处于 NEW 状态。在这个状态下，线程对象已经被创建，但还没有启动执行

- RUNNABLE（可运行）：当线程调用 `start()` 方法后，线程进入 `RUNNABLE` 状态。表示线程可以运行但不一定正在执行。在 `RUNNABLE` 状态下，线程可能正在等待 CPU 时间片分配，也可能正在等待获取同步锁

- BLOCKED（阻塞）：当线程试图获取一个被其他线程持有的锁时，该线程进入 `BLOCKED` 状态。在 `BLOCKED` 状态下，线程暂停执行，直到获取到所需的锁。例如，当线程在同步代码块或方法中等待锁时，它会进入 `BLOCKED` 状态

- WAITING（等待）：线程进入 WAITING 状态是因为调用了 `Object.wait()`、`Thread.join()` 或 `LockSupport.park()` 等方法，使线程进入等待状态，直到其他线程显式地唤醒它。在 WAITING 状态下，线程不会自动恢复执行，而需要其他线程的干预

- TIMED_WAITING（计时等待）：类似于 WAITING 状态，但是在一定的时间后会自动返回。线程在调用 `Thread.sleep()`、`Object.wait(long)`、`Thread.join(long)` 或 `LockSupport.parkNanos()` 等方法时，会进入 TIMED_WAITING 状态

- TERMINATED（终止）：当线程的 `run()` 方法执行完毕或者因异常而中断时，线程进入 TERMINATED 状态。终止的线程不再运行

线程的状态转换通常由 Java 虚拟机（JVM）和操作系统的调度机制自动管理，开发人员不需要直接控制。线程状态的变化是通过上下文切换实现的，即当操作系统分配时间片给线程时，线程的状态可能会从 RUNNABLE 转换为 BLOCKED、WAITING 或 TIMED_WAITING，而当线程的时间片用完或等待的条件满足时，线程又可以从阻塞状态转换为 RUNNABLE 状态

## 线程创建方式

1. 继承 `Thread` 类：可以创建一个继承自 `Thread` 类的子类，并重写其 `run()` 方法来定义线程的执行逻辑。然后通过创建子类的实例来创建线程对象，最后调用线程对象的 `start()` 方法启动线程

    ```java
    public class Demo {
        public static void main(String[] args) {
            // 创建线程对象并启动线程
            MyThread myThread = new MyThread();
            myThread.start();
        }
    
        static class MyThread extends Thread {
            @Override
            public void run() {
                // 线程的执行逻辑
            }
        }
    }
    ```

2. 实现 `Runnable` 接口：可以创建一个实现了 `Runnable` 接口的类，并实现其 `run()` 方法。然后通过创建该类的实例来创建线程对象，将其作为参数传递给 `Thread` 类的构造函数，最后调用线程对象的 `start()` 方法启动线程

    ```java
    public class Demo {
        public static void main(String[] args) {
            // 创建线程对象并启动线程
            MyRunnable myRunnable = new MyRunnable();
            Thread thread = new Thread(myRunnable);
            thread.start();
        }
    
        static class MyRunnable implements Runnable {
            @Override
            public void run() {
                // 线程的执行逻辑
            }
        }
    }
    ```

3. 实现 `Callable` 接口：创建一个实现了 `Callable` 接口的类，并实现其 `call()` 方法来定义线程的执行逻辑。创建该类的实例，并将其作为参数传递给 `FutureTask` 类的构造函数来创建一个 `FutureTask` 对象。然后，将 `FutureTask` 对象作为参数传递给 `Thread` 类的构造函数来创建线程对象。最后，调用线程对象的 `start()` 方法启动线程

    ```java
    public class Demo {
        public static void main(String[] args) {
            // 创建线程对象并启动线程
            MyCallable myCallable = new MyCallable();
            FutureTask<String> futureTask = new FutureTask<>(myCallable);
            Thread thread = new Thread(futureTask);
            thread.start();
        }
    
        static class MyCallable implements Callable<String> {
            @Override
            public String call() throws Exception {
                // 线程的执行逻辑
                return "Hello World!";
            }
        }
    }
    ```

实际上，`Thread thread = new Thread();` 这种方式也算是创建线程，但在这种情况下，创建的线程对象默认情况下是空的，不执行任何操作。如果直接调用 `thread.start()` 启动这个空线程，它会立即启动并立即结束，因为没有定义任何实际的任务逻辑

另外也可以使用匿名类或 Lambda 表达式来创建线程对象

使用匿名类创建线程：

```java
public class Demo {
    public static void main(String[] args) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                // 线程的执行逻辑
            }
        }).start();
    }
}
```

使用 Lambda 表达式创建线程：

```java
public class Demo {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            // 线程的执行逻辑
        });
        thread.start();
    }
}
```











































## 高并发

高并发是指系统能够同时处理大量的并发请求或用户访问的能力。在一个具有高并发需求的系统中，系统能够有效地处理大量的并发请求，保持稳定的性能，并且不因请求量的增加而出现延迟或崩溃。高并发通常出现在许多互联网应用场景中，如电子商务网站、社交媒体平台、在线游戏、支付系统等。这些系统需要处理大量用户同时发起的请求，例如浏览网页、提交订单、发送消息、支付等