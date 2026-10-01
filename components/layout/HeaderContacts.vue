<template>
  <div class="hc" :class="onDark ? 'is-dark' : 'is-light'">
    <!-- Режим работы: не витрина «Пн–Пт 9–18», а ответ на вопрос «дозвонюсь
         ли я сейчас». Пока открыто — сколько осталось, после — когда ждать. -->
    <span class="hc-hours" :title="hours">
      <span class="hc-dot" :class="{ 'is-on': state.open }"></span>
      <span class="hc-hours-text">
        <b>{{ state.title }}</b>
        <i>{{ state.detail }}</i>
      </span>
    </span>

    <a :href="`tel:${PHONE_RAW}`" class="hc-phone" :title="`Позвонить ${PHONE_HUMAN}`">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.7 2.73a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.35-1.27a2 2 0 0 1 2.11-.45c.87.34 1.79.57 2.73.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <span class="hc-phone-text">{{ PHONE_HUMAN }}</span>
    </a>

    <span class="hc-msgs" :class="{ 'is-open': msgsOpen }">
      <!-- Триггер для мобильных: три точки, по клику раскрывает мессенджеры-тултип -->
      <button
        type="button"
        class="hc-msgs-trigger"
        :aria-expanded="msgsOpen ? 'true' : 'false'"
        aria-label="Мессенджеры"
        @click="msgsOpen = !msgsOpen"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
        </svg>
      </button>

      <span class="hc-msgs-list">
        <a
          v-for="m in messengers"
          :key="m.id"
          :href="m.href"
          class="hc-msg"
          :style="{ '--brand': m.color }"
          :target="m.href.startsWith('mailto:') ? undefined : '_blank'"
          rel="noopener"
          :title="m.title"
          :aria-label="m.title"
          @click="msgsOpen = false"
        >
          <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" :d="m.path" />
          </svg>
        </a>
      </span>
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWorkSchedule } from '~/composables/useWorkSchedule'

defineProps({
  // Шапка лежит на тёмном герое — тогда контакты светлые.
  onDark: { type: Boolean, default: false }
})

const { state, hours } = useWorkSchedule()

// На мобильных мессенджеры свёрнуты в попап по клику на «три точки».
const msgsOpen = ref(false)

const PHONE_RAW = '+375291656061'
const PHONE_HUMAN = '+375 29 165-60-61'

// Ряд собран одним контурным набором: три сервиса рисуются одной толщиной
// линии, поэтому читаются как комплект, а не как три чужие картинки.
// Знаки мессенджеров: сплошной кружок с вырезанным символом. Вырез
// прозрачный, сквозь него видно подложку кнопки — поэтому символ всегда
// контрастен и не плывёт поверх видео в первом экране.
const messengers = [
  {
    id: 'whatsapp',
    title: 'Написать в WhatsApp',
    href: 'https://wa.me/375291656061',
    color: '#25D366',
    path: 'M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM69.7626 28.9928C64.6172 23.841 57.7739 21.0027 50.4832 21C35.4616 21 23.2346 33.2252 23.2292 48.2522C23.2274 53.0557 24.4823 57.7446 26.8668 61.8769L23 76L37.4477 72.2105C41.4282 74.3822 45.9107 75.5262 50.4714 75.528H50.4823C65.5029 75.528 77.7299 63.301 77.7363 48.2749C77.7408 40.9915 74.9089 34.1446 69.7626 28.9928ZM62.9086 53.9588C62.2274 53.6178 58.8799 51.9708 58.2551 51.7435C57.6313 51.5161 57.1766 51.4024 56.7228 52.0845C56.269 52.7666 54.964 54.2998 54.5666 54.7545C54.1692 55.2092 53.7718 55.2656 53.0915 54.9246C52.9802 54.8688 52.8283 54.803 52.6409 54.7217C51.6819 54.3057 49.7905 53.4855 47.6151 51.5443C45.5907 49.7382 44.2239 47.5084 43.8265 46.8272C43.4291 46.1452 43.7837 45.7769 44.1248 45.4376C44.3292 45.2338 44.564 44.9478 44.7987 44.662C44.9157 44.5194 45.0328 44.3768 45.146 44.2445C45.4345 43.9075 45.56 43.6516 45.7302 43.3049C45.7607 43.2427 45.7926 43.1776 45.8272 43.1087C46.0545 42.654 45.9409 42.2565 45.7708 41.9155C45.6572 41.6877 45.0118 40.1167 44.4265 38.6923C44.1355 37.984 43.8594 37.3119 43.671 36.8592C43.1828 35.687 42.6883 35.69 42.2913 35.6924C42.2386 35.6928 42.1876 35.6931 42.1386 35.6906C41.7421 35.6706 41.2874 35.667 40.8336 35.667C40.3798 35.667 39.6423 35.837 39.0175 36.5191C38.9773 36.5631 38.9323 36.6111 38.8834 36.6633C38.1738 37.4209 36.634 39.0648 36.634 42.2002C36.634 45.544 39.062 48.7748 39.4124 49.2411L39.415 49.2444C39.4371 49.274 39.4767 49.3309 39.5333 49.4121C40.3462 50.5782 44.6615 56.7691 51.0481 59.5271C52.6732 60.2291 53.9409 60.6475 54.9303 60.9612C56.5618 61.4796 58.046 61.4068 59.22 61.2313C60.5286 61.0358 63.2487 59.5844 63.8161 57.9938C64.3836 56.4033 64.3836 55.0392 64.2136 54.7554C64.0764 54.5258 63.7545 54.3701 63.2776 54.1395C63.1633 54.0843 63.0401 54.0247 62.9086 53.9588Z'
  },
  {
    id: 'telegram',
    title: 'Написать в Telegram',
    href: 'https://t.me/ecoservisproekt',
    color: '#229ED9',
    path: 'M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z'
  },
  {
    id: 'email',
    title: 'Написать на почту',
    href: 'mailto:info@ecoservisproekt.com',
    color: '#0057b8',
    path: 'M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM51.8276 49.2076L74.191 33.6901C73.4347 32.6649 72.2183 32 70.8466 32H29.1534C27.8336 32 26.6576 32.6156 25.8968 33.5752L47.5881 49.172C48.8512 50.0802 50.5494 50.0945 51.8276 49.2076ZM75 63.6709V37.6286L53.4668 52.57C51.1883 54.151 48.1611 54.1256 45.9095 52.5066L25 37.4719V63.6709C25 65.9648 26.8595 67.8243 29.1534 67.8243H70.8466C73.1405 67.8243 75 65.9648 75 63.6709Z'
  }
]

