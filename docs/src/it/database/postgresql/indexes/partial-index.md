---
category: IT
tag: 数据库
order: 8
article: false
---

# 部分索引

PostgreSQL 允许您创建部分索引。部分索引由助于减少索引大小，因为它没有为列中的所有数据创建索引，它只为符合条件的行中的数据建立索引

如果您有 [WHERE](../basic/where.md) 使用常量值的常用条件，则部分索引很有用，如下所示：

```sql
SELECT *
FROM table_name
WHERE column_name = constant_value;
```

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

```postgresql
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
    "customer_lower_idx" btree (lower(last_name::text))
    "idx_fk_address_id" btree (address_id)
    "idx_fk_store_id" btree (store_id)
    "idx_last_name" btree (last_name)
```

例如，您通常对不活跃的客户感兴趣，并经常进行一些跟进以让他们回来购买更多东西

以下查询查找所有不活动的客户：

```sql
SELECT *
FROM customer
WHERE active = 0;
```

要执行此查询，查询计划器需要扫描 customer 表，如以下 [EXPLAIN](../administration/explain.md) 语句所示：

```sql
EXPLAIN
SELECT *
FROM customer
WHERE active = 0;
```

```text
                        QUERY PLAN
-----------------------------------------------------------
 Seq Scan on customer  (cost=0.00..15.49 rows=15 width=70)
   Filter: (active = 0)
```

您可以通过为 active 列创建索引来优化此查询， 如下所示：

```sql
CREATE INDEX idx_customer_active
ON customer(active);
```

该索引实现了其目的，但是，它包含许多从未搜索过的行，即所有活跃客户

要定义仅包含非活动客户的索引，请使用以下语句：

```sql
CREATE INDEX idx_customer_inactive
ON customer(active)
WHERE active = 0;
```

该语句定义了一个部分索引 idx_customer_inactive，只有符合 [WHERE](../basic/where.md) 条件 active = 0 中的 active 值才会被索引。相比较为所有 active 值建立的索引 idx_customer_active，此索引的大小会很小

从现在开始，只要该 [WHERE](../basic/where.md) 子句出现在查询中，PostgreSQL 就会考虑部分索引：

```sql
EXPLAIN
SELECT *
FROM customer
WHERE active = 0;
```

```text
                                      QUERY PLAN
---------------------------------------------------------------------------------------
 Index Scan using idx_customer_active on customer  (cost=0.15..11.69 rows=15 width=70)
   Index Cond: (active = 0)
```