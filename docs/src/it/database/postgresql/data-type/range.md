---
category: IT
tag: 数据库
order: 15
article: false
---

# 范围

在 PostgreSQL 中，范围 (Range) 是表示某些元素类型的值的区间的数据类型。比如 一个整数的范围可以表示一组人的年龄的范围， 以及一个时间的范围可以表示一个会议室被保留的时间段

范围值是一个区间值，使用 `[, ]`，`(, )` 表示：

- `[` 表示范围的开始，包含起始值

- `]` 表示范围的结束，包含结束值

- `(` 表示范围的开始，不包含起始值

- `)` 表示范围的结束，不包含结束值

下面是是几个范围的示例：

- `[a,b]`：a 和 b 之间的值，包含 a 和 b

- `(a,b)`：a 和 b 之间的值，不包含 a 和 b

- `[a,b)`：a 和 b 之间的值，包含 a，不包含 b

- `(a,b]`：a 和 b 之间的值，不包含 a，包含 b

- `[a,)`：a 和 大于 a 的值

- `(a,)`：大于 a 的值

- `(,b]`：b 和 小于 b 的值

- `(,b)`：小于 b 的值

PostgreSQL 14 引入了 `Multirange` 类型，它是 `Range` 类型的集合。表示方法为：{ range_1, range_2, ...}

每一个 `Range` 类型都有其对应的 `Multirange` 类型

## Range 运算符和函数

下表展示了 PostgreSQL 一些用于范围类型的运算符：

- `@>`：检查第一个操作数（范围）是否包含第二个操作数（范围或者元素）

- `<@`：检查第二个操作数（范围）是否包含第一个操作数（范围或者元素）

- `&&`：检查两个范围是否有重合的部分

- `<<`：检查第一个范围是否在第二个范围的左侧

- `>>`：检查第一个范围是否在第二个范围的右侧

- `&<`：检查第一个范围是否延伸到第二个范围的右侧

- `&>`：检查第一个范围是否延伸到第二个范围的左侧

- `-|-`：检查两个范围是否是相邻的

- `+`：计算两个范围的合集

- `*`：计算两个范围的交集

- `-`：计算两个范围的差集

这些操作数同样适合 `Multirange` 类型的数据

同时， PostgreSQL 为 `Range` 和 `Multirange` 数据类型提供了许多有用的函数，如下：

- `isempty()`：函数检查一个给定的范围值是否为空

- `lower_inc()`：函数检查一个给定范围的下限是否是包含在内的

- `lower_inf()`：函数检查一个给定范围的下限是否是无限

- `lower()`：函数返回一个给定范围或者多值范围的下限值

- `multirange()`：函数返回一个包含了给定范围的多值范围

- `range_merge()`：函数计算包含了所有范围或者整个多值范围的最小范围

- `unnest()`：函数将一个多值范围值展开为范围值的集合

- `upper_inc()`：函数检查一个给定范围的上限是否是包含在内的

- `upper_inf()`：函数检查一个给定范围的上限是否是无限

- `upper()`：函数返回一个给定范围或者多值范围的上限

## Range 示例

下面是一些 PostgreSQL Range 和 `Multirange` 的示例：

要检查一个范围是否包含另一个范围，请使用以下语句：

```sql
SELECT '[1,9]'::int4range @> '[3,9]'::int4range;
```

```text
 ?column?
----------
 t
```

要检查一个范围是否包含一个值，请使用以下语句：

```sql
SELECT '[1,9]'::int4range @> 3;
```

```text
 ?column?
----------
 t
```

要检查一个 `Multirange` 值是否包含一个范围值，请使用以下语句：

```sql
SELECT '{[1,5], [7, 9]}'::int4multirange @> '[3,4]'::int4range;
```

```text
 ?column?
----------
 t
```

## 自定义范围

除了使用 PostgreSQL 内置的范围类型，您还可以使用 [CREATE TYPE](./defined.md) 语句创建自己的范围类型

这是创建自定义范围类型的语法：

```sql
CREATE TYPE name AS RANGE (
    SUBTYPE = subtype
    [ , SUBTYPE_OPCLASS = subtype_operator_class ]
    [ , COLLATION = collation ]
    [ , CANONICAL = canonical_function ]
    [ , SUBTYPE_DIFF = subtype_diff_function ]
    [ , MULTIRANGE_TYPE_NAME = multirange_type_name ]
)
```

假设，您要创建一个时间 (time) 的范围类型 my_time_range，请使用以下语句：

```sql
CREATE TYPE my_time_range AS RANGE (
    SUBTYPE = time
);
```

下面的语句使用了刚刚创建的范围类型 my_time_range：

```sql
SELECT my_time_range('10:00:00','12:00:00') @> '11:00:00'::time;
```

```text
 ?column?
----------
 t
```