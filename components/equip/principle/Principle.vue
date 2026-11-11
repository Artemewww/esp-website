<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Flotation from './Flotation.vue'
import PumpStation from './PumpStation.vue'
import Bio from './Bio.vue'
import Aeration from './Aeration.vue'
import Blower from './Blower.vue'
import DrumSieve from './DrumSieve.vue'
import MechLine from './MechLine.vue'
import SandSeparator from './SandSeparator.vue'
import Screw from './Screw.vue'
import Separator from './Separator.vue'
import Dosing from './Dosing.vue'
import BeltPress from './BeltPress.vue'
import Flowmeter from './Flowmeter.vue'
import Tank from './Tank.vue'

// Анимированная схема принципа работы — показывается, когда у оборудования
// нет собственного видео. Тексты этапов взяты из описаний в useEquipment.js.
// s: [номер x, y], h: подсветка зоны [x, y, w, h] в координатах viewBox 800×400
const props = defineProps({ slug: { type: String, required: true } })

const BIO_ROSA = [
  { t: 'Механическая предочистка', d: 'Проходит в том же резервуаре, что и биологическая очистка.', s: [145, 66], h: [62, 102, 168, 236] },
  { t: 'Биологическая очистка', d: 'Низконагруженный активный ил и мелкопузырчатая аэрация: нитрификация, денитрификация и биологическая дефосфоризация.', s: [470, 54], h: [232, 30, 288, 308] },
  { t: 'Вторичное отстаивание', d: 'Вторичные отстойники и зоны сепарации отделяют активный ил от очищенной воды.', s: [630, 66], h: [522, 102, 216, 236] },
  { t: 'Очищенная вода', d: 'Отводится из станции; опционально — доочистка на барабанных микрофильтрах.', s: [770, 190], h: [700, 116, 100, 50] }
]

