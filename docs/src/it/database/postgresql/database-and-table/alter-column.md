---
category: IT
tag: 数据库
order: 9
article: false
---

# 修改列

有时候，您需要修改一个已有的表中的一个已有的列。比如，修改列的名称，类型，约束，默认值等

## ALTER COLUMN 语法

```sql
ALTER TABLE table_name
ALTER [COLUMN] column_name alter_action
[, ALTER [COLUMN] ...];
```

- table_name 是要在其中添加列的表

- `ALTER [COLUMN] column_name alter_action` 子句用来修改由列名 column_name 指定的列。其中 COLUMN 关键字是可以省略的

- alter_action 是修改动作，您可以使用以下动作之一：

    - 修改列的数据类型: `[ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]`

    - 修改列的默认值：`SET DEFAULT expression`

    - 删除列的默认值：`DROP DEFAULT`

    - 设置或删除不能为 NULL: `{ SET | DROP } NOT NULL`

    - 将生成列转为普通列: `DROP EXPRESSION [ IF EXISTS ]`

    - 修改列为标识列: `ADD GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [ ( sequence_options ) ]`

    - 修改标识列的生成策略: `{ SET GENERATED { ALWAYS | BY DEFAULT } | SET sequence_option | RESTART [ [ WITH ] restart ] } [...]`

    - 将标识列转为普通列: `DROP IDENTITY [ IF EXISTS ]`

    - 设置列的统计信息手机目标: `SET STATISTICS integer`

    - 设置属性选项: `SET ( attribute_option = value [, ... ] )`

    - 重置属性: `RESET ( attribute_option [, ... ] )`

    - 设置列的存储模式: `SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }`

    - 设置列的压缩方法: `SET COMPRESSION compression_method`


## ALTER COLUMN 示例

### 重命名列

我们将在 testdb 数据库中创建 users 和 user_hobbies 两个表。其中，users 表用来存储用户的名称，性别，年龄等信息。user_hobbies 表用来存储用户的业余爱好

使用以下语句创建 users 表：

```sql
DROP TABLE IF EXISTS users;

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
DROP TABLE IF EXISTS user_hobbies;

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

使用 `\d` 命令查看 users 表的定义：

```postgresql
\d users
```

```text
                           Table "public.users"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 user_id    | integer                     |           | not null |
 name       | character varying(45)       |           | not null |
 age        | integer                     |           |          |
 locked     | boolean                     |           | not null | false
 created_at | timestamp without time zone |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (user_id)
Referenced by:
    TABLE "user_hobbies" CONSTRAINT "fk_user" FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE RESTRICT ON DELETE CASCADE
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

我们看到，user_hobbies 表中的外键 fk_user 引用了 users 表中的 user_id 列

下面的语句用来要将 users 表 user_id 列重命名为 id：

```sql
ALTER TABLE users
RENAME COLUMN user_id TO id;
```

由于 user_hobbies 表中的外键 fk_user 引用了 users 表中的 user_id 列，因此 PostgreSQL 自动更新了这个外键依赖的列名

我们可以通过 `\d` 命令查看表定义以验证 user_hobbies 表中外键是否被更新，如下：

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
    "fk_user" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE
```

从最后一行的 users(id)，我们看到了外键中依赖的列名被自动更新了

### 修改列类型

要修改一个列的数据类型，请使用以下语法：

```sql
ALTER TABLE table_name
  ALTER [ COLUMN ] column_name [ SET DATA ] TYPE data_type [ USING expression ]
```

- 在 `ALTER TABLE` 关键字后指定要更改的列的表名

- 在 `ALTER COLUMN` 子句后指定要更改数据类型的列的名称

- 为 `TYPE` 关键字后的列提供新的数据类型。该 `SET DATA TYPE` 和 `TYPE` 是等价的

- PostgreSQL 允许您通过添加 `USING` 子句在修改数据类型时将列的值转换为新的值

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

要从一个列删除 [NOT NULL](./not-null.md) 约束，请使用以下语法：

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

### 更改列类型示例

让我们创建一个新表命名 orders 并插入一些行

```sql
CREATE TABLE orders (
    id serial PRIMARY KEY,
    order_no VARCHAR NOT NULL
);
```

```sql
INSERT INTO orders(order_no)
VALUES('10001'), ('10002');
```

要将 order_no 列的数据类型更改为 `INT`，请使用以下语句：

```sql
ALTER TABLE orders
ALTER COLUMN order_no TYPE INT;
```

PostgreSQL 发出了一个错误和一个非常有用的提示：

```text
ERROR:  column "order_no" cannot be cast automatically to type integer
HINT:  You might need to specify "USING order_no::integer".
```

以下语句将 `USING` 子句添加到上述语句中：

```sql
ALTER TABLE orders
ALTER COLUMN order_no TYPE INT
USING order_no::integer;
```

修改成功