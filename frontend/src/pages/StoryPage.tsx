import type { StoryMeta, Chapter, ChoiceOption } from '../types';

interface StoryPageProps {
    meta: StoryMeta;
    chapters: Chapter[];
    currentChoices: ChoiceOption[] | null;
    isStreaming: boolean;
    error: string | null;
    onSelectChoice: (option: string) => void;
    onReset: () => void;
}

const CHAPTER_LABELS = ['첫 번째 장', '두 번째 장', '세 번째 장', '네 번째 장'];

const MOOD_COLORS: Record<string, string> = {
    dark: '#9b4444',
    hopeful: '#4a9b6f',
    action: '#9b7a2e',
    mysterious: '#5a4a9b',
    romantic: '#9b4a6a',
};

export default function StoryPage({
    meta,
    chapters,
    currentChoices,
    isStreaming,
    error,
    onSelectChoice,
    onReset,
}: StoryPageProps) {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>

            {/* 헤더 */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                background: 'rgba(8,11,20,0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border)',
            }}>
                <button
                    onClick={onReset}
                    style={{ fontSize: '13px', color: 'var(--text-muted)' }}
                >
                    ← 처음으로
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {meta.genre && (
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.12em',
                            color: 'var(--accent-gold)',
                            border: '1px solid var(--accent-dim)',
                            borderRadius: '20px',
                            padding: '3px 10px',
                        }}>
                            {meta.genre}
                        </span>
                    )}
                    {meta.mood && (
                        <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            padding: '3px 10px',
                        }}>
                            {meta.mood}
                        </span>
                    )}
                </div>

                {/* 진행 도트 */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3].map((n) => (
                        <span
                            key={n}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: chapters.length >= n ? 'var(--accent-gold)' : 'var(--border)',
                                display: 'inline-block',
                                transition: 'background 0.3s',
                            }}
                        />
                    ))}
                </div>
            </header>

            {/* 영화 제목 */}
            <div style={{
                textAlign: 'center',
                padding: '48px 24px 24px',
                maxWidth: '680px',
                margin: '0 auto',
            }}>
                <p style={{
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: 'var(--accent-dim)',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                }}>
                    AI 생성 영화 스토리
                </p>
                <h1 style={{
                    fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, var(--text-primary) 60%, var(--accent-gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {meta.title}
                </h1>
            </div>

            {/* 메인 */}
            <main style={{
                maxWidth: '680px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
            }}>

                {/* 챕터 목록 */}
                {chapters.map((chapter, idx) => (
                    <article
                        key={chapter.chapter_number}
                        className="fade-up"
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '28px 32px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '3px', height: '100%',
                            background: 'linear-gradient(to bottom, var(--accent-gold), transparent)',
                        }} />
                        <p style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            color: 'var(--accent-gold)',
                            textTransform: 'uppercase',
                            marginBottom: '12px',
                        }}>
                            {CHAPTER_LABELS[idx] ?? `챕터 ${chapter.chapter_number}`}
                        </p>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            lineHeight: 1.85,
                        }}>
                            {chapter.content}
                        </p>
                    </article>
                ))}

                {/* 스트리밍 로딩 */}
                {isStreaming && chapters.length === 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '48px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--text-muted)',
                    }}>
                        <div style={{
                            width: '36px', height: '36px',
                            border: '2px solid var(--border)',
                            borderTopColor: 'var(--accent-gold)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <p>AI가 이야기를 구성하고 있습니다...</p>
                    </div>
                )}

                {isStreaming && chapters.length > 0 && !currentChoices && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                        padding: '8px 0',
                    }}>
                        <div style={{
                            width: '16px', height: '16px',
                            border: '2px solid var(--border)',
                            borderTopColor: 'var(--accent-gold)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        이야기를 이어 쓰는 중...
                    </div>
                )}

                {/* 선택지 */}
                {currentChoices && !isStreaming && (
                    <section className="fade-up">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '16px',
                            color: 'var(--text-dim)',
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                            <span>당신의 선택</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                        </div>

                        <p style={{
                            textAlign: 'center',
                            fontSize: '1rem',
                            color: 'var(--text-muted)',
                            marginBottom: '16px',
                        }}>
                            이 이야기를 어떻게 이어갈까요?
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {currentChoices.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => onSelectChoice(opt.id)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '36px 1fr auto',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '18px 20px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = MOOD_COLORS[opt.mood] ?? 'var(--accent-dim)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '36px', height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--bg-hover)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        color: 'var(--accent-gold)',
                                    }}>
                                        {opt.id}
                                    </div>
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                        {opt.text}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                                        {opt.mood}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* 에러 */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: 'rgba(224,82,82,0.08)',
                        border: '1px solid rgba(224,82,82,0.25)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--danger)',
                        fontSize: '14px',
                    }}>
                        <span>⚠ {error}</span>
                        <button
                            onClick={onReset}
                            style={{ color: 'var(--danger)', textDecoration: 'underline', fontSize: '13px' }}
                        >
                            처음부터 다시
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}