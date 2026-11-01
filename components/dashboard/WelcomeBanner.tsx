'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { MoodEntry, MOOD_DEFINITIONS } from '@/lib/storage/types';

interface WelcomeBannerProps {
  displayName: string;
  todayEntry: MoodEntry | null;
}

export function WelcomeBanner({ displayName, todayEntry }: WelcomeBannerProps) {
  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const moodDef = todayEntry ? MOOD_DEFINITIONS[todayEntry.mood] : null;

  return (
    <div className="rounded-3xl bg-sand-100/70 border border-sand-300 p-6 sm:p-8 relative overflow-hidden shadow-soft">
      {/* Subtle organic background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-sage-200/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 right-24 w-36 h-36 bg-lavender-200/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted uppercase tracking-wider mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="text-sage-600 font-semibold">MindCheck Space</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl text-forest font-normal">
            {greeting}, <span className="italic font-normal">{displayName}</span>.
          </h1>

          <p className="mt-2 text-sm text-charcoal/80 max-w-xl leading-relaxed">
            {todayEntry ? (
              <span>
                You took time to reflect today. Honoring your emotional states as they come creates space for quiet resilience.
              </span>
            ) : (
              <span>
                Pause for a breath before diving into tasks. How is your mind feeling as you arrive at this moment?
              </span>
            )}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          {todayEntry && moodDef ? (
            <div className="flex items-center gap-3 bg-white/90 border border-sand-300 px-4 py-2.5 rounded-2xl shadow-soft">
              <span className="text-2xl">{moodDef.emoji}</span>
              <div className="text-left">
                <span className="text-[11px] text-muted block leading-none">Today&apos;s check-in</span>
                <span className="text-xs font-semibold text-forest">{moodDef.label.split('&')[0]}</span>
              </div>
              <Link href="/checkin">
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto text-sage-600 hover:text-forest">
                  Update
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/checkin">
              <Button size="md" className="shadow-soft gap-2">
                <Heart className="w-4 h-4 text-sage-300" />
                Complete Today&apos;s Check-In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
