'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CRISIS_RESOURCES } from '@/lib/crisis/resources';
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  ShieldAlert,
  Wind,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export default function CrisisPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filtered =
    selectedRegion === 'all'
      ? CRISIS_RESOURCES
      : CRISIS_RESOURCES.filter((r) => r.region.toLowerCase().includes(selectedRegion.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Top Urgent Emergency Banner */}
          <div className="p-6 rounded-3xl bg-red-50/90 border border-red-200 text-red-950 space-y-3 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-editorial text-2xl text-red-950 font-semibold">
                  You Are Not Alone. Support Is Available Right Now.
                </h1>
                <p className="text-xs text-red-900 mt-0.5">
                  If you or someone you know is in immediate danger, feeling overwhelmed, or considering self-harm, please reach out to dedicated compassionate professionals who are ready to listen without judgment.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="tel:14416"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 text-white font-medium hover:bg-red-800 transition-colors shadow-soft"
              >
                <Phone className="w-4 h-4" />
                Call Tele-MANAS (India): 14416
              </a>

              <a
                href="tel:988"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 text-white font-medium hover:bg-red-800 transition-colors shadow-soft"
              >
                <Phone className="w-4 h-4" />
                Call / Text 988 (US & Canada)
              </a>

              <a
                href="tel:116123"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 text-white font-medium hover:bg-red-800 transition-colors shadow-soft"
              >
                <Phone className="w-4 h-4" />
                Call Samaritans (UK): 116 123
              </a>
            </div>
          </div>

          {/* Region selector filter */}
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <div>
              <h2 className="font-editorial text-xl text-forest font-normal">
                Verified Global Crisis Directory
              </h2>
              <p className="text-xs text-muted">
                Official, verified government and non-profit helplines staffed 24/7 by trained counselors
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  selectedRegion === 'all'
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal'
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setSelectedRegion('India')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  selectedRegion === 'India'
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal'
                }`}
              >
                India
              </button>
              <button
                onClick={() => setSelectedRegion('United States')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  selectedRegion === 'United States'
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal'
                }`}
              >
                US / Canada
              </button>
              <button
                onClick={() => setSelectedRegion('United Kingdom')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  selectedRegion === 'United Kingdom'
                    ? 'bg-forest text-ivory border-forest'
                    : 'bg-white border-sand-300 text-charcoal'
                }`}
              >
                UK
              </button>
            </div>
          </div>

          {/* Helplines Directory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r, i) => (
              <Card key={i} className="p-5 flex flex-col justify-between bg-white/90">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-editorial text-lg text-forest font-semibold">
                        {r.name}
                      </h3>
                      <span className="text-[11px] text-muted block">{r.region}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      {r.badge}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal/80 leading-relaxed mb-4">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted block">Direct Contact:</span>
                    <a
                      href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm font-bold text-forest hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-sage-600" />
                      {r.phone}
                    </a>
                  </div>

                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted hover:text-forest flex items-center gap-1 hover:underline"
                    >
                      Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Immediate Grounding Protocol Box */}
          <div className="p-6 rounded-3xl bg-sand-100/80 border border-sand-300 space-y-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-forest" />
              <h3 className="font-editorial text-xl text-forest font-normal">
                What to do if you are in acute panic or emotional storm:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white border border-sand-200">
                <span className="font-semibold text-forest block mb-1">1. Temperature Reset</span>
                Splash cold water on your face or hold an ice cube in your palm to activate the mammalian dive reflex and gently slow your heart rate.
              </div>

              <div className="p-4 rounded-xl bg-white border border-sand-200">
                <span className="font-semibold text-forest block mb-1">2. Paced Exhalation</span>
                Make your exhales twice as long as your inhales (Inhale for 4 seconds, exhale slowly through pursed lips for 8 seconds).
              </div>

              <div className="p-4 rounded-xl bg-white border border-sand-200">
                <span className="font-semibold text-forest block mb-1">3. Human Connection</span>
                Reach out to a trusted friend, family member, counselor, or one of the free hotlines listed above. You do not have to carry this in isolation.
              </div>
            </div>
          </div>

          {/* Legal and boundary disclaimer */}
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs text-muted leading-relaxed">
            <p className="font-medium text-forest mb-1">MindCheck AI Emergency Policy:</p>
            MindCheck AI is an automated self-reflection tool, not an emergency monitoring service or healthcare facility. We do not perform real-time human clinical intervention. If you are experiencing suicidal thoughts or severe distress, please use the verified phone numbers above or go to the nearest emergency medical room.
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
