<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
import { getArtworkImageURL, searchArtworks } from '../api/aic'
import { NavigationResult } from 'vue-router/auto'
import { useRouteQuery } from '@/composables/router'

export const useArtworksSearchResults = defineBasicLoader(
  '/search',
  async (to) => {
    const query = to.query.q || ''
    let page = Number(to.query.page)
    if (!Number.isFinite(page) || page < 1) page = 1

    if (typeof query !== 'string') {
      // stop the navigation
      throw new NavigationResult(false)
    }

    return searchArtworks(query, { page, limit: 25 })
  },
)

// export const useArtworksImages = defineBasicLoader('/search', async () => {
//   const searchResults = await useArtworksSearchResults()
//   const images = new Map<number, string | null>()
//   for (const artwork of searchResults.data) {
//     getArtworkImageURL(artwork.id).then((url) => {
//       images.set(artwork.id, url)
//     })
//   }

//   return images
// }, {
//   lazy: true,
//   server: false
// })
</script>

<script lang="ts" setup>
import { ref, shallowReactive, watch } from 'vue'
import AppPagination from '@/components/AppPagination.vue'

const searchText = ref('')
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

const { data: searchResults, isLoading, error } = useArtworksSearchResults()

const images = shallowReactive(new Map<number, string | null>())

watch(searchResults, (results) => {
  for (const artwork of results.data) {
    getArtworkImageURL(artwork.id).then((url) => {
      images.set(artwork.id, url)
    })
  }
}, { immediate: true })

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
          <object v-if="images?.get(artwork.id)" :data="images.get(artwork.id)!" type="image/jpg"></object>
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

      <!-- <figure
        v-for="artwork in searchResults.data"
        :id="`${artwork.title}_${artwork.id}`"
        :key="artwork.id"
        class="item"
        :title="artwork.title"
      >
        <img
          class="item__content"
          :src="artwork.image_url ?? artwork.thumbnail?.lqip"
          :alt="artwork.thumbnail?.alt_text || artwork.title || '???'"
        />
        <figcaption>
          <a :href="`#${artwork.title}_${artwork.id}`">
            {{ artwork.title }} - {{ artwork.artist_title }}
          </a>
        </figcaption>
      </figure> -->
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

.loader object {
  position: absolute;
}

.loader img,
.loader object {
  display: block;
  top: 0;
  left: 0;
  width: 100%;
}

object {
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
  /* filter: blur(8px); */
  /* transform: scale(1.04); */
  width: 100%;
}

.loader > object {
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
