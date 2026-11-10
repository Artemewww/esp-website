# ESP — ленточный фильтр-пресс (filter-press). Модель по CAD-рендеру public/images/equipment/belt-filter-press.webp
# Запуск: Blender -b -P tools/render/models/filter-press.py [-- --save]
# Оси: X — длина (0 = торец выгрузки кека с лотком, L = торец гравитационной зоны), Y — ширина (0 = лицевая сторона), Z — вверх. Метры.
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SLUG = 'filter-press'

# ---------- габариты (подбор камеры + совмещение силуэта с вырезкой, IoU 0.94; ширина принята 1.8 м) ----------
W = 1.80      # ширина рамы
L = 3.15      # длина рамы
X1 = 1.785    # длина секции пресса (ограждение высокое)
HG = 2.18     # верх ограждения секции пресса
HT = 1.74     # крышка гравитационной зоны
ZB = 0.61     # низ базовой рамы
CH = 0.16     # высота швеллера базовой рамы
ZF = ZB + CH  # верх базовой рамы
LEG = 0.12
import json as _json
globals().update(_json.loads(os.environ.get('ESP_PARAMS', '{}')))   # подстройка при подборе по силуэту
ZF = ZB + CH

# ---------- геометрия: накопление в bmesh по именам объектов ----------
BM = {}
def bm_of(name):
    if name not in BM: BM[name] = bmesh.new()
    return BM[name]

def box(name, a, b):
    x0, y0, z0 = (min(a[i], b[i]) for i in range(3)); x1, y1, z1 = (max(a[i], b[i]) for i in range(3))
    bm = bm_of(name)
    vs = [bm.verts.new((x, y, z)) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
    idx = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    for f in idx: bm.faces.new([vs[i] for i in f])

def obox(name, c, ax, ay, az, sx, sy, sz):
    """ориентированный параллелепипед: центр c, оси ax/ay/az, полуразмеры."""
    bm = bm_of(name); c = Vector(c); ax, ay, az = Vector(ax).normalized(), Vector(ay).normalized(), Vector(az).normalized()
    vs = [bm.verts.new(c + ax * (sx * i) + ay * (sy * j) + az * (sz * k)) for i in (-1, 1) for j in (-1, 1) for k in (-1, 1)]
    idx = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    for f in idx: bm.faces.new([vs[i] for i in f])

def cyl(name, p0, p1, r, seg=24, cap=True, r1=None):
    bm = bm_of(name); p0, p1 = Vector(p0), Vector(p1); d = (p1 - p0).normalized()
    t = d.orthogonal().normalized(); u = d.cross(t)
    r1 = r if r1 is None else r1
    ring0 = [bm.verts.new(p0 + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * r) for i in range(seg)]
    ring1 = [bm.verts.new(p1 + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * r1) for i in range(seg)]
    for i in range(seg):
        j = (i + 1) % seg; bm.faces.new([ring0[i], ring0[j], ring1[j], ring1[i]])
    if cap:
        bm.faces.new(list(reversed(ring0))); bm.faces.new(ring1)

def tube(name, p0, p1, r, wall, seg=24):
    """труба с толщиной стенки (видимый торец)."""
    bm = bm_of(name); p0, p1 = Vector(p0), Vector(p1); d = (p1 - p0).normalized()
    t = d.orthogonal().normalized(); u = d.cross(t)
    R = []
    for p, rr in ((p0, r), (p1, r), (p1, r - wall), (p0, r - wall)):
        R.append([bm.verts.new(p + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * rr) for i in range(seg)])
    for k in range(4):
        a, b = R[k], R[(k + 1) % 4]
        for i in range(seg):
            j = (i + 1) % seg; bm.faces.new([a[i], a[j], b[j], b[i]])

def ring(name, c, axis, r_out, r_in, th, seg=32):
    a = Vector(axis).normalized(); c = Vector(c)
    tube(name, c - a * th / 2, c + a * th / 2, r_out, r_out - r_in, seg)

def ubeam_x(name, x0, x1, y_out, z0, h, b, t, outward):
    """швеллер вдоль X: стенка на y_out, полки внутрь (outward=+1 -> полки в +Y)."""
    s = outward
    box(name, (x0, y_out, z0), (x1, y_out + s * t, z0 + h))
    box(name, (x0, y_out, z0), (x1, y_out + s * b, z0 + t))
    box(name, (x0, y_out, z0 + h - t), (x1, y_out + s * b, z0 + h))

def ubeam_y(name, y0, y1, x_out, z0, h, b, t, outward):
    s = outward
    box(name, (x_out, y0, z0), (x_out + s * t, y1, z0 + h))
    box(name, (x_out, y0, z0), (x_out + s * b, y1, z0 + t))
    box(name, (x_out, y0, z0 + h - t), (x_out + s * b, y1, z0 + h))

def mesh_panel(name, o, u, v, lu, lv, pitch=0.05, w=0.004):
    """сварная сетка: o — угол, u/v — единичные направления в плоскости, lu/lv — размеры."""
    o, u, v = Vector(o), Vector(u).normalized(), Vector(v).normalized(); n = u.cross(v)
    if os.environ.get('ESP_SOLIDMESH'):   # для сравнения силуэта: сетка как сплошной лист
        obox(name, o + u * (lu / 2) + v * (lv / 2), u, v, n, lu / 2, lv / 2, w / 2); return
    nu = max(1, int(round(lu / pitch))); nv = max(1, int(round(lv / pitch)))
    for i in range(1, nu):
        c = o + u * (lu * i / nu) + v * (lv / 2)
        obox(name, c, u, v, n, w / 2, lv / 2, w / 2)
    for j in range(1, nv):
        c = o + v * (lv * j / nv) + u * (lu / 2) + n * w
        obox(name, c, u, v, n, lu / 2, w / 2, w / 2)

def panel_frame(name, o, u, v, lu, lv, s=0.03):
    o, u, v = Vector(o), Vector(u).normalized(), Vector(v).normalized(); n = u.cross(v)
    for c, hu, hv in ((o + u * (lu / 2) + v * (s / 2), lu / 2, s / 2), (o + u * (lu / 2) + v * (lv - s / 2), lu / 2, s / 2),
                      (o + u * (s / 2) + v * (lv / 2), s / 2, lv / 2), (o + u * (lu - s / 2) + v * (lv / 2), s / 2, lv / 2)):
        obox(name, c, u, v, n, hu, hv, s / 2)

def guard(o, u, v, lu, lv, frame='steel_guard_frame', mesh='steel_guard_mesh'):
    panel_frame(frame, o, u, v, lu, lv)
    mesh_panel(mesh, o, u, v, lu, lv)

X, Y, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)

