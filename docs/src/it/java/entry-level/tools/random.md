---
category: IT
article: false
---

# 随机数

## 雪花算法

雪花算法（Snowflake Algorithm）是一种用于生成分布式系统中唯一 ID 的算法。它最初由 Twitter 开发，用于在其分布式系统中生成全局唯一的 ID。雪花算法的设计目标是在分布式环境中生成趋势递增、唯一且分布均匀的 ID

雪花算法的 ID 结构如下：41位的时间戳 | 10位的机器ID | 12位的序列号

具体解释如下：

- 时间戳：占用 41 位，表示当前时间戳减去一个固定的起始时间，通常以毫秒为单位。这使得生成的ID在排序上是趋势递增的

- 机器ID：占用 10 位，用于标识不同的机器。在分布式系统中，每台机器分配一个唯一的 ID

- 序列号：占用 12 位，表示在同一毫秒内生成的不同 ID 的序号。当同一机器在同一毫秒内需要生成多个 ID 时，通过序列号区分它们

雪花算法的实现通常是通过在 64 位的整数中组合时间戳、机器 ID 和序列号来生成唯一的 ID。以下是雪花算法的一个简化版本的示例实现：

```java
public class SnowflakeIdGenerator {

    private static final long START_TIMESTAMP = 1609459200000L; // 起始时间戳，2021-01-01 00:00:00
    private static final long MACHINE_ID_BITS = 5L;
    private static final long SEQUENCE_BITS = 12L;

    private static final long MAX_MACHINE_ID = ~(-1L << MACHINE_ID_BITS);
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS);

    private long machineId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;

    public SnowflakeIdGenerator(long machineId) {
        if (machineId < 0 || machineId > MAX_MACHINE_ID) {
            throw new IllegalArgumentException("Machine ID must be between 0 and " + MAX_MACHINE_ID);
        }
        this.machineId = machineId;
    }

    public synchronized long generateId() {
        long timestamp = System.currentTimeMillis();

        if (timestamp < lastTimestamp) {
            throw new RuntimeException("Clock moved backwards. Refusing to generate ID.");
        }

        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) {
                // 当前毫秒的序列号用完，等待下一毫秒
                timestamp = waitNextMillis(lastTimestamp);
            }
        } else {
            // 不同毫秒，序列号重置为0
            sequence = 0L;
        }

        lastTimestamp = timestamp;

        return ((timestamp - START_TIMESTAMP) << (MACHINE_ID_BITS + SEQUENCE_BITS)) | (machineId << SEQUENCE_BITS) | sequence;
    }

    private long waitNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }

    public static void main(String[] args) {
        // 示例：创建一个机器ID为1的SnowflakeIdGenerator
        SnowflakeIdGenerator idGenerator = new SnowflakeIdGenerator(1);

        // 生成10个ID并输出
        for (int i = 0; i < 10; i++) {
            long id = idGenerator.generateId();
            System.out.println("Generated ID: " + id);
        }
    }
}
```

此示例是简化版本，实际中可能需要根据具体的需求进行调整和优化。在生产环境中使用雪花算法时，建议更加严格地考虑时钟同步、机器 ID 的分配等因素

## UUID

UUID：是一种标准化的 128 位标识符，通常以 32 个十六进制数字表示。其唯一性是通过时间戳、节点信息、时钟序列等因素的结合来确保的。UUID 的唯一性是全球性的，即使是在不同的设备上生成，也具有较高的唯一性

```java
@SpringBootTest
public class TestUUID {

    @Test
    public void test() {
        System.out.println(UUID.randomUUID()); // 获取随机UUID
        
        System.out.println(UUID.randomUUID().toString(true)); // 简化的UUID，去掉了横线
        
        System.out.println(UUID.fastUUID()); // 获取随机UUID，使用性能更好的ThreadLocalRandom生成UUID
        
        System.out.println(UUID.fastUUID().toString(true)); // 简化的UUID，去掉了横线，使用性能更好的ThreadLocalRandom生成UUID
    }
}
```

打印结果：

```text
cc12c45d-4704-431e-9add-8d6af91f9fb0
8d3c7e110b8c4b518b7b950f59230566
47fe76a2-cabb-4603-9e11-4847f44bd0aa
38c441f1047440678744f81e721a9095
```

## Random

Random：通过伪随机数生成器生成的随机数，其唯一性取决于生成随机数的算法和初始种子。在实践中，由于随机数生成器是伪随机的，它们可能在相同初始条件下生成相同的随机数序列，因此无法保证全局唯一性

### 整数

