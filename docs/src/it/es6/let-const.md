---
category: IT
tag: ES6
order: 1
article: false
---

# let 和 const

## 变量提升

变量提升（Variable Hoisting）是 JavaScript 中的一种特性，它指的是在代码执行之前，JavaScript 引擎会将变量和函数的声明部分提升到其所在作用域的顶部，以便在整个作用域内可见和可用。虽然变量提升会将声明提升到顶部，但它不会提升变量的赋值部分

以下是变量提升的一些关键要点和详细解释：

1. 变量提升涉及变量和函数声明：变量提升将变量（使用 `var` 关键字声明的变量）和函数声明提升到它们所在的作用域的顶部。这意味着在声明之前使用这些变量和函数是有效的

2. 只有声明部分被提升：只有变量和函数的声明部分会被提升，而初始化部分（赋值）仍然保留在原始位置。这意味着在声明之前使用变量时，它们的值是 undefined

3. 函数声明优先于变量声明：如果在同一个作用域内同时存在同名的函数声明和变量声明，函数声明将优先于变量声明，因此函数可以在声明之前调用

下面是一个示例来说明变量提升的工作方式：

```js
console.log(x); // 输出：undefined
var x = 10;
```

在这个示例中，变量 `x` 被声明为 `var x = 10`，但在声明之前尝试使用 `x` 会输出 undefined。这是因为变量 `x` 被提升到作用域的顶部，但初始化（赋值 10）仍然保留在原位置。这意味着在声明之前，`x` 的值是 undefined

JavaScript 中有两种常见的函数定义方式：函数声明（Function Declaration）和函数表达式（Function Expression）。这两种方式的主要区别在于函数声明在变量提升时会被整个提升，而函数表达式只有在执行到定义的地方时才会被赋值

函数声明是通过 `function` 关键字定义的，通常具有一个函数名。函数声明会在当前作用域中进行变量提升，因此可以在声明之前调用

```js
sayHello(); // 可以在声明之前调用
function sayHello() {
  console.log('Hello, world!');
}
```

函数表达式是将一个函数赋值给一个变量或表达式的方式定义的。函数表达式不会像函数声明一样在整个作用域内提升，而是只有在执行到定义的位置时才会被赋值

```js
const sayHello = function() {
  console.log('Hello, world!');
};
sayHello(); // 只能在赋值后调用
```

## var

JavaScript 引擎在执行代码之前会扫描整个作用域（函数作用域或全局作用域），并将变量和函数的声明提升到作用域的顶部。这意味着你可以在声明之前引用变量，而不会引发错误

```js
function example() {
  console.log(x); // undefined
  var x = 5;
  console.log(x); // 5
}

example();
```

相当于

```js
function example() {
  var x;
  console.log(x); // undefined
  x = 5;
  console.log(x); // 5
}

example();
```

在上述示例中，变量 `x` 在第一次 `console.log` 之前被声明了，但它的值在声明之前是 `undefined`。这是因为在代码执行之前，JavaScript 引擎会将变量的声明部分提升（移动）到其作用域的顶部，但变量的初始化（赋值）仍然保留在原始位置。所以，第一个 `console.log` 输出 `undefined`，当 `x` 被赋值为 `5`，第二个 `console.log` 输出 `5`

由于使用了 `var` 声明变量，该变量的作用域不会被限制在块内部，而是被提升到包含它的函数或全局作用域中。这被称为变量提升（Variable Hoisting）：

```js
{
    var x = 1; // 在块作用域内声明的变量
}
console.log(x); // 可以访问，输出 1
```

在 `for` 循环结束后，你仍然可以访问变量 `i`，并且它将具有最后一个循环迭代中的值。所以 `console.log(i)` 将输出 10，因为 `i` 的最后一个值是 10（当多次声明同一个变量名，后续声明会覆盖前面的声明），并且在循环结束后仍然保持可见：

```js
for (var i = 0; i < 10; i++) {
    
}
console.log(i); // 10
```

对此 `var` 变量提升的机制可能会导致一些不容易预测和维护的代码行为，所以在现代 JavaScript 中，通常推荐使用 `let` 和 `const` 关键字来声明变量，因为它们具有块级作用域。使用 `let` 和 `const` 可以减少变量提升引起的潜在问题

## let

ES6 新增了 `let` 命令，用来声明变量。它的用法类似于 `var`，但是所声明的变量，只在 `let` 命令所在的代码块内有效

```js
{
    let a = 10;
    var b = 1;
}
a // ReferenceError: a is not defined.
b // 1
```

