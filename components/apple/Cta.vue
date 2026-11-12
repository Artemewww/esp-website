<template>
  <!-- Единый финальный призыв на всех страницах: белый фон, текст слева,
       справа сотрудница ESP (реальное фото без фона), края мягко растушёваны -->
  <section class="ct">
    <div class="ct-in">
      <div class="ct-copy dj-reveal">
        <span v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</span>
        <component :is="h1 ? 'h1' : 'h2'" class="ct-title">{{ title }}</component>
        <p v-if="lede" class="ct-lede">{{ lede }}</p>
        <div class="ct-act">
          <slot>
            <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
            <a :href="contacts.phoneHref" class="ax-link">{{ contacts.phone }}</a>
          </slot>
        </div>
        <p v-if="note" class="ct-note">{{ note }}</p>
      </div>
      <figure class="ct-person dj-reveal" aria-hidden="true">
        <div class="ct-ph">
        <img src="/images/people/esp-team.webp?v=4" alt="" :loading="h1 ? 'eager' : 'lazy'" :fetchpriority="h1 ? 'high' : 'auto'" decoding="async" width="1200" height="1100" />
        </div>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { contacts } from '~/composables/useSiteNav'

defineProps({
  title: { type: String, required: true },
  // первый экран страницы — заголовок становится h1
  h1: { type: Boolean, default: false },
  lede: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  note: { type: String, default: '' },
  // tone оставлен для совместимости: блок везде один и тот же — белый
  tone: { type: String, default: 'white' },
})
</script>

<style scoped>
.ct { position: relative; overflow: hidden; font-family: var(--dj-font); background: #fff; color: #1A1A1A; }
.ct-in { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr); align-items: end; gap: 24px; width: min(1180px, 87.5vw); margin: 0 auto; min-height: clamp(460px, 40vw, 620px); }
.ct-copy { align-self: center; display: flex; flex-direction: column; align-items: flex-start; padding: clamp(72px, 8vw, 120px) 0; }
.ct-eyebrow { margin-bottom: 10px; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #002366; }
.ct-title { margin: 0; max-width: 12em; font-size: clamp(36px, 4.4vw, 64px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: inherit; text-wrap: balance; }
.ct-lede { margin: 20px 0 0; max-width: 30em; font-size: clamp(17px, 1.45vw, 21px); line-height: 1.42; letter-spacing: 0.006em; color: #5E5E5E; text-wrap: pretty; }
.ct-act { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 28px; margin-top: 32px; }
.ct-act :deep(.ax-btn) { display: inline-flex; align-items: center; min-height: 48px; padding: 0 26px; border-radius: var(--r-pill); font-size: 17px; letter-spacing: -0.022em; white-space: nowrap; background: #002366; color: #fff; cursor: pointer; border: 0; transition: background-color 0.2s ease; }
.ct-act :deep(.ax-btn:hover) { background: #002366; }
.ct-act :deep(.ax-link) { display: inline-flex; align-items: center; gap: 4px; line-height: 1.2; font-size: 17px; letter-spacing: -0.022em; color: #002366; white-space: nowrap; background: none; border: 0; padding: 0; cursor: pointer; font-variant-numeric: tabular-nums; }
.ct-act :deep(.ax-link)::after { content: '›'; display: block; font-size: 1.15em; line-height: 1; transform: translateY(-0.06em); }
.ct-act :deep(.ax-link:hover) { text-decoration: underline; }
.ct-note { margin: 16px 0 0; font-size: 14px; color: #5E5E5E; }

.ct-person { position: relative; margin: 0; align-self: end; display: flex; justify-content: flex-end; }
.ct-ph { position: relative; width: 100%; }
.ct-person img { display: block; width: auto; max-width: 100%; height: clamp(480px, 46vw, 680px); object-fit: contain; object-position: right bottom; vertical-align: bottom; }

@media (max-width: 834px) {
  .ct-in { grid-template-columns: 1fr; min-height: 0; gap: 0; }
  .ct-person { order: -1; justify-content: center; padding-top: 32px; }
  .ct-person img { height: auto; width: min(100%, 520px); -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.75) 73%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.08) 96%, transparent 100%); mask-image: linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.92) 64%, rgba(0,0,0,0.75) 73%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.25) 90%, rgba(0,0,0,0.08) 96%, transparent 100%); }
  .ct-copy { padding: 32px 0 72px; }
}
.ct-act :deep(a[href^="tel:"])::after { content: none; }
</style>
