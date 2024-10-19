---
theme: '@posva/slidev-theme'
title: Data Loaders | Elevating Data Fetching in Vue
info: |
  ## Data Loaders
  Elevating Data Fetching in Vue

  Copyright 2024-present Eduardo San Martin Morote
class: text-center
transition: view-transition
transition-duration: 1000ms
mdc: true
---

<div class="flex flex-col items-start h-full pt-16" >

<img class="w-32 h-32 mb-4 rounded-full" src="/posva.jpeg" alt="eduardo avatar">

<div class="text-left">

<span class="my-0 font-serif text-4xl font-bold">Eduardo San Martin Morote</span>
<br>
<span class="my-0 font-serif text-xl font-light">Frontend Nerd</span>
<br>
<span><logos-pinia />, <logos-vue /> Router, <img class="inline-block -translate-y-[5px]" style="height: 1.5em;" src="/vuefire.svg"> Author</span>

</div>

<span><carbon-logo-github /> <carbon-logo-x /> as [@posva]{.font-mono}</span>

</div>

<!--
Hello everyone! I'm Eduardo, or posva on GitHub and Twitter. I'm the author of pinia, Vue Router, and other vue-related libraries like VueFire.
I have been part of the core team for a very long time, I think it's 8 years now. During this journey I have encountered many different problems and I have tried to solve most of them.
Except for one, Data Fetching.
-->

---
layout: cover
---

# データフェッチング
# 😈 😈 😈

<!--
It's not like Data Fetching is my nemesis or anything. But I've always felt like every project I've seen used a **completely** different abstraction. Probably because there was no standard way to do it. Let me show you the most common ones.
 -->

---
layout: two-cols
---

## クライアントのみのデータフェッチング

````md magic-move

```vue{*|6-9}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const route = useRoute()
watch(() => route.params.id, async (id) => {
  data.value = await fetchSomeData(id) //　簡単
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
const isLoading = ref(false) // ローディング状態
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

```vue{7,11-18|5-19}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const isLoading = ref(false)
const error = ref() // エラーステート
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

- 簡単
- カスタマイズ可能

</v-clicks>

<v-clicks at="+3">

- コンポーネントデータを使用可能
- クライアントのみ
- 冗長

</v-clicks>

<!--
The most common one.
If your application is Client-only, using a `watch` [click] is a simple and effective way to fetch data.

On top of that, it's easy to customize: [click]

- We can add loading state
- [click] Error handling

This is because we are in the component itself, [click] we can use the component data and we don't need to learn anything new in Vue.

But [click], it has two major downsides:

- It's client-only. You can't do SSR with this approach because the data fetching only happens when the component is mounted and is not awaited when rendering the page on the server
- [click] It's quite verbose

For most projects, this is fine: they don't need SSR after all. But what if you do?
-->

---
layout: two-cols
---

## Suspense


<!-- ::right:: -->

```vue{3-4}
<script setup>
const route = useRoute()
// ただの await です
const data = await fetchSomeData(route.params.id)
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>

    <!-- これもデータをフェッチします -->
    <NestedComponentThatAlsoFetches />
  </div>
</template>
```

::right::

<v-clicks>

👍

</v-clicks>

<v-clicks depth=2 at="+0">

- シンプルで直感的
- Router なしで動作

</v-clicks>

<v-clicks>

👎

</v-clicks>

<v-clicks depth=2 at="+0">


- mount に依存する
  - カスケードフェッチング
  - プリロードなし
  - watch なし（自動に再フェッチなし）

</v-clicks>


<!--
You can rely on `<Suspense>`

- [click] It's simple and intuitive
- [click] It works without the Router
- [click] But it depends on mounting the component

This might not seem like a big deal, but the downsides are

- [click] Cascading fetching: any nested await will have to wait for the parent to finish fetching
- [click] No preloading: we have no way to tell a component to prefetch the data and then mounting it without fetching again
- [click] No watching (no automatic refetch): in order to refetch the data, we need to mount the component again. This is not always possible or desirable

 -->

---
layout: two-cols
---

## Composable　再利用

