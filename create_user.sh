docker compose exec server bash -c "
.venv/bin/python -c \"
import asyncio
import asyncpg
from passlib.context import CryptContext

async def create_admin():
    try:
        username = 'admin'
        password = 'schoolDream20021997'
        email = 'admin@schooltogo.online'

        pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
        hashed_password = pwd_context.hash(password)

        database_url = 'postgresql://ihor:1997@postgres:5432/crm-school'

        print(f'🔐 Создаю админа: {username}')
        print('=' * 30)

        conn = await asyncpg.connect(database_url)

        existing = await conn.fetchval('SELECT id FROM users WHERE username = \\\$1', username)
        if existing:
            print(f'⚠️ Пользователь {username} уже существует!')
            await conn.close()
            return

        await conn.execute('''
            INSERT INTO users (username, email, hashed_password, is_active, is_admin, created_at, updated_at)
            VALUES (\\\$1, \\\$2, \\\$3, \\\$4, \\\$5, NOW(), NOW())
        ''', username, email, hashed_password, True, True)

        print(f'✅ Админ создан успешно!')
        print(f'   Логин: {username}')
        print(f'   Пароль: {password}')
        print(f'   Email: {email}')

        await conn.close()

    except Exception as e:
        print(f'❌ Ошибка: {e}')
        import traceback
        traceback.print_exc()

asyncio.run(create_admin())
\"
"