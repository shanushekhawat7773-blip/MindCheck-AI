import { isCrisisMessage } from '../crisis/resources';

export interface AICompanionResponse {
  message: string;
  suggestedActivity?: 'breathing' | 'grounding' | 'gratitude' | 'journal';
  isCrisis: boolean;
  isDemoFallback: boolean;
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .slice(0, 1500)
    .replace(/[<>]/g, ''); // Basic tag stripping to prevent XSS
}

export const SYSTEM_WELLNESS_PROMPT = `
You are MindCheck AI, an empathetic, calm, and thoughtful mental wellness companion.
Your mission is to help the user reflect on their feelings, build healthy habits, and practice self-compassion.

CORE BEHAVIOR RULES:
1. Warm, natural, and respectful tone. Avoid clinical jargon, robotic language, or toxic positivity.
2. Active listening: Acknowledge what the user shares before asking gentle follow-up questions.
3. Suggest low-risk, practical wellness exercises (such as 4-7-8 breathing, 5-4-3-2-1 grounding, gratitude reflection, or journaling).
4. STRICT SAFETY:
   - You are NOT a doctor, therapist, or clinical professional.
   - NEVER diagnose mental health disorders.
   - NEVER prescribe, recommend, or comment on medication.
   - If the user discusses severe crisis or self-harm, respond with profound care and urge them to connect with immediate professional crisis helplines.
5. Keep responses concise, warm, and easily readable (2 to 3 paragraphs max).
`;

/**
 * Intelligent empathetic offline heuristic generator.
 * Used when GEMINI_API_KEY is not configured or in guest mode.
 */
export function generateEmpatheticFallback(userMessage: string): AICompanionResponse {
  const sanitized = sanitizeInput(userMessage);

  if (isCrisisMessage(sanitized)) {
    return {
      message: `I hear how much pain and distress you are carrying right now, and I want you to know you do not have to carry this alone. Please reach out to someone who can support you right now. 

In India, call the national Tele-MANAS helpline at 14416 or Vandrevala Foundation at +91 9999 666 555. In the US/Canada, call or text 988. In the UK, call 116 123. These are free, confidential, and available 24/7 with trained caring people ready to listen.`,
      isCrisis: true,
      isDemoFallback: true,
    };
  }

  const lower = sanitized.toLowerCase();

  if (lower.includes('breath') || lower.includes('panic') || lower.includes('anxious') || lower.includes('heart')) {
    return {
      message: `It sounds like your body is feeling quite activated right now. When anxiety peaks, it's very natural for thoughts to race and for the breath to become shallow.

Let's pause together for a moment. Unclench your jaw, soften your shoulders, and place both feet flat on the ground. Would you like to try a gentle 2-minute breathing exercise with me, or simply tell me what feels most pressing right now?`,
      suggestedActivity: 'breathing',
      isCrisis: false,
      isDemoFallback: true,
    };
  }

  if (lower.includes('overwhelm') || lower.includes('too much') || lower.includes('stress') || lower.includes('exam') || lower.includes('work')) {
    return {
      message: `Feeling overwhelmed usually means you've been carrying too many things at once for too long. You don't have to solve everything this very evening.

If you can, pick just one tiny thing you can let go of for the next hour. Sometimes doing our 5-Senses grounding exercise can bring your focus back into the present room and give your nervous system a much-needed break. How does that sound?`,
      suggestedActivity: 'grounding',
      isCrisis: false,
      isDemoFallback: true,
    };
  }

  if (lower.includes('sad') || lower.includes('lonely') || lower.includes('tired') || lower.includes('cry') || lower.includes('exhausted')) {
    return {
      message: `Thank you for sharing that with me. It takes real courage to admit when you're feeling low or depleted instead of pretending everything is fine.

Your feelings are valid, and it's okay to have days where your energy is simply minimal. Is there one small comforting thing you can do for yourself tonight—like a warm drink, soft music, or resting without guilt?`,
      suggestedActivity: 'gratitude',
      isCrisis: false,
      isDemoFallback: true,
    };
  }

  if (lower.includes('grateful') || lower.includes('happy') || lower.includes('good') || lower.includes('better')) {
    return {
      message: `It is wonderful to hear that. Taking a moment to intentionally notice and savor when things feel lighter or hopeful is one of the most powerful ways to build emotional resilience.

What contributed to this positive shift for you today? Taking note of it in your journal can be a lovely anchor to revisit in the future.`,
      suggestedActivity: 'journal',
      isCrisis: false,
      isDemoFallback: true,
    };
  }

  // Default thoughtful reflective response
  return {
    message: `I'm listening. Thank you for taking this moment out of your day to pause and check in with yourself. 

Reflecting honestly on your inner landscape is a quiet practice that deepens over time. How has your day felt overall, and what is one small thing your mind or body might need right now?`,
    suggestedActivity: 'breathing',
    isCrisis: false,
    isDemoFallback: true,
  };
}
