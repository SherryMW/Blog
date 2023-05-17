---
category: IT
tag: 数据库
order: 8
article: false
---

# EXPLAIN

在 PostgreSQL 中，您可以使用 `EXPLAIN` 语句显示 PostgreSQL 规划器为指定语句生成的执行计划，以确定该语句是否是一个高效的语句

## EXPLAIN 语法

以下是 `EXPLAIN` 语句的语法：

```sql
EXPLAIN [ ( option [, ...] ) ] statement;
```

其中 option 可以是以下之一：

- ANALYZE [ boolean ]：执行该命令并显示实际运行时间和其他统计信息

    ```sql
    EXPLAIN ANALYZE SELECT * FROM address WHERE postal_code = 'x';
    ```

    ```text
                                                                QUERY PLAN
    -------------------------------------------------------------------------------------------------------------------------------------
    Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161) (actual time=43.589..43.590 rows=0 loops=1)
    Index Cond: ((postal_code)::text = 'x'::text)
    Planning Time: 0.396 ms
    Execution Time: 43.612 ms
    ```

- **VERBOSE [ boolean ]:** 显示有关计划的其他信息

    ```sql
    EXPLAIN VERBOSE SELECT * FROM address WHERE postal_code = 'x';
    ```

    ```text
                                            QUERY PLAN
    ------------------------------------------------------------------------------------------------
    Index Scan using address_postal_code_idx on public.address  (cost=0.28..8.29 rows=1 width=161)
    Output: address_id, address, address2, district, city_id, postal_code, phone, last_update
    Index Cond: ((address.postal_code)::text = 'x'::text)
    ```

- **COSTS [ boolean ]:** 包括有关每个计划节点的估计启动和总成本的信息，以及估计的行数和每行的估计宽度

  ```sql
  EXPLAIN (COSTS) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                      QUERY PLAN
  -----------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161)
  Index Cond: ((postal_code)::text = 'x'::text)
  ```

- **SETTINGS [ boolean ]:** 包括有关配置参数的信息

  ```sql
  EXPLAIN (SETTINGS) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                      QUERY PLAN
  -----------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161)
  Index Cond: ((postal_code)::text = 'x'::text)
  ```

- **BUFFERS [ boolean ]:** 包括有关缓冲区使用情况的信息

  ```sql
  EXPLAIN (BUFFERS) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                      QUERY PLAN
  -----------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161)
  Index Cond: ((postal_code)::text = 'x'::text)
  ```

- **WAL [ boolean ]:** 包括有关 WAL 记录生成的信息。它必须和 ANALYZE 同时使用

  ```sql
  EXPLAIN (ANALYZE, WAL) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                                              QUERY PLAN
  -----------------------------------------------------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161) (actual time=0.029..0.029 rows=0 loops=1)
  Index Cond: ((postal_code)::text = 'x'::text)
  Planning Time: 0.131 ms
  Execution Time: 0.043 ms
  ```

- **TIMING [ boolean ]:** 在输出中包括实际启动时间和在每个节点中花费的时间。它必须和 ANALYZE 同时使用

  ```sql
  EXPLAIN (ANALYZE, TIMING) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                                              QUERY PLAN
  -----------------------------------------------------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161) (actual time=0.018..0.018 rows=0 loops=1)
  Index Cond: ((postal_code)::text = 'x'::text)
  Planning Time: 0.082 ms
  Execution Time: 0.030 ms
  ```

- **SUMMARY [ boolean ]:** 在查询计划之后包括摘要信息

  ```sql
  EXPLAIN (SUMMARY) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                                      QUERY PLAN
  -----------------------------------------------------------------------------------------
  Index Scan using address_postal_code_idx on address  (cost=0.28..8.29 rows=1 width=161)
  Index Cond: ((postal_code)::text = 'x'::text)
  Planning Time: 0.096 ms
  ```

- **FORMAT { TEXT | XML | JSON | YAML }:** 指定输出格式，可以是文本、XML、JSON 或 YAML

  ```sql
  EXPLAIN (FORMAT YAML) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                      QUERY PLAN
  -----------------------------------------------------
  - Plan:                                            +
    Node Type: "Index Scan"                        +
    Parallel Aware: false                          +
    Async Capable: false                           +
    Scan Direction: "Forward"                      +
    Index Name: "address_postal_code_idx"          +
    Relation Name: "address"                       +
    Alias: "address"                               +
    Startup Cost: 0.28                             +
    Total Cost: 8.29                               +
    Plan Rows: 1                                   +
    Plan Width: 161                                +
    Index Cond: "((postal_code)::text = 'x'::text)"
  ```

  ```sql
  EXPLAIN (FORMAT JSON) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                         QUERY PLAN
  ---------------------------------------------------------
  [                                                      +
  {                                                    +
  "Plan": {                                          +
  "Node Type": "Index Scan",                       +
  "Parallel Aware": false,                         +
  "Async Capable": false,                          +
  "Scan Direction": "Forward",                     +
  "Index Name": "address_postal_code_idx",         +
  "Relation Name": "address",                      +
  "Alias": "address",                              +
  "Startup Cost": 0.28,                            +
  "Total Cost": 8.29,                              +
  "Plan Rows": 1,                                  +
  "Plan Width": 161,                               +
  "Index Cond": "((postal_code)::text = 'x'::text)"+
  }                                                  +
  }                                                    +
  ]
  ```

  ```sql
  EXPLAIN (FORMAT XML) SELECT * FROM address WHERE postal_code = 'x';
  ```

  ```text
                              QUERY PLAN
  ------------------------------------------------------------------
  <explain xmlns="http://www.postgresql.org/2009/explain">        +
    <Query>                                                       +
      <Plan>                                                      +
        <Node-Type>Index Scan</Node-Type>                         +
        <Parallel-Aware>false</Parallel-Aware>                    +
        <Async-Capable>false</Async-Capable>                      +
        <Scan-Direction>Forward</Scan-Direction>                  +
        <Index-Name>address_postal_code_idx</Index-Name>          +
        <Relation-Name>address</Relation-Name>                    +
        <Alias>address</Alias>                                    +
        <Startup-Cost>0.28</Startup-Cost>                         +
        <Total-Cost>8.29</Total-Cost>                             +
        <Plan-Rows>1</Plan-Rows>                                  +
        <Plan-Width>161</Plan-Width>                              +
        <Index-Cond>((postal_code)::text = 'x'::text)</Index-Cond>+
      </Plan>                                                     +
    </Query>                                                      +
  </explain>
  ```

注意：所有选项中的 boolean 指定是否选择的选项应该被打开或关闭。您可以使用 TRUE、ON 或 1 启用该选项和 FALSE、OFF 或 0 禁用它。如果省略布尔值，则默认为 TRUE