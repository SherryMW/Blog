import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {configPlugins} from "./config/plugins";

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
    plugins: configPlugins,

    theme,

    shouldPrefetch: false,
});
