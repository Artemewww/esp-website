# Откат сайта ecoservisproekt.by

Сайт = ветка `release-by` (cPanel → Git Version Control → Update from Remote → Deploy HEAD Commit).
Любую версию можно вернуть: поставить нужный тег в `release-by` и сделать Update + Deploy в cPanel.

| Тег | Что на сайте |
|---|---|
| `site-live-before-1118` | Сайт до 18.11.2026: новая главная, без старой версии |
| `site-1118-new-home-plus-old` | Новая главная на `/`, старая на `/old-2025`, переключатель версий |
| `site-1118-old-home-plus-new` | Старая главная на `/`, новая на `/home-2026` |

Откат одной командой (потом Update + Deploy в cPanel):

    git push -f origin site-live-before-1118:refs/heads/release-by

Исходники: ветка `dji-2026`. Старая главная — `pages/old-2025.vue` + `layouts/legacy.vue`
+ `components/legacy/*`; переключатель — `components/ui/VersionSwitch.vue`.
Поменять местами главные: переименовать `pages/index.vue` ↔ `pages/old-2025.vue`
и поправить ссылки в `VersionSwitch.vue` (и `route.path` в `components/layout/Header.vue`).
