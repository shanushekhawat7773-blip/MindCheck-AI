import { NextRequest, NextResponse } from 'next/server';
import { askAICompanion } from '@/lib/ai/gemini';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, moodContext } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 2000 characters).' },
        { status: 400 }
      );
    }

    const response = await askAICompanion(message, moodContext);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Companion API route error:', error);
    return NextResponse.json(
      {
        message: "I am taking a gentle pause. Let's take a slow breath together and try again in a moment.",
        isCrisis: false,
        isDemoFallback: true,
      },
      { status: 200 } // Graceful recovery without breaking chat client
    );
  }
}
