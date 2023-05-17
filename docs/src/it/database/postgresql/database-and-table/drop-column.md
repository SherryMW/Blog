---
category: IT
tag: 数据库
order: 8
article: false
---

# 删除列

有时候，您可能因为以下原因需要从现有的表中删除一个或多个列：

- 此列是多余的

- 此列数据类型已经发生变化，需要先删除列后再重新创建列并导入数据

- 此列已经被其他的列代替了

假设，您有一个用户表，它有用户名，邮件，密码等信息。但是为了安全性，您需要将密码列迁移到另外的一个表中，然后删除掉用户表中的密码列

PostgreSQL 允许您使用 `ALTER TABLE` 语句来修改一个现有的表。要从一个表中删除一列或多列，请使用 `ALTER TABLE ... DROP COLUMN` 语句

## DROP COLUMN 语法

要从一个表删除一个或者多个列，请按照如下语法使用 `ALTER TABLE ... DROP COLUMN` 语句：

```sql
ALTER TABLE table_name
DROP [COLUMN] [IF EXISTS] column_name [RESTRICT | CASCADE]
[, DROP [COLUMN] ...];
```

- table_name 是要在其中添加列的表

- `DROP [COLUMN] ...` 子句用来删除一个列。其中 COLUMN 关键字是可以省略的。如果要在一个语句中删除多个列，请使用多个逗号分隔的 `DROP [COLUMN] ...` 子句

- `IF EXISTS` 是可选的，它可以避免因为给出的列名不存在而导致的错误

- column_name 是要删除的列的名字

- `CASCADE | RESTRICT` 是可选的，它指示了如果有其他对象（比如外键、视图、触发器、存储过程等）引用了要删除的列的处理策略。其中：

    - `CASCADE` - 允许删除此列和引用此列的对象

    - `RESTRICT` - 如果有对象引用此列，拒绝删除此列，并给出错误。它是默认的选项

当您从表中删除一列时，PostgreSQL 将自动删除所有涉及删除列的索引和约束

## DROP COLUMN 示例

这个实例演示了如何在 PostgreSQL 中删除一个列或多个列

我们将在 testdb 数据库中创建 users 和 user_hobbies 两个表。其中 users 表用来存储用户的名称，性别，年龄等信息。user_hobbies 表用来存储用户的业余爱好

使用以下语句创建 users 表：

```sql
CREATE TABLE users (
  user_id INTEGER NOT NULL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  age INTEGER,
  locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL
);
```

使用以下语句创建 user_hobbies 表：

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

使用 `\d` 命令查看 user_hobbies 表的定义：

```postgresql
\d user_hobbies
```

```text
                                           Table "public.user_hobbies"
   Column   |            Type             | Collation | Nullable |                    Default
------------+-----------------------------+-----------+----------+------------------------------------------------
 hobby_id   | integer                     |           | not null | nextval('user_hobbies_hobby_id_seq'::regclass)
 user_id    | integer                     |           | not null |
 hobby      | character varying(45)       |           | not null |
 created_at | timestamp without time zone |           | not null |
Indexes:
    "user_hobbies_pkey" PRIMARY KEY, btree (hobby_id)
Foreign-key constraints:
    "fk_user" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE RESTRICT ON DELETE CASCADE
```

我们看到， user_hobbies 表中的外键 fk_user 引用了 users 表中的 user_id 列

下面的语句用来要删除 users 表中的 user_id 列：

```sql
ALTER TABLE users
DROP COLUMN user_id;
```

```text
ERROR:  cannot drop column user_id of table users because other objects depend on it
DETAIL:  constraint fk_user on table user_hobbies depends on column user_id of table users
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

由于，user_hobbies 表中的外键 fk_user 引用了 users 表中的 user_id 列，您不能删除此列， PostgreSQL 给出一个错误提示

如果要强制删除此列，请使用 `CASCADE` 选项，如下：

```sql
ALTER TABLE users
DROP COLUMN user_id
CASCADE;
```

```text
NOTICE:  drop cascades to constraint fk_user on table user_hobbies
ALTER TABLE
```

这里，user_id 列被删除了，并且 user_hobbies 表上的外键约束 fk_user 也被级联删除了

我们可以通过 `\d` 命令查看 user_id 列否被删除，如下：

```postgresql
\d users
```

```text
                           Table "public.users"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 name       | character varying(45)       |           | not null |
 age        | integer                     |           |          |
 locked     | boolean                     |           | not null | false
 created_at | timestamp without time zone |           | not null |
```

我们可以通过 `\d` 命令查看表定义以验证是否外键是否被删除，如下：

```postgresql
\d user_hobbies
```

```text
                                           Table "public.user_hobbies"
   Column   |            Type             | Collation | Nullable |                    Default
------------+-----------------------------+-----------+----------+------------------------------------------------
 hobby_id   | integer                     |           | not null | nextval('user_hobbies_hobby_id_seq'::regclass)
 user_id    | integer                     |           | not null |
 hobby      | character varying(45)       |           | not null |
 created_at | timestamp without time zone |           | not null |
Indexes:
    "user_hobbies_pkey" PRIMARY KEY, btree (hobby_id)
```