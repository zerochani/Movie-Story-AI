export interface ChoiceOption {
    id: string;
    text: string;
    mood: string;
}

export interface Chapter {
    chapter_number: number;
    content: string;
}

export interface StoryMeta {
    session_id: string;
    title: string;
    genre: string;
    mood: string;
    story_id: number;
}

export interface StoryChoice {
    chapter_number: number;
    options: ChoiceOption[];
    selected_option?: string;
}

export interface FinalStory {
    ending: string;
    final_message: string;
    title: string;
    genre: string;
}

export type AppPage = 'home' | 'generating' | 'reading' | 'final';

export interface AppState {
    page: AppPage;
    meta: StoryMeta | null;
    chapters: Chapter[];
    choices: StoryChoice[];
    currentChoices: ChoiceOption[] | null;
    finalStory: FinalStory | null;
    isStreaming: boolean;
    error: string | null;
}