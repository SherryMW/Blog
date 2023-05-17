---
category: IT
tag: 数据库
order: 13
article: false
---

# HSTORE

PostgreSQL 允许您使用 `HSTORE` 类型存储键值对数据类型，类似于 [JSON](./json.md)

PostgreSQL `HSTORE` 数据类型很适合存储无规则的字典值，比如电子产品的属性，服装的规格等

PostgreSQL `HSTORE` 数据类型在 hstore 模块中实现。要使用 PostgreSQL `HSTORE` 类型，请使用如下语句启用 PostgreSQL hstore 扩展：

```sql
CREATE EXTENSION hstore;
```

## HSTORE 语法

要创建一个 `HSTORE` 数据类型的列，请使用如下语法：

```sql
column_name HSTORE column_constraint
```

`HSTORE` 数据类型的值采用如下的格式：

```sql
"key1=>value1"[, "key2=>value2", ...]
```

- "key1=>value1" 是一个键值对。如果键和值中不包含空格，可以省略双引号

- 多个键值对之间使用逗号分隔

- 键和值都是文本值

## HSTORE 示例

使用下面的语句创建一个新表，名称为 product：

```sql
CREATE TABLE product (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_name VARCHAR NOT NULL,
  attributes HSTORE
);
```

product 表存储一个在线商城的产品，它由三列组成：

- id 列是标识每行的 [主键列](../database-and-table/primary-key.md)，它是一个 [标识列](../database-and-table/identity.md)

- product_name 列存储产品的名称，它的类型是 `VARCHAR`

- attributes 列是 `HSTORE` 数据类型，它不能为 null

产品的属性是多样的，很适合使用 `HSTORE` 数据类型，比如：

- 电脑产品具有 CPU，内存，硬盘，品牌，外观等属性

- 服装产品具有 季节，款式，性别，品牌，颜色等属性

### 插入 HSTORE 数据

要将数据插入 `HSTORE` 列，您必须确保数据采用正确的格式。以下 [INSERT](../basic/insert.md) 语句向 product 表中插入几个新行

```sql
INSERT INTO product (product_name, attributes)
VALUES
  ('Computer A', 'CPU=>2.5, Memory=>16G, Disk=>1T'),
  ('Shirt B', 'Season=>Spring, Style=>Business, Color=>White')
RETURNING *;
```

```text
 id | product_name |                        attributes
----+--------------+-----------------------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Memory"=>"16G"
  2 | Shirt B      | "Color"=>"White", "Style"=>"Business", "Season"=>"Spring"
(2 行记录)
```

### 查询 HSTORE 数据

要查询 `HSTORE` 数据，请使用如下 [SELECT](../basic/select.md) 语句：

```sql
SELECT * FROM product;
```

```text
 id | product_name |                        attributes
----+--------------+-----------------------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Memory"=>"16G"
  2 | Shirt B      | "Color"=>"White", "Style"=>"Business", "Season"=>"Spring"
(2 行记录)
```

如果要查询 `HSTORE` 数据特定的键值，请使用 `->` 运算符或者 `column_name['key_name']` 语法，如下：

```sql
SELECT
  id,
  product_name,
  attributes -> 'Memory' memory,
  attributes['Disk'] disk
FROM product;
```

```text
 id | product_name | memory |  disk
----+--------------+--------+--------
  1 | Computer A   | 16G    | 1T
  2 | Shirt B      | <null> | <null>
(2 行记录)
```

要在 [WHERE](../basic/where.md) 条件中使用 `HSTORE` 数据的键值，请使用 `column_name['key_name']` 语法：

```sql
SELECT *
FROM product
WHERE attributes['Memory'] = '16G';
```

```text
 id | product_name |                 attributes
----+--------------+---------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Memory"=>"16G"
```

要检查 `HSTORE` 数据中是否包含一个特定的键值，请使用 `?` 运算符，如下：

```sql
SELECT *
FROM product
WHERE attributes ? 'Color';
```

```text
 id | product_name |                        attributes
----+--------------+-----------------------------------------------------------
  2 | Shirt B      | "Color"=>"White", "Style"=>"Business", "Season"=>"Spring"
```

或者使用 [IS NOT NULL](../basic/isnull.md) 运算符，如下：

```sql
SELECT *
FROM product
WHERE attributes['Color'] IS NOT NULL;
```

```text
 id | product_name |                        attributes
----+--------------+-----------------------------------------------------------
  2 | Shirt B      | "Color"=>"White", "Style"=>"Business", "Season"=>"Spring"
```

### 将键值对添加到 HSTORE 数据

要将键值对添加到 `HSTORE` 数据，使用该 [UPDATE](../basic/update.md) 语句：

```sql
UPDATE product
SET attributes['Brand'] = 'HP'
WHERE id = 1
RETURNING *;
```

```text
 id | product_name |                         attributes
----+--------------+------------------------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Brand"=>"HP", "Memory"=>"16G"
```

### 更新 HSTORE 数据中的键值

要更新 `HSTORE` 数据中的键值，使用该 [UPDATE](../basic/update.md) 语句：

```sql
UPDATE product
SET attributes['Brand'] = 'Dell'
WHERE id = 1
RETURNING *;
```

```text
 id | product_name |                          attributes
----+--------------+--------------------------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Brand"=>"Dell", "Memory"=>"16G"
```

### 删除 HSTORE 数据中的键值对

要从 `HSTORE` 数据中删除已有的键值对，使用 [UPDATE](../basic/update.md) 语句 和 `delete()` 函数：

```sql
UPDATE product
SET attributes = delete(attributes, 'brand')
WHERE id = 1
RETURNING *;
```

```text
 id | product_name |                 attributes
----+--------------+---------------------------------------------
  1 | Computer A   | "CPU"=>"2.5", "Disk"=>"1T", "Memory"=>"16G"
```