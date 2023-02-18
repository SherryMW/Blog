import {navbar} from "vuepress-theme-hope";

export const Navbar = navbar([
    {
        text: "主页",
        icon: "home",
        link: "/",
    },
    // {
    //     text: "生活",
    //     icon: "emoji",
    //     prefix: "/life/",
    //     children: [
    //         {
    //             text: "健康",
    //             link: "healthy/"
    //         },
    //         {
    //             text: "饮食",
    //             link: "delicacies/"
    //         },
    //         {
    //             text: "娱乐",
    //             link: "play/guangzhou/"
    //         }
    //     ]
    // },
    {
        text: "链接",
        icon: "link",
        link: "/link/development"
    }
]);
