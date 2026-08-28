<template>
  <!-- Тёмная шапка внутренней страницы. Нужна не для красоты: фиксированное
       меню сайта на светлых страницах висело прямо на белом контенте и
       читалось как «белая шапка». Здесь у него есть своя подложка — ровно
       так же, как на главной поверх видео. -->
  <section class="ph" data-header="dark">
    <BrandPattern class="ph-pattern" :height="34" />
    <div class="ph-glow" aria-hidden="true"></div>

    <div class="container-custom ph-inner">
      <span v-if="kicker" class="ph-kicker">
        <span class="ph-kicker-dot"></span>
        {{ kicker }}
      </span>

      <h1 class="ph-title font-rounded">{{ title }}</h1>

      <p v-if="lede" class="ph-lede">{{ lede }}</p>

      <div v-if="$slots.default" class="ph-slot">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  kicker: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' }
})
</script>

<style scoped>
.ph {
  position: relative;
  overflow: hidden;
  background: linear-gradient(140deg, #001b4d 0%, #0a1526 55%, #080a0e 100%);
  color: #fff;
  /* Отступ сверху компенсирует фиксированное меню: заголовок не должен
     начинаться под ним. */
  padding: clamp(7rem, 12vh, 9.5rem) 0 clamp(3.5rem, 7vh, 5.5rem);
}

.ph-pattern {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.ph-glow {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 60%;
  height: 160%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 168, 232, 0.18), transparent 62%);
  pointer-events: none;
}

/* Поля задаём здесь: .container-custom по проекту без горизонтальных
   отступов, и без этого заголовок упирается в край экрана. */
.ph-inner {
  position: relative;
  z-index: 1;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
@media (min-width: 640px) {
  .ph-inner { padding-left: 1.5rem; padding-right: 1.5rem; }
}
@media (min-width: 1024px) {
  .ph-inner { padding-left: 2rem; padding-right: 2rem; }
}

.ph-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 1.1rem;
}
.ph-kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.18);
}

.ph-title {
  font-size: clamp(2.1rem, 4.4vw, 3.4rem);
  line-height: 1.08;
  margin-bottom: 1.1rem;
  max-width: 22ch;
}

.ph-lede {
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  max-width: 58ch;
}

.ph-slot { margin-top: 2rem; }

/* Кнопки внутри тёмной шапки: обычные .btn-primary рассчитаны на светлый
   фон и на синем теряются. */
.ph-slot :deep(.ph-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 1.9rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.ph-slot :deep(.ph-btn--primary) {
  background: #fff;
  color: #002366;
}
.ph-slot :deep(.ph-btn--primary:hover) {
  transform: translateY(-2px);
  background: #eaf6ff;
}
.ph-slot :deep(.ph-btn--ghost) {
  border: 1px solid rgba(255, 255, 255, 0.32);
  color: #fff;
}
.ph-slot :deep(.ph-btn--ghost:hover) {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}
</style>
