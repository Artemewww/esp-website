<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow pt-20"><slot /></main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'

// Заставка с «синхронизацией» убрана: пять секунд ожидания перед первым
// экраном стоили дороже, чем добавляли. Состояние оставляем — на него
// завязаны шапка и герой главной, — но оно сразу выключено.
useState('preloader-visible', () => false)
</script>
