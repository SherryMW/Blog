---
category: IT
tag: 数据库
order: 4
article: false
---

# 创建表

表是关系数据库中数据存储的基本单位。您可以在表中存储结构化数据。一个数据库中可以包含多个表，一个表有行和列组成。表和表之间拥有一些关系，比如一对一，一对多，多对多等

PostgreSQL 允许您使用 `CREATE TABLE` 语句创建新表

## CREATE TABLE 语法

你需要在表定义中声明表中的列，以及表上的约束。请按照如下语法使用 `CREATE TABLE` 语句：

```sql
CREATE TABLE [IF NOT EXISTS] table_name (
   column_name data_type column_contraint
   [, ...]
   table_constraint
);
```

- table_name：是要创建的表的名字。表名应该符合以下规则：

    - 表名可由字母、数字、下划线和美元符号组成，表名最大长度为 63 个字符

    - 表名在一个数据库中是唯一的

- `IF NOT EXISTS`：指示只有给定的表不存在的时候才进行创建。它是可选的。如果你给定一个已经存在的表名，又没有使用 `IF NOT EXISTS` 子句，服务器会返回一个错误

- column_name：是该列的名字。列名应该符合以下规则：

    - 列名可由字母、数字、下划线和美元符号组成，列名最大长度为 63 个字符

    - 列名在一个表中是唯一的

- data_type：是该列要存储的数据的数据类型，比如：[VARCHAR](../data-type/string.md)，[INTEGER](../data-type/integer.md)，[BOOLEAN](../data-type/boolean.md)，[DATE](../data-type/date.md)，[TIME](../data-type/time.md)，[TIMESTAMP](../data-type/timestamp.md)，[ARRAY](../data-type/array.md)，[JSON](../data-type/json.md) 等

- column_contraint 是该列的约束，比如：

    - [PRIMARY KEY](./primary-key.md)

    - [FOREIGN KEY](./foreign-key.md)

    - [NOT NULL](./not-null.md)

    - [UNIQUE](./unique.md)

    - [CHECK](./check.md)

    - [生成列](./generated.md)

    - [标识列](./identity.md)

- column_name data_type column_contraint 为一个列的定义。您可以在表中定义多个列，多个列定义使用逗号分隔

- table_constraint 是表上的约束，包括：[PRIMARY KEY](./primary-key.md)，[FOREIGN KEY](./foreign-key.md)，[UNIQUE](./unique.md) 和 [CHECK](./check.md)

- ; 不是语句的一部分，它只是表示语句的结束

## CREATE TABLE 示例

在下面的示例中，我们将在 testdb 数据库中创建 users 和 user_hobbies 两个表。其中，users 表用来存储用户的名称，性别，年龄等信息。user_hobbies 表用来存储用户的业余爱好

