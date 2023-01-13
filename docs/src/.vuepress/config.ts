import {defineUserConfig} from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "MW Blog",
    description: "MW Blog",
    head: [
        ["meta", {name: "google-site-verification", content: "bqJ9p_CBwVm2NILF0O4wil3tvCMGYwHdmDUYU6QQNwA"}]
    ],
    plugins: [],

    theme,

    shouldPrefetch: false,
});