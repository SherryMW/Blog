import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "MW Blog",
    description: "MW Blog",
    head: [
        ["meta", {name: "google-site-verification", content: "bqJ9p_CBwVm2NILF0O4wil3tvCMGYwHdmDUYU6QQNwA"}],
        ['script', {}, `
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement('script');
            hm.src = 'https://hm.baidu.com/hm.js?f920f2b7a642efd7744e052f2c9b7152';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(hm, s);
        })();`]
    ],
    plugins: [],

    theme,

    shouldPrefetch: false,
});