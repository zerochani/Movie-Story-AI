from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), unique=True, index=True, nullable=False)
    theme = Column(String(500), nullable=False)
    genre = Column(String(100))
    title = Column(String(300))
    final_story = Column(Text)
    status = Column(String(50), default="in_progress")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    chapters = relationship(
        "Chapter", back_populates="story", cascade="all, delete-orphan"
    )
    choices = relationship(
        "StoryChoice", back_populates="story", cascade="all, delete-orphan"
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(
        Integer, ForeignKey("stories.id", ondelete="CASCADE"), nullable=False
    )
    chapter_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    story = relationship("Story", back_populates="chapters")
    choices = relationship("StoryChoice", back_populates="chapter")


class StoryChoice(Base):
    __tablename__ = "story_choices"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(
        Integer, ForeignKey("stories.id", ondelete="CASCADE"), nullable=False
    )
    chapter_id = Column(
        Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False
    )
    chapter_number = Column(Integer, nullable=False)
    options = Column(JSON, nullable=False)
    selected_option = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    story = relationship("Story", back_populates="choices")
    chapter = relationship("Chapter", back_populates="choices")
