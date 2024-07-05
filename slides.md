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

<img class="w-32 h-32 mb-4 rounded-full" src="https://avatars.githubusercontent.com/u/664177?v=4" alt="eduardo avatar">

<p class="text-left">

<span class="my-0 font-serif text-4xl font-bold">Eduardo San Martin Morote</span>
<br>
<span class="my-0 font-serif text-xl font-light">Frontend Nerd</span>
<br>
<span><logos-pinia />, <logos-vue /> Router, <img class="inline-block -translate-y-[5px]" style="height: 1.5em;" src="/vuefire.svg"> Author</span>

</p>

<span><carbon-logo-github /> <carbon-logo-x /> as [@posva]{.font-mono}</span>

</div>

<!--
Eduardo, or posva on GitHub and Twitter. I'm the author of pinia, vue router, and other libraries. Part of the core team for a long time, 7 years, or more. I've seen a lot of different patterns for Data Fetching.
-->

---
layout: two-cols
---

## Client-only Data Fetching

````md magic-move

```vue{*|6-9}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const route = useRoute()
watch(() => route.params.id, async (id) => {
  data.value = await fetchSomeData(id) // Simple!
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
const isLoading = ref(false) // Loading state
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
const error = ref() // Error state
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

<v-clicks depth=2>

- Simple
- Customizable
- Can use component data
- Client-only

</v-clicks>


<!-- Good parts 👍

<v-clicks>

- Easy
- Intuitive
- Collocated with the page component
- Extendable

</v-clicks>

<v-click at="+2">

Bad parts 👎

</v-click>

<v-clicks>

- No SSR
- **Verbose**
- No integration with navigation

</v-clicks>

::right:: -->


<!-- 
Navigation: important for
- Be able to control it, e.g. redirect user on unauthorized errors, Not Found pages
- Integrate with metrics, analytics, etc
- Native UI indicators of loading
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

<!-- ::right:: -->

```vue{*|3-4}
<script setup>
const route = useRoute()
// It's just await
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

- Simple and intuitive
- Works without the Router
- Depends on Mounting
  - Cascading fetching
  - No preloading
  - No route watching

</v-clicks>


---
layout: two-cols
---

## Using a composable

````md magic-move

```vue{*|4-7}
<script setup>
import { useQuery } from '@tanstack/vue-query'

// Cache!
const { status, data, error } = useQuery({
  queryKey: ['some-key'],
  queryFn: fetchSomeData,
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

```vue{6,10-11}
<script setup>
import { useQuery } from '@tanstack/vue-query'
import { onServerPrefetch } from 'vue'

// Cache!
const { status, data, error, suspense } = useQuery({
  queryKey: ['some-key'],
  queryFn: fetchSomeData,
})
// Handle SSR
onServerPrefetch(() => suspense())
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
````

::right::

<v-clicks depth=2>

- Feature rich
  - Cache
  - Deduplication
  - Persistence
- Concise
- Supports SSR

</v-clicks>

<!-- 
- We can avoid suspense cascading
- still not related from navigation
- Heavy library. Could replace with pinia colada for most cases

And there are other approaches to Data Fetching in Vue, for example in Nuxt you have other more lightweight solutions. But it allows me to say 2 things
-->

---
layout: two-cols
---

## Navigation guard

```ts{*|6-7|11-14}
const router = createRouter({
  // other options...
  routes: [{
    path: '/artwork/:id',
    component: () => import('@/pages/ArtworkDetail.vue'),
    // Define fetch logic in `meta`
    meta: { data: (to) => getArtwork(to.params.id) },
  }],
})

router.beforeResolve(async to => {
  // Fetch and await
  await to.meta.data?.(to)
})
```

::right::

<v-clicks>

- Can modify the navigation
  - [404 Not Found]{.font-mono}: store error
  - [403 Forbidden]{.font-mono}: Redirect to `/login`
- Metrics/Analytics around navigation
- Browser UI loading state
- Can't use component data
- Requires a Store

</v-clicks>

---
layout: cover
class: text-center
---

# Data Fetching is <span v-mark.underline.red="{ strokeWidth: 12 }">**Complex**</span>

<!-- 
Complex topic, lots of ways to handle. Almost every application needs it.
TODO: add slide about questions
 -->

---
layout: cover
class: text-center
---

<!-- # <span class="font-thin">There is<br><span v-mark.underline.red="{ strokeWidth: 12 }">no <span class="font-medium">standard</span> way</span></span> -->

# There is
# <span v-mark.underline.red="{ strokeWidth: 12 }">no standard way</span>

<!-- 

 -->
 
---
layout: cover
class: text-center font-thin
---

# Code Collocation<br>+<br>Navigation Aware

<v-clicks>

###### Is it even possible?

</v-clicks>

---
layout: cover
class: text-center
---

# Data Loaders

###### Standarizing Data Fetching

<!--

-->

---

## What are Data Loaders

A **Navigation Guard** in a Vue Plugin + `defineLoader()`

```ts{*|2,6-8}
import { createApp } from 'vue'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import { router } from './router'

const app = createApp({})
// Pass the Router instance and other optional
// options to the plugin
app.use(DataLoaderPlugin, { router })
```

