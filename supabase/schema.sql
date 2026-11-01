-- ==============================================================================
-- MINDCHECK AI — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- PostgreSQL / Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Friend',
  email text,
  reminder_time text default '20:00',
  theme text default 'editorial',
  is_guest boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 3. Mood Entries Table (Emotional Check-Ins)
create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  mood text not null,
  intensity integer not null check (intensity >= 1 and intensity <= 10),
  sleep_quality integer check (sleep_quality >= 1 and sleep_quality <= 5),
  energy_level text check (energy_level in ('low', 'moderate', 'high')),
  stress_level text check (stress_level in ('low', 'medium', 'high')),
  tags text[] default array[]::text[],
  reflection text,
  supportive_summary text,
  suggested_activity text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_mood_entries_user_date on public.mood_entries(user_id, created_at desc);

alter table public.mood_entries enable row level security;

create policy "Users can view own mood entries"
  on public.mood_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own mood entries"
  on public.mood_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mood entries"
  on public.mood_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own mood entries"
  on public.mood_entries for delete
  using (auth.uid() = user_id);

-- 4. Journal Entries Table (Private reflections)
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  mood text,
  tags text[] default array[]::text[],
  prompt text,
  is_favorite boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_journal_entries_user_date on public.journal_entries(user_id, created_at desc);

alter table public.journal_entries enable row level security;

create policy "Users can view own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- 5. Wellness Goals & Habit Tracking
create table if not exists public.wellness_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text default 'mindfulness',
  target_frequency text not null default 'daily', -- 'daily', 'weekly'
  target_count integer default 1,
  completed_dates text[] default array[]::text[], -- YYYY-MM-DD
  status text not null default 'active', -- 'active', 'paused', 'completed'
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_wellness_goals_user on public.wellness_goals(user_id);

alter table public.wellness_goals enable row level security;

create policy "Users can view own goals"
  on public.wellness_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.wellness_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.wellness_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.wellness_goals for delete
  using (auth.uid() = user_id);

-- 6. Activity Completions Table
create table if not exists public.activity_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  activity_type text not null, -- 'breathing', 'grounding', 'gratitude', 'mindful_pause', 'journal'
  duration_seconds integer default 0,
  notes text,
  completed_at timestamptz default now() not null
);

create index if not exists idx_activity_completions_user on public.activity_completions(user_id, completed_at desc);

alter table public.activity_completions enable row level security;

create policy "Users can view own activity completions"
  on public.activity_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own activity completions"
  on public.activity_completions for insert
  with check (auth.uid() = user_id);

-- 7. Trigger to automatically create profile record on Supabase auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Friend'), new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
