---
category: IT
order: 3
shortTitle: 响应式：工具
article: false
---

# 响应式 API：工具

## isRef()

检查某个值是否为 ref

- 类型

    ```typescript
    function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
    ```

    请注意，返回值是一个[类型判定](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) (type predicate)，这意味着 `isRef` 可以被用作类型守卫：

    ```typescript
    let foo: unknown
    if (isRef(foo)) {
        // foo 的类型被收窄为了 Ref<unknown>
        foo.value
    }
    ```

## unref()

如果参数是 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖

- 类型

    ```typescript
    function unref<T>(ref: T | Ref<T>): T
    ```

- 示例

    ```typescript
    function useFoo(x: number | Ref<number>) {
        const unwrapped = unref(x)
        // unwrapped 现在保证为 number 类型
    }
    ```

## toRef()

可以将值、refs 或 getters 规范化为 refs (3.3+)

也可以基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然

- 类型

    ```typescript
    // 规范化签名 (3.3+)
    function toRef<T>(
        value: T
    ): T extends () => infer R ? Readonly<Ref<R>> : T extends Ref ? T : Ref<UnwrapRef<T>>
    
    // 对象属性签名
    function toRef<T extends object, K extends keyof T>(
        object: T,
        key: K,
        defaultValue?: T[K]
    ): ToRef<T[K]>
    
    type ToRef<T> = T extends Ref ? T : Ref<T>
    ```

- 示例

    规范化签名 (3.3+)：
    
    ```typescript
    // 按原样返回现有的 ref
    toRef(existingRef)
    
    // 创建一个只读的 ref，当访问 .value 时会调用此 getter 函数
    toRef(() => props.foo)
    
    // 从非函数的值中创建普通的 ref
    // 等同于 ref(1)
    toRef(1)
    ```
    
    对象属性签名：
    
    ```typescript
    const state = reactive({
        foo: 1,
        bar: 2
    })
    
    // 双向 ref，会与源属性同步
    const fooRef = toRef(state, 'foo')
    
    // 更改该 ref 会更新源属性
    fooRef.value++
    console.log(state.foo) // 2
    
    // 更改源属性也会更新该 ref
    state.foo++
    console.log(fooRef.value) // 3
    ```
    
    请注意，这不同于：
    
    ```typescript
    const fooRef = ref(state.foo)
    ```
    
    上面这个 ref **不会**和 `state.foo` 保持同步，因为这个 `ref()` 接收到的是一个纯数值
    
    `toRef()` 这个函数在你想把一个 prop 的 ref 传递给一个组合式函数时会很有用：
    
    ```vue
    <script setup>
      import {toRef} from 'vue'
    
      const props = defineProps(/* ... */)
    
      // 将 `props.foo` 转换为 ref，然后传入
      // 一个组合式函数
      useSomeFeature(toRef(props, 'foo'))
    
      // getter 语法——推荐在 3.3+ 版本使用
      useSomeFeature(toRef(() => props.foo))
    </script>
    ```
    
    当 `toRef` 与组件 props 结合使用时，关于禁止对 props 做出更改的限制依然有效。尝试将新的值传递给 ref 等效于尝试直接更改 props，这是不允许的。在这种场景下，你可能可以考虑使用带有 `get` 和 `set` 的 [`computed`](core.md#computed) 替代。详情请见在[组件上使用 v-model](../../guide/components/v-model.md) 指南
    
    当使用对象属性签名时，即使源属性当前不存在，`toRef()` 也会返回一个可用的 ref。这让它在处理可选 props 的时候格外实用，相比之下 [toRefs](#torefs) 就不会为可选 props 创建对应的 refs

## toValue()（3.3+）

待更新

## toRefs()

将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 [toRef()](#toref) 创建的

- 类型

    ```typescript
    function toRefs<T extends object>(
        object: T
    ): {
        [K in keyof T]: ToRef<T[K]>
    }
    
    type ToRef = T extends Ref ? T : Ref<T>
    ```

- 示例

    ```typescript
    const state = reactive({
        foo: 1,
        bar: 2
    })
    
    const stateAsRefs = toRefs(state)
    /*
    stateAsRefs 的类型：{
      foo: Ref<number>,
      bar: Ref<number>
    }
    */
    
    // 这个 ref 和源属性已经“链接上了”
    state.foo++
    console.log(stateAsRefs.foo.value) // 2
    
    stateAsRefs.foo.value++
    console.log(state.foo) // 3
    ```

    当从组合式函数中返回响应式对象时，`toRefs` 相当有用。使用它，消费者组件可以解构/展开返回的对象而不会失去响应性：

    ```typescript
    function useFeatureX() {
        const state = reactive({
            foo: 1,
            bar: 2
        })
    
        // ...基于状态的操作逻辑
    
        // 在返回时都转为 ref
        return toRefs(state)
    }
    
    // 可以解构而不会失去响应性
    const {foo, bar} = useFeatureX()
    ```

    `toRefs` 在调用时只会为源对象上可以枚举的属性创建 ref。如果要为可能还不存在的属性创建 ref，请改用 `toRef`

## isProxy()

待更新

## isReactive()

待更新

## isReadonly()

待更新