上面代码在代码块之中，分别用 `let` 和 `var` 声明了两个变量。然后在代码块之外调用这两个变量，结果 `let` 声明的变量报错，`var` 声明的变量返回了正确的值。这表明，`let` 声明的变量只在它所在的代码块有效

`for` 循环的计数器，就很合适使用 `let` 命令

```js
for (let i = 0; i < 10; i++) {
  // ...
}

console.log(i);
// ReferenceError: i is not defined
```

上面代码中，计数器 `i` 只在 `for` 循环体内有效，在循环体外引用就会报错

下面的代码如果使用 `var` 声明，最后输出的是 10：

```js
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[6]();
```

上面代码中，变量 `i` 是 `var` 命令声明的，在全局范围内都有效，所以全局只有一个变量 `i`。每一次循环，变量 `i` 的值都会发生改变，而循环内被赋给数组 `a` 的函数内部的 console.log(i)，里面的 `i` 指向的就是全局的 `i`。也就是说，所有数组 `a` 的成员里面的 `i`，指向的都是同一个 `i`，导致运行时输出的是最后一轮的 `i` 的值，也就是 10

在以前 ES5 可以使用闭包来捕获循环变量的值，例如：

```js
var a = [];
for (var i = 0; i < 10; i++) {
    (function (index) {
        a[index] = function () {
            console.log(index);
        };
    })(i);
}
a[6]();
```

在上述代码中，我们使用了立即执行的匿名函数来创建一个闭包，将循环变量 `i` 的值传递给闭包内部的 `index` 参数，这样每个匿名函数都有自己的 `index` 值，不会受到循环结束后 `i` 的影响

但块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了，现在使用 `let` 声明变量就可以解决该问题：

```js
var a = [];
for (let i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[6]();
```

上面代码中，变量 `i` 是 `let` 声明的，当前的 `i` 只在本轮循环有效，所以每一次循环的 `i` 其实都是一个新的变量，所以最后输出的是 6。你可能会问，如果每一轮循环的变量 `i` 都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为 JavaScript 引擎内部会记住上一轮循环的值，初始化本轮的变量 `i` 时，就在上一轮循环的基础上进行计算

另外，`for` 循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域

```js
for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
}
// abc
// abc
// abc
```

上面代码正确运行，输出了 3 次 `abc`。这表明函数内部的变量 `i` 与循环变量 `i` 不在同一个作用域，有各自单独的作用域（同一个作用域不可使用 `let` 重复声明同一个变量）

### 不存在变量提升

`var` 命令会发生“变量提升”现象，即变量可以在声明之前使用，值为 undefined。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后才可以使用

为了纠正这种现象，`let` 命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错

```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错 ReferenceError
let bar = 2;
```

上面代码中，变量 `foo` 用 `var` 命令声明，会发生变量提升，即脚本开始运行时，变量 `foo` 已经存在了，但是没有值，所以会输出 undefined。变量 `bar` 用 `let` 命令声明，不会发生变量提升。这表示在声明它之前，变量 `bar` 是不存在的，这时如果用到它，就会抛出一个错误

### 暂时性死区

只要块级作用域内存在 `let` 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响

```js
var tmp = 123;

if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
}
```

上面代码中，存在全局变量 `tmp`，但是块级作用域内 `let` 又声明了一个局部变量 `tmp`，导致后者绑定这个块级作用域，所以在 `let` 声明变量前，对 `tmp` 赋值会报错

ES6 明确规定，如果区块中存在 `let` 和 `const` 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错

总之，在代码块内，使用 `let` 命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）

```js
if (true) {
    // TDZ开始
    tmp = 'abc'; // ReferenceError
    console.log(tmp); // ReferenceError

    let tmp; // TDZ结束
    console.log(tmp); // undefined

    tmp = 123;
    console.log(tmp); // 123
}
```

上面代码中，在 `let` 命令声明变量 `tmp` 之前，都属于变量 `tmp` 的“死区”

“暂时性死区”也意味着 `typeof` 不再是一个百分之百安全的操作

```js
typeof x; // ReferenceError
let x;
```

上面代码中，变量 `x` 使用 `let` 命令声明，所以在声明之前，都属于 `x` 的“死区”，只要用到该变量就会报错。因此，`typeof` 运行时就会抛出一个 `Uncaught ReferenceError: Cannot access 'x' before initialization`

作为比较，如果一个变量根本没有被声明，使用 `typeof` 反而不会报错

```js
typeof undeclared_variable // "undefined"
```

上面代码中，`undeclared_variable` 是一个不存在的变量名，结果返回“undefined”。所以，在没有 `let` 之前，`typeof` 运算符是百分之百安全的，永远不会报错。现在这一点不成立了。这样的设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错

有些“死区”比较隐蔽，不太容易发现

