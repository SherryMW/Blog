import {arraySidebar} from "vuepress-theme-hope";

export const CollectionSidebar = arraySidebar([
    "developers",
    "tool",
    {
        text: "影视",
        prefix: "movies/",
        collapsible: true,
        children: "structure"
    },
    {
        text: "游戏",
        prefix: "games/",
        collapsible: true,
        children: "structure"
    }
])