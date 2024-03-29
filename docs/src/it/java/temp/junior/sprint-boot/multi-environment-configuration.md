---
category: IT
order: 1
article: false
---

# 多环境配置打包

在软件开发过程中，多环境部署通常是将软件代码从开发环境顺序部署到测试、用户接受测试和生产环境的过程。在这个过程中，不同的环境拥有不同的目的，不同的测试需求和使用者

常见的环境有：

- Dev (Development) 环境：这是开发人员工作的地方，是代码最初地开发环境。在这个环境下，开发人员可以编写、测试和修改软件代码，然后将其提交到版本控制系统，以供其他团队成员查看和协作

- Test (Testing) 环境：这是在软件代码进入 QA（Quality Assurance）质量保证之前的测试环境。在这个环境下，测试人员可以对软件进行功能、性能和安全性等多方面的测试，以确定软件是否符合规范和预期的要求。如果在测试环境中发现了问题或错误，那么测试人员可以将问题反馈给开发团队进行修复

- UAT (User Acceptance Testing) 环境：这是在测试环境中软件通过测试并进入用户验收测试阶段前的环境。在这个环境中，最终用户可以测试软件是否满足他们的需求，并给出反馈意见。如果在 UAT 环境中发现问题或错误，那么需要将问题反馈给开发团队进行修复

- Prod (Production) 环境：这是软件的生产环境，也就是软件的最终运行环境。在这个环境下，软件将被实际部署和运行，提供给最终用户使用。在生产环境下，软件必须稳定可靠、高效并且安全，因此在部署到生产环境之前必须经过严格的测试和验证。同时，对于生产环境的更新和维护也需要谨慎对待，以避免出现任何问题或不必要的中断

## 配置多环境

我们在一个 Spring Boot 工程中配置多环境部署：

1. 创建一个 Spring Boot 2.x 工程

2. 新增 `properties` 应用程序配置文件 

   ::: tabs

   @tab application.properties

    ```properties
    # 激活指定环境配置文件
    spring.profiles.active=dev
    ```

   @tab application-dev.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8080
    ```

   @tab application-test.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8081
    ```

   @tab application-uat.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8082
    ```

   @tab application-prod.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8083
    ```

   :::

3. 运行程序

    ```text
    The following 1 profile is active: "dev"
    Tomcat initialized with port(s): 8080 (http)
    ```

4. 修改 `properties` 应用程序配置文件

   Spring Boot 允许在配置文件中定义自定义变量，以便在应用程序中使用。这些自定义变量可以在配置文件中任何位置使用。我们来指定一个 `env`（Environment Variables）环境变量，用来区分各个不同环境所对应的配置文件

   ::: tabs

   @tab application.properties

    ```properties
    # 激活指定环境配置文件
    spring.profiles.active=dev
    ```

   @tab application-dev.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8080
    # 自定义环境变量
    env=dev
    ```

   @tab application-test.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8081
    # 自定义环境变量
    env=test
    ```

   @tab application-uat.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8082
    # 自定义环境变量
    env=uat
    ```

   @tab application-prod.properties

    ```properties
    # 应用服务 WEB 访问端口
    server.port=8083
    # 自定义环境变量
    env=prod
    ```

   :::

   在配置文件中定义自定义变量，需要使用 `@Value("${...}")` 来获取变量值

    ```java
    @RestController
    public class TestController {
        
        @Value("${env}")
        private String env;
    
        @GetMapping("/env")
        public String env() {
            return "env = " + env;
        }
    }
    ```

   运行应用程序后在浏览器上访问 `http://localhost:8080/env`

    ```text
    env = dev
    ```

---

## Spring Boot 指定运行环境

通过以上配置，在实际部署中就可以通过激活指定环境配置文件来运行应用程序

1. 在工程根目录下运行 `mvn clean package` 命令

   `mvn` 是 Maven 的命令行工具

    `clean` 是 Maven 生命周期中的一个阶段，用于清理项目，删除 target 目录及其内容

    `package` 是 Maven 生命周期中的一个阶段，用于编译项目并打包生成可分发的 JAR 文件

    因此，运行这个命令将会在执行前清理项目，然后编译源代码，运行测试，并将编译后的代码打包成 JAR 文件。生成的 JAR 文件通常位于项目的 target 目录中

    如果提示：“No compiler is provided in this environment. Perhaps you are running on a JRE rather than a JDK?” 异常信息，请检查系统的环境变量配置是否配置了 `JAVA_HOME`：

    ```shell
    C:\Users\MW>mvn -version
    Apache Maven 3.9.4
    Maven home: D:\DevelopmentTools\maven\apache-maven-3.9.4
    Java version: 1.8.0_381, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-1.8\jre
    Default locale: zh_CN, platform encoding: GBK
    OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"
    ```

    ::: tip
    如果打包的时候单元测试类报错的话，我们需要在构建时跳过执行单元测试：`mvn clean package -DskipTests=true` 
    :::

