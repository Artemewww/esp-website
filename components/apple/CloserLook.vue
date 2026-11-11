<template>
  <!-- «Take a closer look» с apple.com: большая сцена, слева капсулы
       с плюсом; выбранная раскрывается текстом, кадр меняется плавно. -->
  <div class="cl" :class="{ 'cl--light': light }">
    <div class="cl-stage">
      <div class="cl-media">
        <img
          v-for="(it, i) in items"
          :key="i"
          :src="it.image"
          alt=""
          :class="{ 'is-on': i === cur, 'is-contain': it.contain }"
          loading="lazy"
          decoding="async"
        />
        <span v-if="items[cur]?.chip" :key="'c' + cur" class="cl-chip">{{ items[cur].chip }}</span>
      </div>
      <ul class="cl-list" role="tablist" :aria-label="label">
        <li v-for="(it, i) in items" :key="it.label">
          <button
            type="button"
            role="tab"
            class="cl-pill"
            :class="{ 'is-on': i === cur }"
            :aria-selected="i === cur"
            @click="cur = i"
          >
            <span class="cl-plus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 6v12M6 12h12" /></svg></span>
            <span class="cl-body">
              <b>{{ it.label }}</b>
              <span class="cl-text"><span>{{ it.text }}</span></span>
            </span>
          </button>
        </li>
      </ul>
    </div>
    <div class="cl-foot">
      <p class="cl-mtext"><b>{{ items[cur]?.label }}.</b> {{ items[cur]?.text }}</p>
      <NuxtLink v-if="items[cur]?.to" :to="items[cur].to" class="cl-more">{{ items[cur].linkLabel || 'Подробнее' }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Подробнее' },
  light: { type: Boolean, default: false }
})
const cur = ref(0)
</script>

<style scoped>
.cl { width: min(1260px, 87.5vw); margin: 0 auto; font-family: var(--dj-font); }
.cl-stage { position: relative; height: clamp(540px, 50vw, 760px); overflow: hidden; border-radius: var(--r-lg); background: #1A1A1A; isolation: isolate; }
.cl--light .cl-stage { background: #fff; }
.cl-media { position: absolute; inset: 0; }
.cl-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 0.7s ease, transform 1.4s cubic-bezier(0.16, 1, 0.3, 1); }
.cl-media img.is-contain { inset: 10% 6% 10% 38%; width: 56%; height: 80%; object-fit: contain; }
.cl-media img.is-on { opacity: 1; transform: none; }
.cl-stage::after { content: ''; position: absolute; inset: 0; z-index: 0; background: var(--scrim-l); pointer-events: none; }
.cl--light .cl-stage::after { display: none; }
.cl-chip { position: absolute; right: 28px; bottom: 28px; z-index: 1; padding: 8px 16px; border-radius: var(--r-pill); font-size: 14px; color: #EDEDED; background: rgba(61, 61, 61, 0.72); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); animation: cl-fade 0.6s ease both; }
.cl-list { position: absolute; z-index: 1; left: clamp(20px, 3vw, 40px); top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: flex-start; gap: 12px; width: min(400px, 38%); margin: 0; padding: 0; list-style: none; }
.cl-pill { display: flex; align-items: flex-start; gap: 14px; max-width: 100%; padding: 16px 24px 16px 16px; border: 0; border-radius: var(--r-lg); text-align: left; font: inherit; color: #EDEDED; background: rgba(61, 61, 61, 0.72); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); cursor: pointer; transition: background-color 0.3s ease; }
.cl--light .cl-pill { color: #1A1A1A; background: rgba(237, 237, 237, 0.8); }
.cl-pill:hover { background: rgba(80, 80, 84, 0.8); }
.cl--light .cl-pill:hover { background: rgba(220, 220, 225, 0.9); }
.cl-plus { flex: 0 0 auto; display: grid; place-items: center; width: 24px; height: 24px; margin-top: -1px; border-radius: 50%; background: #EDEDED; color: #1A1A1A; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.cl--light .cl-plus { background: #1A1A1A; color: #EDEDED; }
.cl-plus svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; }
.cl-pill.is-on .cl-plus { transform: rotate(45deg); }
.cl-body { display: grid; min-width: 0; }
.cl-body b { font-size: 17px; line-height: 1.29; font-weight: 600; letter-spacing: -0.022em; }
.cl-text { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.cl-text > span { overflow: hidden; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: rgba(237, 237, 237, 0.8); }
.cl--light .cl-text > span { color: #5E5E5E; }
.cl-pill.is-on .cl-text { grid-template-rows: 1fr; }
.cl-pill.is-on .cl-text > span { padding-top: 6px; }
.cl-foot { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 12px 32px; margin-top: 24px; }
.cl-mtext { display: none; }
.cl-more { display: inline-flex; gap: 4px; margin-left: auto; font-size: 17px; letter-spacing: -0.022em; color: #FFFFFF; white-space: nowrap; }
.cl--light .cl-more { color: #002366; }
.cl-more::after { content: '›'; font-size: 1.15em; line-height: 1; }
.cl-more:hover { text-decoration: underline; }
@keyframes cl-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* Телефон: кадр сверху, капсулы лентой, текст под ними */
@media (max-width: 833px) {
  .cl { width: 100%; }
  .cl-stage { height: auto; overflow: visible; border-radius: 0; background: none; }
  .cl-media { position: relative; height: 112vw; max-height: 560px; margin: 0 6.25vw; overflow: hidden; border-radius: var(--r-md); background: #1A1A1A; }
  .cl--light .cl-media { background: #fff; }
  .cl-media img.is-contain { inset: 8%; width: 84%; height: 84%; }
  .cl-stage::after { display: none; }
  .cl-chip { right: 16px; bottom: 16px; }
  .cl-list { position: static; transform: none; flex-direction: row; gap: 10px; width: auto; margin-top: 16px; padding: 0 6.25vw; overflow-x: auto; scrollbar-width: none; }
  .cl-list::-webkit-scrollbar { display: none; }
  .cl-pill { padding: 10px 18px 10px 10px; white-space: nowrap; align-items: center; }
  .cl-text { display: none; }
  .cl-foot { flex-direction: column; align-items: flex-start; padding: 0 6.25vw; }
  .cl-mtext { display: block; margin: 0; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #8A8A8A; }
  .cl--light .cl-mtext { color: #5E5E5E; }
  .cl-mtext b { color: #EDEDED; font-weight: 600; }
  .cl--light .cl-mtext b { color: #1A1A1A; }
  .cl-more { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cl-media img, .cl-text, .cl-plus { transition: none; }
  .cl-chip { animation: none; }
}
</style>
