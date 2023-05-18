---
category: IT
tag: 数据库
order: 21
article: false
---

# 事务

数据库事务是一种保证交易的完整性的机制。事务是一个不可分隔的工作单元，一个事务之内的所有的操作要么全部执行，要么全部不执行

比如，在一个银行系统中，用户 A 向用户 B 转账 500 元。这个交易主要包含两个操作：

1. 从用户 A 的账户余额扣除 500 元

2. 将用户 B 的账户余额增加 500 元

上面的两个操作要么全部执行，要么全部不执行，否则会带来错误

## 数据库事务的特性

数据库事务具有四大特性：

1. 原子性(Atomicity)：事务是一个原子操作单元，要么全部执行成功，要么全部失败回滚。如果事务中的任何一个操作失败，所有已执行的操作都将被撤销，数据库将回滚到事务开始之前的状态

2. 一致性(Consistency)：事务的执行使数据库从一个一致状态转换到另一个一致状态。这意味着事务中的操作必须满足预定义的规则和约束，以确保数据的完整性和一致性。如果事务违反了任何规则或约束，将被回滚，数据库将保持原始一致状态

3. 隔离性(Isolation)：事务的隔离性确保并发执行的事务彼此相互隔离，每个事务感觉自己在独立地操作数据库。这意味着并发执行的事务之间不能相互干扰，每个事务都必须像在单独执行时一样操作数据库。通过隔离性，可以防止并发执行事务导致的数据损坏和不一致

4. 持久性(Durability)：事务一旦被提交，其结果应该是永久性的，即使在系统故障或崩溃后也能够恢复。数据库系统必须将已提交的事务永久保存在非易失性存储器中，以确保数据的持久性

数据库事务的四大特性通常被简称为 ACID。这些特性一起确保了数据库事务的可靠性、完整性和一致性。通过使用事务，可以保证在复杂的数据库操作中的数据完整性，并提供了一种有效的机制来处理并发访问和故障恢复

## 事务命令

PostgreSQL 提供了一些 SQL 命令用来控制事务，包括：开启一个事务、提交一个事务、回滚一个事务

### 开启一个事务

要开启一个 PostgreSQL 数据库事务，您可以使用以下命令中的一个：

- `START TRANSACTION`

- `BEGIN TRANSACTION`

- `BEGIN WORK`

- `BEGIN`

开启一个事务后，后续的所有操作都属于该事务，直到事务被提交或者被回滚

### 提交一个事务

要提交该事务内的所有操作，您可以使用以下命令中的一个：

- `COMMIT TRANSACTION`

- `COMMIT WORK`

- `COMMIT`

提交事务将当前事务内的所有操作写入数据库，并结束当前事务

### 回滚一个事务

要回滚该事务内的所有操作，您可以使用以下命令中的一个：

- `ROLLBACK TRANSACTION`

- `ROLLBACK WORK`

- `ROLLBACK`

回滚事务将撤销当前事务内的所有的操作，并结束当前事务

## 事务示例

我们将通过一个银行账户余额的表来演示事务。下面的语句创建了表 user_balance：

```sql
CREATE TABLE user_balance (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  balance DEC(15,2) NOT NULL
);
```

### 事务初体验

让我们在一个事务中插入一个数据，以演示事务的用法

1. （会话 1）使用下面的语句开启一个事务：

    ```sql
    BEGIN;
    ```

2. （会话 1）使用下面的语句插入一行数据：

    ```sql
    INSERT INTO user_balance (id, name, balance)
    VALUES (1, 'Tom', '2500');
    ```

3. （会话 1）使用下面的语句查看 user_balance 表中数据：

    ```sql
    SELECT * FROM user_balance;
    ```
    
    ```text
     id | name | balance
    ----+------+---------
      1 | Tom  | 2500.00
    ```

