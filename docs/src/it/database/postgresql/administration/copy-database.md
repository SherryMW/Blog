---
category: IT
tag: 数据库
order: 3
article: false
---

# 复制数据库

在 PostgreSQL 中，您可以使用以下几种方法复制数据库：

1. 使用 `CREATE DATABASE` 从模板数据库复制一个数据库。此方法仅适用于在同一个 PostgreSQL 服务器内操作

2. [备份一个现有的数据库](./backup-and-restore.md)，并将其恢复到一个新的数据库

有时候，为了数据的安全性，您在操作之前需要先将要操作数据库复制备份。 您可以使用 `CREATE DATABASE` 将此数据库复制为一个新数据库，如下：

```sql
CREATE DATABASE new_db 
WITH TEMPLATE old_db;
```

此语句将 复制 old_db 数据库到 new_db 数据库。old_db 必须是模板数据库才能被复制。如果它不是模板数据库，您可以使用 `ALTER DATABASE` 语句将此数据库修改为模板数据库，如下：

```sql
ALTER DATABASE old_db
WITH IS_TEMPLATE true;
```

此方法仅能用在同一个 PostgreSQL 数据库服务器内。如果您想在不同的 PostgreSQL 数据库服务器间复制数据库，请查看 [PostgreSQL 备份和恢复](./backup-and-restore.md)