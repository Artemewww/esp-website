// Слайды для ObjectsSlider: из слайдов главной (админка) и из projects.json.
// Объекты сортируются по производительности — от самого крупного к малому.

const num = (s) => Number(String(s || '').replace(/[^\d]/g, '')) || 0
const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

const splitCap = (text) => {
  const m = String(text || '').match(/([\d\s ]+)\s*(м³\/сут(?:ки)?|м3\/сут)/)
  if (!m) return null
  return { value: fmt(num(m[1])), unit: 'м³/сут', n: num(m[1]) }
}

const shortName = (title) => {
  const t = String(title || '')
  const m = t.match(/(?:города|деревне|в д\.|СПК|ОАО|ООО|завода)\s+(.+)$/)
  const s = (m ? m[1] : t).replace(/[«»"]/g, '').replace(/^город[а]?\s+/, '')
  return s.length > 30 ? s.slice(0, 28) + '…' : s
}

const yearOf = (text) => (String(text || '').match(/(20\d\d|19\d\d)/) || [])[1]

const posterOf = (s) => s.poster || s.image || (s.video ? s.video.replace(/\.mp4$/, '.jpg') : undefined)

export function slidesFromHero(raw) {
  const list = (Array.isArray(raw) ? raw : []).filter((s) => s && (s.video || s.image))
  const intro = []
  const objects = []
  list.forEach((s, i) => {
    const [region, capText] = String(s.badge || '').split('|').map((x) => x.trim())
    const cap = splitCap(capText || s.badge)
    const base = { key: (s.video || s.image) + i, video: s.video, poster: posterOf(s), link: s.link || '/projects', title: s.title }
    if (!cap) {
      intro.push({ ...base, intro: true, eyebrow: s.badge, desc: s.description, link: s.link || '/contacts#contact-form', short: 'ESP' })
    } else {
      const y = yearOf(s.description)
      objects.push({ ...base, eyebrow: [region, y && `${y} г.`].filter(Boolean).join(' · '), value: cap.value, unit: cap.unit, n: cap.n, short: shortName(s.title) })
    }
  })
  objects.sort((a, b) => b.n - a.n)
  return [...intro, ...objects]
}

export function slidesFromProjects(projects) {
  return (projects || [])
    .filter((p) => p.video || p.poster)
    .map((p) => {
      const cap = splitCap(p.capacity) || { value: p.capacity, unit: '', n: 0 }
      const y = yearOf(p.year)
      return {
        key: p.slug,
        video: p.sliderVideo || p.video,
        poster: p.sliderPoster || p.poster || (p.gallery && p.gallery[0]),
        link: `/projects/${p.slug}`,
        title: p.name,
        eyebrow: [p.location, p.region, y && `${y} г.`].filter(Boolean).join(' · '),
        value: cap.value,
        unit: cap.unit,
        n: cap.n,
        short: shortName(p.name)
      }
    })
    .sort((a, b) => b.n - a.n)
}
