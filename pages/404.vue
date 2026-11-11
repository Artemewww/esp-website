<template>
  <div class="dj nf">
    <div class="dj-wrap dj-center">
      <span class="dj-eyebrow">Ошибка 404</span>
      <p class="nf-code" aria-hidden="true">404</p>
      <h1 class="dj-h1 nf-title">Страница не найдена</h1>
      <p class="dj-lede nf-lede">
        Запрошенная страница не существует или была перемещена. Вернитесь на главную страницу.
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
useHead({ title: 'Страница не найдена | ESP', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<style scoped>
/* Apple 404: спокойный белый экран, заголовок 56/60, текст 21/29, синяя ссылка и капсула */
.nf { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; padding: 48px 0; background: #fff; }
.nf > .dj-wrap { width: 100%; }
.nf-code { margin-top: 14px; font-size: clamp(96px, 20vw, 192px); font-weight: 600; line-height: 1; letter-spacing: -0.015em; color: transparent; background: linear-gradient(180deg, #002366 0%, #0071e3 100%); -webkit-background-clip: text; background-clip: text; font-variant-numeric: tabular-nums; }
.nf-title { margin-top: 18px; font-size: clamp(32px, 4.2vw, 56px); line-height: 1.07; letter-spacing: -0.005em; }
.nf-lede { max-width: 34rem; margin-top: 16px; }
.nf-act { margin-top: 32px; }
@media (prefers-reduced-motion: no-preference) {
  .nf .dj-wrap > * { animation: nf-in 0.9s var(--dj-ease) both; }
  .nf .dj-wrap > *:nth-child(2) { animation-delay: 0.06s; }
  .nf .dj-wrap > *:nth-child(3) { animation-delay: 0.12s; }
  .nf .dj-wrap > *:nth-child(4) { animation-delay: 0.18s; }
  .nf .dj-wrap > *:nth-child(5) { animation-delay: 0.24s; }
}
@keyframes nf-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
</style>
