<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
import { getArtworkImagesURL, searchArtworks } from '../api/aic'
import { NavigationResult } from 'vue-router/auto'
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

export const useArtworksSearchResults = defineColadaLoader('/search', {
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
})

export const useArtworksImages = defineBasicLoader(
  '/search',
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

const images = shallowReactive(new Map<number, string | null>())

watch(
  searchResults,
  async (results) => {
    const imagesToFetch = Array.from(
      new Set<number>(results.data.map((artwork) => artwork.id)),
    ).filter((id) => !images.has(id))
    const imageURLs = await getArtworkImagesURL(imagesToFetch)

    for (const { id, image_url } of imageURLs) {
      images.set(id, image_url)
    }
  },
  { immediate: true },
)

function submitSearch() {
  searchQuery.value = searchText.value
  currentPage.value = 1
}
</script>

<template>
  <form @submit.prevent="submitSearch()">
    <input type="text" v-model="searchText" />
    <button>Search</button>
  </form>

  <p v-if="isLoading">Searching...</p>
  <blockquote v-else-if="error">{{ error }}</blockquote>

  <section v-if="searchResults">
    <AppPagination
      v-model:current-page="currentPage"
      :total="searchResults.pagination.total"
      :per-page="searchResults.pagination.limit"
    />

    <br />

    <div class="masonry">
      <figure
        v-for="artwork in searchResults.data"
        :id="`${artwork.title}_${artwork.id}`"
        :key="artwork.id"
        class="item"
        :title="artwork.title"
      >
        <div class="loader item__content" v-if="artwork.thumbnail">
          <img class="full-res" v-if="images?.get(artwork.id)" :src="images.get(artwork.id)!" />
          <img
            class="frozen"
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
    </div>
  </section>
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

.loader {
  position: relative;
  overflow: hidden;
  width: auto;
}

.loader .full-res {
  position: absolute;
}

.loader img {
  display: block;
  top: 0;
  left: 0;
  width: 100%;
}

.full-res {
  position: relative;
  float: left;
  display: block;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 1000px;
    height: 1000px;
    content: '';
    background: #efefef;
  }
}

.frozen {
  width: 100%;
}

.loader > .full-res {
  animation: 0.2s ease-in 0.4s 1 forwards fade;
  opacity: 0;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
