<script setup>
import { useId } from 'vue'
import Flow from './Flow.vue'
// Напорная флотация: флокуляция → смешение → флотокамера со скребком → отвод
const clip = 'pr-fl-' + useId()
const bubbles = [360, 410, 460, 510, 560, 600]
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 145 H92 M740 252 H800 M655 80 H800 M275 300 V385" />
    <rect class="pr-wall" x="90" y="90" width="650" height="240" rx="6" />
    <rect class="pr-water" x="92" y="118" width="646" height="210" />
    <rect class="pr-sludge" x="322" y="118" width="306" height="12" />
    <path class="pr-ln" d="M230 330 V170 M320 90 V290 M630 90 V290" />
    <!-- лоток сбора шлама -->
    <rect class="pr-wall" x="606" y="58" width="50" height="40" rx="4" />
    <rect class="pr-sludge" x="608" y="76" width="46" height="20" />
    <!-- скребковый механизм -->
    <clipPath :id="clip"><rect x="330" y="96" width="276" height="30" /></clipPath>
    <path class="pr-thin" d="M330 104 H606" />
    <rect class="pr-solid" x="326" y="100" width="8" height="8" rx="2" />
    <rect class="pr-solid" x="600" y="100" width="8" height="8" rx="2" />
    <g :clip-path="`url(#${clip})`">
      <g>
        <rect v-for="k in 7" :key="k" :x="270 + k * 50" y="104" width="3" height="20" rx="1" class="pr-solid" />
        <animateTransform attributeName="transform" type="translate" from="0 0" to="50 0" dur="2.6s" repeatCount="indefinite" />
      </g>
    </g>
    <!-- узел насыщения воздухом под давлением -->
    <rect class="pr-wall" x="248" y="352" width="54" height="34" rx="6" />
    <Flow d="M275 386 V300" :n="5" :dur="2.4" kind="air" :r="2.5" />
    <Flow d="M20 145 H200 Q245 145 268 200 Q285 262 300 300 Q312 316 345 314 H600 Q636 314 650 292 Q664 262 700 252 H800" :n="16" :dur="10" />
    <Flow d="M0 150 H198 Q240 150 262 205 Q280 260 318 300 Q360 300 395 220 Q420 150 450 128 Q470 122 500 124 H612 Q628 122 630 100 V82 H800" :n="10" :dur="12" kind="dirt" :r="3.5" />
    <Flow v-for="(x, i) in bubbles" :key="x" :d="`M${x} 306 Q${x + 9} 220 ${x} 132`" :n="3" :dur="3.2 + (i % 3) * 0.4" kind="air" :r="2.6" :delay="i * 0.3" />
    <text class="pr-tx" x="8" y="132">Сток</text>
    <text class="pr-tx" x="796" y="240" text-anchor="end">Очищенная вода</text>
    <text class="pr-tx" x="796" y="70" text-anchor="end">Шлам</text>
  </g>
</template>
