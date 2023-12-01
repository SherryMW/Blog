import {sidebar} from "vuepress-theme-hope";
import {CollectionSidebar} from "../../collection/sidebar"
import {FoodSidebar} from "../../life/food/sidebar";
import {PlaySidebar} from "../../life/play/sidebar";
import {VueSidebar} from "../../it/vue/sidebar";
import {JavaSidebar} from "../../it/java/sidebar";

export const SidebarConfig = sidebar({

    // ----- Life -----

    "/collection/": CollectionSidebar,

    "/life/food/": FoodSidebar,

    "/life/play/": PlaySidebar,

    // ----- IT -----

    "/it/es6/": [{
        text: "ECMAScript 6",
        children: "structure"
    }],

    "/it/vue/": VueSidebar,

    "/it/java/": JavaSidebar,

    // "/it/java/note/": NoteSidebar,

    // "/it/database/postgresql/": PostgreSQLSidebar,

    // "/it/apache/sharding-sphere/": ShardingSphereSidebar,

    "/life/healthy/": [
        {
            text: "作息",
            prefix: "rest/",
            collapsible: true,
            children: "structure"
        },
        // {
        //     text: "健身",
        //     prefix: "gym/",
        //     collapsible: true,
        //     children: "structure"
        // },
        // "ill"
    ],
});