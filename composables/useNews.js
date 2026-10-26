import newsDefaults from '~/content/defaults/news.json'

/**
 * Лента новостей: [{ date, dateLabel, title, text, image }].
 * Исходные данные — content/defaults/news.json, правятся в админке.
 * newsList — статичный список из сборки (обратная совместимость).
 */
export const newsList = newsDefaults

export const useNews = () => {
  const news = useEditableList('news', newsList)
  return { news, newsList }
}
