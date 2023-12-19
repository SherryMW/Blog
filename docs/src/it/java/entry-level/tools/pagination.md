---
category: IT
article: false
---

# 分页查询

不管是商品的分页还是说订单的分页，前端只需要传递给后端两个字段就可以实现分页，因此通用的字段可以考虑封装起来：

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Max;

@Data
public class BasePage {

    @ApiModelProperty("每页记录数")
    @Max(value = 1000, message = "最大支持查询1000条数据")
    private Integer size = 10;

    @ApiModelProperty("当前页数")
    private Integer current = 1;
}
```

统一分页响应数据实体类，因为定义的是泛型，所以不管是商品分页数据，还是说订单分页数据都可以接收：

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class PageResult<T> {

    @ApiModelProperty("分页数据")
    private List<T> list;

    @ApiModelProperty("分页总记录数")
    private Long total;

    public PageResult(List<T> list, Long total) {
        this.list = list;
        this.total = total;
    }

    private PageResult() {
    }

    public static <T> PageResult getPage(List<T> list, Long total) {
        return new PageResult<>(list, total);
    }
}
```

## 手动实现分页

在数据库中，`LIMIT` 是一种用于限制查询结果集的 SQL 关键字。在 `LIMIT` 子句中，有两个参数，它们分别代表：

- `offset`：它表示从查询结果的哪一行开始获取数据，也可以称为偏移量。如果设置为 0，表示从结果集的第一行开始获取数据；如果设置为 10，表示从结果集的第 11 行开始获取数据，以此类推

- `limit`：它表示最多返回的记录数，即在从偏移量开始的位置上最多返回多少行记录

::: tabs

@tab Products.java

商品信息实体类

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

@tab PageProductReqVO.java

前端传递给后端的分页条件查询实体类

```java
import com.mw.pojo.BasePage;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class PageProductReqVO extends BasePage {

    @ApiModelProperty("商品名称")
    private String productName;

    @ApiModelProperty("起始时间")
    private Timestamp startTime;

    @ApiModelProperty("结束时间")
    private Timestamp endTime;
}
```

@tab PageProductRespVO.java

后端响应给前端的分页数据对象

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PageProductRespVO {

    @ApiModelProperty("商品ID")
    private Integer id;

    @ApiModelProperty("商品名称")
    private String name;

    @ApiModelProperty("价格")
    private BigDecimal price;

    @ApiModelProperty("库存")
    private Integer stock;

    @ApiModelProperty("商品描述")
    private String description;

    @ApiModelProperty("创建时间")
    private String gmtCreate;

    @ApiModelProperty("更新时间")
    private String gmtModified;
}
```

@tab ProductMapper.java

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mw.vo.resp.PageProductRespVO;
import com.mw.vo.req.PageProductReqVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductsMapper extends BaseMapper<Products> {

    /**
     * 条件查询总记录数
     * 
     * @param vo 条件查询对象
     * @return 返回总记录数
     */
    Long pageProductTotal(@Param("vo") PageProductReqVO vo);

    /**
     * 条件查询分页数据
     * 
     * @param vo 条件查询对象
     * @param offset 偏移量
     * @param limit 返回的记录数
     * @return 分页数据集
     */
    List<PageProductRespVO> pageProduct(@Param("vo") PageProductReqVO vo, @Param("offset") Integer offset, @Param("limit") Integer limit);

}
```

