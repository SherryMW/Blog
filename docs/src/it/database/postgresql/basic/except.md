---
category: IT
tag: 数据库
order: 33
article: false
---

# EXCEPT

在 PostgreSQL 中，`EXCEPT` 是一个集合运算符，它用于从一个集合中减去出现在另外一个集合中的行

其他的集合操作运算符还有：[UNION](./union.md) 和 [INTERSECT](./intersect.md)

## EXCEPT 语法

要从一个结果集中减去另一个结果集，请使用如下的语法：

```sql
SELECT_statement_1
EXCEPT
SELECT_statement_2
[ORDER BY ...];
```

或者您可以减去多个结果集，如下：

```text
SELECT_statement_1
EXCEPT
SELECT_statement_2
EXCEPT
SELECT_statement_3
EXCEPT
...
[ORDER BY ...];
```

- SELECT_statement_N 都是个独立 [SELECT](./select.md) 语句

- 参与 `EXCEPT` 运算的所有的结果集应该具有相同的列，并且列的数据类型和顺序应该相同

- [ORDER BY](./order-by.md) 子句用于对最终结果进行排序，它是可选的

## EXCEPT 示例

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

现在，我们对两个结果集进行 `EXCEPT` 运算：

```sql
SELECT generate_series(1, 5)
EXCEPT
SELECT generate_series(3, 6);
```

```text
 generate_series
-----------------
               1
               2
(2 行记录)
```

`EXCEPT` 运算符从第一个结果集中的所有的行中删除同时位于第二个结果集中的行，并返回了第一个结果集中剩下的行

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从影片表 film 中获取评级为 G 的影片，请使用下面的语句：

```sql
SELECT film_id, title, rating, length, rental_rate
FROM film 
WHERE rating = 'G';
```

```text
 film_id |           title           | rating | length | rental_rate
---------+---------------------------+--------+--------+-------------
       2 | ACE GOLDFINGER            | G      |     48 |        4.99
       4 | AFFAIR PREJUDICE          | G      |    117 |        2.99
       5 | AFRICAN EGG               | G      |    130 |        2.99
      11 | ALAMO VIDEOTAPE           | G      |    126 |        0.99
      22 | AMISTAD MIDSUMMER         | G      |     85 |        2.99
...
(178 行记录)
```

如果您想要从影片表 film 中获取评级为 G 的影片，但是不包括那些影片长度大于 55 分钟的影片，请使用如下带有 `EXCEPT` 运算符的语句：

```sql
SELECT film_id, title, rating, length, rental_rate
FROM film WHERE rating = 'G'
EXCEPT
SELECT film_id, title, rating, length, rental_rate
FROM film WHERE length > 55;
```

```text
 film_id |        title        | rating | length | rental_rate
---------+---------------------+--------+--------+-------------
     697 | PRIMARY GLASS       | G      |     53 |        0.99
     237 | DIVORCE SHINING     | G      |     47 |        2.99
     247 | DOWNHILL ENOUGH     | G      |     47 |        0.99
     292 | EXCITEMENT EVE      | G      |     51 |        0.99
     430 | HOOK CHARIOTS       | G      |     49 |        0.99
     402 | HARPER DYING        | G      |     52 |        0.99
     497 | KILL BROTHERHOOD    | G      |     54 |        0.99
       2 | ACE GOLDFINGER      | G      |     48 |        4.99
     794 | SIDE ARK            | G      |     52 |        0.99
     862 | SUMMER SCARFACE     | G      |     53 |        0.99
     542 | LUST LOCK           | G      |     52 |        2.99
      83 | BLUES INSTINCT      | G      |     50 |        2.99
     575 | MIDSUMMER GROUNDHOG | G      |     48 |        4.99
(13 行记录)
```

如果您想要从影片表 film 中获取评级为 G 的影片，但是不包括那些影片长度大于 55 分钟的影片，还不包括那些租金大于 2.99 美元的影片，请使用如下带有 `EXCEPT` 运算符的语句：

```sql
SELECT film_id, title, rating, length, rental_rate
FROM film WHERE rating = 'G'
EXCEPT
SELECT film_id, title, rating, length, rental_rate
FROM film WHERE length > 55
EXCEPT
SELECT film_id, title, rating, length, rental_rate
FROM film WHERE rental_rate >= 2.99;
```

```text
 film_id |      title       | rating | length | rental_rate
---------+------------------+--------+--------+-------------
     697 | PRIMARY GLASS    | G      |     53 |        0.99
     247 | DOWNHILL ENOUGH  | G      |     47 |        0.99
     292 | EXCITEMENT EVE   | G      |     51 |        0.99
     430 | HOOK CHARIOTS    | G      |     49 |        0.99
     402 | HARPER DYING     | G      |     52 |        0.99
     497 | KILL BROTHERHOOD | G      |     54 |        0.99
     794 | SIDE ARK         | G      |     52 |        0.99
     862 | SUMMER SCARFACE  | G      |     53 |        0.99
(8 行记录)
```