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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <g :transform="m.fit">
              <path v-for="(d, k) in m.paths" :key="k" :d="d" />
            </g>
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
const messengers = [
  {
    id: 'whatsapp',
    title: 'Написать в WhatsApp',
    href: 'https://wa.me/375291656061',
    color: '#25D366',
    paths: [
      'M3.5 20.5 4.8 16.6a8.2 8.2 0 1 1 3 3z',
      'M8.9 8.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.5.6c-.1.2-.2.3-.1.5a6.4 6.4 0 0 0 3 2.9c.2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.8.9c.2.1.4.2.4.4a2 2 0 0 1-1.3 1.6c-.4.1-1 .2-2.9-.6a10 10 0 0 1-4.5-4.2c-.6-1.1-.7-2.1-.4-2.9z'
    ]
  },
  {
    id: 'telegram',
    title: 'Написать в Telegram',
    href: 'https://t.me/ecoservisproekt',
    color: '#229ED9',
    fit: 'translate(0.42,0.7) scale(0.93)',
    paths: [
      'M21.2 4.3 2.9 11.2c-.6.2-.6.9 0 1.1l4.6 1.5 1.8 5.3c.2.5.8.6 1.1.2l2.4-2.4 4.6 3.4c.4.3 1 .1 1.1-.4L22 5.1c.1-.6-.3-1-.8-.8z',
      'M7.5 13.8 19.4 6.4',
      'M7.5 13.8l4 1.5 1.3 2.6'
    ]
  },
  {
    id: 'email',
    title: 'Написать на почту',
    href: 'mailto:info@ecoservisproekt.com',
    color: '#0057b8',
    paths: [
      'M3.2 6.4h17.6v11.2H3.2z',
      'M3.6 6.9 12 13.1l8.4-6.2'
    ]
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

  /* Внутри белого попапа иконки тёмные, чтобы читались */
  .hc-msgs-list .hc-msg { background: rgba(26, 26, 26, 0.06); color: #1a1a1a; }
}

/* Небольшие экраны: чуть ужимаем текст и отступы, чтобы всё влезало */
@media (max-width: 640px) {
  .hc { gap: 0.4rem; }
  .hc-hours { gap: 0.4rem; padding-right: 0.6rem; }
  .hc-hours-text b { font-size: 0.72rem; }
  .hc-phone svg { width: 1rem; height: 1rem; }
  .hc-msg { width: 1.7rem; height: 1.7rem; }
  .hc-msgs-trigger { width: 1.7rem; height: 1.7rem; }
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
  width: 1.1rem;
  height: 1.1rem;
}
/* В покое иконки подчинены шапке, на наведении — фирменный цвет сервиса:
   так ряд не превращается в светофор поверх видео. */
.hc.is-dark .hc-msg { background: rgba(255, 255, 255, 0.14); color: #fff; }
.hc.is-light .hc-msg { background: rgba(26, 26, 26, 0.06); color: #1a1a1a; }
.hc-msg:hover {
  background: var(--brand);
  color: #fff;
  transform: translateY(-1px);
}
</style>
