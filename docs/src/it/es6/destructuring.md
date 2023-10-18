---
category: IT
tag: ES6
order: 2
article: false
---

# 变量的解构赋值

## 数组的解构赋值

### 基本用法

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）

以前，为变量赋值，只能直接指定值：

```js
let a = 1;
let b = 2;
let c = 3;
```

ES6 允许写成下面这样：

```js
let [a, b, c] = [1, 2, 3];
```

上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子：

```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [, , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

如果解构不成功，变量的值就等于 undefined

```js
let [foo] = [];
let [bar, foo] = [1];
```

以上两种情况都属于解构不成功，`foo` 的值都会等于 undefined

另一种情况是不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功

```js
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```

上面两个例子，都属于不完全解构，但是可以成功

如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错

```js
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

上面的语句都会报错，因为等号右边的值，要么转为对象以后不具备 Iterator 接口（前五个表达式），要么本身就不具备 Iterator 接口（最后一个表达式）

对于 Set 结构，也可以使用数组的解构赋值

```js
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值

```js
function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

上面代码中，`fibs` 是一个 Generator 函数，原生具有 Iterator 接口。解构赋值会依次从这个接口获取值。`fibs` 该函数生成斐波那契数列数列的值，前 6 个值是 `[0,1,1,2,3,5]`，因此 sixth 变量的值为 5

::: details 生成器函数

生成器函数（Generator Function）是 JavaScript 中的一种特殊类型的函数，它具有暂停和恢复执行的能力，允许你按需生成值。生成器函数通常与迭代器（Iterator）一起使用，用于创建可迭代的数据序列

生成器函数的主要特点包括：

1. 使用 `function*` 声明：生成器函数以 `function*` 关键字开始声明，例如：`function* myGenerator() { /* 生成器函数体 */ }`

2. `yield` 关键字：生成器函数内部使用 `yield` 关键字来指定生成值，同时暂停函数的执行。`yield` 语句将值返回给调用者，并在下次调用生成器时从上次暂停的地方继续执行

3. 创建迭代器：生成器函数返回一个迭代器对象，通过该迭代器对象可以逐步访问生成器函数中使用 `yield` 返回的值

4. 可无限生成值：生成器函数通常用于处理可能无限的数据流，因为它可以在需要时生成值而无需一次性生成所有值

:::

::: details fibs 函数逻辑

1. `fibs` 函数使用 `function*` 定义，表示它是一个生成器函数

2. 在函数内部，定义了两个变量 `a` 和 `b`，它们分别用来保存斐波那契数列中的前两个值

3. 使用 `while (true)` 创建一个无限循环，表示生成器会持续生成值

4. 在循环内部，使用 `yield a` 将当前的 `a` 值作为生成器的一个值返回。然后，通过 `[a, b] = [b, a + b]` 更新 `a` 和 `b` 的值，将它们更新为下一个斐波那契数列中的两个值。这个操作会使生成器在下一次迭代中生成新的值

5. 使用解构赋值语法 `let [first, second, third, fourth, fifth, sixth] = fibs()` 从生成器中提取前六个值

当初始化时，`a` 等于 （0），`b` 等于 （1）

第一次迭代：

- 使用 `yield a` 将 `a` 的值（0）返回

- 然后执行 `[a, b] = [b, a + b]` 将 `a` 更新为 `b`（1），`b` 更新为 `a + b`（1）

- 所以，第一次迭代返回 （0），`a` 等于 （1），`b` 等于 （1）

第二次迭代：

- 使用 `yield a` 将 `a` 的值（1）返回

- 再次执行 `[a, b] = [b, a + b]` 将 `a` 更新为 `b`（1），b 更新为 `a + b`（2）

- 所以，第二次迭代返回 （1），`a` 等于 （1），`b` 等于 （2）

第三次迭代：

- 使用 `yield a` 将 `a` 的值（1）返回

- 再次执行 `[a, b] = [b, a + b]` 将 `a` 更新为 `b`（2），b 更新为 `a + b`（3）

