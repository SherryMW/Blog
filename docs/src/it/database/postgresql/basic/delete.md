---
category: IT
tag: 数据库
order: 3
article: false
---

# DELETE

在 PostgreSQL 中，`DELETE` 语句用于从表中删除符合指定条件的行或者所有行

## DELETE 语法

要从 PostgreSQL 数据库中的表中删除行，请使用如下的语法：

```sql
DELETE FROM table_name
[where_clause]
[RETURNING expr];
```

- 在 `DELETE FROM` 关键字后的 table_name 是要从中删除的数据的表名称

- where_clause 是 `WHERE` 子句。您可以在其中使用条件来指定要删除表中的哪些行

- `WHERE` 子句是可选的。如果不指定 `WHERE` 子句，表中的所有行将被删除（非常危险）

- `RETURNING` 子句是可选的。它用于返回删除的行的信息。expr 可以是列名或者表达式，多个列或者表达式请使用逗号分隔。您还可以使用 * 表示表中的所有的列。如果不指定 `RETURNING` 子句，`DELETE` 语句将返回删除的行数。

如果您想要更加高效率的清空一个表，请优先使用 [TRUNCATE TABLE](./truncate.md) 语句

## DELETE 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

为了防止数据丢失，我们将创建一个表 film_copy，它是 film 表的拷贝

```sql
CREATE TABLE film_copy AS SELECT * FROM film;
```

[AS](./as.md) 关键字在 SQL 中有多种用途，其中之一是用于为 `SELECT` 语句中的列指定别名，另一种用途是用于创建表的同时将查询结果插入新表，同时为新表指定表名。在这个语句中，`AS` 用于创建一个名为 film_copy 的新表，并将 `SELECT` 语句的结果插入到新表中。可以将 `AS` 视为 `CREATE TABLE` 和 `SELECT` 语句的连接词

这个语句可以在许多情况下使用。例如，如果你想要对原有的表进行备份或者在表中添加数据进行实验，但是不想直接操作原有表，那么可以使用这个语句创建一个与原有表相同的新表，然后对新表进行操作

需要注意的是，这个语句可能会引起一些性能问题，因为它会复制整个表的数据。如果原表数据量很大，那么创建新表的时间可能会很长，并且需要大量的磁盘空间来存储数据

### 删除满足条件的行

要从 film_copy 表中删除 film_id 为 1 的 1 个影片，请使用如下语句：

```sql
DELETE FROM film_copy
WHERE film_id = 1;
```

```text
DELETE 1
```

该语句返回 1 表示已经删除了 1 行

要从 film_copy 表中删除 film_id 为 2, 3 或者 4 的 3 个影片，请使用如下语句：

```sql
DELETE FROM film_copy
WHERE film_id in (2, 3, 4);
```

```text
DELETE 3
```

该语句使用了 [IN](./in.md) 运算符来包含指定的值，最终结果返回 3 表示已经删除了 3 行

### 删除并返回删除的行

要从 film_copy 表中删除 film_id 为 10 或者 11 的 2 部影片，并返回删除的影片的标题，请使用如下语句：

```sql
DELETE FROM film_copy
WHERE film_id in (10, 11)
RETURNING film_id, title;
```

```text
 film_id |      title
---------+------------------
      10 | ALADDIN CALENDAR
      11 | ALAMO VIDEOTAPE
(2 行记录)
```

这里，`DELETE` 删除了 2 行，并返回了删除的 2 行的中的部分列

### 删除所有行

要从 film_copy 表中删除所有数据，请使用如下语句：

```sql
DELETE FROM film_copy;
```