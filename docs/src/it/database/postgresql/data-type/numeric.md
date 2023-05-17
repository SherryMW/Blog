---
category: IT
tag: 数据库
order: 4
article: false
---

# NUMERIC

PostgreSQL 提供了 `NUMERIC` 类型用来存储具有高精度要求的数字类型的数据，比如金额、里程、销量等

对 `NUMERIC` 类型的值的计算通常比浮点类型慢，因此，如果对于精度没有那么高要求，则应该使用浮点类型或者整数

## NUMERIC 语法

```sql
NUMERIC(precision, scale)
NUMERIC(precision)
NUMERIC
```

- precision：可选的。它是允许存储的数字的总位数，含小数部分的位数

- scale：可选的。小数部分的位数

例如，数字 1234.567 具有 precision 7 和 scale 3

注意，`DECIMAL` 和 `NUMERIC` 是等价的

## NUMERIC 取值

`NUMERIC` 适用于存储含有大量数字的数值。它的小数点前最多 131072 位数字，小数点后最多 16383 位数字

除了普通的数值之外，浮点类型还有几个特殊值：

- Infinity：无穷大

- -Infinity：负无穷大

- NaN：非数字

其中， PostgreSQL v14 支持 Infinity 和 -Infinity

## NUMERIC 示例

使用下面的语句创建一个表，名称为 test_numeric：

```sql
CREATE TABLE test_numeric (
  numeric_5_2 NUMERIC(5,2),
  numeric_i NUMERIC
);
```

使用下面的语句向表中插入一行数据：

```sql
INSERT INTO test_numeric (numeric_5_2)
VALUES (1234.456)
RETURNING numeric_5_2;
```

```text
ERROR:  numeric field overflow
DETAIL:  A field with precision 5, scale 2 must round to an absolute value less than 10^3.
```

这里，因为数字 1234.234 超出了 `NUMERIC(5,2)` 的范围，因此 PostgreSQL 给出了一个错误

下面的语句修改了插入的值，运行它重新尝试插入：

```sql
INSERT INTO test_numeric (numeric_5_2)
VALUES (234.456)
RETURNING numeric_5_2;
```

```text
 numeric_5_2
-------------
      234.46
```

这里，由于 `NUMERIC(5,2)` 允许的小数位为 2，因此 234.456 被四舍五入为 234.46

### Infinity 与 NaN

PostgreSQL 14 开始支持 Infinity 与 -Infinity。您不能向一个有限范围的 `NUMERIC` 写入 Infinity 与 -Infinity， 否则 PostgreSQL 将给出一个错误。比如：

```sql
INSERT INTO test_numeric (numeric_5_2)
VALUES ('Infinity')
RETURNING numeric_5_2;
```

```text
ERROR:  numeric field overflow
DETAIL:  A field with precision 5, scale 2 cannot hold an infinite value.
```

下面的语句向类型为 `NUMERIC` 的列中写入了 Infinity:

```sql
INSERT INTO test_numeric (numeric_i)
VALUES ('Infinity')
RETURNING numeric_i;
```

```text
 numeric_i
-----------
  Infinity
```

下面的语句向类型为 `NUMERIC` 的列中写入了 -Infinity:

```sql
INSERT INTO test_numeric (numeric_i)
VALUES ('-Infinity')
RETURNING numeric_i;
```

```text
 numeric_i
-----------
 -Infinity
```

向类型为 `NUMERIC` 的列中写入了 NaN:

```sql
INSERT INTO test_numeric (numeric_5_2)
VALUES ('NaN')
RETURNING numeric_5_2;
```

```text
 numeric_5_2
-------------
         NaN
```