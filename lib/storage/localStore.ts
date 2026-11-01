import {
  ActivityCompletion,
  JournalEntry,
  MoodEntry,
  UserProfile,
  WellnessGoal,
} from './types';

const STORAGE_KEYS = {
  PROFILE: 'mindcheck_user_profile',
  MOODS: 'mindcheck_mood_entries',
  JOURNALS: 'mindcheck_journal_entries',
  GOALS: 'mindcheck_wellness_goals',
  ACTIVITIES: 'mindcheck_activity_completions',
};

// Seed realistic, calm sample entries so new evaluators can immediately observe the analytics
function getInitialSeedMoods(): MoodEntry[] {
  const now = new Date();
  const makeDate = (daysAgo: number, hours: number = 20) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, 15, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'seed-mood-1',
      user_id: 'guest-user',
      mood: 'calm',
      intensity: 7,
      sleep_quality: 4,
      energy_level: 'moderate',
      stress_level: 'low',
      tags: ['Evening walk', 'Reading', 'Quiet'],
      reflection: 'Took an evening walk in the neighborhood without my phone. The fresh air felt restorative.',
      supportive_summary: 'You prioritized unhurried personal time, nurturing a peaceful mindset before sleep.',
      suggested_activity: 'breathing',
      created_at: makeDate(4),
    },
    {
      id: 'seed-mood-2',
      user_id: 'guest-user',
      mood: 'stressed',
      intensity: 8,
      sleep_quality: 2,
      energy_level: 'low',
      stress_level: 'high',
      tags: ['Work deadline', 'Fatigue'],
      reflection: 'Back-to-back meetings and looming deliverable. Felt my neck tense up around midday.',
      supportive_summary: 'A demanding day with physical tension. Remember that productivity does not define your worth.',
      suggested_activity: 'grounding',
      created_at: makeDate(3),
    },
    {
      id: 'seed-mood-3',
      user_id: 'guest-user',
      mood: 'hopeful',
      intensity: 8,
      sleep_quality: 4,
      energy_level: 'high',
      stress_level: 'low',
      tags: ['Project finished', 'Good sleep'],
      reflection: 'Finally submitted the project. Shared a lovely cup of green tea with a colleague.',
      supportive_summary: 'A rewarding release of stress replaced with optimism and social connection.',
      suggested_activity: 'gratitude',
      created_at: makeDate(2),
    },
    {
      id: 'seed-mood-4',
      user_id: 'guest-user',
      mood: 'calm',
      intensity: 8,
      sleep_quality: 5,
      energy_level: 'moderate',
      stress_level: 'low',
      tags: ['Rest day', 'Mindfulness'],
      reflection: 'Woke up naturally without an alarm. Prepared a slow breakfast with fresh fruit.',
      supportive_summary: 'Savoring slow mornings provides your nervous system with a grounded baseline.',
      suggested_activity: 'journal',
      created_at: makeDate(1),
    },
  ];
}

function getInitialSeedJournals(): JournalEntry[] {
  const now = new Date();
  const makeDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
  };

  return [
    {
      id: 'seed-journal-1',
      user_id: 'guest-user',
      title: 'Finding quiet in a loud week',
      content: `Today I realized that whenever I feel scattered, it is usually because I have been consuming other people's thoughts for 10 hours straight without giving my own mind room to breathe.\n\nI stepped away from screens at 6 PM, sat on the balcony, and just watched the evening sky shift colors. A gentle reminder that peace is not something we chase—it is what remains when we stop rushing.`,
      mood: 'calm',
      tags: ['Reflection', 'Peace', 'Digital boundaries'],
      prompt: 'What helped you find quiet today?',
      is_favorite: true,
      created_at: makeDate(3),
      updated_at: makeDate(3),
    },
    {
      id: 'seed-journal-2',
      user_id: 'guest-user',
      title: 'Letting go of perfectionism',
      content: `A conversation with my mentor reminded me that done and thoughtful is always better than perfect and delayed. It is easy to confuse high standards with self-criticism. Tomorrow I want to approach tasks with gentleness rather than urgency.`,
      mood: 'hopeful',
      tags: ['Growth', 'Work', 'Self-compassion'],
      prompt: 'What expectation can you soften today?',
      is_favorite: false,
      created_at: makeDate(1),
      updated_at: makeDate(1),
    },
  ];
}

