import {arraySidebar} from "vuepress-theme-hope";

export const JavaSidebar = arraySidebar([
    {
        text: "入门",
        prefix: "entry-level/",
        children: [
            {
                text: "基础",
                prefix: "basics/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "Spring",
                prefix: "spring/",
                collapsible: true,
                children: "structure"
            }
        ]
    },
    {
        text: "初级",
        prefix: "junior/",
        children: [
            {
                text: "Spring Boot",
                prefix: "sprint-boot/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "Redis",
                prefix: "redis/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "工具",
                prefix: "tools/",
                collapsible: true,
                children: "structure"
            }
        ]
    },
    {
        text: "中级",
        prefix: "intermediate/",
        children: [
            // {
            //     text: "支付",
            //     prefix: "pay/",
            //     collapsible: true,
            //     children: [
            //         {
            //             text: "微信",
            //             prefix: "weixin/",
            //             children: "structure"
            //         },
            //         {
            //             text: "支付宝",
            //             prefix: "alipay/",
            //             children: "structure"
            //         }
            //     ]
            // }
        ]
    },
    {
        text: "高级",
        prefix: "senior/",
        children: []
    }
])