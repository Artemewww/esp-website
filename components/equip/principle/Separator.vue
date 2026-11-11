<script setup>
import Flow from './Flow.vue'
// Самотёчные сепараторы в прямоугольном резервуаре:
// orl — отстаивание → коалесцентный блок → сорбционный блок
// fibroil — сорбент Фиброил на поверхности воды
// grease — жироуловитель с направляющими перегородками
defineProps({ variant: { type: String, default: 'orl' } })
const settle = [130, 190, 250]
</script>

<template>
  <g>
    <defs>
      <pattern id="pr-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="10" class="pr-thin" />
      </pattern>
      <pattern id="pr-dots" width="9" height="9" patternUnits="userSpaceOnUse">
        <rect x="3" y="3" width="2.6" height="2.6" rx="0.6" class="pr-solid-soft" />
      </pattern>
    </defs>
    <path class="pr-ground" d="M0 90 H800" />
    <path class="pr-pipe" d="M0 150 H82 M718 162 H800" />
    <template v-if="variant === 'grease'">
      <rect class="pr-wall" x="140" y="56" width="60" height="56" rx="4" />
      <rect class="pr-wall" x="600" y="56" width="60" height="56" rx="4" />
    </template>
    <rect class="pr-wall" x="80" y="110" width="640" height="220" rx="6" />
    <rect class="pr-water" x="82" y="140" width="636" height="188" />
    <rect class="pr-sludge" x="82" y="312" :width="variant === 'grease' ? 436 : 246" height="16" />

    <template v-if="variant === 'grease'">
      <rect class="pr-oil" x="82" y="140" width="436" height="16" />
      <path class="pr-ln" d="M260 110 V262 M520 330 V184" />
      <Flow d="M0 150 H200 Q250 170 250 280 Q262 300 290 296 Q420 280 470 200 Q490 172 540 172 Q640 172 718 162 H800" :n="16" :dur="11" />
      <Flow v-for="(x, i) in [120, 170, 330, 400]" :key="'g' + x" :d="`M${x - 30} ${x < 260 ? 152 : 290} Q${x} 220 ${x + 10} 146`" :n="2" :dur="3.4" kind="oil" :r="3.2" :delay="i * 0.6" />
    </template>
    <template v-else>
      <rect class="pr-oil" x="82" y="140" width="246" height="8" />
      <path class="pr-ln" d="M330 110 V280 M510 330 V190" />
      <rect x="360" y="160" width="124" height="140" rx="4" class="pr-block" fill="url(#pr-hatch)" />
      <rect v-if="variant === 'fibroil'" x="540" y="142" width="140" height="56" rx="4" class="pr-block" fill="url(#pr-dots)" />
      <rect v-else x="540" y="170" width="140" height="130" rx="4" class="pr-block" fill="url(#pr-dots)" />
      <Flow d="M0 150 H200 Q300 170 320 300 Q340 312 380 290 Q430 230 490 180 Q510 168 530 175 Q580 240 640 230 Q690 190 718 162 H800" :n="18" :dur="12" />
      <Flow d="M0 153 H120 Q160 152 200 144" :n="4" :dur="4" kind="oil" :r="3.2" />
      <Flow d="M0 156 H180 Q300 200 320 292 Q350 302 410 236" :n="5" :dur="7" kind="oil" :r="3.2" :delay="1" />
      <Flow d="M500 178 Q540 186 600 172" :n="3" :dur="4" kind="oil" :r="3" />
    </template>
    <Flow v-for="(x, i) in settle" :key="x" :d="`M${x - 30} 154 Q${x} 220 ${x + 10} 314`" :n="2" :dur="3.4" kind="dirt" :r="3.2" :delay="i * 0.7" />
    <text class="pr-tx" x="8" y="136">Сток</text>
    <text class="pr-tx" x="796" y="150" text-anchor="end">Очищенная вода</text>
  </g>
</template>
