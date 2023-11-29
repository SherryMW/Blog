---
category: IT
tag: Vue
order: 3
shortTitle: 事件
article: false
---

# 组件事件

## 触发与监听事件

在组件的模板表达式中，可以直接使用 `$emit` 方法触发自定义事件 (例如：在 `v-on` 的处理函数中)：

```vue
<!-- MyComponent -->
<button @click="$emit('someEvent')">click me</button>
```

`$emit()` 方法在组件实例上也同样以 `this.$emit()` 的形式可用：

```js
export default {
    methods: {
        submit() {
            this.$emit('someEvent')
        }
    }
}
```

父组件可以通过 `v-on` (缩写为 `@`) 来监听事件：

```vue
<MyComponent @some-event="callback" />
```

同样，组件的事件监听器也支持 `.once` 修饰符：

```vue
<MyComponent @some-event.once="callback" />
```

像组件与 prop 一样，事件的名字也提供了自动的格式转换。注意这里我们触发了一个以 camelCase 形式命名的事件，但在父组件中可以使用 kebab-case 形式来监听。与 [prop 大小写格式](props.md#prop-名字格式)一样，在模板中我们也推荐使用 kebab-case 形式来编写监听器

::: tip
和原生 DOM 事件不一样，组件触发的事件**没有冒泡机制**。你只能监听直接子组件触发的事件。平级组件或是跨越多层嵌套的组件间通信，应使用一个外部的事件总线，或是使用一个[全局状态管理](../scaling-up/state-management.md)方案
:::

## 事件参数

有时候我们会需要在触发事件时附带一个特定的值。举例来说，我们想要 `<BlogPost>` 组件来管理文本会缩放得多大。在这个场景下，我们可以给 `$emit` 提供一个额外的参数：

```vue
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

然后我们在父组件中监听事件，我们可以先简单写一个内联的箭头函数作为监听器，此函数会接收到事件附带的参数：

```vue
<MyButton @increase-by="(n) => count += n" />
```

或者，也可以用一个组件方法来作为事件处理函数：

```vue
<MyButton @increase-by="increaseCount" />
```

该方法也会接收到事件所传递的参数：

```js
export default {
    methods: {
        increaseCount(n) {
            this.count += n
        }
    }
}
```

所有传入 `$emit()` 的额外参数都会被直接传向监听器。举例来说，`$emit('foo', 1, 2, 3)` 触发后，监听器函数将会收到这三个参数值。这种机制使得在组件间进行事件通信更加灵活，可以传递任意数量的参数。在监听器函数中，你可以根据需要获取和使用这些参数值

```js
// 在组件中触发 'foo' 事件并传递额外参数
this.$emit('foo', 1, 2, 3);

// 在组件或父组件中监听 'foo' 事件并接收额外参数
// 注意：这里的参数和触发时的顺序是一致的
this.$on('foo', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3); // 输出 1 2 3
});
```

以下是一个简单的例子，演示了组件事件的基本用法：

```vue
<!-- ChildComponent.vue -->
<template>
  <button @click="sendMessage">Click me</button>
</template>

<script>
  export default {
    methods: {
      sendMessage() {
        // 触发自定义事件 'message'
        this.$emit('message', 'Hello from ChildComponent');
      },
    },
  };
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <ChildComponent @message="receiveMessage"/>
    <p>{{ receivedMessage }}</p>
  </div>
</template>

<script>
  import ChildComponent from "@/components/ChildComponent.vue";

  export default {
    components: {
      ChildComponent,
    },
    data() {
      return {
        receivedMessage: '',
      };
    },
    methods: {
      receiveMessage(message) {
        // 监听 'message' 事件，接收消息并更新数据
        this.receivedMessage = message;
      },
    },
  };
</script>
```

在这个例子中，`ChildComponent` 组件有一个按钮，当点击按钮时，会触发一个自定义事件 `message`，并传递一个消息 'Hello from ChildComponent'。在 `ParentComponent` 中，它包含了 `ChildComponent` 并监听了 `message` 事件。当 `message` 事件被触发时，`ParentComponent` 的 `receiveMessage` 方法会被调用，接收消息并更新 `receivedMessage` 数据，最终在模板中显示出来

## 声明触发的事件

组件可以显式地通过 [`emits`](../../api/options/state.md#emits) 选项来声明它要触发的事件：

```js
export default {
    emits: ['inFocus', 'submit']
}
```

这个 `emits` 选项和 `defineEmits()` 宏还支持对象语法，它允许我们对触发事件的参数进行验证：

```js
export default {
    emits: {
        submit(payload) {
            // 通过返回值为 `true` 还是为 `false` 来判断
            // 验证是否通过
        }
    }
}
```

TypeScript 用户请参考：[如何为组件所抛出的事件标注类型](../typescript/options-api.md#为组件的-emits-标注类型)

尽管事件声明是可选的，我们还是推荐你完整地声明所有要触发的事件，以此在代码中作为文档记录组件的用法。同时，事件声明能让 Vue 更好地将事件和[透传 attribute](attrs.md#v-on-监听器继承) 作出区分，从而避免一些由第三方代码触发的自定义 DOM 事件所导致的边界情况

::: tip
如果一个原生事件的名字 (例如 `click`) 被定义在 `emits` 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件
:::

## 事件校验

和对 props 添加类型校验的方式类似，所有触发的事件也可以使用对象形式来描述

要为事件添加校验，那么事件可以被赋值为一个函数，接受的参数就是抛出事件时传入 `this.$emit` 的内容，返回一个布尔值来表明事件是否合法

```js
export default {
    emits: {
        // 没有校验
        click: null,

        // 校验 submit 事件
        submit: ({email, password}) => {
            if (email && password) {
                return true
            } else {
                console.warn('Invalid submit event payload!')
                return false
            }
        }
    },
    methods: {
        submitForm(email, password) {
            this.$emit('submit', {email, password})
        }
    }
}
```