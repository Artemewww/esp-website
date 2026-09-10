import heroSlides from '../../content/defaults/hero-slides.json'
import reviews from '../../content/defaults/reviews.json'
import team from '../../content/defaults/team.json'
import vacancies from '../../content/defaults/vacancies.json'
import articles from '../../content/defaults/articles.json'
import webinars from '../../content/defaults/webinars.json'
import news from '../../content/defaults/news.json'
import partners from '../../content/defaults/partners.json'
import certificates from '../../content/defaults/certificates.json'
import documents from '../../content/defaults/documents.json'

/**
 * Разделы, которые заказчик правит сам. Состав согласован в файле
 * «Перечень объектов + блоки под редакцию», лист «блоки для нашего
 * редактирования» (Юлия, 04.09.2026).
 *
 * fields — только те поля, которые человек реально меняет. Всё остальное
 * (slug, contact, bio, sections, skills…) при сохранении переносится из
 * исходной записи без изменений: админка не должна уметь ломать то, чего
 * не показывает.
 */
export type FieldType = 'text' | 'textarea' | 'image' | 'media' | 'url' | 'select'

export interface FieldSpec {
  key: string
  label: string
  type: FieldType
  hint?: string
  options?: string[]
}

export interface SectionSpec {
  key: string
  group: string
  title: string
  subtitle: string
  /** Где это видно на сайте — чтобы человек понимал, что правит. */
  where: string
  itemLabel: string
  titleField: string
  /** Второй строкой в списке — чтобы записи различались с одного взгляда. */
  metaField?: string
  fields: FieldSpec[]
  defaults: Record<string, unknown>[]
}

