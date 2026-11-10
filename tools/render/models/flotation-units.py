"""ESP flotation unit (DAF) — built from CAD render public/images/equipment/flotation.webp.
Dimensions recovered by camera landmark solve (rim height fixed at 2.4 m):
tank 6.6 x 2.4 m, rim 2.4 m, end (sludge) section from x=5.19, skimmer portal to 3.22 m.
Run: Blender -b -P flotation-units.py -- [compare.png]"""
import bpy, sys, os, math
HERE = os.path.dirname(os.path.abspath(__file__))

# ======== helpers (shared with the other ESP model scripts) ========
import bpy, bmesh, math
from mathutils import Vector, Matrix

MATS = {
    'steel': dict(c=(0.80, 0.81, 0.82, 1), m=1.0, r=0.28),
    'galv': dict(c=(0.62, 0.64, 0.65, 1), m=0.9, r=0.45),
    'blue': dict(c=(0.035, 0.12, 0.30, 1), m=0.2, r=0.4),
    'paint': dict(c=(0.035, 0.12, 0.30, 1), m=0.2, r=0.4),
    'orange': dict(c=(0.90, 0.35, 0.05, 1), m=0.1, r=0.45),
    'black': dict(c=(0.03, 0.03, 0.035, 1), m=0.0, r=0.55),
    'pp': dict(c=(0.85, 0.85, 0.82, 1), m=0.0, r=0.5),
    'glass': dict(c=(0.6, 0.75, 0.85, 1), m=0.0, r=0.05),
    'white': dict(c=(0.88, 0.89, 0.90, 1), m=0.0, r=0.35),
}


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(prefix):
    name = 'esp_' + prefix
    m = bpy.data.materials.get(name)
    if m:
        return m
    d = MATS[prefix]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = d['c']
    b.inputs['Metallic'].default_value = d['m']
    b.inputs['Roughness'].default_value = d['r']
    if prefix == 'glass':
        b.inputs['Alpha'].default_value = 0.35
        b.inputs['Transmission Weight'].default_value = 1.0
    m.diffuse_color = d['c']
    return m


def _link(obj, name, parent=None):
    obj.name = name
    pre = name.split('_')[0]
    if pre in MATS:
        obj.data.materials.clear()
        obj.data.materials.append(mat(pre))
    if parent:
        obj.parent = parent
    return obj


def mesh_obj(name, verts, faces, bevel=0.0, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate()
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    _link(ob, name)
    if bevel > 0:
        add_bevel(ob, bevel)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    return ob


def add_bevel(ob, w, seg=2, angle=40):
    mod = ob.modifiers.new('bevel', 'BEVEL')
    mod.width = w
    mod.segments = seg
    mod.limit_method = 'ANGLE'
    mod.angle_limit = math.radians(angle)
    mod.harden_normals = False
    return mod


def box(name, x0, x1, y0, y1, z0, z1, bevel=0.004):
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
         (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return mesh_obj(name, v, f, bevel)


def boxc(name, c, s, bevel=0.004):
    return box(name, c[0]-s[0]/2, c[0]+s[0]/2, c[1]-s[1]/2, c[1]+s[1]/2, c[2]-s[2]/2, c[2]+s[2]/2, bevel)


def beam(name, p0, p1, w, h=None, bevel=0.003, up=(0, 0, 1)):
    """Square/rect tube from p0 to p1 (centerline), cross-section w x h."""
    h = h or w
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    L = d.length
    ob = box(name, -w/2, w/2, -h/2, h/2, 0, L, bevel)
    z = d.normalized()
    upv = Vector(up)
    if abs(z.dot(upv)) > 0.99:
        upv = Vector((1, 0, 0))
    x = upv.cross(z).normalized()
    y = z.cross(x)
    M = Matrix((x, y, z)).transposed().to_4x4()
    M.translation = p0
    ob.matrix_world = M
    return ob


def cyl(name, p0, p1, r, seg=32, cap=True, bevel=0.0):
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=cap, segments=seg, radius1=r, radius2=r, depth=d.length)
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, d.length/2))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    _link(ob, name)
    z = d.normalized()
    q = Vector((0, 0, 1)).rotation_difference(z)
    ob.matrix_world = Matrix.Translation(p0) @ q.to_matrix().to_4x4()
    if bevel:
        add_bevel(ob, bevel, 2, 60)
    return ob


