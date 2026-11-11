<script setup>
import Flow from './Flow.vue'
import Oct from './Oct.vue'
// Барабанное сито: сток из напорного лотка на вращающийся барабан с сеткой,
// вода проходит сквозь сетку, мусор задерживается на поверхности
</script>

<template>
  <g>
    <path class="pr-pipe" d="M0 100 H62 M282 340 H0" />
    <rect class="pr-wall" x="60" y="62" width="170" height="78" rx="6" />
    <rect class="pr-water" x="62" y="88" width="166" height="50" />
    <path class="pr-ln" d="M230 92 L300 104" />
    <rect class="pr-wall" x="280" y="262" width="240" height="100" rx="6" />
    <rect class="pr-water" x="282" y="300" width="236" height="60" />
    <Oct :cx="400" :cy="190" :r="112" :spin="14" mesh :fill="false" />
    <path class="pr-ln" d="M560 118 L506 152" />
    <path class="pr-ln" d="M560 210 L600 300" />
    <rect class="pr-wall" x="570" y="292" width="90" height="70" rx="6" />
    <rect class="pr-sludge" x="572" y="334" width="86" height="26" />
    <Flow d="M0 100 H230 Q290 100 320 120 Q370 170 380 260 Q385 330 330 340 H0" :n="16" :dur="8" />
    <Flow d="M0 104 H230 Q300 106 340 140 Q400 200 410 270 Q410 336 300 342 H0" :n="12" :dur="8.6" :delay="0.4" />
    <Flow d="M0 96 H230 Q280 92 310 92 Q400 60 480 112 Q520 150 560 210 L612 330" :n="9" :dur="10" kind="dirt" :r="4" />
    <text class="pr-tx" x="8" y="86">Сток</text>
    <text class="pr-tx" x="8" y="326">Вода дальше</text>
    <text class="pr-tx" x="615" y="384" text-anchor="middle">Отбросы</text>
  </g>
</template>
