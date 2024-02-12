import {sidebar} from "vuepress-theme-hope";
import {CollectionSidebar} from "../../collection/sidebar"
import {FoodSidebar} from "../../life/food/sidebar";
import {PlaySidebar} from "../../life/play/sidebar";
import {JavaSidebar} from "../../it/java/sidebar";
import {HealthySidebar} from "../../life/healthy/sidebar";

export const SidebarConfig = sidebar({

    // ----- Life -----

    "/life/healthy/": HealthySidebar,

    "/collection/": CollectionSidebar,

    "/life/food/": FoodSidebar,

    "/life/play/": PlaySidebar,

    // ----- IT -----

    // "/it/es6/": [{
    //     text: "ECMAScript 6",
    //     children: "structure"
    // }],
    //
    // "/it/vue/": VueSidebar,
    //
    // "/it/vue-router/": VueRouterSidebar,
    //
    // "/it/vite/": ViteSidebar,
    //
    // "/it/pinia/": PiniaSidebar,

    // "/it/database/": DatabaseSidebar,

    "/it/java/": JavaSidebar,

    // "/it/database/mysql/": MySQLSidebar,

    // "/it/database/postgresql/": PostgreSQLSidebar,

    // "/it/apache/sharding-sphere/": ShardingSphereSidebar,
});