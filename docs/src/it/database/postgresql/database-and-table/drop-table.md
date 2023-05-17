---
category: IT
tag: 数据库
order: 5
article: false
---

# 删除表

当我们不需要某个表的时候，我们可以将此表删除。PostgreSQL 允许我们使用 `DROP TABLE` 语句删除一个或者多个表

注意：`DROP TABLE` 语句将永久删除表和表中的数据，请谨慎操作

## 删除表注意事项

删除表是一个很危险的操作。一个被删除后，您很难再恢复其中的数据

删除列表之前一定要确定此操作的必要性

如果您决定了要删除一个表，删除之前请一定要 [备份](../administration/backup-and-restore.md) 表表中的数据

## DROP TABLE 语法

要从数据库中删除表，您应该是超级用户或者表的所有者。请按照如下语法使用 `DROP TABLE` 语句：

```sql
DROP TABLE [ IF EXISTS ] table_name [, ...]
[ CASCADE | RESTRICT ];
```

- table_name：是要删除的表的名称

- 您可以在一个 `DROP TABLE` 语句中删除多个表，请使用逗号分隔表名

- `IF EXISTS` 选项是可选的，它可以避免由于输入的表名 table_name 不存在引发的错误

- `CASCADE | RESTRICT` 是可选的，它指示了如果有其他对象（比如外键、视图、触发器、存储过程等）引用了要删除的表的处理策略。其中：

    - CASCADE：允许删除指定的表和引用此表的对象

    - RESTRICT：如果有对象引用此表，拒绝删除此表，并给出错误。它是默认的选项

## DROP TABLE 示例

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

使用以下语句删除 users 表：

```sql
DROP TABLE users;
```

```text
ERROR:  cannot drop table users because other objects depend on it
DETAIL:  constraint fk_user on table user_hobbies depends on table users
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```

这里，删除 users 表失败了，PostgreSQL 给出一个错误提示。因为 user_hobbies 表的外键引用了 users 表，如果删除了 users 表，user_hobbies 表中的数据将是无意义的

如果要强制删除此表，请使用 `CASCADE` 选项，如下：

```sql
DROP TABLE users CASCADE;
```

```text
NOTICE:  drop cascades to constraint fk_user on table user_hobbies
DROP TABLE
```

这里，users 表被删除了，并且 user_hobbies 表上的外键约束 fk_user 也被级联删除了

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

---

如果在 `DROP TABLE` 输入了一个不存在的表名，PostgreSQL 将会给出一个错误，如下：

```sql
DROP TABLE x;
```

```text
ERROR:  table "x" does not exist
```

您可以使用 `IF EXISTS` 选项以避免这个错误，如下：

```sql
DROP TABLE IF EXISTS x;
```

```text
NOTICE:  table "x" does not exist, skipping
DROP TABLE
```

这里，该语句执行通过，PostgreSQL 给出了一个通知而不是错误