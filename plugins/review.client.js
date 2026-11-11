// ВРЕМЕННО, только для разработки: режим правок поверх сайта.
// Кнопка «Правки» → клик по любому месту → комментарий + фото → метка на странице.
// Всё пишется в ~/Desktop/ESP_Проект_Финал_2026/_правки (server/api/review.ts).
// В боевую сборку не попадает (import.meta.dev). Удалить вместе с server/api/review.ts.
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) return

  const API = '/api/review'
  let items = []
  let mode = false
  let hoverEl = null
  let pop = null

  // ---------- стили ----------
  const css = `
  .rv-ui, .rv-ui * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif; }
  .rv-dock { position: fixed; right: 18px; bottom: 18px; z-index: 2147483000; display: flex; gap: 8px; }
  .rv-btn { height: 44px; padding: 0 18px; border: 0; border-radius: 999px; font-size: 15px; font-weight: 600; color: #fff; background: #002366; box-shadow: 0 8px 24px rgba(0,0,0,.25); cursor: pointer; }
  .rv-btn--ghost { color: #002366; background: #fff; }
  .rv-btn.is-on { background: #e5383b; }
  .rv-hl { outline: 2px solid #e5383b !important; outline-offset: 2px !important; cursor: crosshair !important; }
  body.rv-mode, body.rv-mode * { cursor: crosshair !important; }
  .rv-pin { position: absolute; z-index: 2147482000; width: 28px; height: 28px; margin: -14px 0 0 -14px; border: 2px solid #fff; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #fff; background: #e5383b; box-shadow: 0 4px 12px rgba(0,0,0,.35); cursor: pointer; }
  .rv-pin.is-done { background: #2e9d5b; }
  .rv-area { position: absolute; z-index: 2147481999; border: 2px dashed #e5383b; border-radius: 6px; background: rgba(229,56,59,.08); pointer-events: none; }
  .rv-area.is-done { border-color: #2e9d5b; background: rgba(46,157,91,.06); }
  .rv-drag { position: absolute; z-index: 2147483002; border: 2px solid #e5383b; border-radius: 6px; background: rgba(229,56,59,.12); pointer-events: none; }
  .rv-pop { position: absolute; z-index: 2147483001; width: 340px; padding: 14px; border-radius: 16px; color: #1d1d1f; background: #fff; box-shadow: 0 18px 50px rgba(0,0,0,.3); }
  .rv-pop h4 { margin: 0 0 8px; font-size: 14px; font-weight: 700; }
  .rv-pop textarea { width: 100%; min-height: 110px; padding: 10px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 15px; line-height: 1.4; resize: vertical; }
  .rv-pop .rv-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; align-items: center; }
  .rv-pop .rv-small { height: 34px; padding: 0 14px; border: 0; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; color: #fff; background: #002366; }
  .rv-pop .rv-small--grey { color: #1d1d1f; background: #e8e8ed; }
  .rv-pop .rv-small--red { background: #e5383b; }
  .rv-pop .rv-small--green { background: #2e9d5b; }
  .rv-thumbs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .rv-thumbs img { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; }
  .rv-note { margin-top: 6px; font-size: 12px; color: #6e6e73; }
  .rv-text { white-space: pre-wrap; font-size: 15px; line-height: 1.4; }
  .rv-list { position: fixed; right: 18px; bottom: 74px; z-index: 2147483000; width: 380px; max-height: 70vh; overflow: auto; padding: 14px; border-radius: 16px; color: #1d1d1f; background: #fff; box-shadow: 0 18px 50px rgba(0,0,0,.3); }
  .rv-list h4 { margin: 0 0 10px; font-size: 15px; }
  .rv-li { display: block; padding: 10px 0; border-top: 1px solid #e8e8ed; font-size: 13px; color: inherit; text-decoration: none; cursor: pointer; }
  .rv-li b { color: #e5383b; } .rv-li.is-done b { color: #2e9d5b; }
  .rv-li span { color: #6e6e73; }
  `
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style)

  // ---------- утилиты ----------
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const isUi = (t) => t && t.closest && t.closest('.rv-ui')
  const page = () => location.pathname

  function selectorOf (node) {
    const parts = []
    let n = node
    while (n && n.nodeType === 1 && n !== document.body && parts.length < 8) {
      if (n.id) { parts.unshift('#' + CSS.escape(n.id)); break }
      let s = n.tagName.toLowerCase()
      const sib = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : []
      if (sib.length > 1) s += `:nth-of-type(${sib.indexOf(n) + 1})`
      parts.unshift(s)
      n = n.parentElement
    }
    return parts.join(' > ')
  }
  function describe (node) {
    const t = (node.innerText || node.alt || node.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ')
    return `<${node.tagName.toLowerCase()}${node.className && typeof node.className === 'string' ? ' .' + node.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}> ${t.slice(0, 160)}${node.currentSrc ? ' [' + node.currentSrc.replace(location.origin, '') + ']' : ''}`
  }
  async function shrink (file) {
    const img = await createImageBitmap(file)
    const k = Math.min(1, 1600 / Math.max(img.width, img.height))
    const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    return c.toDataURL('image/jpeg', 0.86)
  }
  const api = (method, body, q = '') => fetch(API + q, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined }).then((r) => r.json())

  // ---------- док ----------
  const dock = el('div', 'rv-ui rv-dock')
  const listBtn = el('button', 'rv-btn rv-btn--ghost', 'Список')
  const modeBtn = el('button', 'rv-btn', '✎ Правки')
  dock.append(listBtn, modeBtn)
  document.body.appendChild(dock)
  let listBox = null

  function setMode (on) {
    mode = on
    modeBtn.classList.toggle('is-on', on)
    modeBtn.textContent = on ? '✕ Выйти из правок' : `✎ Правки (${items.length})`
    document.body.classList.toggle('rv-mode', on)
    if (!on && hoverEl) { hoverEl.classList.remove('rv-hl'); hoverEl = null }
  }
  modeBtn.onclick = () => { closePop(); setMode(!mode) }
  listBtn.onclick = () => { if (listBox) { listBox.remove(); listBox = null } else showList() }

  function showList () {
    listBox = el('div', 'rv-ui rv-list')
    const open = items.filter((x) => !x.done).length
    listBox.innerHTML = `<h4>Правки: ${items.length} (открыто ${open})</h4>` + (items.length ? '' : '<div class="rv-note">Пока пусто. Нажмите «Правки» и кликните по нужному месту.</div>')
    items.slice().sort((a, b) => a.n - b.n).forEach((it) => {
      const a = el('a', 'rv-li' + (it.done ? ' is-done' : ''), `<b>№${it.n}</b> <span>${esc(it.page)}</span><br>${esc(it.text).slice(0, 140)}${it.images.length ? ` <span>· фото: ${it.images.length}</span>` : ''}`)
      a.onclick = async () => {
        if (page() !== it.page) { await navigateTo(it.page); setTimeout(() => focusItem(it), 900) } else focusItem(it)
      }
      listBox.appendChild(a)
    })
    document.body.appendChild(listBox)
  }
  function focusItem (it) {
    const p = areaOf(it) || posOf(it); window.scrollTo({ top: p.y - innerHeight / 2, behavior: 'smooth' }); setTimeout(() => openItem(it), 500)
  }

  // ---------- метки ----------
  let pins = []
  function posOf (it) {
    let target = null
    try { target = it.selector ? document.querySelector(it.selector) : null } catch {}
    if (target) {
      const r = target.getBoundingClientRect()
      if (r.width || r.height) return { x: r.left + scrollX + r.width * it.fx, y: r.top + scrollY + r.height * it.fy }
    }
    return { x: it.x, y: it.y }
  }
  // Область: хранится долями от элемента-якоря (fx,fy — левый верх; fw,fh — размер), запасной вариант — координаты страницы
  function areaOf (it) {
    const a = it.area; if (!a) return null
    let target = null
    try { target = it.selector ? document.querySelector(it.selector) : null } catch {}
    const r = target && target.getBoundingClientRect()
    if (r && (r.width || r.height)) return { x: r.left + scrollX + r.width * a.fx, y: r.top + scrollY + r.height * a.fy, w: r.width * a.fw, h: r.height * a.fh }
    return { x: a.x, y: a.y, w: a.w, h: a.h }
  }
  function renderPins () {
    pins.forEach((p) => p.remove()); pins = []
    items.filter((it) => it.page === page()).forEach((it) => {
      const ar = areaOf(it)
      if (ar) {
        const box = el('div', 'rv-ui rv-area' + (it.done ? ' is-done' : ''))
        Object.assign(box.style, { left: ar.x + 'px', top: ar.y + 'px', width: ar.w + 'px', height: ar.h + 'px' })
        document.body.appendChild(box); pins.push(box)
      }
      const p = el('div', 'rv-ui rv-pin' + (it.done ? ' is-done' : ''), String(it.n))
      const { x, y } = ar ? { x: ar.x, y: ar.y } : posOf(it); p.style.left = x + 'px'; p.style.top = y + 'px'
      p.onclick = (e) => { e.stopPropagation(); e.preventDefault(); openItem(it) }
      document.body.appendChild(p); pins.push(p)
    })
    if (!mode) modeBtn.textContent = `✎ Правки (${items.length})`
  }
  async function refresh () { items = await api('GET').catch(() => []); renderPins(); if (listBox) { listBox.remove(); showList() } }

  // ---------- всплывашки ----------
  function closePop () { if (pop) { pop.remove(); pop = null } }
  function place (box, x, y) {
    document.body.appendChild(box)
    const w = 340
    box.style.left = Math.max(scrollX + 8, Math.min(x + 16, scrollX + innerWidth - w - 8)) + 'px'
    box.style.top = Math.max(scrollY + 8, Math.min(y + 16, scrollY + innerHeight - box.offsetHeight - 8)) + 'px'
  }

  // rect — выделенная область в координатах окна (или null для точки)
  function openNew (target, e, rect = null) {
    closePop()
    const r = target.getBoundingClientRect()
    const draft = {
      page: page(), selector: selectorOf(target), element: describe(target),
      fx: r.width ? (e.clientX - r.left) / r.width : 0, fy: r.height ? (e.clientY - r.top) / r.height : 0,
      x: e.pageX, y: e.pageY, viewport: `${innerWidth}×${innerHeight}`
    }
    if (rect) {
      draft.area = {
        fx: r.width ? (rect.left - r.left) / r.width : 0, fy: r.height ? (rect.top - r.top) / r.height : 0,
        fw: r.width ? rect.width / r.width : 0, fh: r.height ? rect.height / r.height : 0,
        x: rect.left + scrollX, y: rect.top + scrollY, w: rect.width, h: rect.height
      }
      // что попало в область: тексты и картинки — чтобы правку было легко найти
      const inside = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,img,video,li,span')].filter((n) => {
        if (isUi(n)) return false
        const b = n.getBoundingClientRect()
        return b.width && b.left >= rect.left - 4 && b.top >= rect.top - 4 && b.right <= rect.right + 4 && b.bottom <= rect.bottom + 4
      }).slice(0, 12).map(describe)
      draft.element = (inside.length ? inside : [describe(target)]).join('\n')
    }
    const images = []
    pop = el('div', 'rv-ui rv-pop', `
      <h4>${rect ? 'Новая правка — область' : 'Новая правка'}</h4>
      <textarea placeholder="Что изменить? Можно вставить картинку из буфера (⌘V)"></textarea>
      <div class="rv-thumbs"></div>
      <div class="rv-row">
        <label class="rv-small rv-small--grey" style="display:inline-flex;align-items:center">📎 Фото<input type="file" accept="image/*" multiple hidden></label>
        <span style="flex:1"></span>
        <button class="rv-small rv-small--grey" data-a="cancel">Отмена</button>
        <button class="rv-small" data-a="save">Сохранить</button>
      </div>
      <div class="rv-note">${esc(draft.element).slice(0, 120)}</div>`)
    const ta = pop.querySelector('textarea'); const thumbs = pop.querySelector('.rv-thumbs')
    const addFiles = async (files) => {
      for (const f of files) {
        if (!f.type.startsWith('image/') || images.length >= 6) continue
        const d = await shrink(f); images.push(d)
        const i = el('img'); i.src = d; thumbs.appendChild(i)
      }
    }
    pop.querySelector('input[type=file]').onchange = (ev) => addFiles([...ev.target.files])
    ta.addEventListener('paste', (ev) => { const fs = [...(ev.clipboardData?.files || [])]; if (fs.length) { ev.preventDefault(); addFiles(fs) } })
    pop.querySelector('[data-a=cancel]').onclick = closePop
    pop.querySelector('[data-a=save]').onclick = async (ev) => {
      if (!ta.value.trim() && !images.length) { ta.focus(); return }
      ev.target.disabled = true; ev.target.textContent = 'Сохраняю…'
      await api('POST', { ...draft, text: ta.value.trim(), images })
      closePop(); await refresh()
      setMode(true) // остаёмся в режиме правок — можно сразу отмечать следующее место
    }
    place(pop, e.pageX, e.pageY); ta.focus()
  }

  function openItem (it) {
    closePop()
    const { x, y } = posOf(it)
    pop = el('div', 'rv-ui rv-pop', `
      <h4>Правка №${it.n}${it.done ? ' · готово' : ''}</h4>
      <div class="rv-text">${esc(it.text)}</div>
      <div class="rv-thumbs">${it.images.map((f) => `<a href="${API}?file=${encodeURIComponent(f)}" target="_blank"><img src="${API}?file=${encodeURIComponent(f)}"></a>`).join('')}</div>
      <div class="rv-row">
        <button class="rv-small rv-small--red" data-a="del">Удалить</button>
        <button class="rv-small rv-small--grey" data-a="edit">Изменить</button>
        <span style="flex:1"></span>
        <button class="rv-small ${it.done ? 'rv-small--grey' : 'rv-small--green'}" data-a="done">${it.done ? 'Вернуть' : 'Готово'}</button>
        <button class="rv-small rv-small--grey" data-a="close">✕</button>
      </div>
      <div class="rv-note">${new Date(it.created).toLocaleString('ru-RU')}</div>`)
    pop.querySelector('[data-a=close]').onclick = closePop
    pop.querySelector('[data-a=del]').onclick = async () => { if (confirm(`Удалить правку №${it.n}?`)) { await api('DELETE', null, `?id=${it.id}`); closePop(); refresh() } }
    pop.querySelector('[data-a=done]').onclick = async () => { await api('PATCH', { id: it.id, done: !it.done }); closePop(); refresh() }
    pop.querySelector('[data-a=edit]').onclick = () => {
      const box = pop.querySelector('.rv-text')
      box.outerHTML = `<textarea>${esc(it.text)}</textarea>`
      const b = pop.querySelector('[data-a=edit]'); b.textContent = 'Сохранить'; b.className = 'rv-small'
      b.onclick = async () => { await api('PATCH', { id: it.id, text: pop.querySelector('textarea').value }); closePop(); refresh() }
    }
    place(pop, x, y)
  }

  // ---------- перехват кликов в режиме правок ----------
  document.addEventListener('mouseover', (e) => {
    if (!mode || isUi(e.target)) return
    if (hoverEl) hoverEl.classList.remove('rv-hl')
    hoverEl = e.target; hoverEl.classList.add('rv-hl')
  }, true)
  // Клик — точка; зажать и протянуть — прямоугольная область
  let start = null; let drag = null
  const block = (e) => { if (mode && !isUi(e.target)) { e.preventDefault(); e.stopPropagation() } }
  ;['mouseup', 'touchstart', 'click', 'dragstart', 'selectstart'].forEach((t) => document.addEventListener(t, block, true))
  document.addEventListener('pointerdown', (e) => {
    if (!mode || isUi(e.target) || e.button !== 0) return
    e.preventDefault(); e.stopPropagation()
    start = { x: e.clientX, y: e.clientY, target: e.target }
  }, true)
  document.addEventListener('mousedown', block, true)
  document.addEventListener('pointermove', (e) => {
    if (!mode || !start) return
    const w = Math.abs(e.clientX - start.x); const h = Math.abs(e.clientY - start.y)
    if (!drag && w + h < 8) return
    if (!drag) { drag = el('div', 'rv-ui rv-drag'); document.body.appendChild(drag) }
    Object.assign(drag.style, { left: Math.min(e.clientX, start.x) + scrollX + 'px', top: Math.min(e.clientY, start.y) + scrollY + 'px', width: w + 'px', height: h + 'px' })
  }, true)
  // pointerup, а не mouseup: preventDefault на pointerdown гасит «мышиные» события
  document.addEventListener('pointerup', (e) => {
    if (!mode || !start || (isUi(e.target) && !drag)) { start = null; return }
    e.preventDefault(); e.stopPropagation()
    if (hoverEl) hoverEl.classList.remove('rv-hl')
    let rect = null; let anchor = start.target; let ev = e
    if (drag) {
      const b = drag.getBoundingClientRect(); drag.remove(); drag = null
      rect = { left: b.left, top: b.top, width: b.width, height: b.height, right: b.right, bottom: b.bottom }
      // якорь — элемент в центре области (под рамкой), его рамка переживёт сдвиг вёрстки
      const cx = b.left + b.width / 2; const cy = b.top + b.height / 2
      anchor = document.elementsFromPoint(cx, cy).find((n) => !isUi(n)) || start.target
      ev = { clientX: cx, clientY: cy, pageX: cx + scrollX, pageY: b.bottom + scrollY }
    }
    start = null
    setMode(false)
    openNew(anchor, ev, rect)
  }, true)
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePop(); setMode(false) } })

  // ---------- жизненный цикл ----------
  nuxtApp.hook('page:finish', () => { closePop(); setTimeout(renderPins, 600) })
  addEventListener('resize', () => renderPins())
  setInterval(renderPins, 2500) // ленивые блоки и анимации сдвигают вёрстку
  refresh()
})
