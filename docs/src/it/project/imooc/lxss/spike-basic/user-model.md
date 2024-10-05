---
category: IT
article: false
order: 2
---

# 用户模型管理

## 用户获取 OTP 短信接口

```java
@RestController
@RequestMapping("/user")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 用户获取OTP短信接口
     *
     * @param telphone 用户手机号码
     * @return
     */
    @PostMapping("/getotp")
    public CommonReturnType getOtp(@RequestParam(name = "telphone") String telphone) {
        // 需要按照一定的规则生成OTP验证码
        Random random = new Random();
        int randomInt = random.nextInt(90000);// 此时随机数取值 [0,90000)
        randomInt += 10000; // 此时随机数取值 [10000,100000) 结果 介于 10000 ~ 99999 之间
        String otpCode = String.valueOf(randomInt);

        /**
         * 将OTP验证码同对应用户的手机号关联
         * 在企业级当中的应用都是分布式的，所以会采用Redis的方式去接入（key为用户手机，value为OTP验证码），还可以配置expire有效时间，并且当用户反复点击获取OTP的时候，可以做覆盖，永远只有最新的OTP验证码有效
         * 当前项目使用 HTTP Session 的方式绑定用户手机号与OTP验证码
         */
        httpServletRequest.getSession().setAttribute(telphone, otpCode);

        // 将OTP验证码通过短信通道发送给用户（当前项目省略，可以买第三方短信服务的通道，以 HTTP POST 的方式将短信模板的内容 POST 到对应用户的手机号上面）
        System.out.println("telphone = " + telphone + "，otpCode = " + otpCode);

        return CommonReturnType.create(null);
    }
}
```

