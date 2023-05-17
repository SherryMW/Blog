---
category: IT
tag: 数据库
order: 29
article: false
---

# 子查询

在 PostgreSQL 中，子查询是嵌套在另一个查询中的查询，也被称为内部查询

通常情况下，我们会使用子查询构建更复杂的 SQL 语句。比如您可以将子查询使用在 `EXISTS`，`IN`，`ANY`，`ALL` 等表达式中，也可以将子查询的结果直接和值比较

## 在 EXISTS 运算符中使用子查询

[EXISTS](./exists.md) 运算符需要一个子查询作为操作数，以检查此子查询是否返回行

比如要从 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 中的 language 表查找那些在 film 表中用到的语言，请使用如下的语法：

```sql
SELECT *
FROM language
WHERE EXISTS(
    SELECT *
    FROM film
    WHERE film.language_id = language.language_id
  );
```

```text
 language_id |         name         |     last_update
-------------+----------------------+---------------------
           1 | English              | 2006-02-15 05:02:19
```

## 在 IN 运算符中使用子查询

[IN](./in.md) 运算符也需要一个集合作为操作数，因此您也可以使用子查询作为 `IN` 运算符右侧的操作数

比如，您可以使用如下带有 `IN` 运算符和子查询的语句达到上面的目的：

```sql
SELECT *
FROM language
WHERE language_id in(
    SELECT DISTINCT language_id
    FROM film
  );
```

```text
 language_id |         name         |     last_update
-------------+----------------------+---------------------
           1 | English              | 2006-02-15 05:02:19
```

## 将子查询和值直接进行比较

比如，要计算租金高于平均租金的影片的数量，您可以使用一下语句实现：

```sql
SELECT count(*)
FROM film
WHERE rental_rate > (
    SELECT avg(rental_rate)
    FROM film
  );
```

```text
 count
-------
   659
```