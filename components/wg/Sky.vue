<template>
  <!-- Мягкое облачное небо, как фон Watergen: облака считаются один раз на
       маленьком канвасе и растягиваются, два слоя медленно дрейфуют. -->
  <div class="sky" aria-hidden="true">
    <canvas ref="a" class="sky-layer sky-layer--a"></canvas>
    <canvas ref="b" class="sky-layer sky-layer--b"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const a = ref(null)
const b = ref(null)

// Шум значений с интерполяцией и несколькими октавами — дёшево и без библиотек
const makeNoise = (seed) => {
  const N = 256
  const perm = new Uint8Array(N * 2)
  const val = new Float32Array(N)
  let s = seed
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < N; i++) { perm[i] = i; val[i] = rnd() }
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]] }
  for (let i = 0; i < N; i++) perm[i + N] = perm[i]
  const sm = (t) => t * t * (3 - 2 * t)
  const n2 = (x, y) => {
    const xi = Math.floor(x) & 255; const yi = Math.floor(y) & 255
    const xf = x - Math.floor(x); const yf = y - Math.floor(y)
    const v = (i, j) => val[perm[perm[xi + i] + yi + j]]
    const u = sm(xf); const w = sm(yf)
    return (v(0, 0) * (1 - u) + v(1, 0) * u) * (1 - w) + (v(0, 1) * (1 - u) + v(1, 1) * u) * w
  }
  return (x, y) => { let f = 0; let amp = 0.5; let fr = 1; for (let o = 0; o < 5; o++) { f += amp * n2(x * fr, y * fr); amp *= 0.5; fr *= 2.03 } return f }
}

const paint = (el, seed, cover) => {
  const W = 192; const H = 120
  el.width = W; el.height = H
  const ctx = el.getContext('2d')
  const img = ctx.createImageData(W, H)
  const noise = makeNoise(seed)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = noise(x / 34, y / 26)
    const a = Math.max(0, Math.min(1, (n - cover) * 3.2))
    const i = (y * W + x) * 4
    img.data[i] = 255; img.data[i + 1] = 255; img.data[i + 2] = 255; img.data[i + 3] = Math.round(a * 235)
  }
  ctx.putImageData(img, 0, 0)
}

onMounted(() => {
  paint(a.value, 1234, 0.46)
  paint(b.value, 98765, 0.52)
})
</script>

<style scoped>
.sky { position: absolute; inset: 0; overflow: hidden; background: #d9e9f7; }
.sky-layer {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  filter: blur(18px);
}
.sky-layer--a { opacity: 0.95; animation: sky-drift 70s linear infinite alternate; }
.sky-layer--b { opacity: 0.7; animation: sky-drift 95s linear infinite alternate-reverse; }
@keyframes sky-drift {
  from { transform: translate3d(-3%, 0, 0); }
  to { transform: translate3d(3%, -2%, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .sky-layer { animation: none; }
}
</style>
