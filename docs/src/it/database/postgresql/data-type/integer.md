---
category: IT
tag: 数据库
order: 2
article: false
---

# 整型

整数类型将内容存储为整数，PostgreSQL 提供了三种整数数据类型：`SMALLINT`，`INTEGER`，和 `BIGINT`

- `SMALLINT` 类型：`SMALLINT` 类型用于存储小范围整数，其占用 2 个字节（16 位）。它的取值范围为 -32768 到 32767。通常情况下，如果您需要存储小于 32767 的整数，可以使用 `SMALLINT` 类型

- `INTEGER` 类型：`INTEGER` 类型用于存储常规整数，其占用 4 个字节（32 位）。它的取值范围为 -2147483648 到 2147483647。如果您需要存储一般的整数数据，可以使用 `INTEGER` 类型

- `BIGINT` 类型：`BIGINT` 类型用于存储大范围整数，其占用 8 个字节（64 位）。它的取值范围为 -9223372036854775808 到 9223372036854775807。如果您需要存储大型整数数据，可以使用 `BIGINT` 类型

需要注意的是，如果您要存储的整数数据不超过 `SMALLINT` 的取值范围，使用 `SMALLINT` 类型可以节省存储空间。但是，在实际应用中，如果您不确定要存储的整数数据的范围，通常建议使用 `INTEGER` 或 `BIGINT` 类型，以免因数据超出取值范围而导致错误。另外需要注意，`BIGINT` 类型占用空间大，会降低数据库性能

此外，PostgreSQL 还支持其他整数类型，例如 `SERIAL` 和 `BIGSERIAL` 类型。它们是基于 `INTEGER` 和 `BIGINT` 类型的自增序列类型，用于在插入数据时自动生成唯一标识符。如果您需要自动生成唯一标识符，可以考虑使用这些类型

## 整型用法

要定义一个整数类型的列，请使用如下语法：

```sql
column_name {SMALLINT | INTEGER | BIGINT} column_constrait
```

注意，`INT` 是 `INTEGER` 的同义词，您可以使用 `INT` 代替 `INTEGER`

要定义一个整数类型的 [主键列](../database-and-table/primary-key.md)，请使用如下语法：

```sql
column_name {SMALLINT | INTEGER | BIGINT} GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

要定义一个整数类型的 [标识列](../database-and-table/identity.md)，请使用如下语法：

```sql
column_name {SMALLINT | INTEGER | BIGINT} GENERATED ALWAYS AS IDENTITY
```

要定义一个 [SERIAL](../database-and-table/serial.md) 列，请使用如下语法：

```sql
column_name SERIAL PRIMARY KEY
```

注意，`SMALLSERIAL` 的内部类型为 `SMALLINT`；`SERIAL` 的内部类型为 `INTEGER`；`BIGSERIAL` 的内部类型为 `BIGINT`

## 整数类型示例

### SMALLINT 类型示例

首先，使用下面的语句创建一个测试表：

```sql
CREATE TABLE test_smallint(
  name TEXT NOT NULL,
  age SMALLINT NOT NULL
);
```

使用下面的语句插入两行数据：

```sql
INSERT INTO test_smallint (name, age)
VALUES ('Tom', '23'), ('Lucy', 20)
RETURNING *;
```

```text
 name | age
------+-----
 Tom  |  23
 Lucy |  20
```

注意， 虽然我们为整数列传入了一个字符类型的值 '23'，PostgreSQL 自动将其转成了数字并存储到数据库

### 使用 INTEGER 列作为主键

通常，`INTEGER` 数据类型的标识列可以作为主键列：

```sql
CREATE TABLE test_int_pk(
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  age SMALLINT NOT NULL
);
```

这里，id 列是主键列。它的类型是 `INTEGER`，并且使用了 `GENERATED ALWAYS AS IDENTITY` 属性。该列的值将自动递增

使用下面的语句插入和上面例子中相同的两条数据：

```sql
INSERT INTO test_int_pk (name, age)
VALUES ('Tom', '23'), ('Lucy', 20)
RETURNING *;
```

```text
 id | name | age
----+------+-----
  1 | Tom  |  23
  2 | Lucy |  20
```