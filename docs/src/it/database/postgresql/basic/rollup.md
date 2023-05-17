---
category: IT
tag: 数据库
order: 26
article: false
---

# ROLLUP

在 PostgreSQL 中，`ROLLUP` 是一种用于生成多个分组汇总的语法，它可以在 `GROUP BY` 子句中添加一个或多个聚合级别，生成包含多个子汇总的结果集

## ROLLUP 语法

```sql
SELECT expr1, expr2, ..., aggregate_function(column_name)
FROM table_name
GROUP BY column_name1, ROLLUP (column_name2, column_name3, ...)
```

- expr1, expr2 是要查询的列或表达式

- column_name 是用于分组的列名

- aggregate_function 是聚合函数，可以是 `COUNT`，`SUM`，`AVG`，`MAX`，`MIN` 等

- `ROLLUP` 的参数是一个由多个列名组成的列表，用逗号分隔。当执行查询时，每个列名都表示一个聚合级别，每个聚合级别将生成一个子汇总。`ROLLUP` 将为每个聚合级别生成一个子汇总，并生成一个总计行，表示所有聚合级别的总汇总

- `ROLLUP` 是 `GROUP BY` 子句的参数，它必须在 `GROUP BY` 关键字的后面

- `ROLLUP` 子句都可以使用 `GROUPING SETS` 子句实现，比如：

    - `ROLLUP(a, b)` 等效于 `GROUPING SETS((a,b), (a), ())`

    - `ROLLUP(a, b, c)` 等效于 `GROUPING SETS((a,b,c), (a,b), (a), ())`

- `ROLLUP` 子句比 `GROUPING SETS` 子句更加的简单和易读。但是它的的适应性不如 `GROUPING SETS` 广泛

## ROLLUP 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中查找每部影片评级中每个租金的影片数量，以及每部影片评级中的影片数量，以及所有影片的总数量，您可以使用如下带有 `GROUPING SETS` 的语句：

```sql
SELECT
  rating,
  rental_rate,
  count(*)
FROM
  film
GROUP BY
  GROUPING SETS (
    (rating, rental_rate),
    (rating),
    ()
  )
ORDER BY
  rating, rental_rate;
```

```text
 rating | rental_rate | count
--------+-------------+-------
 G      |        0.99 |    64  ┐
 G      |        2.99 |    59  │───┐
 G      |        4.99 |    55  ┘   │───┐
 G      |             |   178  <───┘   │
 PG     |        0.99 |    62  ┐       │
 PG     |        2.99 |    64  │───┐   │
 PG     |        4.99 |    68  ┘   │───│
 PG     |             |   194  <───┘   │
 PG-13  |        0.99 |    72  ┐       │
 PG-13  |        2.99 |    74  │───┐   │
 PG-13  |        4.99 |    77  ┘   │───│
 PG-13  |             |   223  <───┘   │
 R      |        0.99 |    70  ┐       │
 R      |        2.99 |    60  │───┐   │
 R      |        4.99 |    65  ┘   │───│
 R      |             |   195  <───┘   │
 NC-17  |        0.99 |    73  ┐       │
 NC-17  |        2.99 |    66  │───┐   │
 NC-17  |        4.99 |    71  ┘   │───│
 NC-17  |             |   210  <───┘   │
        |             |  1000  <───────┘
(21 行记录)
```

我们在上述 `GROUPING SETS` 语句中使用了 3 个表达式，如下：

- (rating, rental_rate)：按电影等级和租金费用分组，统计每个分组中的电影数量

- (rating)：按电影等级分组，统计每个分组中的电影数量

- ()：统计所有电影的数量

第一个分组集合包括 rating 和 rental_rate 列，表示按照这两列进行分组；第二个分组集合只包括 rating 列，表示按照 rating 列进行分组；第三个分组集合为空，表示只生成一个总计行

在这种情况下，我们可以使用 `ROLLUP` 来简化，如下：

```sql
SELECT
  rating,
  rental_rate,
  count(*)
FROM
  film
GROUP BY
  ROLLUP (rating, rental_rate)
ORDER BY
  rating, rental_rate;
```

```text
 rating | rental_rate | count
--------+-------------+-------
 G      |        0.99 |    64
 G      |        2.99 |    59
 G      |        4.99 |    55
 G      |             |   178
 PG     |        0.99 |    62
 PG     |        2.99 |    64
 PG     |        4.99 |    68
 PG     |             |   194
 PG-13  |        0.99 |    72
 PG-13  |        2.99 |    74
 PG-13  |        4.99 |    77
 PG-13  |             |   223
 R      |        0.99 |    70
 R      |        2.99 |    60
 R      |        4.99 |    65
 R      |             |   195
 NC-17  |        0.99 |    73
 NC-17  |        2.99 |    66
 NC-17  |        4.99 |    71
 NC-17  |             |   210
        |             |  1000
(21 行记录)
```

在上面的语句中，我们使用 `ROLLUP (rating, rental_rate)` 代替了 `GROUPING SETS ((rating, rental_rate), (rating), ())`。这让语句更加简单，可读性更好