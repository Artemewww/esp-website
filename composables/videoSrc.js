// Лёгкие версии фоновых роликов для телефонов: рядом с файлом лежит *-m.mp4
// (960 px, ~3–4× легче). Список собирается скриптом tools/video-m-manifest.mjs.
import list from '~/assets/video-m.json'
const HAS_M = new Set(list)
export const videoSrc = (src = '') => {
  if (!src || typeof window === 'undefined') return src
  const path = src.split('?')[0]
  return window.innerWidth <= 734 && HAS_M.has(path) ? path.replace(/\.mp4$/, '-m.mp4') : src
}
