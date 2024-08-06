---
category: IT
tag: ES
order: 21
article: false
---

# Class 的基本语法

## 类的由来

JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Point.prototype.sayHello = function () {
    console.log(this.name)
};

var person = new Person();
person.name = "X";
person.age = "20";
person.sayHello(); // 打印X
```

上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的开发者感到困惑

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过 `class` 关键字，可以定义类。基本上，ES6 的 `class` 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 `class` 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用 ES6 的 `class` 改写，就是下面这样：

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(this.name)
    }
}
```

上面代码定义了一个“类”，可以看到里面有一个 `constructor()` 方法，这就是构造方法，而 `this` 关键字则代表实例对象。这种新的 Class 写法，本质上与本章开头的 ES5 的构造函数 `Person` 是一致的

`Person` 类除了构造方法，还定义了一个 `toString()` 方法。注意，定义 `toString()` 方法的时候，前面不需要加上 `function` 这个关键字，直接把函数定义放进去了就可以了。另外，方法与方法之间不需要逗号分隔，加了会报错

ES6 的类，完全可以看作构造函数的另一种写法

```js
class Person {
    // ...
}

typeof Person // "function"
Person === Person.prototype.constructor // true
```

上面代码表明，类的数据类型就是函数，类本身就指向构造函数

使用的时候，也是直接对类使用 `new` 命令，跟构造函数的用法完全一致

```js
class Bar {
    doStuff() {
        console.log('stuff');
    }
}

const b = new Bar();
b.doStuff() // "stuff"
```

构造函数的 `prototype` 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 `prototype` 属性上面

```js
class Person {
    constructor() {
        // ...
    }

    toString() {
        // ...
    }

    toValue() {
        // ...
    }
}

// 等同于
Person.prototype = {
    constructor() {
    },
    toString() {
    },
    toValue() {
    },
};
```

上面代码中，`constructor()`、`toString()`、`toValue()` 这三个方法，其实都是定义在 `Person.prototype` 上面。因此，在类的实例上面调用方法，其实就是调用原型上的方法

```js
class B {
}

const b = new B();

b.constructor === B.prototype.constructor // true
```

上面代码中，`b` 是 `B` 类的实例，它的 `constructor()` 方法就是 `B` 类原型的 `constructor()` 方法。由于类的方法都定义在 `prototype` 对象上面，所以类的新方法可以添加在 `prototype` 对象上面。`Object.assign()` 方法可以很方便地一次向类添加多个方法：

```js
class Person {
    constructor() {
        // ...
    }
}

Object.assign(Person.prototype, {
    toString() {
    },
    toValue() {
    }
});
```

`prototype` 对象的 `constructor` 属性，直接指向“类”的本身，这与 ES5 的行为是一致的：

```js
Person.prototype.constructor === Person // true
```

另外，类的内部所有定义的方法，都是不可枚举的（non-enumerable）

```js
class Person {
    constructor(x, y) {
        // ...
    }

    toString() {
        // ...
    }
}

Object.keys(Person.prototype) // []
Object.getOwnPropertyNames(Person.prototype) // ["constructor","toString"]
```

上面代码中，`toString()` 方法是 Person 类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致

```js
var Person = function (x, y) {
    // ...
};

Person.prototype.toString = function () {
    // ...
};

Object.keys(Person.prototype) // ["toString"]
Object.getOwnPropertyNames(Person.prototype) // ["constructor","toString"]
```

上面代码采用 ES5 的写法，`toString()` 方法就是可枚举的

::: details Object.keys()

`Object.keys()` 是 JavaScript 中的一个内置函数，它用于获取一个对象的所有可枚举属性的名称，并将这些属性名以数组的形式返回

```js
const person = {
    name: "John",
    age: 30,
    profession: "Engineer"
};

const keys = Object.keys(person);

console.log(keys); // 输出: ["name", "age", "profession"]
```

在这个示例中，`Object.keys(person)` 返回了包含 `person` 对象所有可枚举属性名称的数组。这允许你以编程方式访问对象的属性名，然后可以进一步使用这些属性名来访问或操作对象的属性值

:::

## constructor() 方法

待更新

## 类的实例

待更新

## 实例属性的新写法

待更新

## 取值函数（getter）和存值函数（setter）

待更新

## 属性表达式

待更新

## Class 表达式

待更新

## 静态方法

待更新

## 静态属性

待更新

## 私有方法和私有属性

待更新

## 静态块

待更新

## 类的注意点

待更新

## new.target 属性

待更新