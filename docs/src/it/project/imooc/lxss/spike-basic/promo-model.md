---
category: IT
article: false
order: 5
---

# 秒杀模型管理

优先考虑秒杀的模型设计，而不是数据库层面的设计

```java
import org.joda.time.DateTime;

public class PromoModel {

    private Integer id; // 秒杀活动ID

    private String promoName; // 秒杀活动名称

    private Integer status; // 秒杀活动状态 1：未开始；2：进行中；3：已结束

    private DateTime startDate; // 秒杀活动的开始时间

    private DateTime endDate; // 秒杀活动的结束时间

    private Integer itemId; // 秒杀活动的适用商品（本项目为了简单起见，同一个秒杀活动只能适用一个商品）

    private BigDecimal promoItemPrice; // 秒杀活动的商品价格

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPromoName() {
        return promoName;
    }

    public void setPromoName(String promoName) {
        this.promoName = promoName;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public DateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(DateTime startDate) {
        this.startDate = startDate;
    }

    public DateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(DateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public BigDecimal getPromoItemPrice() {
        return promoItemPrice;
    }

    public void setPromoItemPrice(BigDecimal promoItemPrice) {
        this.promoItemPrice = promoItemPrice;
    }
}
```

```xml
<dependency>
    <groupId>joda-time</groupId>
    <artifactId>joda-time</artifactId>
    <version>2.9.9</version>
</dependency>
```

```sql
-- spike.promo definition

CREATE TABLE `promo` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `promo_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '秒杀名称',
  `start_date` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '开始时间',
  `end_date` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '结束时间',
  `item_id` int NOT NULL DEFAULT '0' COMMENT '商品ID',
  `promo_item_price` double NOT NULL DEFAULT '0' COMMENT '秒杀价格',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

```sql
INSERT INTO promo
(id, promo_name, start_date, end_date, item_id, promo_item_price)
VALUES(1, '手机抢购活动', '2020-01-01 23:59:59', '2020-02-01 00:00:00', 1, 9000.0);
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
        <table tableName="promo"  domainObjectName="PromoDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
    </context>
</generatorConfiguration>
```

## 秒杀活动信息接口

::: tabs

@tab PromoService

```java
public interface PromoService {

    /**
     * 根据商品ID获取即将进行或正在进行的秒杀活动
     *
     * @param itemId 商品ID
     * @return
     */
    PromoModel getPromoByItemId(Integer itemId);
}
```

@tab PromoServiceImpl

```java
@Service
public class PromoServiceImpl implements PromoService {

    @Autowired
    private PromoDOMapper promoDOMapper;

    @Override
    public PromoModel getPromoByItemId(Integer itemId) {
        // 获取对应商品的秒杀活动信息
        PromoDO promoDO = promoDOMapper.selectByItemId(itemId);
        // dataObject -> model
        PromoModel promoModel = convertFromDataObject(promoDO);
        if (promoModel == null) {
            return null;
        }
        // 判断当前时间是否秒杀活动即将开始或正在进行
        if (promoModel.getStartDate().isAfterNow()) { // 活动开始时间在当前时间之后
            promoModel.setStatus(1); // 活动未开始
        } else if (promoModel.getEndDate().isBeforeNow()) { // 活动结束时间在当前时间之前
            promoModel.setStatus(3); // 活动已结束
        } else {
            promoModel.setStatus(2); // 活动进行中
        }
        return promoModel;
    }

    private PromoModel convertFromDataObject(PromoDO promoDO) {
        if (promoDO == null) {
            return null;
        }
        PromoModel promoModel = new PromoModel();
        BeanUtils.copyProperties(promoDO, promoModel);
        promoModel.setPromoItemPrice(new BigDecimal(promoDO.getPromoItemPrice()));
        promoModel.setStartDate(new DateTime(promoDO.getStartDate()));
        promoModel.setEndDate(new DateTime(promoDO.getEndDate()));
        return promoModel;
    }
}
```

@tab PromoDOMapper

```java
public interface PromoDOMapper {

    PromoDO selectByItemId(@Param("itemId") Integer itemId);
}
```

```xml
<select id="selectByItemId" parameterType="java.lang.Integer" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List"/>
    from promo
    where item_id = #{itemId,jdbcType=INTEGER}
</select>
```

@tab ItemModel

