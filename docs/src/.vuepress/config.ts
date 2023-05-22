import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {containerPlugin} from "@vuepress/plugin-container";
import {renderProjects} from "./config/projects";
import {docsearchPlugin} from "@vuepress/plugin-docsearch";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "MW Blog",
    description: "MW Blog",
    head: [
        ["meta", {name: "keywords", content: "MW,Sherry,Sherry4869"}],
        ["script", {}, `
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement('script');
            hm.src = 'https://hm.baidu.com/hm.js?f920f2b7a642efd7744e052f2c9b7152';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(hm, s);
        })();`]
    ],
    plugins: [
        containerPlugin({
            type: 'projects',
            render: (tokens, idx) => {
                return renderProjects(tokens, idx)
            }
        }),
        docsearchPlugin({
            appId: "3BWRIKCJ5K",
            apiKey: "69ab740886a5bcb9703dfa42349119f0",
            indexName: "sherry4869",
            locales: {
                "/": {
                    placeholder: "搜索",
                    translations: {
                        button: {
                            buttonText: "搜索",
                            buttonAriaLabel: "搜索",
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: "清除查询条件",
                                resetButtonAriaLabel: "清除查询条件",
                                cancelButtonText: "取消",
                                cancelButtonAriaLabel: "取消",
                            },
                            startScreen: {
                                recentSearchesTitle: "搜索历史",
                                noRecentSearchesText: "没有搜索历史",
                                saveRecentSearchButtonTitle: "保存至搜索历史",
                                removeRecentSearchButtonTitle: "从搜索历史中移除",
                                favoriteSearchesTitle: "收藏",
                                removeFavoriteSearchButtonTitle: "从收藏中移除",
                            },
                            errorScreen: {
                                titleText: "无法获取结果",
                                helpText: "你可能需要检查你的网络连接",
                            },
                            footer: {
                                selectText: "选择",
                                navigateText: "切换",
                                closeText: "关闭",
                                searchByText: "搜索提供者",
                            },
                            noResultsScreen: {
                                noResultsText: "无法找到相关结果",
                                suggestedQueryText: "你可以尝试查询",
                                reportMissingResultsText: "你认为该查询应该有结果？",
                                reportMissingResultsLinkText: "点击反馈",
                            },
                        },
                    },
                },
            },
        }),
    ],

    theme,

    shouldPrefetch: false,
});
