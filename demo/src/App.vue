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
