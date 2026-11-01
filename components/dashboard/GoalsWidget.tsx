'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { WellnessGoal } from '@/lib/storage/types';
import { CheckCircle2, Circle, Plus, ArrowRight } from 'lucide-react';

interface GoalsWidgetProps {
  goals: WellnessGoal[];
  onToggleGoal: (id: string) => void;
}

export function GoalsWidget({ goals, onToggleGoal }: GoalsWidgetProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const completedTodayCount = goals.filter((g) =>
    g.completed_dates.includes(todayStr)
  ).length;

  const totalGoals = goals.length;
  const progressPercent =
    totalGoals > 0 ? Math.round((completedTodayCount / totalGoals) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-xl font-normal text-forest">
              Daily Intentions
            </h3>
            <span className="text-[11px] font-medium text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
              {completedTodayCount}/{totalGoals} Today
            </span>
          </div>
          <p className="text-xs text-muted">Gentle non-punitive habits for daily restoration</p>
        </div>

        <Link
          href="/goals"
          className="text-xs text-sage-600 hover:text-forest font-medium flex items-center gap-1"
        >
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Progress bar */}
      {totalGoals > 0 && (
        <div className="mb-4">
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-forest h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted">
          <p>No active intentions set yet.</p>
          <Link href="/goals" className="inline-block mt-2 text-forest font-medium hover:underline">
            + Create your first intention
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {goals.slice(0, 4).map((goal) => {
            const isCompleted = goal.completed_dates.includes(todayStr);
            return (
              <div
                key={goal.id}
                onClick={() => onToggleGoal(goal.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCompleted
                    ? 'bg-sage-50/70 border-sage-300 text-forest'
                    : 'bg-sand-50/40 border-sand-200 text-charcoal hover:border-sand-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isCompleted ? 'line-through text-muted' : 'text-charcoal'
                    }`}
                  >
                    {goal.title}
                  </span>
                </div>
                <span className="text-[10px] text-muted capitalize bg-white/80 px-2 py-0.5 rounded border border-sand-200">
                  {goal.category}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
