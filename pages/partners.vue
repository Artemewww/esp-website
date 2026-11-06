<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Экосистема связей</span>
        <h1 class="ap-title">Связь. Синергия опыта и технологий</h1>
        <p class="ap-lede">Мы непоколебимо верим, что великие инженерные решения рождаются на стыке партнёрства. ESP не работает изолированно — мы являемся ядром экосистемы, связывающей проектные институты, поставщиков сырья, IT-интеграторов и государственные органы.</p>

        <h2 class="ap-h2 pt-sub">Ключевые партнёры экосистемы</h2>
        <div class="ap-grid ap-grid--3">
          <div v-for="(p, i) in partners" :key="p.name" class="ap-card">
            <span class="ap-small">0{{ i + 1 }}</span>
            <h3 class="ap-h3">{{ p.name }}</h3>
            <p class="ap-text">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Технические стыки</span>
        <h2 class="ap-h2">BIM, SCADA, ERP & IoT совместимость</h2>
        <p class="ap-lede">Наши установки готовы к бесшовной сборке с любой цифровой ERP/SCADA системой заказчика</p>
        <div class="ap-grid ap-grid--4">
          <div v-for="std in integrationStandards" :key="std.title" class="ap-card">
            <span class="ap-pill pt-pill">{{ std.title }}</span>
            <p class="ap-small">{{ std.spec }}</p>
            <p class="ap-text">{{ std.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ap-sec">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <span class="ap-eyebrow">Стать частью экосистемы</span>
          <h2 class="ap-h2">Подайте заявку на партнёрство</h2>
          <p class="ap-lede">Разрабатываете оборудование, проектируете или внедряете системы автоматизации? Начнём сотрудничество.</p>
        </div>

        <form v-if="!sent" class="ap-form pt-form" @submit.prevent="sent = true">
          <div class="ap-form-row">
            <div>
              <label class="ap-label" for="pt-name">Ваше имя</label>
              <input id="pt-name" v-model="form.name" required type="text" placeholder="Ваше имя" class="ap-input" />
            </div>
            <div>
              <label class="ap-label" for="pt-company">Название компании</label>
              <input id="pt-company" v-model="form.company" required type="text" placeholder="Название компании" class="ap-input" />
            </div>
          </div>
          <div>
            <label class="ap-label" for="pt-email">E-mail</label>
            <input id="pt-email" v-model="form.email" required type="email" placeholder="E-mail" class="ap-input" />
          </div>
          <button type="submit" class="ap-btn ap-btn--block">Отправить партнёрский запрос</button>
        </form>
        <div v-else class="ap-note-ok pt-form">
          Заявка на партнёрство принята. Мы свяжемся с вами в течение 2 рабочих дней.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
</script>

<style scoped>
.pt-sub { margin-top: clamp(3rem, 6vw, 4.5rem); }
.pt-pill { align-self: flex-start; }
.pt-form { margin-top: 2.5rem; }
</style>
