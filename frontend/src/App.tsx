import { useState, useCallback, useRef } from 'react';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import FinalPage from './pages/FinalPage';
import { streamGenerateStory, streamContinueStory } from './api/storyApi';
import type {
  AppState, StoryMeta, Chapter, StoryChoice, FinalStory, ChoiceOption,
} from './types';
import './styles/global.css';

const initialState: AppState = {
  page: 'home',
  meta: null,
  chapters: [],
  choices: [],
  currentChoices: null,
  finalStory: null,
  isStreaming: false,
  error: null,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState); //앱 전체 상태를 하나의 객체로 관리
  const abortRef = useRef<AbortController | null>(null); //SSE스트리밍을 중간에 취소하기 위한 컨트롤러 저장

  const handleGenerate = useCallback((theme: string) => {
    setState((s) => ({ ...s, page: 'generating', isStreaming: true, error: null }));

    abortRef.current = streamGenerateStory(
      theme,
      (type, data) => {
        if (type === 'meta') {
          setState((s) => ({
            ...s,
            meta: data as StoryMeta,
            page: 'reading',
          }));
        } else if (type === 'chapter') {
          setState((s) => ({
            ...s,
            chapters: [...s.chapters, data as Chapter], //기존 배열을 복사하고 새 챕터를 뒤에 추가
          }));
        } else if (type === 'choices') {
          const choiceData = data as StoryChoice;
          setState((s) => ({
            ...s,
            choices: [...s.choices, choiceData],
            currentChoices: choiceData.options as ChoiceOption[],
          }));
        } else if (type === 'done') {
          setState((s) => ({ ...s, isStreaming: false }));
        }
      },
      (msg) => {
        setState((s) => ({ ...s, error: msg, isStreaming: false }));
      },
    );
  }, []);

  const handleChoiceSelect = useCallback((option: string) => {
    if (!state.meta) return;

    setState((s) => ({
      ...s,
      isStreaming: true,
      currentChoices: null,
    }));

    abortRef.current = streamContinueStory(
      state.meta.session_id,
      option,
      (type, data) => {
        if (type === 'chapter') {
          setState((s) => ({
            ...s,
            chapters: [...s.chapters, data as Chapter],
          }));
        } else if (type === 'choices') {
          const choiceData = data as StoryChoice;
          setState((s) => ({
            ...s,
            choices: [...s.choices, choiceData],
            currentChoices: choiceData.options as ChoiceOption[],
          }));
        } else if (type === 'final') {
          setState((s) => ({
            ...s,
            finalStory: data as FinalStory,
            page: 'final',
            currentChoices: null,
          }));
        } else if (type === 'done') {
          setState((s) => ({ ...s, isStreaming: false }));
        }
      },
      (msg) => {
        setState((s) => ({ ...s, error: msg, isStreaming: false }));
      },
    );
  }, [state.meta]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  if (state.page === 'home' || state.page === 'generating') {
    return (
      <HomePage
        isGenerating={state.page === 'generating'}
        onGenerate={handleGenerate}
        error={state.error}
      />
    );
  }

  if (state.page === 'final' && state.finalStory) {
    return (
      <FinalPage
        finalStory={state.finalStory}
        chapters={state.chapters}
        onReset={handleReset}
      />
    );
  }

  return (
    <StoryPage
      meta={state.meta!}
      chapters={state.chapters}
      currentChoices={state.currentChoices}
      isStreaming={state.isStreaming}
      error={state.error}
      onSelectChoice={handleChoiceSelect}
      onReset={handleReset}
    />
  );
}