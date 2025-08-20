#!/bin/bash
# setup_caddy.sh - Скрипт для создания структуры папок Caddy

echo "🚀 Создаем структуру папок для Caddy..."

# Создаем папки для Caddy
mkdir -p caddy/data
mkdir -p caddy/config



echo "✅ Структура создана!"
echo ""
echo "📋 Что делать дальше:"
echo "1. Добавь свой ngrok домен в .env файл:"
echo "   NGROK_DOMAIN=your-domain.ngrok.io"
echo ""
echo "2. Запусти все сервисы:"
echo "   make up"
echo ""
echo "3. Твой фронтенд будет доступен по адресу:"
echo "   https://your-domain.ngrok.io"
echo ""
echo "4. API будет доступен по адресу:"
echo "   https://your-domain.ngrok.io/api/"