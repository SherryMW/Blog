---
category: IT
tag: 数据库
order: 8
article: false
---

# WHERE

默认情况下，`SELECT` 查询数据表中的所有行数。但是我们可能只想查询满足一定条件的行。比如年龄是 18 的学生，成绩中等的学生等

在 PostgreSQL 中，要返回满足指定条件的行，请在 [SELECT](./select.md) 语句中使用 `WHERE` 子句。除了 `SELECT` 语句之外，您还可以在 [UPDATE](./update.md) 和 [DELETE](./delete.md) 语句中使用 `WHERE` 子句来指定要更新或删除的行

## WHERE 语法

要返回满足指定条件的行，请按如下语法使用 PostgreSQL 带有 `WHERE` 子句的 `SELECT` 语句：

```sql
SELECT columns_list
FROM table_name
WHERE query_condition;
```

要更新满足指定条件的行，请按如下语法使用 PostgreSQL 带有 `WHERE` 子句的 `UPDATE` 语句：

```sql
UPDATE table_name
SET column_name = value1, ...
WHERE query_condition;
```

要删除满足指定条件的行，请按如下语法使用 PostgreSQL 带有 `WHERE` 子句的 `DELETE` 语句：

```sql
DELETE FROM table_name
WHERE query_condition;
```

`WHERE` 子句中的 query_condition 为布尔表达式。布尔表达式的结果必须为 true，false 或者 NULL。它可以是一个布尔表达式或使用 `AND` 和 `OR` 运算符的布尔表达式的组合

`WHERE` 子句使用 query_condition 来过滤表中的行：

- 只有导致 query_condition 评估为真的行才会包含在 SELECT 语句返回的结果集中

- 只有导致 query_condition 评估为真的行才会被 UPDATE 语句更新

- 只有导致 query_condition 评估为真的行才会被 DELETE 语句删除

## WHERE 子句示例

我们将使用 [PostgreSQL Sakila 示例数据库](./start.md#sakila) 里的数据表进行演示

### 使用等号运算符

以下语句使用 `WHERE` 子句查找名字为 JAMIE 的客户：

```sql
SELECT last_name, first_name
FROM customer
WHERE first_name = 'JAMIE';
```

```text
 last_name | first_name
-----------+------------
 RICE      | JAMIE
 WAUGH     | JAMIE
(2 行记录)
```

### 使用 AND 运算符

以下示例通过使用逻辑运算符 `AND` 组合两个布尔表达式来查找名字和姓氏为 JAMIE 和 RICE 的客户：

```sql
SELECT last_name, first_name
FROM customer
WHERE first_name = 'JAMIE' AND last_name = 'RICE';
```

```text
 last_name | first_name
-----------+------------
 RICE      | JAMIE
```

### 使用 OR 运算符

此示例使用 `OR` 运算符查找姓氏为 RODRIGUEZ 或名字为 ADAM 的客户：

```sql
SELECT first_name, last_name
FROM customer
WHERE last_name = 'RODRIGUEZ' OR first_name = 'ADAM';
```

```text
 first_name | last_name
------------+-----------
 LAURA      | RODRIGUEZ
 ADAM       | GOOCH
(2 行记录)
```

### 使用 IN 运算符

如果要将字符串与一个列表中的任何字符串匹配，可以使用 [IN](./in.md) 运算符

例如，以下语句返回名字为 ANN，ANNE 或 ANNIE 的客户

```sql
SELECT first_name, last_name
FROM customer
WHERE first_name IN ('ANN', 'ANNE', 'ANNIE');
```

```text
 first_name | last_name
------------+-----------
 ANN        | EVANS
 ANNE       | POWELL
 ANNIE      | RUSSELL
(3 行记录)
```

### 使用 LIKE 运算符

要查找与指定模式匹配的字符串，请使用 [LIKE](./like.md) 运算符。以下示例返回名字以字符串 ANN 开头的所有客户：

```sql
SELECT first_name, last_name
FROM customer
WHERE first_name LIKE 'ANN%';
```

```text
 first_name | last_name
------------+-----------
 ANNA       | HILL
 ANN        | EVANS
 ANNE       | POWELL
 ANNIE      | RUSSELL
 ANNETTE    | OLSON
(5 行记录)
```

### 使用 BETWEEN 运算符

以下示例使用 [BETWEEN](./between.md) 运算符查找名字以字母 A 开头并包含 3 到 5 个字符的客户

```sql
SELECT first_name, LENGTH(first_name) name_length
FROM customer
WHERE first_name LIKE 'A%' AND LENGTH(first_name) BETWEEN 3 AND 5
ORDER BY name_length;
```

```text
 first_name | name_length
------------+-------------
 AMY        |           3
 ANN        |           3
 ANA        |           3
 ANDY       |           4
 ANNA       |           4
...
(22 行记录)
```

在这个例子中，我们使用了获取输入字符串的字符数 `LENGTH()` 函数