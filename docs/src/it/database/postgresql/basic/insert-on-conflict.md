---
category: IT
tag: 数据库
order: 2
article: false
---

# INSERT ON CONFLICT

PostgreSQL `INSERT ON CONFLICT` 语句允许您在插入数据时处理一些数据冲突的情况，用来避免重复插入数据。如果不存在冲突，则正常插入，如果存在冲突，可以更新已有的行。也就是说 `INSERT ON CONFLICT` 语句实现了 upsert 功能

注意：该 `INSERT ON CONFLICT` 语句是在 PostgreSQL 9.5 引入的

## INSERT ON CONFLICT 语法

要在 PostgreSQL 实现 upsert 功能，请使用如下的语法：

```sql
INSERT INTO table_name(column_list)
VALUES(value_list)
ON CONFLICT conflict_target conflict_action
[RETURNING {* | column_names}];;
```

相比较于 [INSERT](./insert.md) 语句来说，`INSERT ON CONFLICT` 只是多了 `ON CONFLICT` 子句

- `INSERT INTO table_name(column_list)` 这个部分是插入数据的基本语法，其中 table_name 表示要插入数据的表的名称，column_list 表示要插入数据的列的列表

- `VALUES(value_list)` 这个部分表示要插入的具体数据，其中 value_list 表示插入的值列表

- `ON CONFLICT conflict_target conflict_action` 这个部分是用于处理插入冲突的语法。其中，conflict_target 是指定冲突检测的列或列组合，可以是列名或列名列表。conflict_action 是指定在发生冲突时要执行的动作，可以是 [UPDATE](./update.mds)（如果存在冲突，使用 `DO UPDATE SET column_1 = value_1, .. WHERE condition` 更新表中的字段）或 `DO NOTHING`（如果存在冲突，不采取任何动作）

- `[RETURNING {* | column_names}]` 这个部分是用于返回插入的数据的。其中，* 表示返回所有列，column_names 表示返回指定的列

## INSERT ON CONFLICT 示例

我们要在 testdb 数据库中演示下面的示例。请先使用下面的语句创建 testdb 数据库：

```sql
CREATE DATABASE testdb;
```

选择 testdb 数据库为当前数据库：

```postgresql
\c testdb;
```

为了演示，我们需要创建一个新表，命名为 users：

```sql
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  login_name VARCHAR(50) UNIQUE,
  notes VARCHAR(255)
);
```

这里，我们创建了一个 users 表，它有 id，nickname，login_name 和 notes 四列，其中 login_name 是一个 [唯一索引](../database-and-table/unique.md) 列

让我们再使用 [INSERT](./insert.md) 语句插入一些行到 users 表：

```sql
INSERT INTO
    users (nickname, login_name, notes)
VALUES
    ('Tim', 'tim', 'This is Tim'),
    ('Tom', 'tom', 'This is Tom');
```

让我们再插入一个新行，其中带有和已有行重复的 login_name：

```sql
INSERT INTO
    users (nickname, login_name, notes)
VALUES
    ('Tim2', 'tim', 'This is Tim2');
```

提示异常信息：

```text
ERROR:  duplicate key value violates unique constraint "users_login_name_key"
DETAIL:  Key (login_name)=(tim) already exists.
```

让我们使用 `INSERT ON CONFLICT` 语句重试一次，以便在存在重复 login_name 时采取一些动作。我们可以采取两种动作：

- 使用 `DO NOTHING` 表示不做任何事情：

   ```sql
   INSERT INTO
      users (nickname, login_name, notes)
   VALUES
      ('Tim2', 'tim', 'This is Tim2')
   ON CONFLICT (login_name) DO NOTHING;
   ```

   ```text
   INSERT 0 0
   ```

  这里，我们使用 `DO NOTHING` 选项。PostgreSQL 没有返回错误

- 使用 `DO UPDATE` 更新其他的字段：

    ```sql
    INSERT INTO
        users (nickname, login_name, notes)
    VALUES
        ('Tim2', 'tim', 'This is Tim2')
    ON CONFLICT (login_name)
        DO UPDATE SET nickname = 'Tim2', notes = 'This is Tim2'
    RETURNING *;
    ```

    ```text
    id | nickname | login_name |    notes
    ----+----------+------------+--------------
      1 | Tim2     | tim        | This is Tim2
    ```

    在 `DO UPDATE` 子句中，您还可以使用 `EXCLUDED` 对象引用引发冲突的数据，上面的语句可以使用 `EXCLUDED` 修改为如下语句：

    ```sql
    INSERT INTO
        users (nickname, login_name, notes)
    VALUES
        ('Tim2', 'tim', 'This is Tim2')
    ON CONFLICT (login_name)
        DO UPDATE SET nickname = EXCLUDED.nickname, notes = EXCLUDED.notes
    RETURNING *;
    ```

    在冲突对象中，除了字段名称，您还可以使用约束名称。上面的语句可以使用约束名称 users_login_name_key 代替列名 login_name:

    ```sql
    INSERT INTO
        users (nickname, login_name, notes)
    VALUES
        ('Tim3', 'tim', 'This is Tim3')
    ON CONFLICT ON CONSTRAINT users_login_name_key
        DO UPDATE SET nickname = EXCLUDED.nickname, notes = EXCLUDED.notes
    RETURNING *;
    ```

    ```text
    id | nickname | login_name |    notes
    ----+----------+------------+--------------
      1 | Tim3     | tim        | This is Tim3
    ```