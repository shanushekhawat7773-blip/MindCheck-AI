import { AggregateDimension, CheckInResult, CurrentMood, DimensionScore } from './types';
import { CHECKUP_QUESTIONS } from './questions';

export function calculateDimensionScore(rawValues: number[]): number {
  if (!rawValues.length) return 50;
  const avg = rawValues.reduce((sum, v) => sum + v, 0) / rawValues.length;
  // Map 1.0 -> 5.0 to 0 -> 100
  const percentage = Math.round(((avg - 1) / 4) * 100);
  return Math.max(0, Math.min(100, percentage));
}

export function getScoreLevel(score: number): DimensionScore['level'] {
  if (score >= 80) return 'Doing well';
  if (score >= 60) return 'Mild concern';
  if (score >= 40) return 'Some areas to watch';
  return 'Higher level of concern';
}

export function getDimensionColor(score: number): string {
  if (score >= 80) return '#10b987'; // wellness emerald
  if (score >= 60) return '#38a8f7'; // serene sky blue
  if (score >= 40) return '#f59e0b'; // amber
  return '#fb7185'; // soft rose (calm, not aggressive red)
}

export function getDimensionSummary(dim: AggregateDimension, score: number): string {
  if (score >= 80) {
    switch (dim) {
      case 'emotional_wellbeing': return 'Positive emotional stability and moments of joy.';
      case 'stress_regulation': return 'Healthy stress resilience with effective recovery.';
      case 'sleep_energy': return 'Restorative sleep supporting steady daytime vitality.';
      case 'focus_functioning': return 'Sharp mental clarity with consistent daily routines.';
      case 'social_wellbeing': return 'Strong sense of connection and social trust.';
    }
  } else if (score >= 60) {
    switch (dim) {
      case 'emotional_wellbeing': return 'Generally steady mood with brief moments of heaviness.';
      case 'stress_regulation': return 'Manageable pressures with occasional tension.';
      case 'sleep_energy': return 'Fair sleep patterns with occasional morning sluggishness.';
      case 'focus_functioning': return 'Solid daily functioning with manageable distractions.';
      case 'social_wellbeing': return 'Decent social support with room for deeper connection.';
    }
  } else if (score >= 40) {
    switch (dim) {
      case 'emotional_wellbeing': return 'Mood has felt lower or more subdued than usual.';
      case 'stress_regulation': return 'Noticeable tension and difficulty unwinding recently.';
      case 'sleep_energy': return 'Disrupted rest and noticeable fatigue during the day.';
      case 'focus_functioning': return 'Routine tasks require extra effort and concentration.';
      case 'social_wellbeing': return 'Feeling somewhat detached or isolated from peers.';
    }
  } else {
    switch (dim) {
      case 'emotional_wellbeing': return 'Persistent low mood suggesting need for gentle care.';
      case 'stress_regulation': return 'High ongoing pressure and notable strain.';
      case 'sleep_energy': return 'Substantial sleep disruption and depleted energy.';
      case 'focus_functioning': return 'Daily routines and focus are feeling significantly burdened.';
      case 'social_wellbeing': return 'Marked feelings of isolation or lack of confiding outlets.';
    }
  }
}

