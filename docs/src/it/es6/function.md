---
category: IT
tag: ES
order: 7
article: false
---

# 函数的扩展

## 函数参数的默认值

待更新

## rest 参数

待更新

## 严格模式

待更新

## name 属性

待更新

## 箭头函数

### 基本用法

ES6 允许使用“箭头”（`=>`）定义表达式函数：

```js
var f = v => v;

// 等同于
var f = function (v) {
    return v;
};
```

它主要用于创建匿名函数，并且不具备函数名称（除非它赋值给一个变量）。因此，以下是不合法的用法：

```text
// 错误示例：箭头函数不能用于定义命名函数
function sayHello = () => {
    console.log('Hello');
};
```

正确的方式是使用传统的函数声明来定义命名函数：

```js
function sayHello() {
    console.log('Hello');
}
```

或者，你可以使用函数表达式来创建匿名函数：

```js
const sayHello = () => {
    console.log('Hello');
};
```

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分：

```js
var f = () => 5;
// 等同于
var f = function () {
    return 5
};

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function (num1, num2) {
    return num1 + num2;
};
```

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用 `return` 语句返回：

```js
var sum = (num1, num2) => {
    return num1 + num2;
}
```

由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错：

```text
// 报错
let getTempItem = id => {
    id: id, name: "Temp"
};

// 不报错
let getTempItem = id => ({id: id, name: "Temp"});
```

下面是一种特殊情况，虽然可以运行，但会得到错误的结果：

```js
let foo = () => {
    a: 1
};
foo() // undefined
```

上面代码中，原始意图是返回一个对象 `{ a: 1 }`，但是由于引擎认为大括号是代码块，所以执行了一行语句 `a: 1`。这时，`a` 可以被解释为语句的标签，因此实际执行的语句是 1 ，然后函数就结束了，没有返回值

如果箭头函数只有一行语句，且不需要返回值，可以采用下面的写法，就不用写大括号了：

```js
let fn = () => void doesNotReturn();
```

箭头函数可以与变量解构结合使用：

```js
const full = ({first, last}) => first + ' ' + last;

// 等同于
function full(person) {
    return person.first + ' ' + person.last;
}
```

箭头函数使得表达更加简洁：

```js
const isEven = n => n % 2 === 0;
const square = n => n * n;
```

上面代码只用了两行，就定义了两个简单的工具函数。如果不用箭头函数，可能就要占用多行，而且还不如现在这样写醒目

箭头函数的一个用处是简化回调函数：

```js
// 普通函数写法
[1, 2, 3].map(function (x) {
    return x * x;
});

// 箭头函数写法
[1, 2, 3].map(x => x * x);
```

```js
// 普通函数写法
var result = values.sort(function (a, b) {
    return a - b;
});

// 箭头函数写法
var result = values.sort((a, b) => a - b);
```

下面是 `rest` 参数与箭头函数结合的例子：

```js
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5) // [1,2,3,4,5]

const headAndTail = (head, ...tail) => [head, tail];

headAndTail(1, 2, 3, 4, 5) // [1,[2,3,4,5]]
```

### 使用注意点

箭头函数有几个使用注意点：

1. 箭头函数没有自己的 `this` 对象（详见下文）

2. 不可以当作构造函数，也就是说，不可以对箭头函数使用 `new` 命令，否则会抛出一个错误

3. 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替

4. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数

上面四点中，最重要的是第一点。对于普通函数来说，内部的 `this` 指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的 `this` 对象，内部的 `this` 就是定义时上层作用域中的 `this`。也就是说，箭头函数内部的 `this` 指向是固定的，相比之下，普通函数的 `this` 指向是可变的

```js
function foo() {
    setTimeout(() => {
        console.log('id:', this.id);
    }, 100);
}

var id = 21;

foo.call({id: 42}); // id: 42
```

上面代码中，`setTimeout()` 的参数是一个箭头函数，这个箭头函数的定义生效是在 `foo` 函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时 `this` 应该指向全局对象 `window`，这时应该输出 21。但是，箭头函数导致 `this` 总是指向函数定义生效时所在的对象（本例是 `{id: 42}`），所以打印出来的是 42

