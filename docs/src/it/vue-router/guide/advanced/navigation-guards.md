---
category: IT
order: 1
article: false
---

# 导航守卫

正如其名，vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。这里有很多方式植入路由导航中：全局的，单个路由独享的，或者组件级的

## 全局前置守卫

你可以使用 `router.beforeEach` 注册一个全局前置守卫：

```js
const router = createRouter({...})

router.beforeEach((to, from) => {
    // ...
    // 返回 false 以取消导航
    return false
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于**等待中**

每个守卫方法接收两个参数：

- `to`: 即将要进入的目标 [用一种标准化的方式](#待更新)

- `from`: 当前导航正要离开的路由 [用一种标准化的方式](#待更新)

可以返回的值如下:

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址

- 一个[路由地址](#待更新): 通过一个路由地址跳转到一个不同的地址，就像你调用 [router.push()](#待更新) 一样，你可以设置诸如 `replace: true` 或 `name: 'home'` 之类的配置。当前的导航被中断，然后进行一个新的导航，就和 `from` 一样

```js
 router.beforeEach(async (to, from) => {
    if (
        // 检查用户是否已登录
        !isAuthenticated &&
        // ❗️ 避免无限重定向
        to.name !== 'Login'
    ) {
        // 将用户重定向到登录页面
        return {name: 'Login'}
    }
})
```

如果遇到了意料之外的情况，可能会抛出一个 `Error`。这会取消导航并且调用 [router.onError()](#待更新) 注册过的回调

如果什么都没有，`undefined` 或返回 `true`，则导航是有效的，并调用下一个导航守卫

以上所有都同 `async` 函数 和 Promise 工作方式一样：

```js
router.beforeEach(async (to, from) => {
    // canUserAccess() 返回 `true` 或 `false`
    const canAccess = await canUserAccess(to)
    if (!canAccess) return '/login'
})
```

示例：

```ts {29-34}
import { useUserStore } from "@/store/userStore";
import { Router, createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue')
    },
    {
        path: '/home',
        component: () => import('@/views/home/home.vue')
    },
    {
        path: '/login',
        component: () => import('@/views/login/login.vue')
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach(async (to, from) => {
    const userStore = useUserStore();
    if (!userStore.getToken && to.path !== '/login') { // 当用户没有有效令牌，并且正在尝试访问除了登录页之外的其他页面
        return { path: '/login' }
    }
})

export default router
```

### 可选的第三个参数 next

待更新