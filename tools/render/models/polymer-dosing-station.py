"""ESP polymer preparation & dosing station — built from CAD render public/images/equipment/polymer-station.webp.
Dimensions recovered by camera landmark solve (tank body height fixed at 1.6 m):
two-part stainless tank 3.6 x 1.62 m (ledge at 0.96 m, top 1.70 m), powder hopper with screw feeder,
two horizontal gear motors, control cabinet, progressive-cavity dosing pump on the floor.
Run: Blender -b -P polymer-dosing-station.py -- [compare.png]"""
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

L, W = 3.60, 1.57
ZF, ZL, ZT = 0.10, 0.964, 1.70     # box bottom (on feet), ledge, top
IN = 0.035                         # upper box inset
T = 0.004

reset()

# ---------------- tank ----------------
box('steel_tank_lower', 0, L, 0, W, ZF, ZL, 0.012)
box('steel_tank_ledge', -0.012, L+0.012, -0.012, W+0.012, ZL-0.03, ZL, 0.006)
box('steel_tank_upper', IN, L-IN, IN, W-IN, ZL, ZT, 0.012)
# lids on top (three chambers) with U handles
lid_x = [IN, 1.45, 2.55, L-IN]
for k in range(3):
    box(f'steel_lid_{k}', lid_x[k]+0.01, lid_x[k+1]-0.01, IN+0.02, W-IN-0.02, ZT, ZT+0.008, 0.002)


def u_handle(name, x, y, along='x', w=0.18, h=0.07):
    if along == 'x':
        a, b = (x-w/2, y), (x+w/2, y)
    else:
        a, b = (x, y-w/2), (x, y+w/2)
    beam(name+'_a', (a[0], a[1], ZT), (a[0], a[1], ZT+h), 0.012)
    beam(name+'_b', (b[0], b[1], ZT), (b[0], b[1], ZT+h), 0.012)
    beam(name+'_t', (a[0], a[1], ZT+h), (b[0], b[1], ZT+h), 0.012)


u_handle('steel_handle_0', 1.11, 0.30)
u_handle('steel_handle_1', 1.92, 0.38)
u_handle('steel_handle_2', 2.11, 1.14)
# level sensor box with guard handle (near end)
boxc('steel_sensor', (3.03, 0.90, ZT+0.07), (0.12, 0.10, 0.12), 0.01)
u_handle('steel_sensor_guard', 3.03, 0.90, 'y', 0.24, 0.16)

# feet
for x in (0.04, L/2, L-0.04):
    for y in (0.04, W-0.04):
        boxc(f'steel_foot_{x:.1f}_{y:.1f}', (x, y, ZF/2), (0.07, 0.07, ZF), 0.004)

# drain stubs at the bottom of the front face
for k, x in enumerate((1.12, 1.78, 2.40, 2.52)):
    cyl(f'steel_drain_{k}', (x, 0.0, 0.17), (x, -0.12, 0.13), 0.018)

# ---------------- powder hopper + screw feeder ----------------
HX, HY = 0.45, 1.05
frustum('steel_hopper_cone', (HX-0.45, HX+0.45, HY-0.38, HY+0.38), (HX-0.30, HX+0.30, HY-0.25, HY+0.25), 2.95, 2.30, T)
box('steel_hopper_rim', HX-0.46, HX+0.46, HY-0.39, HY+0.39, 2.93, 2.95, 0.002)
open_box('steel_hopper_body', HX-0.30, HX+0.30, HY-0.25, HY+0.25, 1.85, 2.30, T, bottom=True)
box('steel_hopper_band', HX-0.315, HX+0.315, HY-0.265, HY+0.265, 2.27, 2.31, 0.004)
for k in range(9):
    t = k / 8
    cyl(f'steel_hopper_bolt_{k}', (HX-0.30+0.60*t, HY-0.265, 2.29), (HX-0.30+0.60*t, HY-0.29, 2.29), 0.008)
# lid handle on hopper top
beam('steel_hopper_lid_a', (HX-0.08, HY, 2.95), (HX-0.08, HY, 3.02), 0.012)
beam('steel_hopper_lid_b', (HX+0.08, HY, 2.95), (HX+0.08, HY, 3.02), 0.012)
beam('steel_hopper_lid_t', (HX-0.08, HY, 3.02), (HX+0.08, HY, 3.02), 0.012)
# supporting legs of the hopper body onto the tank top
for dx in (-0.28, 0.28):
    for dy in (-0.22, 0.22):
        beam(f'steel_hopper_leg_{dx:.1f}_{dy:.1f}', (HX+dx, HY+dy, ZT), (HX+dx, HY+dy, 1.85), 0.03)
# screw feeder tube from hopper outlet into the first chamber + its drive
cyl('steel_feeder_tube', (HX, HY-0.15, 1.98), (HX+0.35, HY-0.45, 1.80), 0.07)
boxc('steel_feeder_gear', (0.78, 0.60, 1.86), (0.16, 0.20, 0.20), 0.01)
cyl('steel_motor1', (0.86, 0.60, 1.86), (1.32, 0.60, 1.86), 0.10, bevel=0.01)
cyl('steel_motor1_fan', (1.32, 0.60, 1.86), (1.44, 0.60, 1.86), 0.105, bevel=0.01)
boxc('steel_motor1_tbox', (1.05, 0.60, 1.99), (0.12, 0.12, 0.07), 0.008)
# agitator drive
boxc('steel_agit_gear', (1.62, 0.70, 1.84), (0.18, 0.22, 0.22), 0.01)
cyl('steel_motor2', (1.72, 0.70, 1.86), (2.18, 0.70, 1.86), 0.10, bevel=0.01)
cyl('steel_motor2_fan', (2.18, 0.70, 1.86), (2.30, 0.70, 1.86), 0.105, bevel=0.01)
boxc('steel_motor2_tbox', (1.92, 0.70, 1.99), (0.12, 0.12, 0.07), 0.008)
boxc('steel_agit_base', (1.62, 0.70, ZT+0.04), (0.30, 0.30, 0.04), 0.004)

