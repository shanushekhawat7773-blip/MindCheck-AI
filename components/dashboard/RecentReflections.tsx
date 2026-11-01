'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { JournalEntry, MOOD_DEFINITIONS } from '@/lib/storage/types';
import { BookOpen, ArrowRight, PenLine } from 'lucide-react';
import { Button } from '../ui/Button';

interface RecentReflectionsProps {
  entries: JournalEntry[];
}

export function RecentReflections({ entries }: RecentReflectionsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
        <div>
          <h3 className="font-editorial text-xl font-normal text-forest">
            Recent Reflections
          </h3>
          <p className="text-xs text-muted">Quiet thoughts saved to your private journal</p>
        </div>

        <Link
          href="/journal"
          className="text-xs text-sage-600 hover:text-forest font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted">
          <p>Your journal is waiting for your first reflection.</p>
          <Link href="/journal" className="inline-block mt-3">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <PenLine className="w-3.5 h-3.5" />
              Write your first thought
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 3).map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            const moodDef = item.mood ? MOOD_DEFINITIONS[item.mood] : null;

            return (
              <Link
                key={item.id}
                href="/journal"
                className="block p-3.5 rounded-xl bg-sand-50/60 border border-sand-200 hover:border-sand-300 hover:bg-sand-100/60 transition-all text-left"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-forest truncate max-w-[200px]">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-muted">
                    {moodDef && <span>{moodDef.emoji}</span>}
                    <span className="text-[11px]">{dateStr}</span>
                  </div>
                </div>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
