---
category: IT
order: 11
article: false
---

# 侦听器

## 基本示例

计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态

在选项式 API 中，我们可以使用 [watch 选项](../../api/options/state.md#watch)在每次响应式属性发生变化时触发一个函数

```vue
<template>
  <p>
    Ask a yes/no question:
    <input v-model="question"/>
  </p>
  <p>{{ answer }}</p>
</template>

<script>
  export default {
    data() {
      return {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)'
      }
    },
    watch: {
      // 每当 question 改变时，这个函数就会执行
      question(newQuestion, oldQuestion) {
        if (newQuestion.includes('?')) {
          this.getAnswer()
        }
      }
    },
    methods: {
      async getAnswer() {
        this.answer = 'Thinking...'
        try {
          const res = await fetch('https://yesno.wtf/api')
          this.answer = (await res.json()).answer
        } catch (error) {
          this.answer = 'Error! Could not reach the API. ' + error
        }
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNptUk2PmzAQ/SuvXAA1sdVrmt0qqnroqa3UIxcLhuCGjKk/wkYR/70OBJLuroRkPDPvzbznuSS7rhOnQMkm2brS6s4/F0wvnbEeFdUqtB6XgoFKeZXl0z9gyQfL8w34G8h5bXiDNF3NQcWuJxtDv25Zh+CCatszSsNeaYZakDgqexD4vM7TCT9cj2Ek65Uvm83cTUr0DTGdyN7RZaN4T24F32iHOnA5hnvdtrCBJ+RcnTH180wrmLaaL4s+QNd4LBOaK3r5UWfplzTHM9afHmoxdhV78rtRcpbPmVHEf1qO5BtTuUWNcmcu8QC9046kk4l4Qvq70XzQvBdC3CyKJfb8OEa01fn4OC7Wq15pj5qidVnaeN+5jZRncmxE72upOp0uY77ulU3gSCT+uOhXnt9yiy6U1zdBRtYa+9aK+9TfrgUf8NWEtgKbK6mKQN8Qdj+/C6T4iJHkXcsKjt9WLpsZL56OXas8xRuw7cYD2LlDXKYoT7K5b+OU22rugsdpfTQVtU9FMueLBHKikRNPpLtcbnuLYZjCW7m0TIZ/92UFiQ==)

`watch` 选项也支持把键设置成用 `.` 分隔的路径：

```js
export default {
    watch: {
        // 注意：只能是简单的路径，不支持表达式。
        'some.nested.key'(newValue) {
            // ...
        }
    }
}
```

当给用户提示一些错误信息时，可以在用户有足够时间看到后进行定时清除

```js
export default {
    data() {
        return {
            errmsg: ""
        }
    },
    watch: {
        errmsg(newValue, oldValue) {
            if (this.stimer) clearTimeout(this.stimer);
            this.stimer = setTimeout(() => {
                this.errmsg = "";
            }, 3000)
        }
    }
}
```

1. `watch` 对象包含一个对 `errmsg` 的监视器。当 `errmsg` 的值发生变化时，监视器会被触发。监视器接收两个参数 `newValue` 和 `oldValue`，它们分别表示新值和旧值

2. 在监视器内部，首先检查是否存在名为 `stimer` 的定时器，如果存在，则使用 `clearTimeout` 清除它。这是为了确保在设置新的计时器之前清除之前的计时器

3. 接下来，通过 `setTimeout` 设置一个新的计时器，该计时器将在 3000 毫秒（即3秒）后执行一个回调函数。回调函数的目的是将 `errmsg` 设置为空字符串，即清除错误消息

## 深层侦听器

`watch` 默认是浅层的：被侦听的属性，仅在被赋新值时，才会触发回调函数——而嵌套属性的变化不会触发。如果想侦听所有嵌套的变更，你需要深层侦听器：

```js
export default {
    data() {
        return {
            user: {
                id: 1,
                age: 20
            }
        }
    },
    watch: {
        user: {
            handler(newValue, oldValue) {
                // 注意：在嵌套的变更中，
                // 只要没有替换对象本身，
                // 那么这里的 `newValue` 和 `oldValue` 相同
            },
            deep: true
        }
    }
}
```

::: warning 谨慎使用
深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能
:::

## 即时回调的侦听器

`watch` 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据

我们可以用一个对象来声明侦听器，这个对象有 `handler` 方法和 `immediate: true` 选项，这样便能强制回调函数立即执行：

```js
export default {
    // ...
    watch: {
        question: {
            handler(newQuestion) {
                // 在组件实例创建时会立即调用
            },
            // 强制立即执行回调
            immediate: true
        }
    }
    // ...
}
```

回调函数的初次执行就发生在 `created` 钩子之前。Vue 此时已经处理了 `data`、`computed` 和 `methods` 选项，所以这些属性在第一次调用时就是可用的

## 回调的触发时机

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调

默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态

如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 `flush: 'post'` 选项：

```js
export default {
    // ...
    watch: {
        key: {
            handler() {
            },
            flush: 'post'
        }
    }
}
```

## this.$watch()

我们也可以使用组件实例的 `$watch()` 方法来命令式地创建一个侦听器：

```js
export default {
    created() {
        this.$watch('question', (newQuestion) => {
            // ...
        })
    }
}
```

如果要在特定条件下设置一个侦听器，或者只侦听响应用户交互的内容，这方法很有用。它还允许你提前停止该侦听器

## 停止侦听器

用 `watch` 选项或者 `$watch()` 实例方法声明的侦听器，会在宿主组件卸载时自动停止。因此，在大多数场景下，你无需关心怎么停止它

在少数情况下，你的确需要在组件卸载之前就停止一个侦听器，这时可以调用 `$watch()` API 返回的函数：

```js
const unwatch = this.$watch('foo', callback)

// ...当该侦听器不再需要时
unwatch()
```

## 与计算属性的区别

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