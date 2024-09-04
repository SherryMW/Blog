---
category: IT
article: false
---

# 下载与安装

JDK 下载地址：[https://www.oracle.com/java/technologies/downloads](https://www.oracle.com/java/technologies/downloads/)

高版本 JDK 在安装的过程中会往系统环境 Path 变量中新增 【C:\Program Files\Common Files\Oracle\java\javapath】 值，因此我们不需要手动去配置 JDK 环境变量

Windows 下载安装完成后打开 DOS 命令窗口执行 `java -version` 或 `javac -version` 命令检查是否安装成功

运行：C:\Program Files\Java\jdk-21\bin\java.exe

编译：C:\Program Files\Java\jdk-21\bin\javac.exe

源码路径：C:\Program Files\Java\jdk-21\lib\src.zip

存放命令：C:\Program Files\Java\jdk-21\bin

存放类库：C:\Program Files\Java\jdk-21\lib

----

Windows Path 环境变量的作用：

- Path 环境变量是隶属于 Windows 操作系统的

- 在 Path 中有很多路径，路径和路径之间采用分号隔开

- 在 DOS 命令窗口中输入一个 DOS 命令之后，Windows 会先从当前路径下找到这个命令，如果找不到则会去环境变量 Path 路径中查找该命令

- 因此 Path 环境变量实际上就是给 Windows 操作系统指路的

---

一台电脑上需要安装多个不同版本的 JDK，例如 Windows 上已经安装了 JDK8，想安装多一个 JDK21：

1. 新建系统环境变量【JAVA_HOME8】值为【C:\Program Files\Java\jdk-1.8】

2. 新建系统环境变量【JAVA_HOME21】值为【C:\Program Files\Java\jdk-21】

3. 新建系统环境变量【JAVA_HOME】值为【%JAVA_HOME21%】如果想用 JDK8 的话，就把值修改成【%JAVA_HOME8%】

4. 编辑系统环境变量【Path】，新增值【%JAVA_HOME%\bin】