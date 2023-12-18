---
category: IT
article: false
---

# 定义 Store

在深入研究核心概念之前，我们得知道 Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个**独一无二**的名字：

```js
import {defineStore} from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
    // 其他配置...
})
```

这个**名字** ，也被用作 id ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 use... 是一个符合组合式函数风格的约定

`defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象

## Option Store

与 Vue 的选项式 API 类似，我们也可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象

```js
export const useCounterStore = defineStore('counter', {
    state: () => ({count: 0}),
    getters: {
        double: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
```

你可以认为 `state` 是 store 的数据 (`data`)，`getters` 是 store 的计算属性 (`computed`)，而 `actions` 则是方法 (`methods`)

为方便上手使用，Option Store 应尽可能直观简单

### 示例

例如当请求用户登录接口时，我们需要把后端响应的数据存到 Store 全局状态里：

```json
{
  "code": 0,
  "data": {
    "id": "1734428376694743042",
    "username": "zhangsan",
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzM0NDI4Mzc2Njk0NzQzMDQyIiwiaWF0IjoxNzAyMzU3Mzg2LCJleHAiOjE3MDIzNjA5ODZ9.u0TP4p2Of3yWrS4S1kyz5Q6QwIZuC4EG4fITl-fYDJA"
  },
  "message": "响应成功"
}
```

::: tabs

@tab src/store/userStore.ts

```ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStoreId', {
    state: () => ({
        userId: "",
        userName: "",
        token: ""
    }),
    getters: {
        getUserId(): string {
            return this.userId;
        },
        getUserName(): string {
            return this.userName;
        },
        getToken(): string {
            return this.token;
        }
    },
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
        },
        setUserName(userName: string) {
            this.userName = userName;
        },
        setToken(token: string) {
            this.token = token;
        }
    },
})
```

@tab src/components/login/loginForm.vue

```vue {46-48}
<template>
  <ElForm class="login-form" ref="loginRef" :model="loginParam" :rules="loginRules">
    <h1 class="login-title">登录</h1>
    <ElFormItem prop="username">
      <ElInput placeholder="请输入账号" :prefix-icon="User" size="large" v-model="loginParam.username"></ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput placeholder="请输入密码" show-password :prefix-icon="Lock" size="large" v-model="loginParam.password"></ElInput>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" class="login-btn" size="large" @click="submit(loginRef)">登录</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
  import { User, Lock } from '@element-plus/icons-vue';
  import { LoginReq } from '@/interface/user'
  import { reactive, ref } from 'vue';
  import { ElMessage, FormInstance, FormRules } from 'element-plus';
  import { userLoginApi } from '@/api/userApi';
  import router from '@/router';
  import { useUserStore } from '@/store/userStore'

  const userStore = useUserStore();

  const loginRef = ref<FormInstance>();
  const loginParam: LoginReq = reactive({
    username: "",
    password: ""
  });
  const loginRules: FormRules = reactive({
    username: [{ required: true, message: "账号不能为空", trigger: 'blur' }],
    password: [{ required: true, message: "密码不能为空", trigger: 'blur' }]
  });

  const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return false;
    }
    formEl.validate(async (validate: boolean) => {
      if (validate) {
        await userLoginApi(loginParam).then(res => {
          ElMessage.success("登录成功");
          // 把用户数据存储进 Store 中
          userStore.setUserId(res.data.id);
          userStore.setUserName(res.data.username);
          userStore.setToken(res.data.token);
          router.push('/home');
        }).catch(error => { })
      } else {
        return false;
      }
    })
  }

</script>

<style scoped>
  .login-form {
    grid-column: 1;
    grid-row: 1;
    opacity: 1;
    transition: 1s ease-in-out;
    transition-delay: 0.5s;
    /* 上下 | 左右 */
    padding: 1% 25%;
    z-index: 1;
  }

  .login-form.sign-up-model {
    opacity: 0;
    transition: 1s ease-in-out;
    z-index: 0;
  }

  .login-title {
    text-align: center;
    color: #444;
  }

  .login-btn {
    width: 100%;
    font-size: 18px;
  }
</style>
```

@tab src/views/home/index.vue

```vue
<template>
    <h1>欢迎{{ userStore.getUserName }}来到首页</h1>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();
</script>
```

:::

当我们登录成功跳转到 home.vue 界面后虽然可以通过 `userStore.getUserName` 读取到用户名称。但如果我们刷新页面数据则会读取不到，这是因为我们没有对数据做持久化操作

### 手动实现持久化

::: tabs

@tab src/utils/constants.ts

```ts
export default {
    userIdKey: "MW_USER_ID",
    userNameKey: "MW_USERNAME_",
    tokenKey: "MW_TOKEN_"
}
```

@tab src/utils/cache.ts

```ts
import constants from "./constants"

class Cache {
    setUserId(userId: string) {
        if (!userId) {
            window.localStorage.removeItem(constants.userIdKey);
            return;
        }
        window.localStorage.setItem(constants.userIdKey, JSON.stringify(userId));
    }
    setUserName(userName: string) {
        if (!userName) {
            window.localStorage.removeItem(constants.userNameKey);
            return
        }
        window.localStorage.setItem(constants.userNameKey, JSON.stringify(userName));
    }
    setToken(token: string) {
        if (!token) {
            window.localStorage.removeItem(constants.tokenKey);
            return
        }
        window.localStorage.setItem(constants.tokenKey, JSON.stringify(token));
    }

