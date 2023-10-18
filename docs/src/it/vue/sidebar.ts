import {arraySidebar} from "vuepress-theme-hope";

export const VueSidebar = arraySidebar([
    {
        text: "指南",
        prefix: "guide/",
        children: [
            {
                text: "开始",
                prefix: "start/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "基础",
                prefix: "essentials/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "应用规模化",
                prefix: "scaling-up/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "最佳实践",
                prefix: "best-practices/",
                collapsible: true,
                children: "structure"
            }
        ]
    },
    {
        text: "API",
        prefix: "api/",
        children: [
            {
                text: "全局 API",
                prefix: "global/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "单文件组件",
                prefix: "sfc/",
                collapsible: true,
                children: "structure"
            }
        ]
    }
])