---
category: IT
tag: ES
order: 20
article: false
---

# async 函数

## 关于异步问题

串行：卷子批完了，班长来上来拿了发下去

并行：这是这次要做的新卷子,来第一排的我每人给你们一叠都往后传一下

Java 程序默认的执行规则是从上至下运行，也就是一种串行执行，除非使用多线程去执行那么就是并行执行

```java
public class Test {
    public static void loadCollect1() {
        System.out.println("111");
    }

    public static void loadCollect2() {
        System.out.println("222");
    }

    public static void created() {
        loadCollect1();
        loadCollect2();
    }

    public static void main(String[] args) {
        created(); // 111  222
    }
}
```

默认情况下 JavaScript 也是一种串行执行：

```js
function loadCollect1() {
    console.log("11111111")
}

function loadCollect2() {
    console.log("2222222")
}

function created() {
    loadCollect1();
    loadCollect2();
}

created();
```

而 Ajax 是一种异步非阻塞的一种并行执行方式：

```js
export default {
    created() {
        console.log(111);
        this.loadCollect1();
        console.log(333);
        this.loadCollect2();
        console.log(555);
    },
    methods: {
        loadCollect1() {
            axios.get("/api/collect/load").then(res => {
                console.log(222)
            })
        },
        loadCollect2() {
            axios.get("/api/collect/load").then(res => {
                console.log(444)
            })
        }
    }
}
```

如果上述执行的顺序是 1，2，3，4，5 就说明是串行执行，但 Ajax 是异步非阻塞的，所以输出结果并不是串行的

通过上面的分析得出结论：异步请求是一种并行执行，不会阻塞代码，这样就告诉开发人员在开发中不要闹出如下的笑话：

```js
export default {
    data() {
        return {
            data: ""
        }
    },
    created() {
        this.loadCollect1();
        this.saveLog(this.data); // 这里是拿不到 data 值的
    },
    methods: {
        loadCollect1() {
            axios.get("/api/collect/load").then(res => {
                this.data = res.data;
            })
        },
        saveLog(data) {
            console.log(data);
        }
    }
}
```

那么如何解决和获取这个内容的值呢？

1. 直接在方法中的回调去获取调用

    ```js
    export default {
        created() {
            this.loadCollect1();
        },
        methods: {
            loadCollect1() {
                axios.get("/api/collect/load").then(res => {
                    this.saveLog(res.data);
                })
            },
            saveLog(data) {
                console.log(data);
            }
        }
    }
    ```
    
    但上面的代码会存在耦合度高的问题：你中有我，我中有你

2. 用函数（行为）入参，回调函数

    ```js
    export default {
        created() {
            this.loadCollect1(res => {
                this.saveLog(res)
            });
        },
        methods: {
            loadCollect1(callbackFn) {
                axios.get("/api/collect/load").then(res => {
                    callbackFn && callbackFn(res.data);
                })
            },
            saveLog(data) {
                console.log(data);
            }
        }
    }
    ```
    
    行为入参可以解决函数的隔离和行为执行延续的问题，这样可以解耦合度和代码污染问题，但这里就会有一个地狱回调的问题

3. `async` + `await`

    ```js
    export default {
        async created() {
            var res = await this.loadCollect1();
            this.saveLog(res.data);
        },
        methods: {
            loadCollect1(callbackFn) {
                return axios.get("/api/collect/load");
            },
            saveLog(data) {
                console.log(data);
            }
        }
    }
    ```

## 含义

ES2017 标准引入了 `async` 函数，使得异步操作变得更加方便。`async` 函数是什么？一句话，它就是 `Generator` 函数的语法糖

前文有一个 `Generator` 函数，依次读取两个文件：

```js
const fs = require('fs');

const readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    });
};

const gen = function* () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
```

上面代码的函数 `gen` 可以写成 `async` 函数，就是下面这样：

```js
const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
```

一比较就会发现，`async` 函数就是将 `Generator` 函数的星号（`*`）替换成 `async`，将 `yield` 替换成 `await`，仅此而已

`async` 函数对 `Generator` 函数的改进，体现在以下四点：

1. 内置执行器

    `Generator` 函数的执行必须靠执行器，所以才有了 `co` 模块，而 `async` 函数自带执行器。也就是说，`async` 函数的执行，与普通函数一模一样，只要一行

    ```js
    asyncReadFile();
    ```

    上面的代码调用了 `asyncReadFile` 函数，然后它就会自动执行，输出最后结果。这完全不像 `Generator` 函数，需要调用 `next` 方法，或者用 `co` 模块，才能真正执行，得到最后结果

2. 更好的语义

   `async` 和 `await`，比起星号和 `yield`，语义更清楚了。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果

3. 更广的适用性

   `co` 模块约定，`yield` 命令后面只能是 `Thunk` 函数或 `Promise` 对象，而 `async` 函数的 `await` 命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）

