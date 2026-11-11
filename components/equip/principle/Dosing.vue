<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
// Станция дозирования: приготовление раствора флокулянта с перемешиванием →
// расходная ёмкость и дозировочный насос → подача в линию очистки
</script>

<template>
  <g>
    <path class="pr-pipe" d="M260 312 H300 M440 312 H482 M560 300 H590 V150 H660 V182 M620 222 H800" />
    <rect class="pr-wall" x="96" y="36" width="70" height="56" rx="6" />
    <path class="pr-ln" d="M131 92 V120" />
    <rect class="pr-wall" x="60" y="120" width="200" height="210" rx="6" />
    <rect class="pr-water" x="62" y="160" width="196" height="168" />
    <rect class="pr-wall" x="176" y="96" width="40" height="24" rx="4" />
    <path class="pr-ln" d="M196 120 V280" />
    <g transform="translate(196 280)">
      <path class="pr-ln" d="M-38 0 H38" style="stroke-width:3" />
      <animateTransform attributeName="transform" type="scale" additive="sum" values="1 1;0.12 1;1 1" dur="1.1s" repeatCount="indefinite" />
    </g>
    <rect class="pr-wall" x="300" y="170" width="140" height="160" rx="6" />
    <rect class="pr-water" x="302" y="200" width="136" height="128" />
    <rect class="pr-wall" x="480" y="270" width="80" height="60" rx="8" />
    <Oct :cx="520" :cy="300" :r="18" :spin="0.9" />
    <rect class="pr-wall" x="620" y="182" width="180" height="80" rx="4" />
    <rect class="pr-water" x="622" y="196" width="178" height="64" />
    <Flow d="M131 40 V200" :n="4" :dur="3" kind="sand" :r="2.6" />
    <Flow d="M120 290 C80 220 120 180 196 190 C260 200 250 280 196 300 C150 316 130 300 120 290" :n="10" :dur="7" kind="oil" :r="3" />
    <Flow d="M240 312 H320 Q360 312 380 300" :n="4" :dur="4" kind="oil" :r="3" />
    <Flow d="M420 312 H520 Q560 300 590 290 V150 H660 V200" :n="9" :dur="6" kind="oil" :r="3" />
    <Flow d="M620 230 H800" :n="9" :dur="5" />
    <Flow d="M630 214 Q680 220 700 240 H800" :n="5" :dur="5" kind="dirt" :r="3.8" />
    <text class="pr-tx" x="131" y="24" text-anchor="middle">Флокулянт</text>
    <text class="pr-tx" x="796" y="290" text-anchor="end">Линия очистки</text>
  </g>
</template>
