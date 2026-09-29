import { projectRegistry } from '~/composables/useProjectRegistry'
import { projectsList } from '~/composables/useProjects'

// Флагманы — объекты, у которых есть своя съёмка и отдельная страница.
// Координаты: где объект есть в реестре — берём оттуда, иначе привязка
// к населённому пункту, как и весь остальной реестр. Раньше карта метила
// «ключевые» точки по полю featuredSlug в реестре, но совпадали там только
// названия городов: заправочная ливнёвка в Речице вела на страницу городских
// очистных. Теперь флагманы — отдельный слой поверх реестра.
const FLAGSHIP_GEO = {
  'rechitsa': [30.3944, 52.3626],
  'fanipol': [27.3333, 53.7500],
  'krichev': [31.7161, 53.7078],
  'mstislavl': [31.7231, 54.0231],
  'skidel': [24.2456, 53.5931],
  'krasnoe': [26.9867, 54.2625],
  'postavy-dairy': [26.8333, 55.1167],
  'vitkonprodukt': [29.5669, 55.2906],
  'godylevo': [30.2472, 53.5194],
  'agrokombinat-snov': [26.6542, 53.2117],
  'vitebsk-broiler': [30.1093, 55.1446]
}

export const projectGeo = FLAGSHIP_GEO

export const useProjectGeo = () => {
  const registryPoints = projectRegistry.map(p => ({
    lng: p.lng,
    lat: p.lat,
    name: p.name,
    location: p.location,
    region: p.region,
    capacity: p.capacity,
    category: p.category,
    facility: p.facility,
    featuredSlug: null,
    flagship: false
  }))

  const flagshipPoints = projectsList
    .filter(p => FLAGSHIP_GEO[p.slug])
    .map(p => ({
      lng: FLAGSHIP_GEO[p.slug][0],
      lat: FLAGSHIP_GEO[p.slug][1],
      name: p.name,
      location: p.location,
      region: p.region,
      capacity: p.capacity || '—',
      category: p.category,
      facility: p.desc,
      featuredSlug: p.slug,
      flagship: true
    }))

  // Флагманы идут последними, чтобы их метки ложились поверх точек реестра.
  const mapPoints = [...registryPoints, ...flagshipPoints]

  return { projectGeo, mapPoints, flagshipPoints }
}
