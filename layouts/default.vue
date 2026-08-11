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
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import LogoPointCloud from '~/components/3d/LogoPointCloud.vue'

// Preloader: always plays for exactly 5 seconds on every visit.
// Состояние общее (useState), чтобы страницы могли дождаться его окончания:
// главная не крутит слайдер, пока экран закрыт прелоадером.
const showPreloader = useState('preloader-visible', () => true)
const onPreloaderComplete = () => {
  showPreloader.value = false
}
</script>