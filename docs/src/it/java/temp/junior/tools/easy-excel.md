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

## WEB 中的读

EasyExcel 读取用户上传的 Excel 文件，然后将文件中的数据解析后存储到数据库中

### 后端参考代码

商品实体类：

```java
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@ApiModel(value = "Products对象", description = "商品表")
public class Products implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty("商品名称")
    private String name;

    @ApiModelProperty("价格")
    private BigDecimal price;

    @ApiModelProperty("库存")
    private Integer stock;

    @ApiModelProperty("商品描述")
    private String description;

    @ApiModelProperty("创建人")
    private Long createBy;

    @ApiModelProperty("更新人")
    private Long modifiedBy;

    @ApiModelProperty("创建时间")
    private LocalDateTime gmtCreate;

    @ApiModelProperty("更新时间")
    private LocalDateTime gmtModified;
}
```

导入商品 Excel 表中表头的数据传输对象 DTO（Data Transfer Object）：

```java
import com.alibaba.excel.annotation.ExcelProperty;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ProductReaderDTO {

    @ApiModelProperty("商品名称")
    @ExcelProperty("商品名称")
    private String name;

    @ApiModelProperty("商品价格")
    @ExcelProperty("商品价格")
    private String price;

    @ApiModelProperty("商品库存")
    @ExcelProperty("商品库存")
    private String stock;

    @ApiModelProperty("商品描述")
    @ExcelProperty("商品描述")
    private String description;
}
```

