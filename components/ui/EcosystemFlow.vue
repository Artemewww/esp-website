<template>
  <!-- Схема взаимодействия. Прежняя «звезда» — логотип в центре и четыре
       кружка с эмодзи по углам — показывала структуру, но не главное:
       объект идёт по этапам внутри одной компании, без передачи подрядчикам.
       Поэтому этапы лежат внахлёст: следующий заходит на предыдущий, как
       смена на смену, а не висит отдельной точкой. -->
  <div class="ef" @mouseleave="active = -1">
    <div class="ef-rail">
      <button
        v-for="(s, i) in stages"
        :key="s.title"
        type="button"
        class="ef-card"
        :class="{ 'is-active': active === i, 'is-dimmed': active > -1 && active !== i }"
        :style="{ zIndex: active === i ? 20 : stages.length - i, '--i': i }"
        @mouseenter="active = i"
        @focus="active = i"
        @click="active = active === i ? -1 : i"
      >
        <span class="ef-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="ef-title">{{ s.title }}</span>
        <span class="ef-desc">{{ s.desc }}</span>
        <span class="ef-metric">{{ s.metric }}</span>
      </button>
    </div>

    <p class="ef-foot">
      <span class="ef-foot-dot"></span>
      Проект, оборудование и пусконаладка — в одних руках: между этапами нет
      передачи подрядчику, за результат отвечает одна компания.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const active = ref(-1)

const stages = [
  {
    title: 'Изыскания',
    desc: 'Обследование площадки, замеры стоков, лазерное сканирование существующих сооружений.',
    metric: 'Точность до миллиметра'
  },
  {
    title: 'Проектирование',
    desc: 'Технологическая схема, расчёты, разделы проекта и BIM-модель будущего объекта.',
    metric: 'Revit · AutoCAD · EPANET'
  },
  {
    title: 'Производство',
    desc: 'Изготовление ёмкостей, флотаторов, КНС и щитов автоматики на собственных мощностях.',
    metric: '100% контроль качества'
  },
  {
    title: 'Монтаж',
    desc: 'Установка оборудования на объекте, обвязка, электрика и подключение автоматики.',
    metric: 'Своя монтажная бригада'
  },
  {
    title: 'Пусконаладка',
    desc: 'Вывод на проектные показатели, настройка режимов, обучение эксплуатации.',
    metric: 'Выход на параметры'
  },
  {
    title: 'Сервис',
    desc: 'Плановое обслуживание, удалённый мониторинг и склад запчастей под объект.',
    metric: '98% запчастей в наличии'
  }
]
</script>

<style scoped>
.ef {
  --overlap: 2.25rem;
}

.ef-rail {
  display: flex;
  flex-direction: column;
  gap: 0;
}
@media (min-width: 900px) {
  .ef-rail { flex-direction: row; align-items: stretch; }
}

.ef-card {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  text-align: left;
  display: grid;
  align-content: start;
  gap: 0.5rem;
  padding: 1.5rem 1.35rem;
  background: #0e1726;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #fff;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
              background-color 0.32s ease,
              box-shadow 0.32s ease,
              opacity 0.32s ease;
}
/* Нахлёст: карточка заезжает на соседа. По вертикали на телефоне,
   по горизонтали на широком экране. */
.ef-card + .ef-card { margin-top: calc(var(--overlap) * -1); }
@media (min-width: 900px) {
  .ef-card + .ef-card { margin-top: 0; margin-left: calc(var(--overlap) * -1); }
}

.ef-card.is-active {
  background: linear-gradient(150deg, #00306e, #0b1a2e);
  box-shadow: 0 24px 60px -24px rgba(0, 168, 232, 0.65);
  transform: translateY(-6px);
}
@media (min-width: 900px) {
  /* Активная карточка выходит из-под соседей и раздвигает ленту. */
  .ef-card.is-active { transform: translateY(-10px) scale(1.04); }
}
.ef-card.is-dimmed { opacity: 0.55; }

.ef-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #00d4ff;
}
.ef-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.02rem;
  font-weight: 600;
}
.ef-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.62);
  /* В покое — две строки, у активной раскрывается целиком. */
  max-height: 2.6em;
  overflow: hidden;
  transition: max-height 0.32s ease, color 0.32s ease;
}
.ef-card.is-active .ef-desc {
  max-height: 8em;
  color: rgba(255, 255, 255, 0.82);
}
.ef-metric {
  margin-top: 0.35rem;
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
}
.ef-card.is-active .ef-metric { color: #00d4ff; }

.ef-foot {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 2rem;
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.55);
  max-width: 56ch;
}
.ef-foot-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  margin-top: 0.45rem;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .ef-card { transition: none; }
}
</style>