测试地址：[http://localhost:8090/user/getotp?telphone=13612345678](http://localhost:8090/user/getotp?telphone=13612345678)

## 用户获取 OPT 界面实现

getotp.html

```html
<html>
    <head>
        <meta charset="UTF-8">
        <link href="static/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="static/assets/global/css/components.css" rel="stylesheet" type="text/css" />
        <link href="static/assets/admin/pages/css/login.css" rel="stylesheet" type="text/css" />
        <script src="static/assets/global/plugins/jquery-1.11.0.min.js" type="text/javascript"></script>
        <script src="./gethost.js" type="text/javascript"></script>
    </head>
    <body class="login">
        <div class="content">
            <h3 class="form-title">获取otp信息</h3>
            <div class="form-group">
                <label class="control-label">手机号</label>
                <div>
                    <input class="form-control" type="text" placeholder="手机号" name="telphone" id="telphone" />
                </div>
            </div>
            <div class="form-actions">
                <button class="btn blue" id="getotp" type="submit">
                    获取otp短信
                </button>
            </div>
        </div>
    </body>
    <script>
        jQuery(document).ready(function () {
            //绑定otp的click时间用于向后端发送获取手机验证码的请求
            $("#getotp").on("click", function () {
                var telphone = $("#telphone").val();
                if (telphone == null || telphone == "") {
                    alert("手机号不能为空");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: "http://localhost:8090/user/getotp",
                    data: {
                        "telphone": $("#telphone").val(),
                    },
                    xhrFields: { withCredentials: true },
                    success: function (data) {
                        if (data.status == "success") {
                            alert("otp已经发送到了您的手机上，请注意查收");
                            window.location.href = "./register.html";
                        } else {
                            alert("otp发送失败，原因为" + data.data.errMsg);
                        }
                    },
                    error: function (data) {
                        alert("otp发送失败，原因为" + data.responseText);
                    }
                });
                return false;
            });
        });
    </script>
</html>
```

Access to XMLHttpRequest at 'http://localhost:8090/user/getotp' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

跨域请求的错误，Ajax 程序启动于这个 getotp.html 文件，它对应的域是本地文件，而请求的服务器却是 localhost 域。这种情况下，虽然请求能达到服务端，并且服务端也能正确地返回，但其实 Ajax 请求的回调会认定它们的域不同，这种回调是不安全的，因此会报跨域的错误，并且走不到 Ajax 请求的 success 回调里

我们可以使用 Spring Framework 提供的 `@CrossOrigin` 注解，用于启用跨源资源共享（CORS，Cross-Origin Resource Sharing）CORS 是一种机制，它使用额外的 HTTP 头来告诉浏览器允许一个域上的网页访问另一个域上的资源

`allowCredentials`：布尔值，指示是否允许请求中包含凭证（如 cookies、HTTP 认证信息）。默认值为 `false`，如果设置为 `true`，则 `allowedOrigins` 不能包含通配符 "*"，必须指定具体的来源

`allowedHeaders`：一个字符串数组，指定允许的请求头列表。可以是具体的头部名称，也可以是通配符 "*" 表示允许所有请求头

```java {3}
@RestController
@RequestMapping("/user")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 用户获取OTP短信接口
     *
     * @param telphone 用户手机号码
     * @return
     */
    @PostMapping(value = "/getotp", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType getOtp(@RequestParam(name = "telphone") String telphone) {
        // 需要按照一定的规则生成OTP验证码
        Random random = new Random();
        int randomInt = random.nextInt(90000);// 此时随机数取值 [0,90000)
        randomInt += 10000; // 此时随机数取值 [10000,100000) 结果 介于 10000 ~ 99999 之间
        String otpCode = String.valueOf(randomInt);

        /**
         * 将OTP验证码同对应用户的手机号关联
         * 在企业级当中的应用都是分布式的，所以会采用Redis的方式去接入（key为用户手机，value为OTP验证码），还可以配置expire有效时间，并且当用户反复点击获取OTP的时候，可以做覆盖，永远只有最新的OTP验证码有效
         * 当前项目使用 HTTP Session 的方式绑定用户手机号与OTP验证码
         */
        httpServletRequest.getSession().setAttribute(telphone, otpCode);

        // 将OTP验证码通过短信通道发送给用户（当前项目省略，可以买第三方短信服务的通道，以 HTTP POST 的方式将短信模板的内容 POST 到对应用户的手机号上面）
        System.out.println("telphone = " + telphone + "，otpCode = " + otpCode);

        return CommonReturnType.create(null);
    }
}
```

## 用户注册接口

::: tabs

@tab UserController

```java
@RestController
@RequestMapping("/user")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 用户注册接口
     *
     * @param telphone 用户手机号码
     * @param otpCode  OTP验证码，用来标识该手机号码确实是用户本人在注册，而没有通过伪造
     * @param name     用户姓名
     * @param gender   用户性别
     * @param age      用户年龄
     * @return
     */
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType register(@RequestParam(name = "telphone") String telphone,
                                     @RequestParam(name = "otpCode") String otpCode,
                                     @RequestParam(name = "name") String name,
                                     @RequestParam(name = "gender") Integer gender,
                                     @RequestParam(name = "age") Integer age,
                                     @RequestParam(name = "password") String password) throws BusinessException, UnsupportedEncodingException, NoSuchAlgorithmException {
        /**
         * 验证手机号以及对应的 otpCode 是否相符合
         * allowedHeaders = "*" 允许跨域传输所有的 header 参数，将用于使用 token 放入 header 域做 session 共享的跨域请求
         * allowCredentials = "true" 需要配合前端设置 xhrFields 授信后使得跨域 session 共享（xhrFields:{withCredentials:true}）
         */
        String inSessionOtpCode = (String) httpServletRequest.getSession().getAttribute(telphone);
        if (!StringUtils.equals(inSessionOtpCode, otpCode)) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "短信验证码不符合");
        }
        // 用户注册服务
        UserModel userModel = new UserModel();
        userModel.setName(name);
        userModel.setGender(gender.byteValue());
        userModel.setAge(age);
        userModel.setTelphone(telphone);
        userModel.setRegisterMode("byPhone");
        userModel.setEncrptPassword(encodeByMd5(password));
        userService.register(userModel);
        return CommonReturnType.create(null);
    }

    public String encodeByMd5(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        // 确定计算方法
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        BASE64Encoder base64en = new BASE64Encoder();
        // 加密字符串
        String newstr = base64en.encode(md5.digest(str.getBytes("utf-8")));
        return newstr;
    }
}
```

@tab UserService

```java
public interface UserService {

    /**
     * 用户注册
     * 
     * @param userModel
     */
    void register(UserModel userModel) throws BusinessException;
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
    @Transactional
    public void register(UserModel userModel) throws BusinessException {
        if (userModel == null) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
        if (StringUtils.isBlank(userModel.getName())
                || userModel.getGender() == null
                || userModel.getAge() == null
                || StringUtils.isBlank(userModel.getTelphone())
                || StringUtils.isBlank(userModel.getEncrptPassword())) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
        UserDO userDO = convertFromModel(userModel);
        userDOMapper.insertSelective(userDO);
        userModel.setId(userDO.getId());
        UserPasswordDO userPasswordDO = convertPasswordFromModel(userModel);
        userPasswordDOMapper.insertSelective(userPasswordDO);
    }

    private UserDO convertFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(userModel, userDO);
        return userDO;
    }

    private UserPasswordDO convertPasswordFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserPasswordDO userPasswordDO = new UserPasswordDO();
        userPasswordDO.setUserId(userModel.getId());
        userPasswordDO.setEncrptPassword(userModel.getEncrptPassword());
        return userPasswordDO;
    }

}
```

@tab UserDOMapper

```java
public interface UserDOMapper {

    int insertSelective(UserDO record);
}
```

```xml
<insert id="insertSelective" parameterType="com.mw.dataobject.UserDO" keyProperty="id" useGeneratedKeys="true">
    insert into user_info
    <trim prefix="(" suffix=")" suffixOverrides=",">
        <if test="id != null">
            id,
        </if>
        <if test="name != null">
            name,
        </if>
        <if test="gender != null">
            gender,
        </if>
        <if test="age != null">
            age,
        </if>
        <if test="telphone != null">
            telphone,
        </if>
        <if test="registerMode != null">
            register_mode,
        </if>
        <if test="thirdPartyId != null">
            third_party_id,
        </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
        <if test="id != null">
            #{id,jdbcType=INTEGER},
        </if>
        <if test="name != null">
            #{name,jdbcType=VARCHAR},
        </if>
        <if test="gender != null">
            #{gender,jdbcType=TINYINT},
        </if>
        <if test="age != null">
            #{age,jdbcType=INTEGER},
        </if>
        <if test="telphone != null">
            #{telphone,jdbcType=VARCHAR},
        </if>
        <if test="registerMode != null">
            #{registerMode,jdbcType=VARCHAR},
        </if>
        <if test="thirdPartyId != null">
            #{thirdPartyId,jdbcType=VARCHAR},
        </if>
    </trim>
</insert>
```

记得在 xml 中加上以下属性：

主键：`keyProperty="id"`

自增 ID：`useGeneratedKeys="true"`

@tab UserPasswordDOMapper

```java
public interface UserPasswordDOMapper {

    int insertSelective(UserPasswordDO record);
}
```

```xml
<insert id="insertSelective" parameterType="com.mw.dataobject.UserPasswordDO" keyProperty="id" useGeneratedKeys="true">
    insert into user_password
    <trim prefix="(" suffix=")" suffixOverrides=",">
        <if test="id != null">
            id,
        </if>
        <if test="encrptPassword != null">
            encrpt_password,
        </if>
        <if test="userId != null">
            user_id,
        </if>
    </trim>
    <trim prefix="values (" suffix=")" suffixOverrides=",">
        <if test="id != null">
            #{id,jdbcType=INTEGER},
        </if>
        <if test="encrptPassword != null">
            #{encrptPassword,jdbcType=VARCHAR},
        </if>
        <if test="userId != null">
            #{userId,jdbcType=INTEGER},
        </if>
    </trim>
</insert>
```

记得在 xml 中加上以下属性：

主键：`keyProperty="id"`

自增 ID：`useGeneratedKeys="true"` 

:::

目前在表结构设计上还有一些问题，同一个手机号码是可以重复注册的，这样就会有不合法的脏数据，因此我们需要给 telphone 字段创建一个唯一索引：

`ALTER TABLE spike.user_info ADD CONSTRAINT telphone_unique_index UNIQUE KEY (telphone);`

```java {24-28}
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDOMapper userDOMapper;

    @Autowired
    private UserPasswordDOMapper userPasswordDOMapper;

    @Override
    @Transactional
    public void register(UserModel userModel) throws BusinessException {
        if (userModel == null) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
        if (StringUtils.isBlank(userModel.getName())
                || userModel.getGender() == null
                || userModel.getAge() == null
                || StringUtils.isBlank(userModel.getTelphone())
                || StringUtils.isBlank(userModel.getEncrptPassword())) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
        UserDO userDO = convertFromModel(userModel);
        try {
            userDOMapper.insertSelective(userDO);
        } catch (DuplicateKeyException e) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "手机号码已注册");
        }
        userModel.setId(userDO.getId());
        UserPasswordDO userPasswordDO = convertPasswordFromModel(userModel);
        userPasswordDOMapper.insertSelective(userPasswordDO);
    }

    private UserDO convertFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(userModel, userDO);
        return userDO;
    }

    private UserPasswordDO convertPasswordFromModel(UserModel userModel) {
        if (userModel == null) {
            return null;
        }
        UserPasswordDO userPasswordDO = new UserPasswordDO();
        userPasswordDO.setUserId(userModel.getId());
        userPasswordDO.setEncrptPassword(userModel.getEncrptPassword());
        return userPasswordDO;
    }

}
```

---

数据入库时为什么要用 `int insertSelective(UserDO record);` 而不用 `int insert(UserDO record);`（mybatis-generator 生成的 insertSelective 会对所有字段的值做判空，非空的字段才会往数据表里添加）：

首先 Java 的程序代码在处理一些空指针问题是非常地脆弱，其次 NULL 字段对于前端的展示是没有任何意义的，NULL 就是未定义，这个未定义只在程序级别有效，对于用户在前端看到的 NULL 应该就是一个空字符串

我们要避免数据表中出现 NULL 值的字段。可以把该字段设置成非空，并且默认值给了空字符串（EMPTY STRING），对于 int 类型的字段我们默认值可以设置成 -1

但不是所有情况下都要使用 NOT NULL，例如对应这个手机号码在这张数据表里只能有一个，手机号码是用户注册登录的唯一标识，如果说手机号码都重复了，说明这两个用户肯定不是同一个人。一般我们会给这个 `telphone` 加上唯一索引（Unique Index）
但如果加上这个唯一索引，用户是用第三方登录注册的，对应这个用户肯定是没有手机号码的（除非做强绑定，一定要绑定手机号码）。此时会遇到一个情况，这个 `telphone` 是唯一的，且设置了 NOT NULL，默认值是空字符串，那么就会影响唯一索引。如果是 NULL 的话就不受唯一索引约束

---

使用 MD5 加密：`MD5Encoder.encode(password.getBytes())` 为空：

Java 自带的 MD5 实现出来的结果是只支持 16 位的 MD5，因此我们要把对应的实现方式给改掉

```java
public String encodeByMd5(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
    // 确定计算方法
    MessageDigest md5 = MessageDigest.getInstance("MD5");
    BASE64Encoder base64en = new BASE64Encoder();
    // 加密字符串
    String newstr = base64en.encode(md5.digest(str.getBytes("utf-8")));
    return newstr;
}
```

## 用户注册界面实现

register.html

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
            <h3 class="form-title">用户注册</h3>
            <div class="form-group">
                <label class="control-label">手机号</label>
                <div>
                    <input class="form-control" type="text" placeholder="手机号" name="telphone" id="telphone"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">验证码</label>
                <div>
                    <input class="form-control" type="text" placeholder="验证码" name="otpCode" id="otpCode"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">用户昵称</label>
                <div>
                    <input class="form-control" type="text" placeholder="用户昵称" name="name" id="name"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">性别</label>
                <div>
                    <input class="form-control" type="text" placeholder="性别" name="gender" id="gender"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">年龄</label>
                <div>
                    <input class="form-control" type="text" placeholder="年龄" name="age" id="age"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">密码</label>
                <div>
                    <input class="form-control" type="password" placeholder="密码" name="password" id="password"/>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn blue" id="register" type="submit">
                    提交注册
                </button>
            </div>
        </div>
    </body>
    <script>
        jQuery(document).ready(function () {
            //绑定otp的click时间用于向后端发送获取手机验证码的请求
            $("#register").on("click", function () {
                var telphone = $("#telphone").val();
                var password = $("#password").val();
                var age = $("#age").val();
                var gender = $("#gender").val();
                var name = $("#name").val();
                var otpCode = $("#otpCode").val();
                if (telphone == null || telphone == "") {
                    alert("手机号不能为空");
                    return false;
                }
                if (password == null || password == "") {
                    alert("密码不能为空");
                    return false;
                }
                if (age == null || age == "") {
                    alert("年龄不能为空");
                    return false;
                }
                if (gender == null || gender == "") {
                    alert("性别不能为空");
                    return false;
                }
                if (otpCode == null || otpCode == "") {
                    alert("密码不能为空");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: "http://localhost:8090/user/register",
                    data: {
                        "telphone": $("#telphone").val(),
                        "password": password,
                        "age": age,
                        "gender": gender,
                        "otpCode": otpCode,
                        "name": name
                    },
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (data.status == "success") {
                            alert("注册成功");
                            window.location.href = "./login.html";
                        } else {
                            alert("注册失败，原因为" + data.data.errMsg);
                        }
                    },
                    error: function (data) {
                        alert("注册失败，原因为" + data.responseText);
                    }
                });
                return false;
            });
        });
    </script>
