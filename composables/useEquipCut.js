// Вырезки изделий без фона (public/images/equipment/cut/...). Список ведётся вручную:
// запрос несуществующей вырезки даёт 404, поэтому проверяем по нему, а не «наугад».
const CUT = new Set([
  'belt-filter-press', 'flotation', 'microfilter', 'polymer-station', 'rotary-drum-sieve',
  'sand-separator', 'screw-conveyor', 'real/kns-kvatro', 'real/mqu-flowmeter'
])
const keyOf = (photo = '') => photo.replace(/^\/images\/equipment\//, '').replace(/\.\w+$/, '')
export const hasCut = (photo) => CUT.has(keyOf(photo))
export const cutSrc = (photo) => (hasCut(photo) ? photo.replace('/images/equipment/', '/images/equipment/cut/') : '')
