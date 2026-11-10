<template>
  <div v-if="article" class="ar">
    <article>
      <header class="ar-head dj-wrap">
        <div class="ar-col">
          <Breadcrumb :items="[{ label: 'Ресурсы', to: '/resources' }, { label: article.title }]" />
          <p class="ar-kicker">
            <span class="ar-cat">{{ article.category }}</span>
            <time :datetime="article.date" class="ar-date">{{ article.date }}</time>
          </p>
          <h1 class="ar-title">{{ article.title }}</h1>
          <p v-if="article.excerpt" class="ar-lede">{{ article.excerpt }}</p>
          <div class="ar-meta">
            <span>
              <NuxtLink :to="`/team/${article.authorSlug}`" class="ar-author">{{ article.authorName }}</NuxtLink>
              <span aria-hidden="true"> · </span>
              <span>{{ article.readTime }}</span>
            </span>
            <button type="button" class="ar-share" @click="share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3m0 0L8 7m4-4l4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
              {{ copied ? 'Ссылка скопирована' : 'Поделиться' }}
            </button>
          </div>
        </div>
      </header>

      <div class="ar-hero">
        <img v-if="article.image" :src="article.image" :alt="article.title" />
        <span v-else class="ar-hero__ph">ESP_BIM_MODEL_INTEGRATION</span>
      </div>

      <div class="ar-body dj-wrap">
        <div class="ar-col">
          <section v-for="sec in article.sections" :key="sec.id" :id="sec.id" class="ar-sec">
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
          </section>

          <!-- Автор -->
          <div class="ar-author-card">
            <div class="ar-avatar">{{ article.authorName.split(' ').map(w => w[0]).join('') }}</div>
            <div>
              <h4 class="ar-author-name">{{ article.authorName }}</h4>
              <p class="ar-small">{{ article.authorRole }}</p>
              <NuxtLink :to="`/team/${article.authorSlug}`" class="dj-more ar-more">Читать все статьи</NuxtLink>
            </div>
          </div>

          <!-- Упомянутый проект -->
          <NuxtLink v-if="relatedProject" :to="`/projects/${relatedProject.slug}`" class="ar-related">
            <span class="ar-small">Упомянутый проект</span>
            <h5 class="ar-related__title">{{ relatedProject.name }}</h5>
            <span class="dj-more">Открыть кейс</span>
          </NuxtLink>

          <div class="ar-foot">
            <NuxtLink to="/resources" class="ar-back">‹ Все материалы в разделе «Ресурсы»</NuxtLink>
            <button type="button" class="ar-share" @click="share">{{ copied ? 'Ссылка скопирована' : 'Поделиться' }}</button>
          </div>
        </div>
      </div>
    </article>

    <!-- Другие истории, как ряд «More from Newsroom» -->
    <section v-if="related.length" class="ar-more-sec">
      <div class="dj-wrap">
        <h2 class="ar-more-h">Ещё от ESP</h2>
        <div class="ar-grid">
          <NuxtLink v-for="r in related" :key="r.to" :to="r.to" class="ar-card">
            <div class="ar-card__media">
              <img v-if="r.image" :src="r.image" :alt="r.title" loading="lazy" />
            </div>
            <div class="ar-card__desc">
              <span class="ar-card__cat">{{ r.cat }}</span>
              <h3 class="ar-card__title">{{ r.title }}</h3>
              <time class="ar-card__date">{{ r.date }}</time>
            </div>
          </NuxtLink>
        </div>
        <div class="dj-links ar-links"><NuxtLink to="/about/news" class="dj-more">Все новости</NuxtLink></div>
      </div>
    </section>
  </div>
  <div v-else class="ar ar-none">
    <div class="dj-wrap dj-center">
      <p class="dj-lede">Статья не найдена.</p>
      <div class="dj-links"><NuxtLink to="/resources" class="dj-more">Вернуться в ресурсы</NuxtLink></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { articlesList } from '~/composables/useArticles'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const articles = useEditableList('articles', articlesList)
const article = computed(() => articles.value.find(a => a.slug === route.params.slug))
const relatedProject = computed(() => {
  if (!article.value?.relatedProjectSlug) return null
  return projectsList.find(p => p.slug === article.value.relatedProjectSlug)
})

// Ряд «Ещё от ESP»: другие статьи блога и свежие новости компании
const { news } = useNews()
const related = computed(() => {
  const other = articles.value.filter(a => a.slug !== route.params.slug).map(a => ({
    to: `/articles/${a.slug}`, title: a.title, cat: a.category, date: a.date, image: a.image
  }))
  const fresh = [...(news.value || [])]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .map(n => ({ to: `/about/news?news=${n.date}`, title: n.title, cat: n.category || 'Новости', date: n.dateLabel, image: n.image }))
  return [...other, ...fresh].slice(0, 3)
})

const copied = ref(false)
const share = async () => {
  const url = window.location.href
  try {
    if (navigator.share) { await navigator.share({ title: article.value?.title, url }); return }
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) { /* пользователь закрыл окно «Поделиться» */ }
}

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
/* Статья Apple Newsroom: колонка 692px, категория капсом 12/700, дата 14/600,
   заголовок 48/52 700, подзаголовок 24/28, кадр 980px, текст 17/25 */
