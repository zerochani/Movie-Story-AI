from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class ChoiceOption(BaseModel):
    id: str
    text: str
    mood: Optional[str] = None


class StoryChoiceResponse(BaseModel):
    id: int
    story_id: int
    chapter_number: int
    options: List[ChoiceOption]
    selected_option: Optional[str] = None
    created_at: datetime

    # SQLAlchemy 모델을 Pydantic 스키마로 자동 변환
    class Config:
        from_attributes = True


class ChapterResponse(BaseModel):
    id: int
    story_id: int
    chapter_number: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class StoryResponse(BaseModel):
    id: int
    session_id: str
    theme: str
    genre: Optional[str] = None
    title: Optional[str] = None
    final_story: Optional[str] = None
    status: str
    created_at: datetime
    chapters: List[ChapterResponse] = []
    choices: List[StoryChoiceResponse] = []

    class Config:
        from_attributes = True


# 사용자가 테마를 입력할 때 쓰는 요청 스키마
class GenerateRequest(BaseModel):
    theme: str = Field(..., min_length=3, max_length=500)


# 사용자가 선택지를 고를 때 쓰는 요청 스키마
class ContinueRequest(BaseModel):
    session_id: str  # 어떤 스토리인지 식별
    selected_option: str  # 사용자가 고른 선택지