下面例子是回调函数分别为箭头函数和普通函数，对比它们内部的 `this` 指向：

```js
function Timer() {
    this.s1 = 0;
    this.s2 = 0;
    // 箭头函数
    setInterval(() => this.s1++, 1000);
    // 普通函数
    setInterval(function () {
        this.s2++;
    }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100); // s1: 3
setTimeout(() => console.log('s2: ', timer.s2), 3100); // s2: 0
```

上面代码中，`Timer` 函数内部设置了两个定时器，分别使用了箭头函数和普通函数。前者的 `this` 绑定定义时所在的作用域（即 `Timer` 函数），后者的 `this` 指向运行时所在的作用域（即全局对象）。所以，3100 毫秒之后，`timer.s1` 被更新了 3 次，而 `timer.s2` 一次都没更新

箭头函数实际上可以让 `this` 指向固定化，绑定 `this` 使得它不再可变，这种特性很有利于封装回调函数。下面是一个例子，DOM 事件的回调函数封装在一个对象里面：

```js
var handler = {
    id: '123456',

    init: function () {
        document.addEventListener('click', event => this.doSomething(event.type), false);
    },

    doSomething: function (type) {
        console.log('Handling ' + type + ' for ' + this.id);
    }
};
```

上面代码的 `init()` 方法中，使用了箭头函数，这导致这个箭头函数里面的 `this`，总是指向 `handler` 对象。如果回调函数是普通函数，那么运行 `this.doSomething()` 这一行会报错，因为此时 `this` 指向 `document` 对象

总之，箭头函数根本没有自己的 `this`，导致内部的 `this` 就是外层代码块的 `this`。正是因为它没有 `this`，所以也就不能用作构造函数

下面是 Babel 转箭头函数产生的 ES5 代码，就能清楚地说明 `this` 的指向：

```js
// ES6
function foo() {
    setTimeout(() => {
        console.log('id:', this.id);
    }, 100);
}

// ES5
function foo() {
    var _this = this;

    setTimeout(function () {
        console.log('id:', _this.id);
    }, 100);
}
```

上面代码中，转换后的 ES5 版本清楚地说明了，箭头函数里面根本没有自己的 `this`，而是引用外层的 `this`

请问下面的代码之中，`this` 的指向有几个：

```js
function foo() {
    return () => {
        return () => {
            return () => {
                console.log('id:', this.id);
            };
        };
    };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
```

答案是 `this` 的指向只有一个，就是函数 `foo` 的 `this`，这是因为所有的内层函数都是箭头函数，都没有自己的 `this`，它们的 `this` 其实都是最外层 `foo` 函数的 `this`。所以不管怎么嵌套，t1、t2、t3 都输出同样的结果。如果这个例子的所有内层函数都写成普通函数，那么每个函数的 `this` 都指向运行时所在的不同对象

除了 `this`，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：`arguments`、`super`、`new.target`

```js
function foo() {
    setTimeout(() => {
        console.log('args:', arguments);
    }, 100);
}

foo(2, 4, 6, 8) // args: [2, 4, 6, 8]
```

上面代码中，箭头函数内部的变量 `arguments`，其实是函数 `foo` 的 `arguments` 变量

另外，由于箭头函数没有自己的 `this`，所以当然也就不能用 `call()`、`apply()`、`bind()` 这些方法去改变 `this` 的指向

```js
(function () {
    return [
        (() => this.x).bind({x: 'inner'})()
    ];
}).call({x: 'outer'}); // ['outer']
```

上面代码中，箭头函数没有自己的 `this`，所以 `bind` 方法无效，内部的 `this` 指向外部的 `this`

长期以来，JavaScript 语言的 `this` 对象一直是一个令人头痛的问题，在对象方法中使用 `this`，必须非常小心。箭头函数”绑定”`this`，很大程度上解决了这个困扰

::: details bind()

```js
var person = {
    username: 'X',
    sayHello() {
        setTimeout(function () {
            console.log(this.username);
        }, 2000);
    }
}

person.sayHello();
```

