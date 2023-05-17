---
category: IT
tag: 数据库
order: 6
article: false
---

# UPDATE ... FROM

有时候，你需要根据另一个表中的数据更新一个表中的数据。比如：根据产品销量明细表更新销量统计表

在 PostgreSQL，您可以使用 [子查询](./subquery.md) 做到一点，也可以更加方便地使用 `UPDATE...FROM` 语句完成它

## UPDATE…FROM 语法

要使用 PostgreSQL `UPDATE...FROM` 语句根据另一个表中的数据更新一个表中的数据，请使用如下的语法：

```sql
UPDATE [IGNORE] table_name
SET
    column_name1 = value1,
    column_name2 = value2,
    ...
FROM another_table[, ...]
WHERE clause
[RETURNING expr];
```

- 和普通的 [UPDATE](./update.md) 语句相比，此语句多了 `FROM` 子句，并且 `WHERE` 子句是必须的

- 您需要在 `WHERE` 子句中指定两个表连接的条件

```sql
UPDATE a
SET a.c1 = b.c2
FROM b
WHERE a.b_id = b.id;
```

对于 a 表的每一行，该 `UPDATE` 语句都检查 b 表的每一行。如果值 a 表的 b_id 列的值等于在 b 表的 id 列，该 `UPDATE` 语句将更新 b 的表 c2 列的值到 a 表的 c1 列

## UPDATE…FROM 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

假设现在有一个需求，需要更新 city 表中的城市名称，在其后添加 @ 和国家名，请运行以下语句：

```sql
UPDATE city a
SET city = city || '@' || b.country
FROM country b
WHERE a.country_id = b.country_id
RETURNING city_id, city;
```

```text
 city_id |                       city
---------+--------------------------------------------------
       1 | A Corua (La Corua)@Spain
       2 | Abha@Saudi Arabia
       3 | Abu Dhabi@United Arab Emirates
       4 | Acua@Mexico
       5 | Adana@Turkey
       6 | Addis Abeba@Ethiopia
       7 | Aden@Yemen
       8 | Adoni@India
       9 | Ahmadnagar@India
      10 | Akishima@Japan
      ...
(600 行记录)
```

这里，我们在 `UPDATE` 语句中使用 `FROM country b` 子句从 country 表中获取满足条件 `a.country_id = b.country_id` 的行，并将该行中的 country 列的值应用到表达式 `city || '@' || b.country` 中

您也可以使用 [子查询](./subquery.md) 实现上面的需求，如下：

```sql
UPDATE city a
SET city = (
  SELECT a.city || '@' || b.country
  FROM country b
  WHERE a.country_id = b.country_id
)
RETURNING city_id, city;
```