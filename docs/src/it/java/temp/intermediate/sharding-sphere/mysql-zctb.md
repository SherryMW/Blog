---
category: IT
order: 2
article: false
---

# MySQL 主从同步

MySQL 的主从同步和复制是一个异步的过程，底层是基于 MySQL 数据库自带的二进制日志功能

在 MySQL 5.6 以前的版本，slave 的复制是单线程的，只能按照主库执行 sql 语句的顺序依次执行。 在 MySQL 5.6 以后的版本，引入了 GTID（全局事务识别符）和多线程复制（基于库或表）等新特性，可以提高复制效率和容错能力

在 MySQL 8.0 版本中，主从同步和复制的配置方式有所变化，主要是使用了新的用户角色 replication_applier 和 replication_admin，以及新的密码验证插件 caching_sha2_password

![MySQL 主从同步原理](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/zctb/img.png)

::: info
[查看当前 MySQL 最新下载版本](https://dev.mysql.com/downloads/mysql/)

查看 MySQL 版本：

- 在终端下执行 mysql -V

- 在 MySQL 指令行里执行 SELECT VERSION();

Linux 下 MySQL 默认的数据文档存储目录在 /var/lib/mysql，宝塔 Linux 版的 MySQL 默认的数据文档存储目录在 /www/server/data

/etc/my.cnf 是 MySQL 的主配置文件，它包含了 MySQL 的全局设置，例如服务器 ID、端口号、数据目录等

/etc/mysql/conf.d 和 /etc/mysql/mysql.conf.d是 MySQL 的附加配置文件目录，它们可以存放一些自定义的配置文件，例如 mysqld.cnf、mysql-clients.cnf 等。这些文件会覆盖或补充 my.cnf 中的设置

mysqld.cnf 是专门用于设置 MySQL 服务器的运行参数的配置文件，它通常放在 /etc/mysql/conf.d/或/etc/mysql/mysql.conf.d/ 目录下

/etc/my.cnf.d/mysql-clients.cnf 是 MySQL 客户端的配置文件，它包含了 MySQL 客户端程序 如 mysql、mysqldump 等的设置，例如默认字符集、默认用户名等
:::

MySQL 的主从配置都将在 Docker 内操作，因此需要先在服务器上安装 Docker 环境

[Docker 安装教程](/it/server/docker/#安装-docker)

[Docker 常用指令](/it/server/docker/#常用指令)

## 一主多从

服务器规划：使用 Docker 创建，主从服务器 IP 一致，端口号不一致

主服务器：容器名 mw-mysql-master 端口 3307

从服务器：容器名 mw-mysql-slave1 端口 3308

从服务器：容器名 mw-mysql-slave2 端口 3309

使用 `lsof` 或 `netstat` 指令来查看 Linux 系统中指定端口的占用情况，确保没有被占用

```shell
lsof -i:3307
```

```shell
netstat -tunlp | grep 3307
```

### 准备主服务器

1. 在 Docker 中创建并启动 MySQL 主服务器

    ```shell
    docker run -d -p 3307:3306 \
    -v /mw/mysql/master/conf:/etc/mysql/conf.d \
    -v /mw/mysql/master/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-mysql-master \
    mysql:8.0.31
    ```

    docker run 指令会先在指定的镜像上创建一个可写的容器层，然后使用指定的指令启动它。也就是说 docker run 相当于 API /containers/create 加 /containers/（id）/start。如果想让容器在后台运行而不是执行 COMMAND 指令后关闭，可以使用 -d 选项
    
    -d 选项是用来指定容器运行在后台模式的，也就是以守护进程的方式运行。这样就不需要在终端中保持连接，从而可以继续执行其他指令或关闭终端
    
    -p 选项是用来将容器内的端口映射到主机上的端口。这样就可以通过主机的端口访问容器内运行的应用程序。例如：`docker run -p 3000:8080 image_name`，那么就可以通过 localhost:3000 访问容器内部在 8080 端口运行的应用程序
    
    -v 选项是将容器内运行的数据持久化到主机上。例如：`-v /opt/data/mysql/db:/var/lib/mysql` 将主机的 /opt/data/mysql/db 目录建立映射关系挂载到容器的 /var/lib/mysql 目录。这样主机和容器之间可以共享数据，主机这边修改了之后，容器里面的配置文件也会同步修改，反之亦然
    
    -e 选项是用来设置容器内的环境变量。可以使用 -e 或 --env value 来指定一个或多个环境变量，例如：`docker run -e myhost='localhost' image_name`。这样就可以在容器内使用 myhost 这个变量
    
    --name 选项是用来给容器指定一个名称。如果不使用此选项，Docker 会自动生成一个随机的字符串名称。使用 --name 选项可以更方便地在 Docker 网络中识别和引用容器。 例如：`docker run --name myapp image_name`

    mysql:8.0.31：当前容器镜像的名字及版本号

    ::: tip 常见问题
    docker: Error response from daemon: driver failed programming external connectivity on endpoint mw-mysql-master (2a317de61e601c3c0864199ba12953f26e0552357b42045bac660481e39bfcb4):  (iptables failed: iptables --wait -t nat -A DOCKER -p tcp -d 0/0 --dport 3307 -j DNAT --to-destination {ip}:{port} ! -i docker0: iptables: No chain/target/match by that name

    - 检查是否有其他容器正在使用相同的端口，如果有，停止或删除它们
   
    - 检查防火墙是否开启了，并且是否允许了相应的端口访问
   
    - 重启 Docker 服务，并重新创建容器
   
      ```shell
      systemctl restart docker
      ```
      
    - 查看 docker 的日志文件，看是否有更多的错误信息
   
      ```shell
      docker logs mw-mysql-master
      ```
      
    - 查看容器的状态和配置
   
      ```shell
      docker inspect mw-mysql-master
      ```
      
    - 使用 iptables -L 指令，查看防火墙的所有连接以及规则
   
      ```shell
      iptables -L
      ```
    :::

2. 创建 MySQL 主服务器配置文件

    默认情况下 MySQL 的 binlog 日志是自动开启的，创建一个 my.cnf 配置文件，可以通过如下配置定义一些可选配置项

    ```shell
    vim /mw/mysql/master/conf/my.cnf
    ```

    配置内容：

    ```properties
    [mysqld]
    # 服务器唯一id，默认值1
    server-id=1
    # 设置日志格式，默认值ROW
    binlog_format=STATEMENT
    # 二进制日志名，默认binlog 使用 mysql5.7 需要加这个值
    #log-bin=binlog
    # 设置需要复制的数据库，默认复制全部数据库
    #binlog-do-db=mytestdb
    # 设置不需要复制的数据库
    #binlog-ignore-db=mysql
    #binlog-ignore-db=infomation_schema
    ```

    重启 MySQL 容器使配置生效

    ```shell
    docker restart mw-mysql-master
    ```
   
   ::: info binlog_format
   binlog_format 是 MySQL 配置文件中的一个选项，它用于设置 binlog 的格式。binlog_format 有三种可选配置项：

   - STATEMENT：binlog 中记录的是执行的 SQL 语句，而不是具体的数据变化。这种模式下，binlog 文件较小，但可能会出现一些问题，比如函数调用、触发器、隐式类型转换等导致主从不一致的情况
   
   - ROW：binlog 中记录的是每一行数据被更新后的数据，而不是 SQL 语句。这种模式下，binlog 文件较大，但可以保证主从数据的一致性，并且避免了一些隐含的逻辑错误
   
   - MIXED：binlog 中根据不同的情况，自动选择 STATEMENT 或 ROW 模式。默认情况下为 STATEMENT，遇到特殊的 SQL 语句时转换为 ROW 格式。这种模式下，binlog 文件大小介于前两者之间，并且尽量保证了主从数据的一致性和效率

   根据不同的场景和需求，可以选择合适的 binlog_format：

   - 如果对数据安全性要求不高，并且有大量查询操作或者对磁盘空间敏感，则建议使用 STATEMENT 模式
   
   - 如果对数据安全性要求高，并且有大量更新操作或者使用了触发器、存储过程等功能，则建议使用 ROW 模式
   
   - 如果对数据安全性和磁盘空间都有一定要求，并且想让 MySQL 自动选择最优化方案，则建议使用 MIXED 模式

   **如果需要在线修改 binlog 格式，注意以下几点：**

   - 在修改前，需要停止从库的复制线程，并确保主从同步
   
   - 在修改后，需要重新启动从库的复制线程，并检查 binlog 文件是否正确变化
   
   - 如果想让新的 binlog 格式永久生效，还需要在 my.cnf 文件中设置 binlog_format 参数，并重启 MySQL 服务
   :::
   
   ![binlog-ignore-db 和 binlog-do-db 的优先级](https://img.sherry4869.com/blog/it/java/intermediate/sharding-sphere/zctb/img_1.png)

3. 连接 MySQL 主服务器 Master

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-mysql-master env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行
    mysql -u root -p
    ```
    
    ```sql
    -- 如果客户端不支持当前的认证插件导致连接失败，可以使用 alter user 指令，并指定相应的认证插件和新密码（建议升级客户端工具）
    alter user 'root'@'%' identified with mysql_native_password by '123456'
    ```
   
    可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL 容器  
    主机：服务器公网 IP  
    端口：3307  
    用户名：root  
    密码：123456

    ::: tip 常见问题
    **2002 -  Can't connect to server on 'ip'(10061)**

    **2013 - Lost connection to server at 'handshake: reading initial communication packet', system error: 0**

    - MySQL 服务器没有正常运行
   
    - MySQL 服务器没有允许远程连接
   
       - MySQL 数据库默认只支持本地访问，不支持远程访问权限。要想让 MySQL 数据库支持远程访问，需要手动修改配置用户 root 的访问权限。可以使用以下指令检查用户是否有远程连接权限
      
         ```sql
         select user,host from mysql.user;
         ```
         
         如果显示有两个 root 用户，一个是 %，一个是 localhost，表示已经可以远程连接。如果没有 %，表示不允许远程连接，需要授权
      
         ```sql
         -- MySQL 5 指令
         grant all privileges on *.* to 'root'@'%' identified by '123456';
         -- MySQL 8 指令
         grant all privileges on *.* to 'root'@'%' with grant option;
         -- 刷新权限
         flush privileges;
         ```
         
    - 防火墙或网络设置阻止了连接
   
       - 检查安全组有没有开放相应的端口
      
       - 检查防火墙是否关闭或者是否开通相应的端口
      
         ```shell
         # 查看防火墙运行状态
         systemctl status firewalld
         # 关闭防火墙
         systemctl stop firewalld
         ```
         如果防火墙是开启状态，centOS 默认开启的端口只有 22 端口，专供于 SSH 服务，其他端口都需要自行开启
         ```shell
         iptables -A INPUT -p tcp --dport 端口号 -j ACCEPT
         ```
         
       - 测试远程主机的端口是否开放
      
         ```shell
         # 列出 telnet 相关的安装包，查看是否安装 telnet 包
         yum list telnet*
         # 安装 telnet 包
         yum install -y telnet.x86_64
         # 测试远程主机的端口是否开放 telnet {ip} {port}
         telnet 192.168.1.1 80
         # 如果能连接上的话按 ctrl + ] 键可以进入 telnet 指令界面
         # 输入 st 指令（status 缩写）打印状态信息
         telnet> st
         ```

    - 检查 Navicat 是否支持 MySQL 8 的认证插件 caching_sha2_password，如果不支持就需要升级 Navicat（推荐）或者修改 MySQL 用户的认证插件为 mysql_native_password（不推荐）
   
      ```sql
      -- mysql 5.7 的密码校验方式是 mysql_native_password
      -- mysql 8.0 的密码校验方式是 caching_sha2_password
      alter user 'user' @ '%' identified with mysql_native_password by '123456';
      ```
      
    - 创建容器时的配置参数问题
      
      如果在创建 MySQL 容器时配置的容器端口映射并不是 MySQL 默认的 3306 端口，例如：-p 3307:3307，则需要在 my.cnf 配置文件里指定相应端口
      ```shell
      vim /mw/mysql/master/conf/my.cnf
      ```
      ```properties
      # 设置端口号
      port=3307
      ```
    :::

4. 主服务器给从服务器开通一个访问账号

    从服务器去同步复制主服务器数据时需要的访问账号

    ```sql
    -- 创建用于名为 mw_slave 的账号，@'%' 表示该用户可以从任何主机访问主服务器
    create user 'mw_slave'@'%';
    -- 设置初始密码
    set password for 'mw_slave'@'%' = '123456';
    -- 仅授予对远程所有数据库以及数据表的复制权限
    grant replication slave on *.* to 'mw_slave'@'%';
    -- 刷新权限
    flush privileges;
    ```

5. 查看主机状态
    
    ```sql
    -- 查看主数据库的二进制日志和复制状态
    show master status;
    ```
    
    ::: info show master status 返回值
    File：当前使用的二进制日志文件名
    
    Position：当前执行的二进制日志位置

    Binlog_Do_DB：指定要记录到二进制日志中的数据库

    Binlog_Ignore_DB：指定不要记录到二进制日志中的数据库

    Executed_Gtid_Set：已经执行的全局事务 ID 集合
    :::

    需要记录 **File** 和 **Position** 的值，执行完此步骤后不要再随意操作主服务器的 MySQL，防止主服务器的状态值发生改变，假设当前记录的 File = binlog.000003，Position = 1407

### 准备从服务器

#### slave1

1. 在 Docker 中创建并启动 MySQL 从服务器 slave1

    ```shell
    docker run -d -p 3308:3306 \
    -v /mw/mysql/slave1/conf:/etc/mysql/conf.d \
    -v /mw/mysql/slave1/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-mysql-slave1 \
    mysql:8.0.31
    ```
   
2. 创建从服务器配置文件
    
    ```shell
    vim /mw/mysql/slave1/conf/my.cnf
    ```
   
    配置内容：
    
    ```properties
    [mysqld]
    # 服务器唯一id，每台服务器的 id 必须不同，如果配置其他从机，注意修改 id
    server-id=2
    # 中继日志名，默认xxx-relay-bin
    #relay-log=relay-bin
    ```
   
    重启 MySQL 容器使配置生效

    ```shell
    docker restart mw-mysql-slave1
    ```
   
3. 连接 MySQL 从服务器 slave1

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-mysql-slave1 env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行
    mysql -u root -p
    ```
   
    ```sql
    -- 如果客户端不支持当前的认证插件导致连接失败，可以使用 alter user 指令，并指定相应的认证插件和新密码（建议升级客户端工具）
    alter user 'root'@'%' identified with mysql_native_password by '123456'
    ```
   
   可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL 容器  
   主机：服务器公网 IP  
   端口：3308  
   用户名：root  
   密码：123456

4. 在从服务器上配置主从关系（重要）

    在从机 Slave1 的 MySQL 行中执行基于 binlog 文件名和位置的复制协议

    ```sql
    CHANGE MASTER TO MASTER_HOST='${ip}',
    MASTER_USER='mw_slave',MASTER_PASSWORD='123456',
    MASTER_PORT=3307,
    MASTER_LOG_FILE='binlog.000003',MASTER_LOG_POS=1407;
    ```

   如果配置有误后可以重新执行指令覆盖原有的配置，但如果是已经启动了主从同步的状态下，需要 stop slave 停止后再重新配置   

#### slave2

1. 在 Docker 中创建并启动 MySQL 从服务器 slave2

    ```shell
    docker run -d -p 3309:3306 \
    -v /mw/mysql/slave2/conf:/etc/mysql/conf.d \
    -v /mw/mysql/slave2/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 \
    --name mw-mysql-slave2 \
    mysql:8.0.31
    ```

2. 创建从服务器配置文件

    ```shell
    vim /mw/mysql/slave2/conf/my.cnf
    ```

   配置内容：

    ```properties
    [mysqld]
    # 服务器唯一id，每台服务器的 id 必须不同，如果配置其他从机，注意修改 id
    server-id=3
    # 中继日志名，默认xxx-relay-bin
    #relay-log=relay-bin
    ```

   重启 MySQL 容器使配置生效

    ```shell
    docker restart mw-mysql-slave2
    ```

3. 连接 MySQL 从服务器 Slave2

    ```shell
    # 使用交互式指令进入 MySQL 容器中：env LANG=C.UTF-8 避免容器中显示中文乱码
    docker exec -it mw-mysql-slave2 env LANG=C.UTF-8 /bin/bash
    # 进入容器内的 MySQL 指令行
    mysql -u root -p
    ```

    ```sql
    -- 如果客户端不支持当前的认证插件导致连接失败，可以使用 alter user 指令，并指定相应的认证插件和新密码（建议升级客户端工具）
    alter user 'root'@'%' identified with mysql_native_password by '123456'
    ```

   可以使用客户端工具（MySQL Workbench，Navicat，SQLyog，phpMyAdmin，dbeaver）连接 MySQL 容器  
   主机：服务器公网 IP  
   端口：3309  
   用户名：root  
   密码：123456

4. 在从服务器上配置主从关系（重要）

   在从机 Slave2 的 MySQL 行中执行基于 binlog 文件名和位置的复制协议

    ```sql
    CHANGE MASTER TO MASTER_HOST='${ip}',
    MASTER_USER='mw_slave',MASTER_PASSWORD='123456',
    MASTER_PORT=3307,
    MASTER_LOG_FILE='binlog.000003',MASTER_LOG_POS=1407;
    ```

   如果配置有误后可以重新执行指令覆盖原有的配置，但如果是已经启动了主从同步的状态下，需要 stop slave 停止后再重新配置

### 启动主从同步

启动从机 slave1，slave2 的复制功能，分别在从机 slave1，slave2 的 MySQL 行中执行：

```sql
-- 启动从服务器的复制线程，该指令需要 SUPER 权限
start slave;
-- 查看从服务器复制线程的状态
show slave status \G
```

检查 Slave_IO_Running 以及 Slave_SQL_Running 是否为 Yes

::: tip 常见问题
- **Slave_IO_Running:Connecting/NO 表示 I/O 线程正在尝试连接主服务器，但还没有成功**

    运行 `show slave status` 指令查看 Last_IO_Errno，Last_IO_Error 错误信息
    
    可能有以下几种原因：
    - 检查 MASTER_PORT，MASTER_LOG_FILE，MASTER_LOG_POS 是否配置错误
  
    - 账户密码错误或权限不足
  
    - 网络不通或端口被阻止
  
    - 主服务器的二进制日志文件不存在或损坏

- **Last_IO_Error: Got fatal error 1236 from master when reading data from binary log: 'Client requested master to start replication from position > file size**

    ```sql
    -- 在从机中停止同步
    stop slave;
    -- 在主机查看 mater 状态
    show master slave;
    -- 在主机刷新日志
    flush logs;
    -- 再次在主机查看 mater 状态（会发现 File 和 Position 发生了变化）
    show master slave;
    -- 修改从机连接主机的 SQL，并重新连接即可
    ```

- **Last_IO_Error: error connecting to master 'mw_slave@{ip}:3307' - retry-time: 60 retries: 1 message: Authentication plugin 'caching_sha2_password' reported error: Authentication requires secure connection.**

    复制账户 mw_slave 没有加密连接到主库，所以主库拒绝了在传输过程中，明文显示密码的连接

    ```sql
    -- 在从机中停止同步
    stop slave;
    -- 清除从库配置
    reset slave all;
    -- 重新配置主从关系信息，新增 GET_MASTER_PUBLIC_KEY=1
    CHANGE MASTER TO MASTER_HOST='${ip}',
    MASTER_USER='mw_slave',MASTER_PASSWORD='123456',
    MASTER_PORT=3307,
    MASTER_LOG_FILE='binlog.000003',MASTER_LOG_POS=1407,GET_MASTER_PUBLIC_KEY=1;
    -- 启动从服务器的复制线程
    start slave;
    ```

- **Slave_SQL_Running 不等于 Yes**

    运行 `show slave status` 指令查看 Last_SQL_Errno，Last_SQL_Error 错误信息

    可能有以下几种原因：
    - 主从服务器的 server_id 相同或重复。可以检查主从服务器的 my.cnf 文件，确保 server_id 是唯一的，然后重新启动 MySQL 服务
  
    - 主从服务器的 UUID 相同。检查主从服务器的 auto.cnf 文件，确保 UUID 是唯一的，然后重新启动 MySQL 服务
  
    - 主从服务器之间的网络连接不稳定或阻塞。可以测试主从服务器之间的 ping 和 telnet 连接，确保没有防火墙或其他因素影响通讯
  
    - 主从服务器之间的数据不一致或出现错误。可以使用 `show slave status` 指令查看错误日志，并根据错误代码和信息进行修正
:::

### 实现主从同步

在主服务器中执行以下 SQL，接着在从机 slave1，slave2 中查看数据库中的数据表是否已经被同步

```sql
create database db_user;
use db_user;
create table t_user (
 id bigint auto_increment,
 uname varchar(30),
 primary key (id)
);
insert into t_user(`uname`) values('zhang3');
# @@hostname 是动态容器ID
insert into t_user(`uname`) values(@@hostname);
```

在创建主服务器时配置文件中配置的 binlog_format=STATEMENT，从服务器 slave1 和 slave2 同步过来的是 SQL 语句，因此从服务器的数据表中同步过来的是各自的动态容器 ID

如果 binlog_format=ROW，那么从服务器 slave1 和 slave2 同步过来的 @@hostname 值就是主机容器的 ID 数据。主机的数据是什么，从机的数据就是什么

### 停止和重置

```sql
-- 在从机上执行。功能说明：停止 I/O 线程和 SQL 线程的操作
stop slave;
-- 在主机上执行。功能说明：删除所有的 binlog 日志文件，并将日志索引文件清空，重新开始所有新的日志文件
-- 用于第一次进行搭建主从库时，进行主库 binlog 初始化工作；
reset master;
-- 在从机上执行。功能说明：用于删除 SLAVE 数据库的 relaylog 日志文件，并重新启用新的 relaylog 文件
reset slave;
```