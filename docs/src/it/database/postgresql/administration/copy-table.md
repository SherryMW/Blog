---
category: IT
tag: 数据库
order: 6
article: false
---

# 复制表

要将已有的 table_name 表复制为新表 new_table，包括表结构和数据，请使用以下语句：

```sql
CREATE TABLE new_table AS TABLE table_name;
```

如果仅复制表结构，不复制数据，请在以上 `CREATE TABLE` 语句中添加 `WITH NO DATA` 子句，如下所示：

```sql
CREATE TABLE new_table AS TABLE table_name WITH NO DATA ;
```

---

您还可以使用 `CREATE TABLE ... AS SELECT ...` 语句复制一个表。这种方法可以复制部分数据到新表中

要将已有的 table_name 表复制为新表 new_table，包括表结构和数据，请使用以下语句：

```sql
CREATE TABLE new_table AS SELECT * FROM table_name;
```

如果您只需要复制部分满足条件的数据，请在 [SELECT](../basic/select.md) 语句中添加 [WHERE](../basic/where.md) 子句，如下：

```sql
CREATE TABLE new_table AS SELECT * FROM table_name WHERE contidion;
```

如果您只需要复制部分列到新表，请在 [SELECT](../basic/select.md) 语句中指定要复制的列的列表，如下：

```sql
CREATE TABLE new_table AS SELECT column1, column2, ... FROM table_name WHERE contidion;
```

如果您只需要复制表结构，请按如下方式使用 [WHERE](../basic/where.md) 子句：

```sql
CREATE TABLE new_table AS SELECT * FROM table_name WHERE 1 = 2;
```

---

您还可以使用 `SELECT INTO` 语句将已有的 table_name 表复制为新表 new_table，请使用以下语法：

```sql
SELECT * INTO new_table FROM table_name;
```

如果您只需要复制部分满足条件的数据，请添加 [WHERE](../basic/where.md) 子句，如下：

```sql
SELECT * INTO new_table FROM table_name WHERE contidion;
```

如果您只需要复制部分列到新表，请在 [SELECT](../basic/select.md) 语句中指定要复制的列的列表，如下：

```sql
SELECT column1, column2, ... INTO new_table FROM table_name WHERE contidion;
```

注意：这几种方法只能复制列的定义和数据，都不能将索引复制过去