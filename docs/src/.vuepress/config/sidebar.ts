import {sidebar} from "vuepress-theme-hope";
import {CollectionSidebar} from "../../collection/sidebar"
import {FoodSidebar} from "../../life/food/sidebar";
import {PlaySidebar} from "../../life/play/sidebar";
import {HealthySidebar} from "../../life/healthy/sidebar";
import {JavaSidebar} from "../../it/java/sidebar";
import {ProjectSidebar} from "../../it/project/sidebar";
import {ShopSidebar} from "../../life/shop/sidebar";

export const SidebarConfig = sidebar({

    "/collection/": CollectionSidebar,

    // ----- Life -----

    "/life/healthy/": HealthySidebar,

    "/life/food/": FoodSidebar,

    "/life/play/": PlaySidebar,

    "/life/shop": ShopSidebar,

    // ----- IT -----

    "/it/java/": JavaSidebar,

    "/it/project/": ProjectSidebar,

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

    // "/it/database/mysql/": MySQLSidebar,

    // "/it/database/postgresql/": PostgreSQLSidebar,

    // "/it/apache/sharding-sphere/": ShardingSphereSidebar,
});