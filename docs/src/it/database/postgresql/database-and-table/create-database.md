---
category: IT
tag: 数据库
order: 1
article: false
---

# 创建数据库

数据库是表的容器，一个数据库中可以包含多个表。要想在 PostgreSQL 存储数据，你首先要创建一个数据库。PostgreSQL 允许您使用 `CREATE DATABASE` 语句创建一个新的数据库

## CREATE DATABASE 语法

要在 PostgreSQL 服务器上创建一个数据库，您必须是超级用户或者具有 CREATEDB 权限。请按照如下语法使用 `CREATE DATABASE` 语句：

```sql
CREATE DATABASE db_name
[ [ WITH ] [ OWNER [=] user_name ]
       [ TEMPLATE [=] template ]
       [ ENCODING [=] encoding ]
       [ LOCALE [=] locale ]
       [ LC_COLLATE [=] lc_collate ]
       [ LC_CTYPE [=] lc_ctype ]
       [ TABLESPACE [=] tablespace_name ]
       [ ALLOW_CONNECTIONS [=] allowconn ]
       [ CONNECTION LIMIT [=] connlimit ]
       [ IS_TEMPLATE [=] istemplate ] ]
```

看起来这是一个很复杂的语句，但是最常用的是下面的一行语句：

```sql
CREATE DATABASE db_name;
```

您可以是按照任意的顺序使用可选的选项。以下是对其中的参数的说明：

- db_name：要创建的数据库的名字

- user_name：将拥有新数据库的用户的角色名称。您可以使用 DEFAULT 表示执行命令的用户

- template：用于创建新数据库的模板名称。您可以使用 DEFAULT 表示默认模板的模板名称

- encoding：要在新数据库中使用的字符集编码。您可以指定一个字符串常量（例如，'SQL_ASCII'），或者一个整数编码号，或者 DEFAULT (模板数据库的编码)。点击 [这里](https://www.postgresql.org/docs/15/multibyte.html#MULTIBYTE-CHARSET-SUPPORTED) 以查看 PostgreSQL 支持的字符集

- locale：这是一个设置 LC_COLLATE 和 LC_CTYPE 的快捷方式。如果指定此项，则不能指定其中任何一个参数

- lc_collate：要在新数据库中使用的整理顺序 (LC_COLLATE)。这会影响应用于字符串的排序顺序

- lc_ctype：要在新数据库中使用的字符分类 (LC_CTYPE)。这会影响字符的分类，例如小写、大写和数字

- tablespace_name：将与新数据库关联的表空间的名字。您可以使用 DEFAULT 以使用模板数据库的表空间的名称

- allowconn：是否允许连接到此数据库。如果为 false，则没有人可以连接到该数据库。默认值为 true，允许连接

- connlimit：连接数限制。-1（默认）表示没有限制

- istemplate：是否为模版数据库。 如果为 true，则任何具有 CREATEDB 权限的用户都可以克隆此数据库；如果为 false（默认值），则只有超级用户或数据库所有者可以克隆它

## 创建数据库示例

在本实例中，我们将在 psql 工具中创建一个数据库 testdb：

1. 首先，请使用您自己的用户登录 PostgreSQL 服务器：

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.

    postgres=#
    ```

2. 其次，使用默认的选项创建 testdb 数据库：

    ```sql
    CREATE DATABASE testdb;
    ```

    如果您输入了一个已经存在的数据库名称， PostgreSQL 将返回一个错误：ERROR: database "testdb" already exists

3. 最后，使用 `\c` 命令切换到刚刚创建的 testdb 数据库:

```postgresql
\c testdb;
```

```text
postgres=# \c testdb
您现在已经连接到数据库 "testdb",用户 "postgres".
testdb=#
```