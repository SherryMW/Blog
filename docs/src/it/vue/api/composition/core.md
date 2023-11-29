---
category: IT
tag: Vue
order: 2
shortTitle: 响应式：核心
article: false
---

# 响应式 API：核心

## ref()

接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`

- 类型

    ```typescript
    function ref<T>(value: T): Ref<UnwrapRef<T>>
    
    interface Ref<T> {
        value: T
    }
    ```

- 详细信息

    ref 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 `.value` 的操作都将被追踪，并且写操作会触发与之相关的副作用

    如果将一个对象赋值给 ref，那么这个对象将通过 [`reactive()`](#reactive) 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包

    若要避免这种深层次的转换，请使用 [`shallowRef()`](advanced.md#shallowref) 来替代

- 示例

    ```js
    const count = ref(0)
    console.log(count.value) // 0
    
    count.value++
    console.log(count.value) // 1
    ```

    实现时钟：

    ```vue
    <template>
      <div>
        <h1>{{ timer }}</h1>
      </div>
    </template>
    
    <script>
    
      import {ref} from 'vue';
      import utils from '@/utils/date'
    
      export default {
        name: "DateTimer",
        setup() {
          let timer = ref("");
          timer.value = utils.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
          setInterval(() => {
            timer.value = utils.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
          }, 1000)
          return {
            timer
          }
        }
      }
    </script>
    ```

- 参考

  - [指南 - `ref()` 的响应式基础](待更新)

  - [指南 - 为 `ref()` 标注类型](../../guide/typescript/composition-api.md#为-ref-标注类型)

## computed()

接受一个 getter 函数，返回一个只读的响应式 [ref](#ref) 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象

- 类型

    ```typescript
    // 只读
    function computed<T>(
        getter: () => T,
        // 查看下方的 "计算属性调试" 链接
        debuggerOptions?: DebuggerOptions
    ): Readonly<Ref<Readonly<T>>>
    
    // 可写的
    function computed<T>(
        options: {
            get: () => T
            set: (value: T) => void
        },
        debuggerOptions?: DebuggerOptions
    ): Ref<T>
    ```

- 示例

    创建一个只读的计算属性 ref：

    ```typescript
    const count = ref(1)
    const plusOne = computed(() => count.value + 1)
    
    console.log(plusOne.value) // 2
    
    plusOne.value++ // 错误
    ```

    创建一个可写的计算属性 ref：

    ```typescript
    const count = ref(1)
    const plusOne = computed({
        get: () => count.value + 1,
        set: (val) => {
            count.value = val - 1
        }
    })
    
    plusOne.value = 1
    console.log(count.value) // 0
    ```

- 调试：

    ```typescript
    const plusOne = computed(() => count.value + 1, {
        onTrack(e) {
            debugger
        },
        onTrigger(e) {
            debugger
        }
    })
    ```

- 参考

  - [指南 - 计算属性](../../guide/essentials/computed.md)

  - [指南 - 计算属性调试](../../guide/extras/reactivity-in-depth.md#计算属性调试)

  - [指南 - 为 `computed()` 标注类型](../../guide/typescript/composition-api.md#为-computed-标注类型)

## reactive()

返回一个对象的响应式代理

- 类型

    ```typescript
    function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
    ```

- 详细信息

    响应式转换是“深层”的：它会影响到所有嵌套的属性。一个响应式对象也将深层地解包任何 [ref](#ref) 属性，同时保持响应性
    
    值得注意的是，当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，不会执行 ref 的解包
    
    若要避免深层响应式转换，只想保留对这个对象顶层次访问的响应性，请使用 [shallowReactive()](advanced.md#shallowreactive) 作替代
    
    返回的对象以及其中嵌套的对象都会通过 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包裹，因此**不等于**源对象，建议只使用响应式代理，避免使用原始对象

- 示例

    创建一个响应式对象：
    
    ```js
    const obj = reactive({count: 0})
    obj.count++
    ```
    
    ref 的解包：
    
    ```js
    const count = ref(1)
    const obj = reactive({count})
    
    // ref 会被解包
    console.log(obj.count === count.value) // true
    
    // 会更新 `obj.count`
    count.value++
    console.log(count.value) // 2
    console.log(obj.count) // 2
    
    // 也会更新 `count` ref
    obj.count++
    console.log(obj.count) // 3
    console.log(count.value) // 3
    ```
    
    注意当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，**不会**执行 ref 的解包：
    
    ```js
    const books = reactive([ref('Vue 3 Guide')])
    // 这里需要 .value
    console.log(books[0].value)
    
    const map = reactive(new Map([['count', ref(0)]]))
    // 这里需要 .value
    console.log(map.get('count').value)
    ```
    
    将一个 [ref](#ref) 赋值给一个 `reactive` 属性时，该 ref 会被自动解包：
    
    ```js
    const count = ref(1)
    const obj = reactive({})
    
    obj.count = count
    
    console.log(obj.count) // 1
    console.log(obj.count === count.value) // true
    ```

- 参考

  - [指南 - 响应式基础](../../guide/essentials/reactivity-fundamentals.md)

  - [指南 - 为 `reactive()` 标注类型](../../guide/typescript/composition-api.md#为-reactive-标注类型)

## readonly()

待更新

## watchEffect()

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行

- 类型

    ```ts
    function watchEffect(
        effect: (onCleanup: OnCleanup) => void,
        options?: WatchEffectOptions
    ): StopHandle
    
    type OnCleanup = (cleanupFn: () => void) => void
    
    interface WatchEffectOptions {
        flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
        onTrack?: (event: DebuggerEvent) => void
        onTrigger?: (event: DebuggerEvent) => void
    }
    
    type StopHandle = () => void
    ```

- 详细信息

    第一个参数就是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来注册清理回调。清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求 (参见下面的示例)
    
    第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖
    
    默认情况下，侦听器将在组件渲染之前执行。设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行。详见[回调的触发时机](../../guide/essentials/watchers.md#回调的触发时机)。在某些特殊情况下 (例如要使缓存失效)，可能有必要在响应式依赖发生改变时立即触发侦听器。这可以通过设置 `flush: 'sync'` 来实现。然而，该设置应谨慎使用，因为如果有多个属性同时更新，这将导致一些性能和数据一致性的问题
    
    返回值是一个用来停止该副作用的函数

- 示例

    ```js
    const count = ref(0)
    
    watchEffect(() => console.log(count.value))
    // -> 输出 0
    
    count.value++
    // -> 输出 1
    ```
    
    副作用清除：
    
    ```js
    watchEffect(async (onCleanup) => {
        const {response, cancel} = doAsyncWork(id.value)
        // `cancel` 会在 `id` 更改时调用
        // 以便取消之前
        // 未完成的请求
        onCleanup(cancel)
        data.value = await response
    })
    ```
    
    停止侦听器：
    
    ```js
    const stop = watchEffect(() => {})
    
    // 当不再需要此侦听器时:
    stop()
    ```
    
    选项：
    
    ```js
    watchEffect(() => {}, {
        flush: 'post',
        onTrack(e) {
            debugger
        },
        onTrigger(e) {
            debugger
        }
    })
    ```

    相比于 `watch`，`watchEffect` 更加灵活，它不需要指定要监听的特定响应式数据或计算属性，而是会自动追踪函数内部使用的所有响应式依赖，一旦依赖变化，副作用函数就会被重新执行。并且 `watchEffect()` 在组件初始化的时候就会执行一次用以收集依赖
    
    ```vue
    <template>
      <div>
        <h1>{{ count }}</h1>
      </div>
    </template>
    
    <script>
    
      import {ref, watchEffect} from 'vue';
    
      export default {
        name: "ReactiveView",
        setup() {
    
          const count = ref(0);
          watchEffect(() => {
            console.log("监听属性发生了变化:", count.value)
          })
    
          setInterval(() => {
            count.value++;
          }, 1000);
    
          return {
            count
          }
        }
      }
    </script>
    ```

    如果你想停止监听，你可以通过他的返回值对象进行停止监听：

    ```vue
    <template>
      <div>
        <h1>{{ count }}</h1>
      </div>
    </template>
    
    <script>
    
      import {ref, watchEffect} from 'vue';
    
      export default {
        name: "ReactiveView",
        setup() {
    
          const count = ref(0);
          const stopWE = watchEffect(() => {
            console.log("监听属性发生了变化:", count.value)
          })
    
          setInterval(() => {
            count.value++;
    
            if (count.value > 3) {
              stopWE();
            }
          }, 1000);
    
    
          return {
            count
          }
        }
      }
    </script>
    ```

- 参考

  - [指南 - 侦听器](../../guide/essentials/watchers.md)

  - [指南 - 侦听器调试](../../guide/extras/reactivity-in-depth.md#侦听器调试)

## watchPostEffect()

待更新

## watchSyncEffect()

待更新

## watch()

待更新