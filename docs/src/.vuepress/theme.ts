import {hopeTheme} from "vuepress-theme-hope";
import {Navbar} from "./bar/navbar";
import {Sidebar} from "./bar/sidebar";

export default hopeTheme({
    hostname: "https://blog.sherry4869.com", //当前网站部署到的域名

    author: {
        name: "MW", //全局默认作者
        url: "https://blog.sherry4869.com", //网站部署域名
    },

    iconAssets: "iconfont", //字体图标资源链接 https://www.iconfont.cn/

    logo: "/logo.svg", //网站Logo

    repo: "SherryMW/Blog", //仓库配置，默认为 GitHub 同时也可以是一个完整的 URL

    repoDisplay: true, //是否在导航栏内显示仓库链接入口，默认为 `true`

    docsDir: "docs/src", //文档在仓库中的目录

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
    pageInfo: ["Author", "Date", "Category", "Tag", "Word"],

    navbar: Navbar, //导航栏

    sidebar: Sidebar, //侧边栏

    headerDepth: 2, //侧边栏嵌套的标题深度，默认为2

    breadcrumb: false, //是否全局启用路径导航

    contributors: true, //是否显示页面贡献者

    lastUpdated: true, //是否显示页面最后更新时间

    editLink: true, //是否展示编辑此页链接

    blog: {
        avatar: "/avatar.jpg", //头像
        roundAvatar: true, //是否剪裁头像为圆形形状
        description: "过往不恋 未来不迎", //口号、座右铭或介绍语
        intro: "", //填写后将可以点击“博主信息”中的头像或姓名进入个人介绍页
        medias: { //媒体链接配置
            // QQ: "https://wpa.qq.com/msgrd?v=3&uin=1341139503&site=qq&menu=yes",
            Wechat: "/wechat.jpg"
        },
        timeline: "点点滴滴", //时间轴自定义文字
        articleInfo: ["Author", "Date", "Category", "Tag", "Word"] //文章列表中展示的文章信息
    },

    encrypt: {
        // global:true, //是否全局加密
        // admin: "password", //最高权限密码，可以以数组的形式设置多个
        // config: {
        //     "/guide/": ["1234", "5678"], //这会加密整个 guide 目录，并且两个密码都是可用的
        //     "/guide/page.html": "1234" //这只会加密 guide/page.html
        // },
    },

    plugins: {
        blog: true, //博客插件选项配置
        comment: { //评论插件配置
            provider: "Waline",
            serverURL: "https://waline.sherry4869.com",
        },
        copyright: { //版权信息插件配置
            author: "MW",
            triggerWords: 10,
            global: true
        },
        components: {
            components: ["Badge", "BiliBili", "PDF", "VideoPlayer"] //注册一些可以在 Markdown 文件中使用的组件
        },
        mdEnhance: { //Markdown 增强功能
        }
    },
});
