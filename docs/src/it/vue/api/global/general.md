---
category: IT
tag: Vue
order: 2
shortTitle: 通用
article: false
---

# 通用 API

## version

暴露当前所使用的 Vue 版本

- 类型 `string`

- 示例

```js
import { version } from 'vue'

console.log(version)
```

## nextTick()

等待下一次 DOM 更新刷新的工具方法

- 类型

    ```typescript
    function nextTick(callback?: () => void): Promise<void>
    ```

- 详细信息

    当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新
    
    `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 `await` 返回的 `Promise`

- 示例

    ```vue
    <template>
      <button id="counter" @click="increment">{{ count }}</button>
    </template>

    <script>
      import {nextTick} from 'vue'
    
      export default {
        data() {
          return {
            count: 0
          }
        },
        methods: {
          async increment() {
            this.count++
    
            // DOM 还未更新
            console.log(document.getElementById('counter').textContent) // 0
    
            await nextTick()
            // DOM 此时已经更新
            console.log(document.getElementById('counter').textContent) // 1
          }
        }
      }
    </script>
    ```

- 参考 [this.$nextTick()](../options/component-instance.md#nexttick)

## defineComponent()

在定义 Vue 组件时提供类型推导的辅助函数

- 类型

    ```typescript
    // 选项语法
    function defineComponent(
        component: ComponentOptions
    ): ComponentConstructor
    
    // 函数语法 (需要 3.3+)
    function defineComponent(
        setup: ComponentOptions['setup'],
        extraOptions?: ComponentOptions
    ): () => any
    ```
    
    > 为了便于阅读，对类型进行了简化

- 详细信息

    第一个参数是一个组件选项对象。返回值将是该选项对象本身，因为该函数实际上在运行时没有任何操作，仅用于提供类型推导
    
    注意返回值的类型有一点特别：它会是一个构造函数类型，它的实例类型是根据选项推断出的组件实例类型。这是为了能让该返回值在 TSX 中用作标签时提供类型推导支持
    
    你可以像这样从 `defineComponent()` 的返回类型中提取出一个组件的实例类型 (与其选项中的 `this` 的类型等价)：
    
    ```typescript
    const Foo = defineComponent(/* ... */)
    
    type FooInstance = InstanceType<typeof Foo>
    ```

### 函数签名（3.3+）

待更新

## defineAsyncComponent()

待更新

## defineCustomElement()

待更新