上述示例中，`person` 对象的 `sayHello` 方法内部使用了 `setTimeout` 函数，并且在 `setTimeout` 的回调函数内使用了一个普通函数。在这种情况下，这个普通函数内部的 `this` 不再指向 `person` 对象，而是指向全局对象（在浏览器环境中通常是 window）。因此，`console.log(this.username)` 中的 `this.username` 将输出 undefined，因为全局对象中没有 `username` 属性

```js
var person = {
    username: 'X',
    sayHello() {
        function method() {
            console.log(this.username); // 定义的时候还没有指向
        }

        let obj = {username: 'XX'};

        window.setTimeout(method.bind(this), 2000);
        window.setTimeout(method.bind(obj), 2000);
    }
}

person.sayHello();
```

上述示例中，`person` 对象的 `sayHello` 方法内部也使用了 `setTimeout`，但它定义了一个名为 `method` 的函数，并在 `setTimeout` 中使用 `bind` 方法将 `this` 绑定到 `person` 对象。这确保了在 `method` 函数内部的 `this` 仍然指向 `person` 对象，因此 `console.log(this.username)` 将输出 'X'，因为它引用了 `person` 对象的 `username` 属性

```js
// 简化写法
var person = {
    username: 'X',
    sayHello() {
        setTimeout((function () {
            console.log(this.username);
        }).bind(this), 2000);
    }
}

person.sayHello();
```

:::

### 不适用场合

由于箭头函数使得 `this` 从“动态”变成“静态”，下面两个场合不应该使用箭头函数

第一个场合是定义对象的方法，且该方法内部包括 `this`

```js
const cat = {
    lives: 9,
    jumps: () => {
        this.lives--;
    }
}
```

上面代码中，`cat.jumps()` 方法是一个箭头函数，这是错误的。调用 `cat.jumps()` 时，如果是普通函数，该方法内部的 `this` 指向 `cat`；如果写成上面那样的箭头函数，使得 `this` 指向全局对象，因此不会得到预期结果。这是因为对象不构成单独的作用域，导致 `jumps` 箭头函数定义时的作用域就是全局作用域

再看一个例子：

```js
globalThis.s = 21;

const obj = {
    s: 42,
    m: () => console.log(this.s)
};

obj.m() // 21
```

上面例子中，`obj.m()` 使用箭头函数定义。JavaScript 引擎的处理方法是，先在全局空间生成这个箭头函数，然后赋值给 `obj.m`，这导致箭头函数内部的 `this` 指向全局对象，所以 `obj.m()` 输出的是全局空间的 21，而不是对象内部的 42。上面的代码实际上等同于下面的代码：

```js
globalThis.s = 21;
globalThis.m = () => console.log(this.s);

const obj = {
    s: 42,
    m: globalThis.m
};

obj.m() // 21
```

由于上面这个原因，对象的属性建议使用传统的写法定义，不要用箭头函数定义

第二个场合是需要动态 `this` 的时候，也不应使用箭头函数

```js
var button = document.getElementById('press');
button.addEventListener('click', () => {
    this.classList.toggle('on');
});
```

上面代码运行时，点击按钮会报错，因为 `button` 的监听函数是一个箭头函数，导致里面的 `this` 就是全局对象。如果改成普通函数，`this` 就会动态指向被点击的按钮对象

另外，如果函数体很复杂，有许多行，或者函数内部有大量的读写操作，不单纯是为了计算值，这时也不应该使用箭头函数，而是要使用普通函数，这样可以提高代码可读性

### 嵌套的箭头函数

箭头函数内部，还可以再使用箭头函数。下面是一个 ES5 语法的多重嵌套函数：

```js
function insert(value) {
    return {
        into: function (array) {
            return {
                after: function (afterValue) {
                    array.splice(array.indexOf(afterValue) + 1, 0, value);
                    return array;
                }
            };
        }
    };
}

insert(2).into([1, 3]).after(1); // [1, 2, 3]
```

上面这个函数，可以使用箭头函数改写：

```js
let insert = (value) => ({
    into: (array) => ({
        after: (afterValue) => {
            array.splice(array.indexOf(afterValue) + 1, 0, value);
            return array;
        }
    })
});

insert(2).into([1, 3]).after(1); // [1, 2, 3]
```

