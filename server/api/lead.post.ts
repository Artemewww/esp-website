/**
 * Приём заявок с форм сайта на Vercel и при локальной разработке.
 * На hoster.by ту же ручку отдаёт hosting/api/lead.php — поведение одинаковое.
 *
 * Куда слать — переменные окружения:
 *   NUXT_LEAD_TELEGRAM_TOKEN  — токен бота от @BotFather
 *   NUXT_LEAD_TELEGRAM_CHAT   — id чата отдела продаж (через запятую, если несколько)
 * Почту отсюда не шлём: у Vercel нет SMTP. Заявка в любом случае пишется в лог функции.
 */
const FORMS: Record<string, string> = {
  contact: 'Заявка с сайта',
  'technology-pdf': 'Запрос PDF о технологии',
  webinar: 'Регистрация на вебинар',
  subscribe: 'Подписка на новости',
  career: 'Отклик на вакансию'
}

const LABELS: Record<string, string> = {
  name: 'Имя', company: 'Компания', phone: 'Телефон', email: 'E-mail', contact: 'Контакт',
  topic: 'Тема', position: 'Вакансия', link: 'Ссылка', subject: 'Материал', message: 'Сообщение'
}

const MAX_FILES = 5
const MAX_FILE = 10 * 1024 * 1024
const LEAD_EXT = /\.(pdf|docx?|xlsx?|dwg|dxf|jpe?g|png|webp|heic|zip|rar|7z)$/i

const clean = (v: unknown, max = 2000) =>
  String(v ?? '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max)

export default defineEventHandler(async (event) => {
  const input: Record<string, string> = {}
  const files: { name: string, data: Buffer }[] = []

  if ((getHeader(event, 'content-type') || '').includes('multipart/form-data')) {
    for (const part of (await readMultipartFormData(event)) || []) {
      if (!part.name) continue
      if ((part.name === 'files[]' || part.name === 'files') && part.filename) {
        if (files.length < MAX_FILES && part.data.length <= MAX_FILE && LEAD_EXT.test(part.filename)) {
          files.push({ name: part.filename, data: part.data })
        }
      } else {
        input[part.name] = part.data.toString('utf8')
      }
    }
  } else {
    Object.assign(input, await readBody(event))
  }

  // Ловушка для ботов: поле скрыто от людей.
  if (clean(input.website)) return { ok: true }

  const form = clean(input.form || 'contact', 40)
  if (!FORMS[form]) throw createError({ statusCode: 400, message: 'Неизвестная форма' })
  if (!input.consent || input.consent === 'false') {
    throw createError({ statusCode: 400, message: 'Нужно согласие на обработку персональных данных' })
  }

  const fields: Record<string, string> = {}
  for (const k of Object.keys(LABELS)) fields[k] = clean(input[k], k === 'message' ? 5000 : 300)
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw createError({ statusCode: 400, message: 'Проверьте e-mail' })
  }
  if (!fields.email && !fields.phone && !fields.contact) {
    throw createError({ statusCode: 400, message: 'Оставьте телефон или e-mail' })
  }

  const now = new Date()
  const id = 'L' + now.toISOString().slice(2, 19).replace(/[-:]/g, '').replace('T', '-') + '-' +
    Math.random().toString(16).slice(2, 6)
  const utm = Object.fromEntries(
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
      .filter((k) => clean(input[k]))
      .map((k) => [k, clean(input[k], 200)])
  )

  const lines = [`${FORMS[form]} · ${id}`]
  for (const [k, label] of Object.entries(LABELS)) if (fields[k]) lines.push(`${label}: ${fields[k]}`)
  if (files.length) lines.push('Файлы: ' + files.map((f) => f.name).join(', '))
  lines.push('', 'Страница: ' + (clean(input.page, 300) || '—'))
  if (clean(input.landing) && clean(input.landing) !== clean(input.page)) lines.push('Первый заход: ' + clean(input.landing, 300))
  if (Object.keys(utm).length) lines.push('Источник: ' + Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(', '))
  if (clean(input.referrer)) lines.push('Переход с: ' + clean(input.referrer, 300))
  const text = lines.join('\n')

  // Журнал Vercel хранит заявку, даже если Telegram не настроен.
  console.log('[lead]', JSON.stringify({ id, form, fields, utm, files: files.map((f) => f.name) }))

  const token = process.env.NUXT_LEAD_TELEGRAM_TOKEN
  const chats = (process.env.NUXT_LEAD_TELEGRAM_CHAT || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (token && chats.length) {
    const api = `https://api.telegram.org/bot${token}`
    for (const chat_id of chats) {
      await $fetch(`${api}/sendMessage`, { method: 'POST', body: { chat_id, text } })
        .catch((e) => console.error('[lead] telegram', e?.message))
      for (const f of files) {
        const fd = new FormData()
        fd.append('chat_id', chat_id)
        fd.append('caption', id)
        fd.append('document', new Blob([f.data]), f.name)
        await $fetch(`${api}/sendDocument`, { method: 'POST', body: fd })
          .catch((e) => console.error('[lead] telegram file', e?.message))
      }
    }
  }

  return { ok: true, id }
})
