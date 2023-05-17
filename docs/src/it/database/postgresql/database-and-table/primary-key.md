---
category: IT
tag: 数据库
order: 10
article: false
---

# 主键

在关系数据库中，主键是能够唯一标识表中的每一行的一个列或者多个列的组合

## 主键规则

在 PostgreSQL 中，主键需要遵循以下规则：

- 主键是定义在表上的。一个表不强制定义主键，但最多只能定义一个主键

- 主键可以包含一个列或者多个列

- 主键列的值必须是唯一的。如果主键包含多个列，则这些列的值组合起来必须是唯一的

- 主键列中不能包含 NULL 值

主键相当于 [UNION](./unique.md) 约束和 [NOT NULL](./not-null.md) 约束的组合

如果不遵循上面的规则，则可能会引发以下的错误

- 如果要定义了多个主键，会返回错误：ERROR 1068 (42000): Multiple primary key defined

- 如果插入或者更新时有重复的主键值，则会返回类似的错误：ERROR 1062 (23000): Duplicate entry '1' for key 'users.PRIMARY'

- 如果插入了 NULL 值，则会返回类似的错误：ERROR 1048 (23000): Column 'id' cannot be null

## 定义主键

我们可以在创建表时定义主键。如下：

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(45)
);
```

这里定义了 id 列为主键

上面这种方式适合只有一列作为主键的情况，如果主键包含多列，请使用下面的方式：

```sql
CREATE TABLE users (
  com_id INTEGER,
  user_number INTEGER,
  name VARCHAR(45),
  PRIMARY KEY(com_id, user_number)
);
```

这里定义一个主键，它包含 com_id 和 user_number 2 列

## 添加主键

如果我们创建表的时候没有设置主键，而我们想为其添加一个主键，请使用下面的方式：

```sql
ALTER TABLE users
ADD PRIMARY KEY(id);
```

这里为 users 表添加了主键，该主键包括 id 列

## 删除主键

如果我们想删除一个表上主键，请执行以下的步骤：

1. 使用 `\d` 命令查找主键约束的名称：

    ```postgresql
    \d users
    ```
    
    ```text
                          Table "public.users"
    Column |         Type          | Collation | Nullable | Default
    --------+-----------------------+-----------+----------+---------
    id     | integer               |           | not null |
    name   | character varying(45) |           |          |
    Indexes:
        "users_pkey" PRIMARY KEY, btree (id)
    ```

    你可以在最后一行发现主键约束的名称是 users_pkey

2. 使用以下语句删除主键约束：

    ```sql
    ALTER TABLE users
    DROP CONSTRAINT users_pkey;
    ```

## 如何产生主键值

通常在业务系统中，我们不使用业务列作为主键，虽然它们也是唯一的。我们一般使用单独的列作为主键，这主要是出于以下两方面的原因：

1. 保护业务数据

2. 方便这些业务列的修改

为了生成唯一的主键值，我们通常采用以下方法：

1. 将主键列设置为 [SERIAL](./serial.md)

    声明为 `SERIAL` 的列会自动生成连续的整数值。以下语句使用 `SERIAL` 创建一个主键列
    
    ```sql
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(45)
    );
    ```

2. 将主键列设置为 `UUID` 类型

    ```sql
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(45)
    );
    ```

    这里，将主键列设置的数据类型设置为 `UUID`，并为它自定默认值 `gen_random_uuid()`

## 主键 vs 唯一索引

主键和唯一索引都要求值是唯一的，但它们之间存在一些不同：

- 一个表中只能定义一个主键，但是能定义多个唯一索引

- 主键中的值不能为 NULL，而索引中的值可以为 NULL