数据库进行数据持久化操作，定义批量插入商品数据方法：

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mw.entity.Products;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductsMapper extends BaseMapper<Products> {
    
    int batchInsert(@Param("list") List<Products> list);
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mw.mapper.ProductsMapper">
    
    <insert id="batchInsert" parameterType="com.mw.entity.Products">
        INSERT INTO products(`name`, `price`, `stock`, `description`, `create_by`, `gmt_create`) VALUES
        <foreach collection="list" item="item" separator=",">
            (#{item.name}, #{item.price}, #{item.stock}, #{item.description}, #{item.createBy}, NOW())
        </foreach>
    </insert>
</mapper>
```

定义**同步**读取文件数据的接口方法：

```java
import org.springframework.web.multipart.MultipartFile;

public interface ImportService {

    void importProduct(MultipartFile file, String userId);
}
```

```java {39,55}
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.read.listener.PageReadListener;
import com.mw.common.BusinessException;
import com.mw.common.ResponseCode;
import com.mw.common.constant.Constant;
import com.mw.entity.Products;
import com.mw.mapper.ProductsMapper;
import com.mw.service.ImportService;
import com.mw.vo.dto.ProductReaderDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ImportServiceImpl implements ImportService {

    @Resource
    private ProductsMapper productsMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void importProduct(MultipartFile file, String userId) {
        if (file.isEmpty() || userId.isEmpty()) {
            throw new BusinessException(ResponseCode.OPERATION_ERROR);
        }
        long startTime = System.currentTimeMillis();
        List<Products> list = new ArrayList<>();
        try {
            // 通过 PageReadListener 监听器在每读取一定数量的数据时触发批量插入
            // 这里默认每次会读取100条数据 然后返回过来 直接调用使用数据就行。具体需要返回多少行可以在 PageReadListener 的构造函数设置
            EasyExcel.read(file.getInputStream(), ProductReaderDTO.class, new PageReadListener<ProductReaderDTO>(dataList -> {
                for (ProductReaderDTO data : dataList) {
                    // DTO（Data Transfer Object）数据传输对象转换成 PO（Persistant Object）持久对象
                    Products products = new Products();
                    products.setName(data.getName());
                    products.setPrice(new BigDecimal(data.getPrice()));
                    products.setStock(Integer.valueOf(data.getStock()));
                    products.setDescription(data.getDescription());
                    products.setCreateBy(Long.valueOf(userId));
                    list.add(products);
                    // 当读取的数据量达到阈值5万时，执行批量插入数据库操作
                    if (list.size() >= Constant.IMPORT_MAX_CURRENT) {
                        productsMapper.batchInsert(list);
                        list.clear();   
                    }
                }
            })).sheet().doRead();
            // 读取的数据量没有达到阈值当然也要进行批量插入数据库操作
            if (!list.isEmpty()) {
                productsMapper.batchInsert(list);
                list.clear();
            }
            log.info("importProduct 同步批量插入商品数据执行时间为：{}秒", (System.currentTimeMillis() - startTime) / 1000);
        } catch (IOException e) {
            log.error("importProduct ERROR：{}", e);
            throw new RuntimeException(e);
        }
    }
}
```

控制器：

```java
import com.mw.service.ImportService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/import")
@Api(tags = "导入商品模块")
public class ImportController {

    @Resource
    private ImportService importService;

    @PostMapping("/product/{userId}")
    @ApiOperation("同步导入商品Excel接口")
    public void importProduct(@PathVariable("userId") String userId, @RequestParam("file") MultipartFile file) {
        importService.importProduct(file, userId);
    }
}
```

### 前端参考代码

商品导入接口请求字段：

```ts
export interface UploadExcelReqVO {
    userId: string;
    file: Blob
}
```

商品同步导入接口：

```ts
export const importProductApi = (param: UploadExcelReqVO) => {
    return instance.post('/api/import/product/' + param.userId, {file: param.file}, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
```

业务逻辑：

```vue
<template>
  <el-dropdown>
    <el-button type="primary">导入<el-icon class="el-icon--right"><arrow-down/></el-icon></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-upload ref="upload" action="" :multiple="false" :http-request="importProduct" :show-file-list="false" accept=".xlsx">
            同步导入数据
          </el-upload>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { UploadExcelReqVO } from '@/api/product/types'
  import { importProductApi} from '@/api/product';
  import { ElMessage, UploadRequestOptions } from 'element-plus';
  import { useUserStore } from '@/store/userStore';

  const userStore = useUserStore();

  const importProduct = async (options: UploadRequestOptions) => {
    const { file } = options;
    const param: UploadExcelReqVO = {
      userId: userStore.userId,
      file: file
    }
    await importProductApi(param).then(res => {
      ElMessage.success("上传成功");
      // 重新加载新分页数据 loadData();
    }).catch(error => { })
  }
</script>
```

## WEB 中的写

将数据库中的数据查询出来，然后通过 EasyExcel 把数据写入到 Excel 文件中，最后提供给用户下载。这样的操作常见于数据导出功能，用户可以在 Web 界面上触发导出操作，系统将数据库中的数据导出成 Excel 文件供用户下载

### 后端参考代码

商品分页响应数据 VO：

```java
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PageProductRespVO {

    @ApiModelProperty("商品ID")
    @ExcelProperty("商品ID")
    private Integer id;

    @ApiModelProperty("商品名称")
    @ExcelProperty("商品名称")
    @ColumnWidth(25)
    private String name;

    @ApiModelProperty("商品价格")
    @ExcelProperty("商品价格")
    private BigDecimal price;

    @ApiModelProperty("商品库存")
    @ExcelProperty("商品库存")
    private Integer stock;

    @ApiModelProperty("商品描述")
    @ExcelProperty("商品描述")
    @ColumnWidth(50)
    private String description;

    @ApiModelProperty("创建时间")
    @ExcelProperty("创建时间")
    @ColumnWidth(25)
    private String gmtCreate;

    @ApiModelProperty("更新时间")
    @ExcelProperty("更新时间")
    @ColumnWidth(25)
    private String gmtModified;
}
```

定义分页**同步**导出文件数据的接口方法：

```java
import com.mw.vo.req.ExportProductReqVO;

import javax.servlet.http.HttpServletResponse;

public interface ExportService {
    
    void exportConditionProduct(ExportProductReqVO vo, HttpServletResponse response);
}
```

```java {36-41}
import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mw.common.BusinessException;
import com.mw.common.ResponseCode;
import com.mw.mapper.ProductsMapper;
import com.mw.service.ExportService;
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
public class ExportServiceImpl implements ExportService {

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
            log.error("exportConditionProduct error：{}", e);
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
    }
}
```

- `response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE)`：

    设置响应的内容类型为二进制流，表明这是一个文件下载的响应

- `response.setHeader(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)`：

    设置响应头，允许前端获取 `Content-Disposition` 头信息

- `response.setCharacterEncoding("UTF-8");`：

    设置响应的字符编码为 UTF-8，确保正确处理包含中文字符的文件名

- `String fileName = URLEncoder.encode("商品数据导出", "UTF-8").replaceAll("\\+", "%20")`：

    使用 `URLEncoder.encode` 对文件名进行 URL 编码。`URLEncoder.encode` 默认将空格转换为 `+`，而在 URL 中，空格应该转换为 `%20`，因此使用 `replaceAll` 将 `+` 替换为 `%20`

- `response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName + ".xlsx")`：

    设置 `Content-Disposition` 响应头，指定了文件的下载方式和文件名。`attachment` 表示以附件方式下载，`filename` 后面是文件名。在这里，文件名为“商品数据导出.xlsx”

- `EasyExcel.write(response.getOutputStream(), PageProductRespVO.class).sheet("商品列表").doWrite(result.getRecords())`：

    使用 EasyExcel 将数据写入 Excel 文件。`response.getOutputStream()` 获取响应的输出流，`PageProductRespVO.class` 是数据对象的类，“商品列表” 是 Excel 表格的 sheet（工作表） 名称，`result.getRecords()` 是需要写入的数据

### 前端参考代码

```ts {8-11}
const pageProductForm: PageProductReqVO = reactive({
    current: 1,
    size: 10
})

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

### 根据模板写入

在工程中的 resources 目录下创建 /excel/export_product_template.xlsx 模板文件，模板表头字段为 `PageProductRespVO` 类中定义的成员变量

```java {41-45}
import com.alibaba.excel.EasyExcel;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mw.common.BusinessException;
import com.mw.common.ResponseCode;
import com.mw.mapper.ProductsMapper;
import com.mw.service.ExportService;
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
public class ExportServiceImpl implements ExportService {

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
                    .needHead(false) // 因为是用模板文件的方式导出了，所以工作表不需要设置表头
                    .sheet() // 默认使用模板中的工作表命名
                    .doWrite(result.getRecords());
        } catch (Exception e) {
            log.error("exportConditionProduct Error:{}", e.getMessage());
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
    }
}
```

::: tip
使用输出流方式导出数据文件的效率和性能在数据量较小的情况下可能是可以接受的，但在数据量达到百万级以及以上时，直接将大量数据写入输出流可能会面临以下一些问题：

- 内存占用：直接将大量数据写入输出流可能导致内存占用过高，尤其是当数据量超过系统可用内存时，容易引起内存溢出

- 性能问题：写入大量数据到输出流可能会导致性能下降，因为要一次性将所有数据加载到内存中，而在处理过程中可能会出现大量的对象创建和垃圾回收操作

- 响应时间延长：处理大量数据可能会导致响应时间延长，影响用户体验，尤其是在网络传输中
:::

## 百万级数据异步分批导出

对于百万级数据的导出，我们需要先思考如下问题：

1. 导出百万级别的数据是一个非常耗时的操作，如果是同步导出，用户将要在浏览器等待一段时间才有响应，甚至响应超时没有数据返回

2. Microsoft Excel 工作表的行数和列数受到软硬件的限制。以下是一般情况下的限制：

   - 行数：

       Excel 2003 及以前版本（.xls 格式）的行数限制为 65536 行

       Excel 2007 及之后版本（.xlsx 格式）的行数限制为 1048576 行

   - 列数：

       Excel 2003 及以前版本（.xls 格式）的列数限制为 256 列

       Excel 2007 及之后版本（.xlsx 格式）的列数限制为 16384 列

3. 当数据量过大的时候我们会考虑拆分成多个工作表导出，但是在 EasyExcel 中不能直接使用一份 Excel 模板克隆多个相同结构的工作表，并在这些工作表中分别写入不同的数据。每个工作表需要使用独立的 `WriteSheet` 对象，并通过不同的 `ExcelWriter` 对象进行写入

因此在处理大量数据并需要导出 Excel 文件时，我们可以采用异步导出策略并将数据分割成多分存放到多个工作表里，每个工作表进行分批分页写入，最后上传到云存储服务，这种策略能够有效解决连接超时和 Excel 行数限制的问题

- 异步导出：通过异步导出，用户发起导出请求后即可获得响应，不需要在浏览器中等待长时间。这种方式提升了用户体验，避免了连接超时的问题

- 分割成多个工作表：由于 Excel 每个工作表都有行数的限制，将数据分割成多个工作表是一个很好的策略。这样可以充分利用 Excel 提供的多个工作表，并规避了单一工作表的行数限制    

- 分批分页写入：采用分批分页写入的方式，可以有效地控制每个工作表的数据量，避免一次性写入过多数据导致内存溢出或性能下降

- 一次性创建多个工作表：在创建异步导出的 Excel 模板时一次性创建多个工作表是一种巧妙的方法。通过预先创建多个工作表，你可以轻松地将数据分配到这些工作表中，而不受 EasyExcel 不支持工作表克隆的限制（假设我们需要导出 300 万条数据，Excel 导出模板中每个工作表存放 50 万条记录，那么只需要有 6 个工作表即可）

### 单线程多工作表导出

#### 后端参考代码

创建多工作表模板：在这个模板中我们预先创建了 12 个相同的工作表，当导出的数据没有填充完这些工作表时，拦截器会动态删除剩余的工作表

![](https://img.sherry4869.com/blog/it/java/junior/tools/easy-excel/img.png)

启用异步方法的支持：

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

配置文件存储路径（根据实际运行环境更改）：

```properties
# 文件虚拟存储路径
file.static-path=/upload/file/**
# 文件虚拟访问路径
file.basic-url=http://localhost:8080/upload/file/
# 文件实际存储路径（对象存储服务器路径）
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
@ConfigurationProperties(prefix = "file") // Spring Boot 中用于绑定配置文件属性到 JavaBean 对象的注解。在这个注解中，prefix 参数用于指定要绑定的属性的前缀，即配置文件中的键的前缀
@Data
public class SystemConfig {

    // 文件虚拟存储路径
    private String staticPath;

    // 文件虚拟访问路径
    private String basicUrl;

    // 文件实际存储路径（对象存储服务器路径）
    private String localPath;

    // 临时文件目录
    private String tempPath;

    // 临时文件类别
    private String excel;
}
```

定义常量类设定单个工作表的写入阈值和分批写入阈值：

```java
public class Constant {

    // 单表最大写入记录条数为50万
    public static final int THRESHOLD_COUNT = 500000;

    // 异步导出时批量写入的阈值为5万（每查询5万条记录就写入数据库一次）
    public static final int ASYNC_PAGE_CURRENT = 50000;

    // 操作状态值
    public final static String EXCEL_OPERATION_TASK_KEY = "MW:EXCEL:OPERATION:TASK:KEY:";
}
```

Excel 状态枚举类：

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

工作表拦截器：在 Excel 文件创建后，在写入过程中移除超过指定数量的工作表。举例来说一张工作表规定写入 50 万条数据，当前我们需要导出 300 万条数据，只需要 6 张工作表即可。模板中我们创建了 12 张工作表以备不时之需。当导出 300 万条数据时拦截器会删除最后 6 张多余的工作表

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

数据库进行数据持久化操作，定义条件查询商品总记录数方法：

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mw.entity.Products;
import com.mw.vo.req.PageProductReqVO;
import org.apache.ibatis.annotations.Param;

public interface ProductsMapper extends BaseMapper<Products> {

    /**
     * 条件查询商品总记录数
     *
     * @param vo 条件查询对象
     * @return 返回总记录数
     */
    Long pageProductTotal(@Param("vo") PageProductReqVO vo);
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mw.mapper.ProductsMapper">

    <!--  分页条件查询sql片段  -->
    <sql id="pageProductSql">
        <where>
            1 = 1
            <if test="vo.productName != null and vo.productName != ''">
                AND name = #{vo.productName}
            </if>
            <if test="vo.startTime != null">
                AND gmt_create &gt;= #{vo.startTime}
            </if>
            <if test="vo.endTime != null">
                AND gmt_create &lt;= #{vo.endTime}
            </if>
        </where>
    </sql>

    <!--  商品分页总数  -->
    <select id="pageProductTotal" resultType="java.lang.Long" parameterType="com.mw.vo.req.PageProductReqVO">
        SELECT COUNT(1) FROM products <include refid="pageProductSql"></include>
    </select>
    
</mapper>
```

定义**异步**写入数据的接口方法：

```java
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;

import javax.servlet.http.HttpServletResponse;

public interface ExportService {

    /**
     * 单线程多工作表异步导出数据（导出文件，提供下载地址）
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

```java
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
import com.mw.service.ExportService;
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
public class ExportServiceImpl implements ExportService {

    @Resource
    private ProductsMapper productsMapper;

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Override
    @Async
    public void exportProductAll(ExportProductReqVO vo, String taskId) {
        log.info("start async excel exportProductAll");
        long startTime = System.currentTimeMillis();
        String taskKey = Constant.EXCEL_OPERATION_TASK_KEY + taskId;
        // 初始化Excel导出任务状态信息
        ExportTaskRespVO exportTaskRespVO = new ExportTaskRespVO();
        exportTaskRespVO.setTaskId(taskId);
        exportTaskRespVO.setStatus(ExcelOperationTaskEnum.PROGRESSING.name());
        redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // Excel导出任务状态为进行中并保存进Redis 30分钟

        // 在资源服务器创建将要导出的Excel临时文件目录（本地测试就存储到本地：F:/workspace/mw/temp/excel）
        String tempPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        try {
            // 判断 F:/workspace/mw/temp/excel 目录是否存在，不存在就创建
            Path path = Paths.get(tempPathStr);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            String fileName = taskId + ".xlsx";
            Path tempPath = Paths.get(tempPathStr, fileName);
            InputStream inputStream = this.getClass().getResourceAsStream("/excel/export_product_multiple_template.xlsx"); // 读取需要写入数据的Excel模板
            if (inputStream == null) {
                // Excel导出任务状态为失败并保存进Redis 30分钟
                exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
                redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);
                throw new BusinessException(ResponseCode.GET_EXCEL_TEMPLATE_ERROR);
            }
            Long total = productsMapper.pageProductTotal(vo); // 计算需要导出的总数据量（当前为300万条记录数据）
            int totalSheet = (int) Math.ceil(total * 1.0 / Constant.THRESHOLD_COUNT); // 计算一共需要多少张工作表。当前导出的商品总数为300万，每张工作表限制写入阈值为50万，那么就需要用到6张工作表（Math.ceil向上取整）

            // 创建 ExcelWriterBuilder 对象，用于配置 Excel 文件的写入
            ExcelWriter excelWriter = EasyExcel.write(tempPath.toFile(), PageProductRespVO.class) // 指定要写入的 Excel 文件的路径；PageProductRespVO.class 是 Excel 中每一行数据对应的 Java 类型，用于映射 Excel 中的每一行
                    .withTemplate(inputStream) // 用于指定 Excel 文件的模板；inputStream 是一个输入流，用于读取 Excel 模板文件的内容。ExcelWriter 将使用这个模板来创建新的 Excel 文件，并在其中写入数据
                    .registerWriteHandler(new CustomSheetWriteHandler(totalSheet)) // 用于注册写入自定义处理器（在 Excel 文件创建后，在写入过程中移除超过指定数量的 Sheet）
                    .build(); // 构建最终的 ExcelWriter 对象，将之前的配置应用到写入过程中
            // 循环生成每张记录50万数据的工作表（一共6张工作表）
            for (int i = 0; i < totalSheet; i++) {
                int offset = i * Constant.THRESHOLD_COUNT; // 每个工作表的数据偏移量，即从数据库中的哪一条记录开始取数据。第一张工作表从0开始取值（也就是从第1条数据开始）；第二张工作表从500000开始取值（也就是从第500001条数据开始）以此类推
                WriteSheet writeSheet = EasyExcelFactory.writerSheet(i).build(); // 用于创建一个工作表对象，其中 i 是工作表的索引
                writeSheet.setNeedHead(false); // 因为是用模板文件的方式导出了，所以工作表不需要设置表头
                exportSheet(vo, offset, Constant.THRESHOLD_COUNT, writeSheet, excelWriter); // 单个工作表数据写入逻辑
            }
            excelWriter.finish(); // 释放相关资源、关闭输出流，并确保数据写入完成。这个方法通常放在写入数据的最后

            // Excel导出任务状态为成功并保存进Redis 30分钟
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.SUCCESS.name());
            // Excel导出文件下载地址：http://localhost:8080/upload/file/temp/excel/1738105877572820993.xlsx
            exportTaskRespVO.setUrl(MessageFormat.format("{0}{1}{2}{3}", systemConfig.getBasicUrl(), systemConfig.getTempPath(), systemConfig.getExcel(), taskId + ".xlsx"));
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);
        } catch (IOException e) {
            log.error("异步导出Excel文件 exportProductAll error：{}", e);
            // Excel导出任务状态为失败并保存进Redis 30分钟
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
        log.info("异步导出Excel文件 exportProductAll 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }

    @Override
    public ExportTaskRespVO exportTaskResult(String taskId) {
        return redisUtil.get(Constant.EXCEL_OPERATION_TASK_KEY + taskId); // 从Redis中读取导出任务的执行状态和结果
    }

    /**
     * 单个工作表数据写入逻辑
     */
    private void exportSheet(ExportProductReqVO vo, int offset, int limit, WriteSheet writeSheet, ExcelWriter excelWriter) {
        int totalPage = (int) Math.ceil(limit * 1.0 / Constant.ASYNC_PAGE_CURRENT); // 单个工作表限制写入阈值为50万，分批每次往数据库写入5万条数据，一共需要写入10次
        List<PageProductRespVO> list;
        for (int i = 0; i < totalPage; i++) {
            // 数据库分页查询，分页偏移量每次递增5万
            // 举例第一张工作表：0+0*50000=0（LIMIT 0,50000）；0+1*50000=50000（LIMIT 50000,50000）；0+2*50000=100000（LIMIT 100000,50000）以此类推
            list = productsMapper.pageProduct(vo, offset + i * Constant.ASYNC_PAGE_CURRENT, Constant.ASYNC_PAGE_CURRENT);
            excelWriter.write(list, writeSheet); // 将数据写入到当前工作表中
            list.clear();
        }
    }
}
```

::: info
- `Files.createDirectory`：创建文件夹，如果被创建文件夹的父文件夹不存在，则抛出 `NoSuchFileException`；如果被创建的文件夹已经存在，则抛出 `FileAlreadyExistsException`；如果因为磁盘IO出现异常，则抛出 `IOException`

- `Files.createDirectories`：创建文件夹及其父文件夹，如果被创建文件夹的父文件夹不存在，就创建它；如果被创建的文件夹已经存在，就是用已经存在的文件夹，不会重复创建，不会异常抛出；如果因为磁盘IO出现异常，则抛出 `IOException`
:::

控制器：

```java
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.service.ExportService;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/export")
@Api(tags = "导出模块")
public class ExportController {

    @Resource
    private ExportService exportService;

    @PostMapping("/product/async")
    @ApiOperation(value = "异步多工作表导出接口")
    public String asyncExportProducts(@RequestBody @Valid ExportProductReqVO vo, HttpServletResponse response) {
        String taskId = IdWorker.getIdStr(); // 生成一个唯一的任务ID，作为本次导出任务的标识
        exportService.exportProductAll(vo, taskId); // 启动异步导出任务
        return taskId; // 返回生成的任务ID给前端，前端可以通过此ID来查询导出任务的执行状态和结果
    }

    @GetMapping("/product/{taskId}")
    @ApiOperation(value = "查询异步导出结果接口")
    public ExportTaskRespVO exportProductResult(@PathVariable("taskId") String taskId) {
        return exportService.exportTaskResult(taskId); // 返回查询结果给前端，前端可以根据返回的信息来下载导出结果Excel文件
    }
}
```

接口响应结果：

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

当数据全部导出完毕后，异步导出Excel文件 exportProductAll 执行时间为：150 秒

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

后端请求接口：

```ts
/**
 * 商品单线程多工作表异步导出接口
 * 返回 taskId
 */
export const productAllExportApi = (param: PageProductReqVO) => {
    return instance.post<any, IResponse<string>>('/api/export/product/async', param);
}

/**
 * 通过任务ID查询Excel异步导出结果接口
 */
export const exportExcelTaskApi = (taskId: string) => {
    return instance.get<any, IResponse<ExcelOperationTaskRespVO>>('/api/export/product/' + taskId);
}
```

点击单线程多工作表导出按钮后请求后端导出接口并轮询查询导出状态：

```ts
const exportOfWorksheets = async () => {
    await productAllExportApi(pageProductForm).then(res => {
        ElMessage.success("正在全力导出，导出成功后会提示您");
        setTimeout(() => {
            pullExportProductStatus(res.data);
        }, 20000);
    }).catch(error => { })
}

/**
 * 根据任务ID轮询获取Excel导出结果
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

300万数据量的 Excel 文件大小为： 103M（一共有6个工作表）

### 多线程压缩 zip 导出

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
    public ExecutorService executorService() {
        return new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAXIMUM_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(QUEUE_CAPACITY),
                new CustomizableThreadFactory("excel-thread-"), // 设置线程名称的前缀
                new ThreadPoolExecutor.CallerRunsPolicy() // 设置拒绝策略，这里使用的是 CallerRunsPolicy，表示当线程池已满时，由调用线程执行该任务
        );
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

定义**异步**写入数据的接口方法：

```java
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;

public interface ExportService {
    
    /**
     * 多线程压缩zip异步导出数据（导出文件，提供下载地址）
     * @param vo 条件查询对象
     * @param taskId 任务ID
     */
    void exportProductAllZip(ExportProductReqVO vo, String taskId);

    /**
     * 查询异步导出结果
     * @param taskId 任务ID
     */
    ExportTaskRespVO exportTaskResult(String taskId);
}
```

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.mw.common.BusinessException;
import com.mw.common.ExcelOperationTaskEnum;
import com.mw.common.ResponseCode;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.mapper.ProductsMapper;
import com.mw.service.ExportService;
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
public class ExportServiceImpl implements ExportService {

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
        log.info("start async excel exportProductAllZip");
        long startTime = System.currentTimeMillis();
        String taskKey = Constant.EXCEL_OPERATION_TASK_KEY + taskId;
        // 初始化Excel导出任务状态信息
        ExportTaskRespVO exportTaskRespVO = new ExportTaskRespVO();
        exportTaskRespVO.setTaskId(taskId);
        exportTaskRespVO.setStatus(ExcelOperationTaskEnum.PROGRESSING.name());
        redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES); // Excel导出任务状态为进行中并保存进Redis 30分钟

        // zip 压缩包最终写入 F:/workspace/mw/temp/excel/ 目录下（例如F:/workspace/mw/temp/excel/taskId.zip）
        String zipPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        // 在资源服务器创建将要导出的Excel临时文件目录。本地测试就存储到本地：F:/workspace/mw/temp/excel/taskId
        String tempPathStr = MessageFormat.format("{0}{1}{2}{3}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel(), taskId);
        String fileName = taskId + ".zip";
        try {
            // 判断 F:/workspace/mw/temp/excel/taskId 目录是否存在，不存在就创建
            Path tempPath = Paths.get(tempPathStr);
            if (!Files.exists(tempPath)) {
                Files.createDirectories(tempPath);
            }
            Long total = productsMapper.pageProductTotal(vo);  // 计算需要导出的总数据量（当前为300万条记录数据）
            int totalSheet = (int) Math.ceil(total * 1.0 / Constant.THRESHOLD_COUNT); // 计算一共需要多少个Excel文件。当前导出的商品总数为300万，每个Excel文件限制写入阈值为50万，那么就需要用到6个Excel文件（Math.ceil向上取整）

            List<CompletableFuture<Object>> futureList = new ArrayList<>(); // futureList 是一个 CompletableFuture 对象的列表，用于保存每个 Excel 写入任务的 CompletableFuture
            for (int i = 0; i < totalSheet; i++) { // 使用 for 循环遍历每个需要生成Excel文件的分片，每个分片称为一个任务（一共有300万的数据，每50万数据写入到一个Excel文件中，一共生成6个Excel文件）
                int offset = i * Constant.THRESHOLD_COUNT; // 当前分片数据下标的起始位置
                CompletableFuture<Object> future = CompletableFuture.supplyAsync(() -> // CompletableFuture.supplyAsync 创建一个异步任务用于生成Excel文件。supplyAsync 方法接受一个 Supplier，表示这个任务会返回一个结果，这里返回的是 null
                {
                    exportSheetZip(vo, offset, Constant.THRESHOLD_COUNT, tempPathStr); // 该方法用于生成一个Excel文件
                    return null;
                }, executorService); // 这里的 executorService 是一个 ThreadPoolExecutor，通过 @Resource(name = "exportThreadPool") 注入，它是在 ExportThreadPoolConfig 类中通过 @Bean 注解定义的
                futureList.add(future); // 将每个异步任务的 CompletableFuture 添加到 futureList 中
            }
            CompletableFuture<Void> allCF = CompletableFuture.allOf(futureList.toArray(new CompletableFuture[0])); // 使用 CompletableFuture.allOf 创建一个 CompletableFuture，它在所有输入的 CompletableFuture 完成时完成
            allCF.join(); // 会等待所有任务完成，确保在继续执行后续代码前，所有 Excel 写入任务都已经完成

            // 将生成的6个Excel文件压缩成一个zip文件，第一个参数是 List<File>，表示要打包的文件列表；第二个参数是 File，表示生成的 ZIP 文件
            FileUtil.toZip(Files.list(tempPath).map(path -> { // 使用 Files.list 方法列出指定目录 tempPath 下的所有文件和子目录的路径
                return path.toFile(); // 使用 map 转换操作，将路径 (Path) 映射为文件 (File)。这样，我们得到了一个 File 对象的流
                // 使用 collect 操作，将文件流收集为一个 List<File>；Paths.get 构建一个 Path 对象，表示要生成的 zip 文件的路径
            }).collect(Collectors.toList()), Paths.get(zipPathStr, fileName).toFile());

            // Excel导出任务状态为成功并保存进Redis 30分钟
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.SUCCESS.name());
            // http://localhost:8080/upload/file/temp/excel/taskId.zip
            exportTaskRespVO.setUrl(MessageFormat.format("{0}{1}{2}{3}", systemConfig.getBasicUrl(), systemConfig.getTempPath(), systemConfig.getExcel(), fileName)); // 文件下载地址
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);

            // 删除之前生成临时Excel文件（把 F:/workspace/mw/temp/excel/taskId/ 目录下的6个Excel给删除）
            if (Files.isDirectory(tempPath)) {
                FileUtil.deleteFolderRecursively(tempPath);
            }
        } catch (IOException e) {
            log.error("exportProductAllZip error：{}", e);
            // Excel导出任务状态为失败并保存进Redis 30分钟
            exportTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
            redisUtil.set(taskKey, exportTaskRespVO, 30, TimeUnit.MINUTES);
            throw new BusinessException(ResponseCode.SYSTEM_ERROR);
        }
        log.info("异步导出Excel文件 exportProductAllZip 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }

    @Override
    public ExportTaskRespVO exportTaskResult(String taskId) {
        return redisUtil.get(Constant.EXCEL_OPERATION_TASK_KEY + taskId); // 从Redis中读取导出任务的执行状态和结果
    }

    /**
     * 单个 Excel 文件数据写入逻辑
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
        writeSheet.setNeedHead(false); // 因为已经是用模板导出了，所以不需要设置表头了

        int totalPage = (int) Math.ceil(limit * 1.0 / Constant.ASYNC_PAGE_CURRENT); // 单个Excel文件限制写入阈值为50万，分批每次往数据库写入5万条数据，一共需要写入10次
        List<PageProductRespVO> list;
        for (int i = 0; i < totalPage; i++) {
            // 数据库分页查询，分页偏移量每次递增5万
            // 举例第一个Excel文件：0+0*50000=0（LIMIT 0,50000）；0+1*50000=50000（LIMIT 50000,50000）；0+2*50000=100000（LIMIT 100000,50000）以此类推
            list = productsMapper.pageProduct(vo, offset + i * Constant.ASYNC_PAGE_CURRENT, Constant.ASYNC_PAGE_CURRENT);
            excelWriter.write(list, writeSheet);
            list.clear();
        }
        excelWriter.finish();
    }
}
```

控制器：

```java
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.service.ExportService;
import com.mw.vo.req.ExportProductReqVO;
import com.mw.vo.resp.ExportTaskRespVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/export")
@Api(tags = "导出模块")
public class ExportController {

    @Resource
    private ExportService exportService;

    @PostMapping("/product/thread")
    @ApiOperation(value = "异步多线程zip导出接口")
    public String threadExportProducts(@RequestBody @Valid ExportProductReqVO vo) {
        String taskId = IdWorker.getIdStr(); // 生成一个唯一的任务ID，作为本次导出任务的标识
        exportService.exportProductAllZip(vo, taskId); // 启动异步导出任务
        return taskId; // 返回生成的任务ID给前端，前端可以通过此ID来查询导出任务的执行状态和结果
    }

    @GetMapping("/product/{taskId}")
    @ApiOperation(value = "查询异步导出结果接口")
    public ExportTaskRespVO exportProductResult(@PathVariable("taskId") String taskId) {
        return exportService.exportTaskResult(taskId); // 返回查询结果给前端，前端可以根据返回的信息来下载导出结果Excel文件
    }
}
```

接口响应结果：

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

当数据全部导出完毕后，异步导出Excel文件 exportProductAllZip 执行时间为：30 秒

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
                // 提取文件名和任务 ID。如果文件名中包含有扩展名且对应的任务 ID 在 Redis 中不存在（下载地址过期），就删除该文件
                String fileName = pathFile.getFileName().toString();
                String taskId = fileName.substring(0, fileName.lastIndexOf("."));
                if (fileName.contains(".") && !redisUtil.hasKey(Constant.EXCEL_OPERATION_TASK_KEY + taskId)) {
                    try {
                        Files.deleteIfExists(pathFile);
                        log.info("delete filename: {}", fileName);
                    } catch (IOException e) {
                        log.error("run cleanExcelTemp schedule delete file error: {}", e);
                    }
                }
            });
        } catch (IOException e) {
            log.error("run cleanExcelTemp schedule error: {}", e);
        }
    }
}
```

总结：在使用 [单线程多工作表导出](#单线程多工作表导出) 方式中，后端用了 150 秒左右生成了一份 100M 左右的 Excel 文件，该文件包含了 6 张工作表。此次通过多线程多文件 zip 导出的方式，后端用了 30 秒左右生成了一个 43M 左右的 zip 压缩包，解压后里面有 6 个 Excel 文件

当前还有优化的空间：虽然用户可以在点击下载的按钮后去访问操作其他界面，不需要在当前界面上一直等待文件下载完毕。但如果用户刷新了客户端界面，那么轮询将会失效，文件不会自动下载。对此，我们可以考虑使用一些通信技术，如 Server-Sent Events（SSE）或 WebSocket。这些技术可以提供更实时和有效的通信机制

## 百万级数据异步分批导入

将实现异步多工作表导入

### 后端参考代码

导入商品 Excel 表中表头的数据传输对象 DTO（Data Transfer Object）：

```java
import com.alibaba.excel.annotation.ExcelProperty;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ProductReaderDTO {

    @ApiModelProperty("商品名称")
    @ExcelProperty("商品名称")
    private String name;

    @ApiModelProperty("商品价格")
    @ExcelProperty("商品价格")
    private String price;

    @ApiModelProperty("商品库存")
    @ExcelProperty("商品库存")
    private String stock;

    @ApiModelProperty("商品描述")
    @ExcelProperty("商品描述")
    private String description;
}
```

Excel 导入任务信息响应类：

```java
@Data
public class ImportTaskRespVO {

