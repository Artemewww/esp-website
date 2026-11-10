# Бриф: 3D-модели оборудования ESP в Blender

Цель — точные модели 7 позиций, чтобы делать рендеры в подаче DJI в любом ракурсе без искажений.

## Исходники по каждой позиции
| slug | рендер (CAD, вид 3/4) | вырезка с альфой | реальное фото |
|---|---|---|---|
| flotation-units | public/images/equipment/flotation.webp | public/images/equipment/cut/flotation.webp | public/images/equipment/real/flotation-unit.webp |
| polymer-dosing-station | …/polymer-station.webp | …/cut/polymer-station.webp | …/real/polymer-station.webp |
| rotary-drum-sieve | …/rotary-drum-sieve.webp | …/cut/rotary-drum-sieve.webp | — |
| sand-separator | …/sand-separator.webp | …/cut/sand-separator.webp | — |
| screw-conveyor | …/screw-conveyor.webp | …/cut/screw-conveyor.webp | — |
| filter-press | …/belt-filter-press.webp | …/cut/belt-filter-press.webp | …/real/belt-filter-press.webp |
| microfilters-sand-traps | …/microfilter.webp | …/cut/microfilter.webp | …/real/microfilter.webp |

Описания и характеристики — `composables/useEquipment.js`. Кадр CAD-экрана с моделью — `public/images/real4k/cad-screen.webp`.

## Как работать
1. Blender: `/Applications/Blender.app/Contents/MacOS/Blender -b -P <script.py>` (версия 5.2, bpy). Один процесс Blender за раз на агента.
2. Модель строится скриптом `tools/render/models/<slug>.py`: только bpy-примитивы и модификаторы (bevel, solidify, array, curve), реальные пропорции в метрах. Имена объектов задают материалы: `steel_*` — нержавейка, `galv_*` — оцинковка, `blue_*` / `paint_*` — синяя краска RAL 5005, `orange_*` — оранжевые детали, `black_*` — резина/пластик/моторы, `pp_*` — полипропилен, `glass_*` — прозрачное.
3. Подбор ракурса: поставь камеру так, чтобы рендер совпадал с исходным CAD-рендером по ракурсу, и сравни силуэт с вырезкой: рендер на прозрачном фоне → наложение поверх `cut/<name>.webp` (ffmpeg blend=difference или полупрозрачное наложение) → смотри глазами. Итерируй, пока не совпадут габаритный силуэт, число и расположение основных узлов (опоры, рамы, ёмкости, валы, перила, патрубки, моторы, шкафы).
4. Детализация уровня продуктового рендера: фаски на рёбрах, толщины листа, болты/фланцы там, где они видны на исходнике. Без выдуманных узлов.
5. Сохранить: `tools/render/models/<slug>.blend`, `public/models/<slug>.glb` (экспорт glTF, Y-up, применённый масштаб), сравнение `docs/models/<slug>-compare.jpg` (исходник | наш рендер в том же ракурсе).
6. Затем общий конвейер: `blender -b -P tools/render/esp_render.py -- public/models/<slug>.glb <out> light,dark,field 96` → проверь кадрирование. Если `esp_render.py` надо доработать (камеры, свет), опиши правку в отчёте, но не правь файл сам — его дорабатывает координатор.
7. Не коммитить. Не трогать файлы вне своих позиций. Диск почти полный (~1,5 ГБ): рендеры итераций держи в scratchpad и удаляй промежуточные.
