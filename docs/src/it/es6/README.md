---
date: 2022-07-10
category: IT
tag: ES6
shortTitle: 简介
article: false
---

# ECMAScript 6

<!-- more -->

ECMAScript 6.0（以下简称 ES6）是 JavaScript 语言的下一代标准，已经在 2015 年 6 月正式发布了。它的目标，是使得 JavaScript 语言可以用来编写复杂的大型应用程序，成为企业级开发语言

## ECMAScript 和 JavaScript 的关系

1996 年 11 月，JavaScript 的创造者 Netscape 公司，决定将 JavaScript 提交给标准化组织 ECMA，希望这种语言能够成为国际标准。次年，ECMA 发布 262 号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为 ECMAScript，这个版本就是 1.0 版

该标准从一开始就是针对 JavaScript 语言制定的，但是之所以不叫 JavaScript，有两个原因。一是商标，Java 是 Sun 公司的商标，根据授权协议，只有 Netscape 公司可以合法地使用 JavaScript 这个名字，且 JavaScript 本身也已经被 Netscape 公司注册为商标。二是想体现这门语言的制定者是 ECMA，不是 Netscape，这样有利于保证这门语言的开放性和中立性

因此，ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 JScript 和 ActionScript）

## ES6 与 ECMAScript 2015 的关系

2011 年，ECMAScript 5.1 版发布后，就开始制定 6.0 版了。因此，ES6 这个词的原意，就是指 JavaScript 语言的下一个版本

但是，因为这个版本引入的语法功能太多，而且制定过程当中，还有很多组织和个人不断提交新功能。事情很快就变得清楚了，不可能在一个版本里面包括所有将要引入的功能。常规的做法是先发布 6.0 版，过一段时间再发 6.1 版，然后是 6.2 版、6.3 版等等

但是，标准的制定者不想这样做。他们想让标准的升级成为常规流程：任何人在任何时候，都可以向标准委员会提交新语法的提案，然后标准委员会每个月开一次会，评估这些提案是否可以接受，需要哪些改进。如果经过多次会议以后，一个提案足够成熟了，就可以正式进入标准了。这就是说，标准的版本升级成为了一个不断滚动的流程，每个月都会有变动

标准委员会最终决定，标准在每年的 6 月份正式发布一次，作为当年的正式版本。接下来的时间，就在这个版本的基础上做改动，直到下一年的 6 月份，草案就自然变成了新一年的版本。这样一来，就不需要以前的版本号了，只要用年份标记就可以了

ES6 的第一个版本，就这样在 2015 年 6 月发布了，正式名称就是《ECMAScript 2015 标准》（简称 ES2015）。2016 年 6 月，小幅修订的《ECMAScript 2016 标准》（简称 ES2016）如期发布，这个版本可以看作是 ES6.1 版，因为两者的差异非常小（只新增了数组实例的 `includes` 方法和指数运算符），基本上是同一个标准。根据计划，2017 年 6 月发布 ES2017 标准

因此，ES6 既是一个历史名词，也是一个泛指，含义是 5.1 版以后的 JavaScript 的下一代标准，涵盖了 ES2015、ES2016、ES2017 等等，而 ES2015 则是正式名称，特指该年发布的正式版本的语言标准。本书中提到 ES6 的地方，一般是指 ES2015 标准，但有时也是泛指“下一代 JavaScript 语言”

## Babel 转码器

