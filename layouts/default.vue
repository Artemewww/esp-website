<template>
  <div class="dj min-h-screen flex flex-col">
    <WaterPreloader />
    <SiteHeader />
    <main class="flex-grow" :class="{ 'dj-main--pad': route.path !== '/' }"><slot /></main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/layout/SiteHeader.vue'
import SiteFooter from '~/components/layout/SiteFooter.vue'
import WaterPreloader from '~/components/layout/WaterPreloader.vue'

const route = useRoute()

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', key: 'inter-dj' }
  ]
})
</script>

<style>
.dj-main--pad { padding-top: var(--dj-header-h); }
</style>
