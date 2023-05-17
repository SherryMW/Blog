---
category: IT
tag: 数据库
order: 13
article: false
---

# 唯一约束

在 PostgreSQL 中，我们可以在一个表上定义很多约束，比如 [主键约束](./primary-key.md)、[外键约束](./foreign-key.md)。唯一约束也是一个常用的约束，用来保证表中的一列或几列的中的值是唯一的

我们在很多系统中都用到唯一约束约束，例如：

- 用户表中有登录名或电子邮件列是唯一的

- 产品表中的产品编号列是唯一的

- 订单表中有订单编号列是唯一的

- 每天的统计报表中将 年、月、日 三个列作为组合唯一约束

与主键相比，主键用于表示一个行的唯一性，主键的一般采用一个与业务无关的值，比如自增值，UUID 等。而唯一约束一般用于约束与业务相关的数据的唯一性

主键列不能包含 NULL 值，而唯一约束列可以包含 NULL 值。在 PostgreSQL 中，一个唯一约束对应了一个唯一索引

## UNIQUE 语法

要定义唯一约束，请使用 `UNIQUE` 关键字。您可以在创建表的时候定义唯一约束或者创建表后通过修改表增加一个唯一约束

### 定义一列为唯一约束

这里是创建表时定义一列为唯一列的语法：

```sql
CREATE TABLE table_name(
    ...,
    column_name data_type UNIQUE,
    ...
);
```

### 定义多列为唯一约束

如果唯一约束包含多个列，请使用如下语法：

```sql
CREATE TABLE table_name(
   column_name1 column_definition,
   column_name2 column_definition,
   ...,
   [CONSTRAINT constraint_name]
      UNIQUE(column_name1, column_name2)
);
```

- `CONSTRAINT` constraint_name 用于定义一个约束的名称。 它是可选的。如果不定义约束名称，PostgreSQL 会自动为他生成一个

- `UNIQUE` 关键子后的括号中包含了逗号分隔的多个列

### 添加唯一约束语法

我们也可以向已有的表中添加一个唯一约束。这是添加唯一约束的语法：

```sql
ALTER TABLE table_name
ADD [CONSTRAINT constraint_name] UNIQUE (column_list);
```

注意，如果现有表中的要设置为唯一约束的列中已有重复数据，PostgreSQL 服务器会返回错误

### 删除唯一约束语法

要从表上删除唯一约束，你可以使用 `ALTER TABLE` 语句：

```sql
ALTER TABLE table_name
  DROP CONSTRAINT constraint_name;
```

## UNIQUE 示例

让我们看一些实际的例子来了解唯一约束约束的用法

首先，我们首先创建一个演示表 user_hobby，它有一个包含了 2 列的唯一约束。也就是说，同一个用户不能有两个相同的业余爱好

```sql
DROP TABLE IF EXISTS user_hobby;
CREATE TABLE user_hobby (
  hobby_id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  hobby VARCHAR(45) NOT NULL,
  PRIMARY KEY (hobby_id),
  CONSTRAINT unique_user_hobby
    UNIQUE(user_id, hobby)
);
```

这里，我们定义了一个名字为 unique_user_hobby 唯一约束，它包含了 user_id 和 hobby 2 列

然后，我们插入两行测试数据：

```sql
INSERT INTO user_hobby (user_id, hobby)
VALUES (1, 'Football'), (1, 'Swimming');
```

现在我们查看一下表中的数据：

```sql
SELECT * FROM user_hobby;
```

```text
 hobby_id | user_id |  hobby
----------+---------+----------
        1 |       1 | Football
        2 |       1 | Swimming
(2 行记录)
```

### 唯一约束

让我们再插入一行和已有 user_id 和 hobby 列相同的数据

```sql
INSERT INTO user_hobby (user_id, hobby)
VALUES (1, 'Football');
```

```text
ERROR:  duplicate key value violates unique constraint "unique_user_hobby"
DETAIL:  Key (user_id, hobby)=(1, Football) already exists.
```

PostgreSQL 返回了上述错误。唯一约束约束避免了插入重复的数据

### 删除唯一约束

让我们通过下面的语句删除唯一约束：

```sql
ALTER TABLE user_hobby
  DROP CONSTRAINT unique_user_hobby;
```

你需要提供约束名称以供删除。如果你不知道它的名字或者创建唯一约束的时候未指定约束名，请使用 `\d` 命令显示一个表中的所有的索引名：

```postgresql
\d user_hobby
```

```text
                                       Table "public.user_hobby"
  Column  |         Type          | Collation | Nullable |                   Default
----------+-----------------------+-----------+----------+----------------------------------------------
 hobby_id | integer               |           | not null | nextval('user_hobby_hobby_id_seq'::regclass)
 user_id  | integer               |           | not null |
 hobby    | character varying(45) |           | not null |
Indexes:
    "user_hobby_pkey" PRIMARY KEY, btree (hobby_id)
    "unique_user_hobby" UNIQUE CONSTRAINT, btree (user_id, hobby)
```

## 唯一约束与 NULL 值

不像主键，唯一约束允许其中的列接受 NULL 值。但是，NULL 值会破坏唯一约束约束。也就是唯一约束对 NULL 值无效。让我们看一下下面的例子

现在我们修改一下刚刚的建表语句，其中允许 hobby 列为 NULL：

```sql
DROP TABLE IF EXISTS user_hobby;
CREATE TABLE user_hobby (
  hobby_id SERIAL NOT NULL,
  user_id INTEGER NOT NULL,
  hobby VARCHAR(45),
  PRIMARY KEY (hobby_id),
  CONSTRAINT unique_user_hobby
    UNIQUE(user_id, hobby)
);
```

让我们插入两行一样的数据：

```sql
INSERT INTO user_hobby (user_id, hobby)
VALUES (1, NULL), (1, NULL);
```

然后让我们看一下表中的数据：

```sql
SELECT * FROM user_hobby;
```

```text
 hobby_id | user_id | hobby
----------+---------+--------
        1 |       1 | <null>
        2 |       1 | <null>
(2 行记录)
```

我们看到了唯一约束的两列出现了重复的 NULL 值。NULL 让唯一约束失效了