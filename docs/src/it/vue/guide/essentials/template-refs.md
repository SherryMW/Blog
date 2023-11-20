---
category: IT
tag: Vue
order: 12
article: false
---

# 模板引用

虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 `ref` attribute：

```html
<input ref="input">
```

`ref` 是一个特殊的 attribute，和 `v-for` 章节中提到的 `key` 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时将焦点设置到一个 input 元素上，或在一个元素上初始化一个第三方库

## 访问模板引用

挂载结束后引用都会被暴露在 `this.$refs` 之上：

```vue
<template>
  <input ref="input"/>
</template>

<script>
  export default {
    mounted() {
      // 在 mounted 钩子中，$refs.input 可以被访问
      this.$refs.input.focus()
    }
  }
</script>
```

注意，你只可以在组件挂载后才能访问模板引用。如果你想在模板中的表达式上访问 `$refs.input`，在初次渲染时会是 `null`。这是因为在初次渲染前这个元素还不存在

## v-for 中的模板引用

> 需要 v3.2.25 及以上版本

当在 `v-for` 中使用模板引用时，相应的引用中包含的值是一个数组：

```vue
<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        list: [1, 2, 3]
      }
    },
    mounted() {
      console.log(this.$refs.items);
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9Uk1Pg0AQ/SuTjYc2qRDtrUETNT3oQY16cz0QGOjWZZfsRyUh/Hdnl0I9mCaEnY+3j/dm6Nld2yYHj2zDMlsY0bpbrrBrtXFQYpV76aDnCqDMXb5YjjGAQeeNmjIAKazbwOfVCq5XsP4ay0M4hlV4N9orh+WJoNDKaomJ1PXC7YRNLgxWNhEOG7uM97iiJ0tnUZRQs5W5Q8oAMi/jSZEUcListLnhLBCAUFEQZ6SzOhYtZ0c4QN9DxA1RIRGkUoycaSTN0vlLbMWcJbGVqJO91YrmFB1wVuimFRLNS+sEmeFsM3njLJdS/zzFmjMe4wjinR0W3//U97YLNc5eDVo0B+Rs7rnc1EheQnv7/owdxXOz0aWXhD7TfEMatA8aR9i9VyXJ/oOLah+bsHOh6g+77RwqO5kKQk+L5Ix+locz1k9y18l6WiQbfgGnFcbR)

应该注意的是，`ref` 数组并不保证与源数组相同的顺序：

```vue
<template>
  <div>
    <div v-for="item in items" :key="item.id" :ref="`itemRef_${item.id}`">{{ item.name }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {id: 1, name: 'Item 1'},
          {id: 2, name: 'Item 2'},
          {id: 3, name: 'Item 3'}
        ]
      };
    },
    mounted() {
      console.log(this.$refs);
    }
  }
</script>
```

由于 JavaScript 中对象的属性顺序是不保证的，`$refs` 中的引用顺序可能不会与 `items` 数组中的元素顺序一致。这是因为 Vue 在内部使用对象来保存 `ref` 引用，而对象的属性顺序是由 JavaScript 引擎决定的，可能与数组元素的添加顺序不同。在实际应用中，如果需要确保引用的顺序与数组元素的顺序一致，可以通过其他方式来操作，例如在循环中直接使用索引来生成引用名

```vue
<template>
  <div>
    <div v-for="(item, index) in items" :key="item.id" :ref="`itemRef_${index}`">{{ item.name }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {id: 1, name: 'Item 1'},
          {id: 2, name: 'Item 2'},
          {id: 3, name: 'Item 3'}
        ]
      };
    },
    mounted() {
      console.log(this.$refs);
    }
  }
</script>
```

我们使用了 `index` 来生成 `ref` 的名称，确保了 `ref` 的顺序与数组元素的顺序一致

## 函数模板引用

除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数：

```vue
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

注意我们这里需要使用动态的 `:ref` 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 `el` 参数会是 `null`。你当然也可以绑定一个组件方法而不是内联函数

## 组件上的 ref

> 这一小节假设你已了解[组件](component-basics.md)的相关知识，或者你也可以先跳过这里，之后再回来看

模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：

```vue
<template>
  <Child ref="child"/>
</template>

<script>
  import Child from './Child.vue'

  export default {
    components: {
      Child
    },
    mounted() {
      // this.$refs.child 是 <Child /> 组件的实例
    }
  }
</script>
```

如果一个子组件使用的是选项式 API ，被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互

`expose` 选项可以用于限制对子组件实例的访问：

```vue
<template>
  <div>
    <p>Parent Component</p>
    <child-component ref="childRef"></child-component>
    <button @click="callExposedMethod">Call Exposed Method</button>
  </div>
</template>

<script>
  import {ref} from 'vue';

  export default {
    components: {
      ChildComponent: {
        expose: ['exposedMethod'],
        setup() {
          const internalData = ref('Internal Data');

          const exposedMethod = () => {
            console.log('Exposed Method Called');
            console.log('Internal Data:', internalData.value);
          };

          return {
            exposedMethod
          };
        },
        template: `
        <div>
          <p>Child Component</p>
        </div>
      `
      }
    },
    methods: {
      callExposedMethod() {
        this.$refs.childRef.exposedMethod(); // 父组件通过 this.$refs.childRef.exposedMethod() 的方式调用了子组件的暴露方法
      }
    }
  }
</script>
```

在这个示例中，`ChildComponent` 中使用了 `expose` 选项，指定了一个名为 `exposedMethod` 的方法。这意味着只有这个方法会被暴露给父组件，而 `internalData` 这样的内部状态则不会被暴露