    @ApiModelProperty("任务ID")
    private String taskId;

    @ApiModelProperty("任务状态")
    private String status;

    @ApiModelProperty("导入Excel文件里的错误数据报告下载地址")
    private String url;

    @ApiModelProperty("响应信息")
    private String message;
}
```

由于是异步操作，我们需要把接收到的 Excel 文件先存储起来：

```java
import org.springframework.web.multipart.MultipartFile;

public interface ImportService {

    /**
     * 转存异步导入的文件
     */
    String initTask(MultipartFile file);
}
```

```java
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.common.ExcelOperationTaskEnum;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.mapper.ProductsMapper;
import com.mw.service.ImportService;
import com.mw.utils.RedisUtil;
import com.mw.vo.resp.ImportTaskRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;

@Service
@Slf4j
public class ImportServiceImpl implements ImportService {
    
    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Override
    public String initTask(MultipartFile file) {
        // 初始化导入Excel任务信息
        ImportTaskRespVO importTaskRespVO = new ImportTaskRespVO();
        String taskId = IdWorker.getIdStr(); // 生成任务ID
        importTaskRespVO.setTaskId(taskId);
        importTaskRespVO.setStatus(ExcelOperationTaskEnum.PROGRESSING.name()); // 任务状态为进行中
        redisUtil.set(Constant.EXCEL_OPERATION_TASK_KEY + taskId, importTaskRespVO, 30, TimeUnit.MINUTES); // Excel导入任务状态为进行中并保存进Redis 30分钟

        // 转存Excel文件到资源服务器
        if (!file.isEmpty()) {
            String tempPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
            String fileName = taskId + ".xlsx";
            try {
                Path tempPath = Paths.get(tempPathStr);
                if (!Files.exists(tempPath)) {
                    Files.createDirectories(tempPath);
                }
                Files.write(Paths.get(tempPathStr, fileName), file.getBytes());
            } catch (IOException e) {
                log.error("Excel 异步导入 initTask error：{}", e);
                throw new BusinessException(ResponseCode.SYSTEM_ERROR);
            }
        }
        return taskId;
    }
    
}
```

定义批量写入数据的接口方法：

```java
import com.mw.entity.Products;

