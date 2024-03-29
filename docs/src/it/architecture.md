---
category: IT
article: false
---

# 项目架构演进

<!-- more -->

企业尤其是发展到一定规模以后，往往会面临业务种类繁多，业务高度依赖的问题。而随着业务的发展，企业内的部门也会越来越多，分工也越来越细，部门之间的依存度和沟通成本也会越来越高。如果企业缺乏总体的规划，缺乏应对时长变化的快速反应能力和高效支撑商业模式创新的机制，企业的运营和创新的成本也将会大大的增加。为了提高时长响应能力，解决商业模式的创新问题，越来越多的企业开始尝试数字化转型。在这个过程中，企业项目的架构也会随着波动和变化

## 传统企业的数字化转型过程

随着企业的发展和自主研发的能力和提升，企业信息系统建设可能会经历产品外购，外包，自主研发，甚至集团统一运营建设阶段

- 第一阶段 **以产品购买为主**：这个阶段企业的规模较小，或者是初创阶段，短时间内难以形成自主研发的能力，一般采用外购产品和系统。存在的问题就是：早期购买成熟的套件产品，往往是会把很多的功能打包在一个软件系统中，也称之为单体应用，即“一个系统打天下”的局面。导致产品的耦合度超高，扩展能力不强，出现很多用不着，不能灵活定制的等问题

- 第二阶段 **自主研发为辅，外包为主**：随着企业业务的发展，企业的技术人员得到一定地补充，并具备了研发和设计的能力以后，企业系统建设模式会慢慢转型为以自主研发为辅，外包为主的模式。存在的问题就是：产品的自主权不能自己控制，拖延扯皮，沟通就会变得非常的复杂

- 第三个阶段 **自主研发为主，外包为辅**：当企业内部研发人员达到相当规模，企业 IT 团队有能力实现核心业务全流程自动研发，现在大部分的企业都会选择这种开发模式。好处就是企业能够完全的自控和可控

- 第四个阶段 **集团统一运营模式**：对于大型跨国经营的集团，不同子公司之间可能由于早期缺少统一规划，因此在技术栈和应用系统上存在较大的差异，导致集团内部出现大量的 IT 重复投入和重复建设，难以在集团内实现交叉销售和商业模式的创新

    集团的统一运营模式是通过集团内统一规划，统筹管理，统一运营，重构中台业务模型、统一技术标准、统一云环境和优化运营体系等，实现集团内各子公司之间业务流程的共享和联通，技术体系的标准统一和资源共享信息系统建设模式

    近些年来，越来越多的大型企业开始学习阿里巴巴的实施中台数字化转型战略。这种模式改变了集团内各子公司“山头林立，各自为政”的 IT 建设方式，可以在整个集团实施企业级业务能力复用和集团统一运营

## 服务技术架构的演进

### 原始分布式时代

可能与绝大多数人的认知有些差异，“使用多个独立的分布式服务共建一个更大型的系统”的设想与实际的尝试，其实要比今天大家所了解的大型单体系统出现的时间更早

在上个世纪 70 年代末 80 年代初，计算机科学刚经历了从以大型机为主向微型机为主的蜕变过程。此时的微型计算机系统具有 16 位寻址能力，不足 5MHZ 时钟频率的处理器和 128kb 左右的内存地址空间。当时的计算机硬件有限的运算能力和处理能力，已直接影响到了单台计算机上信息系统软件能够达到的最大规模。这个阶段分布式架构是最原始地探索，从结果来看，历史局限决定了它不可能一蹴而就地完成分布式的难题。但是从过程来看，这个阶段的探索称得上成绩斐然。研究的过程中很多成果都对今天计算机科学的诸多领域产生了深远的影响。并直接推动了后续软件架构的演化进程

### 单体架构时代

单体架构系统是今天绝大多数软件开发者都学习并实践过的一种软件架构，在整个软件架构演进的历史进程这里，出现最早，应用范围最广，使用人数最多，统治历史最长的一种架构风格。这个阶段通常采用面向过程的设计方法，系统包括客户端的 UI 层和数据库层两层，通常采用 C/S 架构，大多采用结构化编程方式，系统围绕数据库驱动设计和开发，总是从设计数据库和字段开始

Web 应用程序发展的早期，大部分 web 工程是将所有的功能模块（service side）打包到一起并放在一个 web 容器中运行，很多企业的 Java 应用程序打包为 war 包。其他语言（Ruby，Python 或者 C++）写的程序也有类似的问题。假设你正在构建一个在线商店系统：客户下订单、核对清单和信用卡额度，并将货物运输给客户。很快，你们团队一定能构造出如下图所示的系统：

> 一个归档包（例如 war 格式或者 Jar 格式）包含了应用所有功能的应用程序，我们通常称之为单体应用。架构单体应用的方法论，我们称之为单体应用架构，这是一种比较传统的架构风格

