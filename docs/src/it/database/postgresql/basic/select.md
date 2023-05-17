---
category: IT
tag: 数据库
order: 7
article: false
---

# SELECT

在 PostgreSQL 中，`SELECT` 语句用于从一个或多个表中检索数据，它可能是使用最多的语句

## SELECT 语法

让我们从单个表中检索数据的基本形式开始

```sql
SELECT
    expr_list
FROM
    table_name
[other_clauses];
```

- `SELECT` 和 `FROM` 是关键字

- expr_list 是要选择的列或者表达式的列表。多个列或表达式需要使用逗号分隔

- table_name 是要查询的数据表

- `FROM` table_name 是可选的。如果你不查询任何表中的行，则可以省略 FROM 子句

- other_clauses 是 `SELECT` 语句支持的子句。`SELECT` 语句支持很多子句，包括：

    - 使用 [DISTINCT](./distinct.md) 运算符选择不同的行

    - 使用 [ORDER BY](./order-by.md) 子句对行进行排序

    - 使用 [WHERE](./where.md) 子句过滤行

    - 使用 [LIMIT](./limit.md) 或 [FETCH](./fetch.md) 子句从表中选择行的子集

    - 使用 [GROUP BY](./group-by.md) 子句将行分组

    - 使用 [HAVING](./having.md) 子句过滤组

    - 使用诸如 `INNER JOIN`，`LEFT JOIN`，`FULL OUTER JOIN`，`CROSS JOIN` 之类的与其他表连接

    - 使用 [UNION](./union.md)，[INTERSECT](./intersect.md) 和 [EXCEPT](./except.md) 执行集合运算

注意：SQL 关键字不区分大小写。但是为了让 SQL 代码更易于阅读，将 SQL 关键字书写为大写形式是一个好的编码习惯

## SELECT 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 查询一列数据

下面的 `SELECT` 语句从 customer 表中查找所有客户的名字：

```sql
SELECT first_name FROM customer;
```

```text
 first_name
-------------
 MARY
 PATRICIA
 LINDA
 BARBARA
 ELIZABETH
...
(599 行记录)
```

注意：我们在 `SELECT` 语句末尾添加了一个分号 `;` 。分号不是 SQL 语句的一部分。它用于向 PostgreSQL 发出 SQL 语句结束的信号。分号也用于分隔两条 SQL 语句

### 查询多列数据

如果您想知道客户的名字、姓氏和电子邮件，您可以在 `SELECT` 子句中指定这些列名，如以下查询所示：

```sql
SELECT
   first_name,
   last_name,
   email
FROM
   customer;
```

```text
 first_name  |  last_name   |                  email
-------------+--------------+------------------------------------------
 MARY        | SMITH        | MARY.SMITH@sakilacustomer.org
 PATRICIA    | JOHNSON      | PATRICIA.JOHNSON@sakilacustomer.org
 LINDA       | WILLIAMS     | LINDA.WILLIAMS@sakilacustomer.org
 BARBARA     | JONES        | BARBARA.JONES@sakilacustomer.org
 ELIZABETH   | BROWN        | ELIZABETH.BROWN@sakilacustomer.org
...
(599 行记录)
```

### 查询所有列的数据

如果您想使用 `SELECT` 语句从 customer 表中查找所有的列，请使用以下语句：

```sql
SELECT * FROM customer;
```

```text
customer_id | store_id | first_name  |  last_name   |                  email                   | address_id | activebool | create_date |     last_update     | active
-------------+----------+-------------+--------------+------------------------------------------+------------+------------+-------------+---------------------+--------
           1 |        1 | MARY        | SMITH        | MARY.SMITH@sakilacustomer.org            |          5 | t          | 2006-02-14  | 2006-02-15 04:57:20 |      1
           2 |        1 | PATRICIA    | JOHNSON      | PATRICIA.JOHNSON@sakilacustomer.org      |          6 | t          | 2006-02-14  | 2006-02-15 04:57:20 |      1
           3 |        1 | LINDA       | WILLIAMS     | LINDA.WILLIAMS@sakilacustomer.org        |          7 | t          | 2006-02-14  | 2006-02-15 04:57:20 |      1
           4 |        2 | BARBARA     | JONES        | BARBARA.JONES@sakilacustomer.org         |          8 | t          | 2006-02-14  | 2006-02-15 04:57:20 |      1
           5 |        1 | ELIZABETH   | BROWN        | ELIZABETH.BROWN@sakilacustomer.org       |          9 | t          | 2006-02-14  | 2006-02-15 04:57:20 |      1
...
(599 行记录)
```

