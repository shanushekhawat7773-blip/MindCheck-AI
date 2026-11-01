'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  MessageCircleHeart,
  Send,
  Sparkles,
  LifeBuoy,
  Wind,
  Eye,
  BookOpen,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Repository } from '@/lib/storage/repository';
import { MoodEntry, MOOD_DEFINITIONS } from '@/lib/storage/types';

interface Message {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  suggestedActivity?: 'breathing' | 'grounding' | 'gratitude' | 'journal';
  isCrisis?: boolean;
  isDemoFallback?: boolean;
  timestamp: string;
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'companion',
      text: "Hello. I'm your MindCheck companion. I'm here to offer a calm, non-judgmental space to help you untangle your thoughts, decompress after a long day, or explore self-care exercises. How are you holding up right now?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentMood, setRecentMood] = useState<MoodEntry | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Repository.getMoodEntries().then((entries) => {
      if (entries.length > 0) setRecentMood(entries[0]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const promptStarters = [
    'I am feeling overwhelmed with work right now.',
    'Help me unwind my mind before sleep.',
    'I feel anxious and need a quick grounding moment.',
    'I had a good day and want to reflect on it.',
  ];

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const moodContext = recentMood
        ? `${recentMood.mood} (Intensity: ${recentMood.intensity}/10)`
        : undefined;

      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, moodContext }),
      });

      const data = await res.json();

      const companionMsg: Message = {
        id: 'msg-resp-' + Date.now(),
        sender: 'companion',
        text: data.message,
        suggestedActivity: data.suggestedActivity,
        isCrisis: data.isCrisis,
        isDemoFallback: data.isDemoFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, companionMsg]);
    } catch (err) {
      console.error('Companion request error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'companion',
          text: "I am taking a gentle pause. Let's take a slow breath together and try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'companion',
        text: "The slate is clear. Take a deep, gentle breath whenever you're ready. What's on your mind?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
          {/* Header bar */}
          <div className="flex items-center justify-between pb-4 border-b border-sand-200 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-ivory">
                  <MessageCircleHeart className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="font-editorial text-2xl text-forest font-normal">
                    AI Wellness Companion
                  </h1>
                </div>
                <span className="text-[11px] font-medium text-sage-600 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                  Empathetic Reflection
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                A quiet conversation for self-compassion. Not a substitute for clinical therapy.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-xs text-muted hover:text-forest gap-1"
                title="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>

              <Link href="/crisis">
                <Button variant="outline" size="sm" className="border-red-200 text-red-800 text-xs gap-1">
                  <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
                  Crisis Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Conversation history area */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
            {messages.map((m) => {
              const isUser = m.sender === 'user';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed transition-all ${
                      isUser
                        ? 'bg-forest text-ivory rounded-br-none shadow-soft'
                        : 'bg-white/90 text-charcoal border border-sand-300 rounded-bl-none shadow-soft'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Crisis Banner if triggered */}
                    {m.isCrisis && (
                      <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <LifeBuoy className="w-4 h-4 text-red-600" />
                          <span>Immediate Crisis Helplines</span>
                        </div>
                        <p>
                          India: Tele-MANAS (<strong>14416</strong>) or Vandrevala (<strong>+91 9999 666 555</strong>).
                          <br />
                          US/Canada: <strong>988</strong> | UK: <strong>116 123</strong>.
                        </p>
                        <Link href="/crisis">
                          <Button size="sm" variant="destructive" className="mt-1 w-full text-xs">
                            View Verified Crisis Directory
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Suggested Activity Pill */}
                    {m.suggestedActivity && !m.isCrisis && (
                      <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between">
                        <span className="text-[11px] text-muted">Suggested practice:</span>
                        <Link href={`/activities?type=${m.suggestedActivity}`}>
                          <Button size="sm" variant="sage" className="text-xs py-1 h-auto gap-1">
                            {m.suggestedActivity === 'breathing' && <Wind className="w-3 h-3" />}
                            {m.suggestedActivity === 'grounding' && <Eye className="w-3 h-3" />}
                            {m.suggestedActivity === 'journal' && <BookOpen className="w-3 h-3" />}
                            Start {m.suggestedActivity}
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Demo fallback notice */}
                    {m.isDemoFallback && (
                      <div className="mt-2 text-[10px] text-muted/70 italic">
                        Offline heuristic empathy mode active (Zero external data transmission)
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-muted mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-white/70 border border-sand-200 text-xs text-muted w-fit animate-pulse">
                <span className="w-2 h-2 rounded-full bg-forest animate-ping" />
                <span>Reflecting thoughtfully...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Starters */}
          {messages.length <= 2 && (
            <div className="py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar flex-shrink-0">
              <span className="text-[11px] text-muted whitespace-nowrap">Suggested prompts:</span>
              {promptStarters.map((starter) => (
                <button
                  key={starter}
                  onClick={() => handleSend(starter)}
                  className="px-3 py-1.5 rounded-full bg-sand-100/90 border border-sand-200 text-forest hover:bg-sand-200/80 transition-colors whitespace-nowrap text-xs"
                >
                  {starter}
                </button>
              ))}
            </div>
          )}

          {/* Message input bar */}
          <div className="pt-2 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Share what is on your heart or mind..."
                className="w-full pl-4 pr-14 py-3.5 rounded-2xl border border-sand-300 bg-white text-sm focus:ring-2 focus:ring-forest focus:outline-none transition-colors shadow-soft resize-none"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl shadow-none"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-muted pt-2 px-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-sage-500" />
                Stateless & private. Conversations are never used to train global AI models.
              </span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
