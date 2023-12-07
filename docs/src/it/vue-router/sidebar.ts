import {arraySidebar} from "vuepress-theme-hope";

export const VueRouterSidebar = arraySidebar([
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
            }
        ]
    }
])