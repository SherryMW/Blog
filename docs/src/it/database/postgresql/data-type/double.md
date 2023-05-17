---
category: IT
tag: 数据库
order: 3
article: false
---

# 浮点型

在 PostgreSQL 中，有两种浮点数类型：`REAL` 和 `DOUBLE PRECISION`

- `REAL` 类型：`REAL` 类型是单精度浮点数类型，占用 4 字节（32位）存储空间。它可以存储小数点后的 6 位数字，精度约为 6 个有效数字。`REAL` 类型通常用于存储比较大的数据集，或者需要占用更少存储空间的场景

- `DOUBLE PRECISION` 类型：`DOUBLE PRECISION` 类型是双精度浮点数类型，占用 8 字节（64位）存储空间。它可以存储小数点后的 15 位数字，精度约为 15 个有效数字。`DOUBLE PRECISION` 类型通常用于需要高精度计算的场景，或者数据量比较小的场景

一般来说，应该根据实际需求选择合适的数据类型。如果数据的精度要求不是非常高，可以使用 `REAL` 类型，它占用的存储空间较小，适合存储数据量较大的数据集。而如果数据的精度要求较高，应该使用 `DOUBLE PRECISION` 类型，虽然它占用的存储空间较大，但是可以提供更高的精度，适合存储需要高精度计算的数据

需要注意的是，在实际使用中，浮点数类型存在精度损失的问题，因此在比较浮点数大小时应该使用比较函数而非相等性判断。同时，在进行浮点数运算时，也需要注意精度损失可能带来的影响

## 浮点型示例

### REAL 示例

创建一个表格，包含两列 `REAL` 类型的数据

```sql
CREATE TABLE sample (
    id SERIAL PRIMARY KEY,
    value1 REAL,
    value2 REAL
);
```

插入数据到表格中

```sql
INSERT INTO sample (value1, value2) 
VALUES (3.14, 2.718), (1.23456789, 0.123456789)
RETURNING *;
```

```text
 id |    value1    |     value2
----+--------------+------------------
  1 | 3.1400001049 | 2.71800017356873
  2 | 1.2345678806 | 0.123456791043282
```

可以看到，`REAL` 类型在存储数据时存在精度损失的问题，因此查询结果会存在一定的误差。如果需要更高的精度，可以使用 `DOUBLE PRECISION` 类型

### DOUBLE PRECISION 示例

创建一个表格，包含两列 `DOUBLE PRECISION` 类型的数据

```sql
CREATE TABLE sample (
    id SERIAL PRIMARY KEY,
    value1 DOUBLE PRECISION,
    value2 DOUBLE PRECISION
);
```

插入数据到表格中

```sql
INSERT INTO sample (value1, value2) 
VALUES (3.14, 2.718), (1.234567890123456, 0.1234567890123456)
    RETURNING *;
```

```text
 id |        value1        |        value2
----+--------------------- +----------------------
  1 | 3.1400000000000000   |   2.7180000000000000
  2 | 1.2345678901234560   |   0.1234567890123456
```

可以看到，`DOUBLE PRECISION` 类型具有更高的精度，查询结果也更加准确。在实际使用中，应该根据实际需求选择合适的数据类型