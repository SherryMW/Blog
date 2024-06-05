---
category: IT
tag: 数据库
order: 5
article: false
---

# 多列索引

顾名思义，多列索引是在表的多个列上定义的索引。多列索引，又称为复合索引或组合索引

在 PostgreSQL 中，只有 `B-tree`、`GIST`、`GIN` 和 `BRIN` 索引类型支持多列索引。一个多列索引最多支持 32 个列

## 多列索引规则

定义多列索引时，应将 [WHERE](../basic/where.md) 子句中常用的列放在列列表的开头，将不常用的列放在后面的条件中。否则，PostgreSQL 优化器可能不会使用索引

例如，以下语句在 a, b 和 c 列上定义上了索引：

```sql
CREATE INDEX index_name
ON table_name(a, b, c);
```

上述语法中，PostgreSQL 优化器在以下情况下会考虑使用索引：

```sql
WHERE a = v1 and b = v2 and c = v3;
```

或者

```sql
WHERE a = v1 and b = v2;
```

或者

```sql
WHERE a = v1;
```

但是，在以下情况下不会考虑使用索引：

```sql
WHERE  c = v3;
```

或者

```sql
WHERE b = v2 and c = v3;
```

## 多列索引示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

通过下面的语句查看 customer 表的信息：

```shell
\d customer
```

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

在 customer 表中已经存在两个索引，为了演示多列索引，我们先删掉 idx_last_name 索引：

```sql
DROP INDEX idx_last_name;
```

使用下面的语句在 last_name 和 first_name 列上创建索引：

```sql
CREATE INDEX ON customer (last_name, first_name);
```

再次通过下面的语句查看 customer 表的信息：

```shell
\d customer
```

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
    "customer_last_name_first_name_idx" btree (last_name, first_name)
    "idx_fk_address_id" btree (address_id)
    "idx_fk_store_id" btree (store_id)
```

我们发现在 在 last_name 和 first_name 列上定义了 customer_last_name_first_name_idx 索引

通过 [EXPLAIN](../administration/explain.md) 语句查看以下语句是否使用了索引：

```sql
EXPLAIN
SELECT * FROM customer
WHERE last_name = 'A';
```

```text
                                            QUERY PLAN
---------------------------------------------------------------------------------------------------
 Index Scan using customer_last_name_first_name_idx on customer  (cost=0.28..8.29 rows=1 width=70)
   Index Cond: ((last_name)::text = 'A'::text)
```

这里，当 [SELECT](../basic/select.md) 语句的 [WHERE](../basic/where.md) 条件中只有 last_name 时，PostgreSQL 优化器选择使用索引。这是因为 last_name 列是索引中的第一列

通过 [EXPLAIN](../administration/explain.md) 语句查看以下语句是否使用了索引：

```sql
EXPLAIN
SELECT * FROM customer
WHERE first_name = 'B';
```

```text
                        QUERY PLAN
----------------------------------------------------------
 Seq Scan on customer  (cost=0.00..15.49 rows=1 width=70)
   Filter: ((first_name)::text = 'B'::text)
```

这里，当 [SELECT](../basic/select.md) 语句的 [WHERE](../basic/where.md) 条件中只有 first_name 时，PostgreSQL 优化器选择不使用索引。这是因为 first_name 列不是索引的第一列