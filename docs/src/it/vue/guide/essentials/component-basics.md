---
category: IT
tag: Vue
order: 13
article: false
---

# 组件基础

组件允许我们将 UI 划分为独立的、可重用的部分，并且可以对每个部分进行单独的思考。在实际应用中，组件常常被组织成层层嵌套的树状结构：

![](https://img.sherry4869.com/blog/it/vue/img_2.png)

这和我们嵌套 HTML 元素的方式类似，Vue 实现了自己的组件模型，使我们可以在每个组件内封装自定义内容与逻辑。Vue 同样也能很好地配合原生 Web Component。如果你想知道 Vue 组件与原生 Web Components 之间的关系，可以[阅读此章节](../extras/web-components.md)

## 定义一个组件

当使用构建步骤时，我们一般会将 Vue 组件定义在一个单独的 .vue 文件中，这被叫做[单文件组件](../scaling-up/sfc.md) (简称 SFC)：

```vue
<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
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
```

当不使用构建步骤时，一个 Vue 组件以一个包含 Vue 特定选项的 JavaScript 对象来定义：

```js
export default {
    data() {
        return {
            count: 0
        }
    },
    template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

这里的模板是一个内联的 JavaScript 字符串，Vue 将会在运行时编译它。你也可以使用 ID 选择器来指向一个元素 (通常是原生的 `<template>` 元素)，Vue 将会使用其内容作为模板来源

上面的例子中定义了一个组件，并在一个 `.js` 文件里默认导出了它自己，但你也可以通过具名导出在一个文件中导出多个组件

## 使用组件

要使用一个子组件，我们需要在父组件中导入它。假设我们把计数器组件放在了一个叫做 `ButtonCounter.vue` 的文件中，这个组件将会以默认导出的形式被暴露给外部

```vue
<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter/>
</template>

<script>
  import ButtonCounter from './ButtonCounter.vue'

  export default {
    components: {
      ButtonCounter
    }
  }
</script>
```

若要将导入的组件暴露给模板，我们需要在 `components` 选项上[注册](../components/registration.md)它。这个组件将会以其注册时的名字作为模板中的标签名

当然，你也可以全局地注册一个组件，使得它在当前应用中的任何组件上都可以使用，而不需要额外再导入。关于组件的全局注册和局部注册两种方式的利弊，我们放在了[组件注册](../components/registration.md)这一章节中专门讨论

组件可以被重用任意多次：

```html
<h1>Here is a child component!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

你会注意到，每当点击这些按钮时，每一个组件都维护着自己的状态，是不同的 `count`。这是因为每当你使用一个组件，就创建了一个新的实例

在单文件组件中，推荐为子组件使用 `PascalCase` 的标签名，以此来和原生的 HTML 元素作区分。虽然原生 HTML 标签名是不区分大小写的，但 Vue 单文件组件是可以在编译中区分大小写的。我们也可以使用 `/>` 来关闭一个标签

如果你是直接在 DOM 中书写模板 (例如原生 `<template>` 元素的内容)，模板的编译需要遵从浏览器中 HTML 的解析行为。在这种情况下，你应该需要使用 `kebab-case` 形式并显式地关闭这些组件的标签

```html
<!-- 如果是在 DOM 中书写该模板 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

请看 [DOM 内模板解析注意事项](#dom-内模板解析注意事项)了解更多细节

## 传递 props

如果我们正在构建一个博客，我们可能需要一个表示博客文章的组件。我们希望所有的博客文章分享相同的视觉布局，但有不同的内容。要实现这样的效果自然必须向组件中传递数据，例如每篇文章标题和内容，这就会使用到 props

Props 是一种特别的 attributes，你可以在组件上声明注册。要传递给博客文章组件一个标题，我们必须在组件的 props 列表上声明它。这里要用到 `props` 选项：

```vue
<!-- BlogPost.vue -->
<template>
  <h4>{{ title }}</h4>
</template>

<script>
  export default {
    props: ['title']
  }
</script>
```

当一个值被传递给 prop 时，它将成为该组件实例上的一个属性。该属性的值可以像其他组件属性一样，在模板和组件的 `this` 上下文中访问

一个组件可以有任意多的 props，默认情况下，所有 prop 都接受任意类型的值

当一个 prop 被注册后，可以像这样以自定义 attribute 的形式传递数据给它：

```html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

在实际应用中，我们可能在父组件中会有如下的一个博客文章数组：

```js
export default {
    // ...
    data() {
        return {
            posts: [
                {id: 1, title: 'My journey with Vue'},
                {id: 2, title: 'Blogging with Vue'},
                {id: 3, title: 'Why Vue is so fun'}
            ]
        }
    }
}
```

这种情况下，我们可以使用 `v-for` 来渲染它们：

```vue
<BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
/>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9U1Fr2zAQ/iuHXrxB5rBlT8YLrKMPG6wtbWkfqj6Y+OwodSQhndMEk//ekxw7aSkBY3x33yd93925E7+tTTctikzkfuGUpbnUam2NI7hoTH1jPEHlzBqSdDokAiGRGkBq3EZoiVXRNgRdyC4M8zVq8lmfgPGoEO0n4V0WVHz5OtQdUuv0EAFYxjL7aYgBOlBlBt8nQIoazCD5v4OVYRLu4FXREh5Y0+HsU8aPIyOIqJWuz+JnR/zjchdQoDx4A1WrGT/An/uPGPOLn3w69o8DwrVtCsIQUX5qX9LmW2XcLymCSVC6NytFQAJkL7g71FJVhmygZFHTkI9BT5jn41T4qnw63ism4nRc7+b72dCsMzZ0PImHJ+zvnCeAfPlz3nV9r2C/z6ccfxRAfmF0pep05Y1mBfEiKcJ+qAbdtSVlNDsf10SKomnM67+YI9fiYTzMWeLi5ZP8ym9DToobhx7dhtsy1qhwNVJfvry7wi1/j8W1KdvQxDPFW/SmaYPGHnbR6pJln+Ci2r/xb+G9uveXW0LtB1NB6HHhpeAx/Dlj/Sh3ls6GvRL7Ny0lMW8=)

留意我们是如何使用 `v-bind` 来传递动态 prop 值的。当事先不知道要渲染的确切内容时，这一点特别有用

以上就是目前你需要了解的关于 props 的全部了。如果你看完本章节后还想知道更多细节，我们推荐你深入阅读关于 props 的[完整指引](../components/props.md)

## 监听事件

让我们继续关注我们的 `<BlogPost>` 组件。我们会发现有时候它需要与父组件进行交互。例如，要在此处实现无障碍访问的需求，将博客文章的文字能够放大，而页面的其余部分仍使用默认字号

在父组件中，我们可以添加一个 `postFontSize` 数据属性来实现这个效果：

```js
export default {
    data() {
        return {
            posts: [
                /* ... */
            ],
            postFontSize: 1
        }
    }
}
```

在模板中用它来控制所有博客文章的字体大小：

```vue
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
  />
</div>
```

然后，给 `<BlogPost>` 组件添加一个按钮：

```vue
<!-- BlogPost.vue, 省略了 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Enlarge text</button>
  </div>
</template>
```

这个按钮目前还没有做任何事情，我们想要点击这个按钮来告诉父组件它应该放大所有博客文章的文字。要解决这个问题，组件实例提供了一个自定义事件系统。父组件可以通过 `v-on` 或 `@` 来选择性地监听子组件上抛的事件，就像监听原生 DOM 事件那样：

```vue
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

子组件可以通过调用内置的 `$emit` [方法](../../api/options/component-instance.md#emit)，通过传入事件名称来抛出一个事件：

```vue
<!-- BlogPost.vue, 省略了 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

因为有了 `@enlarge-text="postFontSize += 0.1"` 的监听，父组件会接收这一事件，从而更新 `postFontSize` 的值

[在演练场中尝试一下](https://play.vuejs.org/#eNqNVO9r2zAQ/VcOMXDLmnhZ9sm4oevIYINtZR3bh7kfXFtOlMiSkc5pMpP/fSc5/lEooSEY3733zu/OJzfsY1VNdzVnEYttZkSFi0SJstIG4Vbq1Z22CIXRJQTTsEs4QZAogETxvafmvEhridC4bKZJr7hCG7UJ6Eu56HjlrnmK6cVlhxuOtVFdBFARl9R/uxigAZFHMLsCFCh5BMG3A2w0ifgBngSu4Td5OtUeK94PCmdiJdTqLH8+8P+sD44FwoLVUNSK+B39oRc6q5+1wnvxj0SzNu15dKF/HPZzpQB5WckUOUUAcS52EFk8SH6dsAaKvsy4KLyFgJfu2cyrSDcep/vtJoU2VMLJQKh2fAnr4GjLDyd0KvJR3nfaIT4YwBuuZGpWfIJ8jyfOYOka3k1nHXkR96vR9hVSY3QXh3277IqNt+fZur20Q5XRlVuAwLsK2nHzUvitCMbWgodXjTmTqbXUxiO5mLhe/DQTJHj9YdE07VuH4zEOKT4hjzWiVnCTSZFtSfzGObh4/vhLKrRsE+AScdiqzkwCbaZVIVbTjdWKRuE7Tpg7N0Jy86NCoRW9v/74JCyVUj999Tk0NT9tH2nWPNu+kN/Yvcsl7M5wy82OXmyPofNK/Tt4ef+dPI/AUue1W4Mz4E9utaydx5Z2W6ucbI943u0X/xWh8/bLLvfIle2ackaHD0HCaB8+nWl9sDufzrtzxY7/AYrwiNY=)

我们可以通过 `emits` 选项来声明需要抛出的事件：

```vue
<!-- BlogPost.vue -->
<script>
  export default {
    props: ['title'],
    emits: ['enlarge-text']
  }
</script>
```

这声明了一个组件可能触发的所有事件，还可以对事件的参数进行[验证](../components/events.md)。同时，这还可以让 Vue 避免将它们作为原生事件监听器隐式地应用于子组件的根元素

以上就是目前你需要了解的关于组件自定义事件的所有知识了。如果你看完本章节后还想知道更多细节，请深入阅读[组件事件](../components/events.md)章节

## 通过插槽来分配内容

一些情况下我们会希望能和 HTML 元素一样向组件中传递内容：

```vue
<AlertBox>
  Something bad happened.
</AlertBox>
```

我们期望能渲染成这样：

::: danger This is an Error for Demo Purposes
Something bad happened.
:::

这可以通过 Vue 的自定义 `<slot>` 元素来实现：

```vue
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot/>
  </div>
</template>

<style scoped>
  .alert-box {
    /* ... */
  }
</style>
```

如上所示，我们使用 `<slot>` 作为一个占位符，父组件传递进来的内容就会渲染在这里

[在演练场中尝试一下](https://play.vuejs.org/#eNp9UsFu3CAQ/RVKD7lk7bapVpXrRkqqPbSHtmp65ILNrJcEA4Lx1tFq/z0DXjsbKYrsA/PeY3jz4MBvvC/2A/CK17EN2uO1sLr3LiC7MRDw1o1sG1zPLopyBtKGC2EZExbGLFWwlYNBdkho62i/BYuxYofnLkdh6a/L5RgqEHpvJEKqsJ6lVFFvvHM94E7bjjVSsZ30HiyoIksXL6Sty6UNv+TnJtNUZ0cwViu9Z62RMX4TXCblqnGj4JkkOmJwtrvehODCO7I6lSeyCeWiMw7ZVNUl9XzpIo8W8dEAi63zoAgpltPmkIwLFXu/Xq+/prpxQQEBH/3IojNasQDqjFkFqfRAiX72Y4a9VIqyqdinDyekke1DF9xg1Wruvv2SPmIp+XRd00DJgcCTJh2TZppvJ9lOOSJZt1vdFffRWQoyuxY8Xa6mUX571M5GwemOp1BSoMb9/5kxDANczni7g/bhFfw+UvQVLf4EiBD2IPjCoQwd4ERv7n7BSOuF7J0aDKnfIP8CpTgkj5PslmIh22e67PZHfuqU47+4GRFsnIdKRpPymPWC02v6/sboz3aviqu8j/Lkxyf1cSKa)

以上就是目前你需要了解的关于插槽的所有知识了。如果你看完本章节后还想知道更多细节，请深入阅读[组件插槽](../components/slots.md)章节

## 动态组件

有些场景会需要在两个组件间来回切换，比如 Tab 界面：

[在演练场中查看示例](https://play.vuejs.org/#eNqNVcFu2zAM/RVCPWQD6qRdhh28pFg3FNh22Iqtt7oHRZYTNbZkSHLmIsi/j5Js2UWbInAQSOTT4yNF03tyXdfTXcNJShaGaVHbq0yKqlbawndVcSi0qmAynbmNA06i+1YZa6Lf754DrjXbiN1A0e07EEAmeeuBOS9oU1rYOytTeFpyaU0aDOCFnIelD9OtOz63OXhTTi19974/pblttOx3SNxojbR3dJXCxFFOOh4AS1cY7b6zwsRHcYsuxOQhIA8+Vibxt5jFcuHG8qouqeW4A1jkYgespMYsM5LzSmXE29GzaqxVeCCEhV1SKI0gjA9CehkZid50y5+Cc2zsie8n6EgCIUrdA2UWpaajPGG5XDpSODyMGL6wUrAtMoyBDhYxnVqA/T4c93mj/FkI53K2uI1XBalwkgbCjMQCeOKrxSyCQ41mWCRcLWaj0uHW2KfSLaeubuHuCiVtUtBKlE8pGCpNYrgWxWfnWymdc53CZd2CUaXI4YxzPnIlmuaiwcv9ULfeXNM8F3KNhgs8M8c/b66oXguZWFUjGa/GtpXCnKsUPvbYBuOjhpIzm4LEnLxV7bguSvUvaVOgjVVoxLJhJsM1hXyigk8o4LIn7eSigKTkhY265y/9Wqw3xwDPSsEY8y68F6PQVSshLdcBTtl2rVUj8xTOigv3vJZ0gnRju48dzZjgKL1042oQknxGzy/c8wI/DR17woEOcjzDWNOunuEF9b1Ezkk/u9yQO/6mhkYdJs4wiY40LDLHqXc6dRibJ3CPxuXp7P3MPYHfGqZkIdbTR6MkRvA1xpcYT4qS69+1FUriPIpjOCO0xAb/6W1WN/1MxjMbzrav2B9N62wZudUcXxqc1ST6LDYUt8F98/cXb3EdnZXKmxLRbzj/cOyBxmkMsK/YOih7hPNqf/hvEfbGnblpLZemT8oJHT4dGcEyf3sj9UHufDrvPwPk8B/rN2b9)

上面的例子是通过 Vue 的 `<component>` 元素和特殊的 `is` attribute 实现的：

```vue
<!-- currentTab 改变时组件也改变 -->
<component :is="currentTab"></component>
```

在上面的例子中，被传给 `:is` 的值可以是以下几种：

- 被注册的组件名

- 导入的组件对象

你也可以使用 `is` attribute 来创建一般的 HTML 元素

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 `<KeepAlive>` [组件](../built/keep-alive.md)强制被切换掉的组件仍然保持“存活”的状态

## DOM 内模板解析注意事项

如果你想在 DOM 中直接书写 Vue 模板，Vue 则必须从 DOM 中获取模板字符串。由于浏览器的原生 HTML 解析行为限制，有一些需要注意的事项

::: tip
请注意下面讨论只适用于直接在 DOM 中编写模板的情况。如果你使用来自以下来源的字符串模板，就不需要顾虑这些限制了：
- 单文件组件

- 内联模板字符串 (例如 `template: '...'`)

- `<script type="text/x-template">`
:::

### 大小写区分

HTML 标签和属性名称是不分大小写的，所以浏览器会把任何大写的字符解释为小写。这意味着当你使用 DOM 内的模板时，无论是 PascalCase 形式的组件名称、camelCase 形式的 prop 名称还是 v-on 的事件名称，都需要转换为相应等价的 kebab-case (短横线连字符) 形式：

```js
// JavaScript 中的 camelCase
const BlogPost = {
    props: ['postTitle'],
    emits: ['updatePost'],
    template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue
<!-- HTML 中的 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### 闭合标签

我们在上面的例子中已经使用过了闭合标签 (self-closing tag)：

```vue
<MyComponent />
```

这是因为 Vue 的模板解析器支持任意标签使用 `/>` 作为标签关闭的标志

然而在 DOM 内模板中，我们必须显式地写出关闭标签：

```vue
<my-component></my-component>
```

这是由于 HTML 只允许[一小部分特殊的元素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)省略其关闭标签，最常见的就是 `<input>` 和 `<img>`。对于其他的元素来说，如果你省略了关闭标签，原生的 HTML 解析器会认为开启的标签永远没有结束，用下面这个代码片段举例来说：

```vue
<my-component /> <!-- 我们想要在这里关闭标签... -->
<span>hello</span>
```

将被解析为：

```vue
<my-component>
  <span>hello</span>
</my-component> <!-- 但浏览器会在这里关闭标签 -->
```

### 元素位置限制

某些 HTML 元素对于放在其中的元素类型有限制，例如 `<ul>`，`<ol>`，`<table>` 和 `<select>`，相应的，某些元素仅在放置于特定元素中时才会显示，例如 `<li>`，`<tr>` 和 `<option>`

这将导致在使用带有此类限制元素的组件时出现问题。例如：

```vue
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义的组件 `<blog-post-row>` 将作为无效的内容被忽略，因而在最终呈现的输出中造成错误。我们可以使用特殊的 `is` [attribute](../../api/built/special-attributes.md#is) 作为一种解决方案：

```vue
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

::: tip
当使用在原生 HTML 元素上时，`is` 的值必须加上前缀 `vue:` 才可以被解析为一个 Vue 组件。这一点是必要的，为了避免和原生的[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)相混淆
:::