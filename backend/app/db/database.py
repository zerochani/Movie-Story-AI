from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 연결이 끊겼으면 자동으로 재연결
    pool_size=5,  # 동시에 유지할 DB 연결 수
    max_overflow=10,  # pool_size 초과 시 추가로 허용할 연결 수
)

# 트랜잭션을 직접 관리
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모든 DB모델(테이블)이 상속받는 기본 클래스
Base = declarative_base()


# API 요청마다 DB 세션을 생성하고, 요청이 끝나면 세션을 종료하는 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
