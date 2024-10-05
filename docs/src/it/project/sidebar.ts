import {arraySidebar} from "vuepress-theme-hope";

export const ProjectSidebar = arraySidebar([
    {
        text: "慕课网",
        prefix: "imooc/",
        collapsible: true,
        children: [
            {
                text: "龙虾三少",
                prefix: "lxss/",
                collapsible: true,
                children: [
                    {
                        text: "SpringBoot构建电商基础秒杀项目",
                        prefix: "spike-basic/",
                        collapsible: true,
                        children: "structure"
                    }
                ]
            }
        ]
    }
])