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

默认情况下，`v-model` 在组件上都是使用 `modelValue` 作为 prop，并以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来更改这些名字：

```vue
<MyComponent v-model:title="bookTitle" />
```

在这个例子中，子组件应声明一个 `title` prop，并通过触发 `update:title` 事件更新父组件值：

```vue
<!-- App.vue -->
<template>
  <h1>{{ title }}</h1>
  <MyComponent v-model:title="title"/>
</template>

<script>
  import MyComponent from './MyComponent.vue'

  export default {
    components: {MyComponent},
    data() {
      return {
        title: 'v-model argument example'
      }
    }
  }
</script>
```

```vue
<!-- MyComponent.vue -->
<template>
  <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)"
  />
</template>

<script>
  export default {
    props: ['title'],
    emits: ['update:title']
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqFUttu2zAM/RVCKOAWyGIMfTO8Yhf0YQN2wba3qg9GwqTqZEmQKM+F4X8fJS1p0itg2CZ5SJ5DchIfnFsOEUUj2rDyytGFNKp31hN8vftk+c+gIdh420O1rA98Ka2SRhocM3yNmy5qgkkagNUOFRqYjirNixRfd9SdnhUsgEeK3uwsAFKksYFqeNPbNWro/Db2KRnHrnc6tU2wOX34xU9b79mzQciojpAtgPbm7cU0lZowz23NdvYfsvrfqcmod1LkrxRQM7St9/XEQjyYwNHgnpqE89bxEK6qXLK6zvKxV2kyV1V0PAksbavrV6Uo4yIV8XTnMlEcSYriaoZOxwP2xfs+J7H3JHU9PW65gBMckhTiGSMrShXOSupj7RRW1mzUdnkbrGHlWaAUadlKo//uSFkTpOCdl95SdFrbv1+yj3zErD7n3ODqzxP+2zAmnxQ/PAb0A8vYxwrHEr789S0r3wd5fzGJfiH4E4PVMXEssI/RrJn2AS6z/ZzPX5nt73A5EpqwE5WI5pPLeCl4/ekWnpN+T/d8eb47VTH/A+vBKhk=)

## 多个 v-model 绑定

利用刚才在 `v-model` 参数小节中学到的指定参数与事件名的技巧，我们可以在单个组件实例上创建多个 `v-model` 双向绑定。组件上的每一个 `v-model` 都会同步不同的 prop，而无需额外的选项：

```vue
<!-- App.vue -->
<template>
  <h1>{{ first }} {{ last }}</h1>
  <UserName
      v-model:first-name="first"
      v-model:last-name="last"
  />
</template>

<script>
  import UserName from './UserName.vue'

  export default {
    components: {UserName},
    data() {
      return {
        first: 'John',
        last: 'Doe'
      }
    }
  }
</script>
```

```vue
<!-- UserName.vue -->
<template>
  <input
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)"
  />
  <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)"
  />
</template>

<script>
  export default {
    props: {
      firstName: String,
      lastName: String
    },
    emits: ['update:firstName', 'update:lastName']
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqNU01v2zAM/SuCUMAtkNoYejO8Yl89rIduWLfTtIORMIk7WxIkystg+L+PlGInAYJmhmFL5CP5+EQN8r21eR9AlrLyS9dYvFe66axxKH54cE91B2LtTCeyvJgMHJAprTTsInAF6zq0KAalhVgaitag0ZdiOOQYF+xc1Vhf3ySgEA4wOD3thFg3zmMpskez1VnE89PW0fjJcE02jPyjD71VMZOmDUJn2xqBdkJU2zf3w5ByinEUtOZMtKwKckXIxC7l7W87s4K2jCG3muxvlYwbJU8RnGgC8Dr5C0paFTMJuZDHgp0ofE4464xlzagV3GvBsaV4RtfoTdRDIZc7NjM6aQtdw5r/zIIlmSG1wdBsISbbFJ39uihfo23A1Db+tdwpwm5WouzrNsz6RA33nncxkDxXTOj6HJsr6Gk+cqzdBjCPmW4OEv5/7ambC6Xnpi9VPj089Euj180mf/FG0+nFQ1KS57tpwX2x2BjtlYxHxuWVrNvW/HmMNnQB9iNMMVtY/j5jf/E7tin51QGNSk+dzL7EMbkfnp9i/7OTxjC0hH7F+Q28aQNzTLAPQa+I9hEusv0c7zoN0nf/sEPQfmqKicaLlgZP0gh/fKX1A927/G66oHL8B5MQdlE=)

## 处理 v-model 修饰符

