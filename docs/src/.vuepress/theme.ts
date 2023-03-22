import {hopeTheme} from "vuepress-theme-hope";
import {NavbarConfig} from "./config/navbar";
import {SidebarConfig} from "./config/sidebar";

process.env.TZ = "Asia/Shanghai";
let data = await fetch("https://api.github.com/repos/SherryMW/Blog?token=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGZrbd1zYgX7b4FYXUpAxWEjDOIJAYsuyjIuAEhKeove sherry_mw@163.com").then(response => response.json());
let pushedAt = new Date(data['pushed_at']);
let lastUpdate = pushedAt.getFullYear().toString() + "年" + (pushedAt.getMonth() + 1).toString() + "月" + pushedAt.getDate().toString() + "日 " + pushedAt.getHours() + ":" + ("0" + pushedAt.getMinutes()).slice(-2);

export default hopeTheme({
    hostname: "https://blog.sherry4869.com", // 当前网站部署到的域名
    author: {
        name: "MW", // 作者名称
        // url: "https://blog.sherry4869.com"
    },
    iconAssets: "iconfont", // 字体图标资源链接 https://www.iconfont.cn/
    logo: "/logo.svg", // 网站Logo
    repo: "SherryMW/Blog", // 仓库配置，默认为 GitHub 同时也可以是一个完整的 URL
    repoDisplay: false, // 是否在导航栏内显示仓库链接入口，默认为 `true`
    docsDir: "docs/src", // 文档在仓库中的目录

    /**
     * 文章内容中展示的文章信息
     * Author 作者
     * Date 写作日期
     * Original 是否原创
     * Category 分类
     * Tag 标签
     * ReadingTime 预计阅读时间
     * Word 字数
     * PageView 页面浏览量(仅 Waline 可用)
     */
    pageInfo: ["Author", "Category", "Tag", "Word"],
    navbar: NavbarConfig, // 导航栏
    sidebar: SidebarConfig, // 侧边栏
    headerDepth: 3, // 侧边栏嵌套的标题深度，默认为2
    breadcrumb: false, // 是否全局启用路径导航
    contributors: false, // 是否显示页面贡献者
    lastUpdated: false, // 是否显示页面最后更新时间
    editLink: false, // 是否展示编辑此页链接

    blog: {
        avatar: "/avatar.jpg", // 头像
        roundAvatar: true, // 是否剪裁头像为圆形形状
        description: "过往不恋 未来不迎 <p></p> 上次更新：" + lastUpdate, // 口号、座右铭或介绍语
        intro: "", // 填写后将可以点击博主头像或姓名进入个人介绍页
        // 媒体链接配置
        medias: {
            // QQ: "https://wpa.qq.com/msgrd?v=3&uin=1341139503&site=qq&menu=yes",
            Wechat: "https://img.sherry4869.com/blog/public/wechat.jpg"
        },
        timeline: "点点滴滴", // 时间轴自定义文字
        articleInfo: ["Author", "Date", "Category", "Tag", "Word"] // 文章列表中展示的文章信息
    },

    // 博客插件选项配置
    plugins: {
        blog: true,
        // 评论插件配置
        comment: {
            provider: "Waline",
            serverURL: "https://waline.sherry4869.com",
        },
        // 版权信息插件配置
        copyright: {
            author: "MW",
            triggerWords: 300,
            global: true
        },
        // 注册一些可以在 Markdown 文件中使用的组件
        components: {
            components: ["Badge", "BiliBili", "SiteInfo", "PDF", "VideoPlayer"]
        },
        // Markdown 增强功能配置
        mdEnhance: {
            // imgLazyload: true, // 图片懒加载
            imgSize: true, // 图片尺寸
            figure: true, // 图片描述
            tasklist: true, // 任务列表
            container: true, // 自定义容器
            echarts: true, // ECharts图表配置
            tabs: true, // 选项卡
        },
    },
});