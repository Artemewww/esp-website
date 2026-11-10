<template>
  <div ref="root" class="pt">
    <DjPageHero
      eyebrow="Экосистема связей"
      title="Связь. Синергия опыта и технологий"
      lede="Мы непоколебимо верим, что великие инженерные решения рождаются на стыке партнёрства. ESP не работает изолированно — мы являемся ядром экосистемы, связывающей проектные институты, поставщиков сырья, IT-интеграторов и государственные органы."
    />

    <section class="pt-sec">
      <div class="dj-wrap">
        <h2 class="dj-h2 dj-center dj-reveal">Ключевые партнёры экосистемы</h2>
        <div class="pt-grid pt-grid--3">
          <article v-for="(p, i) in partners" :key="p.name" class="pt-card dj-reveal">
            <span class="pt-idx">0{{ i + 1 }}</span>
            <h3 class="pt-h">{{ p.name }}</h3>
            <p class="pt-text">{{ p.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="dj-sec dj-sec--dark">
      <div class="dj-wrap">
        <div class="dj-center dj-reveal">
          <span class="dj-eyebrow">Технические стыки</span>
          <h2 class="dj-h2 pt-title">BIM, SCADA, ERP & IoT совместимость</h2>
          <p class="dj-lede pt-lede">Наши установки готовы к бесшовной сборке с любой цифровой ERP/SCADA системой заказчика</p>
        </div>
        <div class="pt-grid pt-grid--4">
          <article v-for="std in integrationStandards" :key="std.title" class="pt-std dj-reveal">
            <span class="pt-pill">{{ std.title }}</span>
            <p class="pt-spec">{{ std.spec }}</p>
            <p class="pt-std-text">{{ std.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="dj-sec">
      <div class="dj-wrap pt-narrow">
        <div class="dj-center dj-reveal">
          <span class="dj-eyebrow">Стать частью экосистемы</span>
          <h2 class="dj-h2 pt-title">Подайте заявку на партнёрство</h2>
          <p class="dj-lede pt-lede">Разрабатываете оборудование, проектируете или внедряете системы автоматизации? Начнём сотрудничество.</p>
        </div>

        <form v-if="!sent" class="pt-form" @submit.prevent="sent = true">
          <div class="pt-row">
            <div>
              <label class="pt-label" for="pt-name">Ваше имя</label>
              <input id="pt-name" v-model="form.name" required type="text" autocomplete="name" placeholder="Ваше имя" class="pt-input" />
            </div>
            <div>
              <label class="pt-label" for="pt-company">Название компании</label>
              <input id="pt-company" v-model="form.company" required type="text" autocomplete="organization" placeholder="Название компании" class="pt-input" />
            </div>
          </div>
          <div>
            <label class="pt-label" for="pt-email">E-mail</label>
            <input id="pt-email" v-model="form.email" required type="email" autocomplete="email" placeholder="E-mail" class="pt-input" />
          </div>
          <button type="submit" class="dj-btn dj-btn--lg pt-submit">Отправить партнёрский запрос</button>
        </form>
        <p v-else class="pt-ok" role="status">
          Заявка на партнёрство принята. Мы свяжемся с вами в течение 2 рабочих дней.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReveal } from '~/composables/useReveal'

useHead({
  title: 'Партнёры ESP | Экосистема поставщиков, интеграторов и институтов',
  meta: [
    { name: 'description', content: 'Партнёрская экосистема EcoServiceProject: проектные институты, поставщики оборудования, IT-интеграторы. BIM, SCADA, ERP и IoT совместимость.' }
  ]
})

const partners = [
  { name: 'HydroMinsk', desc: 'Проектирование водозаборных узлов столицы' },
  { name: 'BelVoda', desc: 'Государственные стандарты фильтрации' },
  { name: 'AeroStrux', desc: 'Аэрационное напорное оборудование' },
  { name: 'Nordic Hydro', desc: 'Поставка премиальных полых волокон для мембран' },
  { name: 'EcoTech', desc: 'Экологическая сертификация проектов' },
  { name: 'PureFlow', desc: 'Запорно-регулирующая арматура' }
]

const integrationStandards = [
  { title: 'BIM Integration', spec: 'Autodesk Revit RFA · BIM360', desc: '100% совместимость компоновочных чертежей' },
  { title: 'SCADA APIs', spec: 'Modbus TCP · OPC UA · Profinet', desc: 'Прямая отдача телеметрии на ПЛК Siemens' },
  { title: 'ERP Sync', spec: 'SAP · 1C Enterprise API', desc: 'Автосинхронизация регламентной амортизации' },
  { title: 'IoT Cloud Connect', spec: 'MQTT · HTTPS Encrypted', desc: 'Непрерывная отправка данных в диагностический хаб ESP' }
]

const form = ref({ name: '', company: '', email: '' })
const sent = ref(false)
const root = ref(null)
useReveal(root)
</script>

<style scoped>
.pt-sec { padding: clamp(24px, 4vw, 48px) 0 clamp(64px, 8vw, 104px); }
.pt-grid { display: grid; gap: 16px; margin-top: clamp(28px, 4vw, 48px); }
.pt-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pt-grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.pt-card { padding: clamp(24px, 3vw, 36px); background: var(--dj-soft); }
.pt-idx { font-size: 14px; color: var(--dj-muted); font-variant-numeric: tabular-nums; }
.pt-h { margin-top: 28px; font-size: clamp(22px, 2vw, 26px); line-height: 1.2; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.pt-text { margin-top: 8px; font-size: 15px; line-height: 1.55; color: var(--dj-text); }
.pt-title { margin-top: 10px; }
.pt-lede { max-width: 40rem; margin-top: 14px; }
.pt-std { display: flex; flex-direction: column; gap: 10px; padding: 28px 24px; background: rgba(255, 255, 255, 0.06); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1); }
.pt-pill { align-self: flex-start; padding: 6px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); font-size: 13px; font-weight: 500; color: #fff; }
.pt-spec { margin-top: 6px; font-size: 13px; color: rgba(255, 255, 255, 0.55); }
.pt-std-text { font-size: 15px; line-height: 1.5; color: rgba(255, 255, 255, 0.85); }
.pt-narrow { max-width: 760px; }
.pt-form { display: grid; gap: 16px; margin-top: clamp(28px, 4vw, 44px); padding: clamp(24px, 4vw, 40px); background: #fff; box-shadow: 0 0 0 1px var(--dj-line), 0 24px 60px -32px rgba(0, 0, 0, 0.18); }
.pt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pt-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--dj-ink); }
.pt-input { width: 100%; padding: 13px 14px; border: 1px solid #d2d5d9; border-radius: 0; background: #fff; font: inherit; font-size: 15px; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.pt-input:focus { outline: none; border-color: var(--dj-ink); box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1); }
.pt-submit { width: 100%; }
.pt-ok { margin: clamp(28px, 4vw, 44px) 0 0; padding: 16px 18px; background: #ecf6ef; color: #135c2e; font-size: 15px; }
@media (max-width: 1023px) {
  .pt-grid--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pt-grid--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .pt-grid--3, .pt-grid--4, .pt-row { grid-template-columns: 1fr; }
  .pt-submit { white-space: normal; height: auto; min-height: 48px; padding-top: 12px; padding-bottom: 12px; }
}
</style>
