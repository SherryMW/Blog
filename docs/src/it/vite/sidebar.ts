import {arraySidebar} from "vuepress-theme-hope";

export const ViteSidebar = arraySidebar([
    {
        text: "指引",
        prefix: "guide/",
        children: "structure"
    },
    {
        text: "配置",
        prefix: "config/",
        children: "structure"
    }
])