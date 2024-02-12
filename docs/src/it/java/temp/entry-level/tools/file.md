---
category: IT
article: false
---

# 文件处理

## 压缩文件

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileUtil {

    private static final int BUFFER_SIZE = 4096;

    /**
     * 创建 ZIP 文件
     * @param srcFiles 包含多个文件的列表
     * @param zipFile  要创建的 ZIP 文件
     */
    public static void toZip(List<File> srcFiles, File zipFile) throws IOException {
        if (zipFile == null || !zipFile.getName().endsWith(".zip")) {
            throw new IllegalArgumentException("Invalid zip file name.");
        }
        try (FileOutputStream fos = new FileOutputStream(zipFile); ZipOutputStream zos = new ZipOutputStream(fos)) { // 使用 FileOutputStream 创建文件输出流 fos，然后将其传递给 ZipOutputStream，这样就可以将数据写入 ZIP 文件
            // 遍历 srcFiles 列表，对每个文件调用 addFileToZip 方法，将文件添加到 ZIP 文件中
            for (File srcFile : srcFiles) {
                addFileToZip(srcFile, zos);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 添加文件到 ZIP
     * @param srcFile 将一个文件添加到给定的 ZipOutputStream
     * @param zos ZipOutputStream
     */
    private static void addFileToZip(File srcFile, ZipOutputStream zos) throws IOException {
        byte[] buffer = new byte[BUFFER_SIZE];
        try (FileInputStream fis = new FileInputStream(srcFile)) { // 使用 FileInputStream 读取文件数据，然后将其写入 ZipOutputStream
            zos.putNextEntry(new ZipEntry(srcFile.getName())); // 在写入之前，使用 putNextEntry 创建 ZIP 条目（entry），并使用文件的名称作为条目的名称
            int length;
            // 使用一个循环从文件读取数据并写入 ZIP 输出流，最后使用 closeEntry 关闭条目
            while ((length = fis.read(buffer)) > 0) { // fis.read(buffer) 方法用于从输入流 fis 中读取数据，并将读取的字节数放入 length 变量中。如果已经读到流的末尾，fis.read(buffer) 返回 -1
                zos.write(buffer, 0, length);
            }
            zos.closeEntry();
        }
    }

}
```

调用示例：

```java
import com.mw.utils.FileUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

@SpringBootTest
public class FileTest {

    @Test
    public void test() {
        Path tempPath = Paths.get("F:/workspace/mw/temp/excel/");
        try {
            // 将多个文件压缩成一个zip文件，第一个参数是 List<File>，表示要打包的文件列表；第二个参数是 File，表示生成的 ZIP 文件
            FileUtil.toZip(Files.list(tempPath).map(path -> { // 使用 Files.list 方法列出指定目录 tempPath 下的所有文件和子目录的路径
                return path.toFile(); // 使用 map 转换操作，将路径 (Path) 映射为文件 (File)。这样，我们得到了一个 File 对象的流
                // 使用 collect 操作，将文件流收集为一个 List<File>；Paths.get 构建一个 Path 对象，表示要生成的 zip 文件的路径
            }).collect(Collectors.toList()), Paths.get("F:/workspace/mw/temp/excel/", "test.zip").toFile());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## 递归删除文件夹

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.EnumSet;

public class FileUtil {

    /**
     * 递归删除文件夹
     * @param folderPath 要删除的文件夹
     */
    public static void deleteFolderRecursively(Path folderPath) throws IOException {
        // 使用 Files.walkFileTree 遍历文件树，对每个文件和文件夹执行相应的操作
        Files.walkFileTree(folderPath, EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Files.delete(file); // 删除文件
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                Files.delete(dir); // 删除文件夹
                return FileVisitResult.CONTINUE;
            }
        });
    }
}
```

调用示例：

```java
import com.mw.utils.FileUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootTest
public class FileTest {

    @Test
    public void test() {
        Path tempPath = Paths.get("F:/workspace/mw/temp/excel/");
        try {
            if (Files.isDirectory(tempPath)) {
                FileUtil.deleteFolderRecursively(tempPath); // 删除 excel 文件夹
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```