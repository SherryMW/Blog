---
category: IT
tag: 数据库
order: 9
article: false
---

# 重建索引

当索引被损坏或者包含错误的数据时，您可以重建索引。PostgreSQL 提供 `REINDEX` 语句用来重建一个或多个索引

## REINDEX 语法

这里是 PostgreSQL REINDEX 语句的语法：

```sql
REINDEX
  [ ( VERBOSE ) ]
  [ ( CONCURRENTLY [ boolean ] ) ]
  [ ( TABLESPACE new_tablespace ) ]
  { INDEX | TABLE | SCHEMA | DATABASE | SYSTEM } name;
```

- `VERBOSE` 关键字是可选的。如果提供此关键字，重建索引时将会显示进度

- `CONCURRENTLY` 关键是可选的。它指示 PostgreSQL 在重建索引时，不需要阻止任何表上的操作

- `TABLESPACE` new_tablespace 是可选的。它指示 PostgreSQL 在新的表空间重建索引

- `{ INDEX | TABLE | SCHEMA | DATABASE | SYSTEM }` 用来指定重建的索引对象

    - `INDEX`：重建指定的索引

    - `TABLE`：重建指定的表中的所有的索引

    - `SCHEMA`：重建指定的 Schema 中的所有的索引

    - `DATABASE`：重建指定的数据库中的所有的索引

    - `SYSTEM`：重建指定的数据库的系统目录中的所有的索引

- name 指定对象的名字

下面是一些具体的用法：

- 要重建单个索引，请使用 `INDEX` 关键字并指定索引名称：

    ```sql
    REINDEX INDEX index_name;
    ```

- 要重建一个表中的所有索引，请使用 `TABLE` 关键字并指定表的名称：

    ```sql
    REINDEX TABLE table_name;
    ```

- 要重建一个架构中的所有索引，请使用 `SCHEMA` 关键字并指定架构的名称：

    ```sql
    REINDEX SCHEMA schema_name;
    ```

- 要重建一个数据库中的所有索引，请使用 `DATABASE` 关键字并指定数据库名称：

    ```sql
    REINDEX DATABASE database_name;
    ```

- 要重建一个数据中的系统目录上的所有索引，请使用 `SYSTEM` 关键字并指定数据库名称：

    ```sql
    REINDEX SYSTEM database_name;
    ```

## REINDEX 与 DROP INDEX&CREATE INDEX

重建索引的过程相当于先删掉索引在新建相同定义的索引。也就是说： `REINDEX` 相当于 `DROP INDEX` 和 `CREATE INDEX` 语句的组合。它他们之间也有一些不同之处：

- `REINDEX` 语句：

    - 锁定索引所属表的写入但不锁定读取

    - 对正在处理的索引进行排他锁，这会阻止尝试使用该索引的读取。除非您指定 `CONCURRENTLY` 关键字

- `DROP INDEX` 和 `CREATE INDEX` 语句：

    - `DROP INDEX` 通过获取表上的排他锁来锁定索引所属表的写入和读取

    - `CREATE INDEX` 语句会锁定索引的父表中的写入但不锁定读取。但是，在创建索引期间读取可能会很昂贵