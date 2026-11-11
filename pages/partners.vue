<template>
  <div ref="root" class="pt">
    <DjPageHero
      eyebrow="Партнёры"
      title="Партнёры и технологическая совместимость"
      lede="ESP работает во взаимодействии с проектными институтами, поставщиками, интеграторами систем автоматизации и государственными органами."
    />

    <section class="pt-sec">
      <div class="dj-wrap">
        <h2 class="dj-h2 dj-center dj-reveal">Ключевые партнёры</h2>
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
          <span class="dj-eyebrow">Интеграция</span>
          <h2 class="dj-h2 pt-title">Совместимость с BIM, SCADA, ERP и телеметрией</h2>
          <p class="dj-lede pt-lede">Оборудование интегрируется с ERP- и SCADA-системами заказчика</p>
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
          <span class="dj-eyebrow">Сотрудничество</span>
          <h2 class="dj-h2 pt-title">Подайте заявку на партнёрство</h2>
          <p class="dj-lede pt-lede">Разрабатываете оборудование, проектируете или внедряете системы автоматизации? Обсудим сотрудничество.</p>
        </div>

        <form v-if="!sent" class="pt-form" @submit.prevent="submitPartner">
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
          <LeadConsent v-model="form.consent" />
          <p v-if="error" class="pt-err" role="alert">{{ error }}</p>
          <button type="submit" class="dj-btn dj-btn--lg pt-submit" :disabled="sending">{{ sending ? 'Отправляем…' : 'Обсудить сотрудничество' }}</button>
        </form>
        <p v-else class="pt-ok" role="status">
          Заявка на партнёрство принята. Мы свяжемся с вами в течение 2 рабочих дней.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReveal } from '~/composables/useReveal'

useHead({
  title: 'Партнёры ESP | Поставщики, интеграторы и институты',
  meta: [
    { name: 'description', content: 'Партнёры ЭкоСервисПроект: проектные институты, поставщики оборудования, интеграторы. Совместимость с BIM, SCADA, ERP и системами телеметрии.' }
  ]
})

const partners = [
  { name: 'HydroMinsk', desc: 'Проектирование водозаборных узлов столицы' },
  { name: 'BelVoda', desc: 'Государственные стандарты фильтрации' },
  { name: 'AeroStrux', desc: 'Аэрационное напорное оборудование' },
  { name: 'Nordic Hydro', desc: 'Поставка полых волокон для мембран' },
  { name: 'EcoTech', desc: 'Экологическая сертификация проектов' },
  { name: 'PureFlow', desc: 'Запорно-регулирующая арматура' }
]

const integrationStandards = [
  { title: 'Интеграция с BIM', spec: 'Autodesk Revit RFA · BIM360', desc: 'Совместимость компоновочных чертежей' },
  { title: 'Интерфейсы SCADA', spec: 'Modbus TCP · OPC UA · Profinet', desc: 'Прямая отдача телеметрии на ПЛК Siemens' },
  { title: 'Синхронизация с ERP', spec: 'SAP · 1C Enterprise API', desc: 'Автоматическая синхронизация регламентных данных' },
  { title: 'Облачная телеметрия', spec: 'MQTT · HTTPS Encrypted', desc: 'Непрерывная передача данных в диагностический центр ESP' }
]

const form = ref({ name: '', company: '', email: '', consent: false })
const { send, sending, sent, error } = useLead('contact')
const submitPartner = (e) => send({ ...form.value, topic: 'Технологическое партнёрство' }, [], e)
const root = ref(null)
useReveal(root)
</script>

<style scoped>
.pt-err { margin: 0; font-size: 14px; color: #c62828; }
/* Apple: плитки 28px на #f5f5f7, тёмный блок с полупрозрачными плитками,
   форма как apple.com/contact — поля 12px с плавающей рамкой */
.pt-sec { padding: clamp(24px, 4vw, 48px) 0 clamp(72px, 9vw, 120px); }
.pt-grid { display: grid; gap: 20px; margin-top: clamp(32px, 4vw, 56px); }
.pt-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pt-grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.pt-card { display: flex; flex-direction: column; min-height: 240px; padding: clamp(28px, 3vw, 40px); border-radius: var(--r-lg); background: #f5f5f7; transition: transform .5s var(--dj-ease), box-shadow .5s var(--dj-ease); }
.pt-card:hover { transform: scale(1.01); box-shadow: var(--sh-1); }
.pt-idx { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #86868b; font-variant-numeric: tabular-nums; }
.pt-h { margin-top: auto; padding-top: 40px; font-size: clamp(24px, 2.2vw, 28px); line-height: 1.14; font-weight: 600; letter-spacing: 0.007em; color: var(--dj-ink); }
.pt-text { margin-top: 8px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.pt-title { margin-top: 10px; }
.pt-lede { max-width: 40rem; margin-top: 16px; }
.pt-std { display: flex; flex-direction: column; gap: 10px; padding: 32px 28px; border-radius: var(--r-lg); background: #1d1d1f; }
.pt-pill { align-self: flex-start; padding: 5px 12px; border-radius: var(--r-pill); background: rgba(255, 255, 255, .14); font-size: 12px; font-weight: 600; letter-spacing: -0.01em; color: #fff; }
.pt-spec { margin-top: 10px; font-size: 14px; letter-spacing: -0.016em; color: #86868b; }
.pt-std-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #f5f5f7; }
.pt-narrow { max-width: 740px; }
.pt-form { display: grid; gap: 16px; margin-top: clamp(32px, 4vw, 48px); padding: clamp(28px, 4vw, 44px); border-radius: var(--r-lg); background: #f5f5f7; }
.pt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pt-label { display: block; margin: 0 0 6px 4px; font-size: 12px; font-weight: 600; letter-spacing: -0.01em; color: #6e6e73; }
.pt-input { width: 100%; height: 56px; padding: 0 16px; border: 1px solid #d2d2d7; border-radius: var(--r-sm); background: #fff; font: inherit; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color .2s ease, box-shadow .2s ease; }
.pt-input::placeholder { color: #86868b; }
.pt-input:focus { outline: none; border-color: #0071e3; box-shadow: var(--focus-ring); }
.pt-submit { width: 100%; margin-top: 8px; }
.pt-ok { margin: clamp(32px, 4vw, 48px) 0 0; padding: 20px 24px; border-radius: var(--r-md); background: #f5f5f7; color: var(--dj-ink); font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; text-align: center; }
@media (max-width: 1023px) {
  .pt-grid--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pt-grid--4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .pt-grid { gap: 16px; }
  .pt-grid--3, .pt-grid--4, .pt-row { grid-template-columns: 1fr; }
  .pt-card { min-height: 0; border-radius: var(--r-md); }
  .pt-std, .pt-form { border-radius: var(--r-md); }
  .pt-h { padding-top: 28px; }
  .pt-submit { white-space: normal; height: auto; min-height: 48px; padding-top: 12px; padding-bottom: 12px; }
}
@media (prefers-reduced-motion: reduce) { .pt-card { transition: none; } .pt-card:hover { transform: none; } }
</style>
