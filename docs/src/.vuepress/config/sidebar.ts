import {sidebar} from "vuepress-theme-hope";
import {CollectionSidebar} from "../../collection/sidebar"
import {FoodSidebar} from "../../life/food/sidebar";
import {PlaySidebar} from "../../life/play/sidebar";
import {VueSidebar} from "../../it/vue/sidebar";

export const SidebarConfig = sidebar({

    "/collection/": CollectionSidebar,

    "/life/food/": FoodSidebar,

    "/life/play/": PlaySidebar,

    "/it/es6/":[
        {
            text: "ECMAScript 6",
            children: "structure"
        },
    ],

    "/it/vue/": VueSidebar,

    // "/it/java/note/": NoteSidebar,

    // "/it/database/postgresql/": PostgreSQLSidebar,

    // "/it/apache/sharding-sphere/": ShardingSphereSidebar,

    // "/it/java/pay/": [
    //     {
    //         text: "微信",
    //         prefix: "weixin/",
    //         children: "structure"
    //     },
    //     {
    //         text: "支付宝",
    //         prefix: "alipay/",
    //         children: "structure"
    //     }
    // ],
    //
    "/life/healthy/": [
        {
            text: "作息",
            prefix: "rest/",
            collapsible: true,
            children: "structure"
        },
        // {
        //     text: "健身",
        //     prefix: "gym/",
        //     collapsible: true,
        //     children: "structure"
        // },
        // "ill"
    ],
    //
    // "/life/delicacies/": [
    //     {
    //         text: "广州",
    //         prefix: "guangzhou/",
    //         children: [
    //             {
    //                 text: "天河",
    //                 prefix: "th/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //             {
    //                 text: "越秀",
    //                 prefix: "yx/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //             {
    //                 text: "荔湾",
    //                 prefix: "lw/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //             {
    //                 text: "番禺",
    //                 prefix: "py/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //             {
    //                 text: "白云",
    //                 prefix: "by/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //             {
    //                 text: "海珠",
    //                 prefix: "hz/",
    //                 collapsible: true,
    //                 children: "structure"
    //             },
    //         ]
    //     },
    //     "gogogo"
    // ],
});