import type { FinalStory, Chapter } from '../types';

interface FinalPageProps {
    finalStory: FinalStory;
    chapters: Chapter[];
    onReset: () => void;
}

export default function FinalPage({ finalStory, chapters, onReset }: FinalPageProps) {

    const handleShare = async () => {
        const text = `"${finalStory.title}" - AI가 생성한 영화 스토리\n\n${finalStory.final_message}`;
        if (navigator.share) {
            await navigator.share({ title: finalStory.title, text });
        } else {
            await navigator.clipboard.writeText(text);
            alert('클립보드에 복사되었습니다!');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px 80px',
        }}>

            {/* 완성 배지 */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: 'var(--accent-gold)',
                border: '1px solid var(--accent-dim)',
                borderRadius: '20px',
                padding: '6px 16px',
                marginBottom: '32px',
            }}>
                ★ 스토리 완성
            </div>

            {/* 영화 헤더 */}
            <header style={{
                textAlign: 'center',
                maxWidth: '600px',
                marginBottom: '48px',
            }}>
                <p style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: 'var(--accent-dim)',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                }}>
                    {finalStory.genre}
                </p>
                <h1 style={{
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    fontWeight: 900,
                    color: 'var(--text-primary)',
                    marginBottom: '20px',
                    lineHeight: 1.1,
                }}>
                    {finalStory.title}
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: 'var(--accent-glow)',
                    fontFamily: 'var(--font-display)',
                    lineHeight: 1.6,
                }}>
                    "{finalStory.final_message}"
                </p>
            </header>

            <main style={{
                width: '100%',
                maxWidth: '640px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
            }}>

                {/* 챕터 요약 */}
                <section>
                    <h2 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        paddingBottom: '16px',
                        borderBottom: '1px solid var(--border)',
                        marginBottom: '24px',
                    }}>
                        전체 이야기
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {chapters.map((ch, idx) => (
                            <div key={ch.chapter_number} style={{
                                display: 'grid',
                                gridTemplateColumns: '28px 1fr',
                                gap: '16px',
                                alignItems: 'start',
                            }}>
                                <div style={{
                                    width: '28px', height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--bg-hover)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '50%',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--accent-gold)',
                                    flexShrink: 0,
                                }}>
                                    {idx + 1}
                                </div>
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.8,
                                }}>
                                    {ch.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 결말 */}
                <section>
                    <p style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: 'var(--accent-gold)',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                    }}>
                        결말
                    </p>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--accent-dim)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                    }}>
                        <p style={{
                            fontSize: '1.05rem',
                            color: 'var(--text-primary)',
                            lineHeight: 1.9,
                            fontStyle: 'italic',
                        }}>
                            {finalStory.ending}
                        </p>
                    </div>
                </section>

                {/* 버튼 */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleShare}
                        style={{
                            flex: 1,
                            padding: '14px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-muted)',
                            background: 'var(--bg-card)',
                        }}
                    >
                        공유하기
                    </button>
                    <button
                        onClick={onReset}
                        style={{
                            flex: 2,
                            padding: '14px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-dim))',
                            color: '#0e0a00',
                            borderRadius: 'var(--radius-md)',
                        }}
                    >
                        새 이야기 만들기
                    </button>
                </div>

            </main>
        </div>
    );
}