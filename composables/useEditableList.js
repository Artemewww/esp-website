/**
 * Список, который заказчик правит в админке (/admin).
 *
 * Пока правок нет, сервер отдаёт ровно то, что уехало в сборку, поэтому
 * fallback — не запасной путь на случай сбоя, а обычное состояние сайта.
 * Возвращаем computed, чтобы страницы не зависели от того, успел ли прийти
 * ответ: до него в ref лежит тот же самый fallback.
 */
export const useEditableList = (key, fallback) => {
  const { data } = useFetch(`/api/site-content/${key}`, {
    key: `site-content-${key}`,
    default: () => fallback
  })
  return computed(() =>
    Array.isArray(data.value) && data.value.length ? data.value : fallback
  )
}
