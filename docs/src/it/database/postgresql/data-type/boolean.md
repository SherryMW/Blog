---
category: IT
tag: 数据库
order: 5
article: false
---

# 布尔类型

布尔类型是一种表示真或者假的数据类型。PostgreSQL 数据库支持原生的布尔类型，您可以使用 `BOOLEAN` 或 `BOOL` 将一个列的类型定义为布尔值

PostgreSQL 对布尔值的处理非常灵活：true, 'true', 't', 'yes', 'y', '1' 都被视为真，false, 'false', 'f', 'no', 'n', '0' 都被视为假。注意，这里所有的值不区分大小写。除了 true 和 false，其他的都是字符类型

PostgreSQL 布尔类型允许 NULL 值

请注意，在 SQL 标准中，一个布尔值只接受 TRUE，FALSE 和 NULL

## BOOLEAN 示例

首先，使用以下语句创建一个名字为 test_boolean 的新表 来演示 `BOOLEAN` 类型的用法

```sql
CREATE TABLE test_boolean (
  v VARCHAR NOT NULL,
  b BOOLEAN NOT NULL
);
```

其次，使用以下语句向 test_boolean 表中插入一些示例数据。其中，我们对布尔值使用各种文字值

```sql
INSERT INTO test_boolean (v, b)
VALUES
    (TRUE, TRUE),
    (FALSE, FALSE),
    ('t', 't'),
    ('f', 'f'),
    ('T', 'T'),
    ('F', 'F'),
    ('1', '1'),
    ('0', '0'),
    ('y', 'y'),
    ('n', 'n'),
    ('Y', 'Y'),
    ('N', 'N'),
    ('yes', 'yes'),
    ('no', 'no'),
    ('YES', 'YES'),
    ('NO', 'NO')
RETURNING *;
```

```text
   v   | b
--------+---
 true  | t
 false | f
 t     | t
 f     | f
 T     | t
 F     | f
 1     | t
 0     | f
 y     | t
 n     | f
 Y     | t
 N     | f
 yes   | t
 no    | f
 YES   | t
 NO    | f
(16 行记录)
```

这里，我们可以看到，各种文字值都已经转为对应的布尔值了

使用以下语句根据 `BOOLEAN` 类型的列检索数据行：

```sql
SELECT *
FROM test_boolean
WHERE b = 'Y';
```

```text
  v   | b
------+---
 true | t
 t    | t
 T    | t
 1    | t
 y    | t
 Y    | t
 yes  | t
 YES  | t
(8 行记录)
```

这里，我们在 `WHERE` 条件中对 `BOOLEAN` 列使用了一个字符值 'Y'。该语句返回了所有 b 为 true 的行。您还也可以使用 't', 'yes', 'y', 或 '1' 等值代替上面语句中的 'Y'