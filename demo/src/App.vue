<template>
  <header>
    <h1>Data Loaders</h1>
    <div class="wrapper">
      <nav>
        <RouterLink to="/art-gallery/">Art Gallery</RouterLink>
        <!-- | -->
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
  background: var(--npbar-color);
}
#nprogress .peg {
  box-shadow:
    0 0 10px var(--npbar-color),
    0 0 5px var(--npbar-color);
}
</style>
