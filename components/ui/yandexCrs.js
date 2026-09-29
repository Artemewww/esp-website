// CRS для тайлов Яндекса.
//
// У Яндекса меркатор на эллипсоиде (EPSG:3395), а у Leaflet по умолчанию —
// сферический Web-Mercator (EPSG:3857). На широте Минска расхождение между
// ними по вертикали около 20 км: метки уезжают от подложки на видимое
// расстояние. Поэтому проекцию берём через proj4, а сетку тайлов оставляем
// стандартную — 256 px на мир при z=0, дальше степень двойки.
//
// Здесь была ошибка, из-за которой обе метки на карте контактов садились
// в одну точку: масштаб задавался списком «разрешений» (2048, 1024, …),
// не имеющим отношения к реальному размеру тайла, и все координаты
// схлопывались. Правильный путь — оставить scale() Leaflet как есть
// (256 · 2^zoom) и перевести метры в доли мира через transformation.

// Длина экватора на эллипсоиде WGS84 — ширина мира в метрах проекции.
const WORLD = 2 * Math.PI * 6378137

export const buildYandexCrs = (L, proj4) => {
  const code = 'EPSG:3395'
  proj4.defs(code, '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=krass +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
  const p = proj4(code)

  const projection = {
    project: (latlng) => {
      const pt = p.forward([latlng.lng, latlng.lat])
      return L.point(pt[0], pt[1])
    },
    unproject: (point) => {
      const pt = p.inverse([point.x, point.y])
      return L.latLng(pt[1], pt[0])
    },
    bounds: L.bounds([-WORLD / 2, -WORLD / 2], [WORLD / 2, WORLD / 2])
  }

  return L.Util.extend({}, L.CRS.Earth, {
    code,
    projection,
    // Метры проекции → доли мира (0..1), дальше Leaflet домножит на 256·2^zoom.
    transformation: new L.Transformation(1 / WORLD, 0.5, -1 / WORLD, 0.5)
  })
}
