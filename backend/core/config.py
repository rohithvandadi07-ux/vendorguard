import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "VendorGuard API"
    API_V1_STR: str = "/api"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:80",
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # PostgreSQL
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "vendorguard")

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:5432/{POSTGRES_DB}"
    )

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey12345")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )

    # External APIs
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "mock")
    ABUSEIPDB_API_KEY: str = os.getenv("ABUSEIPDB_API_KEY", "mock")
    SHODAN_API_KEY: str = os.getenv("SHODAN_API_KEY", "mock")

    class Config:
        case_sensitive = True


settings = Settings()