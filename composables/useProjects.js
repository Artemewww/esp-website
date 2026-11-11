import projectsDefaults from '~/content/defaults/projects.json'
import { solutions } from '~/composables/useSiteNav'

/**
 * Ключевые объекты. Исходные данные — content/defaults/projects.json,
 * заказчик правит их в админке (раздел «Ключевые объекты»).
 *
 * projectsList — статичный список из сборки. Оставлен для обратной
 * совместимости (поиск, страницы технологий/оборудования/статей): там,
 * где нужны правки из админки, берите `projects` из useProjects().
 */
export const projectsList = projectsDefaults

export const projectCategories = [
  'Коммунальное хозяйство',
  'Мясопереработка',
  'Молочные предприятия',
  'Локальные очистные сооружения'
]

// ===== Ниши «Решения для бизнеса» =====
// Четыре направления из useSiteNav.solutions. Объект (ключевой или из реестра)
// относим к нише по отраслевой категории и описанию: в «Мясопереработке»
// птицефабрики, агрокомбинаты и цеха КРС — агрокомплексы, мясокомбинаты
// и цеха переработки — пищевая промышленность (как в solutions.only).
// Цвет и иконка — общие для фильтров, легенды и капель на карте.
export const NICHE_STYLE = {
  // Город: здания очистных и жилой квартал
  'vodokanaly': { color: '#0a3a8c', icon: 'M3 21h18M5 21V10l5-3v14M10 21V4l9 4v13M13 11h3M13 15h3' },
  // Агро: росток
  'agrokompleksy': { color: '#1f8a4c', icon: 'M12 21V11M12 11c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 15c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z' },
  // Пищевое производство: цех с пилообразной крышей
  'pishchevaya-promyshlennost': { color: '#d9480f', icon: 'M3 21V11l5 3v-3l5 3V7l8-3v17H3zM7 17.5h2M12 17.5h2M17 17.5h2' },
  // Дом и коммерческий объект
  'chastnye-i-kommercheskie': { color: '#7048e8', icon: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5' }
}
export const projectNiches = solutions.map((s) => ({ slug: s.slug, title: s.title, short: s.short, ...NICHE_STYLE[s.slug] }))

const FOOD_RE = /мясокомбинат|витконпродукт|сыродел|молоч|колбас|консерв/i
export const nicheOf = (o = {}) => {
  const c = o.category
  if (c === 'Коммунальное хозяйство') return 'vodokanaly'
  if (c === 'Молочные предприятия') return 'pishchevaya-promyshlennost'
  if (c === 'Мясопереработка') return FOOD_RE.test(`${o.name || ''} ${o.facility || ''}`) ? 'pishchevaya-promyshlennost' : 'agrokompleksy'
  return 'chastnye-i-kommercheskie'
}
export const nicheInfo = (o) => projectNiches.find((n) => n.slug === nicheOf(o)) || projectNiches[3]

// Производительность в м³/сут числом (для сортировки и размера капли).
// Значения в других единицах (ОРЛ 15 л/с и т. п.) — 0.
export const capacityNum = (s) => {
  const m = String(s || '').match(/([\d\s  ]+[\d])\s*м[³3]\s*\/\s*сут/)
  return m ? Number(m[1].replace(/\D/g, '')) || 0 : 0
}

export const useProjects = () => {
  const projects = useEditableList('projects', projectsList)
  const getBySlug = (slug) => projects.value.find(p => p.slug === slug)
  return { projects, getBySlug, projectsList }
}
