// v-fit-text: однострочный заголовок не обрезается троеточием и не переносится —
// шрифт плавно уменьшается, пока текст не поместится (не меньше min, по умолчанию 12px).
const fit = (el, min) => {
  el.style.fontSize = ''
  let size = parseFloat(getComputedStyle(el).fontSize)
  let guard = 40
  while (el.scrollWidth > el.clientWidth + 1 && size > min && guard--) {
    size -= 0.5
    el.style.fontSize = size + 'px'
  }
}
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('fit-text', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      const min = Number(binding.value) || 12
      const run = () => fit(el, min)
      el.__fit = run
      requestAnimationFrame(run)
      if (document.fonts?.ready) document.fonts.ready.then(run)
      el.__fitRo = new ResizeObserver(run)
      el.__fitRo.observe(el.parentElement || el)
    },
    updated(el) { el.__fit && requestAnimationFrame(el.__fit) },
    beforeUnmount(el) { el.__fitRo?.disconnect() }
  })
})