</html>
```

如果 register 接口中 `String inSessionOtpCode = (String) httpServletRequest.getSession().getAttribute(telphone);` 获取 OTP 验证码为空：

- 需要在同一个浏览器内打开获取 getotp.html 页面和 register.html 页面才能用让服务端复用同一套 Session

- 检查 `UserController` 是否启用跨源资源共享 `@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")` 注解。并且前端 ajax 请求中是否添加了 `xhrFields: {withCredentials: true}` 属性

- 在 getotp 和 register 接口中加入 `System.out.println("sessionId = " + httpServletRequest.getSession().getId());` 调试代码，查看两个接口获取到的 sessionId 是否为同一个，如果不同，则说明是浏览器禁止跨域 Session 的问题

  - 火狐：没问题

  - Safari：默认是禁止跨域 Session 的，要在设置里去掉阻止跨域传 Session

  - Chrome：拷贝一个新的 Chrome 快捷方式，右键【属性】，【目录】添加 `chrome.exe --args --disable-web-security --user-data-dir="C:/ChromeDevSession"` 命令

## 用户登录接口

::: tabs

@tab UserController

```java
@RestController
@RequestMapping("/user")
@CrossOrigin(allowCredentials = "true", allowedHeaders = "*")
public class UserController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private HttpServletRequest httpServletRequest;

    /**
     * 用户登录接口
     *
     * @param telphone 用户手机号码
     * @param password 用户密码
     * @return
     */
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public CommonReturnType login(@RequestParam(name = "telphone") String telphone, @RequestParam(name = "password") String password) throws BusinessException, UnsupportedEncodingException, NoSuchAlgorithmException {
        if (StringUtils.isBlank(telphone) || StringUtils.isBlank(password)) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
        // 用户登录服务（校验用户登录是否合法）
        UserModel userModel = userService.validateLogin(telphone, encodeByMd5(password));
        // 将登录凭证加入到用户登录成功的 Session 内
        httpServletRequest.getSession().setAttribute("IS_LOGIN", true);
        httpServletRequest.getSession().setAttribute("LOGIN_USER", convertFromModel(userModel));
        return CommonReturnType.create(null);
    }

    public String encodeByMd5(String str) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        // 确定计算方法
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        BASE64Encoder base64en = new BASE64Encoder();
        // 加密字符串
        String newstr = base64en.encode(md5.digest(str.getBytes("utf-8")));
        return newstr;
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

@tab UserService

```java
public interface UserService {

