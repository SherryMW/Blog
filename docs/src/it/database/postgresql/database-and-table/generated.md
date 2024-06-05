---
category: IT
tag: 数据库
order: 14
article: false
---

# 生成列

在 PostgreSQL 中，生成列 `GENERATED COLUMN` 是一个特殊的列，它的值会根据列定义中的表达式自动计算得出。并且，你不能直接写入或更新生成列的值。生成列是定义在列上的约束

生成列有 2 种类型：

- 虚拟生成列：列值不会被存储下来。当读取该列时，该列的值会被计算

- 存储生成列：列值会被存储下来。当插入或修改数据时，该列的值会被重新计算并存储在磁盘上

PostgreSQL 目前只支持存储生成列，不支持虚拟生成列

## 生成列语法

要创建生成列，请使用以下语法：

```sql
col_name data_type
  GENERATED ALWAYS AS (expr) STORED
```

请注意第二行的 `GENERATED ALWAYS AS (expr) STORED`：

- `GENERATED ALWAYS AS` 关键字指示此列是一个生成列

- expr 是用于生成此列的值的表达式

- `STORED` 只是此列是一个存储生成列。这是 PostgreSQL 目前唯一支持的生成列类型

你可以在通过 `CREATE TABLE` 语句创建表时定义生成列，或者通过 `ALTER TABLE` 语句添加一个生成列

## 生成列示例

假设，你有个订单明细表，其存储了订单销售的商品的价格和数量。使用以下语句创建 order_item 表：

```sql
CREATE TABLE order_item (
  order_item_id SERIAL PRIMARY KEY,
  goods VARCHAR(45) NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER NOT NULL
);
```

使用以下语句插入 2 行测试数据：

```sql
INSERT INTO order_item (goods, price, quantity)
VALUES ('Apple', 5, 3), ('Peach', 4, 4);
```

使用以下语句查找 order_item 表中的所有行：

```sql
SELECT * FROM order_item;
```

```text
 order_item_id | goods | price | quantity
---------------+-------+-------+----------
             1 | Apple |     5 |        3
             2 | Peach |     4 |        4
(2 行记录)
```

假设，您需要查找每个订单项目的总金额，请使用如下 SQL 语句：

```sql
SELECT
  goods,
  price,
  quantity,
  (price * quantity) AS total_amount
FROM order_item;
```

```text
 goods | price | quantity | total_amount
-------+-------+----------+--------------
 Apple |     5 |        3 |           15
 Peach |     4 |        4 |           16
(2 行记录)
```

上面的语句使用 `price * quantity` 计算总金额，并使用了 total_amount 作为列别名

PostgreSQL 生成列可以简化我们的工作，让你不用写这么复杂的 `SELECT` 语句。现在我们要通过以下语句添加一个生成列：

```sql
ALTER TABLE order_item
  ADD COLUMN total_amount DECIMAL
    GENERATED ALWAYS AS (price * quantity) STORED;
```

这里，我们添加了一个 total_amount 列。它是一个生成列，它的计算表达式是 `price * quantity`

使用 `\d` 命令看一下 order_item 的结构：

```shell
\d order_item
```

```text
                                               Table "public.order_item"
    Column     |         Type          | Collation | Nullable |                        Default
---------------+-----------------------+-----------+----------+--------------------------------------------------------
 order_item_id | integer               |           | not null | nextval('order_item_order_item_id_seq'::regclass)
 goods         | character varying(45) |           | not null |
 price         | numeric               |           | not null |
 quantity      | integer               |           | not null |
 total_amount  | numeric               |           |          | generated always as (price * quantity::numeric) stored
Indexes:
    "order_item_pkey" PRIMARY KEY, btree (order_item_id)
```

您可以发现从上面的输出发现 total_amount 是一个存储生成列

通过下面的语句查询表中的所有行：

```sql
SELECT
  goods,
  price,
  quantity,
  total_amount
FROM order_item;
```

```text
 goods | price | quantity | total_amount
-------+-------+----------+--------------
 Apple |     5 |        3 |           15
 Peach |     4 |        4 |           16
(2 行记录)
```

现在，相比较以前，您不需要写那么复杂的 SQL 语句了

## 更新生成列

你不能直接写入或者更新生成列的值。这会引发错误。我们尝试一下，看看究竟会发生什么

让我们先试着插入一个带有生成列值的数据：

```sql
INSERT INTO order_item (goods, price, quantity, total_amount)
VALUES ('Banana', 6, 4, 24);
```

```text
ERROR:  cannot insert into column "total_amount"
DETAIL:  Column "total_amount" is a generated column.
```

让我们再尝试修改生成列的值：

```sql
UPDATE order_item
SET total_amount = 30
WHERE goods = 'Apple';
```

```text
ERROR:  column "total_amount" can only be updated to DEFAULT
DETAIL:  Column "total_amount" is a generated column.
```