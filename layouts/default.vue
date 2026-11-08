<template>
  <div class="min-h-screen flex flex-col">
    <!-- Главная — с боевой шапкой, внутренние страницы — со стеклянной капсулой -->
    <Header v-if="route.path === '/'" />
    <HeaderCapsule v-else />
    <main class="flex-grow pt-20"><slot /></main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
import HeaderCapsule from '~/components/layout/HeaderCapsule.vue'

const route = useRoute()

// Заставка с «синхронизацией» убрана: пять секунд ожидания перед первым
// экраном стоили дороже, чем добавляли. Состояние оставляем — на него
// завязаны шапка и герой главной, — но оно сразу выключено.
useState('preloader-visible', () => false)

// Внутренним страницам в подаче Apple нужен Inter 700 для заголовков.
// Главную не трогаем: там шрифты грузятся ровно как на боевом сайте.
useHead(() => ({
  link: route.path === '/' ? [] : [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap', key: 'inter-700' }]
}))
</script>
