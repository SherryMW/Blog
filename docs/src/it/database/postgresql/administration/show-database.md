---
category: IT
tag: 数据库
order: 2
article: false
---

# 查看数据库

要查看当前 PostgreSQL 数据库服务器中的所有数据库，请使用 `\l` 命令

```postgresql
\l
```

```text
数据库列表
   名称    |  拥有者  | 字元编码 |            校对规则            |             Ctype              | ICU Locale | Locale Provider |       存取权限
-----------+----------+----------+--------------------------------+--------------------------------+------------+-----------------+-----------------------
 postgres  | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            |
 template0 | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            | =c/postgres          +
           |          |          |                                |                                |            |                 | postgres=CTc/postgres
 template1 | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            | =c/postgres          +
           |          |          |                                |                                |            |                 | postgres=CTc/postgres
```

如果要查看更多关于数据库的信息，请使用 `\l+` 命令

```postgresql
\l+
```

```text
   名称    |  拥有者  | 字元编码 |            校对规则            |             Ctype              | ICU Locale | Locale Provider |       存取权限        |  大小   |   表空间   |                    描述
-----------+----------+----------+--------------------------------+--------------------------------+------------+-----------------+-----------------------+---------+------------+--------------------------------------------
 postgres  | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            |                       | 7453 kB | pg_default | default administrative connection database
 template0 | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            | =c/postgres          +| 7297 kB | pg_default | unmodifiable empty database
           |          |          |                                |                                |            |                 | postgres=CTc/postgres |         |            |
 template1 | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |            | libc            | =c/postgres          +| 7453 kB | pg_default | default template for new databases
           |          |          |                                |                                |            |                 | postgres=CTc/postgres |         |            |
```

除了 `\l` 和 `\l+` 命令，您还可以从 pg_database 表中查询所有的数据库

pg_database 表是 PostgreSQL 内置表，它存储了所有的数据库

```postgresql
SELECT datname FROM pg_database;
```

```text
  datname
-----------
 postgres
 template1
 template0
```