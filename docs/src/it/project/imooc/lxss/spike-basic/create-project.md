---
category: IT
article: false
order: 1
---

# 创建项目

使用 IntelliJ IDEA 创建项目：

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/1.png)

创建一个 resources 目录，作为资源文件目录。创建完成后右键点击，指定为 Resource Root

## 配置文件

引入 Spring Boot 依赖包实现简单的 Web 项目

官方文档：[https://spring.io/guides/gs/rest-service/](https://spring.io/guides/gs/rest-service/)

pom.xml 文件：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mw</groupId>
    <artifactId>spike</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>spike</name>
    <url>http://maven.apache.org</url>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.5.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <!--<version>5.1.41</version>-->
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.3</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.3.1</version>
        </dependency>

        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <artifactId>maven-clean-plugin</artifactId>
                    <version>3.0.0</version>
                </plugin>
                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <version>3.0.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.7.0</version>
                </plugin>
                <plugin>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <version>2.20.1</version>
                </plugin>
                <plugin>
                    <artifactId>maven-jar-plugin</artifactId>
                    <version>3.0.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-install-plugin</artifactId>
                    <version>2.5.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-deploy-plugin</artifactId>
                    <version>2.8.2</version>
                </plugin>
                <plugin>
                    <groupId>org.mybatis.generator</groupId>
                    <artifactId>mybatis-generator-maven-plugin</artifactId>
                    <version>1.3.5</version>
                    <dependencies>
                        <dependency>
                            <groupId>org.mybatis.generator</groupId>
                            <artifactId>mybatis-generator-core</artifactId>
                            <version>1.3.5</version>
                        </dependency>
                        <dependency>
                            <groupId>mysql</groupId>
                            <artifactId>mysql-connector-java</artifactId>
                            <!--<version>5.1.41</version>-->
                            <version>8.0.33</version>
                        </dependency>
                    </dependencies>
                    <executions>
                        <execution>
                            <id>mybatis generator</id>
                            <phase>package</phase>
                            <goals>
                                <goal>generate</goal>
                            </goals>
                        </execution>
                    </executions>
                    <configuration>
                        <!--  允许移动生成的文件  -->
                        <verbose>true</verbose>
                        <!--  允许自动覆盖文件  -->
                        <overwrite>false</overwrite>
                        <configurationFile>
                            src/main/resources/mybatis-generator.xml
                        </configurationFile>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## 数据库设计

创建数据库【spike】

用户信息表【user_info】：

```sql
-- spike.user_info definition

CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '姓名',
  `gender` tinyint NOT NULL DEFAULT '0' COMMENT '性别：1男性；2女性',
  `age` int DEFAULT '0' COMMENT '年龄',
  `telphone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号码',
  `register_mode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '注册方式：手机/微信/支付宝',
  `third_party_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '第三方账号ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

用户登录需要账号和密码，但在上述这张用户表里我们并没有创建【密码】字段。因为密码是加密的字符串，一般来说不跟主表创建在一起。对于企业级的应用来说，用户的密码会托管到另外一个系统上

用户密码表【user_password】：

```sql
-- spike.user_password definition

CREATE TABLE `user_password` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `encrpt_password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码密文',
  `user_id` int NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

在 resources 目录下新建 Mybatis 代码生成器文件 mybatis-generator：

可以在官网下载：[http://www.mybatis.org/generator/configreference/xmlconfig.html](http://www.mybatis.org/generator/configreference/xmlconfig.html)

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
        <table tableName="user_info"  domainObjectName="UserDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
        <table tableName="user_password"  domainObjectName="UserPasswordDO" enableCountByExample="false" enableUpdateByExample="false" enableDeleteByExample="false" enableSelectByExample="false" selectByExampleQueryId="false"></table>
    </context>
</generatorConfiguration>
```

![](https://img.sherry4869.com/blog/it/project/imooc/lxss/spike-basic/2.png)

在 resources 目录下新建 Spring Boot 的默认配置文件 application.properties：

```properties
server.port=8090
mybatis.mapper-locations=classpath:mapping/*.xml

spring.datasource.name=spike
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/spike
spring.datasource.username=root
spring.datasource.password=root

# 使用druid数据源
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## 使用 MVC 开发用户信息

刚刚使用 Mybatis 代码生成器生成的 `UserDO` 以及 `UserPasswordDO`，它是与数据库表字段完全一一映射，也就是说数据库里有什么字段，那么对应的 DataObject 就有什么字段，并不含有逻辑，这就是最简单的 ORM 映射

在 Service 层中不可以简单的把数据库表对应映射的实体类 `UserDO` 以及 `UserPasswordDO` 透传返回给 Service 服务的调用方。在 Service 层中必须有一个 Model 的概念。这个 Model 才是 Spring MVC 中业务逻辑交互模型的概念。因此我们会创建一个 `UserModel` 来保存用户对象模型的数据  

但此时我们会发现在 Controller 层直接把 Service 层的 `UserModel` 核心模型对象透传给前端也有不合理的地方，毕竟里面的某些字段并不需要返回给前端，例如用户加密后的密码，尽管加密后的密码无法被破解，但这种做法极其的不专业。前端其实只需要拿到展示的数据字段即可，而并非拿到整个业务的领域模型，因此我们可以在 Controller 层加上一层 ViewObject 模型对象 `UserVO`

::: tabs

@tab UserController

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public UserVO getUser(@RequestParam(name = "id") Integer id) {
        // 调用 service 服务获取对应 id 的用户对象并返回给前端
        UserModel userModel = userService.getUserById(id);
        // 将核心领域模型用户对象转换为可供前端使用的 ViewObject
        return convertFromModel(userModel);
    }

    private UserVO convertFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(userModel, userVO);
        return userVO;
    }

}
```

@tab UserVO

```java
package com.mw.controller.viewobject;

public class UserVO {

    private Integer id;

    private String name;

    private Byte gender;

    private Integer age;

    private String telphone;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Byte getGender() {
        return gender;
    }

    public void setGender(Byte gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getTelphone() {
        return telphone;
    }

    public void setTelphone(String telphone) {
        this.telphone = telphone;
    }
}
```

@tab UserService

```java
public interface UserService {

    /**
     * 通过用户 ID 获取用户对象
     * @param id 用户 ID
     */
    UserModel getUserById(Integer id);

}
```

@tab UserServiceImpl

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDOMapper userDOMapper;

    @Autowired
    private UserPasswordDOMapper userPasswordDOMapper;

    @Override
    public UserModel getUserById(Integer id) {
        // 调用 userDoMapper 获取到对应的用户 dataObject
        UserDO userDO = userDOMapper.selectByPrimaryKey(id);
        if (userDO == null) {
            return null;
        }
        // 通过用户 id 获取对应用户加密密码的信息
        UserPasswordDO userPasswordDO = userPasswordDOMapper.selectByUserId(userDO.getId());
        return convertFromDataObject(userDO, userPasswordDO);
    }

    private UserModel convertFromDataObject(UserDO userDO, UserPasswordDO userPasswordDO) {
        if (userDO == null) {
            return null;
        }
        UserModel userModel = new UserModel();
        BeanUtils.copyProperties(userDO, userModel);
        if (userPasswordDO != null) { // 理论上来说一个用户是不可能没有密码的，但我们的代码层面还是需要预防一下这种情况
            userModel.setEncrptPassword(userPasswordDO.getEncrptPassword());
        }
        return userModel;
    }
}
```

@tab UserModel

```java
package com.mw.service.model;

public class UserModel {

    private Integer id;

    private String name;

    private Byte gender;

    private Integer age;

    private String telphone;

    private String registerMode;

    private String thirdPartyId;

    private String encrptPassword; // 该字段也是属于用户对象模型的，只是仅仅因为数据模型层的关系，我们把它设置到两张不同的表里面，但对于 Java 领域模型中对象的概念里来说，该字段就是属于 UserModel 的

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Byte getGender() {
        return gender;
    }

    public void setGender(Byte gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getTelphone() {
        return telphone;
    }

    public void setTelphone(String telphone) {
        this.telphone = telphone;
    }

    public String getRegisterMode() {
        return registerMode;
    }

    public void setRegisterMode(String registerMode) {
        this.registerMode = registerMode;
    }

    public String getThirdPartyId() {
        return thirdPartyId;
    }

    public void setThirdPartyId(String thirdPartyId) {
        this.thirdPartyId = thirdPartyId;
    }

    public String getEncrptPassword() {
        return encrptPassword;
    }

    public void setEncrptPassword(String encrptPassword) {
        this.encrptPassword = encrptPassword;
    }
}
```

@tab UserDO

```java
package com.mw.dataobject;

public class UserDO {

    private Integer id;

    private String name;

    private Byte gender;

    private Integer age;

    private String telphone;

    private String registerMode;

    private String thirdPartyId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Byte getGender() {
        return gender;
    }

    public void setGender(Byte gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getTelphone() {
        return telphone;
    }

    public void setTelphone(String telphone) {
        this.telphone = telphone == null ? null : telphone.trim();
    }

    public String getRegisterMode() {
        return registerMode;
    }

    public void setRegisterMode(String registerMode) {
        this.registerMode = registerMode == null ? null : registerMode.trim();
    }

    public String getThirdPartyId() {
        return thirdPartyId;
    }

    public void setThirdPartyId(String thirdPartyId) {
        this.thirdPartyId = thirdPartyId == null ? null : thirdPartyId.trim();
    }
}
```

@tab UserPasswordDO

```java
package com.mw.dataobject;

public class UserPasswordDO {

    private Integer id;

    private String encrptPassword;

    private Integer userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEncrptPassword() {
        return encrptPassword;
    }

    public void setEncrptPassword(String encrptPassword) {
        this.encrptPassword = encrptPassword == null ? null : encrptPassword.trim();
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
```

:::

## 定义通用的返回对象

目前我们接口层响应给给前端的数据格式并不是统一格式的，不同的接口返回的 ViewObject 都回不一样。因此我们要定义一个通用的返回对象

::: tabs

@tab UserController

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public CommonReturnType getUser(@RequestParam(name = "id") Integer id) {
        // 调用 service 服务获取对应 id 的用户对象并返回给前端
        UserModel userModel = userService.getUserById(id);
        // 将核心领域模型用户对象转换为可供 UI 使用的 ViewObject
        UserVO userVO = convertFromModel(userModel);
        // 返回通用对象
        return CommonReturnType.create(userVO);
    }

    private UserVO convertFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(userModel, userVO);
        return userVO;
    }

}
```

@tab CommonReturnType

```java
package com.mw.response;

