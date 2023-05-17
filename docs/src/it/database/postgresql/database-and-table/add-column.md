---
category: IT
tag: 数据库
order: 7
article: false
---

# 添加列

有时候，您需要向一个已有的表中添加一个新的列以保存一些必要的信息

假设，您有一个用户表，它用来存储用户名，邮件，密码等信息。但是随着系统的需求的变动，您需要在用户表中保存手机号码。要做到这些，您不需要重新创建一个表，只需要在现有的表上添加一个列即可

PostgreSQL 允许您使用 `ALTER TABLE` 语句来修改一个现有的表。要向一个表中添加一列或多列，请使用 `ALTER TABLE ... ADD COLUMN` 语句

## ADD COLUMN 语法

要将新列添加到现有表，请按照如下语法使用 `ALTER TABLE ... ADD COLUMN` 语句：

```sql
ALTER TABLE table_name
ADD [COLUMN] [IF NOT EXISTS] column_name data_type column_contraint
[, ADD [COLUMN] ...];
```

- table_name 是要在其中添加列的表

- `ADD [COLUMN] ...` 子句用来添加一个列。其中 COLUMN 关键字是可以省略的。如果要在一个语句中添加多个列，请使用多个逗号分隔的 `ADD [COLUMN] ...` 子句

- column_name 是要添加的列的名字。列名应该符合以下规则：

    - 列名可由字母、数字、下划线和美元符号组成，列名最大长度为 63 个字符

    - 列名在一个表中是唯一的

- data_type 是要添加的列要存储的数据的数据类型，比如：[VARCHAR](../data-type/string.md)，[INTEGER](../data-type/integer.md)，[BOOLEAN](../data-type/boolean.md)，[DATE](../data-type/date.md)，[TIME](../data-type/time.md)，[TIMESTAMP](../data-type/timestamp.md)，[ARRAY](../data-type/array.md)，[JSON](../data-type/json.md) 等

- column_contraint 是要添加的列的约束，比如 [NOT NULL](./not-null.md)，[UNIQUE](./unique.md)，[PRIMARY KEY](./primary-key.md)，[FOREIGN KEY](./foreign-key.md) 和 [CHECK](./check.md) 等

- `IF NOT EXISTS` 可以避免因为给出的重复的列名而导致的错误。它是可选的

新的列将会被添加到表的末尾。您不能为新的列指定位置

如果表中已有一些行，新的列的约束可能会导致错误，您可以在列定义上添加默认值，或者通过以下步骤解决：

1. 添加不带约束的列

2. 更新新加的列的数据

3. 为新的列添加约束

## 查看表中所有的列

在向表中添加一个列之前，您可以需要首先确定此表中是否存在同名的列

在 PostgreSQL 中， 要查看一个表中的所有列的信息，您可以使用 `\d` 命令列出表的定义，或者从 information_schema.columns 表中查找出来

`\d` 命令的用法如下：

```postgresql
\d table_name
```

要从 information_schema.columns 表中查找一个表中所有的列，请使用下面的语句：

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'table_name';
```

## ADD COLUMN 示例

这个实例演示了如何使用 `ALTER TABLE ... ADD COLUMN` 语句向表中添加一个或两个列

假设，有一个用户表，其中有 ID 和 用户名 两列

使用以下语句在 testdb 数据库中 创建一个表 users 用以存储用户信息：

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

如果您没有 testdb 数据库，请先使用如下语句创建数据库 并切换到数据库：

```sql
CREATE DATABASE testdb;
```

```postgresql
\c testdb;
```

创建表后，您可以使用 `\d` 命令查看此表中的所有列：

```postgresql
\d users;
```

```text
                                    Table "public.users"
 Column |          Type          | Collation | Nullable |              Default
--------+------------------------+-----------+----------+-----------------------------------
 id     | integer                |           | not null | nextval('users_id_seq'::regclass)
 name   | character varying(100) |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
```

向用户表中插入一行数据，如下；

```sql
INSERT INTO users (name) values ('Tim');
```

### 使用 ADD COLUMN 向表中添加一列

要想在 users 表保存用户的年龄，你需要使用以下语句向 users 表中添加 age 列

```sql
ALTER TABLE users
ADD COLUMN age INTEGER NOT NULL;
```

```text
ERROR:  column "age" contains null values
```

这里，PostgreSQL 给出了一个错误。这是因为表不是一个空表，它已经有了一行。要添加的 age 列是 NOT NULL 的 导致了这个错误的发生。要避免这个错误，您可以为 age 列指定一个默认值，如下：

```sql
ALTER TABLE users
ADD COLUMN age INTEGER NOT NULL DEFAULT 18;
```

这里，我们添加了一个 age 列，它的类型是 `INTEGER`，并且是非空列，默认值是 18

添加了 age 列后，原有行中的 age 列的值都是 18。下面语句检索了 users 表中的所有的行：

```sql
SELECT * FROM users;
```

```text
 id | name | age
----+------+-----
  1 | Tim  |  18
```

### 使用 ADD COLUMN 向表中添加二列

随着系统的发展，您可能需要在用户表中保存用户的电子邮件和手机号信息。这几乎已经是用户的必备信息

要向 users 表中添加 email 和 cellphone 列，请使用以下语句：

```sql
ALTER TABLE users
ADD COLUMN email VARCHAR(100),
ADD COLUMN cellphone VARCHAR(100);
```

这里，我们向 users 表中添加了两个列： email 用于电子邮件地址 和 cellphone 用于手机号码

让我们检查 users 表的行：

```sql
SELECT * FROM users;
```

```text
 id | name | age | email | cellphone
----+------+-----+-------+-----------
  1 | Tim  |  18 |       |
```

最后，让我们使用 `\d` 命令查看此表中的所有列：

```postgresql
\d users;
```

```text
                                     Table "public.users"
  Column   |          Type          | Collation | Nullable |              Default
-----------+------------------------+-----------+----------+-----------------------------------
 id        | integer                |           | not null | nextval('users_id_seq'::regclass)
 name      | character varying(100) |           | not null |
 age       | integer                |           | not null | 18
 email     | character varying(100) |           |          |
 cellphone | character varying(100) |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
```