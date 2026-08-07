from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, loaded from environment / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://urj:urj@localhost:5432/urj_portal"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    # Comma list of Host headers the API will accept. "*" = any (dev default).
    # In production set to your domains, e.g. "urj-ai.com,api.urj-ai.com".
    allowed_hosts: str = "*"
    # Enable HSTS + security headers (safe to leave on; only meaningful over HTTPS).
    security_headers: bool = True
    app_name: str = "URJ · DISCOM Operations Intelligence Portal API"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def allowed_hosts_list(self) -> list[str]:
        return [h.strip() for h in self.allowed_hosts.split(",") if h.strip()]


settings = Settings()
