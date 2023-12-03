---
date: 2022-07-28
category: IT
---

# Docker

<!-- more -->

官网：[https://docs.docker.com/reference](https://docs.docker.com/reference/)

## Docker 简介

Docker 是一种轻量级的虚拟化技术，也是一个开源的应用容器引擎。它可以让开发者将他们的应用以及依赖包打包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 操作系统的机器上。容器是完全使用沙箱机制，相互之间不会有任何接口

举个例子，假设你想要在你的电脑上运行一个 Python 程序，但是你没有安装 Python 环境。你可以使用 Docker 来创建一个包含 Python 环境和你的程序代码的镜像（image），然后用 Docker 运行这个镜像，就可以在容器（container）中执行你的程序了。这样就不需要在你的电脑上安装 Python 环境，也不需要担心和其他程序产生冲突

**Docker 的主要优势有：**

- 轻量级：Docker 使用了 Linux 内核的特性，如 cgroups 和 namespace，来实现资源隔离和安全性，而不需要启动完整的虚拟机

- 可移植性：Docker 可以将应用程序及其依赖打包成一个镜像文件，然后在任何支持 Docker 的平台上运行，无需关心底层的硬件和操作系统差异

- 效率高：Docker 利用了镜像层的概念，可以实现镜像的复用和共享，从而节省磁盘空间和网络带宽，并加快应用程序的启动速度

- 易于管理：Docker 提供了一套简单而强大的指令行工具和 API，可以方便地创建、运行、停止、删除、监控和管理容器

**Docker 和虚拟机的区别主要有以下几点：**

- 启动速度：虚拟机需要先启动虚拟机的操作系统，再启动应用，这个过程非常慢；而启动 Docker 相当于启动宿主操作系统上的一个进程，只需要几秒钟

- 占用资源：虚拟机是一个完整的操作系统，需要占用大量的磁盘、内存和 CPU 资源，一台机器只能开启几十个的虚拟机；而 Docker 是基于 Linux 内核的容器技术，可以共享宿主操作系统的资源，一台机器可以开启数千个的容器

- 隔离性：虚拟机之间是完全隔离的，安全性较高，但也导致了通信和迁移的困难；而 Docker 之间是部分隔离的，安全性较低，但也便于了通信和迁移

**适合使用 Docker 的场景：**

- 简化配置：如果你需要在不同的环境中运行同一个应用程序，而且应用程序有很多依赖和配置，那么使用 Docker 可以让你将运行环境和配置打包成一个镜像文件，然后在任何支持 Docker 的平台上运行，无需再进行额外的安装和设置

- 快速部署：如果你需要频繁地更新和发布你的应用程序，而且要求部署速度快，那么使用 Docker 可以让你利用镜像层的特性，只更新变化的部分，而不需要重新构建整个镜像文件

- 微服务架构：如果你需要将你的应用程序拆分成多个独立的服务，而且要求服务之间能够灵活地通信和协作，那么使用 Docker 可以让你将每个服务封装成一个容器，并通过网络连接起来

**适合使用虚拟机的场景：**

- 高安全性：如果你需要在一个物理机上运行多个不同的操作系统或者应用程序，并且要求它们之间完全隔离和保密，那么使用虚拟机可以让你利用虚拟化技术，在物理机上创建多个虚拟硬件，并为每个虚拟硬件安装不同的操作系统或者应用程序

- 复杂环境：如果你需要在一个物理机上模拟复杂的网络或者系统环境，并且要求它们能够相互影响和交互，那么使用虚拟机可以让你利用虚拟化技术，在物理机上创建多个虚拟硬件，并为每个虚拟硬件配置不同的网络或者系统参数

## Docker 的三个概念

镜像（Image）：类似于虚拟机中的镜像文件，是一个包含有文件系统的面向 Docker 引擎的只读模板。任何应用程序运行都需要环境，而镜像就是用来提供这种运行环境的。例如一个 Ubuntu 镜像就是一个包含 Ubuntu 操作系统环境的模板，同理在该镜像上装上 Apache 软件，就可以称为 Apache 镜像

容器（Container）：类似于一个轻量级的沙盒，可以将其看作一个极简的 Linux 系统环境（包括root权限、进程空间、用户空间和网络空间等），以及运行在其中的应用程序。Docker 引擎利用容器来运行、隔离各个应用。容器是镜像创建的应用实例，可以创建、启动、停止、删除容器，各个容器之间是是相互隔离的，互不影响。注意：镜像本身是只读的，容器从镜像启动时，Docker 在镜像的上层创建一个可写层，镜像本身不变

仓库（Repository）：类似于代码仓库，这里是镜像仓库，是 Docker 用来集中存放镜像文件的地方。注意与注册服务器（Registry）的区别：注册服务器是存放仓库的地方，一般会有多个仓库；而仓库是存放镜像的地方，一般每个仓库存放一类镜像，每个镜像利用 tag 进行区分，比如 Ubuntu 仓库存放有多个版本（12.04、14.04等）的 Ubuntu 镜像

## 安装 Docker

**yum 源中默认的 Docker 和社区版 Docker（docker-ce）的区别：**

- 版本号：yum 源中默认的 Docker 是旧版本的命名方式，比如 1.13、17.03 等，而社区版 Docker（docker-ce）是新版本的命名方式，采用时间线的形式，比如 19.10、20.10 等

- 功能：yum 源中默认的 Docker 是基本功能的集合，而社区版 Docker（docker-ce）是包含了更多新特性和实验性功能的集合

- 更新：yum 源中默认的 Docker 是不定期更新的，而社区版 Docker（docker-ce）是每个月更新一次的

- 兼容性：yum 源中默认的 Docker 可能与某些操作系统或硬件不兼容，而社区版 Docker（docker-ce）是经过官方测试认证过的，更加稳定和安全

### CentOS7

Docker 运行在 CentOS-6.5 或更高的版本的 CentOS 上，要求系统为 64 位、系统内核版本为 2.6.32-431 或者更高版本

Docker 运行在 CentOS 7 上，要求系统为 64 位、系统内核版本为 3.10 以上

uname 指令用于打印当前系统相关信息（内核版本号、硬件架构、主机名称和操作系统类型等）

```shell
uname -r
```

查看已安装的 CentOS 版本信息

```shell
cat /etc/redhat-release
```

#### 安装 yum 源中默认的 Docker

```shell
yum -y install docker
```

#### 安装社区版 Docker（docker-ce）

1. 安装软件包：

    yy -utils 提供了 yy-config-manager 相关功能，device-mapper-persistent-data 和 lvm2 是设备映射器驱动程序所需要的
    
    ```shell
    yum install -y yum-utils \
                   device-mapper-persistent-data \
                   lvm2
    ```

2. 设置 Docker 下载镜像

    ```shell
    yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    ```

3. 更新 yum 软件包索引

    我们在更新或配置 yum 源之后，通常都会使用 yum makecache 生成缓存，这个指令是将软件包信息提前在本地缓存一份，用来提高搜索安装软件的速度
    
    ```shell
    yum makecache fast
    ```

4. 安装 docker-ce

    ```shell
    yum install -y docker-ce
    ```

5. 查看 Docker 版本

    ```shell
    docker -v
    docker version
    ```

6. 启动 Docker

    ```shell
    systemctl start docker
    ```
7. 查看 Docker 服务的运行状态

    ```shell
    systemctl status docker
    ```

### Alibaba Cloud Linux 2

查看操作系统版本

```shell
cat /etc/redhat-release
```

#### 安装 yum 源中默认的 Docker

```shell
yum -y install docker
```

#### 安装社区版 Docker（docker-ce）

Alibaba Cloud Linux 2 操作系统已经预装了 yum-utils、device-mapper-persistent-data、lvm2 等依赖包，因此无需再次安装

1. 下载 docker-ce 的 yum 源

    ```shell
    wget -O /etc/yum.repos.d/docker-ce.repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    ```

2. 安装 Alibaba Cloud Linux 2 专用的 yum 源兼容插件

    说明：仅当实例为 Alibaba Cloud Linux 2 操作系统时，需要运行该指令
    
    ```shell
    yum install yum-plugin-releasever-adapter --disablerepo=* --enablerepo=plus
    ```

3. 安装 docker-ce

    ```shell
    yum -y install docker-ce
    ```

4. 查看 Docker 版本

    ```shell
    docker -v
    docker version
    ```

5. 启动 Docker 服务

    ```shell
    systemctl start docker
    ```

6. 查看 Docker 服务的运行状态

    ```shell
    systemctl status docker
    ```

## 设置开机启动

```shell
# 查看服务是否自动启动
systemctl list-unit-files|grep docker.service 

# 设置开机启动：如不是 enabled 可以运行以下设置指令自启动
systemctl enable docker
# 重新加载服务配置
systemctl daemon-reload 

# 如果希望不进行自启动，运行以下设置指令
systemctl disable docker
# 重新加载服务配置
systemctl daemon-reload 
```

## 卸载 Docker

```shell
systemctl stop docker 
yum remove -y docker-ce
# 需要注意不同版本的安装路径可能有所不同，例如：/var/lib/docker或者/usr/libexec/docker，需要通过 find / -name docker 指令来查找确认
rm -rf /usr/libexec/docker
```

## 常用指令

### docker start

用于启动一个或多个已停止的容器。可以在指令后面指定要启动的容器的 ID 或名称。例如：

```shell
docker start my_container
```

如果想要启动所有已停止的容器，使用以下指令：（谨慎使用该指令，如果容器特别多的话会导致服务器的内存瞬间爆满）

```shell
docker start $(docker ps -a -q)
```

### docker restart

用于重启一个或多个容器（不管是否正在运行的容器）。可以在指令后面指定要重启的容器的 ID 或名称。例如：

```shell
docker restart my_container
```

如果想要重启所有容器（不管是否正在运行的容器），使用以下指令：（谨慎使用该指令，如果容器特别多的话会导致服务器的内存瞬间爆满）

```shell
docker restart $(docker ps -a -q)
```

### docker stop

用于停止一个或多个正在运行的容器。可以在指令后面指定要停止的容器的 ID 或名称。例如：

```shell
docker stop my_container
```

如果想要停止所有正在运行的容器，使用以下指令：

```shell
docker stop $(docker ps -q)
```

### docker rm

用于删除一个或多个已停止的容器。可以在指令后面指定要删除的容器的 ID 或名称。例如：

```shell
docker rm my_container
```

如果想要删除所有已停止的容器，使用以下指令：（注意：该指令与 `docker container rm` 指令是等效的）

```shell
docker rm $(docker ps -a -q)
```

### docker rmi

用于删除一个或多个 Docker 镜像。可以在指令后面指定要删除的镜像的 ID 或名称。例如：

```shell
docker rmi my_image
```

如果想要删除所有不使用的镜像，使用以下指令：（注意，只有没有容器引用的镜像才能被删除。如果你想要强制删除被引用的镜像，添加 `-f` 选项）

```shell
docker image prune -f -a
```

### docker exec

```shell
docker exec -it my_container env LANG=C.UTF-8 /bin/bash
```

让你在运行中的容器里执行一个交互式的指令。-i 选项表示即使没有附加也保持 STDIN 打开，这样你可以输入指令或数据。 `-t` 选项表示分配一个伪终端，这样你可以看到指令的输出或错误信息。这两个选项通常一起使用，以便与容器互动

/bash shell 是一种指令行解释器，它可以让你在容器里执行各种指令。 它是 Linux 系统的默认 shell，也是很多容器的默认 shell。 通过 `docker exec -it /bin/bash`，你可以进入容器的 bash shell，并在里面执行任何你想要的指令

`env LANG=C.UTF-8` 避免容器中显示中文乱码

### docker ps

用于列出当前运行的容器（container），可以加上 `-a` 选项来显示所有的容器，包括已经停止的容器

### docker images

用于列出本地存储的镜像（images），可以加上 `-a` 选项来显示所有的镜像，包括中间层的