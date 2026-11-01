'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Sparkles, Wind, Eye, Clock, ArrowRight } from 'lucide-react';

export function QuickActivities() {
  const activities = [
    {
      href: '/activities?type=breathing',
      title: '4-7-8 Breathing',
      time: '3 mins',
      desc: 'Paced cycles to regulate acute nervous system stress.',
      icon: Wind,
      color: 'bg-sage-100 text-forest border-sage-200',
    },
    {
      href: '/activities?type=grounding',
      title: '5-Senses Grounding',
      time: '4 mins',
      desc: 'Connect with your immediate physical surroundings.',
      icon: Eye,
      color: 'bg-lavender-100 text-forest border-lavender-200',
    },
    {
      href: '/activities?type=pause',
      title: 'Mindful Pause',
      time: '2 mins',
      desc: 'Gentle silence with soft chimes to center yourself.',
      icon: Clock,
      color: 'bg-sand-200 text-forest border-sand-300',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
        <div>
          <h3 className="font-editorial text-xl font-normal text-forest">
            Restorative Practices
          </h3>
          <p className="text-xs text-muted">Guided exercises to reset your nervous system</p>
        </div>

        <Link
          href="/activities"
          className="text-xs text-sage-600 hover:text-forest font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="p-3.5 rounded-xl border border-sand-200 bg-sand-50/50 hover:bg-sand-100/70 hover:border-sand-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-muted font-medium bg-white/80 px-2 py-0.5 rounded border border-sand-200">
                    {act.time}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-forest group-hover:text-forest-800">
                  {act.title}
                </h4>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
