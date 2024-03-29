---
category: IT
order: 7
article: false
---

# 依赖注入

## Prop 逐级透传问题

通常情况下，当我们需要从父组件向子组件传递数据时，会使用 [props](props.md)。想象一下这样的结构：有一些多层级嵌套的组件，形成了一颗巨大的组件树，而某个深层的子组件需要一个较远的祖先组件中的部分数据。在这种情况下，如果仅使用 props 则必须将其沿着组件链逐级传递下去，这会非常麻烦：

![](https://img.sherry4869.com/blog/it/vue/img_7.png)

注意，虽然这里的 `<Footer>` 组件可能根本不关心这些 props，但为了使 `<DeepChild>` 能访问到它们，仍然需要定义并向下传递。如果组件链路非常长，可能会影响到更多这条路上的组件。这一问题被称为“prop 逐级透传”，显然是我们希望尽量避免的情况

`provide` 和 `inject` 可以帮助我们解决这一问题。一个父组件相对于其所有的后代组件，会作为**依赖提供者**。任何后代的组件树，无论层级有多深，都可以注入由父组件提供给整条链路的依赖

![](https://img.sherry4869.com/blog/it/vue/img_8.png)

## Provide (提供)

要为组件后代提供数据，需要使用到 [provide](../../api/options/options-composition.md#provide) 选项：

```js
export default {
    provide: {
        message: 'hello!'
    }
}
```

对于 `provide` 对象上的每一个属性，后代组件会用其 key 为注入名查找期望注入的值，属性的值就是要提供的数据

如果我们需要提供依赖当前组件实例的状态 (比如那些由 `data()` 定义的数据属性)，那么可以以函数形式使用 `provide`：

```js
export default {
    data() {
        return {
            message: 'hello!'
        }
    },
    provide() {
        // 使用函数的形式，可以访问到 `this`
        return {
            message: this.message
        }
    }
}
```

然而，请注意这**不会**使注入保持响应性。我们会在后续小节中讨论如何[让注入转变为响应式](#和响应式数据配合使用)

## 应用层 Provide

除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

```js
import {createApp} from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写[插件](../reusability/plugins.md)时会特别有用，因为插件一般都不会使用组件形式来提供值

## Inject (注入)

要注入上层组件提供的数据，需使用 [inject](../../api/options/options-composition.md#inject) 选项来声明：

```js
export default {
    inject: ['message'],
    created() {
        console.log(this.message) // injected value
    }
}
```

注入会在组件自身的状态**之前**被解析，因此你可以在 `data()` 中访问到注入的属性：

```js
export default {
    inject: ['message'],
    data() {
        return {
            // 基于注入值的初始数据
            fullMessage: this.message
        }
    }
}
```

[完整的 provide + inject 示例](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### 注入别名

当以数组形式使用 `inject`，注入的属性会以同名的 key 暴露到组件实例上。在上面的例子中，提供的属性名为 `"message"`，注入后以 `this.message` 的形式暴露。访问的本地属性名和注入名是相同的

如果我们想要用一个不同的本地属性名注入该属性，我们需要在 `inject` 选项的属性上使用对象的形式：

```js
export default {
    inject: {
        /* 本地属性名 */ localMessage: {
            from: /* 注入来源名 */ 'message'
        }
    }
}
```

这里，组件本地化了原注入名 `"message"` 所提供的属性，并将其暴露为 `this.localMessage`

### 注入默认值

默认情况下，`inject` 假设传入的注入名会被某个祖先链上的组件提供。如果该注入名的确没有任何组件提供，则会抛出一个运行时警告

如果在注入一个值时不要求必须有提供者，那么我们应该声明一个默认值，和 props 类似：

```js
export default {
    // 当声明注入的默认值时
    // 必须使用对象形式
    inject: {
        message: {
            from: 'message', // 当与原注入名同名时，这个属性是可选的
            default: 'default value'
        },
        user: {
            // 对于非基础类型数据，如果创建开销比较大，或是需要确保每个组件实例
            // 需要独立数据的，请使用工厂函数
            default: () => ({name: 'John'})
        }
    }
}
```

## 和响应式数据配合使用

为保证注入方和供给方之间的响应性链接，我们需要使用 [computed()](../../api/composition/core.md#computed) 函数提供一个计算属性：

```js
import {computed} from 'vue'

export default {
    data() {
        return {
            message: 'hello!'
        }
    },
    provide() {
        return {
            // 显式提供一个计算属性
            message: computed(() => this.message)
        }
    }
}
```

[带有响应性的 provide + inject 完整示例](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

`computed()` 函数常用于组合式 API 风格的组件中，但它同样还可以用于补充选项式 API 风格的某些用例。你可以通过阅读[响应式系统基础](../essentials/reactivity-fundamentals.md)和[计算属性](../essentials/computed.md)两个章节了解更多组合式的 API 风格

::: warning 临时配置要求
上面的用例需要设置 `app.config.unwrapInjectedRef = true` 以保证注入会自动解包这个计算属性。这将会在 Vue 3.3 后成为一个默认行为，而我们暂时在此告知此项配置以避免后续升级对代码的破坏性。在 3.3 后就不需要这样做了
:::

## 使用 Symbol 作注入名

至此，我们已经了解了如何使用字符串作为注入名。但如果你正在构建大型的应用，包含非常多的依赖提供，或者你正在编写提供给其他开发者使用的组件库，建议最好使用 Symbol 来作为注入名以避免潜在的冲突

我们通常推荐在一个单独的文件中导出这些注入名 Symbol：

```js
// keys.js
export const myInjectionKey = Symbol()
```

```js
// 在供给方组件中
import {myInjectionKey} from './keys.js'

export default {
    provide() {
        return {
            [myInjectionKey]: {
                /* 要提供的数据 */
            }
        }
    }
}
```

```js
// 注入方组件
import {myInjectionKey} from './keys.js'

export default {
    inject: {
        injected: {from: myInjectionKey}
    }
}
```