# ================= БАЗОВАЯ РАМА И ОПОРЫ =================
for (x, y) in ((0, 0), (L - LEG, 0), (0, W - LEG), (L - LEG, W - LEG)):
    box('steel_legs', (x, y, 0), (x + LEG, y + LEG, ZB))
    if (x, y) != (0, 0):  # на ближней опоре в исходнике пластины нет
        box('steel_foot', (x - 0.04, y - 0.04, 0), (x + LEG + 0.04, y + LEG + 0.04, 0.012))
ubeam_x('steel_base', 0, L, 0, ZB, CH, 0.07, 0.008, +1)
ubeam_x('steel_base', 0, L, W, ZB, CH, 0.07, 0.008, -1)
ubeam_y('steel_base', 0.008, W - 0.008, 0, ZB, CH, 0.07, 0.008, +1)
ubeam_y('steel_base', 0.008, W - 0.008, L, ZB, CH, 0.07, 0.008, -1)
ubeam_y('steel_base', 0.008, W - 0.008, X1 - 0.035, ZB, CH, 0.07, 0.008, +1)

# ================= СЕКЦИЯ ПРЕССА: стойки, ограждение =================
P = 0.06
for (x, y) in ((0, 0), (X1 - P, 0), (X1 - P, W - P), (0, W - P)):
    box('steel_posts', (x, y, ZF), (x + P, y + P, HG))
# верхние перила
box('steel_rail', (0, 0, HG - 0.05), (X1, 0.05, HG))
box('steel_rail', (0, W - 0.05, HG - 0.05), (X1, W, HG))
box('steel_rail', (X1 - 0.05, 0, HG - 0.05), (X1, W, HG))
# сетчатые панели: лицевая и задняя (две по высоте), торец снизу под лотком
for y in (0.0, W - 0.03):
    guard((P, y, ZF), X, Z, X1 - 2 * P, HG - 0.05 - ZF)
guard((0.0, P, ZF), Y, Z, W - 2 * P, 1.18 - ZF)

# ================= ГРАВИТАЦИОННАЯ ЗОНА (низкая секция) =================
P2 = 0.05
for (x, y) in ((L - P2, 0), (L - P2, W - P2)):
    box('steel_posts', (x, y, ZF), (x + P2, y + P2, HT - 0.06))