```vue{5-8}
<script setup>
import { useQuery } from '@pinia/colada'

// Cache!
const { status, data, error } = useQuery({
  key: ['some-key'],
  query: fetchSomeData,
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

::right::

<v-clicks>

- 機能が豊富
  - キャッシュ
  - リクエストの重複排除
  - 楽観的更新
  - など
- 簡潔
- SSR をサポート

</v-clicks>

<!--
Then we have composables like Pinia Colada, Vue Query, swrv, or even Nuxt's useFetch().

- [click] It's feature rich. It comes with cache, request deduplication, optimistic updates, and more. The limit is your imagination
- [click] It's concise. We only need to use the `useQuery` composable and we are good to go
- [click] It usually supports SSR. For example, with Pinia Colada and Nuxt's data fetching methods, you don't need to do anything

-->

---
layout: two-cols
---

## ナビゲーションガード

```ts{*|6-7|11-14}
const router = createRouter({
  // 他のオプション...
  routes: [{
    path: '/artwork/:id',
    component: () => import('@/pages/ArtworkDetail.vue'),
    // フェッチロジックを `meta` に定義
    meta: { data: (to) => getArtwork(to.params.id) },
  }],
})

router.beforeResolve(async to => {
  // フェッチして待機
  await to.meta.data?.(to)
})
```

::right::

<v-clicks>

- ナビゲーションを変更可能
  - [404 Not Found]{.font-mono}: エラーを表示
  - [403 Forbidden]{.font-mono}: `/login` にリダイレクト
- ナビゲーションに関するメトリクス/アナリティクス
- ブラウザの UI ローディング状態
- コンポーネントデータの使用できない
- Store が必要

</v-clicks>

<!--
Last but not least, we have navigation guards. Implementation might vary but the general idea is this:

- [click] Define a custom `meta` property
- [click] Consume it in a navigation guard
- Then you put the data somewhere, for example a pinia store

[click] Because we are in a navigation guard, we have a major advantage compared to other solutions: we can modify the navigation. For example, we can redirect to a 404 Not Found page. If the user is not authenticated, we can redirect them to the login page.

[click] Also, because we are integrating the data fetching within the navigation, we have more realistic metrics about slow navigations.

[click] Lastly, we should be able in the near future to show a native loading state in the browser UI.

But there are also downsides to this approach:

- [click] We can't use component data
- [click] We need a store to put the data

These 4 examples allow me to say two things about data fetching:

-->

---
layout: cover
class: text-center
---

# データフェッチングは<span v-mark.underline.red="{ strokeWidth: 12 }">**複雑**</span>

<!--
[click] It's a complex topic with many ways to **partially** handle it yet, almost every application needs it.
 -->

---
layout: cover
class: text-center
---

<!-- # <span class="font-thin">There is<br><span v-mark.underline.red="{ strokeWidth: 12 }">no <span class="font-medium">standard</span> way</span></span> -->

# 標準的な方法は
# <span v-mark.underline.red="{ strokeWidth: 12 }">存在しない</span>

<!--
[click] And yet, there is no standard way to do it. Every project ends up settling on a different abstraction that works the best for them.
 -->

---
layout: cover
class: text-center font-thin
---

# コードのコロケーション<br>+<br>ナビゲーション対応

<v-clicks>

###### それは本当に可能ですか？

</v-clicks>

<!--
The main drawback of these solutions is the lack of collocation of data fetching logic with the page component while being navigation aware.

[click] Is it even possible?
-->

---
layout: cover
class: text-center
---

# Data Loaders

###### データフェッチングの標準化

<!--
Today, I'm excited to introduce what I believe could become the future standard for data fetching in Vue: Data Loaders.
-->

---

## はじめに

Vue アプリにプラグインを追加します。これにより、Router に**ナビゲーションガード**が追加されます。

```ts{2,6-8}
import { createApp } from 'vue'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { router } from './router'

const app = createApp({})
// Router インスタンスと他のオプションをプラグインに渡します
app.use(DataLoaderPlugin, { router })
app.use(router)
// ...
```

<!--
To get started, we need to add the `DataLoaderPlugin` to our Vue app. This plugin will add a navigation guard to the router that will handle the data fetching within a navigation.
 -->

---
layout: two-cols
---

# `defineLoader()`

```vue{*|1,12|4-9|4,18|13-18|8,14|15|16|17}
<script lang="ts">
import { getUserById } from '../api'

