---
category: IT
article: false
order: 1
---

# 概述

官网：[https://spring.io/projects/spring-ai](https://spring.io/projects/spring-ai)

Spring AI 是一个人工智能工程应用框架。其目标是将 Spring 生态系统的设计原则（如可移植性和模块化设计）应用于人工智能领域，并推广使用 POJO 作为人工智能领域应用程序的构建模块

Spring AI 提供的 API 支持跨人工智能提供商的聊天、文本到图像、嵌入模型等。同时支持同步和流 API 选项

## 聊天模型

- OpenAI

- Azure Open AI

- Amazon Bedrock

  - Cohere's Command

  - AI21 Labs' Jurassic-2

  - Meta's LLama 2

  - Amazon's Titan

- Google Vertex AI Palm

- Google Gemini

- HuggingFace - access thousands of models, including those from Meta such as Llama2

- Ollama - run AI models on your local machine

- MistralAI

## 文本到图像模型

- OpenAI with DALL-E

- StabilityAI

## 转录（音频到文本）模式

- OpenAI

## 嵌入模型

- OpenAI

- Azure OpenAI

- Ollama

- ONNX

- PostgresML

- Bedrock Cohere

- Bedrock Titan

- Google VertexAI

- Mistal AI

## 矢量数据库

矢量存储应用程序接口（Vector Store API）可在不同的提供商之间进行移植，其特点是新颖的类似于 SQL 的元数据过滤应用程序接口（Metadata Filtering API），可保持移植性

- Azure Vector Search

- Chroma

- Milvus

- Neo4j

- PostgreSQL/PGVector

- PineCone

- Redis

- Weaviate

- Qdrant

## 针对人工智能模型和矢量存储的 Spring Boot 自动配置和启动器

函数调用，您可以向 OpenAI 模型声明实现，以便在其提示响应中使用。您可以直接将这些函数作为对象提供，或者在应用程序上下文中作为 `@Bean` 注册时引用其名称。此功能可最大限度地减少不必要的代码，并使 AI 模型能够询问更多信息以完成其响应

- OpenAI

- Azure OpenAI

- VertexAI

- Mistral AI

## 数据工程的 ETL 框架

ETL 框架的核心功能是使用矢量存储（Vector Store）促进文档向模型提供者的传输。ETL 框架基于 Java 函数编程概念，可帮助您将多个步骤串联起来

支持读取各种格式的文档，包括 PDF、JSON 等

该框架允许根据您的需要进行数据操作。这通常涉及拆分文档以适应上下文窗口的限制，并用关键字增强文档以提高文档检索效率

最后，处理过的文档会存储在矢量数据库中，以便今后检索

## 广泛的参考文档、示例应用和研讨会/课程材料

未来的版本将在此基础上提供对其他人工智能模型的访问，例如谷歌刚刚发布的 Gemini 多模式模态、评估人工智能应用有效性的框架、更多便利的应用程序接口以及帮助解决“查询/汇总我的文档”用例的功能。有关即将发布的版本的详细信息，请查看 GitHub