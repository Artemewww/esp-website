<template>
  <!-- Связь одной карточкой в форме диалогового облачка: вопрос «от нас»,
       под ним четыре крупные кнопки-канала и почта отдельной строкой. -->
  <div class="cm">
    <div class="cm-bubble">
      <div class="cm-head">
        <span class="cm-ava" aria-hidden="true">
          <svg viewBox="0 0 120 61"><path v-for="(d, i) in ESP_LOGO_PATHS" :key="i" :d="d" fill="#fff" /></svg>
        </span>
        <div>
          <b class="cm-name">Инженеры ESP</b>
          <span class="cm-meta">Отвечаем в рабочие часы</span>
        </div>
      </div>
      <p class="cm-msg">Здравствуйте! Напишите, где удобнее, — пришлём ответ, расчёт или договоримся о&nbsp;встрече.</p>
      <!-- Режим работы офиса: статус, обратный отсчёт и шкала дня -->
      <WorkDay class="cm-wd" />

      <div class="cm-grid">
        <a v-for="c in channels" :key="c.id" :href="c.href" class="cm-btn" :class="`cm-btn--${c.id}`" :target="c.ext ? '_blank' : null" :rel="c.ext ? 'noopener' : null">
          <span class="cm-ico" aria-hidden="true">
            <svg v-if="c.fill" viewBox="0 0 100 100"><path :d="c.path" fill="currentColor" fill-rule="evenodd" /></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="c.path" /></svg>
          </span>
          <b>{{ c.label }}</b>
          <small>{{ c.note }}</small>
        </a>
      </div>

      <a :href="`mailto:${contacts.email}`" class="cm-mail">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
        <span><small>Электронная почта</small><b>{{ contacts.email }}</b></span>
        <svg class="cm-mail__arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { contacts } from '~/composables/useSiteNav'
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths.js'

// Мессенджеры — тот же номер и те же ссылки, что в шапке сайта
// (components/layout/HeaderContacts.vue). Телефон и почта — из useSiteNav.
const MSG_NUM = '375291656061'
const channels = [
  {
    id: 'viber', label: 'Viber', note: '+375 29 165-60-61', href: `viber://chat?number=%2B${MSG_NUM}`,
    path: 'M12 3c5 0 8.5 2.6 8.5 7.3 0 4.6-3.4 7.2-8.5 7.2-.8 0-1.6-.1-2.3-.2L6 20v-3.3C4.3 15.4 3.5 13.2 3.5 10.3 3.5 5.6 7 3 12 3ZM9.6 7.4c.4-.2.8 0 1 .4l.6 1.2c.1.3 0 .6-.2.8l-.4.4c.4.9 1.1 1.6 2 2l.4-.4c.2-.2.5-.3.8-.2l1.2.6c.4.2.6.6.4 1-.3.8-1 1.3-1.9 1.1-2.3-.5-4.1-2.3-4.6-4.6-.2-.9.3-1.6 1.1-1.9ZM13 6.5c1.6.2 2.8 1.4 3 3M13 8.4c.6.1 1 .5 1.1 1.1'
  },
  { id: 'telegram', label: 'Telegram', note: '@ecoservisproekt', href: 'https://t.me/ecoservisproekt', ext: true, fill: true,
    path: 'M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z' },
  { id: 'whatsapp', label: 'WhatsApp', note: '+375 29 165-60-61', href: `https://wa.me/${MSG_NUM}`, ext: true, fill: true,
    path: 'M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM69.7626 28.9928C64.6172 23.841 57.7739 21.0027 50.4832 21C35.4616 21 23.2346 33.2252 23.2292 48.2522C23.2274 53.0557 24.4823 57.7446 26.8668 61.8769L23 76L37.4477 72.2105C41.4282 74.3822 45.9107 75.5262 50.4714 75.528H50.4823C65.5029 75.528 77.7299 63.301 77.7363 48.2749C77.7408 40.9915 74.9089 34.1446 69.7626 28.9928ZM62.9086 53.9588C62.2274 53.6178 58.8799 51.9708 58.2551 51.7435C57.6313 51.5161 57.1766 51.4024 56.7228 52.0845C56.269 52.7666 54.964 54.2998 54.5666 54.7545C54.1692 55.2092 53.7718 55.2656 53.0915 54.9246C52.9802 54.8688 52.8283 54.803 52.6409 54.7217C51.6819 54.3057 49.7905 53.4855 47.6151 51.5443C45.5907 49.7382 44.2239 47.5084 43.8265 46.8272C43.4291 46.1452 43.7837 45.7769 44.1248 45.4376C44.3292 45.2338 44.564 44.9478 44.7987 44.662C44.9157 44.5194 45.0328 44.3768 45.146 44.2445C45.4345 43.9075 45.56 43.6516 45.7302 43.3049C45.7607 43.2427 45.7926 43.1776 45.8272 43.1087C46.0545 42.654 45.9409 42.2565 45.7708 41.9155C45.6572 41.6877 45.0118 40.1167 44.4265 38.6923C44.1355 37.984 43.8594 37.3119 43.671 36.8592C43.1828 35.687 42.6883 35.69 42.2913 35.6924C42.2386 35.6928 42.1876 35.6931 42.1386 35.6906C41.7421 35.6706 41.2874 35.667 40.8336 35.667C40.3798 35.667 39.6423 35.837 39.0175 36.5191C38.9773 36.5631 38.9323 36.6111 38.8834 36.6633C38.1738 37.4209 36.634 39.0648 36.634 42.2002C36.634 45.544 39.062 48.7748 39.4124 49.2411L39.415 49.2444C39.4371 49.274 39.4767 49.3309 39.5333 49.4121C40.3462 50.5782 44.6615 56.7691 51.0481 59.5271C52.6732 60.2291 53.9409 60.6475 54.9303 60.9612C56.5618 61.4796 58.046 61.4068 59.22 61.2313C60.5286 61.0358 63.2487 59.5844 63.8161 57.9938C64.3836 56.4033 64.3836 55.0392 64.2136 54.7554C64.0764 54.5258 63.7545 54.3701 63.2776 54.1395C63.1633 54.0843 63.0401 54.0247 62.9086 53.9588Z' },
  { id: 'phone', label: 'Телефон', note: contacts.phone, href: contacts.phoneHref,
    path: 'M5.5 3.5h3l1.6 4-2 1.3a11 11 0 0 0 7.1 7.1l1.3-2 4 1.6v3A2 2 0 0 1 18.4 20 15.5 15.5 0 0 1 3.5 5.6a2 2 0 0 1 2-2.1Z' }
]
</script>

