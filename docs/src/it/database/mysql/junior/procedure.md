---
category: IT
article: false
---

# 存储过程

MySQL 存储过程是一组为了完成特定任务而预先编译并存储在数据库中的一系列 SQL 语句。存储过程可以包含 SQL 语句、流程控制语句、变量、条件和其他支持结构，使其成为一个可以在数据库中被调用和执行的独立单元。存储过程的主要目的是封装复杂的操作、提高数据库性能、提供更好的安全性，并且可以通过简化客户端代码来增加可维护性

## 创建存储过程

使用 `CREATE PROCEDURE` 语句可以创建存储过程。以下是一个简单的示例：

```sql
DELIMITER //

CREATE PROCEDURE GetEmployeeCount()
BEGIN
    SELECT COUNT(*) FROM employees;
END //

DELIMITER ;
```

在上述示例中，`GetEmployeeCount` 存储过程返回 `employees` 表中的行数

## 存储过程参数

存储过程可以接受输入参数，以下是一个带有输入参数的示例：

```sql
DELIMITER //

CREATE PROCEDURE GetEmployeeById(IN employeeId INT)
BEGIN
    SELECT * FROM employees WHERE id = employeeId;
END //

DELIMITER ;
```

## 存储过程输出参数

存储过程还可以有输出参数，用于将结果传递给调用者：

```sql
DELIMITER //

CREATE PROCEDURE GetEmployeeNameById(
    IN employeeId INT,
    OUT employeeName VARCHAR(255)
)
BEGIN
    SELECT name INTO employeeName FROM employees WHERE id = employeeId;
END //

DELIMITER ;
```

## 调用存储过程

可以使用 `CALL` 或 `EXECUTE` 语句调用存储过程：

```sql
CALL GetEmployeeCount();

-- 或

EXECUTE GetEmployeeCount();
```

## 存储过程流程控制

存储过程可以包含条件、循环和其他流程控制语句：

```sql
DELIMITER //

CREATE PROCEDURE ExampleProcedure()
BEGIN
    DECLARE counter INT DEFAULT 0;
    
    WHILE counter < 5 DO
        SELECT counter;
        SET counter = counter + 1;
    END WHILE;
END //

DELIMITER ;
```

## 删除存储过程

使用 `DROP PROCEDURE` 语句可以删除存储过程：

```sql
DROP PROCEDURE IF EXISTS GetEmployeeCount;
```

## 示例

我们目前需要创建一个简单的商品表，并往里批量插入三百万条商品数据。这个时候我们首先会想到使用脚本进行循环批量插入数据，但是当需要插入大量数据时，性能比较差。这是因为每次插入数据都需要频繁地获取数据库连接和提交事务，这会增加系统的开销并可能存在安全风险。相比之下使用存储过程进行批量导入是一种更有效和更安全的方法。通过编写一个存储过程，你可以将大量数据一次性传输到数据库并进行批量插入，从而减少了网络开销和交互次数

### 创建商品表

```sql
DROP TABLE
    IF
    EXISTS `products`;
CREATE TABLE `products`
(
    `id`           INT ( 11 ) NOT NULL AUTO_INCREMENT,
    `name`         VARCHAR(255)   NOT NULL COMMENT '商品名称',
    `price`        DECIMAL(10, 2) NOT NULL COMMENT '价格',
    `stock`        INT ( 11 ) DEFAULT '0' COMMENT '库存',
    `description`  VARCHAR(500) DEFAULT NULL COMMENT '商品描述',
    `create_by`    BIGINT ( 20 ) NOT NULL COMMENT '创建人',
    `modified_by`  BIGINT ( 20 ) DEFAULT NULL COMMENT '更新人',
    `gmt_create`   datetime     DEFAULT NULL COMMENT '创建时间',
    `gmt_modified` datetime     DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY            `idx_create_by_gmt_create` ( `create_by`, `gmt_create` ) USING BTREE COMMENT '商品创建人和创建时间联合索引',
    KEY            `idx_name` ( `name` ( 191 )) USING BTREE COMMENT '商品名称'
) ENGINE = INNODB AUTO_INCREMENT = 3054922 DEFAULT CHARSET = utf8mb4 COMMENT = '商品表';
```

