---
category: IT
tag: 数据库
order: 32
article: false
---

# INTERSECT

在 PostgreSQL 中，`INTERSECT` 是一个集合运算符，它返回两个集合的交集。它返回那些同时位于两个结果集中的行

其他的集合操作运算符还有：[UNION](./union.md) 和 [EXCEPT](./except.md)

## INTERSECT 语法

要计算两个结果集的交集，请使用如下的语法：

```sql
SELECT_statement_1
INTERSECT
SELECT_statement_2
[ORDER BY ...];
```

或者您可以同时计算多个结果集的交集，如下：

```sql
SELECT_statement_1
INTERSECT
SELECT_statement_2
INTERSECT
SELECT_statement_3
INTERSECT
...
[ORDER BY ...];
```

- SELECT_statement_N 都是个独立 [SELECT](./select.md) 语句

- 参与 `INTERSECT` 运算的所有的结果集应该具有相同地列，并且列的数据类型和顺序应该相同

- [ORDER BY](./order-by.md) 子句用于对最终结果进行排序，它是可选的

## INTERSECT 示例

在本示例中，我们将使用 `generate_series()` 函数用来生成结果集

我们需要用到两个结果集，先看第一个结果集：

```sql
SELECT generate_series(1, 5);
```

```text
 generate_series
-----------------
               1
               2
               3
               4
               5
(5 行记录)
```

再看一下第二个结果集：

```sql
SELECT generate_series(3, 6);
```

```text
 generate_series
-----------------
               3
               4
               5
               6
(4 行记录)
```

现在，我们对两个结果集进行 `INTERSECT` 运算：

```sql
SELECT generate_series(1, 5)
INTERSECT
SELECT generate_series(3, 6)
ORDER BY generate_series;
```

```text
 generate_series
-----------------
               3
               4
               5
(3 行记录)
```

从结果看出，`INTERSECT` 运算符返回了第一个集合和第二个集合的共有的行