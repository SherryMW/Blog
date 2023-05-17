---
category: IT
tag: 数据库
order: 21
article: false
---

# ALL

有时候，您需要将一个值与一个列表中的所有值进行比较，比如：

- 给定一个工资值。您需要确认这个值是否高于所有员工的工资

- 给定一个状态值。您需要确定这个状态值是否不等于所有状态值中的任意一个

PostgreSQL `ALL` 运算符用于将一个值与一个值列表进行比较，如果值列表中的所有值满足了指定的条件，表达式就返回真，否则表达式返回假

## ALL 语法

将一个值与一个 [子查询](./subquery.md) 返回的所有的值进行比较，请使用如下的语法：

```sql
comparison_operator ALL (array)
```

- comparison_operator 是一个比较运算符，例如 `=`、`!=`、`>`、`>=`、`<`、`<=` 等

- array 是一个数组或者 [子查询](./subquery.md)，它跟在 `ALL` 运算符后面。子查询必须用括号括起来

- 如果 array 中的所有值都满足指定的条件，则表达式返回真，否则表达式返回假

    - value = ALL (array): 如果列表中的所有的值等于 value，该表达式返回 true, 否则返回 false

    - value > ALL (array): 如果列表中的所有的值小于 value，该表达式返回 true, 否则返回 false

    - value < ALL (array): 如果列表中的所有的值大于 value，该表达式返回 true, 否则返回 false

    - value <> ALL (array): 如果列表中的所有的值不等于 value，该表达式返回 true, 否则返回 false

## ALL 示例

我们经常需要检查一个数组中的所有元素是否都满足指定的条件，比如：

要检查数组 `[1, 2, 3]` 中的所有元素是否都等于 2，请使用以下语句：

```sql
SELECT 2 = ALL(ARRAY[1, 2, 3]);
```

```text
 ?column?
----------
 f
```

要检查数组 `[1, 2, 3]` 中的所有元素是否都大于等于 1，请使用以下语句：

```sql
SELECT 1 <= ALL(ARRAY[1, 2, 3]);
```

```text
?column?
----------
t
```

要检查数组 `[1, 2, 3]` 中的所有元素是否都不等于 0，请使用以下语句：

```sql
SELECT 0 <> ALL(ARRAY[1, 2, 3]);
```

```text
?column?
----------
t
```

要判断所有影片的租金是否都要低于 99，请使用下面的语句：

```sql
SELECT 99 > ALL (SELECT rental_rate FROM film);
```

```text
 ?column?
----------
 t
```

要判断所有影片的租金是否都要高于 66，请使用下面的语句：

```sql
SELECT 66 < ALL (SELECT rental_rate FROM film);
```

```text
 ?column?
----------
 f
```

要查找大于等于所有的租金的影片的数量，请使用下面的语句：

```sql
SELECT title, rental_rate
FROM film
WHERE rental_rate >= ALL (
    SELECT rental_rate
    FROM film
  );
```

```text
           title           | rental_rate
---------------------------+-------------
 ACE GOLDFINGER            |        4.99
 AIRPLANE SIERRA           |        4.99
 AIRPORT POLLOCK           |        4.99
 ALADDIN CALENDAR          |        4.99
 ALI FOREVER               |        4.99
...
(336 行记录)
```