<template>
  <!-- Блок СТБ в подаче Terminal «The Solution»: метка, огромный заголовок по
       центру, слева липкий текст, справа столбик карточек с уступом и иконкой. -->
  <section class="lb" aria-labelledby="lb-title">
    <div class="lb-inner">
      <span class="lb-label t-label">Стандарт качества</span>
      <h2 id="lb-title" class="lb-title t-h2">
        Система бережливого менеджмента по&nbsp;СТБ&nbsp;2672‑2025
      </h2>

      <div class="lb-grid">
        <div class="lb-aside">
          <p v-reveal-words class="lb-lead">
            Мы придерживаемся принципов бережливого производства и непрерывного
            совершенствования. Это значит: минимум потерь, максимум ценности для
            заказчика и абсолютная прозрачность на каждом этапе — от проектирования
            до эксплуатации.
          </p>
          <ul class="lb-chips">
            <li class="t-label">#кайдзен</li>
            <li class="t-label">#5S</li>
            <li class="t-label">#TQM</li>
            <li class="t-label">#JIT</li>
          </ul>
        </div>

        <div class="lb-cards">
          <article v-for="c in cards" :key="c.title" class="lb-card t-notch">
            <span class="lb-dot" aria-hidden="true"></span>
            <div class="lb-icon"><TerminalWireIcon :shape="c.shape" /></div>
            <h3 class="lb-card-title">{{ c.title }}</h3>
            <p class="lb-card-text">{{ c.text }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Тексты принципов — прежние, согласованные; меняется только подача
const cards = [
  { shape: 'lattice', title: 'Устранение потерь', text: 'Исключаем перепроизводство, ожидания и лишние перемещения в каждом процессе.' },
  { shape: 'globe', title: 'Фокус на людях', text: 'Развиваем компетенции сотрудников и создаём культуру постоянного улучшения.' },
  { shape: 'ico', title: 'Встроенное качество', text: 'Качество закладываем на каждом этапе, а не исправляем в конце. Контроль без компромиссов.' },
  { shape: 'torus', title: 'Непрерывное улучшение', text: 'Постоянно совершенствуем процессы на основе данных, обратной связи и анализа.' }
]
</script>

<style scoped>
.lb {
  background: #fff;
  padding: clamp(5rem, 10vw, 9rem) 0 clamp(5rem, 9vw, 8rem);
}
.lb-inner { max-width: 90rem; margin: 0 auto; padding: 0 1.5rem; }
.lb-label { display: block; text-align: center; text-transform: none; letter-spacing: 0.02em; font-size: 13px; font-weight: 400; }
.lb-title { margin: 1.1rem auto 0; max-width: 16ch; text-align: center; }
.lb-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 6vw, 6rem);
  margin-top: clamp(4rem, 9vw, 8rem);
  align-items: start;
}
.lb-aside { position: sticky; top: 7rem; }
.lb-lead {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.1vw, 1.9rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--t-ink);
}
.lb-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; list-style: none; padding: 0; }
.lb-chips li {
  padding: 0.55rem 0.85rem;
  border-radius: 4px;
  border: 1px solid var(--t-line);
  color: var(--t-ink);
}
.lb-cards { display: grid; gap: 1.5rem; }
.lb-card {
  --notch-bg: #fff;
  --notch-w: 46%;
  padding: clamp(2.5rem, 4.5vw, 4rem) clamp(1.5rem, 4.8vw, 4.4rem) clamp(2rem, 4vw, 3.4rem);
}
/* Точка-огонёк на изломе кромки, как подсветка у Terminal, но без свечения */
.lb-dot {
  position: absolute;
  top: 12px;
  left: calc(var(--notch-w) - 3px);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--t-glow);
}
.lb-icon { width: clamp(9rem, 14vw, 12rem); height: clamp(9rem, 14vw, 12rem); margin-bottom: 1.6rem; }
.lb-card-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 2.1vw, 1.9rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--t-ink);
}
.lb-card-text { margin-top: 0.75rem; font-size: 0.95rem; line-height: 1.55; color: rgba(7, 26, 58, 0.7); max-width: 32rem; }
@media (max-width: 1023px) {
  .lb-grid { grid-template-columns: 1fr; }
  .lb-aside { position: static; }
}
</style>
