import { create } from 'zustand';

export interface Course {
  id: number;
  title: string;
  description: string;
  language: 'en' | 'ja' | 'ko';
  level: string;
  lessonsCount: number;
  studentsCount: number;
  coverColor: string;
}

export interface Lesson {
  id: number;
  title: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'listening';
  content: LessonContent;
}

export interface LessonContent {
  vocabulary?: VocabItem[];
  grammar?: GrammarItem[];
  speaking?: SpeakingItem[];
  listening?: ListeningItem[];
}

export interface VocabItem {
  id: number;
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
}

export interface GrammarItem {
  id: number;
  rule: string;
  explanation: string;
  examples: string[];
  exercise: GrammarExercise;
}

export interface GrammarExercise {
  type: 'fill' | 'choice' | 'reorder';
  question: string;
  options?: string[];
  answer: string;
  parts?: string[];
}

export interface SpeakingItem {
  id: number;
  sentence: string;
  phonetic: string;
  translation: string;
}

export interface ListeningItem {
  id: number;
  text: string;
  translation: string;
  options: string[];
  answer: number;
}

export interface UserProgress {
  courseId: number;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  lastStudied: string;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  userProgress: UserProgress[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchCourseDetail: (id: number) => Promise<void>;
  fetchLessonContent: (courseId: number, lessonId: number) => Promise<void>;
  submitLesson: (courseId: number, lessonId: number, answers: Record<string, string>) => Promise<void>;
  fetchUserProgress: () => Promise<void>;
}

const API_BASE = '/api';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || '请求失败');
  }
  return res.json();
}

const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  userProgress: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch<Course[]>('/courses');
      set({ courses: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchCourseDetail: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch<Course>(`/courses/${id}`);
      set({ currentCourse: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchLessonContent: async (courseId: number, lessonId: number) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch<Lesson>(`/courses/${courseId}/lessons/${lessonId}`);
      set({ currentLesson: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  submitLesson: async (courseId: number, lessonId: number, answers: Record<string, string>) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/courses/${courseId}/lessons/${lessonId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      set({ loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchUserProgress: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch<UserProgress[]>('/progress');
      set({ userProgress: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));

export default useCourseStore;
