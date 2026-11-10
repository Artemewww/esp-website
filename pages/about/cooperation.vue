<template>
  <div ref="root" class="co">
    <div class="dj-wrap co-crumb"><Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Предложения о сотрудничестве' }]" /></div>
    <DjPageHero
      eyebrow="Развитие сети"
      title="Предложения о сотрудничестве"
      lede="ESP приглашает проектные организации и региональных представителей к расширению дилерской сети оборудования для очистки сточных вод."
    >
      <a href="#co-form" class="dj-btn dj-btn--lg">Отправить заявку</a>
    </DjPageHero>

    <section class="co-sec">
      <div class="dj-wrap co-grid">
        <article class="co-card dj-reveal">
          <ApIcon name="pencil" class="co-ico" />
          <h2 class="co-h">Проектным организациям и архитектурным бюро</h2>
          <p class="co-text">
            Приглашаем к сотрудничеству коллег из проектных организаций и архитектурных бюро. Сотрудничая с нами, вы можете быть уверены в многократно проверенных практикой технологиях и оборудовании.
          </p>
          <ul class="co-list">
            <li>Выполнение отдельных разделов проекта</li>
            <li>Подготовка технических предложений по нашей линейке оборудования</li>
            <li>Инженерное сопровождение на стадии проектирования и экспертизы</li>
            <li>Сбор исходных данных и выполнение технических условий заказчика</li>
            <li>Передача готовых разделов проекта — комплектов чертежей и пояснительных записок</li>
          </ul>
          <NuxtLink to="/about/documentation" class="dj-more co-more">Технические характеристики оборудования (ДС, ВС, ОРЛ, насосные станции, жироуловители)</NuxtLink>
        </article>

        <article class="co-card dj-reveal">
          <ApIcon name="users" class="co-ico" />
          <h2 class="co-h">Дилерам и региональным представителям</h2>
          <p class="co-text">
            Ищем представителей в регионах Беларуси, а также готовых представлять интересы ESP в других странах.
          </p>
          <ul class="co-list">
            <li>Широкий ассортимент оборудования</li>
            <li>Выгодные условия сотрудничества</li>
            <li>Возможность рассрочки платежа</li>
            <li>Полная информационная и гарантийная поддержка</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="co-form" class="dj-sec dj-sec--soft">
      <div class="dj-wrap co-split">
        <div class="dj-reveal">
          <h2 class="dj-h2">Как начать сотрудничество</h2>
          <p class="dj-lede co-lede">
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

        <div class="dj-reveal">
          <p v-if="sent" class="co-ok" role="status">
            Заявка отправлена. Мы свяжемся с вами в ближайшее время.
          </p>
          <form v-else class="co-form" @submit.prevent="sent = true">
            <div class="co-row">
              <input required placeholder="Ваше имя" aria-label="Ваше имя" autocomplete="name" class="co-input" />
              <input required placeholder="Компания" aria-label="Компания" autocomplete="organization" class="co-input" />
            </div>
            <input required type="email" placeholder="E-mail" aria-label="E-mail" autocomplete="email" class="co-input" />
            <select v-model="cooperationType" class="co-input" aria-label="Тип сотрудничества">
              <option value="dealer">Дилерство / региональное представительство</option>
              <option value="project">Проектная организация</option>
              <option value="other">Другое</option>
            </select>
            <textarea rows="3" placeholder="Кратко о компании" aria-label="Кратко о компании" class="co-input"></textarea>
            <button type="submit" class="dj-btn dj-btn--lg co-submit">Отправить заявку</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReveal } from '~/composables/useReveal'

const sent = ref(false)
const cooperationType = ref('dealer')
const root = ref(null)
useReveal(root)

useHead({
  title: 'Предложения о сотрудничестве | ESP',
  meta: [
    { name: 'description', content: 'ESP приглашает проектные организации и дилеров к сотрудничеству по всей Беларуси и за рубежом.' }
  ]
})
</script>

<style scoped>
.co-crumb { padding-top: 20px; }
.co-sec { padding: clamp(24px, 4vw, 48px) 0 clamp(64px, 8vw, 104px); }
.co-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.co-card { display: flex; flex-direction: column; padding: clamp(28px, 4vw, 48px); background: var(--dj-soft); }
.co-card :deep(.co-ico) { width: 32px; height: 32px; color: var(--dj-blue); }
.co-h { margin-top: 20px; font-size: clamp(22px, 2.2vw, 28px); line-height: 1.2; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); }
.co-text { margin-top: 12px; font-size: 16px; line-height: 1.6; color: var(--dj-text); }
.co-list { display: grid; gap: 10px; margin: 20px 0 0; padding: 0; list-style: none; font-size: 15px; line-height: 1.45; color: var(--dj-ink); }
.co-list li { position: relative; padding-left: 24px; }
.co-list li::before { content: ''; position: absolute; left: 4px; top: 0.3em; width: 6px; height: 11px; border: solid var(--dj-blue); border-width: 0 2px 2px 0; transform: rotate(45deg); }
.co-more { margin-top: auto; padding-top: 24px; white-space: normal; }
.co-split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.co-lede { margin-top: 16px; }
.co-contacts { display: grid; gap: 12px; margin-top: 28px; font-size: 15px; }
.co-contact { display: flex; align-items: center; gap: 10px; color: var(--dj-ink); }
.co-tel:hover { color: var(--dj-link); }
.co-contact :deep(.co-ci) { width: 18px; height: 18px; flex-shrink: 0; color: var(--dj-blue); }
.co-form { display: grid; gap: 14px; padding: clamp(24px, 4vw, 40px); background: #fff; box-shadow: 0 0 0 1px var(--dj-line), 0 24px 60px -32px rgba(0, 0, 0, 0.18); }
.co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.co-input { width: 100%; padding: 13px 14px; border: 1px solid #d2d5d9; border-radius: 0; background: #fff; font: inherit; font-size: 15px; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.co-input:focus { outline: none; border-color: var(--dj-ink); box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1); }
.co-submit { width: 100%; }
.co-ok { margin: 0; padding: 16px 18px; background: #ecf6ef; color: #135c2e; font-size: 15px; }
@media (max-width: 1023px) { .co-split { grid-template-columns: 1fr; } }
@media (max-width: 767px) { .co-grid, .co-row { grid-template-columns: 1fr; } }
</style>
