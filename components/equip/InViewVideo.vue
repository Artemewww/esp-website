<template>
  <!-- Ролик с объекта: без звука, по кругу, играет только в зоне видимости -->
  <video ref="el" :poster="poster" muted loop playsinline preload="none" disablepictureinpicture :aria-label="label">
    <source :src="src" type="video/mp4" data-allow-mismatch="attribute" />
  </video>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  label: { type: String, default: '' }
})

const el = ref(null)
let io = null

onMounted(() => {
  const v = el.value
  if (!v || typeof IntersectionObserver === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => {})
    else if (!v.paused) v.pause()
  }, { threshold: 0.25 })
  io.observe(v)
})
onBeforeUnmount(() => { io?.disconnect(); io = null })
</script>
