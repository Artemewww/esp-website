// Материалы доверия: сканы благодарственных писем и логотипы заказчиков.
// Один источник для блока на главной (HomeTrustBlock) и страницы /about/reviews.
// Сканы — с прежнего сайта ecoservisproekt.com (public/images/reviews → webp).

export const reviewLetters = Array.from({ length: 21 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { id: n, img: `/images/trust/reviews/review-${n}.webp`, full: `/images/reviews/review-${n}.jpg` }
})

export const clientLogos = [
  '80c6fe59f5b620e9940155f748939cf7', 'a1028285fb980e60630f0be2400ec053', 'd877f2006e18247d96f2092f23e47fd8',
  'Belarusneft', 'belaruskali', 'Bel_minprirod', 'MTS-1', 'bntu', 'BGUIR-logo',
  'logo-print', '8558', 'images', 'images-1'
].map((n) => `/images/trust/logos/${n}.webp`)

// Число объектов — реестр со страницы ecoservisproekt.com/projects (content/defaults/registry.json).
export const objectsCount = 240
