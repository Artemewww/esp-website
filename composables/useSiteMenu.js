// Структура меню шапки — по правкам заказчика от 25.09.2026
// («Правки 25.09.docx»): шесть разделов вместо восьми.
// Один список на десктопное и мобильное меню.
export const navMenu = [
  {
    id: 'about',
    title: 'О компании',
    to: '/about',
    match: ['/about'],
    items: [
      { to: '/about#history', label: 'Наша история' },
      { to: '/about#ecosystem', label: 'Проектирование и производство' },
      { to: '/about/gallery', label: 'Видео и фото о нас' }
    ]
  },
  {
    id: 'catalog',
    title: 'Каталог',
    to: '/equipment',
    match: ['/equipment', '/services', '/technologies'],
    items: [
      { to: '/equipment', label: 'Оборудование' },
      { to: '/services', label: 'Услуги' },
      { to: '/technologies', label: 'Технологии' }
    ]
  },
  {
    id: 'projects',
    title: 'Наши проекты',
    to: '/projects',
    match: ['/projects'],
    items: [
      { to: '/projects#cases', label: 'Все проекты', hint: 'С фильтром по отраслям' },
      { to: '/projects#map', label: 'Карта проектов' }
    ]
  },
  {
    id: 'news',
    title: 'Новости',
    to: '/about/news',
    match: ['/about/news', '/resources', '/webinars', '/articles'],
    items: [
      { to: '/resources', label: 'Полезная информация' },
      { to: '/webinars', label: 'Вебинары и события' },
      { to: '/resources#faq', label: 'Ответы на частые вопросы' }
    ]
  },
  {
    id: 'team',
    title: 'Команда',
    to: '/team',
    match: ['/team', '/career'],
    items: [
      { to: '/team#experts', label: 'Наши эксперты' },
      { to: '/team#culture', label: 'Культура «Мы»' },
      { to: '/career', label: 'Работа в ESP' },
      { to: '/team#internship', label: 'Стажировки' }
    ]
  },
  {
    id: 'contacts',
    title: 'Контакты',
    to: '/contacts',
    match: ['/contacts'],
    items: [
      { to: '/contacts', label: 'Контакты' },
      { to: '/contacts#schedule', label: 'График работы' },
      { to: '/contacts#requisites', label: 'Реквизиты' },
      { to: '/contacts#map-office', label: 'Как к нам проехать: офис' },
      { to: '/contacts#map-production', label: 'Как к нам проехать: производство' }
    ]
  }
]

// Первая, укороченная версия сайта (договорённость с заказчиком 26.09.2026):
// публикуем только разделы из меню выше. Страницы ниже остаются в коде и
// вернутся во второй версии — достаточно убрать их из списка.
// Полная версия сайта целиком сохранена в ветке site-full-version.
// Ключ — скрытый путь (и всё под ним), значение — куда вести посетителя.
export const V1_HIDDEN = {
  '/about/certifications': '/about',
  '/about/cooperation': '/about',
  '/about/documentation': '/about',
  '/about/partners': '/about',
  '/about/reviews': '/about',
  '/partners': '/about',
  '/equipment/compare': '/equipment'
}

export const v1Redirect = (path) => {
  const clean = path.replace(/\/+$/, '') || '/'
  const hit = Object.keys(V1_HIDDEN).find((p) => clean === p || clean.startsWith(p + '/'))
  return hit ? V1_HIDDEN[hit] : null
}

export const isV1Hidden = (path) => v1Redirect(path) !== null
