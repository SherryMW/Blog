---
date: 2023-02-28
category: IT
article: false
---

# MinIO

<!-- more -->

[MinIO 官网](https://min.io/)

[MinIO 代码仓库](https://github.com/minio/minio)

## 搭建

待更新

## 常用指令

::: info 启动 minio 服务
nohup /usr/local/bin/minio server --address 0.0.0.0:9000 --console-address 0.0.0.0:50000 /data/aws_s3 &

- nohup 指令可以阻止进程收到 SIGHUP 信号，这是一个在关闭或退出终端时发送给进程的信号。如果收到这个信号，进程会被终止。所以 nohup 指令可以让进程在退出终端后继续运行

- /usr/local/bin/minio server 是 MinIO 服务器的可执行文件路径

- --address 0.0.0.0:9000 是指定 MinIO 服务器监听的地址和端口号。这里的 0.0.0.0 表示监听所有网络接口，而 9000 是默认的端口号

- --console-address 0.0.0.0:50000 是指定 MinIO 控制台（一个用于管理和监控 MinIO 集群的 Web 界面）监听的地址和端口号。这里的 50000 是一个自定义的端口号，可以根据需要修改

- /data/aws_s3 是指定 MinIO 服务器存储对象数据的目录。这里可以使用本地连接的驱动器或分区，也可以使用多个目录来实现分布式模式

- & 是指在后台运行这个指令，不占用当前终端，但是如果退出终端，后台运行的进程还是会收到 SIGHUP 信号并被终止。所以如果想要让进程在退出终端后仍然在后台运行，可以同时使用 nohup 和 & 指令
:::

## 常见问题

**Caused by: io.minio.errors.ErrorResponseException: Access denied**

此错误可能是由你的服务器和 Minio 服务器之间的时差引起的。你可能需要将服务器时间与 Minio 服务器时间同步才能解决此问题

---

**Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [io.minio.MinioClient]: Factory method 'minioClient' threw exception; nested exception is error occurred
ErrorResponse(code = AccessDenied, message = Access denied, bucketName = points, objectName = null, resource = /points, requestId = 1747E61A6F8C54CC, hostId = null)**

可能是由于你使用了 MinioClient 类来连接一个对象存储服务，但是没有正确的权限或配置

- 检查 MinIO 客户端 http://{ip}:{port}/minio 是否能正常访问
- 检查 MinIOClient 的参数，比如 endpoint，accesskey，secretKey 等是否正确。MinIOClient 默认账号密码是 minioadmin，如果 accessKey 和 secretKey 配置的不是默认值，则需要更新账号密码
  
  Root user name (access key) and root password (secret key) are expected to be specified via environment variables MINIO_ROOT_USER and MINIO_ROOT_PASSWORD respectively
  
  MINIO_ACCESS_KEY 和 MINIO_SECRET_KEY 已弃用了，要使用新的 MINIO_ROOT_USER 和 MINIO_ROOT_PASSWORD 去设置账号密码
  ```shell
  # 查看 minio 进程 PID
   ps -ef|grep minio
  # 杀死进程
  kill -9 {PID}
  # 更新账户
  export MINIO_ROOT_USER=minioadmin
  # 更新密码
  export MINIO_ROOT_PASSWORD=minioadmin
  # 启动 minio 服务
  /usr/local/bin/minio server --address 0.0.0.0:9000 --console-address 0.0.0.0:50000 /data/aws_s3 &
  ```
---