export const useUserData = defineLoader(async (route) => {
  // フェッチに必要なものはすべてURLに含めるべき
  const user = await getUserById(route.params.id)
  // 返すものは何でもOK
  return user
})
</script>

<script lang="ts" setup>
const {
  data: user, // 👆 `user`
  isLoading, // true/false
  error,
  reload, // 手動で再フェッチ ⚡️
} = useUserData()
</script>
```

::right::

<div v-if="$clicks === 1">

`<script>` の二つ

</div>
<div v-else-if="$clicks === 2">

- 非同期関数
- `to` にはフェッチに必要なものがすべて含まれているべき
- 返すものは何でもOK

</div>
<div v-else-if="$clicks === 3">

- `defineLoader()` は _composable_ を返す
- **composable** をエクスポートする
- **どこでも** 使用可能

</div>
<div v-else-if="$clicks === 5">

`data` は返された値

</div>
<div v-else-if="$clicks === 6">

`isLoading` はローダーが保留中の間 true に設定される

</div>
<div v-else-if="$clicks === 7">

`error` はエラーにアクセスできる

</div>
<div v-else-if="$clicks === 8">

`reload` はナビゲーションなしでデータを手動で更新できる

</div>


<!--
Then we can start defining our data loaders with `defineLoader()`. This function is similar to `defineStore()`, it returns a composable that can be used in any component.

[click] We have two `<script>` tags

[click] we define the fetching within a function that receives the target location as an argument. This should allow us to fetch the data based on the URL. Which is a best practice. We return the data we want to expose.

[click] As mentioned, `defineLoader()` returns a composable. We export it to let the router know about it. Then we can use it anywhere in our application. We are not limited to this page component.

[click] This gives access to a few properties:

- [click] starting with `data`, which is the returned value from the loader
- [click] `isLoading` is set to true while the loader is pending
- [click] `error` gives access to promise rejections. We will see this in more detail later
- [click] `reload` allows you to manually refresh the data **without a navigation**

 -->

---

## ナビゲーション対応

````md magic-move
```vue{3-6}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  // エラーが発生するとナビゲーションがキャンセルされる
  // ナビゲーションガードと同じように
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
      // ナビゲーションを制御する
      // ナビゲーションガードで '/login' を返すのと同じ
      throw new NavigationResult('/login')
    }
    throw err // 未処理のエラー
  }
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

ナビゲーション対応はナビゲーションをブロックするだけではありません。

</v-clicks>

<!--
Since we are "Navigation Aware" because we are within a navigation guard, we can control the navigation outcome. If the loader throws an error, the navigation is canceled.

[click] Differently from regular navigation guards, we cannot just return `false` or a new location to redirect. We need to wrap it with `NavigationResult()` and we can either throw it or return it.

[click] But that's not it. Being _Navigation Aware_ is not just about controlling the navigation. And this is where things get really interesting for data loaders.
 -->

---

## 一貫した部分更新

ローダーでは、デフォルトでデータはナビゲーション**後**に更新されます。なぜなら、ナビゲーションを**ブロック**するからです。

部分的なローディング状態を書く必要はありません 🎉

<!--
It's also about consistency. In loaders, by default, the data updates only once all of the loaders have properly resolved. Your UI won't display an old page with new data.

We can also avoid writing code to display loading messages or small spinners.

Let me show you with a demo.
 -->

---
layout: demo-iframe
url: /inconsistent-state
---

<!--
Let's first see the basic client-side data fetching.

This demo is using watchers based on the route params to fetch the data.

We have two fetches, the profile information takes about 500ms while the follower count takes 2 seconds.

With client side fetching, we end up with inconsistent states.

The URL changes immediately, the profile information changes very quickly but the follower count is wrong for over a second. Not ideal.

Let's see the data loaders version. The first thing we noticed is that little blue loading bar at the top.

The navigation is blocked until the data is ready and that loading bar helps the user understand something is loading.

When we switch between profiles, the data is always there and consistent thanks to the navigation blocking.

