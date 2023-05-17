---
category: IT
tag: 数据库
order: 17
article: false
---

# BETWEEN

`BETWEEN` 运算符用于检查一个值是否位于一个值区间之内，如果这个值介于指定的区间，`BETWEEN` 运算符返回真，否则返回假

## BETWEEN 语法

要检查一个值是否位于一个值区间之内，请使用如下的语法：

```sql
expr BETWEEN low_value AND high_value;
```

- expr 是一个表达式或者列名

- low_value 是值区间的开始， high_value 是值区间的结束

- 如果 expr 的值大于或等于 low_value 值并且小于或等于 high_value 值，`BETWEEN` 运算符返回真，否则返回假

---

`BETWEEN` 运算符相当于以下使用了 大于等于 (>=) 和 小于等于 (<=) 运算符的语句：

```sql
expr >= low_value AND expr <= high_value
```

假如在一个应用系统中，您需要判断根据用户的年收入为用户划定等级。比如要检查用户的年收入是否位于 40100 元和 120400 元之间，您可以使用以下语句：

```sql
annual_income >= 40100 AND annual_income <= 120400
```

这种情况下，您可以使用 `BETWEEN` 运算符改写上面的语句，如下：

```sql
annual_income BETWEEN 40100 AND 120400
```

---

通常情况下，您在 [WHERE](./where.md) 子句中使用 `BETWEEN` 运算符，如下所示：

```sql
SELECT * FROM table_name
WHERE expr BETWEEN low_value AND high_value
```

您可以使用结合 `NOT` 运算符和 `BETWEEN` 运算符以检查一个值是否不在一个指定的值区间之内：

```sql
expr NOT BETWEEN low_value AND high_value;
```

这相当于以下使用了 大于 (>) 和 小于 (<) 运算符的语句：

```sql
expr < low_value OR expr > high_value
```

## BETWEEN 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

要从 film 表中检索影片时长在在 95 到 98 分钟之间的影片，请使用以下语句：

```sql
SELECT
    title, length
FROM
    film
WHERE
    length BETWEEN 95 AND 98;
```

```text
        title        | length
---------------------+--------
 BOUND CHEAPER       |     98
 CLUELESS BUCKET     |     95
 DRUMS DYNAMITE      |     96
 EARLY HOME          |     96
 EARRING INSTINCT    |     98
...
(16 行记录)
```

要从 film 表中检索租金在 3 到 5 美元之间的影片的数量，请使用以下语句：

```sql
SELECT
    count(*)
FROM
    film
WHERE
    rental_rate BETWEEN 3 AND 5;
```

```text
 count
-------
   336
```

要从 film 表中检索租金不在 3 到 5 美元之间的影片的数量，请使用以下语句：

```sql
SELECT
    count(*)
FROM
    film
WHERE
    rental_rate NOT BETWEEN 3 AND 5;
```

```text
 count
-------
   664
```

要从 payment 表中检索金额在 5 到 5.98 之间的付款记录，请使用以下语句：

```sql
SELECT
    customer_id,
    amount,
    payment_date
FROM
    payment
WHERE
    amount BETWEEN 5 AND 5.98;
```

```text
 customer_id | amount |    payment_date
-------------+--------+---------------------
          42 |   5.98 | 2006-02-14 15:16:03
         208 |   5.98 | 2006-02-14 15:16:03
         216 |   5.98 | 2006-02-14 15:16:03
         284 |   5.98 | 2006-02-14 15:16:03
         516 |   5.98 | 2006-02-14 15:16:03
...
(7 行记录)
```

要从 payment 表中检索付款日期介于在 2005-05-24 到 2005-05-25 之间的付款，请使用以下语句：

```sql
SELECT
    customer_id,
    amount,
    payment_date
FROM
    payment
WHERE
    payment_date BETWEEN '2005-05-24' AND '2005-05-25';
```

```text
 customer_id | amount |    payment_date
-------------+--------+---------------------
         130 |   2.99 | 2005-05-24 22:53:30
         222 |   6.99 | 2005-05-24 23:05:21
         239 |   4.99 | 2005-05-24 23:31:46
         269 |   1.99 | 2005-05-24 23:11:53
         333 |   4.99 | 2005-05-24 23:04:41
...
(8 行记录)
```