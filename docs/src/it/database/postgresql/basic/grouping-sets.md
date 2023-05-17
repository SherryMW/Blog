---
category: IT
tag: 数据库
order: 25
article: false
---

# GROUPING SETS

在 PostgreSQL 中，`GROUPING SETS` 是 `GROUP BY` 子句的参数。是一种用于生成多个分组汇总的语法，它可以将一组列用于分组，生成多个子汇总，并将这些子汇总合并到单个结果集中

比如要想在一个销售报表中既有每个年份销售额的行，又有每个部门销售额的行，您可以在 `GROUP BY` 子句中使用 `GROUPING SETS` 实现它

## GROUPING SETS 语法

在 `GROUP BY` 子句中使用 `GROUPING SETS`，请使用如下的语法：

```sql
SELECT ...
FROM table_name
[WHERE ...]
GROUP BY
  GROUPING SETS (
    (group_expr_list_1)
    [, (group_expr_list_2), ...]
  )
;
```

- `GROUPING SETS` 是 `GROUP BY` 子句的参数，它必须在 `GROUP BY` 关键字的后面

- (group_expr_list_N) 是一个用于分组的表达式列表，其中可以包含零个或者多个列或表达式，就像在 `GROUP BY` 子句中直接使用的那些列一样

- 您可以为 `GROUPING SETS` 指定一个或者多个分组表达式，每个分组表达式产生的结果集都将合并到最终的结果集中

- (group_expr_list_N) 中没有任何列或者表达式时，即 ()，所有符合条件的行都被聚合到一个分组中

## ROUPING SETS 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中查找每部影片评级的影片数量，请使用如下的语法：

```sql
SELECT rating, count(*)
FROM film
GROUP BY rating
ORDER BY rating;
```

```text
 rating | count
--------+-------
 G      |   178
 PG     |   194
 PG-13  |   223
 R      |   195
 NC-17  |   210
(5 行记录)
```

要从 film 表中查找每个租金的影片数量，请使用如下语句：

```sql
SELECT rental_rate, count(*)
FROM film
GROUP BY rental_rate
ORDER BY rental_rate;
```

```text
 rental_rate | count
-------------+-------
        0.99 |   341
        2.99 |   323
        4.99 |   336
(3 行记录)
```

要想在一个报表中包含上面的两个报表，您可以使用 UNION ALL 将上面的两个结果集合并起来，如下：

```sql
SELECT rating, NULL rental_rate, count(*)
FROM film
GROUP BY rating

UNION ALL

SELECT NULL rating, rental_rate, count(*)
FROM film
GROUP BY rental_rate

ORDER BY rating, rental_rate;
```

```text
 rating | rental_rate | count
--------+-------------+-------
 G      |             |   178  ┐
 PG     |             |   194  │
 PG-13  |             |   223  │ > ranting
 R      |             |   195  │
 NC-17  |             |   210  ┘
        |        0.99 |   341  ┐
        |        2.99 |   323  │ > rental_rate
        |        4.99 |   336  ┘
(8 行记录)
```

但是上面使用 `UNION ALL` 的语句看起来很复杂。如果能用一个简单的语句做到这一切就太棒了。PostgreSQL `GROUPING SETS` 可以帮我们实现：

```sql
SELECT rating, rental_rate, count(*)
FROM film
GROUP BY GROUPING SETS ((rating), (rental_rate))
ORDER BY rating, rental_rate;
```

```text
 rating | rental_rate | count
--------+-------------+-------
 G      |             |   178  ┐
 PG     |             |   194  │
 PG-13  |             |   223  │ > ranting
 R      |             |   195  │
 NC-17  |             |   210  ┘
        |        0.99 |   341  ┐
        |        2.99 |   323  │ > rental_rate
        |        4.99 |   336  ┘
(8 行记录)
```

所以您可以将 `GROUPING SETS` 简单的理解为对多个分组结果集执行了 `UNION ALL` 操作

如果您想在上面的报表中添加一行以显示总影片数量，您可以在 `GROUPING SETS` 子句里的第三个参数填上一个空的分组表达式 `()`，如下：

```sql
SELECT rating, rental_rate, count(*)
FROM film
GROUP BY GROUPING SETS ((rating), (rental_rate), ())
ORDER BY rating, rental_rate;
```

```text
 rating | rental_rate | count
--------+-------------+-------
 G      |             |   178
 PG     |             |   194
 PG-13  |             |   223
 R      |             |   195
 NC-17  |             |   210
        |        0.99 |   341
        |        2.99 |   323
        |        4.99 |   336
        |             |  1000
(9 行记录)
```

为了应对更加复杂的需求， PostgreSQL 还提供了 [ROLLUP](./rollup.md) 和 [CUBE](./cube.md) 以简化 `GROUPING SETS`