```java
import java.util.Random;

public class RandomNumberGenerator {

    public static int generateRandomNumber(int digits) {
        // 验证参数是否合法
        if (digits <= 0) {
            throw new IllegalArgumentException("Digits must be greater than 0");
        }
        // 计算随机数的范围
        int min = (int) Math.pow(10, digits - 1); // 例如生成5位数的整数，最小值就是 10000
        int max = (int) Math.pow(10, digits) - 1; // 例如生成5位数的整数，最大值就是 99999
        // 使用Random类生成在指定范围内的随机整数
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

    public static void main(String[] args) {
        // 生成一个五位数的随机整数
        int randomNumber = generateRandomNumber(5);
        System.out.println("Random Number: " + randomNumber);
    }
}
```

### 验证码

```java
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Random;

public class VerifyCodeGenerator {

    public static String generateVerifyCode(int verifySize) {
        // 字体只显示大写，去掉了1,0,i,o几个容易混淆的字符
        String verifyCodes = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        // 通过 System.currentTimeMillis() 作为种子创建一个伪随机数生成器 Random，以确保每次生成验证码时都有不同的种子，从而增加随机性
        Random random = new Random(System.currentTimeMillis());
        // 创建一个 StringBuilder 对象，用于构建验证码字符串，verifySize 参数表示验证码的长度
        StringBuilder verifyCode = new StringBuilder(verifySize);
        // 循环生成验证码字符串
        for (int i = 0; i < verifySize; i++) {
            // 根据随机生成的索引从字符源 verifyCodes 中选择一个字符
            verifyCode.append(verifyCodes.charAt(random.nextInt(verifyCodes.length() - 1)));
        }
        return verifyCode.toString();
    }

    public static void main(String[] args) {
        // 生成一个五位数的验证码
        String verifyCode = generateVerifyCode(5);
        System.out.println("Random verifyCode: " + verifyCode);
    }
    
}
```

### 验证码图片

