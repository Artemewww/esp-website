import { put, list, del } from '@vercel/blob'
import type { Driver } from 'unstorage'

/**
 * Доступ к Vercel Blob вместо штатного драйвера unstorage.
 *
 * Два отличия, без которых админка работает неправильно, но молча:
 *
 * 1. Чтение не через list(). Штатный драйвер сначала ищет файл в list(),
 *    а этот перечень отстаёт от записи на несколько минут. Сразу после
 *    сохранения файл «ещё не виден», сайт отдаёт исходный текст, и со
 *    стороны это выглядит как «правка не сохранилась». Публичный адрес
 *    файла однозначно выводится из идентификатора хранилища, поэтому
 *    читаем прямо по нему.
 * 2. JSON с контентом пишется с нулевым кэшем и читается с no-store:
 *    Vercel отдаёт публичные файлы кэшированными, и после перезаписи
 *    вернулась бы прежняя копия. Картинкам и видео, наоборот, ставим
 *    длинный кэш — у них в имени метка времени, они неизменяемы.
 */
const JSON_CACHE = 0
const MEDIA_CACHE = 60 * 60 * 24 * 365

/** Токен вида vercel_blob_rw_<ID хранилища>_<секрет>. */
const storeHost = (token: string) => {
  const id = token.split('_')[3]
  if (!id) throw new Error('BLOB_READ_WRITE_TOKEN не похож на токен Vercel Blob')
  return `${id.toLowerCase()}.public.blob.vercel-storage.com`
}

export const vercelBlobDriver = (token: string, base = 'site-content'): Driver => {
  const host = storeHost(token)
  const path = (key: string) => `${base}/${key.replace(/:/g, '/')}`
  const url = (key: string) => `https://${host}/${path(key)}`

  const read = async (key: string) => {
    // Уникальный параметр в адресе заставляет обратиться к источнику, минуя
    // узел CDN. Vercel не опускает кэш публичных файлов ниже 60 секунд, а
    // страницу и сохранение обслуживают разные функции — без обхода одна из
    // них ещё минуту отдавала бы прежнюю версию. Плата — около 200 мс на
    // запрос, файлы здесь по несколько килобайт.
    const res = await fetch(`${url(key)}?v=${Date.now()}`, { cache: 'no-store' })
    return res.ok ? res : null
  }

  return {
    name: 'esp-vercel-blob',

    async hasItem (key) {
      return Boolean(await read(key))
    },

    async getItem (key) {
      const res = await read(key)
      return res ? res.text() : null
    },

    async getItemRaw (key) {
      const res = await read(key)
      return res ? Buffer.from(await res.arrayBuffer()) : null
    },

    async setItem (key, value) {
      await put(path(key), value, {
        token,
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: JSON_CACHE
      })
    },

    async setItemRaw (key, value) {
      await put(path(key), value as Buffer, {
        token,
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: MEDIA_CACHE
      })
    },

    async getMeta (key) {
      const res = await read(key)
      return res ? { url: url(key), mtime: res.headers.get('last-modified') || undefined } : null
    },

    async removeItem (key) {
      // del принимает публичный адрес, искать файл в list() не нужно.
      await del(url(key), { token }).catch(() => {})
    },

    async getKeys (prefix) {
      const { blobs } = await list({ token, prefix: path(prefix || '') })
      return blobs.map((b) => b.pathname.slice(base.length + 1))
    },

    async clear () {
      const { blobs } = await list({ token, prefix: base })
      if (blobs.length) await del(blobs.map((b) => b.url), { token })
    },

    dispose () {}
  }
}
