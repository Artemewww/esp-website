<template>
  <!-- «USBF простым языком»: разрез блока и номера-точки на нём (как на
       карточках мерча), справа/ниже — что происходит на каждом шаге.
       Вокруг — наклейки стикер-пака: один факт = одна наклейка. -->
  <section id="usbf" class="ue dj-sec dj-bp dj-bp--grain" aria-labelledby="ue-h">
    <div class="dj-wrap dj-wrap--wide u-wrap">
      <div class="ue-head">
        <UsbfSticker kind="main" :tilt="-8" :size="0.82" class="ue-badge" />
        <div>
          <span class="dj-eyebrow">Технология USBF</span>
          <h2 id="ue-h" class="dj-h2 dj-ink">Ил работает как живой фильтр</h2>
          <p class="ue-lede">USBF (Upflow Sludge Blanket Filtration) — восходящая фильтрация через слой активного ила. Грязная вода поднимается снизу вверх сквозь «одеяло» из ила: бактерии съедают загрязнения, а сверху выходит чистая вода. Всё — в одном резервуаре.</p>
        </div>
      </div>

      <div class="ue-stage">
        <figure class="ue-fig">
          <img src="/images/home/covers/usbf-cutaway.webp" alt="Блок USBF в разрезе: вход, аноксидная зона, аэрация, осветлитель со слоем ила, выход чистой воды" loading="lazy" decoding="async" />
          <button v-for="(p, i) in POINTS" :key="p.t" type="button" class="ue-pt" :class="{ 'is-on': on === i }" :style="{ left: p.x + '%', top: p.y + '%' }" :aria-label="`${i + 1}. ${p.t}`" @click="on = i" @mouseenter="on = i">{{ i + 1 }}</button>
          <div class="ue-tip" :style="tipStyle" role="status">
            <b>{{ POINTS[on].t }}</b><span>{{ POINTS[on].d }}</span>
          </div>
        </figure>
        <ol class="ue-list">
          <li v-for="(p, i) in POINTS" :key="p.t" :class="{ 'is-on': on === i }" @click="on = i" @mouseenter="on = i">
            <i>{{ i + 1 }}</i><span><b>{{ p.t }}</b>{{ p.d }}</span>
          </li>
        </ol>
      </div>

      <div class="ue-pack" aria-label="Коротко о USBF">
        <UsbfSticker kind="98" :tilt="-5" />
        <UsbfSticker kind="np" :tilt="4" />
        <UsbfSticker kind="one" :tilt="-3" />
        <UsbfSticker kind="up" :tilt="6" />
        <UsbfSticker kind="steel" :tilt="-7" />
        <UsbfSticker kind="years" :tilt="3" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
// Координаты точек — в процентах кадра usbf-cutaway.webp (1536×1024)
const POINTS = [
  { x: 6, y: 42, t: 'Вход', d: 'Сточная вода после решёток и песколовок поступает в резервуар.' },
  { x: 20, y: 62, t: 'Зона без воздуха', d: 'Мешалка, кислорода нет: бактерии превращают нитраты в азот — он уходит в воздух.' },
  { x: 49, y: 66, t: 'Аэрация', d: 'Мелкие пузыри снизу дают кислород: ил «дышит» и съедает органику.' },
  { x: 39, y: 16, t: 'Воздуходувка', d: 'Подаёт ровно столько воздуха, сколько нужно, — скорость регулируется.' },
  { x: 79, y: 50, t: 'Иловое «одеяло»', d: 'Вода идёт снизу вверх через слой ила — он задерживает взвесь, как фильтр.' },
  { x: 92, y: 23, t: 'Чистая вода', d: 'Сверху выходит очищенная вода: до 98 % по БПК и ХПК.' }
]
const on = ref(4)
// Подсказка у активной точки, не выходит за края кадра
const tipStyle = computed(() => {
  const p = POINTS[on.value]
  const left = Math.min(Math.max(p.x, 18), 82)
  return { left: left + '%', top: p.y > 50 ? 'auto' : `calc(${p.y}% + 26px)`, bottom: p.y > 50 ? `calc(${100 - p.y}% + 26px)` : 'auto' }
})
</script>

<style scoped>
.ue { background: #F5F5F7; }
.ue-head { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 28px; }
.ue-badge { margin: 6px; }
.ue-lede { margin: 12px 0 0; max-width: 42em; font-size: 19px; line-height: 1.45; color: #3A3A3C; }
.ue-stage { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 32px; align-items: center; margin-top: 40px; }
.ue-fig { position: relative; margin: 0; }
.ue-fig img { display: block; width: 100%; height: auto; border-radius: var(--r-md, 18px); mix-blend-mode: multiply; }
.ue-pt { position: absolute; display: grid; place-items: center; width: 30px; height: 30px; margin: -15px 0 0 -15px; border: 2px solid #fff; border-radius: 50%; background: #002366; color: #fff; font: 600 13px/1 var(--dj-font); cursor: pointer; box-shadow: 0 4px 12px rgba(0, 35, 102, 0.35); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease; }
.ue-pt::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid rgba(0, 35, 102, 0.35); animation: ue-pulse 2.4s ease-out infinite; }
.ue-pt.is-on { background: #1B9BE0; transform: scale(1.15); }
@keyframes ue-pulse { from { opacity: 0.9; transform: scale(0.8); } to { opacity: 0; transform: scale(1.6); } }
.ue-tip { position: absolute; z-index: 2; display: grid; gap: 4px; width: min(260px, 70%); padding: 12px 14px; border-radius: 14px; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 10px 30px rgba(0, 20, 60, 0.18); transform: translateX(-50%); pointer-events: none; transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.ue-tip b { font-size: 15px; color: #1A1A1A; }
.ue-tip span { font-size: 13px; line-height: 1.4; color: #5E5E5E; }
.ue-list { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; counter-reset: none; }
.ue-list li { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 12px; padding: 10px 12px; border-radius: 14px; cursor: pointer; transition: background-color 0.2s ease; }
.ue-list li.is-on { background: #fff; box-shadow: var(--sh-1); }
.ue-list i { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #E3E3E6; color: #1A1A1A; font: normal 600 12px/1 var(--dj-font); }
.ue-list li.is-on i { background: #002366; color: #fff; }
.ue-list span { display: grid; gap: 2px; font-size: 14px; line-height: 1.4; color: #5E5E5E; }
.ue-list b { font-size: 16px; color: #1A1A1A; }
.ue-pack { display: flex; flex-wrap: wrap; justify-content: center; gap: 22px 26px; margin-top: 48px; padding: 8px; }
@media (max-width: 900px) {
  .ue-stage { grid-template-columns: 1fr; gap: 16px; }
}
@media (max-width: 734px) {
  .ue-head { grid-template-columns: 1fr; gap: 12px; }
  .ue-badge { justify-self: start; }
  .ue-lede { font-size: 16px; }
  .ue-stage { margin-top: 24px; }
  .ue-pt { width: 24px; height: 24px; margin: -12px 0 0 -12px; font-size: 11px; }
  /* на телефоне подсказку даёт список под картинкой — карточка на кадре не нужна */
  .ue-tip { display: none; }
  .ue-pack { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; margin: 28px -16px 0; padding: 14px 20px; scrollbar-width: none; }
  .ue-pack::-webkit-scrollbar { display: none; }
  .ue-pack > * { flex: none; }
}
@media (prefers-reduced-motion: reduce) { .ue-pt::before { animation: none; } }
</style>
