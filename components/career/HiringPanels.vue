<template>
  <!-- #84 Отбор — вертикальные панели-аккордеон, как блок «Решения для бизнеса»
       на /solutions: наведение или клик раскрывает шаг с описанием -->
  <ol class="hp">
    <li
      v-for="(s, i) in steps"
      :key="s.title"
      class="hp-pn dj-reveal"
      :class="{ 'is-open': open === i }"
      :style="{ '--d': i * 80 + 'ms' }"
      tabindex="0"
      @mouseenter="open = i"
      @focus="open = i"
      @click="open = i"
    >
      <img :src="s.img" :alt="s.alt" loading="lazy" decoding="async" />
      <span class="hp-shade" />
      <span class="hp-num">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="hp-text">
        <b>{{ s.title }}</b>
        <small>{{ s.desc }}</small>
      </span>
    </li>
  </ol>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ steps: { type: Array, required: true } })
const open = ref(0)
</script>

<style scoped>
.hp { display: flex; gap: 12px; height: clamp(420px, 42vw, 560px); max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; list-style: none; }
.hp-pn { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: var(--r-lg); color: #fff; isolation: isolate; cursor: pointer; outline: none; box-shadow: var(--sh-2); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.hp-pn:focus-visible { box-shadow: 0 0 0 3px #002366; }
.hp-pn.is-open { flex-grow: 2.6; }
.hp-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.12); transform: scale(1.04); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.hp-pn.is-open img { transform: scale(1); }
.hp-shade { position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.hp-num { position: absolute; top: 20px; left: 22px; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: #1A1A1A; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.hp-pn.is-open .hp-num { color: #fff; background: #002366; }
.hp-text { position: absolute; left: 22px; right: 22px; bottom: 22px; display: grid; gap: 6px; }
.hp-text b { font-size: clamp(19px, 1.6vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); }
.hp-text small { max-width: 34ch; font-size: 15px; line-height: 1.4; color: rgba(255, 255, 255, 0.92); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.hp-pn.is-open .hp-text small { max-height: 6em; opacity: 1; transition-delay: 0.2s; }
@media (max-width: 767px) {
  .hp { height: 420px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 0 16px; }
  .hp::-webkit-scrollbar { display: none; }
  .hp-pn, .hp-pn.is-open { flex: 0 0 78%; scroll-snap-align: center; border-radius: var(--r-md); }
  .hp-text small { max-height: 6em; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .hp-pn, .hp-pn img { transition: none; } }
</style>
