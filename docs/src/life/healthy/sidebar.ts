import {arraySidebar} from "vuepress-theme-hope";

export const HealthySidebar = arraySidebar([
    "rest",
    {
        text: "健身",
        prefix: "gym/",
        collapsible: true,
        children: "structure"
    },
    "ill"
])