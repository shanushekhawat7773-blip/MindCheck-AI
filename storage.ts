import { CheckInResult, CurrentMood } from './types';

const STORAGE_KEY_CHECKINS = 'mindcheck_history_v1';
const STORAGE_KEY_QUICK_MOOD = 'mindcheck_quick_moods_v1';
const STORAGE_KEY_PREFS = 'mindcheck_user_prefs_v1';

export interface StoredMoodLog {
  id: string;
  mood: CurrentMood;
  timestamp: string;
  note?: string;
}

export function getStoredCheckIns(): CheckInResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKINS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read check-ins from localStorage', err);
    return [];
  }
}

export function saveCheckIn(result: CheckInResult): boolean {
  if (typeof window === 'undefined') return false;
  if (result.storageMode === 'ephemeral') {
    // Keep only in session storage
    try {
      sessionStorage.setItem('mindcheck_latest_ephemeral', JSON.stringify(result));
      return true;
    } catch {
      return false;
    }
  }

  try {
    const existing = getStoredCheckIns();
    // Prepend latest checkin
    const updated = [result, ...existing];
    localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save check-in', err);
    return false;
  }
}

export function getLatestCheckIn(): CheckInResult | null {
  if (typeof window === 'undefined') return null;
  // Check session storage first (for ephemeral test)
  try {
    const ephemeral = sessionStorage.getItem('mindcheck_latest_ephemeral');
    if (ephemeral) return JSON.parse(ephemeral);
  } catch {}

  const history = getStoredCheckIns();
  return history.length > 0 ? history[0] : null;
}

export function clearAllHistory(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(STORAGE_KEY_CHECKINS);
    localStorage.removeItem(STORAGE_KEY_QUICK_MOOD);
    sessionStorage.removeItem('mindcheck_latest_ephemeral');
    return true;
  } catch (err) {
    console.error('Failed to clear history', err);
    return false;
  }
}

export function exportHistoryAsJSON(): string {
  const checkins = getStoredCheckIns();
  const moods = getStoredQuickMoods();
  const exportData = {
    appName: 'MindCheck AI',
    exportTimestamp: new Date().toISOString(),
    privacyNotice: 'Exported from local device browser storage. Contains self-reported well-being reflections.',
    checkIns: checkins,
    moodLogs: moods,
  };
  return JSON.stringify(exportData, null, 2);
}

export function getStoredQuickMoods(): StoredMoodLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUICK_MOOD);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuickMood(mood: CurrentMood, note?: string): StoredMoodLog {
  const newLog: StoredMoodLog = {
    id: `mood_${Date.now()}`,
    mood,
    timestamp: new Date().toISOString(),
    note,
  };
  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredQuickMoods();
      const updated = [newLog, ...existing.slice(0, 49)]; // keep up to 50
      localStorage.setItem(STORAGE_KEY_QUICK_MOOD, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save quick mood', err);
    }
  }
  return newLog;
}
