---
category: IT
order: 7
article: false
---

# 列表渲染

## v-for

我们可以使用 `v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令的值需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据的数组，而 `item` 是迭代项的别名：

```vue
<template>
  <li v-for="item in items">
    {{ item.message }}
  </li>
</template>

<script>
  export default {
    data() {
      return {
        items: [{message: 'Foo'}, {message: 'Bar'}]
      }
    }
  }
</script>
```

在 `v-for` 块中可以完整地访问父作用域内的属性和变量。`v-for` 也支持使用可选的第二个参数表示当前项的位置索引

```vue
<template>
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</template>

<script>
  export default {
    data() {
      return {
        parentMessage: 'Parent',
        items: [{message: 'Foo'}, {message: 'Bar'}]
      }
    }
  }
</script>
```

```text
Parent - 0 - Foo
Parent - 1 - Bar
```

[在演练场中尝试一下](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

`v-for` 变量的作用域和下面的 JavaScript 代码很类似：

```js
const parentMessage = 'Parent'
const items = [
    /* ... */
]

items.forEach((item, index) => {
    // 可以访问外层的 `parentMessage`
    // 而 `item` 和 `index` 只在这个作用域可用
    console.log(parentMessage, item.message, index)
})
```

注意 `v-for` 是如何对应 `forEach` 回调的函数签名的。实际上，你也可以在定义 `v-for` 的变量别名时使用解构，和解构函数参数类似：

```vue
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- 有 index 索引时 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

对于多层嵌套的 `v-for`，作用域的工作方式和函数的作用域很类似。每个 `v-for` 作用域都可以访问到父级作用域：

```vue
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

你也可以使用 `of` 作为分隔符来替代 `in`，这更接近 JavaScript 的迭代器语法：

```vue
<div v-for="item of items"></div>
```

## v-for 与对象

你也可以使用 `v-for` 来遍历一个对象的所有属性。遍历的顺序会基于对该对象调用 `Object.keys()` 的返回值来决定

```vue
<template>
  <ul>
    <li v-for="value in myObject">
      {{ value }}
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        myObject: {
          title: 'How to do lists in Vue',
          author: 'Jane Doe',
          publishedAt: '2016-04-10'
        }
      }
    }
  }
</script>
```

可以通过提供第二个参数表示属性名 (例如 key)：

```vue
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

第三个参数表示位置索引：

```vue
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9Uk1P4zAQ/SsjXwpSv1hWe6iyK7G7SMABECBOvphk2ro4dmSPS1CU/87YIYUDIopiz7w3nvcm7sRZ08z3EcVKFKH0uqE/0mLbOE9Q4VpFQ9BJC1ApUkfHw16SR4repkgS8FO/3jztsKTVSEhJ0mRwBZML9wLkoHJgdKAA2sJjxMl0LAZQkbbOM/VKWYT/LoMDJKmJT1y3xeqMj5/8WJ78mi1/zk6Wk4EiqR9a8pI//BaLgxcOCOvGKMIUURENr6mwMBr2s7Xzv6U42isTcQrP+DplfRW2x0nmaEuKXJvkdt2AQ9/PU8AVvGXfHeQzOBioxcLo3KlY5JbF4qBDTAWF0tm13sx3wVke/jA2Ubq60Qb9TUPa2SDF+0ATpoxxL1c5R57Fjvlyi+XzF/ldaFNOiluPAf0epThgpPwG2VaCz++vseX9AaxdFQ2zvwHvMDgTk8aB9jfaimV/4mW1l3W6SNpuHsJ5S2jDaCoJTcw+86XgG/jvG+sfck/np7mOf7Po3wAR0OUZ)

## 在 v-for 里使用范围值

`v-for` 可以直接接受一个整数值。在这种用例中，会将该模板基于 `1...n` 的取值范围重复多次

```vue
<span v-for="n in 10">{{ n }}</span>
```

注意此处 `n` 的初值是从 1 开始而非 0

## `<template>` 上的 v-for

与模板上的 `v-if` 类似，你也可以在 `<template>` 标签上使用 `v-for` 来渲染一个包含多个元素的块。例如：

```vue
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## v-for 与 v-if