---
layout: two-cols
---

# `defineLoader()`

```vue{*|1,12|4-9|4,18|13-18|8,14|15|16|17}
<script lang="ts">
import { getUserById } from '../api'

export const useUserData = defineLoader(async (route) => {
  // everything used to fetch should be in the URL
  const user = await getUserById(route.params.id)
  // return anything you want to expose
  return user
})
</script>

<script lang="ts" setup>
const { 
  data: user, // 👆 `user`
  isLoading, // true/false
  error,
  reload, // manually fetch again ⚡️
} = useUserData()
</script>
```

::right::

<div v-if="$clicks === 1">

Two `<script>`

</div>
<div v-else-if="$clicks === 2">

- Async Function
- `to` should contain everything needed to fetch
- Return what you want to expose

</div>
<div v-else-if="$clicks === 3">

- `defineLoader()` returns a _composable_
- **Export** the _composable_
- Use it **anywhere**

</div>
<div v-else-if="$clicks === 5">

`data` is the returned value

</div>
<div v-else-if="$clicks === 6">

`isLoading` is set to true while the loader is pending

</div>
<div v-else-if="$clicks === 7">

`error` gives access to _expected_ errors. More about that later 👀

</div>
<div v-else-if="$clicks === 8">

`reload` allows you to manually refresh the data without a navigation

</div>



<!-- 
- [click] 2 scripts: disconnect load from mount
- [click] Function access to the route. Everything
 -->
 
---

## Navigation Aware

````md magic-move
```vue{3-6}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  // if it throws it cancels the navigation
  // just like in a navigation guard
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
      // Control the navigation
      // Same as returning '/login' in a navigation guard
      throw new NavigationResult('/login')
    }
    throw err // Unhandled error
  }
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

Navigation Aware is not just _blocking the navigation_.

</v-clicks>

<!-- 
Since the
 -->
 
---

## Non blocking "lazy" loaders

````md magic-move
```vue{2-7}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  // if it throws it cancels the navigation
  // just like in a navigation guard
  const user = await getUserById(route.params.id)
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```

```vue{7-9}
<script lang="ts">
export const useUserData = defineLoader(async (route) => {
  // if it throws it cancels the navigation
  // just like in a navigation guard
  const user = await getUserById(route.params.id)
  return user
}, {
  lazy: true,
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```
````

<v-clicks>

- It's triggered during navigation but not awaited
- Cannot control the navigation
- Any thrown error will appear in `error`

</v-clicks>


---
layout: two-cols
---

## Non blocking "lazy" loaders

````md magic-move
```vue{*|2-4,6-9|13|15}
<script lang="ts">
export const useArtworkDetails = defineLoader(
 (to) => getArtwork(to.params.id),
)

export const useArtworkRelatedArtists = defineLoader(
  (to) => getRelatedArtists(to.params.id),
  { lazy: true }, // We can let the navigation happen
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
````

::right::

<div v-if="$clicks === 1">

- Artwork Details is critical
- Related artwork is not

</div>
<div v-else-if="$clicks === 2">

Artwork `data` is always defined

</div>
<div v-else-if="$clicks === 3">

Related Artists `data` will usually be `undefined`

</div>

---

## Error Management

---
layout: iframe
url: https://uvr.esm.is/rfcs/data-loaders/
---


<div class="font-serif text-3xl text-center">

#### Client-only Data Fetching {.inline-block.view-transition-title}
#### Using a composable
#### Suspense
#### etc

</div>

---



---
layout: two-cols
---

# Using Suspense


---

# Data Loaders

Goals:

- Navigation Aware
  - _Can_ block navigation until data is ready
  - _Can_ change or abort the navigation
- Collocated with page components
- Performant
  - Deduplicate requests and data access
  - Parallel by default
  - Sequential when needed
- Consistent updates
  - Keep old data until navigation is resolved
  - All data is updated at once

<!--
- Delay data updates until **all data loaders resolve**
- Rollback if any fails
- Avoid displaying an old page with new data
 -->

---

# Data Loaders

```vue{*|1,12|4-9|13}
<script lang="ts">
import { getUserById } from '../api'

export const useUserData = defineLoader(async (route) => {
  const user = await getUserById(route.params.id)
  // ...
  // return anything you want to expose
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```

<!-- 
TODO:

- Data loaders are a set of interfaces to implement and a Vue plugin that integrates them with Vue Router
- Data loaders are not limited to the proposed implementation (show how colada adds stuff)
 -->

---
layout: cover
---

# Demo Time

<v-clicks>

- [<logos-vue /> unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [🍹 Pinia Colada](https://github.com/posva/pinia-colada)
- [🌁 Slides <span class="font-mono">https://data-loaders-frontend-nation.netlify.app</span>](https://data-loaders-frontend-nation.netlify.app)
- [<carbon-logo-github /> <span class="font-mono">posva/data-loaders-frontend-nation</span>](https://github.com/posva/data-loaders-frontend-nation)
- [❤️ Sponsor me](https://esm.dev/open-source)

</v-clicks>

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

# Thanks!
