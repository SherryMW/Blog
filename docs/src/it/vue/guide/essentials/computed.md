---
category: IT
order: 4
article: false
---

# 计算属性

## 基础示例

模板中的表达式虽然方便，但也只能用来做简单的操作。如果在模板中写太多逻辑，会让模板变得臃肿，难以维护。比如说，我们有这样一个包含嵌套数组的对象：

```js
export default {
    data() {
        return {
            author: {
                name: 'John Doe',
                books: [
                    'Vue 2 - Advanced Guide',
                    'Vue 3 - Basic Guide',
                    'Vue 4 - The Mystery'
                ]
            }
        }
    }
}
```

我们想根据 `author` 是否已有一些书籍来展示不同的信息：

```vue
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

这里的模板看起来有些复杂。我们必须认真看好一会儿才能明白它的计算依赖于 `author.books`。更重要的是，如果在模板中需要不止一次这样的计算，我们可不想将这样的代码在模板里重复好多遍

因此我们推荐使用计算属性来描述依赖响应式状态的复杂逻辑。这是重构后的示例：

```vue
<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>

<script>
  export default {
    data() {
      return {
        author: {
          name: 'John Doe',
          books: [
            'Vue 2 - Advanced Guide',
            'Vue 3 - Basic Guide',
            'Vue 4 - The Mystery'
          ]
        }
      }
    },
    computed: {
      // 一个计算属性的 getter
      publishedBooksMessage() {
        // `this` 指向当前组件实例
        return this.author.books.length > 0 ? 'Yes' : 'No'
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

我们在这里定义了一个计算属性 `publishedBooksMessage`

更改此应用的 `data` 中 `books` 数组的值后，可以看到 `publishedBooksMessage` 也会随之改变

在模板中使用计算属性的方式和一般的属性并无二致。Vue 会检测到 `this.publishedBooksMessage` 依赖于 `this.author.books`，所以当 `this.author.books` 改变时，任何依赖于 `this.publishedBooksMessage` 的绑定都将同时更新

也可参考：[为计算属性标记类型](../typescript/options-api.md#为计算属性标记类型)

## 计算属性缓存 vs 方法

你可能注意到我们在表达式中像这样调用一个函数也会获得和计算属性相同的结果：

```vue
<template>
  <p>{{ calculateBooksMessage() }}</p>
</template>

<script>
  export default {
    data() {
      return {
        author: {
          name: 'John Doe',
          books: [
            'Vue 2 - Advanced Guide',
            'Vue 3 - Basic Guide',
            'Vue 4 - The Mystery'
          ]
        }
      }
    },
    methods: {
      calculateBooksMessage() {
        return this.author.books.length > 0 ? 'Yes' : 'No'
      }
    }
  }
</script>
```

若我们将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，然而，不同之处在于**计算属性值会基于其响应式依赖被缓存**。一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 `author.books` 不改变，无论多少次访问 `publishedBooksMessage` 都会立即返回先前的计算结果，而不用重复执行 `getter` 函数

这也解释了为什么下面的计算属性永远不会更新，因为 `Date.now()` 并不是一个响应式依赖：

```js
export default {
    computed: {
        now() {
            return Date.now()
        }
    }
}
```

相比之下，方法调用**总是**会在重渲染发生时再次执行函数

为什么需要缓存呢？想象一下我们有一个非常耗性能的计算属性 `list`，需要循环一个巨大的数组并做许多计算逻辑，并且可能也有其他计算属性依赖于 `list`。没有缓存的话，我们会重复执行非常多次 `list` 的 `getter`，然而这实际上没有必要！如果你确定不需要缓存，那么也可以使用方法调用

在 Vue.js 中，计算属性通常不直接接受参数。计算属性是依赖于其他数据的动态属性，其值由相关的数据属性计算而来，而不是通过传递参数调用的方式。然而，如果你需要动态地计算属性并传递参数，你可以使用方法（methods）来代替计算属性。方法可以接受参数，并且在模板中调用方法时可以传递参数

## 可写计算属性

计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供 `getter` 和 `setter` 来创建：

```js
export default {
    data() {
        return {
            firstName: 'John',
            lastName: 'Doe'
        }
    },
    computed: {
        fullName: {
            // getter
            get() {
                return this.firstName + ' ' + this.lastName
            },
            // setter
            set(newValue) {
                // 注意：我们这里使用的是解构赋值语法
                [this.firstName, this.lastName] = newValue.split(' ')
            }
        }
    }
}

// 访问 fullName
console.log(this.fullName); // 输出 'John Doe'

// 修改 fullName
this.fullName = 'Jane Smith';
// 现在 this.firstName 是 'Jane'，this.lastName 是 'Smith'
console.log(this.firstName); // 输出 'Jane'
console.log(this.lastName); // 输出 'Smith'
```

## 最佳实践

### Getter 不应有副作用

计算属性的 `getter` 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，**不要在 `getter` 中做异步请求或者更改 DOM**！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 `getter` 的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用[侦听器](watchers.md)根据其他响应式状态的变更来创建副作用

### 避免直接修改计算属性值

从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算

## 与侦听器的区别

**计算属性**

- 特点：

    - 在 Vue.js 中，计算属性的 `getter` 函数会在组件实例创建之后立即执行一次，但 `setter` 函数不会在创建时执行。计算属性的 `getter` 在实例创建时执行一次，用于计算初始值，并且会在相关的响应式数据发生变化时再次执行。这确保了计算属性的值是响应式的，会在相关数据变化时自动更新

    - 用于计算基于已有数据派生出的新数据

    - 会缓存计算结果，只在相关响应式依赖发生改变时才重新计算

    - 具有 `getter` 和（可选的）`setter` 方法

- 适用场景：

    - 当你有一些基于现有数据计算得出的值，而这个值在数据变化时需要实时更新时，使用计算属性更为合适

    - 例如，计算属性可以用于处理全名、过滤和排序等操作

- 示例代码：

    - 计算属性处理全名：

    ```vue
    <template>
      <div>
        <p>First Name: {{ firstName }}</p>
        <p>Last Name: {{ lastName }}</p>
        <p>Full Name: {{ fullName }}</p>
      </div>
    </template>
    
    <script>
      export default {
        data() {
          return {
            firstName: 'John',
            lastName: 'Doe'
          };
        },
        computed: {
          fullName() {
            return this.firstName + ' ' + this.lastName;
          }
        }
      }
    </script>
    ```

    - 计算属性处理过滤：

    ```vue
    <template>
      <div>
        <ul>
          <li v-for="evenNumber in evenNumbers" :key="evenNumber">{{ evenNumber }}</li>
        </ul>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        };
      },
      computed: {
        evenNumbers() {
          return this.numbers.filter(number => number % 2 === 0);
        }
      }
    }
    </script>
    ```

    - 计算属性处理排序：

    ```vue
    <template>
      <div>
        <ul>
          <li v-for="sortedNumber in sortedNumbers" :key="sortedNumber">{{ sortedNumber }}</li>
        </ul>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          numbers: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
        };
      },
      computed: {
        sortedNumbers() {
          return this.numbers.slice().sort((a, b) => a - b);
        }
      }
    }
    </script>
    ```

    - 计算属性处理购物车总价和总数量

    ```vue
    <template>
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          <li v-for="product in cart" :key="product.id">
            {{ product.name }} - {{ product.price }} USD
          </li>
        </ul>
        <p>Total Quantity: {{ totalQuantity }}</p>
        <p>Total Price: {{ totalPrice }} USD</p>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          cart: [
            { id: 1, name: 'Product 1', price: 20, quantity: 2 },
            { id: 2, name: 'Product 2', price: 30, quantity: 1 },
            // ... other products
          ]
        };
      },
      computed: {
        totalQuantity() {
          // 计算购物车中商品的总数量
          return this.cart.reduce((total, product) => total + product.quantity, 0);
        },
        totalPrice() {
          // 计算购物车中商品的总价
          return this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
        }
      }
    }
    </script>
    ```

**监听器**

- 特点：

    - 在 Vue.js 中，`watch` 配置中的 `handler` 函数不会在组件的 `created` 钩子执行后立即执行一次。`watch` 的 `handler` 函数会在被监听的数据发生变化时被触发，而不是在组件生命周期的特定阶段执行

    - 用于在数据变化时执行异步或开销较大的操作

    - 监听特定的数据变化，可以执行自定义的逻辑

    - 不缓存计算结果，而是在每次数据变化时执行

- 适用场景：

    - 当你需要在数据变化时执行一些异步操作、或者需要监听数据的变化并执行自定义逻辑时，使用监听器更为合适

    - 例如，监听器可以用于发起网络请求、触发动画或执行其他副作用


- 示例代码：

  - 异步操作： 当需要进行异步操作（例如发送网络请求、定时器等）或者执行耗时较长的操作时，可以使用 `watch` 监听数据的变化并触发相应的操作

    ```js
    export default {
        watch: {
            dataToWatch(newValue, oldValue) {
                // 异步操作
                fetchDataFromServer(newValue).then(result => {
                    // 处理结果
                    console.log(result);
                });
            }
        }
    }
    ```

  - 深度监听： 当需要监听对象或数组内部属性的变化时，可以通过设置 `deep: true` 选项来深度监听，确保对象或数组内部的变化也能触发 `watch`

    ```js
    export default {
        watch: {
            objToWatch: {
                handler(newValue, oldValue) {
                    // 对象内部属性变化的处理逻辑
                },
                deep: true
            }
        }
    }
    ```

  - 复杂逻辑： 当需要执行一些较为复杂的逻辑，而这些逻辑不适合放在计算属性中时，可以使用 `watch`

    ```js
    export default {
        watch: {
            someData(newValue, oldValue) {
                // 复杂逻辑
                if (newValue > 10 && this.anotherData === 'abc') {
                    // 执行一些复杂的操作
                }
            }
        }
    }
    ```

  - 特定数据变化触发逻辑： 当只关心特定数据的变化时，而不需要计算属性那样实时派生出新的数据，可以使用 `watch`

    ```js
    export default {
        watch: {
            specificData(newValue, oldValue) {
                // 特定数据变化时的处理逻辑
            }
        }
    }
    ```