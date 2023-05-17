---
category: IT
tag: 数据库
order: 19
article: false
---

# 临时表

PostgreSQL 临时表是一种特殊的表，他们只在会话期间存在。临时表会在会话结束的时候被自动删除

## 创建临时表

您可以使用 `CREATE TEMPORARY TABLE` 语句像创建普通表一样创建临时表，如下：

```sql
CREATE { TEMPORARY | TEMP } TABLE temp_table_name (
   column_name data_type column_contraint
   [, ...]
   table_constraint
);
```

相比于常规的 `CREATE TABLE` 语句，它只是多了一个 `TEMPORARY` 或者 `TEMP` 关键字，以指示当前创建的表是一个临时表

您可以为临时表使用一个和常规表相同的表名，但是在临时表存在期间，您不能访问常规表

## 删除临时表

要删除一个临时表，您可以使用 `DROP TABLE` 语句，如下：

```sql
DROP TABLE temp_table_name;
```

这与删除常规表完全一样

或者，您可以通过退出会话让 PostgreSQL 自动删除临时表

## 临时表示例

### 创建临时表的示例

以下语句创建了一个名为 test_temp 的临时表：

```sql
CREATE TEMP TABLE test_temp (
  id SERIAL PRIMARY KEY,
  notes VARCHAR
);
```

使用 `\dt` 命令查看数据库中的表：

```postgresql
\dt
```

```text
                List of relations
  Schema   |       Name        | Type  |  Owner
-----------+-------------------+-------+----------
 pg_temp_4 | test_temp         | table | postgres
 public    | test_serial       | table | postgres
 public    | test_serial_big   | table | postgres
 public    | test_serial_small | table | postgres
 public    | user_hobbies      | table | postgres
 public    | users             | table | postgres
(6 行记录)
```

注意，临时表的 Schema 值是 pg_temp_4，而常规表的 Schema 值是 public

### 创建与常规表同名的临时表的示例

在创建临时表 users 之前，我们先看以下常规表 users 的结构：

```postgresql
\d users
```

```text
                           Table "public.users"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 id         | integer                     |           | not null |
 name       | character varying(45)       |           | not null |
 age        | integer                     |           |          |
 locked     | boolean                     |           | not null | false
 created_at | timestamp without time zone |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "user_hobbies" CONSTRAINT "fk_user" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE
```

以下语句创建一个名称为 users 的临时表，为了区分，临时表 users 只由一个 id 列：

```sql
CREATE TEMP TABLE users (
  id SERIAL PRIMARY KEY
);
```

使用 `\dt` 命令查看数据库中的表：

```postgresql
\dt
```

```text
                List of relations
  Schema   |       Name        | Type  |  Owner
-----------+-------------------+-------+----------
 pg_temp_4 | test_temp         | table | postgres
 pg_temp_4 | users             | table | postgres
 public    | test_serial       | table | postgres
 public    | test_serial_big   | table | postgres
 public    | test_serial_small | table | postgres
 public    | user_hobbies      | table | postgres
(6 行记录)
```

现在，常规表 users 已经找不到了

以下语句使用 `\d` 查看 users 的表结构：

```postgresql
\d users
```

```text
                           Table "pg_temp_4.users"
 Column |  Type   | Collation | Nullable |              Default
--------+---------+-----------+----------+-----------------------------------
 id     | integer |           | not null | nextval('users_id_seq'::regclass)
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
```

这里是临时表 users 的结构

删除临时表 users：

```sql
DROP TABLE users;
```

然后，再次使用 `\dt` 命令查看数据库中的表：

```postgresql
\dt
```

```text
                List of relations
  Schema   |       Name        | Type  |  Owner
-----------+-------------------+-------+----------
 pg_temp_4 | test_temp         | table | postgres
 public    | test_serial       | table | postgres
 public    | test_serial_big   | table | postgres
 public    | test_serial_small | table | postgres
 public    | user_hobbies      | table | postgres
 public    | users             | table | postgres
(6 行记录)
```

临时表 users 不见了，常规表 users 又出现在了上面的列表中