<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
import { getArtworksList } from '@/api/aic'
import { parsePageQuery } from '@/utils'
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'

// export const useArtworksList = defineBasicLoader('/', async (to) => {
//   return getArtworksList({ page: parsePageQuery(to.query.page) })
// })

export const useArtworksList = defineColadaLoader('/art-gallery/', {
  key: (to) => ['artworks', { page: parsePageQuery(to.query.page) }],
  query: async (to) => {
    return getArtworksList({ page: parsePageQuery(to.query.page) })
  },
  staleTime: 1000 * 60 * 60, // 1 hour
})
</script>

<script setup lang="ts">
import { useRouteQuery } from '@/composables/router'
import AppPagination from '@/components/AppPagination.vue'

const currentPage = useRouteQuery<number>('page', {
  format: (v) => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : 1
  },
  // deleteIf: (v) => !v || v === 1,
})

const { data: artworksList, isLoading, error } = useArtworksList()
</script>

<template>
  <main>
    <h2>Museum Artworks List</h2>

    <p>
      This list is provided by
      <a href="https://www.artic.edu/">The Art Institute of Chicago</a>.
    </p>

    <section v-if="artworksList">
      <AppPagination
        v-model:current-page="currentPage"
        :total="artworksList.pagination.total"
        :per-page="artworksList.pagination.limit"
      />

      <hr />

      <div class="masonry">
        <RouterLink
          v-for="artwork in artworksList.data"
          :id="`${artwork.title}_${artwork.id}`"
          :key="artwork.id"
          :to="{
            name: '/art-gallery/artwork.[id]',
            params: { id: artwork.id },
          }"
          class="item"
        >
          <figure :title="artwork.title">
            <div v-if="artwork.thumbnail" class="img-loader item__content">
              <img
                v-if="artwork.image_url"
                class="full-res"
                :src="artwork.image_url"
              />
              <img
                class="img-frozen"
                :style="{
                  aspectRatio: `${artwork.thumbnail.width} / ${artwork.thumbnail.height}`,
                }"
                :src="artwork.thumbnail.lqip"
                :alt="artwork.thumbnail.alt_text"
              />
            </div>
            <figcaption>
              <a :href="`#${artwork.title}_${artwork.id}`">
                {{ artwork.title }}
              </a>
            </figcaption>
          </figure>
        </RouterLink>
      </div>

      <hr />

      <AppPagination
        v-model:current-page="currentPage"
        :total="artworksList.pagination.total"
        :per-page="artworksList.pagination.limit"
      />
    </section>
    <section v-else>Loading...</section>
  </main>
</template>

<style scoped></style>
