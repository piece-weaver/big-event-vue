import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref([])
  const cachedViews = ref([])

  const route = useRoute()
  const router = useRouter()

  const isAffixView = (view) => {
    return view.affix === true
  }

  const addCachedView = (view) => {
    if (!view.name) return
    if (cachedViews.value.includes(view.name)) return
    if (view.meta && view.meta.noCache) return
    cachedViews.value.push(view.name)
  }

  const addVisitedView = (to) => {
    if (!to.path) return
    if (visitedViews.value.some(v => v.path === to.path)) return

    visitedViews.value.push({
      path: to.path,
      title: to.meta.title || 'no-name',
      name: to.name,
      fullPath: to.fullPath,
      closable: to.meta.affix !== true,
      affix: to.meta.affix || false
    })
  }

  const addTagsView = (to) => {
    if (to.meta && to.meta.title) {
      addVisitedView(to)
      addCachedView(to)
    }
  }

  const isActive = (view) => {
    return view.path === route.path
  }

  const closeSelectedTag = (view) => {
    const index = visitedViews.value.findIndex(v => v.path === view.path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }

    const cacheIndex = cachedViews.value.findIndex(name => name === view.name)
    if (cacheIndex > -1) {
      cachedViews.value.splice(cacheIndex, 1)
    }

    if (isActive(view)) {
      toLastView()
    }
  }

  const toLastView = () => {
    const latestView = visitedViews.value.slice(-1)[0]
    if (latestView) {
      router.push(latestView.fullPath)
    } else {
      router.push('/home')
    }
  }

  const closeOtherTags = () => {
    const currentPath = route.path
    visitedViews.value = visitedViews.value.filter(v =>
      v.path === currentPath || isAffixView(v)
    )
    cachedViews.value = cachedViews.value.filter(name => name === route.name)
    router.push(currentPath)
  }

  const closeAllTags = () => {
    visitedViews.value = visitedViews.value.filter(isAffixView)
    cachedViews.value = []
    router.push('/home')
  }

  const addAffixTag = (route) => {
    if (!route.path || visitedViews.value.some(v => v.path === route.path)) return

    visitedViews.value.push({
      path: route.path,
      title: route.meta.title || 'no-name',
      name: route.name,
      fullPath: route.path,
      closable: false,
      affix: true
    })
  }

  const initTags = () => {
    const affixRoutes = []

    const filterAffixRoutes = (routes, basePath = '') => {
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const fullPath = basePath + (route.path.startsWith('/') ? route.path.slice(1) : route.path)
          affixRoutes.push({
            ...route,
            path: fullPath || '/',
            fullPath: fullPath || '/'
          })
        }
        if (route.children) {
          filterAffixRoutes(route.children, route.path)
        }
      })
    }

    filterAffixRoutes(router.options.routes)

    affixRoutes.forEach(route => {
      addAffixTag(route)
    })
  }

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    addTagsView,
    isActive,
    closeSelectedTag,
    closeOtherTags,
    closeAllTags,
    addAffixTag,
    initTags
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'tagsView',
        storage: localStorage,
        paths: ['visitedViews', 'cachedViews']
      }
    ]
  }
})

export default useTagsViewStore
