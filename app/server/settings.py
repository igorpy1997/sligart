# app/server/settings.py
from dotenv import load_dotenv
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL

#load_dotenv()


class PostgresSettings(BaseSettings):
    host: str
    port: int
    user: str
    password: SecretStr
    db: str

    class Config:
        frozen = True


class Settings(BaseSettings):
    model_config = SettingsConfigDict()
    psql: PostgresSettings = PostgresSettings(_env_prefix="PSQL_")
    secret_key: SecretStr = SecretStr("your-super-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_hours: int = 24

    class Config:
        frozen = True

    def psql_dsn(self) -> URL:
        return URL.create(
            drivername="postgresql+asyncpg",
            username=self.psql.user,
            password=self.psql.password.get_secret_value(),
            host=self.psql.host,
            port=self.psql.port,
            database=self.psql.db,
        )