import {navbar} from "vuepress-theme-hope";

export const NavbarConfig = navbar([
    {
        text: "主页",
        icon: "home",
        link: "/",
    },
    {
        text: "生活",
        icon: "creative",
        prefix: "/life/",
        children: [
            {
                text: "健康",
                link: "healthy/rest/2024"
            },
            {
                text: "美食",
                link: "food/"
            },
            {
                text: "娱乐",
                link: "play/"
            }
        ]
    },
    {
        text: "收藏",
        icon: "box",
        link: "/collection/developers"
    },
    {
        text: "友情链接",
        icon: "link",
        link: "/friends"
    },
    {
        text: "关于",
        icon: "info",
        link: "/intro"
    }
]);
