---
category: IT
tag: 数据库
order: 16
article: false
---

# CHECK 约束

任何应用都对数据的正确性有要求。比如，用户的年龄必须是大于零的，用户的登录名中不能包含空格，用户的密码必须满足一定的复杂度，等等

对于这些要求，虽然我们可以在应用界面来对用户输入的数据进行验证，但是这并不能替代数据库层面的数据验证。这能增加应用的安全性

PostgreSQL 提供了 `CHECK` 约束来保证写入到表中的数据是符合你的要求的。不符合 `CHECK` 约束的数据会被 PostgreSQL 拒绝

## CHECK 语法

下面是 PostgreSQL `CHECK` 的语法：

```sql
[CONSTRAINT constraint_name]
CHECK(expr)
```

- constraint_name 是约束的名字。`CONSTRAINT` constraint_name 是可选的，只有您需要指定约束名称的时候，才使用此子句

- expr 是一个布尔表达式。如果表达式结算结果为真，则 PostgreSQL 允许将输入写入到表中，否则 PostgreSQL 拒绝写入数据

您可以在一个列上或者一个表上使用 `CHECK` 约束。如果你为一个列使用 `CHECK` 约束，则 `CHECK` 表达式只能使用此列。如果你为一个表使用 `CHECK` 约束，则 `CHECK` 表达式可以使用表上的所有列

下面以 age 列需要大于 0 为例，使用不同的方法添加此约束：

- 在创建表的时候在列定义中使用 `CHECK` 约束

    ```sql
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        age INTEGER NOT NULL CHECK(age > 0)
    );
    ```

- 在创建表的时候在约束定义中使用 `CHECK` 约束

    ```sqs
    CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        age INTEGER NOT NULL,
        CONSTRAINT users_age_check CHECK(age > 0)
    );
    ```

- 使用修改表语句的添加 `CHECK` 约束

    ```sql
    ALTER TABLE users
    ADD CONSTRAINT users_age_check CHECK(age > 0);
    ```

## CHECK 约束示例

通过下面的例子，你会很容易理解 PostgreSQL `CHECK` 约束的用法和作用

假设，您需要一个 users 表存储用户的名称，登录名，密码，且需要符合以下要求：

1. 用户的名称不能为空

2. 登录名的长度不少于 4 个字符

3. 密码的长度不少于 8 个字符

4. 密码不能和登录名相同

注意，在实际的应用中，您不应该将密码的明文存放在数据库中，这是不安全的

使用以下的 `CREATE TABLE` 语句创建表：

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    login_name VARCHAR(45) NOT NULL CHECK(length(login_name) >= 4),
    password VARCHAR(45) NOT NULL CHECK(length(password) >= 8),
    CHECK(login_name <> password)
);
```

这里，在 `CREATE TABLE` 语句中有 3 个 `CHECK` 约束：

1. 在 login_name 列定义中的 `CHECK(length(login_name) >= 4)` 保证登录名的长度不小于 4

2. 在 password 列定义中的 `CHECK(length(password) >= 8)` 保证登录名的长度不小于 8

3. 在表上的约束 `CHECK(login_name <> password)` 保证密码不能和登录名相同

通过以下 `\d` 命令查看表 users 上的约束：

```postgresql
\d users
```

```text
                                     Table "public.users"
   Column   |         Type          | Collation | Nullable |              Default
------------+-----------------------+-----------+----------+-----------------------------------
 id         | integer               |           | not null | nextval('users_id_seq'::regclass)
 name       | character varying(45) |           | not null |
 login_name | character varying(45) |           | not null |
 password   | character varying(45) |           | not null |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "users_check" CHECK (login_name::text <> password::text)
    "users_login_name_check" CHECK (length(login_name::text) >= 4)
    "users_password_check" CHECK (length(password::text) >= 8)
```

您能够在上面的输出中发现，users 表中有 3 个 `CHECK` 约束。约束的名称都是 PostgreSQL 按默认规则生成的

注意，[NOT NULL](./not-null.md) 也是一种约束

---

要验证登录名列的 `CHECK` 约束是否生效，请使用下面的 [INSERT](../basic/insert.md) 语句尝试插入一行：

```sql
INSERT INTO users (name, login_name, password)
VALUES ('Tim', 'tim', 'timisok');
```

```text
ERROR:  new row for relation "users" violates check constraint "users_login_name_check"
DETAIL:  Failing row contains (1, Tim, tim, timisok).
```

由于上面语句中给出的登录名 tim 的长度小于 4，因此 PostgreSQL 给出了上面的错误

---

要验证密码列的 `CHECK` 约束是否生效，请使用下面的 [INSERT](../basic/insert.md) 语句尝试插入一行：

```sql
INSERT INTO users (name, login_name, password)
VALUES ('Tim', 'tim1', 'timisok');
```

```text
ERROR:  new row for relation "users" violates check constraint "users_password_check"
DETAIL:  Failing row contains (2, Tim, tim1, timisok).
```

由于上面语句中给出的密码 timisok 的长度小于 8，因此 PostgreSQL 给出了上面的错误

---

要验证密码不能和登录名相同的 `CHECK` 约束是否生效，请使用下面的 [INSERT](../basic/insert.md) 语句尝试插入一行：

```sql
INSERT INTO users (name, login_name, password)
VALUES ('Tim', 'timisgood', 'timisgood');
```

```text
ERROR:  new row for relation "users" violates check constraint "users_check"
DETAIL:  Failing row contains (3, Tim, timisgood, timisgood).
```

由于上面语句中给出的登录名和密码都是 timisgood，因此 PostgreSQL 给出了上面的错误

使用下面的语句插入一个完全符合 `CHECK` 约束的行

```sql
INSERT INTO users (name, login_name, password)
VALUES ('Tim', 'hitim', 'timisgood');
```

这一行成功插入到了 users 表中

`CHECK` 约束同样适用于 [UPDATE](../basic/update.md) 语句，比如：

```sql
UPDATE users
SET login_name = 'tim'
WHERE name = 'Tim';
```

```text
ERROR:  new row for relation "users" violates check constraint "users_login_name_check"
DETAIL:  Failing row contains (4, Tim, tim, timisgood).
```