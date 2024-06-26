<script lang="ts">
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'
import { getArtwork } from '@/api/aic'

export const useArtworkDetails = defineColadaLoader(
  '/art-gallery/artwork.[id]',
  {
    key: (to) => ['artwork', { id: to.params.id }],
    query: (to) => getArtwork(to.params.id),
  },
)
</script>

<script lang="ts" setup>
const { data: artwork, status } = useArtworkDetails()
</script>

<template>
  <template v-if="status === 'success'">
    <figure :title="artwork.title">
      <div class="img-loader item__content">
        <img
          v-if="artwork.image_url"
          class="full-res"
          :src="artwork.image_url"
        />
        <img
          v-if="artwork.thumbnail"
          class="img-frozen"
          :src="artwork.thumbnail.lqip"
          :alt="artwork.thumbnail.alt_text"
        />
      </div>
      <figcaption>
        <h2>{{ artwork.title }}</h2>
        <p>{{ artwork.artist_display }}</p>
        <p>{{ artwork.date_display }}</p>
      </figcaption>
    </figure>

    <div v-html="artwork.description"></div>

    <hr />

    <h3>Details</h3>
    <dl>
      <dt>Dimensions</dt>
      <dd>{{ artwork.dimensions }}</dd>
      <template v-if="artwork.color">
        <dt>Color</dt>
        <dd class="space-x-1 flex">
          <span
            class="rounded-full inline-block border w-6 h-6 ml-2"
            :style="{
              backgroundColor: `hsl(${artwork.color.h}, ${artwork.color.s}%, ${artwork.color.l}%)`,
            }"
          ></span>
          <code
            >hsl({{ artwork.color.h }},{{ artwork.color.s }},{{
              artwork.color.l
            }})</code
          >
        </dd>
      </template>
    </dl>

    <hr />

    <h3>Terms</h3>
    <ul class="list-none flex flex-wrap p-0">
      <li
        v-for="term in artwork.term_titles"
        :key="term"
        class="rounded-full border px-2 dark:bg-slate-900 bg-slate-200 mr-1"
      >
        {{ term }}
      </li>
    </ul>
  </template>
  <p v-else>Loading...</p>
</template>
