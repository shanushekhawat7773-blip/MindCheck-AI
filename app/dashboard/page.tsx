'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { MoodTrendChart } from '@/components/dashboard/MoodTrendChart';
import { DailyCheckinWidget } from '@/components/dashboard/DailyCheckinWidget';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { RecentReflections } from '@/components/dashboard/RecentReflections';
import { QuickActivities } from '@/components/dashboard/QuickActivities';
import { Repository } from '@/lib/storage/repository';
import {
  JournalEntry,
  MoodEntry,
  UserProfile,
  WellnessGoal,
} from '@/lib/storage/types';
import {
  calculateDailyMoodTrends,
  DailyTrendPoint,
  generatePersonalInsights,
  CorrelationInsight,
} from '@/lib/analytics/calculations';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [trendPoints, setTrendPoints] = useState<DailyTrendPoint[]>([]);
  const [insights, setInsights] = useState<CorrelationInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [prof, userMoods, userJournals, userGoals] = await Promise.all([
      Repository.getProfile(),
      Repository.getMoodEntries(),
      Repository.getJournalEntries(),
      Repository.getGoals(),
    ]);

    setProfile(prof);
    setMoods(userMoods);
    setJournals(userJournals);
    setGoals(userGoals);

    // Calculate rolling 7-day trend
    const trends = calculateDailyMoodTrends(userMoods, 7);
    setTrendPoints(trends);

    // Calculate insights from real data
    const genInsights = generatePersonalInsights(userMoods);
    setInsights(genInsights);

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleGoal = async (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    await Repository.toggleGoalDate(id, todayStr);
    const updatedGoals = await Repository.getGoals();
    setGoals(updatedGoals);
  };

  // Find if an entry exists for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry =
    moods.find((e) => new Date(e.created_at).toISOString().split('T')[0] === todayStr) || null;

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        {/* Desktop Minimal Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-40 rounded-3xl bg-sand-200" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-72 rounded-2xl bg-sand-200" />
                <div className="h-72 rounded-2xl bg-sand-200" />
              </div>
            </div>
          ) : (
            <>
              {/* Personalized Welcome Banner */}
              <WelcomeBanner
                displayName={profile?.display_name || 'Friend'}
                todayEntry={todayEntry}
              />

              {/* Main Grid: Left 2 cols, Right 1 col */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Weekly Trend & Daily Checkin */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Daily Check-In prominent widget */}
                  <DailyCheckinWidget todayEntry={todayEntry} />

                  {/* Weekly Mood Trend Chart */}
                  <MoodTrendChart trendPoints={trendPoints} />

                  {/* Restorative Activities */}
                  <QuickActivities />
                </div>

                {/* Right Column: Insights, Goals, Recent Journal */}
                <div className="space-y-6">
                  {/* Real Insights based strictly on logs */}
                  <InsightsCard insights={insights} />

                  {/* Compact Wellness Goals */}
                  <GoalsWidget goals={goals} onToggleGoal={handleToggleGoal} />

                  {/* Recent Journal Reflections */}
                  <RecentReflections entries={journals} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
