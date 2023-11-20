---
category: IT
tag: Vue
order: 9
article: false
---

# 表单输入绑定

::: details 传统获取表单控件的值写法：
```html
<input type="text" id="username">

<textarea type="text" id="intro"></textarea>

<input type="checkbox" id="basketball" value="basketball" name="hobbys"><label for="basketball">篮球</label>
<input type="checkbox" id="football" value="football" name="hobbys"><label for="football">足球</label>

<input type="radio" id="male" value="1" name="gender"><label for="male">男</label>
<input type="radio" id="female" value="0" name="gender"><label for="female">女</label>

<select id="education" onchange="changeEducation(this)">
    <option value="">---请选择学历---</option>
    <option value="小学">小学</option>
    <option value="初中">初中</option>
    <option value="高中">高中</option>
    <option value="本科">本科</option>
    <option value="硕士">硕士</option>
    <option value="博士">博士</option>
</select>

<script>
    // 文本
    // JavaScript 获取值的方式
    var username = document.getElementById("username").value;
    // jQuery 获取值的方式
    var username2 = $("#username").val();
    
    // 多行文本
    // JavaScript 获取值的方式
    var intro = document.getElementById("intro").value;
    // jQuery 获取值的方式
    var intro2 = $("#intro").val();
    
    // 复选框
    // JavaScript 获取值的方式
    var checkboxes = document.querySelectorAll('input[name="hobbys"]:checked'); 
    var selectedValues = [];
    checkboxes.forEach(function (checkbox) {
        selectedValues.push(checkbox.value);
    });
    console.log(selectedValues);
    // jQuery 获取值的方式
    var hobbys = $("input[type='checkbox'][name='hobbys']").val(); //获取所有，不管是否选中
    var hobbys2 = $("input[type='checkbox'][name='hobbys']:checked").val(); // 获取选中的值
    var hobbys3 = $("input[type='checkbox'][name='hobbys']:checked:first").val(); // 获取第一个被选中的值
    
    // 单选框
    // JavaScript 获取值的方式
    // 获取单选按钮的父容器，通常使用 name 属性来定位
    var radioContainer = document.getElementsByName("gender");
    // 初始化一个变量来存储选中的值
    var selectedValue;
    // 遍历单选按钮，找到被选中的按钮并获取其值
    for (var i = 0; i < radioContainer.length; i++) {
        if (radioContainer[i].checked) {
            selectedValue = radioContainer[i].value;
            break; // 如果找到选中的按钮，就退出循环
        }
    }
    // 现在，selectedValue 变量包含了选中的单选按钮的值
    console.log(selectedValue);
    
    // jQuery 获取值的方式
    $(document).ready(function() {
        // 使用jQuery选择具有相同 name 属性的单选按钮中被选中的按钮，并获取其值
        var selectedValue = $("input[type='radio'][name='gender']:checked").val();
        // 使用 .next() 方法来获取下一个元素，即 <label> 标签，并使用 .text() 方法来获取该 <label> 元素的文本内容，这样可以获取单选按钮的文本值
        var selectedValue2 = $("input[type='radio'][name='gender']:checked").next().text();
    });
    
    // 选择器
    // javaScript 获取值的方式
    function changeEducation(obj){
        // 获取 select 元素本身
        var selectDom = obj; // document.getElementById("education");
        // 获取选中的 options 的索引
        var selectIndex = selectDom.selectedIndex;
        // 根据索引找到 select 中索引为 selectedIndex 的 option
        var optionDom = selectDom.children[selectIndex]; // selectDom.options[selectIndex]
        console.log(optionDom.value + "===" + optionDom.text);
    }
    
    // jQuery 获取值的方式
    // 获取value
    var education = $("#education").find("option:selected").val();
    // 获取文本
    var educationText = $("#education").find("option:selected").text();
</script>
```
:::

在前端处理表单时，我们常常需要将表单输入框的内容同步给 JavaScript 中相应的变量。手动连接值绑定和更改事件监听器可能会很麻烦：

```vue
<input :value="text" @input="event => text = event.target.value">
```

`v-model` 指令帮我们简化了这一步骤：

```vue
<template>
  <input type="text" v-model="username">
</template>

<script>
  export default {
    data() {
      return {
        username: ""
      }
    }
  }
</script>
```

