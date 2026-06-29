from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.story import Story
from app.schemas.story import GenerateRequest, ContinueRequest, StoryResponse
from app.services.story_service import (
    generate_opening_stream,
    generate_next_chapter_stream,
    create_session_id,
)

router = APIRouter(prefix="/stories", tags=["stories"])


@router.post("/generate")
async def generate_story(
    req: GenerateRequest,
    db: Session = Depends(get_db),
):
    session_id = create_session_id()

    async def event_stream():
        async for event in generate_opening_stream(req.theme, session_id, db):
            yield event

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/continue")
async def continue_story(
    req: ContinueRequest,
    db: Session = Depends(get_db),
):
    story = db.query(Story).filter(Story.session_id == req.session_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="스토리 세션을 찾을 수 없습니다.")
    if story.status == "completed":
        raise HTTPException(status_code=400, detail="이미 완료된 스토리입니다.")

    async def event_stream():
        async for event in generate_next_chapter_stream(
            req.session_id, req.selected_option, db
        ):
            yield event

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/{session_id}", response_model=StoryResponse)
async def get_story(
    session_id: str,
    db: Session = Depends(get_db),
):
    story = db.query(Story).filter(Story.session_id == session_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="스토리를 찾을 수 없습니다.")
    return story


@router.get("/", response_model=list[StoryResponse])
async def list_stories(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    stories = (
        db.query(Story)
        .filter(Story.status == "completed")
        .order_by(Story.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return stories
