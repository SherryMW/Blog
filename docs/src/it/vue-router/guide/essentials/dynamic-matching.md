---
category: IT
order: 2
shortTitle: 动态路由匹配
article: false
---

# 带参数的动态路由匹配

很多时候，我们需要将给定匹配模式的路由映射到同一个组件。例如，我们可能有一个 `User` 组件，它应该对所有用户进行渲染，但用户 ID 不同。在 Vue Router 中，我们可以在路径中使用一个动态字段来实现，我们称之为 路径参数 ：

```js
const User = {
    template: '<div>User</div>',
}

// 这些都会传递给 `createRouter`
const routes = [
    // 动态字段以冒号开始
    {path: '/users/:id', component: User},
]
```

现在像 `/users/johnny` 和 `/users/jolyne` 这样的 URL 都会映射到同一个路由

路径参数 用冒号 `:` 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 `this.$route.params` 的形式暴露出来。因此，我们可以通过更新 `User` 的模板来呈现当前的用户 ID：

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

你可以在同一个路由中设置有多个 路径参数，它们会映射到 `$route.params` 上的相应字段。例如：

|              匹配模式              |           匹配路径            |              $route.params               |
|:------------------------------:|:-------------------------:|:----------------------------------------:|
|        /users/:username        |      	/users/eduardo      |        `{ username: 'eduardo' }`         |
| /users/:username/posts/:postId | 	/users/eduardo/posts/123 | `{ username: 'eduardo', postId: '123' }` |

除了 `$route.params` 之外，`$route` 对象还公开了其他有用的信息，如 `$route.query`（如果 URL 中存在参数）、`$route.hash` 等。你可以在 [API 参考](待更新)中查看完整的细节

## 响应路由参数的变化

使用带有参数的路由时需要注意的是，当用户从 `/users/johnny` 导航到 `/users/jolyne` 时，**相同的组件实例将被重复使用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，**这也意味着组件的生命周期钩子不会被调用**。组件的 `created`、`mounted`、`updated` 等生命周期钩子不会被再次调用，因为组件实例并没有被销毁

```js
const routes = [
    {
        path: '/users/:username',
        component: UserDetail,
        name: 'user-detail'
    }
];
```

在上述这个例子中，如果 `UserDetail` 组件中有一些在 `created` 或 `mounted` 生命周期钩子中执行的逻辑，这些逻辑不会在从 `/users/johnny` 导航到 `/users/jolyne` 时重新执行

如果要对同一个组件中参数的变化做出响应的话，你可以简单地 watch `$route` 对象上的任意属性，在这个场景中，就是 `$route.params`：

```js
const User = {
    template: '...',
    created() {
        this.$watch(
            () => this.$route.params,
            (toParams, previousParams) => {
                // 对路由变化做出响应...
            }
        )
    },
}
```

或者，使用 `beforeRouteUpdate` [导航守卫](待更新)，它也可以取消导航：

```js
const User = {
    template: '...',
    async beforeRouteUpdate(to, from) {
        // 对路由变化做出响应...
        this.userData = await fetchUser(to.params.id)
    },
}
```

## 捕获所有路由或 404 Not found 路由

常规参数只匹配 url 片段之间的字符，用 `/` 分隔。如果我们想匹配**任意路径**，我们可以使用自定义的路径参数正则表达式，在路径参数后面的括号中加入正则表达式 :

```js
const routes = [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
    // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
    {path: '/user-:afterUser(.*)', component: UserGeneric},
]
```

在这个特定的场景中，我们在括号之间使用了[自定义正则表达式](待更新)，并将 `pathMatch` 参数标记为[可选可重复](待更新)。这样做是为了让我们在需要的时候，可以通过将 `path` 拆分成一个数组，直接导航到路由：

```js
this.$router.push({
    name: 'NotFound',
    // 保留当前路径并删除第一个字符，以避免目标 URL 以 `//` 开头。
    params: {pathMatch: this.$route.path.substring(1).split('/')},
    // 保留现有的查询和 hash 值，如果有的话
    query: this.$route.query,
    hash: this.$route.hash,
})
```

更多内容请参见[重复参数](待更新)部分

如果你正在使用[历史模式](待更新)，请务必按照说明正确配置你的服务器

### 示例

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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/404.vue')
    },
    {
        path: '/home',
        component: () => import('@/views/home/home.vue')
    }
]

const router: Router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
```

@tab /views/error/404.vue

```vue
<template>
  <el-result icon="error" title="404" sub-title="肥肠抱歉，你要找的页面不见了">
    <template #extra>
      <el-button type="primary" @click="$router.push('/home')">返回首页</el-button>
    </template>
  </el-result>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
```

:::

## 高级匹配模式

Vue Router 使用自己的路径匹配语法，其灵感来自于 `express`，因此它支持许多高级匹配模式，如可选的参数，零或多个 / 一个或多个，甚至自定义的正则匹配规则。请查看[高级匹配](待更新)文档来探索它们