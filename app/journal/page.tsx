'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Repository } from '@/lib/storage/repository';
import { JournalEntry, MOOD_DEFINITIONS, MoodType } from '@/lib/storage/types';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  Lock,
  Tag,
  Star,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [activeEntry, setActiveEntry] = useState<Partial<JournalEntry> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reflectionPrompts = [
    'What helped you find quiet today?',
    'What expectation can you soften or release right now?',
    'Name one small moment of grace or beauty you witnessed today.',
    'What boundary protected your peace this week?',
    'What would you tell a friend who was feeling the way you feel today?',
    'What does your body need most in this moment?',
  ];

  const loadJournals = async () => {
    setIsLoading(true);
    const data = await Repository.getJournalEntries();
    setEntries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const handleCreateNew = () => {
    setActiveEntry({
      title: '',
      content: '',
      mood: undefined,
      tags: [],
      prompt: '',
      is_favorite: false,
    });
    setIsEditing(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setActiveEntry({ ...entry });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!activeEntry || !activeEntry.title?.trim() || !activeEntry.content?.trim()) {
      return;
    }

    if (activeEntry.id) {
      await Repository.updateJournalEntry(activeEntry.id, {
        title: activeEntry.title,
        content: activeEntry.content,
        mood: activeEntry.mood,
        tags: activeEntry.tags,
        prompt: activeEntry.prompt,
        is_favorite: activeEntry.is_favorite,
      });
    } else {
      await Repository.addJournalEntry({
        user_id: 'current-user',
        title: activeEntry.title,
        content: activeEntry.content,
        mood: activeEntry.mood,
        tags: activeEntry.tags || [],
        prompt: activeEntry.prompt,
        is_favorite: activeEntry.is_favorite || false,
      });
    }

    setIsEditing(false);
    setActiveEntry(null);
    await loadJournals();
  };

  const handleDelete = async (id: string) => {
    await Repository.deleteJournalEntry(id);
    setDeleteConfirmId(null);
    if (activeEntry?.id === id) {
      setIsEditing(false);
      setActiveEntry(null);
    }
    await loadJournals();
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood =
      selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;

    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center text-ivory">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h1 className="font-editorial text-2xl text-forest font-normal">
                  Private Journal
                </h1>
              </div>
              <p className="text-xs text-muted mt-1">
                An unhurried space for your unfiltered thoughts and honest reflections.
              </p>
            </div>

            <Button onClick={handleCreateNew} className="shadow-soft gap-2 text-xs">
              <Plus className="w-4 h-4" />
              New Reflection
            </Button>
          </div>

          {/* EDIT / CREATE MODAL / INLINE CARD */}
          {isEditing && activeEntry && (
            <Card className="p-6 sm:p-8 bg-white border-forest/30 shadow-elevated">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200 mb-6">
                <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                  {activeEntry.id ? 'Edit Reflection' : 'New Journal Entry'}
                </span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-lg hover:bg-sand-100 text-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prompt selection suggestion */}
              {!activeEntry.id && (
                <div className="mb-4 p-3 rounded-xl bg-sand-50 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-forest">
                    <Sparkles className="w-4 h-4 text-sage-500 flex-shrink-0" />
                    <span>Need inspiration? Pick a reflection prompt:</span>
                  </div>
                  <select
                    className="bg-white border border-sand-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-forest text-charcoal"
                    onChange={(e) => {
                      if (e.target.value) {
                        setActiveEntry({
                          ...activeEntry,
                          prompt: e.target.value,
                          title: activeEntry.title || e.target.value,
                        });
                      }
                    }}
                  >
                    <option value="">Select a prompt...</option>
                    {reflectionPrompts.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={activeEntry.title || ''}
                    onChange={(e) =>
                      setActiveEntry({ ...activeEntry, title: e.target.value })
                    }
                    placeholder="Title your reflection..."
                    className="w-full text-xl sm:text-2xl font-editorial text-forest placeholder:text-muted/60 border-b border-sand-300 pb-2 focus:outline-none focus:border-forest bg-transparent"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <span className="text-muted">Associated Mood:</span>
                  <select
                    value={activeEntry.mood || ''}
                    onChange={(e) =>
                      setActiveEntry({
                        ...activeEntry,
                        mood: (e.target.value as MoodType) || undefined,
                      })
                    }
                    className="p-1.5 rounded-lg border border-sand-300 bg-sand-50 text-xs text-charcoal focus:ring-1 focus:ring-forest"
                  >
                    <option value="">No specific mood</option>
                    {Object.entries(MOOD_DEFINITIONS).map(([key, def]) => (
                      <option key={key} value={key}>
                        {def.emoji} {def.label}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={8}
                  value={activeEntry.content || ''}
                  onChange={(e) =>
                    setActiveEntry({ ...activeEntry, content: e.target.value })
                  }
                  placeholder="Write freely. Your entry is stored in your private, secure vault..."
                  className="w-full p-4 rounded-xl border border-sand-300 bg-sand-50/40 text-sm focus:ring-2 focus:ring-forest focus:outline-none leading-relaxed resize-y"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-muted">
                    {(activeEntry.content || '').split(/\s+/).filter(Boolean).length} words
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={!activeEntry.title?.trim() || !activeEntry.content?.trim()}
                      className="gap-1.5 text-xs shadow-soft"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save Reflection
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections by title, keyword, or tag..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-300 bg-white text-xs focus:ring-1 focus:ring-forest focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Filter:</span>
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-sand-300 bg-white text-xs text-forest focus:outline-none"
              >
                <option value="all">All Moods</option>
                {Object.entries(MOOD_DEFINITIONS).map(([key, def]) => (
                  <option key={key} value={key}>
                    {def.emoji} {def.label.split('&')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Journal Entries List */}
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-28 rounded-2xl bg-sand-200" />
              <div className="h-28 rounded-2xl bg-sand-200" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-forest mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-sage-500" />
              </div>
              <h3 className="font-editorial text-lg text-forest">
                {searchQuery || selectedMoodFilter !== 'all'
                  ? 'No matching reflections found'
                  : 'Your journal is peaceful and empty'}
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-4">
                {searchQuery || selectedMoodFilter !== 'all'
                  ? 'Try adjusting your search terms or filters.'
                  : 'Take a quiet moment to record your first thought.'}
              </p>
              {!searchQuery && selectedMoodFilter === 'all' && (
                <Button onClick={handleCreateNew} size="sm">
                  Write First Entry
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEntries.map((entry) => {
                const dateStr = new Date(entry.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const moodDef = entry.mood ? MOOD_DEFINITIONS[entry.mood] : null;

                return (
                  <Card
                    key={entry.id}
                    className="p-5 flex flex-col justify-between hover:border-sand-400 transition-all text-left bg-white/80"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-editorial text-lg text-forest font-normal">
                            {entry.title}
                          </h3>
                          <span className="text-[11px] text-muted flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3 text-sage-500" />
                            {dateStr}
                          </span>
                        </div>

                        {moodDef && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-sand-100 border border-sand-200 text-forest flex items-center gap-1 flex-shrink-0">
                            <span>{moodDef.emoji}</span>
                            <span>{moodDef.label.split('&')[0]}</span>
                          </span>
                        )}
                      </div>

                      {entry.prompt && (
                        <div className="mb-2 text-[11px] text-sage-600 bg-sage-50 px-2 py-0.5 rounded border border-sage-200 inline-block">
                          Prompt: &quot;{entry.prompt}&quot;
                        </div>
                      )}

                      <p className="text-xs text-charcoal/80 whitespace-pre-line line-clamp-4 leading-relaxed mt-2">
                        {entry.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between text-xs text-muted">
                      <span>{entry.content.split(/\s+/).filter(Boolean).length} words</span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1.5 rounded-lg hover:bg-sand-100 text-forest"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Delete confirmation modal */}
          {deleteConfirmId && (
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-elevated border border-sand-300 animate-in fade-in zoom-in-95">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-editorial text-xl text-forest">Delete this reflection?</h4>
                <p className="text-xs text-muted mt-1 mb-5">
                  This action is permanent and cannot be undone. Are you sure you wish to delete this entry?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="text-xs"
                  >
                    Delete Entry
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
