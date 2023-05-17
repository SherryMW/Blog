---
category: IT
tag: 数据库
order: 16
article: false
---

# IN

在 PostgreSQL 中，`IN` 运算符是一个布尔运算符，用来检查一个值列表是否包含一个指定的值。如果值列表包含了指定的值，则 `IN` 运算符返回真，否则它返回假

## IN 运算符语法

要检查一个值是否位于一个值列表之内，请使用如下的语法：

```sql
expr IN (value1, value2, ...)
```

或者

```sql
expr IN (subquery)
```

- expr 可以是一个字段名、值或其他的表达式（比如函数调用、运算等）

- (value1, value2, ...) 是一个值列表，多个值之间使用逗号分隔，并使用小括号将它们包围起来

- value1 是具体的值，比如：1, 2, 'A', 'B' 等

- subquery 是一个只返回一个列的 [子查询](./subquery.md)

如果值列表或者子查询返回的值中包含了 expr，`IN` 运算符返回真，否则它返回假

`IN` 运算符的否定操作是 `NOT IN`

## IN vs OR vs AND

`IN` 表达式都可以使用 `OR` 运算符改写，比如：

```sql
val IN (1, 2, 3)
```

等同于如下使用 `OR` 的表达式：

```sql
val = 1 OR val = 2 OR val = 3
```

同理，`NOT IN` 表达式都可以使用 `AND` 运算符改写

```sql
val NOT IN (1, 2, 3)
```

等同于如下使用 `AND` 的表达式：

```sql
val <> 1 AND val <> 2 OR val <> 3
```

## IN 运算符示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 actor 表中查询姓氏为 ALLEN 或 DAVIS 的所有演员，请使用以下带有 `IN` 运算符的语句：

```sql
SELECT *
FROM actor
WHERE last_name IN ('ALLEN', 'DAVIS');
```

```text
 actor_id | first_name | last_name |     last_update
----------+------------+-----------+---------------------
        4 | JENNIFER   | DAVIS     | 2006-02-15 04:34:33
      101 | SUSAN      | DAVIS     | 2006-02-15 04:34:33
      110 | SUSAN      | DAVIS     | 2006-02-15 04:34:33
      118 | CUBA       | ALLEN     | 2006-02-15 04:34:33
      145 | KIM        | ALLEN     | 2006-02-15 04:34:33
      194 | MERYL      | ALLEN     | 2006-02-15 04:34:33
(6 行记录)
```

您可以使用 `OR` 运算符改写上面的语句：

```sql
SELECT *
FROM actor
WHERE last_name = 'ALLEN' OR last_name = 'DAVIS';
```

## 在 IN 中使用子查询

要从 film 表中检索拥有库存的影片的数量，您可以使用带有子查询的 `IN` 表达式：

```sql
SELECT COUNT(*)
FROM film
WHERE film_id IN (
    SELECT film_id
    FROM inventory
  );
```

```text
 count
-------
   958
```