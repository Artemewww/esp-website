<template>
  <!-- Первый экран страницы продукта apple.com.
       stack — огромный заголовок сверху, кадр во всю ширину под ним;
       banner — кадр на весь экран, текст поверх (слева или по центру). -->
  <section class="hr" :class="[`hr--${variant}`, `hr--${align}`, { 'hr--light': !dark, 'hr--sky': hasSky }]">
    <AppleSkyClouds v-if="hasSky" class="hr-sky" />
    <div v-if="variant === 'banner'" class="hr-media hr-media--bg">
      <video v-if="video" ref="vid" :src="video" :poster="image" muted loop playsinline autoplay preload="metadata" aria-hidden="true" />
      <img v-else-if="image" :src="image" :alt="alt || title" fetchpriority="high" />
    </div>

    <div class="hr-copy">
      <p v-if="eyebrow" class="hr-eyebrow">{{ eyebrow }}</p>
      <component :is="h1 ? 'h1' : 'h2'" class="hr-title">{{ title }}</component>
      <p v-if="lede" class="hr-lede">{{ lede }}</p>
      <div v-if="$slots.default" class="hr-act"><slot /></div>
    </div>

    <div v-if="variant === 'stack' && (video || image)" class="hr-media hr-media--stage">
      <video v-if="video" ref="vid" :src="video" :poster="image" muted loop playsinline autoplay preload="metadata" aria-hidden="true" />
      <img v-else :src="image" :alt="alt || title" fetchpriority="high" />
    </div>
    <AppleSkyClouds v-if="hasSky" seam class="hr-seam" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  alt: { type: String, default: '' },
  variant: { type: String, default: 'stack' },
  align: { type: String, default: 'center' },
  dark: { type: Boolean, default: true },
  h1: { type: Boolean, default: true },
  sky: { type: Boolean, default: false }
})
// Живое небо — над съёмкой в варианте stack на тёмном фоне
const hasSky = computed(() => props.sky && props.variant === 'stack' && props.dark && !!(props.video || props.image))

const vid = ref(null)
onMounted(() => {
  if (vid.value && matchMedia('(prefers-reduced-motion: reduce)').matches) vid.value.pause()
})
</script>

<style scoped>
.hr { position: relative; overflow: hidden; background: #000; color: #f5f5f7; font-family: var(--dj-font); }
.hr--light { background: #fff; color: #1d1d1f; }
.hr-copy { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: min(980px, 87.5vw); margin: 0 auto; text-align: center; }
.hr-eyebrow { margin: 0; font-size: clamp(21px, 2.2vw, 28px); line-height: 1.14; font-weight: 600; letter-spacing: 0.007em; color: inherit; opacity: 0.92; }
.hr-title { margin: 10px 0 0; max-width: 15em; font-size: clamp(44px, 6.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: inherit; text-wrap: balance; }
.hr-lede { margin: 20px 0 0; max-width: 34em; font-size: clamp(19px, 1.6vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: #86868b; text-wrap: pretty; }
.hr--light .hr-lede { color: #6e6e73; }
.hr-act { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px 32px; margin-top: 32px; }
.hr-act :slotted(.ax-btn) { display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; letter-spacing: -0.022em; white-space: nowrap; background: #0071e3; color: #fff; transition: background-color 0.2s ease; }
.hr-act :slotted(.ax-btn:hover) { background: #0077ed; }
.hr--light .hr-act :slotted(.ax-btn) { background: #002366; }
.hr-act :slotted(.ax-link) { display: inline-flex; gap: 4px; font-size: 17px; letter-spacing: -0.022em; color: #2997ff; white-space: nowrap; background: none; border: 0; padding: 0; cursor: pointer; }
.hr--light .hr-act :slotted(.ax-link) { color: #0066cc; }
.hr-act :slotted(.ax-link)::after { content: '›'; font-size: 1.15em; line-height: 1; }
.hr-act :slotted(.ax-link:hover) { text-decoration: underline; }

/* stack: текст сверху, кадр под ним, мягкий «отъезд» камеры при загрузке */
.hr--stack { padding-top: clamp(56px, 8vw, 104px); }
.hr-media--stage { position: relative; margin-top: clamp(40px, 5vw, 64px); height: clamp(320px, 52vw, 760px); overflow: hidden; }
.hr-media video, .hr-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hr-media--stage video, .hr-media--stage img { animation: hr-in 2.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
.hr-media--stage::before { content: ''; position: absolute; inset: 0 0 auto; z-index: 1; height: 22%; background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%); }
.hr--light .hr-media--stage::before { background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%); }

/* banner: кадр на весь экран, текст поверх */
.hr--banner { display: flex; align-items: flex-end; height: calc(100svh - var(--dj-header-h, 56px)); min-height: 560px; max-height: 940px; padding-bottom: clamp(56px, 9vh, 104px); color: #f5f5f7; background: #000; }
.hr-media--bg { position: absolute; inset: 0; }
.hr-media--bg video, .hr-media--bg img { animation: hr-in 2.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
.hr-media--bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.62) 100%); }
.hr--banner.hr--left .hr-media--bg::after { background: linear-gradient(90deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.18) 55%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%); }
.hr--banner .hr-lede { color: rgba(245, 245, 247, 0.86); }
.hr--left .hr-copy { align-items: flex-start; text-align: left; }
.hr--left .hr-act { justify-content: flex-start; }
.hr--banner .hr-title { max-width: 13em; }

/* Небо вместо чёрного поля: облака над текстом, горизонт уходит в съёмку */
.hr--sky { background: #bdd6ed; }
.hr-sky { position: absolute; inset: 0 0 auto; z-index: 0; height: calc(100% - clamp(320px, 52vw, 760px) * 0.6); }
.hr--sky .hr-media--stage { z-index: 1; }
.hr--sky .hr-media--stage::before { display: none; }
.hr--sky .hr-media--stage { -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.35) 14%, #000 32%); mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.35) 14%, #000 32%); }
.hr--sky .hr-copy { z-index: 3; }
.hr-seam { left: 0; right: 0; z-index: 2; top: calc(100% - clamp(320px, 52vw, 760px) - clamp(60px, 7vw, 120px)); height: clamp(220px, 30vw, 460px); }
@media (max-width: 734px) { .hr-seam { top: calc(100% - max(72vw, 300px) - 50px); height: 230px; } }
.hr--sky .hr-eyebrow, .hr--sky .hr-title { text-shadow: 0 2px 24px rgba(10, 35, 80, 0.35); }
.hr--sky .hr-act :slotted(.ax-link) { color: #fff; text-shadow: 0 1px 12px rgba(10, 35, 80, 0.45); }
.hr--sky .hr-lede { color: rgba(255, 255, 255, 0.9); text-shadow: 0 1px 14px rgba(10, 35, 80, 0.4); }
@media (max-width: 734px) { .hr-sky { height: calc(100% - max(72vw, 300px) * 0.6); } }

@keyframes hr-in { from { transform: scale(1.12); opacity: 0.3; } to { transform: none; opacity: 1; } }

@media (max-width: 734px) {
  .hr-copy { width: calc(100% - 48px); }
  .hr-eyebrow { font-size: 17px; line-height: 1.24; }
  .hr-title { font-size: clamp(36px, 10.4vw, 48px); line-height: 1.08; overflow-wrap: break-word; }
  .hr--banner { height: calc(92svh - var(--dj-header-h, 56px)); min-height: 520px; }
  .hr-media--stage { height: 72vw; min-height: 300px; }
}
@media (prefers-reduced-motion: reduce) {
  .hr-media video, .hr-media img { animation: none !important; }
}
</style>
