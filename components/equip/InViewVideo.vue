<template>
  <!-- Ролик с объекта: без звука, по кругу, играет только в зоне видимости -->
  <video ref="el" :poster="poster" muted loop playsinline preload="none" disablepictureinpicture :aria-label="label">
    <!-- источник после монтирования: на телефоне — лёгкая версия *-m.mp4 -->
    <source v-if="live" :src="videoSrc(src)" type="video/mp4" />
  </video>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { videoSrc } from '~/composables/videoSrc'

defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  label: { type: String, default: '' }
})

const el = ref(null)
const live = ref(false)
let io = null

onMounted(() => {
  live.value = true
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
