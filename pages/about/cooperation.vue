<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Предложения о сотрудничестве' }]" />
        <span class="ap-eyebrow co-eyebrow">Развитие сети</span>
        <h1 class="ap-title">Предложения о сотрудничестве</h1>
        <p class="ap-lede">
          ESP приглашает проектные организации и региональных представителей к расширению дилерской сети оборудования для очистки сточных вод.
        </p>

        <div class="ap-grid ap-grid--2">
          <div class="ap-card co-card">
            <ApIcon name="pencil" class="ap-ico" />
            <h2 class="ap-h3">Проектным организациям и архитектурным бюро</h2>
            <p class="ap-text">
              Приглашаем к сотрудничеству коллег из проектных организаций и архитектурных бюро. Сотрудничая с нами, вы можете быть уверены в многократно проверенных практикой технологиях и оборудовании.
            </p>
            <ul class="co-list">
              <li>Выполнение отдельных разделов проекта</li>
              <li>Подготовка технических предложений по нашей линейке оборудования</li>
              <li>Инженерное сопровождение на стадии проектирования и экспертизы</li>
              <li>Сбор исходных данных и выполнение технических условий заказчика</li>
              <li>Передача готовых разделов проекта — комплектов чертежей и пояснительных записок</li>
            </ul>
            <div class="ap-card-foot">
              <NuxtLink to="/about/documentation" class="ap-link co-wrap">Технические характеристики оборудования (ДС, ВС, ОРЛ, насосные станции, жироуловители) ›</NuxtLink>
            </div>
          </div>

          <div class="ap-card co-card">
            <ApIcon name="users" class="ap-ico" />
            <h2 class="ap-h3">Дилерам и региональным представителям</h2>
            <p class="ap-text">
              Ищем представителей в регионах Беларуси, а также готовых представлять интересы ESP в других странах.
            </p>
            <ul class="co-list">
              <li>Широкий ассортимент оборудования</li>
              <li>Выгодные условия сотрудничества</li>
              <li>Возможность рассрочки платежа</li>
              <li>Полная информационная и гарантийная поддержка</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap co-split">
        <div>
          <h2 class="ap-h2">Как начать сотрудничество</h2>
          <p class="ap-lede">
            Для получения дилерского прайс-листа отправьте запрос через форму или контакты, указав краткую информацию о вашей компании.
          </p>
          <div class="co-contacts">
            <a href="tel:+375291656061" class="co-contact co-tel">
              <ApIcon name="phone" class="co-ci" /> +375 29 165-60-61
            </a>
            <div class="co-contact">
              <ApIcon name="pin" class="co-ci" /> 220076, г. Минск, ул. Петра Мстиславца, д. 20, офис 236
            </div>
          </div>
        </div>

        <div>
          <div v-if="sent" class="ap-note-ok">
            Заявка отправлена. Мы свяжемся с вами в ближайшее время.
          </div>
          <form v-else class="ap-form" @submit.prevent="sent = true">
            <div class="ap-form-row">
              <input required placeholder="Ваше имя" aria-label="Ваше имя" class="ap-input" />
              <input required placeholder="Компания" aria-label="Компания" class="ap-input" />
            </div>
            <input required type="email" placeholder="E-mail" aria-label="E-mail" class="ap-input" />
            <select v-model="cooperationType" class="ap-input" aria-label="Тип сотрудничества">
              <option value="dealer">Дилерство / региональное представительство</option>
              <option value="project">Проектная организация</option>
              <option value="other">Другое</option>
            </select>
            <textarea rows="3" placeholder="Кратко о компании" aria-label="Кратко о компании" class="ap-input"></textarea>
            <button type="submit" class="ap-btn ap-btn--block">Отправить заявку</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sent = ref(false)
const cooperationType = ref('dealer')

useHead({
  title: 'Предложения о сотрудничестве | ESP',
  meta: [
    { name: 'description', content: 'ESP приглашает проектные организации и дилеров к сотрудничеству по всей Беларуси и за рубежом.' }
  ]
})
</script>

<style scoped>
.co-eyebrow { margin-top: 1.5rem; }
.co-card { padding: clamp(1.75rem, 3vw, 2.5rem); }
.co-list { display: grid; gap: 0.6rem; margin: 0.5rem 0 0; padding: 0; list-style: none; font-size: 15px; line-height: 1.45; color: var(--ap-ink); }
.co-list li { position: relative; padding-left: 1.4rem; }
.co-list li::before { content: ''; position: absolute; left: 0.2rem; top: 0.38em; width: 0.45rem; height: 0.75rem; border: solid var(--ap-blue); border-width: 0 2px 2px 0; transform: rotate(45deg); }
.co-wrap { white-space: normal; }
.co-split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); align-items: start; }
.co-contacts { display: grid; gap: 0.8rem; margin-top: 1.75rem; font-size: 15px; }
.co-contact { display: flex; align-items: center; gap: 0.7rem; color: var(--ap-ink); }
.co-tel:hover { color: var(--ap-link); }
.co-contact :deep(.co-ci) { width: 18px; height: 18px; flex-shrink: 0; color: var(--ap-blue); }
@media (max-width: 1023px) { .co-split { grid-template-columns: 1fr; } }
</style>
