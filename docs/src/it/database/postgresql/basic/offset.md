---
category: IT
tag: 数据库
order: 13
article: false
---

# OFFSET

有时候，您可能想让 [SELECT](./select.md) 语句跳过指定的行数，返回剩余的行。比如，您想要获取除成绩前 10 名之外的所有人的信息

## OFFSET 语法

PostgreSQL `OFFSET` 是 `SELECT` 语句的可选子句，用于将查询跳过指定的行数，请使用如下的语法：

```sql
OFFSET skipped_rows
```

这里，skipped_rows 指定要跳过的行数。比如 `OFFSET 10` 表示从结果集中跳过前面的 10 行数据，从第 11 行开始返回结果

带有 `OFFSET` 子句的 `SELECT` 语句完整用法如下：

```sql
SELECT column_list
FROM table_name
[other_clauses]
OFFSET skipped_rows;
```

其中，other_clauses 是那些可以在 [SELECT](./select.md) 语句中使用的其他子句，比如 [WHERE](./where.md)，[ORDER BY](./order-by.md)，[OFFSET](./offset.md) 等

通常，您需要在带有 `FETCH` 子句的 `SELECT` 语句中一同使用 `ORDER BY` 子句，这样您可以得到一个按照指定的顺序排序的结果集。这是一个好的实践

在一些分页的查询的应用中，您需要在 `SELECT` 语句使用 [LIMIT](./limit.md) 子句和 `OFFSET` 子句。如下：

```sql
SELECT column_list
FROM table_name
ORDER BY ...
LIMIT rows_count OFFSET skipped_rows;
```

- `LIMIT 10 OFFSET 0`：从查询结果中取出前 10 条记录，跳过前面的 0 条记录。`OFFSET 0` 表示从第 1 条记录开始取。因为 `OFFSET` 的默认值为 0，所以也可以省略 `OFFSET 0`

- `LIMIT 10 OFFSET 10`：`LIMIT 10` 表示最多只能返回 10 行数据，`OFFSET 10` 表示从第 11 行开始返回结果。由于 `OFFSET` 子句在 `LIMIT` 子句之后，因此这条 SQL 查询语句的执行顺序为先限制结果集最多只能有 10 行数据，然后跳过前面的 10 行数据，最后返回接下来的 10 行数据

- `LIMIT 10 OFFSET 20`：`LIMIT 10` 表示最多只能返回 10 行数据，`OFFSET 20` 表示从第 21 行开始返回结果。由于 `OFFSET` 子句在 `LIMIT` 子句之后，因此这条 SQL 查询语句的执行顺序为先限制结果集最多只能有 10 行数据，然后跳过前面的 20 行数据，最后返回接下来的 10 行数据

## OFFSET 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 跳过示例

要从 film 表查询时跳过前面的 995 行，请使用下面的带有 `OFFSET` 子句的 `SELECT` 语句：

```sql
SELECT
  film_id,
  title,
  release_year
FROM film
ORDER BY film_id
OFFSET 995;
```

```text
 film_id |       title       | release_year
---------+-------------------+--------------
     996 | YOUNG LANGUAGE    |         2006
     997 | YOUTH KICK        |         2006
     998 | ZHIVAGO CORE      |         2006
     999 | ZOOLANDER FICTION |         2006
    1000 | ZORRO ARK         |         2006
(5 行记录)
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
LIMIT 10;
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

您可以使用如下的语句获取第二页的所有行：

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

这里，我们使用 `OFFSET 10` 指示了跳过第一页的 10 行，并使用 `LIMIT 10` 限制了此查询最多返回 10 行。以下是输出：

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