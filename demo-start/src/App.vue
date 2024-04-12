<script setup lang="ts">
</script>

<template>
  <header>
    <h1>Art Collection</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        |
        <RouterLink to="/search">Search</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
:root {
  --npbar-color: var(--nc-lk-1);
}

#nprogress .bar {
  background: var(--npbar-color)
}
#nprogress .peg {
  box-shadow: 0 0 10px var(--npbar-color), 0 0 5px var(--npbar-color);
}
</style>