1. 使用 postgres 用户登录 PostgreSQL 服务器：

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.
    
    postgres=#
    ```
    
    注意：您也可以使用其他任何具有相应的数据库权限的用户登录

2. 使用以下语句选择 testdb 数据库：

    ```postgresql
    \c testdb;
    ```

    如果还未创建数据库，请先运行如下语句：

    ```sql
    CREATE DATABASE testdb;
    ```

3. 使用以下语句创建 users 表：

    ```sql
    CREATE TABLE users (
      user_id INTEGER NOT NULL PRIMARY KEY,
      name VARCHAR(45) NOT NULL,
      age INTEGER,
      locked BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL
    );
    ```

    这里创建的 users 表有 5 个字段：

   - user_id 列的数据类型是 `INTEGER`，它不能为 NULL，并且它是主键

   - name 列的数据类型是 `VARCHAR`，它最多为 45 个字符。它不能为 NULL

   - age 列的数据类型是 `INTEGER`。它可以是 NULL

   - locked 列的数据类型是 `BOOLEAN`。它不能为 NULL，但是它有默认值 false

   - created_at 列的数据类型是 `TIMESTAMP`。它不能为 NULL

4. 使用以下语句创建 user_hobbies 表：

    ```sql
    CREATE TABLE user_hobbies (
      hobby_id SERIAL NOT NULL,
      user_id INTEGER NOT NULL,
      hobby VARCHAR(45) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      PRIMARY KEY (hobby_id),
      CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT);
    ```

    这里创建的 user_hobbies 表有 4 个字段：

   - hobby_id 列的数据类型是 `INTEGER`。它不能为 NULL，并且它是一个自增序列 

   - user_id 列的数据类型是 `INTEGER`。它不能为 NULL。它通过外键指向了 users 表的 user_id 列

   - hobby 列的数据类型是 `VARCHAR`，它最多为 45 个字符。 它不能为 NULL

   - created_at 列的数据类型是 `TIMESTAMP`。它不能为 NULL

    user_hobbies 表的约束有：

   - PRIMARY KEY (hobby_id) 子句表明 hobby_id 列是主键

   - CONSTRAINT fk_user 定义了一个外键约束。这个外键将 user_id 列引用了 users 表的 user_id 列

5. 使用如下语句向 users 表中插入数据行：

    ```sql
    INSERT INTO users (user_id, name, age, created_at)
    VALUES (1, 'Jim', 18, NOW());
    ```
    
    使用 SELECT 语句检查 users 表中的数据行：
    
    ```sql
    SELECT * FROM users;
    ```
    
    ```text
     user_id | name | age | locked |         created_at
    ---------+------+-----+--------+----------------------------
           1 | Jim  |  18 | f      | 2022-08-10 16:11:59.497166
    ```

6. 使用如下语句向 user_hobbies 表中插入数据行：

    ```sql
    INSERT INTO user_hobbies (user_id, hobby, created_at)
    VALUES (1, 'Football', NOW()), (1, 'Swimming', NOW());
    ```
    
    使用 SELECT 语句检查 user_hobbies 表中的数据行：
    
    ```sql
    SELECT * FROM user_hobbies;
    ```
    
    ```text
     hobby_id | user_id |  hobby   |         created_at
    ----------+---------+----------+----------------------------
            1 |       1 | Football | 2022-08-10 16:13:25.815005
            2 |       1 | Swimming | 2022-08-10 16:13:25.815005
    ```

## 从一个已有的表创建一个新表

您可以使用 `CREATE TABLE` 语句从一个已有的表创建一个新表，请参照如下语法：

```sql
CREATE TABLE [IF NOT EXISTS] table_name
AS TABLE existing_table_name
[WITH NO DATA];
```

- table_name 是要创建的表的名字

- existing_table_name 是已存在的表的名字

- WITH NO DATA 指示只创建表而不拷贝数据。它是可选的。如果省略它，则即创建表又拷贝原表中的数据

注意，原表中的索引和约束不会被复制到新表

以下展示了一些实例：

根据 users 表创建 users_copy 表：

```sql
CREATE TABLE users_copy
AS TABLE users;
```

只创建 users_copy 表，不拷贝 users 表中的数据行：

```sql
CREATE TABLE users_copy
AS TABLE users
WITH NO DATA;
```

## 从结果集创建一个新表

您可以使用 `CREATE TABLE ... AS` 语句从一个 `SELECT` 语句返回的结果集创建一个新表，请参照如下语法：

```sql
CREATE TABLE [IF NOT EXISTS] table_name
AS
SELECT ...;
```

如果复制一个表中的所有的列，您可以使用 `SELECT * FROM original_table`

如果复制一个表中的指定的列，您可以使用 `SELECT column1, column2, ... FROM original_table`

注意，原表中的索引和约束不会被复制到新表

以下展示了一些实例：

根据 users 表创建 users_copy 表：

```sql
CREATE TABLE users_copy
AS
SELECT * FROM users;
```

只创建 users_copy 表，不拷贝 users 表中的数据行：

```sql
CREATE TABLE users_copy
AS
SELECT * FROM users WHERE false;
```

根据 users 表中的部分列创建 users_copy 表：

```sql
CREATE TABLE users_copy
AS
SELECT user_id, name FROM users;
```

根据一个单纯的结果集创建一个表：

```sql
CREATE TABLE test_1
AS
SELECT 1 x;
```

这里创建了一个只有 x 列的 test_1 表

此外，您可以使用 [SELECT INTO](./select-into.md) 语句从一个结果集创建一个表