@tab ProductMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mw.mapper.ProductsMapper">

    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.mw.entity.Products">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="price" property="price"/>
        <result column="stock" property="stock"/>
        <result column="description" property="description"/>
        <result column="create_by" property="createBy"/>
        <result column="modified_by" property="modifiedBy"/>
        <result column="gmt_create" property="gmtCreate"/>
        <result column="gmt_modified" property="gmtModified"/>
    </resultMap>

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

    <!--  商品总记录数  -->
    <select id="pageProductTotal" resultType="java.lang.Long" parameterType="com.mw.vo.req.PageProductReqVO">
        SELECT COUNT(1) FROM products <include refid="pageProductSql"></include>
    </select>

    <!--  商品分页条件查询  -->
    <select id="pageProduct" resultType="com.mw.vo.resp.PageProductRespVO">
        SELECT * FROM products a INNER JOIN (SELECT id FROM products <include refid="pageProductSql"></include> ORDER BY gmt_create DESC LIMIT #{offset}, #{limit}) b ON a.id = b.id;
    </select>

</mapper>
```

@tab IProductsService.java

```java
import com.mw.vo.resp.PageProductRespVO;
import com.baomidou.mybatisplus.extension.service.IService;
import com.mw.pojo.PageResult;
import com.mw.vo.req.PageProductReqVO;

public interface IProductsService extends IService<Products> {

    PageResult<PageProductRespVO> pageProducts(PageProductReqVO vo);

}
```

@tab ProductsServiceImpl.java

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mw.vo.resp.PageProductRespVO;
import com.mw.mapper.ProductsMapper;
import com.mw.pojo.PageResult;
import com.mw.service.IProductsService;
import com.mw.vo.req.PageProductReqVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ProductsServiceImpl extends ServiceImpl<ProductsMapper, Products> implements IProductsService {

    @Resource
    private ProductsMapper productsMapper;

    @Override
    public PageResult<PageProductRespVO> pageProducts(PageProductReqVO vo) {
        int offset = (vo.getCurrent() - 1) * vo.getSize(); // 计算偏移量
        List<PageProductRespVO> products = productsMapper.pageProduct(vo, offset, vo.getSize()); // 通过偏移量和限制返回数量实现分页
        Long total = productsMapper.pageProductTotal(vo);
        return PageResult.getPage(products, total); // 返回分页条件查询数据以及总记录数
    }
}
```

@tab ProductController.java

```java
import com.mw.vo.resp.PageProductRespVO;
import com.mw.pojo.PageResult;
import com.mw.service.IProductsService;
import com.mw.vo.req.PageProductReqVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping("/api")
@Api(tags = "商品模块")
public class ProductsController {

    @Resource
    private IProductsService productsService;

    @PostMapping("/products")
    @ApiOperation(value = "商品分页接口")
    public PageResult<PageProductRespVO> products(@RequestBody @Valid PageProductReqVO vo) {
        return productsService.pageProducts(vo);
    }

}
```

:::

请求参数：

```json
{
  "current": 1,
  "size": 10,
  "productName": ""
}
```

日志：

```text
DEBUG 28176 --- [nio-8081-exec-5] c.mw.mapper.ProductsMapper.pageProduct   : ==>  Preparing: SELECT * FROM products a INNER JOIN (SELECT id FROM products WHERE 1 = 1 ORDER BY gmt_create DESC LIMIT ?, ?) b ON a.id = b.id;
DEBUG 28176 --- [nio-8081-exec-5] c.mw.mapper.ProductsMapper.pageProduct   : ==> Parameters: 0(Integer), 10(Integer)
DEBUG 28176 --- [nio-8081-exec-5] c.mw.mapper.ProductsMapper.pageProduct   : <==      Total: 10
DEBUG 28176 --- [nio-8081-exec-5] c.m.m.ProductsMapper.pageProductTotal    : ==>  Preparing: SELECT COUNT(1) FROM products WHERE 1 = 1
DEBUG 28176 --- [nio-8081-exec-5] c.m.m.ProductsMapper.pageProductTotal    : ==> Parameters: 
DEBUG 28176 --- [nio-8081-exec-5] c.m.m.ProductsMapper.pageProductTotal    : <==      Total: 1
```

::: details 响应结果：
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 6053192,
        "name": "Product2998271",
        "price": 48.09,
        "stock": 2998271,
        "description": "Description for Product2998271",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053185,
        "name": "Product2998264",
        "price": 11.22,
        "stock": 2998264,
        "description": "Description for Product2998264",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6054921,
        "name": "Product3000000",
        "price": 70.72,
        "stock": 3000000,
        "description": "Description for Product3000000",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053187,
        "name": "Product2998266",
        "price": 82.44,
        "stock": 2998266,
        "description": "Description for Product2998266",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053191,
        "name": "Product2998270",
        "price": 99.94,
        "stock": 2998270,
        "description": "Description for Product2998270",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053188,
        "name": "Product2998267",
        "price": 106.53,
        "stock": 2998267,
        "description": "Description for Product2998267",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053186,
        "name": "Product2998265",
        "price": 65.22,
        "stock": 2998265,
        "description": "Description for Product2998265",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053190,
        "name": "Product2998269",
        "price": 47.21,
        "stock": 2998269,
        "description": "Description for Product2998269",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053189,
        "name": "Product2998268",
        "price": 75.36,
        "stock": 2998268,
        "description": "Description for Product2998268",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      },
      {
        "id": 6053184,
        "name": "Product2998263",
        "price": 26.95,
        "stock": 2998263,
        "description": "Description for Product2998263",
        "gmtCreate": "2022-12-16 16:55:48",
        "gmtModified": "2022-12-16 16:55:48"
      }
    ],
    "total": 3000000
  },
  "message": "响应成功"
}
```
:::

### 前端参考代码

::: tabs

@tab src/types/global.d.ts

```ts
/**
 * 后端统一响应体数据结构
 */
