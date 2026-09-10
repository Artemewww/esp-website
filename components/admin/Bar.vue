<template>
  <header class="bar">
    <div class="bar-in">
      <NuxtLink to="/admin" class="bar-mark" aria-label="К списку блоков">ESP</NuxtLink>

      <div class="bar-titles">
        <h1 class="bar-title">{{ title }}</h1>
        <p v-if="subtitle" class="bar-sub">{{ subtitle }}</p>
      </div>

      <div class="bar-right">
        <!-- Локально правки лежат на машине разработчика и на боевой сайт не
             попадают: человек должен видеть это до того, как что-то поправит.
             На обычном сервере файловый режим боевой, и плашка не нужна. -->
        <span v-if="local" class="bar-mode" title="Правки сохраняются на этом компьютере и на сайт не попадают">
          локальный режим
        </span>
        <slot name="actions" />
        <button type="button" class="bar-exit" @click="$emit('logout')">Выйти</button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  local: { type: Boolean, default: false }
})
defineEmits(['logout'])
</script>

<style scoped>
.bar { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid var(--adm-line); }
.bar-in {
  max-width: 1080px; margin: 0 auto; padding: 0.85rem 1.25rem;
  display: flex; align-items: center; gap: 1rem;
}
.bar-mark {
  width: 34px; height: 34px; flex: none; display: grid; place-items: center;
  background: var(--adm-blue); color: #fff; border-radius: 7px;
  font-weight: 700; font-size: 0.72rem; text-decoration: none; letter-spacing: 0.04em;
}
.bar-titles { min-width: 0; margin-right: auto; }
.bar-title { margin: 0; font-size: 1.02rem; font-weight: 650; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-sub { margin: 0.1rem 0 0; font-size: 0.8rem; color: var(--adm-muted); }

.bar-right { display: flex; align-items: center; gap: 0.6rem; flex: none; }
.bar-mode {
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em;
  background: #fef3c7; color: #92400e; padding: 0.22rem 0.45rem; border-radius: 5px; font-weight: 600;
}
.bar-exit {
  border: 1px solid var(--adm-line); background: #fff; border-radius: 7px;
  padding: 0.42rem 0.75rem; font-size: 0.85rem; cursor: pointer; color: var(--adm-muted);
  font-family: inherit;
}
.bar-exit:hover { color: var(--adm-ink); border-color: #cbd2dc; }
</style>
