---
category: IT
article: false
---

# 环境变量和模式

## 环境变量

Vite 在一个特殊的 `import.meta.env` 对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量：

- `import.meta.env.MODE`: {string} 应用运行的[模式](#待更新)

- `import.meta.env.BASE_URL`: {string} 部署应用时的基本 URL。他由 [base 配置](#待更新)项决定

- `import.meta.env.PROD`: {boolean} 应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'`）

- `import.meta.env.DEV`: {boolean} 应用是否运行在开发环境 (永远与 `import.meta.env.PROD` 相反)

- `import.meta.env.SSR`: {boolean} 应用是否运行在 [server](#待更新) 上

## .env 文件

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从你的 [环境目录](#待更新) 中的下列文件加载额外的环境变量：

```text
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

::: info 环境加载优先级
一份用于指定模式的文件（例如 `.env.production`）会比通用形式的优先级更高（例如 `.env`）

另外，Vite 执行时已经存在的环境变量有最高的优先级，不会被 `.env` 类文件覆盖。例如当运行 `VITE_SOME_KEY=123 vite build` 的时候。

`.env` 类文件会在 Vite 启动一开始时被加载，而改动会在重启服务器后生效。
:::

加载的环境变量也会通过 `import.meta.env` 以字符串形式暴露给客户端源码

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 vite 处理的代码。例如下面这些环境变量：

```text
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会

```js
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

此外，Vite 使用 [dotenv-expand](https://github.com/motdotla/dotenv-expand) 来直接拓展变量。想要了解更多相关语法，请查看 [它们的文档](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)

请注意，如果想要在环境变量中使用 `$` 符号，则必须使用 `\` 对其进行转义

```text
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

如果你想自定义 env 变量的前缀，请参阅 [envPrefix](#待更新)

::: warning 安全注意事项
`.env.*.local` 文件应是本地的，可以包含敏感变量。你应该将 `*.local` 添加到你的 `.gitignore` 中，以避免它们被 git 检入

由于任何暴露给 Vite 源码的变量最终都将出现在客户端包中，`VITE_*` 变量应该不包含任何敏感信息
:::

### TypeScript 的智能提示

默认情况下，Vite 在 [vite/client.d.ts](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.env` 提供了类型定义。随着在 `.env[mode]` 文件中自定义了越来越多的环境变量，你可能想要在代码中获取这些以 `VITE_` 为前缀的用户自定义环境变量的 TypeScript 智能提示

要想做到这一点，你可以在 `src` 目录下创建一个 `env.d.ts` 文件，接着按下面这样增加 `ImportMetaEnv` 的定义：

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
```

如果你的代码依赖于浏览器环境的类型，比如 DOM 和 WebWorker，你可以在 `tsconfig.json` 中修改 [lib](https://www.typescriptlang.org/tsconfig#lib) 字段来获取类型支持

```json
{
  "lib": ["WebWorker"]
}
```

## HTML 环境变量替换

待更新

## 模式

待更新

## NODE_ENV and Modes

待更新

## 示例

默认情况下，开发服务器（`dev` 命令）运行在 `.env.development`（开发）模式

默认情况下，`build` 命令运行在 `.env.production`（生产）模式

```vue
<template>
    <RouterView></RouterView>
</template>

<script setup lang="ts">
console.log(import.meta.env)
</script>

<style scoped></style>
```

打印结果：

```json
{
    "BASE_URL": "/",
    "MODE": "development",
    "DEV": true,
    "PROD": false,
    "SSR": false
}
```

我们在项目根目录下创建 `.env.development` 文件

```text
VITE_PROJECT=test-project
```

`console.log(import.meta.env)` 打印结果：

```json
{
    "VITE_PROJECT": "test-project",
    "BASE_URL": "/",
    "MODE": "development",
    "DEV": true,
    "PROD": false,
    "SSR": false
}
```

这样实现多环境就比较容易了，我们只需要定义多个 `.env.[mode]` 文件，在启动的时候指定对应环境就可以读取到对应环境的配置了

::: tabs

@tab .env.dev

```text
VITE_API_URL=http://localhost:8080
```

@tab .env.test

```text
VITE_API_URL=http://localhost:8081
```

@tab .env.uat

```text
VITE_API_URL=http://localhost:8082
```

@tab .env.prod

```text
VITE_API_URL=http://localhost:8083
```

:::

在工程根目录下找到 `vite-env.d.ts` 文件，新增 TypeScript 的智能提示：

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
```

此时我们自定义的 Axios 封装请求后端接口的 `baseURL` 就可以动态加载：

```ts
import axios from "axios";

const instance = axios.create({
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
    // baseURL: 'http://localhost:8080'
    baseURL: import.meta.env.VITE_APP_URL
})

export default instance
```

`package.json` 配置多环境运行/打包：

```json
{
  "scripts": {
    "dev": "vite --mode dev",
    "test":"vite --mode test",
    "uat":"vite --mode uat",
    "prod":"vite --mode prod",
    "build:dev": "vue-tsc && vite build --mode dev",
    "build:test": "vue-tsc && vite build --mode test",
    "build:uat": "vue-tsc && vite build --mode uat",
    "build:prod": "vue-tsc && vite build --mode prod",
    "preview": "vite preview"
  }
}
```