<template>
  <!-- «В работе»: реальная съёмка оборудования в процессе работы.
       Ролик подключается, только когда блок подходит к экрану (v-lazy-video). -->
  <section v-if="clip" :id="anchor" class="wv" :aria-label="title">
    <div class="wv-in">
      <div class="wv-head" :class="{ 'wv-head--c': tall }">
        <span class="wv-eyebrow">{{ eyebrow }}</span>
        <h2 class="wv-h">{{ title }}</h2>
      </div>
      <figure class="wv-fig" :class="{ 'wv-fig--tall': tall }" :style="{ aspectRatio: clip.ratio || '16 / 9' }">
        <video v-lazy-video :data-src="clip.src" :poster="clip.poster" muted loop playsinline preload="none" :aria-label="clip.caption" />
        <figcaption v-if="clip.caption" class="wv-cap"><span class="wv-dot" aria-hidden="true" />{{ clip.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import data from '~/content/defaults/work-videos.json'

const props = defineProps({
  // equipment — слаг оборудования; stage — слаг стадии технологии
  slug: { type: String, required: true },
  kind: { type: String, default: 'equipment' },
  eyebrow: { type: String, default: 'Реальная съёмка' },
  title: { type: String, default: 'Оборудование в работе' },
  anchor: { type: String, default: 'work' }
})
// вертикальная съёмка (4:5, 9:16) — по центру, не во всю ширину колонки
const tall = computed(() => { const [w, h] = String(clip.value?.ratio || '16/9').split('/').map(Number); return h > w })
const clip = computed(() => (props.kind === 'stage' ? data.stages : data.equipment)?.[props.slug] || null)
</script>

<style scoped>
.wv { padding: clamp(56px, 7vw, 104px) 0; background: #fff; font-family: var(--dj-font); }
.wv-in { width: min(1180px, 87.5vw); margin: 0 auto; }
.wv-head { margin-bottom: clamp(20px, 2.6vw, 36px); }
.wv-eyebrow { display: block; margin-bottom: 8px; font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; color: #002366; }
.wv-h { margin: 0; font-size: clamp(32px, 4vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.015em; color: #1A1A1A; }
.wv-fig { position: relative; margin: 0; overflow: hidden; border-radius: var(--r-lg, 28px); background: #0b0d10; }
.wv-head--c { text-align: center; }
.wv-fig--tall { width: min(100%, calc(78svh * 4 / 5)); margin-inline: auto; }
.wv-fig video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.wv-cap { position: absolute; left: 20px; bottom: 20px; display: inline-flex; align-items: center; gap: 10px; max-width: calc(100% - 40px); padding: 10px 16px; border-radius: 999px; background: rgba(10, 14, 20, 0.55); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); color: #fff; font-size: 15px; line-height: 1.3; }
.wv-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #34C759; box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.25); }
@media (max-width: 734px) { .wv-cap { left: 12px; right: 12px; bottom: 12px; font-size: 13px; } }
</style>
