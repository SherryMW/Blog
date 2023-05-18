---
category: IT
tag: 数据库
order: 1
article: false
---

# 字符型

字符类型以文本形式存储数据，PostgreSQL 提供了三种字符数据类型：`CHAR`，`VARCHAR`，和 `TEXT`

## 字符类型用法

下面说明了 PostgreSQL 中的三种字符类型的用法：

- `CHAR` 类型：`CHAR` 是一种固定长度的字符串类型，它要求您指定列的长度。当插入一个值时，如果该值长度小于列的长度，则 PostgreSQL 会在该值后面添加空格以填充该列的长度。如果值的长度大于列的长度，则 PostgreSQL 会截断该值并将其存储在列中。由于 `CHAR` 是一种定长类型，它比可变长度类型（如 `VARCHAR` 和 `TEXT`）更快。`CHAR` 类型通常用于存储定长的文本数据，例如国家代码、邮政编码等

- `VARCHAR` 类型：`VARCHAR` 是一种可变长度的字符串类型，它允许您指定最大长度。当插入一个值时，如果该值长度小于列的最大长度，则 PostgreSQL 会将该值存储在列中。如果值的长度大于列的最大长度，则 PostgreSQL 会截断该值并将其存储在列中。`VARCHAR` 类型通常用于存储可变长度的文本数据，例如电子邮件地址、用户名等

- `TEXT` 类型：`TEXT` 是一种可变长度的字符串类型，它可以存储任意长度的字符串。与 `VARCHAR` 不同，`TEXT` 列不需要指定最大长度。这意味着您可以存储任意长度的字符串，而无需担心数据超过定义的长度。`TEXT` 类型通常用于存储大量的文本数据，例如文章、博客、评论等

总的来说，如果您需要存储定长的文本数据，应该使用 `CHAR` 类型；如果您需要存储可变长度的文本数据，可以使用 `VARCHAR` 类型；如果您需要存储大量的文本数据或不确定数据的长度，应该使用 `TEXT` 类型

## 字符类型示例

这个示例说明了 `CHAR`，`VARCHAR` 以及 `TEXT` 数据类型是如何工作的

使用下面的语句创建一个新表用于测试：

```sql
CREATE TABLE test_character_type (
  char_1 CHAR(1),
  varchar_10 VARCHAR(10),
  txt TEXT
);
```

### CHAR 类型示例

使用下面的语句向表中插入一个新行超出 char_1 列长度的值：

```sql
INSERT INTO test_character_type (char_1)
VALUES('OK')
RETURNING *;
```

PostgreSQL 发出错误：

```text
ERROR:  value too long for type character(1)
```

这是因为该 char_1 列的数据类型是 `CHAR(1)`，我们试图在该列中插入一个包含 2 个字符的字符串: 'OK'

使用下面的语句向表中插入一个新行超出 char_1 列长度的值，超出的部分为空格：

```sql
INSERT INTO test_character_type (char_1)
VALUES('Y    ')
RETURNING *;
```

```text
 char_1 | varchar_10 | txt
--------+------------+-----
 Y      |            |
```

这里插入成功了。这是因为超出的部分是空格，PostgreSQL 自动截断了空格

### VARCHAR 类型示例

使用下面的语句向表中插入一个新行超出 varchar_10 列长度的值：

```sql
INSERT INTO test_character_type (varchar_10)
VALUES('Hello World')
RETURNING *;
```

PostgreSQL 发出错误：

```sql
ERROR:  value too long for type character varying(10)
```

这是因为该 varchar_10 列的数据类型是 `VARCHAR(10)`，我们试图在该列中插入一个包含 11 个字符的字符串: 'Hello World'

使用下面的语句向表中插入一个新行超出 varchar_10 列长度的值，超出的部分为空格：

```sql
INSERT INTO test_character_type (varchar_10)
VALUES('HelloWorld    ')
RETURNING *;
```

```text
 char_1 | varchar_10 | txt
--------+------------+-----
        | HelloWorld |
```

这里插入成功了。这是因为超出的部分是空格，PostgreSQL 自动截断了空格

### TEXT 类型示例

使用下面的语句向表中插入一个新行：

```sql
INSERT INTO test_character_type (txt)
VALUES('TEXT column can store a string of any length')
RETURNING txt;
```

```text
                     txt
----------------------------------------------
 TEXT column can store a string of any length
```

对于一个 `TEXT` 类型的列，您可以插入任意长度的字符串