[Babel](https://babeljs.io/) 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在老版本的浏览器执行。这意味着，你可以用 ES6 的方式编写程序，又不用担心现有环境是否支持。下面是一个例子

```js
// 转码前
input.map(item => item + 1);

// 转码后
input.map(function (item) {
    return item + 1;
});
```

上面的原始代码用了箭头函数，Babel 将其转为普通函数，就能在不支持箭头函数的 JavaScript 环境执行了

下面的命令在项目目录中，安装 Babel

```shell
$ npm install --save-dev @babel/core
```

### 配置文件.babelrc

Babel 的配置文件是 `.babelrc`，存放在项目的根目录下。使用 Babel 的第一步，就是配置这个文件

该文件用来设置转码规则和插件，基本格式如下

```json
{
  "presets": [],
  "plugins": []
}
```

`presets` 字段设定转码规则，官方提供以下的规则集，你可以根据需要安装

```shell
# 最新转码规则
$ npm install --save-dev @babel/preset-env

# react 转码规则
$ npm install --save-dev @babel/preset-react
```

然后，将这些规则加入 `.babelrc`

```json
{
  "presets": [
    "@babel/env",
    "@babel/preset-react"
  ],
  "plugins": []
}
```

注意，以下所有 Babel 工具和模块的使用，都必须先写好 `.babelrc`

### 命令行转码

Babel 提供命令行工具 `@babel/cli`，用于命令行转码，它的安装命令如下：

```shell
$ npm install --save-dev @babel/cli
```

基本用法如下

```shell
# 转码结果输出到标准输出
$ npx babel example.js

# 转码结果写入一个文件
# --out-file 或 -o 参数指定输出文件
$ npx babel example.js --out-file compiled.js
# 或者
$ npx babel example.js -o compiled.js

# 整个目录转码
# --out-dir 或 -d 参数指定输出目录
$ npx babel src --out-dir lib
# 或者
$ npx babel src -d lib

# -s 参数生成source map文件
$ npx babel src -d lib -s
```

### babel-node

`@babel/node` 模块的 `babel-node` 命令，提供一个支持 ES6 的 REPL 环境。它支持 Node 的 REPL 环境的所有功能，而且可以直接运行 ES6 代码

首先，安装这个模块

```shell
$ npm install --save-dev @babel/node
```

然后，执行 `babel-node` 就进入 REPL 环境

```text
$ npx babel-node
> (x => x * 2)(1)
2
```

`babel-node` 命令可以直接运行 ES6 脚本。将上面的代码放入脚本文件 `es6.js`，然后直接运行

```text
# es6.js 的代码
# console.log((x => x * 2)(1));
$ npx babel-node es6.js
2
```

### @babel/register 模块

`@babel/register` 模块改写 `require` 命令，为它加上一个钩子。此后，每当使用 `require` 加载 `.js`、`.jsx`、`.es` 和 `.es6` 后缀名的文件，就会先用 Babel 进行转码

```shell
$ npm install --save-dev @babel/register
```

使用时，必须首先加载 `@babel/register`

```js
// index.js
require('@babel/register');
require('./es6.js');
```

然后，就不需要手动对 `index.js` 转码了

```text
$ node index.js
2
```

需要注意的是，`@babel/register` 只会对 `require` 命令加载的文件转码，而不会对当前文件转码。另外，由于它是实时转码，所以只适合在开发环境使用

### polyfill

Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 `Iterator`、`Generator`、`Set`、`Map`、`Proxy`、`Reflect`、`Symbol`、`Promise` 等全局对象，以及一些定义在全局对象上的方法（比如 `Object.assign`）都不会转码

举例来说，ES6 在 `Array` 对象上新增了 `Array.from` 方法。Babel 就不会转码这个方法。如果想让这个方法运行，可以使用 `core-js` 和 `regenerator-runtime` (后者提供generator函数的转码)，为当前环境提供一个垫片

安装命令如下

```shell
$ npm install --save-dev core-js regenerator-runtime
```

然后，在脚本头部，加入如下两行代码

```js
import 'core-js';
import 'regenerator-runtime/runtime';
// 或者
require('core-js');
require('regenerator-runtime/runtime');
```

Babel 默认不转码的 API 非常多，详细清单可以查看 `babel-plugin-transform-runtime` 模块的 `definitions.js` 文件

### 浏览器环境

Babel 也可以用于浏览器环境，使用 `@babel/standalone` 模块提供的浏览器版本，将其插入网页

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
// Your ES6 code
</script>
```

注意，网页实时将 ES6 代码转为 ES5，对性能会有影响。生产环境需要加载已经转码完成的脚本

Babel 提供一个 [REPL 在线编译器](https://babeljs.io/repl/)，可以在线将 ES6 代码转为 ES5 代码。转换后的代码，可以直接作为 ES5 代码插入网页运行

## 参考资料

[阮一峰 ECMAScript 6 入门教程](https://es6.ruanyifeng.com/)