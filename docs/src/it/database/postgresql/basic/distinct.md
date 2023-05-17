---
category: IT
tag: 数据库
order: 14
article: false
---

# DISTINCT

在 PostgreSQL 中，`DISTINCT` 语句用于 [SELECT](./select.md) 语句中，以使其返回一个没有重复行的结果集

## DISTINCT 语法

要返回一个没有重复行的结果集，请使用如下的语法：

```sql
SELECT
   DISTINCT column1 [, column2, ...]
FROM
   table_name;
```

- 关键字 `DISTINCT` 要在 `SELECT` 后指定

- 在关键字 `DISTINCT` 后指定需要评估是否重复的列

- 多个列名需要使用逗号 `,` 间隔。如果指定了多个列名，PostgreSQL 将根据这些列的值的组合后的值评估是否重复

- 您可以使用 `DISTINCT *` 来对所有的列进行评估重复

PostgreSQL 还提供了 `DISTINCT ON (expression)` 使用以下语法保留每组重复项的第一行：

```sql
SELECT
   DISTINCT ON (column1) column_alias,
   column2
FROM
   table_name
ORDER BY
   column1,
   column2;
```

始终将 [ORDER BY](./order-by.md) 子句与 `DISTINCT ON(expression)` 一起使用以使结果集可预测是一种很好的做法

注意：`DISTINCT ON` 表达式必须与 `ORDER BY` 子句中的表达式相匹配

## DISTINCT 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

```sql
SELECT
    DISTINCT rating
FROM
    film;
```

```text
 rating
--------
 PG-13
 NC-17
 R
 G
 PG
(5 行记录)
```

这里，为了找到所有的影片评级，我们使用了 `DISTINCT rating`，让每部影片评级只在结果集中出现一次

要从 film 表中检索所有的租金金额，请使用以下语句：

```sql
SELECT
    DISTINCT rental_rate
FROM
    film;
```

```text
 rental_rate
-------------
        2.99
        4.99
        0.99
(3 行记录)
```

这里，为了找到所有的影片租金金额，我们使用了 `DISTINCT rental_rate`，让每部影片租金金额只在结果集中出现一次

要从 film 表中检索所有的影片评级和租金金额的组合，请使用以下语句：

```sql
SELECT
    DISTINCT rating, rental_rate
FROM
    film
ORDER BY rating;
```

```text
 rating | rental_rate
--------+-------------
 G      |        0.99
 G      |        2.99
 G      |        4.99
 PG     |        4.99
 PG     |        2.99
 PG     |        0.99
 PG-13  |        4.99
 PG-13  |        2.99
 PG-13  |        0.99
 R      |        0.99
 R      |        4.99
 R      |        2.99
 NC-17  |        2.99
 NC-17  |        0.99
 NC-17  |        4.99
(15 行记录)
```

这里，我们使用了 `DISTINCT rating, rental_rate` 来查找所有的影片评级和租金金额的组合。为了是让输出更易读，我们使用 [ORDER BY](./order-by.md) 让结果集按照影片等级正序排序

如果您想返回每组影片评级的第一项，请使用以下带有 `DISTINCT ON` 的语句：

```sql
SELECT
    DISTINCT ON (rating) rating,
    film_id
FROM
    film
ORDER BY rating, film_id;
```

```text
 rating | film_id
--------+---------
 G      |       2
 PG     |       1
 PG-13  |       7
 R      |       8
 NC-17  |       3
(5 行记录)
```

## DISTINCT 与 NULL

当 `DISTINCT` 遇到 NULL 值时，只保留一个 NULL 值。因为 `DISTINCT` 认为所有的 NULL 值都是相同的，这与字段的类型无关。例如下面的 SQL 返回多行 NULL 记录：

```sql
SELECT NULL nullable_col
UNION ALL
SELECT NULL nullable_col
UNION ALL
SELECT NULL nullable_col;
```

```text
 nullable_col
--------------
 <null>
 <null>
 <null>
(3 行记录)
```

这里，我们拥有 3 行，其中每行的 nullable_col 列的值都为 NULL。当使用 `DISTINCT` 之后：

```sql
SELECT
    DISTINCT nullable_col
FROM
    (
    SELECT NULL nullable_col
    UNION ALL
    SELECT NULL nullable_col
    UNION ALL
    SELECT NULL nullable_col
    ) t;
```

```text
 nullable_col
--------------
 <null>
```