export function computeCheckInResults(
  answers: Record<string, number>,
  storageMode: 'persistent' | 'ephemeral',
  currentMood?: CurrentMood
): CheckInResult {
  // Aggregate answer scores into 5 dimensions
  const emotionalVals: number[] = [];
  const stressVals: number[] = [];
  const sleepEnergyVals: number[] = [];
  const focusVals: number[] = [];
  const socialVals: number[] = [];

  CHECKUP_QUESTIONS.forEach((q) => {
    const val = answers[q.id];
    if (val !== undefined) {
      if (q.aggregateDimension === 'emotional_wellbeing') emotionalVals.push(val);
      else if (q.aggregateDimension === 'stress_regulation') stressVals.push(val);
      else if (q.aggregateDimension === 'sleep_energy') sleepEnergyVals.push(val);
      else if (q.aggregateDimension === 'focus_functioning') focusVals.push(val);
      else if (q.aggregateDimension === 'social_wellbeing') socialVals.push(val);
    }
  });

  const emoScore = calculateDimensionScore(emotionalVals);
  const stressScore = calculateDimensionScore(stressVals);
  const sleepScore = calculateDimensionScore(sleepEnergyVals);
  const focusScore = calculateDimensionScore(focusVals);
  const socialScore = calculateDimensionScore(socialVals);

  const dimensionScores: Record<AggregateDimension, DimensionScore> = {
    emotional_wellbeing: {
      key: 'emotional_wellbeing',
      label: 'Mood & Emotional Well-Being',
      score: emoScore,
      level: getScoreLevel(emoScore),
      color: getDimensionColor(emoScore),
      summary: getDimensionSummary('emotional_wellbeing', emoScore),
    },
    stress_regulation: {
      key: 'stress_regulation',
      label: 'Stress Load & Regulation',
      score: stressScore,
      level: getScoreLevel(stressScore),
      color: getDimensionColor(stressScore),
      summary: getDimensionSummary('stress_regulation', stressScore),
    },
    sleep_energy: {
      key: 'sleep_energy',
      label: 'Sleep & Vitality',
      score: sleepScore,
      level: getScoreLevel(sleepScore),
      color: getDimensionColor(sleepScore),
      summary: getDimensionSummary('sleep_energy', sleepScore),
    },
    focus_functioning: {
      key: 'focus_functioning',
      label: 'Focus & Daily Functioning',
      score: focusScore,
      level: getScoreLevel(focusScore),
      color: getDimensionColor(focusScore),
      summary: getDimensionSummary('focus_functioning', focusScore),
    },
    social_wellbeing: {
      key: 'social_wellbeing',
      label: 'Social Connection & Belonging',
      score: socialScore,
      level: getScoreLevel(socialScore),
      color: getDimensionColor(socialScore),
      summary: getDimensionSummary('social_wellbeing', socialScore),
    },
  };

  // Overall Score is the balanced mean of the 5 dimensions
  const overallScore = Math.round(
    (emoScore + stressScore + sleepScore + focusScore + socialScore) / 5
  );

  const overallLevel = getScoreLevel(overallScore);

  // Generate strictly non-diagnostic AI reflection based on data
  const aiReflection = generateReflection(dimensionScores, currentMood);

  return {
    id: `checkin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    storageMode,
    overallScore,
    overallLevel,
    currentMood,
    dimensionScores,
    answers,
    aiReflection,
    safetyFlag: false,
  };
}

function generateReflection(
  dimensions: Record<AggregateDimension, DimensionScore>,
  currentMood?: CurrentMood
) {
  const sorted = Object.values(dimensions).sort((a, b) => b.score - a.score);
  const highest = sorted.slice(0, 2);
  const lowest = sorted.slice(-2);

  const strengths = highest.map((d) => `${d.label} (${d.score}%) — ${d.summary}`);
  const focusAreas = lowest
    .filter((d) => d.score < 75)
    .map((d) => `${d.label} (${d.score}%) — ${d.summary}`);

  // Construct neutral, supportive overview
  let moodContext = '';
  if (currentMood) {
    moodContext = ` You also noted feeling ${currentMood} right now.`;
  }

  const overview = `Your responses suggest relative balance in ${highest.map((d) => d.label).join(' and ')}, while ${lowest.map((d) => d.label).join(' and ')} appear to be areas worth paying attentive care to.${moodContext} Remember that well-being naturally fluctuates with life demands, and small everyday adjustments can foster renewed stability.`;

  // Actionable recommendations based on lowest scoring dimensions
  const steps: CheckInResult['aiReflection']['suggestedSteps'] = [];

  if (dimensions.sleep_energy.score < 75) {
    steps.push({
      category: 'Sleep',
      title: 'Anchored Wind-Down Window',
      action: 'Set a consistent 30-minute buffer before bed with dimmed lighting and a non-screen activity.',
      rationale: 'A regular sleep rhythm reinforces circadian stability and helps restore morning vitality.',
    });
  }

  if (dimensions.stress_regulation.score < 75) {
    steps.push({
      category: 'Stress',
      title: 'Micro-Breaks & Chunking',
      action: 'Break intimidating projects into 25-minute single-focus blocks, followed by 3 minutes of physical stretching.',
      rationale: 'Segmenting responsibilities lowers perceived overwhelm and prevents cumulative cognitive strain.',
    });
  }

  if (dimensions.focus_functioning.score < 75) {
    steps.push({
      category: 'Movement',
      title: 'Midday Reset Walk',
      action: 'Step outside for a brisk 10 to 15-minute walk without headphones or notifications.',
      rationale: 'Natural light exposure and gentle physical motion actively dissipate brain fog and recalibrate focus.',
    });
  }

  if (dimensions.social_wellbeing.score < 75) {
    steps.push({
      category: 'Social',
      title: 'Low-Pressure Connection',
      action: 'Send a brief, casual text to a friend or family member simply sharing an interesting thought or greeting.',
      rationale: 'Meaningful connections do not need to be lengthy; small genuine touchpoints reduce perceived isolation.',
    });
  }

  // Always include digital habits or grounding step
  steps.push({
    category: 'Digital Habits',
    title: 'Screen-Free Morning Buffer',
    action: 'Spend the first 15 minutes after waking without checking email, news alerts, or social media feeds.',
    rationale: 'Guards mental clarity before reacting to outside stimuli, fostering a calmer emotional baseline for the day.',
  });

  return {
    overview,
    strengths,
    focusAreas: focusAreas.length > 0 ? focusAreas : ['All dimensions currently show comfortable balance.'],
    suggestedSteps: steps.slice(0, 4),
  };
}
