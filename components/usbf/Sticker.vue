<template>
  <!-- Наклейка из стикер-пака USBF: вырубка с белым кантом, тень, лёгкий наклон.
       Каждая — один факт о технологии, который подтверждён на сайте. -->
  <span class="us" :class="`us--${kind}`" :style="{ '--tilt': tilt + 'deg', '--s': size }"  role="img" :aria-label="tip.h + '. ' + tip.p" tabindex="0">
    <template v-if="kind === 'main'">
      <svg class="us-ring" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="58" fill="#002366" />
        <!-- Надпись по кругу: каждая буква на своём угле — без разрыва, шаг ровный -->
        <text v-for="(c, i) in RING" :key="i" x="60" y="15.2" text-anchor="middle" font-size="9.6" font-weight="600" fill="#fff" fill-opacity=".92" :transform="`rotate(${(i * 360) / RING.length} 60 60)`">{{ c }}</text>
      </svg>
      <span class="us-core"><UsbfMark bg="#FFFFFF" fg="#002366" accent="#1B9BE0" /><b>USBF</b></span>
    </template>
    <template v-else-if="kind === 'chip'">
      <span class="us-chipmark"><UsbfMark /></span><b>USBF</b>
    </template>
    <template v-else>
      <b>{{ KINDS[kind].big }}</b><small>{{ KINDS[kind].small }}</small>
    </template>
    <!-- Подсказка при наведении/фокусе: наклейка выпрямляется, над ней — пояснение -->
    <span class="us-tip" aria-hidden="true"><b>{{ tip.h }}</b><span>{{ tip.p }}</span></span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  kind: { type: String, default: 'main' },
  tilt: { type: Number, default: -6 },
  size: { type: Number, default: 1 }
})
// Факты — из описания станции ВС и главы «Технология USBF» на сайте
const KINDS = {
  98: { big: 'до 98 %', small: 'очистка по БПК и ХПК', t: 'До 98 % очистки' },
  np: { big: 'N + P', small: 'азот и фосфор — биологически', t: 'Азот и фосфор — биологически' },
  one: { big: '1 резервуар', small: 'предочистка + биология', t: 'Всё в одном резервуаре' },
  up: { big: '↑ снизу вверх', small: 'вода фильтруется через ил', t: 'Поток снизу вверх' },
  steel: { big: 'AISI 304', small: 'нержавейка внутри', t: 'Нержавейка AISI-304' },
  years: { big: '28 лет', small: 'в биологической очистке', t: '28 лет опыта' }
}
// Кольцо: две фразы через разделитель «•», повторяется ровно по окружности
const RING = [...'ВОСХОДЯЩИЙ ПОТОК • ЖИВОЙ ФИЛЬТР • ']
const MAIN = { h: 'USBF — восходящая фильтрация через ил', p: 'Вода поднимается снизу вверх сквозь «одеяло» из активного ила: бактерии съедают загрязнения, сверху выходит чистая вода. Всё — в одном резервуаре.' }
const TIPS = {
  98: 'Так глубоко очищается вода по органике (БПК и ХПК) — можно сбрасывать в водоём.',
  np: 'Азот и фосфор удаляют сами бактерии, без лишней химии: вода не «цветёт» в реке.',
  one: 'Предочистка, биология и осветление — в одном корпусе: меньше площади и трубопроводов.',
  up: 'Поток идёт снизу вверх через слой ила — он задерживает взвесь, как фильтр.',
  steel: 'Всё, что внутри и контактирует с водой, — из нержавеющей стали AISI-304.',
  years: 'Столько лет ESP строит и запускает станции биологической очистки.'
}
const tip = computed(() => (props.kind === 'main' || props.kind === 'chip' ? MAIN : { h: KINDS[props.kind]?.t || '', p: TIPS[props.kind] || '' }))
</script>

