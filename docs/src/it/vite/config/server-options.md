---
category: IT
order: 3
article: false
---

# 开发服务器选项

## server.proxy

- 类型：`Record<string, string | ProxyOptions>`

为开发服务器配置自定义代理规则。期望接收一个 `{ key: options }` 对象。任何请求路径以 key 值开头的请求将被代理到对应的目标。如果 key 值以 `^` 开头，将被识别为 `RegExp`。`configure` 选项可用于访问 proxy 实例

请注意，如果使用了非相对的 [基础路径 base](#待更新)，则必须在每个 key 值前加上该 `base`

继承自 [http-proxy](https://github.com/http-party/node-http-proxy#options)。完整选项详见 [此处](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L12)

在某些情况下，你可能也想要配置底层的开发服务器。（例如添加自定义的中间件到内部的 [connect](https://github.com/senchalabs/connect) 应用中）为了实现这一点，你需要编写你自己的 [插件](#待更新) 并使用 [configureServer](#待更新) 函数

```js
export default defineConfig({
    server: {
        proxy: {
            // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
            '/foo': 'http://localhost:4567',
            // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
            '^/fallback/.*': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/fallback/, ''),
            },
            // 使用 proxy 实例
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                configure: (proxy, options) => {
                    // proxy 是 'http-proxy' 的实例
                }
            },
            // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
            '/socket.io': {
                target: 'ws://localhost:5174',
                ws: true,
            },
        },
    },
})
```

示例：

```vue
<template>
    <h1>home</h1>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted } from 'vue';

const envApi = async () => {
  await axios.get('/api/env').then(res => {
    console.log(res.data);
  })
}

onMounted(() => {
    envApi();
})

</script>

<style scoped></style>
```

控制台报错：**Access to XMLHttpRequest at 'http://localhost:8080/env' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.**

当遇到上述跨域资源共享（CORS）问题时，可以设置代理服务器将前端的请求代理到后端服务：

::: tabs

@tab vite.config.ts

```ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        // 代理服务
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        }
    }
})
```

- `server`：这是开发服务器的配置部分

- `proxy`：这是开发服务器的代理配置。代理的作用是在开发阶段将前端应用中某些请求代理到另一个地址，通常是后端服务

- `/api`： 这表示配置了一个代理规则，当请求的路径以 "/api" 开头时，会触发代理

- `target`：这是代理目标的基础路径。所有匹配 "/api" 路径的请求都会被代理到 'http://localhost:8080'

- `rewrite`：这是一个可选项，用于修改请求的路径。在这里，`rewrite` 函数将请求路径中的 "/api" 前缀移除。例如，如果前端发起了 "/api/some-endpoint" 的请求，经过代理后，实际上请求的是 'http://localhost:8080/some-endpoint'

@tab Home.vue

```vue
<template>
    <h1>home</h1>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted } from 'vue';

const envApi = async () => {
  await axios.get('/api/env').then(res => {
    console.log(res.data);
  })
}

onMounted(() => {
    envApi();
})

</script>

<style scoped></style>
```

:::