4. 返回值是 Promise

   `async` 函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用 `then` 方法指定下一步的操作

进一步说，`async` 函数完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖

## 基本用法

`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句

```js
async function f() {
    return 'hello world';
}
//等价于
function f() {
    return Promise.resolve('hello world');
}

f().then(res => {
    console.log(res); // hello world
});
```

下面是一个例子：

```js
async function getStockPriceByName(name) {
    const symbol = await getStockSymbol(name);
    const stockPrice = await getStockPrice(symbol);
    return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
    console.log(result);
});
```

上面代码是一个获取股票报价的函数，函数前面的 `async` 关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个 `Promise` 对象。下面是另一个例子，指定多少毫秒后输出一个值：

```js
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);
```

上面代码指定 50 毫秒以后，输出 hello world

由于 `async` 函数返回的是 `Promise` 对象，可以作为 `await` 命令的参数。所以，上面的例子也可以写成下面的形式：

```js
async function timeout(ms) {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);
```

`async` 函数有多种使用形式：

```js
// 函数声明
async function foo() {
}

// 函数表达式
const foo = async function () {
};

// 对象的方法
let obj = {
    async foo() {
    }
};
obj.foo().then();

// Class 的方法
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }

    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}

const storage = new Storage();
storage.getAvatar('jake').then();

// 箭头函数
const foo = async () => {
};
```

## 语法

`async` 函数的语法规则总体上比较简单，难点是错误处理机制

### 返回 Promise 对象

`async` 函数返回一个 `Promise` 对象。`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数：

```js
async function f() {
    return 'hello world';
}

f().then(v => console.log(v)) // hello world
```

上面代码中，函数 `f` 内部 `return` 命令返回的值，会被 `then` 方法回调函数接收到

`async` 函数内部抛出错误，会导致返回的 `Promise` 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到：

```js
async function f() {
    throw new Error('出错了');
}

f().then(
    v => console.log('resolve', v),
    e => console.log('reject', e)
)
// reject Error: 出错了
```

### Promise 对象的状态变化

`async` 函数返回的 `Promise` 对象，必须等到内部所有 `await` 命令后面的 `Promise` 对象执行完，才会发生状态改变，除非遇到 `return` 语句或者抛出错误。也就是说，只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。下面是一个例子：

```js
async function getTitle(url) {
    let response = await fetch(url);
    let html = await response.text();
    return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}

getTitle('https://tc39.github.io/ecma262/').then(console.log) // "ECMAScript 2017 Language Specification"
```

上面代码中，函数 `getTitle` 内部有三个操作：抓取网页、取出文本、匹配页面标题。只有这三个操作全部完成，才会执行 `then` 方法里面的 `console.log`

### await 命令

`await` 是 JavaScript 中用于等待异步操作完成的关键字，通常用于 `async` 函数内部。它的作用是让代码等待一个异步操作（通常是一个 `Promise` 对象）完成，然后继续执行后续的代码。正常情况下，`await` 命令后面是一个 `Promise` 对象，返回该对象的结果。如果不是 `Promise` 对象，就直接返回对应的值

```js
async function run1() {
    return 'hello';
}
//等价于
let run1 = async () => {
    return 'hello';
}
//等价于
function run1() {
    return Promise.resolve('hello');
}

function run2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('world'), 2000);
    })
}

async function run3() {
    let res1 = await run1();
    let res2 = await run2();
    return res1 + res2;
}
//等价于
function run3() {
    return new Promise(async function (resolve, reject) {
        let res1 = await run1();
        let res2 = await run2();
        resolve(res1 + res2);
    })
}
//等价于
function run3() {
    return new Promise((resolve, reject) => {
        run1().then(res1 => {
            run2().then(res2 => {
                resolve(res1 + res2);
            })
        })
    })
}

run3().then(res => {
    console.log(res) // 2秒后输出 helloworld
}); 
```

```js
async function f() {
    // 等同于
    // return 123;
    return await 123;
}

f().then(v => console.log(v)) // 123
```

上面代码中，`await` 命令的参数是数值 123，这时等同于 `return 123`

另一种情况是，`await` 命令后面是一个 `thenable` 对象（即定义了 `then` 方法的对象），那么 `await` 会将其等同于 `Promise` 对象

```js
class Sleep {
    constructor(timeout) {
        this.timeout = timeout;
    }

    then(resolve, reject) {
        const startTime = Date.now();
        setTimeout(
            () => resolve(Date.now() - startTime),
            this.timeout
        );
    }
}

(async () => {
    const sleepTime = await new Sleep(1000);
    console.log(sleepTime);
})();
// 1000
```

上面代码中，`await` 命令后面是一个 `Sleep` 对象的实例。这个实例不是 `Promise` 对象，但是因为定义了 `then` 方法，`await` 会将其视为 `Promise` 处理

