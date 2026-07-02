import { ref, watch, onMounted } from 'vue'

const specCart = ref([])
let loaded = false

// Reading localStorage must happen post-mount (client-only), otherwise the
// first client render would already differ from the empty SSR render and
// Vue would report a hydration mismatch.
const load = () => {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem('esp-spec-cart')
    if (raw) specCart.value = JSON.parse(raw)
  } catch (e) { /* ignore corrupt storage */ }
  watch(specCart, (val) => {
    try { localStorage.setItem('esp-spec-cart', JSON.stringify(val)) } catch (e) { /* ignore */ }
  }, { deep: true })
}

export const useSpecCart = () => {
  onMounted(load)

  const isInCart = (slug) => specCart.value.some(i => i.slug === slug)

  const toggleCartItem = (product) => {
    const idx = specCart.value.findIndex(i => i.slug === product.slug)
    if (idx >= 0) {
      specCart.value.splice(idx, 1)
    } else {
      specCart.value.push({
        slug: product.slug,
        name: product.name,
        category: product.category,
        capacity: product.capacity,
        specs: product.specs || []
      })
    }
  }

  const clearCart = () => { specCart.value = [] }

  const downloadCsv = () => {
    if (!specCart.value.length) return
    const header = ['Наименование', 'Категория', 'Производительность', 'Ключевые характеристики']
    const rows = specCart.value.map(item => [
      item.name,
      item.category,
      item.capacity,
      (item.specs || []).map(s => `${s.label}: ${s.value}`).join('; ')
    ])
    const csvLines = [header, ...rows].map(cols =>
      cols.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')
    )
    const csvContent = '﻿' + csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ESP-specifikaciya-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { specCart, isInCart, toggleCartItem, clearCart, downloadCsv }
}
