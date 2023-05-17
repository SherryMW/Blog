---
category: IT
tag: 数据库
order: 3
article: false
---

# 修改数据库

PostgreSQL 允许您使用 `ALTER DATABASE` 语句修改一个现有的数据库的信息

## ALTER DATABASE 语法

PostgreSQL `ALTER DATABASE` 可以修改数据库的各种信息，包括名称、属性、所有者、表空间等

- 要重命名一个数据库，请使用如下语法：

    ```sql
    ALTER DATABASE name RENAME TO new_name;
    ```

- 要修改数据库的所有者，请使用如下语法：

    ```sql
    ALTER DATABASE name OWNER TO
    { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER };
    ```

- 要修改数据库的选项，请使用如下语法：

    ```sql
    ALTER DATABASE name [WITH] ALLOW_CONNECTIONS { true | false};
    ALTER DATABASE name [WITH] CONNECTION LIMIT connlimit;
    ALTER DATABASE name [WITH] IS_TEMPLATE { true | false};
    ```

    - ALLOW_CONNECTIONS：是否允许连接到此数据库

    - CONNECTION LIMIT：连接数限制

    - IS_TEMPLATE：是否为模版数据库

- 要修改数据库的表空间，请使用如下语法：

    ```sql
    ALTER DATABASE name SET TABLESPACE new_tablespace;
    ```

- 要修改数据库的配置参数，请使用如下语法：

    ```sql
    ALTER DATABASE name SET configuration_parameter { TO | = } { value | DEFAULT };
    ALTER DATABASE name SET configuration_parameter FROM CURRENT;
    ```

    配置参数的新值将被写入到 postgresql.conf 文件中，以在新会话中加载使用

- 要重置数据库的配置参数的值，请使用如下语法：

    ```sql
    ALTER DATABASE name RESET configuration_parameter;
    ```

- 要重置数据库所有的配置参数的值，请使用如下语法：

    ```sql
    ALTER DATABASE name RESET ALL;
    ```

注意：要修改数据库的信息，您必须是超级用户或者数据库的所有者

## ALTER DATABASE 示例

我们将在 psql 工具中使用 `ALTER DATABASE` 修改数据库信息

使用 postgres 用户登录 PostgreSQL 服务器：

```text
C:\Users\MW>psql -U postgres
用户 postgres 的口令:
psql (15.2)
输入 "help" 来获取帮助信息.

postgres=#
```

创建一个数据库 test_db 用于演示:

```sql
CREATE DATABASE test_db;
```

### 重命名数据库

重命名数据库是一个简单的动作，但是它可能会带来一些其他的问题。如果您没有同步修改那些用到此数据库的代码，则他们可能不能正常运行

当您打算修改一个数据库名的时候，您需要首先从整体上进行评估。然后，再决定是否进行重命名数据库。一旦您决定了要重命名一个数据库，您需要把需要同步修改的地方整理清楚

要重命名一个数据库，请按照下面的语法使用 ALTER DATABASE ... RENAME 语句：

```sql
ALTER DATABASE name RENAME TO new_name;
```

- name：是要重命名的数据库的名字

- new_name：是数据库的新名字

要将 test_db 重命名为 test_new_db，请使用下面的语句：

您不能重命名仍有活动连接的数据库，否则 PostgreSQL 将给出一个错误

- 如果您要重命名当前正在连接的数据库， PostgreSQL 将给出以下错误：

```text
ERROR:  current database cannot be renamed
```

- 如果您要重命名的数据库仍有活动连接，PostgreSQL 将给出以下错误：

```text
ERROR:  database "testdb" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```

---

有时候，并不是我们自己连接了要重命名的数据库。我们可以从 pg_stat_activity 视图中查询数据库中的活动连接，如下：

```sql
SELECT
  pid,
  usename,
  application_name
FROM
  pg_stat_activity
WHERE
  datname = 'test_db';
```

```text
 pid  | usename  | application_name
------+----------+------------------
 8777 | postgres | psql
```

然后，使用 `pg_terminate_backend()` 函数结束刚刚返回的活动连接：

```sql
SELECT pg_terminate_backend(8777);
```

```text
 pg_terminate_backend
----------------------
 t
```

最后，使用 `ALTER DATABASE ... RENAME`重命名数据库就可以了

### 修改数据库的表空间

数据库的默认的表空间为 pg_default，下面说明了如何将数据库的表空间修改为 test_tablespace

首先，请使用下面的语句创建表空间：

```sql
CREATE TABLESPACE test_tablespace
OWNER postgres
LOCATION 'D:\\data\\pg_tablespaces\\test_tablespace';
```

然后，使用下面的语句修改数据库的表空间：

```sql
ALTER DATABASE test_new_db
SET TABLESPACE test_tablespace;
```

### 修改数据库是否允许连接

要将数据库设置为不允许连接，请使用下面的语句：

```sql
ALTER DATABASE test_new_db ALLOW_CONNECTIONS false;
```

要设置数据库设置为允许连接，请使用下面的语句：

```sql
ALTER DATABASE test_new_db ALLOW_CONNECTIONS true;
```

### 修改数据库的连接数

要将此数据库的连接数限制为 10， 请使用下面的语句：

```sql
ALTER DATABASE test_new_db CONNECTION LIMIT 10;
```

### 修改数据库是否为模板数据库

要设置数据库设置为模板数据库，请使用下面的语句：

```sql
ALTER DATABASE test_new_db IS_TEMPLATE true;
```

要设置数据库设置为不是模板数据库，请使用下面的语句：

```sql
ALTER DATABASE test_new_db IS_TEMPLATE false;
```

### 修改数据库的所有者

数据库 test_new_db 的所有者是 postgres，下面说明了如何要将其所有者修改为 test

首先，使用下面的语句创建 test 用户：

```sql
CREATE USER test PASSWORD '123456';
```

然后，使用下面的语句将数据库的所有者修改为 test：

```sql
ALTER DATABASE test_new_db OWNER TO test;
```