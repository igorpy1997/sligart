#!/bin/bash
# setup_caddy.sh - Скрипт для создания структуры папок Caddy

echo "🚀 Создаем структуру папок для Caddy..."

# Создаем папки для Caddy
mkdir -p caddy/data
mkdir -p caddy/config

# Создаем Caddyfile
cat > caddy/Caddyfile << 'EOF'
# Основной домен из ngrok
{$NGROK_DOMAIN} {
    # Логирование
    log {
        output stdout
        format console
        level INFO
    }

    # Настройки CORS для всех запросов
    header {
        # CORS headers
        Access-Control-Allow-Origin "*"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        Access-Control-Max-Age "86400"

        # Security headers
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # API routes - проксируем на FastAPI backend
    reverse_proxy /api/* {$BACKEND_URL} {
        # Передаем оригинальные headers
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}

        # Настройки для больших запросов
        flush_interval -1

        # Обработка ошибок
        @error status 500 502 503 504
        handle_response @error {
            respond "Backend unavailable" 502
        }
    }

    # Health check для API
    reverse_proxy /health {$BACKEND_URL}
    reverse_proxy /docs {$BACKEND_URL}
    reverse_proxy /redoc {$BACKEND_URL}
    reverse_proxy /openapi.json {$BACKEND_URL}

    # Статические файлы фронтенда
    root * /usr/share/caddy/frontend

    # Обработка SPA (Single Page Application)
    try_files {path} {path}/ /index.html

    # Правильные MIME types
    @html {
        path *.html
    }
    header @html Content-Type "text/html; charset=utf-8"

    @css {
        path *.css
    }
    header @css Content-Type "text/css; charset=utf-8"

    @js {
        path *.js
    }
    header @js Content-Type "application/javascript; charset=utf-8"

    @json {
        path *.json
    }
    header @json Content-Type "application/json; charset=utf-8"

    # Включаем gzip сжатие
    encode {
        gzip 6
        minimum_length 1000
    }

    # Кэширование статических файлов
    @static {
        path *.css *.js *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, max-age=31536000, immutable"
}

# Только ngrok домен - никаких fallback'ов!

EOF

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