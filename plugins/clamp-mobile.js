// v-clamp-mobile: на мобильных (≤734px) длинный абзац сворачивается до N строк
// (по умолчанию 4) с маленькой ссылкой «Подробнее»; нажатие раскрывает текст.
// Десктоп не меняется. Кроме явной директивы, плагин сам находит длинные
// лиды разделов (*lede*, *-lead, *intro*) на каждой странице — без правки шаблонов.
// DOM не дописывается: метка — псевдоэлемент ::after (стили в assets/styles/dji.css).
const MQ = '(max-width: 734px)'
const AUTO = [
  '[data-clamp]',
  '[class*="lede"]:not([class*="lede__"]):not([class*="lede-"])',
  '[class$="-lead"]', '[class*="-lead "]',
  '[class$="-intro"]', '[class*="-intro "]',
  '.eqc-sub', '.rs-text', '.tw-text', '.eqp-ch-text > p'
].join(',')

const parseBg = (el) => {
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (m) {
      const [r, g, b, a = 1] = m[1].split(',').map(Number)
      if (a > 0.5) return { css: `rgb(${r},${g},${b})`, dark: (0.299 * r + 0.587 * g + 0.114 * b) < 128 }
    }
  }
  return { css: '#fff', dark: false }
}

const onClick = (e) => {
  const el = e.currentTarget
  if (!el.classList.contains('cm-clamp') || e.target.closest('a,button,input,label')) return
  el.classList.toggle('cm-open')
}

const apply = (el) => {
  if (el.closest('.sh, footer, form, [data-noclamp]')) return
  const mobile = window.matchMedia(MQ).matches
  const lines = Number(el.dataset.clamp) || 4
  const wasOpen = el.classList.contains('cm-open')
  el.classList.remove('cm-clamp', 'cm-open')
  if (!mobile) return
  const cs = getComputedStyle(el)
  if (cs.display === 'none' || cs.display.startsWith('inline') || el.querySelector('div,ul,ol,img,svg,video,p,h2,h3,input')) return
  const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4
  // свернуть, если текста больше чем N+1 строк (иначе «Подробнее» экономит одну строку)
  if (el.scrollHeight <= lh * (lines + 1) + 4) return
  const bg = parseBg(el)
  el.style.setProperty('--cm-lines', lines)
  el.style.setProperty('--cm-bg', bg.css)
  el.style.setProperty('--cm-link', bg.dark ? '#2997ff' : '#0066cc')
  el.classList.add('cm-clamp')
  if (wasOpen) el.classList.add('cm-open')
  if (!el.__cmBound) { el.addEventListener('click', onClick); el.__cmBound = true }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('clamp-mobile', {
    getSSRProps: (b) => ({ 'data-clamp': b.value || 4 }),
    mounted(el, b) { el.dataset.clamp = b.value || 4; requestAnimationFrame(() => apply(el)) }
  })
  if (import.meta.server) return

  const scan = () => document.querySelectorAll(AUTO).forEach(apply)
  let t1, t2
  const schedule = () => {
    clearTimeout(t1); clearTimeout(t2)
    t1 = setTimeout(scan, 250)
    t2 = setTimeout(scan, 1500) // данные и шрифты догружаются
  }
  nuxtApp.hook('page:finish', schedule)
  nuxtApp.hook('app:mounted', schedule)
  let lastW = window.innerWidth
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return // мобильный скролл меняет только высоту
    lastW = window.innerWidth
    schedule()
  }, { passive: true })
  document.fonts?.ready?.then(schedule)
})
