---
category: IT
tag: 数据库
order: 7
article: false
---

# 备份与恢复

PostgreSQL 提供了 pg_dump 和 pg_dumpall 工具，帮助您轻松地备份数据库，同时，PostgreSQL 提供了 pg_restore 工具，帮助您轻松的恢复数据库

备份数据库的工具或命令：

- pg_dump 工具用于备份单个 PostgreSQL 数据库

- pg_dumpall 工具用于备份 PostgreSQL 服务器中的所有的数据库

恢复数据库的工具或命令：

- pg_restore 工具用于恢复由 pg_dump 工具产生的 tar 文档和目录文档

- psql 工具可以导入 pg_dump 和 pg_dumpall 工具产生的 SQL 脚本文件

- `\i` 命令可以导入 pg_dump 和 pg_dumpall 工具产生的 SQL 脚本文件

---

## 使用 pg_dump 备份一个数据库

PostgreSQL 自带了 pg_dump 工具用于备份单个 PostgreSQL 数据库。以下是一个常用的备份命令：

```shell
pg_dump -U username -W -F t db_name > output.tar
```

说明：

- -U username: 指定连接 PostgreSQL 数据库服务器的用户。您可以在 username 位置使用自己的用户名

- -W : 强制 pg_dump 在连接到 PostgreSQL 数据库服务器之前提示输入密码。按回车后，pg_dump 会提示输入 postgres 用户密码

- -F : 指定输出文件的格式，它可以是以下格式之一：
    - c：自定义格式
    - d：目录格式存档
    - t：tar 文件包
    - p：SQL 脚本文件

- db_name 是要备份的数据库的名字

- output.tar 是输出文件的路径

如果您在命令行或者终端工具中运行命令是提示找不到 pg_dump 工具，请先导航到 PostgreSQL bin 文件夹目录路径

```shell
C:\Users\MW>cd C:\Program Files\PostgreSQL\15\bin
```

## 使用 pg_dumpall 备份所有数据库

除了 pg_dump 工具，PostgreSQL 还提供了可以一次备份所有数据库的 pg_dumpall 工具备份。pg_dumpall 工具的用法如下：

```shell
pg_dumpall -U username > output.sql
```

## 使用 pg_restore 恢复数据库

PostgreSQL 提供了 pg_restore 工具用于恢复由 pg_dump 工具产生的 tar 文档和目录文档。pg_restore 工具的用法如下：

```shell
pg_restore [option...] file_path
```

说明：

- file_path 是要恢复的文件或者目录的路径

- option 是一些恢复数据时用到的参数，比如，数据库，主机，端口 等

::: details 您可以使用如下选项
|                                参数                                |                            说明                            |
|:----------------------------------------------------------------:|:--------------------------------------------------------:|
|                          -a --data-only                          |                   	只恢复数据，而不恢复表模式（数据定义）                   |
|                            -c --clean                            |                    创建数据库对象前先清理（删除）它们                     |
|                           -C --create                            |                       在恢复数据库之前先创建它                       |
|                    -d dbname --dbname=dbname                     |                与数据库 dbname 联接并且直接恢复到该数据库中                |
|                        -e --exit-on-error                        | 如果在向数据库发送 SQL 命令的时候碰到错误，则退出<br/>缺省是继续执行并且在恢复 结束时显示一个错误计数 |
|                   -f filename --file=filename                    |          声明生成的脚本的输出文件，或者出现-l 选项时用于列表的文件，缺省是标准输出          |
|                    -F format --format=format                     |                        声明备份文件的格式                         |
|                       -i --ignore-version                        |                        忽略数据库版本检查                         |
|                      -I index --index=index                      |                        	只恢复命名的索引                         |
|                            -l --list                             |           列出备份的内容。这个操作的输出可以用 -L 选项限制和重排所恢复的项目            |
|                -L list-file --use-list=list-file                 |            只恢复在 list-file 里面的元素，以它们在文件中出现的顺序             |
|                   -n namespace --schema=schema                   |    只恢复指定名字的模式里面的定义和/或数据。不要和 -s 选项混淆。这个选项可以和 -t 选项一起使用    |
|                          -O --no-owner                           |                不要输出设置对象的权限，以便与最初的数据库匹配的命令                |
|                         -s --schema-only                         |                只恢复表结构（数据定义）。不恢复数据，序列值将重置                 |
|                 -S username --superuser=username                 |   设置关闭触发器时声明超级用户的用户名。只有在设置了 –disable-triggers 的时候 才有用    |
|                      -t table --table=table                      |                    	只恢复表指定的表的定义和/或数据                     |
|                   -T trigger --trigger=trigger                   |                        只恢复指定的触发器                         |
|                           -v --verbose                           |                          声明冗余模式                          |
|                   -x --no-privileges --no-acl                    |               避免 ACL 的恢复（grant/revoke 命令）                |
| -X use-set-session-authorization --use-set-session-authorization | 输出 SQL 标准的 SET SESSION AUTHORIZATION 命令，而不是 OWNER TO 命令  |
|              -X disable-triggers --disable-triggers              |                   这个选项只有在执行仅恢复数据的时候才相关                   |
|                       -h host --host=host                        |                      声明服务器运行的机器的主机名                      |
|                       -p port --port=port                        |            声明服务器侦听的 TCP 端口或者本地的 Unix 域套接字文件扩展            |
|                           -U username                            |                        以给出用户身分联接                         |
|                                -W                                |             强制给出口令提示。如果服务器要求口令认证，那么这个应该自动发生              |
:::

最常用的 pg_restore 用法如下：

```shell
pg_restore -d db_name path_to_db_backup_file.tar
```

## 使用 psql 恢复数据库

您可以使用 psql 工具从一个 sql 文件中恢复数据。 以下是使用 psql 从 sql 文件恢复数据的基本用法：

```shell
psql -U username -f path_to_db_backup_file.sql
```