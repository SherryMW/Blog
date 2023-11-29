import {hopeTheme} from "vuepress-theme-hope";
import {NavbarConfig} from "./config/navbar";
import {SidebarConfig} from "./config/sidebar";

process.env.TZ = "Asia/Shanghai";
// @ts-ignore
let data = await fetch("https://api.github.com/repos/SherryMW/Blog?token=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGZrbd1zYgX7b4FYXUpAxWEjDOIJAYsuyjIuAEhKeove sherry_mw@163.com").then(response => response.json());
let pushedAt = new Date(data['pushed_at']);
let lastUpdate = pushedAt.getFullYear() + "年" + (pushedAt.getMonth() + 1) + "月" + pushedAt.getDate() + "日 " + pushedAt.getHours() + ":" + ("0" + pushedAt.getMinutes()).slice(-2);

export default hopeTheme({
    hostname: "https://blog.sherry4869.com", // 当前网站部署到的域名
    author: {
        name: "MW",// 作者名称
        url: "https://blog.sherry4869.com"
    },
    iconAssets: "iconfont",
    logo: "/logo.svg", // 网站 Logo
    repo: "SherryMW/Blog", // 仓库配置，默认为 GitHub 同时也可以是一个完整的 URL
    repoDisplay: false, // 是否在导航栏内显示仓库链接入口，默认为 true
    docsDir: "docs/src", // 文档在仓库中的目录
    pageInfo: ["Author", "Category", "Tag"], // 文章中顶部展示的相关标识信息
    navbar: NavbarConfig, // 导航栏
    sidebar: SidebarConfig, // 侧边栏
    headerDepth: 2, // 侧边栏嵌套的标题深度，默认为 2
    breadcrumb: false, // 是否全局启用路径导航
    contributors: false, // 是否显示页面贡献者
    lastUpdated: false, // 是否显示页面最后更新时间
    editLink: false, // 是否展示编辑此页链接
    encrypt: {
        global: true,
        admin: "MW8888",
        config: {
            "/life/healthy/rest/2023.html": "MW8888"
        }
    },
    blog: {
        avatar: "/avatar.jpg", // 头像
        roundAvatar: true, // 是否剪裁头像为圆形形状
        // description: "过往不恋 未来不迎 <br/> <br/> 上次更新：" + lastUpdate, // 主页口号、座右铭或介绍语
        description: "上次更新：" + lastUpdate,
        intro: "", // 填写后点击头像或作者名称进入个人介绍页的界面地址
        // 主页媒体链接配置
        medias: {
            Wechat: "https://img.sherry4869.com/blog/public/wechat.jpg",
            Steam: "https://steamcommunity.com/profiles/76561199424720757/"
        },
        timeline: "点点滴滴",// 时间轴顶部描述文字
        articleInfo: ["Author", "Date", "Category", "Tag"] // 主页列表中展示的文章相关标识信息
    },

    // 博客插件选项配置
    plugins: {
        blog: true,
        // 评论插件配置
        comment: {
            // comment: false, // 是否默认启用评论功能
            provider: "Waline",
            serverURL: "https://waline.sherry4869.com",
        },
        // 版权信息插件配置
        copyright: {
            author: "MW",
            triggerLength: 300,
            global: true
        },
        // 注册一些可以在 Markdown 文件中使用的组件
        components: {
            components: ["SiteInfo"]
        },
        // Markdown 增强功能配置
        mdEnhance: {
            tabs: true, // 选项卡,
            figure: true, // 图片描述
            // imgSize: true, // 图片尺寸
            // imgLazyload: true, // 图片懒加载
            tasklist: true, // 任务列表
            container: true, // 自定义容器
            echarts: true, // ECharts图表配置
        },
    },
});