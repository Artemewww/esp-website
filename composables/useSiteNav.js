// Единая карта сайта для шапки, мега-меню, мобильного меню и футера.
// Тексты пунктов — существующие названия разделов сайта.
import equipment from '~~/content/defaults/equipment.json'
import projects from '~~/content/defaults/projects.json'
import newsJson from '~~/content/defaults/news.json'

// Отрасли для раздела «Решения для бизнеса». Объекты и оборудование
// берутся из уже опубликованных данных, ничего нового не придумываем.
export const solutions = [
  {
    slug: 'vodokanaly',
    banner: '/images/solutions/cover/vodokanaly-wide.webp',
    title: 'Водоканалы и ЖКХ',
    short: 'Очистные сооружения городов и посёлков',
    lede: 'Строительство и реконструкция очистных сооружений городов, посёлков и агрогородков — от проекта до выхода на проектные показатели.',
    cover: '/images/solutions/cover/vodokanaly.webp',
    video: '/videos/hero/rechitsa_230926.mp4',
    categories: ['Коммунальное хозяйство'],
    equipment: ['bs-bio-station', 'kns-kvatro', 'microfilters-sand-traps', 'aeration-systems', 'filter-press', 'rotary-drum-sieve', 'sand-separator', 'ultrasonic-flowmeter']
  },
  {
    slug: 'agrokompleksy',
    banner: '/images/solutions/cover/agrokompleksy-wide.webp',
    title: 'Агрокомплексы',
    short: 'Птицефабрики, животноводство и переработка',
    lede: 'Станции биологической очистки для агрокомбинатов и птицефабрик, в том числе стоков цехов КРС и площадок выращивания.',
    cover: '/images/solutions/cover/agrokompleksy.webp',
    video: '/videos/hero/vitebsk_260926.mp4',
    categories: ['Мясопереработка'],
    equipment: ['flotation-units', 'bs-bio-station', 'polymer-dosing-station', 'filter-press', 'rotary-drum-sieve', 'aeration-systems']
  },
  {
    slug: 'pishchevaya-promyshlennost',
    banner: '/images/solutions/cover/pishchevaya-promyshlennost-wide.webp',
    title: 'Пищевая промышленность',
    short: 'Молочные заводы и мясопереработка',
    lede: 'Очистка высококонцентрированных производственных стоков методом физико-химической и последующей биологической очистки.',
    cover: '/images/solutions/cover/pishchevaya-promyshlennost.webp',
    video: '/videos/hero/postavsky_230926.mp4',
    categories: ['Молочные предприятия', 'Мясопереработка'],
    only: ['postavy-dairy', 'vitkonprodukt'],
    equipment: ['flotation-units', 'lt-grease-traps', 'polymer-dosing-station', 'rotary-drum-sieve', 'filter-press', 'bc-local-treatment']
  },
  {
    slug: 'chastnye-i-kommercheskie',
    banner: '/images/solutions/cover/chastnye-i-kommercheskie-wide.webp',
    title: 'Дома и коммерческие объекты',
    short: 'Автономная канализация и ливневые стоки',
    lede: 'Автономная канализация для дома, локальные очистные сооружения и очистка ливневых вод для коммерческих территорий.',
    cover: '/images/solutions/cover/chastnye-i-kommercheskie.webp',
    categories: [],
    equipment: ['miniklar-mikroklar', 'bc-local-treatment', 'orl-storm-water', 'lt-grease-traps', 'polypropylene-tanks', 'fibroil-sorbent']
  }
]

export const solutionProjects = (s) =>
  projects.filter((p) => (s.only ? s.only.includes(p.slug) : s.categories.includes(p.category)))

export const solutionEquipment = (s) =>
  s.equipment.map((slug) => equipment.find((e) => e.slug === slug)).filter(Boolean)

export const technologies = [
  { title: 'Механическая фильтрация', to: '/technologies/mechanical-filtration' },
  { title: 'Биологическая очистка', to: '/technologies/biological-treatment' },
  { title: 'Физико-химическая очистка', to: '/technologies/physiochemical-methods' },
  { title: 'УФ-обеззараживание', to: '/technologies/uv-disinfection' }
]
export const digitalTech = [
  { title: 'LiDAR-сканирование', to: '/technologies#lidar', img: '/images/digital-twin/layer-lidar-b.webp' },
  { title: '3D/BIM-проектирование', to: '/technologies#3d', img: '/images/digital-twin/layer-bim-b.webp' },
  { title: 'Цифровые двойники', to: '/technologies#digital-twin', img: '/images/digital-twin/layer-operation-b.webp' }
]

