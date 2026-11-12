// Облако точек: очистные сооружения г. Речица (18 000 м³/сут) — как результат
// LiDAR-съёмки. Генплан снят с реальных аэрокадров (public/images/projects/
// rechitsa/g-01…g-07, 1–3, hero rechitsa_230926): три параллельных прямоугольных
// блока аэротенков с решётчатыми галереями и синими павильонами на северной
// стене, корпус механической очистки и здания с синими крышами на западе,
// иловые площадки на востоке, дороги, ограждение, ЛЭП, лесополосы и поля.
// Водонапорная башня (круглая) сознательно не рисуется — только прямоугольные
// сооружения. Точки распределяются по площадям поверхностей (весовой сэмплинг)
// прямо в typed arrays: positions Float32 xyz, colors Uint8 rgba (a = случайное
// зерно для анимации сборки). Единицы — метры, Y вверх, X — восток, Z — юг.
//
// ВАЖНО: функция полностью самодостаточна (без внешних ссылок) — её исходник
// передаётся в Web Worker через Function.toString().

export function buildPlantCloud({ count = 1500000, seed = 20260611 } = {}) {
  let s = seed >>> 0
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const N = Math.max(2000, count | 0)
  const pos = new Float32Array(N * 3)
  const col = new Uint8Array(N * 4)
  let k = 0

  // ── палитра: фирменный синий (#0a3a8c → #2e7cf6 → белый), вода — бирюза ──
  const GROUND = [0.05, 0.15, 0.36]
  const FIELD_A = [0.04, 0.12, 0.3]
  const FIELD_B = [0.07, 0.2, 0.46]
  const PAD = [0.08, 0.2, 0.44]
  const ROAD = [0.3, 0.4, 0.58]
  const CONC = [0.18, 0.49, 0.96]
  const RIM = [0.6, 0.78, 1]
  const AER = [0.05, 0.3, 0.5] // иловая смесь в аэротенках — тёмная
  const FOAM = [0.25, 0.62, 0.8] // пена/аэрация
  const WATER = [0.12, 0.72, 0.86]
  const SLUDGE = [0.06, 0.16, 0.34]
  const SLUDGE2 = [0.1, 0.26, 0.5]
  const METAL = [0.88, 0.94, 1]
  const WALL = [0.42, 0.62, 1]
  const GLASS = [0.1, 0.24, 0.6]
  const ROOF = [0.62, 0.72, 0.9]
  const BLUE = [0.04, 0.36, 1] // синие кровли павильонов и цехов
  const PIPE = [0.35, 0.8, 1]
  const PINE = [0.1, 0.3, 0.62]
  const BIRCH = [0.2, 0.42, 0.78]
  const TRUNK = [0.16, 0.26, 0.48]
  const BIRCH_TRUNK = [0.7, 0.8, 0.95]

  const put = (x, y, z, c) => {
    if (k >= N) return
    const i = k * 3, j = k * 4
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z
    const h = y > 0.5 ? Math.min(1, y / 20) * 0.28 : 0
    const v = 0.8 + rnd() * 0.4
    col[j] = Math.min(255, (c[0] + (1 - c[0]) * h) * v * 255)
    col[j + 1] = Math.min(255, (c[1] + (1 - c[1]) * h) * v * 255)
    col[j + 2] = Math.min(255, (c[2] + (1 - c[2]) * h) * v * 255)
    col[j + 3] = rnd() * 255
    k++
  }

  // ── реестр поверхностей: площадь × вес → доля точек ──
  const prims = []
  const add = (area, w, fn) => { if (area > 0) prims.push({ a: area * w, fn }) }

  // параллелограмм o + u·a + v·b; mask(a,b) → цвет (или null — пропустить)
  const quad = (o, u, v, c, w = 1, mask) => {
    const cx = u[1] * v[2] - u[2] * v[1], cy = u[2] * v[0] - u[0] * v[2], cz = u[0] * v[1] - u[1] * v[0]
    add(Math.hypot(cx, cy, cz), w, (n) => {
      for (let i = 0; i < n; i++) {
        const a = rnd(), b = rnd()
        put(o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b, o[2] + u[2] * a + v[2] * b, mask ? mask(a, b) : c)
      }
    })
  }
  const hq = (x0, x1, z0, z1, y, c, w, m) => quad([x0, y, z0], [x1 - x0, 0, 0], [0, 0, z1 - z0], c, w, m)
  const wx = (x0, x1, z, y0, y1, c, w, m) => quad([x0, y0, z], [x1 - x0, 0, 0], [0, y1 - y0, 0], c, w, m)
  const wz = (z0, z1, x, y0, y1, c, w, m) => quad([x, y0, z0], [0, 0, z1 - z0], [0, y1 - y0, 0], c, w, m)
  // замкнутый короб без дна (стены + крышка)
  const box = (x0, x1, z0, z1, y0, y1, c, w = 3) => {
    wx(x0, x1, z0, y0, y1, c, w); wx(x0, x1, z1, y0, y1, c, w)
    wz(z0, z1, x0, y0, y1, c, w); wz(z0, z1, x1, y0, y1, c, w)
    hq(x0, x1, z0, z1, y1, c, w)
  }

  // цилиндр по произвольной оси (трубы, перила, стойки, провода)
  const cyl = (a, b, r, c, w = 1) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2]
    const L = Math.hypot(dx, dy, dz)
    if (!L) return
    const ax = dx / L, ay = dy / L, az = dz / L
    let px = -az, py = 0, pz = ax
    if (Math.abs(ay) > 0.9) { px = 1; py = 0; pz = 0 }
    const pl = Math.hypot(px, py, pz); px /= pl; py /= pl; pz /= pl
    const qx = ay * pz - az * py, qy = az * px - ax * pz, qz = ax * py - ay * px
    add(6.2832 * r * L, w, (n) => {
      for (let i = 0; i < n; i++) {
        const t = rnd() * L, g = rnd() * 6.2832, cs = Math.cos(g) * r, sn = Math.sin(g) * r
        put(a[0] + ax * t + px * cs + qx * sn, a[1] + ay * t + py * cs + qy * sn, a[2] + az * t + pz * cs + qz * sn, c)
      }
    })
  }
  const rail = (a, b, c = METAL) => cyl(a, b, 0.04, c, 34)

  // ── рельеф: пойменная равнина у Днепра, перепад ±0.5 м ──
  const SX0 = -190, SX1 = 190, SZ0 = -165, SZ1 = 140 // участок съёмки
  const PX0 = -122, PX1 = 122, PZ0 = -80, PZ1 = 78 // площадка за ограждением
  const groundY = (x, z) => {
    const dx = Math.max(0, PX0 - x, x - PX1), dz = Math.max(0, PZ0 - z, z - PZ1)
    const kk = Math.min(1, Math.hypot(dx, dz) / 20)
    return (0.45 * Math.sin(x * 0.031 + 1.3) * Math.cos(z * 0.027) + 0.25 * Math.sin(z * 0.06 + x * 0.017)) * kk
  }
  const foot = [] // пятна застройки — без земли под ними

  // ── генплан (снят с ортокадра): блоки аэротенков по центру ──
  const BX = -10, BW = 90 // ось и длина блоков (x −55…35)
  const BLOCKS = [[26, 62], [-20, 12], [-62, -34]] // z-границы: южный, средний, северный
  const RW = -64, RE = 44 // западная и восточная внутриплощадочные дороги
  const isRoad = (x, z) =>
    (Math.abs(x - RW) < 3.5 && z > PZ0 + 4 && z < PZ1 - 4) || // западная продольная
    (Math.abs(x - RE) < 3.5 && z > PZ0 + 4 && z < SZ1) || // восточная, выезд на юг
    (Math.abs(z - 19) < 3 && x > RW && x < RE) || // между блоками
    (Math.abs(z + 27) < 3 && x > RW && x < RE) ||
    (Math.abs(z - 70) < 3 && x > RW && x < RE) || // южный проезд
    (Math.abs(z + 72) < 3.5 && x > PX0 + 6 && x < PX1 - 6) || // северный проезд
    (Math.abs(z + 8) < 3 && x > -118 && x < RW) || // к механической очистке
    (Math.abs(z + 94) < 2.5 && x > SX0 && x < SX1) // полевая дорога за ограждением

  add((SX1 - SX0) * (SZ1 - SZ0), 0.42, (n) => {
    for (let i = 0; i < n; i++) {
      let x = 0, z = 0, ok = false
      for (let tr = 0; tr < 12 && !ok; tr++) {
        x = SX0 + rnd() * (SX1 - SX0); z = SZ0 + rnd() * (SZ1 - SZ0)
        const e = Math.max(Math.abs(x) / SX1, z < 0 ? -z / -SZ0 : z / SZ1)
        if (e > 0.8 && rnd() < (e - 0.8) / 0.2) continue // мягкий край съёмки
        ok = true
        for (let f = 0; f < foot.length; f++) {
          const F = foot[f]
          if (x > F[0] && x < F[1] && z > F[2] && z < F[3]) { ok = false; break }
        }
      }
      const inPad = x > PX0 && x < PX1 && z > PZ0 && z < PZ1
      let c
      if (isRoad(x, z)) c = ROAD
      else if (inPad) c = PAD
      else if (z < -100 || x < PX0 - 30 || z > PZ1 + 26) c = (Math.floor((x * 0.9 + z * 0.12) / 3) & 1) ? FIELD_A : FIELD_B // поля полосами
      else c = GROUND
      put(x, groundY(x, z) + (rnd() - 0.5) * 0.06, z, c)
    }
  })

  // ── прямоугольная ёмкость: стены, борт, вода, перегородки, перила, мостик ──
  const tank = (cx, cz, w, d, o = {}) => {
    const h = o.h ?? 3.4, cells = o.cells ?? 1, water = o.water ?? WATER
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    const wl = h - 0.6
    foot.push([x0 - 0.5, x1 + 0.5, z0 - 0.5, z1 + 0.5])
    wx(x0, x1, z0, 0, h, CONC, 1.5); wx(x0, x1, z1, 0, h, CONC, 1.5)
    wz(z0, z1, x0, 0, h, CONC, 1.5); wz(z0, z1, x1, 0, h, CONC, 1.5)
    hq(x0, x1, z0, z0 + 0.35, h, RIM, 6); hq(x0, x1, z1 - 0.35, z1, h, RIM, 6)
    hq(x0, x0 + 0.35, z0, z1, h, RIM, 6); hq(x1 - 0.35, x1, z0, z1, h, RIM, 6)
    hq(x0 + 0.35, x1 - 0.35, z0 + 0.35, z1 - 0.35, wl, water, 1.25)
    const cw = d / cells
    for (let c = 1; c < cells; c++) {
      const z = z0 + cw * c
      wx(x0, x1, z, wl, h, CONC, 1.5); hq(x0, x1, z - 0.2, z + 0.2, h, RIM, 6)
    }
    for (const z of [z0 + 0.15, z1 - 0.15]) rail([x0, h + 1.1, z], [x1, h + 1.1, z])
    for (const x of [x0 + 0.15, x1 - 0.15]) rail([x, h + 1.1, z0], [x, h + 1.1, z1])
    for (const bf of o.bridges ?? []) {
      const bx = x0 + w * bf
      hq(bx - 0.7, bx + 0.7, z0 - 0.3, z1 + 0.3, h + 0.08, METAL, 7)
    }
  }

  // ── здание: стены с окнами, кровля (двускатная вдоль X/Z или плоская) ──
  const building = (cx, cz, w, d, h, o = {}) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    const roof = o.roof ?? ROOF
    foot.push([x0, x1, z0, z1])
    const floors = Math.max(1, Math.floor(h / 3.4))
    const win = (len) => (a, b) => {
      const fy = (b * h) % (h / floors) / (h / floors), u = (a * len) % 3.2
      return fy > 0.35 && fy < 0.78 && u > 0.9 && u < 2.4 && a * len > 1.5 && a * len < len - 1.5 ? GLASS : WALL
    }
    wx(x0, x1, z0, 0, h, WALL, 1.4, win(w)); wx(x0, x1, z1, 0, h, WALL, 1.4, win(w))
    wz(z0, z1, x0, 0, h, WALL, 1.4, win(d)); wz(z0, z1, x1, 0, h, WALL, 1.4, win(d))
    if (o.flat) {
      hq(x0, x1, z0, z1, h, roof, 1.6)
      wx(x0, x1, z0, h, h + 0.5, roof, 2); wx(x0, x1, z1, h, h + 0.5, roof, 2)
      wz(z0, z1, x0, h, h + 0.5, roof, 2); wz(z0, z1, x1, h, h + 0.5, roof, 2)
    } else if (o.alongZ) {
      const r = o.ridge ?? Math.min(3, w * 0.18)
      quad([x0 - 0.5, h - 0.15, z0 - 0.5], [0, 0, d + 1], [w / 2 + 0.5, r + 0.15, 0], roof, 1.5)
      quad([x1 + 0.5, h - 0.15, z0 - 0.5], [0, 0, d + 1], [-w / 2 - 0.5, r + 0.15, 0], roof, 1.5)
      for (const z of [z0, z1]) {
        add(w * r / 2, 1.4, (n) => {
          for (let i = 0; i < n; i++) {
            let a = rnd(), b = rnd()
            if (a + b > 1) { a = 1 - a; b = 1 - b }
            put(x0 + a * w + b * w / 2, h + b * r, z, WALL)
          }
        })
      }
    } else {
      const r = o.ridge ?? Math.min(3, d * 0.18)
      quad([x0 - 0.5, h - 0.15, z0 - 0.5], [w + 1, 0, 0], [0, r + 0.15, d / 2 + 0.5], roof, 1.5)
      quad([x0 - 0.5, h - 0.15, z1 + 0.5], [w + 1, 0, 0], [0, r + 0.15, -d / 2 - 0.5], roof, 1.5)
      for (const x of [x0, x1]) {
        add(d * r / 2, 1.4, (n) => {
          for (let i = 0; i < n; i++) {
            let a = rnd(), b = rnd()
            if (a + b > 1) { a = 1 - a; b = 1 - b }
            put(x, h + b * r, z0 + a * d + b * d / 2, WALL)
          }
        })
      }
    }
    if (o.gate) wx(cx - 2, cx + 2, z1 + 0.05, 0, 4, METAL, 3)
  }

  // ── блок аэротенков (как на фото): тёмные открытые зоны по торцам и в центре,
  //    две зоны под решётчатыми галереями, синий павильон на северной стене ──
  const aerBlock = (z0, z1) => {
    const x0 = BX - BW / 2, x1 = BX + BW / 2, D = z1 - z0, h = 4.2, wl = h - 0.5
    foot.push([x0 - 0.6, x1 + 0.6, z0 - 0.6, z1 + 0.6])
    wx(x0, x1, z0, 0, h, CONC, 1.2); wx(x0, x1, z1, 0, h, CONC, 1.2)
    wz(z0, z1, x0, 0, h, CONC, 1.2); wz(z0, z1, x1, 0, h, CONC, 1.2)
    hq(x0, x1, z0, z0 + 0.7, h, RIM, 5); hq(x0, x1, z1 - 0.7, z1, h, RIM, 5)
    hq(x0, x0 + 0.7, z0, z1, h, RIM, 5); hq(x1 - 0.7, x1, z0, z1, h, RIM, 5)
    // иловая смесь с прожилками пены (как «мрамор» на аэрофото)
    hq(x0 + 0.7, x1 - 0.7, z0 + 0.7, z1 - 0.7, wl, AER, 1.15, (a, b) => {
      const X = x0 + a * BW, Z = z0 + b * D
      const v = Math.sin(X * 0.45 + Math.sin(Z * 0.33) * 2.2) + Math.sin(Z * 0.52 + Math.sin(X * 0.27) * 2.4)
      return Math.abs(v) < 0.18 ? FOAM : AER
    })
    const F = [0, 0.2, 0.41, 0.5, 0.59, 0.8, 1]
    for (let i = 1; i < F.length - 1; i++) { // продольные перегородки коридоров
      const x = x0 + BW * F[i]
      wz(z0, z1, x, wl - 0.3, h, CONC, 1.6); hq(x - 0.3, x + 0.3, z0, z1, h, RIM, 5)
    }
    wx(x0 + BW * 0.41, x0 + BW * 0.59, (z0 + z1) / 2, wl - 0.3, h, CONC, 1.6) // деление центральной зоны
    // решётчатые галереи: продольные балки + поперечные мостики через ~3.2 м
    for (const [fa, fb] of [[0.2, 0.41], [0.59, 0.8]]) {
      const xa = x0 + BW * fa, xb = x0 + BW * fb, ym = h + 0.6
      for (const x of [xa + 0.8, (xa + xb) / 2, xb - 0.8]) {
        hq(x - 0.45, x + 0.45, z0 + 0.4, z1 - 0.4, ym, METAL, 6)
        rail([x, ym + 1.1, z0], [x, ym + 1.1, z1])
      }
      for (let z = z0 + 2; z < z1 - 1; z += 3.2) {
        hq(xa + 0.4, xb - 0.4, z - 0.3, z + 0.3, ym, METAL, 6)
        rail([xa, ym, z], [xa, h, z]); rail([xb, ym, z], [xb, h, z])
      }
      // воздуховод вдоль галереи
      cyl([(xa + xb) / 2 + 1.2, ym + 0.35, z0 + 0.5], [(xa + xb) / 2 + 1.2, ym + 0.35, z1 - 0.5], 0.28, PIPE, 3)
    }
    // переходная галерея поперёк блока у северной стены
    hq(x0 + BW * 0.2, x0 + BW * 0.8, z0 + 0.9, z0 + 2.1, h + 0.6, METAL, 6)
    // синий павильон (насосная/воздуходувка) на северной стене + оборудование
    const px = x0 + BW * 0.48
    building(px, z0 - 2.2, 9, 7.5, 5.4, { flat: true, roof: BLUE })
    hq(px + 4.5, px + 13, z0 - 6, z0 + 0.2, 0.25, RIM, 2) // площадка
    for (let i = 0; i < 4; i++) box(px + 6 + i * 1.8, px + 7.2 + i * 1.8, z0 - 4.5, z0 - 3.2, 0, 1.4, METAL, 4)
  }
  for (const [z0, z1] of BLOCKS) aerBlock(z0, z1)

  // ── запад: механическая очистка и здания с синими кровлями ──
  building(-90, 42, 16, 26, 7, { flat: true, roof: BLUE }) // корпус (большая синяя кровля)
  building(-90, 10, 13, 11, 7.5, { flat: true, roof: BLUE }) // здание решёток
  tank(-106, 10, 10, 14, { h: 3, cells: 3, water: AER, bridges: [0.5] }) // песколовки
  tank(-76, 12, 8, 12, { h: 3.4, water: AER }) // приёмная камера
  building(-76, -6, 8, 6, 5, { flat: true, roof: BLUE }) // насосная
  tank(-76, -17, 8, 10, { h: 3, water: AER }) // резервуар
  building(-96, -40, 6, 6, 6.5, { flat: true, roof: BLUE }) // павильоны
  building(-84, -52, 5, 5, 4.5, { flat: true, roof: BLUE })
  building(-104, -64, 14, 8, 4, { ridge: 1.6 }) // гараж/склад
  // трубопроводы от механической очистки к блокам
  cyl([-70, 1.2, 12], [-55, 1.2, 12], 0.35, PIPE, 3)
  cyl([-70, 1.2, -17], [-55, 1.2, -17], 0.35, PIPE, 3)

  // ── восток: иловые площадки (тёмные прямоугольные карты) ──
  const bed = (x0, x1, z0, z1, cells) => {
    foot.push([x0, x1, z0, z1])
    hq(x0, x1, z0, z1, 0.3, SLUDGE, 0.95, (a, b) => {
      const X = x0 + a * (x1 - x0), Z = z0 + b * (z1 - z0)
      const v = Math.sin(X * 0.18 + Math.sin(Z * 0.12) * 3) * Math.cos(Z * 0.21 + X * 0.05)
      return v > 0.45 ? SLUDGE2 : SLUDGE
    })
    wx(x0, x1, z0, 0, 1.2, CONC, 2); wx(x0, x1, z1, 0, 1.2, CONC, 2)
    wz(z0, z1, x0, 0, 1.2, CONC, 2); wz(z0, z1, x1, 0, 1.2, CONC, 2)
    for (let i = 1; i < cells; i++) {
      const x = x0 + ((x1 - x0) * i) / cells
      wz(z0, z1, x, 0, 1.2, CONC, 2); hq(x - 0.6, x + 0.6, z0, z1, 1.2, RIM, 3)
    }
  }
  bed(54, 112, -64, -22, 2)
  bed(54, 112, -14, 24, 2)
  bed(54, 112, 32, 68, 2)

  // ── север за проездом: хозпостройки, длинный склад, подстанция и ЛЭП ──
  building(-62, -106, 10, 7, 4.2, { ridge: 1.8 })
  building(-30, -112, 12, 8, 4.5, { ridge: 2 })
  building(26, -116, 9, 34, 4.2, { alongZ: true, ridge: 1.8 }) // длинный склад
  const SUB = [72, 96, -122, -104] // подстанция
  hq(SUB[0], SUB[1], SUB[2], SUB[3], 0.2, ROAD, 1)
  foot.push([SUB[0], SUB[1], SUB[2], SUB[3]])
  for (let i = 0; i < 3; i++) box(75 + i * 7, 79 + i * 7, -118, -114, 0, 3, METAL, 4)
  for (const z of [SUB[2], SUB[3]]) rail([SUB[0], 2, z], [SUB[1], 2, z])
  for (const x of [SUB[0], SUB[1]]) rail([x, 2, SUB[2]], [x, 2, SUB[3]])
  // решётчатая опора ЛЭП (усечённая пирамида + траверсы)
  const tower = (x, z, H) => {
    const b = 3.2, t = 0.8
    const L = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    for (let i = 0; i < 4; i++) {
      const [ax, az] = L[i], [bx2, bz2] = L[(i + 1) % 4]
      cyl([x + ax * b, 0, z + az * b], [x + ax * t, H, z + az * t], 0.12, METAL, 12)
      for (let y = 0; y < H - 2; y += 4) { // раскосы
        const r0 = b + (t - b) * (y / H), r1 = b + (t - b) * ((y + 4) / H)
        rail([x + ax * r0, y, z + az * r0], [x + bx2 * r1, y + 4, z + bz2 * r1])
      }
    }
    for (const [y, w] of [[H * 0.72, 7], [H * 0.86, 5.5], [H, 4]]) cyl([x - w, y, z], [x + w, y, z], 0.14, METAL, 12)
    return [[x - 7, H * 0.72], [x + 7, H * 0.72], [x - 4, H]]
  }
  const LEP = [[-170, -142], [-90, -140], [-10, -138], [70, -136], [150, -134]]
  const tops = LEP.map(([x, z]) => tower(x, z, 28))
  for (let i = 0; i < LEP.length - 1; i++) { // провода с провисом
    for (let w = 0; w < 3; w++) {
      const [xa, ya] = tops[i][w], [xb, yb] = tops[i + 1][w], za = LEP[i][1], zb = LEP[i + 1][1]
      add(Math.hypot(xb - xa, zb - za) * 0.25, 1.6, (n) => {
        for (let j = 0; j < n; j++) {
          const t = rnd()
          put(xa + (xb - xa) * t, ya + (yb - ya) * t - 4 * t * (1 - t) * 4, za + (zb - za) * t, RIM)
        }
      })
    }
  }
  tower(84, -112, 18) // концевая опора у подстанции
  for (let w = 0; w < 2; w++) cyl([70 + (w ? 7 : -7), 20, -136], [84 + (w ? 7 : -7), 13, -112], 0.05, RIM, 20)

  // ── ограждение площадки с воротами на восточной дороге ──
  const fen = [[PX0, PZ0], [PX1, PZ0], [PX1, PZ1], [PX0, PZ1], [PX0, PZ0]]
  for (let sI = 0; sI < 4; sI++) {
    const [ax, az] = fen[sI], [bx, bz] = fen[sI + 1]
    const L = Math.hypot(bx - ax, bz - az)
    const seg = (t0, t1) => {
      const p = (t) => [ax + ((bx - ax) * t) / L, az + ((bz - az) * t) / L]
      const [x0, z0] = p(t0), [x1, z1] = p(t1)
      rail([x0, 2, z0], [x1, 2, z1]); rail([x0, 0.1, z0], [x1, 0.1, z1])
      quad([x0, 0.1, z0], [x1 - x0, 0, z1 - z0], [0, 1.9, 0], METAL, 0.18) // сетка
    }
    const gate = sI === 2 ? PX1 - RE : -1 // южная сторона идёт с востока на запад
    if (gate > 0) { seg(0, gate - 5); seg(gate + 5, L) } else seg(0, L)
    for (let t = 0; t <= L; t += 3) {
      const x = ax + ((bx - ax) * t) / L, z = az + ((bz - az) * t) / L
      if (sI === 2 && Math.abs(x - RE) < 5) continue
      rail([x, 0, z], [x, 2.1, z])
    }
  }

  // ── деревья: сосна (конус) и берёза (эллипсоид, светлый ствол) ──
  const tree = (x, z, sc, pine) => {
    const y0 = groundY(x, z)
    const H = (pine ? 16 : 13) * sc * (0.85 + rnd() * 0.3)
    const R = pine ? H * 0.17 : H * 0.24
    cyl([x, y0, z], [x, y0 + H * (pine ? 0.55 : 0.45), z], 0.16 * sc, pine ? TRUNK : BIRCH_TRUNK, 3)
    if (pine) {
      const c0 = y0 + H * 0.45, ch = H * 0.55
      add(3.1416 * R * Math.hypot(R, ch), 0.75, (n) => {
        for (let i = 0; i < n; i++) {
          const t = Math.pow(rnd(), 1.4), rr = R * (1 - t) * Math.pow(rnd(), 0.25), g = rnd() * 6.2832
          put(x + Math.cos(g) * rr, c0 + t * ch, z + Math.sin(g) * rr, PINE)
        }
      })
    } else {
      const cy = y0 + H * 0.68
      add(4 * 3.1416 * R * R * 0.8, 0.75, (n) => {
        for (let i = 0; i < n; i++) {
          const g = rnd() * 6.2832, b = Math.acos(2 * rnd() - 1), rr = R * Math.pow(rnd(), 0.22)
          put(x + Math.sin(b) * Math.cos(g) * rr, cy + Math.cos(b) * rr * 1.3, z + Math.sin(b) * Math.sin(g) * rr, BIRCH)
        }
      })
    }
  }
  // лесополоса вдоль северного ограждения (как на кадрах), западная и восточная
  for (let i = 0; i < 150; i++) {
    const x = PX0 + rnd() * (PX1 - PX0), z = PZ0 - 4 - rnd() * 8
    if (Math.abs(x - 26) < 8) continue
    tree(x, z, 0.75 + rnd() * 0.4, rnd() < 0.35)
  }
  for (let i = 0; i < 90; i++) tree(PX0 - 5 - rnd() * 14, PZ0 + rnd() * (PZ1 - PZ0), 0.8 + rnd() * 0.4, rnd() < 0.6)
  for (let i = 0; i < 70; i++) {
    const z = PZ0 + rnd() * (PZ1 - PZ0 + 40)
    tree(PX1 + 5 + rnd() * 12, z, 0.75 + rnd() * 0.4, rnd() < 0.4)
  }
  for (let i = 0; i < 14; i++) tree(-118 + rnd() * 30, -76 + rnd() * 8, 0.6 + rnd() * 0.3, false) // берёзы у гаража
  for (let i = 0; i < 8; i++) tree(-40 + rnd() * 10, -110 + rnd() * 10, 0.7 + rnd() * 0.3, false) // у домов
  for (let i = 0; i < 30; i++) tree(-175 + rnd() * 40, -150 + rnd() * 35, 0.9 + rnd() * 0.4, true) // перелесок

  // ── распределение точек пропорционально взвешенной площади ──
  let total = 0
  for (const p of prims) total += p.a
  let acc = 0, done = 0
  for (const p of prims) {
    acc += p.a
    const target = Math.round((acc / total) * N)
    const n = target - done
    if (n > 0) p.fn(n)
    done = target
  }
  // добивка (если где-то были отбраковки)
  while (k < N) put(PX0 + rnd() * (PX1 - PX0), 0, PZ0 + rnd() * (PZ1 - PZ0), PAD)

  return { positions: pos, colors: col, count: k }
}
