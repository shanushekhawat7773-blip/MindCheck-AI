'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Repository } from '@/lib/storage/repository';
import {
  MOOD_DEFINITIONS,
  MoodType,
  CheckinDraft,
} from '@/lib/storage/types';
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Moon,
  Battery,
  Zap,
  Tag,
  PenTool,
  Wind,
  Eye,
  BookOpen,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function CheckinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMoodParam = searchParams.get('initialMood') as MoodType | null;

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CheckinDraft>({
    mood: initialMoodParam && MOOD_DEFINITIONS[initialMoodParam] ? initialMoodParam : null,
    intensity: 6,
    sleep_quality: 4,
    energy_level: 'moderate',
    stress_level: 'low',
    tags: [],
    reflection: '',
  });

  const [supportiveSummary, setSupportiveSummary] = useState('');
  const [suggestedActivity, setSuggestedActivity] = useState<string>('breathing');
  const [isSaving, setIsSaving] = useState(false);

  const moodsList: MoodType[] = [
    'happy',
    'calm',
    'hopeful',
    'neutral',
    'tired',
    'stressed',
    'anxious',
    'sad',
    'overwhelmed',
  ];

  const commonTags = [
    'Work',
    'Sleep',
    'Family',
    'Exercise',
    'Studies',
    'Nature',
    'Social',
    'Solitude',
    'Nutrition',
    'Creativity',
  ];

  // Generate personalized summary when moving to Step 5
  useEffect(() => {
    if (step === 5 && draft.mood) {
      const moodDef = MOOD_DEFINITIONS[draft.mood];
      let summary = `You are feeling ${moodDef.label.toLowerCase()} with an intensity of ${draft.intensity}/10. `;

      if (['stressed', 'anxious', 'overwhelmed'].includes(draft.mood)) {
        summary += `When tension runs high, the nervous system naturally braces itself. Acknowledging this openly without judgment is an act of gentle courage. `;
        setSuggestedActivity('breathing');
      } else if (['tired', 'sad'].includes(draft.mood)) {
        summary += `Your body and mind may be asking for gentle recovery and unhurried rest right now. Prioritizing low-demand comfort this evening is deeply restorative. `;
        setSuggestedActivity('grounding');
      } else {
        summary += `Taking a mindful pause to recognize moments of equilibrium or optimism anchors them in your memory, strengthening your emotional resilience. `;
        setSuggestedActivity('journal');
      }

      if (draft.sleep_quality <= 2) {
        summary += `Notice that your sleep was limited last night; being gentle with your energy expectations today is well-deserved.`;
      }

      setSupportiveSummary(summary);
    }
  }, [step, draft]);

  const toggleTag = (tag: string) => {
    if (draft.tags.includes(tag)) {
      setDraft({ ...draft, tags: draft.tags.filter((t) => t !== tag) });
    } else {
      setDraft({ ...draft, tags: [...draft.tags, tag] });
    }
  };

  const handleSave = async () => {
    if (!draft.mood) return;
    setIsSaving(true);

    try {
      await Repository.addMoodEntry({
        user_id: 'current-user',
        mood: draft.mood,
        intensity: draft.intensity,
        sleep_quality: draft.sleep_quality,
        energy_level: draft.energy_level,
        stress_level: draft.stress_level,
        tags: draft.tags,
        reflection: draft.reflection,
        supportive_summary: supportiveSummary,
        suggested_activity: suggestedActivity,
      });

      // Gentle celebratory feedback
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#24483D', '#A7B8A1', '#DCD7ED', '#E9DFD0'],
        });
      } catch (e) {
        // Safe if confetti fails
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } catch (err) {
      console.error('Save failed:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-medium text-forest">
              Step {step} of 7: {
                step === 1 ? 'Emotional State' :
                step === 2 ? 'Intensity' :
                step === 3 ? 'Context & Body' :
                step === 4 ? 'Personal Reflection' :
                step === 5 ? 'Supportive Summary' :
                step === 6 ? 'Suggested Self-Care' : 'Review & Confirm'
              }
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              className="hover:text-forest flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Discard
            </button>
          </div>

          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-forest h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Selectable Emotional States */}
        {step === 1 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              How are you feeling today?
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              Select the state that most authentically describes your current mental climate.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {moodsList.map((m) => {
                const def = MOOD_DEFINITIONS[m];
                const isSelected = draft.mood === m;

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDraft({ ...draft, mood: m })}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-forest bg-sand-100/90 shadow-soft ring-1 ring-forest'
                        : 'border-sand-300 bg-white/70 hover:border-sand-400 hover:bg-sand-50'
                    }`}
                  >
                    <span className="text-3xl">{def.emoji}</span>
                    <div>
                      <span className="text-xs font-semibold text-forest block">
                        {def.label.split('&')[0]}
                      </span>
                      <span className="text-[11px] text-muted">
                        {def.label.split('&')[1] ? '& ' + def.label.split('&')[1] : 'Emotional state'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                disabled={!draft.mood}
                onClick={() => setStep(2)}
                className="gap-2"
              >
                Next: Intensity <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: Emotional Intensity */}
        {step === 2 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              How intensely are you feeling this?
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-8">
              A gentle 1 to 10 scale to measure whether this is a faint whisper or an absorbing wave.
            </p>

            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="text-5xl font-editorial text-forest font-bold">
                {draft.intensity}
                <span className="text-lg text-muted font-normal font-sans"> / 10</span>
              </div>

              <div className="px-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={draft.intensity}
                  onChange={(e) =>
                    setDraft({ ...draft, intensity: parseInt(e.target.value) })
                  }
                  className="w-full h-2.5 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-forest"
                />
              </div>

              <div className="flex justify-between text-xs text-muted px-2">
                <span>1 — Subtle & Mild</span>
                <span>5 — Moderate</span>
                <span>10 — Highly Intense</span>
              </div>

              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs text-muted italic">
                {draft.intensity <= 3
                  ? 'A quiet, background feeling that you can gently observe.'
                  : draft.intensity <= 7
                  ? 'Noticeable throughout your activities and interactions today.'
                  : 'A prominent, absorbing emotional presence that warrants your self-care.'}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Next: Context <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: Context & Biological Factors */}
        {step === 3 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              Body & Environment
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              Physical health and sleep deeply shape our emotional resonance. (All optional)
            </p>

            <div className="space-y-6 max-w-lg mx-auto">
              {/* Sleep Quality */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-forest mb-2">
                  <Moon className="w-4 h-4 text-lavender-500" />
                  Last night&apos;s sleep quality
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setDraft({ ...draft, sleep_quality: star })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${
                        draft.sleep_quality === star
                          ? 'bg-forest text-ivory border-forest shadow-soft'
                          : 'bg-white border-sand-300 text-charcoal hover:bg-sand-50'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-forest mb-2">
                  <Battery className="w-4 h-4 text-sage-500" />
                  Energy Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'moderate', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDraft({ ...draft, energy_level: lvl })}
                      className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                        draft.energy_level === lvl
                          ? 'bg-forest text-ivory border-forest shadow-soft'
                          : 'bg-white border-sand-300 text-charcoal hover:bg-sand-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress Level */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-forest mb-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Perceived Stress
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDraft({ ...draft, stress_level: lvl })}
                      className={`py-2 rounded-xl border text-xs font-medium capitalize transition-all ${
                        draft.stress_level === lvl
                          ? 'bg-forest text-ivory border-forest shadow-soft'
                          : 'bg-white border-sand-300 text-charcoal hover:bg-sand-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Tags */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-forest mb-2">
                  <Tag className="w-4 h-4 text-muted" />
                  Influencing Factors (Tags)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {commonTags.map((t) => {
                    const isSelected = draft.tags.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                          isSelected
                            ? 'bg-sage-300 text-forest font-semibold'
                            : 'bg-sand-100 text-charcoal/80 hover:bg-sand-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(4)} className="gap-2">
                Next: Reflection <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: Optional Free-Text Reflection */}
        {step === 4 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              What&apos;s on your mind?
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              Write as little or as much as you like. This is stored securely and privately.
            </p>

            <div className="max-w-lg mx-auto">
              <textarea
                rows={5}
                value={draft.reflection}
                onChange={(e) => setDraft({ ...draft, reflection: e.target.value })}
                placeholder="Give words to what you're feeling right now... There are no right or wrong thoughts here."
                className="w-full p-4 rounded-2xl border border-sand-300 bg-sand-50/50 text-sm focus:ring-2 focus:ring-forest focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-muted text-right mt-1.5">
                {draft.reflection.length} characters (Optional)
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(5)} className="gap-2">
                Next: Summary <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 5: Supportive Summary */}
        {step === 5 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center text-forest mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-forest" />
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              Supportive Reflection
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              A compassionate perspective based on your disclosures today.
            </p>

            <div className="max-w-lg mx-auto p-5 rounded-2xl bg-sand-50 border border-sand-300 text-sm text-charcoal/90 leading-relaxed">
              {supportiveSummary}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(4)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(6)} className="gap-2">
                Next: Activity <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 6: Suggested Low-Risk Wellness Activities */}
        {step === 6 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              Suggested Mindful Practice
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              Choose a small, low-demand restorative practice to close your check-in.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setSuggestedActivity('breathing')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  suggestedActivity === 'breathing'
                    ? 'border-forest bg-sand-100/90 shadow-soft ring-1 ring-forest'
                    : 'border-sand-300 bg-white/70 hover:bg-sand-50'
                }`}
              >
                <div>
                  <Wind className="w-5 h-5 text-forest mb-2" />
                  <h4 className="text-xs font-semibold text-forest">4-7-8 Breathing</h4>
                  <p className="text-[11px] text-muted mt-1">
                    Calm acute nervous tension through paced breathing.
                  </p>
                </div>
                <span className="text-[10px] text-sage-600 font-medium mt-3 block">3 mins</span>
              </button>

              <button
                type="button"
                onClick={() => setSuggestedActivity('grounding')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  suggestedActivity === 'grounding'
                    ? 'border-forest bg-sand-100/90 shadow-soft ring-1 ring-forest'
                    : 'border-sand-300 bg-white/70 hover:bg-sand-50'
                }`}
              >
                <div>
                  <Eye className="w-5 h-5 text-forest mb-2" />
                  <h4 className="text-xs font-semibold text-forest">5-Senses Grounding</h4>
                  <p className="text-[11px] text-muted mt-1">
                    Anchor into your present physical space.
                  </p>
                </div>
                <span className="text-[10px] text-sage-600 font-medium mt-3 block">4 mins</span>
              </button>

              <button
                type="button"
                onClick={() => setSuggestedActivity('journal')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  suggestedActivity === 'journal'
                    ? 'border-forest bg-sand-100/90 shadow-soft ring-1 ring-forest'
                    : 'border-sand-300 bg-white/70 hover:bg-sand-50'
                }`}
              >
                <div>
                  <BookOpen className="w-5 h-5 text-forest mb-2" />
                  <h4 className="text-xs font-semibold text-forest">Gratitude Journal</h4>
                  <p className="text-[11px] text-muted mt-1">
                    Record one small thing that brought peace today.
                  </p>
                </div>
                <span className="text-[10px] text-sage-600 font-medium mt-3 block">2 mins</span>
              </button>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(5)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setStep(7)} className="gap-2">
                Next: Review & Save <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 7: Save, Edit, or Discard */}
        {step === 7 && (
          <Card className="p-6 sm:p-8 animate-in fade-in duration-200">
            <h2 className="font-editorial text-2xl sm:text-3xl text-forest font-normal text-center mb-2">
              Ready to save your check-in?
            </h2>
            <p className="text-xs sm:text-sm text-muted text-center max-w-md mx-auto mb-6">
              Review your details below. You can return to any step before confirming.
            </p>

            <div className="max-w-md mx-auto space-y-4 p-5 rounded-2xl bg-sand-50/70 border border-sand-300 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-sand-200">
                <span className="text-muted">State & Intensity:</span>
                <span className="font-semibold text-forest">
                  {draft.mood && MOOD_DEFINITIONS[draft.mood]?.emoji}{' '}
                  {draft.mood && MOOD_DEFINITIONS[draft.mood]?.label} ({draft.intensity}/10)
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-sand-200">
                <span className="text-muted">Sleep Quality:</span>
                <span className="font-semibold text-forest">{draft.sleep_quality}★</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-sand-200">
                <span className="text-muted">Energy & Stress:</span>
                <span className="font-semibold text-forest capitalize">
                  {draft.energy_level} energy • {draft.stress_level} stress
                </span>
              </div>

              {draft.tags.length > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-sand-200">
                  <span className="text-muted">Tags:</span>
                  <span className="font-semibold text-forest">
                    {draft.tags.join(', ')}
                  </span>
                </div>
              )}

              {draft.reflection && (
                <div className="pt-1">
                  <span className="text-muted block mb-1">Your reflection:</span>
                  <p className="text-charcoal/80 italic line-clamp-3">
                    &quot;{draft.reflection}&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto"
              >
                Edit from Start
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto text-muted hover:text-red-700"
                >
                  Discard
                </Button>
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  className="w-full sm:w-auto shadow-soft gap-2"
                >
                  <Check className="w-4 h-4" /> Save to My Records
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center text-forest">Loading check-in...</div>}>
      <CheckinContent />
    </Suspense>
  );
}