另外，`v-model` 还可以用于各种不同类型的输入，`<textarea>`、`<select>` 元素。它会根据所使用的元素自动使用对应的 DOM 属性和事件组合：

- 文本类型的 `<input>` 和 `<textarea>` 元素会绑定 `value` property 并侦听 `input` 事件

- `<input type="checkbox">` 和 `<input type="radio">` 会绑定 `checked` property 并侦听 `change` 事件

- `<select>` 会绑定 `value` property 并侦听 `change` 事件

::: tip 注意
`v-model` 会忽略任何表单元素上初始的 `value`、`checked` 或 `selected` attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。你应该在 JavaScript 中使用 `data` 选项来声明该初始值
:::

## 基本用法

### 文本

```vue
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

[在演练场中尝试一下](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)

<span id="vmodel-ime-tip">

::: tip
对于需要使用 [IME](https://en.wikipedia.org/wiki/Input_method) 的语言 (中文，日文和韩文等)，你会发现 `v-model` 不会在 IME 输入还在拼字阶段时触发更新。如果你的确想在拼字阶段也触发更新，请直接使用自己的 `input` 事件监听器和 `value` 绑定而不要使用 `v-model`
:::

</span>

### 多行文本

```vue
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9Uk1PwzAM/StWLoC0j8Nuo0wCtANIfAg45hK1XpeRJlHibkVV/ztOu44d0KSqrf2eX54dt+Le+9m+RrEUWcyD9rSSFhvvAkGBG1UbglZagEKRur4Z/gECUh3sGAFUGKMqcQlXV0OqSx9+8ZPNT8IcEFbeKMIUURa9sqsXPkQbbXGUAR2XXJWwnuUh0o/BOykOW004ZSTns3zAaSq7lWLVtqfirsvmfigkbEgFVLCfVq5AwwpHlhTANnLcOlNg4LwqCqiSEW8Qkmpk1Ww+KrBeCo7exURQzJ3d6HK2i87y9PpRSJG7ymuD4c2TdpY1luOQ+Ahj3OG5z1GocTLm8y3m3//kd7FJOSneA0YMezZ9wthUiTTA689XdnkGcq+1YfYF8AOjM3XyONAealuw7TNe7/apSpugbfkV1w2hjWNTyWh/xT1fCl6hxwut/9ldzBbjaojuF9rB1wI=)

注意在 `<textarea>` 中是不支持插值表达式的。请使用 `v-model` 来替代：

```vue
<!-- 错误 -->
<textarea>{{ text }}</textarea>

<!-- 正确 -->
<textarea v-model="text"></textarea>
```

### 复选框

单一的复选框，绑定布尔类型值：

```vue
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)

我们也可以将多个复选框绑定到同一个数组或[集合](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)的值：

```vue
<template>
  <div>Checked names: {{ checkedNames }}</div>

  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames"><label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames"><label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames"><label for="mike">Mike</label>
</template>

<script>
  export default {
    data() {
      return {
        checkedNames: []
      }
    }
  }
</script>
```

在这个例子中，`checkedNames` 数组将始终包含所有当前被选中的框的值

[在演练场中尝试一下](https://play.vuejs.org/#eNqVU01PAjEQ/StNT5ooe+BG1k2UcJBENOrN9VB2Byh026YfiCH8d6ft7oKJIZJstvPx5s2bTLun91oPth7oiOa2Mly7opSw08o4UsOCeeHIvpSE1Myxq+tkE2LAeSM7j5BqBdUG6hlrwI7Ix2eKH8KBP/zyrGdHx0GjBXOAHiF5zbfFOBEQmRj2+1+U5HDIswAL1VjBpfaOuG8NdyWNwLnalZTwGv01qzZob5nwIT1t3dtG1SA6fEuMiSyJEGwOgiyU6RmKUJlnMREw/+isVvK0c+te0jmWFKHyos4N38BJ56fWvaBzYihC5bFznvWbojfU2UrJBV8O1lZJvDBx+8itGs0FmGftuJJIj+tL+y8pE0J9TWPMGQ83XTzq+SO+tjjSCI0XAxbMFiX1OcfMElxKT95msEO7T+KgXiD6TPIVrBI+aEywBy9rlH2Ci2ofm3D5uVy+28nOgbTdUEFovNARX1J8NeMzox/lDgfD7iHQww+UGiTv)

### 单选按钮

```vue
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNqNUk1PwzAM/StRLgNprIfdpjIJ0A5wYBPsmEtovZEtS6LE2Yqq/necdu04oIFUtX7PH892XfMH5ybHCHzG81B45XAuDFTOemQlbGTUyGphGCslypvbzmbMA0ZvesSYU8UeyhkbLQ2MOrJJH3rRk2dDaQIIB6clQkKYl+o4X52z6/pciDVNniVPSqAgZVxEhl8O7gX3slRWcKZKAtYAmUepY3KRekJ3B1uCJtxVIyrrxLT8AM021veZc8rIs5b+WwtPyey11h36l1abOaeMi1aeDXvgY46hsGajtpNdsIb+RbtYwQt7cEqDXzpU1gTBaUfddgWXWtvTS8uhjzDu+eITiv0v/C5UiRN85SGAP9L0gw+l3wJ27sX7K1RkD04aMGqKvuJ8g2B1TD12YY/RlNT2j7i22+dDuitltuuwqBBM6IdKjbbn0sYLTgf5dGX0S7vTybQ/M958A3rZ7pk=)

