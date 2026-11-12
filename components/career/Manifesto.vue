<template>
  <!-- Полноэкранные высказывания в подаче Apple Careers:
       gradient — фраза на «живом» фирменном градиенте;
       photo    — фраза поверх реального кадра с синей→бирюзовой тонировкой;
       warm     — светлый брендовый блок с крупным заголовком и абзацем. -->
  <section class="mf" :class="`mf--${variant}`">
    <div v-if="variant === 'gradient'" class="mf-bg" aria-hidden="true">
      <span class="mf-blob mf-blob--a"></span>
      <span class="mf-blob mf-blob--b"></span>
      <span class="mf-blob mf-blob--c"></span>
    </div>
    <template v-else-if="variant === 'photo'">
      <img class="mf-img" :srcset="srcset(img)" sizes="100vw" :src="img" :alt="alt" loading="lazy" decoding="async" />
      <span class="mf-tint" aria-hidden="true"></span>
    </template>
    <!-- river — река «протекает» сквозь заголовок: слой воды с альфой
         лежит поверх текста, подпись — на матовой капсуле над всем. -->
    <template v-else-if="variant === 'river'">
      <img class="mf-img mf-img--river" :srcset="srcset(img)" sizes="100vw" :src="img" :alt="alt" loading="lazy" decoding="async" />
      <span class="mf-veil" aria-hidden="true"></span>
      <h2 class="mf-river-title dj-reveal" v-html="title"></h2>
      <img class="mf-img mf-water" :srcset="srcset(overlay)" sizes="100vw" :src="overlay" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <p v-if="text" class="mf-river-sub dj-reveal" v-html="text"></p>
    </template>

    <div v-if="variant !== 'river'" class="mf-copy dj-reveal">
      <span v-if="eyebrow" class="mf-eyebrow">{{ eyebrow }}</span>
      <p class="mf-title" v-html="title"></p>
      <p v-if="text" class="mf-text" v-html="text"></p>
      <slot />
    </div>
  </section>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