### 创建存储过程

```sql
DROP PROCEDURE IF EXISTS `insert_products`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_products`(IN max_num INT(10))
BEGIN

DECLARE i INT DEFAULT 0 ;
DECLARE product_name VARCHAR (255) ;
DECLARE product_price DECIMAL (10, 2) ;
DECLARE product_description VARCHAR (500) ;
DECLARE product_stock int (11) ;
DECLARE product_create_by bigint(20) ;
SET autocommit = 0 ;
REPEAT

SET i = i + 1 ;
SET product_name = CONCAT('Product', i) ;
SET product_price = RAND() * 100 + 10 ; 
SET product_stock = i ;
SET product_create_by = 1706255488020324354 ; 
SET product_description = CONCAT(
  'Description for Product',
  i
) ; 
INSERT INTO products (
  `name`,
  `price`,
  `stock`,
  `description`,
  `create_by`,
  `gmt_create`,
  `gmt_modified`
)
VALUES
	(
    product_name,
    product_price,
    product_stock,    
    product_description,
    product_create_by,   
    NOW(),
    NOW()
  ) ; UNTIL i = max_num
END
REPEAT; 
COMMIT ;
END
;;
DELIMITER ;
```

- `DELIMITER` 用于更改 SQL 语句中的语句分隔符，默认分隔符是分号 `;`。在创建存储过程、触发器或其他复合语句时，可能会包含多个 SQL 语句，为了区分这些语句，需要使用不同于默认的分隔符

    ```sql
    DELIMITER //
    
    CREATE PROCEDURE example_procedure()
    BEGIN
        -- 存储过程体中的 SQL 语句
    END //
    
    DELIMITER ;
    ```
    
    在上述示例中，`DELIMITER //` 将分隔符更改为 `//`，这样就可以在存储过程体中使用分号 `;` 而不引发语法错误。当存储过程体结束时，使用 `DELIMITER ;` 恢复默认分隔符

- `CREATE PROCEDURE insert_products (IN max_num INT(10))`：这是创建存储过程的语句。它定义了一个名为 `insert_products` 的存储过程，它接受一个输入参数 `max_num`，用于指定要插入的产品数量。该存储过程的目的是生成模拟的产品数据，并将这些数据插入到名为 `products` 的表中

- `BEGIN` 和 `END ;;`：这些关键字标识了存储过程的开始和结束

- `DECLARE` 语句：这些语句用于声明存储过程内部使用的变量。在这个存储过程中，声明了多个变量，包括：

  - `i`：用于循环计数，控制插入商品的数量

  - `product_name`：用于存储商品名称

  - `product_price`：用于存储商品价格

  - `product_stock`：用于存储商品库存

  - `product_description`：用于存储商品描述

  - `product_create_by`：用于存储商品创建人

- `SET autocommit = 0;`：这是将自动提交事务关闭的语句。在存储过程内，通常会关闭自动提交，以便能够手动控制事务的提交，确保一组插入操作作为一个事务一起提交

-  `REPEAT` 和 `UNTIL`：这是一个循环结构，它会重复执行存储过程内的一组语句，直到满足条件。在这里，循环会执行插入商品数据的操作，直到计数变量 `i` 达到了指定的最大数量 `max_num`

- `INSERT INTO products ...`：这是插入商品数据的 SQL 语句，将商品的名称、价格、描述以及创建和修改时间插入到名为 `products` 的表中。这个语句在循环内执行，用于插入每个商品的数据

- `COMMIT;`：这是提交事务的语句。在存储过程内部，您需要手动提交事务以保存插入的数据

- `DELIMITER ;`：最后，这是用于将SQL语句分隔符还原为默认分号的命令，以便后续的 SQL 语句在正常情况下执行

### 执行存储过程

```sql
-- 执行存储过程，往products表添加300万条数据
CALL insert_products(3000000);
```