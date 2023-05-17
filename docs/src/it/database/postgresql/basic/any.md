---
category: IT
tag: 数据库
order: 22
article: false
---

# ANY

有时候，你需要检查一个列表中是否至少有一个满足指定条件的值，比如：

- 检查一个列表中是否包含了一个指定的值的元素

- 检查一个列表中是否有一个大于或者小于一个指定值的元素

- 检查一个班级的考试成绩是否有满分

您可以使用 PostgreSQL `ANY` 运算符来解决这些问题

PostgreSQL `ANY` 运算符用于将一个值与一个值列表进行比较，只要值列表中有一个值满足指定的条件就返回真，否则返回假

在 PostgreSQL 中，`SOME` 操作符是 `ANY` 的同义词。 您可以使用 `SOME` 关键字代替 `ANY`

## ANY 语法

要检查一个数组中是否至少存在一个满足条件的值，请按下面的语法使用 `ANY` 运算符：

```sql
comparison_operator ANY (array)
```

- comparison_operator 是一个比较运算符，例如 `=`、`!=`、`>`、`>=`、`<`、`<=` 等

- array 是一个数组或者 [子查询](./subquery.md)，它跟在 `ANY` 运算符后面。子查询必须用括号括起来

- 如果 array 中至少有一个值满足指定的条件，则表达式返回真，否则表达式返回假

    - value = ANY (array): 只要数组中有一个等于 value 的值，该表达式返回 true, 否则返回 false

    - value > ANY (array): 只要数组中有一个小于 value 的值，该表达式返回 true, 否则返回 false

    - value < ANY (array): 只要数组中有一个大于 value 的值，该表达式返回 true, 否则返回 false

    - value <> ANY (array): 只要数组中有一个不等于 value 的值，该表达式返回 true, 否则返回 false


## ANY 示例

### ANY 与数组

我们经常需要检查一个数组中是否至少包含一个满足条件的元素，比如：

- 要检查数组 `[1, 2, 3]` 是否包含一个值为 2 的元素，请使用以下语句：

    ```sql
    SELECT 2 = ANY(ARRAY[1, 2, 3]);
    ```

    ```text
     ?column?
    ----------
     t
    ```

- 要检查数组 `[1, 2, 3]` 是否包含一个值大于 2 的元素，请使用以下语句：

    ```sql
    SELECT 2 < ANY(ARRAY[1, 2, 3]);
    ```

    ```text
     ?column?
    ----------
     t
    ```

- 要检查数组 `[1, 2, 3]` 是否包含一个值大于 3 的元素，请使用以下语句：

    ```sql
    SELECT 3 < ANY(ARRAY[1, 2, 3]);
    ```

    ```text
     ?column?
    ----------
     f
    ```

    这里，因为数组 `[1, 2, 3]` 所有元素都不大于 3，因此表达式返回了 false

- 要检查数组 `[1, 2, 3]` 是否包含一个值不等于 3 的元素，请使用以下语句：

    ```sql
    SELECT 3 <> ANY(ARRAY[1, 2, 3]);
    ```

    ```text
     ?column?
    ----------
     t
    ```

### ANY 与子查询

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

- 要检查是否存在租金高于 5 美元的影片，请使用以下语句：

    ```sql
    SELECT 5 < ANY (SELECT rental_rate FROM film);
    ```

    ```text
     ?column?
    ----------
     f
    ```

- 要检查是否能用 1 美元租到影片，请使用以下语句：

    ```sql
    SELECT 1 >= ANY (SELECT rental_rate FROM film);
    ```

    ```text
     ?column?
    ----------
     f
    ```