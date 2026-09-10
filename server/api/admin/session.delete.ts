import { dropSession } from '../../utils/adminAuth'

export default defineEventHandler((event) => {
  dropSession(event)
  return { ok: true }
})
