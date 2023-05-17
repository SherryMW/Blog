---
category: IT
tag: 数据库
order: 4
article: false
---

# 查看空间大小

作为数据库管理者，您经常需要查看数据库的占用空间，这包括 数据库、表、索引和表空间的大小，以便为他们分配合理的存储空间

## PostgreSQL 数据库大小

您可以使用 `pg_database_size()` 函数获取整个数据库的大小。例如，以下语句返回 postgres 数据库的大小：

```sql
SELECT pg_database_size('postgres');
```

```text
 pg_database_size
------------------
          7631663
```

`pg_database_size()` 函数以字节为单位返回数据库的大小，这不容易阅读。您可以使用 `pg_size_pretty()` 函数将字节转为更易于阅读值

```sql
SELECT pg_size_pretty(pg_database_size('postgres'));
```

```text
 pg_size_pretty
----------------
 7453 kB
```

如果您想要获取当前数据库服务器中所有数据库的大小，请使用以下语句：

```sql
SELECT datname, pg_size_pretty(pg_database_size(datname)) AS size FROM pg_database;
```

```text
  datname  |  size
-----------+---------
 postgres  | 7453 kB
 test      | 7917 kB
 template1 | 7453 kB
 template0 | 7297 kB
```

## PostgreSQL 数据表大小

您可以使用 `pg_relation_size()` 函数获取一张数据表的大小

```sql
SELECT pg_size_pretty(pg_relation_size('person'));
```

```text
 pg_size_pretty
----------------
 104 kB
```

`pg_relation_size()` 函数返回表的数据的大小，不包含表中的索引的大小。如果要获取表的总大小，请使用 `pg_total_relation_size()` 函数

```sql
SELECT pg_size_pretty(pg_total_relation_size('person'));
```

```text
 pg_size_pretty
----------------
 168 kB
```

要获取数据库中所有的表的大小，您可以使用如下语句：

```sql
SELECT tablename, pg_size_pretty(pg_total_relation_size('person')) size FROM pg_tables WHERE schemaname = 'public';
```

```text
 tablename |  size
-----------+--------
 car       | 168 kB
 person    | 168 kB
```

## PostgreSQL 索引大小

`pg_indexes_size()` 函数用于获取一个指定表上的索引的大小。例如，要获取 person 表的所有索引的总大小，请使用以下语句：

```sql
SELECT pg_size_pretty(pg_indexes_size('person'));
```

```text
 pg_size_pretty
----------------
 40 kB
```

## PostgreSQL 表空间大小

`pg_tablespace_size()` 函数用于获取一个指定的表空间的大小

```sql
SELECT pg_size_pretty(pg_tablespace_size('pg_default'));
```

```text
 pg_size_pretty
----------------
 30 MB
```

## PostgreSQL 值大小

`pg_column_size()` 函数用于获取指定的值占用的空间，以下语句返回一个 smallint 类型的值的大小：

```sql
SELECT pg_column_size(1::smallint);
```

```text
 pg_column_size
----------------
              2
```

以下语句返回一个 int 类型的值的大小：

```sql
SELECT pg_column_size(1::int);
```

```text
 pg_column_size
----------------
              4
```

以下语句返回一个 bigint 类型的值的大小：

```sql
SELECT pg_column_size(1::bigint);
```

```text
 pg_column_size
----------------
              8
```