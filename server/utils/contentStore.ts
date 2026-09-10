import { createStorage, type Storage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { resolve } from 'node:path'

/**
 * Хранилище правок из админки.
 *
 * Драйвер выбирается окружением, а не кодом, потому что сайт переезжает:
 * сейчас Vercel (файловая система только для чтения — правки уходят в Blob),
 * дальше HOSTER.by (обычный сервер с записью — правки лягут в папку).
 * Прикладной код обоих случаев не различает.
 *
 *   CONTENT_STORAGE  fs | blob   — чем пользоваться. Не задано: blob, если
 *                                 есть токен, иначе fs.
 *   CONTENT_DIR                  — папка для fs. На сервере укажите путь
 *                                 ВНЕ каталога приложения, иначе выкладка
 *                                 новой версии сотрёт правки.
 */
let cached: Storage | null = null

export const storageMode = (): 'fs' | 'blob' => {
  const forced = process.env.CONTENT_STORAGE
  if (forced === 'fs' || forced === 'blob') return forced
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'fs'
}

/** Корень для файлового режима: сюда же складываются загруженные медиа. */
export const contentDir = () => resolve(process.env.CONTENT_DIR || './.data/content')

export const contentStorage = async (): Promise<Storage> => {
  if (cached) return cached

  if (storageMode() === 'blob') {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) throw new Error('CONTENT_STORAGE=blob, но BLOB_READ_WRITE_TOKEN не задан')
    // Свой драйвер вместо штатного: тот читает через CDN-кэш и после
    // перезаписи месяц отдаёт старую копию. Грузим лениво — на обычном
    // хостинге пакета @vercel/blob может не быть вовсе.
    const { vercelBlobDriver } = await import('./blobDriver')
    cached = createStorage({ driver: vercelBlobDriver(token) })
  } else {
    cached = createStorage({ driver: fsDriver({ base: contentDir() }) })
  }
  return cached
}
