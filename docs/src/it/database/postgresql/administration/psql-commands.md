---
category: IT
tag: 数据库
order: 1
article: false
---

# psql 命令

## 连接新的数据库

要使用当前用户连接到新的数据库请使用 `\c` 命令，也可以使用 `\connect` 命令，他们是等效的

```shell
\c postgres
```

要使用新的用户连接到当前数据库，请使用如下命令：

```shell
\c - username
```

## 查看数据库表

要查看当前数据库中的数据表，请使用 `\dt` 命令

```shell
\dt
```

```text
               关联列表
 架构模式 |  名称  |  类型  |  拥有者
----------+--------+--------+----------
 public   | car    | 数据表 | postgres
 public   | person | 数据表 | postgres
```

如果要查看更多关于表的信息，请使用 `\dt+` 命令

```shell
\dt+
```

```text
 架构模式 |  名称  |  类型  |  拥有者  | 持续的 | 访问方法 |  大小  | 描述
----------+--------+--------+----------+--------+----------+--------+------
 public   | car    | 数据表 | postgres | 永久的 | heap     | 88 kB  |
 public   | person | 数据表 | postgres | 永久的 | heap     | 128 kB |
```

除了 `\dt` 和 `\dt+` 命令，您还可以从 pg_tables 表中查询当前数据库中的所有表

pg_tables 表是 PostgreSQL 内置表，它存储了数据库中的所有的表

```sql
SELECT * FROM pg_tables 
WHERE schemaname = 'public';
```

## 查看可用模式

要查看当前连接的数据库的所有模式，请使用 `\dn` 命令

```shell
\dn
```

```text
        架构模式列表
  名称  |      拥有者
--------+-------------------
 public | pg_database_owner
```

## 查看可用的函数

要查看当前数据库中的可用函数，请使用 `\df` 命令

```shell
\df
```

```text
                       函数列表
 架构模式 | 名称 | 结果数据类型 | 参数数据类型 | 类型
----------+------+--------------+--------------+------
```

## 查看可用视图

要查看当前数据库中的可用视图，请使用 `\dv` 命令

```shell
\dv
```

```text
没有找到任何关系.
```

## 查看用户及其角色

要查看所有用户及其分配的角色，请使用 `\du` 命令

```shell
\du
```

```text
                             角色列表
 角色名称 |                    属性                    | 成员属于
----------+--------------------------------------------+----------
 postgres | 超级用户, 建立角色, 建立 DB, 复制, 绕过RLS | {}
```

## 从文件中执行 psql 命令

如果要从文件执行 psql 命令，请使用 `\i` 命令。注意：Windows 上文件路径要使用 `/` 路径符号，例如：

```shell
\i C:/Users/MW/Downloads/person.sql
```

## 开启查询执行时间显示

要打开查询执行时间，请使用 `\timing` 命令

```shell
\timing
```

```text
启用计时功能.
test=# SELECT * FROM person;
...
时间：4.119 ms
```

当您再次运行 `\timing` 命令，则会关闭查询执行时间

```text
postgres=# \timing
启用计时功能.
postgres=# \timing
停止计时功能.
```

## 执行上一条命令

要想执行最近的一条命令， 请使用 `\g` 命令。`\g` 可让你避免重新输入上一条命令

## 查看命令历史

要显示命令历史记录，请使用 `\s` 命令

```shell
\s
```

```text
这个安装不支援命令记录
```

如果要将命令历史保存到文件中，则需要在 `\s` 命令后指定文件名

```shell
\s filename
```

## 开启扩展显示

要为 [SELECT](../basic/select.md) 语句的结果集打开扩展显示，请使用 `\x` 命令

```shell
\x
```

```text
扩展显示已打开.
test=# SELECT * FROM person;
-[ RECORD 1 ]----+------------------------------------
id               | 3
first_name       | Carlo
last_name        | Rawdall
email            | crawdall2@usgs.gov
gender           | Male
date_of_birth    | 2023-02-27
country_of_birth | Brazil
car_id           |
-[ RECORD 2 ]----+------------------------------------
id               | 4
first_name       | Gerek
last_name        | Liston
email            | gliston3@fc2.com
gender           | Male
date_of_birth    | 2023-02-03
country_of_birth | Honduras
car_id           |
```

扩展显示对于显示那些很长的列很有帮助。如果您再次运行 `\x` 命令则回关闭扩展显示

## 获取 SQL 命令的帮助

要获取 SQL 命令的说明，请使用 `\h` 命令

比如，要获取 `TRUNCATE` 的帮助说明，请使用如下的命令：

```shell
\h TRUNCATE
```

```text
命令：       TRUNCATE
描述：       空的数据表或数据表集合
语法：
TRUNCATE [ TABLE ] [ ONLY ] 名称 [ * ] [, ... ]
    [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]

URL: https://www.postgresql.org/docs/15/sql-truncate.html
```

## 获取 psql 命令的帮助

要了解 psql 命令的详细用法，请使用 `\?` 命令

## 退出 psql

要退出 psql，您可以使用 `\q` 命令并按下 Enter 键退出 psql