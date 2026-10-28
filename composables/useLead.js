/**
 * Отправка заявки с любой формы сайта на /api/lead.
 * Сервер: server/api/lead.post.ts (Vercel) и hosting/api/lead.php (hoster.by).
 *
 *   const { send, sending, sent, error } = useLead('contact')
 *   await send({ name, phone, message, consent }, files, submitEvent)
 *
 * К заявке сами добавляются страница, откуда пришёл человек, и UTM-метки
 * первого захода (их сохраняет plugins/utm.client.js) — так видно,
 * какая рассылка или реклама привела клиента.
 */
export const UTM_KEY = 'esp-utm'

export const useLead = (form = 'contact') => {
  const sending = ref(false)
  const sent = ref(false)
  const error = ref('')
  // Конфиг берём сразу: после await контекст Nuxt уже недоступен.
  const ymId = useRuntimeConfig().public.metrikaId

  // submitEvent нужен, чтобы забрать скрытое поле-ловушку website (LeadConsent).
  const send = async (fields = {}, files = [], submitEvent = null) => {
    error.value = ''
    if (!fields.consent) {
      error.value = 'Отметьте согласие на обработку персональных данных'
      return false
    }
    sending.value = true
    try {
      const body = new FormData()
      body.append('form', form)
      for (const [k, v] of Object.entries(fields)) {
        if (v !== undefined && v !== null && v !== '') body.append(k, String(v))
      }
      let first = {}
      try { first = JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}') } catch {}
      for (const [k, v] of Object.entries(first)) if (!body.has(k)) body.append(k, v)
      if (!body.has('page')) body.append('page', window.location.pathname)
      const trap = submitEvent?.target?.elements?.website?.value
      if (trap) body.append('website', trap)
      // files[] — так PHP на hoster.by соберёт несколько файлов в массив.
      for (const f of files || []) body.append('files[]', f, f.name)

      await $fetch('/api/lead', { method: 'POST', body })
      sent.value = true
      // Цель для Метрики, если счётчик подключён (window.ym появляется вместе с ним).
      if (ymId && typeof window.ym === 'function') window.ym(ymId, 'reachGoal', `lead_${form}`)
      return true
    } catch (e) {
      error.value = e?.data?.message || e?.data?.statusMessage ||
        'Не удалось отправить. Позвоните нам: +375 29 165-60-61'
      return false
    } finally {
      sending.value = false
    }
  }

  const reset = () => { sent.value = false; error.value = '' }

  return { send, sending, sent, error, reset }
}
