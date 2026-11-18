#!/bin/zsh
# Собирает коммит для ветки release-by (её забирает cPanel на hoster.by) и пушит.
# Дерево = текущая origin/release-by, в которой папка deploy/ заменяется свежей
# сборкой (hosting/build.sh), плюс явный список файлов из public/, которых нет
# в deploy/ (видео лежат вне git — public/videos это симлинк).
# Новая папка с картинками/видео в public/ → добавить её в EXTRA, иначе 404 на сайте.
# Использование: zsh hosting/mkrelease.sh "Сообщение релиза"
set -e
setopt nullglob
cd ~/esp-dji
MSG=${1:-"Release"}
git fetch -q origin release-by
export GIT_INDEX_FILE=$(mktemp -t esp-rel-index)
rm -f "$GIT_INDEX_FILE"
git read-tree origin/release-by
git ls-files -- deploy | git update-index --force-remove --stdin
find deploy -type f | while read p; do h=$(git hash-object -w "$p"); git update-index --add --cacheinfo 100644,$h,"$p"; done
EXTRA=(
  composables/useSiteNav.js
  public/images/menu/*.webp
  $(find -L public/videos public/media \( -name "*-m.mp4" -o -name "*-p.mp4" \))
  public/videos/films/fanipol.mp4 public/videos/films/fanipol.jpg
  public/images/projects/godylevo/g-0*.webp
  public/images/projects/*/build/*.webp
  public/images/projects/*/foto/*.webp
  public/videos/loop/DJI_0715.mp4
  public/images/developer/*.webp
)
for p in $EXTRA; do [ -f "$p" ] || continue; h=$(git hash-object -w "$p"); git update-index --add --cacheinfo 100644,$h,"$p"; done
T=$(git write-tree)
C=$(git commit-tree $T -p origin/release-by -m "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>")
git push -q origin "${C}:refs/heads/release-by"
rm -f "$GIT_INDEX_FILE"
echo "$C"
