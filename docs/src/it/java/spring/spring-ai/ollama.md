---
category: IT
article: false
order: 3
---

# Ollama

## 概述

官网：[https://ollama.com](https://ollama.com)

Ollama 是一个用于部署和运行各种开源大模型的工具

Ollama 的运行受到所使用模型大小的影响：

- 例如运行一个 7B（70亿参数）的模型至少需要 8GB 的可用内存（RAM），运行一个 13B（130亿参数）的模型需要 16GB 的内存，33B （330亿参数）的模型需要 32GB 的内存

- 需要考虑有足够的磁盘空间，大模型的文件大小可能比较大，建议至少为 Ollama 和其模型预留 50GB 的磁盘空间

- 性能较高的 CPU 可以提供更好的运算速度和效率，多核处理器能够更好地处理并行任务

- Ollama 支持纯 CPU 运行，但如果电脑配备了显卡（GPU），可以利用 GPU 进行加速，提高模型的运行速度和性能


模型列表：[https://ollama.com/library](https://ollama.com/library)

运行模型命令：ollama run 模型:版本

```shell
Welcome to Ollama!
Run your first model:
      ollama run llama2

PS C:\Windows\system32> ollama run qwen:0.5b-chat
```

Ollama 默认会监听 11434 端口，Windows 上可以在 DOS 命令窗口执行 `netstat -ano | findstr 11434` 命令进行查看

## 创建应用项目

![](https://img.sherry4869.com/blog/it/java/spring/spring-ai/5.png)

依赖文件

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
	<artifactId>spring-ai-06-ollama</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>spring-ai-06-ollama</name>
	<description>spring-ai-06-ollama</description>
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
			<artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
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
    name: spring-ai-06-ollama
  ai:
    ollama:
      base-url: http://localhost:11434
```

创建 OllamaController.java

```java
@RestController
public class OllamaController {

    @Resource
    private OllamaChatModel ollamaChatModel;

    @GetMapping("/ai/ollama")
    public String ollama(@RequestParam("msg") String msg) {
        return ollamaChatModel.call(msg);
    }

}
```

需要注意的是，OllamaModel 默认访问 mistral 模型：

```java
public enum OllamaModel implements ModelDescription {
    LLAMA2("llama2"),
    LLAMA3("llama3"),
    MISTRAL("mistral"),
    DOLPHIN_PHI("dolphin-phi"),
    PHI("phi"),
    PHI3("phi3"),
    NEURAL_CHAT("neural-chat"),
    STARLING_LM("starling-lm"),
    CODELLAMA("codellama"),
    ORCA_MINI("orca-mini"),
    LLAVA("llava"),
    GEMMA("gemma"),
    LLAMA2_UNCENSORED("llama2-uncensored");

    private final String id;

    private OllamaModel(String id) {
        this.id = id;
    }

    public String id() {
        return this.id;
    }

    public String getModelName() {
        return this.id;
    }
}
```

如果想用其他模型，例如阿里的通义千问（qwen）：

```yaml
spring:
  application:
    name: spring-ai-05-ollama
  ai:
    ollama:
      base-url: https://api.openai.com
      chat:
        options:
          model: qwen:0.5b-chat
```

## Web & Desktop

::: tabs

@tab Open WebUI

Github：[https://github.com/open-webui](https://github.com/open-webui)

官网：[https://www.openwebui.com](https://www.openwebui.com)

@tab Lobe Chat

Github：[https://github.com/lobehub/lobe-chat](https://github.com/lobehub/lobe-chat)

官网：[https://lobehub.com](https://lobehub.com)

:::