4. （会话 2）重新打开一个会话并登录到刚刚的数据库中，使用下面的语句查看 user_balance 表中数据：

    ```sql
    SELECT * FROM user_balance;
    ```
    
    ```text
      id | name | balance
     ----+------+---------
    ```

    这里，您并不能看到刚刚插入的行。这是因为在会话 1 中的插入操作在一个事务中，并且事务还未提交，因此事务之外并不能看到还未提交的数据

5. （会话 1）回到原来地会话，使用下面的语句提交事务：

    ```sql
    COMMIT;
    ```

6. （会话 2）回到会话 2，使用下面的语句查看 user_balance 表中数据：

    ```sql
    SELECT * FROM user_balance;
    ```
    
    ```text
     id | name | balance
    ----+------+---------
      1 | Tom  | 2500.00
    ```
    
    此时，由于会话 1 中的事务已经提交，您可以在会话 2 中看到刚刚插入的行了

### 银行转账：事务中的多个操作

使用下面的语句插入 2 行数据用于这个示例：

```sql
INSERT INTO user_balance (id, name, balance)
VALUES (2, 'Tim', '1500'), (3, 'Jim', '1000');
```

使用下面的语句看一下 user_balance 表中行：

```sql
SELECT * FROM user_balance;
```

```text
 id | name | balance
----+------+---------
  1 | Tom  | 2500.00
  2 | Tim  | 1500.00
  3 | Jim  | 1000.00
(3 行记录)
```

假设， Tom 需要向 Tim 转账 500 元。您需要完成如下两个操作：

1. 将 Tom 的余额扣减 500 元

2. 将 Tim 的余额增加 500 元

这里有两个操作，为了保证转账交易的完整性，因此我们需要使用事务

1. 使用下面的语句开启一个事务：

    ```sql
    BEGIN;
    ```

2. 使用下面的语句将 Tom 的余额减少 500 元：

    ```sql
    UPDATE user_balance
    SET balance = balance - 500
    WHERE id = 1;
    ```

3. 使用下面的语句将 Tim 的余额增加 500 元：

    ```sql
    UPDATE user_balance
    SET balance = balance + 500
    WHERE id = 2;
    ```

4. 使用下面的语句查看 user_balance 表中数据，已验证数据的是否正确：

    ```sql
    SELECT *
    FROM user_balance
    WHERE id IN (1, 2);
    ```

    ```text
     id | name | balance
    ----+------+---------
      1 | Tom  | 2000.00
      2 | Tim  | 2000.00
    (2 行记录)
    ```

    这里，Tom 和 Tim 转账后的余额都是正确的

5. 使用下面的语句提交事务：

    ```sql
    COMMIT;
    ```

### 回滚事务

如果在提交事务之前出现了任何异常，您都可以通过回滚事务来撤销之前的操作

比如，您不小心将钱转账给了 id 为 3 的用户，只要您在提交之前发现了问题，您可以通过 `ROLLBACK` 命令回滚当前事务

首先，看一下当前 user_balance 表中的行：

```sql
SELECT * FROM user_balance;
```

```text
 id | name | balance
----+------+---------
  3 | Jim  | 1000.00
  1 | Tom  | 2000.00
  2 | Tim  | 2000.00
(3 行记录)
```

下面的语句假设您不小心将钱转账给了 id 为 3 的用户：

```sql
BEGIN;

UPDATE user_balance
SET balance = balance - 500
WHERE id = 1;

UPDATE user_balance
SET balance = balance + 500
WHERE id = 3;
```

在提交之前您使用以下语句检查操作是否正确：

```sql
SELECT *
FROM user_balance
WHERE id IN (1, 2);
```

```text
 id | name | balance
----+------+---------
  2 | Tim  | 2000.00
  1 | Tom  | 1500.00
(2 行记录)
```

您发现 Tom 的余额少了 500，而 Tim 的余额没有变化。这是一个错误。因此您需要使用 `ROLLBACK` 来回滚事务

事务被回滚后，数据恢复到操作之前的状态，您就可以继续完成转账了