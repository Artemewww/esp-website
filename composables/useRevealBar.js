import { ref, onMounted, onBeforeUnmount } from 'vue'

// Подполоса страницы не видна со старта: выезжает под шапкой, когда
// пользователь прокрутил первый экран, и прячется, когда вернулся наверх.
export function useRevealBar (enabled = true) {
  const shown = ref(!enabled)
  let raf = 0
  // Порог фиксируем один раз: на телефоне innerHeight меняется, когда браузер
  // прячет адресную строку, и полоса начинала мигать у порога. Плюс зазор
  // ±40px (гистерезис), чтобы мелкая прокрутка у границы её не дёргала.
  let edge = 400
  const check = () => {
    raf = 0
    const y = window.scrollY
    if (shown.value ? y < edge - 40 : y > edge + 40) shown.value = !shown.value
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
  onMounted(() => {
    if (!enabled) return
    edge = Math.min(window.innerHeight * 0.55, 560)
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
  return shown
}