import java.util.List;

public interface ImportService {

    /**
     * 批量写入数据
     * @param dataList 数据集
     * @param userId 用户ID
     */
    void batchInsert(List<Products> dataList, Long userId);
}
```

```java
import com.mw.config.SystemConfig;
import com.mw.entity.Products;
import com.mw.service.ImportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Service
@Slf4j
public class ImportServiceImpl implements ImportService {
    
    @Resource
    private DataSource dataSource;

    @Override
    public void batchInsert(List<Products> dataList, Long userId) {
        long startTime = System.currentTimeMillis();
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = dataSource.getConnection(); // 获取数据库连接
            connection.setAutoCommit(false); // 关闭自动提交并设置批处理
            String sql = "INSERT INTO products (`name`, `price`, `stock`, `description`, `create_by`, `gmt_create`) VALUES (?,?,?,?,?,?)";
            preparedStatement = connection.prepareStatement(sql);
            for (int i = 0; i < dataList.size(); i++) {
                preparedStatement.setString(1, dataList.get(i).getName());
                preparedStatement.setBigDecimal(2, dataList.get(i).getPrice());
                preparedStatement.setInt(3, dataList.get(i).getStock());
                preparedStatement.setString(4, dataList.get(i).getDescription());
                preparedStatement.setLong(5, userId);
                preparedStatement.setTimestamp(6, new Timestamp(System.currentTimeMillis()));
                preparedStatement.addBatch();
                // 每处理 1000 条数据就执行一次批处理，并清空已经添加到批处理中的 SQL 语句，以便下一轮的批处理
                if (i % 1000 == 0) {
                    preparedStatement.executeBatch();
                    preparedStatement.clearBatch();
                }
            }
            // 最后，确保在循环结束后执行一次executeBatch()以处理剩余的未提交批处理
            preparedStatement.executeBatch();
            preparedStatement.clearBatch();
            // 在所有数据处理完成后，通过commit()提交事务
            connection.commit();
            connection.setAutoCommit(true);
        } catch (Exception e) {
            // 如果在任何步骤中发生异常，将执行rollback()回滚事务
            log.error("Excel 异步导入 batchInsert error：{}", e);
            if (connection != null) {
                try {
                    connection.rollback();
                } catch (SQLException rollbackException) {
                    log.error("Excel 异步导入 batchInsert rollback error：{}", rollbackException);
                }
            }
        } finally {
            // 确保在方法执行完毕后释放资源
            try {
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (connection != null) {
                    connection.close();
                }
            } catch (SQLException e) {
                log.error("Excel 异步导入 close database error：{}", e);
            }
        }
        log.info("Excel 异步导入 batchInsert 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }
    
}
```

我们需要记录导入数据中每个工作表里的错误数据，生成一个 Excel 错误数据报告提供给用户下载。例如用户上传的 Excel 文件中有 6 个工作表（sheet），工作表1和工作表3都有错误数据。那么最后提供用户下载的错误数据报告 Excel 里就包含工作表1和工作表3的错误信息报告

定义 Excel 错误信息映射 DTO：

```java
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ExcelImportErrorDTO {

    @ApiModelProperty("数据所在sheet名称")
    @ExcelProperty("数据所在sheet名称")
    @ColumnWidth(50)
    private String sheetName;

    @ApiModelProperty("数据所在单元格位置")
    @ExcelProperty("数据所在单元格位置")
    @ColumnWidth(50)
    private String position;

    @ApiModelProperty("导入数据错误原因")
    @ExcelProperty("导入数据错误原因")
    @ColumnWidth(50)
    private String message;

}
```

定义写入错误数据的接口方法：

```java
import com.mw.vo.dto.ExcelImportErrorDTO;

import java.util.List;

public interface ImportService {

