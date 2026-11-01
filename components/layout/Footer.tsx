import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-sand-50/70 pt-12 pb-8 mt-16 text-sm text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center text-ivory text-xs font-serif font-bold">
                M
              </div>
              <span className="font-editorial text-lg font-bold text-forest">
                MindCheck AI
              </span>
            </div>
            <p className="text-muted leading-relaxed max-w-md">
              A private, calm space designed to help you reflect on your feelings, understand emotional patterns, and build restorative daily self-care habits.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest/80 pt-1">
              <ShieldCheck className="w-4 h-4 text-sage-500" />
              <span>Zero-tracking, privacy-first design. Your reflections remain yours.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-medium text-forest text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-forest transition-colors">
                  Wellness Dashboard
                </Link>
              </li>
              <li>
                <Link href="/checkin" className="hover:text-forest transition-colors">
                  Daily Emotional Check-In
                </Link>
              </li>
              <li>
                <Link href="/companion" className="hover:text-forest transition-colors">
                  AI Wellness Companion
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-forest transition-colors">
                  Private Journal
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-forest transition-colors">
                  Guided Breathing & Grounding
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-forest transition-colors">
                  Personal Trends & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Ethics */}
          <div>
            <h4 className="font-medium text-forest text-sm mb-3">Care & Boundaries</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/crisis" className="text-red-700 font-medium hover:underline flex items-center gap-1">
                  Crisis Hotlines (India & Global)
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-forest transition-colors">
                  Privacy Settings & Data Export
                </Link>
              </li>
              <li className="pt-2 text-[11px] leading-tight text-muted">
                National Tele-MANAS: <span className="font-medium text-forest">14416</span>
              </li>
              <li className="text-[11px] leading-tight text-muted">
                US/Canada Lifeline: <span className="font-medium text-forest">988</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Disclaimer Box */}
        <div className="p-4 rounded-xl bg-sand-100/70 border border-sand-300 text-xs text-muted leading-relaxed mb-6">
          <p className="font-medium text-forest mb-1">Notice & Clinical Boundary:</p>
          MindCheck AI is an AI-assisted self-reflection and wellness habit tool. It does not provide medical diagnoses, treatment, or psychiatric prescriptions. If you are experiencing acute emotional distress or a mental health emergency, please contact official crisis hotlines immediately or seek emergency medical care.
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-sand-200 text-xs text-muted/80 gap-2">
          <p>© {new Date().getFullYear()} MindCheck AI. Created with care for human emotional balance.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for calmness</span>
            <Heart className="w-3 h-3 text-sage-500 fill-sage-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
