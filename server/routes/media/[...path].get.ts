import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, normalize } from 'node:path'
import { contentDir } from '../../utils/contentStore'
import { UPLOAD_DIR } from '../../utils/mediaStore'

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
  gif: 'image/gif', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm',
  mov: 'video/quicktime', pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

/**
 * Отдаёт файлы, загруженные через админку в файловом режиме.
 * На Vercel этот маршрут не используется: там ссылки ведут прямо в Blob.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'path') || ''

  // Имя файла и только оно: без подпапок и без «..», иначе маршрут стал бы
  // способом прочитать любой файл на сервере.
  const name = normalize(decodeURIComponent(raw)).replace(/^(\.\.[/\\])+/, '')
  if (!name || name.includes('/') || name.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: 'Неверный адрес файла' })
  }

  const file = join(contentDir(), UPLOAD_DIR, name)
  const info = await stat(file).catch(() => null)
  if (!info?.isFile()) throw createError({ statusCode: 404, statusMessage: 'Файл не найден' })

  const ext = name.split('.').pop()?.toLowerCase() || ''
  setHeader(event, 'content-type', TYPES[ext] || 'application/octet-stream')
  setHeader(event, 'content-length', info.size)
  // Имя файла содержит метку времени, поэтому новая версия — это новый адрес.
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
  return sendStream(event, createReadStream(file))
})
