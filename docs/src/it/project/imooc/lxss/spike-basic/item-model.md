---
category: IT
article: false
order: 3
---

# 商品模型管理

我们需要先设计商品模型：

```java
public class ItemModel {

    private Integer id; // 商品ID

    private String title; // 商品名称

    private BigDecimal price; // 商品价格

    private Integer stock; // 商品库存

    private Integer sales; // 商品销量

    private String description; // 商品描述

    private String imgUrl; // 商品描述图片URL

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
}
```

商品库存跟商品的确是一对一的关系，但是我们考虑到后面商品库存是跟交易流水相关的。每次对商品表的操作，其实就是对库存表的操作。因此库存字段应该和用户密码一样放在另外一张表里面

商品销量也是一样的问题，当交易行为发生之后产生的一个计数的累加，因此正常来说商品销量字段是放在另外一张数据表里独立求和。目前暂时把该字段放在商品表里，当用户发生交易行为时，通过异步的方式给对应的商品销量进行累加操作，而不去影响下单主链路

商品表【item】：

```sql
-- spike.item definition

CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品名称',
  `price` double DEFAULT '0' COMMENT '商品价格',
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品描述',
  `sales` int NOT NULL DEFAULT '0' COMMENT '商品销量',
  `img_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品描述图片URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

商品库存表【item_stock】：

```sql
-- spike.item_stock definition

CREATE TABLE `item_stock` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `stock` int NOT NULL DEFAULT '0' COMMENT '商品库存',
  `item_id` int NOT NULL DEFAULT '0' COMMENT '商品ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

接着我们使用代码生成器 mybatis-generator 来生成对应的文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>

    <context id="DB2Tables" targetRuntime="MyBatis3">
        <!--数据库链接地址账号密码-->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver" connectionURL="jdbc:mysql://127.0.0.1:3306/spike" userId="root" password="root"></jdbcConnection>
        <!--生成DataObject类存放位置-->
        <javaModelGenerator targetPackage="com.mw.dataobject" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>
        <!--生成映射文件存放位置-->
        <sqlMapGenerator targetPackage="mapping" targetProject="src/main/resources">
            <property name="enableSubPackages" value="true"/>
        </sqlMapGenerator>
        <!--生成Dao类存放位置-->
        <!--
        客户端代码，生成易于使用的针对Model对象和XML配置文件的代码
        type="ANNOTATEDMAPPER",生成Java Model和基于注解的Mapper对象
        type="MIXEDMAPPER",生成基于注解的Java Model和相应的Mapper对象
        type="XMLMAPPER",生成SQLMap XML文件和独立的Mapper接口
        -->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.mw.dao" targetProject="src/main/java">
            <property name="enableSubPackages" value="true"/>
        </javaClientGenerator>

        <!--生成对应表及类名-->
        <table tableName="item"  domainObjectName="ItemDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
        <table tableName="item_stock"  domainObjectName="ItemStockDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>

    </context>
</generatorConfiguration>
```

## 创建商品接口

::: tabs

@tab ItemController

```java
@RestController
@RequestMapping("/item")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class ItemController extends BaseController {

    @Autowired
    private ItemService itemService;

    /**
     * 创建商品
     * @param title 商品名称
     * @param price 商品价格
     * @param stock 商品库存
     * @param description 商品描述
     * @param imgUrl 商品描述图片URL
     * @return
     * @throws BusinessException
     */
    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType createItem(@RequestParam(name = "title") String title,
                                       @RequestParam(name = "price") BigDecimal price,
                                       @RequestParam(name = "stock") Integer stock,
                                       @RequestParam(name = "description") String description,
                                       @RequestParam(name = "imgUrl") String imgUrl) throws BusinessException {
        // 封装 service 请求用来创建商品
        ItemModel itemModel = new ItemModel();
        itemModel.setTitle(title);
        itemModel.setDescription(description);
        itemModel.setPrice(price);
        itemModel.setStock(stock);
        itemModel.setImgUrl(imgUrl);
        ItemModel item = itemService.createItem(itemModel);
        ItemVO itemVO = convertVOFromModel(item);
        return CommonReturnType.create(itemVO);
    }

    private ItemVO convertVOFromModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemVO itemVO = new ItemVO();
        BeanUtils.copyProperties(itemModel, itemVO);
        return itemVO;
    }
}
```

@tab ItemVO

```java
public class ItemVO {

    private Integer id; // 商品ID

    private String title; // 商品名称

    private BigDecimal price; // 商品价格

    private Integer stock; // 商品库存

    private Integer sales; // 商品销量

    private String description; // 商品描述

    private String imgUrl; // 商品描述图片URL

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
}
```

