---
category: IT
tag: 数据库
order: 7
article: false
---

# TIME

PostgreSQL 支持 `TIME` 数据类型，以存储时间值。PostgreSQL 存储 `TIME` 数据类型值使用 8 个字节。`TIME` 数据类型允许的范围是从 00:00:00 到 24:00:00

`TIME` 数据类型采用以下格式存储：

```text
HH:MI:SS.ssssss
```

- `HH` 表示小时

- `MI` 表示分钟

- `SS` 表示秒

- `ssssss` 表示小数秒

## TIME 语法

要创建一个 `TIME` 数据类型的列，请使用如下语法：

```sql
column_name TIME column_constraint
```

要将一个实际值插入到时间列中，您可以使用以下格式：

- HH:MI:SS[.ssssss]

- HHMISS[.ssssss]

- MI:SS[.ssssss]

- HH:MI

您可以使用类型转换将一个文本格式的时间值转为时间类型，如下：

```text
'2022-08-30'::TIME
```

## TIME 示例

使用下面的语句创建一个新表，名称为 test_time:

```sql
CREATE TABLE test_time (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  time_value TIME NOT NULL DEFAULT current_time
);
```

该 test_time 表由两列组成：

1. 该 id 列是标识每行的 [主键列](../database-and-table/primary-key.md)，它是一个 [标识列](../database-and-table/identity.md)

2. 该 time_value 列是 `TIME` 数据类型，它不能为 null，并且具有以当前时间为默认值

### 插入 TIME 数据

要将数据插入 `TIME` 列，您必须确保数据采用正确的格式。以下 [INSERT](../basic/insert.md) 语句向 test_time 表中插入几个新行

```sql
INSERT INTO test_time (time_value)
VALUES
  ('10:10:10'),
  ('10:10:11'),
  ('10:10:12'),
  ('10:10'),
  ('101010'),
  ('10:10:10.111111')
RETURNING *;
```

```text
 id |   time_value
----+-----------------
  1 | 10:10:10
  2 | 10:10:11
  3 | 10:10:12
  4 | 10:10:00
  5 | 10:10:10
  6 | 10:10:10.111111
(6 行记录)
```

### 更新 TIME 数据

要更新 `TIME` 数据，使用该 [UPDATE](../basic/update.md) 语句并传入一个正确格式的值：

```sql
UPDATE test_time
SET time_value = '10:10:09'
WHERE id = 1
RETURNING *;
```

```text
 id | time_value
----+------------
  1 | 10:10:09
```

### 在 WHERE 条件中使用 TIME 数据

要查找时间为 10:10:10，请使用以下语句：

```sql
SELECT *
FROM test_time
WHERE time_value = '10:10:10';
```

```text
 id | time_value
----+------------
  5 | 10:10:10
```

您还可以查找时间大于 10:10:10 的所有的行，如下：

```sql
SELECT *
FROM test_time
WHERE time_value > '10:10:10';
```

```text
 id |   time_value
----+-----------------
  2 | 10:10:11
  3 | 10:10:12
  6 | 10:10:10.111111
(3 行记录)
```

### 输出指定格式的时间值

PostgreSQL 提供了 `TO_CHAR()` 函数以按照指定格式输出时间值。`TO_CHAR()` 函数接受两个参数。第一个参数是要格式化的时间值，第二个参数是格式

要以 HHMISS 格式显示时间，请使用以下语句：

```sql
SELECT
  id,
  to_char(time_value, 'HHMISS')
FROM
  test_time;
```

```text
 id | to_char
----+---------
  2 | 101011
  3 | 101012
  4 | 101000
  5 | 101010
  1 | 101009
(5 行记录)
```

## 时间函数

PostgreSQL 提供了很多 时间 相关的函数

要获取当前的时间，请使用 `current_time`：

```sql
SELECT current_time;
```

```text
   current_time
-------------------
 17:18:49.94353+08
```

您可以使用 `current_time` 指定时间的小数秒精度，如下：

```sql
SELECT current_time(1);
```

```text
 current_time
---------------
 17:19:00.3+08
```

要获取时间值中的时、分、秒部分，请使用 `date_part()` 函数：

```sql
SELECT
  date_part('hour', '10:11:12'::time) "hour",
  date_part('minute', '10:11:12'::time) "minute",
  date_part('second', '10:11:12'::time) "second";
```

```text
 hour | minute | second
------+--------+--------
   10 |     11 |     12
```