def tube(name, p0, p1, r, t=0.004, seg=32):
    """Open pipe with wall thickness (solidify)."""
    ob = cyl(name, p0, p1, r, seg, cap=False)
    s = ob.modifiers.new('solid', 'SOLIDIFY')
    s.thickness = t
    s.offset = 1
    return ob


def frustum(name, top, bot, z_top, z_bot, thick=0.0, open_top=True, bevel=0.0):
    """Hollow hopper: top=(x0,x1,y0,y1) at z_top, bot=(x0,x1,y0,y1) at z_bot."""
    a = [(top[0], top[2], z_top), (top[1], top[2], z_top), (top[1], top[3], z_top), (top[0], top[3], z_top)]
    b = [(bot[0], bot[2], z_bot), (bot[1], bot[2], z_bot), (bot[1], bot[3], z_bot), (bot[0], bot[3], z_bot)]
    v = a + b
    f = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7), (7, 6, 5, 4)]
    if not open_top:
        f.append((0, 3, 2, 1))
    ob = mesh_obj(name, v, f)
    if thick:
        s = ob.modifiers.new('solid', 'SOLIDIFY')
        s.thickness = thick
    if bevel:
        add_bevel(ob, bevel)
    return ob


def open_box(name, x0, x1, y0, y1, z0, z1, t=0.004, bottom=True, bevel=0.003):
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
         (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    if bottom:
        f.append((0, 3, 2, 1))
    ob = mesh_obj(name, v, f)
    s = ob.modifiers.new('solid', 'SOLIDIFY')
    s.thickness = t
    s.offset = -1
    if bevel:
        add_bevel(ob, bevel)
    return ob


def flange(name, c, axis, r_out, r_in, t):
    c = Vector(c)
    a = Vector(axis).normalized()
    return tube(name, c - a*t/2, c + a*t/2, r_in, r_out - r_in)


def setup_camera(cam, size):
    """cam = [x,y,z,rx,ry,rz,f_px] from landmark solve; size=(w,h)."""
    sc = bpy.context.scene
    cd = bpy.data.cameras.new('cam')
    cd.sensor_fit = 'HORIZONTAL'
    cd.sensor_width = 36
    cd.lens = cam[6] * 36 / size[0]
    cd.clip_end = 500
    co = bpy.data.objects.new('cam', cd)
    sc.collection.objects.link(co)
    co.location = cam[:3]
    co.rotation_euler = cam[3:6]
    sc.camera = co
    sc.render.resolution_x, sc.render.resolution_y = size
    sc.render.resolution_percentage = 100
    return co


def render_compare(path, samples=16):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_WORKBENCH'
    sh = sc.display.shading
    sh.light = 'STUDIO'
    sh.color_type = 'MATERIAL'
    sh.show_cavity = True
    sh.cavity_type = 'BOTH'
    sh.show_object_outline = False
    sc.display.render_aa = '8'
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    try:
        sc.eevee.taa_render_samples = samples
    except Exception:
        pass
    w = bpy.data.worlds.new('w')
    w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.5, 0.5, 0.52, 1)
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0
    sc.world = w
    for rot, en in [((0.9, 0.2, 0.6), 2.2), ((1.1, 0, -2.2), 0.8)]:
        ld = bpy.data.lights.new('sun', 'SUN')
        ld.energy = en
        lo = bpy.data.objects.new('sun', ld)
        lo.rotation_euler = rot
        sc.collection.objects.link(lo)
    sc.view_settings.view_transform = 'Standard'
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    # remove helper lights/world so they don't end up in exports
    for o in [o for o in sc.objects if o.type == 'LIGHT']:
        bpy.data.objects.remove(o)


