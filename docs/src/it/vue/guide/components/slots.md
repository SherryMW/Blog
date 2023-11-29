---
category: IT
tag: Vue
order: 6
article: false
---

# 插槽

## 插槽内容与出口

在之前的章节中，我们已经了解到组件能够接收任意类型的 JavaScript 值作为 props，但组件要如何接收模板内容呢？在某些场景中，我们可能想要为子组件传递一些模板片段，让子组件在它们的组件中渲染这些片段

举例来说，这里有一个 `<FancyButton>` 组件，可以像这样使用：

```vue
<FancyButton>
  Click me! <!-- 插槽内容 -->
</FancyButton>
```

而 `<FancyButton>` 的模板是这样的：

```vue
<button class="fancy-btn">
  <slot></slot> <!-- 插槽出口 -->
</button>
```

`<slot>` 元素是一个**插槽出口** (slot outlet)，标示了父元素提供的**插槽内容** (slot content) 将在哪里被渲染

最终渲染出的 DOM 是这样：

```vue
<button class="fancy-btn">Click me!</button>
```

![](https://img.sherry4869.com/blog/it/vue/img_3.png)

[在演练场中尝试一下](https://play.vuejs.org/#eNpdUdtOwzAM/RUThAbSurIbl1ImARJf0ZesSapoqROlKdo07d9x0jF1SHmIT+xzcY7sw7nZTy9Zwcqu9tqFTYW6ddYH+OZYHz77ECyC8raFySwfYXFsUiFAhXKfBoRUvDcBjhGtLbGgxNAVcLziOlVIp8wvelQE2TrDg6QKoBx1JwDgy+h6B62E8ibLoDM2kAAGoocsiz1VKMfmCCrzCymbsn/GY95rze1grja8694rpmJ/tg1YsfRO/FE134wc2D4YeTYQ9QeKa+mUrgsHE6+zC+vfjoz1Bdwqpd5iveX1rvG2R1GA0Si5zxrPhaaY98v5WshmCrerhVi+LmCxvqPiafUslXoYpq0XkuiQ1p4Ax4XQ2BSwdnuYP7p9QlvuG40JHI1lUaenv3o5w3Xvu2jOWU179oQNn5aisNMvLBvDOg==)

通过使用插槽，`<FancyButton>` 仅负责渲染外层的 `<button>` (以及相应的样式)，而其内部的内容由父组件提供

理解插槽的另一种方式是和下面的 JavaScript 函数作类比，其概念是类似的：

```js
// 父元素传入插槽内容
FancyButton('Click me!')

// FancyButton 在自己的模板中渲染插槽内容
function FancyButton(slotContent) {
    return `<button class="fancy-btn">
      ${slotContent}
    </button>`
}
```

插槽内容可以是任意合法的模板内容，不局限于文本。例如我们可以传入多个元素，甚至是组件：

```vue
<FancyButton>
  <span style="color:red">Click me!</span>
  <AwesomeIcon name="plus" />
</FancyButton>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9U0tu2zAQvcqEQZEWsOzGjvtx1QBJkALpoi3aLrWRpZFLmyIJfhIZhs/QE3TXQ/Q8vUCv0CEVK7IRBNCC8/hm5s0basMutB7eemQzltrCcO3OM8lrrYyDD7ks1pfeOSWhMqqGk+Goh4W0k458cYdW1XhT9Mg97J4MkElsYkKJVe6Fg01AC0VVJEpnZ7DpNx7sFd5mkr501CmlwGGtRe6QIoC0lxoBgCvBixXUSFHm0v4AMf/RnNTqXIJ1a4HvM1YoocysWOcyY+e7ckdAMoi1y+jLHLVaDnqlo04qG7ADI4P/+5PMW+MLkVtLIqrAT+YuaIg+utQK5UKrMFbL3u8S7YlD0HHYFdg5HoaC46qq3oV4nherhVFeljMQXGJukoXJS047eT45nZa4GMDx2bicvB3DePqMgldnr7GqXrTZypRI5SQtMQI6L0suFzOY6gZOX+omonVuFlxGsJeWhD6eNv/mHi68sUGcVlw6NIS1W4+jkHcH7yp4d5Qk4C11BFoc1mrJYemtg0oZemm1Au2NVhYtJElwqTPp76/f//783N+Ns1S54ovh0ipJ1aNh4R3Umgs0n7XjStqM0Vttt5+xXAh19zFizngc7PDiBxarR/ClbQKWsS8GLZpbzFh358gldO319bdP2NC5u6xV6QWxn7j8Su4IHzS2tEtaKsnu8aLam/jjkmXf7XXjUNrdUEFoYG4jP2Nk8dUToz/InQwnMY/2xbb/AbrGe5g=)

通过使用插槽，`<FancyButton>` 组件更加灵活和具有可复用性。现在组件可以用在不同的地方渲染各异的内容，但同时还保证都具有相同的样式

Vue 组件的插槽机制是受[原生 Web Component `<slot>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)的启发而诞生，同时还做了一些功能拓展，这些拓展的功能我们后面会学习到

## 渲染作用域

插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。举例来说：

```vue
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
```

这里的两个 `{{ message }}` 插值表达式渲染的内容都是一样的

插槽内容无法访问子组件的数据。Vue 模板中的表达式只能访问其定义时所处的作用域，这和 JavaScript 的词法作用域规则是一致的。换言之：父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域

## 默认内容

在外部没有提供任何内容的情况下，可以为插槽指定默认内容。比如有这样一个 `<SubmitButton>` 组件：

```vue
<button type="submit">
  <slot></slot>
</button>
```

如果我们想在父组件没有提供任何插槽内容时在 `<button>` 内渲染“Submit”，只需要将“Submit”写在 `<slot>` 标签之间来作为默认内容：

```vue
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```

现在，当我们在父组件中使用 `<SubmitButton>` 且没有提供任何插槽内容时：

```vue
<SubmitButton />
```

“Submit”将会被作为默认内容渲染：

```vue
<button type="submit">Submit</button>
```

但如果我们提供了插槽内容：

```vue
<SubmitButton>Save</SubmitButton>
```

那么被显式提供的内容会取代默认内容：

```vue
<button type="submit">Save</button>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp1UEEOwiAQ/MrKxYu1d4Mm+gWvXChuk0YKpCyNxvh3lxIb28SEA8zuDDPzEucQ9mNCcRAymqELdFKu64MfCK6p6Tu6JCLvoB18D9t9/Qtm4lY5AOXwMVFu2OpkCV4ZNZ51HDqKhwLAQjIjb+X4yHr+mh+EfbCakF8AclNVkCJCq61ttLkD4YOgqsp0YbGesJkVBj92NwSTIrH3v7zTVY8oF8F4SdazD7ET69S5rqXPpnigZ8CjEnHaVyInIp5G63O6XIGiIlZMzrGMd8RVfR0q4lIKKV+L+srW+wNTTZq3)

## 具名插槽

有时在一个组件中包含多个插槽出口是很有用的。举例来说，在一个 `<BaseLayout>` 组件中，有如下模板：

```vue
<div class="container">
  <header>
    <!-- 标题内容放这里 -->
  </header>
  <main>
    <!-- 主要内容放这里 -->
  </main>
  <footer>
    <!-- 底部内容放这里 -->
  </footer>
</div>
```

对于这种场景，`<slot>` 元素可以有一个特殊的 attribute `name`，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容：

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

这类带 `name` 的插槽被称为具名插槽 (named slots)。没有提供 `name` 的 `<slot>` 出口会隐式地命名为“default”

在父组件中使用 `<BaseLayout>` 时，我们需要一种方式将多个插槽内容传入到各自目标插槽的出口。此时就需要用到**具名插槽**了：

要为具名插槽传入内容，我们需要使用一个含 `v-slot` 指令的 `<template>` 元素，并将目标插槽的名字传给该指令：

```vue
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>
</BaseLayout>
```

`v-slot` 有对应的简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。其意思就是“将这部分模板片段传入子组件的 header 插槽中”

![](https://img.sherry4869.com/blog/it/vue/img_4.png)

下面我们给出完整的、向 `<BaseLayout>` 传递插槽内容的代码，指令均使用的是缩写形式：

```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：

```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

现在 `<template>` 元素中的所有内容都将被传递到相应的插槽。最终渲染出的 HTML 如下：

```vue
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9UkFuwjAQ/MoqHLiUpFxQlaZI9NRDn5CLSTbEkmNb9oKgiL934wRwQK3ky87O7njGPicba9PDHpM8KXzlpKV1qWVnjSP4FB6/xcnsCRpnOpin2R3qh+alBig1HgO9xkbsFcG5RyvDOzRq8vkAQLSury+l5lNkN1EuCDurBCFXAMWdH2pGrn2YtShqdCPOnXa5/kKH0MldS7BFEGDFDoEkKSwybo8rskjjaevo4L7Wrje8x4mdE7aFxjiglkWE1GxQE9tLi8xO+LoGoQ3THLD/qP2/dGMMxYZs8DP34E2HQUxUBFI35o+NfTlJLOomL8n04frXns7W8gCVEt5/lElQkxpdmVyVHvP2yhBo0SHThx5z+TEZvl1uMlP0oU3nH/kRo3iMI9Ybes960UyRsZ9pBuGDeTqpwfBAvn7NrXF81QUZm8PSHjl0JWuYVVX1PhAqo4zLYbZarUak4ZAWXv5gDq/pG3YBHn50EEkuv5irGBk=)

