<template>
  <!-- Первый экран внутренней страницы. Два варианта:
       media — кадр/ролик во весь экран, текст по центру сверху (как DJI);
       без media — светлый экран с крупным заголовком (как Apple). -->
  <section class="dph" :class="{ 'dph--media': image || video, 'dph--short': short }">
    <div v-if="image || video" class="dph-media">
      <video v-if="video" :src="video" :poster="image" muted loop playsinline autoplay preload="metadata" />
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
  short: Boolean
})
</script>

<style scoped>
.dph { position: relative; padding: clamp(64px, 9vw, 120px) 0 clamp(40px, 5vw, 64px); text-align: center; background: #fff; font-family: var(--dj-font); }
.dph-copy { position: relative; display: flex; flex-direction: column; align-items: center; }
.dph-eyebrow { font-size: 14px; font-weight: 500; color: var(--dj-muted); }
.dph-title { margin-top: 8px; max-width: 20ch; font-size: clamp(34px, 5vw, 64px); line-height: 1.06; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); text-wrap: balance; }
.dph-lede { margin-top: 16px; max-width: 60ch; font-size: clamp(16px, 1.4vw, 20px); line-height: 1.5; color: var(--dj-muted); text-wrap: pretty; }
.dph-act { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 22px; margin-top: 24px; }

.dph--media { min-height: clamp(520px, 86svh, 900px); padding-top: clamp(56px, 8vh, 96px); color: #fff; background: #0b0d10; overflow: hidden; }
.dph--media.dph--short { min-height: clamp(420px, 62svh, 640px); }
.dph-media { position: absolute; inset: 0; }
.dph-media img, .dph-media video { width: 100%; height: 100%; object-fit: cover; animation: dph-zoom 1.8s var(--dj-ease) both; }
.dph-media::after { content: ''; position: absolute; inset: 0; background: radial-gradient(90% 60% at 50% 22%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.22) 55%, rgba(0, 0, 0, 0) 80%), linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.32) 100%); }
.dph--media .dph-eyebrow { color: rgba(255, 255, 255, 0.8); }
.dph--media .dph-title { color: #fff; }
.dph--media .dph-lede { color: rgba(255, 255, 255, 0.92); text-shadow: 0 1px 14px rgba(0, 0, 0, 0.45); }
.dph--media .dph-title { text-shadow: 0 2px 24px rgba(0, 0, 0, 0.3); }
@keyframes dph-zoom { from { transform: scale(1.06); opacity: 0.4; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .dph-media img, .dph-media video { animation: none; } }
</style>
