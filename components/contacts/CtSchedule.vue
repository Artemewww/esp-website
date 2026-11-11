<template>
  <!-- График работы: слева живые часы Минска в фирменной капле ESP,
       справа два здания — офис и производство. Клик по зданию ведёт
       на карту и раскрывает метку с кнопками маршрута. -->
  <div class="cs">
    <div class="cs-clock">
      <svg class="cs-drop" viewBox="0 0 200 260" role="img" :aria-label="now ? `Время в Минске ${clockText}` : 'Часы Минска'">
        <defs>
          <linearGradient id="cs-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#002366" />
            <stop offset="1" stop-color="#002366" />
          </linearGradient>
        </defs>
        <path d="M100 6C100 6 14 98 14 166a86 86 0 0 0 172 0C186 98 100 6 100 6Z" fill="url(#cs-g)" />
        <circle cx="100" cy="166" r="66" fill="#fff" />
        <g stroke="#1A1A1A" stroke-linecap="round">
          <line v-for="i in 12" :key="i" x1="100" :y1="i % 3 === 0 ? 106 : 108" x2="100" y2="114" :stroke-width="i % 3 === 0 ? 3 : 1.6" :transform="`rotate(${i * 30} 100 166)`" />
        </g>
        <g fill="#002366" opacity="0.18" transform="translate(82 186) scale(0.3)">
          <path v-for="(d, i) in ESP_LOGO_PATHS" :key="i" :d="d" />
        </g>
        <line class="cs-hand" x1="100" y1="172" x2="100" y2="130" stroke="#1A1A1A" stroke-width="5" stroke-linecap="round" :transform="`rotate(${angles.h} 100 166)`" />
        <line class="cs-hand" x1="100" y1="174" x2="100" y2="116" stroke="#1A1A1A" stroke-width="3.4" stroke-linecap="round" :transform="`rotate(${angles.m} 100 166)`" />
        <line class="cs-hand cs-hand--s" x1="100" y1="180" x2="100" y2="110" stroke="#002366" stroke-width="1.6" stroke-linecap="round" :transform="`rotate(${angles.s} 100 166)`" />
        <circle cx="100" cy="166" r="4.5" fill="#002366" />
      </svg>
      <div class="cs-clock__txt">
        <span class="cs-eyebrow">Минск, сейчас</span>
        <b class="cs-time">{{ now ? clockText : '—:—' }}</b>
        <p class="cs-left">{{ officeLine }}</p>
      </div>
    </div>

    <div class="cs-sites">
      <button v-for="s in sites" :key="s.id" type="button" class="cs-site" @click="$emit('go', s.id)">
        <span class="cs-art" aria-hidden="true">
          <!-- Офис: многоэтажное здание с каплей ESP на фасаде -->
          <svg v-if="s.id === 'office'" viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
            <path d="M8 112h144" />
            <path d="M40 112V20h60v92" />
            <path d="M100 112V52h28v60" />
            <path d="M62 112V96h16v16" />
            <path v-for="y in [34, 48, 62, 76]" :key="'a' + y" :d="`M50 ${y}h8M66 ${y}h8M82 ${y}h8`" />
            <path v-for="y in [64, 78, 92]" :key="'b' + y" :d="`M108 ${y}h12`" />
            <path d="M70 4s-9 9.6-9 15.4a9 9 0 0 0 18 0C79 13.6 70 4 70 4Z" fill="#002366" stroke="#002366" />
          </svg>
          <!-- Производство: цех с двускатной кровлей, воротами и каплей ESP -->
          <svg v-else viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
            <path d="M4 112h152" />
            <path d="M16 112V56l40-22 40 22v56" />
            <path d="M96 112V70l24-12 24 12v42" />
            <path d="M40 112V78h32v34M40 88h32M40 98h32" />
            <path d="M108 84h24M108 94h24" />
            <path d="M128 64V30h8v30" />
            <path d="M56 40s-8 8.6-8 13.8a8 8 0 0 0 16 0C64 48.6 56 40 56 40Z" fill="#002366" stroke="#002366" />
          </svg>
        </span>
        <span class="cs-site__body">
          <span class="cs-badge" :class="`is-${status(s).kind}`">
            <i aria-hidden="true"></i>{{ status(s).label }}
          </span>
          <b class="cs-site__title">{{ s.title }}</b>
          <span class="cs-site__hours">{{ s.hours }}</span>
          <small class="cs-site__lunch">обед {{ s.lunch }}</small>
          <span class="cs-site__addr">{{ s.address }}</span>
          <span class="cs-site__addr cs-site__ll">{{ s.ll }}</span>
          <span class="cs-site__go">Показать на карте
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths.js'

