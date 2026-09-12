export type WellnessDimension =
  | 'mood'
  | 'stress'
  | 'anxiety'
  | 'sleep'
  | 'energy'
  | 'focus'
  | 'social'
  | 'functioning';

export type AggregateDimension =
  | 'emotional_wellbeing'
  | 'stress_regulation'
  | 'sleep_energy'
  | 'focus_functioning'
  | 'social_wellbeing';

export interface AnswerOption {
  id: string;
  label: string;
  sublabel?: string;
  scoreValue: number; // 1 to 5
}

export interface Question {
  id: string;
  dimension: WellnessDimension;
  aggregateDimension: AggregateDimension;
  categoryName: string;
  title: string;
  description: string;
  options: AnswerOption[];
  reverseScored?: boolean; // For questions where high score means high stress/difficulty
}

export type CurrentMood =
  | 'calm'
  | 'happy'
  | 'neutral'
  | 'stressed'
  | 'overwhelmed'
  | 'sad'
  | 'irritated'
  | 'tired';

export interface DimensionScore {
  key: AggregateDimension;
  label: string;
  score: number; // 0 - 100
  level: 'Doing well' | 'Mild concern' | 'Some areas to watch' | 'Higher level of concern';
  color: string;
  summary: string;
}

export interface CheckInResult {
  id: string;
  timestamp: string; // ISO string
  storageMode: 'persistent' | 'ephemeral';
  overallScore: number; // 0 - 100
  overallLevel: 'Doing well' | 'Mild concern' | 'Some areas to watch' | 'Higher level of concern';
  currentMood?: CurrentMood;
  dimensionScores: Record<AggregateDimension, DimensionScore>;
  answers: Record<string, number>; // questionId -> scoreValue (1-5)
  aiReflection: {
    overview: string;
    strengths: string[];
    focusAreas: string[];
    suggestedSteps: {
      category: 'Sleep' | 'Stress' | 'Movement' | 'Social' | 'Digital Habits';
      title: string;
      action: string;
      rationale: string;
    }[];
  };
  safetyFlag: boolean;
}

export interface CrisisContact {
  country: string;
  countryCode: string;
  name: string;
  number: string;
  textOption?: string;
  hours: string;
  description: string;
  website?: string;
  isEmergency?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'safety_system';
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
  crisisIntervention?: boolean;
}

export interface PersonalTrendInsight {
  type: 'positive' | 'watch' | 'correlation' | 'milestone';
  title: string;
  description: string;
  badgeText: string;
}
