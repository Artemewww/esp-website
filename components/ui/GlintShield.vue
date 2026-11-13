<template>
  <!-- Щит «Гарантия 5 лет» с бликом: при прокрутке по щиту проходит светлая
       полоса, обрезанная по силуэту картинки (mask), — щит «отдаёт блик». -->
  <span ref="el" class="gs" :class="{ 'is-on': on }" :style="{ '--gs-src': `url(${src})` }" @animationend="on = false">
    <img :src="src" alt="" aria-hidden="true" loading="lazy" decoding="async" />
  </span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({ src: { type: String, default: '/images/home/bento/shield-s.webp' } })
const el = ref(null)
const on = ref(false)
let seen = false, io = null, last = 0
const onScroll = () => {
  if (!seen || on.value) return
  const t = performance.now()
  if (t - last < 1600) return
  last = t
  on.value = true
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(([e]) => {
    seen = e.isIntersecting
    if (seen) onScroll()
  }, { threshold: 0.6 })
  io.observe(el.value)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => { io?.disconnect(); window.removeEventListener('scroll', onScroll) })
</script>

<style scoped>
:where(.gs) { position: relative; display: inline-block; }
.gs { line-height: 0; }
.gs img { width: auto; max-width: 100%; height: 100%; object-fit: contain; }
.gs::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.95) 46%, rgba(255, 255, 255, 0.2) 54%, transparent 64%) no-repeat;
  background-size: 260% 100%; background-position: 130% 0;
  -webkit-mask: var(--gs-src) center / contain no-repeat; mask: var(--gs-src) center / contain no-repeat;
  mix-blend-mode: screen;
}
.gs.is-on::after { animation: gs-sweep 1.1s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes gs-sweep {
  0% { opacity: 1; background-position: 130% 0; }
  85% { opacity: 1; }
  100% { opacity: 0; background-position: -30% 0; }
}
</style>
