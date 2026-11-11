<script setup>
import { useId } from 'vue'
// Шнек в кожухе: витки бегут вдоль оси
const props = defineProps({
  x1: Number, y1: Number, x2: Number, y2: Number,
  w: { type: Number, default: 40 },
  pitch: { type: Number, default: 26 },
  dur: { type: Number, default: 1.1 }
})
const id = 'pr-aug-' + useId()
const len = Math.hypot(props.x2 - props.x1, props.y2 - props.y1)
const deg = (Math.atan2(props.y2 - props.y1, props.x2 - props.x1) * 180) / Math.PI
const h = props.w / 2 - 5
const helix = Array.from({ length: Math.ceil(len / props.pitch) + 3 }, (_, k) => {
  const x = (k - 2) * props.pitch
  return `M${x} ${-h} L${x + props.pitch / 2} ${h}`
}).join(' ')
</script>

<template>
  <g :transform="`translate(${x1} ${y1}) rotate(${deg.toFixed(2)})`">
    <clipPath :id="id"><rect x="0" :y="-w / 2" :width="len" :height="w" /></clipPath>
    <rect x="0" :y="-w / 2" :width="len" :height="w" rx="6" class="pr-wall" />
    <line x1="0" y1="0" :x2="len" y2="0" class="pr-thin" />
    <g :clip-path="`url(#${id})`">
      <g>
        <path :d="helix" class="pr-ln" />
        <animateTransform attributeName="transform" type="translate" from="0 0" :to="`${pitch} 0`" :dur="dur + 's'" repeatCount="indefinite" />
      </g>
    </g>
  </g>
</template>