@tab ItemService

```java
public interface ItemService {

    /**
     * 创建商品
     *
     * @param itemModel
     * @return
     */
    ItemModel createItem(ItemModel itemModel) throws BusinessException;

    /**
     * 商品详情浏览
     *
     * @param id 商品ID
     * @return
     */
    ItemModel getItemById(Integer id);
}
```

@tab ItemServiceImpl

```java
@Service
public class ItemServiceImpl implements ItemService {
    
    @Autowired
    private ValidatorImpl validator;

    @Autowired
    private ItemDOMapper itemDOMapper;

    @Autowired
    private ItemStockDOMapper itemStockDOMapper;

    @Override
    @Transactional
    public ItemModel createItem(ItemModel itemModel) throws BusinessException {
        // 校验入参
        ValidationResult result = validator.validate(itemModel);
        if (result.isHasErrors()) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, result.getErrMsg());
        }
        // 转化 itemModel -> dataObject
        ItemDO itemDO = convertItemDOFromItemModel(itemModel);
        // 写入数据库
        itemDOMapper.insertSelective(itemDO);
        itemModel.setId(itemDO.getId());
        ItemStockDO itemStockDO = convertItemStockDOFromItemModel(itemModel);
        itemStockDOMapper.insertSelective(itemStockDO);
        // 返回创建完成的对象
        return getItemById(itemModel.getId());
    }

    @Override
    public ItemModel getItemById(Integer id) {
        ItemDO itemDO = itemDOMapper.selectByPrimaryKey(id);
        if (itemDO == null) {
            return null;
        }
        // 操作获得库存数量
        ItemStockDO itemStockDO = itemStockDOMapper.selectByItemId(itemDO.getId());
        // 将 dataObject -> dataModel
        ItemModel itemModel = convertModelFromDataObject(itemDO, itemStockDO);
        return itemModel;
    }

    private ItemDO convertItemDOFromItemModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemDO itemDO = new ItemDO();
        BeanUtils.copyProperties(itemModel, itemDO);
        itemDO.setPrice(itemModel.getPrice().doubleValue());
        return itemDO;
    }

    private ItemStockDO convertItemStockDOFromItemModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemStockDO itemStockDO = new ItemStockDO();
        itemStockDO.setStock(itemModel.getStock());
        itemStockDO.setItemId(itemModel.getId());
        return itemStockDO;
    }

    private ItemModel convertModelFromDataObject(ItemDO itemDO, ItemStockDO itemStockDO) {
        ItemModel itemModel = new ItemModel();
        BeanUtils.copyProperties(itemDO, itemModel);
        // double 传递到前端会有一个精度问题，例如 1.9 会变成 1.999999999
        itemModel.setPrice(new BigDecimal(itemDO.getPrice()));
        itemModel.setStock(itemStockDO.getStock());
        return itemModel;
    }
}
```

@tab ItemDOMapper

```java
public interface ItemDOMapper {

    int insertSelective(ItemDO record);
}
```

```xml
<insert id="insertSelective" parameterType="com.mw.dataobject.ItemDO" keyProperty="id" useGeneratedKeys="true">
    insert into item
    <trim prefix="(" suffix=")" suffixOverrides=",">
        <if test="id != null">
            id,
        </if>
        <if test="title != null">
            title,
        </if>
        <if test="price != null">
            price,
        </if>
        <if test="description != null">
            description,
        </if>
        <if test="sales != null">
            sales,
        </if>
        <if test="imgUrl != null">
            img_url,
        </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
        <if test="id != null">
            #{id,jdbcType=INTEGER},
        </if>
        <if test="title != null">
            #{title,jdbcType=VARCHAR},
        </if>
        <if test="price != null">
            #{price,jdbcType=DECIMAL},
        </if>
        <if test="description != null">
            #{description,jdbcType=VARCHAR},
        </if>
        <if test="sales != null">
            #{sales,jdbcType=INTEGER},
        </if>
        <if test="imgUrl != null">
            #{imgUrl,jdbcType=VARCHAR},
        </if>
    </trim>
</insert>
```

@tab ItemStockDOMapper

```java
public interface ItemStockDOMapper {

    int insertSelective(ItemStockDO record);
}
```

```xml
<insert id="insertSelective" parameterType="com.mw.dataobject.ItemStockDO" keyProperty="id" useGeneratedKeys="true">
        insert into item_stock
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="id != null">
                id,
            </if>
            <if test="stock != null">
                stock,
            </if>
            <if test="itemId != null">
                item_id,
            </if>
        </trim>
        <trim prefix="values (" suffix=")" suffixOverrides=",">
            <if test="id != null">
                #{id,jdbcType=INTEGER},
            </if>
            <if test="stock != null">
                #{stock,jdbcType=INTEGER},
            </if>
            <if test="itemId != null">
                #{itemId,jdbcType=INTEGER},
            </if>
        </trim>
    </insert>
```