    /**
     * 用户登录
     *
     * @param telphone 用户手机号码
     * @param encrptPassword 用户密码
     */
    UserModel validateLogin(String telphone, String encrptPassword) throws BusinessException;
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
    public UserModel validateLogin(String telphone, String encrptPassword) throws BusinessException {
        // 通过用户手机获取用户信息
        UserDO userDO = userDOMapper.selectByTelphone(telphone);
        if (userDO == null) {
            throw new BusinessException(EmBusinessError.USER_LOGIN_FAIL);
        }
        UserPasswordDO userPasswordDO = userPasswordDOMapper.selectByUserId(userDO.getId());
        UserModel userModel = convertFromDataObject(userDO, userPasswordDO);
        // 比对用户信息内加密的密码是否和传输进来的密码相匹配
        if (!StringUtils.equals(encrptPassword, userModel.getEncrptPassword())) {
            throw new BusinessException(EmBusinessError.USER_LOGIN_FAIL);
        }
        return userModel;
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

@tab UserDOMapper

```java
public interface UserDOMapper {

    UserDO selectByTelphone(String telphone);
}
```

```xml
<select id="selectByTelphone" parameterType="java.lang.String" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List"/>
    from user_info
    where telphone = #{telphone,jdbcType=VARCHAR}
</select>
```

:::

## 用户登录界面实现

login.html

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
            <h3 class="form-title">用户登陆</h3>
            <div class="form-group">
                <label class="control-label">手机号</label>
                <div>
                    <input class="form-control" type="text" placeholder="手机号" name="telphone" id="telphone"/>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label">密码</label>
                <div>
                    <input class="form-control" type="password" placeholder="密码" name="password" id="password"/>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn blue" id="login" type="submit">
                    登陆
                </button>
                <button class="btn green" id="register" type="submit">
                    注册
                </button>
            </div>
        </div>
    </body>
    <script>
        jQuery(document).ready(function () {
            $("#register").on("click", function () {
                window.location.href = "getotp.html";
            });
            $("#login").on("click", function () {
                var telphone = $("#telphone").val();
                var password = $("#password").val();
                if (telphone == null || telphone == "") {
                    alert("手机号不能为空");
                    return false;
                }
                if (password == null || password == "") {
                    alert("密码不能为空");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    url: "http://localhost:8090/user/login",
                    data: {
                        "telphone": $("#telphone").val(),
                        "password": password
                    },
                    xhrFields: {withCredentials: true},
                    success: function (data) {
                        if (data.status == "success") {
                            alert("登陆成功");
                            window.location.href = "listitem.html";
                        } else {
                            alert("登陆失败，原因为" + data.data.errMsg);
                        }
                    },
                    error: function (data) {
                        alert("登陆失败，原因为" + data.responseText);
                    }
                });
                return false;
            });
        });
    </script>
</html>
```

## 优化数据校验

我们在项目中写的很多接口需要对入参进行校验，可以通过 validator 中的注解便捷的处理

新增依赖包

```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.0.8.Final</version>
</dependency>
```

::: tabs

@tab ValidationResult

```java
package com.mw.validator;

public class ValidationResult {

