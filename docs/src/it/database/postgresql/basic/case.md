---
category: IT
tag: 数据库
order: 10
article: false
---

# CASE

PostgreSQL `CASE` 表达式是一个条件表达式，它与其他编程语言中的 `if-else` 或 `switch-case`语句作用相同

您可以在 [SELECT](./select.md) 语句以及 [WHERE](./where.md)，[GROUP BY](./group-by.md)，和 [HAVING](./having.md) 子句中使用 `CASE` 表达式

## CASE 语法

要使用 PostgreSQL `CASE` 表达式，请使用如下的语法：

```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    ELSE default_result
END
```

- condition1, condition2 是一些布尔表达式，返回值为 true 或 false

- 这个表达式可以理解为：如果 condition1 为真返回 result1，如果 condition2 为真返回 result2，否则返回 default_result

- 您可以指定一个或者多个 WHEN ... THEN 判断

- ELSE 部分是可以省略的，您只能指定一个 ELSE 语句

- 所有的判断从上向下依次判断，直到遇到条件为真，并返回此条件对应的值。如果没有条件为真，则返回 ELSE 指定的值。如果没有指定 ELSE，则返回 NULL

如果所有的条件都是针对同一个字段或者表达式进行等值判断，则可以将 `CASE` 表达式简写为如下形式：

```sql
CASE column_name
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ELSE result3
END
```

在这种情况下，`CASE` 表达式将根据列的值返回不同的结果。当列的值等于 value1 时，将返回 result1，当值等于 value2 时，将返回 result2，以此类推。此语法省略了 `WHEN` 子句中的条件部分，因为它只考虑与特定值匹配的情况

## CASE 示例

比如，您想要获取当前日期是星期几的名称：

```sql
SELECT
  current_date AS "Today",
  CASE
    WHEN extract(DOW FROM current_date) = 1 THEN 'Monday'
    WHEN extract(DOW FROM current_date) = 2 THEN 'Tuesday'
    WHEN extract(DOW FROM current_date) = 3 THEN 'Wednesday'
    WHEN extract(DOW FROM current_date) = 4 THEN 'Thursday'
    WHEN extract(DOW FROM current_date) = 5 THEN 'Friday'
    WHEN extract(DOW FROM current_date) = 6 THEN 'Saturday'
    ELSE 'Sunday'
  END "Day of Week";
```

```text
   Today    | Day of Week
------------+-------------
 2023-04-25 | Tuesday
```

这里，我们使用 `current_date` 获得当前的日期，并使用 `extract()` 函数获取当前日期的工作日编号

由于上面的 `CASE` 表达式中的条件都是等值判断，因此我们可以将 CASE 表达式简化为：

```sql
SELECT
  current_date AS "Today",
  CASE extract(DOW FROM current_date)
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
    ELSE 'Sunday'
  END "Day of Week";
```

```text
   Today    | Day of Week
------------+-------------
 2023-04-25 | Tuesday
```

---

有时候单纯的按照字段的值排序并不能满足要求，我们需要按照自定义的顺序的排序。比如，我们需要按照电影分级 'G', 'PG', 'PG-13', 'R', 'NC-17' 的顺序对影片进行排序。对于这样的需求，它可以理解为按照列表中元素的索引位置进行排序。我们使用 `CASE` 子句函数实现它

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

假设您要根据影片的分级按照的 'G', 'PG', 'PG-13', 'R', 'NC-17' 顺序对影片进行排序。下面使用 `CASE` 表达式实现自定义排序：

```sql
SELECT
    film_id, title, rating
FROM
    film
ORDER BY CASE rating
    WHEN 'G' THEN 1
    WHEN 'PG' THEN 2
    WHEN 'PG-13' THEN 3
    WHEN 'R' THEN 4
    WHEN 'NC-17' THEN 5
END;
```

```text
     357 | GILBERT PELICAN             | G
     597 | MOONWALKER FOOL             | G
     354 | GHOST GROUNDHOG             | G
...
     595 | MOON BUNCH                  | PG
       6 | AGENT TRUMAN                | PG
     600 | MOTIONS DETAILS             | PG
...
       9 | ALABAMA DEVIL               | PG-13
     657 | PARADISE SABRINA            | PG-13
     956 | WANDA CHAMBER               | PG-13
...
     749 | RULES HUMAN                 | R
       8 | AIRPORT POLLOCK             | R
      17 | ALONE TRIP                  | R
...
     520 | LICENSE WEEKEND             | NC-17
     517 | LESSON CLEOPATRA            | NC-17
     114 | CAMELOT VACATION            | NC-17
...
(1000 rows)
```

在这个例子中，我们使用 `CASE` 子句将电影的分级转换为一个数字。然后使用 `ORDER BY` 按照数字 1-5 从低到高进行排序