<template>
  <!-- Ступени очистки: вертикальные панели-аккордеон (приём .so-pn со страницы «Решения»).
       Наведение, фокус или клик раскрывает панель: кадр на всю ширину и описание ступени. -->
  <div class="ast" role="list">
    <button
      v-for="(s, i) in stages"
      :key="s.label"
      type="button"
      role="listitem"
      class="ast-pn"
      :class="{ 'is-open': open === i, 'is-contain': s.contain }"
      :aria-expanded="open === i"
      @mouseenter="open = i"
      @focus="open = i"
      @click="open = i"
    >
      <img :src="s.img" :alt="s.alt || s.label" loading="lazy" decoding="async" />
      <span class="ast-pn__shade" aria-hidden="true"></span>
      <span class="ast-pn__n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="ast-pn__text">
        <b>{{ s.label }}</b>
        <small>{{ s.result }}</small>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ stages: { type: Array, required: true } })
const open = ref(0)
</script>

<style scoped>
.ast { display: flex; gap: 12px; width: min(1440px, calc(100% - 32px)); height: clamp(400px, 56vh, 600px); margin: 0 auto; }
.ast-pn { position: relative; flex: 1 1 0; min-width: 0; padding: 0; overflow: hidden; border-radius: 26px; color: #fff; text-align: left; background: #0b0d10; isolation: isolate; cursor: pointer; box-shadow: 0 18px 40px -26px rgba(0, 35, 102, 0.45); transition: flex-grow 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.ast-pn.is-open { flex-grow: 4; }
.ast-pn img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.ast-pn.is-open img { transform: scale(1); }
.ast-pn.is-contain { background: linear-gradient(180deg, #f4f6f9 0%, #dfe6ee 100%); }
.ast-pn.is-contain img { object-fit: contain; padding: 8% 8% 28%; }
.ast-pn__shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 20, 50, 0.1) 0%, rgba(0, 20, 50, 0) 35%, rgba(0, 20, 50, 0.72) 100%); }
.ast-pn.is-contain .ast-pn__shade { background: linear-gradient(180deg, rgba(0, 20, 50, 0) 50%, rgba(0, 25, 70, 0.85) 100%); }
.ast-pn__n { position: absolute; top: 20px; left: 22px; font-size: 15px; font-weight: 600; letter-spacing: 0.02em; color: rgba(255, 255, 255, 0.9); text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35); }
.ast-pn.is-contain .ast-pn__n { color: #0a3a8c; text-shadow: none; }
.ast-pn__text { position: absolute; left: 22px; right: 22px; bottom: 22px; display: grid; gap: 6px; }
.ast-pn__text b { font-size: clamp(18px, 1.6vw, 26px); line-height: 1.15; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 14px rgba(0, 0, 0, 0.3); }
.ast-pn__text small { max-width: 34ch; font-size: 16px; line-height: 1.4; color: rgba(255, 255, 255, 0.9); max-height: 0; opacity: 0; overflow: hidden; transition: opacity 0.4s ease, max-height 0.5s ease; }
.ast-pn.is-open .ast-pn__text small { max-height: 4.2em; opacity: 1; transition-delay: 0.2s; }
/* Свёрнутые панели: подпись поворачивается вертикально, чтобы не ломалась */
.ast-pn:not(.is-open) .ast-pn__text { left: 50%; right: auto; bottom: 22px; width: max-content; transform: translateX(-50%) rotate(180deg); writing-mode: vertical-rl; }
.ast-pn:not(.is-open) .ast-pn__text b { font-size: 18px; white-space: nowrap; }
.ast-pn:focus-visible { outline: 3px solid #2f7ff0; outline-offset: 3px; }

@media (max-width: 900px) {
  .ast { overflow-x: auto; scroll-snap-type: x mandatory; height: 440px; padding-bottom: 6px; scrollbar-width: none; }
  .ast::-webkit-scrollbar { display: none; }
  .ast-pn, .ast-pn.is-open { flex: 0 0 80%; scroll-snap-align: center; }
  .ast-pn .ast-pn__text, .ast-pn:not(.is-open) .ast-pn__text { left: 22px; right: 22px; width: auto; transform: none; writing-mode: horizontal-tb; }
  .ast-pn:not(.is-open) .ast-pn__text b { white-space: normal; font-size: 20px; }
  .ast-pn .ast-pn__text small { max-height: 4.2em; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ast-pn, .ast-pn img, .ast-pn__text small { transition: none; }
}
</style>
