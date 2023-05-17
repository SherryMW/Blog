---
category: IT
tag: 数据库
order: 31
article: false
---

# UNION

在 PostgreSQL 中，`UNION` 是一个集合运算符，它返回两个集合的并集，它用于合并两个结果集

其他的集合操作运算符还有：[EXCEPT](./except.md) 和 [INTERSECT](./intersect.md)

## UNION 语法

要合并两个结果集，请使用如下的语法：

```sql
SELECT_statement_1
UNION [ALL]
SELECT_statement_2
[ORDER BY ...];
```

或者您可以同时合并多个结果集，如下：

```sql
SELECT_statement_1
UNION [ALL]
SELECT_statement_2
UNION [ALL]
SELECT_statement_3
UNION [ALL]
...
[ORDER BY ...];
```

- SELECT_statement_N 都是个独立 [SELECT](./select.md) 语句

- 参与 `UNION` 运算的所有的结果集应该具有相同的列，并且列的数据类型和顺序应该相同

- `UNION` 与 `UNION ALL` 具有不同的逻辑：

    - `UNION` 合并两个结果集，并删除重复的行

    - `UNION ALL` 合并两个结果，保留所有的行

- [ORDER BY](./order-by.md) 子句用于对最终结果进行排序，它是可选的

## UNION 示例

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

现在，我们对两个结果集进行 `UNION` 运算：

```sql
SELECT generate_series(1, 5)
UNION
SELECT generate_series(3, 6)
ORDER BY generate_series;
```

```text
 generate_series
-----------------
               1
               2
               3
               4
               5
               6
(6 行记录)
```

从结果看出，`UNION` 运算符合并了第一个结果集和第二个结果集后删除了其中的重复的行，并返回了合并后的所有行

如果你不想要删除重复的行，请使用 `UNION ALL` 运算符，如下：

```sql
SELECT generate_series(1, 5)
UNION ALL
SELECT generate_series(3, 6)
ORDER BY generate_series;
```

```text
 generate_series
-----------------
               1
               2
               3
               3
               4
               4
               5
               5
               6
(9 行记录)
```