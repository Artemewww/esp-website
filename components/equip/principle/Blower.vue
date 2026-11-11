<script setup>
import Flow from './Flow.vue'
// Роторная воздуходувка: два трёхлопастных ротора вращаются навстречу
// друг другу, газ переносится между роторами и стенками корпуса
const lobe = (cx, cy) => {
  const pts = Array.from({ length: 73 }, (_, k) => {
    const t = (k / 72) * Math.PI * 2
    const r = 50 + 20 * Math.cos(3 * t)
    return `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`
  })
  return 'M' + pts.join(' L') + ' Z'
}
const L = lobe(330, 200)
const R = lobe(470, 200)
</script>

<template>
  <g>
    <path class="pr-pipe" d="M400 400 V318 M400 82 V0" />
    <rect class="pr-wall" x="210" y="80" width="380" height="240" rx="70" />
    <g>
      <path :d="L" class="pr-rotor" />
      <animateTransform attributeName="transform" type="rotate" from="0 330 200" to="360 330 200" dur="3s" repeatCount="indefinite" />
    </g>
    <g>
      <path :d="R" class="pr-rotor" transform="rotate(60 470 200)" />
      <animateTransform attributeName="transform" type="rotate" from="0 470 200" to="-360 470 200" dur="3s" repeatCount="indefinite" />
    </g>
    <rect class="pr-solid" x="326" y="196" width="8" height="8" rx="2" />
    <rect class="pr-solid" x="466" y="196" width="8" height="8" rx="2" />
    <Flow d="M396 400 V318 Q246 318 232 200 Q246 82 396 82 V0" :n="9" :dur="4" kind="air" :r="3" />
    <Flow d="M404 400 V318 Q554 318 568 200 Q554 82 404 82 V0" :n="9" :dur="4" kind="air" :r="3" :delay="0.22" />
    <text class="pr-tx" x="418" y="392">Вход</text>
    <text class="pr-tx" x="418" y="20">Выход</text>
  </g>
</template>
