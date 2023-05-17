---
category: IT
tag: 数据库
order: 18
article: false
---

# LIKE

在 PostgreSQL 中，`LIKE` 运算符是一个布尔运算符，用来检查一个文本是否与指定的模式匹配。如果文本与指定的模式匹配，则 `LIKE` 运算符返回真，否则它返回假

`ILIKE` 运算符是 `LIKE` 运算符的不区分大小写版本，`ILIKE` 运算符执行不区分大小写的匹配

## LIKE 语法

`LIKE` 运算符是一个双目比较运算符，需要两个操作数。请使用如下的语法：

```sql
expr LIKE pattern
expr ILIKE pattern
```

- expr 可以是一个字段名、值或其他的表达式（比如函数调用、运算等）

- pattern 是一个字符串模式。它支持两个通配符：% 和 _

    - `%` 匹配零或多个任意字符

    - `_` 匹配单个任意字符

    - 如果需要匹配通配符，则需要使用 `\` 转义字符，如 `\%` 和 `\_`

    - `a%` 匹配以字符 a 开头的任意长度的字符串

    - `%a` 匹配以字符 a 结尾的任意长度的字符串

    - `%a%` 匹配包含字符 a 的任意长度的字符串

    - `%a%b%` 匹配同时包含字符 a 和 b 且 a 在 b 前面的任意长度的字符串

    - `a_` 匹配以字符 a 开头长度为 2 字符串

    - `_a` 匹配以字符 a 结尾长度为 2 字符串

如果 expr 与 pattern 匹配，`LIKE` 运算符返回真，否则返回假

`NOT LIKE` 是 `LIKE` 运算符的否定操作

`NOT ILIKE` 是 `ILIKE` 运算符的否定操作

## LIKE 运算规则

PostgreSQL `LIKE` 运算符用于检测一个文本是否指定的模式匹配。它的运算规则如下：

- 当 `LIKE` 运算符左侧的操作数与右侧的模式匹配时，返回 t。否则返回 f

   ```sql
   SELECT
    'a' LIKE 'a' AS "'a' LIKE 'a'",
    'a' LIKE 'a%' AS "'a' LIKE 'a%'",
    'ab' LIKE 'a%' AS "'ab' LIKE 'a%'",
    'ab' LIKE '%a' AS "'ab' LIKE '%a'";
   ```

   ```text
   'a' LIKE 'a' | 'a' LIKE 'a%' | 'ab' LIKE 'a%' | 'ab' LIKE '%a'
   -------------+---------------+----------------+----------------
   t            | t             | t              | f
   ```

   ```sql
   SELECT
    'a' LIKE 'a_' AS "'a' LIKE 'a_'",
    'ab' LIKE 'a_' AS "'ab' LIKE 'a_'",
    'abc' LIKE 'a_' AS "'abc' LIKE 'a_'";
   ```

   ```text
   'a' LIKE 'a_' | 'ab' LIKE 'a_' | 'abc' LIKE 'a_'
   --------------+----------------+-----------------
   f             | t              | f
   ```

- 如果 `LIKE` 运算符的两个操作数中任意一个为 NULL 时，返回 NULL

   ```sql
   SELECT
    NULL LIKE 'a%' AS "NULL LIKE 'a%'",
    'a' LIKE NULL AS "'a' LIKE NULL ";
   ```

   ```text
    NULL LIKE 'a%' | 'a' LIKE NULL
   ----------------+----------------
       <null>      |     <null>
   ```

## LIKE 示例

我们将使用 [PostgreSQL Sakila 示例数据库](../start.md#sakila) 里的数据表进行演示

### 匹配以某些字符开头的文本

要从 actor 表中查找名字以字符 P 开头的所有演员，请使用以下带有 `LIKE` 运算符的语句：

```sql
SELECT *
FROM actor
WHERE first_name LIKE 'P%';
```

```text
 actor_id | first_name | last_name |     last_update
----------+------------+-----------+---------------------
        1 | PENELOPE   | GUINESS   | 2006-02-15 04:34:33
       46 | PARKER     | GOLDBERG  | 2006-02-15 04:34:33
       54 | PENELOPE   | PINKETT   | 2006-02-15 04:34:33
      104 | PENELOPE   | CRONYN    | 2006-02-15 04:34:33
      120 | PENELOPE   | MONROE    | 2006-02-15 04:34:33
(5 行记录)
```

这里，`P%` 模式表示以 P 开头的任意长度的文本。为了找到名字以字符 P 开头的所有演员，我们使用了表达式 `first_name LIKE 'P%'`

`first_name LIKE 'P%'` 用来匹配以大写字母 P 开头的文本，如果您还想要匹配以小写字母 p 开头的文本，可以使用 `first_name ILIKE 'P%'`

### 匹配以某个字符结尾的文本

要从 actor 表中查找名字以字符 ES 结尾的所有演员，请使用以下带有 `LIKE` 运算符的语句：

```sql
SELECT *
FROM actor
WHERE first_name LIKE '%ES';
```

```text
 actor_id | first_name | last_name |     last_update
----------+------------+-----------+---------------------
       48 | FRANCES    | DAY-LEWIS | 2006-02-15 04:34:33
       84 | JAMES      | PITT      | 2006-02-15 04:34:33
      126 | FRANCES    | TOMEI     | 2006-02-15 04:34:33
(3 行记录)
```

### 匹配包含某些字符开头的文本

要从 actor 表中查找名字中带有字符串 AM 的所有演员，请使用以下带有 `LIKE` 运算符匹配的语句：

```sql
SELECT * 
FROM actor 
WHERE first_name LIKE '%AM%';
```

```text
 actor_id | first_name | last_name |     last_update
----------+------------+-----------+---------------------
       24 | CAMERON    | STREEP    | 2006-02-15 04:34:33
       63 | CAMERON    | WRAY      | 2006-02-15 04:34:33
       71 | ADAM       | GRANT     | 2006-02-15 04:34:33
       84 | JAMES      | PITT      | 2006-02-15 04:34:33
      111 | CAMERON    | ZELLWEGER | 2006-02-15 04:34:33
...
(7 行记录)
```

### 匹配单个字符

通配符 `_` 匹配任意单个字符。以下 SQL 语句使用 `LIKE` 运算符查找 first_name 以字符串 AY 结尾的且长度为 3 个字符的所有演员

```sql
SELECT * 
FROM actor 
WHERE first_name LIKE '_AY';
```

```text
 actor_id | first_name | last_name |     last_update
----------+------------+-----------+---------------------
       55 | FAY        | KILMER    | 2006-02-15 04:34:33
       64 | RAY        | JOHANSSON | 2006-02-15 04:34:33
      147 | FAY        | WINSLET   | 2006-02-15 04:34:33
      156 | FAY        | WOOD      | 2006-02-15 04:34:33
(4 行记录)
```