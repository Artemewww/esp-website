import { requireAdmin } from '../../../utils/adminAuth'
import { sectionByKey } from '../../../utils/contentRegistry'
import { writeSection } from '../../../utils/siteContent'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const key = getRouterParam(event, 'key') as string
  if (!sectionByKey(key)) throw createError({ statusCode: 404, statusMessage: 'Такого раздела нет' })

  const body = await readBody<{ items?: unknown }>(event)
  const items = body?.items
  if (!Array.isArray(items) || items.some((i) => typeof i !== 'object' || i === null || Array.isArray(i))) {
    throw createError({ statusCode: 400, statusMessage: 'Ожидался список записей' })
  }

  const { confirmed } = await writeSection(key, items as Record<string, unknown>[])
  return { ok: true, count: items.length, confirmed }
})
