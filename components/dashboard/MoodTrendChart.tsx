'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '../ui/Card';
import { DailyTrendPoint } from '@/lib/analytics/calculations';
import { MOOD_DEFINITIONS } from '@/lib/storage/types';
import { Info, TrendingUp, Calendar, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

interface MoodTrendChartProps {
  trendPoints: DailyTrendPoint[];
}

export function MoodTrendChart({ trendPoints }: MoodTrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DailyTrendPoint | null>(null);

  const activePoints = trendPoints.filter((p) => p.hasEntry);
  const hasData = activePoints.length > 0;

  // Chart dimensions for SVG
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates for SVG
  const pointsWithCoords = trendPoints.map((p, idx) => {
    const x =
      paddingX +
      (idx / Math.max(trendPoints.length - 1, 1)) * (width - paddingX * 2);

    // Score maps from 1 (lowest) to 9 (highest)
    const normalizedScore = p.score ? (p.score - 1) / 8 : 0.5;
    const y = height - paddingY - normalizedScore * (height - paddingY * 2);

    return { ...p, x, y };
  });

  // Generate SVG path for line and area fill
  const activeCoords = pointsWithCoords.filter((p) => p.hasEntry);

  let pathD = '';
  let areaD = '';

  if (activeCoords.length > 1) {
    pathD = `M ${activeCoords[0].x} ${activeCoords[0].y}`;
    for (let i = 1; i < activeCoords.length; i++) {
      const prev = activeCoords[i - 1];
      const curr = activeCoords[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    const first = activeCoords[0];
    const last = activeCoords[activeCoords.length - 1];
    areaD = `${pathD} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand-200 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-xl font-normal text-forest">
              Weekly Emotional Rhythm
            </h3>
            <span className="text-[11px] font-medium text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
              7-Day Cadence
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Descriptive pattern of your self-reported emotional valence & intensity
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-forest" />
          <span>Reported States</span>
        </div>
      </div>

      {!hasData ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-forest mx-auto mb-3">
            <Calendar className="w-6 h-6 text-sage-500" />
          </div>
          <h4 className="font-editorial text-lg text-forest">No check-ins yet this week</h4>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
            Begin with today&apos;s check-in to watch your weekly rhythm unfold here. We never fabricate charts.
          </p>
          <Link href="/checkin">
            <Button size="sm" variant="primary">
              Log First Entry
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-44 select-none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A7B8A1" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#A7B8A1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Grid Lines */}
              {[0.2, 0.5, 0.8].map((ratio, i) => {
                const y = height - paddingY - ratio * (height - paddingY * 2);
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#E9DFD0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area Fill */}
              {areaD && <path d={areaD} fill="url(#sageGradient)" />}

              {/* Line Stroke */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#24483D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Data Points */}
              {pointsWithCoords.map((pt, i) => {
                if (!pt.hasEntry) {
                  return (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={height - paddingY}
                      r="3"
                      fill="#DECDB8"
                      opacity="0.5"
                    />
                  );
                }

                const isHovered = hoveredPoint?.date === pt.date;

                return (
                  <g
                    key={i}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 5}
                      fill="#F8F6F1"
                      stroke="#24483D"
                      strokeWidth={isHovered ? 3 : 2}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Date Axis Labels */}
          <div className="flex justify-between px-6 pt-2 border-t border-sand-200 text-xs text-muted">
            {trendPoints.map((pt) => {
              const isToday =
                pt.date === new Date().toISOString().split('T')[0];
              return (
                <div key={pt.date} className="flex flex-col items-center">
                  <span className={`text-[11px] ${isToday ? 'font-bold text-forest' : ''}`}>
                    {pt.dayLabel}
                  </span>
                  <span className="text-sm mt-0.5">{pt.emoji}</span>
                </div>
              );
            })}
          </div>

          {/* Active tooltip details */}
          {hoveredPoint && hoveredPoint.hasEntry && (
            <div className="mt-4 p-3 rounded-xl bg-sand-50 border border-sand-300 flex items-center justify-between text-xs transition-opacity animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredPoint.emoji}</span>
                <div>
                  <span className="font-semibold text-forest block">
                    {hoveredPoint.mood ? MOOD_DEFINITIONS[hoveredPoint.mood]?.label : 'Reflected'}
                  </span>
                  <span className="text-muted text-[11px]">{hoveredPoint.date}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted text-[11px] block">Intensity</span>
                <span className="font-semibold text-forest text-sm">
                  {hoveredPoint.intensity}/10
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
