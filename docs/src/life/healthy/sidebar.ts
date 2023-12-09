import {arraySidebar} from "vuepress-theme-hope";

export const HealthySidebar = arraySidebar([
    {
        text: "作息",
        prefix: "rest/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "健身",
        prefix: "gym/",
        collapsible: true,
        children: "structure"
    },
    // "ill"
])