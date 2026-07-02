import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'
import { expertsList } from '~/composables/useExperts'
import { technologiesList } from '~/composables/useTechnologies'
import { servicesList } from '~/composables/useServices'
import { articlesList } from '~/composables/useArticles'
import { vacanciesList } from '~/composables/useVacancies'

export default defineSitemapEventHandler(() => {
  const urls: Array<{ loc: string; _sitemap?: string }> = []

  equipmentList.forEach((e) => urls.push({ loc: `/equipment/${e.slug}` }))
  projectsList.forEach((p) => urls.push({ loc: `/projects/${p.slug}` }))
  expertsList.forEach((ex) => urls.push({ loc: `/team/${ex.slug}` }))
  technologiesList.forEach((t) => urls.push({ loc: `/technologies/${t.slug}` }))
  servicesList.forEach((s) => urls.push({ loc: `/services/${s.slug}` }))
  articlesList.forEach((a) => urls.push({ loc: `/articles/${a.slug}` }))
  vacanciesList.forEach((v) => urls.push({ loc: `/team/vacancies/${v.slug}` }))

  return urls
})