const CONFIG = {
  'flotation-units': { c: Flotation, steps: [
    { t: 'Зона флокуляции', d: 'Сточная вода с нефтепродуктами и взвешенными веществами поступает в установку.', s: [160, 56], h: [92, 92, 138, 236] },
    { t: 'Зона смешения', d: 'Вода насыщается мелкодисперсным воздухом под давлением; при разгерметизации образуются пузырьки 10–30 мкм.', s: [275, 56], h: [232, 92, 88, 294] },
    { t: 'Флотационная камера', d: 'Пузырьки слипаются с загрязнениями и всплывают, скребковый механизм удаляет их в зону сбора шлама.', s: [470, 56], h: [322, 58, 334, 270] },
    { t: 'Отвод очищенной воды', d: 'Очищенная вода уходит из установки: до 95% по взвеси и нефтепродуктам.', s: [690, 56], h: [632, 92, 168, 236] }
  ] },
  'kns-kvatro': { c: PumpStation, steps: [
    { t: 'Приём стоков', d: 'Бытовые, ливневые, дренажные или производственные стоки поступают в герметичный резервуар из полипропилена.', s: [130, 150], h: [0, 170, 300, 50] },
    { t: 'Контроль уровня', d: 'Автоматика включает насосы по уровню, с резервированием насосов.', s: [700, 200], h: [500, 20, 160, 270] },
    { t: 'Перекачка', d: 'Погружные насосы Zenit на направляющих из нержавеющей стали подают стоки через автоматические муфты в напорный трубопровод.', s: [400, 250], h: [290, 100, 510, 270] }
  ] },
  'zenit-pumps': { c: PumpStation, p: { single: true }, steps: [
    { t: 'Сточные воды', d: 'Хозяйственно-бытовые, дренажные и промышленные — различной степени загрязнения.', s: [130, 150], h: [0, 170, 300, 50] },
    { t: 'Насос Zenit', d: 'Серии DRENO, DRAGA, GRINDER, АР, MACS, SYSTEM M/B, VULCO, BLUE — под задачу и состав стоков.', s: [490, 330], h: [356, 290, 88, 75] },
    { t: 'Перекачка', d: 'Насос подаёт стоки в напорный трубопровод.', s: [700, 160], h: [380, 100, 420, 40] }
  ] },
  'bs-bio-station': { c: Bio, steps: BIO_ROSA },
  'bc-local-treatment': { c: Bio, steps: [
    { t: 'Хозяйственно-бытовые стоки', d: 'Поступают в сооружение: 7–150 м³/сут, 35–500 эквивалентных жителей.', s: [60, 186], h: [0, 116, 230, 50] },
    { t: 'Три технологические зоны', d: 'Прямоугольный полипропиленовый контейнер — аэрационная установка закрытого типа с оборудованием биологической очистки внутри.', s: [470, 54], h: [62, 30, 676, 308] },
    { t: 'Очищенная вода', d: 'Отводится из сооружения.', s: [770, 190], h: [700, 116, 100, 50] }
  ] },
  'miniklar-mikroklar': { c: Bio, steps: [
    { t: 'Стоки от дома', d: 'Хозяйственно-бытовые стоки жилого дома, коттеджа, усадьбы, гостиницы или ресторана — от 0.4 до 5.2 м³/сут.', s: [60, 186], h: [0, 116, 230, 50] },
    { t: 'Биологическая очистка', d: 'Очистка сточных вод до 98% — без запахов во дворе.', s: [470, 54], h: [62, 30, 676, 308] },
    { t: 'Очищенная вода', d: 'Отводится из установки, без подключения к централизованной канализации.', s: [770, 190], h: [700, 116, 100, 50] }
  ] },
  'treatment-facilities-general': { c: Bio, steps: [
    { t: 'Сточные воды', d: 'Бытовые, промышленные и ливневые — для дома, посёлка или предприятия.', s: [60, 186], h: [0, 116, 230, 50] },
    { t: 'Очистка', d: 'Очистные для частного дома, промышленных зданий и посёлков, станции биологической очистки, очистные ливневых вод.', s: [470, 54], h: [62, 30, 676, 308] },
    { t: 'Чистая вода', d: 'Комплекс решений ESP для очистки воды любого происхождения.', s: [770, 190], h: [700, 116, 100, 50] }
  ] },
  'aeration-systems': { c: Aeration, steps: [
    { t: 'Воздуходувки', d: 'Подают воздух в систему аэрации.', s: [85, 172], h: [28, 58, 114, 74] },
    { t: 'Трубопроводы и гребёнки', d: 'Распределительные трубопроводы и воздухораспределительные гребёнки разводят воздух по сооружению.', s: [160, 250], h: [140, 80, 590, 266] },
    { t: 'Аэрационные элементы', d: 'Насыщают сточную воду воздухом.', s: [495, 290], h: [290, 320, 420, 30] },
    { t: 'Кислородные датчики', d: 'Контролируют содержание кислорода в воде.', s: [745, 70], h: [684, 30, 30, 180] }
  ] },
  'kubicek-blowers': { c: Blower, steps: [
    { t: 'Впуск', d: 'Газ поступает через впускной патрубок.', s: [460, 370], h: [370, 318, 60, 82] },
    { t: 'Сжатие', d: 'Два трёхлопастных ротора вращаются навстречу друг другу и сжимают газ между роторами и стенками корпуса.', s: [160, 200], h: [212, 82, 376, 236] },
    { t: 'Синхронизация', d: 'Зубчатая передача синхронизирует роторы и держит точные зазоры без попадания масла в среду.', s: [640, 200], h: [290, 150, 220, 100] },
    { t: 'Подача воздуха', d: 'На аэрацию сточных вод, пневмотранспорт, в топки и рыбоводство.', s: [460, 30], h: [370, 0, 60, 82] }
  ] },
  'rotary-drum-sieve': { c: DrumSieve, steps: [
    { t: 'Подача', d: 'Сточная вода подаётся на вращающийся барабан.', s: [145, 32], h: [60, 60, 172, 82] },
    { t: 'Барабан с сеткой', d: 'Перфорированная сетка задерживает мусор и крупные взвешенные частицы.', s: [400, 42], h: [280, 72, 380, 290] },
    { t: 'Вода дальше', d: 'Очищенная вода проходит дальше по технологической линии.', s: [140, 290], h: [0, 320, 290, 40] }
  ] },
  'microfilters-sand-traps': { c: MechLine, steps: [
    { t: 'Песколовка', d: 'Гравитационное отделение песка с автоматическим удалением и обезвоживанием.', s: [105, 76], h: [40, 106, 132, 196] },
    { t: 'Барабанная решётка', d: 'Самоочищающаяся решётка из нержавеющей стали AISI-304 удаляет крупные органические включения.', s: [250, 84], h: [218, 118, 144, 144] },
    { t: 'Шнековый транспортёр', d: 'Отводит собранный мусор в накопитель.', s: [400, 130], h: [318, 44, 190, 92] },
    { t: 'Микрофильтр', d: 'Третья ступень: загрязнения задерживаются на фильтровальной ткани, при росте уровня барабан вращается, струи смывают осадок в приёмный жёлоб.', s: [640, 76], h: [518, 108, 244, 194] }
  ] },
  'sand-separator': { c: SandSeparator, steps: [
    { t: 'Приёмный бункер', d: 'Сточная вода поступает в бункер, песок и твёрдые частицы отделяются.', s: [270, 96], h: [120, 120, 300, 212] },
    { t: 'Наклонный шнек', d: 'Выводит отделённый песок из приёмного бункера.', s: [610, 250], h: [390, 80, 390, 280] },
    { t: 'Вода дальше', d: 'Уходит на следующие ступени очистки, оборудование защищено от износа.', s: [770, 136], h: [420, 152, 380, 36] }
  ] },
  'screw-conveyor': { c: Screw, steps: [
    { t: 'Приём', d: 'Отбросы с решёток, песок, обезвоженный осадок.', s: [230, 240], h: [40, 120, 150, 172] },
    { t: 'Перемещение', d: 'Шнек перемещает сыпучие и мелкокусковые материалы; длина и угол наклона подбираются под компоновку.', s: [430, 280], h: [90, 70, 640, 260] },
    { t: 'Выгрузка', d: 'К местам складирования или вывоза.', s: [770, 220], h: [600, 112, 140, 250] }
  ] },
  'orl-storm-water': { c: Separator, steps: [
    { t: 'Отстаивание', d: 'Поверхностный сток с АЗС, промплощадок и автостоянок поступает в зону отстаивания.', s: [205, 60], h: [82, 112, 246, 216] },
    { t: 'Коалесцентная фильтрация', d: 'Вторая технологическая зона задерживает нефтепродукты.', s: [422, 60], h: [332, 112, 178, 216] },
    { t: 'Сорбционная фильтрация', d: 'Третья зона доочищает сток от нефтепродуктов.', s: [610, 60], h: [512, 112, 206, 216] },
    { t: 'Самотёк', d: 'Установка работает без насосов, по принципу самотёка; глубина установки до 3 м.', s: [770, 210], h: [700, 140, 100, 44] }
  ] },
  'fibroil-sorbent': { c: Separator, p: { variant: 'fibroil' }, steps: [
    { t: 'Сток с нефтепродуктами', d: 'Поступает в фильтр доочистки ливневых вод.', s: [205, 60], h: [82, 112, 428, 216] },
    { t: 'Сорбент на поверхности', d: 'Фиброил держится на поверхности воды и практически не впитывает влагу — менее 3%.', s: [610, 60], h: [538, 138, 144, 64] },
    { t: 'Улавливание', d: 'Волокна захватывают керосин, масла, дизельное топливо, бензин в количестве, в разы превышающем собственный вес.', s: [610, 250], h: [512, 112, 206, 216] },
    { t: 'Доочищенная вода', d: 'Отводится дальше.', s: [770, 210], h: [700, 140, 100, 44] }
  ] },
  'lt-grease-traps': { c: Separator, p: { variant: 'grease' }, steps: [
    { t: 'Жиросодержащие стоки', d: 'Из кафе, ресторанов и пищевых производств поступают в жироуловитель.', s: [40, 112], h: [0, 130, 90, 40] },
    { t: 'Направляющие перегородки', d: 'Жир всплывает наверх, тяжёлые фракции оседают на дно.', s: [390, 60], h: [240, 112, 300, 216] },
    { t: 'Осветлённая вода', d: 'Отводится в канализацию — сети не засоряются.', s: [770, 210], h: [700, 140, 100, 44] },
    { t: 'Удаление жира', d: 'Накопленный жир удаляется механически через технологические шахты.', s: [240, 40], h: [82, 54, 180, 106] }
  ] },
  'polymer-dosing-station': { c: Dosing, steps: [
    { t: 'Приготовление', d: 'Станция готовит раствор полимерного флокулянта.', s: [250, 64], h: [58, 30, 204, 302] },
    { t: 'Дозирование', d: 'Точная дозировка реагента.', s: [520, 236], h: [298, 168, 264, 164] },
    { t: 'Подача в линию', d: 'Для физико-химической очистки, осаждения фосфора и обезвоживания осадка.', s: [740, 136], h: [580, 140, 220, 124] }
  ] },
  'filter-press': { c: BeltPress, steps: [
    { t: 'Кондиционирование', d: 'Осадок обрабатывается флокулянтом из автоматической станции дозирования.', s: [150, 70], h: [0, 30, 180, 130] },
    { t: 'Гравитационная зона', d: 'Осадок движется на фильтровальной сетчатой ленте.', s: [215, 115], h: [100, 140, 236, 200] },
    { t: 'Зона низкого давления', d: 'Осадок сдавливается между двумя лентами.', s: [380, 82], h: [296, 104, 186, 100] },
    { t: 'Зона высокого давления', d: 'Прижимные валы отжимают осадок; давление регулируется от компрессора.', s: [600, 300], h: [480, 110, 300, 160] }
  ] },
  'ultrasonic-flowmeter': { c: Flowmeter, steps: [
    { t: 'Ультразвуковой зонд', d: 'Один или два зонда над потоком.', s: [330, 116], h: [376, 94, 48, 42] },
    { t: 'Уровень воды', d: 'Расходомер измеряет высоту уровня воды.', s: [200, 150], h: [40, 196, 720, 50] },
    { t: 'Расход и объём', d: 'Мгновенный расход и общий сток; выходные, управляющие и статистические функции.', s: [770, 70], h: [598, 22, 144, 96] }
  ] },
  'polypropylene-tanks': { c: Tank, steps: [
    { t: 'Изготовление', d: 'Подбор готового изделия или изготовление по чертежам заказчика.', s: [400, 50], h: [200, 90, 400, 250] },
    { t: 'Назначение', d: 'Накопление жидкостей, разведение рыб, небольшой пруд.', s: [150, 220], h: [202, 150, 396, 188] },
    { t: 'Комплектация', d: 'Системой аэрации, полива и другими компонентами.', s: [680, 282], h: [200, 300, 560, 40] }
  ] }
}

