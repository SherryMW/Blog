---
category: IT
tag: 数据库
order: 4
article: false
---

# 查看索引

在 PostgreSQL 中，您有两种方法查看表的索引：

1. 在 psql 工具中使用 `\d` 命令查看表的索引

2. 在 pg_indexes 视图中检索索引信息

## 使用 psql 命令列出 PostgreSQL 索引

如果你使用 psql 工具管理 PostgreSQL 数据库，您可以使用 `\d` psql 命令 查看指定表中的索引：

```shell
\d table_name
```

这个 `\d` 命令将返回表的所有信息，包括表的结构、索引、约束和触发器

例如，以下语句返回 Sakila 示例数据库中的 customer 表的详细信息：

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
Foreign-key constraints:
    "customer_address_id_fkey" FOREIGN KEY (address_id) REFERENCES address(address_id) ON UPDATE CASCADE ON DELETE RESTRICT
    "customer_store_id_fkey" FOREIGN KEY (store_id) REFERENCES store(store_id) ON UPDATE CASCADE ON DELETE RESTRICT
Referenced by:
    TABLE "payment" CONSTRAINT "payment_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT
    TABLE "payment_p2007_01" CONSTRAINT "payment_p2007_01_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "payment_p2007_02" CONSTRAINT "payment_p2007_02_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "payment_p2007_03" CONSTRAINT "payment_p2007_03_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "payment_p2007_04" CONSTRAINT "payment_p2007_04_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "payment_p2007_05" CONSTRAINT "payment_p2007_05_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "payment_p2007_06" CONSTRAINT "payment_p2007_06_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
    TABLE "rental" CONSTRAINT "rental_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT
Triggers:
    last_updated BEFORE UPDATE ON customer FOR EACH ROW EXECUTE FUNCTION last_updated()
```

其中， Indexes 部分就是表中的所有的索引

## 使用 pg_indexes 视图列出 PostgreSQL 索引

PostgreSQL 内置的 pg_indexes 视图允许您访问有关 PostgreSQL 数据库中每个索引的有用信息。该 pg_indexes 视图由五列组成：

- schemaname：存储包含表和索引的模式的名称

- tablename：存放索引所属表的名称

- indexname：存储索引的名称

- tablespace：存储包含索引的表空间的名称

- indexdef：以 `CREATE INDEX` 语句的形式存储索引定义命令

例如，要列出 customer 表的所有索引，请使用以下语句：

```sql
SELECT
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename = 'customer';
```

```text
     indexname     |                                    indexdef
-------------------+--------------------------------------------------------------------------------
 customer_pkey     | CREATE UNIQUE INDEX customer_pkey ON public.customer USING btree (customer_id)
 idx_fk_address_id | CREATE INDEX idx_fk_address_id ON public.customer USING btree (address_id)
 idx_fk_store_id   | CREATE INDEX idx_fk_store_id ON public.customer USING btree (store_id)
 idx_last_name     | CREATE INDEX idx_last_name ON public.customer USING btree (last_name)
(4 行记录)
```

如果您想获取 PostgreSQL 数据库中的所有的索引，您可以不使用 [WHERE](../basic/where.md) 子句