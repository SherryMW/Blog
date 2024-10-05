---
category: IT
article: false
order: 4
---

# 订单模型管理

和之前一样，我们做用户下单的交易模块，优先考虑交易的模型设计，而不是数据库层面的设计

```java
public class OrderModel {

    private String id; // 订单ID 之所以要用 String 类型，是因为这是一个有含义的ID 2024010100001010，例如前面 20240101 是订单的日期，后面是特定编号

    private Integer userId; // 用户ID

    private Integer itemId; // 商品ID

    private BigDecimal itemPrice; // 购买时的商品单价：订单价格一般是商品单价*商品数量，但商品单价是不断变化的，可能今天是10元，明天就15元了，因此订单模型里要冗余出来用户下单购买时的商品单价这个字段

    private Integer amount; // 购买数量

    private BigDecimal orderPrice; // 订单金额

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public BigDecimal getItemPrice() {
        return itemPrice;
    }

    public void setItemPrice(BigDecimal itemPrice) {
        this.itemPrice = itemPrice;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public BigDecimal getOrderPrice() {
        return orderPrice;
    }

    public void setOrderPrice(BigDecimal orderPrice) {
        this.orderPrice = orderPrice;
    }
}
```

订单表【order_info】：

```sql
-- spike.order_info definition

CREATE TABLE `order_info` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单ID',
  `user_id` int NOT NULL DEFAULT '0' COMMENT '用户ID',
  `item_id` int NOT NULL DEFAULT '0' COMMENT '商品ID',
  `item_price` double NOT NULL DEFAULT '0' COMMENT '商品单价',
  `amount` int NOT NULL DEFAULT '0' COMMENT '商品数量',
  `order_price` double DEFAULT '0' COMMENT '订单金额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

其实电商的交易体系是非常复杂的，例如会有合单的支付情况，不同的商品买了不同的件数的情况等等。目前项目只考虑最简单的情况：一张订单购买了一件商品并且支付了一次费用

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
        <table tableName="order_info"  domainObjectName="OrderDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>

    </context>
</generatorConfiguration>
```

对于订单号的生成，我们设计成 16 位，前 8 位为时间信息年月日；中间 6 位为自增序列（如果一天的订单量超过 6 位数，那么就要设计成 8 位数或以上）；最后 2 位为分库表位（00-99）

订单号中间 6 位的自增序列，我们可以创建一张【sequence_info】表来实现：

SEQUENCE 表示可在数组中生成一系列连续数字，例如，1、2、3、4

```sql
-- spike.sequence_info definition

CREATE TABLE `sequence_info` (
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SQL名字',
  `current_value` int NOT NULL DEFAULT '0' COMMENT '当前值',
  `step` int NOT NULL DEFAULT '0' COMMENT '步长',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

初始化【order_info】表的连续数字，默认值是 0，每当从里面获取一次数据的时候，就会加对应的步长 1

```sql
INSERT INTO sequence_info
(name, current_value, step)
VALUES('order_info', 0, 1);
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
        <table tableName="sequence_info"  domainObjectName="SequenceDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>

    </context>
</generatorConfiguration>
```

## 创建订单接口

::: tabs

@tab OrderController

```java
@RestController
@RequestMapping("/order")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class OrderController extends BaseController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @PostMapping(value = "/createorder", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType createOrder(@RequestParam(name = "itemId") Integer itemId, @RequestParam(name = "amount") Integer amount) throws BusinessException {
        // 判断用户是否登录，用户得登录成功之后才可以下单交易
        Boolean isLogin = (Boolean) httpServletRequest.getSession().getAttribute("IS_LOGIN");
        if (isLogin == null || !isLogin.booleanValue()) {
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN);
        }
        // 获取用户的登录信息
        UserVO userVO = (UserVO) httpServletRequest.getSession().getAttribute("LOGIN_USER");
        orderService.createOrder(userVO.getId(), itemId, amount);
        return CommonReturnType.create(null);
    }
}
```

@tab OrderService

```java
public interface OrderService {

