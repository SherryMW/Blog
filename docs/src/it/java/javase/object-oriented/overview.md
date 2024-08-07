---
category: IT
article: false
order: 1
---

# 概述

软件开发方法：面向过程和面向对象

## 面向过程

关注点在实现功能的步骤上

- PO：Procedure Oriented 代表语言：C 语言

- 面向过程就是分析出解决问题所需要的步骤，然后用函数把这些步骤一步一步实现，使用的时候一个接着一个依次调用就可以了

- 例如开汽车：启动、踩离合、挂挡、松离合、踩油门

- 例如装修房子：做水电、刷墙、贴地砖、做柜子和家具

- 对于简单的流程是适合使用面向过程的方式进行的。复杂的流程不适合使用面向过程的开发方式

## 面向对象

关注点在实现功能需要哪些对象的参与

- OO：Object Oriented 面向对象。包括 OOA，OOD，OOP

  - OOA：Object Oriented Analysis 面向对象分析 

  - OOD：Object Object Oriented Design 面向对象设计

  - OOP：Object Oriented Programming 面向对象编程

- 人类是以面向对象的方式去认知世界的。所以采用面向对象的思想更容易处理复杂的问题

- 面向对象就是分析出解决这个问题都需要哪些对象的参加，然后让对象之间协作起来形成一个系统

- 例如开汽车：有汽车对象以及司机对象。司机对象有一个驾驶的行为。司机对象驾驶汽车对象

- 例如装修房子：有水电工对象、油漆工对象、瓦工对象、木工对象。每个对象都有自己的行为动作，最终完成装修

- 面向对象开发方式耦合度低，扩展能力强。例如采用面向过程生产一台电脑，不会分 CPU，内存和硬盘，它会按照电脑的工作流程一次成型。而采用面向对象生产一台电脑，CPU 是一个对象，内存条是一个对象，硬盘是一个对象，此时如果觉得硬盘容量小，后期是很容易更换的，这就是扩展性

面向对象三大特征

封装（Encapsulation）

继承（Inheritance）

多态（Polymorphism）

## 类

- 现实世界中，事物与事物之间具有共同特征，例如：刘德华和梁朝伟都有姓名、身份证号、身高等状态。都有吃、跑、跳等行为。将这些共同的状态和行为提取出来，形成了一个模板，称为类

- 类实际上是人类大脑思考总结的一个模板，类是一个抽象的概念

- 状态在程序中对应属性。属性通常用变量来表示

- 行为在程序中对应方法。用方法来描述行为动作

- 类 = 属性 + 方法

## 对象

- 实际存在的个体

- 对象又称为实例（instance）

- 通过类这个模板可以实例化 n 个对象（通过类可以创造多个对象）

- 例如通过“明星类”可以创造出“刘德华对象”和“梁朝伟对象”

- 明星类中有一个属性姓名：`String name;`

- “刘德华对象”和“梁朝伟对象”由于是通过明星类创造出来的，所以这两个对象都有 `name` 属性，但值是不同的，因此这种属性被称为实例变量