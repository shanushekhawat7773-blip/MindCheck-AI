'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { LocalStore } from '@/lib/storage/localStore';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Sign in failed');
        setIsLoading(false);
        return;
      }
    } else {
      // In local mode, save local profile with entered email
      LocalStore.updateProfile({ email, is_guest: false });
    }

    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleDemoAccess = () => {
    LocalStore.updateProfile({ display_name: 'Elena (Demo)', is_guest: true });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="font-editorial text-3xl sm:text-4xl text-forest">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Return to your private sanctuary of reflection.
            </p>
          </div>

          <Card className="bg-white/90 border-sand-300 shadow-elevated p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-forest mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-sm focus:ring-2 focus:ring-forest focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-forest" htmlFor="password">
                    Password
                  </label>
                  <span className="text-[11px] text-muted hover:text-forest cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-sm focus:ring-2 focus:ring-forest focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 mt-2 shadow-soft gap-2 text-sm"
                isLoading={isLoading}
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sand-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-muted">or explore without an account</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full py-2.5 gap-2 text-xs font-normal"
              onClick={handleDemoAccess}
            >
              <Sparkles className="w-4 h-4 text-sage-500" />
              Continue in Instant Demo Mode
            </Button>
          </Card>

          <div className="text-center text-xs text-muted">
            Don&apos;t have an account yet?{' '}
            <Link href="/auth/signup" className="font-medium text-forest hover:underline">
              Create an account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
            <span>End-to-end private sessions with local encryption option</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
