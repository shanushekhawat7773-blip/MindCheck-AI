import { MoodEntry, MOOD_DEFINITIONS, MoodType } from '../storage/types';

export interface DailyTrendPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. 'Mon', 'Nov 2'
  intensity: number | null;
  score: number | null; // 1 to 9 mapped score
  mood: MoodType | null;
  emoji: string;
  hasEntry: boolean;
}

export interface MoodDistributionItem {
  mood: MoodType;
  label: string;
  count: number;
  percentage: number;
  color: string;
  emoji: string;
}

export interface CorrelationInsight {
  title: string;
  description: string;
  icon: 'sleep' | 'energy' | 'stress' | 'consistency';
}

/**
 * Calculates a rolling 7-day or N-day daily trend points from mood entries.
 */
export function calculateDailyMoodTrends(entries: MoodEntry[], daysCount: number = 7): DailyTrendPoint[] {
  const points: DailyTrendPoint[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayLabel = d.toLocaleDateString('en-US', {
      weekday: daysCount <= 7 ? 'short' : undefined,
      month: 'short',
      day: 'numeric',
    });

    // Find entries for this date
    const dayEntries = entries.filter((e) => {
      const entryDate = new Date(e.created_at).toISOString().split('T')[0];
      return entryDate === dateStr;
    });

    if (dayEntries.length === 0) {
      points.push({
        date: dateStr,
        dayLabel,
        intensity: null,
        score: null,
        mood: null,
        emoji: '—',
        hasEntry: false,
      });
    } else {
      // Pick the latest entry of that day or average them
      const latest = dayEntries[dayEntries.length - 1];
      const avgIntensity = Math.round(
        dayEntries.reduce((acc, curr) => acc + curr.intensity, 0) / dayEntries.length
      );
      const moodDef = MOOD_DEFINITIONS[latest.mood] || MOOD_DEFINITIONS.neutral;

      points.push({
        date: dateStr,
        dayLabel,
        intensity: avgIntensity,
        score: moodDef.score,
        mood: latest.mood,
        emoji: moodDef.emoji,
        hasEntry: true,
      });
    }
  }

  return points;
}

/**
 * Calculates distribution of moods across entries.
 */
export function calculateMoodDistribution(entries: MoodEntry[]): MoodDistributionItem[] {
  if (entries.length === 0) return [];

  const counts: Partial<Record<MoodType, number>> = {};
  entries.forEach((e) => {
    counts[e.mood] = (counts[e.mood] || 0) + 1;
  });

  const total = entries.length;

  return Object.entries(counts)
    .map(([moodKey, count]) => {
      const mood = moodKey as MoodType;
      const def = MOOD_DEFINITIONS[mood] || MOOD_DEFINITIONS.neutral;
      return {
        mood,
        label: def.label,
        count: count || 0,
        percentage: Math.round(((count || 0) / total) * 100),
        color: def.color,
        emoji: def.emoji,
      };
    })
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates grounded, supportive, non-clinical personal insights based solely on user's actual entries.
 */
export function generatePersonalInsights(entries: MoodEntry[]): CorrelationInsight[] {
  if (entries.length < 3) {
    return [
      {
        title: 'Building Your Baseline',
        description: 'You need at least 3 emotional check-ins to discover meaningful personal patterns. Every check-in is an investment in self-awareness.',
        icon: 'consistency',
      },
    ];
  }

  const insights: CorrelationInsight[] = [];

  // Sleep correlation
  const entriesWithSleep = entries.filter((e) => typeof e.sleep_quality === 'number');
  if (entriesWithSleep.length >= 3) {
    const goodSleepEntries = entriesWithSleep.filter((e) => (e.sleep_quality ?? 0) >= 4);
    const lowSleepEntries = entriesWithSleep.filter((e) => (e.sleep_quality ?? 0) <= 2);

    const goodSleepCalmRatio =
      goodSleepEntries.length > 0
        ? goodSleepEntries.filter((e) => ['happy', 'calm', 'hopeful'].includes(e.mood)).length /
          goodSleepEntries.length
        : 0;

    const lowSleepStressRatio =
      lowSleepEntries.length > 0
        ? lowSleepEntries.filter((e) => ['stressed', 'tired', 'anxious', 'overwhelmed'].includes(e.mood)).length /
          lowSleepEntries.length
        : 0;

    if (goodSleepCalmRatio >= 0.5) {
      insights.push({
        title: 'Sleep Nurtures Your Calm',
        description: `On days after rating sleep 4★ or 5★, ${Math.round(goodSleepCalmRatio * 100)}% of your check-ins reflected calm or joyful feelings. Rest appears to be a protective anchor for your mind.`,
        icon: 'sleep',
      });
    } else if (lowSleepStressRatio >= 0.5) {
      insights.push({
        title: 'Rest & Resilience Link',
        description: `Lower sleep ratings often coincide with feelings of fatigue or tension in your logs. Gentle bedtime rituals may support your daytime balance.`,
        icon: 'sleep',
      });
    }
  }

  // Energy & Stress balance
  const stressedEntries = entries.filter((e) => e.stress_level === 'high' || e.mood === 'stressed' || e.mood === 'overwhelmed');
  if (stressedEntries.length > 0 && stressedEntries.length >= entries.length * 0.4) {
    insights.push({
      title: 'High Demand Period',
      description: `You've recorded elevated stress in ${stressedEntries.length} of your recent check-ins. Remember that rest is productive, not something you have to earn.`,
      icon: 'stress',
    });
  } else {
    insights.push({
      title: 'Equilibrium Observed',
      description: `Your reflections show a steady balance across the week. Acknowledging both calm moments and challenges helps maintain emotional agility.`,
      icon: 'energy',
    });
  }

  // Consistency observation
  const recentDays = calculateDailyMoodTrends(entries, 7);
  const activeDays = recentDays.filter((d) => d.hasEntry).length;
  insights.push({
    title: 'Dedication to Self-Reflection',
    description: `You have completed ${activeDays} check-in${activeDays === 1 ? '' : 's'} across the past 7 days. Even brief moments of honest awareness build lasting resilience.`,
    icon: 'consistency',
  });

  return insights;
}

/**
 * Non-punitive checkin streak calculator.
 */
export function calculateCheckinStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  const dates = new Set(
    entries.map((e) => new Date(e.created_at).toISOString().split('T')[0])
  );

  let streak = 0;
  const d = new Date();

  // If today has an entry, start from today, else start from yesterday
  const todayStr = d.toISOString().split('T')[0];
  if (!dates.has(todayStr)) {
    d.setDate(d.getDate() - 1);
  }

  while (true) {
    const curStr = d.toISOString().split('T')[0];
    if (dates.has(curStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
