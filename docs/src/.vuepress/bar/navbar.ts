import {navbar} from "vuepress-theme-hope";

export const Navbar = navbar([
    {
        text: "主页",
        icon: "home",
        link: "/",
    },
    {
        text: '生活',
        icon: 'emoji',
        children: [
            {
                text: "健康",
                link: "/life/healthy/"
            },
            {
                text: "美食",
                link: "/life/delicacies/"
            },
            {
                text: "娱乐",
                link: "/life/play/guangzhou/RoomEscape/"
            }
        ]
    }
]);
