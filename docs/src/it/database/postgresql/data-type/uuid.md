---
category: IT
tag: 数据库
order: 12
article: false
---

# UUID

UUID 是一种通用唯一标识符，它由 32 为十六进制数字以及连字符组成

与 [SERIAL](../database-and-table/serial.md)，[标识列](../database-and-table/identity.md) 和 [序列](../database-and-table/sequences.md) 相比，`UUID` 具有全局的唯一性，而不是数据库中的唯一性。 `UUID` 更适合在集群环境中作为唯一标识符

## 生成 UUID 值

要在 PostgreSQL 中生成 UUID，请使用 `gen_random_uuid()` 函数，如下：

```sql
SELECT gen_random_uuid();
```

```text
           gen_random_uuid
--------------------------------------
 d1f7b7c1-c0b6-4707-aa17-5055b09b3ae8
```

`gen_random_uuid()` 函数生成一个 v4 版本的 `UUID`，要生成其他版本的 `UUID`，请使用 uuid-ossp 模块，并使用它的函数：

- `uuid_generate_v1()`

- `uuid_generate_v1mc()`

- `uuid_generate_v3()`

- `uuid_generate_v4()`

- `uuid_generate_v5()`

有关 `UUID` 生成函数的更多信息，请查看 [uuid-ossp](https://www.postgresql.org/docs/9.5/static/uuid-ossp.html) 模块文档

注意，`gen_random_uuid()` 函数在 PostgreSQL v13 及以后的版本中才能使用。在之前的版本中，请使用 uuid-ossp 模块提供的函数生成 `UUID`

## UUID 示例

在本示例中，您将创建一个 fruits 表，其主键是 `UUID` 数据类型

使用以下语句创建 fruits 表：

```sql
CREATE TABLE fruits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL
);
```

在 fruits 表中，id 列的数据类型是 `UUID`，并且由 `gen_random_uuid()` 函数提供默认值

使用下面的语句插入一些数据到 fruits 表中：

```sql
INSERT INTO fruits (name)
VALUES
    ('Apple'),
    ('Peach'),
    ('Banana')
RETURNING *;
```

```text
                  id                  |  name
--------------------------------------+--------
 980dd890-f7fe-4fff-999d-873516108b2e | Apple
 617c7809-cec6-44aa-9ce3-59a988e5bf35 | Peach
 98edf248-42a2-496d-9b4a-16472f6f0a00 | Banana
(3 行记录)
```

正如您所见，该 id 列已由 `gen_random_uuid()` 函数生成的 `UUID` 值填充