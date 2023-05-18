---
category: IT
tag: 数据库
order: 27
article: false
---

# CUBE

在 PostgreSQL 中，`CUBE` 是 `GROUP BY` 子句的参数，是一种用于生成多维分组汇总的语法，它可以在 `GROUP BY` 子句中指定多个列名，生成所有可能的子集分组，并计算每个子集的聚合结果

## CUBE 语法

```sql
SELECT expr1, expr2, ..., aggregate_function(column_name)
FROM table_name
GROUP BY CUBE (column_name1, column_name2, ...)
```

- expr1, expr2 是要查询的列或表达式

- column_name 是用于分组的列名

- aggregate_function 是聚合函数，可以是 `COUNT`，`SUM`，`AVG`，`MAX`，`MIN` 等

- `CUBE` 的参数是一个由多个列名组成的列表，用逗号分隔。当执行查询时，`CUBE` 会生成所有可能的子集分组，包括空集和全集，计算每个子集的聚合结果

- `CUBE` 是 `GROUP BY` 子句的参数，它必须在 `GROUP BY` 关键字的后面

- `CUBE` 子句都可以使用 `GROUPING SETS` 子句实现，比如：

    - `CUBE(a, b)` 等效于 `GROUPING SETS((a,b), (a), (b), ())`

    - `CUBE(a, b, c)` 等效于 `GROUPING SETS((a,b,c), (a,b), (a,c), (a), (b,c), (b), (c), ())`

- `CUBE` 子句比 `GROUPING SETS` 子句更加的简单和易读。但是它的的适应性不如 `GROUPING SETS` 广泛

## CUBE 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中查找每部影片评级中每个租金的影片的数量，每部影片评级中的影片的数量，每个租金的影片的数量，以及所有影片的总数量，您可以使用如下带有 `GROUPING SETS` 的语句：

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
    (rental_rate),
    ()
  )
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
        |        0.99 |   341
        |        2.99 |   323
        |        4.99 |   336
        |             |  1000
(24 行记录)
```

上述 `GROUPING SETS` 语句里使用了 3 个表达式，如下：

- `(rating, rental_rate)`：按电影等级和租金费用分组，统计每个分组中的电影数量

- `(rating)`：按电影等级分组，统计每个分组中的电影数量

- `(rental_rate)`：按租金费用分组，统计每个分组中的电影数量

- `()`：统计所有电影的数量

在这种情况下，可以使用 `CUBE` 来简化，如下：

```sql
SELECT
  rating,
  rental_rate,
  count(*)
FROM
  film
GROUP BY
  CUBE (rating, rental_rate)
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
        |        0.99 |   341
        |        2.99 |   323
        |        4.99 |   336
        |             |  1000
(24 行记录)
```

在上面的语句中，我们使用 `CUBE (rating, rental_rate)` 代替了 `GROUPING SETS ((rating, rental_rate), (rating), (rental_rate),())`。这让语句更加简单，可读性更好