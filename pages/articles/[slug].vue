<template>
  <div v-if="article" class="ap">
    <section class="ap-sec ap-sec--first ar-top">
      <div class="ap-wrap ar-col">
        <Breadcrumb :items="[{ label: 'Ресурсы', to: '/resources' }, { label: article.title }]" />
        <span class="ap-eyebrow ar-eyebrow">{{ article.category }}</span>
        <h1 class="ap-title ar-title">{{ article.title }}</h1>
        <p class="ar-meta">
          <NuxtLink :to="`/team/${article.authorSlug}`" class="ar-author">{{ article.authorName }}</NuxtLink>
          <span aria-hidden="true">·</span>
          <span>{{ article.date }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ article.readTime }}</span>
        </p>
      </div>
      <div class="ap-wrap ar-wide">
        <div class="ar-hero">
          <img v-if="article.image" :src="article.image" :alt="article.title" />
          <span v-else>ESP_BIM_MODEL_INTEGRATION</span>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white ar-body">
      <div class="ap-wrap ar-col">
        <div v-for="sec in article.sections" :key="sec.id" :id="sec.id" class="ar-sec">
          <h2 class="ar-h2">{{ sec.title }}</h2>
          <p v-for="(p, i) in sec.paragraphs" :key="i" class="ar-p">{{ p }}</p>

          <blockquote v-if="sec.quote" class="ar-quote">{{ sec.quote }}</blockquote>

          <ul v-if="sec.stats" class="ar-stats">
            <li v-for="(s, i) in sec.stats" :key="i">
              <b>{{ s.value }}</b>
              <span>{{ s.label }}</span>
            </li>
          </ul>

          <div v-if="sec.table" class="ar-table">
            <table>
              <thead>
                <tr>
                  <th v-for="h in sec.table.headers" :key="h">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in sec.table.rows" :key="ri">
                  <td v-for="(cell, ci) in row" :key="ci" :class="{ 'is-val': ci > 0 }">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Author card -->
        <div class="ar-author-card">
          <div class="ar-avatar">{{ article.authorName.split(' ').map(w => w[0]).join('') }}</div>
          <div>
            <h4 class="ar-author-name">{{ article.authorName }}</h4>
            <p class="ap-small">{{ article.authorRole }}</p>
            <NuxtLink :to="`/team/${article.authorSlug}`" class="ap-link">Читать все статьи ›</NuxtLink>
          </div>
        </div>

        <!-- Related project -->
        <NuxtLink v-if="relatedProject" :to="`/projects/${relatedProject.slug}`" class="ap-card ar-related">
          <span class="ap-small">Упомянутый проект</span>
          <h5 class="ap-h3">{{ relatedProject.name }}</h5>
          <span class="ap-link">Открыть кейс ›</span>
        </NuxtLink>
      </div>
    </section>
  </div>
  <div v-else class="ap">
    <section class="ap-sec ap-sec--first ap-center">
      <div class="ap-wrap">
        <p class="ap-lede">Статья не найдена.</p>
        <div class="ap-actions"><NuxtLink to="/resources" class="ap-link">Вернуться в ресурсы ›</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { articlesList } from '~/composables/useArticles'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const articles = useEditableList('articles', articlesList)
const article = computed(() => articles.value.find(a => a.slug === route.params.slug))
const relatedProject = computed(() => {
  if (!article.value?.relatedProjectSlug) return null
  return projectsList.find(p => p.slug === article.value.relatedProjectSlug)
})

useHead(() => ({
  title: article.value ? `${article.value.title} | Техблог ESP` : 'Статья не найдена | ESP',
  meta: [
    { name: 'description', content: article.value?.excerpt || '' },
    { property: 'og:title', content: article.value?.title || '' },
    { property: 'og:description', content: article.value?.excerpt || '' },
    { property: 'article:published_time', content: article.value?.date || '' }
  ],
  link: [{ rel: 'canonical', href: article.value ? `https://ecoservisproekt.by/articles/${article.value.slug}` : '' }]
}))

useSchemaOrg([
  defineArticle(() => ({
    headline: article.value?.title,
    description: article.value?.excerpt,
    datePublished: article.value?.date,
    author: article.value?.authorName,
  })),
  defineBreadcrumb(() => ([
    { name: 'Ресурсы', item: '/resources' },
    { name: article.value?.title }
  ]))
])
</script>

<style scoped>
/* Колонка для чтения в подаче Apple Newsroom */
.ar-col { max-width: calc(44rem + 3rem); }
.ar-wide { max-width: calc(60rem + 3rem); }
.ar-eyebrow { margin-top: 1.75rem; }
.ar-title { font-size: clamp(2rem, 4.4vw, 3.25rem); }
.ar-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.6rem; margin-top: 1.25rem; font-size: 14px; color: #6e6e73; }
.ar-author { color: #1d1d1f; font-weight: 600; }
.ar-author:hover { color: #0b5cad; }
.ar-hero { display: grid; place-items: center; margin-top: 2.5rem; aspect-ratio: 21 / 9; border-radius: 22px; overflow: hidden; background: #002366; color: rgba(255, 255, 255, .4); font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.ar-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ar-top { padding-bottom: clamp(2.5rem, 5vw, 4rem); }

.ar-sec { scroll-margin-top: 100px; }
.ar-sec + .ar-sec { margin-top: 3rem; }
.ar-h2 { margin-bottom: 1rem; font-family: var(--font-sans); font-weight: 700; font-size: clamp(1.5rem, 2.6vw, 1.9rem); line-height: 1.2; letter-spacing: -0.02em; color: #1d1d1f; }
.ar-p { font-size: clamp(17px, 1.3vw, 19px); line-height: 1.6; color: #1d1d1f; }
.ar-p + .ar-p { margin-top: 1.1rem; }
.ar-quote { margin: 2rem 0; padding-left: 1.25rem; border-left: 3px solid #002366; font-size: clamp(1.2rem, 2vw, 1.45rem); line-height: 1.45; font-weight: 600; letter-spacing: -0.01em; color: #1d1d1f; }
.ar-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin: 2rem 0 0; padding: 1.75rem; list-style: none; border-radius: 18px; background: #f5f5f7; }
.ar-stats li { display: grid; gap: 0.25rem; }
.ar-stats b { font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700; letter-spacing: -0.02em; color: #002366; }
.ar-stats span { font-size: 13px; line-height: 1.4; color: #6e6e73; }
.ar-table { margin-top: 2rem; overflow-x: auto; border-radius: 18px; background: #f5f5f7; }
.ar-table table { width: 100%; border-collapse: collapse; font-size: 15px; }
.ar-table th { padding: 0.9rem 1.1rem; text-align: left; font-weight: 600; color: #1d1d1f; }
.ar-table td { padding: 0.9rem 1.1rem; border-top: 1px solid #d2d2d7; color: #6e6e73; }
.ar-table td.is-val { color: #1d1d1f; font-weight: 600; }

.ar-author-card { display: flex; align-items: center; gap: 1rem; margin-top: 4rem; padding: 1.5rem; border-radius: 18px; background: #f5f5f7; }
.ar-avatar { flex-shrink: 0; width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; background: #002366; color: #fff; font-weight: 700; }
.ar-author-name { font-weight: 600; font-size: 1.05rem; color: #1d1d1f; }
.ar-related { margin-top: 1.25rem; }
</style>
