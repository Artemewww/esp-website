import projectsDefaults from '~/content/defaults/projects.json'

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

export const useProjects = () => {
  const projects = useEditableList('projects', projectsList)
  const getBySlug = (slug) => projects.value.find(p => p.slug === slug)
  return { projects, getBySlug, projectsList }
}