    getUserId(): string {
        let result: any = window.localStorage.getItem(constants.userIdKey);
        return JSON.parse(result);
    }
    getUserName(): string {
        let result: any = window.localStorage.getItem(constants.userNameKey);
        return JSON.parse(result);
    }
    getToken(): string {
        let result: any = window.localStorage.getItem(constants.tokenKey);
        return JSON.parse(result);
    }
}

export default new Cache()
```

@tab src/store/userStore.ts

```ts
import cache from '@/utils/cache';
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStoreId', {
    state: () => ({
        userId: "",
        userName: "",
        token: ""
    }),
    getters: {
        getUserId(): string {
            if (this.token) {
                return this.userId;
            }
            return cache.getUserId();
        },
        getUserName(): string {
            if (this.userName) {
                return this.userName;
            }
            return cache.getUserName();
        },
        getToken(): string {
            if (this.token) {
                return this.token;
            }
            return cache.getToken();
        }
    },
    actions: {
        setUserId(userId: string) {
            this.userId = userId;
            cache.setUserId(userId);
        },
        setUserName(userName: string) {
            this.userName = userName;
            cache.setUserName(userName);
        },
        setToken(token: string) {
            this.token = token;
            cache.setToken(token);
        }
    },
})
```

:::

### 使用持久化插件

我们可以使用 [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/) 持久化插件来帮助我们对仓库数据进行持久化。我们只需要加上一下配置即可开启 Pinia 持久化

用你喜欢的包管理器安装依赖：

::: tabs

@tab pnpm

```shell
pnpm i pinia-plugin-persistedstate
```

@tab npm

```shell
npm i pinia-plugin-persistedstate
```

@tab yarn

```shell
yarn add pinia-plugin-persistedstate
```

:::

将插件添加到 Pinia 实例上

```ts
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

创建 Store 时，将 persist 选项设置为 true。

::: tabs

@tab 选项式语法

```ts
import {defineStore} from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            someState: '你好 pinia',
        }
    },
    persist: true,
})
```

@tab 组合式语法

```ts
import {defineStore} from 'pinia'

export const useStore = defineStore(
    'main',
    () => {
        const someState = ref('你好 pinia')
        return {someState}
    },
    {
        persist: true,
    },
)
```

:::

现在，你的整个 Store 将使用[默认持久化配置](#待更新)保存

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useUserStore = defineStore('userStoreId', () => {
    const userId = ref<string>("");
    const userName = ref<string>("");
    const token = ref<string>("");

    const setUserId = (value: string) => {
        userId.value = value
    }
    const setUserName = (value: string) => {
        userName.value = value
    }
    const setToken = (value: string) => {
        token.value = value
    }

    return {
        userId,
        userName,
        token,
        setUserId,
        setUserName,
        setToken
    }
}, { persist: true })
```

## Setup Store

也存在另一种定义 store 的可用语法。与 Vue 组合式 API 的 [setup 函数](https://cn.vuejs.org/api/composition-api-setup.html) 相似，我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象

```js
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)

    function increment() {
        count.value++
    }

    return {count, increment}
})
```

在 Setup Store 中：

- `ref()` 就是 `state` 属性

- `computed()` 就是 `getters`

- `function()` 就是 `actions`

Setup store 比 Option Store 带来了更多的灵活性，因为你可以在一个 store 内创建侦听器，并自由地使用任何[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html#composables)。不过，请记住，使用组合式函数会让 [SSR](#待更新) 变得更加复杂

## 你应该选用哪种语法？

和[在 Vue 中如何选择组合式 API 与选项式 API](https://cn.vuejs.org/guide/introduction.html#which-to-choose) 一样，选择你觉得最舒服的那一个就好。如果你还不确定，可以先试试 Option Store

## 使用 Store

虽然我们前面定义了一个 store，但在我们使用 `<script setup>` 调用 `useStore()`(或者使用 `setup()` 函数，**像所有的组件那样**) 之前，store 实例是不会被创建的：

```vue
<script setup>
  import {useCounterStore} from '@/stores/counter'
  // 可以在组件中的任意位置访问 `store` 变量 ✨
  const store = useCounterStore()
</script>
```

你可以定义任意多的 store，但为了让使用 pinia 的益处最大化(比如允许构建工具自动进行代码分割以及 TypeScript 推断)，**你应该在不同的文件中去定义 store**

一旦 store 被实例化，你可以直接访问在 store 的 `state`、`getters` 和 `actions` 中定义的任何属性。我们将在后续章节继续了解这些细节，目前自动补全将帮助你使用相关属性

请注意，`store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`，就像 `setup` 中的 `props` 一样，**如果你写了，我们也不能解构它**：

```vue
<script setup>
  const store = useCounterStore()
  // ❌ 这将不起作用，因为它破坏了响应性
  // 这就和直接解构 `props` 一样
  const {name, doubleCount} = store
  name // 将始终是 "Eduardo"
  doubleCount // 将始终是 0
  setTimeout(() => {
    store.increment()
  }, 1000)
  // ✅ 这样写是响应式的
  // 💡 当然你也可以直接使用 `store.doubleCount`
  const doubleValue = computed(() => store.doubleCount)
</script>
```

为了从 store 中提取属性时保持其响应性，你需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```vue
<script setup>
  import {storeToRefs} from 'pinia'

  const store = useCounterStore()
  // `name` 和 `doubleCount` 是响应式的 ref
  // 同时通过插件添加的属性也会被提取为 ref
  // 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
  const {name, doubleCount} = storeToRefs(store)
  // 作为 action 的 increment 可以直接解构
  const {increment} = store
</script>
```