---
theme: '@posva/slidev-theme'
title: 数据加载器 | 提升 Vue 中的数据获取
info: |
  ## 数据加载器
  提升 Vue 中的数据获取

  Copyright 2024-present Eduardo San Martin Morote
class: text-center
transition: view-transition
transition-duration: 1000ms
mdc: true
---

<div class="flex flex-col items-start h-full pt-16" >

<img class="w-32 h-32 mb-4 rounded-full" src="/posva.jpeg" alt="eduardo avatar">

<p class="text-left">

<span class="my-0 font-serif text-4xl font-bold">Eduardo San Martin Morote</span>
<br>
<span class="my-0 font-serif text-xl font-light">前端 Nerd</span>
<br>
<span><logos-pinia />, <logos-vue /> Router, <img class="inline-block -translate-y-[5px]" style="height: 1.5em;" src="/vuefire.svg"> 作者</span>

</p>

<span><carbon-logo-github /> <carbon-logo-x /> as [@posva]{.font-mono}</span>

</div>

<!--
我是 Eduardo 也叫 posva，pinia 和 Vue Router 的作者。我正在学习中文但我说得还不是很好。所以ppt是中文的但我会慢慢讲英文。
Eduardo, or posva on GitHub and Twitter. I'm the author of pinia, vue router, and other libraries. Part of the core team for a long time, 7 years, or more. I've seen a lot of different patterns for Data Fetching.
-->

---
layout: two-cols
---

## 仅客户端数据获取

````md magic-move

