---
category: IT
tag: 数据库
order: 20
article: false
---

# SELECT INTO

PostgreSQL `SELECT INTO` 语句允许您从一个查询的结果创建一个新表并将结果集插入到新表，它与 `CREATE TABLE ... AS` 语句功能相同

## SELECT INTO 语法

要使用 PostgreSQL `SELECT INTO` 语句创建一个新表，请遵循以下语法：

```sql
SELECT column_list
INTO [ TEMPORARY | TEMP ] [ TABLE ] new_table
[other_clauses]
```

- column_list 是查询语句要返回的中的列或者表达式的列表。这些列最终成为新表中的列。您可以使用 [DISTINCT](../basic/distinct.md)

- `INTO` 之后的 new_table 是要创建的表的名字。`TEMPORARY` 或者 `TEMP` 代表新表是一个临时表。`TABLE` 关键字是可以省略

- other_clauses 是 [SELECT](../basic/select.md) 语句中可用的子句，这包括：

    - FORM 子句

    - [WHERE](../basic/where.md) 子句

    - [ORDER BY](../basic/order-by.md) 子句

    - [GROUP BY](../basic/group-by.md) 子句

    - [HAVING](../basic/having.md) 子句

    - [LIMIT](../basic/limit.md) 子句

    - [FETCH](../basic/fetch.md) 子句

    - [OFFSET](../basic/offset.md) 子句

    - 集合操作：[UNION](../basic/union.md)，[INTERSECT](../basic/intersect.md) 或者 [EXCEPT](../basic/except.md)

    - [表连接](../basic/join.md)

## SELECT INTO 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

在 Sakila 示例数据库 中，film 表存储了一个 DVD 商店中的可以租赁的所有的影片

### 使用 SELECT INTO 完整复制影片表

要将 film 表的所有的行复制到一个新表 film_copy，请使用下面的语句：

```sql
SELECT *
INTO TABLE film_copy
FROM film;
```

```text
SELECT 1000
```

以下语句从新表中查询数据已验证表是否创建成功：

```sql
SELECT count(*) FROM film_copy;
```

```text
 count
-------
  1000
```

### 使用 SELECT INTO 完整复制部分行和列

要将 film 表所有评级为 G 的影片的标题复制到一个新表 film_ranting_g_title，请使用下面的语句：

```sql
SELECT title
INTO TABLE film_ranting_g_title
FROM film
WHERE rating = 'G';
```

```text
SELECT 178
```

以下语句从新表中查询数据已验证表是否创建成功：

```sql
SELECT * FROM film_ranting_g_title;
```

```text
           title
---------------------------
 ACE GOLDFINGER
 AFFAIR PREJUDICE
 AFRICAN EGG
 ALAMO VIDEOTAPE
 AMISTAD MIDSUMMER
 ANGELS LIFE
 ANNIE IDENTITY
 ARMAGEDDON LOST
 ATLANTIS CAUSE
 AUTUMN CROW
 BAKED CLEOPATRA
 ...
(178 行记录)
```