function getInitialSeedGoals(): WellnessGoal[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return [
    {
      id: 'goal-1',
      user_id: 'guest-user',
      title: 'Complete daily emotional check-in',
      category: 'reflection',
      target_frequency: 'daily',
      target_count: 1,
      completed_dates: [yesterdayStr, todayStr],
      status: 'active',
      created_at: now.toISOString(),
    },
    {
      id: 'goal-2',
      user_id: 'guest-user',
      title: '4-7-8 Breathing before sleep',
      category: 'sleep',
      target_frequency: 'daily',
      target_count: 1,
      completed_dates: [yesterdayStr],
      status: 'active',
      created_at: now.toISOString(),
    },
    {
      id: 'goal-3',
      user_id: 'guest-user',
      title: 'Mindful screen-free evening walk',
      category: 'movement',
      target_frequency: 'weekly',
      target_count: 3,
      completed_dates: [yesterdayStr],
      status: 'active',
      created_at: now.toISOString(),
    },
  ];
}

export const LocalStore = {
  getProfile(): UserProfile {
    if (typeof window === 'undefined') {
      return {
        id: 'guest-user',
        display_name: 'Elena',
        email: 'guest@mindcheck.ai',
        reminder_time: '20:30',
        theme: 'editorial',
        is_guest: true,
        created_at: new Date().toISOString(),
      };
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      const defaultProf: UserProfile = {
        id: 'guest-user',
        display_name: 'Elena',
        email: 'guest@mindcheck.ai',
        reminder_time: '20:30',
        theme: 'editorial',
        is_guest: true,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProf));
      return defaultProf;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        id: 'guest-user',
        display_name: 'Elena',
        email: 'guest@mindcheck.ai',
        reminder_time: '20:30',
        theme: 'editorial',
        is_guest: true,
        created_at: new Date().toISOString(),
      };
    }
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }
    return updated;
  },

  getMoodEntries(): MoodEntry[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
    if (!raw) {
      const initial = getInitialSeedMoods();
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addMoodEntry(entry: Omit<MoodEntry, 'id' | 'created_at'>): MoodEntry {
    const entries = this.getMoodEntries();
    const newEntry: MoodEntry = {
      ...entry,
      id: 'mood-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(entries));
    }
    return newEntry;
  },

  deleteMoodEntry(id: string): void {
    const entries = this.getMoodEntries().filter((e) => e.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(entries));
    }
  },

  getJournalEntries(): JournalEntry[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    if (!raw) {
      const initial = getInitialSeedJournals();
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): JournalEntry {
    const entries = this.getJournalEntries();
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: 'journal-' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    entries.unshift(newEntry);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(entries));
    }
    return newEntry;
  },

  updateJournalEntry(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const entries = this.getJournalEntries();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    entries[idx] = {
      ...entries[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(entries));
    }
    return entries[idx];
  },

  deleteJournalEntry(id: string): void {
    const entries = this.getJournalEntries().filter((e) => e.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(entries));
    }
  },

  getGoals(): WellnessGoal[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      const initial = getInitialSeedGoals();
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addGoal(goal: Omit<WellnessGoal, 'id' | 'created_at' | 'completed_dates'>): WellnessGoal {
    const goals = this.getGoals();
    const newGoal: WellnessGoal = {
      ...goal,
      id: 'goal-' + Date.now(),
      completed_dates: [],
      created_at: new Date().toISOString(),
    };
    goals.push(newGoal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
    return newGoal;
  },

  toggleGoalDate(id: string, dateStr: string): WellnessGoal | null {
    const goals = this.getGoals();
    const goal = goals.find((g) => g.id === id);
    if (!goal) return null;

    if (goal.completed_dates.includes(dateStr)) {
      goal.completed_dates = goal.completed_dates.filter((d) => d !== dateStr);
    } else {
      goal.completed_dates.push(dateStr);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
    return goal;
  },

  deleteGoal(id: string): void {
    const goals = this.getGoals().filter((g) => g.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
  },

  getActivityCompletions(): ActivityCompletion[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  logActivity(activity: Omit<ActivityCompletion, 'id' | 'completed_at'>): ActivityCompletion {
    const activities = this.getActivityCompletions();
    const newAct: ActivityCompletion = {
      ...activity,
      id: 'act-' + Date.now(),
      completed_at: new Date().toISOString(),
    };
    activities.unshift(newAct);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    }
    return newAct;
  },

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.MOODS);
    localStorage.removeItem(STORAGE_KEYS.JOURNALS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    // Write empty arrays to prevent re-seeding
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
  },

  exportAllData(): string {
    const exportData = {
      exported_at: new Date().toISOString(),
      profile: this.getProfile(),
      mood_entries: this.getMoodEntries(),
      journal_entries: this.getJournalEntries(),
      wellness_goals: this.getGoals(),
      activity_completions: this.getActivityCompletions(),
    };
    return JSON.stringify(exportData, null, 2);
  },
};
