import { requireAdmin } from '../../utils/adminAuth'
import { saveMedia } from '../../utils/mediaStore'

const MAX_BYTES = 100 * 1024 * 1024
const ALLOWED = /\.(jpe?g|png|webp|gif|svg|mp4|webm|mov|pdf|docx?)$/i

const CYR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', і: 'i', ў: 'u', ' ': '-'
}

/**
 * Имя файла на диске: метка времени плюс узнаваемый хвост исходного имени.
 * Кириллицу транслитерируем, а не выбрасываем: заказчик загружает файлы
 * с русскими названиями, и «file.png» вместо «rechitsa-drone.png» — это
 * потерянный смысл при первом же взгляде на список.
 */
const safeName = (original: string) => {
  const ext = (original.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase()
  const stem = original
    .slice(0, original.length - ext.length)
    .toLowerCase()
    .replace(/[а-яёіў ]/g, (c) => CYR[c] ?? '-')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'file'
  return `${Date.now().toString(36)}-${stem}${ext}`
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'Файл не пришёл' })
  if (!ALLOWED.test(file.filename!)) {
    throw createError({ statusCode: 415, statusMessage: 'Такой тип файла загрузить нельзя' })
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Файл больше 100 МБ' })
  }

  const name = safeName(file.filename!)
  return { url: await saveMedia(name, file.data), name }
})