在此示例中，我们在 `SELECT` 子句中使用了星号 `*`，它是所有列的简写。星号 `*` 可以让我们输入更少，从而不用列出表中的所有的列名

但是，在 `SELECT` 语句中使用星号 `*` 并不是一个好习惯，原因如下：

1. 数据库性能。假设您有一个包含许多列和大量数据的表，带有星号 `*` 速记的 `SELECT` 语句将从表的所有列中选择数据，这对于应用程序来说可能不是必需的

2. 应用性能。从数据库中检索不必要的数据会增加数据库服务器和应用程序服务器之间的流量。因此您的应用程序的响应速度可能较慢且可扩展性较差

由于这些原因，最好在 `SELECT` 子句中明确指定列名，以便仅从数据库中获取必要的数据

### 带有表达式的 SELECT 语句

除了列名，您还可以在 `SELECT` 语句中使用表达式。以下示例使用 `SELECT` 语句返回所有客户的全名和电子邮件：

```sql
SELECT
    first_name || ' ' || last_name,
    email
FROM
    customer;
```

```text
       ?column?        |                  email
-----------------------+------------------------------------------
 MARY SMITH            | MARY.SMITH@sakilacustomer.org
 PATRICIA JOHNSON      | PATRICIA.JOHNSON@sakilacustomer.org
 LINDA WILLIAMS        | LINDA.WILLIAMS@sakilacustomer.org
 BARBARA JONES         | BARBARA.JONES@sakilacustomer.org
 ELIZABETH BROWN       | ELIZABETH.BROWN@sakilacustomer.org
...
(599 行记录)
```

在此示例中，我们使用字符串连接运算符 || 连接每个客户的名字、空格和姓氏

### 计算表达式

如果您只想要单纯的计算一个表达式，您可以省略 `SELECT` 语句中的 `FROM` 子句。 以下 `SELECT` 语句用来计算 5 * 3 的结果：

```sql
SELECT 5 * 3;
```

```text
 ?column?
----------
       15
```

## SELECT 语句完整的执行顺序

1. `FROM` 子句：首先处理 `FROM` 子句，它指定了要查询的数据表或者子查询。查询将从指定的数据表或者子查询中获取数据。在这个阶段，也会对数据表或子查询中的每一行应用 `WHERE` 子句的限制条件，从而排除不符合条件的行

2. `WHERE` 子句：`WHERE` 子句用于过滤行。在这一步中，PostgreSQL 会对 `FROM` 子句得到的行应用 `WHERE` 子句的过滤条件，只返回符合条件的行

3. `GROUP BY` 子句：`GROUP BY` 子句通常用于按照一个或多个列对结果进行分组，从而生成汇总数据。在这一步中，查询结果将按照 `GROUP BY` 子句指定的列进行分组，并且对于每组数据计算指定的聚合函数（如COUNT、SUM等）

4. `HAVING` 子句：`HAVING` 子句用于对分组后的数据进行过滤，与 `WHERE` 子句的作用类似，但是 `HAVING` 是对分组后的结果进行限制，而 `WHERE` 是对原始数据进行限制

5. `SELECT` 子句：在这一步中，查询将计算每一行结果集的值，包括列表达式、聚合函数和常量等

6. `DISTINCT` 子句：`DISTINCT` 子句用于去除查询结果中重复的行

7. `ORDER BY` 子句：`ORDER BY` 子句用于对查询结果进行排序

8. `LIMIT` 和 `OFFSET` 子句：`LIMIT` 子句用于限制返回的行数，`OFFSET` 子句用于指定查询结果中要跳过的行数

需要注意的是，以上顺序是大体的顺序，但在实际执行中可能会有一些优化或调整，具体的执行顺序可能会根据实际情况而有所不同