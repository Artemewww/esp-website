// Лёгкие версии фоновых роликов для телефонов: рядом с файлом лежит *-m.mp4
// (960 px, ~3–4× легче). Список собирается скриптом tools/video-m-manifest.mjs.
import list from '~/assets/video-m.json'
const HAS_M = new Set(list)
// portrait: ролик на весь экран телефона (герой главной). Для /videos/hero и
// /videos/hero60 рядом лежит вертикальный кадр *-p.mp4 720×1280 — без растяжения
// узкой полосы 16:9 до высоты экрана (оттуда и была «пиксельность»).
export const videoSrc = (src = '', portrait = false) => {
  if (!src || typeof window === 'undefined') return src
  const path = src.split('?')[0]
  if (window.innerWidth > 734 || !HAS_M.has(path)) return src
  if (portrait && /^\/videos\/hero(60)?\//.test(path) && window.innerHeight > window.innerWidth) return path.replace(/\.mp4$/, '-p.mp4')
  return path.replace(/\.mp4$/, '-m.mp4')
}
