---
category: IT
tag: 数据库
order: 7
article: false
---

# 表达式索引

除了在列上创建索引，PostgreSQL 允许您在基于表中的一列或者多列的表达上是创建索引，这称为表达式索引

请注意，表达式上的索引维护起来非常昂贵，因为 PostgreSQL 必须在插入或更新每一行时评估每一行的表达式，并将结果用于索引。因此，只有当检索速度比插入和更新速度更重要时，您才应该在表达式上使用索引

## 表达式索引语法

要创建表达式索引，请遵循如下语法：

```sql
CREATE INDEX index_name
ON table_name ( (expression) );
```

- 创建表达式索引和创建普通索引的语法基本相同，只是由表达式代替了列名

- 表达式一般通过圆括号包含起来。如果表达式只是一个函数调用，则可以省率圆括号

- index_name 为索引名称。您可以省率索引名称，并且 PostgreSQL 会自动生成一个

一旦定义了索引表达式，当定义索引的表达式出现在 [WHERE](../basic/where.md) 子句或 [ORDER BY](../basic/order-by.md) SQL 语句的子句中时，PostgreSQL 将考虑使用该索引

## 表达式索引示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

下面是 customer 表的部分定义：

```text
                                             Table "public.customer"
   Column    |            Type             | Collation | Nullable |                    Default
-------------+-----------------------------+-----------+----------+-----------------------------------------------
 customer_id | integer                     |           | not null | nextval('customer_customer_id_seq'::regclass)
 store_id    | smallint                    |           | not null |
 first_name  | character varying(45)       |           | not null |
 last_name   | character varying(45)       |           | not null |
 email       | character varying(50)       |           |          |
 address_id  | smallint                    |           | not null |
 activebool  | boolean                     |           | not null | true
 create_date | date                        |           | not null | 'now'::text::date
 last_update | timestamp without time zone |           |          | now()
 active      | integer                     |           |          |
Indexes:
    "customer_pkey" PRIMARY KEY, btree (customer_id)
    "idx_fk_address_id" btree (address_id)
    "idx_fk_store_id" btree (store_id)
    "idx_last_name" btree (last_name)

...
```

customer 表中有一个为 last_name 列定义的 B 树索引 idx_last_name。以下 [EXPLAIN](../administration/explain.md) 语句展示查询查找姓氏为 Adam 的客户时，PostgreSQL 使用 idx_last_name 索引：

```sql
EXPLAIN
SELECT * FROM customer
WHERE last_name = 'Adam';
```

```text
                                  QUERY PLAN
-------------------------------------------------------------------------------
 Index Scan using idx_last_name on customer  (cost=0.28..8.29 rows=1 width=70)
   Index Cond: ((last_name)::text = 'Adam'::text)
```

但是，当查找姓氏为 adam 小写的客户时，PostgreSQL 无法利用索引进行查找：

```sql
EXPLAIN
SELECT * FROM customer
WHERE LOWER(last_name) = 'adam';
```

```text
                        QUERY PLAN
----------------------------------------------------------
 Seq Scan on customer  (cost=0.00..16.98 rows=3 width=70)
   Filter: (lower((last_name)::text) = 'adam'::text)
```

为了提高 `LOWER()` 函数的查询效率，你可以定义一个这样的索引表达式：

```sql
CREATE INDEX ON customer(LOWER(last_name));
```

现在，再次查看上面语句执行计划，

```sql
EXPLAIN
SELECT * FROM customer
WHERE LOWER(last_name) = 'adam';
```

```text
                                   QUERY PLAN
---------------------------------------------------------------------------------
 Bitmap Heap Scan on customer  (cost=4.30..10.83 rows=3 width=70)
   Recheck Cond: (lower((last_name)::text) = 'adam'::text)
   ->  Bitmap Index Scan on customer_lower_idx  (cost=0.00..4.30 rows=3 width=0)
         Index Cond: (lower((last_name)::text) = 'adam'::text)
```

您会发现， PostgreSQL 优化器使用了索引