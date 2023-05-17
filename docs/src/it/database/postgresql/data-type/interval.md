---
category: IT
tag: 数据库
order: 9
article: false
---

# INTERVAL

在 PostgreSQL 中，`INTERVAL` 类型用于存储时间间隔值，比如 N 年 N 月 N 日 N 时 N 分 N 秒。时间间隔不是一个时间点，而是一个时间段

PostgreSQL `INTERVAL` 类型占用 16 个字节的存储空间，其取值范围从 -178000000 years 到 178000000 years

## INTERVAL 语法

要定义一个 PostgreSQL `INTERVAL` 类型的值，请使用如下法：

```sql
@ INTERVAL [ fields ] [ (p) ]
```

- @ 是可选的

- fields 定义一个时间段。您可以采用以下两种输入格式：

    - quantity unit [quantity unit...] [direction]

      其中，quantity 是一个数字，可能有符号；unit 是 microsecond, millisecond, second, minute, hour, day, week, month, year, decade, century, millennium 中的值，或者他们的缩写或者复数形式；direction 可以是 ago 或者空

      例如：`INTERVAL 1 years 2 months 3 days 4 hours 5 minutes 6 seconds`

    - ISO 8601 时间间隔格式

      P quantity unit [ quantity unit ...] [ T [ quantity unit ...]]

      或者

      P [ years-months-days ] [ T hours:minutes:seconds ]

      其中， unit 您可以使用以下表中的值：

      | 缩写  |    含义    |
      |:---:|:---------:|
      | Y   |    年     |
      | M   | 月 (日期部分) |
      | W   |    	周    |
      | D   |    天     |
      | H   |    小时    |
      | M   | 分钟(时间部分) |
      | S   |    秒     |

      例如：

      ```sql
      INTERVAL 'P1Y2M3DT4H5M6S'
      INTERVAL 'P1-2-3T4:5:6'
      ```

    - p 是小数秒的精度。 p 的允许范围是从 0 到 6

比如，`interval 1 years 2 months 3 days` 意思是 1 年 2 月零 3 天

## INTERVAL 输出格式

PostgreSQL `INTERVAL` 类型的输出格式可以被设置为 `sql_standard`，`postgres`（默认），`postgres_verbose` ，或 `iso_8601`

您可以使用 `SET intervalstyle` 命令设置 `INTERVAL` 类型的输出格式

下面的示例展示了不同的输出格式：

以下代表 6 years 5 months 4 days 3 hours 2 minutes 1 second 四种风格中的区间：

- sql_standard

    ```sql
    SET intervalstyle = 'sql_standard';
    SELECT INTERVAL 'P1Y2M3DT4H5M6S';
    ```
  
    ```text
        interval
    ------------------
    +1-2 +3 +4:05:06
    ```

- postgres

    ```sql
    SET intervalstyle = 'postgres';
    SELECT INTERVAL 'P1Y2M3DT4H5M6S';
    ```

    ```text
               interval
    -------------------------------
    1 year 2 mons 3 days 04:05:06
    ```

- postgres_verbose

   ```sql
   SET intervalstyle = 'postgres_verbose';
   SELECT INTERVAL 'P1Y2M3DT4H5M6S';
   ```
  
    ```text
                       interval
    ----------------------------------------------
    @ 1 year 2 mons 3 days 4 hours 5 mins 6 secs
    ```

- iso_8601

    ```sql
    SET intervalstyle = 'iso_8601';
    SELECT INTERVAL 'P1Y2M3DT4H5M6S';
    ```
  
    ```text
        interval
    ----------------
    P1Y2M3DT4H5M6S
    ```

## 区间相关的运算符和函数

### 算数运算

您可以将算术运算符（+ 、 -）应用于区间值，例如：

```sql
SELECT INTERVAL '1 day 12h 50m' + INTERVAL '10m';
```

```text
   ?column?
----------------
 1 day 13:00:00
```

您可以将算术运算符（+ 、 -）应用于时间值和区间值，例如：

```sql
SELECT
  current_timestamp "Now",
  current_timestamp - INTERVAL '10m'
    AS "Ten minutes ago";
```

```text
-[ RECORD 1 ]---+------------------------------
Now             | 2022-09-02 16:08:29.933843+08
Ten minutes ago | 2022-09-02 15:58:29.933843+08
```

### 间隔中提取数据

你可以使用 `date_part()` 函数从一个间隔值的提取指定的字段。下面语句提取间隔值中天数、小时数和分钟数：

```sql
SELECT
  date_part('day', INTERVAL '2 days 10 minutes') "day",
  date_part('hour', INTERVAL '2 days 10 minutes') "hour",
  date_part('minutes', INTERVAL '2 days 10 minutes') "minutes";
```

```text
 day | hour | minutes
-----+------+---------
   2 |    0 |      10
```

### 转换时间值

PostgreSQL 提供三个函数用于转换时间值：

- `justify_days()`：将超过 30 天的天数转为月数

- `justify_hours()`：将超过 24 小时的小时数转为天数

- `justify_interval()`：将超过 24 小时的小时数转为天数，并且将超过 30 天的天数转为月数

比如：

```sql
SELECT justify_days(INTERVAL '1 year 40 days');
```

```text
   justify_days
----------------------
1 year 1 mon 10 days
```

```sql
SELECT justify_hours(INTERVAL '60 hours');
```

```text
 justify_hours
-----------------
2 days 12:00:00
```

```sql
SELECT justify_interval(INTERVAL '6000 hours');
```

```text
 justify_interval
------------------
8 mons 10 days
```