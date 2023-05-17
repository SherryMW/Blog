---
category: IT
tag: 数据库
order: 19
article: false
---

# IS NULL

`IS NULL` 是一个布尔运算符，它检查一个值是不是 NULL。NULL 值是一个特殊的值，它表示什么都没有，它即不是空字符串也不是假（false）

## IS NULL 语法

`IS NULL` 是一个单目比较运算符，只需要一个操作数。请使用如下的语法：

```sql
expr IS NULL
expr IS NOT NULL
```

- expr 可以是一个字段名、一个值或者一个表达式

- `IS NOT NULL` 是 `IS NULL` 的否定运算

`IS NULL` 和 `IS NOT NULL` 可以在 [SELECT](./select.md) 语句或者 [WHERE](./where.md) 子句中使用

## IS NULL 运算规则

当 `IS NULL` 运算符左侧的操作数是 NULL 时，`IS NULL` 运算符返回 t，否则返回 f

```sql
SELECT
    NULL IS NULL AS "NULL IS NULL",
    0 IS NULL AS "0 IS NULL",
    1 IS NULL AS "1 IS NULL";
```

```text
 NULL IS NULL | 0 IS NULL | 1 IS NULL
--------------+-----------+-----------
 t            | f         | f
```

`IS NOT NULL` 是 `IS NULL` 的否定运算。如果 `IS NOT NULL` 左侧的操作数不是 `NULL` 时，`IS NOT NULL` 运算符返回 t，否则返回 f

```sql
SELECT
    NULL IS NOT NULL "NULL IS NOT NULL",
    0 IS NOT NULL "0 IS NOT NULL",
    1 IS NOT NULL "1 IS NOT NULL";
```

```text
 NULL IS NOT NULL | 0 IS NOT NULL | 1 IS NOT NULL
------------------+---------------+---------------
 f                | t             | t
```

## IS NULL 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

在 staff 表中，picture 中存储了职员的照片文件，要从 staff 表中查询那些没有上传图片的职员，需要检查 picture 是否为 NULL，请使用以下带有 `IS NULL` 的 SQL 语句：

```sql
SELECT
    first_name, last_name, picture
FROM
    staff
WHERE
    picture IS NULL;
```

```text
 first_name | last_name | picture
------------+-----------+---------
 Mike       | Hillyer   | <null>
 Jon        | Stephens  | <null>
```