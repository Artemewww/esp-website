<template>
  <!-- Единый финальный призыв на всех страницах: белый фон, текст слева,
       справа инженер ESP в фирменном поло (PNG без фона) и «сообщение» от неё -->
  <section class="ct">
    <div class="ct-in">
      <div class="ct-copy dj-reveal">
        <span v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</span>
        <h2 class="ct-title">{{ title }}</h2>
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
        <img src="/images/people/esp-engineer.webp" alt="" loading="lazy" decoding="async" width="545" height="768" />
        <figcaption class="ct-bubble">
          <span class="ct-bubble__who"><i class="ct-dot" /> Инженер ESP · онлайн</span>
          {{ bubble }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { contacts } from '~/composables/useSiteNav'

defineProps({
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  note: { type: String, default: '' },
  // tone оставлен для совместимости: блок везде один и тот же — белый
  tone: { type: String, default: 'white' },
  bubble: { type: String, default: 'Здравствуйте! Расскажите о вашем объекте — подберём решение и посчитаем бюджет.' }
})
</script>

<style scoped>
.ct { position: relative; overflow: hidden; font-family: var(--dj-font); background: #fff; color: #1d1d1f; border-top: 1px solid #f0f0f2; }
.ct-in { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); align-items: end; gap: 24px; width: min(1180px, 87.5vw); margin: 0 auto; min-height: clamp(460px, 40vw, 620px); }
.ct-copy { align-self: center; display: flex; flex-direction: column; align-items: flex-start; padding: clamp(72px, 8vw, 120px) 0; }
.ct-eyebrow { margin-bottom: 10px; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #0a3a8c; }
.ct-title { margin: 0; max-width: 12em; font-size: clamp(36px, 4.4vw, 64px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: inherit; text-wrap: balance; }
.ct-lede { margin: 20px 0 0; max-width: 30em; font-size: clamp(17px, 1.45vw, 21px); line-height: 1.42; letter-spacing: 0.006em; color: #6e6e73; text-wrap: pretty; }
.ct-act { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 28px; margin-top: 32px; }
.ct-act :deep(.ax-btn) { display: inline-flex; align-items: center; min-height: 48px; padding: 0 26px; border-radius: 980px; font-size: 17px; letter-spacing: -0.022em; white-space: nowrap; background: #002366; color: #fff; cursor: pointer; border: 0; transition: background-color 0.2s ease; }
.ct-act :deep(.ax-btn:hover) { background: #0b3a8c; }
.ct-act :deep(.ax-link) { display: inline-flex; gap: 4px; font-size: 17px; letter-spacing: -0.022em; color: #0066cc; white-space: nowrap; background: none; border: 0; padding: 0; cursor: pointer; font-variant-numeric: tabular-nums; }
.ct-act :deep(.ax-link)::after { content: '›'; font-size: 1.15em; line-height: 1; }
.ct-act :deep(.ax-link:hover) { text-decoration: underline; }
.ct-note { margin: 16px 0 0; font-size: 14px; color: #6e6e73; }

.ct-person { position: relative; margin: 0; align-self: end; display: flex; justify-content: flex-end; }
.ct-person img { display: block; width: auto; height: clamp(420px, 38vw, 600px); max-width: 100%; object-fit: contain; object-position: right bottom; }
.ct-bubble { position: absolute; left: 0; top: 14%; max-width: 300px; padding: 14px 18px 16px; border-radius: 22px 22px 22px 6px; background: #f2f5fb; color: #1d1d1f; font-size: 16px; line-height: 1.38; letter-spacing: -0.01em; box-shadow: 0 10px 30px rgba(10, 40, 100, 0.10); animation: ct-pop 0.6s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
.ct-bubble__who { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; font-size: 13px; font-weight: 600; color: #6e6e73; }
.ct-dot { width: 8px; height: 8px; border-radius: 50%; background: #34c759; box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.2); }
@keyframes ct-pop { from { opacity: 0; transform: translateY(10px) scale(0.96); } to { opacity: 1; transform: none; } }

@media (max-width: 834px) {
  .ct-in { grid-template-columns: 1fr; min-height: 0; gap: 0; }
  .ct-person { order: -1; justify-content: center; padding-top: 32px; }
  .ct-person img { height: auto; width: min(100%, 420px); }
  .ct-bubble { left: 0; top: 18%; max-width: min(240px, 60%); font-size: 15px; }
  .ct-copy { padding: 32px 0 72px; }
}
@media (prefers-reduced-motion: reduce) { .ct-bubble { animation: none; } }
</style>
