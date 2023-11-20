---
category: IT
tag: Vue
order: 2
shortTitle: 响应式：核心
article: false
---

# 响应式 API：核心

## ref()

待更新

## computed()

待更新

## reactive()

待更新

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

- 参考

  - [指南 - 侦听器](../../guide/essentials/watchers.md)

  - [指南 - 侦听器调试](../../guide/extras/reactivity-in-depth.md#侦听器调试)


## watchPostEffect()

待更新

## watchSyncEffect()

待更新

## watch()

待更新