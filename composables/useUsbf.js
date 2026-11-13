// Где применяется USBF: станция биологической очистки ВС (bs-bio-station) и
// объекты, где она стоит (relatedProjects в каталоге). Наклейка USBF ставится
// только туда — без догадок.
import { equipmentList as equipment } from "~/composables/useEquipment"
const bs = (equipment || []).find((e) => e.slug === 'bs-bio-station')
export const USBF_EQUIP = new Set(['bs-bio-station'])
export const USBF_PROJECTS = new Set(bs?.relatedProjects || [])
export const isUsbfProject = (slug = '') => [...USBF_PROJECTS].some((r) => r === slug || r.startsWith(slug + '-'))
