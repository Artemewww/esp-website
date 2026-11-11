<script setup>
import Flow from './Flow.vue'
// Ультразвуковой расходомер: зонд над потоком измеряет уровень,
// измерительный блок считает мгновенный расход и общий сток
</script>

<template>
  <g>
    <path class="pr-wall pr-wall--open" d="M40 180 V320 H760 V180" />
    <rect class="pr-water" x="42" y="236" width="716" height="82">
      <animate attributeName="y" values="240;206;240" dur="10s" repeatCount="indefinite" />
      <animate attributeName="height" values="78;112;78" dur="10s" repeatCount="indefinite" />
    </rect>
    <path class="pr-ln" d="M300 60 H400 V100" />
    <rect class="pr-wall" x="382" y="100" width="36" height="30" rx="6" />
    <g v-for="k in 3" :key="k">
      <path class="pr-wave" d="M384 140 Q400 132 416 140" opacity="0">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="0 64" dur="1.8s" :begin="`${-(k - 1) * 0.6}s`" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" :begin="`${-(k - 1) * 0.6}s`" repeatCount="indefinite" />
      </path>
    </g>
    <path class="pr-dash" d="M400 60 V44 H600" />
    <rect class="pr-wall" x="600" y="24" width="140" height="92" rx="10" />
    <rect v-for="(h, i) in [30, 46, 22, 54, 38]" :key="i" class="pr-accent" :x="616 + i * 22" :y="100 - h" width="12" :height="h" rx="2">
      <animate attributeName="height" :values="`${h};${h * 0.55};${h}`" :dur="`${2.4 + i * 0.3}s`" repeatCount="indefinite" />
      <animate attributeName="y" :values="`${100 - h};${100 - h * 0.55};${100 - h}`" :dur="`${2.4 + i * 0.3}s`" repeatCount="indefinite" />
    </rect>
    <Flow d="M40 290 H760" :n="12" :dur="6" />
    <Flow d="M40 264 H760" :n="9" :dur="5" :delay="0.3" />
    <Flow d="M40 306 H760" :n="5" :dur="7" kind="dirt" :r="3" />
    <text class="pr-tx" x="8" y="170">Поток</text>
  </g>
</template>
