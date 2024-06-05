---
category: IT
tag: 数据库
order: 5
article: false
---

# 查看表

要查看数据库中所有关联列表，请使用 `\d` 命令

```shell
\d
```

```text
                   关联列表
 架构模式 |     名称      |  类型  |  拥有者
----------+---------------+--------+----------
 public   | car           | 数据表 | postgres
 public   | car_id_seq    | 序列数 | postgres
 public   | person        | 数据表 | postgres
 public   | person_id_seq | 序列数 | postgres
```

如果要查看更详细的关联列表信息，请使用 `\d+` 命令

```shell
\d+
```

```text
                                       关联列表
 架构模式 |     名称      |  类型  |  拥有者  | 持续的 | 访问方法 |    大小    | 描述
----------+---------------+--------+----------+--------+----------+------------+------
 public   | car           | 数据表 | postgres | 永久的 | heap     | 88 kB      |
 public   | car_id_seq    | 序列数 | postgres | 永久的 |          | 8192 bytes |
 public   | person        | 数据表 | postgres | 永久的 | heap     | 128 kB     |
 public   | person_id_seq | 序列数 | postgres | 永久的 |          | 8192 bytes |
```

---

要查看一张表的结构或定义，比如 person 表的列，约束等信息，请使用如下命令：

```shell
\d person
```

```text
                                        数据表 "public.person"
       栏位       |          类型          | 校对规则 |  可空的  |                预设
------------------+------------------------+----------+----------+------------------------------------
 id               | bigint                 |          | not null | nextval('person_id_seq'::regclass)
 first_name       | character varying(50)  |          | not null |
 last_name        | character varying(50)  |          | not null |
 email            | character varying(150) |          |          |
 gender           | character varying(12)  |          | not null |
 date_of_birth    | date                   |          | not null |
 country_of_birth | character varying(50)  |          |          |
 car_id           | bigint                 |          |          |
索引：
    "person_pkey" PRIMARY KEY, btree (id)
```

如果要查看数据表的更多相关信息，请使用如下命令：

```shell
\d+ person
```

```text
                                                          数据表 "public.person"
       栏位       |          类型          | 校对规则 |  可空的  |                预设                |   存储   | 压缩 | 统计目标 | 描述
------------------+------------------------+----------+----------+------------------------------------+----------+------+----------+------
 id               | bigint                 |          | not null | nextval('person_id_seq'::regclass) | plain    |      |          |
 first_name       | character varying(50)  |          | not null |                                    | extended |      |          |
 last_name        | character varying(50)  |          | not null |                                    | extended |      |          |
 email            | character varying(150) |          |          |                                    | extended |      |          |
 gender           | character varying(12)  |          | not null |                                    | extended |      |          |
 date_of_birth    | date                   |          | not null |                                    | plain    |      |          |
 country_of_birth | character varying(50)  |          |          |                                    | extended |      |          |
 car_id           | bigint                 |          |          |                                    | plain    |      |          |
索引：
    "person_pkey" PRIMARY KEY, btree (id)
访问方法 heap
```

---

information_schema 是一个系统级的 Schema, 其中提供了一些视图可以查看表、列、索引、函数等信息，该 information_schema.columns 目录包含有关所有表的列的信息。以下语句从 information_schema.columns 中查询 person 表的所有的列：

```shell
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'person';
```

```text
   column_name    |     data_type     |           column_default
------------------+-------------------+------------------------------------
 id               | bigint            | nextval('person_id_seq'::regclass)
 date_of_birth    | date              |
 car_id           | bigint            |
 email            | character varying |
 gender           | character varying |
 country_of_birth | character varying |
 first_name       | character varying |
 last_name        | character varying |
```