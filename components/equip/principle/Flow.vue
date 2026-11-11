<script setup>
// Поток частиц вдоль пути (SMIL): вода, загрязнения, воздух, нефтепродукты, песок.
// Отрицательный begin равномерно раскладывает частицы по пути — и в паузе
// (prefers-reduced-motion) схема остаётся читаемой
const props = defineProps({
  d: { type: String, required: true },
  n: { type: Number, default: 8 },
  dur: { type: Number, default: 6 },
  r: { type: Number, default: 3 },
  kind: { type: String, default: 'water' },
  delay: { type: Number, default: 0 }
})
const begin = (i) => `${(-(i * props.dur) / props.n - props.delay).toFixed(2)}s`
</script>

<template>
  <g :class="['pr-flow', 'pr-flow--' + kind]">
    <circle v-for="i in n" :key="i" :r="r" opacity="0">
      <animateMotion :path="d" :dur="dur + 's'" :begin="begin(i - 1)" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.92;1" :dur="dur + 's'" :begin="begin(i - 1)" repeatCount="indefinite" />
    </circle>
  </g>
</template>
