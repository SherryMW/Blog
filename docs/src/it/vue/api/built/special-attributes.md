---
category: IT
order: 4
shortTitle: 特殊 Attributes
article: false
---

# 内置的特殊 Attributes

## key

`key` 这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode

- 预期：`number | string | symbol`

- 详细信息

    在没有 key 的情况下，Vue 将使用一种最小化元素移动的算法，并尽可能地就地更新/复用相同类型的元素。如果传了 key，则将根据 key 的变化顺序来重新排列元素，并且将始终移除/销毁 key 已经不存在的元素
    
    同一个父元素下的子元素必须具有**唯一的 key**。重复的 key 将会导致渲染异常
    
    最常见的用例是与 `v-for` 结合：
    
    ```vue
    <ul>
      <li v-for="item in items" :key="item.id">...</li>
    </ul>
    ```
    
    也可以用于强制替换一个元素/组件而不是复用它。当你想这么做时它可能会很有用：
    
    - 在适当的时候触发组件的生命周期钩子
    
      - 触发过渡
    
    举例来说：
    
    ```vue
    <transition>
      <span :key="text">{{ text }}</span>
    </transition>
    ```
    
    当 `text` 变化时，`<span>` 总是会被替换而不是更新，因此 transition 将会被触发

- 参考：[指南 - 列表渲染 - 通过 key 管理状态](../../guide/essentials/list.md#通过-key-管理状态)

## ref

待更新

## is

待更新