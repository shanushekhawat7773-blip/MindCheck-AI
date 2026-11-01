'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Repository } from '@/lib/storage/repository';
import { MoodEntry, MOOD_DEFINITIONS } from '@/lib/storage/types';
import {
  calculateDailyMoodTrends,
  calculateMoodDistribution,
  calculateCheckinStreak,
  generatePersonalInsights,
  DailyTrendPoint,
  MoodDistributionItem,
  CorrelationInsight,
} from '@/lib/analytics/calculations';
import {
  BarChart2,
  Calendar,
  Sparkles,
  Moon,
  Zap,
  Info,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { MoodTrendChart } from '@/components/dashboard/MoodTrendChart';

export default function InsightsPage() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [timeframe, setTimeframe] = useState<7 | 30>(7);
  const [trendPoints, setTrendPoints] = useState<DailyTrendPoint[]>([]);
  const [distribution, setDistribution] = useState<MoodDistributionItem[]>([]);
  const [insights, setInsights] = useState<CorrelationInsight[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Repository.getMoodEntries().then((data) => {
      setEntries(data);
      setTrendPoints(calculateDailyMoodTrends(data, timeframe));
      setDistribution(calculateMoodDistribution(data));
      setInsights(generatePersonalInsights(data));
      setStreak(calculateCheckinStreak(data));
      setIsLoading(false);
    });
  }, [timeframe]);

  const hasSufficientData = entries.length >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-ivory">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h1 className="font-editorial text-2xl text-forest font-normal">
                  Emotional Trends & Insights
                </h1>
              </div>
              <p className="text-xs text-muted mt-1">
                Reflective observations calculated from your recorded check-ins. No speculative predictions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeframe(7)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  timeframe === 7
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal hover:bg-sand-50'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeframe(30)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  timeframe === 30
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal hover:bg-sand-50'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-white/80">
              <span className="text-[11px] text-muted block mb-1">Total Recorded Check-Ins</span>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-forest">
                  {entries.length}
                </span>
                <span className="text-xs text-muted">lifetime entries</span>
              </div>
            </Card>

            <Card className="p-4 bg-white/80">
              <span className="text-[11px] text-muted block mb-1">Check-In Consistency</span>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-forest">
                  {streak}
                </span>
                <span className="text-xs text-muted">day{streak === 1 ? '' : 's'} steady pace</span>
              </div>
            </Card>

            <Card className="p-4 bg-white/80">
              <span className="text-[11px] text-muted block mb-1">Most Frequent State</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {distribution[0]?.emoji || '🌿'}
                </span>
                <span className="font-editorial text-xl text-forest">
                  {distribution[0]?.label.split('&')[0] || 'Baseline'}
                </span>
              </div>
            </Card>
          </div>

          {/* Trend Line Chart */}
          <MoodTrendChart trendPoints={trendPoints} />

          {/* Grid: Mood Distribution & Correlation Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Distribution */}
            <Card className="p-6">
              <h3 className="font-editorial text-xl font-normal text-forest mb-1">
                Emotional Landscape Breakdown
              </h3>
              <p className="text-xs text-muted mb-6">
                Relative frequency of reported emotional states across all logs
              </p>

              {distribution.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted">
                  No data to display. Log entries to view your distribution.
                </div>
              ) : (
                <div className="space-y-3">
                  {distribution.map((item) => (
                    <div key={item.mood} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-forest">
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </span>
                        <span className="text-muted text-[11px]">
                          {item.count} log{item.count === 1 ? '' : 's'} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Grounded Correlation Insights */}
            <Card className="p-6">
              <h3 className="font-editorial text-xl font-normal text-forest mb-1">
                Descriptive Observations
              </h3>
              <p className="text-xs text-muted mb-6">
                Ground-level observations connecting sleep, stress, and mood
              </p>

              <div className="space-y-3">
                {insights.map((ins, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 flex items-start gap-3"
                  >
                    <div className="p-1.5 rounded-lg bg-white shadow-soft text-forest mt-0.5">
                      <Sparkles className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-forest uppercase tracking-wide">
                        {ins.title}
                      </h4>
                      <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">
                        {ins.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {!hasSufficientData && (
                <div className="mt-4 p-3 rounded-xl bg-sage-50 border border-sage-200 text-xs text-forest/90">
                  You need at least 3 check-ins before statistical reflections become meaningful.
                </div>
              )}
            </Card>
          </div>

          {/* Ethics & Science Disclosure */}
          <div className="p-5 rounded-2xl bg-sand-100/70 border border-sand-300 text-xs text-muted leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-forest mb-1">
              <AlertCircle className="w-4 h-4 text-sage-600" />
              <span>Scientific Note on Correlation:</span>
            </div>
            Correlations presented above describe simultaneous occurrences (e.g. good sleep and calm mood) within your personal self-reports. They do not imply direct causation or clinical diagnosis. Human emotions are fluid and influenced by a rich array of social, physical, and environmental factors.
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
