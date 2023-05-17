---
category: IT
tag: 数据库
order: 11
article: false
---

# FETCH

在 PostgreSQL 中，您可以在 [SELECT](./select.md) 语句中使用 `FETCH` 子句来限制结果集的大小，并允许分页查询

FETCH 子句与 [LIMIT](./limit.md) 子句作用相同，但是 `FETCH` 子句是 SQL 标准，而 `LIMIT` 子句不是 SQL 标准

## FETCH 语法

要使用 `FETCH` 子句限制返回的行数，请使用如下的语法：

```sql
FETCH { FIRST | NEXT } [ rows_count ] { ROW | ROWS } ONLY;
```

- `FIRST` 或 `NEXT` 用于指定返回的记录是从结果集的第一条还是从指定偏移量后的下一条开始

- `ROW` 或 `ROWS` 用于指定要返回的记录单位是行还是行集合

- rows_count 是要限制的行数，即返回的最大的行数。它是可选的，默认值为 1。您应该为 rows_count 指定一个大于 0 的整数值

带有 `FETCH` 子句的 `SELECT` 语句完整用法如下：

```sql
SELECT column_list
FROM table_name
[other_clauses]
FETCH rows_count;
```

其中，other_clauses 是那些可以在 [SELECT](./select.md) 语句中使用的其他子句，比如 [WHERE](./where.md)，[ORDER BY](./order-by.md)，[OFFSET](./offset.md) 等

通常，您需要在带有 `FETCH` 子句的 `SELECT` 语句中一同使用 `ORDER BY` 子句，这样您可以得到一个按照指定的顺序排序的结果集。这是一个好的实践

在一些分页的查询的应用中，您需要在 `SELECT` 语句结合使用 [OFFSET](./offset.md) 子句和 `FETCH` 子句。如下：

```sql
SELECT column_list
FROM table_name
ORDER BY ...
OFFSET skipped_rows
FETCH FIRST rows_count ROWS ONLY;
```

- 第一页可以使用：`OFFSET 0 FETCH FIRST 10 ROWS ONLY` 表示跳过前 0 行的数据，从第 1 行开始检索数据，并指定要检索的行数为 10 行

- 第二页可以使用：`OFFSET 10 FETCH FIRST 10 ROWS ONLY` 表示跳过前 10 行的数据，从第 11 行开始检索数据，并指定要检索的行数为 10 行

- 第三页可以使用：`OFFSET 20 FETCH FIRST 10 ROWS ONLY` 表示跳过前 20 行的数据，从第 21 行开始检索数据，并指定要检索的行数为 10 行

## FETCH 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 限制返回行数示例

要限制从 film 表查询时最多返回 5 行，请使用下面的带有 `FETCH` 子句的 `SELECT` 语句：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
FETCH FIRST 5 ROWS ONLY;
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

通常，您经常使用 `FETCH` 子句从表中选择具有最高或最低值的行

例如，要获得租金最高的 10 部电影，您可以按租金降序对电影进行排序，然后使用 `FETCH` 子句获得前 10 部电影。您可以通过以下查询达到这个目的：

```sql
SELECT
  film_id,
  title,
  rental_rate
FROM film
ORDER BY rental_rate DESC, film_id
FETCH FIRST 10 ROWS ONLY;
```

```text
 film_id |        title         | rental_rate
---------+----------------------+-------------
       2 | ACE GOLDFINGER       |        4.99
       7 | AIRPLANE SIERRA      |        4.99
       8 | AIRPORT POLLOCK      |        4.99
      10 | ALADDIN CALENDAR     |        4.99
      13 | ALI FOREVER          |        4.99
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

一个更好的方案是分页显示所有的影片。您可以很轻松地使用带有 `FETCH` 和 `OFFSET` 子句的 `SELECT` 语句实现分页查询

假设您需要每页显示 10 个影片信息，那么您可以使用如下的语句获取第一页的所有行：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
FETCH FIRST 10 ROWS ONLY;
```

这里，为了让所有分页的顺序一致，我们使用 `ORDER BY film_id` 让影片按照 film_id 排序，并使用 `FETCH FIRST 10 ROWS ONLY` 限制了此查询最多返回 10 行

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

为了获取第二页要显示的 10 行，我们使用 `OFFSET 10` 子句跳过第一页的 10 行，并使用 `FETCH FIRST 10 ROWS ONLY` 限制了此查询最多返回 10 行。您可以使用如下的语句获取第二页的所有行：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
OFFSET 10
FETCH FIRST 10 ROWS ONLY;
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
OFFSET 20
FETCH FIRST 10 ROWS ONLY;
```

这里，我们使用 `OFFSET 20` 指示了跳过前两页的 20 行，并使用 `FETCH FIRST 10 ROWS ONLY` 限制了此查询最多返回 10 行