declare interface IResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

/**
 * 后端统一分页数据结构
 */
declare interface Page<T = any> {
    list: T[];
    total: number;
}
```

@tab src/api/product/types.ts

```ts
/**
 * 分页条件查询用户请求字段（提交给后端的数据结构）
 */
export interface PageProductReqVO {
    size: number;
    current: number;
    productName?: string;
    startTime?: number;
    endTime?: number;
    rangeTime?: [Date, Date];
}

/**
 * 分页查询用户响应字段（后端响应的数据结构）
 */
export interface PageProductRespVO {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    gmtCreate: String;
    gmtModified: string;
}
```

@tab src/api/product/index.ts

```ts
import instance from "@/utils/request";
import { PageProductReqVO, PageProductRespVO } from "./types";

/**
 * 用户分页接口
 */
export const productPageApi = (param: PageProductReqVO) => {
    return instance.post<any, IResponse<Page<PageProductRespVO>>>('/api/products', param);
}
```

@tab src/views/product/index.vue

```vue
<template>
    <div>
        <div style="margin: 20px 20px;">
            <el-form :inline="true" ref="productFormRef" :model="pageProductForm">
                <el-form-item label="商品名称" prop="productName">
                    <el-input v-model="pageProductForm.productName" placeholder="请输入商品名称" clearable />
                </el-form-item>
                <el-form-item label="创建时间" prop="rangeTime">
                    <el-date-picker v-model="pageProductForm.rangeTime" type="datetimerange" range-separator="~"
                        start-placeholder="开始时间" end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button type="primary" @click="onReset(productFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-card>
            <div>
                <el-table :data="productTableData.list" :border=true style="width: 100%">
                    <el-table-column prop="id" label="ID" align="center" />
                    <el-table-column prop="name" label="商品名称" align="center" />
                    <el-table-column prop="price" label="商品价格" align="center" />
                    <el-table-column prop="stock" label="商品库存" align="center" />
                    <el-table-column prop="description" label="商品描述" align="center" />
                    <el-table-column prop="gmtCreate" label="商品创建时间" align="center" />
                    <el-table-column prop="gmtModified" label="商品更新时间" align="center" />
                </el-table>
            </div>
            <div style="padding: 20px 20px;">
                <el-pagination v-model:current-page="pageProductForm.current" v-model:page-size="pageProductForm.size"
                    :page-sizes="[10, 20, 30, 40, 50]" :small=false :disabled=false :background=true
                    layout="total, sizes, prev, pager, next, jumper" :total="productTableData.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { PageProductReqVO, PageProductRespVO } from '@/api/product/types'
import { productPageApi } from '@/api/product';
import { FormInstance } from 'element-plus';

onMounted(() => {
    loadData();
})

/**
 * 响应式分页表格数据对象
 */
const productTableData: Page<PageProductRespVO> = reactive({
    list: [],
    total: 0
})

