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
    if (!pageProductForm.ids?.length) {
        ElMessage.warning("请勾选要导出的商品数据");
        return false;
    }
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