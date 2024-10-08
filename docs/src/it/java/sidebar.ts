import {arraySidebar} from "vuepress-theme-hope";

export const JavaSidebar = arraySidebar([
    {
        text: "Java SE",
        prefix: "javase/",
        collapsible: true,
        children: [
            "computer-basics",
            "overview",
            "download-install",
            "first-java",
            "intellij-idea",
            {
                text: "基础语法",
                prefix: "basic-grammar/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "面向对象",
                prefix: "object-oriented/",
                collapsible: true,
                children: "structure"
            },
            {
                text: "数组",
                prefix: "arrays/",
                collapsible: true,
                children: "structure"
            },
            "jvm-system",
            "uml",
            {
                text: "设计模式",
                prefix: "design-pattern/",
                collapsible: true,
                children: "structure"
            }
        ]
    },
    {
        text: "Spring",
        prefix: "spring/",
        collapsible: true,
        children: [
            {
                text: "Spring AI",
                prefix: "spring-ai/",
                collapsible: true,
                children: "structure"
            },
        ]
    },
    {
        text: "测试",
        prefix: "test/",
        collapsible: true,
        children: "structure"
    },
    "xxl-job",
    // {
    //     text: "消息中间件",
    //     prefix: "messaging/",
    //     collapsible: true,
    //     children: [
    //         "README.md",
    //         {
    //             text: "Kafka",
    //             prefix: "kafka/",
    //             collapsible: true,
    //             children: "structure"
    //         },
    //     ]
    // }
])

// export const JavaSidebar = arraySidebar([
//     {
//         text: "入门",
//         prefix: "entry-level/",
//         children: [
//             {
//                 text: "基础",
//                 prefix: "basics/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "Spring",
//                 prefix: "spring/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "工具",
//                 prefix: "tools/",
//                 collapsible: true,
//                 children: "structure"
//             }
//         ]
//     },
//     {
//         text: "初级",
//         prefix: "junior/",
//         children: [
//             {
//                 text: "Spring Boot",
//                 prefix: "sprint-boot/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "Redis",
//                 prefix: "redis/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "工具",
//                 prefix: "tools/",
//                 collapsible: true,
//                 children: "structure"
//             }
//         ]
//     },
//     {
//         text: "中级",
//         prefix: "intermediate/",
//         children: [
//             {
//                 text: "Spring Cloud",
//                 prefix: "spring-cloud/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "Spring Cloud Alibaba",
//                 prefix: "spring-cloud-alibaba/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "支付",
//                 prefix: "pay/",
//                 collapsible: true,
//                 children: [
//                     "payment-security",
//                     {
//                         text: "微信支付",
//                         prefix: "weixin/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                     {
//                         text: "支付宝支付",
//                         prefix: "alipay/",
//                         collapsible: true,
//                         children: "structure"
//                     }
//                 ]
//             },
//             {
//                 text: "并发编程",
//                 prefix: "juc/",
//                 collapsible: true,
//                 children: [
//                     {
//                         text: "锁",
//                         prefix: "lock/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                 ]
//             },
//             {
//                 text: "消息中间件",
//                 prefix: "mq/",
//                 collapsible: true,
//                 children: [
//                     "README",
//                     {
//                         text: "ActiveMQ",
//                         prefix: "activemq/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                     {
//                         text: "Kafka",
//                         prefix: "kafka/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                     {
//                         text: "RabbitMQ",
//                         prefix: "rabbitmq/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                     {
//                         text: "RocketMQ",
//                         prefix: "rocketmq/",
//                         collapsible: true,
//                         children: "structure"
//                     },
//                 ]
//             },
//             {
//                 text: "Sharding Sphere",
//                 prefix: "sharding-sphere/",
//                 collapsible: true,
//                 children: "structure"
//             },
//             {
//                 text: "工具",
//                 prefix: "tools/",
//                 collapsible: true,
//                 children: "structure"
//             },
//         ]
//     },
//     {
//         text: "高级",
//         prefix: "senior/",
//         children: [
//             {
//                 text: "算法",
//                 prefix: "algorithm/",
//                 collapsible: true,
//                 children: "structure"
//             },
//         ]
//     },
//     "interview"
// ])