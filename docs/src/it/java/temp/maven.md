---
category: IT
article: false
---

# Maven

`scope` 属性来指定依赖项的作用范围。作用范围定义了依赖项在项目的不同阶段的可见性和使用方式。以下是 Maven 中常见的作用范围：

1. `compile`：这是默认的作用范围。它指定了依赖项在编译、测试和运行阶段都可用。换句话说，它会被包含在项目的编译输出和最终构建产物中

2. `provided`：依赖项在编译时和测试时可用，但在运行时由目标环境（如应用服务器）提供。这通常用于将依赖项包含在编译路径中，但不会打包到最终的构建产物中

3. `runtime`：依赖项在编译时不需要，但在运行时需要。这意味着它不会被包含在编译输出中，但会被包含在最终的构建产物中，以便在运行时使用

4. `test`：依赖项仅在测试编译和执行测试时可用。它不会被包含在项目的编译输出或最终构建产物中，因为它只用于测试代码

5. `system`：依赖项是系统范围的，需要通过系统属性来指定路径。这种作用范围通常用于引用本地文件系统中的依赖项

6. `import`：依赖项是由其他项目的`dependencyManagement`节中的`import`声明导入的。这个作用范围通常用于管理依赖项版本，但不会实际包含依赖项