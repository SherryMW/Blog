import {navbar} from "vuepress-theme-hope";

export const NavbarConfig = navbar([
    {
        text: "主页",
        icon: "home",
        link: "/",
    },
    {
        text: "生活",
        prefix: "/life/",
        children: [
            {
                text: "健康",
                link: "healthy/rest"
            },
            {
                text: "美食",
                link: "food/"
            },
            {
                text: "娱乐",
                link: "play/"
            },
            {
                text: "购物",
                link: "shop/sm"
            }
        ]
    },
    {
        text: "收藏",
        link: "/collection/developers"
    },
    {
        text: "友情链接",
        link: "/friends"
    },
    {
        text: "关于",
        link: "/intro"
    }
]);
