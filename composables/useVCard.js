// Генерация vCard 3.0 из данных сотрудника.
// Используется и для скачивания .vcf, и для QR-кода (компактная версия).
const ORG = 'ООО «ЭкоСервисПроект» (ESP)'
const SITE = 'https://ecoservisproekt.com'

// Разбор «Имя Фамилия» / «Фамилия Имя Отчество» в структурированное N.
const splitName = (expert) => {
  if (expert.fullName) {
    const parts = expert.fullName.trim().split(/\s+/)
    // Формат «Фамилия Имя Отчество»
    return { last: parts[0] || '', first: parts[1] || '', middle: parts[2] || '' }
  }
  const parts = (expert.name || '').trim().split(/\s+/)
  // Формат «Имя Фамилия»
  return { first: parts[0] || '', last: parts[1] || '', middle: '' }
}

export const buildVCard = (expert, { withPhoto = false } = {}) => {
  const n = splitName(expert)
  const c = expert.contact || {}
  const fn = expert.fullName || expert.name
  const title = c.vcardTitle || expert.role || ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${n.last};${n.first};${n.middle};;`,
    `FN:${fn}`,
    `ORG:${ORG}`,
    title ? `TITLE:${title}` : null,
    c.phone ? `TEL;TYPE=WORK,VOICE:${c.phone}` : null,
    expert.email ? `EMAIL;TYPE=INTERNET,WORK:${expert.email}` : null,
    `URL;TYPE=WORK:${SITE}`,
    c.whatsapp ? `URL;TYPE=WhatsApp:${c.whatsapp}` : null,
    c.viber ? `URL;TYPE=Viber:${c.viber}` : null,
    c.telegram ? `URL;TYPE=Telegram:${c.telegram}` : null,
    c.address ? `ADR;TYPE=WORK:;;${c.address};;;;` : null,
    'END:VCARD'
  ].filter(Boolean)

  return lines.join('\r\n')
}

// Компактная версия для QR — без адреса/мессенджеров, чтобы гарантированно
// уместиться в QR-код и надёжно сканироваться камерой телефона.
export const buildVCardCompact = (expert) => {
  const n = splitName(expert)
  const c = expert.contact || {}
  const fn = expert.fullName || expert.name
  const title = c.vcardTitle || expert.role || ''
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${n.last};${n.first};${n.middle};;`,
    `FN:${fn}`,
    `ORG:${ORG}`,
    title ? `TITLE:${title}` : null,
    c.phone ? `TEL;TYPE=WORK,VOICE:${c.phone}` : null,
    expert.email ? `EMAIL;TYPE=INTERNET,WORK:${expert.email}` : null,
    `URL:${SITE}`,
    'END:VCARD'
  ].filter(Boolean)
  return lines.join('\r\n')
}

export const downloadVCard = (expert) => {
  const vcard = buildVCard(expert)
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(expert.fullName || expert.name).replace(/\s+/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const useVCard = () => ({ buildVCard, buildVCardCompact, downloadVCard })