/**
 * 响应式分页条件查询对象。PageProductReqVO 中配置了 productName/startTime/endTime/rangeTime 为可选项，因此这里可以不指定
 */
const pageProductForm: PageProductReqVO = reactive({
    current: 1,
    size: 10
})

/**
 * 请求后端分页接口
 */
const loadData = async () => {
    await productPageApi(pageProductForm).then(res => {
        productTableData.list = res.data.list;
        productTableData.total = res.data.total;
    }).catch(error => { })
}

const onSubmit = async () => {
    if (pageProductForm.rangeTime) {
        pageProductForm.startTime = pageProductForm.rangeTime[0].getTime();
        pageProductForm.endTime = pageProductForm.rangeTime[1].getTime();
    } else {
        pageProductForm.startTime = undefined;
        pageProductForm.endTime = undefined;
    }
    pageProductForm.current = 1; // 页码重置为第一页
    loadData();
}

const productFormRef = ref<FormInstance>();
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields();
    loadData();
}

/**
 * 分页组件API：改变每页记录数时触发
 */
const handleSizeChange = (val: number) => {
    pageProductForm.current = 1; // 当改变每页记录数时得回到第一页重新计算
    loadData();
}

/**
 * 分页组件API：改变当前页数时触发
 */
const handleCurrentChange = (val: number) => {
    pageProductForm.current = val;
    loadData();
}

</script>

<style scoped></style>
```

:::

## 自动实现分页

::: tabs

@tab SysUser.java

用户信息实体类

```java
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("sys_user")
@ApiModel(value = "SysUser对象", description = "")
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty("主键ID")
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    @ApiModelProperty("账户名称")
    private String username;

    @ApiModelProperty("加密盐值")
    private String salt;

    @ApiModelProperty("用户密码密文")
    private String password;

    @ApiModelProperty("手机号码")
    private String phone;

    @ApiModelProperty("真实名称")
    private String realName;

    @ApiModelProperty("昵称")
    private String nickName;

    @ApiModelProperty("邮箱(唯一)")
    private String email;

    @ApiModelProperty("账户状态(1.正常 2.锁定 )")
    private Integer status;

    @ApiModelProperty("性别(1.男 2.女)")
    private Integer sex;

    @ApiModelProperty("是否删除(1未删除；0已删除)")
    private Integer deleted;

    @ApiModelProperty("创建人")
    private Long createId;

    @ApiModelProperty("更新人")
    private Long updateId;

    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;
}
```

@tab PageUserReqVO.java

前端传递给后端的分页条件查询实体类

```java
import com.mw.pojo.BasePage;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PageUserReqVO extends BasePage {

    @ApiModelProperty(value = "账号")
    private String username;

    @ApiModelProperty(value = "状态")
    private Integer status;

}
```

@tab PageUserRespVO.java

后端响应给前端的分页数据对象

```java
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class PageUserRespVO {

    @ApiModelProperty("主键ID")
    @JsonSerialize(using = ToStringSerializer.class) //解决生成主键太长导致JS精度丢失
    private Long id;

    @ApiModelProperty("账户名称")
    private String username;

    @ApiModelProperty("邮箱(唯一)")
    private String email;

    @ApiModelProperty("账户状态(1.正常 2.锁定 )")
    private Integer status;

    @ApiModelProperty("创建时间")
    private String createTime;
}
```

@tab SysUserMapper.java

```java
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mw.entity.SysUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mw.vo.req.PageUserReqVO;
import com.mw.vo.resp.PageUserRespVO;
import org.apache.ibatis.annotations.Param;

public interface SysUserMapper extends BaseMapper<SysUser> {