# крышка с отбортовкой
box('steel_cover', (X1 - 0.02, -0.02, HT - 0.004), (L + 0.02, W + 0.02, HT))
box('steel_cover', (X1 - 0.02, -0.02, HT - 0.06), (L + 0.02, -0.017, HT))
box('steel_cover', (L + 0.017, -0.02, HT - 0.06), (L + 0.02, W + 0.02, HT))
box('steel_cover', (X1 - 0.02, W + 0.017, HT - 0.06), (L + 0.02, W + 0.02, HT))
guard((X1, 0.0, ZF), X, Z, L - P2 - X1, HT - 0.06 - ZF)
guard((X1, W - 0.03, ZF), X, Z, L - P2 - X1, HT - 0.06 - ZF)
guard((L - 0.03, P2, ZF), Y, Z, W - 2 * P2, HT - 0.06 - ZF)
# гравитационная лента под крышкой и наклонная направляющая у лицевой сетки
obox('steel_belt', ((X1 + L - 0.1) / 2, W / 2, 1.47), X, Y, Z, (L - 0.1 - X1) / 2, (W - 0.44) / 2, 0.004)
for y in (0.12, W - 0.12):
    box('steel_beam', (X1, y - 0.03, 1.38), (L - 0.05, y + 0.03, 1.45))
a0, a1 = Vector((X1 + 0.3, 0.12, 0.80)), Vector((L - 0.06, 0.12, 1.22))
dd = (a1 - a0).normalized()
obox('steel_beam', (a0 + a1) / 2, dd, Y, dd.cross(Y), (a1 - a0).length / 2, 0.06, 0.04)

# ================= ТОРЕЦ ВЫГРУЗКИ: валы, балка, лоток, привод =================
BW0, BW1 = 0.22, W - 0.22   # пределы ленты/валов по ширине
# боковые щёки пресса (вертикальные листы по обе стороны ленты)
# боковые рамы пресса (открытые, из трубы) по обе стороны ленты
for y in (0.14, W - 0.20):
    for x in (0.02, 0.40, 1.60):
        box('steel_side', (x, y, ZF), (x + 0.06, y + 0.06, 1.80))
    for z in (1.36, 1.74):
        box('steel_side', (0.02, y, z), (1.66, y + 0.06, z + 0.06))
# балка с болтами над лотком (торец, верх ~1.88)
box('steel_beam', (-0.02, 0.10, 1.76), (0.10, W - 0.10, 1.88))
for i in range(7):
    yy = 0.2 + (W - 0.4) * i / 6
    cyl('steel_bolts', (-0.021, yy, 1.82), (-0.035, yy, 1.82), 0.012, 12)
# разгрузочный вал под балкой и верхний вал
cyl('steel_roller', (0.10, BW0, 1.52), (0.10, BW1, 1.52), 0.12, 40)
cyl('steel_roller', (0.16, BW0, 1.98), (0.16, BW1, 1.98), 0.09, 40)
for yy in (BW0 - 0.07, BW1 + 0.07):
    cyl('steel_roller', (0.10, yy - 0.07, 1.52), (0.10, yy + 0.07, 1.52), 0.045, 20)
# поперечная балка натяжения сверху (X~1.15) с пневмоцилиндрами
box('steel_beam', (1.10, 0.10, 2.00), (1.22, W - 0.10, 2.10))
box('steel_beam', (0.98, 0.10, 2.06), (1.04, W - 0.10, 2.12))
# верхняя лента: от верхнего вала до балки натяжения, далее вниз к пакету валов
obox('steel_belt', ((0.16 + 1.05) / 2, W / 2, 2.07 - 0.04), (1, 0, -0.09), Y, (0.09, 0, 1), (1.05 - 0.16) / 2, (BW1 - BW0) / 2, 0.004)
obox('steel_belt', ((0.04 + 1.6) / 2, W / 2, 1.40), X, Y, Z, (1.6 - 0.04) / 2, (BW1 - BW0) / 2, 0.004)
# лоток выгрузки кека
lt, lb = Vector((-0.25, 0, 1.36)), Vector((-0.72, 0, 0.93))
d = (lb - lt).normalized(); n = Vector((d.z, 0, -d.x))
obox('steel_chute', (lt + lb) / 2 + Vector((0, W / 2, 0)), d, Y, n, (lb - lt).length / 2, W / 2 - 0.06, 0.003)
obox('steel_chute', lb + Vector((0, W / 2, 0)) + n * 0.03, n, Y, d, 0.03, W / 2 - 0.06, 0.003)   # отбортовка
# планка скребка (полоса у верхней кромки лотка) с прорезями крепления
obox('steel_chute', lt + d * 0.05 + n * 0.006 + Vector((0, W / 2, 0)), d, Y, n, 0.05, W / 2 - 0.06, 0.004)
obox('steel_chute', lt + n * 0.02 + Vector((0, W / 2, 0)), n, Y, d, 0.02, W / 2 - 0.06, 0.003)   # верхняя отбортовка
for i in range(6):
    yy = 0.06 + (W - 0.12) * (i + 0.5) / 6
    obox('black_slots', lt + d * 0.05 + n * 0.011 + Vector((0, yy, 0)), d, Y, n, 0.035, 0.005, 0.002)
