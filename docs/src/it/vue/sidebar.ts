import {arraySidebar} from "vuepress-theme-hope";

export const VueSidebar = arraySidebar([
    {
        text: "指南",
        prefix: "guide/",
        children: [
            {
                text: "开始",
                prefix: "start/",
                children: "structure"
            },
            {
                text: "基础",
                prefix: "essentials/",
                children: "structure"
            },
            {
                text: "深入组件",
                prefix: "components/",
                children: "structure"
            },
            {
                text: "逻辑复用",
                prefix: "reusability/",
                children: "structure"
            },
            {
                text: "内置组件",
                prefix: "built/",
                children: "structure"
            },
            {
                text: "应用规模化",
                prefix: "scaling-up/",
                children: "structure"
            },
            {
                text: "最佳实践",
                prefix: "best-practices/",
                children: "structure"
            },
            {
                text: "TypeScript",
                prefix: "typescript/",
                children: "structure"
            },
            {
                text: "进阶主题",
                prefix: "extras/",
                children: "structure"
            },
        ]
    },
    {
        text: "API",
        prefix: "api/",
        children: [
            {
                text: "全局 API",
                prefix: "global/",
                children: "structure"
            },
            {
                text: "组合 API",
                prefix: "composition/",
                children: "structure"
            },
            {
                text: "选项式 API",
                prefix: "options/",
                children: "structure"
            },
            {
                text: "内置内容",
                prefix: "built/",
                children: "structure"
            },
            {
                text: "单文件组件",
                prefix: "sfc/",
                children: "structure"
            }
        ]
    }
])