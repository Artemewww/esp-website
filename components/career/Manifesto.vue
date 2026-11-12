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

    <div class="mf-copy dj-reveal">
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
.mf-bg { position: absolute; inset: 0; z-index: 0; background: conic-gradient(from var(--mf-a) at 50% 55%, #002366, #1d2fa8, #0a3a8c, #0f7f86, #006039, #1d2fa8, #002366); animation: mf-spin 22s linear infinite; filter: saturate(1.1); }
.mf-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(120% 90% at 50% 50%, rgba(0, 20, 60, 0) 30%, rgba(0, 20, 60, 0.45) 100%); }
.mf-blob { position: absolute; width: 60vmax; height: 60vmax; border-radius: 50%; filter: blur(80px); opacity: 0.75; mix-blend-mode: screen; will-change: transform; }
.mf-blob--a { left: -18%; top: -30%; background: radial-gradient(circle, #2d4ed8 0%, rgba(45, 78, 216, 0) 65%); animation: mf-drift-a 18s ease-in-out infinite alternate; }
.mf-blob--b { right: -20%; bottom: -35%; background: radial-gradient(circle, #14a39a 0%, rgba(20, 163, 154, 0) 65%); animation: mf-drift-b 21s ease-in-out infinite alternate; }
.mf-blob--c { left: 25%; top: 20%; width: 40vmax; height: 40vmax; background: radial-gradient(circle, #4b3fd0 0%, rgba(75, 63, 208, 0) 65%); opacity: 0.55; animation: mf-drift-c 25s ease-in-out infinite alternate; }
@keyframes mf-spin { to { --mf-a: 360deg; } }
@keyframes mf-drift-a { to { transform: translate(22%, 26%) scale(1.15); } }
@keyframes mf-drift-b { to { transform: translate(-24%, -20%) scale(1.1); } }
@keyframes mf-drift-c { to { transform: translate(-30%, 18%) scale(0.85); } }

/* (б) фраза поверх кадра с градиентной тонировкой */
.mf--photo { color: #fff; background: #002366; }
.mf-img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.35) contrast(1.05); }
.mf-tint { position: absolute; inset: 0; z-index: -1; background: linear-gradient(135deg, #002366 0%, #1d2fa8 45%, #0f8a86 100%); mix-blend-mode: multiply; opacity: 0.92; }
.mf--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(90% 70% at 50% 50%, rgba(0, 25, 70, 0.35), rgba(0, 25, 70, 0) 75%); }

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
  .mf-blob { filter: blur(56px); }
}
@media (prefers-reduced-motion: reduce) {
  .mf-bg, .mf-blob { animation: none; }
}
</style>
