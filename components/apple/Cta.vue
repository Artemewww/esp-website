<template>
  <!-- Финальный призыв страницы продукта apple.com -->
  <section class="ct" :class="`ct--${tone}`">
    <div class="ct-in dj-reveal">
      <span v-if="eyebrow" class="ct-eyebrow">{{ eyebrow }}</span>
      <h2 class="ct-title">{{ title }}</h2>
      <p v-if="lede" class="ct-lede">{{ lede }}</p>
      <div v-if="$slots.default" class="ct-act"><slot /></div>
      <p v-if="note" class="ct-note">{{ note }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  note: { type: String, default: '' },
  tone: { type: String, default: 'white' }
})
</script>

<style scoped>
.ct { padding: clamp(96px, 12vw, 180px) 0; text-align: center; font-family: var(--dj-font); background: #fff; color: #1d1d1f; }
.ct--light { background: #f5f5f7; }
.ct--dark { background: #000; color: #f5f5f7; }
.ct-in { width: min(980px, 87.5vw); margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.ct-eyebrow { margin-bottom: 8px; font-size: clamp(19px, 1.7vw, 24px); font-weight: 600; color: #6e6e73; }
.ct-title { margin: 0; max-width: 14em; font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: inherit; text-wrap: balance; }
.ct-lede { margin: 20px 0 0; max-width: 34em; font-size: clamp(19px, 1.6vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: #6e6e73; text-wrap: pretty; }
.ct--dark .ct-lede, .ct--dark .ct-eyebrow { color: #86868b; }
.ct-act { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px 32px; margin-top: 36px; }
.ct-act :slotted(.ax-btn) { display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; letter-spacing: -0.022em; white-space: nowrap; background: #002366; color: #fff; cursor: pointer; border: 0; transition: background-color 0.2s ease; }
.ct-act :slotted(.ax-btn:hover) { background: #0b3a8c; }
.ct--dark .ct-act :slotted(.ax-btn) { background: #0071e3; }
.ct--dark .ct-act :slotted(.ax-btn:hover) { background: #0077ed; }
.ct-act :slotted(.ax-link) { display: inline-flex; gap: 4px; font-size: 17px; letter-spacing: -0.022em; color: #0066cc; white-space: nowrap; background: none; border: 0; padding: 0; cursor: pointer; font-variant-numeric: tabular-nums; }
.ct--dark .ct-act :slotted(.ax-link) { color: #2997ff; }
.ct-act :slotted(.ax-link)::after { content: '›'; font-size: 1.15em; line-height: 1; }
.ct-act :slotted(.ax-link:hover) { text-decoration: underline; }
.ct-note { margin: 16px 0 0; font-size: 14px; color: #6e6e73; }
</style>