def finish(slug, root, shift):
    """Apply modifiers, recentre (shift), save .blend and .glb (Y-up)."""
    sc = bpy.context.scene
    cam = sc.camera
    for o in list(sc.objects):
        if o.type != 'MESH':
            continue
        o.location = (o.location[0] + shift[0], o.location[1] + shift[1], o.location[2] + shift[2]) if o.parent is None else o.location
    if cam:
        cam.location = (cam.location[0] + shift[0], cam.location[1] + shift[1], cam.location[2] + shift[2])
    bpy.ops.wm.save_as_mainfile(filepath=f'{root}/tools/render/models/{slug}.blend')
    # export: meshes only, modifiers applied
    bpy.ops.object.select_all(action='DESELECT')
    for o in sc.objects:
        o.select_set(o.type == 'MESH')
    bpy.ops.export_scene.gltf(filepath=f'{root}/public/models/{slug}.glb', export_format='GLB',
                              use_selection=True, export_apply=True, export_yup=True,
                              export_cameras=False, export_lights=False)


def groin_hopper(name, x0, x1, y0, y1, z_top, z_min, t=0.004, zc=None):
    """Hopper bottom formed by two crossing V-valleys (z = min(f(x), g(y))):
    every side panel ends in a V with its tip at the side midpoint, apex at centre."""
    xc, yc = (x0+x1)/2, (y0+y1)/2
    zc = z_min if zc is None else zc
    C = (xc, yc, zc)
    corners = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    mids = [(xc, y0), (x1, yc), (xc, y1), (x0, yc)]
    v, f = [], []
    def add(p):
        v.append(p); return len(v)-1
    ci = add(C)
    ct = [add((x, y, z_top)) for x, y in corners]
    cb = [add((x, y, z_top)) for x, y in corners]
    mi = [add((x, y, z_min)) for x, y in mids]
    for k in range(4):
        a, m, b = ct[k], mi[k], ct[(k+1) % 4]
        # side panel: vertical V from corner a -> mid tip -> corner b
        f.append((a, m, b))
        # bottom facets
        f.append((a, ci, m))
        f.append((m, ci, b))
    ob = mesh_obj(name, v, f)
    me = ob.data
    import bmesh as _bm
    bm = _bm.new(); bm.from_mesh(me); _bm.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.to_mesh(me); bm.free()
    if t:
        s = ob.modifiers.new('solid', 'SOLIDIFY'); s.thickness = t
    return ob

# ======== model ========

ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []

L, W, HR = 6.6, 2.4, 2.4
XP = 5.19                    # end section start
POSTS = [0.0, 1.40, 2.38, 3.28, 4.18, XP, L]
GROUND_POSTS = [0.0, 1.40, XP, L]
ZB_L, ZB_E = 0.48, 0.80      # wall bottoms (flotation zone / end zone)
XD, ZI_E = 1.33, 1.77        # inclined bottom: from (XD, ZB_L) up to (XP, ZI_E)
ZH_L, ZT_E = 0.44, 0.10      # hopper outlet levels
ZBASE = 0.12                 # base frame rail centre
T = 0.004                    # sheet
TU = 0.06                    # frame tube

reset()

# ---------------- tank shell ----------------
# flotation zone: deep inlet hopper zone (x < XD) then a bottom inclined up towards the end zone
def zbot(x):
    return ZB_L if x <= XD else ZB_L + (x - XD) * (ZI_E - ZB_L) / (XP - XD)
wall = []
for y in (0.0, W):
    wall.append([(0, y, ZB_L), (XD, y, ZB_L), (XP, y, ZI_E), (XP, y, HR), (0, y, HR)])
