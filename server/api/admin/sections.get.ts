import { requireAdmin } from '../../utils/adminAuth'
import { sectionIndex } from '../../utils/contentRegistry'
import { contentStorage } from '../../utils/contentStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const store = (await contentStorage())

  // Показываем реальное число записей: если раздел уже правили, счёт берём
  // из хранилища, а не из сборки.
  return Promise.all(
    sectionIndex().map(async (s) => {
      const saved = await store.getItem<Record<string, unknown>[]>(`${s.key}.json`)
      return { ...s, count: Array.isArray(saved) ? saved.length : s.count, edited: Array.isArray(saved) }
    })
  )
})
