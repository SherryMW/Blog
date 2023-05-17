---
category: IT
tag: 数据库
order: 14
article: false
---

# 枚举

在 PostgreSQL 中，枚举类型是一组有序的常量值的集合。比如，您可以使用枚举类型用作订单的状态值

如果没有枚举类型，您可能使用整数 1, 2, 3 ... 或者字符串表示，但是很容易带来错误，比如书写错误等。用了枚举类型之后，数据库可以保证不能输入错误的值

## 创建枚举值

要使用枚举值，您需要使用 `CREATE TYPE` 语句创建一个自定义的枚举值：

```sql
CREATE TYPE name AS ENUM (
  label_1
  [, label_2, ... ]
);
```

- name 是要创建的枚举类型的名称

- label_1, label_2 是枚举类型中的常量值

## 枚举类型示例

首先，使用下面的语句创建一个表示星期的枚举类型：

```sql
CREATE TYPE my_week AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);
```

然后，使用下面的语句创建一个每天销售明细表：

```sql
CREATE TABLE week_day_sales (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    week_day my_week NOT NULL,
    sales integer NOT NULL
);
```

然后，使用下面的语句插入几个新行：

```sql
INSERT INTO week_day_sales (week_day, sales)
VALUES
    ('Monday', 110),
    ('Tuesday', 120),
    ('Wednesday', 130),
    ('Thursday', 140),
    ('Friday', 150),
    ('Saturday', 160),
    ('Sunday', 170),
    ('Monday', 210),
    ('Tuesday', 220),
    ('Wednesday', 230),
    ('Thursday', 240),
    ('Friday', 250),
    ('Saturday', 260),
    ('Sunday', 270);
```

如果您向枚举列插入一个错误的值，PostgreSQL 将给出一个错误：

```sql
INSERT INTO week_day_sales (week_day, sales)
VALUES ('Error', 110);
```

```text
ERROR:  invalid input value for enum my_week: "Error"
LINE 2: VALUES ('Error', 110);
```

下面的语句检索 week_day_sales 表的所有的行：

```sql
SELECT * FROM week_day_sales;
```

```text
 id | week_day  | sales
----+-----------+-------
  1 | Monday    |   110
  2 | Tuesday   |   120
  3 | Wednesday |   130
  4 | Thursday  |   140
  5 | Friday    |   150
  6 | Saturday  |   160
  7 | Sunday    |   170
  8 | Monday    |   210
  9 | Tuesday   |   220
 10 | Wednesday |   230
 11 | Thursday  |   240
 12 | Friday    |   250
 13 | Saturday  |   260
 14 | Sunday    |   270
(14 行记录)
```

要按照枚举类型的值的顺序排序，请使用下面的语句：

```sql
SELECT * FROM week_day_sales ORDER BY week_day;
```

```text
 id | week_day  | sales
----+-----------+-------
  1 | Monday    |   110
  8 | Monday    |   210
  2 | Tuesday   |   120
  9 | Tuesday   |   220
  3 | Wednesday |   130
 10 | Wednesday |   230
  4 | Thursday  |   140
 11 | Thursday  |   240
  5 | Friday    |   150
 12 | Friday    |   250
  6 | Saturday  |   160
 13 | Saturday  |   260
  7 | Sunday    |   170
 14 | Sunday    |   270
(14 行记录)
```

## 枚举函数

PostgreSQL 提供了几个用于枚举类型的函数：

- `enum_first()`：函数返回由参数指定的枚举类型的第一个枚举值

- `enum_last()`：函数返回由参数指定的枚举类型的最后一个枚举值

- `enum_range()`：函数返回由参数指定的枚举类型的所有枚举值，或者指定的范围内的枚举值