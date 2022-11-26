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
});
