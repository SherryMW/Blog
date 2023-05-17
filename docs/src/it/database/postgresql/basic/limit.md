---
category: IT
tag: 数据库
order: 12
article: false
---

# LIMIT

当您使用 [SELECT](./select.md) 语句从一个大表查询数据的时候，如果返回全部的行将会导致很大的系统开销。您可能想要每次只返回少量的数据行

在 PostgreSQL 中，您可以在 [SELECT](./select.md) 语句中使用 `LIMIT` 子句来限定返回的行的数量

注意：`LIMIT` 子句虽然被很多数据库系统支持，但它不是 SQL 标准。如果为了符合 SQL 标准，您可以用 [FETCH](./fetch.md) 子句来完成同样的事情

## LIMIT 语法

PostgreSQL LIMIT 是 [SELECT](#select) 语句的可选子句，用于限制查询返回的行数。请使用如下的语法：

```sql
LIMIT rows_count;
```

这里 rows_count 指定要返回的最大行数。比如 `LIMIT 10` 表示最多返回 10 行

带有 `LIMIT` 子句的 `SELECT` 语句完整用法如下：

```sql
SELECT column_list
FROM table_name
[other_clauses]
LIMIT rows_count;
```

其中，other_clauses 是那些可以在 [SELECT](./select.md) 语句中使用的其他子句，比如 [WHERE](./where.md)，[ORDER BY](./order-by.md)，[OFFSET](./offset.md) 等

通常，您需要在带有 `FETCH` 子句的 `SELECT` 语句中一同使用 `ORDER BY` 子句，这样您可以得到一个按照指定的顺序排序的结果集。这是一个好的实践

在一些分页的查询的应用中，您需要在 `SELECT` 语句使用 `LIMIT` 子句和 [OFFSET](./offset.md) 子句。如下：

- `LIMIT 10 OFFSET 0`：从查询结果中取出前 10 条记录，跳过前面的 0 条记录。`OFFSET 0` 表示从第 1 条记录开始取。因为 `OFFSET` 的默认值为 0，所以也可以省略 `OFFSET 0`

- `LIMIT 10 OFFSET 10`：`LIMIT 10` 表示最多只能返回 10 行数据，`OFFSET 10` 表示从第 11 行开始返回结果。由于 `OFFSET` 子句在 `LIMIT` 子句之后，因此这条 SQL 查询语句的执行顺序为先限制结果集最多只能有 10 行数据，然后跳过前面的 10 行数据，最后返回接下来的 10 行数据

- `LIMIT 10 OFFSET 20`：`LIMIT 10` 表示最多只能返回 10 行数据，`OFFSET 20` 表示从第 21 行开始返回结果。由于 `OFFSET` 子句在 `LIMIT` 子句之后，因此这条 SQL 查询语句的执行顺序为先限制结果集最多只能有 10 行数据，然后跳过前面的 20 行数据，最后返回接下来的 10 行数据

## LIMIT 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 限制返回行数示例

要限制从 film 表查询时最多返回 5 行，请使用下面的带有 `LIMIT` 子句的 `SELECT` 语句：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
LIMIT 5;
```

```text
 film_id |      title       | release_year
---------+------------------+--------------
       1 | ACADEMY DINOSAUR |         2006
       2 | ACE GOLDFINGER   |         2006
       3 | ADAPTATION HOLES |         2006
       4 | AFFAIR PREJUDICE |         2006
       5 | AFRICAN EGG      |         2006
(5 行记录)
```

### 获取前 N 行

通常，您经常使用 `LIMIT` 子句从表中选择具有最高或最低值的行。例如，要获得租金最高的 10 部电影，您可以按租金降序对电影进行排序，然后使用 `LIMIT` 子句获得前 10 部电影。您可以通过以下查询达到这个目的：

```sql
SELECT
  film_id,
  title,
  rental_rate
FROM film
ORDER BY rental_rate DESC
LIMIT 10;
```

```text
 film_id |        title         | rental_rate
---------+----------------------+-------------
      21 | AMERICAN CIRCUS      |        4.99
      31 | APACHE DIVINE        |        4.99
      13 | ALI FOREVER          |        4.99
      20 | AMELIE HELLFIGHTERS  |        4.99
      28 | ANTHEM LUKE          |        4.99
...
(10 行记录)
```

### 分页查询示例

film 表中共有 1000 行关于影片的信息。您可以通过以下带有 `COUNT(*)` 表达式的 `SELECT` 语句得到验证：

```sql
SELECT COUNT(*) FROM film;
```

```text
 count
-------
  1000
```

假设你有一个系统需要在前端展示所有的影片信息，将 1000 行信息全部展示在一页上并不是一个好的方案。因为这个方案如下的缺点：

- 数据库性能。一个语句中返回大量的数据会带给数据库服务器更大的内存开销和 IO 消耗

- 应用性能。大量的数据会导致应用占用更大的内存，甚至回导致应用卡顿、卡死

- 用户的体验。用户面对大量的数据会眩晕

一个更好的方案是分页显示所有的影片。您可以很轻松地使用带有 `LIMIT` 和 `OFFSET` 子句的 `SELECT` 语句实现分页查询

假设您需要每页显示 10 个影片信息，那么您可以使用如下的语句获取第一页的所有行：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
LIMIT 10;
```

这里，为了让所有分页的顺序一致，我们使用 `ORDER BY film_id` 让影片按照 film_id 排序，并使用 `LIMIT 10` 限制了此查询最多返回 10 行

```text
 film_id |      title       | release_year
---------+------------------+--------------
       1 | ACADEMY DINOSAUR |         2006
       2 | ACE GOLDFINGER   |         2006
       3 | ADAPTATION HOLES |         2006
       4 | AFFAIR PREJUDICE |         2006
       5 | AFRICAN EGG      |         2006
...
(10 行记录)
```

为了获取第二页要显示的 10 行，我们使用 `OFFSET 10` 子句跳过第一页的 10 行，并使用 `LIMIT 10` 限制了此查询最多返回 10 行。您可以使用如下的语句获取第二页的所有行：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
LIMIT 10
OFFSET 10;
```

```text
 film_id |        title        | release_year
---------+---------------------+--------------
      11 | ALAMO VIDEOTAPE     |         2006
      12 | ALASKA PHANTOM      |         2006
      13 | ALI FOREVER         |         2006
      14 | ALICE FANTASIA      |         2006
      15 | ALIEN CENTER        |         2006
...
(10 行记录)
```

同样的，您可以使用如下的语句获取第三页的所有行：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
LIMIT 10
OFFSET 20;
```

这里，我们使用 `OFFSET 20` 指示了跳过前两页的 20 行，并使用 `LIMIT 10` 限制了此查询最多返回 10 行