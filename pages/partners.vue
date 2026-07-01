<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Экосистема связей
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">
          Связь. Синергия опыта и технологий
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl">
          Мы непоколебимо верим, что великие инженерные решения рождаются на стыке партнёрства. ESP не работает изолированно — мы являемся ядром экосистемы, связывающей проектные институты, поставщиков сырья, IT-интеграторов и государственные органы.
        </p>
      </div>
    </section>

    <!-- Partners Grid -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-2xl md:text-3xl mb-10 text-esp-black">Ключевые партнёры экосистемы</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(p, i) in partners" :key="p.name" class="bg-white p-6 hover:shadow-lg transition-all duration-300 group">
            <p class="text-esp-black/30 text-xs font-inter mb-3">// BRAND_NODE: 0{{ i + 1 }}</p>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">{{ p.name }}</h3>
            <p class="text-esp-black/60 text-sm">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech integration standards -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
            Технические стыки
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">BIM, SCADA, ERP & IoT совместимость</h2>
          <p class="text-esp-black/70 max-w-2xl mx-auto">
            Наши установки готовы к бесшовной сборке с любой цифровой ERP/SCADA системой заказчика
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="std in integrationStandards" :key="std.title" class="bg-esp-gray p-6">
            <span class="inline-block px-2 py-1 bg-esp-black text-white text-xs font-medium font-inter mb-3">{{ std.title }}</span>
            <p class="text-esp-green text-xs font-inter font-semibold mb-3">[{{ std.spec }}]</p>
            <p class="text-esp-black/70 text-sm">{{ std.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership request -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom max-w-2xl">
        <div class="bg-white p-8 md:p-12">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Стать частью экосистемы
          </span>
          <h3 class="font-rounded text-2xl font-semibold mb-3 text-esp-black">Подайте заявку на партнёрство</h3>
          <p class="text-esp-black/70 mb-8">
            Разрабатываете оборудование, проектируете или внедряете системы автоматизации? Начнём сотрудничество.
          </p>

          <form v-if="!sent" @submit.prevent="sent = true" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input v-model="form.name" required type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
              <input v-model="form.company" required type="text" placeholder="Название компании" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            </div>
            <input v-model="form.email" required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="btn-primary w-full">Отправить партнёрский запрос</button>
          </form>
          <div v-else class="p-5 bg-esp-green/10 border border-esp-green text-esp-green text-center font-medium">
            Заявка на партнёрство принята. Мы свяжемся с вами в течение 2 рабочих дней.
          </div>
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
