---
category: IT
article: false
---

# UML

- UML(Unified Modeling Language) 统一建模语言是一种用于面向对象软件开发的图形化建模语言。它由 Grady Booch、James Rumbaugh 和 lvar Jacobson 等三位著名的软件工程师所开发，并于 1997 年正式发布。UML 提供了一套通用的图形化符号和规范，帮助开发人员以图形化的形式表达软件设计和编写的所有关键方面，从而更好地展示软件系统的设计和实现过程

- UML 是一种图形化语言，类似于现实生活中建筑工程师画的建筑图纸，图纸上有特定的符号代表特殊的含义

- UML 不是专门为 Java 语言准备的。只要是面向对象的编程语言，在开发前期的设计阶段都需要画 UML 图（设计模式、软件开发七大原则等同样也不是只为 Java 语言准备的）

- UML 图包括：

  - 类图（Class Diagram）：描述软件系统中的类、接口、关系和其属性等

  - 用例图（Use Case Diagram）：描述系统的功能需求和用户与系统之间的关系

  - 序列图（Sequence Diagram）：描述对象之间的交互，消息传递和时序约束等

  - 状态图（Statechart Diagram）：描述类或对象的生命周期以及状态之间的转换

  - 对象图（Object Diagram）：表示特定时间的系统状态，并显示其包含的对象及其属性

  - 协作图（Collaboration Diagram）：描述对象之间的协作

  - 活动图（Activity Diagram）：描述系统的动态行为和流程，包括控制流和对象流

  - 部署图（Deployment Diagram）：描述软件或系统在不同物理设备上部署的情况，包括计算机、网络、中间件、应用程序等

- 常见的 UML 建模工具有：StarUML、Rational Rose 等

## 类之间的关系

- 泛化关系（is a）：继承关系 extends，Cat is a Animal。关系最紧密的，因为父类添加属性方法后，会影响到子类，子类会把父类的属性方法都给继承过来

  ![](https://img.sherry4869.com/blog/it/java/javase/32.png)

- 实现关系（is like a）：接口与是实现类，implements

  ![](https://img.sherry4869.com/blog/it/java/javase/33.png)

- 关联关系（has a）：A 类中有一个 B 类的引用，A has a B

  ![](https://img.sherry4869.com/blog/it/java/javase/34.png)

- 聚合关系：聚合关系指的是一个类包含、合成或拥有另一个类的实例，而这个实例是可以独立存在的。聚合关系是一种弱关联关系，表示整体与部分之间的关系。例如一个教室有多个学生（一对多）；对象之间的生命没有绑定在一起（学生没了教室还在）

  ![](https://img.sherry4869.com/blog/it/java/javase/35.png)

- 组合关系（Composition）：组合关系是聚合关系的一种特殊情况，表示整体与部分之间的关系更加强烈。组合关系指的是一个类包含、合成或者拥有另外一个类的实例，而这个实例只能同时存在于一个整体对象中。如果整体对象被销毁，那么部分对象也会被销毁。例如一个人对应四个肢体

  ![](https://img.sherry4869.com/blog/it/java/javase/36.png)

- 依赖关系（Dependency）：依赖关系是一种临时性的关系，当一个类使用另一个类的功能时，就会产生依赖关系。如果一个类的改变会影响到另一个类的功能，那么这两个类之间就存在依赖关系。依赖关系是一种较弱的关系，可以存在多个依赖于同一个类的对象。例如 A 类中使用了 B 类，但 B 类作为 A 类的方法参数或者局部变量等

  ![](https://img.sherry4869.com/blog/it/java/javase/37.png)