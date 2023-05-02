import {navbar} from "vuepress-theme-hope";

export const NavbarConfig = navbar([
    {
        text: "主页",
        icon: "home",
        link: "/",
    },
    // {
    //     text: "生活",
    //     icon: "creative",
    //     prefix: "/life/",
    //     children: [
    //         {
    //             text: "健康",
    //             link: "healthy/sleep/2023"
    //         },
    //         {
    //             text: "饮食",
    //             link: "delicacies/"
    //         },
    //         {
    //             text: "娱乐",
    //             link: "play/"
    //         }
    //     ]
    // },
    {
        text: "收藏",
        icon: "start",
        link: "/collection/developers"
    },
    {
        text: "友情链接",
        icon: "link",
        link: "/friends"
    },
    // {
    //     text: "关于",
    //     icon: "info",
    //     link: "/intro"
    // }
]);
