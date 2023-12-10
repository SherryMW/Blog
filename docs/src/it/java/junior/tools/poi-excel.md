---
category: IT
order: 4
article: false
---

# Apache POI 读写电子表格

官网：[https://poi.apache.org/index.html](https://poi.apache.org/index.html)

API：[https://poi.apache.org/apidocs/index.html](https://poi.apache.org/apidocs/index.html)

::: info 官方自述
HSSF 是我们对 Microsoft Excel 97 (-2003) 文件格式 (BIFF8) 的纯 Java 移植。XSSF 是我们对 Microsoft Excel XML (2007+)文件格式（OOXML）的纯 Java 移植。SS 是一个包，用一个共同的 API 为这两种格式提供共同的支持。它们都支持读和写的能力
:::

## 相关依赖

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.apache.poi/poi -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>5.2.3</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.apache.poi/poi-ooxml -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.2.3</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.19.0</version>
    </dependency>
</dependencies>
```

## 图像

图片是绘图支持的一部分。要添加一个图像，只需在绘图元老中调用 `createPicture()` 在写这篇文章的时候，支持 PNG JPG DIB 类型

应该注意的是，一旦你在工作表上添加图像，任何现有的图纸都可能被擦除

![表格渲染效果](https://img.sherry4869.com/blog/it/apache/poi/poi-excel/img.png)

### 准备工作

1. 创建一个基于 Maven 构建的 Java 工程

2. 把 [报销单](https://img.sherry4869.com/blog/it/apache/poi/poi-excel/%E6%8A%A5%E9%94%80%E5%8D%95.xlsx) 下载到工程中的 src/main/resources/static 目录下

3. 可以参考 [条形码生成技术-Barcode4J](/it/java/barcode/barcode4j/) 把生成出来的条形码下载到工程中的 src/main/resources/static 目录下

### 代码实现

```java
public class Main {
    
    public static void main(String[] args) throws Exception {
        Workbook workbook = new XSSFWorkbook("src/main/resources/static/报销单.xlsx"); //新建工作薄
        CreationHelper creationHelper = workbook.getCreationHelper(); //一个处理实例化具体类的对象，它是HSSF和XSSF所需的各种实例。绕过Java中的一个限制，即我们不能在接口或抽象类上有静态方法。这允许你为一个给定的接口获得适当的类，而不必担心你是否在处理HSSF或XSSF
        ClientAnchor clientAnchor = creationHelper.createClientAnchor(); //创建客户端锚点。使用此对象在图纸中定位绘图对象
        Drawing drawingPatriarch = workbook.getSheetAt(0).createDrawingPatriarch(); //创建最高级别的绘图元老用来添加图形或图表，请注意，这通常会产生删除该工作表上任何现有绘图的效果
        clientAnchor.setRow1(1); //设置第一个单元格的行（从 0 开始）
        clientAnchor.setCol1(5); //设置第一个单元格的列（从 0 开始）
        Picture picture = drawingPatriarch.createPicture(clientAnchor, workbook.addPicture(IOUtils.toByteArray(new FileInputStream("src/main/resources/static/barcode.png")), Workbook.PICTURE_TYPE_PNG)); //创建图片
        picture.resize(0.7); //按比例调整图像大小
        FileOutputStream fos = new FileOutputStream("src/main/resources/static/报销单导出.xlsx");
        workbook.write(fos); //输出到流
        fos.close();
    }
}
```

### 参数配置

::: tabs

@tab resize

**void resize()**

将图像重置为嵌入图像的尺寸

---

**void resize(double scale)**

按比例调整图像大小

---

**void resize(double scaleX, double scaleY)**

调整图像大小，请注意，此方法仅适用于工作簿使用默认字体大小（Arial 10pt 表示.xls，Calibri 11pt 表示.xlsx）。如果更改默认字体，调整大小的图像可以垂直或水平划线

resize(1.0,1.0) 保留原始大小

resize(0.5,0.5) 调整为原始大小的 50%

resize(2.0,2.0) 调整为原始大小的 200%

resize(Double.MAX_VALUE,Double.MAX_VALUE) 调整为嵌入图像的尺寸

参数：

scaleX：图像宽度相对于原始宽度相乘的量

scaleY：图像高度相对于原始高度相乘的量

:::

### 常见问题

如果在使用 org.apache.poi 4.1.2版本的小伙伴会发现程序中会提示 IOUtils 类无法找到，此时需要引入以下依赖

```xml
<!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```