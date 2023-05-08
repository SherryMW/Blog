---
date: 2022-03-27
category: IT
---

# 搭建网盘系统 Cloudreve

Cloudreve 可以让你快速搭建起公私兼备的网盘系统<!-- more -->。Cloudreve 在底层支持不同的云存储平台，用户在实际使用时无须关心物理存储方式。你可以使用 Cloudreve 搭建个人用网盘、文件分享系统，亦或是针对大小团体的公有云系统

## 获取 Cloudreve

在 [GitHub Release](https://github.com/cloudreve/Cloudreve/releases) 页面获取已经构建打包完成的主程序。其中每个版本都提供了常见系统架构下可用的主程序，命名规则为 cloudreve_版本号_操作系统_CPU架构.tar.gz。比如普通 64 位 Linux 系统上部署 3.0.0 版本，则应该下载 cloudreve_3.0.0_linux_amd64.tar.gz

查看当前主机的硬件架构类型

```shell
arch
```

![](https://img.sherry4869.com/blog/it/server/cloudreve/img.png)

下载解压后得到 cloudreve 可执行文件

## 使用宝塔部署

1. 登录宝塔面板点击侧边栏中的 **网站** 添加站点

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_2.png)

2. 登录云服务商控制台面板配置域名解析 [阿里云DNS控制台](https://dns.console.aliyun.com/)

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_3.png)

3. 访问站点检查是否创建成功

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_4.png)
    
    在网站控制台中配置 SSL 证书（可选）
    
    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_5.png)
    
    ::: tip
    配置好 SSL 证书后使用 HTTPS 协议访问站点时提示  
    {"msg":"unknown error","code":"5030200","id":"5f6d0eef9c541729427b4d967932b4147"}  
    错误，请检查上传的证书（PEM格式）段落是否完整，完整的段落可以包含所有的 key 信息，如果只复制了一半只能识别部分，尽管可以解析到有该域名
    
    访问站点出现其他非正常界面，有可能是浏览器 Cookie 导致，需要打开浏览器设置 -> Cookie 和网站数据 -> 所有 Cookie 和站点数据，清除对应站点 Cookie
    :::

4. 在网站目录下创建 cloudreve 目录，并上传之前解压后的 cloudreve 可执行文件

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_6.png)
    
    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_7.png)

5. 在宝塔面板点击软件商店下载 **堡塔应用管理器** 插件

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_1.png)

6. 添加 cloudreve 应用

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_8.png)
    
    启动应用成功后打开应用日志，请务必记住账号密码
    
    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_10.png)
    
    此时网站目录中会新增 cloudreve.db 以及 conf.ini 文件，接着暂停应用进入下一步配置
    
    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_9.png)
    
    添加 cloudreve 数据库（可选）
    
    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_11.png)

    ::: tip
    创建数据库时提示 **数据库管理密码错误** 可以先修改 root 密码后再重新创建
    :::
    
    编辑站点目录下的 conf.ini 文件，新增以下配置项

    ```
    [Database]
    ; 数据库类型，目前支持 sqlite | mysql
    Type = mysql
    ; 用户名
    User = cloudreve
    ; 密码
    Password = password
    ; 数据库地址
    Host = 127.0.0.1
    ; 数据库名称
    Name = cloudreve
    ; 数据表前缀
    TablePrefix = 
    ```

7. 登录云服务商控制台配置安全组放行 5212 端口

8. 配置网站反向代理

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_12.png)

9. 在宝塔应用管理器中重新启动 cloudreve 应用。注意：每重启一次应用都会更新登陆密码

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_13.png)

10. 访问网站地址

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_14.png)

    可以在 Cloudreve 仪表盘中的用户组选择对应角色修改初始容量

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_15.png)

    Nginx 配置大文件上传

    ![](https://img.sherry4869.com/blog/it/server/cloudreve/img_18.png)

## 常见问题

当上传超过 10M 的文件时提示以下错误

![](https://img.sherry4869.com/blog/it/server/cloudreve/img_16.png)

![](https://img.sherry4869.com/blog/it/server/cloudreve/img_17.png)

首先访问服务器 ${ip}:5212 测试是否还会有该错误提示，如果一切正常则是反向代理配置有误，检查反向代理目标 URL 是否配置成 127.0.0.1:5212，而不是服务器 ${ip}:5212

## 参考资料

[Cloudreve 官方网站](https://docs.cloudreve.org/)

[Cloudreve 官方论坛](https://forum.cloudreve.org/)

[Cloudreve GitHub](https://github.com/cloudreve/Cloudreve)