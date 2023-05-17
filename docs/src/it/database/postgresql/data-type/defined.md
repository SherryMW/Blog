---
category: IT
tag: 数据库
order: 16
article: false
---

# 自定义类型

PostgreSQL 允许您使用 `CREATE DOMAIN` 和 `CREATE TYPE` 语句创建用户定义数据类型

- 使用 `CREATE DOMAIN` 您能基于已有的类型创建一个子类型，并可以为其添加一些约束，目前支持 3 中约束：NULL，[NOT NULL](../database-and-table/not-null.md)，[CHECK](../database-and-table/check.md)

- 使用 `CREATE TYPE` 您能创建复合类型，[枚举](./enum.md) 类型，或 [RANGE](./range.md) 类型

## CREATE DOMAIN 语法

PostgreSQL `CREATE DOMAIN` 语句用于创建一个域。 域是具有可选约束的数据类型

要基于一个现有的数据类型创建一个域，请按照如下语法使用 `CREATE DOMAIN` 语句：

```sql
CREATE DOMAIN name [ AS ] data_type
    [ COLLATE collation ]
    [ DEFAULT expression ]
    [ { NOT NULL | NULL | CHECK (expression) } ]
```

- name：要创建的域（子类型）的名称

- data_type：域的基础数据类型

- DEFAULT expression：使用此数据类型的列的默认值

- CHECK (expression)：使用此数据类型的列的 [CHECK](../database-and-table/check.md) 约束

比如，要创建一个默认值为空字符串且不能为 NULL 的 TEXT 类型 not_null_text，请使用以下语句：

```sql
CREATE DOMAIN not_null_text AS TEXT DEFAULT '';
```

下面的 `CREATE TABLE` 语句使用此 not_null_text 类型：

```sql
CREATE TABLE test_domain (
  col1 not_null_text,
  col2 not_null_text
);
```

## CREATE TYPE

PostgreSQL `CREATE TYPE` 语句用于创建一个复合类型，[枚举](./enum.md) 类型，或 [RANGE](./range.md) 类型

以下语法使用 `CREATE DOMAIN` 语句用于创建一个复合类型：

```sql
CREATE TYPE name AS (
  field_name1 data_type
  [, field_name2 data_type, ...]
);
```

以下语法使用 `CREATE DOMAIN` 语句用于创建一个枚举类型：

```sql
CREATE TYPE name AS ENUM (
  label_1
  [, label_2, ... ]
);
```

以下语法使用 `CREATE DOMAIN` 语句用于创建一个 RANGE 类型：

```sql
CREATE TYPE name AS RANGE (
    SUBTYPE = subtype
    [ , SUBTYPE_OPCLASS = subtype_operator_class ]
    [ , COLLATION = collation ]
    [ , CANONICAL = canonical_function ]
    [ , SUBTYPE_DIFF = subtype_diff_function ]
    [ , MULTIRANGE_TYPE_NAME = multirange_type_name ]
);
```

## 创建复合类型示例

使用下面的语句创建一个自定义类型：

```sql
CREATE TYPE address as (country TEXT, city TEXT);
```

上面的语句创建了一个名字为 address 自定义类型，它有两个字段：country 和 city 字段，他们都是 `TEXT` 类型

下面的语句将一个复杂的 `JSON` 对象转为 SQL 行：

```sql
SELECT
  *
FROM
  json_to_record(
    '{"name": "Tom", "age": 20, "address": {"country": "CN", "city": "BeiJing"}}'
  ) AS x(name TEXT, age INT, address address);
```

```text
 name | age |   address
------+-----+--------------
 Tom  |  20 | (CN,BeiJing)
```

`json_to_record()`：将指定的最顶层的 `JSON` 对象扩展为一个在 AS 子句中定义的具有符合类型的行

## 创建枚举类型示例

使用 `CREATE TYPE` 语句创建一个枚举类型 my_color：

```sql
CREATE TYPE my_color AS ENUM (
    'yellow',
    'red',
    'blue',
    'green',
    'white',
    'black'
);
```

使用 PostgreSQL `enum_first()` 函数返回 my_color 中的第一个枚举值：

```sql
SELECT enum_first(null::my_color);
```

```text
 enum_first
------------
 yellow
```

使用 PostgreSQL `enum_last()` 函数返回 my_color 中的最后一个枚举值：

```sql
SELECT enum_last(null::my_color);
```

```text
 enum_last
-----------
 black
```