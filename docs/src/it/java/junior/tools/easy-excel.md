---
category: IT
order: 5
article: false
---

# Easy Excel

官网：[https://easyexcel.opensource.alibaba.com](https://easyexcel.opensource.alibaba.com/)

EasyExcel 是一个基于 Java 的、快速、简洁、解决大文件内存溢出的 Excel 处理工具。他能让你在不用考虑性能、内存的等因素的情况下，快速完成 Excel 的读、写等功能

## 相关依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.3.2</version>
</dependency>
```

## WEB 中的写

### 后端参考代码

```java {36-41}
import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mw.common.BusinessException;
import com.mw.common.ResponseCode;
import com.mw.mapper.ProductsMapper;
import com.mw.service.IExportService;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.PageProductRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.Objects;

@Service
@Slf4j
public class ExportServiceImpl implements IExportService {

    @Resource
    private ProductsMapper productsMapper;

    @Override
    public void exportConditionProduct(ExportProductReqVO vo, HttpServletResponse response) {
        if (Objects.isNull(vo.getIds()) || vo.getIds().isEmpty()) {
            throw new BusinessException(ResponseCode.EXPORT_CONDITION_ERROR);
        }
        // 条件查询分页数据
        IPage<PageProductRespVO> result = productsMapper.selectPageProduct(new Page<>(vo.getCurrent(), vo.getSize()), vo);
        //通过 EasyExcel 写入数据进 Excel 文件并返回给客户端
        try {
            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION);
            response.setCharacterEncoding("UTF-8");
            String fileName = URLEncoder.encode("商品数据导出", "UTF-8").replaceAll("\\+", "%20");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ".xlsx");
            EasyExcel.write(response.getOutputStream(), PageProductRespVO.class).sheet("商品列表").doWrite(result.getRecords());
        } catch (Exception e) {
            log.error("exportConditionProduct Error:{}", e.getMessage());
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
    }
}
```

- `response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE)`：

    设置响应的内容类型为二进制流，表明这是一个文件下载的响应

- `response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)`：

    设置响应头，允许前端获取 Content-Disposition 头信息

- `response.setCharacterEncoding("UTF-8");`：

    设置响应的字符编码为 UTF-8，确保正确处理包含中文字符的文件名

- `String fileName = URLEncoder.encode("商品数据导出", "UTF-8").replaceAll("\\+", "%20")`：


    使用 `URLEncoder.encode` 对文件名进行 URL 编码。`URLEncoder.encode` 默认将空格转换为 `+`，而在 URL 中，空格应该转换为 `%20`，因此使用 `replaceAll` 将 `+` 替换为 `%20`

- `response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ".xlsx")`：

    设置 Content-Disposition 响应头，指定了文件的下载方式和文件名。attachment 表示以附件方式下载，filename 后面是文件名。在这里，文件名为 "商品数据导出.xlsx"

- `EasyExcel.write(response.getOutputStream(), PageProductRespVO.class).sheet("商品列表").doWrite(result.getRecords())`：

    使用 EasyExcel 将数据写入 Excel 文件。`response.getOutputStream()` 获取响应的输出流，`PageProductRespVO.class` 是数据对象的类，"商品列表" 是 Excel 表格的 sheet 名称，`result.getRecords()` 是需要写入的数据

### 前端参考代码

```ts
const onSelectExport = async () => {
    await productExportApi(pageProductForm).then(res => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(res.data);
        downloadLink.download = decodeURI(res.headers['content-disposition'].split('attachment;filename=')[1]);
        downloadLink.click();
    }).catch(error => {
    })
}
```

- `const downloadLink = document.createElement('a')`：

    创建一个新的 `<a>` 元素，这是 HTML 中超链接（anchor）元素的表示

- `downloadLink.href = URL.createObjectURL(res.data)`：

    通过 `URL.createObjectURL` 创建一个临时的 URL，该 URL 对应一个 Blob 对象。`res.data` 可能是服务器返回的二进制数据（比如 Excel 文件的内容），`createObjectURL` 会将这个二进制数据转换为一个可以被浏览器解释的 URL

- `downloadLink.download = decodeURI(res.headers['content-disposition'].split('attachment;filename=')[1])`：

    从服务器的响应头中获取 Content-Disposition 头部，其中包含了文件名的信息。通过 `split` 函数分割字符串，提取出文件名部分。使用 `decodeURI` 对文件名进行解码，确保其中的特殊字符正确显示。将解码后的文件名赋值给 `<a>` 元素的 `download` 属性，指定下载文件时的文件名

- `downloadLink.click()`：

    调用 `click` 方法模拟用户点击操作。这一步实际上是触发浏览器开始下载文件的操作。通过设置 `<a>` 元素的 `href` 和 `download` 属性，浏览器会按照这些属性的值进行下载

## 根据模板写入

### 后端参考代码

```java {42-44}
import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mw.common.BusinessException;
import com.mw.common.ResponseCode;
import com.mw.mapper.ProductsMapper;
import com.mw.service.IExportService;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.PageProductRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.Objects;

