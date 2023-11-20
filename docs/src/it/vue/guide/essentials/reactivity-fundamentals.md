---
category: IT
tag: Vue
order: 3
article: false
---

# 响应式基础

## 声明响应式状态

选用选项式 API 时，会用 `data` 选项来声明组件的响应式状态。此选项的值应为返回一个对象的函数。Vue 将在创建新组件实例的时候调用此函数，并将函数返回的对象用响应式系统进行包装。此对象的所有顶层属性都会被代理到组件实例 (即方法和生命周期钩子中的 `this`) 上

```js
export default {
    data() {
        return {
            count: 1
        }
    },

    // `mounted` 是生命周期钩子，之后我们会讲到
    mounted() {
        // `this` 指向当前组件实例
        console.log(this.count) // => 1

        // 数据属性也可以被更改
        this.count = 2
    }
}
```

这些实例上的属性仅在实例首次创建时被添加，因此你需要确保它们都出现在 `data` 函数返回的对象上。若所需的值还未准备好，在必要时也可以使用 `null`、`undefined` 或者其他一些值占位

虽然也可以不在 `data` 上定义，直接向组件实例添加新属性，但这个属性将无法触发响应式更新

Vue 在组件实例上暴露的内置 API 使用 `$` 作为前缀。它同时也为内部属性保留 `_` 前缀。因此，你应该避免在顶层 `data` 上使用任何以这些字符作前缀的属性

使用 `$` 前缀的内置 API 示例：

- `$data`：访问组件的数据对象

- `$props`：访问组件的 prop 对象，包含传递给组件的属性

- `$el`：访问组件的根 DOM 元素

- `$emit`：用于触发自定义事件

- `$on`：用于监听自定义事件

- `$nextTick`：在 DOM 更新队列完成后执行回调

```vue
<template>
  <div>
    <p>{{ $data.message }}</p>
    <p>{{ $props.title }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: "Hello, Vue!"
      };
    },
    props: {
      title: String
    },
    created() {
      this.$emit("component-initialized");
      this.$on("custom-event", this.handleCustomEvent);
    },
    methods: {
      handleCustomEvent() {
        // 处理自定义事件
      }
    }
  };
</script>
```

使用 `_` 前缀的内部属性示例：

- `_isVue`：一个标志，表示对象是 Vue 实例

- `_props`：包含 prop 数据的对象

- `_watchers`：包含组件的观察者对象

- `_vnode`：渲染为虚拟 DOM 的当前节点

这些属性通常是内部使用的，不建议直接访问或操作它们

```js
// 不建议直接访问 _isVue 属性
const vm = new Vue({
    data: {message: "Hello, Vue!"}
});

console.log(vm._isVue); // true，表示 vm 是 Vue 实例
```

### 响应式代理 vs 原始值

在 Vue 3 中，数据是基于 [JavaScript Proxy（代理）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 实现响应式的。使用过 Vue 2 的用户可能需要注意下面这样的边界情况：

```js
export default {
    data() {
        return {
            someObject: {}
        }
    },
    mounted() {
        const newObject = {}
        this.someObject = newObject

        console.log(newObject === this.someObject) // false
    }
}
```

当你在赋值后再访问 `this.someObject`，此值已经是原来的 `newObject` 的一个响应式代理。与 Vue 2 不同的是，这里原始的 `newObject` 不会变为响应式：请确保始终通过 `this` 来访问响应式状态

## 声明方法

要为组件添加方法，我们需要用到 `methods` 选项。它应该是一个包含所有方法的对象：

```js
export default {
    data() {
        return {
            count: 0
        }
    },
    methods: {
        increment() {
            this.count++
        }
    },
    mounted() {
        // 在其他方法或是生命周期中也可以调用方法
        this.increment()
    }
}
```

Vue 自动为 `methods` 中的方法绑定了永远指向组件实例的 `this`。这确保了方法在作为事件监听器或回调函数时始终保持正确的 `this`。你不应该在定义 `methods` 时使用箭头函数，因为箭头函数没有自己的 `this` 上下文

```js
export default {
    methods: {
        increment: () => {
            // 反例：无法访问此处的 `this`!
        }
    }
}
```

和组件实例上的其他属性一样，方法也可以在模板上被访问。在模板中它们常常被用作事件监听器：

```vue
<button @click="increment">{{ count }}</button>
```

在上面的例子中，`increment` 方法会在 `<button>` 被点击时调用

### 深层响应性

在 Vue 中，默认情况下，状态是深度响应的。这意味着当改变嵌套对象或数组时，这些变化也会被检测到：

```js
export default {
    data() {
        return {
            obj: {
                nested: {count: 0},
                arr: ['foo', 'bar']
            }
        }
    },
    methods: {
        mutateDeeply() {
            // 以下都会按照期望工作
            this.obj.nested.count++
            this.obj.arr.push('baz')
        }
    }
}
```

### DOM 更新时机

当你修改了响应式状态时，DOM 会被自动更新。但是需要注意的是，DOM 更新不是同步的。Vue 会在“next tick”更新周期中缓冲所有状态的修改，以确保不管你进行了多少次状态修改，每个组件都只会被更新一次

要等待 DOM 更新完成后再执行额外的代码，可以使用 [nextTick()](../../api/global/general.md#nexttick) 全局 API：

```js
import {nextTick} from 'vue'

export default {
    methods: {
        async increment() {
            this.count++
            await nextTick()
            // 现在 DOM 已经更新了
        }
    }
}
```

### 有状态方法

在某些情况下，我们可能需要动态地创建一个方法函数，比如创建一个预置防抖的事件处理器：

```js
import {debounce} from 'lodash-es'

export default {
    methods: {
        // 使用 Lodash 的防抖函数
        click: debounce(function () {
            // ... 对点击的响应 ...
        }, 500)
    }
}
```

不过这种方法对于被重用的组件来说是有问题的，因为这个预置防抖的函数是**有状态**的：它在运行时维护着一个内部状态。如果多个组件实例都共享这同一个预置防抖的函数，那么它们之间将会互相影响

要保持每个组件实例的防抖函数都彼此独立，我们可以改为在 `created` 生命周期钩子中创建这个预置防抖的函数：

```js
export default {
    created() {
        // 每个实例都有了自己的预置防抖的处理函数
        this.debouncedClick = _.debounce(this.click, 500)
    },
    unmounted() {
        // 最好是在组件卸载时
        // 清除掉防抖计时器
        this.debouncedClick.cancel()
    },
    methods: {
        click() {
            // ... 对点击的响应 ...
        }
    }
}
```