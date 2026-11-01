'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Repository } from '@/lib/storage/repository';
import { UserProfile } from '@/lib/storage/types';
import {
  Settings,
  User,
  Shield,
  Download,
  Trash2,
  Bell,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [reminderTime, setReminderTime] = useState('20:00');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Repository.getProfile().then((p) => {
      setProfile(p);
      setDisplayName(p.display_name);
      setReminderTime(p.reminder_time || '20:00');
      setIsLoading(false);
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await Repository.updateProfile({
      display_name: displayName,
      reminder_time: reminderTime,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleExportData = () => {
    const jsonStr = Repository.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcheck-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleWipeData = async () => {
    Repository.clearAllData();
    setIsDeleteModalOpen(false);
    alert('All your personal records, journal reflections, and check-in history have been permanently wiped from this device.');
    router.push('/');
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-sand-200">
            <h1 className="font-editorial text-2xl text-forest font-normal">
              Profile, Privacy & Data Sovereignty
            </h1>
            <p className="text-xs text-muted mt-1">
              Control your personal information, notification preferences, and export your archives.
            </p>
          </div>

          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sand-200">
              <User className="w-4 h-4 text-forest" />
              <h2 className="font-editorial text-lg text-forest font-normal">
                Personal Identity & Preferences
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium text-forest mb-1">
                  Preferred Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-sand-50/50 text-xs focus:ring-1 focus:ring-forest focus:outline-none"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Used for your warm greeting on the wellness dashboard.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-forest mb-1">
                  Daily Check-In Evening Reminder Time
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-44 px-3 py-2 rounded-xl border border-sand-300 bg-sand-50/50 text-xs focus:ring-1 focus:ring-forest focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" size="sm" className="text-xs">
                  Save Changes
                </Button>
                {isSavedNotice && (
                  <span className="text-xs text-sage-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Updated successfully!
                  </span>
                )}
              </div>
            </form>
          </Card>

          {/* Privacy Architecture Disclosure Table */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sand-200">
              <Shield className="w-4 h-4 text-forest" />
              <h2 className="font-editorial text-lg text-forest font-normal">
                Privacy Architecture & Data Practices
              </h2>
            </div>

            <div className="space-y-3 text-xs text-charcoal/90">
              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 flex items-start gap-3">
                <div className="p-1 rounded bg-white text-forest mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-forest block">Storage Model</span>
                  Your mood check-ins, journal entries, and personal goals are stored locally in your browser&apos;s encrypted client sandbox, or in private PostgreSQL with Row-Level Security (RLS) when connected to Supabase.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 flex items-start gap-3">
                <div className="p-1 rounded bg-white text-forest mt-0.5">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-forest block">AI Processing Safeguards</span>
                  Conversations sent to the AI companion pass through a server-side route handler using ephemeral requests. We do not use user journal logs to train public AI models.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 flex items-start gap-3">
                <div className="p-1 rounded bg-white text-forest mt-0.5">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-forest block">Data Portability Guarantee</span>
                  You can download your entire archive in readable JSON format at any moment without penalty or paywalls.
                </div>
              </div>
            </div>
          </Card>

          {/* Data Actions (Export & Wipe) */}
          <Card className="p-6">
            <h2 className="font-editorial text-lg text-forest font-normal mb-1">
              Data Management & Account Controls
            </h2>
            <p className="text-xs text-muted mb-4">
              Exercise complete control over your stored history.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="gap-2 text-xs"
              >
                <Download className="w-4 h-4 text-forest" />
                Export Complete Data (JSON)
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="gap-2 text-xs"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                Wipe All Personal Data
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-xs text-muted hover:text-forest sm:ml-auto"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </Card>

          {/* Wipe Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-elevated border border-sand-300 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl text-forest">
                  Permanently wipe all records?
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  This action will completely delete all your daily check-ins, mood trends, personal reflections, and custom habits from this application. This cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleWipeData}
                    className="text-xs"
                  >
                    Yes, Permanently Delete Everything
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