这个例子还演示了如何实现休眠效果。JavaScript 一直没有休眠的语法，但是借助 `await` 命令就可以让程序停顿指定的时间。下面给出了一个简化的 `sleep` 实现：

```js
function sleep(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval);
    })
}

// 用法
async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
        await sleep(1000);
    }
}

one2FiveInAsync();
```

上述代码示例展示了如何使用 `async` 函数和 `await` 结合 `sleep` 函数来实现一个逐秒打印数字 1 到 5 的功能：

1. `sleep(interval)` 函数是一个返回 `Promise` 的函数，它通过 `setTimeout` 在指定的时间间隔后将 `Promise` 标记为已解决（fulfilled）

2. `one2FiveInAsync` 函数是一个异步函数，它使用 `for` 循环从 1 到 5，逐个打印数字并使用 `await sleep(1000)` 来等待 1 秒钟

3. 当 `await sleep(1000)` 执行时，函数会等待 1 秒钟，然后继续执行下一次循环

4. 由于 `await` 关键字会暂停函数的执行，因此在 `await` 之后的代码会等待 `sleep` 函数的 `Promise` 解决后才会执行

`await` 命令后面的 `Promise` 对象如果变为 `reject` 状态，则 `reject` 的参数会被 `catch` 方法的回调函数接收到：

```js
async function f() {
    await Promise.reject('出错了');
}

f().then(v => console.log(v)).catch(e => console.log(e)) // 出错了
```

注意，上面代码中，`await` 语句前面没有 `return`，但是 `reject` 方法的参数依然传入了 `catch` 方法的回调函数。这里如果在 `await` 前面加上 `return`，效果是一样的

任何一个 `await` 语句后面的 `Promise` 对象变为 `reject` 状态，那么整个 `async` 函数都会中断执行

```js
async function f() {
    await Promise.reject('出错了');
    await Promise.resolve('hello world'); // 不会执行
}
```

上面代码中，第二个 `await` 语句是不会执行的，因为第一个 `await` 语句状态变成了 `reject`

有时，我们希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个 `await` 放在 `try...catch` 结构里面，这样不管这个异步操作是否成功，第二个 `await` 都会执行：

```js
async function f() {
    try {
        await Promise.reject('出错了');
    } catch (e) {
    }
    return await Promise.resolve('hello world');
}

f().then(v => console.log(v)) // hello world
```

另一种方法是 `await` 后面的 `Promise` 对象再跟一个 `catch` 方法，处理前面可能出现的错误

```js
async function f() {
    await Promise.reject('出错了').catch(e => console.log(e));
    return await Promise.resolve('hello world');
}

f().then(v => console.log(v))
// 出错了
// hello world
```

### 错误处理

如果 `await` 后面的异步操作出错，那么等同于 `async` 函数返回的 `Promise` 对象被 `reject`

```js
async function f() {
    await new Promise(function (resolve, reject) {
        throw new Error('出错了');
    });
}

f().then(v => console.log(v)).catch(e => console.log(e)) // Error：出错了
```

上面代码中，`async` 函数 `f` 执行后，`await` 后面的 `Promise` 对象会抛出一个错误对象，导致 `catch` 方法的回调函数被调用，它的参数就是抛出的错误对象。具体地执行机制，可以参考后文的 [async 函数的实现原理](#async-函数的实现原理)

防止出错的方法，也是将其放在 `try...catch` 代码块之中

```js
async function f() {
    try {
        await new Promise(function (resolve, reject) {
            throw new Error('出错了');
        });
    } catch (e) {
    }
    return await ('hello world');
}
```

如果有多个 `await` 命令，可以统一放在 `try...catch` 结构中

```js
async function main() {
    try {
        const val1 = await firstStep();
        const val2 = await secondStep(val1);
        const val3 = await thirdStep(val1, val2);

        console.log('Final: ', val3);
    } catch (err) {
        console.error(err);
    }
}
```

下面的例子使用 `try...catch` 结构，实现多次重复尝试

```js
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
    let i;
    for (i = 0; i < NUM_RETRIES; ++i) {
        try {
            await superagent.get('http://google.com/this-throws-an-error');
            break;
        } catch (err) {
        }
    }
    console.log(i); // 3
}

test();
```

上述示例代码中创建了一个异步函数 `test()`，在每次循环中，使用 `await superagent.get(...)` 发送 GET 请求。如果请求成功（没有发生错误），则跳出循环（`break`），否则，如果发生错误，代码继续再次尝试发送 GET 请求。这个过程将重复，直到成功发送请求或达到 NUM_RETRIES 的最大尝试次数

## async 函数的实现原理

待更新

## 与其他异步处理方法的比较

待更新

## 实例：按顺序完成异步操作

待更新

## 顶层 await

待更新