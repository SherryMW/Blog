---
category: IT
tag: 数据库
order: 9
article: false
---

# ORDER BY

在 PostgreSQL 中，`ORDER BY` 子句用来对 [SELECT](./select.md) 语句返回的结果集排序。如果您没有为 `SELECT` 语句指定 `ORDER BY` 子句，`SELECT` 语句返回的结果集是按照数据库默认的规则排序

## ORDER BY 语法

使用 `ORDER BY` 子句可以让我们对 `SELECT` 语句返回的结果集按照一个或这多个列升序或者降序排序。`ORDER BY` 子句的语法如下：

```sql
SELECT
   column1, column2, ...
FROM
   table_name
[WHERE clause]
ORDER BY
   column1 [ASC|DESC],
   [column2 [ASC|DESC],
   ...]
   [NULLS FIRST | NULLS LAST];
```

- 您可以为 `ORDER BY` 子句指定一个或多个列或者表达式

- `ASC` 代表升序，`DESC` 代表降序。这是可选的，默认值是 `ASC`

- 当指定多个排序表达式时，首先按照前面的表达式排序，其次按照后面的列排序

- `NULLS FIRST` 和 `NULLS LAST` 用来指定对 Null 值排序规则：

    - NULLS FIRST：Null 值在非 Null 值之前

    - NULLS LAST：Null 值在非 Null 值之后

默认情况下，PostgreSQL 采用升序排序时采用 `NULLS LAST`，降序排序时采用 `NULLS FIRST`。也就是说 PostgreSQL 默认 Null 值比非 Null 值大

## ORDER BY 排序规则说明

如下说明多种情况下的排序规则：

- `ORDER BY column ASC`：此 ORDER BY 子句对结果集按 column 列的值升序排序

- `ORDER BY column DESC`：此 ORDER BY 子句对结果集按 column 列的值降序排序

- `ORDER BY column`：此 ORDER BY 子句对结果集按 column 列的值升序排序。这个语句等效于：`ORDER BY column ASC`

- `ORDER BY column1, column2`：此 ORDER BY 子句对结果集的主排序按 column1 列升序排序，在主排序的基础上，那些 column1 列值相同的行，再按 column2 列升序排序

- `ORDER BY column1 DESC, column2`：此 ORDER BY 子句对结果集的主排序按 column1 列降序排序，在主排序的基础上，那些 column1 列值相同的行，再按 column2 列升序排序

## ORDER BY 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 按字段升序排序

以下 SQL 语句使用 `ORDER BY` 子句按演员姓氏升序进行排序

```sql
SELECT
    actor_id, first_name, last_name
FROM
    actor
ORDER BY last_name;
```

```text
 actor_id | first_name  |  last_name
----------+-------------+--------------
      182 | DEBBIE      | AKROYD
       92 | KIRSTEN     | AKROYD
       58 | CHRISTIAN   | AKROYD
      194 | MERYL       | ALLEN
      145 | KIM         | ALLEN
...
(200 行记录)
```

### 按字段降序排序

以下 SQL 语句使用 `ORDER BY` 子句按演员姓氏降序进行排序

```sql
SELECT
    actor_id, first_name, last_name
FROM
    actor
ORDER BY last_name DESC;
```

```text
 actor_id | first_name  |  last_name
----------+-------------+--------------
      186 | JULIA       | ZELLWEGER
      111 | CAMERON     | ZELLWEGER
       85 | MINNIE      | ZELLWEGER
       63 | CAMERON     | WRAY
       13 | UMA         | WOOD
...
(200 行记录)
```

### 按多字段排序

以下 SQL 语句使用 `ORDER BY` 子句先按演员姓氏升序排序，再按演员名字升序排序

```sql
SELECT
    actor_id, first_name, last_name
FROM
    actor
ORDER BY last_name, first_name;
```

```text
 actor_id | first_name  |  last_name
----------+-------------+--------------
       58 | CHRISTIAN   | AKROYD
      182 | DEBBIE      | AKROYD
       92 | KIRSTEN     | AKROYD
      118 | CUBA        | ALLEN
      145 | KIM         | ALLEN
...
(200 行记录)
```

### 按自定义顺序排序

有时候单纯的按照字段的值排序并不能满足要求，我们需要按照自定义的顺序的排序。比如我们需要按照电影分级 'G'，'PG'，'PG-13'，'R'，'NC-17' 的顺序对影片进行排序

对于这样的需求，它可以理解为按照列表中元素的索引位置进行排序。我们使用 [CASE](./case.md) 子句函数实现它

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

```sql
SELECT
    film_id, title, rating
FROM
    film
ORDER BY CASE rating
    WHEN 'G' THEN 1
    WHEN 'PG' THEN 2
    WHEN 'PG-13' THEN 3
    WHEN 'R' THEN 4
    WHEN 'NC-17' THEN 5
END;
```

```text
 film_id |            title            | rating
---------+-----------------------------+--------
     179 | CONQUERER NUTS              | G
     302 | FANTASIA PARK               | G
     297 | EXTRAORDINARY CONQUERER     | G
...
       1 | ACADEMY DINOSAUR            | PG
       6 | AGENT TRUMAN                | PG
      12 | ALASKA PHANTOM              | PG
...
     596 | MOONSHINE CABIN             | PG-13
     439 | HUNCHBACK IMPOSSIBLE        | PG-13
     180 | CONSPIRACY SPIRIT           | PG-13
...
      54 | BANGER PINOCCHIO            | R
     162 | CLUELESS BUCKET             | R
     379 | GREEDY ROOTS                | R
...
     568 | MEMENTO ZOOLANDER           | NC-17
     114 | CAMELOT VACATION            | NC-17
     561 | MASK PEACH                  | NC-17
...
(1000 行记录)
```

## ORDER BY 和 NULL

我们下面的示例使用以下临时数据作为演示：

```sql
SELECT 'A' AS v
UNION ALL
SELECT 'B' AS v
UNION ALL
SELECT NULL AS v
UNION ALL
SELECT '0' AS v
UNION ALL
SELECT '1' AS v;
```

```text
 v
---
 A
 B
 <null>
 0
 1
(5 行记录)
```

当我们使用 `ORDER BY` 子句升序 ASC 排序时， NULL 值默认排在非 NULL 值的后面。如下：

```sql
SELECT 'A' AS v
UNION ALL
SELECT 'B' AS v
UNION ALL
SELECT NULL AS v
UNION ALL
SELECT '0' AS v
UNION ALL
SELECT '1' AS v
ORDER BY v;
```

```text
 v
---
 0
 1
 A
 B
 <null>
(5 行记录)
```

这里 ASC 排序采用 NULLS LAST 规则，所以 NULL 值在最后。如果您想要改用 NULLS FIRST，请执行以下语句：

```sql
SELECT 'A' AS v
UNION ALL
SELECT 'B' AS v
UNION ALL
SELECT NULL AS v
UNION ALL
SELECT '0' AS v
UNION ALL
SELECT '1' AS v
ORDER BY v NULLS FIRST;
```

```text
 v
---
 <null>
 0
 1
 A
 B
(5 行记录)
```

---

当我们使用 `ORDER BY` 子句降序 DESC 排序时，NULL 值排在非 NULL 值的前面。这是因为 DESC 排序默认采用 NULLS FIRST 规则。如下：

```sql
SELECT 'A' AS v
UNION ALL
SELECT 'B' AS v
UNION ALL
SELECT NULL AS v
UNION ALL
SELECT '0' AS v
UNION ALL
SELECT '1' AS v
ORDER BY v DESC;
```

```text
 v
---
 <null>
 B
 A
 1
 0
(5 行记录)
```