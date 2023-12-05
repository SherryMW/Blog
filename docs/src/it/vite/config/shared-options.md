---
category: IT
tag: Vue
order: 2
article: false
---

# 共享配置

## resolve.alias

类型：`Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

将会被传递到 `@rollup/plugin-alias` 作为 [entries](https://github.com/rollup/plugins/tree/master/packages/alias#entries) 的选项。也可以是一个对象，或一个 `{ find, replacement, customResolver }` 的数组

当使用文件系统路径的别名时，请始终使用绝对路径。相对路径的别名值会原封不动地被使用，因此无法被正常解析

更高级的自定义解析方法可以通过 [插件](待更新) 实现

::: info 在 SSR 中使用
如果你已经为 [SSR 外部化的依赖](待更新) 配置了别名，你可能想要为真实的 `node_modules` 包配别名。[Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) 和 [pnpm](https://pnpm.io/aliases/) 都支持通过 `npm:` 前缀配置别名
:::

示例：

::: tabs

@tab vite.config.ts

```ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
})
```

新增配置项：

- `import {resolve} from 'path'`：这里使用了 Node.js 的 `path` 模块中的 `resolve` 函数。`resolve` 函数的作用是将路径或路径片段的序列解析为绝对路径。在这里，它用于获取 `src` 目录的绝对路径

    需要注意的是：引入 Node.js 的 `path` 模块需要安装 `types/node` 依赖：

    ```shell
    npm i @types/node
    ```

- `resolve: { alias: {'@': resolve(__dirname, 'src')} }`：这段配置设置了模块路径的别名。具体而言，它将 `@` 别名映射到 `src` 目录的绝对路径。这样，你在代码中可以使用 `@` 来引用 `src` 目录，而不必使用相对路径

    `__dirname` 可以用来动态获取当前文件所属目录的绝对路径

    `__filename` 可以用来动态获取当前文件的绝对路径，包含当前文件

    举例来说，如果你有一个文件 `src/components/Example.vue`，你可以这样引入：

    ```js
    import Example from '@/components/Example.vue';
    ```

    这样的配置有助于提高代码的可读性，并且当你需要调整项目目录结构时，只需更新这个别名的映射而无需修改实际的引用路径

@tab tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

新增配置项：

- `"baseUrl": "."`：指定了相对路径的基准目录。在这里，`"."` 表示基准目录是 `tsconfig.json` 所在的目录

- `"paths": {"@/*": ["src/*"]}`：定义了模块路径的映射关系。这里定义了一个路径别名，即以 `@/` 开头的模块路径都会被映射到 `src/` 目录下。例如，模块 `@/module` 将被解析为 `src/module`

:::