import { projectRegistry } from '~/composables/useProjectRegistry'

// Coordinates kept for backward compatibility (featured rich cases).
export const projectGeo = {
  'minsk-vodokanal-modernization': [27.5615, 53.9006],
  'agrokombinat-snov': [25.3197, 53.0881],
  'oil-refinery-flotation': [32.4, 54.0],
  'savushkin-dairy': [24.4667, 52.5667],
  'mayak-residential': [27.65, 53.85],
  'azs-network-orl': [23.0, 53.0],
  'gorodok-reconstruction': [30.0430, 52.8907],
  'petrikov-bio-station': [28.4886, 52.1319],
  'vitebsk-broiler': [30.2049, 55.1904],
  'krichev-vodokanal': [31.7167, 53.6864],
  'vishnevets-kns': [26.7423, 53.4874],
  'gorodishche-houses': [27.3, 53.85]
}

// The map now shows every real object from the legacy site registry (240 points).
// Featured objects carry a featuredSlug and link to their detailed case page.
export const useProjectGeo = () => {
  const mapPoints = projectRegistry.map(p => ({
    lng: p.lng,
    lat: p.lat,
    name: p.name,
    location: p.location,
    region: p.region,
    capacity: p.capacity,
    category: p.category,
    facility: p.facility,
    featuredSlug: p.featuredSlug || null
  }))

  return { projectGeo, mapPoints }
}
