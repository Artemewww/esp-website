<template>
  <div />
</template>

<script setup>
// Личные страницы сотрудников сняты: персональные данные на сайте не
// публикуем. Старые ссылки ведут на рассказ о команде.
await navigateTo('/team#experts', { redirectCode: 301, replace: true })
</script>