- 所以，第三次迭代返回 （1），`a` 等于 2，`b` 等于 3

以此类推，每次迭代都会返回 `a` 的当前值，然后更新 `a` 为 `b`，`b` 为 `a + b`，生成了斐波那契数列的序列：0, 1, 1, 2, 3, 5，依此类推

:::

### 默认值

解构赋值允许指定默认值

```js
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

注意，ES6 内部使用严格相等运算符（`===`），判断一个位置是否有值。所以，只有当一个数组成员严格等于 undefined，默认值才会生效

```js
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

上面代码中，如果一个数组成员是 null，默认值就不会生效，因为 null 不严格等于 undefined

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值

```js
function f() {
    console.log('aaa');
}

let [x = f()] = [1];
```

上面代码中，因为 `x` 能取到值，所以函数 `f` 根本不会执行。上面的代码其实等价于下面的代码

```js
let x;
if ([1] === undefined) {
    x = f();
} else {
    x = [1];
}
```

默认值可以引用解构赋值的其他变量，但该变量必须已经声明

```js
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

上面最后一个表达式之所以会报错，是因为 `x` 用 `y` 做默认值时，`y` 还没有声明

## 对象的解构赋值

### 基本用法

解构不仅可以用于数组，还可以用于对象

```js
let {foo, bar} = {foo: 'aaa', bar: 'bbb'};
foo // "aaa"
bar // "bbb"
```

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值

```js
let {bar, foo} = {foo: 'aaa', bar: 'bbb'};
foo // "aaa"
bar // "bbb"

let {baz} = {foo: 'aaa', bar: 'bbb'};
baz // undefined
```

上面代码的第一个例子，等号左边的两个变量的次序，与等号右边两个同名属性的次序不一致，但是对取值完全没有影响。第二个例子的变量没有对应的同名属性，导致取不到值，最后等于 undefined

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量：

```js
// 例一
let {log, sin, cos} = Math;

// 例二
const {log} = console;
log('hello') // hello
```

上面代码的例一将 `Math` 对象的对数、正弦、余弦三个方法，赋值到对应的变量上，使用起来就会方便很多。例二将 `console.log` 赋值到 `log` 变量

如果变量名与属性名不一致，必须写成下面这样：

```js
let {foo: baz} = {foo: 'aaa', bar: 'bbb'};
baz // "aaa"

let obj = {first: 'hello', last: 'world'};
let {first: f, last: l} = obj;
f // 'hello'
l // 'world'
```

这实际上说明，对象的解构赋值是下面形式的简写

```js
let {foo: foo, bar: bar} = {foo: 'aaa', bar: 'bbb'};
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者

```js
let {foo: baz} = {foo: 'aaa', bar: 'bbb'};
baz // "aaa"
foo // error: foo is not defined
```

上面代码中，`foo` 是匹配的模式，`baz` 才是变量。真正被赋值的是变量 `baz`，而不是模式 `foo`

与数组一样，解构也可以用于嵌套结构的对象：

```js
let obj = {
    p: [
        'Hello',
        {y: 'World'}
    ]
};

let {p: [x, {y}]} = obj;
x // "Hello"
y // "World"
```

注意，这时 `p` 是模式，不是变量，因此不会被赋值。如果 `p` 也要作为变量赋值，可以写成下面这样：

```js
let obj = {
    p: [
        'Hello',
        {y: 'World'}
    ]
};

let {p, p: [x, {y}]} = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

下面是另一个例子：

```js
const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};

let {loc, loc: {start}, loc: {start: {line}}} = node;
line // 1
loc  // Object {start: Object}
start // Object {line: 1, column: 5}
```

上面代码有三次解构赋值，分别是对 `loc`、`start`、`line` 三个属性的解构赋值。注意，最后一次对 `line` 属性的解构赋值之中，只有 `line` 是变量，`loc` 和 `start` 都是模式，不是变量

下面是嵌套赋值的例子：

```js
let obj = {};
let arr = [];

({foo: obj.prop, bar: arr[0]} = {foo: 123, bar: true});