// В меню — оборудование с предметными рендерами на белом фоне
const RENDERED = ['flotation-units', 'microfilters-sand-traps', 'polymer-dosing-station', 'filter-press', 'rotary-drum-sieve', 'sand-separator', 'screw-conveyor']
export const renderedEquipment = RENDERED.map((slug) => equipment.find((e) => e.slug === slug)).filter(Boolean)

export const nav = [
  {
    label: 'Технологии', to: '/technologies', key: 'tech',
    match: ['/technologies']
  },
  {
    label: 'Оборудование', to: '/equipment', key: 'equip',
    match: ['/equipment'],
    items: renderedEquipment.map((e) => ({ title: e.name, to: `/equipment/${e.slug}`, img: e.photo }))
  },
  {
    label: 'Решения для бизнеса', to: '/solutions', key: 'sol',
    match: ['/solutions'],
    items: solutions.map((s) => ({ title: s.title, sub: s.short, to: `/solutions/${s.slug}`, img: s.cover }))
  },
  {
    label: 'Объекты', to: '/projects', key: 'proj', match: ['/projects'],
    // крупнейшие объекты с постерами, от большого к малому
    items: (Array.isArray(projects) ? projects : Object.values(projects).find(Array.isArray) || [])
      .filter((p) => p.sliderPoster || p.poster)
      .sort((a, b) => (Number(String(b.capacity || '').replace(/[^\d]/g, '')) || 0) - (Number(String(a.capacity || '').replace(/[^\d]/g, '')) || 0))
      .slice(0, 4)
      .map((p) => ({ title: p.location || p.name, sub: p.capacity, to: `/projects/${p.slug}`, img: p.sliderPoster || p.poster }))
  },
  {
    label: 'Услуги', to: '/services', key: 'serv', match: ['/services'],
    items: [
      { title: 'Проектирование', sub: 'Очистные сооружения и сети', to: '/services/designing-of-treatment-facilities', img: '/images/services/idea-table.webp' },
      { title: 'Производство', sub: 'Собственный цех в Заславле', to: '/services/production', img: '/images/about/press-brake-team.webp' },
      { title: 'Монтаж', sub: 'Шеф-монтаж и строительство', to: '/services/installation', img: '/images/services/installation-crane.webp' },
      { title: 'Пусконаладка и сервис', sub: 'Запуск, обучение, поддержка 24/7', to: '/services/start', img: '/images/services/start-indoor.webp' }
    ]
  },
  {
    label: 'Новости', to: '/about/news', key: 'news', match: ['/about/news', '/articles'],
    items: (Array.isArray(newsJson) ? newsJson : Object.values(newsJson).find(Array.isArray) || [])
      .slice(0, 4)
      .map((n) => ({ title: n.title, sub: n.date ? new Date(n.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '', to: `/about/news?news=${n.date}`, img: n.image }))
  },
  {
    label: 'О компании', to: '/about', key: 'about',
    match: ['/about', '/career', '/partners'],
    items: [
      { title: 'О компании', sub: '28 лет в очистке воды', to: '/about', img: '/images/digital-twin/pointcloud-esp.webp' },
      { title: 'Карьера', sub: 'Вакансии и условия', to: '/career', img: '/images/career/team-planning.webp' },
      { title: 'Отзывы', sub: 'Письма заказчиков', to: '/about/reviews', img: '/images/reviews/review-01-m.webp' },
      { title: 'Сертификаты', sub: 'Качество и соответствие', to: '/about/certifications', img: '/images/trust/certs/29489a957b983585c29c5ca16e55f806.webp' },
      { title: 'Документация', sub: 'Нормативы и паспорта', to: '/about/documentation', img: '/images/home/trust/drawings.webp' },
      { title: 'Партнёры', sub: 'С кем мы работаем', to: '/partners', img: '/images/news/real/office-move-team.webp' }
    ],
    links: [
      { title: 'О компании', to: '/about' },
      { title: 'Карьера', to: '/career' },
      { title: 'Отзывы', to: '/about/reviews' },
      { title: 'Сертификаты', to: '/about/certifications' },
      { title: 'Документация', to: '/about/documentation' },
      { title: 'Партнёры', to: '/partners' }
    ]
  },
  { label: 'Контакты', to: '/contacts', key: 'contacts', match: ['/contacts'] }
]

export const contacts = {
  phone: '+375 (17) 215-22-76',
  phoneHref: 'tel:+375172152276',
  email: 'info@ecoservisproekt.com',
  address: '220076, г. Минск, ул. Петра Мстиславца, 20, пом. 236',
  hours: 'Пн–Пт: 9:00–18:00'
}
