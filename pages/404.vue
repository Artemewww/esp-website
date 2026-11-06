<template>
  <div class="ap nf">
    <section class="ap-sec nf-sec">
      <div class="ap-wrap ap-center">
        <span class="ap-eyebrow">Ошибка 404</span>
        <p class="nf-code" aria-hidden="true">404</p>
        <h1 class="ap-title nf-title">Потеря видимости</h1>
        <p class="ap-lede">
          В своих проектах мы гарантируем кристальный просвет в 5 метров,
          но на этой странице данные пока отсутствуют.
          Давайте вернемся к прозрачным решениям.
        </p>
        <div class="ap-actions">
          <NuxtLink to="/" class="ap-btn">На главную</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // No header/footer on 404 page
})
</script>

<style scoped>
.nf { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; }
.nf-sec { width: 100%; }
.nf-code { font-size: clamp(6rem, 22vw, 13rem); font-weight: 700; line-height: 0.9; letter-spacing: -0.05em; color: var(--ap-blue); }
.nf-title { margin: 1rem auto 0; }
</style>
