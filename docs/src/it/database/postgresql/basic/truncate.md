---
category: IT
tag: 数据库
order: 4
article: false
---

# TRUNCATE

当我们需要清空一个表中的所有行时，除了使用 `DELETE * FROM table` 还可以使用 `TRUNCATE TABLE` 语句

`TRUNCATE` 语句和不带任何条件的 [DELETE](./delete.md) 语句的效果相同。但是 `TRUNCATE` 速度更快，因为它不扫描表。并且，`TRUNCATE` 会立即回收磁盘空间。`TRUNCATE` 在清空大表时很有用

## TRUNCATE 语法

要清空一个或者多个表中的所有的行，请使用如下的语法：

```sql
TRUNCATE [TABLE] [ONLY] table_name [ * ] [, ... ]
    [RESTART IDENTITY | CONTINUE IDENTITY] [ CASCADE | RESTRICT ]
```

- `TABLE`：可选关键字，可以省略

- `ONLY`：可选关键字，指定只清空指定表，而不包括其子表

- table_name：要清空的表名

- `*` ：可选参数，用于清空所有的表

- `RESTART IDENTITY`：可选参数，指定在清空表时是否重新设置序列的初始值，重置为序列的起始值。如果不指定此参数，则序列将保持原有的值

- `CONTINUE IDENTITY`：可选参数，指定在清空表时序列的当前值不变，不重新设置序列的初始值

- `CASCADE`：可选参数，指定如果该表被其他表引用，则一起清空这些引用表

- `RESTRICT`：可选参数，指定如果该表被其他表引用，则不执行 `TRUNCATE` 操作

需要注意的是，`TRUNCATE TABLE` 操作会立即清空表中的所有数据，并且不可恢复，所以一定要谨慎使用。另外，在 PostgreSQL 中 `TRUNCATE TABLE` 操作是以一种不同于 `DELETE` 操作的方式执行的，它不会触发 `TRIGGER`，且速度更快

## TRUNCATE 示例

我们通过以下实例比较 `TRUNCATE` 和 `DELETE` 在清空一个表的效率

首先，我们使用下面的语句创建一个 test_truncate 表用于测试：

```sql
CREATE TABLE test_truncate (
  v INTEGER
);
```

然后，使用如下的 SQL 语句往 test_truncate 表中插入1000万条记录，数据是从1递增到10000000。使用 `generate_series()` 函数生成了一个序列，它可以生成一个指定区间内的整数序列，其中第一个参数指定序列的起始值，第二个参数指定序列的结束值。在这个例子中，序列从 1 开始到 10000000 结束，每次增加1。然后使用 `INSERT INTO` 语句将这些整数插入到 test_truncate 表的 v 列中

```sql
INSERT INTO test_truncate (v)
SELECT generate_series(1, 10000000) v;
```

为了观察查询语句消耗的时间，请先使用下面的命令打开计时：

```shell
\timing
```

通过以下 `DELETE` 语句删除表中的所有行:

```sql
DELETE FROM test_truncate;
```

```text
DELETE 10000000
Time: 6566.458 ms (00:06.566)
```

上面是 `DELETE` 语句的返回结果。它显示了从表中删除 10000000 行，总共耗费 6566.458 毫秒

再使用上面的 `INSERT` 语句重新插入 1000 万行后，通过以下 `TRUNCATE TABLE` 语句清空表：

```sql
TRUNCATE TABLE test_truncate;
```

```text
TRUNCATE TABLE
Time: 31.785 ms
```

上面是 `TRUNCATE TABLE` 语句的返回结果。它显示了清空此表共耗费 31.785 毫秒。所以 `TRUNCATE` 比 `DELETE` 快的多

具体来说，`TRUNCATE` 是通过重置表的存储空间来实现的。当 `TRUNCATE` 一张表时，它会删除所有的数据，但是保留表结构不变，并且将对应的表空间归还给文件系统，因此 `TRUNCATE` 操作非常快。`DELETE` 操作则需要逐行扫描表，对于每一行数据进行删除，因此当数据量较大时，`DELETE` 操作的速度就会比 `TRUNCATE` 操作慢很多。同时，`TRUNCATE` 操作还具有自动重置序列的功能，因此在执行 `TRUNCATE` 操作之后，可以将自增列的计数器重置为初始值