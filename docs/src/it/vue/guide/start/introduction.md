---
date: 2022-07-17
category: IT
tag: Vue
shortTitle: 简介
order: 1
---

# Vue

<!-- more -->

## 什么是 Vue

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任

下面是一个最基本的示例：

```vue
<template>
  <div id="app">
    <button @click="count++">
      Count is: {{ count }}
    </button>
  </div>
</template>

<script>
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        count: 0
      }
    }
  }).mount('#app')
</script>
```

上面的示例展示了 Vue 的两个核心功能：

- 声明式渲染：Vue 基于标准 HTML 拓展了一套模板语法，使得我们可以声明式地描述最终输出的 HTML 和 JavaScript 状态之间的关系。这意味着我们只需要关注数据的状态以及我们希望在页面上看到的内容，而无需手动操作 DOM 来更新页面。具体来说：

    - 我们可以在 Vue 模板中使用特定的指令（如 `{{ }}` 和 `v-bind` ）来插入数据到 HTML 中，而不需要手动构建 HTML 字符串 

    - 我们可以使用条件渲染（`v-if`、`v-else`）、循环渲染（`v-for`）等指令来根据数据的不同状态动态生成页面内容

    - 我们可以声明事件处理函数（如 `v-on`）来响应用户交互，而无需直接操作 DOM 元素

- 响应性：Vue 具备响应式系统，它能够自动追踪数据的变化，并在数据发生变化时自动更新与之相关联的 DOM 元素，从而保持页面的同步。这是通过以下方式实现的：

    - 当我们创建一个 Vue 实例时，Vue 会扫描实例中的数据属性，将其转换为 `getter` 和 `setter`，并建立响应式依赖关系

    - 当数据属性发生变化时，`setter` 会通知相关的 DOM 元素进行更新。这意味着无论是通过用户交互还是其他方式修改了数据，页面都会自动反映这些变化

    - 响应性系统还可以嵌套，即一个数据属性可以依赖于另一个数据属性，这样复杂的数据关系也可以得到自动追踪和更新

::: details Vue 2 和 Vue 3 的响应式实现区别

**Vue 2 的响应式实现：**

Vue 2 使用了 `Object.defineProperty` 来实现响应式。以下是主要的步骤和概念：

1. 数据劫持：Vue 2 通过遍历组件的数据对象，对每个属性使用 `Object.defineProperty` 来定义 `getter` 和 `setter`。这样，当属性被访问或者修改时，Vue 可以捕获这些操作

2. 依赖追踪：每个属性都有一个依赖收集器，用于存储依赖于该属性的 `Watcher` 对象。`Watcher` 对象负责更新视图

3. 编译阶段：在模板编译阶段，Vue 2 解析模板中的表达式，并创建一个渲染函数，这个函数包含对数据属性的引用，这些引用将触发依赖收集

4. 首次渲染：首次渲染过程中，渲染函数会执行，访问数据属性并触发依赖收集，`Watcher` 对象将添加到依赖收集器中

5. 更新触发：当数据属性发生变化时，它们的 `setter` 被调用，`setter` 会通知依赖收集器中的 `Watcher` 对象，告诉它们需要重新渲染视图

6. 重新渲染：触发更新的 `Watcher` 对象会重新运行渲染函数，生成新的虚拟 DOM（Virtual DOM），并与之前的虚拟 DOM 进行对比，最终更新真实的 DOM

**Vue 3 的响应式实现：**

Vue 3 采用了 `Proxy` 来实现响应式，这是一种更现代和灵活的方式。以下是 Vue 3 的响应式实现的关键特点：

1. Proxy 代理：Vue 3 使用 ES6 中的 `Proxy` 对象，它可以拦截对象上的各种操作，包括属性的读取、设置、删除等。这使得 Vue 3 可以更灵活地捕获对象上的操作

2. 递归代理：Vue 3 会递归地代理对象的所有嵌套属性，包括子对象。这简化了响应式数据的管理，无需手动逐层设置

3. WeakMap 缓存：Vue 3 使用 `WeakMap` 来缓存已经代理的对象，以提高性能并避免内存泄漏

4. 副作用跟踪：Vue 3 引入了 `effect` 函数，用于跟踪副作用，例如数据变化时需要执行的函数。这是 Composition API 的一部分，用于组织组件逻辑

:::

