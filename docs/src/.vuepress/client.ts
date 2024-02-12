// @ts-ignore
import type {ClientConfig} from "vuepress/client";
// @ts-ignore
import {defineClientConfig} from "vuepress/client";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default <ClientConfig>defineClientConfig({
    enhance: ({app, router, siteData}) => {
        app.use(ElementPlus);
    },
});