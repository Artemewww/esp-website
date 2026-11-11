<template>
  <div class="cmp">
    <section class="cmp-top">
      <div class="dj-wrap">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: 'Сравнение' }]" />
        <span class="dj-eyebrow cmp-eyebrow">Подбор оборудования</span>
        <h1 class="dj-h1">Сравнение оборудования</h1>
        <p class="dj-lede cmp-lede">
          Выберите до 4 моделей из каталога ESP, чтобы сравнить производительность, применение и гарантийные условия бок о бок.
        </p>

        <!-- Выбор моделей: список + капсулы -->
        <div class="cmp-picker">
          <div class="cmp-select">
            <select
              class="cmp-input"
              :disabled="selected.length >= 4"
              aria-label="Добавить модель к сравнению"
              @change="addFromSelect($event)"
            >
              <option value="">{{ selected.length >= 4 ? 'Максимум 4 модели' : '+ Добавить модель к сравнению' }}</option>
              <option v-for="eq in availableToAdd" :key="eq.slug" :value="eq.slug">{{ eq.name }}</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <p class="cmp-small">Выбрано: <strong>{{ selected.length }}</strong> / 4</p>
        </div>

        <div v-if="selected.length" class="cmp-chips">
          <span v-for="eq in comparedModels" :key="eq.slug" class="cmp-chip">
            {{ eq.name }}
            <button type="button" class="cmp-chip-x" aria-label="Убрать из сравнения" @click="toggle(eq.slug)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </span>
        </div>
      </div>
    </section>

    <!-- Таблица сравнения -->
    <section class="cmp-tbl-sec">
      <div class="dj-wrap">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-param" scope="col">Параметр</th>
                <th v-for="m in comparedModels" :key="m.slug" class="cmp-model" scope="col">
                  <NuxtLink :to="`/equipment/${m.slug}`" class="cmp-img" tabindex="-1" :aria-label="m.name">
                    <EquipShot :item="m" :caption="false" />
                  </NuxtLink>
                  <NuxtLink :to="`/equipment/${m.slug}`" class="cmp-name">{{ m.name }}</NuxtLink>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="cmp-param" scope="row">Категория</th>
                <td v-for="m in comparedModels" :key="m.slug + 'cat'">{{ m.category }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Производительность</th>
                <td v-for="m in comparedModels" :key="m.slug + 'cap'" class="cmp-strong">{{ m.capacity }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Применение</th>
                <td v-for="m in comparedModels" :key="m.slug + 'app'">{{ m.application }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Гарантия</th>
                <td v-for="m in comparedModels" :key="m.slug + 'war'" class="cmp-strong">{{ warranty(m) }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Ключевые характеристики</th>
                <td v-for="m in comparedModels" :key="m.slug + 'specs'">
                  <ul class="cmp-specs">
                    <li v-for="spec in (m.specs || []).slice(0, 4)" :key="spec.label">
                      <span>{{ spec.label }}:</span> {{ spec.value }}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row"></th>
                <td v-for="m in comparedModels" :key="m.slug + 'cta'">
                  <NuxtLink :to="`/equipment/${m.slug}`" class="dj-btn">Подробнее</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="!comparedModels.length" class="cmp-empty">Выберите оборудование выше, чтобы начать сравнение</p>
      </div>
    </section>

    <!-- Запрос расчёта -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap cmp-req">
        <div class="dj-center">
          <h2 class="dj-h2">Запросить расчёт по выбранным моделям</h2>
          <p class="dj-lede cmp-req-lede">Отправим сравнительное КП с учётом параметров вашего объекта.</p>
        </div>
        <form v-if="!sent" class="cmp-form" @submit.prevent="submitCompare">
          <div>
            <label class="cmp-label" for="cm-name">Ваше имя</label>
            <input id="cm-name" v-model="form.name" required type="text" placeholder="Ваше имя" class="cmp-input" />
          </div>
          <div>
            <label class="cmp-label" for="cm-email">E-mail</label>
            <input id="cm-email" v-model="form.email" required type="email" autocomplete="email" placeholder="E-mail" class="cmp-input" />
          </div>
          <div>
            <label class="cmp-label" for="cm-phone">Телефон</label>
            <input id="cm-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="+375 __ ___-__-__" class="cmp-input" />
          </div>
          <LeadConsent v-model="form.consent" />
          <p v-if="error" class="cmp-err" role="alert">{{ error }}</p>
          <button type="submit" class="dj-btn dj-btn--lg cmp-submit" :disabled="sending">{{ sending ? 'Отправляем…' : 'Отправить запрос' }}</button>
        </form>
        <div v-else class="cmp-form cmp-ok" role="status">
          Запрос отправлен. Инженер ESP свяжется с вами.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Сравнение оборудования ESP | Подберите оптимальную модель',
  meta: [
    { name: 'description', content: 'Сравните до 4 моделей оборудования ESP по производительности, применению, гарантии и техническим характеристикам.' }
  ]
})

const { equipment } = useEquipment()

const selected = ref(['flotation-units', 'kns-kvatro'])
const toggle = (slug) => {
  if (selected.value.includes(slug)) {
    selected.value = selected.value.filter(s => s !== slug)
  } else {
    if (selected.value.length >= 4) return
    selected.value = [...selected.value, slug]
  }
}

const addFromSelect = (e) => {
  const slug = e.target.value
  if (slug) toggle(slug)
  e.target.value = ''
}

const availableToAdd = computed(() => equipment.value.filter(e => !selected.value.includes(e.slug)))
const comparedModels = computed(() => equipment.value.filter(e => selected.value.includes(e.slug)))
const warranty = (m) => (m.specs || []).find(s => s.label.toLowerCase().includes('гарант'))?.value || '—'

const form = ref({ name: '', email: '', phone: '', consent: false })
const { send, sending, sent, error } = useLead('contact')
const submitCompare = (e) => send({ ...form.value, topic: 'Расчёт по сравнению моделей', message: 'Модели: ' + comparedModels.value.map(m => m.title || m.name || m.slug).join(', ') }, [], e)
</script>

<style scoped>
.cmp-err { margin: 0; font-size: 14px; color: #c62828; }
/* Сравнение в подаче apple.com/iphone/compare: заголовок по центру,
   выпадающий список Apple, колонки моделей, тонкие разделители */
.cmp { background: #fff; color: #1d1d1f; font-family: var(--dj-font); letter-spacing: -0.022em; }
.cmp-top { padding: clamp(28px, 4vw, 48px) 0 0; text-align: center; }
.cmp-top :deep(nav), .cmp-top :deep(ol) { justify-content: center; }
.cmp-eyebrow { margin-top: clamp(28px, 4vw, 48px); margin-bottom: 8px; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #6e6e73; }
.cmp-top .dj-h1 { font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #1d1d1f; text-wrap: balance; hyphens: manual; }
.cmp-lede { max-width: 680px; margin: 16px auto 0; font-size: clamp(19px, 1.5vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: #6e6e73; }

.cmp-picker { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 40px; }
.cmp-select { position: relative; width: 100%; max-width: 420px; }
.cmp-select select { appearance: none; padding-right: 48px; cursor: pointer; }
.cmp-select select:disabled { cursor: not-allowed; color: #86868b; }
.cmp-select svg { position: absolute; right: 18px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: #1d1d1f; pointer-events: none; }
.cmp-small { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.cmp-small strong { font-weight: 600; color: #1d1d1f; }

.cmp-input { width: 100%; height: 56px; padding: 0 18px; font: inherit; font-size: 17px; letter-spacing: -0.022em; color: #1d1d1f; background: #fff; border: 1px solid #86868b; border-radius: var(--r-sm); outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.cmp-input::placeholder { color: #86868b; }
.cmp-input:focus { border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 125, 250, 0.6); }
.cmp-label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #1d1d1f; }

.cmp-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 20px; }
.cmp-chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 6px 6px 6px 16px; border-radius: var(--r-pill); background: #f5f5f7; font-size: 14px; letter-spacing: -0.016em; color: #1d1d1f; }
.cmp-chip-x { flex: 0 0 auto; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; color: #6e6e73; background: rgba(0, 0, 0, 0.06); }
.cmp-chip-x:hover { color: #1d1d1f; background: rgba(0, 0, 0, 0.12); }
.cmp-chip-x svg { width: 11px; height: 11px; }
.cmp-chip-x:focus-visible, .cmp-name:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }

.cmp-tbl-sec { padding: clamp(40px, 5vw, 64px) 0 clamp(64px, 8vw, 104px); }
.cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
.cmp-table { width: 100%; min-width: 640px; border-collapse: separate; border-spacing: 0; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #1d1d1f; }
.cmp-table th, .cmp-table td { padding: 22px 20px; text-align: center; vertical-align: top; border-bottom: 1px solid #d2d2d7; }
.cmp-table thead th { border-bottom: 0; padding-bottom: 28px; }
.cmp-table tbody tr:last-child th, .cmp-table tbody tr:last-child td { border-bottom: 0; }
.cmp-param { position: sticky; left: 0; z-index: 1; width: 11rem; min-width: 9rem; background: #fff; text-align: left !important; font-size: 14px; line-height: 1.43; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; }
thead .cmp-param { vertical-align: bottom; }
.cmp-model { min-width: 200px; max-width: 260px; font-weight: 600; }
.cmp-img { display: block; aspect-ratio: 1 / 1; margin: 0 auto 18px; max-width: 220px; overflow: hidden; border-radius: var(--r-md); }
.cmp-img:hover :deep(.esh-img) { transform: scale(1.03); }
.cmp-name { display: block; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; hyphens: manual; }
.cmp-name:hover { color: #0066cc; }
.cmp-strong { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; }
.cmp-specs { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #1d1d1f; }
.cmp-specs span { display: block; color: #6e6e73; }
.cmp-table .dj-btn { height: auto; min-height: 36px; padding: 0 18px; border-radius: var(--r-pill); font-size: 14px; letter-spacing: -0.016em; background: var(--dj-blue); }
.cmp-table .dj-btn:hover { background: #0b3a8c; }
.cmp-empty { max-width: 680px; margin: 0 auto; padding: 48px 24px; text-align: center; font-size: 17px; color: #6e6e73; border-radius: var(--r-md); background: #f5f5f7; }

.cmp-req { max-width: 680px; }
.cmp-req .dj-h2 { font-size: clamp(32px, 3.9vw, 56px); line-height: 1.07; letter-spacing: -0.005em; text-wrap: balance; hyphens: manual; }
.cmp-req-lede { margin-top: 14px; font-size: clamp(19px, 1.5vw, 21px); line-height: 1.381; color: #6e6e73; }
.cmp-form { display: grid; gap: 18px; margin-top: 40px; }
.cmp-form .cmp-input { background: #fff; }
.cmp-submit { width: 100%; height: auto; min-height: 50px; margin-top: 8px; border-radius: var(--r-sm); font-size: 17px; letter-spacing: -0.022em; }
.cmp-submit:focus-visible { outline: 2px solid #0071e3; outline-offset: 3px; }
.cmp-ok { padding: 28px 24px; text-align: center; font-size: 17px; color: #1d1d1f; border-radius: var(--r-md); background: #fff; }

@media (max-width: 767px) {
  .cmp-param { width: 7.5rem; min-width: 7.5rem; }
  .cmp-table th, .cmp-table td { padding: 16px 12px; }
  .cmp-model { min-width: 170px; }
  .cmp-name, .cmp-strong { font-size: 17px; line-height: 1.24; }
}
</style>
