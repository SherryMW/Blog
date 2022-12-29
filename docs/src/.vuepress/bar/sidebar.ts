import {sidebar} from "vuepress-theme-hope";

export const Sidebar = sidebar({
    "/IT/Apache/ShardingSphere/": [
        {
            text: "高性能架构模式",
            link: "高性能架构模式/",
            collapsible: false
        },
        {
            text: "学习资料",
            link: "学习资料/",
        }
    ],
    "/life/delicacies/": [
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
                    text: "白云",
                    prefix: "by/",
                    collapsible: true,
                    children: "structure"
                }
            ]
        }
    ]
});
