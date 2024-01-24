---
category: IT
tag: Vue
shortTitle: 开始
article: false
---

# Vite

<!-- more -->

官网：[https://cn.vitejs.dev](https://cn.vitejs.dev/)

## 搭建第一个 Vite 项目

::: info 兼容性注意
Vite 需要 [Node.js](https://nodejs.org/en/) 版本 18+，20+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本
:::

::: tabs

@tab NPM

```shell
npm create vite@latest
```

@tab Yarn

```shell
yarn create vite
```

@tab PNPM

```shell
pnpm create vite
```

@tab Bun

```shell
bunx create-vite
```

:::

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

```shell
# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue

# bun
bunx create-vite my-vue-app --template vue
```

查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 以获取每个模板的更多细节：`vanilla`，`vanilla-ts`, `vue`, `vue-ts`，`react`，`react-ts`，`react-swc`，`react-swc-ts`，`preact`，`preact-ts`，`lit`，`lit-ts`，`svelte`，`svelte-ts`，`solid`，`solid-ts`，`qwik`，`qwik-ts`

## index.html 与项目根目录

待更新