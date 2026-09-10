import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE = 'esp_admin'
const TTL_MS = 12 * 60 * 60 * 1000

const secret = () =>
  process.env.NUXT_ADMIN_SECRET || process.env.NUXT_ADMIN_PASSWORD || 'esp-dev-secret'

const sign = (payload: string) =>
  createHmac('sha256', secret()).update(payload).digest('base64url')

/** Токен вида «срок.подпись»: без базы, но и без возможности подделать срок. */
export const issueToken = () => {
  const payload = `${Date.now() + TTL_MS}.${randomBytes(8).toString('hex')}`
  return `${payload}.${sign(payload)}`
}

const verify = (token?: string) => {
  if (!token) return false
  const at = token.lastIndexOf('.')
  if (at < 0) return false
  const payload = token.slice(0, at)
  const got = Buffer.from(token.slice(at + 1))
  const want = Buffer.from(sign(payload))
  if (got.length !== want.length || !timingSafeEqual(got, want)) return false
  return Number(payload.split('.')[0]) > Date.now()
}

export const adminPassword = () => process.env.NUXT_ADMIN_PASSWORD || ''

export const setSession = (event: H3Event) => {
  setCookie(event, COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: TTL_MS / 1000
  })
}

export const dropSession = (event: H3Event) => deleteCookie(event, COOKIE, { path: '/' })

export const isAuthed = (event: H3Event) => verify(getCookie(event, COOKIE))

/**
 * Пароль не задан — админку в продакшене не открываем вообще. Иначе публичный
 * адрес пускал бы кого угодно править сайт. Локально это разрешено, чтобы
 * можно было работать без переменных окружения.
 */
export const requireAdmin = (event: H3Event) => {
  if (!adminPassword() && !import.meta.dev) {
    throw createError({ statusCode: 503, statusMessage: 'Админка не настроена: не задан NUXT_ADMIN_PASSWORD' })
  }
  if (!isAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Нужно войти' })
  }
}