v = wall[0] + wall[1]
f = [(0, 1, 2, 3, 4), (9, 8, 7, 6, 5), (0, 4, 9, 5), (1, 6, 7, 2), (2, 7, 8, 3)]
tm = mesh_obj('steel_tank_main', v, f)
import bmesh as _bm
_b = _bm.new(); _b.from_mesh(tm.data); _bm.ops.recalc_face_normals(_b, faces=_b.faces); _b.to_mesh(tm.data); _b.free()
_s = tm.modifiers.new('solid', 'SOLIDIFY'); _s.thickness = T
add_bevel(tm, 0.003)
open_box('steel_tank_end', XP, L, 0, W, ZB_E, HR, T, bottom=False)
# deep inlet zone: two pyramids across the width feeding the two collectors
for j, (ya, yb) in enumerate([(0, W/2), (W/2, W)]):
    yo = (0.42, 1.50)[j]
    frustum(f'steel_hopper_{j}', (0, XD, ya, yb), (XD/2-0.06, XD/2+0.06, yo-0.06, yo+0.06), ZB_L, ZH_L, T)
# end (sludge) zone: crossing-valley hopper, V tips at side midpoints
for j, (ya, yb) in enumerate([(0, W/2), (W/2, W)]):
    groin_hopper(f'steel_hopper_end_{j}', XP, L, ya, yb, ZB_E, ZT_E, T)
    cyl(f'steel_hopper_end_out_{j}', ((XP+L)/2, (ya+yb)/2, 0.06), ((XP+L)/2, (ya+yb)/2, ZT_E+0.01), 0.05)

# rim lip
LIP = 0.09
LIPL = 0.25  # wider flange on the inlet end
for nm, a in [('f', (-LIPL, L+LIP, -LIP, 0)), ('b', (-LIPL, L+LIP, W, W+LIP)), ('l', (-LIPL, 0, 0, W)), ('r', (L, L+LIP, 0, W))]:
    box(f'steel_rim_{nm}', a[0], a[1], a[2], a[3], HR-0.006, HR, 0.002)
box('steel_rim_edge_f', -LIPL, L+LIP, -LIP, -LIP+0.006, HR-0.05, HR, 0.002)
box('steel_rim_edge_b', -LIPL, L+LIP, W+LIP-0.006, W+LIP, HR-0.05, HR, 0.002)
box('steel_rim_edge_l', -LIPL, -LIPL+0.006, -LIP, W+LIP, HR-0.05, HR, 0.002)

# internal partitions (visible cells under the skimmer)
box('steel_part_long', 0.05, XP, 1.0, 1.0+T, 1.25, HR-0.05, 0.001)
for k, x in enumerate([1.40, 2.38, 3.28, 4.18]):
    box(f'steel_part_{k}', x, x+T, 0.02, 1.0, 1.25, HR-0.12, 0.001)
box('steel_part_end', XP, XP+T, 0.02, W-0.02, ZB_E, HR-0.05, 0.001)

# posts / stiffeners on long sides and ends
for x in POSTS:
    z0 = 0.0 if x in GROUND_POSTS else zbot(x)
    if x == XP or x == L:
        z0 = 0.0
    for y in (-TU/2, W+TU/2):
        xx = min(max(x, TU/2), L-TU/2)
        beam(f'steel_post_{x:.2f}_{y:.1f}', (xx, y, z0), (xx, y, HR-0.006), TU)
for y in (W/3, 2*W/3):
    beam(f'steel_endstiff_l_{y:.1f}', (-TU/2, y, ZB_L), (-TU/2, y, HR-0.006), TU*0.8)
# base frame
for y in (-TU/2, W+TU/2):
    beam(f'steel_base_long_{y:.1f}', (-TU/2, y, ZBASE), (L+TU/2, y, ZBASE), TU)
for x in GROUND_POSTS:
    xx = min(max(x, TU/2), L-TU/2)
    beam(f'steel_base_x_{x:.2f}', (xx, -TU, ZBASE), (xx, W+TU, ZBASE), TU)