    IPage<PageUserRespVO> selectPageUser(IPage<PageUserReqVO> page, @Param("vo") PageUserReqVO vo);
}
```

- `IPage<PageUserRespVO>`：这是方法的返回类型。`IPage` 是 MyBatis-Plus 提供的分页查询结果的接口，它包含了查询结果以及分页相关的信息，如总记录数、当前页码、每页记录数等。`PageUserRespVO` 表示查询结果的数据类型

- `IPage<PageUserReqVO> page`：这是作为方法参数的 `IPage` 对象，用于传递分页相关的信息。通常，`IPage` 包含了分页查询的信息，比如当前页码、每页记录数等。在这里，`IPage<PageUserReqVO>` 表示查询条件，因为 `PageUserReqVO` 中可能包含了一些查询条件的信息

- `@Param("vo") PageUserReqVO vo`：这是另一个参数，用于传递查询条件的对象。`@Param("vo")` 注解用于给参数取一个别名，这里的别名是 `vo`，在 SQL 语句中可以通过 `${vo.property}` 的方式引用对象的属性。`PageUserReqVO` 是查询条件的数据类型

@tab SysUserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.mw.mapper.SysUserMapper">

    <select id="selectPageUser" resultType="com.mw.vo.resp.PageUserRespVO" parameterType="com.mw.vo.req.PageUserReqVO">
        SELECT id, username, email, status, create_time FROM sys_user
        <where>
            deleted = 1
            <if test="vo.username != null and vo.username != ''">
                AND username LIKE CONCAT('%',#{vo.username},'%')
            </if>
            <if test="vo.status != null">
                AND status = #{vo.status}
            </if>
        </where>
    </select>
</mapper>
```

@tab ISysUserService.java

```java
import com.baomidou.mybatisplus.extension.service.IService;
import com.mw.entity.SysUser;
import com.mw.pojo.PageResult;
import com.mw.vo.req.PageUserReqVO;
import com.mw.vo.resp.PageUserRespVO;

public interface ISysUserService extends IService<SysUser> {

    PageResult<PageUserRespVO> pageUsers(PageUserReqVO vo);
}
```

@tab SysUserServiceImpl.java

```java
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.mw.entity.SysUser;
import com.mw.mapper.SysUserMapper;
import com.mw.pojo.PageResult;
import com.mw.service.ISysUserService;
import com.mw.vo.req.PageUserReqVO;
import com.mw.vo.resp.PageUserRespVO;

import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements ISysUserService {

    @Resource
    private SysUserMapper userMapper;

    @Override
    public PageResult<PageUserRespVO> pageUsers(PageUserReqVO vo) {
        IPage<PageUserRespVO> result = userMapper.selectPageUser(new Page<>(vo.getCurrent(), vo.getSize()), vo);
        return PageResult.getPage(result.getRecords(), result.getTotal());
    }
}
```

@tab SysUserController.java

```java
import com.mw.pojo.PageResult;
import com.mw.service.ISysUserService;
import com.mw.vo.req.PageUserReqVO;
import com.mw.vo.resp.PageUserRespVO;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class SysUserController {

    @Resource
    private ISysUserService userService;
    
    @PostMapping("/users")
    @ApiOperation(value = "用户分页接口")
    public PageResult<PageUserRespVO> pageUsers(@RequestBody @Valid PageUserReqVO vo) {
        return userService.pageUsers(vo);
    }
}
```

:::

请求参数：

```json
{
  "size": 10,
  "current": 1,
  "status": 1,
  "username": ""
}
```

日志：

```text
DEBUG 28176 --- [nio-8081-exec-2] c.m.m.S.selectPageUser_mpCount           : ==>  Preparing: SELECT COUNT(*) AS total FROM sys_user WHERE deleted = 1 AND status = ?
DEBUG 28176 --- [nio-8081-exec-2] c.m.m.S.selectPageUser_mpCount           : ==> Parameters: 0(Integer)
DEBUG 28176 --- [nio-8081-exec-2] c.m.m.S.selectPageUser_mpCount           : <==      Total: 1
DEBUG 28176 --- [nio-8081-exec-4] c.m.mapper.SysUserMapper.selectPageUser  : ==>  Preparing: SELECT id, username, email, status, create_time FROM sys_user WHERE deleted = 1 AND status = ? LIMIT ?
DEBUG 28176 --- [nio-8081-exec-4] c.m.mapper.SysUserMapper.selectPageUser  : ==> Parameters: 1(Integer), 10(Long)
DEBUG 28176 --- [nio-8081-exec-4] c.m.mapper.SysUserMapper.selectPageUser  : <==      Total: 1
```

