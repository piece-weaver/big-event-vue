<template>
  <div></div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const { fullPath } = route
  if (fullPath.startsWith('/redirect')) {
    router.replace(fullPath.replace('/redirect', ''))
  }
})
</script>
