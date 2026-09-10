import { sectionByKey } from '../../utils/contentRegistry'
import { readSection } from '../../utils/siteContent'

/** Публичное чтение: страницы сайта берут контент отсюда. */
export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key') as string
  if (!sectionByKey(key)) throw createError({ statusCode: 404, statusMessage: 'Такого раздела нет' })
  // Никакого кэша: это ручка админки, а не статика. С s-maxage правка,
  // сохранённая заказчиком, до десяти минут не появлялась бы на сайте —
  // и выглядело бы это как «админка не работает».
  setHeader(event, 'cache-control', 'no-store, max-age=0')
  return readSection(key)
})
