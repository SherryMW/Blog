import {hopeTheme} from "vuepress-theme-hope";
import {NavbarConfig} from "./config/navbar";
import {SidebarConfig} from "./config/sidebar";

process.env.TZ = "Asia/Shanghai";
// @ts-ignore
let response = await fetch("https://api.github.com/repos/SherryMW/Blog/commits", {
    headers: {
        Authorization: "token=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGZrbd1zYgX7b4FYXUpAxWEjDOIJAYsuyjIuAEhKeove sherry_mw@163.com"
    }
}).then(res => res.json());
const commitMessage = response[0].commit.message;
const date = new Date(response[0].commit.author.date);
const commitDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

export default hopeTheme({
    hostname: "https://blog.sherry4869.com", // 当前网站部署到的域名
    author: {
        name: "MW",// 作者名称
        url: "https://blog.sherry4869.com"
    },
    iconAssets: "fontawesome",
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
    darkmode: "disable", // 强制浅色模式
    encrypt: {
        global: true,
        admin: "MW8888",
    },
    blog: {
        avatar: "/avatar.jpg", // 头像
        description: "过往不恋 未来不迎 <br/><br/> 上次更新：" + commitDate + "<br/><br/>更新内容：" + commitMessage, // 主页口号、座右铭或介绍语
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
        searchPro: true, // 搜索插件
        // 版权信息插件配置
        copyright: {
            author: "MW",
            triggerLength: 300,
            global: true
        },
        // 注册一些可以在 Markdown 文件中使用的组件
        // components: {
        //     components: []
        // },
        // Markdown 增强功能配置
        markdownTab: { // 选项卡
            tabs: true
        },
        markdownImage: {
            figure: true, // 图片描述
            // size: true // 图片大小
        },
        mdEnhance: {
            echarts: true, // ECharts图表配置
            tasklist: true // 任务列表
        },
    },
});