# saddle beams under the hopper rims
for x in (0.0, XD):
    xx = min(max(x, TU/2), L)
    beam(f'steel_saddle_{x:.2f}', (xx, -TU/2, ZB_L - TU/2), (xx, W+TU/2, ZB_L - TU/2), TU*0.8)
beam('steel_saddle_e', (L-TU/2, -TU/2, ZB_E - TU/2), (L-TU/2, W+TU/2, ZB_E - TU/2), TU*0.8)
for y in (-TU/2, W+TU/2):
    beam(f'steel_saddle_long_{y:.1f}', (0, y, ZB_L - TU/2), (XD, y, ZB_L - TU/2), TU*0.8)
    beam(f'steel_slope_rail_{y:.1f}', (XD, y, ZB_L - TU/2), (XP, y, ZI_E - TU/2), TU*0.8)

# ---------------- collectors (2 pipes + butterfly valves) ----------------
for j, y in enumerate((0.42, 1.50)):
    zp = 0.36
    tube(f'steel_collector_{j}', (XD/2, y, zp), (3.30, y, zp), 0.085, 0.004)
    cyl(f'steel_hopper_out_{j}', (XD/2, y, zp), (XD/2, y, ZH_L+0.01), 0.06)
    flange(f'steel_coll_fl_{j}', (3.32, y, zp), (1, 0, 0), 0.125, 0.08, 0.04)
    flange(f'steel_valve_body_{j}', (3.12, y, zp), (1, 0, 0), 0.12, 0.07, 0.07)
    cyl(f'steel_valve_stem_{j}', (3.12, y, zp+0.08), (3.12, y, zp+0.2), 0.02)
    cyl(f'steel_actuator_{j}', (2.94, y, zp+0.30), (3.30, y, zp+0.30), 0.085)
    cyl(f'steel_coll_cap_{j}', (XD/2-0.03, y, zp), (XD/2, y, zp), 0.09)
# nozzles on the end zone (front)
for k, z in enumerate((0.95, 0.65)):
    y0 = 0.0 if z > ZB_E else 0.12
    cyl(f'steel_nozzle_{k}', (5.5, y0, z), (5.5, y0-0.14, z), 0.045)
    flange(f'steel_nozzle_fl_{k}', (5.5, y0-0.14, z), (0, 1, 0), 0.08, 0.045, 0.018)

# ---------------- sludge funnel on the end wall ----------------
frustum('steel_sludge_funnel', (L, 7.37, 0.2, 2.2), (6.80, 7.0, 1.10, 1.30), HR, 1.25, T)
box('steel_funnel_lip', L, 7.40, 0.17, 2.23, HR-0.006, HR, 0.002)
tube('steel_funnel_pipe', (6.9, 1.2, 1.27), (6.9, 1.2, 0.95), 0.07, 0.004)
flange('steel_funnel_fl', (6.9, 1.2, 0.95), (0, 0, 1), 0.11, 0.07, 0.02)

# ---------------- skimmer portal + chain scraper ----------------
PX0, PX1, PZ = 0.54, 7.0, 3.22
for x in (PX0, PX1):
    for y in (0.0, W):
        beam(f'steel_portal_post_{x:.1f}_{y:.1f}', (x, y, HR), (x, y, PZ), TU)
    beam(f'steel_portal_cross_{x:.1f}', (x, -TU/2, PZ), (x, W+TU/2, PZ), TU)
for y in (0.0, W):
    beam(f'steel_portal_long_{y:.1f}', (PX0-TU/2, y, PZ), (PX1+TU/2, y, PZ), TU)
