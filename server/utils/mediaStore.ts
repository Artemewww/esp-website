import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { contentStorage, storageMode, contentDir } from './contentStore'

export const UPLOAD_DIR = 'uploads'

/**
 * Куда лечь загруженному файлу.
 *
 * В файловом режиме — рядом с контентом, а не в public/: каталог приложения
 * при выкладке новой версии заменяется целиком, и всё, что заказчик загрузил,
 * исчезло бы. Отдаёт такие файлы маршрут /media/**.
 */
export const saveMedia = async (name: string, data: Buffer) => {
  if (storageMode() === 'blob') {
    const store = await contentStorage()
    await store.setItemRaw(`${UPLOAD_DIR}/${name}`, data, { allowOverwrite: true })
    const meta = await store.getMeta(`${UPLOAD_DIR}/${name}`)
    const url = (meta as { url?: string })?.url
    if (!url) throw new Error('Хранилище не вернуло адрес файла')
    return url
  }

  const dir = join(contentDir(), UPLOAD_DIR)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, name), data)
  return `/media/${name}`
}
