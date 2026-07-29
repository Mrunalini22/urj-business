from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, loaded from environment / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://urj:urj@localhost:5432/urj_portal"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    app_name: str = "URJ · DISCOM Operations Intelligence Portal API"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
