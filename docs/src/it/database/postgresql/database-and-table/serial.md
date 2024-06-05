---
category: IT
tag: 数据库
order: 17
article: false
---

# SERIAL

在 PostgreSQL 中，`SERIAL` 是一种特殊的数据类型，以帮助您在表中创建一个自增列

`SERIAL` 类型的列和 [标识列](./identity.md) 很类似，其内部都使用了序列。`SERIAL` 引入的更早，但它不是 SQL 标准的一部分，而标识列则符合 SQL 标准。因此，推荐使用标识列

## SERIAL 列

要定义一个 `SERIAL` 列，请使用以下语法：

```sql
column_name SERIAL
```

这里，`SERIAL` 作为一个数据类型跟在列名的后面

注意，`SERIAL` 列将自动添加 `NOT NULL` 约束，但不会自动成为主键列，但是您可以在列定义中使用 `PRIMARY KEY` 使该列成为主键列

要在创建表时定义一个 `SERIAL` 列，请使用以下 `CREATE TABLE` 语句：

```sql
CREATE TABLE table_name (
  column_name SERIAL,
  ...
);
```

要在已有表中添加一个 `SERIAL` 列，请使用以下 `ALTER TABLE` 语句：

```sql
ALTER TABLE table_name
  ADD COLUMN column_name SERIAL;
```

## SERIAL 种类

您可以使用三种类型的 `SERIAL` 类型以应对不同的数据范围：`SMALLSERIAL`，`SERIAL`，`BIGSERIAL`

|     姓名      |   存储大小   |          取值范围           | 对应的数据类型  |
|:-----------:|:--------:|:-----------------------:|:--------:|
| SMALLSERIAL | 	2 bytes |       	1 - 32767        | SMALLINT |
|   SERIAL    | 	4 bytes |     	1 - 2147483647     | INTEGER  |
|  BIGSERIAL  | 	8 bytes | 1 - 9223372036854775807 |  BIGINT  |

## SERIAL 示例

以下语句创建以 id 列为 `SERIAL` 列的 test_serial 表：

```sql
CREATE TABLE test_serial(
   id SERIAL PRIMARY KEY,
   notes VARCHAR NOT NULL
);
```

要查看表的定义，请使用以下 `\d` 命令：

```shell
\d test_serial
```

```text
                                 Table "public.test_serial"
 Column |       Type        | Collation | Nullable |                 Default
--------+-------------------+-----------+----------+-----------------------------------------
 id     | integer           |           | not null | nextval('test_serial_id_seq'::regclass)
 notes  | character varying |           | not null |
Indexes:
    "test_serial_pkey" PRIMARY KEY, btree (id)
```

- id 列的数据类型为 `INTEGER`

- id 列是一个 `NOT NULL` 列

- id 列具有默认值 nextval('test_serial_id_seq')。test_serial_id_seq 是内部序列的名称，这是由 PostgreSQL 自动生成的

您可以通过 `pg_get_serial_sequence()` 函数获取此列对应的内部序列名：

```sql
SELECT pg_get_serial_sequence('test_serial', 'id');
```

```text
  pg_get_serial_sequence
---------------------------
 public.test_serial_id_seq
```

以下语句向 test_serial 表中插入几个新行，其中 id 是 `SERIAL` 列，它的值会自动生成：

```sql
INSERT INTO test_serial (notes)
VALUES ('A'), ('B'), ('C');
```

要查看 test_serial 表中的行，请使用以下语句：

```sql
SELECT * FROM test_serial;
```

```text
 id | notes
----+-------
  1 | A
  2 | B
  3 | C
(3 行记录)
```

## 获取 SERIAL 列的当前值

要获取 PostgreSQL SERIAL 列的当前值，您可以使用 `currval()` 函数

`currval()` 函数序列的名称作为参数，因此您需要先获取 `SERIAL` 列对应的内部序列的名称。通常情况下，PostgreSQL 会按照如下格式为 `SERIAL` 列创建内部序列：

```text
{table_name}_{column_name}_seq
```

或者您可以通过上面实例中使用的 `\d` 命令或者 `pg_get_serial_sequence()` 函数来获取此列对应的内部序列名

然后，使用如下 `currval()` 函数获取 `SERIAL` 列的当前的值：

```sql
SELECT currval('test_serial_id_seq');
```

```text
 currval
---------
       3
```

或者，您直接使用以下一个语句来获取 `SERIAL` 列的当前的值：

```sql
SELECT currval(pg_get_serial_sequence('test_serial', 'id'));
```

```text
 currval
---------
       3
```