2. 运行打包好的 JAR 包

    使用 `--spring.profiles.active=` 命令行参数，你可以在启动 Spring Boot 应用程序时选择要激活的配置文件：
    
   ```shell
    java -jar admin-api-0.0.1-SNAPSHOT.jar --spring.profiles.active=test
    ```

    ::: tip
    如果在 JAR 中没有看到 BOOT-INF 文件夹，而是看到根目录上就有应用程序配置文件，请检查 pom.xml 文件中 Maven 插件配置中是否配置了 `<skip>true</skip>`。`<skip>true</skip>` 的作用是跳过 Maven 插件的执行。如果设置为 `true`，那么 Maven 将跳过执行 `maven-jar-plugin` 插件，因此在执行 `mvn clean package` 后，生成的 JAR 文件中将不包含 BOOT-INF 文件夹
    
    ```xml
    <configuration>
        <mainClass>com.mw.Application</mainClass>
        <skip>false</skip>
    </configuration>
    ```
    
    并且如果跳过了 Maven 插件的执行，生成的 JAR 文件可能不包含正确的主清单属性，导致在运行 JAR 文件时提示没有主清单属性
    :::

## Maven profiles

但上述的打包发布方式存在会把所有的配置信息都打包进去的问题，我们可以把 admin-api-0.0.1-SNAPSHOT.jar 解压后在 `.\BOOT-INF\classes` 目录下查看到所有环境对应的应用配置文件

有些公司就会要求每个环境只打包对应环境的配置信息。因此我们可以使用 Maven 的 `profiles` 特性，你可以在构建过程中根据不同的配置要求选择性地包含或排除特定的资源、属性文件等内容。这对于在不同的环境中定制构建过程非常有用

1. 修改 `properties` 应用程序配置文件

    ```properties
    spring.profiles.active=@env@
    ```

    其中 `@env@` 是一个占位符，通常在构建或部署过程中会被实际的环境值替代

2. 修改 pom.xml 文件

    ```xml
    <profiles>
        <profile>
            <id>dev</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <properties>
                <env>dev</env>
            </properties>
        </profile>
        <profile>
            <id>test</id>
            <properties>
                <env>test</env>
            </properties>
        </profile>
        <profile>
            <id>uat</id>
            <properties>
                <env>uat</env>
            </properties>
        </profile>
        <profile>
            <id>prod</id>
            <properties>
                <env>prod</env>
            </properties>
        </profile>
    </profiles>
    ```

   重新加载 Maven 项目后在 Maven 配置中就会出现所配置的几个部署环境，默认选择 `dev` 环境

   ![](https://img.sherry4869.com/blog/it/java/junior/spring-boot/img.png)

   需要注意的是：在 Maven 中，`src/main/resources` 目录下的资源文件会默认被打包到最终地构建文件中，例如 JAR 或 WAR 文件。在这个过程中，Maven 会尝试对这些资源文件进行过滤，以解析其中的占位符（例如 `@env@`）或者通过 Maven Profile 将不同的环境配置文件打包到不同的构建文件中。

   在 Maven 3.6.x 及更旧的版本中，如果你在 `src/main/resources` 目录下定义了 `application.properties` 文件，并且该文件中包含了 `spring.profiles.active=@env@` 配置，Maven 会默认对其进行过滤，且可以正常解析占位符

   然而从 Maven 3.7.0 开始，Maven 默认采用新的资源过滤器（maven-resource-plugin），它采用了与旧的资源过滤器（maven-filtering-plugin）不同的行为。这意味着在 Maven 3.7.0 之后的版本中，如果你想要使用过滤器解析占位符或者通过 Maven Profile 打包不同环境的配置文件，你需要显式地配置资源过滤器

   如果你本机的 Maven 版本在 3.7.0 以上，需要在你的 pom.xml 文件中添加如下配置，否则会解析不出 `@env@` 占位符：

    ```xml
    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <excludes>
                    <exclude>application*.properties</exclude>
                </excludes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
    ```

   其中，`<directory>` 标签指定了需要被打包的文件所在的目录，`<filtering>` 标签指定了是否需要使用 Maven 的过滤器来替换配置文件中的占位符

3. 修改 pom.xml 文件

    ```xml
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <excludes>
                <exclude>application*.properties</exclude>
            </excludes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
            <includes>
                <include>application.properties</include>
                <include>application-${env}.properties</include>
            </includes>
        </resource>
    </resources>
    ```

   `<includes>` 标签指定了需要被打包的文件列表，其中 `application-${env}.properties` 表示根据当前激活的 profile 来选择对应的环境配置文件

4. 运行

   例如我们选择 prod 后运行应用程序：

    ```text
    The following 1 profile is active: "prod"
    Tomcat initialized with port(s): 8083 (http)
    ```

5. 部署

   执行 `mvn clean package -P prod` 打包命令后，解压 admin-api-0.0.1-SNAPSHOT.jar 后访问 `.\BOOT-INF\classes` 目录，会发现只有 `application.properties` 和 `application-prod.properties` 应用配置文件，因此启动该 JAR 包将无需再指定运行环境：

    ```shell
    java -jar admin-api-0.0.1-SNAPSHOT.jar
    ```
   
## 常见问题

如果使用 `yaml` 格式应用配置文件启动工程时出现 '@' that cannot start any token. (Do not use @ for indentation) 异常

`pom.xml` 文件加入如下 plugin 和 resource 配置：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <configuration>
        <delimiters>
            <delimiter>@</delimiter>
        </delimiters>
        <useDefaultDelimiters>false</useDefaultDelimiters>
    </configuration>
</plugin>
```

```xml
<resource>
    <directory>src/main/resources</directory>
    <filtering>true</filtering>
</resource>
```