</script>

<style scoped>
.hc {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
@media (min-width: 1536px) {
  .hc { gap: 0.85rem; }
}

/* ── Режим работы ─────────────────────────────────────────────── */
.hc-hours {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 0.85rem;
  border-right: 1px solid currentColor;
  line-height: 1.15;
}
.hc.is-dark .hc-hours { border-color: rgba(255, 255, 255, 0.22); }
.hc.is-light .hc-hours { border-color: rgba(26, 26, 26, 0.12); }

/* На компактных экранах (шапка с бургером) режим работы не должен растягивать
   сроку: оставляем главную строку («Работаем до 18:00» / «Сейчас закрыто»),
   а уточнение прячем — полный текст доступен на широких экранах. */
.hc-hours-text i { display: none; }
@media (min-width: 1400px) {
  .hc-hours-text i { display: block; }
}

.hc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #9aa0a6;
}
/* Зелёная точка только когда действительно можно дозвониться. */
.hc-dot.is-on {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.hc-hours-text {
  display: flex;
  flex-direction: column;
}
.hc-hours-text b {
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
}
.hc-hours-text i {
  font-size: 0.7rem;
  font-style: normal;
  opacity: 0.65;
  white-space: nowrap;
}

/* ── Телефон ──────────────────────────────────────────────────── */
.hc-phone {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}
.hc-phone:hover { opacity: 0.7; }
.hc-phone svg {
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
}
/* Номер целиком занимает ~150 px — показываем только на широких экранах,
   на остальных остаётся кликабельная иконка трубки. */
.hc-phone-text { display: none; }
@media (min-width: 1536px) {
  .hc-phone-text { display: inline; }
}

/* ── Мессенджеры ──────────────────────────────────────────────── */
.hc-msgs {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* Триггер (мобильный) — скрыт на широких, где мессенджеры стоят в ряд */
.hc-msgs-trigger {
  display: none;
  width: 1.9rem;
  height: 1.9rem;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.hc.is-light .hc-msgs-trigger { background: rgba(26, 26, 26, 0.06); color: #1a1a1a; }
.hc-msgs-trigger:hover { background: rgba(0, 35, 102, 0.18); }
.hc-msgs-trigger svg { width: 1rem; height: 1rem; }

/* Ряд на широких экранах */
.hc-msgs-list {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* На компактных экранах мессенджеры не растягивают шапку: прячем ряд
   и показываем кнопку-тултип, открывающую список. */
@media (max-width: 1024px) {
  .hc-msgs-trigger { display: inline-flex; }
  .hc-msgs-list {
    position: absolute;
    top: calc(100% + 0.6rem);
    right: 0;
    display: none;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.5rem;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
    z-index: 60;
  }
  .hc-msgs.is-open .hc-msgs-list { display: inline-flex; }

  /* Внутри белого попапа иконки тёмные, чтобы читались. Правило должно
     перебивать тему шапки: на тёмном герое .hc.is-dark .hc-msg красил их
     в белый, и попап выглядел пустой белой плашкой — иконки проявлялись
     только после прокрутки, когда шапка светлеет. */
  .hc.is-dark .hc-msgs-list .hc-msg,
  .hc.is-light .hc-msgs-list .hc-msg {
    background: rgba(26, 26, 26, 0.06);
    color: #1a1a1a;
  }
  /* Палец должен попадать: в попапе иконки крупнее строчных. */
  .hc-msgs-list .hc-msg { width: 2.5rem; height: 2.5rem; }
  .hc-msgs-list .hc-msg { width: 2.1rem; height: 2.1rem; }
  .hc-msgs-list { gap: 0.5rem; padding: 0.6rem; }
}

/* Небольшие экраны: чуть ужимаем текст и отступы, чтобы всё влезало */
@media (max-width: 640px) {
  .hc { gap: 0.4rem; }
  .hc-hours { gap: 0.4rem; padding-right: 0.6rem; }
  .hc-hours-text b { font-size: 0.72rem; }
  .hc-phone svg { width: 1rem; height: 1rem; }
  .hc-msg { width: 1.7rem; height: 1.7rem; }
  /* Кнопка «три точки» — тоже пальцевая. */
  .hc-msgs-trigger { width: 2.1rem; height: 2.1rem; }
  .hc-msgs-list .hc-msg { width: 2.5rem; height: 2.5rem; }
}

.hc-msg {
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.hc-msg svg {
  width: 100%;
  height: 100%;
  display: block;
}
/* В покое иконки подчинены шапке, на наведении — фирменный цвет сервиса:
   так ряд не превращается в светофор поверх видео. */
.hc.is-dark .hc-msg { background: #121a22; color: rgba(255, 255, 255, 0.9); }
.hc.is-light .hc-msg { background: #fff; color: #1a1a1a; }
.hc-msg:hover {
  background: #fff;
  color: var(--brand);
  transform: translateY(-1px);
}
</style>
