<template>
  <!-- Вертикальные панели-аккордеон (приём блока решений /solutions):
       узкие карточки-кадры, при наведении/фокусе одна раскрывается с описанием. -->
  <div class="tp" role="list">
    <NuxtLink
      v-for="(s, i) in items"
      :key="s.to || i"
      :to="s.to"
      class="tp-pn"
      :class="{ 'is-open': open === i }"
      role="listitem"
      @mouseenter="open = i"
      @focus="open = i"
    >
      <img :src="s.image" :alt="s.title" loading="lazy" decoding="async" />
      <span class="tp-pn__shade" />
      <span class="tp-pn__num">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="tp-pn__text">
        <b>{{ s.title }}</b>
        <small>{{ s.text }}</small>
        <em v-if="s.chip">{{ s.chip }}</em>
      </span>
      <span class="tp-pn__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8" /></svg></span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ items: { type: Array, required: true } })
const open = ref(0)
</script>

<style scoped>
.tp { display: flex; gap: 14px; width: min(1440px, calc(100% - 32px)); height: clamp(420px, 56vh, 600px); margin: 0 auto; font-family: var(--dj-font); }
.tp-pn { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: var(--r-lg); color: #fff; isolation: isolate; box-shadow: var(--sh-2); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-pn.is-open { flex-grow: 2.6; }
.tp-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transform: scale(1.04); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.tp-pn.is-open img { transform: scale(1); }
.tp-pn__shade { position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.tp-pn__num { position: absolute; top: 20px; left: 22px; font-size: 15px; font-weight: 600; letter-spacing: 0.04em; color: rgba(255, 255, 255, 0.85); }
.tp-pn__text { position: absolute; left: 22px; right: 70px; bottom: 22px; display: grid; justify-items: start; gap: 6px; }
.tp-pn__text b { overflow-wrap: anywhere; hyphens: auto; font-size: clamp(19px, 1.6vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); }
.tp-pn__text small { max-width: 34em; font-size: 15px; line-height: 1.4; color: rgba(255, 255, 255, 0.9); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.tp-pn__text em { font-style: normal; padding: 6px 14px; border-radius: var(--r-pill); font-size: 14px; color: #fff; background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.tp-pn.is-open .tp-pn__text small { max-height: 6em; opacity: 1; transition-delay: 0.2s; }
.tp-pn.is-open .tp-pn__text em { max-height: 3em; opacity: 1; transition-delay: 0.3s; }
.tp-pn__go { position: absolute; right: 18px; bottom: 18px; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: #1A1A1A; background: rgba(255, 255, 255, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.tp-pn__go svg { width: 18px; height: 18px; }
@media (max-width: 900px) {
  .tp { overflow-x: auto; scroll-snap-type: x mandatory; height: 460px; padding-bottom: 6px; scrollbar-width: none; }
  .tp::-webkit-scrollbar { display: none; }
  .tp-pn, .tp-pn.is-open { flex: 0 0 82%; scroll-snap-align: center; }
  .tp-pn__text small, .tp-pn__text em { max-height: 8em; opacity: 1; }
  .tp-pn__text { right: 64px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-pn, .tp-pn img { transition: none; }
}
</style>