beam('steel_portal_mid', (3.05, -TU/2, PZ), (3.05, W+TU/2, PZ), TU)
# scraper hood: long inclined cover plate over the chain + flights
HY0, HZ0, HY1, HZ1 = 0.55, 2.78, 1.75, 3.12
mesh_obj('steel_skimmer_hood', [(PX0+0.1, HY0, HZ0), (PX1-0.05, HY0, HZ0), (PX1-0.05, HY1, HZ1), (PX0+0.1, HY1, HZ1)], [(0, 1, 2, 3)])
bpy.data.objects['steel_skimmer_hood'].modifiers.new('solid', 'SOLIDIFY').thickness = T
for y in (HY0, HY1):
    beam(f'steel_skimmer_edge_{y:.1f}', (PX0+0.1, y, (HZ0 if y == HY0 else HZ1) - 0.02), (PX1-0.05, y, (HZ0 if y == HY0 else HZ1) - 0.02), 0.04)
for x in (PX0+0.2, PX1-0.2):
    cyl(f'steel_scraper_shaft_{x:.1f}', (x, 0.05, 2.70), (x, W-0.05, 2.70), 0.03)
# flights below the hood
for k, x in enumerate((1.3, 2.6, 3.9, 5.2, 6.4)):
    ob = box(f'steel_flight_{k}', -0.004, 0.004, 0.16, W-0.16, -0.14, 0.14, 0.002)
    ob.location = (x, 0, 2.55)
    ob.rotation_euler = (0, math.radians(30), 0)
# inverted-U lifting frames on the hood modules
for k, x in enumerate((1.75, 4.0, 6.2)):
    za, zb = HZ0 + (0.78 - HY0) / (HY1 - HY0) * (HZ1 - HZ0), HZ0 + (1.52 - HY0) / (HY1 - HY0) * (HZ1 - HZ0)
    beam(f'steel_lift_a_{k}', (x, 0.78, za), (x, 0.78, 3.36), 0.035)
    beam(f'steel_lift_b_{k}', (x, 1.52, zb), (x, 1.52, 3.36), 0.035)
    beam(f'steel_lift_t_{k}', (x, 0.76, 3.36), (x, 1.54, 3.36), 0.035)
# drive: gear motor on the near end, back rail
cyl('steel_scraper_motor', (6.55, W+0.05, 3.30), (6.55, W+0.40, 3.30), 0.09)
boxc('steel_scraper_gearbox', (6.55, W+0.02, 3.30), (0.18, 0.12, 0.2), 0.01)
boxc('steel_tensioner', (3.05, W+0.03, 3.28), (0.12, 0.08, 0.1), 0.01)

# ---------------- service platform (back side, near end) ----------------
PXa, PXb, PYa, PYb, PZp = 5.60, 7.27, 2.48, 3.59, 1.40
box('galv_platform_grating', PXa, PXb, PYa, PYb, PZp-0.03, PZp, 0.002)
for y in (PYa, PYb):
    beam(f'steel_plat_edge_x_{y:.1f}', (PXa, y, PZp-0.05), (PXb, y, PZp-0.05), 0.05)
for x in (PXa, PXb):
    beam(f'steel_plat_edge_y_{x:.1f}', (x, PYa, PZp-0.05), (x, PYb, PZp-0.05), 0.05)
RT = 2.69
for x in (PXa, PXb):
    for y in (PYa, PYb):
        top = RT if (x == PXb or y == PYb) else PZp
        beam(f'steel_plat_leg_{x:.1f}_{y:.1f}', (x, y, 0), (x, y, top), 0.045)
for z in (RT, 2.05):
    beam(f'steel_rail_x_{z:.1f}', (PXa, PYb, z), (PXb, PYb, z), 0.04)
    beam(f'steel_rail_y_{z:.1f}', (PXb, PYa, z), (PXb, PYb, z), 0.04)
    beam(f'steel_rail_tank_{z:.1f}', (PXb, PYa, z), (PX1, W, min(z, PZ)), 0.04)

if argv:
    setup_camera([14.963, -9.145, 5.034, 1.337, 0.003, 0.787, 1654.263], (900, 900))
    render_compare(argv[0])
if '--save' in argv or not argv:
    finish('flotation-units', ROOT, (-L/2, -W/2, 0))
