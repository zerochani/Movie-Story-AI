<div align="center">

# 🎬 Movie Story AI

**AI가 실시간으로 생성하는 인터랙티브 영화 스토리**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://www.python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org)

[🚀 라이브 데모](https://movie-story-ai.vercel.app) · [📖 API 문서](https://movie-story-ai-production.up.railway.app/docs)

</div>

---

## 📌 프로젝트 소개

사용자가 **테마를 입력**하면 AI가 **실시간 SSE 스트리밍**으로 영화 줄거리를 생성하고, **3번의 선택지**에 따라 결말이 달라지는 인터랙티브 웹 애플리케이션입니다.

### 주요 기능

- ⚡ **실시간 스트리밍** — SSE(Server-Sent Events)로 AI 응답을 실시간으로 표시
- 🎭 **인터랙티브 선택** — 3번의 선택이 스토리 방향과 결말을 결정
- 🎬 **영화적 서사 구조** — 도입부 → 갈등 → 절정 → 결말의 영화 구조 유지
- 🌙 **시네마틱 다크 테마** — 영화 분위기에 맞는 UI 디자인

---

## 🖥 스크린샷

### 화면 1 — 테마 입력

```
┌──────────────────────────────────────────┐
│              AI STORY ENGINE             │
│                                          │
│         당신의 이야기를                  │
│         영화로 만드세요                  │
│                                          │
│    테마를 입력하면 AI가 실시간으로       │
│    줄거리를 생성하고 선택에 따라         │
│    결말이 달라집니다                     │
│                                          │
│  영화 테마 입력                          │
│  ┌────────────────────────────────────┐  │
│  │ 어떤 영화를 만들고 싶으신가요?    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [ ✦ 스토리 생성하기 ]                  │
│                                          │
│  예시 테마                               │
│  [우주 탐험가...] [두 적국 스파이...]    │
│  [평범한 회사원...] [마지막 인류...]     │
└──────────────────────────────────────────┘
```

### 화면 2 — 스토리 읽기 + 선택지

```
┌──────────────────────────────────────────┐
│ ← 처음으로  [SF] [스릴 넘치는]  ● ● ○  │
│                                          │
│          AI 생성 영화 스토리             │
│            마지막 별빛                   │
│                                          │
│  ┌── 첫 번째 장 ──────────────────────┐ │
│  │ 2157년, 탐험가 김준혁은 사라진     │ │
│  │ 행성 '에덴-7'의 신호를 포착한다.  │ │
│  │ 30년간 아무도 돌아오지 못한        │ │
│  │ 금지 구역 너머...                  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ─────────── 당신의 선택 ─────────────  │
│  이 이야기를 어떻게 이어갈까요?          │
│                                          │
│  [A] 크리스탈의 비밀을 파헤친다  mysterious │
│  [B] 소녀를 데리고 탈출을 시도한다 action  │
│  [C] 행성의 진실을 기록으로 남긴다 hopeful │
└──────────────────────────────────────────┘
```

### 화면 3 — 완성된 결말

```
┌──────────────────────────────────────────┐
│              ★ 스토리 완성               │
│                                          │
│                 SF                       │
│           마지막 별빛                    │
│                                          │
│  "진정한 탐험은 새로운 땅을 발견하는    │
│   것이 아니라, 새로운 눈을 갖는 것이다" │
│                                          │
│  전체 이야기                             │
│  ① 2157년, 탐험가 김준혁은...           │
│  ② 에덴-7에 도착한 준혁은...            │
│  ③ 크리스탈 안에는...                   │
│                                          │
│  결말                                    │
│  ┌────────────────────────────────────┐  │
│  │ 크리스탈 안에는 에덴-7 문명의     │  │
│  │ 모든 기억이 담겨 있었다...        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [ 공유하기 ]  [ 새 이야기 만들기 ]     │
└──────────────────────────────────────────┘
```

---

## 🏗 시스템 아키텍처

```
┌─────────────┐          SSE 스트리밍          ┌─────────────────┐
│             │ ─────────────────────────────▶ │                 │
│  Frontend   │                                │    Backend      │
│  React 18   │ ◀───────────────────────────── │    FastAPI      │
│  TypeScript │      실시간 이벤트 응답         │    Python 3.12  │
│             │                                │                 │
│  [Vercel]   │                                │   [Railway]     │
└─────────────┘                                └────────┬────────┘
                                                        │  AI 호출
                                               ┌────────▼────────┐
                                               │   Groq API      │
                                               │  LLaMA 3.3 70B  │
                                               └─────────────────┘
                                                        │
                                               ┌────────▼────────┐
                                               │   PostgreSQL    │
                                               │   Railway DB    │
                                               └─────────────────┘
```

---

## 🗄 ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────┐
│              stories                │
├─────────────────────────────────────┤
│ id            INT        PK         │
│ session_id    VARCHAR    UNIQUE      │
│ theme         VARCHAR    NOT NULL   │
│ genre         VARCHAR               │
│ title         VARCHAR               │
│ final_story   TEXT                  │
│ status        VARCHAR    default    │
│ created_at    DATETIME              │
│ updated_at    DATETIME              │
└──────────────┬──────────────────────┘
               │ 1:N                  
    ┌──────────┴───────────┐          
    │                      │          
┌───▼──────────────┐   ┌───▼───────────────────┐
│    chapters      │   │     story_choices      │
├──────────────────┤   ├───────────────────────┤
│ id     INT  PK   │   │ id           INT  PK  │
│ story_id    FK──▶│   │ story_id      FK ────▶│
│ chapter_number   │   │ chapter_id    FK ────▶│
│ content   TEXT   │◀──│ chapter_number        │
│ created_at       │1:N│ options    JSON        │
└──────────────────┘   │ selected_option       │
                        │ created_at            │
                        └───────────────────────┘
```

### 테이블 관계

| 관계 | 설명 |
|------|------|
| `stories` 1:N `chapters` | 하나의 스토리는 여러 챕터를 가짐 |
| `stories` 1:N `story_choices` | 하나의 스토리는 여러 선택지 기록을 가짐 |
| `chapters` 1:N `story_choices` | 각 챕터마다 선택지가 존재 |

---

## ⚙️ 기술 스택

| 레이어 | 기술 | 역할 |
|--------|------|------|
| **프론트엔드** | React 18 + TypeScript | UI 구성 |
| **빌드 도구** | Vite | 번들링 + 개발 서버 |
| **백엔드** | FastAPI 0.111 | REST API + SSE 스트리밍 |
| **언어** | Python 3.12 | 백엔드 런타임 |
| **ORM** | SQLAlchemy 2.0 | DB 모델링 및 쿼리 |
| **데이터베이스** | PostgreSQL 16 | 스토리 데이터 저장 |
| **AI 프레임워크** | LangChain 0.3 | AI 프롬프트 체인 관리 |
| **AI 모델** | Groq (LLaMA 3.3 70B) | 스토리 생성 |
| **스트리밍** | SSE (Server-Sent Events) | 실시간 AI 응답 전달 |
| **FE 배포** | Vercel | 프론트엔드 호스팅 |
| **BE 배포** | Railway | 백엔드 + DB 호스팅 |

---

## 📁 프로젝트 구조

```
movie-story-ai/
├── backend/                              # FastAPI 백엔드
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── story.py             # API 엔드포인트 (SSE StreamingResponse)
│   │   ├── core/
│   │   │   └── config.py               # 환경변수 관리 (pydantic-settings)
│   │   ├── db/
│   │   │   └── database.py             # PostgreSQL 연결 + 세션 의존성
│   │   ├── models/
│   │   │   └── story.py                # SQLAlchemy 테이블 모델
│   │   ├── schemas/
│   │   │   └── story.py                # Pydantic 요청/응답 스키마 (DTO)
│   │   ├── services/
│   │   │   └── story_service.py        # Groq AI + LangChain 비즈니스 로직
│   │   └── main.py                     # FastAPI 앱 진입점 + CORS 설정
│   ├── .python-version                  # Python 3.12 버전 고정
│   └── requirements.txt
│
└── frontend/                            # React 프론트엔드
    ├── src/
    │   ├── api/
    │   │   └── storyApi.ts             # SSE 스트리밍 + REST API 클라이언트
    │   ├── pages/
    │   │   ├── HomePage.tsx            # 테마 입력 화면
    │   │   ├── StoryPage.tsx           # 챕터 읽기 + 선택지 화면
    │   │   └── FinalPage.tsx           # 완성된 결말 화면
    │   ├── styles/
    │   │   └── global.css              # 시네마틱 다크 테마
    │   ├── types/
    │   │   └── index.ts                # TypeScript 타입 정의
    │   └── App.tsx                     # 전체 상태 관리 + 페이지 라우팅
    └── vite.config.ts                  # Vite + 개발 프록시 설정
```

---

## 🌐 API 명세

### `POST /api/v1/stories/generate`

테마를 입력받아 SSE로 스토리를 스트리밍합니다.

**Request Body**
```json
{
  "theme": "우주 탐험가가 잃어버린 행성을 찾는 여정"
}
```

**SSE 이벤트 순서**
```
event: meta
data: {"session_id": "uuid", "title": "마지막 별빛", "genre": "SF", "mood": "스릴 넘치는", "story_id": 1}

event: chapter
data: {"chapter_number": 1, "content": "2157년, 탐험가 김준혁은..."}

event: choices
data: {"chapter_number": 1, "options": [{"id": "A", "text": "...", "mood": "mysterious"}, ...]}

event: done
data: {}
```

---

### `POST /api/v1/stories/continue`

선택지를 받아 다음 챕터 또는 최종 결말을 스트리밍합니다.

**Request Body**
```json
{
  "session_id": "uuid",
  "selected_option": "A"
}
```

**SSE 이벤트 (진행 중)**
```
event: chapter  → 다음 챕터 내용
event: choices  → 새로운 선택지 3개
event: done     → 완료 신호
```

**SSE 이벤트 (최종 챕터)**
```
event: final    → { ending, final_message, title, genre }
event: done     → 완료 신호
```

---

### `GET /api/v1/stories/{session_id}`

세션 ID로 스토리 전체 조회

### `GET /api/v1/stories/`

완성된 스토리 목록 조회 (`?skip=0&limit=20`)

---

## 🚀 로컬 실행 방법

### 사전 요구사항

- Python 3.12
- Node.js 18+
- PostgreSQL

### 1. 저장소 클론

```bash
git clone https://github.com/zerochani/Movie-Story-AI.git
cd Movie-Story-AI
```

### 2. 백엔드 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python3.12 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에서 GROQ_API_KEY, DATABASE_URL 입력

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

접속: http://localhost:5173  
API 문서: http://localhost:8000/docs

---

## ☁️ 배포 환경

| 구성요소 | 플랫폼 | 주소 |
|---------|--------|------|
| 프론트엔드 | Vercel | https://movie-story-ai.vercel.app |
| 백엔드 | Railway | https://movie-story-ai-production.up.railway.app |
| 데이터베이스 | Railway PostgreSQL | - |

### 환경변수 설정

**백엔드 (Railway Variables)**
```env
DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
FRONTEND_URL=https://movie-story-ai.vercel.app
DEBUG=false
```

**프론트엔드 (Vercel Environment Variables)**
```env
VITE_API_URL=https://movie-story-ai-production.up.railway.app/api/v1
```

---

## 🔑 핵심 구현 포인트

### 1. SSE 스트리밍 (백엔드)

```python
# FastAPI StreamingResponse + AsyncGenerator 조합
async def event_stream():
    async for event in generate_opening_stream(theme, session_id, db):
        yield event  # "event: meta\ndata: {...}\n\n"

return StreamingResponse(
    event_stream(),
    media_type="text/event-stream",
    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
)
```

### 2. SSE 수신 (프론트엔드)

```typescript
// EventSource 대신 fetch API 사용 (POST 요청 필요)
const reader = res.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 이벤트 파싱 후 React 상태 업데이트
  onEvent(currentEvent, parsed);
}
```

### 3. LangChain + Groq 통합

```python
llm = ChatGroq(
    model=settings.GROQ_MODEL,
    api_key=settings.GROQ_API_KEY,
    temperature=0.85,
)
response = await llm.ainvoke([
    SystemMessage(content=SYSTEM_PROMPT),
    HumanMessage(content=prompt),
])
```

### 4. DB 세션 의존성 주입

```python
# FastAPI Depends로 Spring @Autowired처럼 DB 세션 주입
def get_story(
    session_id: str,
    db: Session = Depends(get_db),  # 요청마다 세션 생성 후 자동 반환
):
    ...
```

---

## 🤔 기술적 의사결정

| 결정 | 이유 |
|------|------|
| SSE 선택 (WebSocket 대신) | 서버→클라이언트 단방향 스트리밍으로 충분, HTTP 기반이라 프록시 친화적 |
| fetch API (EventSource 대신) | EventSource는 GET만 지원, 테마를 POST body로 전달해야 함 |
| LangChain 도입 | 향후 모델 교체 시 코드 변경 최소화, 프롬프트 체인 관리 용이 |
| session_id로 상태 관리 | 서버가 무상태(stateless)를 유지하면서 스토리 세션 추적 가능 |
| Railway + Vercel 분리 배포 | 각 레이어의 특성에 맞는 플랫폼 선택, 독립적 스케일링 가능 |

---

## 👨‍💻 개발자

**박영찬** — 명지대학교 컴퓨터공학과

