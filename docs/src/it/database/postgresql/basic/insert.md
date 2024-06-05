---
category: IT
tag: 数据库
order: 1
article: false
---

# INSERT

在 PostgreSQL 中， INSERT 语句用于向数据表中插入一个或多个新行

## INSERT 语法

要使用 PostgreSQL `INSERT` 向表中插入新行，请使用如下的语法：

```sql
INSERT INTO table_name(column1, column2, ...)
VALUES
  (value11, value12, ...) [, (value21, value22, ...), ...]
[ON CONFLICT conflict_target conflict_action]
[RETURNING expr];
```

- `INSERT INTO` 和 `VALUES` 是关键字

- table_name 是要插入数据行的表名

- (column1, column2, ...) 是列列表，其中是通过逗号分隔的各个列

- (value11, value12, ...) 是值列表，其中是通过逗号分隔的各个列的值。值列表中的值于列列表中的列一一对应

- 要一次插入多个数据行，请使用多个使用逗号分隔的值列表

- `ON CONFLICT` 用来在 PostgreSQL 中实现 upsert 操作

- `RETURNING` 子句是可选的。它用于返回插入的行的信息。expr 可以是列名，或表达式等

### RETURNING 子句

`INSERT` 语句中有一个可选的 `RETURNING` 子句，用于返回插入行的信息。如果具有 `RETURNING` 子句时，`INSERT` 语句按照 `RETURNING` 子句返回，否则它返回成功插入的行数

`RETURNING` 子句可采用以下几种形式：

- 返回指定的列，请使用列表。多个列使用逗号分隔

   ```sql
   RETURNING column1
   RETURNING column1, column2
   ```

  您还可以使用 `AS` 对列名指定别名：

   ```sql
   RETURNING column1 AS column1_new_1
   RETURNING column1 AS column1_new_1, column2 AS column1_new_2
   ```

- 返回新行的所有的列，请使用星号 (*)

   ```sql
   RETURNING *
   ```

- 返回一个表达式计算的值

   ```sql
   RETURNING expr
   ```

### 不带 RETURNING 子句的返回值

没有指定 `RETURNING` 子句的 `INSERT` 语句的返回值具有一下形式：

```sql
INSERT oid count
```

- oid 是一个对象标识符。PostgreSQL 在内部将 oid 用作其系统表的主键。通常 `INSERT` 语句返回 oid 值为 0

- count 是 `INSERT` 语句成功插入的行数

## INSERT 示例

我们要在 testdb 数据库中演示这个示例。请先使用下面的 SQL 语句创建数据库 testdb：

```sql
CREATE DATABASE testdb;
```

选择 testdb 数据库为当前数据库：

```shell
\c testdb;
```

为了演示，我们需要创建一个新表，命名为 student：

```sql
DROP TABLE IF EXISTS student;
CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  gender CHAR(1) NOT NULL,
  birthday DATE,
  notes VARCHAR(255)
);
```

### 向表中插入单行

以下语句向 student 表中插入一个新行：

```sql
INSERT INTO student(name, gender)
VALUES ('Tom', 'M');
```

语句返回以下输出：

```text
INSERT 0 1
```

这里，`INSERT 0 1` 中的 1 表示已经成功插入一行

让我们使用以下 [SELECT](./select.md) 语句显示 student 表的内容：

```sql
SELECT * FROM student;
```

```text
 id | name | gender | birthday | notes
----+------+--------+----------+-------
  1 | Tom  | M      |          |
```

id 列的值为 1。这是因为 id 列为 [SERIAL](../database-and-table/serial.md) 列，PostgreSQL 会自动生成一个序列值

birthday 和 notes 列的值为 NULL。因为他们没有 [NOT NULL](../database-and-table/not-null.md) 约束，PostgreSQL 使用 NULL 插入到这些列中

### 向表中插入单行并指定返回值

以下语句向 student 表中插入一个新行并返回插入的行：

```sql
INSERT INTO student(name, gender)
VALUES ('Lucy', 'F')
RETURNING *;
```

语句返回以下输出：

```text
 id | name | gender | birthday | notes
----+------+--------+----------+-------
  2 | Lucy | F      |          |
```

这里，由于 `INSERT` 语句带有 `RETURNING *` 子句，因此语句返回了插入的新行中的所有列。如果我们只想返回其中的一列或者几列，请在 `RETURNING` 子句指定具体的列。如下：

```sql
INSERT INTO student(name, gender)
VALUES ('Jack', 'M')
RETURNING id AS "Student ID", name, gender;
```

语句返回以下输出：

```text
 Student ID | name | gender
------------+------+--------
          3 | Jack | M
```

这里，我们在 `RETURNING` 子句指定了 id, name 和 gender 三列，并且为 id 指定了别名 Student ID

### 向表中插入多行

我们可以使用一个 `INSERT` 语句插入多行记录，如下：

```sql
INSERT INTO student(name, gender)
VALUES ('Jim', 'M'), ('Kobe', 'M'), ('Linda', 'F')
RETURNING *;
```

语句返回以下输出：

```text
 id | name  | gender | birthday | notes
----+-------+--------+----------+-------
  4 | Jim   | M      |          |
  5 | Kobe  | M      |          |
  6 | Linda | F      |          |
```

这里，我们使用一个 `INSERT` 语句向 student 表中插入了 3 行

### 插入日期值

要将日期值插入具有 [DATE](../data-type/date.md) 类型的列中，请使用格式为 'YYYY-MM-DD' 的日期字符串

要向 student 表中插入一行带有生日的数据，请使用下面的语句：

```sql
INSERT INTO student (name, gender, birthday)
VALUES('Alice', 'F', '2012-04-21')
RETURNING *;
```

```text
 id | name  | gender |  birthday  | notes
----+-------+--------+------------+-------
  7 | Alice | F      | 2012-04-21 |
```