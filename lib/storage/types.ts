export type MoodType =
  | 'happy'
  | 'calm'
  | 'hopeful'
  | 'neutral'
  | 'tired'
  | 'stressed'
  | 'anxious'
  | 'sad'
  | 'overwhelmed';

export interface MoodConfig {
  label: string;
  emoji: string;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  score: number; // 1 to 9 scale for analytical trending
}

export const MOOD_DEFINITIONS: Record<MoodType, MoodConfig> = {
  happy: {
    label: 'Joyful & Happy',
    emoji: '☀️',
    color: '#8B9F84',
    textColor: '#24483D',
    bgLight: '#F0F5EE',
    borderColor: '#C8D5C3',
    score: 9,
  },
  calm: {
    label: 'Calm & Centered',
    emoji: '🌿',
    color: '#708469',
    textColor: '#1C372E',
    bgLight: '#EEF4F1',
    borderColor: '#A7B8A1',
    score: 8,
  },
  hopeful: {
    label: 'Hopeful & Inspired',
    emoji: '✨',
    color: '#A499C9',
    textColor: '#24483D',
    bgLight: '#F3F0FA',
    borderColor: '#DCD7ED',
    score: 7,
  },
  neutral: {
    label: 'Balanced & Neutral',
    emoji: '🍃',
    color: '#777B76',
    textColor: '#252925',
    bgLight: '#F5EFE6',
    borderColor: '#E9DFD0',
    score: 5,
  },
  tired: {
    label: 'Tired & Low Energy',
    emoji: '☁️',
    color: '#9A9E99',
    textColor: '#252925',
    bgLight: '#F6F6F5',
    borderColor: '#E2E2DE',
    score: 4,
  },
  stressed: {
    label: 'Stressed & Pressed',
    emoji: '⚡',
    color: '#D89E75',
    textColor: '#4A2A18',
    bgLight: '#FBF5EE',
    borderColor: '#E8D4C1',
    score: 3,
  },
  anxious: {
    label: 'Anxious & Restless',
    emoji: '🌊',
    color: '#9D97B5',
    textColor: '#362E48',
    bgLight: '#F5F3FA',
    borderColor: '#DCD7ED',
    score: 2,
  },
  sad: {
    label: 'Sad & Vulnerable',
    emoji: '🌧️',
    color: '#7B8FA1',
    textColor: '#233240',
    bgLight: '#F0F4F8',
    borderColor: '#C6D5E3',
    score: 2,
  },
  overwhelmed: {
    label: 'Overwhelmed',
    emoji: '🌪️',
    color: '#B87D7D',
    textColor: '#4A2222',
    bgLight: '#FBF1F1',
    borderColor: '#ECC8C8',
    score: 1,
  },
};

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  intensity: number; // 1 to 10
  sleep_quality?: number; // 1 to 5
  energy_level?: 'low' | 'moderate' | 'high';
  stress_level?: 'low' | 'medium' | 'high';
  tags?: string[];
  reflection?: string;
  supportive_summary?: string;
  suggested_activity?: string;
  created_at: string;
  updated_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: MoodType;
  tags?: string[];
  prompt?: string;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WellnessGoal {
  id: string;
  user_id: string;
  title: string;
  category: 'mindfulness' | 'movement' | 'sleep' | 'connection' | 'reflection';
  target_frequency: 'daily' | 'weekly';
  target_count: number;
  completed_dates: string[]; // YYYY-MM-DD
  status: 'active' | 'paused' | 'completed';
  created_at: string;
}

export interface ActivityCompletion {
  id: string;
  user_id: string;
  activity_type: 'breathing' | 'grounding' | 'gratitude' | 'mindful_pause' | 'journal' | 'selfcare_plan';
  duration_seconds: number;
  notes?: string;
  completed_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  reminder_time: string;
  theme: string;
  is_guest: boolean;
  created_at: string;
}

export interface CheckinDraft {
  mood: MoodType | null;
  intensity: number;
  sleep_quality: number;
  energy_level: 'low' | 'moderate' | 'high';
  stress_level: 'low' | 'medium' | 'high';
  tags: string[];
  reflection: string;
}