::: warning 警告
同时使用 `v-if` 和 `v-for` 是不推荐的，因为这样二者的优先级不明显。请转阅[风格指南](https://cn.vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for)查看更多细节
:::

当它们同时存在于一个节点上时，`v-if` 比 `v-for` 的优先级更高。这意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名：

```vue
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

在外新包装一层 `<template>` 再在其上使用 `v-for` 可以解决这个问题 (这也更加明显易读)：

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## 通过 key 管理状态

Vue 默认按照“就地更新”的策略来更新通过 `v-for` 渲染的元素列表。当数据项的顺序改变时，Vue 不会随之移动 DOM 元素的顺序，而是就地更新每个元素，确保它们在原本指定的索引位置上渲染

默认模式是高效的，**但只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况**

下面是一个例子：

```vue
<template>
  <div>
    id：<input type="text" v-model="bookId">
    title：<input type="text" v-model="title">
    <button @click="add">添加</button>
    <p v-for="(book,index) in books">
      <input type="checkbox"><span>id：{{book.id}}，title：{{book.title}}</span>
    </p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bookId: "",
        title: "",
        books: [
          {id: 1, title: 'Java'},
          {id: 2, title: 'Android'}
        ]
      }
    },
    methods: {
      add() {
        this.books.unshift({id: this.bookId, title: this.title});
        this.bookId = "";
        this.title = "";
      }
    },
  }
</script>
```

上述代码中，当勾选 `id` 为 1 和 2 的元素后往 `books` 数组中添加新的元素导致数组顺序发生改变时，Vue 不会随之移动 DOM 元素的顺序，导致新添加的元素对应的复选框也被勾选

为了给 Vue 一个提示，以便它可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 `key` attribute：

```vue
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

当你使用 `<template v-for>` 时，`key` 应该被放置在这个 `<template>` 容器上：

```vue
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

::: tip
`key` 在这里是一个通过 `v-bind` 绑定的特殊 attribute。请不要和在 [v-for 中使用对象](#v-for-与对象)里所提到的对象属性名相混淆
:::

[推荐](https://cn.vuejs.org/style-guide/rules-essential.html#use-keyed-v-for)在任何可行的时候为 `v-for` 提供一个 `key` attribute，除非所迭代的 DOM 内容非常简单 (例如：不包含组件或有状态的 DOM 元素)，或者你想有意采用默认行为来提高性能

`key` 绑定的值期望是一个基础类型的值，例如字符串或 number 类型。不要用对象作为 `v-for` 的 key。关于 `key` attribute 的更多用途细节，请参阅 [key API 文档](../../api/built/special-attributes.md#key)

## 组件上使用 v-for

> 这一小节假设你已了解[组件](component-basics.md)的相关知识，或者你也可以先跳过这里，之后再回来看

我们可以直接在组件上使用 `v-for`，和在一般的元素上使用没有区别 (别忘记提供一个 key)：

```vue
<MyComponent v-for="item in items" :key="item.id" />
```

但是，这不会自动将任何数据传递给组件，因为组件有自己独立的作用域。为了将迭代后的数据传递到组件中，我们还需要传递 `props`：

```vue
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

不自动将 `item` 注入组件的原因是，这会使组件与 `v-for` 的工作方式紧密耦合。明确其数据的来源可以使组件在其他情况下重用