### 选择器

单个选择器的示例如下：

```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9Uk1PwzAM/StWLoA0tsNuU5m0TTvAASbGMZfQeqMjTaJ8lEpV/ztuQguT2KSqiZ+fX54tt2xlzLQOyBYsc7ktjV9yhY3R1kOBBxGkh5YrgEJ4cXuX7gAWfbBqiAAcSsw9Fgu4uUlY1x/0oy+bjcoUeKyMFB4pAsicEWoJ+7G8bUct6Dqq7POJGWGo7ytdoHzgbOBxFglE0caXWkFROvEuSaAWMiAxibGTKBz+aINWmM0S+7x2ubqAry/gmzOc/MYHKMhmY6NswrzLtTqUx+nJaUWzjoPjLNeVKSXalyjhOKMBJH3OhJT66yli3gacDHj+gfnnP/jJNT3G2c6iQ1sjZ2POC3tEn9Lb/TM2dB+TNM8giX0l+YpOy9B7TLR1UAXZ/sOLbh+rfm9KdXxz28ajckNTvdG4D5HPGS3c5krrv3bn0/mwR6z7Bmbq4n8=)

::: tip
如果 `v-model` 表达式的初始值不匹配任何一个选择项，`<select>` 元素会渲染成一个“未选择”的状态。在 iOS 上，这将导致用户无法选择第一项，因为 iOS 在这种情况下不会触发一个 `change` 事件。因此，我们建议提供一个空值的禁用选项，如上面的例子所示
:::

多选（值绑定到一个数组）：

```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9UsFuwjAM/ZUop01iwMSNdUiAOGyHbRq7EQ5Va6AsTaLELZ2q/vvcZO1A2pCixH5+tl8s13xuzLAsgE955BKbGZwJBZXRFlkKu7iQyGqhGEtjjG9ug82YBSys6jzGHEhIENIp22wD1rQPXXSiUV+ZHITcyBiBPMaiNCtn6z65rvtKrGmiURttk4gYcFbe5ToF+Sh4RxSc5aQyMzKUJK42mGk1m0ejH+sSX/yDLy9wUu07kBONzkST6/DLNwuETdd+G+ZxylI8TNn9eGyqh24APoMPOLpEq122Hx6dVjR0nyF4onOTSbCvvr8TnGYRxAkeS6lPzx5DW8Cgw5MDJJ9/4EdXtZjgbxYc2BIE72MY2z1gCK/WL1CR3QdpsoUk9pXgOzgti1ZjoC0KlZLsM55X+5S3C5Sp/YdbVQjKdZ9qhfrF8HzBafOWV77+K3cynHQLxZtvidrn4w==)

如果选择器的 `<option>` 元素没有指定 `value` 属性，那么默认情况下 `value` 值将是选项的文本内容

```vue
<select v-model="education">
  <option value="">---请选择学历---</option>
  <option value="小学">小学</option>
  <option value="初中">初中</option>
  <option value="高中">高中</option>
  <option value="本科">本科</option>
  <option value="硕士">硕士</option>
  <option value="博士">博士</option>
</select>
```

选择器的选项可以使用 `v-for` 动态渲染：

