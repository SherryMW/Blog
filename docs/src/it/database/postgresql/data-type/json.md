---
category: IT
tag: 数据库
order: 11
article: false
---

# JSON

`JSON` 是一种通用的、轻量级的数据传输格式，它可以表示复杂的、结构化的数据，但同时也易于阅读和编写

PostgreSQL 从 9.2 版本开始支持原生 `JSON` 数据类型，并且提供了许多用于操作 `JSON` 数据的函数和运算符

`JSON` 定义了以下几种类型的值：

- 对象

- 数组

- 字符串

- 数字

- true

- false

- null

`JSON` 对象是一个键值对的组合。键是字符串类型的文本，值可以是上面定义的几种类型的任何一种。比如，以下是一些纯值的 `JSON` 值：

```text
"a"
"abc"
"Hello World"
1
1.23
123.456
true
false
null
```

以下是一个 `JSON` 数组的示例：

```json
[1, "a", { "a": 1, "b": true }, [1, "a", true, false, null], null]
```

通常情况下，我们在传输数据的时使用 `JSON` 对象和 `JSON` 数组

PostgreSQL 支持两种 `JSON` 类型：`JSON` 和 `JSONB`。他们的处理效率不同。`JSON` 按文本保存输入数据，保留原始数据中的空格，重复键。`JSONB` 则按照二进制保存输入数据，他会删除没必要的空格以及重复的键

## JSON 文本转为 JSON 类型

要将一个字符串的 `JSON` 文本转为 `JSON` 类型的值，您可以使用如下两种方法：

- 使用 `JSON()` 构造函数将 `JSON` 文本转为 `JSON` 类型的值：

    ```sql
    json('[1, 2, 3]')
    ```

- 使用类型转换将 `JSON` 文本转为 `JSON` 类型的值：

    ```sql
    '{"a": [1, 2, 3]}'::json
    ```

## JSON 操作符

PostgreSQL 提供了几个用于 `JSON` 数据的操作符，如下：

- `->`：获取 JSON 数组的元素或者 `JSON` 对象中的字段，返回值为 `JSON` 类型的值

- `->>`：获取 JSON 数组的元素或者 `JSON` 对象中的字段，返回值为文本

- `#>`：获取指定路径的值，返回值为 `JSON` 类型的值

- `#>>`：获取指定路径的值，返回值为文本

## JSON 示例

使用下面的语句创建一个新表，名称为 login_logs:

```sql
CREATE TABLE login_logs (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  detail JSON NOT NULL
);
```

该 login_logs 表由两列组成：

1. 该 id 列是标识每行的 [主键列](../database-and-table/primary-key.md)，它是一个 [标识列](../database-and-table/identity.md)

2. 该 detail 是 `JSON` 数据类型

### 插入 JSON 数据

要将数据插入 `JSON` 列，您必须确保数据采用有效的 `JSON` 格式。以下 [INSERT](../basic/insert.md) 语句向 login_logs 表中插入几个新行

```sql
INSERT INTO login_logs (detail)
VALUES
  ('{ "name": "Tom", "address": {"ip": "192.168.1.23","country": "US"}}'),
  ('{ "name": "Tim", "address": {"ip": "192.168.1.24","country": "US"}}'),
  ('{ "name": "Jim", "address": {"ip": "192.168.1.25","country": "UK"}}');
```

这里， detail 列中的 `JSON` 值是 `JSON` 对象，其中包含两个键：

1. name 是登陆用户的名称

2. address 是登陆用户的地址，它也是一个 JSON 对象，包含了两个成员：

    - ip 是登陆用户的 IP 地址

    - country 是登陆用户所在的国家

### 查询 JSON 数据

要查询 `JSON` 数据，请使用该 [SELECT](../basic/select.md) 语句：

```sql
SELECT * FROM login_logs;
```

```text
 id |                               detail
----+---------------------------------------------------------------------
  1 | { "name": "Tom", "address": {"ip": "192.168.1.23","country": "US"}}
  2 | { "name": "Tim", "address": {"ip": "192.168.1.24","country": "US"}}
  3 | { "name": "Jim", "address": {"ip": "192.168.1.25","country": "UK"}}
(3 行记录)
```

如果您想显示 `JSON` 对象内部的字段，请使用 `->` 和 `->>` 操作符。`->` 返回的值是 `JSON` 类型，`->>` 返回的值是文本类型

以下查询分别使用两个运算符 `->` 和 `->>` 以 `JSON` 的形式获取所有登陆用户的名称：

```sql
SELECT
  detail -> 'name' AS name_json,
  detail ->> 'name' AS name_text
FROM
  login_logs;
```

```text
 name_json | name_text
-----------+-----------
 "Tom"     | Tom
 "Tim"     | Tim
 "Jim"     | Jim
(3 行记录)
```

要获取所有登陆用的国家和 IP，请使用下面的语句：

```sql
SELECT
  detail -> 'address' ->> 'country' as country,
  detail -> 'address' ->> 'ip' as ip
FROM login_logs;
```

```text
 country |      ip
---------+--------------
 US      | 192.168.1.23
 US      | 192.168.1.24
 UK      | 192.168.1.25
(3 行记录)
```

首先 `detail -> 'address'` 将地址作为 `JSON` 对象返回。然后 `detail -> 'address' ->> 'country'` 将所有国家作为文本返回

### 在 WHERE 条件中使用 JSON 运算符

您可以在 WHERE 子句中使用 `JSON` 运算符来过滤返回的行。例如，要找出所有来自 US 的登陆用户，清使用以下查询：

```sql
SELECT
  detail ->> 'name' AS name,
  detail -> 'address' ->> 'country' AS country
FROM
  login_logs
WHERE
  detail -> 'address' ->> 'country' = 'US';
```

```text
 name | country
------+---------
 Tom  | US
 Tim  | US
(2 行记录)
```

## JSON 函数

PostgreSQL 提供了很多 `JSON` 相关的函数，如下：

- `array_to_json()`：将一个 SQL 数组转为 `JSON` 数组并返回

- `json_array_elements()`：将顶层 `JSON` 数组扩展为一个 JSON 值的集合

- `json_array_length()`：返回一个指定的 `JSON` 数组的长度

- `json_build_array()`：从可变的参数列表中创建一个可能是异构类型的 `JSON` 数组

- `json_each()`：将一个指定的 `JSON` 对象扩展为一个键值对的集合

- `json_extract_path()`：从一个指定的 `JSON` 值中提取指定的路径的值

- `json_object_keys()`：返回指定的 `JSON` 对象中的顶层键的集合

- `json_object()`：从一个文本数组构建一个 `JSON` 对象，或者从两个分别作为键和值的数组构建一个 `JSON` 对象

- `json_to_record()`：将指定的最顶层的 `JSON` 对象扩展为一个在 AS 子句中定义的具有符合类型的行

- `json_to_recordset()`：将指定的最顶层的 `JSON` 数组（元素为对象）扩展为一个在 AS 子句中定义的具有符合类型的行的集合

- `json_typeof()`：以字符串的形式返回指定的 `JSON` 值的类型

- `row_to_json()`：将一个 SQL 复合类型的值转为 `JSON` 对象并返回

- `to_json()`：将一个 SQL 值转为 `JSON` 值并返回