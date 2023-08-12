import {arraySidebar} from "vuepress-theme-hope";

export const PlaySidebar = arraySidebar([
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
                text: "荔湾",
                prefix: "lw/",
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
        ]
    },
    "gogogo"
])