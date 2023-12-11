---
category: IT
order: 3
article: false
---

# TS 与选项式 API

## 为组件的 props 标注类型

待更新

## 为组件的 emits 标注类型

待更新

## 为计算属性标记类型

待更新

## 为事件处理函数标注类型

在处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型。让我们看一下这个例子：

```vue
<script lang="ts">
  import {defineComponent} from 'vue'

  export default defineComponent({
    methods: {
      handleChange(event) {
        // `event` 隐式地标注为 `any` 类型
        console.log(event.target.value)
      }
    }
  })
</script>

<template>
  <input type="text" @change="handleChange"/>
</template>
```

没有类型标注时，这个 `event` 参数会隐式地标注为 `any` 类型。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时抛出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，在访问 `event` 上的属性时你可能需要使用类型断言：

```typescript
import {defineComponent} from 'vue'

export default defineComponent({
    methods: {
        handleChange(event: Event) {
            console.log((event.target as HTMLInputElement).value)
        }
    }
})
```

## 扩展全局属性

待更新

## 扩展自定义选项

待更新