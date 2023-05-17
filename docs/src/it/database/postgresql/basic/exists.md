---
category: IT
tag: 数据库
order: 20
article: false
---

# EXISTS

在 PostgreSQL 中，`EXISTS` 运算符用来判断一个 [子查询](./subquery.md) 是否返回行。如果一个子查询返回了至少一个行，则 `EXISTS` 返回真，否则返回假

## EXISTS 语法

PostgreSQL `EXISTS` 运算符用在 [WHERE](./where.md) 子句中构造判断条件，请使用如下的语法：

```sql
WHERE EXISTS(subquery);
```

- `EXISTS` 一般用在 `WHERE` 子句中

- `EXISTS` 是一个单目操作符，它需要一个子查询 subquery 作为参数

- 如果子查询 subquery 返回了至少一行（不论行中的值是否为 NULL），则 `EXISTS` 的计算结果为 TRUE，否则计算结果为 FALSE

- `EXISTS` 不关心子查询中的列的数量或者名称，它只在乎子查询是否返回行。所以在 `EXISTS` 的子查询中，无论你是使用 `SELECT 1` 还是 `SELECT *`，亦或是 `SELECT column_list`，都不影响 `EXISTS` 运算的结果

- `NOT EXISTS` 则是 `EXISTS` 的否定操作

## EXISTS 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中查找拥有库存记录的影片数量，请使用以下语句：

```sql
SELECT
    film_id,
    title
FROM film f
WHERE
    EXISTS (
        SELECT 1
        FROM inventory i
        WHERE i.film_id = f.film_id
    );
```

```text
 film_id |            title
---------+-----------------------------
       1 | ACADEMY DINOSAUR
       2 | ACE GOLDFINGER
       3 | ADAPTATION HOLES
       4 | AFFAIR PREJUDICE
       5 | AFRICAN EGG
...
(958 行记录)
```

这里，对于影片表中的每一部影片（也就是每一行），子查询检查 inventory 数据表以查找该影片是否有库存记录 (i.film_id = f.film_id)

要从 film 表中查找没有库存记录的影片，请使用以下语句：

```sql
SELECT
    film_id,
    title
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

---

在 Sakila 示例数据库中，customer 表存储了客户的信息，payment 表中存储客户的付款记录。customer 表和 payment 表是一对多的关系，也就是说，一个客户可能存在多个付款记录

要从 customer 表中查询那些至少支付了一次且金额大于 11 的客户，请使用以下语句：

```sql
SELECT
    first_name,
    last_name
FROM customer c
WHERE
    EXISTS (
      SELECT 1
      FROM payment p
      WHERE p.customer_id = c.customer_id AND amount > 11
    )
ORDER BY first_name, last_name;
```

```text
 first_name | last_name
------------+-----------
 ALMA       | AUSTIN
 KAREN      | JACKSON
 KENT       | ARSENAULT
 NICHOLAS   | BARFIELD
 RICHARD    | MCCRARY
...
(10 行记录)
```

当你想要确定一个表是否存在、一个视图是否可用、一个条件是否成立时，你可以使用 `SELECT 1`。它不需要指定表名或列名，也不需要指定 `WHERE` 子句，只需要执行这个简单的查询语句即可