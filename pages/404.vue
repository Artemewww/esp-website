<template>
  <div class="dj nf">
    <div class="dj-wrap dj-center">
      <span class="dj-eyebrow">Ошибка 404</span>
      <p class="nf-code" aria-hidden="true">404</p>
      <h1 class="dj-h1 nf-title">Потеря видимости</h1>
      <p class="dj-lede nf-lede">
        В своих проектах мы гарантируем кристальный просвет в 5 метров,
        но на этой странице данные пока отсутствуют.
        Давайте вернемся к прозрачным решениям.
      </p>
      <div class="nf-act">
        <NuxtLink to="/" class="dj-btn dj-btn--lg">На главную</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // No header/footer on 404 page
})
</script>

<style scoped>
.nf { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; padding: 48px 0; background: linear-gradient(180deg, #fff 0%, var(--dj-soft) 100%); }
.nf > .dj-wrap { width: 100%; }
.nf-code { margin-top: 12px; font-size: clamp(96px, 22vw, 208px); font-weight: 700; line-height: 0.9; letter-spacing: -0.05em; color: var(--dj-blue); }
.nf-title { margin-top: 16px; }
.nf-lede { max-width: 36rem; margin-top: 16px; }
.nf-act { margin-top: 32px; }
</style>
