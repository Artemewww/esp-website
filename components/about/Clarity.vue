<template>
  <!-- «Просвет»: схема вместо фото — столб воды со шкалой глубины,
       диск прозрачности опускается до отметки и остаётся видимым. -->
  <section class="ac">
    <div class="dj-wrap ac-in">
      <div class="ac-text">
        <span v-if="eyebrow" class="dj-eyebrow ac-eyebrow dj-reveal">{{ eyebrow }}</span>
        <h2 class="ac-h dj-reveal">{{ title }}</h2>
        <p v-if="lede" class="dj-lede ac-lede dj-reveal">{{ lede }}</p>
      </div>
      <div class="ac-col dj-reveal" aria-hidden="true" :style="{ '--depth': depth }">
        <ol class="ac-scale">
          <li v-for="m in depth + 1" :key="m" :style="{ '--m': m - 1 }"><span>{{ m - 1 }} м</span></li>
        </ol>
        <div class="ac-water">
          <span class="ac-surface"></span>
          <span class="ac-line"></span>
          <span class="ac-disk"><i></i></span>
          <b class="ac-mark">{{ depth }} м</b>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  depth: { type: Number, default: 4 }
})
</script>

<style scoped>
.ac { padding: clamp(88px, 11vw, 160px) 0; background: linear-gradient(180deg, #002366 0%, #001634 100%); color: #fff; overflow: hidden; }
.ac-in { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: clamp(40px, 6vw, 96px); align-items: center; }
.ac-eyebrow { display: block; max-width: 40ch; margin-bottom: 14px; color: rgba(255, 255, 255, 0.7); }
.ac-h { max-width: 16ch; font-size: clamp(34px, 4.8vw, 68px); line-height: 1.06; font-weight: 600; letter-spacing: -0.015em; color: #fff; }
.ac-lede { margin-top: 20px; color: rgba(255, 255, 255, 0.78); font-size: clamp(17px, 1.5vw, 21px); }

.ac-col { --H: 440px; position: relative; display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 16px; height: var(--H); }
.ac-scale { position: relative; list-style: none; margin: 0; padding: 0; }
.ac-scale li { position: absolute; left: 0; right: 0; top: calc(var(--m) / var(--depth) * (var(--H) - 48px) + 24px); height: 0; border-top: 1px solid rgba(255, 255, 255, 0.28); }
.ac-scale span { position: absolute; right: 0; top: -10px; padding-right: 10px; font-size: 13px; line-height: 1; color: rgba(255, 255, 255, 0.6); transform: translateY(-50%); font-variant-numeric: tabular-nums; }
.ac-water { position: relative; border-radius: 24px; overflow: hidden; background: linear-gradient(180deg, rgba(120, 190, 255, 0.28) 0%, rgba(40, 120, 220, 0.22) 55%, rgba(10, 58, 140, 0.35) 100%); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14); }
.ac-surface { position: absolute; left: 0; right: 0; top: 24px; height: 1px; background: rgba(255, 255, 255, 0.6); }
.ac-surface::before { content: ''; position: absolute; left: 0; right: 0; top: -24px; height: 24px; background: linear-gradient(180deg, rgba(0, 22, 52, 0.6), rgba(0, 22, 52, 0)); }
.ac-line { position: absolute; left: 50%; top: 0; width: 1px; height: 24px; background: rgba(255, 255, 255, 0.7); transition: height 2.2s var(--dj-ease) 0.3s; }
.ac-disk { position: absolute; left: 50%; top: 24px; width: 72px; height: 14px; margin-left: -36px; transform: translateY(-50%); transition: top 2.2s var(--dj-ease) 0.3s; }
.ac-disk i { display: block; width: 100%; height: 100%; border-radius: 50%; background: conic-gradient(#fff 0 25%, #10213f 0 50%, #fff 0 75%, #10213f 0); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35); }
.ac-mark { position: absolute; right: 18px; bottom: 18px; font-size: clamp(40px, 5vw, 72px); line-height: 1; font-weight: 600; letter-spacing: -0.04em; color: #fff; opacity: 0; transition: opacity 0.8s var(--dj-ease) 2.2s; }
.ac-col.is-in .ac-line { height: calc(var(--H) - 24px); }
.ac-col.is-in .ac-disk { top: calc(var(--H) - 24px); }
.ac-col.is-in .ac-mark { opacity: 1; }
.ac-col.is-in .ac-line { height: calc(var(--H) - 24px); }

@media (max-width: 767px) {
  .ac-in { grid-template-columns: 1fr; }
  .ac-h { overflow-wrap: break-word; }
  .ac-col { --H: 340px; grid-template-columns: 44px minmax(0, 1fr); gap: 10px; }
  .ac-water { border-radius: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .ac-line, .ac-disk, .ac-mark { transition: none; }
}
</style>
