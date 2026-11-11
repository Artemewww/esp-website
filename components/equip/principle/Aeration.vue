<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
// Аэрация: воздуходувка → распределительный трубопровод → гребёнка
// с аэрационными элементами на дне → кислородный датчик
const elems = [320, 390, 460, 530, 600, 670]
</script>

<template>
  <g>
    <rect class="pr-wall" x="240" y="100" width="520" height="260" rx="6" />
    <rect class="pr-water" x="242" y="132" width="516" height="226" />
    <rect class="pr-wall" x="30" y="60" width="110" height="70" rx="10" />
    <Oct :cx="85" :cy="95" :r="22" :spin="1" />
    <path class="pr-pipe pr-pipe--air" d="M140 95 H200 V336 H720" />
    <rect v-for="x in elems" :key="x" class="pr-solid-soft" :x="x - 22" y="330" width="44" height="10" rx="3" />
    <Flow d="M140 95 H200 V336 H720" :n="14" :dur="6" kind="air" :r="2.4" />
    <Flow v-for="(x, i) in elems" :key="'b' + x" :d="`M${x} 326 Q${x + 10} 230 ${x} 136`" :n="4" :dur="3.2 + (i % 3) * 0.35" kind="air" :r="2.5" :delay="i * 0.2" />
    <!-- кислородный датчик -->
    <path class="pr-ln" d="M697 80 V100" />
    <rect class="pr-wall" x="690" y="96" width="14" height="110" rx="4" />
    <rect class="pr-accent" x="692" y="186" width="10" height="16" rx="2" />
    <path class="pr-dash" d="M697 80 V36 H85 V60" />
    <text class="pr-tx" x="85" y="152" text-anchor="middle">Воздух</text>
  </g>
</template>
