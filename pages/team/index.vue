<template><div /></template>

<script setup>
// Страница команды снята по решению владельца (без персональных данных сотрудников):
// постоянный редирект на «О компании». Старая версия — в бэкапе агента «Копирайтер».
await navigateTo('/about', { redirectCode: 301, replace: true })
</script>
