import { onMounted, onBeforeUnmount } from 'vue'

// Плавное появление блоков .dj-reveal внутри корня при прокрутке
export function useReveal(rootRef) {
  let io = null
  onMounted(() => {
    const els = rootRef.value?.querySelectorAll('.dj-reveal') || []
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return }
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        // Соседи в одной сетке выходят лесенкой
        const sibs = Array.from(e.target.parentElement?.children || [])
        e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 4) * 80}ms`
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    els.forEach((el) => io.observe(el))
  })
  onBeforeUnmount(() => io?.disconnect())
}