defineEmits(['go'])

// Часы работы — из раздела «Контакты компании», в минутах от полуночи.
const sites = [
  { id: 'office', title: 'Офис', address: 'г. Минск, ул. Петра Мстиславца, 20', hours: 'пн–пт, 9:00–18:00', ll: '53.932442, 27.651330', lunch: '13:00–14:00', open: 540, close: 1080, lunchFrom: 780, lunchTo: 840 },
  { id: 'production', title: 'Производство', address: 'г. Заславль, ул. Советская, 118Д', hours: 'пн–пт, 8:30–17:00', ll: '54.016305, 27.259800', lunch: '12:30–13:00', open: 510, close: 1020, lunchFrom: 750, lunchTo: 780 }
]

// Время считаем по Минску, а не по часам посетителя. До монтирования —
// null, чтобы серверная и клиентская разметка совпали.
const now = ref(null)
const DAYS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
const read = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Minsk', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date())
  const g = (t) => parts.find((p) => p.type === t)?.value
  return { day: DAYS[g('weekday')] || 1, h: +g('hour'), m: +g('minute'), s: +g('second') }
}
let timer = null
onMounted(() => {
  now.value = read()
  timer = setInterval(() => { now.value = read() }, 1000)
})
onUnmounted(() => clearInterval(timer))

const pad = (n) => String(n).padStart(2, '0')
const hhmm = (min) => `${Math.floor(min / 60)}:${pad(min % 60)}`
const clockText = computed(() => now.value ? `${pad(now.value.h)}:${pad(now.value.m)}` : '')
// Пока время не известно, стрелки стоят на классических 10:10.
const angles = computed(() => {
  const t = now.value || { h: 10, m: 10, s: 0 }
  return { h: (t.h % 12) * 30 + t.m * 0.5, m: t.m * 6 + t.s * 0.1, s: t.s * 6 }
})

const plural = (n, a, b, c) => {
  const d = n % 10, dd = n % 100
  return d === 1 && dd !== 11 ? a : d >= 2 && d <= 4 && (dd < 10 || dd >= 20) ? b : c
}
const human = (min) => {
  const h = Math.floor(min / 60), m = min % 60
  if (!h) return `${m} ${plural(m, 'минута', 'минуты', 'минут')}`
  return m ? `${h} ${plural(h, 'час', 'часа', 'часов')} ${m} мин` : `${h} ${plural(h, 'час', 'часа', 'часов')}`
}
const nextDay = (day, min, open) => {
  if (day <= 5 && min < open) return 'сегодня'
  if (day === 5 || day === 6) return 'в понедельник'
  return 'завтра'
}
const status = (s) => {
  const t = now.value
  if (!t) return { kind: 'idle', label: 'Рабочие дни пн–пт' }
  const min = t.h * 60 + t.m
  const work = t.day <= 5 && min >= s.open && min < s.close
  if (!work) return { kind: 'closed', label: `Закрыто · откроется ${nextDay(t.day, min, s.open)} в ${hhmm(s.open)}` }
  if (min >= s.lunchFrom && min < s.lunchTo) return { kind: 'lunch', label: `Обед до ${hhmm(s.lunchTo)}` }
  return { kind: 'open', label: `Открыто до ${hhmm(s.close)}` }
}
const officeLine = computed(() => {
  const t = now.value
  if (!t) return 'Офис работает пн–пт с 9:00 до 18:00.'
  const o = sites[0]
  const min = t.h * 60 + t.m
  if (t.day <= 5 && min >= o.open && min < o.close) return `До конца рабочего дня в офисе осталось ${human(o.close - min)}.`
  return `Офис откроется ${nextDay(t.day, min, o.open)} в 9:00 — письма читаем с утра.`
})
</script>

