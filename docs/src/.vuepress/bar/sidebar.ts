import {sidebar} from "vuepress-theme-hope";

export const Sidebar = sidebar({
    // "/IT/Apache/ShardingSphere/": [
    //     {
    //         text: "高性能架构模式",
    //         link: "高性能架构模式/",
    //         collapsible: false
    //     },
    //     {
    //         text: "学习资料",
    //         link: "学习资料/",
    //     }
    // ],
    "/IT/Java/pay/": [
        {
            text: "微信",
            prefix: "weixin/",
            children: "structure"
        },
        {
            text: "支付宝",
            prefix: "alipay/",
            children: "structure"
        }
    ],
    "/life/healthy/": [
        {
            text: "休息",
            prefix: "sleep/",
            children: "structure"
        },
        {
            text: "健身",
            prefix: "gym/",
            children: "structure"
        },
        {
            text: "呼吸科",
            prefix: "respiratory/",
            children: "structure"
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
    ],
    "/life/play/": [
        {
            text: "广州",
            prefix: "guangzhou/",
            children: [
                {
                    text: "密室逃脱",
                    prefix: "RoomEscape/",
                    collapsible: true,
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
                            text: "番禺",
                            prefix: "py/",
                            collapsible: true,
                            children: "structure"
                        }
                    ]
                }
            ]
        }
    ]
});
