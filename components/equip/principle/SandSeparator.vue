<script setup>
import Flow from './Flow.vue'
import Auger from './Auger.vue'
// Сепаратор песка: приёмный бункер → наклонный шнек выводит песок → вода дальше
const sand = [170, 230, 290, 350]
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 160 H122 M418 170 H800" />
    <path class="pr-wall" d="M120 120 V270 L200 330 H420 V120" />
    <path class="pr-water" d="M122 148 V269 L201 328 H418 V148 Z" />
    <path class="pr-sludge" d="M180 315 L201 328 H418 V300 H240 Z" />
    <Auger :x1="396" :y1="318" :x2="700" :y2="92" :w="38" />
    <path class="pr-ln" d="M700 92 L728 116 V250" />
    <rect class="pr-wall" x="680" y="250" width="96" height="110" rx="6" />
    <rect class="pr-sludge" x="682" y="318" width="92" height="40" />
    <Flow d="M0 160 H200 Q300 172 380 170 H800" :n="14" :dur="8" />
    <Flow v-for="(x, i) in sand" :key="x" :d="`M${x - 40} 160 Q${x} 200 ${x + 20} 310`" :n="2" :dur="2.8" kind="sand" :r="3" :delay="i * 0.5" />
    <Flow d="M380 316 L700 92 Q722 100 728 120 V330" :n="10" :dur="9" kind="sand" :r="3.4" />
    <text class="pr-tx" x="8" y="146">Сток</text>
    <text class="pr-tx" x="796" y="196" text-anchor="end">Вода дальше</text>
    <text class="pr-tx" x="728" y="384" text-anchor="middle">Песок</text>
  </g>
</template>