# ---------------- control cabinet ----------------
CX0, CX1, CY0, CY1, CZ0, CZ1 = -0.30, 0.33, 0.03, 0.57, 1.76, 2.63
box('steel_cabinet', CX0, CX1, CY0, CY1, CZ0, CZ1, 0.008)
box('blue_cabinet_hmi', CX0+0.06, CX0+0.30, CY0-0.006, CY0, CZ1-0.35, CZ1-0.10, 0.003)
box('black_cabinet_screen', CX0+0.10, CX0+0.26, CY0-0.009, CY0-0.006, CZ1-0.22, CZ1-0.12, 0.001)
for k in range(4):
    cyl(f'black_cabinet_btn_{k}', (CX0+0.08+k*0.07, CY0, CZ1-0.47), (CX0+0.08+k*0.07, CY0-0.03, CZ1-0.47), 0.013)
for x in (CX0+0.08, CX1-0.06):
    beam(f'steel_cabinet_leg_{x:.1f}', (x, (CY0+CY1)/2, ZT), (x, (CY0+CY1)/2, CZ0), 0.04)
beam('steel_cabinet_post', (0.42, 0.55, ZT), (0.42, 0.55, CZ1), 0.05)

# ---------------- outlet valve + progressive-cavity dosing pump ----------------
OX = 3.19
cyl('steel_outlet_stub', (OX, 0.0, 0.20), (OX, -0.12, 0.20), 0.035)
flange('steel_outlet_fl', (OX, -0.12, 0.20), (0, 1, 0), 0.07, 0.035, 0.02)
boxc('steel_outlet_valve', (OX, -0.19, 0.20), (0.09, 0.12, 0.09), 0.01)
flange('steel_outlet_fl2', (OX, -0.26, 0.20), (0, 1, 0), 0.07, 0.035, 0.02)
PZ = 0.30
def ax(y, z=PZ):
    """point on the pump axis (axis runs slightly skewed to the tank end face)"""
    return (4.36 - 0.128 * y, y, z)
DIR = (-0.128, 1.0, 0.0)
beam('steel_pump_base', ax(0.38, 0.02), ax(1.25, 0.02), 0.20, 0.04)
cyl('steel_pump_discharge', ax(0.03), ax(0.24), 0.08)
flange('steel_pump_disch_fl', ax(0.02), DIR, 0.12, 0.03, 0.03)
cyl('steel_disch_pipe', ax(0.02), ax(-0.63), 0.022)
flange('steel_disch_fl', ax(-0.12), DIR, 0.06, 0.022, 0.02)
cyl('steel_pump_stator', ax(0.24), ax(0.70), 0.06)
cyl('steel_pump_suction', ax(0.70), ax(0.96), 0.09)
cyl('steel_pump_inlet', ax(0.83), ax(0.83, 0.47), 0.035)
flange('steel_pump_inlet_fl', ax(0.83, 0.47), (0, 0, 1), 0.07, 0.035, 0.02)
cyl('steel_pump_lantern', ax(0.96), ax(1.08), 0.065)
beam('steel_pump_flange_plate', ax(1.08), ax(1.12), 0.28, 0.28)
cyl('steel_pump_gear', ax(1.12), ax(1.34), 0.12, bevel=0.01)
cyl('steel_pump_motor', ax(1.34), ax(1.66), 0.11, bevel=0.01)
for y in (0.45, 1.00):
    beam(f'steel_pump_support_{y:.1f}', ax(y, 0.04), ax(y, PZ-0.06), 0.16, 0.05)
# suction line: tank outlet valve -> floor -> pump inlet flange
cyl('steel_suction_a', (OX, -0.27, 0.20), (OX, -0.27, 0.12), 0.03)
cyl('steel_suction_b', (OX, -0.27, 0.12), (3.95, -0.27, 0.12), 0.03)
cyl('steel_suction_c', (3.95, -0.27, 0.12), (3.95, 0.83, 0.12), 0.03)
cyl('steel_suction_d', (3.95, 0.83, 0.12), (3.95, 0.83, 0.52), 0.03)
cyl('steel_suction_e', (3.95, 0.83, 0.52), ax(0.83, 0.52), 0.03)
cyl('steel_suction_f', ax(0.83, 0.52), ax(0.83, 0.48), 0.03)
# overflow slot on the upper front face
box('black_overflow_slot', 2.92, 3.40, IN-0.003, IN, 1.32, 1.35, 0.002)

if argv:
    setup_camera([10.29, -6.80, 3.926, 1.333, 0.007, 0.815, 1719.228], (735, 735))
    render_compare(argv[0])
if '--save' in argv or not argv:
    finish('polymer-dosing-station', ROOT, (-L/2, -W/2, 0))