    // 校验结果是否有错
    private boolean hasErrors;

    // 存放错误信息的 Map
    private Map<String, String> errorMsgMap = new HashMap<>();

    // 实现通用的通过格式化字符串信息获取错误结果的方法
    public String getErrMsg() {
        return StringUtils.join(errorMsgMap.values().toArray(), ",");
    }

    public boolean isHasErrors() {
        return hasErrors;
    }

    public void setHasErrors(boolean hasErrors) {
        this.hasErrors = hasErrors;
    }

    public Map<String, String> getErrorMsgMap() {
        return errorMsgMap;
    }

    public void setErrorMsgMap(Map<String, String> errorMsgMap) {
        this.errorMsgMap = errorMsgMap;
    }
}
```

@tab ValidatorImpl

```java
package com.mw.validator;

@Component
public class ValidatorImpl implements InitializingBean {

    private Validator validator;

    // 实现校验方法并返回校验结果
    public ValidationResult validate(Object bean) {
        ValidationResult validationResult = new ValidationResult();
        // 若对应的 bean 里面的参数规则有违背了 validator 定义的注解的话，constraintViolationSet 里就会有对应的值
        Set<ConstraintViolation<Object>> constraintViolationSet = validator.validate(bean);
        if (constraintViolationSet.size() > 0) {
            // 有错误
            validationResult.setHasErrors(true);
            constraintViolationSet.forEach(constraintViolation -> {
                String errMsg = constraintViolation.getMessage();
                String propertyName = constraintViolation.getPropertyPath().toString();
                validationResult.getErrorMsgMap().put(propertyName, errMsg);
            });
        }
        return validationResult;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        // 将 hibernate validator 通过工厂的初始化方式使其实例化
        this.validator = Validation.buildDefaultValidatorFactory().getValidator();
    }
}
```

@tab UserModel

```java
package com.mw.service.model;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class UserModel {

    private Integer id;

    @NotBlank(message = "用户名不能为空")
    private String name;

    @NotNull(message = "性别不能不填写")
    private Byte gender;

    @NotNull(message = "年龄不能不填写")
    @Min(value = 0, message = "年龄必须大于0岁")
    @Max(value = 150, message = "年龄必须小于150岁")
    private Integer age;

    @NotBlank(message = "手机号不能为空")
    private String telphone;

    private String registerMode;

    private String thirdPartyId;

    @NotBlank(message = "密码不能为空")
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

@tab UserServiceImpl

```java {19-29}
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDOMapper userDOMapper;

    @Autowired
    private UserPasswordDOMapper userPasswordDOMapper;

    @Autowired
    private ValidatorImpl validator;

    @Override
    @Transactional
    public void register(UserModel userModel) throws BusinessException {
        if (userModel == null) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
        }
//        if (StringUtils.isBlank(userModel.getName())
//                || userModel.getGender() == null
//                || userModel.getAge() == null
//                || StringUtils.isBlank(userModel.getTelphone())
//                || StringUtils.isBlank(userModel.getEncrptPassword())) {
//            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR);
//        }
        ValidationResult result = validator.validate(userModel);
        if (result.isHasErrors()) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, result.getErrMsg());
        }
        UserDO userDO = convertFromModel(userModel);
        try {
            userDOMapper.insertSelective(userDO);
        } catch (DuplicateKeyException e) {
            throw new BusinessException(EmBusinessError.PARAMETER_VALIDATION_ERROR, "手机号码已注册");
        }
        userModel.setId(userDO.getId());
        UserPasswordDO userPasswordDO = convertPasswordFromModel(userModel);
        userPasswordDOMapper.insertSelective(userPasswordDO);
    }
}
```

:::


