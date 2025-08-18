#!/bin/bash
# create_admin.sh

echo "🔐 Creating admin user..."

docker compose exec server bash -c "
.venv/bin/python -c \"
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from storages.psql.models.user_model import DBUserModel
from settings import Settings

async def create_admin():
    try:
        settings = Settings()
        username = 'admin'
        password = 'admin123'
        email = 'admin@sligart.dev'

        pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
        hashed_password = pwd_context.hash(password)

        print(f'🔐 Creating admin: {username}')
        print('=' * 30)

        # Create engine and session
        engine = create_async_engine(settings.psql_dsn())
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

        async with async_session() as session:
            # Check if user exists
            from sqlalchemy import select
            result = await session.execute(
                select(DBUserModel).where(DBUserModel.username == username)
            )
            existing_user = result.scalar_one_or_none()

            if existing_user:
                print(f'⚠️ User {username} already exists!')
                return

            # Create new admin user
            new_user = DBUserModel(
                username=username,
                email=email,
                hashed_password=hashed_password,
                is_active=True,
                is_admin=True
            )

            session.add(new_user)
            await session.commit()

            print(f'✅ Admin created successfully!')
            print(f'   Login: {username}')
            print(f'   Password: {password}')
            print(f'   Email: {email}')

        await engine.dispose()

    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()

asyncio.run(create_admin())
\"
"