```java
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Random;

/**
 * 验证码工具类
 *
 * @author yykk
 */
public class VerifyCodeUtils {

    private static Random random = new SecureRandom();

    public static String generateVerifyCode(int verifySize) {
        // 字体只显示大写，去掉了1,0,i,o几个容易混淆的字符
        String verifyCodes = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        // 通过 System.currentTimeMillis() 作为种子创建一个伪随机数生成器 Random，以确保每次生成验证码时都有不同的种子，从而增加随机性
        Random random = new Random(System.currentTimeMillis());
        // 创建一个 StringBuilder 对象，用于构建验证码字符串，verifySize 参数表示验证码的长度
        StringBuilder verifyCode = new StringBuilder(verifySize);
        // 循环生成验证码字符串
        for (int i = 0; i < verifySize; i++) {
            // 根据随机生成的索引从字符源 verifyCodes 中选择一个字符
            verifyCode.append(verifyCodes.charAt(random.nextInt(verifyCodes.length() - 1)));
        }
        return verifyCode.toString();
    }

    /**
     * 输出指定验证码的图片流
     *
     * @param width 生成图片的宽度
     * @param height 生成图片的高度
     * @param os 用于将生成的图片输出到指定位置
     * @param code 需要显示的验证码字符串
     */
    public static void outputImage(int width, int height, OutputStream os, String code) throws IOException {
        int verifySize = code.length();
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB); // 创建一个 BufferedImage 对象，指定宽度、高度和图像类型为 BufferedImage.TYPE_INT_RGB
        Random rand = new Random();
        Graphics2D g2 = image.createGraphics(); // 创建一个 Graphics2D 对象，用于绘图，设置抗锯齿效果
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        Color[] colors = new Color[5];
        Color[] colorSpaces = new Color[]{Color.WHITE, Color.CYAN, Color.GRAY, Color.LIGHT_GRAY, Color.MAGENTA, Color.ORANGE, Color.PINK, Color.YELLOW}; // 定义一些颜色数组，用于后续绘制干扰线和噪点
        float[] fractions = new float[colors.length];
        for (int i = 0; i < colors.length; i++) {
            colors[i] = colorSpaces[rand.nextInt(colorSpaces.length)];
            fractions[i] = rand.nextFloat();
        }
        Arrays.sort(fractions);

        g2.setColor(Color.GRAY);// 绘制图片的边框，设置边框颜色为灰色
        g2.fillRect(0, 0, width, height);

        Color c = getRandColor(200, 250);
        g2.setColor(c);// 绘制图片的背景，随机选择一个背景颜色
        g2.fillRect(0, 2, width, height - 4);

        // 绘制干扰线，生成随机数量的干扰线，并随机设置线条的颜色
        Random random = new Random();
        g2.setColor(getRandColor(160, 200));
        for (int i = 0; i < 20; i++) {
            int x = random.nextInt(width - 1);
            int y = random.nextInt(height - 1);
            int xl = random.nextInt(6) + 1;
            int yl = random.nextInt(12) + 1;
            g2.drawLine(x, y, x + xl + 40, y + yl + 20);
        }

        // 添加噪点，生成随机数量的噪点，颜色随机
        float yawpRate = 0.05f;// 噪声率
        int area = (int) (yawpRate * width * height);
        for (int i = 0; i < area; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);
            int rgb = getRandomIntColor();
            image.setRGB(x, y, rgb);
        }

        shear(g2, width, height, c);// 使图片扭曲

        g2.setColor(getRandColor(100, 160));
        int fontSize = height - 4;
        Font font = new Font("Algerian", Font.ITALIC, fontSize); // 设置字体和字符颜色
        g2.setFont(font);
        char[] chars = code.toCharArray();
        // 绘制验证码字符，通过旋转使字符呈现扭曲效果
        for (int i = 0; i < verifySize; i++) {
            AffineTransform affine = new AffineTransform();
            affine.setToRotation(Math.PI / 4 * rand.nextDouble() * (rand.nextBoolean() ? 1 : -1), (width / verifySize) * i + fontSize / 2, height / 2);
            g2.setTransform(affine);
            g2.drawChars(chars, i, 1, ((width - 10) / verifySize) * i + 5, height / 2 + fontSize / 2 - 10);
        }
        // 释放资源，将生成的图片写入指定的 OutputStream
        g2.dispose();
        ImageIO.write(image, "jpg", os);
    }

    /**
     * 根据指定的前景色和背景色范围，生成一个随机颜色，保证生成的颜色在合法范围内
     * @param fc 前景色的范围
     * @param bc 背景色的范围
     */
    private static Color getRandColor(int fc, int bc) {
        if (fc > 255) {
            fc = 255;
        }
        if (bc > 255) {
            bc = 255;
        }
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }

    /**
     * 生成一个包含三个随机整数的数组，表示 RGB 颜色的三个分量
     */
    private static int getRandomIntColor() {
        int[] rgb = new int[3];
        for (int i = 0; i < 3; i++) {
            rgb[i] = random.nextInt(255);
        }
        int color = 0;
        for (int c : rgb) {
            color = color << 8;
            color = color | c;
        }
        return color;
    }

    /**
     * 将图片进行水平和垂直方向的扭曲
     * @param graphics 绘图上下文
     * @param width 图片宽度
     * @param height 图片高度
     * @param color 颜色
     */
    private static void shear(Graphics graphics, int width, int height, Color color) {
        shearX(graphics, width, height, color); // 在水平方向上扭曲图片
        shearY(graphics, width, height, color); // 在垂直方向上扭曲图片
    }

    private static void shearX(Graphics graphics, int width, int height, Color color) {
        int period = random.nextInt(2);

        boolean borderGap = true;
        int frames = 1;
        int phase = random.nextInt(2);
        for (int i = 0; i < height; i++) {
            double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
            graphics.copyArea(0, i, width, 1, (int) d, 0);
            if (borderGap) {
                graphics.setColor(color);
                graphics.drawLine((int) d, i, 0, i);
                graphics.drawLine((int) d + width, i, width, i);
            }
        }
    }

    private static void shearY(Graphics graphics, int width, int height, Color color) {
        int period = random.nextInt(40) + 10; // 50;

        boolean borderGap = true;
        int frames = 20;
        int phase = 7;
        for (int i = 0; i < width; i++) {
            double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
            graphics.copyArea(i, 0, 1, height, 0, (int) d);
            if (borderGap) {
                graphics.setColor(color);
                graphics.drawLine(i, (int) d, i, 0);
                graphics.drawLine(i, (int) d + height, i, height);
            }
        }
    }

    public static void main(String[] args) {
        try (OutputStream os = new FileOutputStream("验证码.jpg")) {
            outputImage(160, 60, os, generateVerifyCode(5));
            System.out.println("验证码已生成并保存到验证码.jpg");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

![](https://img.sherry4869.com/blog/it/java/entry-level/tools/random/verifyCode1.jpg) ![](https://img.sherry4869.com/blog/it/java/entry-level/tools/random/verifyCode2.jpg) ![](https://img.sherry4869.com/blog/it/java/entry-level/tools/random/verifyCode3.jpg) ![](https://img.sherry4869.com/blog/it/java/entry-level/tools/random/verifyCode4.jpg) ![](https://img.sherry4869.com/blog/it/java/entry-level/tools/random/verifyCode5.jpg)