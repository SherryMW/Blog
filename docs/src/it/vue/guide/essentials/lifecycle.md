---
category: IT
order: 10
article: false
---

# 生命周期

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码

## 注册周期钩子

举例来说，`mounted` 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码：

```js
export default {
    mounted() {
        console.log(`the component is now mounted.`)
    }
}
```

还有其他一些钩子，会在实例生命周期的不同阶段被调用，最常用的是 [mounted](../../api/options/lifecycle.md#mounted)、[updated](../../api/options/lifecycle.md#updated) 和 [unmounted](../../api/options/lifecycle.md#unmounted)

所有生命周期钩子函数的 `this` 上下文都会自动指向当前调用它的组件实例。注意：避免用箭头函数来定义生命周期钩子，因为如果这样的话你将无法在函数中通过 `this` 获取组件实例

## 生命周期图示

下面是实例生命周期的图表。你现在并不需要完全理解图中的所有内容，但以后它将是一个有用的参考

![](https://img.sherry4869.com/blog/it/vue/img_6.png)

有关所有生命周期钩子及其各自用例的详细信息，请参考[生命周期钩子 API 索引](../../api/options/lifecycle.md)