    /**
     * 创建订单
     *
     * @param userId 用户ID
     * @param itemId 商品ID
     * @param amount 商品数量
     * @return
     */
    OrderModel createOrder(Integer userId, Integer itemId, Integer amount) throws BusinessException;
}
```

@tab OrderServiceImpl

```java
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private UserService userService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private OrderDOMapper orderDOMapper;

    @Autowired
    private SequenceDOMapper sequenceDOMapper;

    @Override
    @Transactional
    public OrderModel createOrder(Integer userId, Integer itemId, Integer amount) throws BusinessException {
        // 校验下单状态：用户是否合法；下单的商品是否存在；购买的数量是否正确
        UserModel userModel = userService.getUserById(userId);
        if (userModel == null) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "用户信息不存在");
        }
        ItemModel itemModel = itemService.getItemById(itemId);
        if (itemModel == null) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "商品信息不存在");
        }
        if (amount <= 0 || amount > 99) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "商品数量不正确");
        }
        // 下单锁库存
        Boolean result = itemService.decreaseStock(itemId, amount);
        if (!result) {
            throw new BusinessException(EmBusinessError.STOCK_NOT_ENOUGH);
        }
        // 订单入库
        OrderModel orderModel = new OrderModel();
        orderModel.setUserId(userId);
        orderModel.setItemId(itemId);
        orderModel.setAmount(amount);
        orderModel.setItemPrice(itemModel.getPrice());
        orderModel.setOrderPrice(itemModel.getPrice().multiply(new BigDecimal(amount))); // 订单总金额 = 商品单价*商品数量
        /**
         * 生成交易流水号
         * 这里会有一个的问题：因为当前 createOrder 方法打上了 @Transactional，在执行当中出现问题时会进行回滚操作
         * 但此时已经生成过的流水号不应该也同步回滚，因此 generateOrderNo 方法需要打上 @Transactional(propagation = Propagation.REQUIRES_NEW) 表示改方法是重新开启一个新的事务，执行完成后把新的事务给提交上去
         * 最终就算 createOrder 方法事务回滚，但 generateOrderNo 的事务也会提交
         */
        orderModel.setId(generateOrderNo());
        OrderDO orderDO = convertFromOrderModel(orderModel);
        orderDOMapper.insertSelective(orderDO);
        // 新增商品销量
        itemService.increaseSales(itemId, amount);
        return orderModel;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public String generateOrderNo() {
        // 订单号 16 位
        StringBuilder stringBuilder = new StringBuilder();
        // 前 8 位为时间信息年月日
        LocalDateTime now = LocalDateTime.now();
        String nowDate = now.format(DateTimeFormatter.ISO_DATE).replace("-", "");
        stringBuilder.append(nowDate);
        // 中间 6 位为自增序列（如果一天的订单量超过 6 位数，那么就要设计成 8 位数或以上）
        // 获取当前 sequence
        int sequence = 0;
        /**
         * 这里的查询语句使用 for update 语句的锁定机制
         * 当使用 for update 时，这个查询会在数据库中锁定返回的记录，直到事务提交或者回滚
         * 这样做是为了确保查询到的数据在事务期间不被其他事务修改
         */
        SequenceDO sequenceDO = sequenceDOMapper.getSequenceByName("order_info");
        sequence = sequenceDO.getCurrentValue();
        sequenceDO.setCurrentValue(sequence + sequenceDO.getStep());
        sequenceDOMapper.updateByPrimaryKeySelective(sequenceDO);
        // 把 sequence 拼接成 6 位数
        String sequenceStr = String.valueOf(sequence);
        for (int i = 0; i < 6 - sequenceStr.length(); i++) { // 6 - sequenceStr.length() 知道当前还缺几位
            stringBuilder.append(0); // 不足的位数用 0 填充
        }
        stringBuilder.append(sequenceStr);
        // 最后 2 位为分库表位（00-99）
        stringBuilder.append("00"); // 目前不考虑分库分表
        return stringBuilder.toString();
    }

    private OrderDO convertFromOrderModel(OrderModel orderModel) {
        if (orderModel == null) {
            return null;
        }
        OrderDO orderDO = new OrderDO();
        BeanUtils.copyProperties(orderModel, orderDO);
        orderDO.setItemPrice(orderModel.getItemPrice().doubleValue());
        orderDO.setOrderPrice(orderModel.getOrderPrice().doubleValue());
        return orderDO;
    }
}
```

@tab ItemService

```java
public interface ItemService {

    /**
     * 商品库存扣减
     *
     * @param itemId 商品ID
     * @param amount 商品数量
     * @return
     */
    Boolean decreaseStock(Integer itemId, Integer amount) throws BusinessException;

    /**
     * 商品销量增加
     *
     * @param itemId 商品ID
     * @param amount 商品数量
     */
    void increaseSales(Integer itemId, Integer amount) throws BusinessException;
}
```

@tab ItemServiceImpl

```java
@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemDOMapper itemDOMapper;

    @Autowired
    private ItemStockDOMapper itemStockDOMapper;

    @Override
    @Transactional
    public Boolean decreaseStock(Integer itemId, Integer amount) throws BusinessException {
        int affectedRow = itemStockDOMapper.decreaseStock(itemId, amount);
        if (affectedRow > 0) { // 判断影响条目数
            return true; // 扣减库存成功
        }
        return false;
    }

    @Override
    @Transactional
    public void increaseSales(Integer itemId, Integer amount) throws BusinessException {
        itemDOMapper.increaseSales(itemId, amount);
    }
}
```

@tab ItemStockDOMapper

```java
public interface ItemStockDOMapper {
    
    int decreaseStock(@Param("itemId") Integer itemId, @Param("amount") Integer amount);
}
```

```xml
<update id="decreaseStock">
    update item_stock
    set stock = stock - #{amount}
    where item_id = #{itemId} and stock >= #{amount}
</update>
```

@tab ItemDOMapper

```java
public interface ItemDOMapper {

    void increaseSales(@Param("id") Integer id, @Param("amount") Integer amount);
}
```

```xml
<update id="increaseSales">
    update item
    set sales = sales + #{amount}
    where id = #{id,jdbcType=INTEGER}
</update>
```

@tab SequenceDOMapper

```java
public interface SequenceDOMapper {

    SequenceDO getSequenceByName(@Param("name") String name);
}
```

这里的查询语句使用 `for update` 语句的锁定机制

使用 `for update` 时，这个查询会在数据库中锁定返回的记录，直到事务提交或者回滚

这样做是为了确保查询到的数据在事务期间不被其他事务修改

```xml
<select id="getSequenceByName" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List"/>
    from sequence_info
    where name = #{name,jdbcType=VARCHAR} for update
</select>
```

:::

## 用户下单界面

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
            <div id="normalPriceContainer" class="form-group">
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
            <div class="form-actions">
                <button class="btn blue" id="createorder" type="submit">
                    下单
                </button>
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
            $("#createorder").on("click", function () {
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: "http://localhost:8090/order/createorder",
                    data: {
                        "itemId": g_itemVO.id,
                        "amount": 1,
                        "promoId": g_itemVO.promoId
                    },
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (data.status == "success") {
                            alert("下单成功");
                            window.location.reload();
                        } else {
                            alert("下单失败，原因为" + data.data.errMsg);
                            if (data.data.errCode == 20003) { // 用户未登录
                                window.location.href = "login.html";
                            }
                        }
                    },
                    error: function (data) {
                        alert("下单失败，原因为" + data.responseText);
                    }
                });
            });
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