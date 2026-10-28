#!/usr/bin/env bash
# Сборка сайта для hoster.by (шаредный тариф: Apache + PHP, без Node).
#
#   bash hosting/build.sh
#
# Результат — папка deploy/: статические страницы, .htaccess и PHP-часть
# админки (deploy/api). Медиа в deploy/ не дублируется — .cpanel.yml
# копирует public/ и deploy/ в корень домена.
set -euo pipefail
cd "$(dirname "$0")/.."

npx nuxt generate

rm -rf deploy
mkdir deploy
# Только то, что появилось при сборке: всё из public/ сервер берёт сам.
(cd public && ls -A) | sed 's#^#/#' > /tmp/esp-public-entries
rsync -a --exclude-from=/tmp/esp-public-entries .output/public/ deploy/
# Пререндер мог сохранить ответы /api как файлы — на хостинге их отдаёт PHP.
rm -rf deploy/api
# Админка — чистая SPA: её отдаёт 200.html (см. .htaccess). Отрисованная
# заранее страница тянула бы данные сборки и падала с ошибкой 500.
rm -rf deploy/admin

cp hosting/.htaccess deploy/.htaccess
mkdir -p deploy/api
cp hosting/api/index.php hosting/api/.user.ini deploy/api/
node hosting/export-content.mjs deploy/api/_data

rm -rf .output
echo "Готово: deploy/ ($(du -sh deploy | cut -f1))"
