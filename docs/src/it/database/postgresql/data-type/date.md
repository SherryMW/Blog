---
category: IT
tag: 数据库
order: 6
article: false
---

# DATE

PostgreSQL 支持 `DATE` 数据类型，以存储日期值。PostgreSQL `DATE` 数据类型使用 yyyy-mm-dd 格式存储日期值，并且每个日期值占用 4 个字节

## DATE 语法

要创建一个 `DATE` 数据类型的列，请使用如下语法：

```sql
column_name DATE column_constraint
```

您可以将 yyyy-mm-dd 格式的文本日期值插入到日期列中

您可以使用类型转换将一个文本格式的日期值转为日期类型，如下：

```sql
'2022-08-30'::DATE
```

## DATE 示例

使用下面的语句创建一个新表，名称为 test_date:

```sql
CREATE TABLE test_date (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_value DATE NOT NULL DEFAULT CURRENT_DATE
);
```

该 test_date 表由两列组成：

1. 该 id 列是标识每行的 [主键列](../database-and-table/primary-key.md)，它是一个 [标识列](../database-and-table/identity.md)

2. 该 date_value 列是 `DATE` 数据类型，它不能为 null，并且具有以当前日期为默认值

### 插入 DATE 数据

要将数据插入 `DATE` 列，您必须确保数据采用 yyyy-mm-dd 格式。以下 [INSERT](../basic/insert.md) 语句向 test_date 表中插入几个新行

```sql
INSERT INTO test_date (date_value)
VALUES
  ('2022-08-29'),
  ('2022-08-30'),
  ('2022-08-31')
RETURNING *;
```

```text
 id | date_value
----+------------
  1 | 2022-08-29
  2 | 2022-08-30
  3 | 2022-08-31
(3 行记录)
```

### 更新 DATE 数据

要更新 `DATE` 数据，使用该 [UPDATE](../basic/update.md) 语句并传入一个 yyyy-mm-dd 格式的值：

```sql
UPDATE test_date
SET date_value = '2022-09-01'
WHERE id = 3
RETURNING *;
```

```text
 id | date_value
----+------------
  3 | 2022-09-01
```

### 在 WHERE 条件中使用 DATE 数据

要查找日期为 2022-08-30，请使用以下语句：

```sql
SELECT *
FROM test_date
WHERE date_value = '2022-08-30';
```

```text
 id | date_value
----+------------
  2 | 2022-08-30
```

您还可以查找日期小于 2022-09-01 的所有的行，如下：

```sql
SELECT *
FROM test_date
WHERE date_value < '2022-09-01';
```

```text
 id | date_value
----+------------
  1 | 2022-08-29
  2 | 2022-08-30
(2 行记录)
```

### 输出指定格式的日期值

PostgreSQL 提供了 `TO_CHAR()` 函数以按照指定格式输出日期值。`TO_CHAR()` 函数接受两个参数。第一个参数是要格式化的日期值，第二个参数是格式

要以 yyyy/mm/dd 格式显示日期，请使用以下语句：

```sql
SELECT
  id,
  to_char(date_value, 'yyyy/mm/dd')
FROM
  test_date;
```

```text
 id |  to_char
----+------------
  1 | 2022/08/29
  2 | 2022/08/30
  3 | 2022/09/01
(4 行记录)
```

## 日期函数

PostgreSQL 提供了很多 日期 相关的函数

要获取当前的日期，请使用 `current_date`：

```sql
SELECT current_date;
```

```text
 current_date
--------------
 2022-08-31
```

要计算距离某个日期的年龄，请是 `age()` 函数:

```sql
SELECT age(NOW(), '2001-01-01');
```

```text
                   age
-----------------------------------------
 21 years 4 mons 14 days 10:24:08.248813
```

要将一个指定格式的日期字符串转为日期值，请使用 `to_date()` 函数:

```sql
SELECT to_date('2022-08-31', 'YYYY-MM-DD');
```

```text
  to_date
------------
 2022-08-31
```

要获取日期值中的年、月、日部分，请使用 `date_part()` 函数：

```sql
SELECT
  date_part('year', current_date) "year",
  date_part('month', current_date) "month",
  date_part('day', current_date) "day";
```

```text
 year | month | day
------+-------+-----
 2022 |     8 |  31
```