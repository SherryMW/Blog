---
category: IT
order: 1
article: false
---

# 入门

用 Vue + Vue Router 创建单页应用非常简单：通过 Vue.js，我们已经用组件组成了我们的应用。当加入 Vue Router 时，我们需要做的就是将我们的组件映射到路由上，让 Vue Router 知道在哪里渲染它们。下面是一个基本的例子：

## HTML

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>

<div id="app">
    <h1>Hello App!</h1>
    <p>
        <!--使用 router-link 组件进行导航 -->
        <!--通过传递 `to` 来指定链接 -->
        <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
        <router-link to="/">Go to Home</router-link>
        <router-link to="/about">Go to About</router-link>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
</div>
```

### router-link

请注意，我们没有使用常规的 `a` 标签，而是使用一个自定义组件 `router-link` 来创建链接。这使得 Vue Router 可以在不重新加载页面的情况下更改 URL，处理 URL 的生成以及编码。我们将在后面看到如何从这些功能中获益

### router-view

`router-view` 将显示与 url 对应的组件。你可以把它放在任何地方，以适应你的布局

## JavaScript

```js
// 1. 定义路由组件.
// 也可以从其他文件导入
const Home = {template: '<div>Home</div>'}
const About = {template: '<div>About</div>'}

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    {path: '/', component: Home},
    {path: '/about', component: About},
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里暂时保持简单
const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// 5. 创建并挂载根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// 现在，应用已经启动了！
```

通过调用 `app.use(router)`，我们会触发第一次导航且可以在任意组件中以 `this.$router` 的形式访问它，并且以 `this.$route` 的形式访问当前路由：

```js
// Home.vue
export default {
    computed: {
        username() {
            // 我们很快就会看到 `params` 是什么
            return this.$route.params.username
        },
    },
    methods: {
        goToDashboard() {
            if (isAuthenticated) {
                this.$router.push('/dashboard')
            } else {
                this.$router.push('/login')
            }
        },
    },
}
```

要在 `setup` 函数中访问路由，请调用 `useRouter` 或 `useRoute` 函数。我们将在 [Composition API](待更新) 中了解更多信息

在整个文档中，我们会经常使用 `router` 实例，请记住，`this.$router` 与直接使用通过 `createRouter` 创建的 `router` 实例完全相同。我们使用 `this.$router` 的原因是，我们不想在每个需要操作路由的组件中都导入路由

## TypeScript

当我们使用 [Vite](/it/vite/guide/) 构建一个 Vue + TypeScript 项目后，通过[安装](../start/installation.md) 后就可以引入 `vue-router` 模块：

```ts
import { createRouter } from "vue-router";
```

从 `vue-router` 模块中导入 `createRouter` 函数，该函数用于创建一个 Vue Router 实例，它接受一个配置对象作为参数，该对象包含了路由的各种配置信息。一旦创建了路由实例，你就可以将其传递给 Vue 应用的根实例，以便在应用中使用路由功能

我们可以通过 ctrl + 鼠标左键点击 `createRouter` 函数进入到 `vue-router.d.ts` 文件当中

```ts
/**
 * Creates a Router instance that can be used by a Vue app.
 *
 * @param options - {@link RouterOptions}
 */
export declare function createRouter(options: RouterOptions): Router;
```

在 TypeScript 中，`.d.ts` 文件是声明文件的一种约定。这些文件包含了类型声明但不包含实际的可执行代码。`.d.ts` 文件主要用于在 TypeScript 项目中提供类型信息，以便编辑器能够提供更好的代码提示和类型检查

在 Vue Router 的情况下，`vue-router.d.ts` 文件提供了 Vue Router 的 TypeScript 类型声明，使得你在使用 Vue Router 时可以得到类型安全的支持。`.d` 是 declaration（声明）的缩写，这样的文件主要用于描述类型

让我们逐步解释 `createRouter` 声明：

- `export declare`：这表示该声明是要导出的。`export` 用于将声明暴露给其他模块，而 `declare` 则告诉 TypeScript 编译器，这个声明不会在实际的 JavaScript 代码中存在，它只是用于类型检查

- `function createRouter(options: RouterOptions): Router`：这是函数声明。它表明有一个叫做 `createRouter` 的函数，该函数接受一个参数 `options`，其类型为 `RouterOptions`，并且该函数会返回一个 `Router` 对象

::: tabs

@tab /router/index.ts

```ts
import {Router, createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home'
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

export default router
```

@tab main.ts

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

@tab App.vue

```vue
<template>
    <RouterView></RouterView>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
```

@tab /views/home/home.vue

```vue
<template>
    <h1>home</h1>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
```

@tab /views/login/login.vue

```vue
<template>
    <h1>login</h1>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
```

:::