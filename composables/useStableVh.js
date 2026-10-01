// Высота окна, которая не прыгает во время прокрутки.
//
// На телефоне адресная строка прячется и возвращается прямо под пальцем:
// window.innerHeight меняется на 40–80 пикселей посреди жеста. Блоки, которые
// считают прогресс как (высота секции − высота окна), от этого дёргались —
// палец ведёт ровно, а сцена прыгает, потому что меняется знаменатель.
//
// Поэтому высоту запоминаем и обновляем только при настоящем изменении
// размера: сменилась ширина (поворот экрана, окно на десктопе) или высота
// скакнула больше порога — столько адресная строка не занимает.
const THRESHOLD = 140

let cachedH = 0
let cachedW = 0

// Возвращает устойчивую высоту окна. Безопасно вызывать на каждом кадре.
export const stableVh = () => {
  if (typeof window === 'undefined') return 0
  const w = window.innerWidth
  const h = window.innerHeight
  if (!cachedH || w !== cachedW || Math.abs(h - cachedH) >= THRESHOLD) {
    cachedH = h
    cachedW = w
  }
  return cachedH
}

// Принудительно пересчитать — например, после смены ориентации.
export const refreshStableVh = () => {
  if (typeof window === 'undefined') return 0
  cachedH = window.innerHeight
  cachedW = window.innerWidth
  return cachedH
}
