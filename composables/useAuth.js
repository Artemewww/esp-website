import { ref } from 'vue'

// Demo / тестовый доступ к личному кабинету партнёра ESP.
// Бэкенда нет — это витринный демо-режим, состояние хранится в sessionStorage.
export const DEMO_CREDENTIALS = {
  email: 'demo@ecoservisproekt.com',
  password: 'esp2026'
}

const user = ref(null)
let restored = false

const restore = () => {
  if (restored || typeof window === 'undefined') return
  restored = true
  try {
    const raw = sessionStorage.getItem('esp-auth-user')
    if (raw) user.value = JSON.parse(raw)
  } catch (e) { /* ignore */ }
}

export const useAuth = () => {
  restore()

  const isLoggedIn = () => !!user.value

  const login = (email, password) => {
    // Демо-режим: пускаем по тестовым данным ИЛИ по любым непустым (для показа).
    const emailOk = email && email.trim().length > 0
    const passOk = password && password.length > 0
    if (!emailOk || !passOk) return { ok: false, error: 'Введите e-mail и пароль' }

    const isDemo = email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
    const profile = {
      email: email.trim(),
      name: isDemo ? 'Демо-партнёр ESP' : email.trim().split('@')[0],
      role: isDemo ? 'Тестовый доступ' : 'Партнёр',
      demo: isDemo
    }
    user.value = profile
    try { sessionStorage.setItem('esp-auth-user', JSON.stringify(profile)) } catch (e) { /* ignore */ }
    return { ok: true }
  }

  const logout = () => {
    user.value = null
    try { sessionStorage.removeItem('esp-auth-user') } catch (e) { /* ignore */ }
  }

  return { user, isLoggedIn, login, logout }
}
