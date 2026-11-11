<template>
  <!-- Реквизиты как документ в папке: синяя папка-подложка с язычком,
       из неё выглядывает лист с шапкой бланка, строками реквизитов
       и «штампом» ESP. Кнопки скачивания — ярлыки файлов на папке. -->
  <div class="cr">
    <div class="cr-folder">
      <span class="cr-tab">Документы</span>
      <div class="cr-side">
        <h3 class="cr-h">Реквизиты предприятия</h3>
        <p class="cr-sub">ООО «Экосервиспроект» — для договора, счёта и&nbsp;платёжного поручения.</p>
        <div class="cr-files">
          <a href="/docs/rekvizity-ecoservisproekt.pdf" download class="cr-file">
            <span class="cr-file__ico cr-file__ico--pdf" aria-hidden="true">PDF</span>
            <span><b>Скачать PDF</b><small>55 Кб</small></span>
          </a>
          <a href="/docs/rekvizity-ecoservisproekt.docx" download class="cr-file">
            <span class="cr-file__ico cr-file__ico--doc" aria-hidden="true">DOC</span>
            <span><b>Скачать Word</b><small>4 Кб</small></span>
          </a>
        </div>
      </div>

      <article class="cr-sheet" aria-label="Реквизиты ООО «Экосервиспроект»">
        <header class="cr-sheet__head">
          <svg viewBox="0 0 120 61" class="cr-logo" aria-hidden="true">
            <path v-for="(d, i) in ESP_LOGO_PATHS" :key="i" :d="d" fill="#002366" />
          </svg>
          <span>ООО «Экосервиспроект»<small>Карточка предприятия</small></span>
        </header>
        <dl class="cr-list">
          <div v-for="r in items" :key="r.k">
            <dt>{{ r.k }}</dt>
            <dd>{{ r.v }}</dd>
          </div>
        </dl>
        <span class="cr-stamp" aria-hidden="true">ESP</span>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths.js'

defineProps({
  // [{ k, v }]
  items: { type: Array, required: true }
})
</script>

<style scoped>
.cr { margin-top: clamp(28px, 3vw, 44px); padding-top: 22px; }
/* Папка: синий картон с язычком сверху слева */
.cr-folder { position: relative; display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: clamp(24px, 3vw, 48px); align-items: start; padding: clamp(28px, 3.4vw, 52px); border-radius: 4px 22px 22px 22px; background: linear-gradient(160deg, #002366 0%, #002366 70%); box-shadow: var(--sh-3); color: #fff; }
.cr-tab { position: absolute; left: 0; bottom: 100%; padding: 8px 26px 6px 22px; border-radius: var(--r-sm) var(--r-md) 0 0; background: #002366; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; color: rgba(255, 255, 255, 0.85); }
.cr-tab::after { content: ''; position: absolute; left: 100%; bottom: 0; width: 22px; height: 22px; background: radial-gradient(circle at 100% 0, transparent 21px, #002366 22px); }
.cr-side { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding-top: 6px; }
.cr-h { font-size: clamp(26px, 2.4vw, 34px); line-height: 1.1; font-weight: 600; letter-spacing: -0.01em; color: #fff; }
.cr-sub { margin: 0; font-size: 17px; line-height: 1.45; letter-spacing: -0.022em; color: rgba(255, 255, 255, 0.72); }
.cr-files { display: grid; gap: 10px; width: 100%; margin-top: 14px; }
.cr-file { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: var(--r-sm); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.16); color: #fff; transition: background-color 0.2s ease, transform 0.2s ease; }
.cr-file:hover { background: rgba(255, 255, 255, 0.18); transform: translateX(3px); }
.cr-file:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.cr-file b { display: block; font-size: 15px; font-weight: 600; }
.cr-file small { font-size: 12px; color: rgba(255, 255, 255, 0.65); }
.cr-file__ico { flex: none; display: grid; place-items: end center; width: 34px; height: 42px; padding-bottom: 6px; border-radius: 4px 12px 4px 4px; background: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.04em; clip-path: polygon(0 0, 70% 0, 100% 24%, 100% 100%, 0 100%); }
.cr-file__ico--pdf { color: #c4302b; }
.cr-file__ico--doc { color: #1f5bc4; }

/* Лист: белая бумага с подложенным вторым листом и тенью */
.cr-sheet { position: relative; padding: clamp(24px, 2.6vw, 40px); border-radius: var(--r-xs); background: #fff; color: var(--dj-ink); box-shadow: 9px 10px 0 -1px #dfe5ef, 0 1px 0 rgba(0, 0, 0, 0.04), 0 22px 40px -18px rgba(0, 0, 0, 0.45); transform: rotate(-0.8deg); transition: transform 0.4s cubic-bezier(0, 0, 0.5, 1); }
.cr-folder:hover .cr-sheet { transform: rotate(0deg) translateY(-4px); }
.cr-sheet__head { display: flex; align-items: center; gap: 14px; padding-bottom: 16px; border-bottom: 2px solid #002366; font-size: 15px; font-weight: 600; }
.cr-sheet__head small { display: block; font-size: 12px; font-weight: 400; color: #5E5E5E; }
.cr-logo { flex: none; width: 52px; height: auto; }
.cr-list { margin: 0; }
.cr-list div { display: grid; grid-template-columns: 7.5rem minmax(0, 1fr); gap: 14px; padding: 13px 0; border-bottom: 1px dashed #D6D6D6; font-size: 16px; line-height: 1.45; letter-spacing: -0.02em; }
.cr-list dt { color: #5E5E5E; }
.cr-list dd { margin: 0; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; user-select: all; }
.cr-stamp { position: absolute; right: clamp(16px, 3vw, 36px); bottom: clamp(14px, 2vw, 24px); display: grid; place-items: center; width: 64px; height: 64px; border: 2px solid rgba(0, 35, 102, 0.35); border-radius: 50%; font-size: 15px; font-weight: 700; letter-spacing: 0.08em; color: rgba(0, 35, 102, 0.4); transform: rotate(-14deg); pointer-events: none; }
.cr-stamp::before { content: ''; position: absolute; inset: 4px; border: 1px solid rgba(0, 35, 102, 0.25); border-radius: 50%; }

@media (max-width: 1023px) {
  .cr-folder { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  .cr-folder { padding: 24px 16px 20px; border-radius: 4px 18px 18px 18px; }
  .cr-sheet { padding: 20px 16px 72px; transform: none; }
    .cr-list div { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .cr-stamp { width: 52px; height: 52px; font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .cr-sheet, .cr-file { transition: none; }
}
</style>
