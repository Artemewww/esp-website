<script setup>
import Flow from './Flow.vue'
// Ленточный фильтр-пресс: кондиционирование флокулянтом → гравитационная зона →
// зона низкого давления (клин двух лент) → зона высокого давления (валы)
const rollers = [[520, 238], [600, 132], [680, 238]]
const spoke = (x, y) => `M${x - 12} ${y} H${x + 12} M${x} ${y - 12} V${y + 12}`
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 120 H90 V146 M90 40 V112" />
    <rect class="pr-wall" x="110" y="300" width="230" height="40" rx="4" />
    <rect class="pr-water" x="112" y="318" width="226" height="20" />
    <g v-for="([x, y], i) in rollers" :key="i">
      <circle :cx="x" :cy="y" r="20" class="pr-roller" />
      <g>
        <path :d="spoke(x, y)" class="pr-thin" />
        <animateTransform attributeName="transform" type="rotate" :from="`${i % 2 ? 360 : 0} ${x} ${y}`" :to="`${i % 2 ? 0 : 360} ${x} ${y}`" dur="3s" repeatCount="indefinite" />
      </g>
    </g>
    <path class="pr-belt" d="M60 160 H330 L480 192 Q520 252 560 192 Q600 132 640 192 Q680 252 720 192 L770 192">
      <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1.2s" repeatCount="indefinite" />
    </path>
    <path class="pr-belt" d="M300 110 L480 182 Q520 242 560 182 Q600 122 640 182 Q680 242 720 182 L770 182">
      <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1.2s" repeatCount="indefinite" />
    </path>
    <rect class="pr-wall" x="730" y="290" width="62" height="72" rx="6" />
    <rect class="pr-sludge" x="732" y="326" width="58" height="34" />
    <Flow d="M90 44 V118" :n="3" :dur="2" kind="oil" :r="2.6" />
    <Flow d="M0 120 H90 Q95 150 110 154 H330 L480 186 Q520 246 560 186 Q600 126 640 186 Q680 246 720 186 L770 186 Q785 220 762 336" :n="20" :dur="14" kind="dirt" :r="4" />
    <Flow v-for="(x, i) in [150, 200, 250, 300]" :key="x" :d="`M${x} 166 V318`" :n="2" :dur="1.8" :r="2.6" :delay="i * 0.4" />
    <text class="pr-tx" x="8" y="108">Осадок</text>
    <text class="pr-tx" x="104" y="34">Флокулянт</text>
    <text class="pr-tx" x="761" y="384" text-anchor="middle">Кек</text>
  </g>
</template>
