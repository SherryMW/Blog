---
category: IT
tag: 数据库
order: 2
article: false
---

# 创建索引

在 PostgreSQL 中，您可以使用 `CREATE INDEX` 向一个表中添加索引

简单类比，索引可以看作是一部字典的目录。通过目录，您可以更快的查找词语。通过索引，您可以更快的从表中检索数据。索引是一种有序的数据结构，需要额外的空间存储

## CREATE INDEX 语法

以下是 PostgreSQL `CREATE INDEX` 语句的简单语法：

```sql
CREATE [ UNIQUE ] INDEX [ [ IF NOT EXISTS ] name ]
    ON table_name [ USING method ]
(
    column_name [ ASC | DESC ] [ NULLS { FIRST | LAST } ]
    [, ...]
);
```

- name：索引的名称。它是可选的。如果您不指定索引名称，PostgreSQL 将会自动生成一个

- table_name：是要为其创建索引的表名

- method：是索引方法的名称。包括 btree, hash, gist, spgist, gin, 和 brin。btree 是默认的方法。您可以查看索引类型以了解更多

- column_name：是要创建索引的列名

- `[ ASC | DESC ]`：指定排序是顺序还是逆序。 它是可选的，`ASC` 是默认值

- `NULLS FIRST` 或 `NULLS LAST`：指定排序时空值在非空值之前或之后。当指定 `DESC` 时, `NULLS FIRST` 是默认的，否则 `NULLS LAST` 是默认的

- [UNIQUE](../database-and-table/unique.md)：指示创建一个唯一索引

- `IF NOT EXISTS`：指示只有指定的索引名称不存在时才创建索引

PostgreSQL 会对 [主键](../database-and-table/primary-key.md) 列自动创建索引

要检查查询是否使用索引，请使用该 [EXPLAIN](../administration/explain.md) 语句

如果您在一个索引中使用了多个列，那么此索引被称为 [多列索引](./multicolumn-index.md) 或复合索引

## CREATE INDEX 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

以下查询查找邮编为 x 的地址：

```sql
SELECT * FROM address
WHERE postal_code = 'x';
```

由于该 postal_code 列没有可用的索引， PostgreSQL 不得不进行全表扫描。进可以通过查看查询计划来验证这一点

要显示执行计划，请使用 [EXPLAIN](../administration/explain.md) 如下语句：

```sql
EXPLAIN
SELECT * FROM address
WHERE postal_code = 'x';
```

```text
                        QUERY PLAN
----------------------------------------------------------
 Seq Scan on address  (cost=0.00..13.54 rows=1 width=161)
   Filter: ((postal_code)::text = 'x'::text)
```

要为 address 表 postal_code 列中的值创建索引，请使用以下语句：

```sql
CREATE INDEX ON address (postal_code);
```

这里没有指定索引名称，PostgreSQL 将会自动生成一个索引名称：address_postal_code_idx。格式为 表名加列名再加 idx 后缀

现在，再次查看执行计划，您会发现数据库引擎使用索引进行查找：

```sql
EXPLAIN
SELECT * FROM address
WHERE postal_code = 'x';
```

```text
                                       QUERY PLAN
-----------------------------------------------------------------------------------------
 Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161)
   Index Cond: ((postal_code)::text = 'x'::text)
```

这里，`using address_postal_code_idx` 说明了 PostgreSQL 使用了索引进行查找