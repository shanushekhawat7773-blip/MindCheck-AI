'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Repository } from '@/lib/storage/repository';
import { WellnessGoal } from '@/lib/storage/types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Moon,
  Activity,
  X,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalsPage() {
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WellnessGoal['category']>('mindfulness');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const presetGoals = [
    { title: 'Complete daily emotional check-in', category: 'reflection' as const, frequency: 'daily' as const },
    { title: 'Practice 4-7-8 breathing before bed', category: 'sleep' as const, frequency: 'daily' as const },
    { title: '15-minute screen-free nature walk', category: 'movement' as const, frequency: 'weekly' as const },
    { title: 'Write in private journal 3x this week', category: 'reflection' as const, frequency: 'weekly' as const },
    { title: 'Take a 2-minute mindful pause midday', category: 'mindfulness' as const, frequency: 'daily' as const },
  ];

  const loadGoals = async () => {
    setIsLoading(true);
    const data = await Repository.getGoals();
    setGoals(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleToggle = async (id: string) => {
    const updated = await Repository.toggleGoalDate(id, todayStr);
    if (updated?.completed_dates.includes(todayStr)) {
      try {
        confetti({ particleCount: 25, origin: { y: 0.6 } });
      } catch {}
    }
    await loadGoals();
  };

  const handleAddGoal = async (title: string, category: WellnessGoal['category'], frequency: 'daily' | 'weekly') => {
    if (!title.trim()) return;
    await Repository.addGoal({
      user_id: 'current-user',
      title: title.trim(),
      category,
      target_frequency: frequency,
      target_count: frequency === 'daily' ? 1 : 3,
      status: 'active',
    });
    setNewTitle('');
    setIsAdding(false);
    await loadGoals();
  };

  const handleDelete = async (id: string) => {
    await Repository.deleteGoal(id);
    await loadGoals();
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-ivory">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h1 className="font-editorial text-2xl text-forest font-normal">
                  Gentle Habits & Intentions
                </h1>
              </div>
              <p className="text-xs text-muted mt-1">
                Realistic, self-compassionate routines. No punishing streak counters.
              </p>
            </div>

            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="shadow-soft gap-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              Add Intention
            </Button>
          </div>

          {/* Add Goal Form */}
          {isAdding && (
            <Card className="p-6 bg-white border-sand-300 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
                <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                  Create a New Wellness Intention
                </span>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1 rounded-lg hover:bg-sand-100 text-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Presets suggestions */}
              <div className="mb-4">
                <span className="text-xs text-muted block mb-2">Or choose a thoughtful preset:</span>
                <div className="flex flex-wrap gap-2">
                  {presetGoals.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddGoal(preset.title, preset.category, preset.frequency)}
                      className="text-xs px-3 py-1.5 rounded-full bg-sand-100 border border-sand-200 text-forest hover:bg-sand-200 transition-colors"
                    >
                      + {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-forest mb-1">
                    What habit would you like to nurture?
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 10 minutes of reading before turning off lights"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-sand-50/50 text-xs focus:ring-1 focus:ring-forest focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-xs font-medium text-forest mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as WellnessGoal['category'])}
                      className="w-full p-2 rounded-xl border border-sand-300 bg-sand-50 text-xs text-charcoal focus:ring-1 focus:ring-forest"
                    >
                      <option value="mindfulness">Mindfulness & Centering</option>
                      <option value="sleep">Rest & Sleep</option>
                      <option value="movement">Gentle Movement</option>
                      <option value="reflection">Self-Reflection & Journaling</option>
                      <option value="connection">Connection & Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-forest mb-1">Frequency</label>
                    <select
                      value={newFrequency}
                      onChange={(e) => setNewFrequency(e.target.value as 'daily' | 'weekly')}
                      className="w-full p-2 rounded-xl border border-sand-300 bg-sand-50 text-xs text-charcoal focus:ring-1 focus:ring-forest"
                    >
                      <option value="daily">Daily practice</option>
                      <option value="weekly">Weekly rhythm (2-3 times/week)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!newTitle.trim()}
                    onClick={() => handleAddGoal(newTitle, newCategory, newFrequency)}
                    className="text-xs"
                  >
                    Save Intention
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Goals List */}
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 rounded-xl bg-sand-200" />
              <div className="h-16 rounded-xl bg-sand-200" />
            </div>
          ) : goals.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-forest mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-sage-500" />
              </div>
              <h3 className="font-editorial text-lg text-forest">No intentions created yet</h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                Begin with one small intention to nurture your well-being.
              </p>
              <Button onClick={() => setIsAdding(true)} size="sm">
                Add Your First Intention
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const isCompletedToday = goal.completed_dates.includes(todayStr);
                const totalCompletions = goal.completed_dates.length;

                return (
                  <Card
                    key={goal.id}
                    className={`p-4 transition-all flex items-center justify-between ${
                      isCompletedToday
                        ? 'bg-sage-50/70 border-sage-300'
                        : 'bg-white/80 border-sand-200 hover:border-sand-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(goal.id)}
                        className="text-forest hover:scale-110 transition-transform focus:outline-none"
                      >
                        {isCompletedToday ? (
                          <CheckCircle2 className="w-5 h-5 text-forest fill-sage-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted hover:text-forest" />
                        )}
                      </button>

                      <div>
                        <span
                          className={`text-sm font-medium block ${
                            isCompletedToday ? 'line-through text-muted' : 'text-forest'
                          }`}
                        >
                          {goal.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                          <span className="capitalize">{goal.category}</span>
                          <span>•</span>
                          <span>{goal.target_frequency}</span>
                          <span>•</span>
                          <span>Completed {totalCompletions} times</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-1.5 rounded-lg text-muted/60 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Remove intention"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
