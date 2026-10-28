import { UTM_KEY } from '~/composables/useLead'

// Метки и страница первого захода за сессию: их увозит каждая заявка (useLead).
export default defineNuxtPlugin(() => {
  try {
    if (sessionStorage.getItem(UTM_KEY)) return
    const q = new URLSearchParams(window.location.search)
    const data = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (q.get(k)) data[k] = q.get(k).slice(0, 200)
    }
    data.landing = window.location.pathname
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      data.referrer = document.referrer.slice(0, 300)
    }
    sessionStorage.setItem(UTM_KEY, JSON.stringify(data))
  } catch {}
})
