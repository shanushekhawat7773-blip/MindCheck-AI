import { describe, it, expect } from 'vitest';
import {
  calculateDailyMoodTrends,
  calculateMoodDistribution,
  calculateCheckinStreak,
  generatePersonalInsights,
} from '../lib/analytics/calculations';
import { MoodEntry } from '../lib/storage/types';

describe('Analytics Calculations Suite', () => {
  it('handles empty entries gracefully', () => {
    const trends = calculateDailyMoodTrends([]);
    expect(trends).toHaveLength(7);
    expect(trends[0].hasEntry).toBe(false);

    const dist = calculateMoodDistribution([]);
    expect(dist).toEqual([]);

    const streak = calculateCheckinStreak([]);
    expect(streak).toBe(0);

    const insights = generatePersonalInsights([]);
    expect(insights).toHaveLength(1);
    expect(insights[0].title).toBe('Building Your Baseline');
  });

  it('correctly groups entries and maps scores', () => {
    const mockEntries: MoodEntry[] = [
      {
        id: '1',
        user_id: 'u1',
        mood: 'calm',
        intensity: 8,
        sleep_quality: 5,
        energy_level: 'moderate',
        stress_level: 'low',
        created_at: new Date().toISOString(),
      },
    ];

    const dist = calculateMoodDistribution(mockEntries);
    expect(dist).toHaveLength(1);
    expect(dist[0].mood).toBe('calm');
    expect(dist[0].percentage).toBe(100);

    const streak = calculateCheckinStreak(mockEntries);
    expect(streak).toBe(1);
  });
});
