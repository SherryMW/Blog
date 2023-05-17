import {arraySidebar} from "vuepress-theme-hope";

export const PostgreSQLSidebar = arraySidebar([
    {
        text: "PostgreSQL 起步",
        link: "start/",
    },
    {
        text: "PostgreSQL 基础",
        prefix: "basic/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "PostgreSQL 数据类型",
        prefix: "data-type",
        collapsible: true,
        children: "structure"
    },
    {
        text: "PostgreSQL 数据库和表",
        prefix: "database-and-table/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "PostgreSQL 索引",
        prefix: "indexes/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "PostgreSQL 数据库管理",
        prefix: "administration/",
        collapsible: true,
        children: "structure"
    },
    "references"
])