But we don't always want to block the navigation. That's why we have lazy loaders.

- lazy but still consistent
 -->

---

## _Lazy_ loaders

````md magic-move
```vue{2-7}
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
  lazy: true, // ナビゲーション中に待機しない
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

- ナビゲーション中にトリガーされるが、待機しない
- ナビゲーションの制御できない
- スローされたエラーは `error` に表示される
- それでも一貫した更新 ✨

</v-clicks>

<!--
Perfect for non-critical data

Let's see it in action
 -->

---
layout: demo-iframe
url: /inconsistent-state/profile/posva/data-loader
---

<!--
Same demo as before, but we are going to make the follower count lazy. So it's not blocking the navigation. We get a similar result to the client-side fetching.

In this scenario we would use the `isLoading` state to show a loading spinner while the follower count is being fetched.

What's interesting is that if we make the profile information lazy, we get the same consistent behavior. Even though it doesn't block the navigation anymore, because it finishes because the navigation is over, it still waits before setting the data. Let me show you.

It's great not to have to worry some fetches being too fast but it's usually the slow ones that are the problem.

Let's talk about why do we want to use lazy loaders.
 -->

---
layout: two-cols
---

## なぜ "lazy" loaders ？

```vue{*|2-4,6-9|13|15|*}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
)

export const useArtworkRelatedArtists = defineLoader(
  (to) => getRelatedArtists(to.params.id),
    { lazy: true }, // ナビゲーションを許可する
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

- アートワークの詳細は重要
- 関連アートワークはそうではない

</div>
<div v-else-if="$clicks === 2">

アートワークの `data` は常に定義されている

</div>
<div v-else-if="$clicks === 3">

関連アーティストの `data` は `undefined` から始まる

</div>

<!--
Lazy loaders are more about non-critical data. [click] In this example we have two loaders:
`useArtworkDetails` and `useArtworkRelatedArtists`. The first one is the critical data, it's what the user is looking for. The second one is not as important, so it's better if we show the page as soon as the main data is ready.

This has a few implications: [click]

- Artwork details are always defined, no need to write `v-if` checks
- [click] On the other hand, related Artists data starts as `undefined` and their type reflects that

[click] This is a practical way to distinguish between critical and non-critical data. It enhances the user experience by prioritizing the data that the user needs most.

It brings another topic: Error Management

Since lazy loaders don't block the navigation, any error thrown will appear in `error`. This gives us the granularity to handle the error locally.
 -->

---

## エラーマネジメント

ナビゲーションを**キャンセルしない**ために_予期された_エラーを定義する

```vue{*|5-7|13}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
 {
  // MyCustomError インスタンスはナビゲーションをブロックせずに
  // `error` に表示される
  errors: [MyCustomError]
 }
)
</script>

<script lang="ts" setup>
const { data: artwork, status, error } = useArtworkDetails()
</script>
```

<!--
But lazy loaders abort the navigation if an error is thrown.

[click] But we can still define expected errors in the `error` option. This way, the navigation isn't aborted only if the error is expected.

[click] It will also appear in `error` so it can be handled granularly. So we have the best of both worlds: we can handle errors globally with `router.onError()` and also locally in the component.

Alright, so we have code collocation, navigation awareness, consistent updates, deduplication, lazy loading, and error management.
 -->

---

## 追加機能について

キャッシュ、楽観的更新、???

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
  key: (to) => ['artwork', to.params.id], // Pinia Colada に特有
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
  staleTime: 1000 * 60 * 5, // データは5分間新鮮
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
  staleTime: 1000 * 60 * 5, // データは5分間新鮮
})
</script>

