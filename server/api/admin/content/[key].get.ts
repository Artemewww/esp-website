import { requireAdmin } from '../../../utils/adminAuth'
import { sectionByKey } from '../../../utils/contentRegistry'
import { readSection } from '../../../utils/siteContent'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const key = getRouterParam(event, 'key') as string
  const section = sectionByKey(key)
  if (!section) throw createError({ statusCode: 404, statusMessage: 'Такого раздела нет' })

  const { defaults, ...spec } = section
  return { section: spec, items: await readSection(key) }
})
