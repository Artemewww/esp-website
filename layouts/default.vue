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
import { ref } from 'vue'
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import LogoPointCloud from '~/components/3d/LogoPointCloud.vue'

const showPreloader = ref(true)
const onPreloaderComplete = () => { showPreloader.value = false }
</script>