<script lang="ts" setup>
const {
  data: artwork,
  status,
  error,
  refresh, // 必要に応じてデータを更新
} = useArtworkDetails()
</script>
```
````

<!--
But what about things like cache, optimistic updates? Everything that was mentioned for composables?

I have a small confession to make. [click] There is no `defineLoader()`.

[click] What I have been explaining so far is called `defineBasicLoader()`.

[click] It represents the baseline implementation for Data Loaders. Just a function. It cannot get simpler than that.

[click] Data Loaders can also be integrated with other libraries for more advanced features. For example, with Pinia Colada. Colada loaders take an object with more options. But they are augmented with Data Loader features.

[click] The `key`, a required parameter, has the route location as an argument. Allowing to easily cache the data based on the URL.

[click] We can add a `staleTime` option to keep the data fresh for a certain amount of time. This is a feature of Pinia Colada.

[click] And we can also augment the composable. For example, the colada loader exposes a `refresh()` method that refetches the data only if needed based on that `staleTime`.
-->

---

## `defineLoader()` は仕様です

既存の実装:

- ベースライン実装: `defineBasicLoader()`
- Pinia Colada 統合: `defineColadaLoader()`

<v-click>

将来的な実装の可能性:

- Vue Query: `defineQueryLoader()`
- Websockets: `defineWebSocketLoader()`
- GraphQL: `defineGraphQLLoader()`
- VueFire: `defineFirestoreLoader()`

</v-click>

<!--
`defineLoader()` is actually a spec. We currently have two implementations:

- A simple one for basic data fetching
- A feature rich one for more advanced apps

[click] But we can imagine many more implementations in the future. For example, a loader for Vue Query, one for Websockets, GraphQL, or even Firebase.
 -->

---
layout: cover
---

# Piña Colada?

<img src="/pina-colada.jpeg" class="mx-auto max-h-96">

<!--
I have been mentioning this "Pinia Colada" thing a few times but I haven't explained what it is. I'm not talking about a cocktail.
 -->

---
layout: cover
transition: view-transition
---

# [Pinia Colada]{.inline-block.view-transition-title}

<img src="/pinia-colada.png" class="mx-auto max-h-96 view-transition-image">

<!--
I'm talking about a library I have been working on for the past year.
 -->

---
layout: two-cols
---

## [Pinia Colada]{.inline-block.view-transition-title}

<img src="/pinia-colada.png" class="block mx-auto max-h-96 view-transition-image">

::right::

非同期状態管理レイヤー for Pinia

キャッシュ、楽観的更新、重複排除、プラグイン、...

- <carbon-logo-github /> [posva/pinia-colada]{.font-mono}
- 📚 [https://pinia-colada.esm.dev](https://pinia-colada.esm.dev/)

<!--
Pinia colada is a library built on top of Pinia stores to make async state management a breeze. It works on itself, without the Data Loaders or even the router.

It's the perfect companion for optimal data loaders. Let me know if you have given a try.
 -->

---

# Data Loaders

## 目標:

- ナビゲーション対応
  - データが準備できるまでナビゲーションをブロック**できる**
  - ナビゲーションを変更または中止**できる**
- ページコンポーネントとコロケーション
- パフォーマンス
  - リクエストとデータアクセスの重複排除
  - デフォルトで並列
  - 必要に応じて順次
- 一貫した更新
  - ナビゲーションが解決されるまで古いデータを保持
  - すべてのデータが一度に更新される

<!--
Let's summarize Data Loaders. They are designed to be navigation aware, collocated with page components, and performant.
The provide a flexible API to handle the loading state, errors and data both globally and locally. They are designed to create a consistent user experience by delaying data updates.

Please, give it a try and let me know what you think as well.
 -->

---
layout: cover
---

# Links

- [<logos-vue /> unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [Data Loaders](https://uvr.esm.is/data-loaders/)
- [🍹 Pinia Colada](https://github.com/posva/pinia-colada)
- [Slides + demo <carbon-logo-github /><span class="font-mono">posva/talk-data-loaders</span>](https://github.com/posva/talk-data-loaders)
- [❤️ Sponsor me](https://esm.dev/open-source)

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>

<!--
The slides and demos are available on GitHub. Check out the links in this slide for more information.
 -->

---
layout: image
image: /mp-social.png
backgroundSize: contain
---

<!--
And last but not least, if you are looking to improve your Vue.js skills with advanced exercises, or just want to support my work, check out my Mastering Pinia course on masteringpinia.com
I brought some Pinia pins with me. If you bought the course, come show me and I'll give you one.
 -->

---
layout: cover
---

# ご静聴ありがとうございます!

<!--
Thank you!
# Go seichou arigatou gozaimasu!
 -->
