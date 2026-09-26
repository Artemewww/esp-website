import { requireAdmin } from '../../utils/adminAuth'
import { contentStorage } from '../../utils/contentStore'

const KEY = 'raskadrovka/data.json'
const HISTORY_KEY = 'raskadrovka/history.json'
const HISTORY_LIMIT = 200

/**
 * Раскадровка ESP_final_040926_1080.mp4.
 *
 * Данные лежат в общем хранилище контента: локально это папка, на Vercel —
 * Blob (тот же механизм, что у админки сайта). Клиент и подрядчик открывают
 * одну и ту же ссылку и видят актуальные правки друг друга.
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const store = await contentStorage()

  if (getMethod(event) === 'GET') {
    // getItem у unstorage сам разбирает JSON; может вернуть и строку, и объект.
    const raw = await store.getItem(KEY)
    const blocks = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []
    let history: unknown[] = []
    try {
      const hRaw = await store.getItem(HISTORY_KEY)
      history = hRaw ? (typeof hRaw === 'string' ? JSON.parse(hRaw) : (hRaw as unknown[])) : []
    } catch { history = [] }
    return {
      blocks: Array.isArray(blocks) ? blocks : [],
      history,
      updatedAt: raw ? await store.getMeta(KEY).then((m) => m?.mtime ?? null) : null
    }
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody<{ blocks?: unknown; note?: string }>(event)
    if (!Array.isArray(body?.blocks)) {
      throw createError({ statusCode: 400, statusMessage: 'Ожидался массив blocks' })
    }

    const blocks = body.blocks
    let history: { at: string; blocks: number; note: string }[] = []
    try {
      const raw = await store.getItem(HISTORY_KEY)
      const parsed = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : []
      if (Array.isArray(parsed)) history = parsed
    } catch { history = [] }

    const entry = {
      at: new Date().toISOString(),
      blocks: blocks.length,
      note: typeof body.note === 'string' ? body.note.slice(0, 300) : ''
    }
    history.unshift(entry)
    if (history.length > HISTORY_LIMIT) history = history.slice(0, HISTORY_LIMIT)

    await store.setItem(KEY, JSON.stringify(blocks))
    await store.setItem(HISTORY_KEY, JSON.stringify(history))
    return { ok: true, at: entry.at }
  }
})