defineProps({
  variant: { type: String, default: 'gradient' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  img: { type: String, default: '' },
  overlay: { type: String, default: '' },
  alt: { type: String, default: '' }
})
</script>

<style scoped>
@property --mf-a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

.mf { position: relative; isolation: isolate; overflow: hidden; display: grid; place-items: center; margin: 12px; border-radius: var(--r-lg); min-height: clamp(520px, 92vh, 900px); padding: clamp(56px, 8vw, 120px) clamp(20px, 5vw, 64px); text-align: center; }
.mf-copy { position: relative; z-index: 2; display: grid; justify-items: center; gap: 20px; max-width: 980px; }
.mf-title { font-size: clamp(36px, 6.2vw, 88px); line-height: 1.04; font-weight: 700; letter-spacing: -0.03em; text-wrap: balance; }
.mf-eyebrow { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; }
.mf-text { max-width: 40em; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.45; letter-spacing: -0.02em; text-wrap: pretty; }

/* (а) живой градиент: синий #002366 → индиго → бирюза/зелень #006039 */
.mf--gradient { color: #fff; background: #002366; }
/* Центры всех радиальных пятен вынесены за пределы блока (слой больше блока
   на 25% с каждой стороны), поэтому фокус-точки не видно — только плавный «меш». */
.mf-bg { position: absolute; inset: -25%; z-index: 0;
  background:
    radial-gradient(60% 70% at 0% 0%, #2346c4 0%, rgba(35, 70, 196, 0) 70%),
    radial-gradient(55% 65% at 100% 0%, #0d5fa8 0%, rgba(13, 95, 168, 0) 70%),
    radial-gradient(65% 70% at 100% 100%, #0f9a86 0%, rgba(15, 154, 134, 0) 72%),
    radial-gradient(60% 70% at 0% 100%, #0a3f8f 0%, rgba(10, 63, 143, 0) 70%),
    linear-gradient(125deg, #002366 0%, #0a2f86 38%, #0b4f8a 62%, #0b7a78 84%, #006b4a 100%);
  animation: mf-flow 26s ease-in-out infinite alternate; will-change: transform; }
.mf-bg::after { content: ''; position: absolute; inset: 0; opacity: 0.07; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.mf-blob { display: none; }
@keyframes mf-flow { 0% { transform: translate3d(-4%, -3%, 0) rotate(0deg); } 100% { transform: translate3d(4%, 3%, 0) rotate(4deg); } }

/* (б) фраза поверх кадра с градиентной тонировкой */
.mf--photo { color: #fff; background: #002366; }
.mf-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.35) contrast(1.05); }
.mf-tint { position: absolute; inset: 0; z-index: -1; background: linear-gradient(135deg, #002366 0%, #1d2fa8 45%, #0f8a86 100%); mix-blend-mode: multiply; opacity: 0.92; }
.mf--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(90% 70% at 50% 50%, rgba(0, 25, 70, 0.35), rgba(0, 25, 70, 0) 75%); }

/* (г) река сквозь заголовок */
.mf--river { color: #fff; background: #0b3a2c; padding-block: clamp(64px, 9vw, 120px); }
.mf--river > .mf-river-title, .mf--river > .mf-river-sub { grid-area: 1 / 1; }
.mf--river > .mf-img { z-index: 0; }
.mf-img--river { z-index: 0; filter: saturate(1.08) contrast(1.03); }
.mf-veil { position: absolute; inset: 0; z-index: 1; background: radial-gradient(70% 55% at 50% 48%, rgba(2, 40, 28, 0.32), rgba(2, 40, 28, 0) 70%), linear-gradient(180deg, rgba(0, 20, 40, 0) 60%, rgba(0, 20, 40, 0.28) 100%); }
.mf-river-title { position: relative; z-index: 2; margin: 0; max-width: none; color: #fff; font-family: 'SF Pro Rounded', ui-rounded, 'SF Pro Display', -apple-system, system-ui, sans-serif; font-size: clamp(44px, 7.6vw, 124px); line-height: 0.92; font-weight: 800; letter-spacing: -0.05em; text-align: center; text-wrap: balance; text-shadow: 0 2px 24px rgba(0, 35, 25, 0.35), 0 1px 2px rgba(0, 35, 25, 0.25); }
.mf--river > .mf-water { z-index: 3; }
.mf-water { opacity: 0.58; mix-blend-mode: normal; pointer-events: none; filter: saturate(1.08) contrast(1.03); }
.mf-river-sub { position: relative; z-index: 4; align-self: end; justify-self: center; margin: 0; padding: 12px 22px; max-width: min(34em, 100%); border-radius: 980px; font-size: clamp(15px, 1.3vw, 19px); line-height: 1.35; font-weight: 500; letter-spacing: -0.02em; text-wrap: balance; color: #fff; background: rgba(0, 35, 102, 0.34); -webkit-backdrop-filter: blur(18px) saturate(1.4); backdrop-filter: blur(18px) saturate(1.4); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22); }

/* (в) светлый брендовый блок */
.mf--warm { min-height: 0; padding: clamp(72px, 10vw, 140px) clamp(20px, 5vw, 64px); color: var(--dj-ink); background: #E9EFF6; }
.mf--warm .mf-copy { gap: 24px; }
.mf--warm .mf-title { font-size: clamp(32px, 5vw, 64px); max-width: 16ch; }
.mf--warm .mf-text { color: #4A5568; }

@media (max-width: 767px) {
  .mf { margin: 8px; border-radius: var(--r-md); min-height: 520px; }
  .mf--warm { min-height: 0; }
  .mf-title { font-size: 34px; }
  .mf--warm .mf-title { font-size: 30px; }
  .mf--river { min-height: 600px; padding: 40px 16px 24px; }
  .mf-river-title { font-size: clamp(40px, 11.6vw, 56px); line-height: 0.94; max-width: 9.5ch; }
  .mf-river-title :deep(br) { display: none; }
  .mf-river-sub { border-radius: 22px; padding: 12px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .mf-bg { animation: none; }
}
</style>
