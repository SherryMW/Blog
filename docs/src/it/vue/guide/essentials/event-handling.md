---
category: IT
tag: Vue
order: 8
article: false
---

# 事件处理

## 监听事件

我们可以使用 `v-on` 指令 (简写为 `@`) 来监听 DOM 事件，并在事件触发时执行对应的 JavaScript。用法：`v-on:click="handler"` 或 `@click="handler"`

事件处理器 (handler) 的值可以是：

1. 内联事件处理器：事件被触发时执行的内联 JavaScript 语句 (与 `onclick` 类似)

2. 方法事件处理器：一个指向组件上定义的方法的属性名或是路径

## 内联事件处理器

内联事件处理器通常用于简单场景，例如：

```vue
<template>
  <button @click="count++">Add 1</button>
  <p>Count is: {{ count }}</p>
</template>
<script>
  export default {
    data() {
      return {
        count: 0
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9UkFPwyAY/StfOGm2tJrdlro4zQ56UKM7cmHtt42NAoGP2aTpfxfarXowSwiB9x6P9wItW1qbnQKyOSt86aSlBdfYWOMIKtyKoAhargEqQeLmNq05ATik4PTAAHAqTdCEbg53CeHUJVmc4ijy0TduCGurBGHaUbEJREbDY6lkeXzg7GwzmXC2WFYV3Bf5IBnkdrHeI5wPiY05IeyFhw2iht4CK2hbOLtA1wHJGn1W5DYaFPl4OZsy8qXRW7nLDt7o2L6vkhLUVip075ak0Z6z+ViSCaXM92uPkQs4veDlHsvjP/jBNwnj7MOhR3dCzkaOhNshDfTq6w2buB7J2lRBRfUV8hO9USFlHGRPQVcx9h9dn/alTi8p9W7tVw2h9pdSKWhSdr2es/gFnq9U/407y2b9ufi2rPsBBYbBYg==)

## 方法事件处理器

随着事件处理器的逻辑变得愈发复杂，内联代码方式变得不够灵活。因此 `v-on` 也可以接受一个方法名或对某个方法的调用。举例来说：

```vue
<template>
  <button @click="greet">Greet</button>
