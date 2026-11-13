<template>
  <!-- Режим работы офиса: статус, обратный отсчёт и шкала рабочего дня
       9:00–18:00 с обедом и бегунком «сейчас» (минское время) -->
  <div class="wd" :class="[`wd--${tone}`, { 'wd--compact': compact, 'is-ready': !!s }, s && `is-${s.kind}`]" role="status" aria-live="off">
    <div class="wd-top">
      <span class="wd-dot" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg></span>
      <b class="wd-title">{{ s ? s.title : `${H.days} · ${hh(H.open)}–${hh(H.close)}` }}</b>
      <span v-if="s" class="wd-cd"><small>{{ s.cdLabel }}</small> <em>{{ s.cd }}</em></span>
    </div>
    <div class="wd-bar" aria-hidden="true">
      <div class="wd-track">
        <i class="wd-fill" :style="{ transform: `scaleX(${s ? fillPos : 0})` }" />
        <i class="wd-lunch" :style="{ left: pct(H.lunchFrom), width: span(H.lunchFrom, H.lunchTo) }" />
      </div>
      <span v-if="s" class="wd-now" :class="{ 'is-start': s.pos < 0.1, 'is-end': s.pos > 0.9 }" :style="{ left: `${(s.pos * 100).toFixed(2)}%` }"><i><svg viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1.2c3.3 4 6.2 7.4 6.2 11.2a6.2 6.2 0 0 1-12.4 0C1.8 8.6 4.7 5.2 8 1.2Z" /></svg></i></span>
      <div class="wd-ticks">
        <span :style="{ left: '0%' }">{{ hh(H.open) }}</span>
        <span class="wd-tick--lunch" :style="{ left: mid(H.lunchFrom, H.lunchTo) }">обед</span>
        <span :style="{ left: '100%' }">{{ hh(H.close) }}</span>
      </div>
    </div>
    <p v-if="!compact" class="wd-foot">{{ H.days }} {{ hh(H.open) }}–{{ hh(H.close) }}, обед {{ hh(H.lunchFrom) }}–{{ hh(H.lunchTo) }} · время минское</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkHours } from '~/composables/useWorkHours'

defineProps({
  tone: { type: String, default: 'light' }, // light | glass
  compact: { type: Boolean, default: false }
})

const { state: s, H } = useWorkHours()
const L = H.close - H.open
const pct = (m) => `${(((m - H.open) / L) * 100).toFixed(2)}%`
const span = (a, b) => `${(((b - a) / L) * 100).toFixed(2)}%`
const mid = (a, b) => `${((((a + b) / 2 - H.open) / L) * 100).toFixed(2)}%`
const hh = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
// Заливка «прошедшего» рабочего времени — только в рабочие дни
const fillPos = computed(() => (s.value && !s.value.offDay ? s.value.pos : 0))
</script>

<style scoped>
.wd { --g: #006039; --ink: #1A1A1A; --mute: #5E5E5E; --track: #EDEDED; font-family: var(--dj-font); color: var(--ink); }
.wd-top { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
/* Индикатор у заголовка — часы, цвет по состоянию */
.wd-dot { position: relative; flex: none; display: block; width: 16px; height: 16px; color: #002366; transition: color 0.4s ease; }
.wd-dot svg { display: block; width: 100%; height: 100%; }
.is-open .wd-dot { color: #002366; }

.wd-title { font-size: 15px; line-height: 1.25; font-weight: 600; letter-spacing: -0.01em; }
.wd-cd { margin-left: auto; font-size: 13px; color: var(--mute); white-space: nowrap; }
.wd-cd em { font-style: normal; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
.is-open .wd-cd em { color: var(--g); }

.wd-bar { position: relative; margin-top: 30px; padding-bottom: 18px; }
.wd-track { position: relative; height: 6px; border-radius: 999px; background: var(--track); overflow: hidden; }
.wd-fill { position: absolute; inset: 0; transform-origin: left center; background: linear-gradient(90deg, rgba(0, 96, 57, 0.35), var(--g)); border-radius: inherit; transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.is-closed .wd-fill { background: #c7c7cc; }
.wd-lunch { position: absolute; top: 0; bottom: 0; background: repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0 2px, transparent 2px 5px); }
/* «Сейчас» — фирменная капля цвета состояния (зелёная, пока открыто) */
.wd-now { position: absolute; top: -9px; width: 0; transition: left 1.2s cubic-bezier(0.16, 1, 0.3, 1); color: #002366; }
.wd-now i { position: absolute; left: -7px; top: -2px; width: 14px; height: 18px; filter: drop-shadow(0 0 0 #fff) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25)); }
.wd-now i svg { display: block; width: 100%; height: 100%; fill: currentColor; stroke: #fff; stroke-width: 1.4; }
.is-open .wd-now { color: #002366; }

.wd-now small { position: absolute; bottom: calc(100% + 10px); left: 0; transform: translateX(-50%); padding: 1px 6px; border-radius: 6px; font-size: 11px; font-weight: 600; line-height: 1.4; color: #fff; background: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; opacity: 0; transition: opacity 0.3s ease 0.9s; }
.is-ready .wd-now small { opacity: 1; }
/* У краёв шкалы подпись «сейчас» не вылезает за карточку */
.wd-now.is-start small { transform: translateX(-8px); }
.wd-now.is-end small { transform: translateX(calc(-100% + 8px)); }
.wd-ticks { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; }
.wd-ticks span { position: absolute; top: 0; transform: translateX(-50%); font-size: 11px; line-height: 14px; color: var(--mute); font-variant-numeric: tabular-nums; white-space: nowrap; }
.wd-ticks span:first-child { transform: none; }
.wd-ticks span:last-child { transform: translateX(-100%); }
.wd-foot { margin-top: 10px; font-size: 12px; line-height: 1.4; color: var(--mute); }

/* Компакт: в меню телефона и в карточке «Готовы помочь» */
.wd--compact .wd-title { font-size: 13px; }
.wd--compact .wd-cd { font-size: 12px; margin-left: 16px; flex-basis: 100%; }
.wd--compact .wd-bar { margin-top: 30px; }

/* Мобильный: отсчёт уходит на свою строку, чтобы не ломать заголовок */
@media (max-width: 480px) {
  .wd-cd { margin-left: 16px; flex-basis: 100%; }
}

@keyframes wd-ping { 0% { transform: scale(0.6); opacity: 0.7; } 80%, 100% { transform: scale(1.6); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .wd-fill, .wd-now, .wd-now small { transition: none; }
  .is-open .wd-dot::after { animation: none; }
}
</style>
