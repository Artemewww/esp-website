import { adminPassword, setSession } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event)
  const expected = adminPassword()

  // Без пароля в окружении админка работает только на локальной машине.
  if (!expected) {
    if (!import.meta.dev) {
      throw createError({ statusCode: 503, statusMessage: 'Админка не настроена: не задан NUXT_ADMIN_PASSWORD' })
    }
    setSession(event)
    return { ok: true, mode: 'dev' }
  }

  if (!password || password !== expected) {
    // Ровная задержка, чтобы перебор не ускорялся на неверной первой букве.
    await new Promise((r) => setTimeout(r, 400))
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль' })
  }

  setSession(event)
  return { ok: true }
})
