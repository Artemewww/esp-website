<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
// КНС: приём стоков → управление по уровню → погружные насосы → напорный трубопровод
const props = defineProps({ single: Boolean })
const pumps = props.single ? [400] : [330, 470]
</script>

<template>
  <g>
    <path class="pr-ground" d="M0 100 H250 M550 100 H800" />
    <path class="pr-pipe" d="M0 190 H252" />
    <path v-for="c in pumps" :key="'p' + c" class="pr-pipe" :d="`M${c} 300 V128 Q${c} 120 ${c + 8} 120 H800`" />
    <rect class="pr-wall" x="250" y="70" width="300" height="300" rx="6" />
    <rect class="pr-solid-soft" x="244" y="62" width="312" height="10" rx="3" />
    <rect class="pr-water" x="252" y="260" width="296" height="108">
      <animate attributeName="y" values="262;182;262" dur="10s" repeatCount="indefinite" />
      <animate attributeName="height" values="106;186;106" dur="10s" repeatCount="indefinite" />
    </rect>
    <path v-for="c in pumps" :key="'r' + c" class="pr-thin" :d="`M${c - 40} 76 V306 M${c - 34} 76 V306`" />
    <g v-for="c in pumps" :key="'b' + c">
      <rect class="pr-wall" :x="c - 32" y="300" width="64" height="56" rx="8" />
      <Oct :cx="c" :cy="328" :r="16" :spin="0.9" />
    </g>
    <template v-if="!single">
      <path class="pr-thin" d="M520 76 V280" />
      <rect v-for="y in [180, 225, 270]" :key="y" class="pr-solid" x="514" :y="y" width="12" height="8" rx="2" />
      <rect class="pr-wall" x="600" y="22" width="56" height="64" rx="6" />
      <rect class="pr-solid" x="612" y="34" width="32" height="6" rx="2" />
      <rect class="pr-accent" x="612" y="48" width="10" height="6" rx="2" />
      <path class="pr-dash" d="M600 54 H520 V76" />
    </template>
    <Flow d="M0 190 H262 Q282 192 288 240 V300" :n="8" :dur="5" kind="dirt" :r="3.4" />
    <Flow d="M0 194 H262 Q275 196 280 230" :n="6" :dur="4" />
    <Flow v-for="c in pumps" :key="'f' + c" :d="`M${c} 304 V128 Q${c} 120 ${c + 8} 120 H800`" :n="10" :dur="5" :delay="c / 200" />
    <text class="pr-tx" x="8" y="176">Стоки</text>
    <text class="pr-tx" x="796" y="108" text-anchor="end">Напорный трубопровод</text>
  </g>
</template>