```java {23}
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

    private PromoModel promoModel; // 使用聚合模型，如果 promoModel 不为空，则表示其拥有还未结束的秒杀活动

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

    public PromoModel getPromoModel() {
        return promoModel;
    }

    public void setPromoModel(PromoModel promoModel) {
        this.promoModel = promoModel;
    }
}
```

@tab ItemController

```java {12-20}
@RestController
@RequestMapping("/item")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class ItemController {

    private ItemVO convertVOFromModel(ItemModel itemModel) {
        if (itemModel == null) {
            return null;
        }
        ItemVO itemVO = new ItemVO();
        BeanUtils.copyProperties(itemModel, itemVO);
        if (itemModel.getPromoModel() != null){
            // 该商品有正在进行或即将进行的秒杀活动
            itemVO.setPromoId(itemModel.getPromoModel().getId());
            itemVO.setPromoStatus(itemModel.getPromoModel().getStatus());
            itemVO.setPromoPrice(itemModel.getPromoModel().getPromoItemPrice());
            itemVO.setStartDate(itemModel.getPromoModel().getStartDate().toString(DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss")));
        }else{
            itemVO.setPromoStatus(0); // 该商品没有秒杀活动
        }
        return itemVO;
    }
}
```

@tab ItemServiceImpl

```java {24-27}
@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemDOMapper itemDOMapper;

    @Autowired
    private ItemStockDOMapper itemStockDOMapper;

    @Autowired
    private PromoService promoService;
    
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
        // 获取活动商品信息，查看该商品是否存在于秒杀活动内
        PromoModel promoModel = promoService.getPromoByItemId(id);
        if (promoModel != null && promoModel.getStatus().intValue() != 3) { // 该商品存在于秒杀活动内，且秒杀活动未结束（未开始或进行中）
            itemModel.setPromoModel(promoModel);
        }
        return itemModel;
    }
}
```

@tab ItemVO

```java {17-23}
public class ItemVO {

    private Integer id; // 商品ID

    private String title; // 商品名称

    private BigDecimal price; // 商品价格

    private Integer stock; // 商品库存

    private Integer sales; // 商品销量

    private String description; // 商品描述

    private String imgUrl; // 商品描述图片URL

    private Integer promoId; // 秒杀活动ID

    private Integer promoStatus; // 商品是否在秒杀活动中 0：没有秒杀活动；1：秒杀活动未开始；2：秒杀活动进行中

    private BigDecimal promoPrice; // 秒杀活动价格

    private String startDate; // 秒杀活动开始时间

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

    public Integer getPromoId() {
        return promoId;
    }

    public void setPromoId(Integer promoId) {
        this.promoId = promoId;
    }

    public Integer getPromoStatus() {
        return promoStatus;
    }

    public void setPromoStatus(Integer promoStatus) {
        this.promoStatus = promoStatus;
    }

    public BigDecimal getPromoPrice() {
        return promoPrice;
    }

    public void setPromoPrice(BigDecimal promoPrice) {
        this.promoPrice = promoPrice;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }
}
```

:::

## 下单接口改造

下单模型新增 promoId 字段：

