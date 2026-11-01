import { LocalStore } from './localStore';
import {
  ActivityCompletion,
  JournalEntry,
  MoodEntry,
  UserProfile,
  WellnessGoal,
} from './types';
import { isSupabaseConfigured, supabase } from '../supabase/client';

export const Repository = {
  async getProfile(): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data) return data as UserProfile;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }
    return LocalStore.getProfile();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();
          if (!error && data) return data as UserProfile;
        }
      } catch (err) {
        console.warn('Supabase update failed, using local storage', err);
      }
    }
    return LocalStore.updateProfile(updates);
  },

  async getMoodEntries(): Promise<MoodEntry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('mood_entries')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data) return data as MoodEntry[];
        }
      } catch (err) {
        console.warn('Supabase getMoodEntries failed, using local storage', err);
      }
    }
    return LocalStore.getMoodEntries();
  },

  async addMoodEntry(entry: Omit<MoodEntry, 'id' | 'created_at'>): Promise<MoodEntry> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('mood_entries')
            .insert([{ ...entry, user_id: user.id }])
            .select()
            .single();
          if (!error && data) return data as MoodEntry;
        }
      } catch (err) {
        console.warn('Supabase addMoodEntry failed, using local storage', err);
      }
    }
    return LocalStore.addMoodEntry(entry);
  },

  async deleteMoodEntry(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('mood_entries').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteMoodEntry failed', err);
      }
    }
    LocalStore.deleteMoodEntry(id);
  },

  async getJournalEntries(): Promise<JournalEntry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data) return data as JournalEntry[];
        }
      } catch (err) {
        console.warn('Supabase getJournalEntries failed', err);
      }
    }
    return LocalStore.getJournalEntries();
  },

  async addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('journal_entries')
            .insert([{ ...entry, user_id: user.id }])
            .select()
            .single();
          if (!error && data) return data as JournalEntry;
        }
      } catch (err) {
        console.warn('Supabase addJournalEntry failed', err);
      }
    }
    return LocalStore.addJournalEntry(entry);
  },

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as JournalEntry;
      } catch (err) {
        console.warn('Supabase updateJournalEntry failed', err);
      }
    }
    return LocalStore.updateJournalEntry(id, updates);
  },

  async deleteJournalEntry(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('journal_entries').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteJournalEntry failed', err);
      }
    }
    LocalStore.deleteJournalEntry(id);
  },

  async getGoals(): Promise<WellnessGoal[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('wellness_goals')
            .select('*')
            .order('created_at', { ascending: true });
          if (!error && data) return data as WellnessGoal[];
        }
      } catch (err) {
        console.warn('Supabase getGoals failed', err);
      }
    }
    return LocalStore.getGoals();
  },

  async addGoal(goal: Omit<WellnessGoal, 'id' | 'created_at' | 'completed_dates'>): Promise<WellnessGoal> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('wellness_goals')
            .insert([{ ...goal, user_id: user.id }])
            .select()
            .single();
          if (!error && data) return data as WellnessGoal;
        }
      } catch (err) {
        console.warn('Supabase addGoal failed', err);
      }
    }
    return LocalStore.addGoal(goal);
  },

  async toggleGoalDate(id: string, dateStr: string): Promise<WellnessGoal | null> {
    const updated = LocalStore.toggleGoalDate(id, dateStr);
    if (isSupabaseConfigured && supabase && updated) {
      try {
        await supabase
          .from('wellness_goals')
          .update({ completed_dates: updated.completed_dates })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase toggleGoalDate failed', err);
      }
    }
    return updated;
  },

  async deleteGoal(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('wellness_goals').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteGoal failed', err);
      }
    }
    LocalStore.deleteGoal(id);
  },

  async getActivityCompletions(): Promise<ActivityCompletion[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('activity_completions')
            .select('*')
            .order('completed_at', { ascending: false });
          if (!error && data) return data as ActivityCompletion[];
        }
      } catch (err) {
        console.warn('Supabase getActivityCompletions failed', err);
      }
    }
    return LocalStore.getActivityCompletions();
  },

  async logActivity(activity: Omit<ActivityCompletion, 'id' | 'completed_at'>): Promise<ActivityCompletion> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('activity_completions')
            .insert([{ ...activity, user_id: user.id }])
            .select()
            .single();
          if (!error && data) return data as ActivityCompletion;
        }
      } catch (err) {
        console.warn('Supabase logActivity failed', err);
      }
    }
    return LocalStore.logActivity(activity);
  },

  clearAllData(): void {
    LocalStore.clearAllData();
  },

  exportAllData(): string {
    return LocalStore.exportAllData();
  },
};
