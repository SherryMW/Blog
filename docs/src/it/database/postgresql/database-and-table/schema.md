---
category: IT
tag: 数据库
order: 22
article: false
---

# 架构

PostgreSQL 允许您在一个数据库中创建多个架构 `Schema`。`Schema` 相当于一个组，您可以根据自己的需要将不同的表放在不同的 `Schema` 下

您可以利用它来实现以下几个方面的用途：

1. 对象组织与管理：创建新的结构后，您可以将相关的数据库对象（如表、视图、函数等）组织在同一个结构下。这样可以更好地组织和管理数据库对象，使其具有更清晰的层次结构，方便开发和维护

2. 命名空间隔离：每个结构都提供了一个独立的命名空间，其中的对象具有唯一的名称。这意味着您可以在不同的结构下创建具有相同名称的对象，而不会发生冲突。这对于在同一数据库中使用多个模块或应用程序的情况非常有用

3. 权限控制：结构级别的权限控制允许您更细粒度地控制对数据库对象的访问权限。您可以授予或撤销用户对特定结构的访问权限，从而限制他们对该结构中对象的操作

4. 模块化开发：通过在不同的结构下创建对象，可以实现模块化开发。每个模块可以拥有自己的结构，并在其内部创建和管理对象。这样可以提高代码的可维护性和可重用性，并简化多人协作开发的管理

5. 数据分区和管理：结构可以用于实现数据库的分区和数据管理。您可以根据不同的业务需求，将数据分布在不同的结构下，以便更好地管理和查询特定的数据子集

## 创建架构

要在当前数据库中创建新的架构，您必须在当前数据库中具有 `CREATE` 权限。请按照如下语法使用 `CREATE SCHEMA` 语句：

```sql
CREATE SCHEMA [IF NOT EXISTS] schema_name
[AUTHORIZATION role_name];
```

- CREATE SCHEMA 语句用于在当前数据库中创建一个新的架构

- schema_name 是架构的名称。它在同一个数据库中应该是唯一的

- IF NOT EXISTS 是可选的。它只是只有在指定的架构名称不存在时才创建新的架构。如果不使用此选项且指定的架构存在，PostgreSQL 将给出一个错误

- AUTHORIZATION role_name 子句用于为指定的角色/用户创建架构

要在架构中创建一个表，请使用 `CREATE TABLE` 语句，表名采用 schema_name.table_name 的格式，如下：

```sql
CREATE TABLE schema_name.table_name
(...)
```

如果您省略了架构名 schema_name，则使用默认的架构 publish

如果要使用架构中的表，表名采用 schema_name.table_name 的格式，如下：

```sql
SELECT * FROM schema_name.table_name;
```

## 重命名架构

如果要重命名现有的架构，请使用 `ALTER SCHEMA` 语句，如下：

```sql
ALTER SCHEMA schema_name
RENAME TO new_name;
```

- schema_name 是架构的名字

- new_name 是架构的新名字

## 修改架构所有者

如果要修改一个架构的所有人，请使用 `ALTER SCHEMA` 语句，如下：

```sql
ALTER SCHEMA schema_name
OWNER TO { new_owner | CURRENT_USER | SESSION_USER};
```

- schema_name 是架构的名字

- new_owner 是架构的新的所有者/角色

## 删除架构

如果要删除一个架构，请使用 `DROP SCHEMA` 语句，如下：

```sql
DROP SCHEMA [IF EXISTS] schema_name
[ CASCADE | RESTRICT ];
```

- schema_name 是架构的名字

- `IF EXISTS` 是可选的，它指示只有在指定的架构存在时才进行删除，如果不存在，不返回错误

- `RESTRICT` 指示只有在架构为空的时候才能删除，它是默认的。`CASCADE` 指示删除架构和其中的对象，以及对象依赖的对象