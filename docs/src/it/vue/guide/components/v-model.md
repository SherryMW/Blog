---
category: IT
tag: Vue
order: 4
article: false
---

# 组件 v-model

`v-model` 可以在组件上使用以实现双向绑定

首先让我们回忆一下 `v-model` 在原生元素上的用法：

```vue
<input v-model="searchText" />
```

在代码背后，模板编译器会对 `v-model` 进行更冗长的等价展开。因此上面的代码其实等价于下面这段：

```vue
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

而当使用在一个组件上时，`v-model` 会被展开为如下的形式：

```vue
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

要让这个例子实际工作起来，`<CustomInput>` 组件内部需要做两件事：

1. 将内部原生 `<input>` 元素的 `value` attribute 绑定到 `modelValue` prop

2. 当原生的 `input` 事件触发时，触发一个携带了新值的 `update:modelValue` 自定义事件

这里是相应的代码：

```vue
<!-- CustomInput.vue -->
<template>
  <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
  export default {
    props: ['modelValue'],
    emits: ['update:modelValue']
  }
</script>
```

现在 `v-model` 可以在这个组件上正常工作了：

```vue
<CustomInput v-model="searchText" />
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

另一种在组件内实现 `v-model` 的方式是使用一个可写的，同时具有 getter 和 setter 的 `computed` 属性。`get` 方法需返回 `modelValue` prop，而 `set` 方法需触发相应的事件：

```vue
<!-- CustomInput.vue -->
<template>
  <input v-model="value"/>
</template>

<script>
  export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    computed: {
      value: {
        get() {
          return this.modelValue
        },
        set(value) {
          this.$emit('update:modelValue', value)
        }
      }
    }
  }
</script>
```

## v-model 的参数

待更新

## 多个 v-model 绑定

待更新

## 处理 v-model 修饰符

待更新