<style scoped>
.cs { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 20px; }
.cs-clock { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; padding: clamp(28px, 3vw, 44px); border-radius: var(--r-md); background: #fff; text-align: center; }
.cs-drop { width: clamp(150px, 15vw, 200px); height: auto; filter: drop-shadow(0 18px 30px rgba(0, 35, 102, 0.22)); }
.cs-clock__txt { display: grid; gap: 4px; justify-items: center; }
.cs-eyebrow { font-size: 14px; font-weight: 600; color: #5E5E5E; letter-spacing: -0.016em; }
.cs-time { font-size: clamp(40px, 4vw, 56px); line-height: 1; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.cs-left { margin: 6px 0 0; max-width: 18em; font-size: 17px; line-height: 1.4; letter-spacing: -0.022em; color: #3D3D3D; }

.cs-sites { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.cs-site { display: flex; flex-direction: column; align-items: stretch; gap: 0; width: 100%; padding: 0; border: 0; border-radius: var(--r-md); background: #fff; color: var(--dj-ink); font: inherit; text-align: left; cursor: pointer; overflow: hidden; transition: transform 0.3s cubic-bezier(0, 0, 0.5, 1), box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1); }
.cs-site:hover { transform: translateY(-3px); box-shadow: var(--sh-2); }
.cs-site:focus-visible { outline: 2px solid #002366; outline-offset: 3px; }
.cs-art { display: grid; place-items: center; padding: 28px 24px 18px; background: linear-gradient(180deg, #eef2f8 0%, #f7f8fa 100%); color: #1A1A1A; }
.cs-art svg { width: 100%; max-width: 200px; height: auto; transition: transform 0.4s cubic-bezier(0, 0, 0.5, 1); }
.cs-site:hover .cs-art svg { transform: scale(1.04); }
.cs-site__body { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 20px clamp(20px, 2vw, 28px) 24px; flex: 1; }
.cs-badge { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 10px; padding: 5px 10px; border-radius: var(--r-pill); background: #EDEDED; font-size: 12px; font-weight: 600; line-height: 1.3; color: #3D3D3D; }
.cs-badge i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: #8A8A8A; }
.cs-badge.is-open { background: #e8f6ec; color: #135c2e; }
.cs-badge.is-open i { background: #1fa64a; box-shadow: 0 0 0 3px rgba(31, 166, 74, 0.2); animation: cs-pulse 2s ease-in-out infinite; }
.cs-badge.is-lunch { background: #fff4e0; color: #8a5300; }
.cs-badge.is-lunch i { background: #f0a020; }
.cs-site__title { font-size: clamp(22px, 1.8vw, 26px); line-height: 1.15; font-weight: 600; }
.cs-site__hours { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; }
.cs-site__lunch, .cs-site__addr { font-size: 14px; line-height: 1.43; color: #5E5E5E; }
.cs-site__ll { font-size: 12px; font-variant-numeric: tabular-nums; }
.cs-site__go { display: inline-flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 16px; font-size: 15px; font-weight: 600; color: #002366; }
@keyframes cs-pulse { 50% { box-shadow: 0 0 0 6px rgba(31, 166, 74, 0); } }

@media (max-width: 1023px) {
  .cs { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 560px) {
  .cs-sites { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .cs { gap: 12px; }
  .cs-art { padding: 20px 20px 12px; }
  .cs-art svg { max-width: 160px; }
}
@media (prefers-reduced-motion: reduce) {
  .cs-site, .cs-art svg { transition: none; }
  .cs-badge.is-open i { animation: none; }
}
</style>