这里是一个简单的 [Todo List](https://play.vuejs.org/#eNqNVFtr2zAU/ivCDJzQxKbrnoJb2m0ddLBudHmb++BaJ7EaWzK6JBkh/31HkmU7W1dqApHO5TvfuekQ3bRtsjUQLaJMlZK1+irnrGmF1GQpqLjT0JCVFA2JkzQIrEOcc0JyDntnSmFVmFqTg5WWAv05cK0W5DCgHGdWSQtdTKbekBAJ2kgeboRw2Fn7Jez1gsSx87CfRiGi/Qp3MrjYj9EFOe+NnQPTNSDEZ0F0BYQyVYFynP3nyfwH6v2LUMtiA0QY7QC1LFT1VryLF/G+iZ2DqosdHyOF42PvhVXWroyI9cELnZUP2oCuBLW19qqC0ntfxqHOGLViKnFlTFqjqsmIpKXo1EOcs7MR5Y5wZ9I3KBgcpycxRhbkEns45ptz/GVpP2h4wclo60KDvelsJWRDtnPBF8o8NUwnrYQtTtJlHg1p5REaW9CsLp6gJuiEeow7t/mh9oZSUriZyVJnEuwZb03PeztvBIXau/ZJRUHN6AloECPZEipRU7BBb5N1Qr4AUNfJsuj90xDyyWgtuKWUpd3ZarLUpuqPpudnQ80ZlmTg6JObWM2MME5hP8U/vxADq8UGfqOZlSaMjuSud0HjLoPyWkIjtkGrEtXWrISJCzIj59NgeZWlPbGOvKOM4tC8aBaNH4eT1+TfJyLXrRSt3efYUYr9qAM23Ak9r/jx9XGx/Wdd5Q4HP6Xk2K1PV3dyXWJOG0zxnUWfBGjM7erBHf/qikM8TUyrUvAVWyfPSnDMzG1OHtlXjtUgv7eaCY696BcQZ7Wuxe6rk2lpoNsl9Kmg3Lwgf1Z7K8ujHxIUyC02qdfpQq4B58qqb3/euxntlTjBxrb0FeUDKFEby9GbfTScIu2RnWN75958xtdLdbvXwFVIyhIdHps8wvZ+eiX1ge5FchGWPjr+ASxp/wg=) 的例子，展示了如何通过 `v-for` 来渲染一个组件列表，并向每个实例中传入不同的数据

## 数组变化侦测

### 变更方法

Vue 能够侦听响应式数组的变更方法，并在它们被调用时触发相关的更新。这些变更方法包括：

- `push()`：将一个或多个元素添加到数组的末尾，并返回数组的新长度

    ```js
    const array = [1, 2, 3];
    array.push(4);
    // 现在 array 是 [1, 2, 3, 4]
    ```

- `unshift()`：将一个或多个元素添加到数组的开头，并返回数组的新长度

    ```js
    const array = [1, 2, 3];
    array.unshift(0);
    // 现在 array 是 [0, 1, 2, 3]
    ```

- `pop()`：移除并返回数组的最后一个元素

    ```js
    const array = [1, 2, 3];
    const removedElement = array.pop();
    // 现在 array 是 [1, 2]，removedElement 是 3
    ```

- `shift()`：移除并返回数组的第一个元素

    ```js
    const array = [1, 2, 3];
    const removedElement = array.shift();
    // 现在 array 是 [2, 3]，removedElement 是 1
    ```

- `splice()`：从指定位置开始删除或添加元素，并返回被删除的元素数组

    ```js
    const array = [1, 2, 3, 4, 5];
    const removedElements = array.splice(1, 2); // 从索引 1 开始删除 2 个元素
    // 现在 array 是 [1, 4, 5]，removedElements 是 [2, 3]
    ```

- `sort()`：对数组元素进行排序，默认是按字符串 Unicode 码点的顺序

    ```js
    const array = [3, 1, 4, 1, 5, 9, 2, 6];
    array.sort();
    // 现在 array 是 [1, 1, 2, 3, 4, 5, 6, 9]
    ```

- `reverse()`：将数组元素顺序颠倒

    ```js
    const array = [1, 2, 3, 4];
    array.reverse();
    // 现在 array 是 [4, 3, 2, 1]
    ```

### 替换一个数组

变更方法，顾名思义，就是会对调用它们的原数组进行变更。相对地，也有一些不可变 (immutable) 方法，例如 `filter()`，`concat()` 和 `slice()`，这些都不会更改原数组，而总是**返回一个新数组**。当遇到的是非变更方法时，我们需要将旧的数组替换为新的：

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

你可能认为这将导致 Vue 丢弃现有的 DOM 并重新渲染整个列表——幸运的是，情况并非如此。Vue 实现了一些巧妙的方法来最大化对 DOM 元素的重用，因此用另一个包含部分重叠对象的数组来做替换，仍会是一种非常高效的操作

## 展示过滤或排序后的结果

有时，我们希望显示数组经过过滤或排序后的内容，而不实际变更或重置原始数据。在这种情况下，你可以创建返回已过滤或已排序数组的计算属性

举例来说：

```vue
<template>
  <li v-for="n in evenNumbers">{{ n }}</li>
</template>

<script>
  export default {
    data() {
      return {
        numbers: [1, 2, 3, 4, 5]
      }
    },
    computed: {
      evenNumbers() {
        return this.numbers.filter(n => n % 2 === 0)
      }
    }
  }
</script>
```

在计算属性不可行的情况下 (例如在多层嵌套的 `v-for` 循环中)，你可以使用以下方法：

```vue
<template>
  <ul v-for="numbers in sets">
    <li v-for="n in even(numbers)">{{ n }}</li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
      }
    },
    methods: {
      even(numbers) {
        return numbers.filter(number => number % 2 === 0)
      }
    }
  }
</script>
```

在计算属性中使用 `reverse()` 和 `sort()` 的时候务必小心！这两个方法将变更原始数组，计算函数中不应该这么做。请在调用这些方法之前创建一个原数组的副本：

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```