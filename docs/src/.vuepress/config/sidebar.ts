import {sidebar} from "vuepress-theme-hope";
import {PostgreSQLSidebar} from "../../it/database/postgresql/sidebar"
import {ShardingSphereSidebar} from "../../it/apache/sharding-sphere/sidebar";
import {CollectionSidebar} from "../../collection/sidebar"
import {PlaySidebar} from "../../life/play/sidebar";

export const SidebarConfig = sidebar({

    "/it/database/postgresql/": PostgreSQLSidebar,

    "/it/apache/sharding-sphere/": ShardingSphereSidebar,

    "/collection/": CollectionSidebar,

    "/life/play/": PlaySidebar

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
    // "/life/healthy/": [
    //     {
    //         text: "作息",
    //         prefix: "sleep/",
    //         collapsible: true,
    //         children: "structure"
    //     },
    //     {
    //         text: "健身",
    //         prefix: "gym/",
    //         collapsible: true,
    //         children: "structure"
    //     },
    //     "ill"
    // ],
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