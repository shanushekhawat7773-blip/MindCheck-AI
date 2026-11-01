'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MoodEntry, MOOD_DEFINITIONS, MoodType } from '@/lib/storage/types';
import { ArrowRight, Check, Heart, Sparkles } from 'lucide-react';

interface DailyCheckinWidgetProps {
  todayEntry: MoodEntry | null;
  onQuickSelectMood?: (mood: MoodType) => void;
}

export function DailyCheckinWidget({ todayEntry, onQuickSelectMood }: DailyCheckinWidgetProps) {
  const quickMoods: MoodType[] = [
    'calm',
    'hopeful',
    'happy',
    'neutral',
    'tired',
    'stressed',
    'anxious',
    'overwhelmed',
  ];

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-forest" />
          <h3 className="font-editorial text-xl font-normal text-forest">
            Daily Emotional Check-In
          </h3>
        </div>
        <Link href="/checkin" className="text-xs text-sage-600 hover:text-forest font-medium">
          Full 7-Step Flow &rarr;
        </Link>
      </div>

      {todayEntry ? (
        <div className="p-4 rounded-2xl bg-sage-50/60 border border-sage-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {MOOD_DEFINITIONS[todayEntry.mood]?.emoji}
              </span>
              <div>
                <span className="text-xs font-semibold text-forest block">
                  Logged as {MOOD_DEFINITIONS[todayEntry.mood]?.label}
                </span>
                <span className="text-[11px] text-muted">
                  Intensity: {todayEntry.intensity}/10 •{' '}
                  {todayEntry.sleep_quality ? `Sleep: ${todayEntry.sleep_quality}★` : 'Self-Reflection'}
                </span>
              </div>
            </div>
            <Link href="/checkin">
              <Button size="sm" variant="outline" className="text-xs">
                Edit Entry
              </Button>
            </Link>
          </div>

          {todayEntry.reflection && (
            <p className="mt-3 text-xs text-charcoal/80 italic border-l-2 border-sage-400 pl-2.5">
              &quot;{todayEntry.reflection}&quot;
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted mb-3">
            How are you carrying yourself right now? Tap a state to start:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickMoods.map((moodKey) => {
              const def = MOOD_DEFINITIONS[moodKey];
              return (
                <Link
                  key={moodKey}
                  href={`/checkin?initialMood=${moodKey}`}
                  className="p-2.5 rounded-xl border border-sand-300 hover:border-forest hover:bg-sand-50 transition-all flex items-center gap-2 text-left group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {def.emoji}
                  </span>
                  <span className="text-xs font-medium text-forest truncate">
                    {def.label.split('&')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
