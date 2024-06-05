---
category: IT
tag: 数据库
order: 6
article: false
---

# 修改表

在 PostgreSQL 中，`ALTER TABLE` 语句用来修改一个现有的表，包括：重命名表、添加列、删除列、修改列、添加约束、删除约束等

## ALTER TABLE 用法概述

由于 `ALTER TABLE` 语句能修改一个表的方方面面，因此它的它的语法非常复杂

下面说明了该 `ALTER TABLE` 语句的基本语法：

```sql
ALTER TABLE [IF EXISTS] table_name
   [alter_action options]
   [, ...];
```

table_name 是要修改的表的名字。`IF EXISTS` 是可选的，其中 alter_action 是一个修改动作，主要包括以下关键字：

- `ADD` 关键字可用来添加列和约束

- `DROP` 关键字可用来删除列和约束

- `ALTER` 关键字可用来修改现有的列和约束

- `RENAME` 关键字可用来重命名表、列、和约束

- `SET` 关键字可用来修改表的架构、表空间

- `ENABLE` 关键字可用来启用触发器、规则、和行安全策略

- `DISABLE` 关键字可用来禁用触发器、规则、和行安全策略

## ALTER TABLE 示例

### 重命名表

我们将在 testdb 数据库中创建 users 和 user_hobbies 两个表。其中，users 表用来存储用户的名称，性别，年龄等信息。user_hobbies 表用来存储用户的业余爱好

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

要查看 user_hobbies 表的定义，请使用 `\d` 命令：

```shell
\d user_hobbies;
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

这里，user_hobbies 表具有一个引用 users 表的外键

假设，您所在的团队制定了新的命名规则，所有的表都需要一个 t_ 开头，因此您需要将 users 表重命名为 t_users，将 user_hobbies 表重命名为 t_user_hobbies

要将 users 表重命名为 t_users，请使用下面的语句：

```sql
ALTER TABLE users RENAME TO t_users;
```

再次使用 `\d` 命令查看 user_hobbies 表的定义：

```shell
\d user_hobbies;
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
    "fk_user" FOREIGN KEY (user_id) REFERENCES t_users(user_id) ON UPDATE RESTRICT ON DELETE CASCADE
```

从输出中可以清楚地看到，外键约束已更新并改为引用 t_users 表

### 修改表架构

要修改一个表的架构，请使用以下语法：

```sql
ALTER TABLE table_name
  SET SCHEMA new_schema
```

### 修改表空间

要修改一个表的表空间，请使用以下语法：

```sql
ALTER TABLE table_name
  SET TABLESPACE new_tablespace
```

### 添加列

要向一个表中 [添加一个列](./add-column.md)，请使用以下语法：

```sql
ALTER TABLE table_name
  ADD [COLUMN] [IF NOT EXISTS] column_name data_type [ column_constraint [ ... ] ]
```

### 删除列

要从表中 [删除一个列](./drop-column.md)，请使用以下语法：

```sql
ALTER TABLE table_name
  DROP [ COLUMN ] [ IF EXISTS ] column_name [ RESTRICT | CASCADE ]
```

### 重命名列

要重命名一个列，请使用以下语法：

```sql
ALTER TABLE table_name
  RENAME [ COLUMN ] column_name TO new_column_name
```

### 修改列类型

要修改一个列的数据类型，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type
```

### 为列设置默认值

要修改一个列的默认值，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name SET DEFAULT expression
```

### 删除列默认值

要删除一个列的默认值，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name DROP DEFAULT
```

### 为列添加 NOT NULL

要为一个列添加 [NOT NULL](./not-null.md) 约束，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name SET NOT NULL
```

### 删除列 NOT NULL

要从一个列删除 NOT NULL 约束，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name DROP NOT NULL
```

### 标识列

要修改一个列为 [标识列](./identity.md)，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name ADD GENERATED { ALWAYS | BY DEFAULT }
      AS IDENTITY [ ( sequence_options ) ]
```

要将一个标识列修改为普通列，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name DROP IDENTITY [ IF EXISTS ]
```

### 添加约束

要向一个表中添加一个约束，请使用以下语法：

```sql
ALTER TABLE table_name
  ADD [ CONSTRAINT constraint_name ]
      { CHECK ( expression ) [ NO INHERIT ] |
        UNIQUE ( column_name [, ... ] ) index_parameters |
        PRIMARY KEY ( column_name [, ... ] ) index_parameters |
        EXCLUDE [ USING index_method ] ( exclude_element WITH operator [, ... ] ) index_parameters [ WHERE ( predicate ) ] |
        FOREIGN KEY ( column_name [, ... ] ) REFERENCES reftable [ ( refcolumn [, ... ] ) ]
          [ MATCH FULL | MATCH PARTIAL | MATCH SIMPLE ] [ ON DELETE referential_action ] [ ON UPDATE referential_action ] }
      [ DEFERRABLE | NOT DEFERRABLE ] [ INITIALLY DEFERRED | INITIALLY IMMEDIATE ]
```

### 删除约束

要从表中删除一个约束，请使用以下语法：

```sql
ALTER TABLE table_name
  DROP CONSTRAINT [ IF EXISTS ]  constraint_name [ RESTRICT | CASCADE ]

```

### 重命名约束

要重命名一个约束，请使用以下语法：

```sql
ALTER TABLE table_name
  RENAME CONSTRAINT constraint_name TO new_constraint_name
```