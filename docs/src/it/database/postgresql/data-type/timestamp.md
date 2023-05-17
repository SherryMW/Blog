---
category: IT
tag: 数据库
order: 8
article: false
---

# 时间戳

PostgreSQL 时间戳类型用来存储日期和时间组合的数据类型。PostgreSQL 支持两种类型的时间戳数据类型，包括 `TIMESTAMP` 和 `TIMESTAMPTZ`：

`TIMESTAMP` 全写为：`TIMESTAMP WITHOUT TIME ZONE`，用来存储没有时区的时间戳

`TIMESTAMPTZ` 全写为：`TIMESTAMP WITH TIME ZONE`，用来存储带时区的时间戳

`TIMESTAMP` 和 `TIMESTAMPTZ` 都使用 8 个字节来存储时间戳值

在 PostgreSQL 内部，`TIMESTAMPTZ` 类型的值被存储为它对应的 UTC 值。当您从数据库中查询 `TIMESTAMPTZ` 值时，PostgreSQL 会将 UTC 值转换回数据库服务器、用户或当前数据库连接设置的时区的时间值

## 时间戳语法

要创建一个不带时区的时间戳类型的列，请使用如下语法：

```sql
column_name TIMESTAMP column_constraint
```

要创建一个带时区的时间戳类型的列，请使用如下语法：

```sql
column_name TIMESTAMPTZ column_constraint
```

时间戳数据类型使用格式：YYYY-MM-DD HH:MI:SS[.ssssss]

## 时间戳示例

使用下面的语句创建一个新表，名称为 test_timestamp：

```sql
CREATE TABLE test_timestamp (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp_v TIMESTAMP NOT NULL DEFAULT now(),
  timestamptz_v TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

该 test_timestamp 表由三列组成：

1. 该 id 列是标识每行的主键列，它是一个标识列

2. 该 timestamp_v 列是不带时区的时间戳类型，它不能为 null，并且默认为由 `now()` 函数产生的当前时间

3. 该 timestamptz_v 列是带时区的时间戳类型，它不能为 null，并且默认为由 `now()` 函数产生的当前时间

### 插入时间戳数据

要将数据插入时间戳列，您必须确保数据采用正确的格式。以下 [INSERT](../basic/insert.md) 语句向 test_timestamp 表中插入一个新行

```sql
INSERT INTO test_timestamp (timestamp_v, timestamptz_v)
VALUES
    ('2022-08-30 10:10:10', '2022-08-30 10:10:10'),
    ('2022-08-30', '2022-08-30')
RETURNING *;
```

```text
id  |     timestamp_v     |     timestamptz_v
----+---------------------+------------------------
  1 | 2022-08-30 10:10:10 | 2022-08-30 10:10:10+08
  2 | 2022-08-30 00:00:00 | 2022-08-30 00:00:00+08
(2 行记录)
```

虽然我们在插入时没有为 `TIMESTAMPTZ` 列指定带有时区的值，但是 PostgreSQL 自动为此列的值添加了时区信息

要查看当前会话的时区，请使用 `SHOW TIMEZONE` 语句，如下：

```sql
SHOW TIMEZONE;
```

```text
   TimeZone
---------------
Asia/Shanghai
```

您不能为时间戳类型指定一个 [时间类型](./time.md) 的值，PostgreSQL 将会给出一个错误，如下：

```sql
INSERT INTO test_timestamp (timestamp_v, timestamptz_v)
VALUES ('10:10:10', '10:10:10')
RETURNING *;
```

```text
ERROR:  invalid input syntax for type timestamp: "10:10:10"
LINE 2: VALUES ('10:10:10', '10:10:10')
```

### 更新 TIMESTAMP 数据

要更新 `TIMESTAMP` 数据，使用该 [UPDATE](../basic/update.md) 语句并传入一个正确格式的值：

```sql
UPDATE
  test_timestamp
SET
  timestamp_v = '2022-08-30 11:11:11',
  timestamptz_v = '2022-08-30 11:11:11'
WHERE id = 1
RETURNING *;
```

```text
id  |     timestamp_v     |     timestamptz_v
----+---------------------+------------------------
  1 | 2022-08-30 11:11:11 | 2022-08-30 11:11:11+08
```

### 在 WHERE 条件中使用 TIMESTAMP 数据

您可以在 [WHERE](../basic/where.md) 子句中使用 `TIMESTAMP` 列过滤数据

要查找日期为 2022-08-30 的所有的行，如下：

```sql
SELECT *
FROM test_timestamp
WHERE to_char(timestamp_v, 'YYYY-MM-DD') = '2022-08-30';
```

```text
id  |     timestamp_v     |     timestamptz_v
----+---------------------+------------------------
  2 | 2022-08-30 00:00:00 | 2022-08-30 00:00:00+08
  1 | 2022-08-30 11:11:11 | 2022-08-30 11:11:11+08
```

您还可以查找日期大于 2022-08-30 的所有的行，如下：

```sql
SELECT *
FROM test_timestamp
WHERE timestamp_v > '2022-08-30';
```

```text
id  |     timestamp_v     |     timestamptz_v
----+---------------------+------------------------
  1 | 2022-08-30 11:11:11 | 2022-08-30 11:11:11+08
```

### 输出指定格式的时间值

PostgreSQL 提供了 `TO_CHAR()` 函数以按照指定格式输出时间值。`TO_CHAR()` 函数接受两个参数。第一个参数是要格式化的时间值，第二个参数是格式

要以 yyyy/mm/dd 格式显示时间，请使用以下语句：

```sql
SELECT
  id,
  to_char(timestamp_v, 'YYYY/MM/DD HH24:MI:SS'),
  to_char(timestamptz_v, 'YYYY/MM/DD HH24:MI:SS TZH')
FROM
  test_timestamp;
```

```text
id  |       to_char       |         to_char
----+---------------------+-------------------------
  2 | 2022/08/30 00:00:00 | 2022/08/30 00:00:00 +08
  1 | 2022/08/30 11:11:11 | 2022/08/30 11:11:11 +08
```

## 时间戳函数

为了有效地处理时间戳数据，PostgreSQL 提供了一些方便的函数

要获取当前时间戳，请使用 `now()` 或者 `current_timestamp`，如下：

```sql
SELECT now(), current_timestamp;
```

```text
           now                |      current_timestamp
------------------------------+------------------------------
 2022-09-02 10:14:14.06204+08 | 2022-09-02 10:14:14.06204+08
```

除此之外，您还可以使用 `transaction_timestamp()`，`statement_timestamp()`，`localimestamp()` 或 `clock_timestamp()` 获取当前的时间戳

您可以使用 `current_timestamp` 指定时间戳的小数秒精度，如下：

```sql
SELECT current_timestamp, current_timestamp(2);
```

```text
       current_timestamp       |     current_timestamp
-------------------------------+---------------------------
 2022-09-02 10:15:22.670007+08 | 2022-09-02 10:15:22.67+08
```

要获取时间值中的年、月、日、时、分、秒的值，请使用 `date_part()` 函数：

```sql
SELECT
  date_part('year', now()) "year",
  date_part('month', now()) "month",
  date_part('day', now()) "day",
  date_part('hour', now()) "hour",
  date_part('minute', now()) "minute",
  date_part('second', now()) "second";
```

```text
 year | month | day | hour | minute |  second
------+-------+-----+------+--------+-----------
 2022 |     9 |   2 |   10 |     17 | 14.520472
```