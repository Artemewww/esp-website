<template>
  <!-- Липкая подполоса как на странице продукта apple.com: слева название,
       справа якоря и кнопка. На телефоне якоря прячутся под стрелкой. -->
  <div class="sb" :class="{ 'sb--dark': dark, 'is-open': open, 'sb--float': reveal && !h1, 'is-shown': shown }">
    <div class="sb-in">
      <h1 v-if="h1" class="sb-h1"><a v-fit-text href="#top" class="sb-title" @click.prevent="go('top')">{{ title }}</a></h1>
      <a v-else v-fit-text href="#top" class="sb-title" @click.prevent="go('top')">{{ title }}</a>
      <div class="sb-menu">
        <button
          v-if="navLinks.length"
          type="button"
          class="sb-toggle"
          :aria-expanded="open"
          aria-label="Разделы страницы"
          @click="open = !open"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9.5l6 6 6-6" /></svg>
        </button>
        <nav v-if="navLinks.length" class="sb-links" aria-label="Разделы страницы">
          <a
            v-for="l in navLinks"
            :key="l.href"
            :href="l.href"
            :class="{ 'is-on': active === l.href }"
            :aria-current="active === l.href ? 'true' : null"
            @click.prevent="go(l.href)"
          >{{ l.label }}</a>
        </nav>
        <NuxtLink v-if="cta" :to="cta.to" class="sb-cta">{{ cta.label }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRevealBar } from '~/composables/useRevealBar'

const props = defineProps({
  title: { type: String, required: true },
  links: { type: Array, default: () => [] },
  cta: { type: Object, default: null },
  dark: { type: Boolean, default: false },
  // заголовок страницы живёт в подполосе — тогда он и есть h1
  h1: { type: Boolean, default: false },
  // false — полоса видна сразу (когда в ней заголовок страницы)
  reveal: { type: Boolean, default: true }
})
const shown = useRevealBar(props.reveal && !props.h1)
// Якорь с тем же текстом, что у кнопки, — дубль: показываем только кнопку
const navLinks = computed(() => props.links.filter((l) => !props.cta || l.label !== props.cta.label))

const open = ref(false)
const active = ref(null)
let io = null

const go = (href) => {
  open.value = false
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (href === 'top') { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return }
  const el = document.querySelector(href)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) active.value = '#' + e.target.id })
  }, { rootMargin: '-40% 0px -55% 0px' })
  navLinks.value.map((l) => document.querySelector(l.href)).filter(Boolean).forEach((t) => io.observe(t))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.sb { position: sticky; top: var(--dj-header-h, 56px); z-index: 40; font-family: var(--dj-font); color: #1A1A1A; }
.sb::before { content: ''; position: absolute; inset: 0; background: rgba(251, 251, 253, 0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.16); }
.sb--float { position: fixed; left: 0; right: 0; transform: translateY(-100%); opacity: 0; visibility: hidden; pointer-events: none; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, visibility 0s 0.45s; }
.sb--float.is-shown { transform: none; opacity: 1; visibility: visible; pointer-events: auto; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.sb-in { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; max-width: 1180px; height: 52px; margin: 0 auto; padding: 0 22px; }
.sb-h1 { display: flex; flex: 0 1 auto; min-width: 0; margin: 0; font: inherit; }
.sb-title { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-overflow: clip; font-size: 21px; line-height: 1.14; font-weight: 600; letter-spacing: 0.011em; color: inherit; }
.sb-menu { display: flex; align-items: center; gap: 24px; flex-shrink: 0; }
.sb-links { display: flex; align-items: center; gap: 20px; }
.sb-links a { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: inherit; opacity: 0.88; white-space: nowrap; transition: color 0.2s ease, opacity 0.2s ease; }
.sb-links a:hover { color: #002366; opacity: 1; }
.sb-links a.is-on { opacity: 0.48; }
.sb-cta { display: inline-flex; align-items: center; min-height: 24px; padding: 0 11px; border-radius: var(--r-pill); font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; white-space: nowrap; background: #002366; color: #fff; transition: background-color 0.2s ease; }
.sb-cta:hover { background: #002366; }
.sb-toggle { display: none; width: 28px; height: 28px; place-items: center; color: inherit; background: none; border: 0; cursor: pointer; }
.sb-toggle svg { width: 18px; height: 18px; transition: transform 0.3s ease; }

.sb--dark { color: #EDEDED; }
.sb--dark::before { background: rgba(26, 26, 26, 0.8); box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.16); }
.sb--dark .sb-links a:hover { color: #FFFFFF; }
.sb--dark .sb-cta { background: #002366; }

@media (max-width: 480px) { .sb-cta { display: none; } }
@media (max-width: 1068px) {
  .sb-in { padding: 0 16px; }
  .sb-title { font-size: 19px; }
  .sb-menu { gap: 12px; }
  .sb-toggle { display: grid; width: 44px; height: 44px; margin-right: -8px; }
  .sb-cta { position: relative; }
  .sb-cta::after { content: ''; position: absolute; inset: -10px -4px; }
  .is-open .sb-toggle svg { transform: rotate(180deg); }
  .sb-links { position: absolute; top: 52px; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; padding: 4px 22px 16px; background: rgba(251, 251, 253, 0.97); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); box-shadow: var(--sh-1); opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s 0.3s; }
  .sb--dark .sb-links { background: rgba(26, 26, 26, 0.97); }
  .is-open .sb-links { opacity: 1; visibility: visible; transform: none; transition: opacity 0.3s ease, transform 0.3s ease; }
  .sb-links a { padding: 12px 0; font-size: 17px; box-shadow: inset 0 -1px 0 rgba(128, 128, 128, 0.2); }
}
@media (prefers-reduced-motion: reduce) {
  .sb-links, .sb-toggle svg { transition: none; }
}
</style>
