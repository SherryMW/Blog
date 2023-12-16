---
category: IT
article: false
---

# 分页查询

不管是商品的分页还是说订单的分页，前端只需要传递给后端两个字段就可以实现分页，因此通用的字段可以考虑封装起来：

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class BasePage {

    @ApiModelProperty("每页显示条目个数")
    private Integer size;

    @ApiModelProperty("当前页数")
    private Integer current;
}
```

统一分页响应数据实体类，因为定义的是泛型，因此不管是商品分页数据，还是说订单分页数据都可以接收：

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
public class PageResult<T> {

    @ApiModelProperty("分页数据")
    private List<T> list;

    @ApiModelProperty("分页总条目数")
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

下面举例用户信息分页条件查询：

::: tabs

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

后端响应给前端的分页数据

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

@tab SysUserMapper.java

```java
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.mw.entity.SysUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mw.vo.req.PageUserReqVO;
import com.mw.vo.resp.PageUserRespVO;
import org.apache.ibatis.annotations.Param;

public interface SysUserMapper extends BaseMapper<SysUser> {

    IPage<PageUserRespVO> selectPageUser(IPage<?> page, @Param("vo") PageUserReqVO vo);
}
```

`IPage` 是 MyBatis-Plus 框架中的分页查询结果的封装接口。`IPage` 包含了查询到的数据列表以及分页的相关信息。在这里，`selectPageUser` 方法声明返回类型为 `IPage<PageUserRespVO>`，表示这个方法用于分页查询，并且返回的数据是 `PageUserRespVO` 类型的

参数 `IPage<?> page`：代表分页的相关信息，包括页码、每页数量等。`IPage<?>` 是一个泛型接口，具体类型会在运行时确定。通过传递 `IPage` 对象，MyBatis-Plus 能够获取当前页码、每页数量等信息，以便在 SQL 语句中生成对应的分页查询语句

参数 `@Param("vo") PageUserReqVO vo`：使用 `@Param` 注解给参数取了一个别名 "vo"，表示这是一个用于查询的参数对象。`PageUserReqVO` 是一个用户查询请求的值对象，用于传递查询条件

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

响应结果：

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

前端参考代码：

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

@tab src/api/user/type.ts

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
import { PageUserReqVO, PageUserRespVO } from "@/interface/user";
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
      <el-form :inline="true" :model="pageUserReqVo">
        <el-form-item label="账号">
          <el-input v-model="pageUserReqVo.username" placeholder="请输入账号" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="pageUserReqVo.status" placeholder="请选择状态" clearable>
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
      <el-pagination v-model:current-page="pageUserReqVo.current" v-model:page-size="pageUserReqVo.size"
                     :page-sizes="[10, 20, 30, 40, 50]" :small=false :disabled=false :background=true
                     layout="total, sizes, prev, pager, next, jumper" :total="userTableData.total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { userPageApi } from '@/api/userApi';
  import { onMounted, reactive } from 'vue';
  import { PageUserReqVO, PageUserRespVO } from '@/interface/user';
  import { Page } from '@/interface/base';

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
  const pageUserReqVo: PageUserReqVO = reactive({
    size: 10,
    current: 1
  })

  /**
   * 请求后端分页接口
   */
  const loadData = async () => {
    await userPageApi(pageUserReqVo).then(res => {
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
   * 分页组件API：改变每页显示条目个数时触发
   */
  const handleSizeChange = (val: number) => {
    pageUserReqVo.current = 1; // 当改变每页显示条目个数时得回到第一页重新计算
    loadData();
  }
  
  /**
   * 分页组件API：改变当前页数时触发
   */
  const handleCurrentChange = (val: number) => {
    pageUserReqVo.current = val;
    loadData();
  }
</script>
```

:::