```js
function bar(x = y, y = 2) {
    return [x, y];
}

bar(); // 报错
```

上面代码中，调用 `bar` 函数之所以报错（某些实现可能不报错），是因为参数 `x` 默认值等于另一个参数 `y`，而此时 `y` 还没有声明，属于“死区”。如果 `y` 的默认值是 `x`，就不会报错，因为此时 `x` 已经声明了

```js
function bar(x = 2, y = x) {
    return [x, y];
}

bar(); // [2, 2]
```

另外，下面的代码也会报错，与 `var` 的行为不同

```js
// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined
```

上面代码报错，也是因为暂时性死区。使用 `let` 声明变量时，只要变量在还没有声明完成前使用，就会报错。上面这行就属于这个情况，在变量 `x` 的声明语句还没有执行完成前，就去取 `x` 的值，导致报错

ES6 规定暂时性死区和 `let`、`const` 语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在 ES5 是很常见的，现在有了这种规定，避免此类错误就很容易了

总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量

### 不允许重复声明

`let` 不允许在相同作用域内，重复声明同一个变量

```js
// 报错
function func() {
    let a = 10;
    var a = 1;
}

// 报错
function func() {
    let a = 10;
    let a = 1;
}
```

因此，不能在函数内部重新声明参数

```js
function func(arg) {
    let arg;
}

func() // 报错

function func(arg) {
    {
        let arg;
    }
}

func() // 不报错
```

## 块级作用域

### 为什么需要块级作用域

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

第一种场景，内层变量可能会覆盖外层变量

```js
var tmp = new Date();

function f() {
    console.log(tmp);
    if (false) {
        var tmp = 'hello world';
    }
}

f(); // undefined
```

上面代码的原意是，`if` 代码块的外部使用外层的 `tmp` 变量，内部使用内层的 `tmp` 变量。但是，函数 `f` 执行后，输出结果为 `undefined`，原因在于变量提升，导致内层的 `tmp` 变量覆盖了外层的 `tmp` 变量

第二种场景，用来计数的循环变量泄露为全局变量

```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
    console.log(s[i]);
}

console.log(i); // 5
```

上面代码中，变量 `i` 只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量

### ES6 的块级作用域

`let` 实际上为 JavaScript 新增了块级作用域

```js
function f1() {
    let n = 5;
    if (true) {
        let n = 10;
    }
    console.log(n); // 5
}
```

上面的函数有两个代码块，都声明了变量 `n`，运行后输出 5。这表示外层代码块不受内层代码块的影响。如果两次都使用 `var` 定义变量 `n`，最后输出的值才是 10

ES6 允许块级作用域的任意嵌套：

```js
{
    {
        {
            {
                {
                    let insane = 'Hello World'
                }
                console.log(insane); // 报错
            }
        }
    }
};
```

上面代码使用了一个五层的块级作用域，每一层都是一个单独的作用域。第四层作用域无法读取第五层作用域的内部变量

内层作用域可以定义外层作用域的同名变量：

```js
{
    {
        {
            {
                let insane = 'Hello World';
                {
                    let insane = 'Hello World'
                }
            }
        }
    }
};
```

块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了

```js
// IIFE 写法
(function () {
    var tmp = 123;
    // ...
}());

// 块级作用域写法
{
    let tmp = 123;
    // ...
}
```

### 块级作用域与函数声明

函数能不能在块级作用域之中声明？这是一个相当令人混淆的问题

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明

```js
// 情况一
if (true) {
    function f() {
    }
}

// 情况二
try {
    function f() {
    }
} catch (e) {
    // ...
}
```

上面两种函数声明，根据 ES5 的规定都是非法的

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于 `let`，在块级作用域之外不可引用

```js
function f() {
    console.log('I am outside!');
}

(function () {
    if (false) {
        // 重复声明一次函数f
        function f() {
            console.log('I am inside!');
        }
    }

    f();
}());
```

上面代码在 ES5 中运行，会得到“I am inside!”，因为在 `if` 内声明的函数 `f` 会被提升到函数头部，实际运行的代码如下

```js
// ES5 环境
function f() {
    console.log('I am outside!');
}

(function () {
    function f() {
        console.log('I am inside!');
    }

    if (false) {
    }
    f();
}());
```

ES6 就完全不一样了，理论上会得到“I am outside!”。因为块级作用域内声明的函数类似于 `let`，对作用域之外没有影响。但是，如果你真的在 ES6 浏览器中运行一下上面的代码，是会报错的，这是为什么呢？

```js
// 浏览器的 ES6 环境
function f() {
    console.log('I am outside!');
}

(function () {
    if (false) {
        // 重复声明一次函数f
        function f() {
            console.log('I am inside!');
        }
    }

    f();
}());
// Uncaught TypeError: f is not a function
```