在学习输入绑定时，我们知道了 `v-model` 有一些[内置的修饰符](../essentials/forms.md#修饰符)，例如 `.trim`，`.number` 和 `.lazy`。在某些场景下，你可能想要一个自定义组件的 `v-model` 支持自定义的修饰符

我们来创建一个自定义的修饰符 `capitalize`，它会自动将 `v-model` 绑定输入的字符串值第一个字母转为大写：

```vue
<MyComponent v-model.capitalize="myText" />
```

组件的 `v-model` 上所添加的修饰符，可以通过 `modelModifiers` prop 在组件内访问到。在下面的组件中，我们声明了 `modelModifiers` 这个 prop，它的默认值是一个空对象：

```vue
<template>
  <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
  export default {
    props: {
      modelValue: String,
      modelModifiers: {
        default: () => ({})
      }
    },
    emits: ['update:modelValue'],
    created() {
      console.log(this.modelModifiers) // { capitalize: true }
    }
  }
</script>
```

注意这里组件的 `modelModifiers` prop 包含了 `capitalize` 且其值为 `true`，因为它在模板中的 `v-model` 绑定 `v-model.capitalize="myText"` 上被使用了

有了这个 prop，我们就可以检查 `modelModifiers` 对象的键，并编写一个处理函数来改变抛出的值。在下面的代码里，我们就是在每次 `<input />` 元素触发 `input` 事件时将值的首字母大写：

```vue
<template>
  <input type="text" :value="modelValue" @input="emitValue"/>
</template>

<script>
  export default {
    props: {
      modelValue: String,
      modelModifiers: {
        default: () => ({})
      }
    },
    emits: ['update:modelValue'],
    methods: {
      emitValue(e) {
        let value = e.target.value
        if (this.modelModifiers.capitalize) {
          value = value.charAt(0).toUpperCase() + value.slice(1)
        }
        this.$emit('update:modelValue', value)
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqFVN9v2jAQ/ldO1iSCxsKmvkVQrav6sEndppXtZdlDlBzgzrEt+8JgiP99ZweSMNEWIYLv5/d9d85e3FibbhoUmZj50klL17mWtTWO4H53a/ifRk2wdKaGUTod2ELaKNcAucZtTKhwWTSKYB+s5SnOZ7A/q3WYBH9VUJGM21gAh9Q4fToB1LsFbimDUewAcAgP/uHvbNoB5QNhbVVByCeAxVp6kNo2BGVhJRVK/kUPuEG3o7XUK9iZBhgDuizEz4awNm9qU6FK+8x5LlocuYApN5hNu25iIv6T4kzBS4JYZ2zQoiUUe/0oVIMZPJBjbFGVo+PeVHIp0fXxLFhbLANWbX4Nyf4wHmoT07GWQe+fo8ayvpj1XUa/YkCNtDZVXzYkRH+C3SwAFLIcwQpzwJQKt0LmGAynCLmEhBX16TncgXiDctAVi8+0XBfuhpK345TMd2vR3RYemdXro98rWWLy7kjvSDB8YsdXAXNygeGkTT9T5aWNmbXbQjsbpk3trLNYJ0y/K87W9zGUrZ1mF9eCfGn0Uq7SR280L0VUIRfhOkiF7oslabTPRTeCXBRKmT+foo1cg8dF4Jw1lr8v2B/9Nthy8dWhR7dhIJ2vHVbrvnv4HAl1TubTKI5+xvkNvVFNwNiGfWh0xbAHcRHtx/iK4K1d+LstofYnUgFov4+54JsRrslT1Hu4V+nVaWLi8A9zzIf5)

### 带参数的 v-model 修饰符

对于又有参数又有修饰符的 `v-model` 绑定，生成的 prop 名将是 `arg + "Modifiers"`。举例来说：

```vue
<MyComponent v-model:title.capitalize="myText" />
```

相应的声明应该是：

```js
export default {
    props: ['title', 'titleModifiers'],
    emits: ['update:title'],
    created() {
        console.log(this.titleModifiers) // { capitalize: true }
    }
}
```

这里是另一个例子，展示了如何在使用多个不同参数的 `v-model` 时使用修饰符：

```vue
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

```vue
<script>
  export default {
    props: {
      firstName: String,
      lastName: String,
      firstNameModifiers: {
        default: () => ({})
      },
      lastNameModifiers: {
        default: () => ({})
      }
    },
    emits: ['update:firstName', 'update:lastName'],
    created() {
      console.log(this.firstNameModifiers) // { capitalize: true }
      console.log(this.lastNameModifiers) // { uppercase: true}
    }
  }
</script>
```