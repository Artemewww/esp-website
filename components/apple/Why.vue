<template>
  <!-- Карусель причин («Why …») с apple.com: карточки в ленте,
       стрелки-«лопатки» справа под лентой. -->
  <div class="wy" :class="{ 'wy--dark': dark }">
    <div ref="track" class="wy-track" @scroll.passive="sync">
      <component
        :is="it.to ? NuxtLinkCmp : 'div'"
        v-for="(it, i) in items"
        :key="i"
        v-bind="it.to ? { to: it.to } : {}"
        class="wy-card"
        :class="{ 'wy-card--photo': it.image && !it.contain, 'wy-card--link': it.to, 'wy-card--cover': it.cover }"
      >
        <img v-if="it.cover" class="wy-cover" :src="it.cover" alt="" loading="lazy" decoding="async" />
        <img v-if="it.image && !it.contain" class="wy-bg" :src="it.image" :alt="it.title" loading="lazy" decoding="async" />
        <span v-if="it.kicker" class="wy-kicker">{{ it.kicker }}</span>
        <b class="wy-title">{{ it.title }}</b>
        <span v-if="it.text" class="wy-text">{{ it.text }}</span>
        <span v-if="it.meta" class="wy-meta">{{ it.meta }}</span>
        <img v-if="it.image && it.contain" class="wy-img" :src="it.image" :alt="it.title" loading="lazy" decoding="async" />
        <span v-if="it.to" class="wy-plus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" /></svg></span>
      </component>
    </div>
    <div v-if="items.length > 1" class="wy-paddles">
      <button type="button" aria-label="Назад" :disabled="atStart" @click="move(-1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" aria-label="Вперёд" :disabled="atEnd" @click="move(1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 6l6 6-6 6" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, resolveComponent } from 'vue'

defineProps({
  items: { type: Array, required: true },
  dark: { type: Boolean, default: false }
})
const NuxtLinkCmp = resolveComponent('NuxtLink')
const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const sync = () => {
  const t = track.value
  if (!t) return
  atStart.value = t.scrollLeft < 8
  atEnd.value = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8
}
const move = (dir) => {
  const t = track.value
  const card = t?.children[0]
  if (!card) return
  const step = (card.getBoundingClientRect().width + 20) * Math.max(1, Math.floor(t.clientWidth / (card.offsetWidth + 20)) - 1)
  t.scrollBy({ left: dir * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
onMounted(sync)
</script>

<style scoped>
.wy { font-family: var(--dj-font); }
.wy-track { --pad: max(6.25vw, calc((100% - 980px) / 2)); display: flex; gap: 20px; padding: 4px var(--pad) 24px; scroll-padding: 0 var(--pad); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.wy-track::-webkit-scrollbar { display: none; }
.wy-card { position: relative; flex: 0 0 clamp(280px, 27vw, 372px); min-height: clamp(420px, 34vw, 500px); display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 32px 30px; overflow: hidden; border-radius: 28px; background: #fff; color: #1d1d1f; scroll-snap-align: start; isolation: isolate; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
.wy-card--link:hover { transform: scale(1.012); box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.16); }
.wy--dark .wy-card { background: #1d1d1f; color: #f5f5f7; box-shadow: none; }
.wy-kicker { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; font-variant-numeric: tabular-nums; }
.wy-title { font-size: clamp(21px, 2vw, 24px); line-height: 1.17; font-weight: 600; letter-spacing: 0.009em; text-wrap: balance; }
.wy-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.wy--dark .wy-text, .wy--dark .wy-kicker { color: #86868b; }
.wy-meta { margin-top: auto; font-size: 14px; color: #6e6e73; }
.wy-img { width: 100%; height: 46%; margin-top: auto; object-fit: contain; }
.wy-plus { position: absolute; right: 22px; bottom: 22px; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: #1d1d1f; color: #fff; transition: background-color 0.2s ease; }
.wy--dark .wy-plus, .wy-card--photo .wy-plus { background: rgba(245, 245, 247, 0.92); color: #1d1d1f; }
.wy-card--link:hover .wy-plus { background: #002366; color: #fff; }
.wy-plus svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
.wy-card--photo { justify-content: flex-start; color: #f5f5f7; background: #000; }
.wy-bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1); }
.wy-card--photo:hover .wy-bg { transform: scale(1.04); }
.wy-card--photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.3) 100%); }
.wy-card--photo .wy-text, .wy-card--photo .wy-kicker, .wy-card--photo .wy-meta { color: rgba(245, 245, 247, 0.84); }
.wy-paddles { display: flex; justify-content: flex-end; gap: 14px; width: min(980px, 87.5vw); margin: 8px auto 0; }
.wy-paddles button { display: grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 50%; background: #e8e8ed; color: #1d1d1f; cursor: pointer; transition: background-color 0.2s ease, opacity 0.2s ease; }
.wy--dark .wy-paddles button { background: #333336; color: #f5f5f7; }
.wy-paddles button:hover:not(:disabled) { background: #dcdce1; }
.wy--dark .wy-paddles button:hover:not(:disabled) { background: #424245; }
.wy-paddles button:disabled { opacity: 0.36; cursor: default; }
.wy-paddles svg { width: 18px; height: 18px; }

@media (max-width: 734px) {
  .wy-track { gap: 12px; }
  .wy-card { flex-basis: 78vw; min-height: 400px; border-radius: 22px; padding: 26px 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .wy-card, .wy-bg { transition: none; }
}

/* Карточка с картинкой внизу (шаги «под ключ»): текст сверху на белом, кадр растворяется вверх */
.wy-card--cover { position: relative; min-height: clamp(460px, 38vw, 540px); overflow: hidden; isolation: isolate; background: linear-gradient(180deg, #eaf2fc 0%, #f4f8fd 45%, #f7f9fc 100%); box-shadow: 0 10px 30px rgba(30, 70, 140, 0.08); }
.wy-card--cover .wy-cover { position: absolute; left: 0; right: 0; bottom: 0; z-index: -1; width: 100%; height: 62%; object-fit: cover; object-position: center bottom; -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 30%); mask-image: linear-gradient(180deg, transparent 0%, #000 30%); transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1); }
.wy-card--cover:hover .wy-cover { transform: scale(1.04); }
.wy-card--cover .wy-plus { background: rgba(255, 255, 255, 0.85); color: #1d1d1f; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
</style>
