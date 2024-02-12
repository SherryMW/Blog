import {arraySidebar} from "vuepress-theme-hope";

export const DatabaseSidebar = arraySidebar([
    {
        text: "MongoDB",
        prefix: "mongodb/",
        collapsible: true,
        children: "structure"
    },
])