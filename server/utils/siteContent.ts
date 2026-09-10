import { sectionByKey } from './contentRegistry'
import { contentStorage } from './contentStore'

/**
 * Что показывать на сайте: правку из хранилища, если она есть, иначе то,
 * что уехало в сборку. Хранилище недоступно — сайт всё равно отдаёт контент.
 */
export const readSection = async (key: string) => {
  const section = sectionByKey(key)
  if (!section) return null

  try {
    const saved = await (await contentStorage()).getItem<Record<string, unknown>[]>(`${key}.json`)
    if (Array.isArray(saved)) return saved
  } catch (e) {
    console.warn(`[content] хранилище недоступно для «${key}»:`, (e as Error).message)
  }
  // Ничего не кэшируем в памяти функции: экземпляров много, они живут своей
  // жизнью, и запомненное значение пережило бы «Вернуть как было» — часть
  // посетителей продолжала бы видеть отменённую правку.
  return section.defaults
}

// Ждём недолго: подтверждение — это удобство, а не условие сохранности.
// Данные в хранилище уже лежат, даже если чтение ещё показывает старое.
const CONFIRM_TRIES = 8
const CONFIRM_STEP_MS = 150

export const writeSection = async (key: string, items: Record<string, unknown>[]) => {
  const store = await contentStorage()

  // allowOverwrite обязателен: Vercel Blob по умолчанию отказывается писать
  // поверх существующего файла, и без этого флага сохранить раздел можно
  // было бы ровно один раз, а второе сохранение падало бы с ошибкой.
  await store.setItem(`${key}.json`, items, { allowOverwrite: true })

  // Blob отвечает на чтение обычно за десятки миллисекунд, но иногда
  // несколько секунд отдаёт прежнюю версию. В это окно readSection не
  // находит запись и показывает исходный текст из сборки — то есть сайт
  // на пару секунд откатывается назад. Поэтому ждём подтверждения: пока
  // хранилище не начнёт возвращать записанное, сохранение не завершено.
  const want = JSON.stringify(items)
  for (let i = 0; i < CONFIRM_TRIES; i++) {
    try {
      if (JSON.stringify(await store.getItem(`${key}.json`)) === want) return { confirmed: true }
    } catch { /* хранилище моргнуло — пробуем ещё */ }
    await new Promise((r) => setTimeout(r, CONFIRM_STEP_MS))
  }

  // Запись прошла, подтверждения не дождались. Не ошибка: данные в хранилище
  // есть, просто читаться начнут чуть позже.
  return { confirmed: false }
}

export const resetSection = async (key: string) => {
  await (await contentStorage()).removeItem(`${key}.json`)
}
