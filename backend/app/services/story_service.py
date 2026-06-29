import json
import uuid
from typing import AsyncGenerator, Any, List
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.story import Story, Chapter, StoryChoice
from app.schemas.story import ChoiceOption


def get_llm() -> ChatGroq:
    return ChatGroq(
        model=settings.GROQ_MODEL,
        api_key=settings.GROQ_API_KEY,
        temperature=0.85,
    )


SYSTEM_PROMPT = """당신은 세계적인 수준의 영화 스토리 작가입니다.
사용자가 제공한 테마를 바탕으로 독창적이고 몰입감 있는 영화 줄거리를 창작합니다.

규칙:
- 반드시 한국어로만 작성합니다. 한자, 중국어, 일본어, 힌디어 등 다른 언어는 절대 사용하지 않습니다
- 각 챕터는 200~300자의 한국어로 작성합니다
- 영화적 긴장감과 서사 구조를 유지합니다
- JSON 응답 시 반드시 유효한 JSON만 출력하고, 다른 텍스트는 포함하지 않습니다"""


def create_session_id() -> str:
    return str(uuid.uuid4())


def _sse(event: str, data: Any) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def _build_history(chapters: list, choices: list) -> str:
    lines = []
    for ch in chapters:
        lines.append(f"[챕터 {ch.chapter_number}]\n{ch.content}")
        matching = [c for c in choices if c.chapter_number == ch.chapter_number]
        if matching and matching[0].selected_option:
            sel = matching[0].selected_option
            opts = matching[0].options or []
            chosen = next((o for o in opts if o.get("id") == sel), None)
            if chosen:
                lines.append(f"→ 선택: {chosen.get('text', sel)}")
    return "\n\n".join(lines)


# 비동기 함수 => AI API 호출
async def _generate_choices(
    theme: str,
    chapter_content: str,
    chapter_number: int,
) -> List[ChoiceOption]:
    llm = get_llm()
    prompt = f"""
테마: "{theme}"
챕터 {chapter_number} 내용: {chapter_content}

이 장면 이후 선택지 3개를 만드세요.
아래 JSON 형식으로만 응답하세요:
{{
  "choices": [
    {{"id": "A", "text": "선택지 A (30자 이내)", "mood": "dark|hopeful|action|mysterious|romantic"}},
    {{"id": "B", "text": "선택지 B (30자 이내)", "mood": "dark|hopeful|action|mysterious|romantic"}},
    {{"id": "C", "text": "선택지 C (30자 이내)", "mood": "dark|hopeful|action|mysterious|romantic"}}
  ]
}}"""

    response = await llm.ainvoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]
    )
    data = _parse_json(response.content)
    return [ChoiceOption(**c) for c in data["choices"]]


async def generate_opening_stream(
    theme: str,
    session_id: str,
    db: Session,
) -> AsyncGenerator[str, None]:
    llm = get_llm()

    prompt = f"""
다음 테마로 영화를 만들 것입니다: "{theme}"

아래 JSON 형식으로만 응답하세요:
{{
  "title": "영화 제목 (20자 이내)",
  "genre": "장르 (SF, 스릴러, 로맨스, 액션, 공포, 판타지 중 하나)",
  "opening_chapter": "1챕터 내용 (250자 내외)",
  "mood": "전체 분위기"
}}"""

    response = await llm.ainvoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]
    )
    data = _parse_json(response.content)

    story = Story(
        session_id=session_id,
        theme=theme,
        genre=data.get("genre"),
        title=data.get("title"),
        status="in_progress",
    )
    db.add(story)
    db.flush()

    chapter = Chapter(
        story_id=story.id,
        chapter_number=1,
        content=data["opening_chapter"],
    )
    db.add(chapter)
    db.flush()

    # 선택지 3개를 AI한테 요청
    choices_data = await _generate_choices(theme, data["opening_chapter"], 1)

    story_choice = StoryChoice(
        story_id=story.id,
        chapter_id=chapter.id,
        chapter_number=1,
        options=[c.model_dump() for c in choices_data],
    )
    db.add(story_choice)
    db.commit()

    yield _sse(
        "meta",
        {
            "session_id": session_id,
            "title": data["title"],
            "genre": data["genre"],
            "mood": data.get("mood", ""),
            "story_id": story.id,
        },
    )
    yield _sse(
        "chapter",
        {
            "chapter_number": 1,
            "content": data["opening_chapter"],
        },
    )
    yield _sse(
        "choices",
        {
            "chapter_number": 1,
            "options": [c.model_dump() for c in choices_data],
        },
    )
    yield _sse("done", {})


async def generate_next_chapter_stream(
    session_id: str,
    selected_option: str,
    db: Session,
) -> AsyncGenerator[str, None]:
    story = db.query(Story).filter(Story.session_id == session_id).first()
    if not story:
        yield _sse("error", {"message": "스토리를 찾을 수 없습니다."})
        return

    chapters = sorted(story.chapters, key=lambda c: c.chapter_number)
    choices = sorted(story.choices, key=lambda c: c.chapter_number)
    current_chapter_num = len(chapters)

    last_choice = choices[-1] if choices else None
    if last_choice and not last_choice.selected_option:
        last_choice.selected_option = selected_option
        db.commit()

    history = _build_history(chapters, choices)
    is_final = current_chapter_num >= 3

    if is_final:
        async for event in _generate_ending_stream(story, history, db):
            yield event
    else:
        llm = get_llm()
        next_num = current_chapter_num + 1

        prompt = f"""
테마: "{story.theme}" | 장르: {story.genre}

지금까지의 스토리:
{history}

사용자가 선택한 방향: {selected_option}

챕터 {next_num}을 작성하세요.
아래 JSON 형식으로만 응답하세요:
{{
  "content": "챕터 {next_num} 내용 (250자 내외)"
}}"""

        response = await llm.ainvoke(
            [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=prompt),
            ]
        )
        data = _parse_json(response.content)

        chapter = Chapter(
            story_id=story.id,
            chapter_number=next_num,
            content=data["content"],
        )
        db.add(chapter)
        db.flush()

        choices_data = await _generate_choices(story.theme, data["content"], next_num)

        story_choice = StoryChoice(
            story_id=story.id,
            chapter_id=chapter.id,
            chapter_number=next_num,
            options=[c.model_dump() for c in choices_data],
        )
        db.add(story_choice)
        db.commit()

        yield _sse(
            "chapter",
            {
                "chapter_number": next_num,
                "content": data["content"],
            },
        )
        yield _sse(
            "choices",
            {
                "chapter_number": next_num,
                "options": [c.model_dump() for c in choices_data],
            },
        )
        yield _sse("done", {})


async def _generate_ending_stream(
    story: Story,
    history: str,
    db: Session,
) -> AsyncGenerator[str, None]:
    llm = get_llm()

    prompt = f"""
테마: "{story.theme}" | 제목: {story.title}

전체 스토리:
{history}

감동적인 결말을 작성하세요.
아래 JSON 형식으로만 응답하세요:
{{
  "ending": "결말 내용 (300자 내외)",
  "final_message": "이 영화가 전하는 메시지 한 줄 (50자 이내)"
}}"""

    response = await llm.ainvoke(
        [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]
    )
    data = _parse_json(response.content)

    story.final_story = data["ending"]
    story.status = "completed"
    db.commit()

    yield _sse(
        "final",
        {
            "ending": data["ending"],
            "final_message": data["final_message"],
            "title": story.title,
            "genre": story.genre,
        },
    )
    yield _sse("done", {})
