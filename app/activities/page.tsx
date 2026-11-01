'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Repository } from '@/lib/storage/repository';
import {
  Sparkles,
  Wind,
  Eye,
  BookOpen,
  Heart,
  Clock,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type ActivityKey = 'breathing' | 'grounding' | 'gratitude' | 'pause' | 'planner';

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ActivityKey) || 'breathing';
  const [activeTab, setActiveTab] = useState<ActivityKey>(initialType);

  // 1. BREATHING STATE
  const [breathTechnique, setBreathTechnique] = useState<'478' | 'box'>('478');
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  // 2. GROUNDING STATE (5-4-3-2-1)
  const [groundingStep, setGroundingStep] = useState(5);
  const [groundingInputs, setGroundingInputs] = useState<Record<number, string[]>>({
    5: ['', '', '', '', ''],
    4: ['', '', '', ''],
    3: ['', '', ''],
    2: ['', ''],
    1: [''],
  });

  // 3. GRATITUDE STATE
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [isGratitudeSaved, setIsGratitudeSaved] = useState(false);

  // 4. MINDFUL PAUSE STATE
  const [pauseDuration, setPauseDuration] = useState(120); // 2 mins
  const [pauseRemaining, setPauseRemaining] = useState(120);
  const [isPauseRunning, setIsPauseRunning] = useState(false);

  // 5. SELF-CARE PLANNER
  const [planMorning, setPlanMorning] = useState('Gentle morning stretch & glass of water');
  const [planMidday, setPlanMidday] = useState('Screen-free lunch away from my desk');
  const [planEvening, setPlanEvening] = useState('Read 15 minutes before sleep without phone');
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // Play gentle web audio chime
  const playGentleChime = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Solfeggio frequency
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {
      // AudioContext unavailable
    }
  };

  // Breathing interval loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isBreathingRunning) {
      interval = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          if (breathTechnique === '478') {
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              setBreathCycles((c) => c + 1);
              playGentleChime();
              return 4;
            }
          } else {
            // Box breathing: 4-4-4-4
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 4;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 4;
            } else if (breathPhase === 'Exhale') {
              setBreathPhase('Rest');
              return 4;
            } else {
              setBreathPhase('Inhale');
              setBreathCycles((c) => c + 1);
              playGentleChime();
              return 4;
            }
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathingRunning, breathPhase, breathTechnique]);

  // Mindful pause interval loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPauseRunning && pauseRemaining > 0) {
      interval = setInterval(() => {
        setPauseRemaining((prev) => {
          if (prev <= 1) {
            setIsPauseRunning(false);
            playGentleChime();
            Repository.logActivity({
              user_id: 'current-user',
              activity_type: 'mindful_pause',
              duration_seconds: pauseDuration,
            });
            try {
              confetti({ particleCount: 30, origin: { y: 0.6 } });
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPauseRunning, pauseRemaining, pauseDuration]);

  const handleFinishBreathing = async () => {
    setIsBreathingRunning(false);
    await Repository.logActivity({
      user_id: 'current-user',
      activity_type: 'breathing',
      duration_seconds: breathCycles * (breathTechnique === '478' ? 19 : 16),
      notes: `${breathCycles} cycles of ${breathTechnique === '478' ? '4-7-8' : 'Box'} breathing`,
    });
    try {
      confetti({ particleCount: 35, origin: { y: 0.6 } });
    } catch {}
  };

  const handleFinishGratitude = async () => {
    if (!gratitude1 && !gratitude2 && !gratitude3) return;
    setIsGratitudeSaved(true);
    await Repository.logActivity({
      user_id: 'current-user',
      activity_type: 'gratitude',
      duration_seconds: 120,
      notes: `1: ${gratitude1} | 2: ${gratitude2} | 3: ${gratitude3}`,
    });
    try {
      confetti({ particleCount: 35, origin: { y: 0.6 } });
    } catch {}
  };

  const activities = [
    { id: 'breathing' as const, label: 'Paced Breathing', icon: Wind },
    { id: 'grounding' as const, label: '5-Senses Grounding', icon: Eye },
    { id: 'gratitude' as const, label: 'Gratitude Anchor', icon: Heart },
    { id: 'pause' as const, label: 'Mindful Pause', icon: Clock },
    { id: 'planner' as const, label: 'Self-Care Intentions', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-sand-200">
            <h1 className="font-editorial text-2xl text-forest font-normal">
              Guided Wellness Library
            </h1>
            <p className="text-xs text-muted mt-1">
              Low-demand interactive practices designed to soothe acute distress and restore inner calm.
            </p>
          </div>

          {/* Activity Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {activities.map((act) => {
              const Icon = act.icon;
              const isActive = activeTab === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => setActiveTab(act.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-forest text-ivory shadow-soft font-semibold'
                      : 'bg-sand-100 text-charcoal hover:bg-sand-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {act.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: PACED BREATHING */}
          {activeTab === 'breathing' && (
            <Card className="p-6 sm:p-10 text-center max-w-2xl mx-auto">
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={() => {
                    setBreathTechnique('478');
                    setBreathPhase('Inhale');
                    setBreathCountdown(4);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    breathTechnique === '478'
                      ? 'bg-forest text-ivory border-forest'
                      : 'bg-white border-sand-300 text-charcoal'
                  }`}
                >
                  4-7-8 Relaxing Breath
                </button>
                <button
                  onClick={() => {
                    setBreathTechnique('box');
                    setBreathPhase('Inhale');
                    setBreathCountdown(4);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    breathTechnique === 'box'
                      ? 'bg-forest text-ivory border-forest'
                      : 'bg-white border-sand-300 text-charcoal'
                  }`}
                >
                  4-4-4-4 Box Breathing
                </button>
              </div>

              {/* Animated Pacing Visual */}
              <div className="py-8 relative flex items-center justify-center">
                <div
                  className={`w-52 h-52 rounded-full border-4 border-sage-300 bg-sand-100 flex flex-col items-center justify-center transition-all duration-1000 ${
                    isBreathingRunning && breathPhase === 'Inhale'
                      ? 'scale-125 bg-sage-100/90 border-forest'
                      : isBreathingRunning && breathPhase === 'Exhale'
                      ? 'scale-90 bg-lavender-100/80 border-lavender-400'
                      : 'scale-105 bg-sand-100 border-sand-400'
                  }`}
                >
                  <span className="font-editorial text-2xl text-forest font-semibold">
                    {breathPhase}
                  </span>
                  <span className="text-4xl font-editorial font-bold text-forest mt-1">
                    {breathCountdown}s
                  </span>
                  <span className="text-[11px] text-muted mt-1">
                    Cycles: {breathCycles}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                {!isBreathingRunning ? (
                  <Button
                    onClick={() => {
                      setIsBreathingRunning(true);
                      playGentleChime();
                    }}
                    className="gap-2 shadow-soft"
                  >
                    <Play className="w-4 h-4" /> Begin Paced Breathing
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => setIsBreathingRunning(false)}
                      className="gap-2"
                    >
                      <Pause className="w-4 h-4" /> Pause
                    </Button>
                    <Button
                      variant="sage"
                      onClick={handleFinishBreathing}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete & Record
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-muted max-w-sm mx-auto mt-6">
                Inhale quietly through your nose, hold with relaxed shoulders, and exhale gently through your mouth.
              </p>
            </Card>
          )}

          {/* TAB 2: 5-4-3-2-1 GROUNDING */}
          {activeTab === 'grounding' && (
            <Card className="p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-editorial text-2xl text-forest font-normal">
                  5-4-3-2-1 Sensory Grounding
                </h3>
                <p className="text-xs text-muted mt-1">
                  Re-anchoring into your immediate physical surroundings to quiet racing thoughts.
                </p>
              </div>

              {/* Steps progression */}
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((num) => {
                  const titles = {
                    5: 'Acknowledge 5 things you can SEE around you right now',
                    4: 'Acknowledge 4 things you can physically TOUCH or FEEL',
                    3: 'Acknowledge 3 distinct sounds you can HEAR in this space',
                    2: 'Acknowledge 2 scents you can SMELL (or pleasant memories)',
                    1: 'Acknowledge 1 thing you can TASTE or one self-compassion truth',
                  };

                  return (
                    <div
                      key={num}
                      className={`p-4 rounded-2xl border transition-all ${
                        groundingStep === num
                          ? 'bg-sand-100/80 border-forest shadow-soft'
                          : 'bg-white/70 border-sand-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-forest">
                          Step {6 - num}: {titles[num as keyof typeof titles]}
                        </span>
                        <span className="text-xs font-bold text-sage-600 bg-sage-50 px-2 py-0.5 rounded">
                          {num} items
                        </span>
                      </div>

                      {groundingStep === num && (
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: num }).map((_, idx) => (
                            <input
                              key={idx}
                              type="text"
                              value={groundingInputs[num][idx] || ''}
                              onChange={(e) => {
                                const copy = { ...groundingInputs };
                                copy[num][idx] = e.target.value;
                                setGroundingInputs(copy);
                              }}
                              placeholder={`Item ${idx + 1}...`}
                              className="w-full px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                            />
                          ))}

                          <div className="flex justify-end pt-2">
                            {num > 1 ? (
                              <Button
                                size="sm"
                                onClick={() => setGroundingStep(num - 1)}
                                className="text-xs gap-1"
                              >
                                Next Sensory Step <ArrowRight className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="sage"
                                onClick={async () => {
                                  await Repository.logActivity({
                                    user_id: 'current-user',
                                    activity_type: 'grounding',
                                    duration_seconds: 180,
                                  });
                                  try {
                                    confetti({ particleCount: 35, origin: { y: 0.6 } });
                                  } catch {}
                                  alert('Grounding exercise complete! You are centered in the present moment.');
                                }}
                                className="text-xs gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Finish & Record
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* TAB 3: GRATITUDE ANCHOR */}
          {activeTab === 'gratitude' && (
            <Card className="p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-editorial text-2xl text-forest font-normal">
                  Three Quiet Moments of Gratitude
                </h3>
                <p className="text-xs text-muted mt-1">
                  Gratitude isn&apos;t about toxic positivity; it&apos;s about noticing tiny pockets of safety or ease.
                </p>
              </div>

              {isGratitudeSaved ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-sage-500 mx-auto" />
                  <h4 className="font-editorial text-xl text-forest">Moments Recorded</h4>
                  <p className="text-xs text-muted max-w-sm mx-auto">
                    These anchors are saved to your wellness record to help reframe challenging days.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsGratitudeSaved(false);
                      setGratitude1('');
                      setGratitude2('');
                      setGratitude3('');
                    }}
                  >
                    Record New Anchors
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                    <label className="text-xs font-semibold text-forest block mb-1.5">
                      1. Something simple that comforted you today (e.g., warm tea, sunlight)
                    </label>
                    <input
                      type="text"
                      value={gratitude1}
                      onChange={(e) => setGratitude1(e.target.value)}
                      placeholder="I felt peaceful when..."
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                    <label className="text-xs font-semibold text-forest block mb-1.5">
                      2. A kind interaction, gesture, or reassuring word
                    </label>
                    <input
                      type="text"
                      value={gratitude2}
                      onChange={(e) => setGratitude2(e.target.value)}
                      placeholder="Someone helped by..."
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                    <label className="text-xs font-semibold text-forest block mb-1.5">
                      3. Something about your own resilience you quietly appreciate
                    </label>
                    <input
                      type="text"
                      value={gratitude3}
                      onChange={(e) => setGratitude3(e.target.value)}
                      placeholder="I showed patience when..."
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleFinishGratitude}
                      disabled={!gratitude1.trim()}
                      className="gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Save Gratitude Anchors
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* TAB 4: MINDFUL PAUSE */}
          {activeTab === 'pause' && (
            <Card className="p-6 sm:p-10 text-center max-w-xl mx-auto">
              <h3 className="font-editorial text-2xl text-forest font-normal mb-1">
                Mindful Silence & Pause
              </h3>
              <p className="text-xs text-muted mb-6">
                Step back from screens and stimulation for an unhurried moment of presence.
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {[60, 120, 180].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setPauseDuration(sec);
                      setPauseRemaining(sec);
                      setIsPauseRunning(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      pauseDuration === sec
                        ? 'bg-forest text-ivory border-forest'
                        : 'bg-white border-sand-300 text-charcoal'
                    }`}
                  >
                    {sec / 60} min{sec > 60 ? 's' : ''}
                  </button>
                ))}
              </div>

              <div className="py-8">
                <div className="text-6xl font-editorial font-bold text-forest">
                  {Math.floor(pauseRemaining / 60)}:
                  {(pauseRemaining % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-xs text-muted mt-2">
                  {isPauseRunning ? 'Rest your gaze on a distant point and breathe naturally.' : 'Ready to begin.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => setIsPauseRunning(!isPauseRunning)}
                  className="gap-2 shadow-soft"
                >
                  {isPauseRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPauseRunning ? 'Pause Timer' : 'Start Pause'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsPauseRunning(false);
                    setPauseRemaining(pauseDuration);
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 5: SELF-CARE PLANNER */}
          {activeTab === 'planner' && (
            <Card className="p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-editorial text-2xl text-forest font-normal">
                  Gentle Daily Care Intentions
                </h3>
                <p className="text-xs text-muted mt-1">
                  Realistic, compassionate micro-intentions for your day.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="text-xs font-semibold text-forest block mb-1">
                    Morning Awakening
                  </span>
                  <input
                    type="text"
                    value={planMorning}
                    onChange={(e) => setPlanMorning(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="text-xs font-semibold text-forest block mb-1">
                    Midday Reset & Nourishment
                  </span>
                  <input
                    type="text"
                    value={planMidday}
                    onChange={(e) => setPlanMidday(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="text-xs font-semibold text-forest block mb-1">
                    Evening Wind-Down
                  </span>
                  <input
                    type="text"
                    value={planEvening}
                    onChange={(e) => setPlanEvening(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={async () => {
                      setIsPlanSaved(true);
                      await Repository.logActivity({
                        user_id: 'current-user',
                        activity_type: 'selfcare_plan',
                        duration_seconds: 60,
                        notes: `AM: ${planMorning} | PM: ${planMidday} | Night: ${planEvening}`,
                      });
                      try {
                        confetti({ particleCount: 30, origin: { y: 0.6 } });
                      } catch {}
                    }}
                    className="gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Daily Intentions
                  </Button>
                </div>

                {isPlanSaved && (
                  <p className="text-xs text-sage-600 font-medium text-center pt-2">
                    ✓ Intentions saved to your daily care record!
                  </p>
                )}
              </div>
            </Card>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-forest">Loading exercises...</div>}>
      <ActivitiesContent />
    </Suspense>
  );
}
