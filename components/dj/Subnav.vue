<template>
  <!-- Липкая подполоса как на страницах продуктов Apple: слева название
       страницы, справа якоря разделов и кнопка-капсула.
       Прилипает под шапкой; на мобильном якоря листаются по горизонтали. -->
  <div class="dsn" :class="{ 'is-shown': shown && !hideBar }">
    <div class="dsn-in">
      <span class="dsn-title">{{ title }}</span>
      <nav v-if="navLinks.length" class="dsn-links" aria-label="Разделы страницы">
        <a v-for="l in navLinks" :key="l.href" :href="l.href" :class="{ 'is-on': active === l.href }" @click.prevent="jump(l.href)">{{ l.label }}</a>
      </nav>
      <NuxtLink v-if="cta" :to="cta.to" class="dj-btn dsn-cta">{{ cta.label }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRevealBar } from '~/composables/useRevealBar'

const props = defineProps({
  title: { type: String, required: true },
  links: { type: Array, default: () => [] },
  cta: { type: Object, default: null }
})
// Якорь с тем же текстом, что у кнопки, — дубль: показываем только кнопку
const navLinks = computed(() => (props.links || []).filter((l) => !props.cta || l.label !== props.cta.label))

const shown = useRevealBar(true)
// Флаг скрытия: компонент страницы (например, прилипший переключатель анкет
// на /career) временно встаёт на место подполосы.
const hideBar = useState('dsn-hide', () => false)
const active = ref(null)
let io = null
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dj-header-h')) || 44) - 52
  window.scrollTo({ top: y, behavior: 'smooth' })
}
onMounted(() => {
  const targets = navLinks.value.map((l) => document.querySelector(l.href)).filter(Boolean)
  io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) active.value = '#' + e.target.id })
  }, { rootMargin: '-40% 0px -55% 0px' })
  targets.forEach((t) => io.observe(t))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.dsn { position: fixed; left: 0; right: 0; transform: translateY(-100%); opacity: 0; visibility: hidden; pointer-events: none; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0s 0.45s; }
.dsn.is-shown { transform: none; opacity: 1; visibility: visible; pointer-events: auto; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.dsn { top: var(--dj-header-h); z-index: 40; background: rgba(255, 255, 255, 0.72); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); border-bottom: 1px solid rgba(0, 0, 0, 0.16); font-family: var(--dj-font); }
.dsn-in { max-width: 1024px; margin: 0 auto; height: 52px; padding: 0 22px; display: flex; align-items: center; gap: 24px; }
.dsn-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: 21px; line-height: 1.14286; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); white-space: nowrap; }
.dsn-cta { flex: 0 0 auto; }
.dsn-links { display: flex; gap: 24px; margin-left: auto; overflow-x: auto; scrollbar-width: none; }
.dsn-links::-webkit-scrollbar { display: none; }
.dsn-links a { position: relative; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: rgba(0, 0, 0, 0.8); white-space: nowrap; padding: 18px 0; transition: color 0.2s ease; }
.dsn-links a:hover { color: var(--dj-link); }
.dsn-links a.is-on { color: rgba(0, 0, 0, 0.56); }
.dsn-cta { min-height: 28px; padding: 4px 11px; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; }
.dsn-links + .dsn-cta { margin-left: 0; }
.dsn-title + .dsn-cta { margin-left: auto; }
@media (max-width: 767px) {
  .dsn-in { gap: 16px; }
  .dsn-in { padding: 0 16px; height: 48px; }
  .dsn-title { font-size: 19px; }
  .dsn-links { display: none; }
  .dsn-cta { margin-left: auto; }
}
</style>
