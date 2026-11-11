<script setup>
import Flow from './Flow.vue'
import Auger from './Auger.vue'
// Шнековый транспортёр: приёмный бункер → наклонный шнек → выгрузка в контейнер
</script>

<template>
  <g>
    <path class="pr-wall" d="M40 190 H190 L150 290 H80 Z" />
    <Auger :x1="96" :y1="318" :x2="660" :y2="110" :w="46" :pitch="30" :dur="1.3" />
    <rect class="pr-wall" x="650" y="70" width="72" height="44" rx="6" />
    <path class="pr-ln" d="M640 122 L670 150 V270" />
    <rect class="pr-wall" x="600" y="270" width="140" height="92" rx="6" />
    <rect class="pr-sludge" x="602" y="320" width="136" height="40" />
    <Flow d="M70 120 Q100 200 112 300 L644 118 Q664 132 670 160 V336" :n="16" :dur="12" kind="dirt" :r="3.8" />
    <Flow d="M150 120 Q130 220 124 296 L648 114 Q668 130 674 170 V330" :n="10" :dur="12" kind="sand" :r="3" :delay="0.5" />
    <text class="pr-tx" x="40" y="106">Отбросы, песок, осадок</text>
    <text class="pr-tx" x="670" y="384" text-anchor="middle">Выгрузка</text>
  </g>
</template>