const cfg = computed(() => CONFIG[props.slug] || null)
const active = ref(0)
const root = ref(null)
const svg = ref(null)
let timer = null
let io = null
let reduce = false
let hold = 0

const tick = () => {
  if (Date.now() < hold || !cfg.value) return
  active.value = (active.value + 1) % cfg.value.steps.length
}
const pick = (i) => { active.value = i; hold = Date.now() + 8000 }
const play = (on) => {
  const s = svg.value
  if (!s || typeof s.pauseAnimations !== 'function') return
  if (on && !reduce) s.unpauseAnimations()
  else s.pauseAnimations()
}

onMounted(() => {
  reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) play(false)
  else timer = setInterval(tick, 3600)
  if (typeof IntersectionObserver === 'undefined') return
  io = new IntersectionObserver(([e]) => {
    play(e.isIntersecting)
    clearInterval(timer)
    if (e.isIntersecting && !reduce) timer = setInterval(tick, 3600)
  }, { threshold: 0.25 })
  io.observe(root.value)
})
onBeforeUnmount(() => { io?.disconnect(); clearInterval(timer) })
</script>

<template>
  <div v-if="cfg" ref="root" class="pr">
    <div class="pr-stage">
      <svg ref="svg" class="pr-svg" viewBox="0 0 800 400" role="img" :aria-label="'Схема принципа работы: ' + cfg.steps.map((s) => s.t).join(' → ')">
        <g class="pr-hl">
          <rect v-for="(s, i) in cfg.steps" :key="'h' + i" :class="{ on: i === active }" :x="s.h[0]" :y="s.h[1]" :width="s.h[2]" :height="s.h[3]" rx="14" />
        </g>
        <component :is="cfg.c" v-bind="cfg.p || {}" />
        <g v-for="(s, i) in cfg.steps" :key="'m' + i" :class="['pr-mark', { on: i === active }]" :transform="`translate(${s.s[0]} ${s.s[1]})`" @click="pick(i)">
          <rect x="-19" y="-19" width="38" height="38" rx="11" />
          <text y="7.5" text-anchor="middle">{{ i + 1 }}</text>
        </g>
      </svg>
      <p class="pr-note">Схема принципа работы · не в масштабе</p>
    </div>
    <ol class="pr-steps" :style="{ '--n': cfg.steps.length }">
      <li v-for="(s, i) in cfg.steps" :key="i">
        <button type="button" :class="['pr-step', { on: i === active }]" :aria-pressed="i === active" @click="pick(i)" @mouseenter="pick(i)">
          <span class="pr-num">{{ i + 1 }}</span>
          <b>{{ s.t }}</b>
          <span class="pr-d">{{ s.d }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<style>
.pr { margin-top: clamp(40px, 5vw, 64px); }
.pr-stage { position: relative; background: linear-gradient(180deg, #ffffff 0%, #eef3fa 100%); border-radius: var(--r-lg); padding: clamp(14px, 3.4vw, 44px) clamp(10px, 3vw, 40px) clamp(12px, 2vw, 22px); overflow: hidden; }
.pr-svg { display: block; width: 100%; height: auto; overflow: visible; }
.pr-note { margin: 10px 0 0; text-align: center; font-size: 12px; letter-spacing: 0.02em; color: #8a94a6; }

.pr-wall { fill: #fff; stroke: #0a3a8c; stroke-width: 2; stroke-linejoin: round; }
.pr-wall--open { fill: none; }
.pr-water { fill: rgba(47, 120, 196, 0.14); }
.pr-ln { fill: none; stroke: #0a3a8c; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.pr-thin { fill: none; stroke: rgba(10, 58, 140, 0.38); stroke-width: 1; stroke-linecap: round; }
.pr-dash { fill: none; stroke: rgba(10, 58, 140, 0.5); stroke-width: 1.2; stroke-dasharray: 4 5; }
.pr-pipe { fill: none; stroke: rgba(47, 120, 196, 0.2); stroke-width: 12; stroke-linecap: round; stroke-linejoin: round; }
.pr-pipe--air { stroke: rgba(10, 58, 140, 0.12); }
.pr-ground { fill: none; stroke: rgba(10, 58, 140, 0.3); stroke-width: 1.2; stroke-dasharray: 2 6; }
.pr-solid { fill: #0a3a8c; }
.pr-solid-soft { fill: rgba(10, 58, 140, 0.32); }
.pr-accent { fill: #2f78c4; }
.pr-sludge { fill: rgba(138, 122, 102, 0.32); }
.pr-oil { fill: rgba(201, 154, 46, 0.34); }
.pr-block { stroke: rgba(10, 58, 140, 0.45); stroke-width: 1.2; }
.pr-rotor { fill: rgba(47, 120, 196, 0.12); stroke: #0a3a8c; stroke-width: 1.8; stroke-linejoin: round; }
.pr-roller { fill: #fff; stroke: #0a3a8c; stroke-width: 1.6; }
.pr-belt { fill: none; stroke: #2f78c4; stroke-width: 2.2; stroke-dasharray: 10 6; }
.pr-wave { fill: none; stroke: #2f78c4; stroke-width: 1.6; stroke-linecap: round; }
.pr-spray { stroke: #2f78c4; stroke-width: 1.4; stroke-dasharray: 3 4; animation: pr-spray 0.8s linear infinite; }
@keyframes pr-spray { to { stroke-dashoffset: -14; } }
.pr-tx { font: 500 14px/1 var(--dj-font, system-ui); fill: #6b7a93; letter-spacing: 0.01em; }

.pr-flow--water circle { fill: #2f78c4; }
.pr-flow--dirt circle { fill: #8a7a66; }
.pr-flow--air circle { fill: #fff; stroke: #2f78c4; stroke-width: 1.2; }
.pr-flow--oil circle { fill: #c99a2e; }
.pr-flow--sand circle { fill: #a8875a; }

.pr-hl rect { fill: rgba(47, 120, 196, 0.08); stroke: rgba(47, 120, 196, 0.45); stroke-width: 1.2; stroke-dasharray: 5 5; opacity: 0; transition: opacity 0.5s ease; }
.pr-hl rect.on { opacity: 1; }
.pr-mark { cursor: pointer; }
.pr-mark rect { fill: #fff; stroke: #0a3a8c; stroke-width: 1.6; transition: fill 0.35s ease; }
.pr-mark text { font: 600 20px/1 var(--dj-font, system-ui); fill: #0a3a8c; transition: fill 0.35s ease; }
.pr-mark.on rect { fill: #0a3a8c; }
.pr-mark.on text { fill: #fff; }

.pr-steps { list-style: none; margin: 14px 0 0; padding: 0; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 12px; }
.pr-step { all: unset; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px; width: 100%; height: 100%; padding: 18px 18px 20px; border-radius: var(--r-md); background: var(--tile, #161617); border: 1px solid transparent; cursor: pointer; transition: border-color 0.35s ease, background 0.35s ease; }
.pr-step:focus-visible { outline: 2px solid #2f78c4; outline-offset: 2px; }
.pr-step.on { border-color: rgba(47, 120, 196, 0.7); background: #121a2a; }
.pr-num { display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: var(--r-xs); font-size: 13px; font-weight: 600; color: #9fc3ec; border: 1px solid rgba(159, 195, 236, 0.45); transition: all 0.35s ease; }
.pr-step.on .pr-num { background: #2f78c4; border-color: #2f78c4; color: #fff; }
.pr-step b { font-size: 17px; line-height: 1.25; font-weight: 600; color: var(--ink, #f5f5f7); letter-spacing: -0.01em; }
.pr-d { font-size: 14px; line-height: 1.45; color: var(--mute, #86868b); }

@media (max-width: 860px) {
  .pr-steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .pr-stage { border-radius: var(--r-md); }
  .pr-tx { display: none; }
  .pr-mark rect { stroke-width: 2.4; }
  .pr-mark text { font-size: 22px; }
  .pr-steps { grid-template-columns: 1fr; gap: 8px; }
  .pr-step { padding: 14px 16px 16px; border-radius: var(--r-md); }
  .pr-step b { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .pr-spray { animation: none; }
  .pr-hl rect, .pr-mark rect, .pr-mark text, .pr-step, .pr-num { transition: none; }
}
</style>
