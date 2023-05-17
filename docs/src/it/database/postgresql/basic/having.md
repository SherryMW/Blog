---
category: IT
tag: 数据库
order: 24
article: false
---

# HAVING

在 PostgreSQL 中，`HAVING` 子句用于为带有 [GROUP BY](./group-by.md) 子句的分组查询指定过滤条件

`HAVING` 看起来与 `WHERE` 相似，虽然他们都是指定过滤条件，但他们的区别是：`WHERE` 子句指定的条件用于过滤表中的行，而 `HAVING` 子句指定的条件用于过滤分组

## HAVING 语法

PostgreSQL `HAVING` 子句必须与 `GROUP BY` 子句一起使用。请使用如下的语法：

```sql
SELECT column1[, column2, ...], aggregate_function(ci)
FROM table
[WHERE clause]
GROUP BY column1[, column2, ...];
HAVING clause
```

- `GROUP BY` 子句用于指定用于分组的列或者表达式

- `HAVING` 子句用来过滤 `GROUP BY` 分组的数据，需要使用逻辑表达式作为条件，其中逻辑表达式中的列名或表达式只能使用分组使用的列，表达式，或者应用于分组列或表达式的聚合函数

- 您不能在 `HAVING` 子句中使用列别名

## HAVING 子句示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

如果您想从 film 表中查找每部影片评级的影片数量，请使用如下语句：

```sql
SELECT rating, count(*)
FROM film
GROUP BY rating
ORDER BY count(*) DESC;
```

```text
 rating | count
--------+-------
 PG-13  |   223
 NC-17  |   210
 R      |   195
 PG     |   194
 G      |   178
(5 行记录)
```

这个示例返回了所有的影片评级的影片数量。如果您想要查找影片数量大于 200 的影片评级，就要用到 `HAVING` 子句，如下：

```sql
SELECT rating, count(*)
FROM film
GROUP BY rating
HAVING count(*) > 200
ORDER BY count(*) DESC;
```

```text
 rating | count
--------+-------
 PG-13  |   223
 NC-17  |   210
(2 行记录)
```

---

如果您想从 payment 表中查找总消费金额在 180 美元以上的客户，请使用以下带有 `GROUP BY` 子句，`HAVING` 子句和聚合函数 `SUM()` 的语句：

```sql
SELECT customer_id, SUM(amount) total
FROM payment
GROUP BY customer_id
HAVING SUM(amount) > 180
ORDER BY total DESC;
```

```text
 customer_id | total
-------------+--------
         526 | 221.55
         148 | 216.54
         144 | 195.58
         178 | 194.61
         137 | 194.61
         459 | 186.62
(6 行记录)
```

1. 首先使用 `GROUP BY` 子句按照 customer_id 字段对数据进行分组，也就是按照客户分组

2. 使用聚合函数 `SUM(amount)` 对每组中的所有行的 amount 字段求和，并使用 total 作为列别名

3. 使用 `HAVING` 子句指定只有 `SUM(amount)` 大于 180 的行才会被返回

4. 最后使用 `ORDER BY` 子句按照 total 降序排列