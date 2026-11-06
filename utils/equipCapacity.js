// Производительность из каталога разбирается на крупное число и единицу —
// как «20 L/day» в карточках Watergen. Если числа нет («индивидуально»),
// возвращаем только текст.
export const splitCapacity = (raw) => {
  const s = String(raw || '').trim()
  if (!s) return null
  const m = s.match(/^(от|до)?\s*([\d.,]+(?:\s*[–-]\s*[\d.,]+)?)\s*(м³\/ч|м³\/сутки|м³\/сут|л\/с)?/i)
  if (!m || !m[2]) return { text: s }
  return {
    prefix: m[1] || '',
    num: m[2].replace(/\s+/g, ''),
    unit: m[3] || '',
    rest: s.slice(m[0].length).trim()
  }
}