export const SECTIONS: SectionSpec[] = [
  {
    key: 'hero-slides',
    group: 'Главная',
    title: 'Слайды на главной',
    subtitle: 'Видео и описание объекта в первом экране',
    where: 'Главная страница, самый верх',
    itemLabel: 'Слайд',
    titleField: 'title',
    metaField: 'badge',
    fields: [
      { key: 'title', label: 'Название объекта', type: 'text' },
      { key: 'badge', label: 'Плашка сверху', type: 'text', hint: 'Область и мощность: «Гомельская область | 18 000 м³/сут»' },
      { key: 'description', label: 'Описание', type: 'textarea', hint: 'Особенности объекта и год постройки' },
      { key: 'video', label: 'Видео', type: 'media', hint: 'MP4. Если видео нет — оставьте пустым, покажется фото' },
      { key: 'poster', label: 'Фото (обложка)', type: 'image', hint: 'Видно, пока грузится видео, и вместо видео, если его нет' },
      { key: 'link', label: 'Куда ведёт слайд', type: 'url', hint: 'Например /projects' }
    ],
    defaults: heroSlides as Record<string, unknown>[]
  },
  {
    key: 'reviews',
    group: 'Главная',
    title: 'Отзывы',
    subtitle: 'Сканы благодарственных писем',
    where: 'Главная страница и «О компании» → «Отзывы»',
    itemLabel: 'Отзыв',
    titleField: 'company',
    metaField: 'date',
    fields: [
      { key: 'company', label: 'От кого', type: 'text' },
      { key: 'image', label: 'Скан документа', type: 'image' },
      { key: 'quote', label: 'Цитата из письма', type: 'textarea', hint: 'Необязательно' },
      { key: 'date', label: 'Дата', type: 'text', hint: 'Например «март 2026»' }
    ],
    defaults: reviews as Record<string, unknown>[]
  },
  {
    key: 'team',
    group: 'О нас',
    title: 'Команда и эксперты',
    subtitle: 'Карточки сотрудников',
    where: '«Команда» → «Наши эксперты»',
    itemLabel: 'Сотрудник',
    titleField: 'name',
    metaField: 'role',
    fields: [
      { key: 'name', label: 'Имя и фамилия', type: 'text' },
      { key: 'fullName', label: 'ФИО полностью', type: 'text' },
      { key: 'role', label: 'Должность', type: 'text' },
      { key: 'department', label: 'Подразделение', type: 'text' },
      { key: 'photo', label: 'Фотография', type: 'image' },
      { key: 'email', label: 'Почта', type: 'text' },
      { key: 'philosophy', label: 'Цитата сотрудника', type: 'textarea' }
    ],
    defaults: team as Record<string, unknown>[]
  },
  {
    key: 'vacancies',
    group: 'Карьера',
    title: 'Вакансии',
    subtitle: 'Открытые позиции и стажировки',
    where: '«Карьера» → «Работа в ESP»',
    itemLabel: 'Вакансия',
    titleField: 'title',
    metaField: 'dept',
    fields: [
      { key: 'title', label: 'Название вакансии', type: 'text' },
      { key: 'dept', label: 'Подразделение', type: 'text' },
      { key: 'location', label: 'Место работы', type: 'text' },
      { key: 'type', label: 'Занятость', type: 'text' },
      { key: 'level', label: 'Требуемый опыт', type: 'text' },
      { key: 'salary', label: 'Зарплата', type: 'text' },
      { key: 'schedule', label: 'График', type: 'text' },
      { key: 'mission', label: 'Чем предстоит заниматься', type: 'textarea' }
    ],
    defaults: vacancies as Record<string, unknown>[]
  },
  {
    key: 'articles',
    group: 'Ресурсы',
    title: 'Библиотека знаний',
    subtitle: 'Статьи и аналитика',
    where: '«Ресурсы» → «Библиотека знаний»',
    itemLabel: 'Статья',
    titleField: 'title',
    metaField: 'date',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'category', label: 'Раздел', type: 'text' },
      { key: 'date', label: 'Дата', type: 'text', hint: 'В формате 15.05.2026' },
      { key: 'readTime', label: 'Время чтения', type: 'text' },
      { key: 'authorName', label: 'Автор', type: 'text' },
      { key: 'authorRole', label: 'Должность автора', type: 'text' },
      { key: 'excerpt', label: 'Краткое описание', type: 'textarea' }
    ],
    defaults: articles as Record<string, unknown>[]
  },
  {
    key: 'webinars',
    group: 'Ресурсы',
    title: 'Вебинары и события',
    subtitle: 'Анонсы мероприятий',
    where: '«Ресурсы» → «Вебинары и события»',
    itemLabel: 'Событие',
    titleField: 'title',
    metaField: 'date',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'type', label: 'Тип', type: 'select', options: ['WEBINAR', 'MASTERCLASS', 'CONFERENCE', 'EXPO'] },
      { key: 'status', label: 'Статус', type: 'select', options: ['РЕГИСТРАЦИЯ ОТКРЫТА', 'МЕСТА ЗАКОНЧИЛИСЬ', 'ЗАПИСЬ ДОСТУПНА', 'АНОНС'] },
      { key: 'category', label: 'Категория', type: 'text' },
      { key: 'date', label: 'Дата и время', type: 'text' },
      { key: 'location', label: 'Место', type: 'text' },
      { key: 'speaker', label: 'Спикер', type: 'text' },
      { key: 'desc', label: 'Описание', type: 'textarea' }
    ],
    defaults: webinars as Record<string, unknown>[]
  },
  {
    key: 'news',
    group: 'Ресурсы',
    title: 'Новости',
    subtitle: 'Лента новостей компании',
    where: '«Ресурсы» → «Новости»',
    itemLabel: 'Новость',
    titleField: 'title',
    metaField: 'dateLabel',
    fields: [
      { key: 'title', label: 'Заголовок', type: 'text' },
      { key: 'dateLabel', label: 'Дата (как показывать)', type: 'text', hint: 'Например «30 марта 2019»' },
      { key: 'date', label: 'Дата (для сортировки)', type: 'text', hint: 'В формате 2019-03-30' },
      { key: 'text', label: 'Текст', type: 'textarea' }
    ],
    defaults: news as Record<string, unknown>[]
  },
  {
    key: 'partners',
    group: 'География работ',
    title: 'Партнёры',
    subtitle: 'Список организаций-партнёров',
    where: '«Проекты» → «Партнёры»',
    itemLabel: 'Партнёр',
    titleField: 'name',
    metaField: 'site',
    fields: [
      { key: 'name', label: 'Название организации', type: 'text' },
      { key: 'site', label: 'Сайт', type: 'text', hint: 'Без http://, например belorusneft.by' }
    ],
    defaults: partners as Record<string, unknown>[]
  },
  {
    key: 'documents',
    group: 'География работ',
    title: 'Нормативная документация',
    subtitle: 'СанПиН, ТКП, СТБ и другие документы',
    where: '«Проекты» → «Нормативная документация»',
    itemLabel: 'Документ',
    titleField: 'title',
    metaField: 'category',
    fields: [
      { key: 'title', label: 'Обозначение', type: 'text', hint: 'Например «СанПиН 2.1.2.12-33-2005»' },
      { key: 'desc', label: 'Название документа', type: 'textarea' },
      { key: 'category', label: 'Категория', type: 'text' },
      { key: 'size', label: 'Размер файла', type: 'text' },
      { key: 'href', label: 'Файл', type: 'media' }
    ],
    defaults: documents as Record<string, unknown>[]
  },
  {
    key: 'certificates',
    group: 'География работ',
    title: 'Сертификаты',
    subtitle: 'Группы аттестатов и свидетельств',
    where: '«Проекты» → «Сертификаты»',
    itemLabel: 'Группа',
    titleField: 'title',
    metaField: 'id',
    fields: [
      { key: 'title', label: 'Название группы', type: 'text' },
      { key: 'desc', label: 'Описание', type: 'textarea' }
    ],
    defaults: certificates as Record<string, unknown>[]
  }
]

export const sectionByKey = (key: string) => SECTIONS.find((s) => s.key === key)

/** Список для меню админки: только то, что нужно для отрисовки карточек. */
export const sectionIndex = () =>
  SECTIONS.map(({ key, group, title, subtitle, where, defaults }) => ({
    key, group, title, subtitle, where, count: defaults.length
  }))
