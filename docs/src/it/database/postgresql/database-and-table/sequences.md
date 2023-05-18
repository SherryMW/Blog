---
category: IT
tag: 数据库
order: 18
article: false
---

# 序列生成器

PostgreSQL `SEQUENCE` 用于生成一个有序的数字序列。它被称为序列、序列对象或者序列生成器

您可以使用 `CREATE SEQUENCE` 语句创建一个序列，使用 `DROP SEQUENCE` 删除一个序列

[SERIAL](./serial.md) 列和 [标识列](./identity.md) 在内部都使用了序列

## CREATE SEQUENCE 语法

要在 PostgreSQL 中创建一个序列，请按照如下语法使用 `CREATE SEQUENCE` 语句：

```sql
CREATE [ TEMPORARY | TEMP ] SEQUENCE [ IF NOT EXISTS ] seq_name
    [ AS data_type ]
    [ INCREMENT [ BY ] increment ]
    [ MINVALUE minvalue | NO MINVALUE ]
    [ MAXVALUE maxvalue | NO MAXVALUE ]
    [ START [ WITH ] start ]
    [ CACHE cache ]
    [ [ NO ] CYCLE ]
    [ OWNED BY { table_name.column_name | NONE } ]
```

- `TEMPORARY | TEMP`：指定当前序列是一个临时序列。您只能在当前会话中使用。它会在会话结束时被自动删除。 它是可选的

- `IF NOT EXISTS`：如果指定，如果存在同名的序列，则不会引发错误

- seq_name：要创建的序列的名称

- data_type：它指示了这个序列的数据类型。可用值：smallint，integer 和 bigint，并且 bigint 是默认值

- `INCREMENT [ BY ] increment`：序列增长的步幅，可以是整数或者负数。正值将产生一个升序序列，负值将产生一个降序序列。默认是值 1

- `MINVALUE minvalue | NO MINVALUE：minvalue`：是序列的最小值。`NO MINVALUE` 意味着使用数据类型的最小值。升序序列的默认值是 1, 降序序列的默认值是数据类型的最小值

- `MAXVALUE maxvalue | NO MAXVALUE：maxvalue`：是序列的最大值。`NO MAXVALUE` 意味着使用数据类型的最大值。降序序列的默认值是 1, 升序序列的默认值是数据类型的最大值

- `START [ WITH ] start：start`：是此序列的起始值。升序序列的默认值是 minvalue，降序序列的默认值是 maxvalue

- `CACHE cache`：cache 是缓存在内存中的序列值的数量，以便可以快速访问。默认值是 1，1 也是可接受的最小值

- `[ NO ] CYCLE`：指示序列是否可循环的。 如果指定 `NO CYCLE`，那么序列到结尾的时候，再取值则会发生错误

- `OWNED BY { table_name.column_name | NONE }`：将此序列与指定表的列关联起来。如果此列被删除，此序列会被自动删除将此序列与指定表的列关联起来。如果此列被删除，此序列会被自动删除

## DROP SEQUENCE 语法

要在 PostgreSQL 中删除一个或者多个序列，请按照如下语法使用 `DROP SEQUENCE` 语句：

```sql
DROP SEQUENCE [ IF EXISTS ] seq_name [, ...]
[ CASCADE | RESTRICT ];
```

- `IF EXISTS`：如果指定的序列不存在不会抛出一个错误

- seq_name：要删除的序列的名称

- `CASCADE`：自动删除依赖于此序列的对象，并依次删除依赖这些对象的对象

- `RESTRICT`：如果任何对象依赖此序列，则拒绝删除它。这是默认值

## 访问序列

您可以使用以下三个函数操作 PostgreSQL 序列：

- `nextval()`：获取并返回序列的下一个值

- `currval()`：返回当前会话中指定序列的当前值

- `setval()`：重置指定序列的当前值

您可以使用以下语句查看指定的序列：

```sql
SELECT * FROM seq_name;
```

## 序列示例

创建一个从 10 开始步长为 10 的升序序列：

```sql
CREATE SEQUENCE asc_seq
INCREMENT 10
START 10;
```

使用以下 `nextval()` 函数从序列中获取下一个值：

```sql
SELECT nextval('asc_seq');
```

```text
 nextval
---------
      10
```

再次使用以下 `nextval()` 函数从序列中获取下一个值：

```sql
SELECT nextval('asc_seq');
```

```text
 nextval
---------
      20
```

使用 `currval()` 函数获取序列的当前的值：

```sql
SELECT currval('asc_seq');
```

```text
 currval
---------
      20
```

使用 `setval()` 函数设置序列的当前值：

```sql
SELECT setval('asc_seq', 50);
```

```text
 setval
--------
     50
```

再次使用以下 `nextval()` 函数从序列中获取下一个值：

```sql
SELECT nextval('asc_seq');
```

```text
 nextval
---------
      60
```

要查看此序列，请使用以下 `SELECT` 语句：

```sql
SELECT * FROM asc_seq;
```

```text
 last_value | log_cnt | is_called
------------+---------+-----------
         60 |      32 | t
```