下面是一个部署管道机制（pipeline）的例子，即前一个函数的输出是后一个函数的输入：

```js
const pipeline = (...funcs) => val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5) // 12
```

如果觉得上面的写法可读性比较差，也可以采用下面的写法：

```js
const plus1 = a => a + 1;
const mult2 = a => a * 2;

mult2(plus1(5)) // 12
```

箭头函数还有一个功能，就是可以很方便地改写 λ 演算：

```text
// λ演算的写法
fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// ES6的写法
var fix = f => (x => f(v => x(x)(v)))
               (x => f(v => x(x)(v)));
```

上面两种写法，几乎是一一对应的。由于 λ 演算对于计算机科学非常重要，这使得我们可以用 ES6 作为替代工具，探索计算机科学

## 尾调用优化

### 什么是尾调用

尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数

```js
function f(x) {
    return g(x);
}
```

上面代码中，函数 `f` 的最后一步是调用函数 `g`，这就叫尾调用

以下三种情况，都不属于尾调用：

```js
// 情况一
function f(x) {
    let y = g(x);
    return y;
}

// 情况二
function f(x) {
    return g(x) + 1;
}

// 情况三
function f(x) {
    g(x);
}
```

上面代码中，情况一是调用函数 `g` 之后，还有赋值操作，所以不属于尾调用，即使语义完全一样。情况二也属于调用后还有操作，即使写在一行内。情况三等同于下面的代码：

```js
function f(x) {
    g(x);
    return undefined;
}
```

尾调用不一定出现在函数尾部，只要是最后一步操作即可

```js
function f(x) {
    if (x > 0) {
        return m(x)
    }
    return n(x);
}
```

上面代码中，函数 `m` 和 `n` 都属于尾调用，因为它们都是函数 `f` 的最后一步操作

### 尾调用优化

尾调用之所以与其他调用不同，就在于它的特殊的调用位置。我们知道，函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数 `A` 的内部调用函数 `B`，那么在 `A` 的调用帧上方，还会形成一个 `B` 的调用帧。等到 `B` 运行结束，将结果返回到 `A`，`B` 的调用帧才会消失。如果函数 `B` 内部还调用函数 `C`，那就还有一个 `C` 的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了

```js
function f() {
    let m = 1;
    let n = 2;
    return g(m + n);
}
f();

// 等同于
function f() {
    return g(3);
}
f();

// 等同于
g(3);
```

上面代码中，如果函数 `g` 不是尾调用，函数 `f` 就需要保存内部变量 `m` 和 `n` 的值、`g` 的调用位置等信息。但由于调用 `g` 之后，函数 `f` 就结束了，所以执行到最后一步，完全可以删除 `f(x)` 的调用帧，只保留 `g(3)` 的调用帧

这就叫做“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”

```js
function addOne(a) {
    var one = 1;

    function inner(b) {
        return b + one;
    }

    return inner(a);
}
```

上面的函数不会进行尾调用优化，因为内层函数 `inner` 用到了外层函数 `addOne` 的内部变量 `one`

### 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为尾递归

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误

```js
function factorial(n) {
    if (n === 1) return 1;
    return n * factorial(n - 1);
}

factorial(5) // 120
```

上面代码是一个阶乘函数，计算 n 的阶乘，最多需要保存 n 个调用记录，复杂度 O(n)

如果改写成尾递归，只保留一个调用记录，复杂度 O(1)：

```js
function factorial(n, total) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```

还有一个比较著名的例子，就是计算 Fibonacci 数列，也能充分说明尾递归优化的重要性。非尾递归的 Fibonacci 数列实现如下：

```js
function Fibonacci(n) {
    if (n <= 1) {
        return 1
    };
    return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 超时
Fibonacci(500) // 超时
```

尾递归优化过的 Fibonacci 数列实现如下：