@tab ItemModel

```java
public class ItemModel {

    private Integer id; // 商品ID

    @NotBlank(message = "商品名称不能为空")
    private String title; // 商品名称

    @NotNull(message = "商品价格不能为空")
    @Min(value = 0, message = "商品价格必须大于0")
    private BigDecimal price; // 商品价格

    @NotNull(message = "库存不能为空")
    private Integer stock; // 商品库存

    private Integer sales; // 商品销量

    @NotNull(message = "商品描述信息不能为空")
    private String description; // 商品描述

    @NotNull(message = "商品描述图片不能为空")
    private String imgUrl; // 商品描述图片URL

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getSales() {
        return sales;
    }

    public void setSales(Integer sales) {
        this.sales = sales;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }
}
```

:::

测试地址：

localhost:8090/item/create?title=iphone16ProMax&price=11999.0&stock=100&description=xxx&imgUrl=https://th.bing.com/th?id=OCBZA.BDF7D0D6DCC39BF67FAF19B397010E6C7EAABE009CB833290A23BF82A5D799F3A%26pid=BZA%26rs=0

## 创建商品界面实现

createitem.html

```html
<html>
    <head>
        <meta charset="UTF-8">
        <link href="static/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/global/css/components.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/admin/pages/css/login.css" rel="stylesheet" type="text/css"/>
        <script src="static/assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>
    </head>

    <body class="login">
        <div class="content">
            <h3 class="form-title">创建商品</h3>
            <div class="form-group">
                <label class="control-label">商品名</label>
                <div>
                    <input class="form-control" type="text" name="title" id="title"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">商品描述</label>
                <div>
                    <input class="form-control" type="text" name="description" id="description"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">价格</label>
                <div>
                    <input class="form-control" type="text" name="price" id="price"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">图片</label>
                <div>
                    <input class="form-control" type="text" name="imgUrl" id="imgUrl"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">库存</label>
                <div>
                    <input class="form-control" type="text" name="stock" id="stock"/>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn blue" id="create" type="submit">
                    创建提交
                </button>
            </div>
        </div>
    </body>

    <script>
        jQuery(document).ready(function () {
            //绑定otp的click时间用于向后端发送获取手机验证码的请求
            $("#create").on("click", function () {
                var title = $("#title").val();
                var description = $("#description").val();
                var imgUrl = $("#imgUrl").val();
                var price = $("#price").val();
                var stock = $("#stock").val();
                if (title == null || title == "") {
                    alert("商品名不能为空");
                    return false;
                }
                if (description == null || description == "") {
                    alert("描述不能为空");
                    return false;
                }
                if (imgUrl == null || imgUrl == "") {
                    alert("图片url不能为空");
                    return false;
                }
                if (price == null || price == "") {
                    alert("价格不能为空");
                    return false;
                }
                if (stock == null || stock == "") {
                    alert("库存不能为空");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: "http://localhost:8090/item/create",
                    data: {
                        "title": title,
                        "description": description,
                        "imgUrl": imgUrl,
                        "price": price,
                        "stock": stock,
                        "name": name
                    },
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (data.status == "success") {
                            alert("创建成功");
                        } else {
                            alert("创建失败，原因为" + data.data.errMsg);
                        }
                    },
                    error: function (data) {
                        alert("创建失败，原因为" + data.responseText);
                    }
                });
                return false;
            });
        });
    </script>
</html>
```

## 商品详情接口

```java
@RestController
@RequestMapping("/item")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class ItemController extends BaseController {

    @Autowired
    private ItemService itemService;

    /**
     * 商品详情页
     *
     * @param id 商品ID
     * @return
     */
    @GetMapping(value = "/get")
    public CommonReturnType getItem(@RequestParam(name = "id") Integer id) {
        ItemModel itemModel = itemService.getItemById(id);
        ItemVO itemVO = convertVOFromModel(itemModel);
        return CommonReturnType.create(itemVO);
    }

    private ItemVO convertVOFromModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemVO itemVO = new ItemVO();
        BeanUtils.copyProperties(itemModel, itemVO);
        return itemVO;
    }
    
}
```

测试地址：

localhost:8090/item/get?id=1

## 商品列表接口