@Service
@Slf4j
public class ExportServiceImpl implements IExportService {

    @Resource
    private ProductsMapper productsMapper;

    @Override
    public void exportConditionProduct(ExportProductReqVO vo, HttpServletResponse response) {
        if (Objects.isNull(vo.getIds()) || vo.getIds().isEmpty()) {
            throw new BusinessException(ResponseCode.EXPORT_CONDITION_ERROR);
        }
        // 条件查询分页数据
        IPage<PageProductRespVO> result = productsMapper.selectPageProduct(new Page<>(vo.getCurrent(), vo.getSize()), vo);
        //通过 EasyExcel 写入数据进 Excel 文件并返回给客户端
        try {
            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION);
            response.setCharacterEncoding("UTF-8");
            String fileName = URLEncoder.encode("商品数据导出", "UTF-8").replaceAll("\\+", "%20");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ".xlsx");
            EasyExcel.write(response.getOutputStream(), PageProductRespVO.class)
                    .withTemplate(this.getClass().getResourceAsStream("/excel/export_product_template.xlsx")) // 使用模板写入数据
                    .needHead(false)
                    .sheet()
                    .doWrite(result.getRecords());
        } catch (Exception e) {
            log.error("exportConditionProduct Error:{}", e.getMessage());
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
    }
}
```

## 百万级数据导出

对于百万级数据的导出，我们需要先思考如下问题：

1. 导出百万级别的数据是一个非常耗时的操作，如果是同步导出，用户将要在浏览器等待一段时间才有响应，甚至响应超时没有数据返回

2. Microsoft Excel 工作表的行数和列数受到软硬件的限制。以下是一般情况下的限制：

   - 行数：

       Excel 2003 及以前版本（.xls 格式）的行数限制为 65536 行

       Excel 2007 及之后版本（.xlsx 格式）的行数限制为 1048576 行

   - 列数：

       Excel 2003 及以前版本（.xls 格式）的列数限制为 256 列

       Excel 2007 及之后版本（.xlsx 格式）的列数限制为 16384 列

3. 当数据量过大的时候我们会分多个工作表导出，但是 EasyExcel 不支持工作表克隆

因此在处理大量数据并需要导出到 Excel 文件时，我们可以采用异步导出并将数据分割成多个工作表，每个工作表进行分批分页写入，最后上传到云存储服务，这种策略能够有效解决连接超时和 Excel 行数限制的问题：

- 异步导出：通过异步导出，用户发起导出请求后即可获得响应，不需要在浏览器中等待长时间。这种方式提升了用户体验，避免了连接超时的问题

- 分割成多个工作表：由于 Excel 每个工作表都有行数的限制，将数据分割成多个工作表是一个很好的策略。这样可以充分利用 Excel 提供的多个工作表，并规避了单一工作表的行数限制    

- 分批分页写入：采用分批分页写入的方式，可以有效地控制每个工作表的数据量，避免一次性写入过多数据导致内存溢出或性能下降

- 一次性创建多个工作表：在创建异步导出的 Excel 模板时一次性创建多个工作表是一种巧妙的方法。通过预先创建多个工作表，你可以轻松地将数据分配到这些工作表中，而不受 EasyExcel 不支持工作表克隆的限制（假设我们需要导出 300 万条数据，Excel 导出模板中每个工作表存放 50 万条记录，那么只需要有 6 个工作表即可）

- 提供下载页面：提供一个下载页面，让用户在数据导出完成后随时下载所需的文件，进一步优化了用户体验

### 多工作表导出

#### 后端参考代码

创建多工作表模板：在这个模板中我们预先创建了 12 个相同的工作表，当导出的数据没有填充完这些工作表时，拦截器会动态删除剩余的工作表

![](https://img.sherry4869.com/blog/it/java/junior/tools/easy-excel/img.png)

开启异步支持：

```java {8}
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@MapperScan("com.mw.mapper")
@EnableAsync
public class AdminApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApiApplication.class, args);
    }

}
```

配置文件存储 OSS：

```properties
# 文件虚拟存储路径
file.static-path=/upload/file/**
# 文件虚拟访问路径
file.basic-url=http://localhost:8080/upload/file/
# 文件实际存储路径（OSS服务器路径）
file.local-path=F:/workspace/mw/
# 临时文件目录
file.temp-path=temp/
# 临时文件类别
file.excel=excel/
```

文件存储配置类：

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file")
@Data
public class SystemConfig {

    // 文件虚拟存储路径
    private String staticPath;

    // 文件虚拟访问路径
    private String basicUrl;

    // 文件实际存储路径（OSS对外服务的访问域名）
    private String localPath;

    // 临时文件目录
    private String tempPath;

    // 临时文件类别
    private String excel;
}
```

定义常量类设定单工作表写入阈值、和分批写入阈值：

```java
public class Constant {

    // 单表最大写入记录条数为50万
    public static final int THRESHOLD_COUNT = 500000;

    // 分批写入的阈值为5万（数据库每查5万条记录就写入一次）
    public static final int ASYNC_PAGE_CURRENT = 50000;

    // 导入导出状态值
    public final static String EXCEL_OPERATION_TASK_KEY = "MW:EXCEL:OPERATION:TASK:KEY:";
}
```

Excel 导出状态枚举类：

```java
public enum ExcelOperationTaskEnum {
    SUCCESS,
    FAIL,
    PROGRESSING
}
```

Excel 导出任务信息响应类：

```java
import lombok.Data;

@Data
public class ExportTaskRespVO {

    // 任务ID
    private String taskId;

    // 任务状态
    private String status;

    // 导出文件下载地址
    private String url;

    // 响应信息
    private String message;
}
```

配置虚拟路径映射：将本地文件系统的某个路径映射为 Web 应用的静态资源路径，使得访问静态资源时可以直接通过 URL 访问，而不需要通过控制器进行转发：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

@Configuration
public class WebAppConfig implements WebMvcConfigurer {

    @Resource
    private SystemConfig systemConfig;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(systemConfig.getStaticPath()).addResourceLocations("file:" + systemConfig.getLocalPath());
    }
}
```

工作表拦截器：在 Excel 文件创建后，在写入过程中移除超过指定数量的工作表。例如一张工作表规定写入 50 万条数据，当前我们需要导出 300 万条数据，只需要 6 张工作表即可。模板中我们创建了 12 张工作表以备不时之需。当导出 300 万条数据时拦截器会删除最后 6 张工作表

```java
import com.alibaba.excel.write.handler.WorkbookWriteHandler;
import com.alibaba.excel.write.handler.context.WorkbookWriteHandlerContext;
import org.apache.poi.ss.usermodel.Workbook;

public class CustomSheetWriteHandler implements WorkbookWriteHandler {

    private Integer sheetTotal;

    public CustomSheetWriteHandler(Integer sheetTotal) {
        this.sheetTotal = sheetTotal;
    }

    @Override
    public void afterWorkbookCreate(WorkbookWriteHandlerContext context) {
        Workbook workbook = context.getWriteWorkbookHolder().getWorkbook();
        for (int i = workbook.getNumberOfSheets() - 1; i >= sheetTotal; i--) { // 从最后一个 Sheet 开始，一直到 sheetTotal 位置
            workbook.removeSheetAt(i); //  用于移除指定索引位置的 Sheet
        }
    }
}
```

定义 Excel 导出接口方法：

```java
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;

import javax.servlet.http.HttpServletResponse;

public interface IExportService {

    /**
     * 异步全量导出接口
     * @param vo 条件查询对象
     * @param taskId 任务ID
     */
    void exportProductAll(ExportProductReqVO vo, String taskId);

    /**
     * 查询异步导出结果
     * @param taskId 任务ID
     */
    ExportTaskRespVO exportTaskResult(String taskId);
}
```

接口实现类：

```java
package com.mw.service.impl;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.mw.common.BusinessException;
import com.mw.common.ExcelOperationTaskEnum;
import com.mw.common.ResponseCode;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.handler.CustomSheetWriteHandler;
import com.mw.mapper.ProductsMapper;
import com.mw.service.IExportService;
import com.mw.utils.RedisUtil;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;
import com.mw.vo.resp.PageProductRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ExportServiceImpl implements IExportService {

    @Resource
    private ProductsMapper productsMapper;

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Override
    @Async
    public void exportProductAll(ExportProductReqVO vo, String taskId) {
        log.info("start async excel export");
        long startTime = System.currentTimeMillis();
        String taskKey = Constant.EXCEL_OPERATION_TASK_KEY + taskId;

        ExportTaskRespVO exportTaskRespVO = new ExportTaskRespVO();
        exportTaskRespVO.setTaskId(taskId);
        exportTaskRespVO.setStatus(ExcelOperationTaskEnum.PROGRESSING.name());
        redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // 数据导出任务状态为进行中并保存进Redis 30分钟

        // 在资源服务器创建导出的Excel临时文件（测试就存储到本地：F:/workspace/mw/temp/excel）
        String tempPath = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        try {
            // 判断 F:/workspace/mw/temp/excel 目录是否存在，不存在就创建
            Path path = Paths.get(tempPath);
            if (!Files.isWritable(path)) {
                Files.createDirectories(path);
            }
            String fileName = taskId + ".xlsx";
            Path resourcePath = Paths.get(tempPath, fileName);

            InputStream inputStream = this.getClass().getResourceAsStream("/excel/export_product_multiple_template.xlsx"); // 读取需要写入数据的Excel模板
            if (inputStream == null) {
                exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
                redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // 数据导出任务状态为失败并保存进Redis 30分钟
                throw new BusinessException(ResponseCode.GET_EXCEL_TEMPLATE_ERROR);
            }
            Long total = productsMapper.pageProductTotal(vo); // 计算需要导出的总数据量
            int totalSheet = (int) Math.ceil(total * 1.0 / Constant.THRESHOLD_COUNT); // 计算一共需要多少张表。假设需要导出的商品总数为300万，当前每张表限制记录50万，那么就需要用到6张表（Math.ceil向上取整）

            ExcelWriter excelWriter = EasyExcel.write(resourcePath.toFile(), PageProductRespVO.class)
                    .withTemplate(inputStream)
                    .registerWriteHandler(new CustomSheetWriteHandler(totalSheet))
                    .build();
            for (int i = 0; i < totalSheet; i++) { // 循环生成每张记录50万数据的工作表
                int offset = i * Constant.THRESHOLD_COUNT;
                WriteSheet writeSheet = EasyExcelFactory.writerSheet(i).build();
                writeSheet.setNeedHead(false);
                exportSheet(vo, offset, Constant.THRESHOLD_COUNT, writeSheet, excelWriter); // 单表写入逻辑，单个工作表最大存储记录条数为50万
            }
            excelWriter.finish();
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.SUCCESS.name());
            // 文件下载地址：http://localhost:8080/upload/file/temp/excel/1738453230087516161.xlsx
            exportTaskRespVO.setUrl(MessageFormat.format("{0}{1}{2}/{3}.xlsx", systemConfig.getBasicUrl(), systemConfig.getTempPath(), systemConfig.getExcel(), taskId));
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);
        } catch (IOException e) {
            log.error("exportProductAll Error:{}", e.getMessage());
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // 数据导出任务状态为失败并保存进Redis 30分钟
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
        log.info("exportProductAll 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }

    @Override
    public ExportTaskRespVO exportTaskResult(String taskId) {
        return redisUtil.get(Constant.EXCEL_OPERATION_TASK_KEY + taskId);
    }

    /**
     * 单表写入逻辑
     */
    private void exportSheet(ExportProductReqVO vo, int offset, int limit, WriteSheet writeSheet, ExcelWriter excelWriter) {
        int totalPage = (int) Math.ceil(limit * 1.0 / Constant.ASYNC_PAGE_CURRENT); // 单工作表写入50万数据，分批每次写入5万条数据，一共需要写入10次
        for (int i = 0; i < totalPage; i++) {
            // 数据库分页查询，分页偏移量每次递增5万
            List<PageProductRespVO> list = productsMapper.pageProduct(vo, offset + i * Constant.ASYNC_PAGE_CURRENT, Constant.ASYNC_PAGE_CURRENT);
            excelWriter.write(list, writeSheet);
            list.clear();
        }
    }
}
```

::: info
`Files.createDirectory` 创建文件夹：如果被创建文件夹的父文件夹不存在，则抛出 `NoSuchFileException`；如果被创建的文件夹已经存在，则抛出 `FileAlreadyExistsException`；如果因为磁盘IO出现异常，则抛出 `IOException`

`Files.createDirectories` 创建文件夹及其父文件夹：如果被创建文件夹的父文件夹不存在，就创建它；如果被创建的文件夹已经存在，就是用已经存在的文件夹，不会重复创建，不会异常抛出；如果因为磁盘IO出现异常，则抛出 `IOException`
:::

控制器：

```java
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.service.IExportService;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/export")
@Api(tags = "导出模块")
public class ExportController {

    @Resource
    private IExportService exportService;

    @PostMapping("/product/async")
    @ApiOperation(value = "异步导出全量接口")
    public String asyncExportProducts(@RequestBody @Valid ExportProductReqVO vo, HttpServletResponse response) {
        String taskId = IdWorker.getIdStr();
        exportService.exportProductAll(vo, taskId);
        return taskId;
    }

    @GetMapping("/product/{taskId}")
    @ApiOperation(value = "查询异步导出结果接口")
    public ExportTaskRespVO exportProductResult(@PathVariable("taskId") String taskId) {
        return exportService.exportTaskResult(taskId);
    }
}
```

请求地址：http://localhost:8080/api/export/product/async

响应内容：

```json
{
  "code": 0,
  "data": "1738453230087516161",
  "message": "响应成功"
}
```

Redis Key：`MW:EXCEL:OPERATION:TASK:KEY:1738453230087516161`

Redis Value：

```json
{
  "@class": "com.mw.vo.resp.ExportTaskRespVO",
  "taskId": "1738453230087516161",
  "status": "PROGRESSING",
  "url": null,
  "message": null
}
```

当导出完毕后：`exportProductAll` 执行时间为：134 秒

Redis Value：

```json
{
  "@class": "com.mw.vo.resp.ExportTaskRespVO",
  "taskId": "1738453230087516161",
  "status": "SUCCESS",
  "url": "http://localhost:8080/upload/file/temp/excel/1738437307775537154.xlsx",
  "message": null
}
```

#### 前端参考代码

Excel 异步导出结果响应字段：

```ts
export interface ExcelOperationTaskRespVO {
    taskId: string;
    status: string;
    url: string;
    message: string
}
```

定义后端请求接口：

```ts
/**
 * 商品全量异步导出接口
 * 返回 taskId
 */
export const productAllExportApi = (param: PageProductReqVO) => {
    return instance.post<any, IResponse<string>>('/api/export/product/async', param);
}

/**
 * 查询Excel异步导出信息接口
 */
export const exportExcelTaskApi = (taskId: string) => {
    return instance.get<any, IResponse<ExcelOperationTaskRespVO>>('/api/export/product/' + taskId);
}
```

点击全量下载按钮后请求全量异步导出接口并轮询查询导出状态：

```ts
const onAllExport = async () => {
    await productAllExportApi(pageProductForm).then(res => {
        ElMessage.success("正在全力导出，导出成功后会提示您");
        setTimeout(() => {
            pullExportProductStatus(res.data);
        }, 20000);
    }).catch(error => { })
}

/**
 * 轮询后端获取Excel导出结果接口
 */
const pullExportProductStatus = async (taskId: string) => {
    await exportExcelTaskApi(taskId).then(res => {
        if (res.data.status === 'SUCCESS') { // 成功
            window.location.href = res.data.url; // 下载文件
            return;
        } else if (res.data.status === 'FAIL') { // 失败
            ElMessage.error(res.data.message);
            return;
        } else { // 进行中
            setTimeout(() => {
                pullExportProductStatus(taskId);
            }, 20000);
        }
    }).catch(error => { })
}
```

### 多文件 zip 导出

我们将进一步优化数据的导出速度，我们可以开启多线程去处理每个工作表的数据写入，并把每个工作表拆分成一个 Excel 文件，当所有的线程都执行完成后打包所有的 Excel 文件生成 zip 压缩包提供用户下载

::: details 线程池工作流程
线程池是一种用于管理和重用线程的机制，它在并发编程中起着重要的作用。线程池的工作流程可以简单概括为以下几个步骤：

- 任务提交：当有任务需要执行时，它被提交到线程池。任务可以是实现了 `Runnable` 接口或 `Callable` 接口的对象

- 线程池管理：线程池负责管理一组线程，包括创建、启动、停止和回收线程。线程池维护着一个线程队列，该队列保存着等待执行的任务

- 任务分配：当有任务提交到线程池时，线程池会根据配置的核心线程数（corePoolSize）、最大线程数（maximumPoolSize）和阻塞队列（BlockingQueue）等参数，决定将任务分配给核心线程、创建新线程执行任务，还是将任务放入阻塞队列等待执行

- 执行任务： 线程池中的线程不断地从任务队列中取任务，并执行这些任务。执行任务的过程包括调用任务的 `run` 方法（对于 Runnable 任务）或 `call` 方法（对于 Callable 任务）

- 线程重用：在任务执行完毕后，线程不会立即销毁，而是被重新放入线程池的线程队列中，以便执行下一个任务。这样避免了线程的频繁创建和销毁，提高了效率

- 线程池的维护：线程池会周期性地检查线程池的状态、线程数是否超过核心线程数、是否有空闲线程可以回收等，根据需要动态调整线程池的大小

- 拒绝策略：如果任务提交速度过快，而线程池处理不过来，可以采取一定的拒绝策略。拒绝策略可以是丢弃任务、临时阻塞、调用者运行或将任务放入队列中等

线程池的优势在于可以提高并发性能，减少线程的创建和销毁开销，有效控制资源的使用。通过合理配置线程池的参数，可以更好地平衡系统的资源利用和响应性能。不过，要注意适当配置线程池的大小、队列容量以及拒绝策略，以避免因不当的配置而导致性能问题
:::

线程池配置类：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

@Configuration
public class ExportThreadPoolConfig {

    private static final Integer CORE_POOL_SIZE = 10; // 核心线程池大小，即线程池的基本大小，线程池在空闲时保持的线程数量

    private static final Integer MAXIMUM_POOL_SIZE = 20; // 最大线程池大小，即线程池允许的最大线程数量

    private static final Integer KEEP_ALIVE_TIME = 110; // 线程空闲时间，即超过核心线程数的线程在空闲时的最大存活时间

    private static final int QUEUE_CAPACITY = 500; // 队列大小，表示阻塞队列的容量，用于存储等待执行的任务

    @Bean(value = "exportThreadPool")
    public ThreadPoolTaskExecutor executorService() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAXIMUM_POOL_SIZE);
        executor.setKeepAliveSeconds(KEEP_ALIVE_TIME);
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix("excel-thread-"); // 设置线程名称的前缀
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy()); // 设置拒绝策略，这里使用的是 CallerRunsPolicy，表示当线程池已满时，由调用线程执行该任务
        return executor;
    }

}
```

压缩包工具类：

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.EnumSet;
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

实现类：

```java {77-93}
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.common.BusinessException;
import com.mw.common.ExcelOperationTaskEnum;
import com.mw.common.ResponseCode;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.mapper.ProductsMapper;
import com.mw.service.IExportService;
import com.mw.utils.FileUtil;
import com.mw.utils.RedisUtil;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;
import com.mw.vo.resp.PageProductRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExportServiceImpl implements IExportService {

    @Resource
    private ProductsMapper productsMapper;

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Resource(name = "exportThreadPool")
    private ExecutorService executorService;

    @Override
    @Async
    public void exportProductAllZip(ExportProductReqVO vo, String taskId) {
        log.info("start async excel export");
        long startTime = System.currentTimeMillis();
        String taskKey = Constant.EXCEL_OPERATION_TASK_KEY + taskId;

        ExportTaskRespVO exportTaskRespVO = new ExportTaskRespVO();
        exportTaskRespVO.setTaskId(taskId);
        exportTaskRespVO.setStatus(ExcelOperationTaskEnum.PROGRESSING.name());
        redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // 数据导出任务状态为进行中并保存进Redis 30分钟

        // zip 压缩包最终写入 F:/workspace/mw/temp/excel/
        String zipPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        // 在资源服务器创建导出的Excel临时文件（测试就存储到本地：F:/workspace/mw/temp/excel/taskId）
        String tempPathStr = MessageFormat.format("{0}{1}{2}{3}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel(), taskId);
        String fileName = taskId + ".zip";
        try {
            Path tempPath = Paths.get(tempPathStr);
            if (!Files.isWritable(tempPath)) {
                Files.createDirectories(tempPath);
            }
            Long total = productsMapper.pageProductTotal(vo); // 计算需要导出的总数据量
            int totalSheet = (int) Math.ceil(total * 1.0 / Constant.THRESHOLD_COUNT); // 计算一共需要多少个Excel文件。假设需要导出的商品总数为300万，当前每张表限制记录50万，那么就需要用到6个Excel文件（Math.ceil向上取整）

            List<CompletableFuture<Object>> futureList = new ArrayList<>(); // futureList 是一个 CompletableFuture 对象的列表，用于保存每个 Excel 写入任务的 CompletableFuture
            for (int i = 0; i < totalSheet; i++) { // 使用 for 循环遍历每个需要生成 Excel 文件的分片，每个分片称为一个任务（一共有300万的数据，每50万数据写入到一个Excel文件中，一共生成6个Excel文件）
                int offset = i * Constant.THRESHOLD_COUNT; // 当前分片的起始位置
                CompletableFuture<Object> future = CompletableFuture.supplyAsync(() -> // CompletableFuture.supplyAsync 创建一个异步任务。supplyAsync 方法接受一个 Supplier，表示这个任务会返回一个结果，这里返回的是 null
                {
                    exportSheetZip(vo, offset, Constant.THRESHOLD_COUNT, tempPathStr); // 该方法用于生成一个 Excel 文件
                    return null;
                }, executorService); // 这里的 executorService 是一个 ThreadPoolExecutor，通过 @Resource(name = "exportThreadPool") 注入，它是在 ExportThreadPoolConfig 类中通过 @Bean 注解定义的
                futureList.add(future); // 将每个异步任务的 CompletableFuture 添加到 futureList 中
            }
            CompletableFuture<Void> allCF = CompletableFuture.allOf(futureList.toArray(new CompletableFuture[0])); // 使用 CompletableFuture.allOf 创建一个 CompletableFuture，它在所有输入的 CompletableFuture 完成时完成
            allCF.join(); // 会等待所有任务完成，确保在继续执行后续代码前，所有 Excel 写入任务都已经完成

            // 开始压缩成一个zip文件
            FileUtil.toZip(Files.list(tempPath).map(path -> {
                return path.toFile();
            }).collect(Collectors.toList()), Paths.get(zipPathStr, fileName).toFile());

            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.SUCCESS.name());
            // http://localhost:8081/upload/file/temp/excel/taskId.zip
            exportTaskRespVO.setUrl(MessageFormat.format("{0}{1}{2}{3}", systemConfig.getBasicUrl(), systemConfig.getTempPath(), systemConfig.getExcel(), fileName)); // 文件下载地址
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);

            // 删除之前生成临时Excel文件（把 F:/workspace/mw/temp/excel/taskId/ 目录下的6个Excel给删除）
            if (Files.isDirectory(tempPath)) {
                FileUtil.deleteFolderRecursively(tempPath);
            } else {
                Files.delete(tempPath);
            }
        } catch (IOException e) {
            log.error("exportProductAll Error:{}", e.getMessage());
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // 数据导出任务状态为失败并保存进Redis 30分钟
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
        log.info("exportProductAllZip 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }

    /**
     * 单 Excel 文件写入逻辑
     */
    private void exportSheetZip(ExportProductReqVO vo, int offset, int limit, String path) {
        // 读取单个工作簿的模板
        InputStream inputStream = this.getClass().getResourceAsStream("/excel/export_product_template.xlsx");
        if (inputStream == null) {
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
        // 生成一个文件名称
        String fileName = offset / Constant.THRESHOLD_COUNT + 1 + ".xlsx";
        // 多个Excel文件(1.xlsx;2.xlsx;3.xlsx;4.xlsx;5.xlsx;6.xlsx) 最终写入 F:/workspace/mw/temp/excel/taskId/ 目录下
        Path target = Paths.get(path, fileName);
        ExcelWriter excelWriter = EasyExcel.write(target.toFile(), PageProductRespVO.class).withTemplate(inputStream).build();
        // 这里注意我们需要使用模板文件里面的Sheet
        WriteSheet writeSheet = EasyExcelFactory.writerSheet(0).build();
        writeSheet.setNeedHead(false);

        int totalPage = (int) Math.ceil(limit * 1.0 / Constant.ASYNC_PAGE_CURRENT); // 单个Excel写入50万数据，分批每次写入5万条数据，一共需要写入10次
        for (int i = 0; i < totalPage; i++) {
            // 数据库分页查询，分页偏移量每次递增5万
            List<PageProductRespVO> list = productsMapper.pageProduct(vo, offset + i * Constant.ASYNC_PAGE_CURRENT, Constant.ASYNC_PAGE_CURRENT);
            excelWriter.write(list, writeSheet);
            list.clear();
        }
        excelWriter.finish();
    }
}
```

请求地址：http://localhost:8080/api/export/product/zip

响应内容：

```json
{
  "code": 0,
  "data": "1738858440832266242",
  "message": "响应成功"
}
```

Redis Key：`MW:EXCEL:OPERATION:TASK:KEY:1738858440832266242`

Redis Value：

```json
{
  "@class": "com.mw.vo.resp.ExportTaskRespVO",
  "taskId": "1738858440832266242",
  "status": "PROGRESSING",
  "url": null,
  "message": null
}
```

当导出完毕后：`exportProductAllZip` 执行时间为：32 秒

Redis Value：

```json
{
  "@class": "com.mw.vo.resp.ExportTaskRespVO",
  "taskId": "1738858440832266242",
  "status": "SUCCESS",
  "url": "http://localhost:8080/upload/file/temp/excel/1738858440832266242.zip",
  "message": null
}
```

### 定时删除临时文件

开启定时调度：

```java {10}
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.mw.mapper")
@EnableAsync
@EnableScheduling
public class AdminApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdminApiApplication.class, args);
    }

}
```

任务调度配置：

```java
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.utils.RedisUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;

@Component // @Component 注解将 ScheduleService 类标记为 Spring 组件，使其成为 Spring 管理的 Bean
@Slf4j // @Slf4j 注解是 Lombok 提供的注解，用于生成日志变量 log
public class ScheduleService {

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    /**
     * 清理临时目录下的 Excel 文件
     */
    @Scheduled(cron = "0 */10 * * * ?") // @Scheduled 注解表示这是一个定时任务方法，它使用 cron 表达式定义了任务的执行时间规则。这里的表达式表示每隔 10 分钟执行一次
    private void cleanExcelTemp() {
        log.info("start run cleanExcelTemp schedule");
        Path path = Paths.get(MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel())); // 使用 Paths.get 创建了临时目录的 Path 对象，路径通过 systemConfig 对象获取配置
        try {
            Files.list(path).forEach(pathFile -> { // 使用 Files.list(path) 列出目录下的所有文件，对每个文件进行处理
                // 提取文件名和任务 ID。如果文件名中包含有扩展名且对应的任务 ID 在 Redis 中不存在，就删除该文件
                String fileName = pathFile.getFileName().toString();
                String taskId = fileName.substring(0, fileName.lastIndexOf("."));
                if (fileName.contains(".") && !redisUtil.hasKey(Constant.EXCEL_OPERATION_TASK_KEY + taskId)) {
                    try {
                        Files.deleteIfExists(pathFile);
                        log.info("delete filename: {}", fileName);
                    } catch (IOException e) {
                        log.error("run cleanExcelTemp schedule delete file ERROR: {}", e);
                    }
                }
            });
        } catch (IOException e) {
            log.error("run cleanExcelTemp schedule ERROR: {}", e);
        }
    }
}
```

在使用 [多工作表导出](#多工作表导出) 方式中，后端使用了大约 130 秒生成了一份 100M 左右的 Excel 文件，该文件包含了 6 张工作表。此次通过多线程多文件 zip 导出的方式，后端使用了大约 30 秒生成了一个 43M 左右的 zip 压缩包，解压后里面有 6 个 Excel 文件

当前还有优化的空间：虽然用户可以在点击全量下载的按钮后去访问操作其他界面，不需要在当前界面上一直等待文件下载完毕。但如果用户刷新了界面，那么轮询将会失效，文件不会自动下载。对此，我们可以考虑使用一些通信技术，如 Server-Sent Events（SSE）或 WebSocket。这些技术可以提供更实时和有效的通信机制