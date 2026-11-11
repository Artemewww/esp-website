<script setup>
// Восьмиугольник: барабаны, рабочие колёса, роторы. Круглых сосудов на схемах нет
const props = defineProps({
  cx: { type: Number, required: true },
  cy: { type: Number, required: true },
  r: { type: Number, required: true },
  spin: { type: Number, default: 0 }, // период оборота, с; 0 — без вращения
  ccw: { type: Boolean, default: false },
  spokes: { type: Boolean, default: true },
  mesh: { type: Boolean, default: false },
  fill: { type: Boolean, default: true }
})
const pts = (R) => Array.from({ length: 8 }, (_, k) => {
  const a = (Math.PI / 8) * (2 * k + 1)
  return `${(props.cx + R * Math.cos(a)).toFixed(1)},${(props.cy + R * Math.sin(a)).toFixed(1)}`
}).join(' ')
const spokesD = Array.from({ length: 4 }, (_, k) => {
  const a = (Math.PI / 4) * k
  const x = props.r * 0.78 * Math.cos(a), y = props.r * 0.78 * Math.sin(a)
  return `M${(props.cx - x).toFixed(1)} ${(props.cy - y).toFixed(1)} L${(props.cx + x).toFixed(1)} ${(props.cy + y).toFixed(1)}`
}).join(' ')
</script>

<template>
  <g>
    <polygon :points="pts(r)" :class="fill ? 'pr-wall' : 'pr-ln'" />
    <g>
      <polygon v-if="mesh" :points="pts(r - 7)" class="pr-dash" />
      <path v-if="spokes" :d="spokesD" class="pr-thin" />
      <rect :x="cx - 4" :y="cy - 4" width="8" height="8" rx="2" class="pr-solid" />
      <animateTransform v-if="spin" attributeName="transform" type="rotate" :from="`${ccw ? 360 : 0} ${cx} ${cy}`" :to="`${ccw ? 0 : 360} ${cx} ${cy}`" :dur="spin + 's'" repeatCount="indefinite" />
    </g>
  </g>
</template>
