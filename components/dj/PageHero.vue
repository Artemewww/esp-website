<template>
  <!-- Первый экран внутренней страницы. Два варианта:
       media — кадр/ролик во весь экран, текст по центру сверху (как DJI);
       без media — светлый экран с крупным заголовком (как Apple). -->
  <section class="dph" :class="{ 'dph--media': image || video, 'dph--short': short, 'dph--left': align === 'left' }">
    <div v-if="image || video" class="dph-media">
      <video v-if="video" v-lazy-video :data-src="video" :poster="image" muted loop playsinline preload="none" />
      <img v-else :src="image" :alt="alt || title" fetchpriority="high" />
    </div>
    <div class="dph-copy dj-wrap">
      <span v-if="eyebrow" class="dph-eyebrow">{{ eyebrow }}</span>
      <h1 class="dph-title">{{ title }}</h1>
      <p v-if="lede" class="dph-lede">{{ lede }}</p>
      <div v-if="$slots.default" class="dph-act"><slot /></div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  eyebrow: String,
  lede: String,
  image: String,
  video: String,
  alt: String,
  short: Boolean,
  align: { type: String, default: 'center' }
})
</script>

<style scoped>
.dph { position: relative; padding: clamp(64px, 9vw, 120px) 0 clamp(40px, 5vw, 64px); text-align: center; background: #fff; font-family: var(--dj-font); }
.dph-copy { position: relative; display: flex; flex-direction: column; align-items: center; }
.dph-eyebrow { font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19048; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); }
.dph-title { margin-top: 8px; max-width: 18ch; font-size: clamp(40px, 6.2vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); text-wrap: balance; }
.dph-lede { margin-top: 20px; max-width: 46ch; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: var(--dj-muted); text-wrap: pretty; }
.dph-act { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 14px 24px; margin-top: 28px; }

.dph--media { min-height: clamp(520px, 86svh, 900px); padding-top: clamp(56px, 8vh, 96px); color: #fff; background: #0b0d10; overflow: hidden; }
.dph--media.dph--short { min-height: clamp(420px, 62svh, 640px); }
.dph-media { position: absolute; inset: 0; }
.dph-media img, .dph-media video { width: 100%; height: 100%; object-fit: cover; animation: dph-zoom 1.8s var(--dj-ease) both; }
.dph-media::after { content: ''; position: absolute; inset: 0; background: radial-gradient(90% 60% at 50% 22%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.22) 55%, rgba(0, 0, 0, 0) 80%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.32) 100%); }
.dph--media .dph-eyebrow { color: #EDEDED; }
.dph--media .dph-title { color: #EDEDED; }
.dph--media .dph-lede { color: rgba(255, 255, 255, 0.92); text-shadow: 0 1px 14px rgba(0, 0, 0, 0.45); }
.dph--media .dph-title { text-shadow: 0 2px 24px rgba(0, 0, 0, 0.3); }
/* Баннер как Agras T55/T25P: текст слева по центру высоты, кадр справа */
.dph--left { display: flex; align-items: center; text-align: left; padding-top: var(--dj-header-h); }
.dph--left .dph-copy { align-items: flex-start; width: 100%; max-width: 1440px; padding-left: clamp(24px, 8vw, 140px); }
.dph--left .dph-title { max-width: 13ch; }
.dph--left .dph-lede { max-width: 40ch; }
.dph--left .dph-act { justify-content: flex-start; }
.dph--left .dph-media::after { background: linear-gradient(90deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.3) 36%, rgba(0, 0, 0, 0) 62%), linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0) 30%); }
@media (max-width: 767px) {
  .dph--left { align-items: flex-end; padding-bottom: 48px; }
  .dph--left .dph-media::after { background: linear-gradient(0deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0) 65%); }
}
@keyframes dph-zoom { from { transform: scale(1.04); opacity: 0.4; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .dph-media img, .dph-media video { animation: none; } }
</style>
