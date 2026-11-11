// Единая карта сайта для шапки, мега-меню, мобильного меню и футера.
// Тексты пунктов — существующие названия разделов сайта.
import equipment from '~~/content/defaults/equipment.json'
import projects from '~~/content/defaults/projects.json'

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
  { title: 'LiDAR-сканирование', to: '/technologies#lidar', img: '/images/digital-twin/layer-lidar.webp' },
  { title: '3D/BIM-проектирование', to: '/technologies#3d', img: '/images/digital-twin/layer-bim.webp' },
  { title: 'Цифровые двойники', to: '/technologies#digital-twin', img: '/images/digital-twin/layer-operation.webp' }
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
  { label: 'Объекты', to: '/projects', key: 'proj', match: ['/projects'] },
  { label: 'Услуги', to: '/services', key: 'serv', match: ['/services'] },
  { label: 'Новости', to: '/about/news', key: 'news', match: ['/about/news', '/articles'] },
  {
    label: 'О компании', to: '/about', key: 'about',
    match: ['/about', '/team', '/career', '/partners'],
    links: [
      { title: 'О компании', to: '/about' },
      { title: 'Команда', to: '/team' },
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
