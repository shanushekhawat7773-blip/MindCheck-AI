import { CheckInResult, PersonalTrendInsight } from './types';

export function analyzePatterns(history: CheckInResult[]): PersonalTrendInsight[] {
  // If fewer than 2 check-ins, we cannot responsibly claim pattern detection
  if (!history || history.length < 2) {
    return [];
  }

  const insights: PersonalTrendInsight[] = [];
  // History is ordered newest to oldest, so reverse for chronological analysis
  const chronological = [...history].reverse();
  const n = chronological.length;

  // 1. Overall Trajectory (comparing most recent to previous)
  const recent = chronological[n - 1];
  const previous = chronological[n - 2];
  const overallDiff = recent.overallScore - previous.overallScore;

  if (overallDiff >= 6) {
    insights.push({
      type: 'positive',
      badgeText: 'Upward Trajectory',
      title: 'Positive Shift Across Recent Check-Ins',
      description: `Your overall well-being index rose by ${overallDiff} points (from ${previous.overallScore} to ${recent.overallScore}) between your last two reflections.`,
    });
  } else if (overallDiff <= -6) {
    insights.push({
      type: 'watch',
      badgeText: 'Pacing Needed',
      title: 'Increased Strain in Recent Responses',
      description: `Your reported well-being index dipped by ${Math.abs(overallDiff)} points recently. Consider giving yourself permission to slow down and rest.`,
    });
  } else {
    insights.push({
      type: 'milestone',
      badgeText: 'Steady Baseline',
      title: 'Consistent Emotional Baseline',
      description: `Your overall score has remained within a steady ${Math.abs(overallDiff)}-point range across your recent check-ins, indicating grounded equilibrium.`,
    });
  }

  // 2. Correlation: Sleep & Vitality vs Stress Regulation
  if (n >= 3) {
    const sleepScores = chronological.map((c) => c.dimensionScores.sleep_energy.score);
    const emoScores = chronological.map((c) => c.dimensionScores.emotional_wellbeing.score);
    const stressScores = chronological.map((c) => c.dimensionScores.stress_regulation.score);

    // Compute simple Pearson correlation between sleep and emotional wellbeing
    const sleepEmoCorr = calculateCorrelation(sleepScores, emoScores);
    if (sleepEmoCorr >= 0.6) {
      insights.push({
        type: 'correlation',
        badgeText: 'Linked Dimension',
        title: 'Sleep and Mood Move Together',
        description:
          'Your check-ins show a notable relationship: screenings with higher sleep restfulness consistently coincide with more positive mood reflections.',
      });
    }

    // Stress load trend
    const recentStress = recent.dimensionScores.stress_regulation.score;
    const earlierStress = chronological[0].dimensionScores.stress_regulation.score;
    const stressDiff = recentStress - earlierStress;

    if (stressDiff <= -10) {
      insights.push({
        type: 'watch',
        badgeText: 'Elevated Demands',
        title: 'Stress Load Has Increased Over Time',
        description:
          'Your stress regulation dimension has declined across multiple sessions. You may want to review your current schedule for opportunities to delegate or pause.',
      });
    } else if (stressDiff >= 10) {
      insights.push({
        type: 'positive',
        badgeText: 'Resilience Growth',
        title: 'Improved Stress Ease',
        description:
          'Your stress regulation scores reflect greater calm and ease compared to your earliest recorded check-ins.',
      });
    }
  }

  return insights.slice(0, 3);
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return 0;

  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - avgX;
    const dy = y[i] - avgY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;
  return numerator / denominator;
}
