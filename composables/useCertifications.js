export const certificationCategories = [
  {
    id: 'design',
    title: 'Аттестаты соответствия на проектную деятельность',
    desc: 'Профессиональные аттестаты, подтверждающие право ESP на выполнение проектных работ второй категории сложности.',
    items: [
      { num: '1.1', img: 'https://ecoservisproekt.com/upload/iblock/294/29489a957b983585c29c5ca16e55f806.jpg' },
      { num: '1.2', img: 'https://ecoservisproekt.com/upload/iblock/c10/c10f88beb7c3e2ebd2d4529de38a097d.jpg' },
      { num: '1.3', img: 'https://ecoservisproekt.com/upload/iblock/544/544aad284310f96bcd57ee06575cfb52.jpg' }
    ]
  },
  {
    id: 'products',
    title: 'Сертификаты на продукцию собственного производства',
    desc: 'Сертификаты качества на оборудование, изготавливаемое на производственной площадке «Экомашины».',
    items: [
      { num: '2.1', img: 'https://ecoservisproekt.com/upload/iblock/577/57708d5d6ca43fb5edb9da0da79c9f50.PNG' },
      { num: '2.2', img: 'https://ecoservisproekt.com/upload/iblock/be9/be9f848285e3ef992d3926279fd36d9c.PNG' },
      { num: '2.3', img: 'https://ecoservisproekt.com/upload/iblock/566/566fb193488af911cb4fe74bc4f617c9.jpg' }
    ]
  },
  {
    id: 'services',
    title: 'Сертификаты на работы и услуги собственного производства',
    desc: 'Подтверждение права выполнения строительно-монтажных работ: водоснабжение, канализация, металлоконструкции.',
    items: [
      { num: '3.1', img: 'https://ecoservisproekt.com/upload/iblock/da4/da4b1f00a2eb61ec89bad4e9fe9628f9.jpg' },
      { num: '3.2', img: 'https://ecoservisproekt.com/upload/iblock/a7a/a7a209140e89231994c857e8efeac7f2.jpg' },
      { num: '3.3', img: 'https://ecoservisproekt.com/upload/iblock/149/149f50cde21c13727bf2f3707623b160.jpg' }
    ]
  },
  {
    id: 'conformity',
    title: 'Сертификаты соответствия',
    desc: 'Документы, подтверждающие соответствие оборудования требованиям технических регламентов Таможенного союза (ТР ТС).',
    items: [
      { num: '4.1', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/7e4/300_200_001a9461d51526113595f057e89280f5a/7e4bbf0d19ff8f2f65ec9a7f4afc146f.jpg' },
      { num: '4.2', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/d45/300_200_001a9461d51526113595f057e89280f5a/d45f88957772465b6a3fff5eb60189ed.jpg' },
      { num: '4.3', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/4df/300_200_001a9461d51526113595f057e89280f5a/4df3e4a4603bd475177286a54cb85142.jpg' },
      { num: '4.4', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/1d9/300_200_001a9461d51526113595f057e89280f5a/1d9de7cd8679bf31d594e3d3217280bd.jpg' },
      { num: '4.5', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/d95/300_200_001a9461d51526113595f057e89280f5a/d958cee555fb97cefb564e783fb78145.jpg' },
      { num: '4.6', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/a34/300_200_001a9461d51526113595f057e89280f5a/a346b2e9d49eeca44465b8837725f291.jpg' }
    ]
  },
  {
    id: 'declarations',
    title: 'Декларации о соответствии',
    desc: 'Официальные декларации соответствия продукции установленным техническим нормам и стандартам.',
    items: [
      { num: '5.1', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/197/300_200_001a9461d51526113595f057e89280f5a/19791488fff989a44364536cf2051234.jpg' },
      { num: '5.2', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/43f/300_200_001a9461d51526113595f057e89280f5a/43f586fce51209b0796f32c0dc53d2ca.jpg' },
      { num: '5.3', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/fe8/300_200_001a9461d51526113595f057e89280f5a/fe8e4f4bfb12bcc7e5472917c7fe99b0.jpg' },
      { num: '5.4', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/27c/300_200_001a9461d51526113595f057e89280f5a/27c1b4ae730e310060500dd5b7b9389d.jpg' },
      { num: '5.5', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/b65/300_200_001a9461d51526113595f057e89280f5a/b65cbb08f629211a07aa80ce59f8487f.jpg' },
      { num: '5.6', img: 'https://ecoservisproekt.com/upload/resize_cache/iblock/765/300_200_001a9461d51526113595f057e89280f5a/765fba885c385a4710f131fb45d90f89.jpg' }
    ]
  }
]

export const useCertifications = () => {
  return { certificationCategories }
}
