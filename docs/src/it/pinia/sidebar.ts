import {arraySidebar} from "vuepress-theme-hope";

export const PiniaSidebar = arraySidebar([
    {
        text: "介绍",
        prefix: "guide/",
        children: "structure"
    },
    {
        text: "核心概念",
        prefix: "core-concepts/",
        children: "structure"
    }
])