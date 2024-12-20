import {arraySidebar} from "vuepress-theme-hope";

export const FoodSidebar = arraySidebar([
    {
        text: "广州",
        prefix: "guangzhou/",
        children: [
            {
                text: "越秀",
                prefix: "yx/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "天河",
                prefix: "th/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "荔湾",
                prefix: "lw/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "白云",
                prefix: "by/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "海珠",
                prefix: "hz/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "番禺",
                prefix: "py/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "黄埔",
                prefix: "hp/",
                collapsible: true,
                children: "structure"
            }
        ]
    },
    {
        text: "佛山",
        prefix: "foshan/",
        children: [
            {
                text: "禅城",
                prefix: "cc/",
                collapsible: true,
                children: "structure"
            }
        ]
    }
])