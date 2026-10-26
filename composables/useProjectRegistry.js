import registryDefaults from '~/content/defaults/registry.json'

/**
 * Реестр локальных объектов ESP (240 объектов со страницы
 * ecoservisproekt.com/projects). Исходные данные —
 * content/defaults/registry.json, правятся в админке («Локальные объекты»).
 *
 * category — одна из четырёх отраслевых категорий (projectCategories),
 * kind — прежний тип работ (биологическая очистка, ливневая канализация…).
 * Координаты — привязки к населённым пунктам с лёгким разбросом, чтобы
 * совпадающие адреса не сливались в одну точку на карте.
 */
export const projectRegistry = registryDefaults

export const registryCategories = [
  'Коммунальное хозяйство',
  'Мясопереработка',
  'Молочные предприятия',
  'Локальные очистные сооружения'
]
export const registryKinds = ['Биологическая очистка', 'Ливневая канализация', 'Насосные станции', 'Автономная канализация', 'КИПиА']
export const registryRegions = ['Минская обл.', 'Витебская обл.', 'Гомельская обл.', 'Гродненская обл.', 'Могилёвская обл.', 'Брестская обл.']

export const useRegistry = () => {
  const registry = useEditableList('registry', projectRegistry)
  return { registry }
}
