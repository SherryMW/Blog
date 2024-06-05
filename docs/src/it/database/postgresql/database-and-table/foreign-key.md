---
category: IT
tag: 数据库
order: 11
article: false
---

# 外键

在关系数据库中，外键用来定义两个实体之间的约束关系。外键对保证数据的完整性很有用

外键相对于主键而言，用来引用其他表。外键在子表中定义，它将子表的一个或多个列对应到父表的主键或唯一键值，将子表的行和父表行建立起关联关系

让我们看一下 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 中的 country 表和 city 表。下面是它们的关系图：

![](https://img.sherry4869.com/blog/it/database/postgresql/img_12.svg)

以下是 country 表中的部分数据：

```sql
SELECT *
FROM country
WHERE country_id = 23;
```

```text
 country_id | country |     last_update
------------+---------+---------------------
         23 | China   | 2006-02-15 04:44:00
```

以下是 city 表中的部分数据：

```sql
SELECT *
FROM city
WHERE country_id = 23;
```

```text
 city_id |     city      | country_id |     last_update
---------+---------------+------------+---------------------
      46 | Baicheng      |         23 | 2006-02-15 04:45:25
      47 | Baiyin        |         23 | 2006-02-15 04:45:25
      80 | Binzhou       |         23 | 2006-02-15 04:45:25
     109 | Changzhou     |         23 | 2006-02-15 04:45:25
     136 | Datong        |         23 | 2006-02-15 04:45:25
...
(53 行记录)
```

由此我们看出，country 表和 city 表是一对多的关系。一个国家中可以有多个城市，一个城市只能位于一个国家

如果一个国家已经有了城市，那么你就不能轻易的从 country 表删除国家，否则就会造成对应的城市数据的不完整。你也不能为一个城市设定一个不存在的 country_id，否则这个城市数据就是错误的

外键约束能保证数据的完整和正确

通常，外键所属的表被称作子表，被外键引用的表被称作父表

## 外键的语法

### 创建表时添加外键

要在创建表时添加外键，请使用以下语法：

```sql
CREATE TABLE table_name (
  column_defination_1,
  ...
  [CONSTRAINT foreign_key_name]
    FOREIGN KEY (column)
      REFERENCES parent_table_name (column)
      ON UPDATE ...
      ON DELETE ...
;
);
```

- foreign_key_name 是外键约束的名字。`CONSTRAINT foreign_key_name` 是可选的

- `FOREIGN KEY (column)` 指明了表中的 column 列是外键

- `REFERENCES parent_table_name (column)` 指明了外键引用了 parent_table_name 表中的 column 列

- `ON DELETE` 和 `ON UPDATE` 指定了删除或更新父表中的行时要采取的约束策略。你可以使用以下 5 个策略中的一个：

    - `NO ACTION`：这是默认的策略

    - `RESTRICT`：如果父表中的一行在该表中有匹配的行，试图删除或更新父表中行时会引发 PostgreSQL 错误

    - `CASCADE`：如果父表中的一行被删除或更新，该表中匹配行的值会自动删除或更新

    - `SET NULL`：如果父表中的一行被删除或更新，该表中匹配行的值设置为 NULL

    - `SET DEFAULT`：如果父表中的一行被删除或更新，该表中匹配行的值设置为默认值

让我们看一下 city 表定义的外键约束：

```shell
\d city
```

```text
                                           Table "public.city"
   Column    |            Type             | Collation | Nullable |                Default
-------------+-----------------------------+-----------+----------+---------------------------------------
 city_id     | integer                     |           | not null | nextval('city_city_id_seq'::regclass)
 city        | character varying(50)       |           | not null |
 country_id  | smallint                    |           | not null |
 last_update | timestamp without time zone |           | not null | now()
Indexes:
    "city_pkey" PRIMARY KEY, btree (city_id)
    "idx_fk_country_id" btree (country_id)
Foreign-key constraints:
    "city_country_id_fkey" FOREIGN KEY (country_id) REFERENCES country(country_id) ON UPDATE CASCADE ON DELETE RESTRICT
Referenced by:
    TABLE "address" CONSTRAINT "address_city_id_fkey" FOREIGN KEY (city_id) REFERENCES city(city_id) ON UPDATE CASCADE ON DELETE RESTRICT
Triggers:
    last_updated BEFORE UPDATE ON city FOR EACH ROW EXECUTE FUNCTION last_updated()
```

注意其中外键的部分：

```text
Foreign-key constraints:
    "city_country_id_fkey" FOREIGN KEY (country_id) REFERENCES country(country_id) ON UPDATE CASCADE ON DELETE RESTRICT
```

### 添加外键语法

如果建表的时候没有定义外键，你也可以后来通过以下语法添加外键：

```sql
ALTER TABLE child_table_name
ADD [CONSTRAINT foreign_key_name]
  FOREIGN KEY (column)
    REFERENCES parent_table_name (column)
    ON UPDATE ...
    ON DELETE ...
;
```

- 使用 `ALTER TABLE` 语句修改表的定义

- 使用 `ADD [CONSTRAINT foreign_key_name]` 添加一个名为 foreign_key_name 的约束。`[CONSTRAINT foreign_key_name]` 是可选的

- 使用 `FOREIGN KEY (column)) REFERENCES parent_table_name (column)` 定义了外键

### 删除外键语法

要删除表上外键，可以采用下面的语法：

```sql
ALTER TABLE table_name
DROP CONSTRAINT constraint_name;
```

- 使用 `ALTER TABLE` 语句修改表的定义

- `DROP CONSTRAINT` 后面指定约束名。它可以通过名字删除任何约束，并不仅仅是外键

## FOREIGN KEY 示例

以下实例将在 testdb 数据库中创建 users 和 user_hobbies 两个表。其中，user_hobbies 表中使用外键引用 users 表。下面先创建 users 表，user_hobbies 表将在后面的实例中根据各自的情况再创建。请按照如下步骤执行：

1. 使用 postgres 用户登录 PostgreSQL 数据库：

    ```text
    C:\Users\MW>psql -U postgres
    用户 postgres 的口令:
    psql (15.2)
    输入 "help" 来获取帮助信息.
    
    postgres=#
    ```
    
    注意：您也可以使用其他任何具有相应的数据库权限的用户登录

2. 使用以下语句连接 testdb 数据库：

    ```shell
    \c testdb
    ```
    
    如果还未创建数据库，请先运行如下语句：
    
    ```sql
    CREATE DATABASE testdb;
    ```

3. 使用以下语句创建 users 表：

    ```sql
    CREATE TABLE users (
      user_id INTEGER NOT NULL,
      name VARCHAR(45) NOT NULL,
      PRIMARY KEY (user_id)
    );
    ```
    
    至此，我们创建了 users 表

### CASCADE 策略示例

如果外键的 `ON DELETE` 和 `ON UPDATE` 使用了 `CASCADE` 策略：

- 当父表的行被删除的时候，子表中匹配的行也会被删除

- 当父表的行的键值更新的时候，子表中匹配的行的字段也会被更新

使用以下 SQL 创建 user_hobbies 表，它的外键采用 `CASCADE` 策略

```sql
DROP TABLE IF EXISTS user_hobbies;
CREATE TABLE user_hobbies (
  hobby_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  hobby VARCHAR(45) NOT NULL,
  PRIMARY KEY (hobby_id),
  FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

向两个表中插入数据：

```sql
DELETE FROM users;
DELETE FROM user_hobbies;
INSERT INTO users (user_id, name)
VALUES (1, 'Tim');
INSERT INTO user_hobbies (hobby_id, user_id, hobby)
VALUES (1, 1, 'Football'), (2, 1, 'Swimming');
```

此时 user_hobbies 表中的数据：

```text
 hobby_id | user_id |  hobby
----------+---------+----------
        1 |       1 | Football
        2 |       1 | Swimming
```

让我们看一下对父表进行 `UPDATE` 和 `DELETE` 操作引起的子表的关联操作：

- 对父表进行 `UPDATE` 操作

    我们将父表 users 中的键 user_id 的值从 1 修改为 100：
    
    ```sql
    UPDATE users
    SET user_id = 100
    WHERE user_id = 1;
    ```
    
    此时 user_hobbies 表中的数据：
    
    ```text
     hobby_id | user_id |  hobby
    ----------+---------+----------
            1 |     100 | Football
            2 |     100 | Swimming
    ```
    
    我们发现，user_hobbies 表中与 users 表中 user_id 列中的 1 被自动修改为 100

- 对父表进行 `DELETE` 操作

    ```sql
    DELETE FROM users
    WHERE user_id = 100;
    ```
    
    此时 user_hobbies 表中的数据：
    
    ```text
     hobby_id | user_id | hobby
    ----------+---------+-------
    ```
    
    我们发现，user_hobbies 表中与 users 表中 user_id = 100 的那些行都被删除了

### RESTRICT 策略

如果外键的 `ON DELETE` 和 `ON UPDATE` 使用了 `RESTRICT` 策略：

- PostgreSQL 禁止删除父表中与子表匹配的行

- PostgreSQL 禁止删除父表中与子表匹配的行的键的值

使用以下 SQL 创建 user_hobbies 表，它的外键采用 `RESTRICT` 策略

```sql
DROP TABLE IF EXISTS user_hobbies;
CREATE TABLE user_hobbies (
  hobby_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  hobby VARCHAR(45) NOT NULL,
  PRIMARY KEY (hobby_id),
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
);
```

向两个表中插入数据：

```sql
DELETE FROM users;
DELETE FROM user_hobbies;
INSERT INTO users (user_id, name)
VALUES (1, 'Tim');
INSERT INTO user_hobbies (hobby_id, user_id, hobby)
VALUES (1, 1, 'Football'), (2, 1, 'Swimming');
```

此时 user_hobbies 表中的数据：

```text
 hobby_id | user_id |  hobby
----------+---------+----------
        1 |       1 | Football
        2 |       1 | Swimming
(2 行记录)
```

让我们看一下对父表进行 `UPDATE` 和 `DELETE` 操作的结果：

- 对父表进行 `UPDATE` 操作

    ```sql
    UPDATE users
    SET user_id = 100
    WHERE user_id = 1;
    ```
    
    PostgreSQL 服务器返回了如下的错误：
    
    ```text
    ERROR:  update or delete on table "users" violates foreign key constraint "user_hobbies_user_id_fkey" on table    "user_hobbies"
    DETAIL:  Key (user_id)=(1) is still referenced from table "user_hobbies".
    ```

- 对父表进行 `DELETE` 操作

    ```sql
    DELETE FROM users
    WHERE user_id = 1;
    ```
    
    PostgreSQL 服务器返回了如下的错误：
    
    ```text
    ERROR:  update or delete on table "users" violates foreign key constraint "user_hobbies_user_id_fkey" on table "user_hobbies"
    DETAIL:  Key (user_id)=(1) is still referenced from table "user_hobbies".
    ```

### SET NULL 策略

如果外键的 `ON DELETE` 和 `ON UPDATE` 使用了 `SET NULL` 策略：

- 当父表的行被删除的时候，子表中匹配的行的列的值被设置为 NULL

- 当父表的行的键值被更新的时候，子表中匹配的行的列的值被设置为 NULL

使用以下 SQL 创建 user_hobbies 表，它的外键采用 `SET NULL` 策略

```sql
DROP TABLE IF EXISTS user_hobbies;
CREATE TABLE user_hobbies (
  hobby_id INTEGER NOT NULL,
  user_id INTEGER,
  hobby VARCHAR(45) NOT NULL,
  PRIMARY KEY (hobby_id),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE SET NULL
    ON UPDATE SET NULL
);
```

向两个表中插入数据：

```sql
DELETE FROM users;
DELETE FROM user_hobbies;
INSERT INTO users (user_id, name)
VALUES (1, 'Tim');
INSERT INTO user_hobbies (hobby_id, user_id, hobby)
VALUES (1, 1, 'Football'), (2, 1, 'Swimming');
```

让我们看一下对父表进行 `UPDATE` 和 `DELETE` 操作引起的子表的关联操作：

- 对父表进行 `UPDATE` 操作

    ```sql
    UPDATE users
    SET user_id = 100
    WHERE user_id = 1;
    ```
    
    此时 user_hobbies 表中的数据：
    
    ```text
     hobby_id | user_id |  hobby
    ----------+---------+----------
            1 |  <null> | Football
            2 |  <null> | Swimming
    (2 行记录)
    ```
    
    更新父表中的 user_id 列的值后，user_hobbies 表中那些对应的行的 user_id 列的值被设置为 NULL

- 对父表进行 `DELETE` 操作

    由于上面实例将表的数据修改了，我们重新初始化两个表的数据：
    
    ```sql
    DELETE FROM users;
    DELETE FROM user_hobbies;
    INSERT INTO users (user_id, name)
    VALUES (1, 'Tim');
    INSERT INTO user_hobbies (hobby_id, user_id, hobby)
    VALUES (1, 1, 'Football'), (2, 1, 'Swimming');
    ```
    
    ```sql
    DELETE FROM users
    WHERE user_id = 1;
    ```
    
    ```text
     hobby_id | user_id |  hobby
    ----------+---------+----------
            1 |  <null> | Football
            2 |  <null> | Swimming
    (2 行记录)
    ```
    
    删除父表中的 user_id 列的值后，user_hobbies 表中那些对应的行的 user_id 列的值被设置为 NULL

## 自引用外键

有时，子表和父表可能是同一个表。这种表中的外键被称为自引用外键

通常，自引用外键定义在表示树形数据结构的表中。比如一个代表分类的表：

```sql
CREATE TABLE category (
  category_id INTEGER PRIMARY KEY,
  category_name VARCHAR(45),
  parent_category_id INTEGER,
  CONSTRAINT fk_category FOREIGN KEY (parent_category_id)
    REFERENCES category (category_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
```

在这个表中，parent_category_id 列是一个外键。它引用了 category 表的 category_id 列

这个表实现了一个无限层级的分类树。一个分类可以有多个子分类，一个分类可以有 0 个或者 1 个父类；