    /**
     * 记录导入文件里的错误数据
     * @param errorDataList 错误数据集
     * @param errorTaskId 标识ID
     * @param sheetName 错误数据当前的工作表名称
     * @param sheetNo 错误数据当前的工作表下标值
     */
    void saveErrorData(List<ExcelImportErrorDTO> errorDataList, String errorTaskId, String sheetName, Integer sheetNo);
}
```

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.service.ImportService;
import com.mw.utils.RedisUtil;
import com.mw.vo.dto.ExcelImportErrorDTO;
import com.mw.vo.resp.ImportTaskRespVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ImportServiceImpl implements ImportService {

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Override
    public void saveErrorData(List<ExcelImportErrorDTO> errorDataList, String errorTaskId, String sheetName, Integer sheetNo) {
        long startTime = System.currentTimeMillis();
        // 初始化错误报告的响应信息
        ImportTaskRespVO importTaskRespVO = new ImportTaskRespVO();
        importTaskRespVO.setTaskId(errorTaskId);
        redisUtil.set(Constant.EXCEL_OPERATION_TASK_KEY + errorTaskId, importTaskRespVO, 30, TimeUnit.MINUTES);
        // 创建一个错误报告的临时文件
        String tempPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        String fileName = errorTaskId + ".xlsx";
        Path resourcePath = Paths.get(tempPathStr, fileName);
        try {
            // 构建错误报告的临时文件路径，并创建该路径对应的目录
            Path tempPath = Paths.get(tempPathStr);
            if (!Files.exists(tempPath)) {
                Files.createDirectories(tempPath);
            }
            // 判断错误数据报告临时文件是否存在
            if (!Files.exists(resourcePath)) { // 不存在，说明是第一次写入错误数据，直接使用 EasyExcel 创建一个新的 Excel 文件，写入错误数据
                try (ExcelWriter excelWriter = EasyExcel.write(resourcePath.toFile(), ExcelImportErrorDTO.class).build()) {
                    // 每次都要创建 writeSheet，这里注意必须指定sheetNo，而且sheetName必须不一样
                    WriteSheet writeSheet = EasyExcel.writerSheet(sheetNo, sheetName).head(ExcelImportErrorDTO.class).build();
                    excelWriter.write(errorDataList, writeSheet);
                }
            } else { // 如果错误数据报告临时文件已经存在，说明在这之前的工作表中有出现错误数据，这时需要追加当前工作表的错误数据
                // 创建一个新的临时文件 a，用于存储追加后的错误数据
                File tempFile = Paths.get(tempPathStr, IdWorker.getIdStr() + ".xlsx").toFile();
                // 使用 FileUtils.copyFile() 将已经存在的错误数据临时文件 resourcePath.toFile() 复制到刚刚创建的临时文件 a
                FileUtils.copyFile(resourcePath.toFile(), tempFile);
                // 以 a 文件作为模板，新的错误数据将被写入的目标文件 resourcePath.toFile() 中（例如 a 模板只有 sheet1 的错误数据，当前 sheet2 有错误数据，因此把错误数据写到 sheet2 当中）
                EasyExcel.write().withTemplate(tempFile).file(resourcePath.toFile()).head(ExcelImportErrorDTO.class).sheet(sheetName).doWrite(errorDataList);
                Files.deleteIfExists(tempFile.toPath()); // 删除临时文件 a，因为已经将数据追加到 resourcePath.toFile() 中了
                return;
            }
        } catch (IOException e) {
            log.error("Excel 异步导入文件 saveErrorData error：{}", e);
        }
        log.info("Excel 异步导入文件 saveErrorData 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }
}
```

创建一个 Excel 数据读取的监听器，用来解析 Excel 中每个工作表里的数据

```java
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.read.metadata.holder.xlsx.XlsxReadSheetHolder;
import com.alibaba.excel.util.ListUtils;
import com.mw.common.constant.Constant;
import com.mw.entity.Products;
import com.mw.service.ImportService;
import com.mw.vo.dto.ExcelImportErrorDTO;
import com.mw.vo.dto.ProductReaderDTO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.util.List;

@Slf4j
public class ReaderProductDataListener implements ReadListener<ProductReaderDTO> { // 实现了 EasyExcel 的 ReadListener 接口，用于监听 Excel 数据的读取过程

    private List<Products> cachedDataList = ListUtils.newArrayListWithExpectedSize(Constant.IMPORT_MAX_CURRENT); // 将读取的数据转换为实体对象并缓存到 `cachedDataList` 中，达到5万时进行批量插入数据库的操作，避免一次性处理大量数据可能导致的性能问题

    private final ImportService importService; // 注入的服务，用于调用批量插入方法

    private final Long userId; // 导入操作的用户ID

    // 构造函数接收导入服务和用户ID作为参数，并初始化相应的成员变量
    public ReaderProductDataListener(ImportService importService, Long userId) {
        this.importService = importService;
        this.userId = userId;
    }

    // 记录错误数据的相关变量
    private List<ExcelImportErrorDTO> errorDataList = ListUtils.newArrayListWithExpectedSize(Constant.IMPORT_MAX_CURRENT); // 用于缓存转换后的错误数据，当达到5万时触发批量插入

    private Boolean isErrorData = false; // 是否有错误数据

    private Integer sheetNo; // 工作表下标值

    private String sheetName; // 工作表名称

    private String errorTaskId; // 错误标识ID

    // 初始化工作表信息，用于标识错误数据对应的工作表信息
    public void initReaderDataListener(Integer sheetNo, String sheetName, String taskId) {
        this.sheetNo = sheetNo;
        this.sheetName = sheetName;
        this.errorTaskId = taskId;
    }

    /**
     * invoke 方法在每次读取工作表数据时被调用
     */
    @SneakyThrows
    @Override
    public void invoke(ProductReaderDTO data, AnalysisContext context) {
        // 校验Excel数据收集不符合要求的数据
        String errorMessage = "";
        if (!StringUtils.hasLength(data.getName())) {
            errorMessage = "商品名称不能为空";
            isErrorData = true;
        }
        if (!StringUtils.hasLength(data.getPrice())) {
            errorMessage += "商品价格不能为空";
            isErrorData = true;
        } else {
            try {
                new BigDecimal(data.getPrice());
            } catch (Exception e) {
                log.error("Excel 异步导入数据 invoke setPrice error：{}", e);
                errorMessage += MessageFormat.format("价格的单元格数据为【{0}】格式不正确", data.getPrice());
                isErrorData = true;
            }
        }
        // 收集错误的数据
        if (isErrorData) {
            // XlsxReadSheetHolder 是 EasyExcel 中用于持有 Excel 读取过程中 Sheet 的信息的类。它保存了关于当前 Sheet 的各种信息，例如 Sheet 的索引、Sheet 名称等
            // context 表示当前的上下文，而 currentReadHolder() 是 EasyExcel 提供的方法，用于获取当前读取过程中的持有者对象。这个对象包含了当前读取的 Sheet 的相关信息
            XlsxReadSheetHolder xlsxReadSheetHolder = (XlsxReadSheetHolder) context.currentReadHolder();
            // 错误信息映射
            ExcelImportErrorDTO excelImportErrorDTO = new ExcelImportErrorDTO();
            excelImportErrorDTO.setSheetName(sheetName); // 当前工作表名称
            excelImportErrorDTO.setPosition(String.valueOf(xlsxReadSheetHolder.getRowIndex() + 1)); // 数据所在单元格位置：getRowIndex() 获取当前正在读取的行的索引（行号）。需要注意，行索引是从0开始的，因此如果当前正在读取第一行，getRowIndex() 返回的值将是0
            excelImportErrorDTO.setMessage(errorMessage); // 错误信息
            errorDataList.add(excelImportErrorDTO);
            isErrorData = false;
            return;
        }
        if (!StringUtils.hasLength(data.getStock())) {
            data.setStock("0");
        }

        // 将 ProductReaderDTO 转换为 Products 对象，并将其添加到 cachedDataList 中
        Products products = new Products();
        products.setName(data.getName());
        products.setPrice(new BigDecimal(data.getPrice()));
        products.setStock(Integer.valueOf(data.getStock()));
        products.setDescription(data.getDescription());
        products.setCreateBy(userId);
        cachedDataList.add(products);

        // 如果达到一定数量（Constant.IMPORT_MAX_CURRENT），则调用 saveData() 方法进行批量插入，并清空缓存列表
        if (cachedDataList.size() >= Constant.IMPORT_MAX_CURRENT) {
            saveData();
        }
    }

    /**
     * 该方法在每个工作表的所有数据解析完成后调用，用于处理可能存在的剩余数据
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        saveData();
        saveErrorData();
        log.info("Excel 异步导入数据，工作表 {} 解析完成", sheetName);
    }

    /**
     * 用于触发批量插入操作，调用导入服务的 batchInsert 方法，然后清空缓存列表
     */
    private void saveData() {
        log.info("Excel 异步导入 saveData {} 条数据，开始存储数据库", cachedDataList.size());
        if (!cachedDataList.isEmpty()) {
            importService.batchInsert(cachedDataList, userId);
            cachedDataList.clear();
        }
        log.info("Excel 异步导入 saveData 存储数据库成功");
    }

    /**
     * 读取完每个工作表的数据后记录错误数据
     */
    private void saveErrorData() {
        log.info("Excel 异步导入 saveErrorData {} 条错误数据，开始记录", errorDataList.size());
        if (!errorDataList.isEmpty()) {
            importService.saveErrorData(errorDataList, errorTaskId, sheetName, sheetNo);
            errorDataList.clear();
        }
        log.info("Excel 异步导入 saveErrorData 存储失败记录成功");
    }

}
```

整合实现异步分批导入逻辑，定义接口方法：

```java
public interface ImportService {

    /**
     * 异步导入接口
     * @param taskId initTask 初始化接口返回的任务ID
     * @param userId 用户ID，记录是哪个用户上传的文件
     */
    void importExcelAsync(String taskId, String userId);
}
```

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.metadata.ReadSheet;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.mw.common.ExcelOperationTaskEnum;
import com.mw.common.constant.Constant;
import com.mw.config.SystemConfig;
import com.mw.listener.ReaderProductDataListener;
import com.mw.service.ImportService;
import com.mw.utils.RedisUtil;
import com.mw.vo.dto.ProductReaderDTO;
import com.mw.vo.resp.ImportTaskRespVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ImportServiceImpl implements ImportService {

    @Resource
    private SystemConfig systemConfig;

    @Resource
    private RedisUtil redisUtil;

    @Override
    @Async // @Async 注解表示该方法是一个异步方法，将会在一个独立的线程中执行，不会阻塞当前线程
    public void importExcelAsync(String taskId, String userId) {
        log.info("start Async EasyExcel Implement Excel Import");
        long startTime = System.currentTimeMillis();
        // 初始化导入任务信息
        ImportTaskRespVO importTaskRespVO = new ImportTaskRespVO();
        importTaskRespVO.setTaskId(taskId);
        // 根据系统配置和任务ID生成Excel文件的路径和文件名
        String tempPathStr = MessageFormat.format("{0}{1}{2}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel());
        String fileName = taskId + ".xlsx";
        Path path = Paths.get(tempPathStr, fileName);

        // 创建一个监听器实例，该监听器在Excel数据读取时负责将数据转换为实体对象并进行批量插入，并记录数据中的错误信息
        ReaderProductDataListener readerProductDataListener = new ReaderProductDataListener(this, Long.valueOf(userId));
        // 使用 EasyExcel 的 ExcelReader 类，设置监听器和文件路径
        try (ExcelReader excelReader = EasyExcel.read(path.toFile(), ProductReaderDTO.class, readerProductDataListener).build()) { // 在 try 代码块结束时，无论是否发生异常，系统会自动调用 excelReader.close() 方法来关闭资源
            String errorTaskId = IdWorker.getIdStr();
            List<ReadSheet> readSheets = excelReader.excelExecutor().sheetList(); // 获取所有工作表的列表，然后遍历每个工作表，分别进行数据读取
            for (ReadSheet readSheet : readSheets) {
                readerProductDataListener.initReaderDataListener(readSheet.getSheetNo(), readSheet.getSheetName(), errorTaskId); // 在读取Excel前通过监听器初始化工作表以便标注当有错误记录时对应的是哪个工作表
                excelReader.read(readSheet); // 通过 excelReader.read(readSheets) 进行读取。readSheet 表示需要读取的 sheet 列表
            }
            // 定义错误数据报告文件路径地址
            String errorExcelPath = MessageFormat.format("{0}{1}{2}/{3}", systemConfig.getLocalPath(), systemConfig.getTempPath(), systemConfig.getExcel(), errorTaskId + ".xlsx");
            // 判断这个文件是否存在，如果存在就说明我们导入的Excel文件里存在错误格式的数据，保存进Redis中提供查询接口给用户下载查看
            if (Files.exists(Paths.get(errorExcelPath))) {
                importTaskRespVO.setUrl(MessageFormat.format("{0}{1}{2}/{3}", systemConfig.getBasicUrl(), systemConfig.getTempPath(), systemConfig.getExcel(), errorTaskId + ".xlsx"));
            }
            importTaskRespVO.setStatus(ExcelOperationTaskEnum.SUCCESS.name());
        } catch (Exception e) {
            log.error("Excel 异步导入 importExcelAsync error：{}", e);
            importTaskRespVO.setStatus(ExcelOperationTaskEnum.FAIL.name());
        }
        redisUtil.set(Constant.EXCEL_OPERATION_TASK_KEY + taskId, importTaskRespVO, 30, TimeUnit.MINUTES);
        log.info("Excel 异步导入 importExcelAsync 执行时间为：{} 秒", (System.currentTimeMillis() - startTime) / 1000);
    }
}
```

控制器：

```java
import com.mw.service.ImportService;
import com.mw.vo.resp.ImportTaskRespVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/import")
@Api(tags = "导入商品模块")
public class ImportController {

    @Resource
    private ImportService importService;

    @Resource
    private ImportService importService;

    @Resource
    private ImportService importService;

    @PostMapping("/product/async/{userId}")
    @ApiOperation("异步导入商品Excel接口")
    public String importProductAsync(@PathVariable("userId") String userId, @RequestParam("file") MultipartFile file) {
        String taskId = importService.initTask(file); // 转存异步导入的文件
        importService.importExcelAsync(taskId, userId); // 异步批量写入上传文件数据，并记录其中的错误数据形成报告
        return taskId; // 返回生成的任务ID给前端，前端可以通过此ID来查询导出任务的执行状态和结果
    }

    @GetMapping("/product/{taskId}")
    @ApiOperation(value = "查询异步导入结果接口")
    public ImportTaskRespVO importProductResult(@PathVariable("taskId") String taskId) {
        return importService.importTaskResult(taskId); // 返回查询结果给前端，前端可以根据返回的信息来下载导出结果Excel文件
    }
    
}
```

### 前端参考代码

商品导入接口请求字段：

```ts
export interface UploadExcelReqVO {
    userId: string;
    file: Blob
}
```

定义后端请求接口：

```ts
/**
 * 商品异步导入接口
 */
export const importProductAsyncApi = (param: UploadExcelReqVO) => {
    return instance.post('/api/import/product/async/' + param.userId, { file: param.file }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 查询Excel异步导入信息接口
 */
export const importExcelTaskApi = (taskId: string) => {
    return instance.get<any, IResponse<ExcelOperationTaskRespVO>>('/api/import/product/' + taskId);
}
```

业务逻辑：

```vue
<template>
  <el-dropdown>
    <el-button type="primary">导入<el-icon class="el-icon--right"><arrow-down/></el-icon></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-upload ref="upload" action="" :multiple="false" :http-request="importProductAsync" :show-file-list="false" accept=".xlsx">
            异步导入数据
          </el-upload>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { UploadExcelReqVO } from '@/api/product/types'
  import { importProductAsyncApi, importExcelTaskApi} from '@/api/product';
  import { ElMessage, UploadRequestOptions } from 'element-plus';
  import { useUserStore } from '@/store/userStore';

  const userStore = useUserStore();

  const importProductAsync = async (options: UploadRequestOptions) => {
    const { file } = options;
    const param: UploadExcelReqVO = {
      userId: userStore.userId,
      file: file
    }
    await importProductAsyncApi(param).then(res => {
      ElMessage.success("导入成功，正在努力处理中");
      setTimeout(() => {
        pullImportProductStatus(res.data);
      }, 10000);
    }).catch(error => { })
  }

  /**
   * 根据任务ID轮询获取Excel导入结果
   */
  const pullImportProductStatus = async (taskId: string) => {
    await importExcelTaskApi(taskId).then(res => {
      if (res.data.status === 'SUCCESS') { // 成功
        ElMessage.success("导入成功");
        if (res.data.url) { // 导入的文件中有错误数据，将下载错误数据原因Excel
          ElMessage.success("正确的数据已存进数据库，未保存成功的错误数据报告将自动下载到给您查看");
          window.location.href = res.data.url;
        }
        // 重新加载新分页数据 loadData();
        return;
      } else if (res.data.status === 'FAIL') { // 失败
        ElMessage.error(res.data.message);
        return;
      } else { // 进行中
        setTimeout(() => {
          pullImportProductStatus(taskId);
        }, 20000);
      }
    }).catch(error => { })
  }
</script>
```