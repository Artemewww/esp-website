<template><div /></template>

<script setup>
// #62: страница вебинаров снята, события публикуются в новостях.
// Основной редирект — routeRules в nuxt.config.ts; это страховка для клиентской навигации.
await navigateTo('/about/news', { redirectCode: 301, replace: true })
</script>
