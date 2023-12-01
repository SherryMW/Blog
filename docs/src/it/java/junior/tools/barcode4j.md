---
category: IT
tag: Java
order: 1
article: false
---

# Barcode4J 条形码生成技术

<!-- more -->

官网：[https://barcode4j.sourceforge.net](https://barcode4j.sourceforge.net/)

API：[https://barcode4j.sourceforge.net/trunk/javadocs/index.html](https://barcode4j.sourceforge.net/trunk/javadocs/index.html)

![Barcode4J 支持的条形码符号](https://img.sherry4869.com/blog/it/java/junior/tools/barcode4j/img_3.png)

## 相关依赖

```xml
<dependencies>
    <dependency>
        <groupId>net.sf.barcode4j</groupId>
        <artifactId>barcode4j-light</artifactId>
        <version>2.0</version>
    </dependency>
</dependencies>
```

barcode4j：此库包含完整功能，最新 2.1 版本

barcode4j-light：此库仅包含核心功能，属于轻量级版本，最新 2.0 版本

## 代码实现

```java
public class Main {
    public static void main(String[] args) throws Exception {
        Code128Bean bean = new Code128Bean(); //CODE128 码可表示从 ASCII 0 到ASCII 127 共128个字符，故称128码。其中包含了数字、字母和符号字符
        int resolution = 150; //设置条形码的分辨率，数值越大分辨率越高
        bean.setModuleWidth(0.3); //设置模块的宽度（单位：mm）
        bean.doQuietZone(true); //设置条形码两侧是否加空白
        /*
         * 位图画布提供器
         * out - 要写入的输出流
         * mime - 所需输出格式的MIME类型（例如“image/png”）
         * resolution - 所需的图像分辨率（每英寸点数）
         * imageType - 所需的图像类型（值：BufferedImage.TYPE_*）
         * antiAlias - 如果应启用抗锯齿，则为 true
         * orientation - 方向： 0, 90, 180, 270, -90, -180，-270
         */
        BitmapCanvasProvider canvas = new BitmapCanvasProvider(new FileOutputStream("src/main/resources/TH20221217170000001B.png"), "image/png", resolution, BufferedImage.TYPE_BYTE_BINARY, false, 0);
        bean.generateBarcode(canvas, "TH20221217170000001B"); //使用给定的画布生成条形码，以将条形码呈现为其输出格式
        canvas.finish(); //结束绘制
    }
}
```

## 常用类

### Code128Bean

::: tabs

@tab setModuleWidth(double width)

设置窄模块的宽度：

![setModuleWidth(0.3)效果图](https://img.sherry4869.com/blog/it/java/junior/tools/barcode4j/img.png)

![setModuleWidth(0.9)效果图](https://img.sherry4869.com/blog/it/java/junior/tools/barcode4j/img_1.png)


@tab doQuietZone(boolean value)

控制条形码两侧是否留有空白区域：

![doQuietZone(true)效果图](https://img.sherry4869.com/blog/it/java/junior/tools/barcode4j/img.png)

![doQuietZone(false)效果图](https://img.sherry4869.com/blog/it/java/junior/tools/barcode4j/img_2.png)

:::