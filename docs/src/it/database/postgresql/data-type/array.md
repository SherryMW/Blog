---
category: IT
tag: 数据库
order: 10
article: false
---

# Array

PostgreSQL 允许您使用数组数据类型存储一个多值的集合，比如，一些业余爱好，几个昵称等

## 数组用法

和其他很多语言一样，在 PostgreSQL 中，使用 `data_type[]` 表示一个数组类型，其中 `data_type` 是数组中元素的数据类型。比如，`TEXT` 的数组类型是 `TEXT[]`，`INTEGER` 的数组类型是 `INTEGER[]`，`BOOLEAN` 的数组类型是 `BOOLEAN[]`，等等

### 构造 PostgreSQL 数组

要表示一个数组数据，您可以使用以下两种方法：

- 使用 `ARRAY()` 构造函数构造一个数组：

   ```sql
   ARRAY(elem1, elem2, ...)
   ```

  比如，`ARRAY(1, 2, 3)` 是一个整数数组

- 使用花括号构造一个 PostgreSQL 数组：

   ```sql
   '{elem1, elem2, ...}'::data_type[]
   ```

  比如：`{1, 2, 3}::integer[]` 是一个整数数组

### 访问 PostgreSQL 数组元素

要访问 PostgreSQL 数组中的元素，您可以使用数组下标。默认情况下，PostgreSQL 对数组元素使用从 1 开始的编号。这意味着第一个数组元素的下标是 1，第二个数组元素的下表是 2，…

### 定义 PostgreSQL 数组列

要在 PostgreSQL 数据库中定义一个数组列，请使用如下语法：

```sql
column_name data_type[] column_constraint
```

## 数组示例

为演示 PostgreSQL 数组类型的用法，请使用以下 `CREATE TABLE` 语句创建 user_hobbies 表，其中 hobbies 列定义为文本数组

```sql
CREATE TABLE user_hobbies (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50),
  hobbies TEXT[]
);
```

其中，hobbies 列是一个一维数组，其中包含用户的各种业余爱好

### 插入 PostgreSQL 数组值

以下语句使用 `ARRAY()` 构造函数构造了一个文本数组，并向 user_hobbies 表中插入一个新行：

```sql
INSERT INTO user_hobbies (name, hobbies)
VALUES ('Tom', ARRAY['Football', 'Basketball'])
RETURNING *;
```

```text
 id | name |        hobbies
----+------+-----------------------
  1 | Tom  | {Football,Basketball}
```

以下语句使用花括号构造了一个文本数组，并向 user_hobbies 表中插入一个新行：

```sql
INSERT INTO user_hobbies (name, hobbies)
VALUES ('Tim','{"Piano", "Violin", "Cello"}')
RETURNING *;
```

```text
 id | name |       hobbies
----+------+----------------------
  2 | Tim  | {Piano,Violin,Cello}
```

### 查询数组数据

您可以使用 [SELECT](../basic/select.md) 语句查询数组数据，如下所示：

```sql
SELECT
    name,
    hobbies
FROM
    user_hobbies;
```

```text
 name |        hobbies
------+-----------------------
 Tom  | {Football,Basketball}
 Tim  | {Piano,Violin,Cello}
```

您可以使用下标访问数组元素。比如，要获取用户的第一个业余爱好，请使用如下的语句：

```sql
SELECT
  name,
  hobbies[1]
FROM
  user_hobbies;
```

```text
 name | hobbies
------+----------
 Tom  | Football
 Tim  | Piano
```

### 在数组中搜索

要从 PostgreSQL 数组中搜索是否包含某个指定的元素，请使用 `ANY()` 运算符。比如，要查找那些业余爱好为足球的同学，请使用以下查询：

```sql
SELECT
  name,
  hobbies
FROM
  user_hobbies
WHERE
  'Football' = ANY (hobbies);
```

```text
 name |        hobbies
------+-----------------------
 Tom  | {Football,Basketball}
```

### 修改 PostgreSQL 数组

PostgreSQL 允许使用数组下标修改数组中的每个元素，比如：

```sql
UPDATE user_hobbies
SET hobbies[2] = 'Baseball'
WHERE ID = 1
RETURNING *;
```

```text
id  | name |       hobbies
----+------+---------------------
  1 | Tom  | {Football,Baseball}
```

您也可以更新整个数组，比如：

```sql
UPDATE user_hobbies
SET hobbies = '{"Baseball"}'
WHERE ID = 1
RETURNING *;
```

```text
id  | name |  hobbies
----+------+------------
  1 | Tom  | {Baseball}
```

## 数组函数

PostgreSQL 提供了很多数组相关的函数。下面是几个常用的 PostgreSQL 数组函数：

- `array_append()`：将指定的元素追加到指定的数组

- `array_cat()`：将两个指定的数组合并为一个数组

- `array_length()`：返回指定的数组中指定维度的长度

- `array_prepend()`：将指定的元素添加到指定的数组的开头

- `array_replace()`：在指定的数组中使用一个新元素替换指定的元素

- `array_to_string()`：将数组中的所有元素使用分隔符连接起来

- `unnest()`：将指定的数组展开为一个行的集合

例如：要将 hobbies 数组中的每一个业余爱好扩展为一行，请使用如下语句：

```sql
SELECT
  name,
  unnest(hobbies)
FROM
  user_hobbies;
```

```text
 name |  unnest
------+----------
 Tim  | Piano
 Tim  | Violin
 Tim  | Cello
 Tom  | Baseball
```