```java {9}
public class OrderModel {

    private String id; // 订单ID 之所以要用 String 类型，是因为这是一个有含义的ID 2024010100001010，例如前面 20240101 是订单的日期，后面是特定编号

    private Integer userId; // 用户ID

    private Integer itemId; // 商品ID

    private Integer promoId; // 若非空，则表示以秒杀商品方式下单

    /**
     * 购买时的商品单价：订单价格一般是商品单价*商品数量，但商品单价是不断变化的，可能今天是10元，明天就15元了
     * 因此订单模型里要冗余出来用户下单购买时的商品单价这个字段
     * 若 promoId 非空，则表示秒杀商品价格
     */
    private BigDecimal itemPrice;

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

    public Integer getPromoId() {
        return promoId;
    }

    public void setPromoId(Integer promoId) {
        this.promoId = promoId;
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

```sql
ALTER TABLE spike.order_info ADD promo_id int DEFAULT 0 NOT NULL COMMENT '秒杀活动ID';
```

对应的 OrderDO 和 OrderDOMapper 也要同步新增对应字段

兼容秒杀订单创建的实现方式：

- 通过前端 URL 上传递过来秒杀活动 ID，下单接口内校验对应秒杀活动 ID 是否属于对应商品且秒杀活动是进行中的状态

- 直接在下单接口内判断对应的商品是否存在秒杀活动内，若存在进行中的则以秒杀价格下单

上述两种方案我们更推荐第一种，因为我们要考虑业务模型的可扩展性：

- 对应的一个商品可能同时存在多个秒杀活动内。因此我们需要依赖用户的下单访问路径

- 如果选择第二种方式，那么任何平销商品的下单我们也要在下单接口里去查询一次秒杀活动模型的信息

::: tabs

@tab OrderController

```java {14,23}
@RestController
@RequestMapping("/order")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @PostMapping(value = "/createorder", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType createOrder(@RequestParam(name = "itemId") Integer itemId,
                                        @RequestParam(name = "promoId", required = false) Integer promoId,
                                        @RequestParam(name = "amount") Integer amount) throws BusinessException {
        // 判断用户是否登录，用户得登录成功之后才可以下单交易
        Boolean isLogin = (Boolean) httpServletRequest.getSession().getAttribute("IS_LOGIN");
        if (isLogin == null || !isLogin.booleanValue()) {
            throw new BusinessException(EmBusinessError.USER_NOT_LOGIN);
        }
        // 获取用户的登录信息
        UserVO userVO = (UserVO) httpServletRequest.getSession().getAttribute("LOGIN_USER");
        orderService.createOrder(userVO.getId(), itemId, promoId, amount);
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
     * @param userId  用户ID
     * @param itemId  商品ID
     * @param promoId 秒杀活动ID
     * @param amount  商品数量
     * @return
     */
    OrderModel createOrder(Integer userId, Integer itemId, Integer promoId, Integer amount) throws BusinessException;
}
```

@tab OrderServiceImpl

```java {32-38,50-55}
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
    public OrderModel createOrder(Integer userId, Integer itemId, Integer promoId, Integer amount) throws BusinessException {
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
        // 校验秒杀活动信息
        if (promoId != null) {
            if (promoId.intValue() != itemModel.getPromoModel().getId()) { // 校验对应活动是否存在这个适用商品
                throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "活动信息不正确");
            } else if (itemModel.getPromoModel().getStatus() != 2) { // 校验活动是否正在进行中
                throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "活动还未开始");
            }
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
        orderModel.setPromoId(promoId);
        if (promoId != null) {
            orderModel.setItemPrice(itemModel.getPromoModel().getPromoItemPrice());
        } else {
            orderModel.setItemPrice(itemModel.getPrice());
        }
        orderModel.setOrderPrice(orderModel.getItemPrice().multiply(new BigDecimal(amount))); // 订单总金额 = 商品单价*商品数量
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

:::

## 商品详情页改造

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
            <div id="promoStartDateContainer" class="form-group">
                <label id="promoStatus" class="control-label"></label>
                <div>
                    <label style="color:red" class="control-label" id="promoStartDate"/>
                </div>
            </div>
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
            <div id="promoPriceContainer" class="form-group">
                <label style="color:red" class="control-label">秒杀价格</label>
                <div>
                    <label style="color:red" class="control-label" id="promoPrice"/>
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
            if (g_itemVO.promoStatus == 0) { // 秒杀活动不存在
                $("#promoPriceContainer").hide();
            } else if (g_itemVO.promoStatus == 1) { // 秒杀活动还未开始
                var startTime = g_itemVO.startDate.replace(new RegExp("-", "gm"), "/");
                startTime = (new Date(startTime)).getTime();
                var nowTime = Date.parse(new Date());
                var delta = (startTime - nowTime) / 1000;
                if (delta <= 0) { // 秒杀活动开始了
                    g_itemVO.promoStatus = 2;
                    reloadDom();
                }
                $("#promoStartDate").text("秒杀活动将于： " + g_itemVO.startDate + " 开始售卖 倒计时：" + delta + " 秒");
                $("#promoPrice").text(g_itemVO.promoPrice);

                $("#createorder").attr("disabled", true); // 秒杀活动未开始用户不许下单
            } else if (g_itemVO.promoStatus == 2) { // 秒杀活动正在进行中
                $("#promoStartDate").text("秒杀正在进行中");
                $("#promoPrice").text(g_itemVO.promoPrice);
                $("#createorder").attr("disabled", false); // 秒杀活动开始中允许用户下单
                $("#normalPriceContainer").hide(); // 隐藏非秒杀的价格
            }
        }
    </script>
</html>
```