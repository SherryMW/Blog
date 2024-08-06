---
category: IT
article: false
order: 12
---

# package

包机制作用：便于代码管理，不同的类放在不同的包下，好维护

怎么定义包：在 Java 源码第一行编写 `package 包名` 语句。注意：`package` 语句只能出现在 Java 代码第一行

包名命名规范：要求是全部小写。公司域名倒序 + 项目名 + 模块名+ 功能名。例如：com.powernode.oa.empgt.service

```java
package com;

public class PackageTest {

    public static void main(String[] args) {
        
    }
}
```

如果带包编译：`javac -d` 编译后的存放目录 源文件路径，例如：`javac -d . PackageTest.java` 运行后当前目录会生成一个 `com` 目录，里面有 `PackageTest.class` 字节码文件

一旦定义了 `package` 之后，有了包机制之后，完整类名是包含包名的，所以运行的时候一定要添加包名：`java com.powernode.javase.chapter.PackageTest`