```java
@RestController
@RequestMapping("/item")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class ItemController extends BaseController {

    @Autowired
    private ItemService itemService;

    /**
     * 商品列表页面浏览
     *
     * @return
     */
    @GetMapping(value = "/list")
    public CommonReturnType listItem() {
        List<ItemModel> itemModelList = itemService.listItem();
        List<ItemVO> itemVOList = itemModelList.stream().map(itemModel -> {
            ItemVO itemVO = convertVOFromModel(itemModel);
            return itemVO;
        }).collect(Collectors.toList());
        return CommonReturnType.create(itemVOList);
    }

    private ItemVO convertVOFromModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemVO itemVO = new ItemVO();
        BeanUtils.copyProperties(itemModel, itemVO);
        return itemVO;
    }
}
```

测试地址：

localhost:8090/item/list

## 商品列表页实现

listitem.html

```html
<html>
    <head>
        <meta charset="UTF-8">
        <link href="static/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/global/css/components.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/admin/pages/css/login.css" rel="stylesheet" type="text/css"/>
        <script src="static/assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>
    </head>
    <body>
        <div class="content">
            <h3 class="form-title">商品列表浏览</h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>商品名</th>
                            <th>商品图片</th>
                            <th>商品描述</th>
                            <th>商品价格</th>
                            <th>商品库存</th>
                            <th>商品销量</th>
                        </tr>
                    </thead>
                    <tbody id="container">

                    </tbody>
                </table>
            </div>
        </div>
    </body>

    <script>
        // 定义全局商品数组信息
        var g_itemList = [];
        jQuery(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:8090/item/list",
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if (data.status == "success") {
                        g_itemList = data.data;
                        reloadDom();
                    } else {
                        alert("获取商品信息失败，原因为" + data.data.errMsg);
                    }
                },
                error: function (data) {
                    alert("获取商品信息失败失败，原因为" + data.responseText);
                }
            });
        });

        function reloadDom() {
            for (var i = 0; i < g_itemList.length; i++) {
                var itemVO = g_itemList[i];
                var dom = "<tr data-id='" + itemVO.id + "' id='itemDetail" + itemVO.id + "'><td>" + itemVO.title + "</td><td><img style='width: 200px;height: auto' src='" + itemVO.imgUrl + "'/></td><td>" + itemVO.description + "</td><td>" + itemVO.price + "</td><td>" + itemVO.stock + "</td><td>" + itemVO.sales + "</td></tr>";
                $("#container").append($(dom));
                $("#itemDetail" + itemVO.id).on("click", function (e) {
                    window.location.href = "getitem.html?id=" + $(this).data("id");
                });
            }
        }
    </script>
</html>
```

## 商品详情页实现

getitem.html

```html
<html>
    <head>
        <meta charset="UTF-8">
        <link href="static/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/global/css/components.css" rel="stylesheet" type="text/css"/>
        <link href="static/assets/admin/pages/css/login.css" rel="stylesheet" type="text/css"/>
        <script src="static/assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>
    </head>

    <body class="login">
        <div class="content">
            <h3 class="form-title">商品详情</h3>
            <div class="form-group">
                <div>
                    <label class="control-label" id="title"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">商品描述</label>
                <div>
                    <label class="control-label" id="description"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">价格</label>
                <div>
                    <label class="control-label" id="price"/>
                </div>
            </div>
            <div class="form-group">
                <div>
                    <img style="width:200px;height:auto" id="imgUrl"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">库存</label>
                <div>
                    <label class="control-label" id="stock"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">销量</label>
                <div>
                    <label class="control-label" id="sales"/>
                </div>
            </div>
        </div>
    </body>

    <script>
        function getParam(paramName) {
            paramValue = "", isFound = !1;
            if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
                arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
                while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
            }
            return paramValue == "" && (paramValue = null), paramValue
        }

        var g_itemVO = {};
        jQuery(document).ready(function () {
            //获取商品详情
            $.ajax({
                type: "GET",
                url: "http://localhost:8090/item/get",
                data: {
                    "id": getParam("id"),
                },
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if (data.status == "success") {
                        g_itemVO = data.data;
                        reloadDom();
                        setInterval(reloadDom, 1000);
                    } else {
                        alert("获取信息失败，原因为" + data.data.errMsg);
                    }
                },
                error: function (data) {
                    alert("获取信息失败，原因为" + data.responseText);
                }
            });
        });

        function reloadDom() {
            $("#title").text(g_itemVO.title);
            $("#description").text(g_itemVO.description);
            $("#stock").text(g_itemVO.stock);
            $("#price").text(g_itemVO.price);
            $("#imgUrl").attr("src", g_itemVO.imgUrl);
            $("#sales").text(g_itemVO.sales);
        }
    </script>
</html>
```