::: details 响应结果：
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "1734428376694743042",
        "username": "zhangsan",
        "email": "123@163.com",
        "status": 1,
        "createTime": "2022-12-12 12:22:22"
      }
    ],
    "total": 1
  },
  "message": "响应成功"
}
```
:::

### 前端参考代码

::: tabs

@tab src/types/global.d.ts

```ts
/**
 * 后端统一响应体数据结构
 */
declare interface IResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

/**
 * 后端统一分页数据结构
 */
declare interface Page<T = any> {
    list: T[];
    total: number;
}
```

@tab src/api/user/types.ts

```ts
/**
 * 分页条件查询用户请求字段（提交给后端的数据结构）
 */
export interface PageUserReqVO {
    size: number;
    current: number;
    username?: string;
    status?: number
}

/**
 * 分页查询用户响应字段（后端响应的数据结构）
 */

export interface PageUserRespVO {
    id: string;
    username: string;
    email: string;
    status: number;
    createTime: string;
}
```

@tab src/api/user/index.ts

```ts
import { PageUserReqVO, PageUserRespVO } from "./types";
import instance from "@/utils/request";

/**
 * 用户分页接口
 */
export const userPageApi = (param: PageUserReqVO) => {
    return instance.post<any, IResponse<Page<PageUserRespVO>>>('/api/users', param);
}
```

@tab src/views/home/index.vue

```vue
<template>
  <div>
    <div style="margin: 20px 20px;">
      <el-form :inline="true" :model="pageUserForm">
        <el-form-item label="账号">
          <el-input v-model="pageUserForm.username" placeholder="请输入账号" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="pageUserForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="1"/>
            <el-option label="锁定" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="userTableData.list" :border=true style="width: 100%">
        <el-table-column prop="id" label="ID" align="center"/>
        <el-table-column prop="username" label="用户名" align="center"/>
        <el-table-column prop="email" label="邮箱" align="center"/>
        <el-table-column prop="status" label="状态" :formatter="statusFormatter" align="center"/>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
      </el-table>
    </div>
    <div style="padding: 20px 20px;">
      <el-pagination v-model:current-page="pageUserForm.current" v-model:page-size="pageUserForm.size"
                     :page-sizes="[10, 20, 30, 40, 50]" :small=false :disabled=false :background=true
                     layout="total, sizes, prev, pager, next, jumper" :total="userTableData.total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { userPageApi } from '@/api/userApi';
  import { onMounted, reactive } from 'vue';
  import { PageUserReqVO, PageUserRespVO } from '@/api/user/types';

  onMounted(() => {
    loadData();
  })

  /**
   * 响应式分页表格数据对象
   */
  const userTableData: Page<PageUserRespVO> = reactive({
    list: [],
    total: 0
  })

  /**
   * 响应式分页条件查询对象。PageUserReqVO 中配置了 username 和 status 为可选项，因此这里可以不指定
   */
  const pageUserForm: PageUserReqVO = reactive({
    current: 1,
    size: 10
  })

  /**
   * 请求后端分页接口
   */
  const loadData = async () => {
    await userPageApi(pageUserForm).then(res => {
      userTableData.list = res.data.list;
      userTableData.total = res.data.total;
    }).catch(error => { })
  }

  /**
   * 格式化表格中的 status 字段
   */
  const statusFormatter = (row: PageUserRespVO) => {
    if (row.status === 1) {
      return "正常";
    }
    return "锁定";
  }

  /**
   * 分页组件API：改变每页记录数时触发
   */
  const handleSizeChange = (val: number) => {
    pageUserForm.current = 1; // 当改变每页记录数时得回到第一页重新计算
    loadData();
  }
  
  /**
   * 分页组件API：改变当前页数时触发
   */
  const handleCurrentChange = (val: number) => {
    pageUserForm.current = val;
    loadData();
  }
</script>
```

:::