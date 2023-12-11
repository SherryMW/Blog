---
category: IT
order: 1
article: false
---

# 状态选项

## data

待更新

## props

待更新

## computed

待更新

## methods

待更新

## watch

用于声明在数据更改时调用的侦听回调

- 类型

    ```ts
    interface ComponentOptions {
        watch?: {
            [key: string]: WatchOptionItem | WatchOptionItem[]
        }
    }
    
    type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem
    
    type WatchCallback<T> = (
        value: T,
        oldValue: T,
        onCleanup: (cleanupFn: () => void) => void
    ) => void
    
    type ObjectWatchOptionItem = {
        handler: WatchCallback | string
        immediate?: boolean // default: false
        deep?: boolean // default: false
        flush?: 'pre' | 'post' | 'sync' // default: 'pre'
        onTrack?: (event: DebuggerEvent) => void
        onTrigger?: (event: DebuggerEvent) => void
    }
    ```
    
    > 为了便于阅读，对类型进行了简化

- 详细信息

    `watch` 选项期望接受一个对象，其中键是需要侦听的响应式组件实例属性 (例如，通过 `data` 或 `computed` 声明的属性)——值是相应的回调函数。该回调函数接受被侦听源的新值和旧值
    
    除了一个根级属性，键名也可以是一个简单的由点分隔的路径，例如 `a.b.c`。注意，这种用法不支持复杂表达式——仅支持由点分隔的路径。如果你需要侦听复杂的数据源，可以使用命令式的 [$watch()](component-instance.md#watch) API
    
    值也可以是一个方法名称的字符串 (通过 `methods` 声明)，或包含额外选项的对象。当使用对象语法时，回调函数应被声明在 `handler` 中。额外的选项包含：

  1. `immediate`：在侦听器创建时立即触发回调。第一次调用时，旧值将为 `undefined`

  2. `deep`：如果源是对象或数组，则强制深度遍历源，以便在深度变更时触发回调。详见[深层侦听器](../../guide/essentials/watchers.md#深层侦听器)

  3. `flush`：调整回调的刷新时机。详见[回调的触发时机](../../guide/essentials/watchers.md#回调的触发时机)及 [watchEffect()](../composition/core.md#watcheffect)

  4. `onTrack / onTrigger`：调试侦听器的依赖关系。详见[侦听器调试](../../guide/extras/reactivity-in-depth.md#侦听器调试)

  声明侦听器回调时避免使用箭头函数，因为它们将无法通过 `this` 访问组件实例

- 示例

    ```js
    export default {
        data() {
            return {
                a: 1,
                b: 2,
                c: {
                    d: 4
                },
                e: 5,
                f: 6
            }
        },
        watch: {
            // 侦听根级属性
            a(val, oldVal) {
                console.log(`new: ${val}, old: ${oldVal}`)
            },
            // 字符串方法名称
            b: 'someMethod',
            // 该回调将会在被侦听的对象的属性改变时调动，无论其被嵌套多深
            c: {
                handler(val, oldVal) {
                    console.log('c changed')
                },
                deep: true
            },
            // 侦听单个嵌套属性：
            'c.d': function (val, oldVal) {
                // do something
            },
            // 该回调将会在侦听开始之后立即调用
            e: {
                handler(val, oldVal) {
                    console.log('e changed')
                },
                immediate: true
            },
            // 你可以传入回调数组，它们将会被逐一调用
            f: [
                'handle1',
                function handle2(val, oldVal) {
                    console.log('handle2 triggered')
                },
                {
                    handler: function handle3(val, oldVal) {
                        console.log('handle3 triggered')
                    }
                    /* ... */
                }
            ]
        },
        methods: {
            someMethod() {
                console.log('b changed')
            },
            handle1() {
                console.log('handle 1 triggered')
            }
        },
        created() {
            this.a = 3 // => new: 3, old: 1
        }
    }
    ```

- 参考[侦听器](../../guide/essentials/watchers.md)

## emits

待更新

## expose

待更新