---
category: IT
tag: 数据库
order: 30
article: false
---

# CTE

PostgreSQL 通用表表达式，简称为 `CTE`，它提供了一种语句级别的临时表的功能，以帮助你构建复杂但清晰的 SQL 语句

## CTE 语法

PostgreSQL 通用表表达式 `CTE` 使用 `WITH` 关键字定义，请使用如下的语法：

```sql
WITH [RECURSIVE] cte_name [(cte_column_list)] AS (
    cte_definition
)
primary_statement;
```

- 通用表表达式以 `WITH` 关键字开始

- `RECURSIVE` 关键字表示此通用表表达式是可递归查询的。它是可选的

- cte_name 是通用表表达式是的名称，相当于临时表的表名

- cte_column_list 是通用表表达式的列名的列表，多个列名使用逗号分隔。它是可选的

- cte_definition 是通用表表达式的辅助语句，它可以是 [SELECT](./select.md)，[INSERT](./insert.md)，[UPDATE](./update.md) 或 [DELETE](./delete.md) 语句

- primary_statement 是主要语句，它会用到上面 WITH 中定义的通用表表达式。它可以是 [SELECT](./select.md)，[INSERT](./insert.md)，[UPDATE](./update.md) 或者 [DELETE](./delete.md)

## CTE 示例

如果您想要确定每部影片的租金是否比它所在评级的平均租金高。您可以使用如下带有 `CTE` 的语句：

```sql
WITH file_rating_avg AS (
  SELECT
    rating,
    avg(rental_rate) avg_rental_rate
  FROM film
  GROUP BY rating
)
SELECT
  f.film_id,
  f.title,
  f.rental_rate,
  a.avg_rental_rate,
  f.rental_rate > avg_rental_rate "Greater?"
FROM
  film f,
  file_rating_avg a
WHERE f.rating = a.rating
LIMIT 10;
```

```text
 film_id |      title       | rental_rate |  avg_rental_rate   | Greater?
---------+------------------+-------------+--------------------+----------
       1 | ACADEMY DINOSAUR |        0.99 | 3.0518556701030928 | f
       2 | ACE GOLDFINGER   |        4.99 | 2.8888764044943820 | t
       3 | ADAPTATION HOLES |        2.99 | 2.9709523809523810 | t
       4 | AFFAIR PREJUDICE |        2.99 | 2.8888764044943820 | t
       5 | AFRICAN EGG      |        2.99 | 2.8888764044943820 | t
...
(5 行记录)
```

首先，我们使用如下语句定义了一个通用表表达式，名称为 file_rating_avg：

```sql
WITH file_rating_avg AS (
  SELECT
    rating,
    avg(rental_rate) avg_rental_rate
  FROM film
  GROUP BY rating
)
```

然后，我们在后面的主语句中使用了 file_rating_avg 作为一个临时表

```sql
SELECT
  f.film_id,
  f.title,
  f.rental_rate,
  a.avg_rental_rate,
  f.rental_rate > avg_rental_rate "Greater?"
FROM
  film f,
  file_rating_avg a
WHERE f.rating = a.rating
LIMIT 10;
```

### 通用表表达式递归查询

PostgreSQL 通用表达式支持递归查询，这很适合应用在一些存储树形数据的方案中，比如产品的分类、系统的导航菜单等

接下来，我们设计一个用于保存产品分类的表，然后使用 PostgreSQL 通用表表达式获取一个指定分类以及该分类下的所有的下级分类

我们要在 testdb 数据库中演示这个示例。请先使用下面的语句创建数据库 testdb：

```sql
CREATE DATABASE testdb;
```

选择 testdb 数据库为当前数据库：

```postgresql
\c testdb;
```

使用下面语句创建产品分类表 category：

```sql
DROP TABLE IF EXISTS category;
CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  parent_id INT,
  CONSTRAINT fk_category
    FOREIGN KEY(parent_id) REFERENCES category(id)
);
```

我们创建了一个 category 表，它有 id, name, parent_id 三个列，并且 parent_id 列存储上级分类的 id。这里我们使用了 [外键约束](../database-and-table/foreign-key.md)

使用下面的语句插入一些包含了产品分类信息的行：

```sql
INSERT INTO category (id, name, parent_id)
VALUES
  (1, 'ROOT', NULL),
  (2, 'Baby', 1),
  (3, 'Home And Kitchen', 1),
  (4, 'Baby Care', 2),
  (5, 'Feeding', 2),
  (6, 'Gifts', 2),
  (7, 'Safety', 2),
  (8, 'Bedding', 3),
  (9, 'Bath', 3),
  (10, 'Furniture', 3),
  (11, 'Grooming', 4),
  (12, 'Hair Care', 4),
  (13, 'Baby Foods', 5),
  (14, 'Food Mills', 5),
  (15, 'Solid Feeding', 5),
  (16, 'Bed Pillows', 8),
  (17, 'Bed Skirts', 8);
```

假设，你想要查询 id 为 2 的分类以及它的所有的下级分类，请使用下面的语句：

```sql
WITH RECURSIVE cte_categories AS (
  SELECT
    id,
    name,
    parent_id
  FROM category
  WHERE id = 2
  UNION
  SELECT
    c.id,
    c.name,
    c.parent_id
  FROM category c, cte_categories cs
  WHERE cs.id = c.parent_id
)
SELECT *
FROM cte_categories;
```

```text
 id |     name      | parent_id
----+---------------+-----------
  2 | Baby          |         1
  4 | Baby Care     |         2
  5 | Feeding       |         2
  6 | Gifts         |         2
  7 | Safety        |         2
 11 | Grooming      |         4
 12 | Hair Care     |         4
 13 | Baby Foods    |         5
 14 | Food Mills    |         5
 15 | Solid Feeding |         5
(10 行记录)
```

我们通过 `WITH RECURSIVE` 定义了一个 CTE cte_categories，它从一个名为“category”的表中选择 ID 为 2 的记录，并将其作为递归查询的起点。该查询使用递归 CTE（公共表表达式）在整个“category”表中查找与起始记录关联的所有记录。查询返回匹配的所有记录的 ID、名称和父级 ID。在递归查询中，`UNION` 运算符连接初始查询和递归查询。初始查询选择 ID 为2的记录，而递归查询通过在每个递归步骤中连接“category”表和递归 `CTE` 来不断扩展结果集，直到没有更多记录可以连接为止