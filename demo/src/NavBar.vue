<template>
  <nav>
    <RouterLink :to="{ name: '/data-loaders/art-gallery/search' }"
      >Art Gallery</RouterLink
    >
    |
    <RouterLink :to="{ name: '/inconsistent-state/' }"
      >Inconsistent state</RouterLink
    >
    |
    <a style="font-size: 0.75em;" href="https://github.com/posva/talk-data-loaders">GitHub Repository</a>
  </nav>
</template>
