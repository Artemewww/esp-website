<template>
  <div class="dj nf">
    <div class="dj-wrap dj-center">
      <span class="dj-eyebrow">Ошибка {{ code }}</span>
      <p class="nf-code" aria-hidden="true">{{ code }}</p>
      <h1 class="dj-h1 nf-title">{{ is404 ? 'Страница не найдена' : 'Что-то пошло не так' }}</h1>
      <p class="dj-lede nf-lede">
        {{ is404 ? 'Запрошенная страница не существует или была перемещена. Вернитесь на главную страницу.' : 'Попробуйте обновить страницу или вернитесь на главную.' }}
      </p>
      <div class="nf-act">
        <button type="button" class="dj-btn dj-btn--lg" @click="handleError">На главную</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ error: { type: Object, default: () => ({}) } })
const code = computed(() => props.error?.statusCode || 500)
const is404 = computed(() => code.value === 404)
const handleError = () => clearError({ redirect: '/' })
useHead({ title: is404.value ? 'Страница не найдена | ESP' : 'Ошибка | ESP' })
</script>

<style scoped>
.nf { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; padding: 48px 0; background: #fff; }
.nf > .dj-wrap { width: 100%; }
.nf-code { margin-top: 14px; font-size: clamp(96px, 20vw, 192px); font-weight: 600; line-height: 1; letter-spacing: -0.015em; color: transparent; background: linear-gradient(180deg, #002366 0%, #0071e3 100%); -webkit-background-clip: text; background-clip: text; font-variant-numeric: tabular-nums; }
.nf-title { margin-top: 18px; font-size: clamp(32px, 4.2vw, 56px); line-height: 1.07; letter-spacing: -0.005em; }
.nf-lede { max-width: 34rem; margin-top: 16px; }
.nf-act { margin-top: 32px; }
</style>