<style scoped>
.us {
  --tilt: -6deg; --s: 1;
  position: relative; display: inline-flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px;
  padding: calc(10px * var(--s)) calc(16px * var(--s)); border-radius: calc(16px * var(--s));
  font-family: var(--dj-font); color: #fff; background: #002366;
  /* белый кант вырубки + мягкая тень, как у настоящей наклейки */
  box-shadow: 0 0 0 calc(4px * var(--s)) #fff, 0 calc(6px * var(--s)) calc(16px * var(--s)) rgba(0, 20, 60, 0.22), 0 1px 2px rgba(0, 20, 60, 0.18);
  transform: rotate(var(--tilt)); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
  white-space: nowrap; user-select: none;
}
.us:hover { transform: rotate(0deg) translateY(-3px) scale(1.04); }
/* блик по плёнке */
.us::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(120deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 38%); }
.us > b { font-size: calc(22px * var(--s)); line-height: 1.05; font-weight: 600; letter-spacing: -0.01em; }
.us > small { font-size: calc(12px * var(--s)); line-height: 1.2; opacity: 0.86; }
.us::after { z-index: 0; }
.us--98 { background: #006039; }
.us--np { background: #fff; color: #002366; }
.us--np small { color: #5E5E5E; opacity: 1; }
.us--up { background: #1B9BE0; }
.us--steel { background: linear-gradient(135deg, #F4F5F7, #C9CDD3 55%, #EEF0F2); color: #1A1A1A; }
.us--steel small { color: #4A4A4A; opacity: 1; }
.us--years { background: #1A1A1A; }
.us--main { width: calc(120px * var(--s)); height: calc(120px * var(--s)); padding: 0; border-radius: 50%; background: none; align-items: center; }
.us--main::after { border-radius: 50%; }
.us-ring { position: absolute; inset: 0; width: 100%; height: 100%; }
.us-core { position: relative; display: grid; justify-items: center; gap: calc(3px * var(--s)); }
.us-core :deep(.um) { width: calc(42px * var(--s)); height: calc(42px * var(--s)); }
.us-core b { font-size: calc(17px * var(--s)); letter-spacing: 0.04em; }
.us--chip { flex-direction: row; align-items: center; gap: calc(7px * var(--s)); padding: calc(5px * var(--s)) calc(12px * var(--s)) calc(5px * var(--s)) calc(5px * var(--s)); border-radius: 999px; }
.us--chip > b { font-size: calc(15px * var(--s)); letter-spacing: 0.04em; }
.us-chipmark { display: block; width: calc(26px * var(--s)); height: calc(26px * var(--s)); }
.us-chipmark :deep(rect) { fill: #fff; fill-opacity: 0.14; }
.us:focus-visible { outline: 2px solid #1B9BE0; outline-offset: 6px; }
/* Подсказка: стеклянная карточка над наклейкой */
.us-tip {
  position: absolute; left: 50%; bottom: calc(100% + 14px); z-index: 20; display: grid; gap: 4px;
  width: max-content; max-width: 260px; padding: 12px 14px; border-radius: 14px;
  font-size: 13px; line-height: 1.4; font-weight: 400; color: #5E5E5E; text-align: left; white-space: normal;
  background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 12px 32px rgba(0, 20, 60, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.04);
  opacity: 0; visibility: hidden; transform: translate(-50%, 6px); pointer-events: none;
  transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s 0.25s;
}
.us-tip::after { content: ''; position: absolute; left: 50%; top: 100%; width: 12px; height: 12px; margin: -6px 0 0 -6px; background: inherit; transform: rotate(45deg); border-radius: 0 0 3px 0; }
.us-tip b { font-size: 14px; line-height: 1.3; color: #1A1A1A; }
.us:hover .us-tip, .us:focus-visible .us-tip { opacity: 1; visibility: visible; transform: translate(-50%, 0); transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.us--main .us-tip { font-size: 13px; }
@media (hover: none) { .us:focus .us-tip { opacity: 1; visibility: visible; transform: translate(-50%, 0); } }
@media (prefers-reduced-motion: reduce) { .us, .us-tip { transition: none; } }
</style>
