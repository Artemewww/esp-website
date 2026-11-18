<template>
  <!-- Старая версия сайта (Vercel, 11.10.2026): своя шапка и подвал. Только для главной «/». -->
  <div class="legacy min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow pt-20"><slot /></main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'
useState('preloader-visible', () => false)
</script>