```js
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
    if (n <= 1) {
        return ac2
    };
    return Fibonacci2(n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 亦是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出（或者层层递归造成的超时），相对节省内存

### 递归函数的改写

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。比如上面的例子，阶乘函数 `factorial` 需要用到一个中间变量 `total`，那就把这个中间变量改写成函数的参数。这样做的缺点就是不太直观，第一眼很难看出来，为什么计算 5 的阶乘，需要传入两个参数 5 和 1？

两个方法可以解决这个问题。方法一是在尾递归函数之外，再提供一个正常形式的函数：

```js
function tailFactorial(n, total) {
    if (n === 1) return total;
    return tailFactorial(n - 1, n * total);
}

function factorial(n) {
    return tailFactorial(n, 1);
}

factorial(5) // 120
```

上面代码通过一个正常形式的阶乘函数 `factorial`，调用尾递归函数 `tailFactorial`，看起来就正常多了

函数式编程有一个概念，叫做柯里化（currying），意思是将多参数的函数转换成单参数的形式。这里也可以使用柯里化：

```js
function currying(fn, n) {
    return function (m) {
        return fn.call(this, m, n);
    };
}

function tailFactorial(n, total) {
    if (n === 1) return total;
    return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5) // 120
```

上面代码通过柯里化，将尾递归函数 `tailFactorial` 变为只接受一个参数的 `factorial`

第二种方法就简单多了，就是采用 ES6 的函数默认值：

```js
function factorial(n, total = 1) {
    if (n === 1) return total;
    return factorial(n - 1, n * total);
}

factorial(5) // 120
```

上面代码中，参数 `total` 有默认值 1，所以调用时不用提供这个值

总结一下，递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归

### 严格模式

S6 的尾调用优化只在严格模式下开启，正常模式是无效的

这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈

- func.arguments：返回调用时函数的参数

- func.caller：返回调用当前函数的那个函数

尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效

```text
function restricted() {
    'use strict';
    restricted.caller;    // 报错
    restricted.arguments; // 报错
}

restricted();
```

### 尾递归优化的实现

尾递归优化只在严格模式下生效，那么正常模式下，或者那些不支持该功能的环境中，有没有办法也使用尾递归优化呢？回答是可以的，就是自己实现尾递归优化

它的原理非常简单。尾递归之所以需要优化，原因是调用栈太多，造成溢出，那么只要减少调用栈，就不会溢出。怎么做可以减少调用栈呢？就是采用“循环”换掉“递归”

下面是一个正常的递归函数：

```js
function sum(x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
}

sum(1, 100000) // Uncaught RangeError: Maximum call stack size exceeded(…)
```

上面代码中，`sum` 是一个递归函数，参数 `x` 是需要累加的值，参数 `y` 控制递归次数。一旦指定 `sum` 递归 100000 次，就会报错，提示超出调用栈的最大次数

蹦床函数（trampoline）可以将递归执行转为循环执行：

```js
function trampoline(f) {
    while (f && f instanceof Function) {
        f = f();
    }
    return f;
}
```

上面就是蹦床函数的一个实现，它接受一个函数 `f` 作为参数。只要 `f` 执行后返回一个函数，就继续执行。注意，这里是返回一个函数，然后执行该函数，而不是函数里面调用函数，这样就避免了递归执行，从而就消除了调用栈过大的问题。然后，要做的就是将原来的递归函数，改写为每一步返回另一个函数

```js
function sum(x, y) {
    if (y > 0) {
        return sum.bind(null, x + 1, y - 1);
    } else {
        return x;
    }
}
```

上面代码中，`sum` 函数的每次执行，都会返回自身的另一个版本。现在，使用蹦床函数执行 `sum`，就不会发生调用栈溢出

```js
trampoline(sum(1, 100000)) // 100001
```

蹦床函数并不是真正的尾递归优化，下面的实现才是：

```js
function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}

var sum = tco(function (x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1)
    } else {
        return x
    }
});

sum(1, 100000) // 100001
```

上面代码中，`tco` 函数是尾递归优化的实现，它的奥妙就在于状态变量 `active`。默认情况下，这个变量是不激活的。一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归 `sum` 返回的都是 undefined，所以就避免了递归执行；而 `accumulated` 数组存放每一轮 `sum` 执行的参数，总是有值的，这就保证了 `accumulator` 函数内部的 `while` 循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层

## 函数参数的尾逗号

待更新

## Function.prototype.toString()

待更新

## catch 命令的参数省略

待更新