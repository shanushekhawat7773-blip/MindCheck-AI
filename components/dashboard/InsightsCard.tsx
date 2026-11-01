'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { CorrelationInsight } from '@/lib/analytics/calculations';
import { Moon, BatteryCharging, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface InsightsCardProps {
  insights: CorrelationInsight[];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <Moon className="w-4 h-4 text-lavender-500" />;
      case 'energy':
        return <BatteryCharging className="w-4 h-4 text-sage-500" />;
      case 'stress':
        return <Zap className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-forest" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200 mb-4">
        <div>
          <h3 className="font-editorial text-xl font-normal text-forest">
            Personal Observations
          </h3>
          <p className="text-xs text-muted">
            Ground-level patterns derived strictly from your recorded check-ins
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-sand-50/70 border border-sand-200 flex items-start gap-3.5 transition-all hover:bg-sand-100/60"
          >
            <div className="p-2 rounded-lg bg-white border border-sand-200 flex-shrink-0 mt-0.5 shadow-soft">
              {getIcon(item.icon)}
            </div>
            <div className="flex-grow">
              <h4 className="text-xs font-semibold text-forest uppercase tracking-wide">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-charcoal/80 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-sand-200 flex items-center gap-1.5 text-[11px] text-muted">
        <AlertCircle className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
        <span>Reflections describe self-reported correlations, not medical diagnoses.</span>
      </div>
    </Card>
  );
}