<style scoped>
.cm { padding: 12px 12px 0; max-width: 1440px; margin: 0 auto; }
/* Облачко: скругление 32px, левый нижний угол «хвостиком» */
.cm-bubble { position: relative; max-width: 980px; margin: 0 auto 26px; padding: clamp(24px, 3.4vw, 48px); border-radius: var(--r-lg) var(--r-lg) var(--r-lg) 0; background: #EDEDED; }
.cm-bubble::after { content: ''; position: absolute; left: 0; top: calc(100% - 1px); width: 36px; height: 26px; background: #EDEDED; clip-path: path('M0 0 H36 C24 2 9 9 0 26 Z'); }
.cm-head { display: flex; align-items: center; gap: 12px; }
.cm-ava { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #002366; }
.cm-ava svg { width: 30px; height: auto; }
.cm-name { display: block; font-size: 17px; font-weight: 600; color: var(--dj-ink); }
.cm-meta { display: block; font-size: 13px; color: #5E5E5E; }
.cm-msg { margin: 16px 0 0; max-width: 34em; font-size: clamp(21px, 2vw, 28px); line-height: 1.25; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); }

.cm-wd { margin-top: clamp(18px, 2.4vw, 26px); padding: 16px 18px 12px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05); }
.cm-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: clamp(24px, 3vw, 36px); }
.cm-btn { --c: #002366; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 18px 18px 16px; border-radius: var(--r-md); background: #fff; color: var(--dj-ink); transition: transform 0.25s cubic-bezier(0, 0, 0.5, 1), box-shadow 0.25s ease; }
.cm-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -14px color-mix(in srgb, var(--c) 70%, transparent); }
.cm-btn:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
/* Каналы в едином стиле (как у Apple): одинаковые круглые плашки 44px фирменного синего, белый знак 24px */
.cm-ico { display: grid; place-items: center; flex: none; width: 44px; height: 44px; margin-bottom: 12px; border-radius: 50%; background: var(--c); color: #fff; }
.cm-btn--telegram .cm-ico, .cm-btn--whatsapp .cm-ico { background: transparent; color: var(--c); }
.cm-ico svg { display: block; width: 24px; height: 24px; }
.cm-btn--telegram .cm-ico svg, .cm-btn--whatsapp .cm-ico svg { width: 44px; height: 44px; }
.cm-btn b { font-size: 17px; font-weight: 600; }
.cm-btn small { font-size: 13px; line-height: 1.35; color: #5E5E5E; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }

.cm-mail { display: flex; align-items: center; gap: 14px; margin-top: 12px; padding: 16px 18px; border-radius: var(--r-md); background: #fff; color: var(--dj-ink); transition: box-shadow 0.25s ease; }
.cm-mail:hover { box-shadow: var(--sh-2); }
.cm-mail > svg:first-child { flex: none; box-sizing: content-box; width: 24px; height: 24px; padding: 10px; border-radius: 50%; background: #002366; color: #fff; }
.cm-mail span { display: grid; min-width: 0; flex: 1; }
.cm-mail small { font-size: 13px; color: #5E5E5E; }
.cm-mail b { font-size: clamp(15px, 1.6vw, 21px); font-weight: 600; overflow-wrap: anywhere; white-space: nowrap; }
@media (max-width: 420px) { .cm-mail b { white-space: normal; font-size: 15px; } .cm-mail span { min-width: 0; } }
.cm-mail__arr { flex: none; width: 18px; height: 18px; color: #002366; transition: transform 0.25s ease; }
.cm-mail:hover .cm-mail__arr { transform: translateX(4px); }

@media (max-width: 767px) {
  .cm { padding: 12px 16px 0; }
  .cm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .cm-btn, .cm-mail { padding: 14px; }
  .cm-bubble { border-radius: var(--r-lg) var(--r-lg) var(--r-lg) 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cm-btn, .cm-mail__arr { transition: none; }
}
</style>
