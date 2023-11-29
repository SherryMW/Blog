---
category: IT
tag: Vue
order: 6
article: false
---

# 组件实例

## $data

待更新

## $props

待更新

## $el

待更新

## $options

待更新

## $parent

待更新

## $root

待更新

## $slots

待更新

## $refs

待更新

## $attrs

一个包含了组件所有透传 attributes 的对象

- 类型

    ```typescript
    interface ComponentPublicInstance {
        $attrs: object
    }
    ```

- 详细信息

    [透传 Attributes](../../guide/components/attrs.md) 是指由父组件传入，且没有被子组件声明为 props 或是组件自定义事件的 attributes 和事件处理函数

    默认情况下，若是单一根节点组件，`$attrs` 中的所有属性都是直接自动继承自组件的根元素。而多根节点组件则不会如此，同时你也可以通过配置 [inheritAttrs](options-misc.md#inheritattrs) 选项来显式地关闭该行为

- 参考 [透传 Attribute](../../guide/components/attrs.md)

下面是一个简单的例子，演示了 `$attrs` 的使用：

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent title="Hello" custom-attribute="example"/>
</template>

<script>
  import ChildComponent from './ChildComponent.vue';

  export default {
    components: {
      ChildComponent,
    },
  };
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Custom Attribute: {{ $attrs['custom-attribute'] }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: String,
    },
    mounted() {
      console.log(this.$attrs); // 输出：{ custom-attribute: "example" }
    },
  };
</script>
```

在这个例子中，`ChildComponent` 接收了一个 `title` 的 prop，并且通过 `$attrs` 访问了父组件传递给它的非 `prop` 特性 `custom-attribute`。在父组件中，我们将 `title` 传递给 `ChildComponent` 作为 prop，并且添加了一个额外的非 prop 特性 `custom-attribute`。这个非 prop 特性会被传递给子组件，然后通过 `$attrs` 进行访问

## $watch()

用于命令式地创建侦听器的 API

- 类型

    ```ts
    interface ComponentPublicInstance {
        $watch(
            source: string | (() => any),
            callback: WatchCallback,
            options?: WatchOptions
        ): StopHandle
    }
    
    type WatchCallback<T> = (
        value: T,
        oldValue: T,
        onCleanup: (cleanupFn: () => void) => void
    ) => void
    
    interface WatchOptions {
        immediate?: boolean // default: false
        deep?: boolean // default: false
        flush?: 'pre' | 'post' | 'sync' // default: 'pre'
        onTrack?: (event: DebuggerEvent) => void
        onTrigger?: (event: DebuggerEvent) => void
    }
    
    type StopHandle = () => void
    ```

- 详细信息

    第一个参数是侦听来源。可以是一个组件的属性名的字符串，一个简单的由点分隔的路径字符串，或是一个 getter 函数。第二个参数是回调函数。它接收的参数分别是侦听来源的新值、旧值

  1. `immediate`：指定在侦听器创建时是否立即触发回调。在第一次调用时旧值为 `undefined`

  2. `deep`：指定在侦听来源是一个对象时，是否强制深度遍历，这样回调函数就会在深层级发生变更时被触发。详见[深层侦听器](../../guide/essentials/watchers.md#深层侦听器)

  3. `flush`：指定回调函数的刷新时机。详见[回调刷新时机](../../guide/essentials/watchers.md#回调的触发时机)及 [watchEffect()](../composition/core.md#watcheffect)

  4. `onTrack / onTrigger`：调试侦听器的依赖，详见[侦听器调试](../../guide/extras/reactivity-in-depth.md#侦听器调试)

- 示例

    侦听一个属性名：
    
    ```js
    this.$watch('a', (newVal, oldVal) => {})
    ```
    
    侦听一个由 `.` 分隔的路径：
    
    ```js
    this.$watch('a.b', (newVal, oldVal) => {})
    ```
    
    对更复杂表达式使用 getter 函数：
    
    ```js
    this.$watch(
        // 每一次这个 `this.a + this.b` 表达式生成一个
        // 不同的结果，处理函数都会被调用
        // 这就好像我们在侦听一个计算属性
        // 而不定义计算属性本身。
        () => this.a + this.b,
        (newVal, oldVal) => {
        }
    )
    ```
    
    停止该侦听器：
    
    ```js
    const unwatch = this.$watch('a', cb)
    
    // ...当该侦听器不再需要时
    unwatch()
    ```

- 参考

  - [选项 - watch](../options/state.md#watch)
  - [指南 - 侦听器](../../guide/essentials/watchers.md)

## $emit()

待更新

## $forceUpdate()

待更新

## $nextTick()

绑定在实例上的 [nextTick()](../global/general.md#nexttick) 函数

- 类型

    ```typescript
    interface ComponentPublicInstance {
        $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
    }
    ```

- 详细信息

    和全局版本的 `nextTick()` 的唯一区别就是组件传递给 `this.$nextTick()` 的回调函数会带上 `this` 上下文，其绑定了当前组件实例

- 示例

    ```vue
    <template>
      <div>
        <p>{{ message }}</p>
        <button @click="updateMessage">Update Message</button>
      </div>
    </template>
    
    <script>
      export default {
        data() {
          return {
            message: "Hello, Vue!"
          };
        },
        methods: {
          updateMessage() {
            this.message = "Updated Message";
            this.$nextTick(function () {
              // 在DOM更新后，你可以访问已更新的DOM
              console.log("Updated message:", this.message);
            });
          }
        }
      };
    </script>
    ```
    
    在这个示例中，当按钮被点击时，`updateMessage` 方法会更新 `message` 数据属性。然后，通过 `this.$nextTick`，你可以确保在 DOM 更新后执行回调函数，以便在回调函数中访问已更新的 `message` 数据。这是 `$nextTick` 的作用，它确保你在合适的时机执行回调函数，以便操作已更新的 DOM 或组件数据

- 参考 [nextTick()](../global/general.md#nexttick)