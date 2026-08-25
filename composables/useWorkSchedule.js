import { ref, computed, onMounted, onUnmounted } from 'vue'

// Офис живёт по минскому времени, а посетитель может смотреть сайт откуда
// угодно — поэтому считаем не по часам браузера, а по зоне компании.
const TZ = 'Europe/Minsk'
const OPEN_MIN = 9 * 60          // 09:00
const CLOSE_MIN = 18 * 60        // 18:00
const WORKDAYS = [1, 2, 3, 4, 5] // Пн–Пт

const DAY_INDEX = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
const DAY_NAME = {
  1: 'понедельник', 2: 'вторник', 3: 'среду', 4: 'четверг',
  5: 'пятницу', 6: 'субботу', 7: 'воскресенье'
}

function minskTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return {
    day: DAY_INDEX[get('weekday')] || 1,
    minutes: Number(get('hour')) * 60 + Number(get('minute'))
  }
}

const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// «3 ч 12 мин», «45 минут» — без «1 часов» и прочих ошибок согласования.
function humanLeft(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} ${plural(m, 'минуту', 'минуты', 'минут')}`
  if (m === 0) return `${h} ${plural(h, 'час', 'часа', 'часов')}`
  return `${h} ${plural(h, 'час', 'часа', 'часов')} ${m} мин`
}

function plural(n, one, few, many) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

function nextOpening(day, minutes) {
  // Сегодня ещё не открылись — ждать несколько часов, а не до завтра.
  if (WORKDAYS.includes(day) && minutes < OPEN_MIN) {
    return { when: 'сегодня', day, inMinutes: OPEN_MIN - minutes }
  }
  let ahead = 1
  let d = day
  while (ahead <= 7) {
    d = (day + ahead - 1) % 7 + 1
    if (WORKDAYS.includes(d)) break
    ahead += 1
  }
  const inMinutes = (24 * 60 - minutes) + (ahead - 1) * 24 * 60 + OPEN_MIN
  return { when: ahead === 1 ? 'завтра' : `в ${DAY_NAME[d]}`, day: d, inMinutes }
}

export function useWorkSchedule() {
  const now = ref(minskTime())
  let timer = null

  const tick = () => { now.value = minskTime() }

  onMounted(() => {
    tick()
    // Раз в полминуты: счётчик должен идти, но будить вкладку чаще незачем.
    timer = setInterval(tick, 30000)
  })
  onUnmounted(() => clearInterval(timer))

  const isOpen = computed(() => {
    const { day, minutes } = now.value
    return WORKDAYS.includes(day) && minutes >= OPEN_MIN && minutes < CLOSE_MIN
  })

  const state = computed(() => {
    const { day, minutes } = now.value
    if (isOpen.value) {
      const left = CLOSE_MIN - minutes
      return {
        open: true,
        title: `Работаем до ${hhmm(CLOSE_MIN)}`,
        detail: left <= 60
          ? `закрываемся через ${humanLeft(left)}`
          : `до конца дня ${humanLeft(left)}`,
        short: `до ${hhmm(CLOSE_MIN)}`
      }
    }
    const next = nextOpening(day, minutes)
    return {
      open: false,
      title: 'Сейчас закрыто',
      detail: `откроемся ${next.when} в ${hhmm(OPEN_MIN)}`,
      short: `${next.when} в ${hhmm(OPEN_MIN)}`
    }
  })

  return { isOpen, state, hours: `Пн–Пт ${hhmm(OPEN_MIN)}–${hhmm(CLOSE_MIN)}` }
}