上面的代码在 ES6 浏览器中，都会报错。原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在 [附录 B](https://www.ecma-international.org/ecma-262/6.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics) 里面规定，浏览器的实现可以不遵守上面的规定，有自己的 [行为方式](https://stackoverflow.com/questions/31419897/what-are-the-precise-semantics-of-block-level-functions-in-es6)

- 允许在块级作用域内声明函数

- 函数声明类似于 `var`，即会提升到全局作用域或函数作用域的头部

- 同时，函数声明还会提升到所在的块级作用域的头部

注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作 `let` 处理

```js
// 浏览器的 ES6 环境
function f() {
    console.log('I am outside!');
}

(function () {
    var f = undefined;
    if (false) {
        function f() {
            console.log('I am inside!');
        }
    }

    f();
}());
// Uncaught TypeError: f is not a function
```

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句

```js
// 块级作用域内部的函数声明语句，建议不要使用
{
    let a = 'secret';

    function f() {
        return a;
    }
}

// 块级作用域内部，优先使用函数表达式
{
    let a = 'secret';
    let f = function () {
        return a;
    };
}
```

另外，还有一个需要注意的地方。ES6 的块级作用域必须有大括号，如果没有大括号，JavaScript 引擎就认为不存在块级作用域

```js
// 第一种写法，报错
if (true) let x = 1;

// 第二种写法，不报错
if (true) {
    let x = 1;
}
```

上面代码中，第一种写法没有大括号，所以不存在块级作用域，而 `let` 只能出现在当前作用域的顶层，所以报错。第二种写法有大括号，所以块级作用域成立

函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层

```js
// 不报错
'use strict';
if (true) {
    function f() {
    }
}

// 报错
'use strict';
if (true) function f() {}
```

## const

### 基本用法

`const` 声明一个只读的常量。一旦声明，常量的值就不能改变

```js
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.
```

`const` 声明的变量不得改变值，这意味着，`const` 一旦声明变量，就必须立即初始化，不能留到以后赋值

```js
const foo;
// SyntaxError: Missing initializer in const declaration
```

`const` 的作用域与 `let` 命令相同：只在声明所在的块级作用域内有效

```js
if (true) {
  const MAX = 5;
}
MAX // Uncaught ReferenceError: MAX is not defined
```

`const` 命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用

```js
if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}
```

`const` 声明的常量，也与 `let` 一样不可重复声明

```js
var message = "Hello!";
let age = 25;
// 以下两行都会报错
const message = "Goodbye!";
const age = 30;
```

### 本质

`const` 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const` 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心

```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

上述代码中，常量 `foo` 储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把 `foo` 指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性

下面是另一个例子：

```js
const a = [];
a.push('Hello'); // 可执行
a.length = 0;    // 可执行
a = ['Dave'];    // 报错
```

上面代码中，常量 `a` 是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给 `a`，就会报错

如果真的想将对象冻结，应该使用 `Object.freeze` 方法

```js
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;
```

上面代码中，常量 `foo` 指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数

```js
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });
};
```

## ES6 声明变量的六种方法

ES5 只有两种声明变量的方法：`var` 命令和 `function` 命令。ES6 除了添加 `let` 和 `const` 命令，后面章节还会提到，另外两种声明变量的方法：`import` 命令和 `class` 命令。所以，ES6 一共有 6 种声明变量的方法

1. `var` 用于声明变量，它的作用域是函数作用域

    ```js
    var x = 10;
    
    function example() {
        var y = 20;
        console.log(x); // 10
        console.log(y); // 20
    }
    ```

2. `let` 命令用于声明块级作用域的变量，它的作用域仅限于当前代码块

    ```js
    if (true) {
        let z = 30;
        console.log(z); // 30
    }
    ```

3. `const` 命令用于声明块级作用域的常量，常量的值不能被重新赋值

    ```js
    const PI = 3.14159;
    ```

4. `import` 命令用于在模块中导入其他模块中的变量、函数、或对象
    
    ```js
    // 导入模块中的变量或函数
    import { someVariable, someFunction } from './module';
    
    // 导入整个模块
    import * as myModule from './module';
    ```

5. `class` 命令用于声明类，类是一种构造函数的语法糖，用于创建对象的蓝图

    ```js
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
    
        sayHello() {
            console.log(`Hello, my name is ${this.name}.`);
        }
    }
    ```

6. `function` 命令用于声明函数
    
    ```js
    function add(a, b) {
        return a + b;
    }
    ```

## 顶层对象的属性

待更新

## globalThis 对象

待更新