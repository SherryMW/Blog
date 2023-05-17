---
category: IT
tag: 数据库
order: 23
article: false
---

# GROUP BY

在 PostgreSQL 中，`GROUP BY` 子句用于将行根据指定的字段或者表达式进行分组

有时候，我们需要将结果集按照某个维度进行汇总。这在统计数据的时候经常用到，考虑以下的场景：

- 按班级求取平均成绩

- 按学生汇总总分

- 按年或者月份统计销售额

- 按国家或者地区统计用户数量

## GROUP BY 语法

`GROUP BY` 子句是 [SELECT](./select.md) 语句的可选子句。要对 `SELECT` 语句中的行进行分组，请使用如下的语法：

```sql
SELECT column1[, column2, ...], aggregate_function(ci)
FROM table
[WHERE clause]
GROUP BY column1[, column2, ...];
[HAVING clause]
```

- column1[, column2, ...] 是分组依据的字段，至少一个字段，可以多个字段

- aggregate_function(ci) 是聚合函数，用来汇总。这是可选的。您可能会用到以下聚合函数：

    - `COUNT`：用于计算表中行数或满足指定条件的行数

    - `SUM`：用于计算指定列的总和

    - `AVG`：用于计算指定列的平均值

    - `MIN`：用于计算指定列的最小值

    - `MAX`：用于计算指定列的最大值

    - `ARRAY_AGG`：用于将指定列的值聚合为一个数组

    - `STRING_AGG`：用于将指定列的值连接为一个字符串

    - `JSON_AGG`：用于将指定列的值聚合为一个 JSON 数组

- [SELECT](./select.md) 后的字段必须是分组字段中的字段

- [WHERE](./where.md) 子句是可选的，用来过在分组之前过滤行

- [HAVING](./having.md) 子句是可选的，用来过滤分组后的数据

## GROUP BY 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 简单的 GROUP BY 示例

我们使用 `GROUP BY` 子句查看 actor 表中的姓氏列表

```sql
SELECT last_name
FROM actor
GROUP BY last_name;
```

```text
  last_name
--------------
 AKROYD
 BRIDGES
 HUNT
 GIBSON
 ALLEN
...
(121 行记录)
```

本例中，使用 `GROUP BY` 子句按照 last_name 字段对数据进行分组

本例的输出结果与以下使用 [DISTINCT](./distinct.md) 的 SQL 输出结果完全一样：

```sql
SELECT DISTINCT last_name FROM actor;
```

### GROUP BY 与聚合函数示例

我们使用 `GROUP BY` 子句和聚合函数 `COUNT()` 查看 actor 表中的姓氏列表以及每个姓氏的数量

```sql
SELECT last_name, COUNT(*)
FROM actor
GROUP BY last_name
ORDER BY COUNT(*) DESC;
```

```text
  last_name   | count
--------------+-------
 KILMER       |     5
 TEMPLE       |     4
 NOLTE        |     4
 WILLIAMS     |     3
 PECK         |     3
...
(121 行记录)
```

本例中，执行的顺序如下：

1. 首先使用 `GROUP BY` 子句按照 last_name 字段对 actor 表中的所有的行进行分组。也就是每个姓氏一组

2. 然后使用聚合函数 `COUNT(*)` 汇总每个姓氏的行数

3. 最后使用 [ORDER BY](./order-by.md) 子句按照 `count(*)` 降序排列。数量最多的姓氏排在最前面

同样，如果我们想从 film 表中查找每部影片等级的影片数量，请使用如下语句：

```sql
SELECT rating, COUNT(*)
FROM film
GROUP BY rating
ORDER BY COUNT(*) DESC;
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

### GROUP BY，LIMIT，聚合函数示例

以下示例使用 `GROUP BY` 子句，`LIMIT` 子句和聚合函数 `SUM()` 从 payment 表中查找消费金额排名前 10 位的客户

```sql
SELECT customer_id, SUM(amount) total
FROM payment
GROUP BY customer_id
ORDER BY total DESC
LIMIT 10;
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
         469 | 177.60
         468 | 175.61
         236 | 175.58
         181 | 174.66
(10 行记录)
```

本例中，执行的顺序如下：

1. 首先使用 `GROUP BY` 子句按照 customer_id 字段对数据进行分组，也就是按照客户分组

2. 使用聚合函数 `SUM(amount)` 对每组中的所有行的 amount 字段求和，并使用 total 作为列别名

3. 使用 `ORDER BY` 子句按照 total 降序排列

4. 最后使用 `LIMIT 10` 子句返回前 10 个记录行

### GROUP BY 和 HAVING 示例

以下示例使用 `GROUP BY` 子句，`HAVING` 子句和聚合函数 `SUM()` 从 payment 表中查找总消费金额在 180 美元以上的客户

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

本例中，执行的顺序如下：

1. 首先使用 `GROUP BY` 子句按照 customer_id 字段对数据进行分组，也就是按照客户分组

2. 使用聚合函数 `SUM(amount)` 对每组中的所有行的 amount 字段求和，并使用 total 作为列别名

3. 使用 `HAVING` 子句指定只有 `SUM(amount)` 大于 180 的行才会被返回

4. 最后使用 `ORDER BY` 子句按照 total 降序排列

[HAVING](./having.md) 子句用来过滤 `GROUP BY` 分组的数据，需要一个逻辑表达式作为条件，其中逻辑表达式中的列名或表达式只能使用分组使用的列，表达式，或者应用于分组列或表达式的聚合函数