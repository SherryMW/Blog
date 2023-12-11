---
category: IT
order: 1
shortTitle: 应用实例
article: false
---

# 应用实例 API

## createApp()

创建一个应用实例

- 类型

    ```typescript
    function createApp(rootComponent: Component, rootProps?: object): App
    ```

- 详细信息

    第一个参数是根组件。第二个参数可选，它是要传递给根组件的 `props`

- 示例

    可以直接内联根组件：
    
    ```js
    import {createApp} from 'vue'
    
    const app = createApp({
        /* 根组件选项 */
    })
    ```
    
    也可以使用从别处导入的组件：
    
    ```js
    import {createApp} from 'vue'
    import App from './App.vue'
    
    const app = createApp(App)
    ```

## createSSRApp()

待更新

## app.mount()

待更新

## app.unmount()

待更新

## app.component()

待更新

## app.directive()

待更新

## app.use()

待更新

## app.mixin()

待更新

## app.provide()

待更新

## app.runWithContext()

待更新

## app.version

待更新

## app.config

待更新

## app.config.errorHandler

待更新

## app.config.warnHandler

待更新

## app.config.performance

待更新

## app.config.compilerOptions

待更新

## app.config.globalProperties

待更新

## app.config.optionMergeStrategies

待更新