.ar { background: #fff; }
.ar-col { max-width: 692px; margin: 0 auto; }
.ar-head { padding-top: clamp(24px, 4vw, 48px); }
.ar-kicker { display: flex; flex-direction: column; gap: 4px; margin-top: clamp(32px, 5vw, 56px); }
.ar-cat { font-size: 12px; line-height: 1.33; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: #6e6e73; }
.ar-date { font-size: 14px; line-height: 1.29; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; }
.ar-title { margin-top: 16px; font-size: clamp(32px, 4.2vw, 48px); line-height: 1.08; font-weight: 700; letter-spacing: -0.003em; color: var(--dj-ink); text-wrap: balance; overflow-wrap: break-word; }
.ar-lede { margin-top: 20px; font-size: clamp(21px, 2vw, 24px); line-height: 1.167; font-weight: 500; letter-spacing: 0.009em; color: var(--dj-ink); text-wrap: pretty; }
.ar-meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; margin-top: 32px; font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.ar-author { color: var(--dj-ink); font-weight: 600; }
.ar-author:hover { color: #0066cc; }
.ar-share { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: 999px; background: #f5f5f7; font-size: 14px; font-weight: 400; letter-spacing: -0.016em; color: var(--dj-ink); transition: background-color .2s ease; }
.ar-share svg { width: 16px; height: 16px; }
.ar-share:hover { background: #e8e8ed; }

.ar-hero { display: grid; place-items: center; max-width: 980px; margin: clamp(32px, 5vw, 48px) auto 0; aspect-ratio: 16 / 9; overflow: hidden; background: linear-gradient(135deg, #002366 0%, #2f6fb8 100%); animation: ar-in 1.2s var(--dj-ease) both; }
.ar-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ar-hero__ph { color: rgba(255, 255, 255, .5); font-size: 13px; letter-spacing: .08em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
@keyframes ar-in { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: none; } }

.ar-body { padding-top: clamp(40px, 5vw, 56px); padding-bottom: clamp(64px, 8vw, 96px); }
.ar-sec { scroll-margin-top: 100px; }
.ar-sec + .ar-sec { margin-top: 44px; }
.ar-h2 { margin-bottom: 14px; font-size: clamp(24px, 2.3vw, 28px); line-height: 1.14; font-weight: 700; letter-spacing: 0.007em; color: var(--dj-ink); }
.ar-p { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); }
.ar-p + .ar-p { margin-top: 1.47em; }
.ar-quote { margin: 40px 0; font-size: clamp(24px, 2.3vw, 28px); line-height: 1.21; font-weight: 600; letter-spacing: 0.007em; color: var(--dj-ink); }
.ar-quote::before { content: '“'; display: block; font-size: 64px; line-height: .8; color: #86868b; }
.ar-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 32px 0 0; padding: 0; list-style: none; }
.ar-stats li { display: grid; gap: 6px; padding: 28px; border-radius: 18px; background: #f5f5f7; }
.ar-stats b { font-size: clamp(32px, 3.4vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.003em; color: var(--dj-ink); }
.ar-stats span { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.ar-table { margin-top: 32px; overflow-x: auto; border-radius: 18px; background: #f5f5f7; }
.ar-table table { width: 100%; border-collapse: collapse; font-size: 14px; letter-spacing: -0.016em; }
.ar-table th { padding: 14px 20px; text-align: left; font-weight: 600; color: var(--dj-ink); }
.ar-table td { padding: 14px 20px; border-top: 1px solid #d2d2d7; color: #6e6e73; }
.ar-table td.is-val { color: var(--dj-ink); font-weight: 600; }

.ar-small { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #6e6e73; }
.ar-author-card { display: flex; align-items: center; gap: 16px; margin-top: 64px; padding: 24px 28px; border-radius: 18px; background: #f5f5f7; }
.ar-avatar { flex-shrink: 0; width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; background: var(--dj-blue); color: #fff; font-weight: 600; }
.ar-author-name { font-weight: 600; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); }
.ar-more { margin-top: 6px; }
.ar-related { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; padding: 24px 28px; border-radius: 18px; background: #f5f5f7; transition: background-color .25s ease; }
.ar-related:hover { background: #ededf0; }
.ar-related__title { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); }
.ar-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #d2d2d7; }
.ar-back { font-size: 17px; letter-spacing: -0.022em; color: #0066cc; }
.ar-back:hover { text-decoration: underline; }

/* «Ещё от ESP» — плитки Newsroom на сером поле */
.ar-more-sec { padding: 52px 0 80px; background: #f5f5f7; }
.ar-more-sec .dj-wrap { max-width: 980px; padding: 0 22px; box-sizing: content-box; }
.ar-more-h { font-size: 32px; line-height: 1.125; font-weight: 700; letter-spacing: 0.004em; color: var(--dj-ink); }
.ar-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 32px; }
.ar-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 28px; background: #fff; transform: translateZ(0); transition: box-shadow .3s ease; }
.ar-card:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, .16); }
.ar-card__media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--dj-blue); }
.ar-card__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s var(--dj-ease); }
.ar-card:hover img { transform: scale(1.03); }
.ar-card__desc { display: flex; flex: 1; flex-direction: column; gap: 8px; padding: 24px 24px 28px; }
.ar-card__cat { font-size: 12px; line-height: 1.33; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: #6e6e73; }
.ar-card__title { font-size: 21px; line-height: 1.19; font-weight: 700; letter-spacing: 0.011em; color: var(--dj-ink); }
.ar-card__date { margin-top: auto; padding-top: 10px; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; }
.ar-links { justify-content: flex-start; margin-top: 28px; }
.ar-none { padding: clamp(80px, 12vw, 160px) 0; }

@media (max-width: 1068px) { .ar-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 734px) {
  .ar-more-sec { padding: 40px 0 64px; }
  .ar-more-sec .dj-wrap { padding: 0 16px; box-sizing: border-box; max-width: none; }
  .ar-more-h { font-size: 28px; }
  .ar-grid { grid-template-columns: 1fr; gap: 20px; }
  .ar-card { border-radius: 18px; }
  .ar-stats { grid-template-columns: 1fr; }
  .ar-stats li { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) { .ar-hero { animation: none; } .ar-card__media img { transition: none; } }
</style>