使用 JavaScript 函数来类比可能更有助于你来理解具名插槽：

```js
// 传入不同的内容给不同名字的插槽
BaseLayout({
    header: `...`,
    default: `...`,
    footer: `...`
})

// <BaseLayout> 渲染插槽内容到对应位置
function BaseLayout(slots) {
    return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`
}
```

## 动态插槽名

[动态指令参数](../essentials/template-syntax.md#动态参数)在 `v-slot` 上也是有效的，即可以定义下面这样的动态插槽名：

```vue
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

注意这里的表达式和动态指令参数受相同的[语法限制](../essentials/template-syntax.md#指令-directives)

## 作用域插槽

在上面的[渲染作用域](#渲染作用域)中我们讨论到，插槽的内容无法访问到子组件的状态

然而在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽

我们也确实有办法这么做！可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：

```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。下面我们将先展示默认插槽如何接受 props，通过子组件标签上的 `v-slot`指令，直接接收到了一个插槽 props 对象：

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

![](https://img.sherry4869.com/blog/it/vue/img_5.svg)

[在演练场中尝试一下](https://play.vuejs.org/#eNqFUsFOg0AQ/ZXJXqqJ0pjeCJqo6UGTaqMe90JgSql0l+wOiCH8u7OLIG2qJiSwb97OvPeGVtyWZVBXKEIR2cTkJd1Ile9LbQhWn/eavxQqgo3Re5gF8wnmrs2kApAKG38hxU1cFQStQ5OBZ8MegGlDB3RS8RPNx7l8INyXRUzoThRNFdSXttB0LYV7rY0urRTM4vHUtjCCAWFD0HVwACa64hYdjwOIpia4QzQfh4oLcWTwIJdTNtOY4rPzwaFBqowaTgCZQaRcZSu0Ns4whNkWi0L72HwA/6bAetO8/jYaOUcQOoscxFFzKSD0Prl0xdlwS2b3Qc77HodWySZabfIs2Fmt2KhXLYVbXF6geS4p14pTHvcnRcziPx49RqbCiwFPtpi8n8B3tnGYFGuDFk3NIscaxSZD6svL1yf2NCnudVoVzP6j+IJWF5XT2NPuKpWy7AnPq33wPzPH9GaXDaGygykn1C/A86XgbbvV/2b9R+4iWAyLE90XQycdLA==)

子组件传入插槽的 props 作为了 `v-slot` 指令的值，可以在插槽内的表达式中访问

你可以将作用域插槽类比为一个传入子组件的函数。子组件会将相应的 props 作为参数传给它：

```js
MyComponent({
    // 类比默认插槽，将其想成一个函数
    default: (slotProps) => {
        return `${slotProps.text} ${slotProps.count}`
    }
})

function MyComponent(slots) {
    const greetingMessage = 'hello'
    return `<div>${
        // 在插槽函数调用时传入 props
        slots.default({text: greetingMessage, count: 1})
    }</div>`
}
```

实际上，这已经和作用域插槽的最终代码编译结果、以及手动编写[渲染函数](../extras/render-function.md)时使用作用域插槽的方式非常类似了

`v-slot="slotProps"` 可以类比这里的函数签名，和函数的参数类似，我们也可以在 `v-slot` 中使用解构：

```vue
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

### 具名作用域插槽

具名作用域插槽的工作方式也是类似的，插槽 props 可以作为 v-slot 指令的值被访问到：v-slot:name="slotProps"。当使用缩写时是这样：

```vue
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

向具名插槽中传入 props：

```vue
<slot name="header" message="hello"></slot>
```

注意插槽上的 `name` 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽。因此最终 `headerProps` 的结果是 `{ message: 'hello' }`

如果你同时使用了具名插槽与默认插槽，则需要为默认插槽使用显式的 `<template>` 标签。尝试直接为组件添加 `v-slot` 指令将导致编译错误。这是为了避免因默认插槽的 props 的作用域而困惑。举例：

```vue
<!-- 该模板无法编译 -->
<template>
  <MyComponent v-slot="{ message }">
    <p>{{ message }}</p>
    <template #footer>
      <!-- message 属于默认插槽，此处不可用 -->
      <p>{{ message }}</p>
    </template>
  </MyComponent>
</template>
```

为默认插槽使用显式的 `<template>` 标签有助于更清晰地指出 `message` 属性在其他插槽中不可用：

```vue
<template>
  <MyComponent>
    <!-- 使用显式的默认插槽 -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

### 高级列表组件示例

你可能想问什么样的场景才适合用到作用域插槽，这里我们来看一个 `<FancyList>` 组件的例子。它会渲染一个列表，并同时会封装一些加载远端数据的逻辑、使用数据进行列表渲染、或者是像分页或无限滚动这样更进阶的功能。然而我们希望它能够保留足够的灵活性，将对单个列表元素内容和样式的控制权留给使用它的父组件。我们期望的用法可能是这样的：

```vue
<FancyList :api-url="url" :per-page="10">
  <template #item="{ body, username, likes }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }} | {{ likes }} likes</p>
    </div>
  </template>
</FancyList>
```

在 `<FancyList>` 之中，我们可以多次渲染 `<slot>` 并每次都提供不同的数据 (注意我们这里使用了 `v-bind` 来传递插槽的 props)：

```vue
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item"></slot>
  </li>
</ul>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqNVW1v0zAQ/itHJtRNapNuZTBCNwnQQCAEiE1IaNkHN7l03hzb8ktpGf3vnJMmadE0kKYqvrvn3p7H3n30Wut44TFKo6nNDdfuLJO80so4eMdkvvrErYPSqAoGcdJZAmSQSYBM4rIOLrBkXji4D9ZcUQaJ0tm0MUCfLBzXmaS/adJVpIPDSgvmkE4A074203zkjTjNIvrNIkg1mpFmcyTL4TiL6nhCtHjY4/RJznuYqWI1BG/RSFbhEAS/Q0vFWwyhCr6AXDBrCRBwWz7y6rP7Jgus19NE77g6WIWOEWy2AgpuixEAfgfDpua6+dhOMk2oeNt9sjt+v2k67zjpaN1KINhcaSzIEocGmjWXSrqR5b8whXF8gtWrhgyhTAp7z45mJycTMjWrD0nOomG0w+mODB5iVhulidSrwYaWwRAGLSGD62EIKZhj+wct7wadN7I9AYQlhwTXjYF6oZ8aVykvHRY9NEnIlt9RikoRryEvlOjyGy7nTYRFd8krVN7tE+z0rC/jbriN61pwClc9bw2dKQwu6vXBhVDOwnvPC6RRWvbIf75gEn4oT9aauRSOxptG/8r03SNceqcMZ2EdWzk+U8eCM7hELTx1zfpkh5SszdWuYkjW8fjg/y6IF610BIfFiJekxCf1wLFAOXc3W0r+pFhBO4vjuFWb4DvoUpmN/oHLhqLtS2JpSRBm6i4JYWZcFt056XS8yTxN6gb/IV0AL1rOBElwVPtHbqVpfZJekFrApDpWhAFSONbLjWnG8ru5IckUKUElMjOaGxqTHp39yeFxgfNhkHwxeXkER8dP6fD82Qssy4MaX++eRt/U3s5PPHdFKmbmXAa2Hqy7V5Zlm27rRjmaT5Z8Ht9aJelG1UWyKDyKXKD5oh1XkhbcvY1ZxIRQPz/WNmc8bmRGmBvM7x6w39plsGXRV4OktwVmUedz1DS6xn1+8RmX9N05K1V4QdGPOL+hVcKHHpuwNzQrtb0VV3f7of4nQVu7tOdLh9K2Q4VG+1udRfSsvH1k9L7dSTxptR+t/wAZBRzw)

### 无渲染组件

上面的 `<FancyList>` 案例同时封装了可重用的逻辑 (数据获取、分页等) 和视图输出，但也将部分视图输出通过作用域插槽交给了消费者组件来管理

如果我们将这个概念拓展一下，可以想象的是，一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为**无渲染组件**

这里有一个无渲染组件的例子，一个封装了追踪当前鼠标位置逻辑的组件：

```vue
<!-- App.vue -->
<template>
  <MouseTracker v-slot="{ x, y }">
    Mouse is at: {{ x }}, {{ y }}
  </MouseTracker>
</template>

<script>
  import MouseTracker from './MouseTracker.vue'

  export default {
    components: {
      MouseTracker
    }
  }
</script>
```

```vue
<!-- MouseTracker.vue -->
<template>
  <slot :x="x" :y="y"/>
</template>

<script>
  export default {
    data() {
      return {
        x: 0,
        y: 0
      }
    },
    methods: {
      update(e) {
        this.x = e.pageX
        this.y = e.pageY
      }
    },
    mounted() {
      window.addEventListener('mousemove', this.update)
    },
    unmounted() {
      window.removeEventListener('mousemove', this.update)
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqVU9uKnEAQ/ZWiX2YWjBPYN3EDSZiHhNxI9iGBfmm0ZqZ3tVu6qx1lmH9PqauuexlYEKnrqVN19CQ+VlVcBxSJSH3mdEUfpNFlZR3Bdxs83jqV3aODnbMlrOLN42DXuJIGQBps+pYcdyoUBKcumlnGMWjIJ0MAFpBd5CwNP+lmGs0OYVkVirDzKF2QqN/5wtKNFCdoImi5XXAVz6e+DLQHRTyM03A+R53BRTyBgRbMuSvdTINEJJ6utbjHS8vlitT6atzLIQVnRg+gSeB9NDotO4PNTPjVJ0qkg83ny4SKEXGNEyQAHbSPG7gBjCu1x7+LeDvF/z3HtsEQ5jO9oza5PcYqz7c16/FNe0KDbr3iSo+lrXEVDbADjasZK5jX0Fzf+BbAy2IDpJ26kDQscCMFJC0brRSbZ2qRz6zZ6X18561hqXpiUnQfnC7Q/axIW+OlmK4rhSoKe/zax8gFfBCHew6Y3b8Qv/NMIWHjl0OPrkYpphwpt0ca0ts/P7Bhe0qWNg8FV19I/kZvi9BxHMo+BZMz7Ud1Pdsv/W+ozf7Wbxu+rx+X6ojOCknB3+vnC6vPdK/j61EIcf4PC1ZTdg==)

虽然这个模式很有趣，但大部分能用无渲染组件实现的功能都可以通过组合式 API 以另一种更高效的方式实现，并且还不会带来额外组件嵌套的开销。之后我们会在[组合式函数](../reusability/composables.md)一章中介绍如何更高效地实现追踪鼠标位置的功能

尽管如此，作用域插槽在需要**同时**封装逻辑、组合视图界面时还是很有用，就像上面的 `<FancyList>` 组件那样