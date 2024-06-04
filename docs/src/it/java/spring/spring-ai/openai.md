---
category: IT
article: false
order: 2
---

# OpenAI

## 创建应用项目

![](https://img.sherry4869.com/blog/it/java/spring/spring-ai/1.png)

![](https://img.sherry4869.com/blog/it/java/spring/spring-ai/2.png)

依赖文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.6</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.mw</groupId>
	<artifactId>spring-ai-03-transcription</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>spring-ai-03-transcription</name>
	<description>spring-ai-03-transcription</description>
	<properties>
		<java.version>21</java.version>
		<spring-ai.version>1.0.0-SNAPSHOT</spring-ai.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.ai</groupId>
			<artifactId>spring-ai-openai-spring-boot-starter</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
    
    <!--  相当于是继承一个父项目：spring-ai-bom父项目  -->
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.ai</groupId>
				<artifactId>spring-ai-bom</artifactId>
				<version>${spring-ai.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>
    
    <!--  配置本项目的仓库：因为 Maven 中心仓库还没有更新 Spring AI 的 jar 包 -->
    <repositories>
        <repository>
            <id>spring-snapshot</id>
            <name>Spring Snapshots</name>
            <url>https://repo.spring.io/snapshot</url>
            <releases>
                <enabled>false</enabled>
            </releases>
        </repository>
    </repositories>

</project>
```

修改配置文件：

```yaml
spring:
  application:
    name: spring-ai-01-chat
  ai:
    openai:
      # 填写自己申请的 api-key 如果是直连 Open AI 官方的话需要科学上网注册一个 Open AI 账号并认证+充值；也可以找国内的第三方中转平台购买 api-key
      api-key: your api-key
      # 如果是直连 Open AI 请填写 https://api.openai.com 如果是中转请求的话填写中转服务的地址
      base-url: your base-url
```

::: tip

在实际开发中把敏感信息以明文的方式写入到配置文件中是不安全的，可以采用以下推荐处理方案，帮助你安全的管理和使用 api-key：

- 环境变量

  将 API 密钥存储在环境变量中，然后在应用程序中读取这些变量

    - 将密钥存储在环境变量中，例如：

        ```shell
        export OPENAI_API_KEY="your-api-key-here"
        ```

    - 在 Java 代码中读取环境变量：

        ```java
        public class Config {
            public static void main(String[] args) {
                String apiKey = System.getenv("OPENAI_API_KEY");
                if (apiKey == null) {
                    throw new IllegalStateException("API key is not set in environment variables");
                }
                System.out.println("OpenAI API Key: " + apiKey);
            }
        }
        ```

    - 在配置文件中引用环境变量

        ```yaml
        openai:
          api-key: ${OPENAI_API_KEY}
        ```

- 使用秘密管理工具

  使用秘密管理工具如 AWS Secrets Manager、HashiCorp Vault 或 Azure Key Vault 来存储和管理 API 密钥

  示例（以 AWS Secrets Manager 为例）：

    - 将 API 密钥存储在 AWS Secrets Manager 中

    - 在 Java 项目中引入 AWS SDK 依赖：

      ```xml
      <dependency>
          <groupId>software.amazon.awssdk</groupId>
          <artifactId>secretsmanager</artifactId>
          <version>2.17.86</version>
      </dependency>
      ```

    - 在 Java 代码中检索密钥：

      ```java
      import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
      import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
      import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
    
      public class Config {
          public static void main(String[] args) {
              String secretName = "my_openai_api_key";
              SecretsManagerClient client = SecretsManagerClient.builder().build();
    
              GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                      .secretId(secretName)
                      .build();
    
              GetSecretValueResponse getSecretValueResponse = client.getSecretValue(getSecretValueRequest);
              String apiKey = getSecretValueResponse.secretString();
    
              System.out.println("OpenAI API Key: " + apiKey);
          }
      }
      ```

- 使用配置管理工具

  使用配置管理工具如 Spring Cloud Config 来集中管理配置和秘密信息

  示例（以 Spring Cloud Config 为例）：

    - 将 API 密钥存储在配置服务器中

    - 在 Java 项目中引入 Spring Cloud Config 依赖：

        ```xml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        ```

    - 在 application.yml 中引用配置服务器中的密钥：

        ```yaml
        openai:
          api-key: ${openai.api-key}
        ```

    - 在 Java 代码中使用 Spring 的 `@Value` 注解读取配置：

      ```java
      import org.springframework.beans.factory.annotation.Value;
      import org.springframework.stereotype.Component;
    
      @Component
      public class OpenAIConfig {
    
          @Value("${openai.api-key}")
          private String apiKey;
    
          public String getApiKey() {
              return apiKey;
          }
      }
      ```

- 加密配置文件

  如果必须将密钥存储在配置文件中，可以对配置文件进行加密，并在应用程序启动时解密

    - 使用工具（如 Jasypt）加密配置文件

    - 添加 Jasypt 依赖：

      ```xml
      <dependency>
          <groupId>com.github.ulisesbocchio</groupId>
          <artifactId>jasypt-spring-boot-starter</artifactId>
          <version>3.0.4</version>
      </dependency>
      ```

    - 在 application.yml 中使用加密后的值：

      ```yaml
      openai:
        api-key: ENC(encryptedApiKey)
      ```

    - 在 Java 代码中解密配置：

      ```java
      import org.springframework.boot.SpringApplication;
      import org.springframework.boot.autoconfigure.SpringBootApplication;
      import org.springframework.context.annotation.Bean;
      import org.springframework.core.env.Environment;
    
      @SpringBootApplication
      public class Application {
    
          public static void main(String[] args) {
              SpringApplication.run(Application.class, args);
          }
    
          @Bean
          public String apiKey(Environment env) {
              return env.getProperty("openai.api-key");
          }
      }
      ```

:::

## 聊天模型演示

### 同步 API

![ModelClient 的继承关系，可以使用 IDEA 打开对应文件按下 Ctrl+H 快捷键](https://img.sherry4869.com/blog/it/java/spring/spring-ai/3.png)

创建 ChatController.java

```java
@RestController
public class ChatController {

    /**
     * 可以在 spring-ai-spring-boot-autoconfigure-0.8.1.jar!\META-INF\spring\org.springframework.boot.autoconfigure.AutoConfiguration.imports 中看到 spring-ai 自动装配项
     * 其中包含 OpenAiAutoConfiguration
     */
    @Resource
    private OpenAiChatModel openAiChatModel;

    /**
     * 调用 Open AI 的接口
     * @param msg 用户提出的问题
     * @return 答案
     */
    @GetMapping("/ai/chat")
    public String chat(@RequestParam("msg") String msg) {
        return openAiChatModel.call(msg);
    }

}
```

运行项目以后在浏览器访问：`localhost:8080/ai/chat?msg=你想提的问题`

### 可选配置参数

文档地址：[https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)

```java
@RestController
public class ChatController {

    @Resource
    private OpenAiChatModel openAiChatModel;

    @GetMapping("/ai/chat2")
    public String chat2(@RequestParam("msg") String msg) {
        ChatResponse chatResponse = openAiChatModel.call(new Prompt(msg));
        return chatResponse.getResult().getOutput().getContent();
    }

    @GetMapping("/ai/chat3")
    public String chat3(@RequestParam("msg") String msg) {
        ChatResponse chatResponse = openAiChatModel.call(new Prompt(msg,
                OpenAiChatOptions.builder()
                        .withModel("gpt-4") // 使用的 GPT 模型（需要注意的是要查看配置的 api-key 是否有对应的模型权限）
                        .withTemperature(0.4F) // 温度越高，回答的准确率（相关性）越低；温度越低，回答的准确率（相关性）越高
                        .build()));
        return chatResponse.getResult().getOutput().getContent();
    }
}
```

也可以在配置文件中指定可选参数：

```yaml
spring:
  application:
    name: spring-ai-01-chat
  ai:
    openai:
      # 填写自己申请的 api-key 如果是直连 Open AI 官方的话需要科学上网注册一个 Open AI 账号并认证+充值；也可以找国内的第三方中转平台购买 api-key
      api-key: your api-key
      # 如果是直连 Open AI 请填写 https://api.openai.com 如果是中转请求的话填写中转服务的地址
      base-url: your base-url
      chat:
        options:
          # 默认模型为 gpt-3.5-turbo 可以点击 model 属性进入 OpenAiChatOptions.class 文件中断点 getModel() 方法查看到
          model: gpt-4
          temperature: 0.4F
```

如果配置文件与代码同时配置了可选参数，以代码的配置为主

### Stream API

![StreamingModelClient 的继承关系](https://img.sherry4869.com/blog/it/java/spring/spring-ai/4.png)

```java
@RestController
public class ChatController {

    @Resource
    private OpenAiChatModel openAiChatModel;

    @GetMapping("/ai/chat4")
    public Flux<ChatResponse> chat4(@RequestParam("msg") String msg) {
        // 流式数据的序列，一个一个数据返回
        Flux<ChatResponse> flux = openAiChatModel.stream(new Prompt(new UserMessage(msg)));
        flux.toStream().forEach(chatResponse -> {
            System.out.println(chatResponse.getResult().getOutput().getContent());
        });
        return flux;
    }
}
```

## 图像模型演示

文档地址：[https://docs.spring.io/spring-ai/reference/api/image/openai-image.html](https://docs.spring.io/spring-ai/reference/api/image/openai-image.html)

需要注意的是你的 api-key 要支持相应的图像 DALL-E 模型

```java
@RestController
public class ImageController {

    @Resource
    private OpenAiImageModel openAiImageModel;

    @GetMapping("/ai/image")
    public Object image(@RequestParam("msg") String msg) {
        ImageResponse imageResponse = openAiImageModel.call(new ImagePrompt(msg));
        System.out.println(imageResponse);
        String url = imageResponse.getResult().getOutput().getUrl();
        // 相关的图片业务处理
        return imageResponse.getResult().getOutput();
    }
}
```

### 可选配置参数

```java
@RestController
public class ImageController {

    @Resource
    private OpenAiImageModel openAiImageModel;

    @GetMapping("/ai/image2")
    public String image2(@RequestParam("msg") String msg) {
        ImageResponse imageResponse = openAiImageModel.call(new ImagePrompt(msg,
                new OpenAiImageOptions().builder()
                        .withQuality("hd") // 高清图片
                        .withN(2) // 生成2张图片
                        .withWidth(1024) // 图片宽度
                        .withHeight(1024) // 图片高度
                        .build()));
        System.out.println(imageResponse);
        String url = imageResponse.getResult().getOutput().getUrl();
        // 相关的图片业务处理
        return url;
    }
}
```

## 音频模型演示

文档地址：[https://docs.spring.io/spring-ai/reference/api/audio/transcriptions/openai-transcriptions.html](https://docs.spring.io/spring-ai/reference/api/audio/transcriptions/openai-transcriptions.html)

音频默认的模型是 whisper-1

### 语音转文本

```java
@RestController
public class TranscriptionController {

    @Resource
    private OpenAiAudioTranscriptionModel openAiAudioTranscriptionModel;

    @GetMapping("/ai/transcription")
    public String transcription() {
        ClassPathResource classPathResource = new ClassPathResource("test.flac");
        return openAiAudioTranscriptionModel.call(classPathResource);
    }
}
```

### 文本转语音

```java
@RestController
public class TTSController {

    @Resource
    private OpenAiAudioSpeechModel openAiAudioSpeechModel;

    @GetMapping("/ai/tts")
    public Boolean tts() {
        byte[] call = openAiAudioSpeechModel.call("这是一段待转成语音的文字");
        return save2File("D:\\SpringAI\\test.mp3", call);
    }

    private boolean save2File(String fileName, byte[] msg) {
        OutputStream outputStream = null;
        boolean flag = true;
        try {
            File file = new File(fileName);
            File parentFile = file.getParentFile();
            if (!parentFile.exists() && !parentFile.mkdirs()) {
                return false;
            }
            outputStream = new FileOutputStream(file);
            outputStream.write(msg);
            outputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                    return false;
                }
            }
        }
        return flag;
    }

}
```

## 多模态API

多模态是指模型同时理解和处理来自各种来源信息的能力，包括文本、图像、音频和其他数据格式

多模式大语言模型（LLM）特征使模型能够结合其他模态（如图像、音频或视频）来处理和生成文本

Spring AI 多模态 API 提供了所有必要的统一抽象和代码封装来支持多模式 LLM

文档地址：[https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html#_multimodal](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html#_multimodal)

```java
@RestController
public class MultiModelController {

    @Resource
    private OpenAiChatModel openAiChatModel;

    /**
     * 多模态API
     *
     * @param msg      文字
     * @param imageUrl 图片地址
     *                 调用示例：localhost:8080/ai/multi?msg=请描述一下这张图片&imageUrl=https://xxx.jpg
     */
    @GetMapping("/ai/multi")
    public String multi(@RequestParam("msg") String msg, @RequestParam("imageUrl") String imageUrl) throws Exception {
        UserMessage userMessage = new UserMessage(msg, List.of(new Media(MimeTypeUtils.IMAGE_PNG, new URL(imageUrl))));
        ChatResponse response = openAiChatModel.call(new Prompt(List.of(userMessage), OpenAiChatOptions.builder().withModel(OpenAiApi.ChatModel.GPT_4_O.getValue()).build()));
        return response.getResult().getOutput().getContent();
    }
}
```