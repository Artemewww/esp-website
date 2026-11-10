<template>
  <!-- Липкая подполоса как на страницах продуктов DJI: слева название
       страницы, по центру якоря разделов, справа кнопка действия.
       Прилипает под шапкой; на мобильном якоря листаются по горизонтали. -->
  <div class="dsn">
    <div class="dsn-in">
      <span class="dsn-title">{{ title }}</span>
      <nav v-if="links?.length" class="dsn-links" aria-label="Разделы страницы">
        <a v-for="l in links" :key="l.href" :href="l.href" :class="{ 'is-on': active === l.href }" @click.prevent="jump(l.href)">{{ l.label }}</a>
      </nav>
      <NuxtLink v-if="cta" :to="cta.to" class="dj-btn dsn-cta">{{ cta.label }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  links: { type: Array, default: () => [] },
  cta: { type: Object, default: null }
})

const active = ref(null)
let io = null
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 56 - 52
  window.scrollTo({ top: y, behavior: 'smooth' })
}
onMounted(() => {
  const targets = props.links.map((l) => document.querySelector(l.href)).filter(Boolean)
  io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) active.value = '#' + e.target.id })
  }, { rootMargin: '-40% 0px -55% 0px' })
  targets.forEach((t) => io.observe(t))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.dsn { position: sticky; top: var(--dj-header-h); z-index: 40; background: rgba(255, 255, 255, 0.9); backdrop-filter: saturate(180%) blur(18px); -webkit-backdrop-filter: saturate(180%) blur(18px); border-bottom: 1px solid var(--dj-line); font-family: var(--dj-font); }
.dsn-in { max-width: 1280px; margin: 0 auto; height: 52px; padding: 0 clamp(16px, 3vw, 40px); display: flex; align-items: center; gap: 28px; }
.dsn-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 17px; font-weight: 600; color: var(--dj-ink); white-space: nowrap; }
.dsn-cta { flex: 0 0 auto; }
.dsn-links { display: flex; gap: 24px; margin-left: auto; overflow-x: auto; scrollbar-width: none; }
.dsn-links::-webkit-scrollbar { display: none; }
.dsn-links a { position: relative; font-size: 13px; color: var(--dj-text); white-space: nowrap; padding: 16px 0; transition: color 0.2s ease; }
.dsn-links a:hover, .dsn-links a.is-on { color: var(--dj-ink); }
.dsn-links a.is-on::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--dj-ink); }
.dsn-cta { height: 32px; padding: 0 16px; font-size: 13px; }
.dsn-links + .dsn-cta { margin-left: 0; }
.dsn-title + .dsn-cta { margin-left: auto; }
@media (max-width: 767px) {
  .dsn-in { gap: 16px; }
  .dsn-title { font-size: 15px; }
  .dsn-links { display: none; }
  .dsn-cta { margin-left: auto; }
}
</style>