```vue
<template>
  <select v-model="selected">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>

  <div>Selected: {{ selected }}</div>
</template>

<script>
  export default {
    data() {
      return {
        selected: 'A',
        options: [
          { text: 'One', value: 'A' },
          { text: 'Two', value: 'B' },
          { text: 'Three', value: 'C' }
        ]
      }
    }
  }
</script>
```

[在演练场中尝试一下](https://play.vuejs.org/#eNp9ksFuwjAMhl/FyoVNYuXADXVIgDhshzENbssOVWugLCRV4hYkxLvPTUjXw4ZUVbH92fn/JBcxq6qkqVFMROpyW1Y0lRrPlbEEBW6zWhFcpAYoMsoeHsMawCLVVscIwKHCnLCYwGA2GMasqag02k3gM2YALkB4JuZWGgdDaDJVo++Ca9fXozYn06Pm/1F7i/1pC+Yi9hUWPuYff+moc8oB4bFSGSFHAGkwAs3T0RSonqWIzqTwACPBFSNbYxm4haWOdqWAiRfSFRMfdhNY+OUGJ60BuN7EpqOQDVJGYWuvUlJalM103R0zT4jKuD0dtdXWWedGDAW53OhtuUsOzmi+YH9bUuTmWJUK7SrK5Wlhfykypczp1efI1ng7a+7ZY/79R/7gzm1OineLDm3DJrsaZXaHFMrL9Rsb7RX5eGvF9J3iBzqj6lZjwOa1Llh2j/NqX47tYy31buOWZ0LtoqlWqL90z0vBr3xxx/qv3HEyjo9FXH8AS4cA0Q==)

## 值绑定

对于单选按钮，复选框和选择器选项，`v-model` 绑定的值通常是静态的字符串 (或者对复选框是布尔值)：

```vue
<!-- `picked` 在被选择时是字符串 "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` 只会为 true 或 false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` 在第一项被选中时为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

但有时我们可能希望将该值绑定到当前组件实例上的动态数据。这可以通过使用 `v-bind` 来实现。此外，使用 `v-bind` 还使我们可以将选项值绑定为非字符串的数据类型

### 复选框

```vue
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` 和 `false-value` 是 Vue 特有的 attributes，仅支持和 `v-model` 配套使用。这里 `toggle` 属性的值会在选中时被设为 'yes'，取消选择时设为 'no'。你同样可以通过 `v-bind` 将其绑定为其他动态值：

```vue
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

::: tip
`true-value` 和 `false-value` attributes 不会影响 `value` attribute，因为浏览器在表单提交时，并不会包含未选择的复选框。为了保证这两个值 (例如：“yes”和“no”) 的其中之一被表单提交，请使用单选按钮作为替代
:::

### 单选按钮

```vue
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick` 会在第一个按钮选中时被设为 `first`，在第二个按钮选中时被设为 `second`

### 选择器选项

```vue
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` 同样也支持非字符串类型的值绑定！在上面这个例子中，当某个选项被选中，`selected` 会被设为该对象字面量值 `{ number: 123 }`

## 修饰符

### .lazy

默认情况下，`v-model` 会在每次 `input` 事件后更新数据 ([IME 拼字阶段的状态](#vmodel-ime-tip)例外)。你可以添加 `lazy` 修饰符来改为在每次 `change` 事件后（当用户输入完毕，释放焦点的时候触发）更新数据：

```vue
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

### .number

如果你想让用户输入自动转换为数字，你可以在 `v-model` 后添加 `.number` 修饰符来管理输入：

```vue
<input v-model.number="age" />
```

如果该值无法被 `parseFloat()` 处理，那么将返回原始值

```js
let num = "123abc"
console.log(parseFloat(num)); // 123
```

`number` 修饰符会在输入框有 `type="number"` 时自动启用

### .trim

如果你想要默认自动去除用户输入内容中两端的空格，你可以在 `v-model` 后添加 `.trim` 修饰符：

```vue
<input v-model.trim="msg" />
```

## 组件上的 v-model

HTML 的内置表单输入类型并不总能满足所有需求。幸运的是，我们可以使用 Vue 构建具有自定义行为的可复用输入组件，并且这些输入组件也支持 `v-model`！要了解更多关于此的内容，请在组件指引中阅读[配合 v-model 使用](../components/v-model.md)