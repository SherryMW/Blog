---
category: IT
tag: 数据库
order: 12
article: false
---

# NOT NULL

在 PostgreSQL 中，`NOT NULL` 是列上的约束，它用来约束列中的值不能为 NULL 值

注意，NULL 不是空串，也不是 0，它表示什么都没有。您可以使用 [IS NULL](../basic/isnull.md) 操作符判断一个值是否是 NULL

## NOT NULL 语法

要定义一个 `NOT NULL` 的列，请使用以下方法

### 定义 NOT NULL 列

请使用以下语法定义一个 `NOT NULL` 列：

```sql
CREATE TABLE table_name (
  ...
  column_name data_type NOT NULL ...,
  ...
);
```

### 添加 NOT NULL 约束

要向现有的列添加 `NOT NULL` 约束，请使用以下语法修改列的定义：

```sql
ALTER TABLE table_name
ALTER COLUMN column_name SET NOT NULL;
```

column_name 是要添加 `NOT NULL` 约束的列的名字

### 删除 NOT NULL 约束

要删除列上的 `NOT NULL` 约束，请使用以下语法修改列的定义：

```sql
ALTER TABLE table_name
ALTER COLUMN column_name DROP NOT NULL;
```

column_name 是要从中删除 `NOT NULL` 约束的列的名字

## NOT NULL 示例

让我们通过一个例子了解 `NOT NULL` 的作用。请按照以下步骤进行操作：

1. 通过以下语句创建 user_hobby 表：

    ```sql
    DROP TABLE IF EXISTS user_hobby;
    CREATE TABLE user_hobby (
      hobby_id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      hobby VARCHAR(45) NOT NULL
    );
    ```
    
    这里，user_id 和 hobby 列中不接受 NULL 值

2. 插入几行数据

    ```sql
    INSERT INTO user_hobby (user_id, hobby)
    VALUES (1, 'Football'), (1, 'Swimming');
    ```
    
    很显然能插入成功

3. 向 hobby 列中插入 NULL 值：

    ```sql
    INSERT INTO user_hobby (user_id, hobby)
    VALUES (1, NULL);
    ```
    
    ```text
    ERROR:  null value in column "hobby" violates not-null constraint
    DETAIL:  Failing row contains (3, 1, null).
    ```
    
    PostgreSQL 服务器会返回了上面的错误。因为 hobby 列不能为空

## 将现有列修改为不能为空

如果你想将现有的一个允许 NULL 值的列修改为不允许 NULL 值，请先将该列中的 NULL 值修改为非 NULL 值，否则可能遇到错误

假设，我们有下面的一个表：

```sql
DROP TABLE IF EXISTS user_hobby;
CREATE TABLE user_hobby (
  hobby_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  hobby VARCHAR(45)
);
```

这里，hobby 列中是可以有 NULL 值的

现在我们插入几行测试数据：

```sql
INSERT INTO user_hobby (user_id, hobby)
VALUES (1, 'Football'), (1, NULL);
```

现在我们看以下表中的数据：

```sql
SELECT * FROM user_hobby;
```

```text
 hobby_id | user_id |  hobby
----------+---------+----------
        1 |       1 | Football
        2 |       1 |
(2 行记录)
```

运行如下语句为 hobby 列添加 `NOT NULL` 约束：

```sql
ALTER TABLE user_hobby
ALTER hobby SET NOT NULL;
```

```text
ERROR:  column "hobby" contains null values
```

PostgreSQL 会返回了上面的错误。这是因为其中一行的 hobby 列中的值为 NULL

我们应该首先将 hobby 列中 NULL 值改为非 NULL 值：

```sql
UPDATE user_hobby
SET hobby = 'NOTHING'
WHERE hobby IS NULL;
```

然后我们再为 hobby 列添加 `NOT NULL` 约束：

```sql
ALTER TABLE user_hobby
ALTER hobby SET NOT NULL;
```

现在已经成功的为 hobby 列添加了 `NOT NULL` 约束