<template>
  <div class="dj min-h-screen flex flex-col">
    <!-- Прелоадер на весь экран отключён: он прятал первый экран до полной
         загрузки и проваливал LCP в PageSpeed. Вернуть — раскомментировать. -->
    <!-- <WaterPreloader /> -->
    <WaterTransition />
    <SiteHeader />
    <main class="flex-grow" :class="{ 'dj-main--pad': route.path !== '/' }"><slot /></main>
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/layout/SiteHeader.vue'
import SiteFooter from '~/components/layout/SiteFooter.vue'
// import WaterPreloader from '~/components/layout/WaterPreloader.vue'
import WaterTransition from '~/components/layout/WaterTransition.vue'

const route = useRoute()

</script>

<style>
.dj-main--pad { padding-top: var(--dj-header-h); }
</style>
