// Ждём, пока элемент подойдёт к экрану (запас 400px), — и только тогда
// грузим тяжёлое (карты Leaflet с тайлами). Первая загрузка страницы
// так не тратит канал и не ставит сторонние cookies раньше времени.
export const whenNear = (el, margin = '400px') => new Promise((resolve) => {
  if (!el || !('IntersectionObserver' in window)) return resolve()
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); resolve() }
  }, { rootMargin: `${margin} 0px` })
  io.observe(el)
})
