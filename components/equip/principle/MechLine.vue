<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
import Auger from './Auger.vue'
// Механическая очистка: песколовка → барабанная решётка → шнек → микрофильтр
const sand = [70, 105, 140]
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 150 H40 M170 150 H222 M360 200 H560 M760 282 H800" />
    <!-- песколовка -->
    <path class="pr-wall" d="M40 110 V250 L90 300 H120 L170 250 V110" />
    <path class="pr-water" d="M42 136 V249 L91 298 H119 L168 249 V136 Z" />
    <path class="pr-dash" d="M105 300 V340 H200" />
    <!-- барабанная решётка -->
    <rect class="pr-wall" x="220" y="120" width="140" height="140" rx="6" />
    <rect class="pr-water" x="222" y="150" width="136" height="108" />
    <Oct :cx="290" :cy="190" :r="52" :spin="8" mesh :fill="false" />
    <!-- шнек и накопитель -->
    <Auger :x1="322" :y1="128" :x2="440" :y2="52" :w="30" :pitch="20" />
    <rect class="pr-wall" x="440" y="52" width="64" height="52" rx="6" />
    <rect class="pr-sludge" x="442" y="80" width="60" height="22" />
    <!-- микрофильтр -->
    <rect class="pr-wall" x="520" y="110" width="240" height="190" rx="6" />
    <rect class="pr-water" x="522" y="230" width="236" height="68" />
    <Oct :cx="640" :cy="205" :r="72" :spin="10" mesh :fill="false" />
    <path class="pr-ln" d="M580 122 H700" />
    <path class="pr-spray" d="M600 124 V142 M640 124 V142 M680 124 V142" />
    <rect class="pr-solid-soft" x="618" y="160" width="44" height="10" rx="2" />
    <Flow d="M0 150 H40 Q100 160 170 150 H222 Q260 150 280 200 Q310 236 360 200 H600 Q640 210 680 262 Q700 284 760 282 H800" :n="22" :dur="13" />
    <Flow v-for="(x, i) in sand" :key="x" :d="`M${x} 150 Q${x + 6} 230 105 292`" :n="2" :dur="2.6" kind="sand" :r="3" :delay="i * 0.5" />
    <Flow d="M105 300 V340 H200" :n="3" :dur="3" kind="sand" :r="3" />
    <Flow d="M170 146 H226 Q256 170 268 228 Q300 246 326 200 Q336 150 330 126 L440 54 Q462 62 470 86" :n="6" :dur="9" kind="dirt" :r="3.6" />
    <Flow d="M360 196 H580 Q610 190 640 166" :n="5" :dur="6" kind="dirt" :r="3" />
    <text class="pr-tx" x="8" y="136">Сток</text>
    <text class="pr-tx" x="796" y="270" text-anchor="end">Вода</text>
  </g>
</template>