</template>
<script>
  export default {
    data() {
      return {
        name: 'Vue.js'
      }
    },
    methods: {
      greet(event) {
        // 方法中的 `this` 指向当前活跃的组件实例
        alert(`Hello ${this.name}!`) // Hello Vue.js
        // `event` 是 DOM 原生事件
        if (event) {
          alert(event.target.tagName) // BUTTON
        }
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

方法事件处理器会自动接收原生 DOM 事件并触发执行。在上面的例子中，我们能够通过被触发事件的 `event.target.tagName` 访问到该 DOM 元素

你也可以看看[为事件处理函数标注类型](../typescript/options-api.md#为事件处理函数标注类型)这一章了解更多

### 方法与内联事件判断

模板编译器会通过检查 `v-on` 的值是否是合法的 JavaScript 标识符或属性访问路径来断定是何种形式的事件处理器。举例来说，`foo`、`foo.bar` 和 `foo['bar']` 会被视为方法事件处理器，而 `foo()` 和 `count++` 会被视为内联事件处理器

## 在内联处理器中调用方法

除了直接绑定方法名，你还可以在内联事件处理器中调用方法。这允许我们向方法传入自定义参数以代替原生事件：

```vue
<template>
  <button @click="say('hello')">Say hello</button>
  <button @click="say('bye')">Say bye</button>
</template>
<script>
  export default {
    methods: {
      say(message) {
        alert(message)
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

## 在内联事件处理器中访问事件参数

有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 `$event` 变量，或者使用内联箭头函数：

```vue
<template>
  <!-- 使用特殊的 $event 变量 -->
  <button @click="warn('Form cannot be submitted yet.', $event)">
    Submit
  </button>

  <!-- 使用内联箭头函数 -->
  <button @click="(event) => warn('Form cannot be submitted yet.', event)">
    Submit
  </button>
</template>
<script>
  export default {
    methods: {
      warn(message, event) {
        // 这里可以访问 DOM 原生事件
        if (event) {
          event.preventDefault() // 阻止事件默认行为，例如点击链接时阻止页面跳转、提交表单时阻止页面刷新
        }
        alert(message)
      }
    }
  }
</script>
```

## 事件修饰符

在处理事件时调用 `event.preventDefault()` 或 `event.stopPropagation()` 是很常见的。尽管我们可以直接在方法内调用，但如果方法能更专注于数据逻辑而不用去处理 DOM 事件的细节会更好

为解决这一问题，Vue 为 `v-on` 提供了事件修饰符。修饰符是用 `.` 表示的指令后缀，包含以下这些：

- `.stop`：用于停止事件传播，阻止事件继续冒泡到父元素或祖先元素。这可以防止父元素上注册的相同事件被触发

    下面是一个示例，演示了 `@click.stop` 的用法：
    
    ```vue
    <template>
      <div @click="handleClick">
        <button @click.stop="handleClick2">Click me</button>
      </div>
    </template>
    
    <script>
      export default {
        methods: {
          handleClick() {
            console.log("Click event stopped.");
          },
          handleClick2() {
            console.log("Click event stopped.2");
          },
        },
      };
    </script>
    ```
    
    在点击按钮后，控制台只会打印一次 "Click event stopped.2"，即按钮上的点击事件被处理，但不会继续冒泡到 div 元素上。这可以用于阻止不必要的事件传播，以确保只处理特定元素上的事件

- `.prevent`：用于在触发事件时阻止默认行为

    下面是一个示例，演示了 `@click.prevent` 的用法：
    
    ```vue
    <template>
      <div @click.prevent="handleClick">
        <a href="https://www.example.com">Click me</a>
      </div>
    </template>
    
    <script>
      export default {
        methods: {
          handleClick() {
            console.log("Click event stopped and default behavior prevented.");
          },
        },
      };
    </script>
    ```
    
    在点击链接后，父元素上使用了 `@click.prevent` 修饰符，阻止了 a 标签导航到链接页面的默认行为，因此只执行 `handleClick` 方法，控制台打印 Click event stopped and default behavior prevented.，与 `<a href="https://www.example.com" @click.prevent="handleClick">Click me</a>` 写法结果一致

- `.self`：用于确保点击事件仅在元素本身被点击时触发，而不是在元素的子元素上被点击时触发。仅当 `event.target` 是元素本身时才会触发事件处理器

- `.capture`：添加事件监听器时使用事件捕获模式，使事件从最外层元素逐级向内部元素传播

- `.once`：事件只会触发一次，之后自动解绑该事件监听器

- `.passive`：声明事件监听器不会调用 `event.preventDefault()`，主要用于[改善移动端设备的滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD)。通常，浏览器的默认滚动行为（scrolling）是非常高效的，因为它是浏览器的原生功能，经过高度优化。然而，如果你在滚动事件中大量使用 `event.preventDefault()`，可能会引起性能问题，尤其是在移动设备上

    ```vue
    <div @scroll.passive="onScroll">...</div>
    ```

::: tip
使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 `@click.prevent.self` 会阻止元素及其子元素的所有点击事件的默认行为，而 `@click.self.prevent` 则只会阻止对元素本身的点击事件的默认行为
:::

`.capture`、`.once` 和 `.passive` 修饰符与[原生 addEventListener 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#options)相对应：

::: tip
请勿同时使用 `.passive` 和 `.prevent`，因为 `.passive` 已经向浏览器表明了你不想阻止事件的默认行为。如果你这么做了，则 `.prevent` 会被忽略，并且浏览器会抛出警告
:::

## 按键修饰符

在监听键盘事件时，我们经常需要检查特定的按键。Vue 允许在 `v-on` 或 `@` 监听按键事件时添加按键修饰符

```vue
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit"/>
```

你可以直接使用 `KeyboardEvent.key` 暴露的按键名称作为修饰符，但需要转为 kebab-case 形式

```vue
<input @keyup.page-down="onPageDown"/>
```

在上面的例子中，仅会在 `$event.key` 为 'PageDown' 时调用事件处理

如果你想在按下 "Shift" 键时触发事件，你可以这样使用修饰符：

```vue
<input @keyup.shift="handleShiftKey">
```

在这个示例中，`@keyup.shift` 表示当按下 "Shift" 键时触发 `handleShiftKey` 方法。`shift` 就是 `KeyboardEvent.key` 的值，但已经转为了 kebab-case 形式

### 按键别名

Vue 为一些常用的按键提供了别名：

- `.enter`

- `.tab`

- `.delete` (捕获“Delete”和“Backspace”两个按键)

- `.esc`

- `.space`

- `.up`

- `.down`

- `.left`

- `.right`

### 系统按键修饰符

你可以使用以下系统按键修饰符来触发鼠标或键盘事件监听器，只有当按键被按下时才会触发

- `.ctrl`

- `.alt`

- `.shift`

- `.meta`

::: tip
在 Mac 键盘上，meta 是 Command 键 (⌘)。在 Windows 键盘上，meta 键是 Windows 键 (⊞)。在 Sun 微机系统键盘上，meta 是钻石键 (◆)。在某些键盘上，特别是 MIT 和 Lisp 机器的键盘及其后代版本的键盘，如 Knight 键盘，space-cadet 键盘，meta 都被标记为“META”。在 Symbolics 键盘上，meta 也被标识为“META”或“Meta”。
:::

举例来说：

```vue
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear"/>

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
请注意，系统按键修饰符和常规按键不同。与 `keyup` 事件一起使用时，该按键必须在事件发出时处于按下状态。换句话说，`keyup.ctrl` 只会在你仍然按住 `ctrl` 但松开了另一个键时被触发。若你单独松开 `ctrl` 键将不会触发。
:::

### .exact 修饰符

`.exact` 修饰符允许控制触发一个事件所需的确定组合的系统按键修饰符

```vue
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

## 鼠标按键修饰符

- `.left`

- `.right`

- `.middle`

这些修饰符将处理程序限定为由特定鼠标按键触发的事件