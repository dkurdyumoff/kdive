#!/bin/bash
set -e

MSG="${1:-update landing}"

echo "📦 Добавляю файлы..."
git add dive-safari-v4-retro-light.html dive-safari-content/ CNAME .gitignore .github/

echo "💾 Коммит: $MSG"
git commit -m "$MSG" 2>/dev/null || echo "Нет изменений для коммита"

echo "🚀 Пуш в main..."
git push origin main

echo ""
echo "✅ Готово! GitHub Actions задеплоит сайт на kdive.ru (~1-2 мин)"
echo "   Статус: https://github.com/dkurdyumoff/aimger/actions"