# косынки-кронштейны лотка
for y in (0.06, W - 0.09):
    bm = bm_of('steel_chute')
    pts = [(-0.25, 1.36), (0.0, 1.40), (-0.03, 1.74)]
    vs = [bm.verts.new((px, y + dy, pz)) for dy in (0, 0.03) for (px, pz) in pts]
    bm.faces.new(vs[:3]); bm.faces.new(list(reversed(vs[3:])))
    for i in range(3):
        j = (i + 1) % 3; bm.faces.new([vs[i], vs[j], vs[3 + j], vs[3 + i]])
# мотор-редуктор привода на верхней раме
MX, MZ = 0.08, 2.13
cyl('steel_motor', (MX, 1.08, MZ), (MX, 1.42, MZ), 0.10, 32)
cyl('steel_motor', (MX, 0.98, MZ), (MX, 1.08, MZ), 0.105, 32)      # кожух вентилятора
box('steel_motor', (MX - 0.06, 1.28, MZ + 0.08), (MX + 0.06, 1.40, MZ + 0.15))   # клеммная коробка
box('steel_gear', (MX - 0.11, 1.42, MZ - 0.13), (MX + 0.11, 1.64, MZ + 0.11))     # редуктор
box('steel_gear', (MX - 0.12, 1.64, ZF), (MX + 0.12, 1.70, MZ + 0.12))             # щека-кронштейн привода

# ================= ВНУТРЕННИЙ ПАКЕТ ВАЛОВ И ПНЕВМОЦИЛИНДРЫ =================
for (x, z, r) in ((0.55, 1.58, 0.08), (0.85, 1.48, 0.08), (1.15, 1.58, 0.08), (1.45, 1.48, 0.08), (0.60, 1.18, 0.08), (1.00, 1.10, 0.08), (1.40, 1.18, 0.08)):
    cyl('steel_roller', (x, BW0, z), (x, BW1, z), r, 32)
for y in (0.24, W - 0.24):
    cyl('steel_pneu', (1.16, y, 1.62), (1.16, y, 1.92), 0.035, 16)
    cyl('steel_pneu', (1.16, y, 1.92), (1.16, y, 2.00), 0.012, 12)
    cyl('steel_pneu', (0.70, y, 1.62), (1.05, y, 1.62), 0.03, 16)
# поддон фильтрата и патрубок с фланцем
box('steel_tray', (0.08, 0.20, ZF + 0.02), (X1 - 0.08, W - 0.20, ZF + 0.05))
FX = 1.30
cyl('steel_pipe', (FX, 0.42, ZF + 0.03), (FX, 0.42, 0.50), 0.07, 24)
cyl('steel_pipe', (FX, 0.42, 0.50), (FX, 0.06, 0.50), 0.07, 24)
ring('steel_pipe', (FX, 0.05, 0.50), Y, 0.13, 0.06, 0.02)
box('steel_pipe', (FX - 0.06, 0.08, 0.15), (FX + 0.06, 0.10, 0.45))

# ---------- сборка объектов ----------
def build_objects():
    objs = []
    for name, bm in BM.items():
        if os.environ.get('ESP_NOMESH') and 'mesh' in name: continue
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob); objs.append(ob)
        if not any(k in name for k in ('mesh', 'slots', 'belt', 'bolts')):
            m = ob.modifiers.new('Bevel', 'BEVEL'); m.width = 0.003; m.segments = 2; m.limit_method = 'ANGLE'
    return objs

def materials(objs):
    def mat(name, rgb, metal, rough):
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
        b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
        return m
    M = {'steel': mat('ESP_Steel', (0.78, 0.79, 0.8), 1.0, 0.26), 'galv': mat('ESP_Galv', (0.6, 0.62, 0.63), 0.9, 0.45),
         'black': mat('ESP_Black', (0.03, 0.03, 0.035), 0.0, 0.5), 'blue': mat('ESP_Blue', (0.02, 0.09, 0.32), 0.0, 0.35)}
    for o in objs:
        o.data.materials.append(M.get(o.name.split('_')[0], M['steel']))
        for p in o.data.polygons: p.use_smooth = False

BM_KEYS = list(BM.keys())
bpy.ops.wm.read_factory_settings(use_empty=True)
OBJS = build_objects(); materials(OBJS)

if '--save' in sys.argv:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, SLUG + '.blend'))
    os.makedirs(os.path.join(ROOT, 'public', 'models'), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT, 'public', 'models', SLUG + '.glb'), export_format='GLB',
                              export_apply=True, export_yup=True)
