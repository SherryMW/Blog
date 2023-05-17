---
category: IT
tag: 数据库
order: 9
article: false
---

# 重置密码

在 PostgreSQL 中，postgres 是超级用户。如果您忘记了 postgres 的密码，您可以按照以下步骤进行重置

1. 找到 PostgreSQL 数据库服务器的配置文件 pg_hba.conf

   在 Windows 上，PostgreSQL 数据库服务器的配置文件位于 PostgreSQL 安装目录的 data 目录下，比如：`C:\Program Files\PostgreSQL\15\data`

   在 Linux 上，PostgreSQL 数据库服务器的配置文件位于 `/etc/postgresql/15/main/pg_hba.conf`

2. 修改配置文件之前备份 配置文件，以便后面进行恢复

   ```shell
   cp pg_hba.conf pg_hba.conf.bak
   ```

3. 修改配置文件以信任本地连接不需要密码。将配置文件中底部的 scram-sha-256 或者 md5 修改为 trust，如下：

   ```text
   local   all             all                                     peer
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   # IPv6 local connections:
   host    all             all             ::1/128                 trust
   # Allow replication connections from localhost, by a user with the
   # replication privilege.
   local   replication     all                                     peer
   host    replication     all             127.0.0.1/32            trust
   host    replication     all             ::1/128                 trust
   ```

4. 重启 PostgreSQL 数据库服务器

   在 Windows 中， 您可以在服务列表窗口重启 PostgreSQL

   在 Linux 中，您可以使用 systemctl restart postgresql 命令重启 PostgreSQL 服务

5. 登录到 PostgreSQL 数据库服务器

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.

    postgres=#
    ```

   您并不需要输入密码

6. 使用以下命令修改 postgres 用户的密码：

   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

7. 恢复 pg_hba.conf 配置文件。将 pg_hba.conf.bak 文件的内容覆盖 pg_hba.conf

8. 重启 PostgreSQL 数据库服务器。当您登陆时，PostgreSQL 应该会提示您输入密码