<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
import { getArtworkImagesURL, searchArtworks } from '@/api/aic'
import { NavigationResult } from 'unplugin-vue-router/data-loaders'
import { useRouteQuery } from '@/composables/router'
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'
import { parsePageQuery, parseQuerySearch } from '@/utils'

// export const useArtworksSearchResults2 = defineBasicLoader(
//   '/search',
//   async (to) => {
//     const query = parseQuerySearch(to.query.q)
//     const page = parsePageQuery(to.query.page)

//     if (query == null) {
//       // stop the navigation
//       throw new NavigationResult(false)
//     }

//     return searchArtworks(query, { page, limit: 25 })
//   },
// )

export const useArtworksSearchResults = defineColadaLoader(
  '/data-loaders/art-gallery/search',
  {
    key: (to) => [
      'artworks',
      { q: parseQuerySearch(to.query.q), page: parsePageQuery(to.query.page) },
    ],
    query: async (to) => {
      const query = parseQuerySearch(to.query.q)
      const page = parsePageQuery(to.query.page)

      if (query == null) {
        // stop the navigation
        throw new NavigationResult(false)
      }

      return searchArtworks(query, { page, limit: 25 })
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    // lazy: (to, from) => to.name !== to.from
  },
)

// not used in this page
const useArtworksImages = defineBasicLoader(
  '/data-loaders/art-gallery/search',
  async () => {
    const searchResults = await useArtworksSearchResults()
    const images = new Map<number, string | null>()
    const imageURLs = await getArtworkImagesURL(
      searchResults.data.map((artwork) => artwork.id),
    )
    for (const artwork of imageURLs) {
      images.set(artwork.id, artwork.image_url)
    }

    return images
  },
  {
    lazy: true,
    server: false,
  },
)
</script>

<script lang="ts" setup>
import { ref, shallowReactive, watch } from 'vue'
import AppPagination from '@/components/AppPagination.vue'

const currentPage = useRouteQuery('page', {
  format: (v) => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : 1
  },
})
const searchQuery = useRouteQuery('q', {
  format: (v) => {
    return typeof v === 'string' ? v : ''
  },
})
const searchText = ref<string>(searchQuery.value || '')

const { data: searchResults, isLoading, error } = useArtworksSearchResults()

// const { data: images } = useArtworksImages()

function submitSearch() {
  searchQuery.value = searchText.value
  currentPage.value = 1
}
</script>

<template>
  <blockquote v-if="error">
    <strong>Error: </strong> <span>{{ error.message }}</span>
  </blockquote>

  <form class="space-x-2" @submit.prevent="submitSearch()">
    <input v-model="searchText" type="text" />
    <button>Search</button>
  </form>

  <section v-if="searchResults">
    <AppPagination
      v-model:current-page="currentPage"
      :total="searchResults.pagination.total"
      :per-page="searchResults.pagination.limit"
    />

    <hr />

    <div class="masonry">
      <RouterLink
        v-for="artwork in searchResults.data"
        :id="`${artwork.title}_${artwork.id}`"
        :key="artwork.id"
        :to="{
          name: '/data-loaders/art-gallery/artwork.[id]',
          params: { id: artwork.id },
        }"
        class="item"
      >
        <figure :title="artwork.title">
          <div v-if="artwork.thumbnail" class="img-loader item__content">
            <!-- <img
              v-if="images.has(artwork.id)"
              class="full-res"
              :src="images.get(artwork.id)!"
            /> -->
            <img
              v-if="artwork.image_url"
              class="full-res"
              :src="artwork.image_url"
              alt="Full resolution"
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
      :total="searchResults.pagination.total"
      :per-page="searchResults.pagination.limit"
    />
  </section>
  <section v-else>Loading...</section>
</template>
