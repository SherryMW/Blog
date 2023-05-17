---
category: IT
tag: 数据库
order: 2
article: false
---

# 删除数据库

当我们不需要某个数据库的时候，我们可以将数据库删除。在 PostgreSQL 中，`DROP DATABASE` 语句用来删除一个数据库

注意：`DROP DATABASE` 语句将永久删除数据库和数据库中的所有表，请谨慎操作

## DROP DATABASE 语法

要执行 `DROP DATABASE` 语句，您需要是超级用户或者是数据库的所有者

下面是 PostgreSQL `DROP DATABASE` 语句的语法：

```sql
DROP DATABASE [IF EXISTS] database_name;
```

- database_name：是要删除的数据库的名称。您需要提供一个已经存在的数据库的名称

- 如果您提供了一个不存在的数据库名称，PostgreSQL 将给出一个错误报告。您可以使用 `IF EXISTS` 选项防止输出此错误。 PostgreSQL 对于不存在的数据库将给出一个通知

您不能删除仍有活动连接的数据库。此时， PostgreSQL 将给出一个错误报告。您可以使用 `pg_terminate_backend()` 函数结束活动连接，再删除此数据库

## DROP DATABASE 示例

在本实例中，我们将使用 psql 工具连接 PostgreSQL 服务器，创建一个数据库 test_db 并删除它

1. 首先，请使用具有权限的用户登录 PostgreSQL 服务器：

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.

    postgres=#
    ```

2. 其次，使用默认的选项创建 test_db 数据库：

    ```sql
    CREATE DATABASE test_db;
    ```

    如果您输入了一个已经存在的数据库名称，PostgreSQL 将返回一个错误：ERROR: database "test_db" already exists

3. 然后，使用 `\c` 命令切换到刚刚创建的 test_db 数据库:

    ```postgresql
    \c test_db;
    ```

4. 然后，尝试删除 test_db 数据库

    ```sql
    DROP DATABASE test_db;
    ```
    
    ```text
    ERROR: cannot drop the currently open database
    ```

    也就是说，您不能删除当前打开的数据库

5. 保持刚刚的会话，打开一个新的会话并登陆，然后尝试删除：

    ```sql
    DROP DATABASE test_db;
    ```
    
    ```text
    ERROR:  database "test_db" is being accessed by other users
    DETAIL:  There is 1 other session using the database.
    ```
    
    这里， PostgreSQL 报告了一个错误： 数据库 test_db 正在被其他用户访问

6. 关闭以前的会话，并回到这个会话，重新尝试删除：

    ```sql
    DROP DATABASE test_db;
    ```
    
    此时，数据库已经被删除