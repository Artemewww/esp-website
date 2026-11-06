// v-reveal-words: текст проявляется слово за словом по мере прокрутки, как
// подписи на сайтах-ориентирах. Работает на CSS scroll-driven animations,
// без обработчиков scroll; где браузер их не умеет, текст просто виден сразу.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal-words', {
    getSSRProps: () => ({}),
    mounted (el: HTMLElement) {
      if (el.dataset.rw) return
      el.dataset.rw = '1'
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const nodes: Text[] = []
      while (walker.nextNode()) nodes.push(walker.currentNode as Text)
      const total = nodes.reduce((n, t) => n + (t.textContent?.trim().split(/\s+/).filter(Boolean).length || 0), 0)
      let k = 0
      for (const node of nodes) {
        const parts = (node.textContent || '').split(/(\s+)/)
        const frag = document.createDocumentFragment()
        for (const part of parts) {
          if (!part) continue
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            continue
          }
          const span = document.createElement('span')
          span.className = 'rw'
          span.style.setProperty('--k', String(total > 1 ? k / (total - 1) : 0))
          span.textContent = part
          frag.appendChild(span)
          k++
        }
        node.parentNode?.replaceChild(frag, node)
      }
    }
  })
})