::: tip 预备知识
文档接下来的内容会假设你对 HTML、CSS 和 JavaScript 已经基本熟悉。如果你对前端开发完全陌生，最好不要直接从一个框架开始进行入门学习——最好是掌握了基础知识再回到这里。你可以通过这篇 [JavaScript 概述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Language_overview)来检验你的 JavaScript 知识水平。如果之前有其他框架的经验会很有帮助，但也不是必须的
:::

## 渐进式框架

Vue 是一个框架，也是一个生态。其功能覆盖了大部分前端开发常见的需求。但 Web 世界是十分多样化的，不同的开发者在 Web 上构建的东西可能在形式和规模上会有很大的不同。考虑到这一点，Vue 的设计非常注重灵活性和“可以被逐步集成”这个特点。根据你的需求场景，你可以用不同的方式使用 Vue：

- 无需构建步骤，渐进式增强静态的 HTML

- 在任何页面中作为 Web Components 嵌入

- 单页应用 (SPA)

- 全栈 / 服务端渲染 (SSR)

- Jamstack / 静态站点生成 (SSG)

- 开发桌面端、移动端、WebGL，甚至是命令行终端中的界面

意味着你可以根据项目的需求逐步采用 Vue 的不同部分，而无需完全采用整个框架。这种灵活性允许开发者在现有项目中引入 Vue，或者从头开始构建全新的应用。您可以选择性地使用 Vue 的特性，如视图层（Vue 的模板语法和指令）、状态管理（Vuex）、路由管理（Vue Router）等

## 单文件组件

在大多数启用了构建工具的 Vue 项目中，我们可以使用一种类似 HTML 格式的文件来书写 Vue 组件，它被称为单文件组件 (也被称为 `*.vue` 文件，英文 Single-File Components，缩写为 SFC)。顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。下面我们将用单文件组件的格式重写上面的计数器示例：

```vue
<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<script>
  export default {
    data() {
      return {
        count: 0
      }
    }
  }
</script>
<style scoped>
  button {
    font-weight: bold;
  }
</style>
```

单文件组件是 Vue 的标志性功能。如果你的用例需要进行构建，我们推荐用它来编写 Vue 组件。你可以在后续相关章节里了解更多关于[单文件组件的用法及用途](../scaling-up/sfc.md)。但你暂时只需要知道 Vue 会帮忙处理所有这些构建工具的配置就好

## API 风格

Vue 的组件可以按两种不同的风格书写：**选项式 API** 和 **组合式 API**

### 选项式 API (Options API)

使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例

```vue
<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

<script>
  export default {
    // data() 返回的属性将会成为响应式的状态
    // 并且暴露在 `this` 上
    data() {
      return {
        count: 0
      }
    },

    // methods 是一些用来更改状态与触发更新的函数
    // 它们可以在模板中作为事件处理器绑定
    methods: {
      increment() {
        this.count++
      }
    },

    // 生命周期钩子会在组件生命周期的各个不同阶段被调用
    // 例如这个函数就会在组件挂载完成后被调用
    mounted() {
      console.log(`The initial count is ${this.count}.`)
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### 组合式 API (Composition API)

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 [`<script setup>`](../../api/sfc/script-setup.md) 搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用

下面是使用了组合式 API 与 `<script setup>` 改造后和上面的模板完全一样的组件：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### 该选哪一个？

两种 API 风格都能够覆盖大部分的应用场景。它们只是同一个底层系统所提供的两套不同的接口。实际上，选项式 API 是在组合式 API 的基础上实现的！关于 Vue 的基础概念和知识在它们之间都是通用的

选项式 API 以“组件实例”的概念为中心 (即上述例子中的 `this`)，对于有面向对象语言背景的用户来说，这通常与基于类的心智模型更为一致。同时，它将响应性相关的细节抽象出来，并强制按照选项来组织代码，从而对初学者而言更为友好

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。这种形式更加自由，也需要你对 Vue 的响应式系统有更深的理解才能高效使用。相应的，它的灵活性也使得组织和重用逻辑的模式变得更加强大

如果你是使用 Vue 的新手，这里是我们的大致建议：

- 在学习的过程中，推荐采用更易于自己理解的风格。再强调一下，大部分的核心概念在这两种风格之间都是通用的。熟悉了一种风格以后，你也能够很快地理解另一种风格

- 在生产项目中：

    - 当你不需要使用构建工具，或者打算主要在低复杂度的场景中使用 Vue，例如渐进增强的应用场景，推荐采用选项式 API

    - 当你打算用 Vue 构建完整的单页应用，推荐采用组合式 API + 单文件组件

## 参考资料

[官方文档](https://cn.vuejs.org/)