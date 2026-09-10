import { isAuthed, adminPassword } from '../../utils/adminAuth'
import { storageMode, contentDir } from '../../utils/contentStore'

export default defineEventHandler((event) => ({
  authed: isAuthed(event),
  configured: Boolean(adminPassword()),
  // Предупреждаем не по типу хранилища, а по окружению: на обычном сервере
  // файловый режим — это и есть боевой, и пугать им человека незачем.
  local: import.meta.dev,
  storage: storageMode(),
  target: storageMode() === 'blob' ? 'Vercel Blob' : contentDir()
}))
