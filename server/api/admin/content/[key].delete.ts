import { requireAdmin } from '../../../utils/adminAuth'
import { sectionByKey } from '../../../utils/contentRegistry'
import { resetSection } from '../../../utils/siteContent'

/** Откат раздела к тому, что было в сборке на момент передачи сайта. */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const key = getRouterParam(event, 'key') as string
  if (!sectionByKey(key)) throw createError({ statusCode: 404, statusMessage: 'Такого раздела нет' })
  await resetSection(key)
  return { ok: true }
})
