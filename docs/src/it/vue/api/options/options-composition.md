---
category: IT
order: 4
article: false
---

# 组合选项

## provide

用于提供可以被后代组件注入的值

- 类型

    ```typescript
    interface ComponentOptions {
        provide?: object | ((this: ComponentPublicInstance) => object)
    }
    ```

- 详细信息

    `provide` 和 [`inject`](#inject) 通常成对一起使用，使一个祖先组件作为其后代组件的依赖注入方，无论这个组件的层级有多深都可以注入成功，只要他们处于同一条组件链上
    
    这个 `provide` 选项应当是一个对象或是返回一个对象的函数。这个对象包含了可注入其后代组件的属性。你可以在这个对象中使用 Symbol 类型的值作为 key

- 示例

    基本使用方式：
    
    ```typescript
    const s = Symbol()
    
    export default {
        provide: {
            foo: 'foo',
            [s]: 'bar'
        }
    }
    ```
    
    使用函数可以提供其组件中的状态：
    
    ```typescript
    export default {
        data() {
            return {
                msg: 'foo'
            }
        },
        provide() {
            return {
                msg: this.msg
            }
        }
    }
    ```
    
    请注意，针对上面这个例子，所供给的 `msg` 将**不会**是响应式的。请查看[和响应式数据配合使用](../../guide/components/provide-inject.md#和响应式数据配合使用)一节获取更多细节

- 参考[依赖注入](../../guide/components/provide-inject.md)

## inject

用于声明要通过从上层提供方匹配并注入进当前组件的属性

- 类型

    ```typescript
    interface ComponentOptions {
        inject?: ArrayInjectOptions | ObjectInjectOptions
    }
    
    type ArrayInjectOptions = string[]
    
    type ObjectInjectOptions = {
        [key: string | symbol]:
            | string
            | symbol
            | { from?: string | symbol; default?: any }
    }
    ```

- 详细信息

    该 `inject` 选项应该是以下两种之一：

  - 一个字符串数组

  - 一个对象，其 key 名就是在当前组件中的本地绑定名称，而它的值应该是以下两种之一：

    - 匹配可用注入的 key (string 或者 Symbol)

    - 一个对象

      - 它的 `from` 属性是一个 key (string 或者 Symbol)，用于匹配可用的注入

      - 它的 `default` 属性用作候补值。和 props 的默认值类似，如果它是一个对象，那么应该使用一个工厂函数来创建，以避免多个组件共享同一个对象

    如果没有供给相匹配的属性、也没有提供默认值，那么注入的属性将为 `undefined`

    请注意，注入绑定并非响应式的。这是有意为之的一个设计。如果要注入的值是一个响应式对象，那么这个对象上的属性将会保留响应性。请看[配合响应性](../../guide/components/provide-inject.md)一节获取更多细节

- 示例

    基本使用方式：
    
    ```typescript
    export default {
        inject: ['foo'],
        created() {
            console.log(this.foo)
        }
    }
    ```
    
    使用注入的值作为 props 的默认值：
    
    ```typescript
    const Child = {
        inject: ['foo'],
        props: {
            bar: {
                default() {
                    return this.foo
                }
            }
        }
    }
    ```
    
    使用注入的值作为 data：
    
    ```typescript
    const Child = {
        inject: ['foo'],
        data() {
            return {
                bar: this.foo
            }
        }
    }
    ```
    
    注入项可以选择是否带有默认值：
    
    ```typescript
    const Child = {
        inject: {
            foo: {default: 'foo'}
        }
    }
    ```
    
    如果需要从不同名字的属性中注入，请使用 `from` 指明来源属性：
    
    ```typescript
    const Child = {
        inject: {
            foo: {
                from: 'bar',
                default: 'foo'
            }
        }
    }
    ```
    
    和 props 默认值类似，对于非原始数据类型的值，你需要使用工厂函数：
    
    ```typescript
    const Child = {
        inject: {
            foo: {
                from: 'bar',
                default: () => [1, 2, 3]
            }
        }
    }
    ```

- 参考[依赖注入](../../guide/components/provide-inject.md)

## mixins

待更新

## extends

待更新