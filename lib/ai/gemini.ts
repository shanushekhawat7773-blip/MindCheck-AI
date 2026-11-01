import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AICompanionResponse,
  generateEmpatheticFallback,
  SYSTEM_WELLNESS_PROMPT,
  sanitizeInput,
} from './safety';
import { isCrisisMessage } from '../crisis/resources';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function askAICompanion(
  userMessage: string,
  moodContext?: string
): Promise<AICompanionResponse> {
  const sanitized = sanitizeInput(userMessage);

  // 1. Immediate Safety & Crisis Check
  if (isCrisisMessage(sanitized)) {
    return generateEmpatheticFallback(sanitized);
  }

  // 2. Fallback to heuristic empathy engine if no API key is configured
  if (!genAI || !apiKey || apiKey.includes('your_gemini_api_key')) {
    return generateEmpatheticFallback(sanitized);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_WELLNESS_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    const promptWithContext = moodContext
      ? `[User's recent mood context: ${moodContext}]\nUser message: "${sanitized}"`
      : sanitized;

    const result = await model.generateContent(promptWithContext);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return generateEmpatheticFallback(sanitized);
    }

    // Infer suggested activity if mentioned
    let suggestedActivity: 'breathing' | 'grounding' | 'gratitude' | 'journal' | undefined;
    const lower = text.toLowerCase();
    if (lower.includes('breath') || lower.includes('4-7-8') || lower.includes('box breath')) {
      suggestedActivity = 'breathing';
    } else if (lower.includes('ground') || lower.includes('5-4-3-2-1') || lower.includes('senses')) {
      suggestedActivity = 'grounding';
    } else if (lower.includes('gratitude') || lower.includes('grateful')) {
      suggestedActivity = 'gratitude';
    } else if (lower.includes('journal') || lower.includes('write down') || lower.includes('reflect')) {
      suggestedActivity = 'journal';
    }

    return {
      message: text,
      suggestedActivity,
      isCrisis: false,
      isDemoFallback: false,
    };
  } catch (error) {
    console.error('Gemini API call failed, using graceful fallback:', error);
    return generateEmpatheticFallback(sanitized);
  }
}
