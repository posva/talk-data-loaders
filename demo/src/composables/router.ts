import { computed, nextTick } from 'vue'
import {
  type LocationQueryRaw,
  type LocationQueryValueRaw,
  useRoute,
  useRouter,
} from 'vue-router/auto'

// exported to ensure the same value is used across the app
export let pendingQuery: null | undefined | LocationQueryRaw

export function useRouteQuery<
  T extends LocationQueryValueRaw | LocationQueryValueRaw[] = string
>(
  name: string,
  {
    // consider them as strings by default
    // @ts-ignore: the default format only works for a string
    format = (v: LocationQueryValueRaw | LocationQueryValueRaw[]): T => v || '',
    // delete them from the query if they are falsy by default
    deleteIf = (v: T | undefined | null) => !v,
  } = {}
) {
  const $route = useRoute()
  const $router = useRouter()

  return computed({
    get: () => format($route.query[name]),
    set(value: T) {
      const newQuery = pendingQuery || { ...$route.query }
      newQuery[name] = value

      if (deleteIf(value)) delete newQuery[name]

      if (!pendingQuery) {
        pendingQuery = newQuery
        nextTick().then(() => {
          $router.push({ query: pendingQuery! })
          pendingQuery = null
        })
      }
    },
  })
}
