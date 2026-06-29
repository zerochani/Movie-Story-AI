from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # 앱 설정
    APP_NAME: str = "Movie Story AI"
    APP_VERSION: str = "1.0.0"
    # 개발중엔 True, 배포시엔 False로 변경
    DEBUG: bool = False

    # 데이터베이스
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/moviestory"

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        # 환경변수 이름의 대소문자를 구분할지 여부
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
