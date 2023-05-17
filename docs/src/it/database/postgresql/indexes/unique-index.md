---
category: IT
tag: 数据库
order: 6
article: false
---

# 唯一索引

PostgreSQL `UNIQUE` 索引用于强制一列或多列中值的唯一性

只有索引类型为 `B-Tree` 的索引可以声明为唯一索引。 要创建 `UNIQUE` 索引，您可以使用以下语法：

```sql
CREATE UNIQUE INDEX index_name
ON table_name(column_name, [...]);
```

`UNIQUE` 关键字用于将索引声明为唯一索引

如果一个列被定义为唯一索引，那么该列不能存储具有相同的值

如果两列或更多列被定义为唯一索引，则这些列中的组合值不能重复

但是，您可以在具有 UNIQUE 索引的列中使用多个 NULL 值

当您为表定义 [主键](../database-and-table/primary-key.md) 或 [唯一约束](../database-and-table/unique.md) 时，PostgreSQL 会自动创建相应的 `UNIQUE` 索引

## UNIQUE 索引示例

以下语句创建一个名为 staff 的表：

```sql
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE
);
```

在这个语句中，id 是主键列，email 列有唯一约束，因此，PostgreSQL 创建了两个 `UNIQUE` 索引，每个列一个

要显示 staff 表的索引，请使用以下语句：

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM
  pg_indexes
WHERE
  tablename = 'staff';
```

```text
 tablename |    indexname    |                                indexdef
-----------+-----------------+-------------------------------------------------------------------------
 staff     | staff_pkey      | CREATE UNIQUE INDEX staff_pkey ON public.staff USING btree (id)
 staff     | staff_email_key | CREATE UNIQUE INDEX staff_email_key ON public.staff USING btree (email)
(2 行记录)
```

## UNIQUE 索引 – 单列示例

以下语句将 mobile_phone 列添加到 staff 表中：

```sql
ALTER TABLE staff
ADD mobile_phone VARCHAR(20);
```

为确保所有员工的手机号码都是不同的，您可以为该 mobile_phone 列定义一个 `UNIQUE` 索引，如下所示：

```sql
CREATE UNIQUE INDEX idx_staff_mobile_phone
ON staff(mobile_phone);
```

让我们来测试一下。首先，在 staff 表中插入一个新行：

```sql
INSERT INTO staff(first_name, last_name, email, mobile_phone)
VALUES ('Adam','Z','adam@sqliz.com', '13333333333');
```

其次，尝试插入具有相同电话号码的另一行：

```sql
INSERT INTO staff(first_name, last_name, email, mobile_phone)
VALUES ('Jack','W','jack@sqliz.com', '13333333333');
```

由于手机号重复，PostgreSQL 出现如下错误：

```text
ERROR:  duplicate key value violates unique constraint "idx_staff_mobile_phone"
DETAIL:  Key (mobile_phone)=(13333333333) already exists.
```

## UNIQUE 索引 – 多列示例

以下语句将添加两个新列 work_phone 和 extension 到 staff 表中：

```sql
ALTER TABLE staff
ADD work_phone VARCHAR(20),
ADD extension VARCHAR(5);
```

多个员工可以共享同一个工作电话号码。但是，它们不能具有相同的分机号码。要强制执行此规则，您可以在 work_phone 和 extension 列上定义 `UNIQUE` 索引：

```sql
CREATE UNIQUE INDEX idx_staff_workphone
ON staff(work_phone, extension);
```

要测试这个索引，首先在 staff 表中插入一行：

```sql
INSERT INTO staff(first_name, last_name, work_phone, extension)
VALUES('Lily', 'Bush', '1234567','3564');
```

其次，插入另一个具有相同工作电话号码但分机号不同的员工：

```sql
INSERT INTO staff(first_name, last_name, work_phone, extension)
VALUES('Joan', 'Doe', '1234567','3565');
```

该语句有效，因为 work_phone 和 extension 列中的值组合是唯一的

第三，尝试在 staff 表中的 work_phone 和 extension 列中插入具有相同值的行：

```sql
INSERT INTO staff(first_name, last_name, work_phone, extension)
VALUES('Tommy', 'Stark', '1234567','3565');
```

PostgreSQL 发出以下错误：

```text
ERROR:  duplicate key value violates unique constraint "idx_staff_workphone"
DETAIL:  Key (work_phone, extension)=(1234567, 3565) already exists.
```