<template>
  <!-- «Как строили»: переключатель Стройка / Готово и лента кадров с подписями.
       Только реальные кадры с объекта (public/images/projects/<slug>/build/). -->
  <section id="build" class="bs pd-anchor dj-sec" aria-labelledby="bs-h">
    <div class="dj-wrap dj-wrap--wide u-wrap">
      <div class="bs-head">
        <h2 id="bs-h" class="dj-h2 dj-ink">Как строили</h2>
        <div class="bs-seg" role="tablist" aria-label="Этап">
          <button v-for="t in tabs" :key="t.key" type="button" role="tab" :aria-selected="mode === t.key" :class="{ 'is-on': mode === t.key }" @click="pick(t.key)">
            {{ t.label }}<span>{{ t.items.length }}</span>
          </button>
          <i class="bs-seg__pill" :style="{ transform: `translateX(${mode === 'gotovo' ? 100 : 0}%)` }" aria-hidden="true" />
        </div>
      </div>
      <p class="bs-lede">{{ mode === 'stroyka' ? data.leadStroyka || 'Кадры со стройки: котлован, опалубка, бетон, монтаж оборудования.' : data.leadGotovo || 'Тот же объект после запуска — сооружения в работе.' }}</p>
    </div>
    <div ref="track" class="bs-track" :key="mode">
      <figure v-for="(f, i) in list" :key="f.src" class="bs-card">
        <span class="bs-img"><img :srcset="`${f.src.replace(/\.webp$/, '-m.webp')} 960w, ${f.src} 2400w`" sizes="(max-width: 734px) 86vw, 60vw" :src="f.src" :alt="f.caption" loading="lazy" decoding="async" /></span>
        <figcaption><b>{{ String(i + 1).padStart(2, '0') }}</b>{{ f.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ data: { type: Object, required: true } })
const tabs = computed(() => [
  { key: 'stroyka', label: 'Стройка', items: props.data.stroyka || [] },
  { key: 'gotovo', label: 'Готово', items: props.data.gotovo || [] }
].filter((t) => t.items.length))
const mode = ref(tabs.value[0]?.key || 'stroyka')
const list = computed(() => (mode.value === 'stroyka' ? props.data.stroyka : props.data.gotovo) || [])
const track = ref(null)
const pick = (k) => { mode.value = k }
</script>

<style scoped>
.bs { background: #F5F5F7; }
.bs-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 24px; }
.bs-lede { margin: 12px 0 0; max-width: 40em; font-size: 17px; line-height: 1.47; color: #5E5E5E; }
.bs-seg { position: relative; display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; padding: 3px; border-radius: 999px; background: #E3E3E6; }
.bs-seg button { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 120px; height: 36px; padding: 0 18px; border: 0; border-radius: 999px; background: none; font: inherit; font-size: 15px; font-weight: 600; color: #5E5E5E; cursor: pointer; transition: color 0.25s ease; }
.bs-seg button.is-on { color: #1A1A1A; }
.bs-seg button span { font-size: 12px; font-weight: 600; color: #8A8A8A; }
.bs-seg__pill { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 999px; background: #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.bs-seg:has(button:only-of-type) .bs-seg__pill { width: calc(100% - 6px); }
.bs-track { display: grid; grid-auto-flow: column; grid-auto-columns: min(60vw, 820px); gap: 16px; margin-top: 28px; padding: 0 max(22px, calc((100vw - 1180px) / 2)) 8px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 max(22px, calc((100vw - 1180px) / 2)); scrollbar-width: none; animation: bs-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.bs-track::-webkit-scrollbar { display: none; }
.bs-card { margin: 0; scroll-snap-align: start; }
.bs-img { display: block; aspect-ratio: 16 / 10; overflow: hidden; border-radius: var(--r-md, 18px); background: #DADADF; }
.bs-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.bs-card:hover .bs-img img { transform: scale(1.03); }
.bs-card figcaption { display: flex; gap: 10px; margin-top: 12px; font-size: 15px; line-height: 1.4; color: #1A1A1A; }
.bs-card figcaption b { font-size: 13px; font-weight: 600; color: #8A8A8A; font-variant-numeric: tabular-nums; padding-top: 1px; }
@keyframes bs-in { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
@media (max-width: 734px) {
  .bs-head { flex-direction: column; align-items: flex-start; }
  .bs-seg { width: 100%; }
  .bs-seg button { min-width: 0; }
  .bs-lede { font-size: 15px; }
  .bs-track { grid-auto-columns: 86vw; gap: 10px; padding: 0 16px 8px; scroll-padding: 0 16px; margin-top: 20px; }
  .bs-card figcaption { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) { .bs-track { animation: none; } }
</style>
