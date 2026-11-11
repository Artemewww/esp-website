// Материалы доверия: сканы благодарственных писем и логотипы заказчиков.
// Один источник для блока на главной (HomeTrustBlock) и страницы /about/reviews.
// Сканы — с прежнего сайта ecoservisproekt.com (public/images/reviews → webp).

export const reviewLetters = Array.from({ length: 21 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { id: n, img: `/images/trust/reviews/review-${n}.webp`, full: `/images/reviews/review-${n}.jpg` }
})

// Файлы обрезаны по содержимому (поля 2%). w/h — размер в px при равной визуальной площади
// (~6000 px², высота ≤ 64, ширина ≤ 180): широкие знаки ниже, квадратные — уже.
export const clientLogos = [
  ['80c6fe59f5b620e9940155f748939cf7', 64, 64, 'Корона'],
  ['a1028285fb980e60630f0be2400ec053', 128, 47, 'Савушкин продукт'],
  ['d877f2006e18247d96f2092f23e47fd8', 96, 43, 'Белорусская железная дорога'],
  ['Belarusneft', 167, 36, 'Белоруснефть'],
  ['belaruskali', 56, 64, 'Беларуськалий'],
  ['Bel_minprirod', 54, 64, 'Минприроды'],
  ['MTS-1', 147, 41, 'Минскэнерго'],
  ['bntu', 69, 64, 'БНТУ'],
  ['BGUIR-logo', 102, 59, 'БГУИР'],
  ['logo-print', 78, 64, 'Минскводоканал'],
  ['8558', 93, 64, 'Снов'],
  ['images', 57, 64, 'Ганна'],
  ['images-1', 118, 51, 'Дзержинка']
].map(([n, w, h, name]) => ({ src: `/images/trust/logos/${n}.webp`, w, h, name }))

// Число объектов — реестр со страницы ecoservisproekt.com/projects (content/defaults/registry.json).
export const objectsCount = 240
