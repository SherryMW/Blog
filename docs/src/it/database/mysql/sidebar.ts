import {arraySidebar} from "vuepress-theme-hope";

export const MySQLSidebar = arraySidebar([
    {
        text: "初级",
        prefix: "junior/",
        children: "structure"
    },
    {

        text: "高级",
        prefix: "senior/",
        children: "structure"
    }
])