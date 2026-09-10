<template>
  <div class="adm-page">
    <!-- Пока не вошли — на экране только форма входа. -->
    <AdminLogin v-if="!state?.authed" :state="state" @done="refresh" />

    <template v-else>
      <AdminBar title="Редактирование сайта" :local="state.local" @logout="logout" />

      <main class="adm-main">
        <p class="adm-lede">
          Выберите блок, который нужно поправить. Изменения появляются на сайте
          сразу после сохранения — пересобирать ничего не нужно.
        </p>

        <section v-for="group in groups" :key="group.name" class="adm-group">
          <h2 class="adm-group-title">{{ group.name }}</h2>
          <div class="adm-grid">
            <NuxtLink
              v-for="s in group.items"
              :key="s.key"
              :to="`/admin/${s.key}`"
              class="adm-card"
            >
              <span class="adm-card-title">{{ s.title }}</span>
              <span class="adm-card-sub">{{ s.subtitle }}</span>
              <span class="adm-card-where">{{ s.where }}</span>
              <span class="adm-card-foot">
                <span class="adm-count">{{ s.count }} {{ plural(s.count) }}</span>
                <span v-if="s.edited" class="adm-badge">изменено</span>
              </span>
            </NuxtLink>
          </div>
        </section>
      </main>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
useHead({ title: 'Редактирование сайта — ESP' })
// Админку не должно быть в поиске ни при каких условиях.
useSeoMeta({ robots: 'noindex, nofollow' })

const { data: state, refresh: refreshState } = await useFetch('/api/admin/session')

// Именно useFetch, а не useAsyncData + $fetch: на сервере только он передаёт
// куку сессии дальше, иначе ручка отвечает 401 при первой отрисовке.
const { data: list, refresh: refreshList } = await useFetch('/api/admin/sections', {
  default: () => []
})

const refresh = async () => { await refreshState(); await refreshList() }

const groups = computed(() => {
  const out = []
  for (const s of list.value || []) {
    let g = out.find((x) => x.name === s.group)
    if (!g) { g = { name: s.group, items: [] }; out.push(g) }
    g.items.push(s)
  }
  return out
})

const plural = (n) => {
  const t = n % 10, h = n % 100
  if (t === 1 && h !== 11) return 'запись'
  if (t >= 2 && t <= 4 && (h < 12 || h > 14)) return 'записи'
  return 'записей'
}

const logout = async () => {
  await $fetch('/api/admin/session', { method: 'DELETE' })
  await refresh()
}
</script>

<style scoped>
.adm-page { min-height: 100vh; }
.adm-main { max-width: 1080px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
.adm-lede { color: var(--adm-muted); font-size: 0.95rem; margin: 0 0 2rem; max-width: 46rem; line-height: 1.6; }

.adm-group { margin-bottom: 2.5rem; }
.adm-group-title {
  font-size: 0.75rem; letter-spacing: 0.09em; text-transform: uppercase;
  color: var(--adm-muted); margin: 0 0 0.85rem; font-weight: 600;
}
.adm-grid { display: grid; gap: 0.85rem; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

.adm-card {
  display: flex; flex-direction: column; gap: 0.3rem;
  padding: 1.1rem 1.2rem 1rem;
  background: var(--adm-card); border: 1px solid var(--adm-line);
  border-radius: 10px; text-decoration: none; color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.adm-card:hover {
  border-color: var(--adm-blue);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 35, 102, 0.08);
}
.adm-card-title { font-weight: 600; font-size: 1rem; }
.adm-card-sub { font-size: 0.85rem; color: var(--adm-muted); }
.adm-card-where { font-size: 0.78rem; color: #9aa1ac; margin-top: 0.15rem; }
.adm-card-foot { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.7rem; }
.adm-count { font-size: 0.78rem; color: var(--adm-blue); font-weight: 600; }
.adm-badge {
  font-size: 0.68rem; letter-spacing: 0.04em; text-transform: uppercase;
  background: rgba(0, 35, 102, 0.08); color: var(--adm-blue);
  padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600;
}
</style>
