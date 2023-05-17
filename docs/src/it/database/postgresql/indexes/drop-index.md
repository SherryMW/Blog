---
category: IT
tag: 数据库
order: 3
article: false
---

# 删除索引

在 PostgreSQL 中，您可以使用 `DROP INDEX` 从一个表中删除现有的索引

## DROP INDEX 语法

有时，您可能希望从数据库系统中删除现有索引。为此，您可以使用以下 `DROP INDEX` 语句：

```sql
DROP INDEX  [ CONCURRENTLY ]
[ IF EXISTS ]  name
[ CASCADE | RESTRICT ];
```

- name 是要删除的索引的名称

- `IF EXISTS` 指示如果指定的索引不存在将不会给出错误，PostgreSQL 将会发出一个通知

- `CASCADE` 指示 PostgreSQL 自动删除那些依赖于此索引的对象

- `RESTRICT` 指示如果有其他对象依赖于此索引，则拒绝删除。这是默认的行为

- 删除索引时，PostgreSQL 默认会获取该表的排他锁并阻止任何其他的访问，知道索引删除完成。您可以使用 `CONCURRENTLY` 选项改变这一行为

注意，当使用 `CASCADE` 选项时，不支持 `CONCURRENTLY`

一个简单的删除索引的语句如下：

```sql
DROP INDEX name;
```

您可以使用一个语句同时删除多个索引，如下：

```sql
DROP INDEX name1, name2,... ;
```

## DROP INDEX 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

以下语句为 actor 表的 first_name 列创建索引：

```sql
CREATE INDEX idx_actor_first_name
ON actor (first_name);
```

有时，查询优化器不使用索引。例如，以下语句查找名为 John 的 actor：

```sql
SELECT * FROM actor
WHERE first_name = 'John';
```

该查询未使用 idx_actor_first_name 之前定义的索引，如以下 [EXPLAIN](../administration/explain.md) 语句中所述：

```sql
EXPLAIN
SELECT * FROM actor
WHERE first_name = 'John';
```

```text
                      QUERY PLAN
------------------------------------------------------
 Seq Scan on actor  (cost=0.00..4.50 rows=1 width=25)
   Filter: ((first_name)::text = 'John'::text)
```

这是因为查询优化器认为只扫描整个表来定位行更为优化。因此，在这种情况下没有用 idx_actor_first_name，我们需要删除它：

```sql
DROP INDEX idx_actor_first_name;
```