public class CommonReturnType {

    private String status; // 表明对应请求的返回处理结果：“success” 或 “fail”

    private Object data; // 若status = “success”，则 data 内返回前端需要的 JSON 数据。否则 data 内使用通用错误码格式

    public static CommonReturnType create(Object data) {
        return CommonReturnType.create(data, "success");
    }

    public static CommonReturnType create(Object data, String status) {
        CommonReturnType commonReturnType = new CommonReturnType();
        commonReturnType.setData(data);
        commonReturnType.setStatus(status);
        return commonReturnType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
```

:::

```json
{
	"status": "success",
	"data": {
		"id": 1,
		"name": "第一个用户",
		"gender": 1,
		"age": 20,
		"telphone": "136000000000"
	}
}
```

通过这个统一返回对象，前端只要判断 HTTP 响应状态码返回的是 200，就可以去解析接口返回的 `status` 和 `data`

## 定义统一异常处理

对于一个 Web 系统来说，Controller 层的异常其实在某种意义上来说就是业务处理的最后一道关口，若 Controller 层的异常被处理掉了，能够在返回 Web 前端之前有一个很好的钩子。如果没有被处理掉的话，对于用户体验来说就会看到 Whitelabel Error Page 界面

定义 `CommonReturnType`，能够用对应的 `status` 和 `data` 返回一个所有 JSON 序列化方式固定的对象给前端解析使用

定义 `EmBusinessError` 统一管理错误码

定义 `BusinessException` 统一异常处理

定义 `ExceptionHandler` 解决未被 Controller 处理的 Exception

::: tabs

@tab CommonReturnType

```java
package com.mw.response;

public class CommonReturnType {

    private String status; // 表明对应请求的返回处理结果：“success” 或 “fail”

    private Object data; // 若status = “success”，则 data 内返回前端需要的 JSON 数据。否则 data 内使用通用错误码格式

    public static CommonReturnType create(Object data) {
        return CommonReturnType.create(data, "success");
    }

    public static CommonReturnType create(Object data, String status) {
        CommonReturnType commonReturnType = new CommonReturnType();
        commonReturnType.setData(data);
        commonReturnType.setStatus(status);
        return commonReturnType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
```

@tab CommonError

```java
package com.mw.error;

public interface CommonError {

    int getErrCode();

    String getErrMsg();

    CommonError setErrMsg(String errMsg);
}
```

@tab EmBusinessError

```java
package com.mw.error;

public enum EmBusinessError implements CommonError {

    // 1000 开头为通用错误类型
    PARAMETER_VALIDATION_ERROR(10001, "参数不合法"),
    UNKNOWN_ERROR(10002, "未知错误"),

    // 2000 开头为用户信息相关错误定义
    USER_NOT_EXIST(20001, "用户不存在"),
    USER_LOGIN_FAIL(20002, "用户手机号或密码错误"),
    USER_NOT_LOGIN(20003, "用户还未登录"),

    // 3000 开头为交易信息错误定义
    STOCK_NOT_ENOUGH(30001, "库存不足");

    private int errCode;

    private String errMsg;

    EmBusinessError(int errCode, String errMsg) {
        this.errCode = errCode;
        this.errMsg = errMsg;
    }

    @Override
    public int getErrCode() {
        return errCode;
    }

    @Override
    public String getErrMsg() {
        return errMsg;
    }

    @Override
    public CommonError setErrMsg(String errMsg) {
        this.errMsg = errMsg;
        return this;
    }
}
```

@tab BusinessException

```java
package com.mw.error;

// 包装器实现业务异常类
public class BusinessException extends Exception implements CommonError {

    private CommonError commonError;

    // 直接接收 EmBusinessError 的传参用于构造业务异常
    public BusinessException(CommonError commonError) {
        this.commonError = commonError;
    }

    // 接收自定义 errMsg 的方式构造业务异常
    public BusinessException(CommonError commonError, String errMsg) {
        this.commonError = commonError;
        this.commonError.setErrMsg(errMsg);
    }

    @Override
    public int getErrCode() {
        return commonError.getErrCode();
    }

    @Override
    public String getErrMsg() {
        return commonError.getErrMsg();
    }

    @Override
    public CommonError setErrMsg(String errMsg) {
        commonError.setErrMsg(errMsg);
        return this;
    }
}
```

@tab BaseController

```java
package com.mw.controller;

public class BaseController {

    // 定义 ExceptionHandler 解决未被 Controller 处理的 Exception
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Object handlerException(HttpServletRequest request, Exception exception) {
        Map<String, Object> responseData = new HashMap<>();
        if (exception instanceof BusinessException) {
            BusinessException businessException = (BusinessException) exception;
            responseData.put("errCode", businessException.getErrCode());
            responseData.put("errMsg", businessException.getErrMsg());
        } else {
            responseData.put("errCode", EmBusinessError.UNKNOWN_ERROR.getErrCode());
            responseData.put("errMsg", EmBusinessError.UNKNOWN_ERROR.getErrMsg());
        }
        return CommonReturnType.create(responseData, "fail");
    }
}
```

@tab UserController

```java
package com.mw.controller;

@RestController
@RequestMapping("/user")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public CommonReturnType getUser(@RequestParam(name = "id") Integer id) throws BusinessException {
        // 调用 service 服务获取对应 id 的用户对象并返回给前端
        UserModel userModel = userService.getUserById(id);
        // 若获取的对应用户信息不存在
        if (userModel == null) {
            throw new BusinessException(EmBusinessError.USER_NOT_EXIST);
        }
        // 将核心领域模型用户对象转换为可供 UI 使用的 ViewObject
        UserVO userVO = convertFromModel(userModel);
        // 返回通用对象
        return CommonReturnType.create(userVO);
    }

    private UserVO convertFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(userModel, userVO);
        return userVO;
    }

}
```

测试地址：[http://localhost:8090/user/get?id=2](http://localhost:8090/user/get?id=2)

:::

但这里会有一个 404 和 405 的问题：

使用 GET 请求 [localhost:8090/item/get1?id=1](localhost:8090/item/get1?id=1) 出现的 404 异常：

```json
{
    "timestamp": "2020-10-11T08:49:29.787+0000",
    "status": 404,
    "error": "Not Found",
    "message": "No message available",
    "path": "/item/get1"
}
```

使用 POST 请求 [localhost:8090/item/get?id=1](localhost:8090/item/get?id=1) 出现的 405 异常：

```json
{
    "timestamp": "2020-10-11T08:50:37.912+0000",
    "status": 405,
    "error": "Method Not Allowed",
    "message": "Request method 'POST' not supported",
    "path": "/item/get"
}
```

配置文件新增配置项：

```properties
# 设置为true时，当Spring MVC找不到一个能够处理特定请求的处理器（即Controller中的方法）时，它会抛出一个异常（通常是NoHandlerFoundException）。默认情况下，这个属性是false，这意味着如果没有找到处理器，Spring MVC将返回404状态码，而不会抛出异常
# 当请求到达应用时，如果请求没有匹配到任何控制器处理器，并且没有静态资源与之对应，就会立即抛出NoHandlerFoundException
spring.mvc.throw-exception-if-no-handler-found=true

# 这个属性控制着Spring是否自动添加资源处理器到DispatcherServlet中。如果你将其设置为false，那么Spring将不会自动处理静态资源（如CSS, JavaScript, 图片等），这些资源通常位于/static, /public, /resources, 或者/META-INF/resources目录下
# 默认情况下，这个属性是true，意味着Spring Boot会自动配置处理静态资源的映射。如果关闭了这个特性，你需要自己配置资源处理器，或者确保你的web服务器（比如Tomcat）直接提供这些资源
# 由于静态资源映射被禁用了，所以需要确保有其他机制来提供静态内容，否则所有对静态资源的请求也会导致异常
spring.resources.add-mappings=false
```

新增全局异常处理器，能够处理整个 Spring MVC 应用中抛出的所有控制器相关的异常：

```java
@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public CommonReturnType doError(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Exception exception) {
        exception.printStackTrace();
        Map<String, Object> responseData = new HashMap<>();
        if (exception instanceof BusinessException) {
            BusinessException businessException = (BusinessException) exception;
            responseData.put("errCode", businessException.getErrCode());
            responseData.put("errMsg", businessException.getErrCode());
        } else if (exception instanceof ServletRequestBindingException) { // 如果必传的 @RequestParam 参数没有传递
            responseData.put("errCode", EmBusinessError.UNKNOWN_ERROR.getErrCode());
            responseData.put("errMsg", "URL绑定路由问题");
        } else if (exception instanceof NoHandlerFoundException) { // 捕获 404 异常，例如请求：localhost:8090/item/get1?id=1
            responseData.put("errCode", EmBusinessError.UNKNOWN_ERROR.getErrCode());
            responseData.put("errMsg", "没有找到对应的访问路径");
        } else {
            responseData.put("errCode", EmBusinessError.UNKNOWN_ERROR.getErrCode());
            responseData.put("errMsg", EmBusinessError.UNKNOWN_ERROR.getErrMsg());
        }
        return CommonReturnType.create(responseData);
    }
}
```