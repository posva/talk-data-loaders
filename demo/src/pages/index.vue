<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useArtworksList = defineBasicLoader('/', async (to) => {
  return getArtworksList()
})
</script>

<script setup lang="ts">
import { getArtworksList } from '@/api/aic'
const { data: artworksList, isLoading, error } = useArtworksList()
</script>

<template>
  <main>
    <h1>Museum Artworks List</h1>

    <p>This list is provided by  <a href="https://www.artic.edu/">The Art Institute of Chicago</a>.

    </p>

    <p v-if="isLoading">Loading...</p>
    <blockquote v-else-if="error">{{ error }}</blockquote>
    <section class="masonry" v-else-if="artworksList">
      <figure
        v-for="artwork in artworksList.data"
        :id="`${artwork.title}_${artwork.id}`"
        :key="artwork.id"
        class="item"
        :title="artwork.title"
      >
        <img
          class="item__content"
          :src="artwork.image_url"
          :alt="artwork.thumbnail.alt_text"
        />
        <figcaption>
          <a :href="`#${artwork.title}_${artwork.id}`">
            {{ artwork.title }}
          </a>
        </figcaption>
      </figure>
    </section>
  </main>
</template>

<style scoped>
.masonry img {
  max-width: 100%;
  display: block;
  margin-bottom: 0;
}

figure {
  margin: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  margin-bottom: 10px;
  break-inside: avoid;
}

figure > img {
  grid-row: 1 / -1;
  grid-column: 1;
}

figure a {
  color: black;
  text-decoration: none;
}

figcaption {
  grid-row: 2;
  grid-column: 1;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.2em 0.5em;
  justify-self: start;
}

.masonry {
  column-count: 4;
  column-gap: 10px;
}

@media screen and (max-width: 1024px) {
  .masonry {
    column-count: 3;
  }
}

@media screen and (max-width: 500px) {
  .masonry {
    column-count: 2;
  }
}
</style>
