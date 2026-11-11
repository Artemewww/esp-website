import { ref, onMounted, onBeforeUnmount } from 'vue'

// Подполоса страницы не видна со старта: выезжает под шапкой, когда
// пользователь прокрутил первый экран, и прячется, когда вернулся наверх.
export function useRevealBar (enabled = true) {
  const shown = ref(!enabled)
  let raf = 0
  const check = () => {
    raf = 0
    shown.value = window.scrollY > Math.min(window.innerHeight * 0.55, 560)
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
  onMounted(() => {
    if (!enabled) return
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
  return shown
}
