// Режим работы офиса ESP — те же данные, что в «Контактах компании»
// (components/contacts/CtSchedule.vue: пн–пт 9:00–18:00, обед 13:00–14:00).
// Время всегда минское, не часы посетителя. Минуты — от полуночи.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const OFFICE_HOURS = { open: 540, close: 1080, lunchFrom: 780, lunchTo: 840, days: 'Пн–Пт' }

const DAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
const pad = (n) => String(n).padStart(2, '0')
const hhmm = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`

const readMinsk = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Minsk', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date())
  const g = (t) => parts.find((p) => p.type === t)?.value
  return { day: DAYS[g('weekday')], sec: +g('hour') * 3600 + +g('minute') * 60 + +g('second') }
}

// Обратный отсчёт: «2 ч 05 мин» или «12:40» (мм:сс) в последний час
const countdown = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60
  if (h >= 24) return `${Math.floor(h / 24)} д ${h % 24} ч`
  return h ? `${h} ч ${pad(m)} мин` : `${pad(m)}:${pad(r)}`
}

export function useWorkHours () {
  const H = OFFICE_HOURS
  const now = ref(null)
  let t
  onMounted(() => { now.value = readMinsk(); t = setInterval(() => { now.value = readMinsk() }, 1000) })
  onBeforeUnmount(() => clearInterval(t))

  const state = computed(() => {
    const n = now.value
    if (!n) return null
    const { day, sec } = n
    const min = sec / 60
    const workday = day <= 5
    // Доля «сейчас» на шкале 9:00–18:00 (вне часов — у края)
    const pos = Math.min(1, Math.max(0, (min - H.open) / (H.close - H.open)))
    const nowLabel = hhmm(Math.floor(min))
    if (workday && min >= H.open && min < H.close) {
      if (min >= H.lunchFrom && min < H.lunchTo) {
        return { kind: 'lunch', title: `Обед до ${hhmm(H.lunchTo)}`, cd: countdown(H.lunchTo * 60 - sec), cdLabel: 'снова на связи через', pos, nowLabel }
      }
      return { kind: 'open', title: `Открыто до ${hhmm(H.close)}`, cd: countdown(H.close * 60 - sec), cdLabel: 'до конца рабочего дня', pos, nowLabel }
    }
    // Закрыто: когда откроемся
    let addDays = 0
    if (workday && min < H.open) addDays = 0
    else if (day <= 4) addDays = 1
    else addDays = 8 - day // пт после закрытия, сб, вс → понедельник
    const when = addDays === 0 ? 'сегодня' : addDays === 1 ? 'завтра' : 'в понедельник'
    const left = addDays * 86400 + H.open * 60 - sec
    return { kind: 'closed', title: `Откроемся ${when} в ${hhmm(H.open)}`, cd: countdown(left), cdLabel: 'до открытия', pos: workday && min < H.open ? 0 : 1, nowLabel, offDay: !workday }
  })
  return { state, H }
}
