// v-lazy-video: фоновые ролики не мешают первой загрузке страницы.
// В разметке ролик стоит с постером и data-src вместо src (без autoplay).
// Источник подключается, только когда страница уже загрузилась (постер
// остаётся LCP-кадром) и блок подошёл к экрану; вне экрана ролик на паузе.
// Так браузер не качает десятки мегабайт видео, которые никто не видит.
const afterLoad = () => new Promise((resolve) => {
  const idle = () => (window.requestIdleCallback ? requestIdleCallback(resolve, { timeout: 2500 }) : setTimeout(resolve, 300))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
})

let io = null
const getIO = () => {
  if (io) return io
  io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.load() }
        if (!v.dataset.noplay) v.play?.().catch(() => {})
      } else if (!v.paused) v.pause()
    })
  }, { rootMargin: '200px 0px' })
  return io
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy-video', {
    getSSRProps: () => ({}),
    async mounted(el, binding) {
      if (binding.value === false) return
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      await afterLoad()
      if (!el.isConnected) return
      getIO().observe(el)
    },
    updated(el) {
      // src поменялся (смена слайда) — подхватываем новый ролик, если уже грузили
      if (el.src && el.dataset.src && !el.src.endsWith(el.dataset.src)) { el.src = el.dataset.src; el.load(); el.play?.().catch(() => {}) }
    },
    beforeUnmount(el) { io?.unobserve(el) }
  })
})
