// Что показывать на плашке оборудования: качественный рендер (только чистые
// рендеры на белом из /images/equipment/) или серую заглушку его типа.
// Фото с объектов в каталоге не используем, пока нет рендеров по всем позициям.
export const PLACEHOLDER_KIND = {
  'kns-kvatro': 'pump-station',
  'bs-bio-station': 'bio',
  'orl-storm-water': 'storm',
  'miniklar-mikroklar': 'septic',
  'lt-grease-traps': 'grease',
  'bc-local-treatment': 'modules',
  'ultrasonic-flowmeter': 'meter',
  'polypropylene-tanks': 'tanks',
  'aeration-systems': 'aeration',
  'kubicek-blowers': 'blower',
  'zenit-pumps': 'pump',
  'treatment-facilities-general': 'plant',
  'fibroil-sorbent': 'sorbent'
}

export const renderOf = (p) => {
  const src = p?.image || p?.photo || ''
  const alt = p?.photo || ''
  for (const s of [src, alt]) if (/^\/images\/equipment\/[a-z-]+\.webp$/.test(s)) return s
  return null
}

export const placeholderOf = (p) => PLACEHOLDER_KIND[p?.slug] || 'gear'
