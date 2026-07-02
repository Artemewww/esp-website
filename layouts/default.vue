<template>
  <div class="min-h-screen flex flex-col">
    <LogoPointCloud v-if="showPreloader" @complete="onPreloaderComplete" />
    <div :class="{ 'opacity-0 pointer-events-none': showPreloader }" class="transition-opacity duration-300">
      <Header />
      <main class="flex-grow pt-20"><slot /></main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import LogoPointCloud from '~/components/3d/LogoPointCloud.vue'

// Preloader should only play once per browser tab (first visit), not on every
// page — otherwise every navigation/reload blocks the whole site behind a
// multi-second animation, which reads as "the site won't open".
const showPreloader = ref(false)
const onPreloaderComplete = () => {
  showPreloader.value = false
  try { sessionStorage.setItem('esp-preloader-seen', '1') } catch (e) { /* ignore */ }
}

onMounted(() => {
  let seen = false
  try { seen = sessionStorage.getItem('esp-preloader-seen') === '1' } catch (e) { /* ignore */ }
  if (!seen) showPreloader.value = true
})
</script>