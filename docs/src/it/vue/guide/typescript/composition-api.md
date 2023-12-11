---
category: IT
order: 2
article: false
---

# TS 与组合式 API

## 为组件的 props 标注类型

待更新

## 为组件的 emits 标注类型

待更新

## 为 `ref()` 标注类型

ref 会根据初始化时的值推导其类型：

```typescript
import {ref} from 'vue'

// 推导出的类型：Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

有时我们可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 `Ref` 这个类型：

```typescript
import {ref} from 'vue'
import type {Ref} from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在调用 `ref()` 时传入一个泛型参数，来覆盖默认的推导行为：

```typescript
// 得到的类型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```

如果你指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含 `undefined` 的联合类型：

```typescript
// 推导得到的类型：Ref<number | undefined>
const n = ref<number>()
```

## 为 `reactive()` 标注类型

`reactive()` 也会隐式地从它的参数中推导类型：

```typescript
import {reactive} from 'vue'

// 推导得到的类型：{ title: string }
const book = reactive({title: 'Vue 3 指引'})
```

要显式地标注一个 `reactive` 变量的类型，我们可以使用接口：

```typescript
import {reactive} from 'vue'

interface Book {
    title: string
    year?: number
}

const book: Book = reactive({title: 'Vue 3 指引'})
```

::: tip
不推荐使用 `reactive()` 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同
:::

## 为 `computed()` 标注类型

待更新

## 为事件处理函数标注类型

待更新

## 为 provide / inject 标注类型

待更新

## 为模板引用标注类型

待更新

## 为组件模板引用标注类型

待更新