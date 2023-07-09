import {arraySidebar} from "vuepress-theme-hope";

export const FoodSidebar = arraySidebar([
    {
        text: "广州",
        prefix: "guangzhou/",
        children: [
            {
                text: "天河",
                prefix: "th/",
                collapsible: true,
                children: "structure"
            },
        ]
    },
])