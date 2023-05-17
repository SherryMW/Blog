---
category: IT
tag: 数据库
order: 15
article: false
---

# AS

PostgreSQL 允许您为列和表指定别名，以提高可读性和使用的便利性

## 列别名语法

要为在 PostgreSQL 中为列指定别名，请使用如下的语法：

```sql
SELECT expr AS alias_name
[FROM table_name];
```

- expr 是一个表达式或者列名

- alias_name 是 expr 列的别名。`SELECT` 语句返回的结果集中将使用别名

- 如果列别名中包含空格，请使用双引号 "" 将列别名包围起来

- `AS` 是一个关键字，它是可选的。您也可以省略它

您可以像下面的语句为多个列设置别名：

```sql
SELECT
   expr1 AS alias_name1,
   expr2 AS alias_name2,
   ...
[FROM table_name];
```

## 列别名示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 简单示例

要从 actor 表中检索演员的名字和姓氏，请使用以下语句：

```sql
SELECT
   first_name,
   last_name
FROM actor
LIMIT 5;
```

```text
 first_name |  last_name
------------+--------------
 PENELOPE   | GUINESS
 NICK       | WAHLBERG
 ED         | CHASE
 JENNIFER   | DAVIS
 JOHNNY     | LOLLOBRIGIDA
(5 行记录)
```

要为 last_name 指定一个别名 surname，请使用如下语句：

```sql
SELECT
   first_name,
   last_name AS surname
FROM actor
LIMIT 5;
```

```text
 first_name |   surname
------------+--------------
 PENELOPE   | GUINESS
 NICK       | WAHLBERG
 ED         | CHASE
 JENNIFER   | DAVIS
 JOHNNY     | LOLLOBRIGIDA
(5 行记录) 
```

### 为表达式示例分配列别名

要从 actor 表中检索演员的全名，请使用以下语句：

```sql
SELECT
   first_name || ' ' || last_name
FROM
   actor
LIMIT 5;
```

```text
      ?column?
---------------------
 PENELOPE GUINESS
 NICK WAHLBERG
 ED CHASE
 JENNIFER DAVIS
 JOHNNY LOLLOBRIGIDA
```

这里，我们使用了 `||` 操作符连接两个字符串。表达式 `first_name || ' ' || last_name` 将 first_name, 空格 和 last_name 连接在一起。我们可以看到表达式输出的列名为 ?column?，这是没有意义的。为了让表达式的输出列名更易读，我们需要为表达式指定一个列名，例如 full_name：

```sql
SELECT
    first_name || ' ' || last_name AS full_name
FROM
    actor
LIMIT 5;
```

```text
      full_name
---------------------
 PENELOPE GUINESS
 NICK WAHLBERG
 ED CHASE
 JENNIFER DAVIS
 JOHNNY LOLLOBRIGIDA
```

### 包含空格的列别名

在上面的例子中，如果您要使用 Full Name 作为列别名，因为它包含了空格，请使用双引号引用起来，即："Full Name"

```sql
SELECT
    first_name || ' ' || last_name AS "Full Name"
FROM
    actor
LIMIT 5;
```

```text
      Full Name
---------------------
 PENELOPE GUINESS
 NICK WAHLBERG
 ED CHASE
 JENNIFER DAVIS
 JOHNNY LOLLOBRIGIDA
```

## 表别名语法

要为在 PostgreSQL 中为表指定别名，请使用如下的语法：

```sql
table_name [AS] table_alias;
```

- table_alias 是表 table_name 的别名

- 如果表别名中包含空格，使用双引号 "" 将别名包围起来。不过大多数情况下，使用表别名是为了简化，不建议使用带有空格的表别名

- AS 关键字是可选的，它可以被省略

## 表别名示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中查找没有库存记录的影片，请使用以下语句：

```sql
SELECT
    f.film_id,
    f.title
FROM film f
WHERE
    NOT EXISTS (
        SELECT 1
        FROM inventory i
        WHERE i.film_id = f.film_id
    );
```

```text
 film_id |         title
---------+------------------------
      14 | ALICE FANTASIA
      33 | APOLLO TEEN
      36 | ARGONAUTS TOWN
      38 | ARK RIDGEMONT
      41 | ARSENIC INDEPENDENCE
...
(42 行记录)
```

这里，我们为 film 指定了别名 f，为 inventory 表指定了别名 i。请注意 [EXISTS](./exists.md) 表达式使用的 [子查询](./subquery.md) 中的 [WHERE](./where.md) 子句：

其中，比较来自 film 表中的 film_id 和 来自 inventory 表中 film_id 是否相等。由于两个表使用了相同的列名 film_id，因此这里使用了他们别名，以标识是来自哪个表的 film_id

如果不使用别名，您还可以直接使用表名来引用列，如下：

```sql
SELECT
    film_id,
    title
FROM film
WHERE
    NOT EXISTS (
            SELECT 1
            FROM inventory
            WHERE inventory.film_id = film.film_id
        );
```