obj // {prop:123}
arr // [true]
```

如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错：

```js
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

上面代码中，等号左边对象的 `foo` 属性，对应一个子对象。该子对象的 `bar` 属性，解构时会报错。原因很简单，因为 `foo` 这时等于 `undefined`，再取子属性就会报错

注意，对象的解构赋值可以取到继承的属性

```js
const obj1 = {};
const obj2 = {foo: 'bar'};
Object.setPrototypeOf(obj1, obj2);

const {foo} = obj1;
foo // "bar"
```

上面代码中，对象 `obj1` 的原型对象是 `obj2`。`foo` 属性不是 `obj1` 自身的属性，而是继承自 `obj2` 的属性，解构赋值可以取到这个属性

### 默认值

对象的解构也可以指定默认值

```js
var {x = 3} = {};
x // 3

var {x, y = 5} = {x: 1};
x // 1
y // 5

var {x: y = 3} = {};
y // 3

var {x: y = 3} = {x: 5};
y // 5

var {message: msg = 'Something went wrong'} = {};
msg // "Something went wrong"
```

默认值生效的条件是，对象的属性值严格等于 undefined

```js
var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```

上面代码中，属性 `x` 等于 null，因为 null 与 undefined 不严格相等，所以是个有效的赋值，导致默认值 3 不会生效

### 注意点

1. 如果要将一个已经声明的变量用于解构赋值，必须非常小心

    ```text
    // 错误的写法
    let x;
    {x} = {x: 1};
    // SyntaxError: syntax error
    ```
    
    上面代码的写法会报错，因为 JavaScript 引擎会将 `{x}` 理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题
    
    ```js
    // 正确的写法
    let x;
    ({x} = {x: 1});
    ```
    
    上面代码将整个解构赋值语句，放在一个圆括号里面，就可以正确执行。关于圆括号与解构赋值的关系，参见下文

2. 解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式

    ```js
    ({} = [true, false]);
    ({} = 'abc');
    ({} = []);
    ```
    
    上面的表达式虽然毫无意义，但是语法是合法的，可以执行

3. 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构

    ```js
    let arr = [1, 2, 3];
    let {0 : first, [arr.length - 1] : last} = arr;
    first // 1
    last // 3
    ```
    
    上面代码对数组进行对象解构。数组 arr 的 0 键对应的值是 1，`[arr.length - 1]` 就是 2 键，对应的值是 3。方括号这种写法，属于“属性名表达式”

## 字符串的解构赋值

待更新

## 数值和布尔值的解构赋值

待更新

## 函数参数的解构赋值

函数的参数也可以使用解构赋值

```js
function add([x, y]) {
    return x + y;
}

add([1, 2]); // 3
```

上面代码中，函数 `add` 的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量 `x` 和 `y`。对于函数内部的代码来说，它们能感受到的参数就是 `x` 和 `y`

下面是另一个例子：

```js
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]
```

函数参数的解构也可以使用默认值：

```js
function move({x = 0, y = 0} = {}) {
    return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

上述代码中，函数 `move` 的参数是一个对象，通过对这个对象进行解构，得到变量 `x` 和 `y` 的值。如果解构失败，`x` 和 `y` 等于默认值

注意，下面的写法会得到不一样的结果：

```js
function move({x, y} = {x: 0, y: 0}) {
    return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

上面代码是为函数 `move` 的参数指定默认值，而不是为变量 `x` 和 `y` 指定默认值，所以会得到与前一种写法不同的结果

undefined 就会触发函数参数的默认值：

```js
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]
```

`map` 函数遍历数组中的每个元素，对于每个元素，箭头函数 `(x = 'yes') => x` 被调用。这个箭头函数有一个参数 `x`，并给 `x` 设置了默认值为 yes。如果数组元素的值为 undefined（或者未提供），则默认值 yes 会被用作 `x` 的值，最终，`map` 函数返回一个新数组，其中包含了对每个元素应用箭头函数后的结果

## 圆括号问题

待更新

## 用途

待更新