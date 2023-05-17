---
category: IT
tag: 数据库
order: 5
article: false
---

# UPDATE

在 PostgreSQL 中，`UPDATE` 语句允许你更新表中的已有的数据行

## UPDATE 语法

PostgreSQL `UPDATE` 语句可以更新表中的一行或者多行数据，可以更新表中的一个或者多个列的值。以下是 `UPDATE` 语句的基本语法：

```sql
UPDATE [IGNORE] table_name
SET
    column_name1 = value1,
    column_name2 = value2,
    ...
[WHERE clause]
[RETURNING expr];
```

- `UPDATE` 关键字后指定要更新数据的表名

- 使用 `SET` 子句设置列的新值。多个列使用逗号分隔。列的值可以是普通的字面值，也可以是表达式运算，还可以是子查询

- 使用 `WHERE` 子句指定要更新的行的条件。只有符合 `WHERE` 条件的行才会被更新

- `WHERE` 子句是可选的。如果不指定 `WHERE` 子句，则更新表中的所有行

- `RETURNING` 子句是可选的。它用于返回更新的行的信息。expr 可以是列名或者表达式，多个列或者表达式请使用逗号分隔。您还可以使用 * 表示表中的所有的列。如果不指定 `RETURNING` 子句，UPDATE 语句将返回更新的行数

`UPDATE` 语句中的 `WHERE` 子句非常重要。除非您特意，否则不要省略 `WHERE` 子句

## UPDATE 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 更新单列值

在这个例子中，我们将把 customer_id 等于 1 的客户的电子邮件修改为 NEW.MARY.SMITH@sakilacustomer.org

1. 使用以下 `SELECT` 语句查看更新前的数据

    ```sql
    SELECT first_name, last_name, email
    FROM customer
    WHERE customer_id = 1;
    ```

    ```text
     first_name | last_name |             email
    ------------+-----------+-------------------------------
     MARY       | SMITH     | MARY.SMITH@sakilacustomer.org
    ```

2. 使用以下 `UPDATE` 语句更新 email 列的值

    ```sql
    UPDATE customer
    SET email = 'NEW.MARY.SMITH@sakilacustomer.org'
    WHERE customer_id = 1;
    ```

    ```text
    UPDATE 1
    ```

    - 通过 [WHERE](./where.md) 子句指定更新的条件为 customer_id = 1

    - 通过 `SET` 子句将 email 列的值设置为新电子邮件

    - `UPDATE` 返回了 `UPDATE 1`，它表示更新了一行

3. 或者，您可以使用以下 `RETURNING` 子句直接查看更新后的数据：

    ```sql
    UPDATE customer
    SET email = 'NEW.MARY.SMITH@sakilacustomer.org'
    WHERE customer_id = 1
    RETURNING first_name, last_name, email;
    ```

    ```text
     first_name | last_name |               email
    ------------+-----------+-----------------------------------
     MARY       | SMITH     | NEW.MARY.SMITH@sakilacustomer.org
    ```

### 更新多列值

在这个例子中，我们将同时更新 customer_id 等于 1 的客户的 first_name, last_name, email 列

```sql
UPDATE customer
SET first_name = 'Tim',
    last_name = 'Duncan',
    email = 'Tim.Duncan@sakilacustomer.org'
WHERE customer_id = 1
RETURNING first_name, last_name, email;
```

```text
 first_name | last_name |             email
------------+-----------+-------------------------------
 Tim        | Duncan    | Tim.Duncan@sakilacustomer.org
```

### 使用表达式更新

使用 `UPDATE` 更新时，列的值可以设置为表达式的运算结果，比如函数或其他的运算。下面的 `UPDATE` 语句使用 `REPLACE` 函数更新所有客户的电子邮件的域名部分：

```sql
UPDATE customer
SET email = REPLACE(email, 'sakilacustomer.org', 'sjkjc.com')
RETURNING first_name, last_name, email;
```

```text
 first_name  |  last_name   |              email
-------------+--------------+---------------------------------
 PATRICIA    | JOHNSON      | PATRICIA.JOHNSON@sjkjc.com
 LINDA       | WILLIAMS     | LINDA.WILLIAMS@sjkjc.com
 BARBARA     | JONES        | BARBARA.JONES@sjkjc.com
 ELIZABETH   | BROWN        | ELIZABETH.BROWN@sjkjc.com
 JENNIFER    | DAVIS        | JENNIFER.DAVIS@sjkjc.com
...
(599 行记录)
```

注意，本例中没有使用 `WHERE` 子句，所以表中所有的数据都进行了更新

### 使用子查询更新

下面实例展示了如何为没有绑定商店的客户绑定一个随机商店

```sql
UPDATE customer
SET store_id = (
    SELECT store_id
    FROM store
    ORDER BY random()
    LIMIT 1
  )
WHERE store_id IS NULL;
```

在本例中，我们通过以下 `SELECT` 语句返回一个随机的商店 id：

```sql
SELECT store_id
FROM store
ORDER BY random()
LIMIT 1
```

在 `SET` 子句中，将 store_id 的值设置为上面的子查询的结果