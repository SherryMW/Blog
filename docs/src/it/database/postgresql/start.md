---
category: IT
tag: 数据库
article: false
---

# PostgreSQL

The best way of learning any database is by getting your hands dirty by pretty much learning the raw commands behind everything you do

<!-- more -->

## 什么是数据库

数据库是一个让你可以存储，操作和检索数据的地方。这些数据通常存储在计算机服务器的内部。当你将数据放入其中，并通过检索后就可以看到想要的数据。你可以执行由数据库提供的对数据的新增、删除、更新等操作

例如目前常见的社交/网购平台中，用户的各类数据都存储在平台服务器的数据库里

## 什么是关系数据库

你可能有的疑问是如何实际存储这些数据。所有的这些数据都存储在表中，由列和行组合起来就是一张普通的表格。例如一张名为 person 的个人信息表，实际的列对应每个人的 ID 、姓名、姓氏、性别和年龄值。实际的行对应每个人记录的实际相关数据

![](https://img.sherry4869.com/blog/it/database/postgresql/img.png)

关系型数据库是由多张能互相连接的表组成的数据库。你可能有一张 person 表和一张 car 表。实际上一个人可能有也可能没有汽车，因此这两张表之间是有关联关系的。可以看到 Anne 和 Andrew 没有车，因此两人对应的 car_id 字段的值是空白的。Jake 和 Julia 有对应的 car_id 从而指向 car 表。这就让两张表建立起了关联关系

![](https://img.sherry4869.com/blog/it/database/postgresql/img_1.png)

## 什么是 PostgrSQL

PostgreSQL 是一个功能非常强大的、源代码开放的客户/服务器关系型数据库管理系统（RDBMS）

Postgre 是数据库引擎，而 SQL 是结构化查询语言，是一种数据库查询和程序设计语言，用于存取数据以及查询、更新和管理关系数据库系统

## 安装 PostgreSQL

### Mac OS

[Postgres.app](https://postgresapp.com/) 是一款简单的原生 macOS 应用程序，无需安装程序即可在菜单栏中运行。打开应用程序，你就会有一个 PostgreSQL 服务器准备就绪并等待新连接。点击关闭应用程序的话 PostgreSQL 服务器就会关闭

### Windows

[下载](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) 经 EDB 认证的安装程序，适用于所有受支持的 PostgreSQL 版本

下载 Windows x86-64 15.2 版本 PostgreSQL 安装包

1. 打开安装包进行安装，Next 至 ⌈选择你想要安装的组件⌋ 界面

   ![](https://img.sherry4869.com/blog/it/database/postgresql/img_2.png)

    - PostagreSQL Server

      PostgreSQL 数据库服务器

    - pgAdmin 4

      pgAdmin 4 是一个用于管理和使用 PostgreSqL 数据库和服务器的图形界面

    - Stack Builder

      Stack Builder 可以用来下载和安装额外的工具、驱动程序和应用程序，以补充你的 PostgreSqlinstallation

    - Command Line Tools

      这个选项安装了命令行工具和客户端库，如 libpg ecpgpg_basebackup, pg_dump, pg_restore, Pg_bench 等。命令行工具是安装 PostgreSQL 数据库服务器或 pehdmin 4 时的一个必要选项

    我们全选组件进行安装

2. Next 至 ⌈为超级用户添加密码⌋ 界面

   ![](https://img.sherry4869.com/blog/it/database/postgresql/img_3.png)

   请记住这个密码，因为稍后将需要它来连接数据库

3. 服务默认端口为 5432，一直 Next 至完成安装

   ![](https://img.sherry4869.com/blog/it/database/postgresql/img_4.png)

   Stack Builder 可以用来下载和安装额外的工具、驱动程序和应用程序，以补充你的 PostgreSqL 安装。没有这个需求就不用勾选该选项

   ![](https://img.sherry4869.com/blog/it/database/postgresql/img_5.png)

   我们需要用到 pgAdmin 4 图形用户界面客户端和 SQL Shell(psql)

4. 添加环境变量

   编辑系统环境变量并将 `C:\Program Files\PostgreSQL\15\bin` 和 `C:\Program Files\PostgreSQL\15\pgAdmin 4\web` 添加到 PATH 路径

5. 测试

    ```text
    C:\Users\MW>psql --help
    psql是PostgreSQL 的交互式客户端工具。
    使用方法:
      psql [选项]... [数据库名称 [用户名称]]
    通用选项:
      -c, --command=命令       执行单一命令(SQL或内部指令)然后结束
      -d, --dbname=DBNAME      指定要连接的数据库 (默认："MW")
      -f, --file=文件名        从文件中执行命令然后退出
      -l, --list               列出所有可用的数据库,然后退出
      -v, --set=, --variable=NAME=VALUE
                               设置psql变量NAME为VALUE
                               (例如，-v ON_ERROR_STOP=1)
      -V, --version            输出版本信息, 然后退出
      -X, --no-psqlrc          不读取启动文档(~/.psqlrc)
      -1 ("one"), --single-transaction
                               作为一个单一事务来执行命令文件(如果是非交互型的)
      -?, --help[=options]     显示此帮助，然后退出
          --help=commands      列出反斜线命令，然后退出
          --help=variables     列出特殊变量，然后退出
    
    输入和输出选项：
      -a, --echo-all           显示所有来自于脚本的输入
      -b, --echo-errors        回显失败的命令
      -e, --echo-queries       显示发送给服务器的命令
      -E, --echo-hidden        显示内部命令产生的查询
      -L, --log-file=文件名    将会话日志写入文件
      -n, --no-readline        禁用增强命令行编辑功能(readline)
      -o, --output=FILENAME    将查询结果写入文件(或 |管道)
      -q, --quiet              以沉默模式运行(不显示消息，只有查询结果)
      -s, --single-step        单步模式 (确认每个查询)
      -S, --single-line        单行模式 (一行就是一条 SQL 命令)
    
    输出格式选项 :
      -A, --no-align           使用非对齐表格输出模式
          --csv                CSV（逗号分隔值）表输出模式
      -F, --field-separator=STRING
                               为字段设置分隔符,用于不整齐的输出(默认："|")
      -H, --html               HTML 表格输出模式
      -P, --pset=变量[=参数]   设置将变量打印到参数的选项(查阅 \pset 命令)
      -R, --record-separator=STRING
                               为不整齐的输出设置字录的分隔符(默认：换行符号)
      -t, --tuples-only        只打印记录i
      -T, --table-attr=文本    设定 HTML 表格标记属性（例如,宽度,边界)
      -x, --expanded           打开扩展表格输出
      -z, --field-separator-zero
                               为不整齐的输出设置字段分隔符为字节0
      -0, --record-separator-zero
                               为不整齐的输出设置记录分隔符为字节0
    
    联接选项:
      -h, --host=主机名        数据库服务器主机或socket目录(默认："本地接口")
      -p, --port=端口          数据库服务器的端口(默认："5432")
      -U, --username=用户名    指定数据库用户名(默认："MW")
      -w, --no-password        永远不提示输入口令
      -W, --password           强制口令提示 (自动)
    
    更多信息，请在psql中输入"\?"(用于内部指令)或者 "\help"(用于SQL命令)，
    或者参考PostgreSQL文档中的psql章节.
    ```

## 连接 PostgerSQL

### Mac OS

[Postico 2 文档](https://eggerapps.at/postico2/documentation/index.html)

### Windows

可以使用如下三种方式之一进行连接

- 使用命令提示符 CMD 执行命令 `psql -U postgres` 接着将要求你输入你在安装时设置的超级用户的密码

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.
    
    postgres=#
    ```

- 使用 SQL Shell(psql) 连接

    ```text
    Server [localhost]:
    Database [postgres]:
    Port [5432]:
    Username [postgres]:
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.
    
    postgres=#
    ```

- 使用 pgAdmin 4 图形用户界面连接

## 示例数据库

[MySQL 官方网站](https://dev.mysql.com/doc/index-other.html) 提供了以下几个示例数据库：employee、world、world_x、sakila、airportdb 以及 menagerie。这些数据库既可以用于日常学习和测试，也可以作为我们设计时数据库的一个参考

### Sakila

[Sakila 示例数据库文档](https://dev.mysql.com/doc/sakila/en/)

Sakila 数据库为 DVD 租赁商店业务建模，其中包含影片、演员、影片与演员关系等内容，以及连接影片、商店和租赁业务的中央库存表

![Sakila 示例数据库架构](https://img.sherry4869.com/blog/it/database/postgresql/sakila.png)

**Sakila 数据库提供了以下数据表：**

- actor：演员信息表。通过 film_actor 表和 film 表进行关联

- film：电影信息表。film 引用了 language 表，同时被 film_category、film_actor 以及 inventory 表引用

- film_actor：电影演员表。film 表和 actor 表之间的多对多关系

- film_category：电影分类表。film 表和 category 表之间的多对多关系

- category：分类表。通过 film_category 表和 film 表进行关联

- inventory：电影库存表。每部电影在不同商店里的库存，被 rental 表引用

- film_text：电影描述表。包含了 film 表中的 film_id、title 以及 description 三个字段，通过 film 表上的触发器进行数据同步

- language：语言信息表。language 表被 film 表引用

- address：地址信息表。其中主键字段 address_id 是 customer、staff 以及 store 表上的外键引用字段，同时引用了 city 表

- city：城市信息表。引用了 country 表，同时被 address 表引用

- country：国家信息表。country 表被 city 表引用

- customer：客户信息表。引用了 address 和 store 表，同时被 payment 和 rental 表引用

- payment：付款信息表。引用了 customer、staff 以及 rental 表

- rental：租赁信息表，每个 DVD 每次被租赁的信息。引用了 inventory、customer 以及 staff 表，同时被 payment 表引用

- staff：员工信息表。引用了 store 和 address 表，同时被 rental、payment 以及 store 表引用

- store：商店信息表，引用了 staff 和 address 表，同时被 staff、customer 以及 inventory 表引用

---

**Sakila 数据库提供了以下视图：**

- actor_info：包含了所有的演员，以及他们演出过的电影

- customer_list：客户和地址信息列表

- film_list：电影信息和参与的演员

- nicer_but_slower_film_list：电影信息和参与的演员，演员的姓名调整为首字母大写

- sales_by_film_category：按照不同电影分类统计的销售金额，同一部电影可能被分为多个类别

- sales_by_store：按照商店统计的销售金额

- staff_list：员工列表，包括地址和所属的商店

---

**Sakila 数据库提供了以下存储过程和函数：**

- film_in_stock：存储过程，获取指定电影在指定商店内未出租的 DVD

- film_not_in_stock：存储过程，获取指定电影在指定商店内已出租未归还的 DVD

- rewards_report：存储过程，获取上个月的最佳客户列表

- get_customer_balance：存储函数，返回指定客户在某个日期之前的欠款

- inventory_held_by_customer：存储函数，返回正在租赁某个 DVD 的客户

- inventory_in_stock：存储函数，返回某个 DVD 是否可出租。TRUE 表示可以出租，FALSE 表示已出租未归还

---

**Sakila 数据库包含了以下触发器：**

- customer_create_date：插入数据时将 customer 表的 create_date 字段设置为当前日期和时间

- payment_date：插入数据时将 payment 表的 payment_date 字段设置为当前日期和时间

- rental_date：插入数据时将 rental 表的 rental_date 字段设置为当前日期和时间

- ins_film：将 film 表上插入的相关数据复制一份到 film_text 表

- upd_film：将 film 表上更新的相关数据同步到 film_text 表

- del_film：删除 film 表数据时同步删除 film_text 表上的相关数据

---

**下载 Sakila 示例数据库的 sql 脚本文件：**

访问 [https://github.com/jOOQ/sakila/tree/main/postgres-sakila-db](https://github.com/jOOQ/sakila/tree/main/postgres-sakila-db) 下载以下两个文件：

1. postgres-sakila-schema.sql：此文件包含了创建数据库结构的 sql 脚本，包含数据表，视图、函数，存储过程，触发器
2. postgres-sakila-insert-data.sql：此文件包含了导入数据的 sql 脚本

当这两个脚本文件都下载完成后，您要做的就是把这两个脚本文件导入到数据库中。您可以使用以下两种工具中的任意一个将 sql 文件导入到数据库：

1. psql 工具
2. pgAdmin 工具

**使用 psql 工具导入 Sakila 数据库**

1. 使用命令提示符 CMD 或启动 psql 工具连接 PostgreSQL 服务器

   ```text
   C:\Users\MW>psql -U postgres
   用户 postgres 的口令：
   psql (15.2)
   输入 "help" 来获取帮助信息.

   postgres=#
   ```  
   
   ```text
   Server [localhost]:
   Database [postgres]:
   Port [5432]:
   Username [postgres]:
   用户 postgres 的口令：
   psql (15.2)
   输入 "help" 来获取帮助信息.

   postgres=#
   ```

2. 创建 Sakila 数据库

   ```text
   postgres=# CREATE DATABASE sakila;
   CREATE DATABASE
   postgres=# \c sakila;
   您现在已经连接到数据库 "sakila",用户 "postgres".
   sakila=#
   ```

3. 找到你下载的 sql 文件的路径，使用 `\i ${filePath}` 命令从文件中执行 SQL。注意：Windows 上文件路径要使用 `/` 路径符号

   ```postgresql
   \i C:/Users/MW/Downloads/sakila-main/postgres-sakila-db/postgres-sakila-schema.sql
   ```
   
   ```postgresql
   \i C:/Users/MW/Downloads/sakila-main/postgres-sakila-db/postgres-sakila-insert-data.sql
   ```
   
4. 使用 `\dt` 命令展示 Sakila 数据库中的表以验证是否导入成功

   ```text
   sakila=# \dt
                    关联列表
   架构模式 |       名称       |  类型  |  拥有者
   ----------+------------------+--------+----------
   public   | actor            | 数据表 | postgres
   public   | address          | 数据表 | postgres
   public   | category         | 数据表 | postgres
   public   | city             | 数据表 | postgres
   public   | country          | 数据表 | postgres
   public   | customer         | 数据表 | postgres
   public   | film             | 数据表 | postgres
   public   | film_actor       | 数据表 | postgres
   public   | film_category    | 数据表 | postgres
   public   | inventory        | 数据表 | postgres
   public   | language         | 数据表 | postgres
   public   | payment          | 数据表 | postgres
   public   | payment_p2007_01 | 数据表 | postgres
   public   | payment_p2007_02 | 数据表 | postgres
   public   | payment_p2007_03 | 数据表 | postgres
   public   | payment_p2007_04 | 数据表 | postgres
   public   | payment_p2007_05 | 数据表 | postgres
   public   | payment_p2007_06 | 数据表 | postgres
   public   | rental           | 数据表 | postgres
   public   | staff            | 数据表 | postgres
   public   | store            | 数据表 | postgres
   ```

## 使用 Mockaroo 生成模拟数据

需要一些模拟数据来测试您的应用？ [Mockaroo](https://www.mockaroo.com) 允许您以 CSV、JSON、SQL 和 Excel 格式生成 1000 行真实的测试数据

![](https://img.sherry4869.com/blog/it/database/postgresql/img_6.png)

找到你下载的 sql 文件的路径，使用 `\i ${filePath}` 命令从文件中执行 SQL。注意：Windows 上文件路径要使用 `/` 路径符号

```postgresql
\i C:/Users/MW/Downloads/person.sql
```