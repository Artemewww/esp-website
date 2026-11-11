// Короткие (4–13 с) ролики на повторе прыгали в начало каждые несколько секунд —
// это и выглядело как «тряска». Для них есть бесшовные версии «вперёд-назад»
// в /videos/loop/. Плагин подменяет источник только у видео с атрибутом loop:
// слайдер объектов играет ролик один раз и листает дальше, его не трогаем.
const LOOPS = new Set([
  'hero/fanipol_230926', 'hero/krichev_230926', 'hero/mstislavl_230926', 'hero/postavsky_230926',
  'hero/rechitsa_230926', 'hero/vitebsk_260926', 'hero/vitkonprodukt_230926', 'hero/skidel',
  'hero/about-water', 'mosaic/DJI_0470', 'mosaic/DJI_0715', 'mosaic/hero-water'
])
const RE = /\/videos\/((?:hero|mosaic)\/[\w-]+)\.mp4(?:[?#].*)?$/

function swap (v) {
  if (!v.loop) return
  const nodes = [v, ...v.querySelectorAll('source')]
  let changed = false
  for (const n of nodes) {
    const src = n.getAttribute('src')
    const m = src && src.match(RE)
    if (m && LOOPS.has(m[1])) {
      n.setAttribute('src', `/videos/loop/${m[1].split('/')[1]}.mp4`)
      changed = true
    }
  }
  if (changed && v.querySelector('source')) v.load()
}

export default defineNuxtPlugin(() => {
  const scan = (root) => {
    if (root.tagName === 'VIDEO') swap(root)
    root.querySelectorAll?.('video').forEach(swap)
  }
  const start = () => {
    scan(document)
    new MutationObserver((list) => {
      for (const r of list) {
        if (r.type === 'attributes') { if (r.target.tagName === 'VIDEO' || r.target.tagName === 'SOURCE') swap(r.target.closest('video')) }
        else r.addedNodes.forEach((n) => n.nodeType === 1 && scan(n))
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
})
