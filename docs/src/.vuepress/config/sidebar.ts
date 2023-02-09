import {sidebar} from "vuepress-theme-hope";

export const Sidebar = sidebar({
    "/it/java/pay/": [
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
    "/it/apache/sharding-sphere/": [
        {
            text: "高性能架构模式",
            link: "gxnjgms/",
        },
        {
            text: "参考资料",
            link: "references/",
        }
    ],

    "/life/healthy/": [
        {
            text: "作息",
            prefix: "sleep/",
            collapsible: true,
            children: "structure"
        },
        {
            text: "健身",
            prefix: "gym/",
            collapsible: true,
            children: "structure"
        },
        {
            text: "呼吸内科",
            prefix: "ill/respiratory/",
            collapsible: true,
            children: "structure"
        },
        {
            text: "口腔科",
            prefix: "ill/dental/",
            collapsible: true,
            children: "structure"
        },
        {
            text: "皮肤科",
            prefix: "ill/skin/",
            collapsible: true,
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
                    text: "番禺",
                    prefix: "py/",
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
                },
                {
                    text: "海珠",
                    prefix: "hz/",
                    collapsible: true,
                    children: "structure"
                },
                "gogogo"
            ]
        }
    ],

    "/life/play/": [
        {
            text: "广州",
            prefix: "guangzhou/",
            children: [
                {
                    text: "密室/沉浸",
                    prefix: "chamber/",
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
                },
                "theatres"
            ]
        }
    ],

    "/link/": ["development", "design", "movies", "count", "friend"]

});