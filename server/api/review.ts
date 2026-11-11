// ВРЕМЕННО, только для разработки: правки владельца поверх сайта.
// Хранилище — папка «_правки» в проекте на рабочем столе: review.json + фото.
// В боевой сборке (не dev) маршрут отвечает 404. Удалить вместе с plugins/review.client.js.
import { promises as fs } from 'node:fs'
import { join, basename } from 'node:path'
import { homedir } from 'node:os'

const DIR = join(homedir(), 'Desktop', 'ESP_Проект_Финал_2026', '_правки')
const DB = join(DIR, 'review.json')

async function load () {
  try { return JSON.parse(await fs.readFile(DB, 'utf8')) } catch { return [] }
}
async function save (list) {
  await fs.mkdir(DIR, { recursive: true })
  await fs.writeFile(DB, JSON.stringify(list, null, 2))
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) throw createError({ statusCode: 404 })
  const method = event.method
  const q = getQuery(event)

  if (method === 'GET' && q.file) {
    const f = join(DIR, basename(String(q.file)))
    const buf = await fs.readFile(f).catch(() => null)
    if (!buf) throw createError({ statusCode: 404 })
    setHeader(event, 'content-type', f.endsWith('.png') ? 'image/png' : 'image/jpeg')
    return buf
  }
  if (method === 'GET') return load()

  const list = await load()

  if (method === 'POST') {
    const b = await readBody(event)
    const id = Date.now().toString(36)
    const files = []
    for (const [i, img] of (b.images || []).slice(0, 6).entries()) {
      const m = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(img || '')
      if (!m) continue
      const name = `${id}-${i + 1}.${m[1] === 'png' ? 'png' : 'jpg'}`
      await fs.mkdir(DIR, { recursive: true })
      await fs.writeFile(join(DIR, name), Buffer.from(m[2], 'base64'))
      files.push(name)
    }
    const item = {
      id,
      n: (list.reduce((a, x) => Math.max(a, x.n || 0), 0) || 0) + 1,
      created: new Date().toISOString(),
      page: String(b.page || ''),
      selector: String(b.selector || ''),
      element: String(b.element || '').slice(0, 300),
      fx: Number(b.fx) || 0,
      fy: Number(b.fy) || 0,
      x: Number(b.x) || 0,
      y: Number(b.y) || 0,
      viewport: String(b.viewport || ''),
      area: b.area && typeof b.area === 'object'
        ? Object.fromEntries(['fx', 'fy', 'fw', 'fh', 'x', 'y', 'w', 'h'].map((k) => [k, Number(b.area[k]) || 0]))
        : null,
      text: String(b.text || '').slice(0, 5000),
      images: files,
      done: false
    }
    list.push(item)
    await save(list)
    return item
  }

  if (method === 'PATCH') {
    const b = await readBody(event)
    const it = list.find((x) => x.id === b.id)
    if (!it) throw createError({ statusCode: 404 })
    if (typeof b.text === 'string') it.text = b.text.slice(0, 5000)
    if (typeof b.done === 'boolean') it.done = b.done
    await save(list)
    return it
  }

  if (method === 'DELETE') {
    const it = list.find((x) => x.id === q.id)
    if (it) for (const f of it.images) await fs.unlink(join(DIR, f)).catch(() => {})
    await save(list.filter((x) => x.id !== q.id))
    return { ok: true }
  }

  throw createError({ statusCode: 405 })
})
