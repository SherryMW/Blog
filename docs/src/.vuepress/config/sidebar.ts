import {sidebar} from "vuepress-theme-hope";
import {PostgreSQLSidebar} from "../../it/database/postgresql/sidebar"
import {CollectionSidebar} from "../../collection/sidebar"

export const SidebarConfig = sidebar({

    "/it/database/postgresql/": PostgreSQLSidebar,

    "/collection/": CollectionSidebar,

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
    // "/it/apache/sharding-sphere/": [
    //     {
    //         text: "高性能架构模式",
    //         link: "architecture/",
    //     },
    //     "mysql-zctb",
    //     "jdbc",
    //     "proxy",
    //     "distributed",
    //     "references"
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
    //
    // "/life/play/": [
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
    //         ]
    //     },
    //     "gogogo"
    // ],

});