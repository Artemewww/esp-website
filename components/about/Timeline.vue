<template>
  <!-- «Путь компании»: вертикальная лента со шкалой, которая заполняется при прокрутке.
       Год слева «прилипает», пока читается его глава; пройденные точки загораются. -->
  <div ref="root" class="atl" :style="{ '--tl-p': progress }">
    <span class="atl-rail" aria-hidden="true"><i></i></span>
    <article
      v-for="(ev, i) in events"
      :key="`${ev.year}-${i}`"
      :ref="(el) => { items[i] = el }"
      class="atl-item"
      :class="{ 'is-on': i <= active, 'is-future': isFuture(ev) }"
    >
      <span class="atl-dot" aria-hidden="true"></span>
      <div class="atl-year">
        <span>{{ ev.year }}</span>
      </div>
      <div class="atl-body">
        <h3 class="atl-h">{{ ev.title }}</h3>
        <p class="atl-p">{{ ev.text }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({ events: { type: Array, required: true } })

const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const root = ref(null)
const items = []
const progress = ref(0)
const active = ref(-1)

let raf = 0
const tick = () => {
  raf = 0
  const el = root.value
  if (!el) return
  const vh = window.innerHeight
  const line = vh * 0.55
  const r = el.getBoundingClientRect()
  progress.value = Math.min(1, Math.max(0, (line - r.top) / r.height)).toFixed(4)
  let a = -1
  items.forEach((it, i) => { if (it && it.getBoundingClientRect().top < line) a = i })
  active.value = a
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    progress.value = 1
    active.value = items.length
    return
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  tick()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.atl { position: relative; --rail-x: calc(clamp(140px, 24vw, 320px) + 24px); }
.atl-rail { position: absolute; top: 12px; bottom: 12px; left: var(--rail-x); width: 2px; border-radius: 2px; background: var(--dj-line); }
.atl-rail i { position: absolute; inset: 0 0 auto 0; height: calc(var(--tl-p, 0) * 100%); border-radius: inherit; background: linear-gradient(180deg, #8fb8f0 0%, #0a3a8c 70%, #002366 100%); }
.atl-item { position: relative; display: grid; grid-template-columns: clamp(140px, 24vw, 320px) minmax(0, 1fr); gap: 48px; padding: clamp(28px, 4vw, 56px) 0; }
.atl-dot { position: absolute; top: calc(clamp(28px, 4vw, 56px) + 0.55em); left: calc(var(--rail-x) - 6px); width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: inset 0 0 0 2px var(--dj-line); transition: box-shadow 0.4s var(--dj-ease), background-color 0.4s var(--dj-ease); font-size: clamp(44px, 5.6vw, 88px); }
.atl-item.is-on .atl-dot { background: #0a3a8c; box-shadow: 0 0 0 6px rgba(10, 58, 140, 0.14); }
.atl-year { align-self: start; position: sticky; top: calc(var(--dj-header-h, 56px) + 52px + 8vh); }
.atl-year span { display: block; font-size: clamp(44px, 5.6vw, 88px); line-height: 1; font-weight: 600; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; color: #c9ced4; transition: color 0.5s var(--dj-ease); }
.atl-item.is-on .atl-year span { color: var(--dj-blue); }
.atl-item.is-future .atl-year span { font-size: clamp(36px, 4.4vw, 64px); }
.atl-body { padding-left: 24px; max-width: 46ch; opacity: 0.35; transform: translateY(12px); transition: opacity 0.6s var(--dj-ease), transform 0.6s var(--dj-ease); }
.atl-item.is-on .atl-body { opacity: 1; transform: none; }
.atl-h { font-size: clamp(24px, 2.6vw, 36px); line-height: 1.15; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.atl-p { margin-top: 12px; font-size: clamp(17px, 1.4vw, 20px); line-height: 1.5; color: var(--dj-text); }
.atl-item.is-future .atl-body { padding: 24px 28px; margin-left: 24px; border-radius: var(--r-lg); background: #002366; }
.atl-item.is-future .atl-h { color: #fff; }
.atl-item.is-future .atl-p { color: rgba(255, 255, 255, 0.78); }

@media (max-width: 767px) {
  .atl { --rail-x: 6px; }
  .atl-item { grid-template-columns: 1fr; gap: 10px; padding: 28px 0 28px 32px; }
  .atl-dot { top: calc(28px + 0.32em); font-size: 44px; }
  .atl-year { position: static; }
  .atl-year span, .atl-item.is-future .atl-year span { font-size: 44px; }
  .atl-body { padding-left: 0; }
  .atl-item.is-future .atl-body { margin-left: 0; padding: 20px 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .atl-body, .atl-dot, .atl-year span { transition: none; }
}
</style>
