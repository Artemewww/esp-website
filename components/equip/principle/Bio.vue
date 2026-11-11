<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
// Биологическая очистка в едином прямоугольном резервуаре:
// приёмная зона → аэрация активного ила → вторичное отстаивание → выпуск
const bubbles = [280, 320, 360, 400, 440, 480]
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 140 H62 M738 140 H800" />
    <rect class="pr-wall" x="60" y="100" width="680" height="240" rx="6" />
    <rect class="pr-water" x="62" y="128" width="676" height="210" />
    <path class="pr-ln" d="M230 100 V300 M520 100 V250 L600 330" />
    <!-- воздуходувка и подача воздуха -->
    <rect class="pr-wall" x="330" y="30" width="90" height="46" rx="8" />
    <Oct :cx="375" :cy="53" :r="14" :spin="1.2" />
    <path class="pr-ln" d="M375 76 V318" />
    <rect class="pr-solid-soft" x="260" y="316" width="240" height="6" rx="3" />
    <Flow d="M0 145 H150 Q215 160 215 260 Q218 318 262 318 H300" :n="7" :dur="7" kind="dirt" :r="3.4" />
    <Flow d="M300 300 C240 220 300 150 380 160 C470 170 510 240 470 290 C430 330 340 330 300 300" :n="12" :dur="10" kind="dirt" :r="3.2" />
    <Flow v-for="(x, i) in bubbles" :key="x" :d="`M${x} 312 Q${x + 8} 220 ${x} 134`" :n="3" :dur="3 + (i % 3) * 0.4" kind="air" :r="2.4" :delay="i * 0.25" />
    <path class="pr-dash" d="M650 334 Q600 362 520 354 H300" />
    <Flow d="M650 334 Q600 362 520 354 H300" :n="4" :dur="8" kind="dirt" :r="2.8" />
    <Flow d="M440 250 Q520 270 600 250 Q660 230 690 160 Q700 140 740 140 H800" :n="10" :dur="7" />
    <text class="pr-tx" x="8" y="126">Сток</text>
    <text class="pr-tx" x="796" y="126" text-anchor="end">Очищенная вода</text>
  </g>
</template>