```vue{*|6-9}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const route = useRoute()
watch(() => route.params.id, async (id) => {
  data.value = await fetchSomeData(id) // 简单！
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

```vue{6,9,11}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const isLoading = ref(false) // 加载状态
const route = useRoute()
watch(() => route.params.id, async (id) => {
  isLoading.value = true
  data.value = await fetchSomeData(id)
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

```vue{7,11-18|5-19|8,9}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const isLoading = ref(false)
const error = ref() // 错误状态
const route = useRoute()
watch(() => route.params.id, async (id) => {
  isLoading.value = true
  try {
    data.value = await fetchSomeData(id)
    error.value = null
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
````

::right::

<v-clicks depth=2 at="-4">

- 简单
- 可定制


</v-clicks>

<v-clicks at="+3">

- 可使用组件数据 / 状态
- 仅客户端

</v-clicks>

<!--
Client only data fetching

- [click]Simple
- [click]Customizable
- [click][click][click]Can use components data (props, state)
- [click]Client only
-->

---
layout: two-cols
---

## Suspense

<!-- Good parts 👍

- Easy, intuitive, collocated with the page component
- _Extendable_ through composables

<v-clicks>

- SSR (with store)
- **Initial** navigation integration

</v-clicks>

<v-click>

Bad parts 👎

</v-click>

<v-clicks>

- No local state (loading, error)
- Everything depends on _mounting_ the component
  - Cascading fetching
  - No preloading
  - No update if params change

</v-clicks> -->

<!-- 
- SSR we still need to serialize data to the client
- With SSR, the page is rendered and the fetching is awaited on the server. Subsequent navigations are client-side only. The update of the URL and the navigation itself is not blocked by the fetching.
- Error/loading state only on parent component
- the fetching happens when mounting the component
- Nested comp that fetches, starts fetching after the parent has fetched. No parallel fetching, slower applications
- No way to only fetch the data. We need to mount
- Can't update without mounting again or adding extra code to handle the update
- still not integrated in the navigation cycle
 -->

```vue{*|3-4}
<script setup>
const route = useRoute()
// 这只是 `await`
const data = await fetchSomeData(route.params.id)
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>

    <!-- I also fetch data -->
    <NestedComponentThatAlsoFetches />
  </div>
</template>
```

::right::

<v-clicks depth=2>

- 简单直观
- 无需路由
- 依赖于组件挂载
  - 瀑布式请求
  - 没有预加载
  - 无法监听路由变化
  
</v-clicks>

<!--
[click]
- [click]Simple and intuitive
- [click]Works without the Router
- [click]Depends on Mounting
  - [click]Cascading fetching
  - [click]No preloading
  - [click]No route watching
-->

---
layout: two-cols
---

## 使用 Composable

````md magic-move

```vue{*|4-7}
<script setup>
import { useQuery } from '@tanstack/vue-query'

// 缓存！
const { status, data, error } = useQuery({
  queryKey: ['some-key'],
  queryFn: fetchSomeData,
})
</script>

<template>
  <div v-if="status === 'loading'">加载中...</div>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

```vue{6,10-11}
<script setup>
import { useQuery } from '@tanstack/vue-query'
import { onServerPrefetch } from 'vue'

// 缓存！
const { status, data, error, suspense } = useQuery({
  queryKey: ['some-key'],
  queryFn: fetchSomeData,
})
// 处理 SSR
onServerPrefetch(() => suspense())
</script>

<template>
  <div v-if="status === 'loading'">加载中...</div>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
````

::right::

<v-clicks depth=2>

- 功能丰富
  - 缓存
  - 去重
  - 持久化
- 简洁
- 支持 SSR

</v-clicks>

<!--
- Feature rich
  - Cache
  - Deduplication
  - Persistence
- Concise
- Supports SSR
-->

---
layout: two-cols
---

## 导航守卫

```ts{*|6-7|11-14}
const router = createRouter({
  // 其他选项...
  routes: [{
    path: '/artwork/:id',
    component: () => import('@/pages/ArtworkDetail.vue'),
    // 在 `meta` 中定义获取数据的逻辑
    meta: { data: (to) => getArtwork(to.params.id) },
  }],
})

router.beforeResolve(async to => {
  // 获取并等待
  await to.meta.data?.(to)
})
```

::right::

<v-clicks at="1">

- 定义自定义的 `meta` 属性
- 在导航守卫中使用它

</v-clicks>

<v-clicks>

- 可以修改导航。例如：
  - [404 Not Found]{.font-mono} → 显示错误
  - [403 Forbidden]{.font-mono} → 重定向到 `/login`
- 导航相关的性能指标/行为分析
- 浏览器 UI 加载状态
- 无法使用组件数据
- 需要一个 Store

</v-clicks>

<!--
Navigation Guard

- [click]Can modify the navigation
  - [click][404 Not Found]{.font-mono}: store error
  - [click][403 Forbidden]{.font-mono}: Redirect to `/login`
- [click]Metrics/Analytics around navigation
- [click]Browser UI loading state
- [click]Can't use component data
- [click]Requires a Store
-->

---
layout: cover
class: text-center
---

# 数据获取是<span v-mark.underline.red="{ strokeWidth: 12 }">**复杂的**</span>

<!-- 
Complex topic, lots of ways to handle. Almost every application needs it.
TODO: add slide about questions
 -->

---
layout: cover
class: text-center
---

<!-- # <span class="font-thin">There is<br><span v-mark.underline.red="{ strokeWidth: 12 }">no <span class="font-medium">standard</span> way</span></span> -->

# 没有<span v-mark.underline.red="{ strokeWidth: 12 }">标准方式</span>

<!-- 

 -->
 
---
layout: cover
class: text-center font-thin
---

# 代码放在一起<br>+<br>导航感知

<v-clicks>

###### 这真的可能吗？

</v-clicks>

---
layout: cover
class: text-center
---

# 数据加载器

###### 标准化数据获取

<!--

-->

---

## 什么是数据加载器

Vue 插件中的**导航守卫** + `defineLoader()`

```ts{*|2,6-8}
import { createApp } from 'vue'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { router } from './router'

const app = createApp({})
// 将 Router 实例和其他可选项传递给插件
app.use(DataLoaderPlugin, { router })
```

<v-click>

```vue
<script lang="ts">
export const useUserData = defineLoader(async (to) => {
  // ...
})
</script>
```

</v-click>

<!--
What are Data loaders

A **Navigation Guard** in a Vue Plugin + `defineLoader()`
-->

---
layout: two-cols
---

# `defineLoader()`

```vue{*|1,12|4-9|4,18|12-17|13|14|15|16}
<script lang="ts">
import { getUserById } from '../api'

export const useUserData = defineLoader(async (route) => {
  // 用于获取的所有内容都应该在 URL 中
  const user = await getUserById(route.params.id)
  return user
})
</script>

<script lang="ts" setup>
const { 
  data: user, // 👆 `user`
  isLoading, // true/false
  error,
  reload, // 手动刷新 ⚡️
} = useUserData()
</script>
```

::right::

<div v-if="$clicks === 1">

`<script>` and `<script setup>`

</div>
<div v-else-if="$clicks === 2">

- 异步函数
- `to` 应该包含获取所需的所有内容
- 返回要公开的内容

</div>
<div v-else-if="$clicks === 3">

- `defineLoader()` 返回一个 _Composable_
- **导出** _Composable_
- 在任何地方使用它

</div>
<div v-else-if="$clicks === 5">

`data` 是返回的值

</div>
<div v-else-if="$clicks === 6">

`isLoading` 在加载时设置为 true

</div>
<div v-else-if="$clicks === 7">

`error` 即是 _预期内的_ 错误。稍后会详细介绍 👀

</div>
<div v-else-if="$clicks === 8">

`reload` 允许你手动刷新数据，但不触发导航

</div>

<!--
- [click] 2 scripts: disconnect load from mount
- [click]Async Function
- `to` should contain everything needed to fetch
- Return what you want to expose
- [click]`defineLoader()` returns a _composable_
- **Export** the _composable_
- Use it **anywhere**[click]
- [click]`data` is the returned value
- [click]`isLoading` is set to true while the loader is pending
- [click]`error` gives access to _expected_ errors. More about that later 👀
- [click]`reload` allows you to manually refresh the data without a navigation
-->

---

## 导航感知

````md magic-move
```vue{3-6}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  // 如果抛出错误，将取消导航
  // 就像在导航守卫中返回 '/login' 等效
  const user = await getUserById(route.params.id)
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```

```vue{2,5-14}
<script lang="ts">
import { NavigationResult } from 'unplugin-vue-router/data-loaders'

export const useUserData = defineLoader(async (route) => {
  try {
    return await getUserById(route.params.id)
  } catch (err) {
    if (err.status === 403) {
      // 控制导航
      // 与在导航守卫中返回 '/login' 等效
      throw new NavigationResult('/login')
    }
    throw err // 未处理的错误
  }
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

导航感知不只是 _拦截导航_。

</v-clicks>

<!--
Navigation Aware

if it throws it cancels the navigation
just like in a navigation guard
[click]

- Control the navigation
- Same as returning '/login' in a navigation guard
- Unhandled Error

[click]Navigation Aware is not just _blocking the navigation_.
-->

---

## 数据更新的一致性

在阻塞加载器中：数据在导航后更新

<v-click>

懒加载器会**立即**更新，因为它们不会感知导航。

</v-click>

<!--
Consistent partial updates

- In blocking Loaders: data updates after navigation
- [click]Lazy loaders _immediately_ update since they are not navigation aware.
-->

---
layout: iframe
url: http://localhost:5173/inconsistent-state
---

<!-- Show code after each example -->

---

## 非阻塞的懒加载器

````md magic-move
```vue{2-5}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  const user = await getUserById(route.params.id)
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```

```vue{5-7}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  const user = await getUserById(route.params.id)
  return user
}, {
  lazy: true, // 不阻塞导航
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

- 随导航触发但是不阻塞
- 不能拦截导航
- 所有抛出的错误都在 error 上

</v-clicks>

<!-- 
Not blocking the navigation
[click]
- [click]It's triggered during navigation but not awaited
- [click]Cannot control the navigation
- [click]Any thrown error will appear in `error`
 -->

---
layout: two-cols
---

## 为什么使用懒加载器

```vue{*|2-4,6-9|13|15}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
)

export const useArtworkRelatedArtists = defineLoader(
  (to) => getRelatedArtists(to.params.id),
  { lazy: true }, // 我们不阻塞导航
)
</script>

<script lang="ts" setup>
const { data: artwork, status } = useArtworkDetails()
const {
  data: relatedArtists,
  status: relatedArtistsStatus
} = useArtworkRelatedArtists()
</script>
```

::right::

<div v-if="$clicks === 1">

- Artwork Details 是关键的
- Related artwork 不是

</div>
<div v-else-if="$clicks === 2">

Artwork `data` 总是存在  

</div>
<div v-else-if="$clicks === 3">

Related Artists `data` 通常为 `undefined`

</div>

<!--
Why "lazy" loaders: it allows us to not block the whole page for less important data.

- [click]Artwork Details is critical
- Related artwork is not
- [click]Artwork `data` is always defined
- [click]Related Artists `data` will usually be `undefined`
-->

---

## 错误管理

定义 _预期_ 错误以**不取消**导航

```vue{*|5-7|13}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
 {
  // MyCustomError 实例将出现在 `error` 中
  // 而不会取消导航
  errors: { MyCustomError }
 }
)
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

<v-clicks>

在本地处理错误

</v-clicks>

<!--
Error management

- Define _expected_ errors to **not cancel** the navigation

- [click]MyCustomError instances will appear in `error` without blocking the navigation
- Then we get it with data, and other
- [click]Handle the error locally which is sometimes more convenient that handling it globally. But the important part is that we can do both
-->

---

## 就这些吗？

缓存，持久化，???

````md magic-move
```vue{*|2}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
)
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

```vue{*|1,4}
<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useArtworkDetails = defineBasicLoader(
 (to) => getArtwork(to.params.id),
)
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

```vue{2,4-7|5}
<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/colada'

export const useArtworkDetails = defineColadaLoader({
  key: (to) => ['artwork', to.params.id], // Specific to Pinia
  query: (to) => getArtwork(to.params.id),
})
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

```vue{7}
<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/colada'

export const useArtworkDetails = defineColadaLoader({
  key: (to) => ['artwork', to.params.id],
  query: (to) => getArtwork(to.params.id),
  staleTime: 1000 * 60 * 5, // 数据在5分钟内是新鲜的
})
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

```vue{16}
<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/colada'

export const useArtworkDetails = defineColadaLoader({
  key: (to) => ['artwork', to.params.id],
  query: (to) => getArtwork(to.params.id),
  staleTime: 1000 * 60 * 5, // 数据在5分钟内是新鲜的
})
</script>

<script lang="ts" setup>
const { 
  data: artwork,
  status,
  error,
  refresh, // 只在需要时刷新数据
} = useArtworkDetails()
</script>
```
````

<!--
Is that all, what about cache and other cool features we talked about before

- Cache, persistance, ???
- [click]defineLoader doesn't exist
- [click] the real name is defineBasicLoader because it only implements the basic set of features I showed you
- [click][click][click] Specific option, only for this loader
- [click]Data is fresh for 5 minutes
- [click]Refresh the data only if needed
-->

---

## `defineLoader()` 是一个规范

现有的实现:

- 最基本的实现: `defineBasicLoader()`
- Pinia Colada 集成: `defineColadaLoader()`

<v-click>

潜在的未来实现:

- Vue Query: `defineQueryLoader()`
- WebSockets `defineWebSocketLoader()`
- GraphQL `defineGraphQLLoader()`
- VueFire `defineFirestoreLoader()`

</v-click>

<!--
It's a spec

existing loaders

- Bare minimum implementation: `defineBasicLoader()`
- Pinia Colada integration: `defineColadaLoader()`
-->

---
layout: cover
---

# Piña Colada?

<img src="/pina-colada.jpeg" class="mx-auto max-h-96">

<!--
what is pinia colada
originally a cocktail but here
-->

---
layout: cover
transition: view-transition
---

# [Pinia Colada]{.inline-block.view-transition-title}

<img src="/pinia-colada.png" class="mx-auto max-h-96 view-transition-image">

<!--
a library
-->

---
layout: two-cols
---

## [Pinia Colada]{.inline-block.view-transition-title}

<img src="/pinia-colada.png" class="block mx-auto max-h-96 view-transition-image">

::right::

Pinia 的异步状态管理层

缓存，缓存失效，去重，插件，...

**仍在开发中**

- <carbon-logo-github /> [posva/pinia-colada]{.font-mono}
- 📚 [https://pinia-colada.esm.dev](https://pinia-colada.esm.dev/)

<!--
- Async State management layer for Pinia
- Cache, cache invalidation, deduplication, plugins, ...
- **Still work in progress**
-->

---
layout: iframe
url: http://localhost:5173/data-loaders/art-gallery/search
---

<!-- 
Show how fast to navigate
 -->

---
layout: iframe
url: https://uvr.esm.is/rfcs/data-loaders/
---

---

# 数据加载器

目标:

- 导航感知
  - 可以阻止导航直到数据准备好
  - 可以更改或中止导航
- 与页面组件共存
- 可扩展
- 高性能
  - 请求和数据访问去重
  - 默认并行
  - 需要时顺序执行
- 一致的更新
  - 保留旧数据直到导航解析完成
  - 所有数据同时更新

<!--
- Navigation Aware
  - _Can_ block navigation until data is ready
  - _Can_ change or abort the navigation
- Collocated with page components
- Extendable
- Performant
  - Deduplicate requests and data access
  - Parallel by default
  - Sequential when needed
- Consistent updates
  - Keep old data until navigation is resolved
  - All data is updated at once
-->

---
layout: cover
---

# 链接

- [<logos-vue /> unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [数据加载器 RFC](https://uvr.esm.is/rfcs/data-loaders/)
- [🍹 Pinia Colada](https://github.com/posva/pinia-colada)
- [ 幻灯片 + 演示 <carbon-logo-github /><span class="font-mono">posva/data-loaders</span>](https://github.com/posva/data-loaders)
- [❤️ 赞助我](https://esm.dev/open-source)

<!--
- Show project index, it shows artwork
- Install uvr
- add to vite config (for pages and types but not needed for data loading itself)
- add plugins to main.ts
- index.vue
  - migrate to defineBasicLoader
  - add script
  - set the page to 1
  - export and explain what it does
  - refactor setup to use it
  - pass the page from params
- search.vue
  - not fully working
  - add basic loader that search artworks
  - parse query page and text
  - explain that if invalid we can throw a navigation result or return to control the navigation
  - show redirect to page 1
  - Add full res images
    - extra fetch that depends on the first one
    - add new loader
    - await the first loader
    - explain this is different from below
    - data is consistent
    - await getArtworkImagesURLs (needs to map the data to their ids)
    - use a map to host the artworks based on their id
    - return it
  - How not to wait for the full res images
    - set the loader to lazy
    - show the network panel
    - this is sequential loading
    - show server: false
  - Alright but pretty slow when coming back to a visited page. cache data?
  - pinia colada: fetching layer
  - integrate well with data loaders
  - migrate index loader to pinia colada
  - show how good it is
  - explain staleTime and show
  - do the same for search
  - explain the data loader is implemented by using pinia colada, outside of pinia colada
    - this is the big advantage of loaders, they are mainly a spec to be followed
    - any library could implement their own loader
    - the colada loader has much more like only triggering if used params and query change
 -->


<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>


---
layout: cover
---

# 谢谢!
