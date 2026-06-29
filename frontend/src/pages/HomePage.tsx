import { useState } from 'react';
import type { KeyboardEvent } from 'react';


const EXAMPLE_THEMES = [
    '우주 탐험가가 잃어버린 행성을 찾는 여정',
    '두 적국의 스파이가 사랑에 빠지는 이야기',
    '평범한 회사원이 시간을 되돌리는 능력을 얻다',
    '마지막 인류가 AI와 공존을 모색하는 미래',
];

interface HomePageProps {
    isGenerating: boolean;
    onGenerate: (theme: string) => void;
    error: string | null;
}

//컴포넌트 함수 
export default function HomePage({ isGenerating, onGenerate, error }: HomePageProps) {
    const [theme, setTheme] = useState('');

    const handleSubmit = () => {
        const trimmed = theme.trim();
        if (trimmed.length < 3) return;
        onGenerate(trimmed); //부모 컴포넌트(App.tsx)에서 받은 함수 실행 
    };

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { //Enter만 누르면 제출, Shift+Enter는 줄바꿈
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
        }}>
            <div style={{ width: '100%', maxWidth: '640px' }}>

                {/* 헤더 */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: 'var(--accent-gold)',
                        border: '1px solid var(--accent-dim)',
                        borderRadius: '20px',
                        padding: '4px 14px',
                        marginBottom: '24px',
                    }}>
                        AI STORY ENGINE
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 6vw, 3.2rem)',
                        fontWeight: 900,
                        marginBottom: '16px',
                        lineHeight: 1.15,
                    }}>
                        당신의 이야기를<br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-glow))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            영화로 만드세요
                        </span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        테마를 입력하면 AI가 실시간으로 줄거리를 생성하고<br />
                        선택에 따라 결말이 달라집니다
                    </p>
                </div>

                {/* 입력 */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                    }}>
                        영화 테마 입력
                    </div>
                    <textarea
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            resize: 'none',
                            borderRadius: 'var(--radius-md)',
                        }}
                        placeholder="어떤 영화를 만들고 싶으신가요?"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        onKeyDown={handleKey}
                        rows={3}
                        disabled={isGenerating}
                        maxLength={500}
                    />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        marginTop: '6px',
                        marginBottom: '12px',
                    }}>
                        <span>{theme.length}/500</span>
                        <span>Enter로 제출 · Shift+Enter로 줄바꿈</span>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(224,82,82,0.1)',
                            border: '1px solid rgba(224,82,82,0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--danger)',
                            fontSize: '14px',
                            marginBottom: '12px',
                        }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating || theme.trim().length < 3}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '16px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-dim))',
                            color: '#0e0a00',
                            borderRadius: 'var(--radius-md)',
                            opacity: (isGenerating || theme.trim().length < 3) ? 0.45 : 1,
                            cursor: (isGenerating || theme.trim().length < 3) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isGenerating ? '스토리 생성 중...' : '✦ 스토리 생성하기'}
                    </button>
                </div>

                {/* 예시 테마 */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        letterSpacing: '0.1em',
                        marginBottom: '12px',
                    }}>
                        예시 테마
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                    }}>
                        {EXAMPLE_THEMES.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                disabled={isGenerating}
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-muted)',
                                    fontSize: '13px',
                                    textAlign: 'left',
                                    lineHeight: 1.4,
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 기능 안내 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                }}>
                    {[
                        { icon: '⚡', title: '실시간 생성', desc: 'AI가 스트리밍으로 이야기를 씁니다' },
                        { icon: '🎭', title: '인터랙티브 선택', desc: '3번의 선택이 결말을 바꿉니다' },
                        { icon: '🎬', title: '완성된 스토리', desc: '영화 줄거리 형식으로 완성됩니다' },
                    ].map((f) => (
                        <div key={f.title} style={{
                            padding: '20px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{f.icon}</div>
                            <div style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '6px',
                            }}>
                                {f.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {f.desc}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}