![](https://img.sherry4869.com/blog/it/architecture/img.png)

**缺陷：**

集中式的单体架构往往会将多个功能放到一个应用中，经过日积月累，这个应用就会变成一个庞大而复杂的“怪物”，随着项目团队成员的更替，时间一长就很少有人能够完全的搞懂这些代码之间的逻辑关系

有些人可能会因为担心修改遗留代码而出现不可预知的 BUG，而宁愿增加大量不必要的代码，这样会导致应用越来越庞大，越来越复杂，可读性越来越差，最终陷入恶性循环。对于整个团队来说，系统研发工作编程了一件及其痛苦的事情

### SOA开发架构时代

SOA 是 Service-Oriented Architecture 的英文缩写，就是面向服务的架构

企业服务总线 ESB 是面向服务架构（SOA）的核心构成部分，指传统数据连接技术（web、xml、中间件技术）结合的产物，简单来说，就是一根管道，用来连接各个服务节点，为了集成不同系统，不同协议的服务，服务总线做了消息的转化解释和路由工作，让不同的服务互联互通；是一个具有标准接口、实现了互连、通信、服务路由

总线需要具备的功能：

1. 服务统一管理：为整个系统提供一个统一、标准。可靠 、可扩展的服务管理平台

2. 集成服务：提供基础的服务与定制的服务，支持集成服务模式，支持服务的分解，服务调度和路由、封装及组合

3. 公用服务：提供内置的各种公共服务，如，认证服务、日志服务等

4. 服务协议转换：通过把不同的通信协议转换为标准的报文，屏蔽异构系统的底层技术差异

5. 服务监控：提供服务等级管理及流量管理

6. 安全体系：提供多种安全机制并支持和第三方安全系统的有效集成

SOA 是集成多个较大组件（一般是应用）的一种机制，将整体构成一个彼此协作的套件，一般来说每个组件会从始至终执行一个完整的业务逻辑。SOA 中包含多个服务，服务之间通过相互依赖最终提供一系列的功能。一个服务通常以独立的形式存在于操作系统进程中。各个服务之间，通过网络调用

**特点：**

1. 系统集成：从系统角度讲，解决了企业系统与系统间通信问题，把原来散乱、无规划的系统间的网状结构梳理成规整，可治理的系统。在梳理时则需要引用一些产品，常用的是企业服务总线（ESB）、技术规范、服务管理规范。主要解决核心问题，无序变有序

2. 系统的服务化：从功能角度讲，把业务转换成可复用、可组装的服务，通过服务的编排实现业务的快速复制。目的是把原先固有的业务功能转变为通用的业务服务，实现快速复用。主要解决的核心问题，原来固有业务可复用

3. 业务的服务化：从企业的角度讲，把原来职能化的企业架构转变为服务化的企业架构，进一步提升企业的对外服务能力。把一个业务单元封装成一项服务。主要解决的核心问题是高效

### 微服务架构开发时代

跟 SOA 类似，在 SOA 上做了升华，微服务架构强调业务需要彻底的组件化和服务化，在微服务架构中，系统的业务逻辑被拆分成为一系列小而松散耦合的分布式组件（组件一般指应用），共同构成较大的应用。每个组件都被称为微服务，而每个微服务都在整体架构中执行着单独的任务或单独的功能。每个微服务可能会被一个或多个其它微服务调用，以执行较大应用需要完成的具体任务

比如：假设一个 APP 中有积分体系功能，现需要更新积分，只需要更新发布积分的微服务即可，其他的功能正常运行，不受影响。而不是将整个业务系统都停掉，所有的功能都要暂停一会儿，等发布积分的服务才能使用。

**特点：**

- 分布式系统：

    - 独立部署：微服务可以独立部署，每个服务可以有自己的开发、测试和部署周期。这使得团队可以更加灵活和快速地推送新的功能和变更

    - 分散式数据管理：数据通常分散在不同的服务中，每个服务负责自己的数据管理。这带来了一些挑战，例如数据一致性和事务管理

- 自治性：

   - 独立开发和运行：微服务是自治的，它们拥有独立的代码库、数据库和运行时。这意味着每个服务团队可以独立地选择技术栈和开发工具，不受其他服务的限制

   - 独立伸缩：每个服务都可以独立水平伸缩，根据需要增加或减少实例数量

- 服务间通信：

   - 轻量级通信：微服务之间的通信通常采用轻量级的协议，例如 HTTP/REST 或消息队列。这种松耦合的通信方式使得服务之间更容易替换、升级和扩展

   - API 接口：微服务通过定义清晰的 API 接口来暴露功能，使得其他服务可以访问其功能而无需关心内部实现细节

- 弹性和容错性：

    - 容错设计：微服务架构通常鼓励设计弹性和容错的服务，使得即使其中的某个服务失败，整个系统仍能保持可用性

    - 断路器模式：微服务可以采用断路器模式，当一个服务不可用时，可以断开对该服务的请求，避免故障传播

- 多语言和技术栈：微服务允许每个服务选择适合自己需求的编程语言和技术栈。这种多样性使得团队可以更好地选择最适合其任务的工具和框架

- 去中心化管理：微服务的团队结构通常是去中心化的，每个服务有自己的开发团队。这鼓励更快地开发和创新，并减少了组织层级的瓶颈

- DevOps 文化

    - 自动化运维：微服务架构需要配合自动化运维和持续集成/持续交付（CI/CD）的实践，以确保快速且可靠的部署和更新

    - 监控和日志：强调在生产环境中对微服务进行监控，收集日志以便及时发现和解决问题

- 微前端：前端分解：微服务不仅仅限于后端，微前端是一种将前端应用程序拆分为小型、独立的部分的方法，每个部分由独立的团队开发和部署

### 中台架构

随着公司业务高速发展，组织不断膨胀的过程中暴露的问题需要解决。将企业的核心能力随着业务不断发展以数字化形式沉淀到平台，形成以服务为中心，由业务中台和数据中台构建起数据闭环运转的运营体系，供企业更高效的进行业务探索和创新

中台架构（Middle-End Architecture）是一种将系统划分为前端（Front-End）和后端（Back-End）的中间层，这个中间层承担了一部分业务逻辑和数据处理的任务。中台架构的目标是提高业务的灵活性、可维护性，并加速业务的迭代和创新

**中台与微服务的关系：**

- 微服务是独立开发、维护、部署的小型业务组件，一种技术架构

- 中台是提升企业的能力的复用，一种方法论/思想

**类比：**

微服务就是：将整个军队分散为若干个军区，每个军区之间确定各自驻防的边界划分，至于各军区如何行军、如何存放军火、如何部署兵力，不作统一规定，各军区自行决断，各军区的人当然也不能进入其他军区的地盘，但各作战单位必须遵守共同的通讯频道，必须满足对其他军区的服务契约

中台就是：建立强大的火箭军、炮兵。空军。无人机部队、信息化部队等，如此一来，前方作战小分队可以很小，一个班的人要攻打一个山头，只要侦查清楚这个山头的特定地形和敌军布防，然后就根据情况呼叫空军地毯式轰炸。呼叫炮兵火力覆盖、呼叫无人机定点清除、呼叫信息化部队电子干扰...一个班就可以搞定

虽然这两个概念并不互斥，但是微服务听起来更像是【守城】，就是对现有地盘的加强和巩固。而中台更支持【开拓】，主要目的是更灵活地拓展新的业务

下面是中台架构的一些关键特点和优势：

- 前后端分离：中台架构鼓励前后端分离，前端负责展示和用户交互，后端负责业务逻辑和数据处理。中台则位于前后端之间，负责一部分业务逻辑和数据的处理，形成了一个中间层

- 业务中台和技术中台：

    - 业务中台：业务中台关注业务领域的抽象和标准化，提供通用的业务组件和服务，使得业务可以更容易地组合和定制

    - 技术中台：技术中台则关注通用的技术能力和基础设施，提供一些通用的技术服务，例如认证、授权、日志、监控等，以支持业务中台和整个系统

- 标准化和组件化：中台架构鼓励标准化和组件化的设计，将通用的业务逻辑和技术能力封装为可重用的组件。这使得业务能够更快速地搭建新的功能，同时减少了重复开发的工作

- 业务创新和快速迭代：中台架构通过提供通用的业务组件，使得业务能够更专注于业务创新。中台的快速迭代和升级，也有助于业务更快速地适应市场变化

## 网站架构的演进

### 静态网页

![](https://img.sherry4869.com/blog/it/architecture/img_2.png)

### Java web 时代

![](https://img.sherry4869.com/blog/it/architecture/img_3.png)

### 单体架构的模式

![最初形态](https://img.sherry4869.com/blog/it/architecture/img_4.png)

![分离文件服务器和数据库服务器](https://img.sherry4869.com/blog/it/architecture/img_5.png)

![缓存中间件形态](https://img.sherry4869.com/blog/it/architecture/img_6.png)

### 集群架构的模式

![最初形态](https://img.sherry4869.com/blog/it/architecture/img_7.png)

![读写分离版本](https://img.sherry4869.com/blog/it/architecture/img_8.png)

![读写分离数据库集群版本](https://img.sherry4869.com/blog/it/architecture/img_9.png)

![搜索引擎技术](https://img.sherry4869.com/blog/it/architecture/img_10.png)

### 微服务架构方式

![最初形态](https://img.sherry4869.com/blog/it/architecture/img_11.png)

![异步消息队列方式](https://img.sherry4869.com/blog/it/architecture/img_12.png)