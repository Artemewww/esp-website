<script setup>
import Flow from './Flow.vue'
// Прямоугольная ёмкость из полипропилена: наполнение, аэрация, подача на полив
const bubbles = [260, 330, 400, 470, 540]
</script>

<template>
  <g>
    <path class="pr-pipe" d="M60 70 H230 V100 M600 322 H760" />
    <rect class="pr-wall" x="200" y="90" width="400" height="250" rx="4" />
    <rect class="pr-water" x="202" y="250" width="396" height="88">
      <animate attributeName="y" values="262;150;262" dur="12s" repeatCount="indefinite" />
      <animate attributeName="height" values="76;188;76" dur="12s" repeatCount="indefinite" />
    </rect>
    <path class="pr-thin" d="M300 90 V340 M400 90 V340 M500 90 V340 M200 215 H600" />
    <path class="pr-dash" d="M230 328 H570" />
    <Flow d="M60 70 H230 V250" :n="8" :dur="4" />
    <Flow v-for="(x, i) in bubbles" :key="x" :d="`M${x} 326 Q${x + 8} 300 ${x} 270`" :n="2" :dur="2.4" kind="air" :r="2.4" :delay="i * 0.3" />
    <Flow d="M560 322 H760" :n="6" :dur="4" />
    <text class="pr-tx" x="60" y="56">Подача</text>
    <text class="pr-tx" x="760" y="308" text-anchor="end">Полив</text>
  </g>
</template>
