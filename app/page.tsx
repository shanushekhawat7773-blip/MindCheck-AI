import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Heart,
  Shield,
  Sparkles,
  BookOpen,
  BarChart3,
  MessageCircleHeart,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  EyeOff,
  Database,
  LifeBuoy,
} from 'lucide-react';
import { MOOD_DEFINITIONS } from '@/lib/storage/types';

export default function LandingPage() {
  const sampleMoods = ['calm', 'hopeful', 'happy', 'tired', 'stressed'] as const;

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Subtle natural background circles */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sand-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-48 right-10 w-96 h-96 bg-sage-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />
          <div className="absolute top-64 left-10 w-96 h-96 bg-lavender-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/60 border border-sand-300 text-xs font-medium text-forest mb-6">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
              <span>A calm, private space for mental wellness</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-forest leading-[1.08] tracking-tight max-w-4xl mx-auto">
              Understand yourself <br />
              <span className="italic font-normal text-forest/90">a little better.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-lg sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed">
              MindCheck AI helps you pause, reflect on your emotions, recognize subtle patterns, and cultivate restorative daily habits through a quiet, human-centered experience.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/checkin">
                <Button size="lg" className="w-full sm:w-auto shadow-elevated gap-2 text-base px-8 py-3.5">
                  <Heart className="w-4 h-4 text-sage-300" />
                  Start your check-in
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                  Explore how it works
                </Button>
              </Link>
            </div>

            {/* Micro reassurance */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sage-500" /> No account required to start
              </span>
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-sage-500" /> Zero ad tracking
              </span>
            </div>

            {/* PRODUCT PREVIEW: Interactive Mood Check-In Teaser */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="p-3 sm:p-5 rounded-3xl bg-sand-100/80 border border-sand-300 shadow-elevated backdrop-blur-sm">
                <div className="bg-ivory rounded-2xl p-6 sm:p-8 text-left border border-sand-200">
                  <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-200">
                        Interactive Preview
                      </span>
                      <span className="text-xs text-muted">Daily Emotional Check-in</span>
                    </div>
                    <span className="text-xs text-muted">Step 1 of 4</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-editorial text-2xl text-forest font-normal">
                      How does your mind feel right now?
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Choose what resonates most closely with your current state.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
                      {sampleMoods.map((key) => {
                        const m = MOOD_DEFINITIONS[key];
                        return (
                          <Link
                            key={key}
                            href={`/checkin?initialMood=${key}`}
                            className="p-3 rounded-xl border border-sand-300 hover:border-forest hover:bg-sand-50 transition-all text-center flex flex-col items-center gap-1.5 group"
                          >
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              {m.emoji}
                            </span>
                            <span className="text-xs font-medium text-forest">{m.label.split('&')[0]}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-sand-200 flex items-center justify-between">
                      <p className="text-xs text-muted italic">
                        &quot;Awareness is the first step toward lightness.&quot;
                      </p>
                      <Link href="/checkin">
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          Continue check-in <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-sand-50/50 border-y border-sand-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-editorial text-3xl sm:text-4xl text-forest">
                A simple ritual for daily clarity
              </h2>
              <p className="text-muted mt-3 text-sm sm:text-base">
                Three calm minutes a day to stay in touch with your emotional cadence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-ivory rounded-2xl p-6 border border-sand-300 shadow-soft relative">
                <span className="font-editorial text-4xl text-sage-300 font-bold block mb-4">01</span>
                <h3 className="font-editorial text-xl text-forest mb-2">Check In Honestly</h3>
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Log your mood, emotional intensity, sleep quality, and a quiet reflection without any judgment or pressure.
                </p>
              </div>

              <div className="bg-ivory rounded-2xl p-6 border border-sand-300 shadow-soft relative">
                <span className="font-editorial text-4xl text-sage-300 font-bold block mb-4">02</span>
                <h3 className="font-editorial text-xl text-forest mb-2">Notice the Subtle</h3>
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Discover genuine correlations between sleep, energy, and stress through minimal, honest personal trend analytics.
                </p>
              </div>

              <div className="bg-ivory rounded-2xl p-6 border border-sand-300 shadow-soft relative">
                <span className="font-editorial text-4xl text-sage-300 font-bold block mb-4">03</span>
                <h3 className="font-editorial text-xl text-forest mb-2">Restore & Ground</h3>
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  Access guided 4-7-8 breathing exercises, five-senses grounding routines, or conversational reflection prompts whenever you need them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES OVERVIEW */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-editorial text-3xl sm:text-4xl text-forest">
                Designed for calm, not engagement
              </h2>
              <p className="text-muted mt-3 text-sm">
                No aggressive streaks, no artificial notification alerts, no guilt-inducing mechanics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:border-sage-400 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-forest mb-4">
                  <Compass className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-editorial text-xl text-forest mb-2">Wellness Analytics Dashboard</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  A personalized home summarizing today&apos;s mindset, rolling weekly trends, habit intentions, and gentle daily observations derived from your actual records.
                </p>
              </Card>

              <Card className="hover:border-lavender-400 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center text-forest mb-4">
                  <MessageCircleHeart className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-editorial text-xl text-forest mb-2">AI Wellness Companion</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  An empathetic conversational companion powered by Google Gemini that listens attentively, asks gentle questions, and guides you through restorative self-care.
                </p>
              </Card>

              <Card className="hover:border-sand-400 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sand-200 flex items-center justify-center text-forest mb-4">
                  <BookOpen className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-editorial text-xl text-forest mb-2">Private Journaling</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Express your thoughts in an uncluttered private sanctuary. Filter by mood, search personal tags, or use thoughtful prompts when staring at a blank page.
                </p>
              </Card>

              <Card className="hover:border-sage-400 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-forest mb-4">
                  <Sparkles className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-editorial text-xl text-forest mb-2">Interactive Grounding & Breathing</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Animated visual lung rings for 4-4-4-4 Box breathing, step-by-step 5-4-3-2-1 sensory grounding, and peaceful 2-minute mindful meditation pauses.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* PRIVACY & ETHICS SECTION */}
        <section className="py-16 bg-sand-100/60 border-t border-sand-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-ivory border border-sand-300 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-forest" />
                <h2 className="font-editorial text-2xl text-forest">
                  Privacy as a sacred foundation
                </h2>
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed mb-6">
                Your thoughts and emotional vulnerabilities are sensitive personal reflections. MindCheck AI is engineered with minimal data collection and strict respect for your digital sovereignty:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted mb-6">
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="font-semibold text-forest block mb-1">Local-First Storage</span>
                  Store records on your device or sync via private Row-Level Security in PostgreSQL.
                </div>
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="font-semibold text-forest block mb-1">Zero Data Selling</span>
                  We do not sell, rent, or trade your journal entries or mood logs to advertisers.
                </div>
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="font-semibold text-forest block mb-1">Instant Data Export</span>
                  Download your entire check-in and reflection history in JSON or CSV at any time.
                </div>
              </div>

              <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
                <span className="flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-red-600" />
                  Need emergency support? Verified crisis hotlines are always accessible.
                </span>
                <Link href="/crisis" className="text-red-700 font-medium hover:underline">
                  View Crisis Helplines &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-editorial text-3xl sm:text-5xl text-forest">
              Take a quiet moment today.
            </h2>
            <p className="mt-4 text-charcoal/70 max-w-lg mx-auto text-sm sm:text-base">
              Give your mind the gentle space it deserves. Begin with a single check-in.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/checkin">
                <Button size="lg" className="shadow-elevated px-8 py-3.5">
                  Begin your first check-in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
