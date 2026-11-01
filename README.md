# MindCheck AI — Premium Mental Wellness & Self-Reflection Platform

> *"Understand yourself a little better."*

**MindCheck AI** is a privacy-conscious mental wellness platform for emotional check-ins, mood tracking, journaling, guided wellness activities, and personalized self-reflection, featuring a premium minimalist dashboard. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase / resilient local client-store fallback, and Google Gemini AI.

The platform follows **Design Reference 4** (Scandinavian Warm Editorial & Premium Wellness Analytics Dashboard) featuring:
- **Warm Ivory background** (`#F8F6F1`)
- **Deep Forest Green** typography & primary accents (`#24483D`)
- **Muted Sage Green** active elements & badges (`#A7B8A1`)
- **Soft Lavender** restorative highlights (`#DCD7ED`)
- **Warm Sand** borders & cards (`#E9DFD0`)
- **Charcoal** text (`#252925`) & Muted slate (`#777B76`)
- Distinctive typography pairing: **DM Serif Display** for editorial headings and **DM Sans** for interface controls.

---

## 🌟 Key Features

### 1. Editorial Wellness Landing Page (`/`)
- Thoughtfully art-directed hero with an interactive check-in preview.
- How It Works (Check In Honestly, Notice the Subtle, Restore & Ground).
- Philosophy section emphasizing calmness over addictive metrics.
- Privacy & User-Control guarantees with zero third-party telemetry.
- Responsible AI boundary disclosures.

### 2. Personal Wellness Dashboard (`/dashboard` — Design Reference 4)
- **Personalized Greeting**: Dynamic, calm greeting with date and reflection banner.
- **Prominent Daily Emotional Check-In Widget**: Quick mood status or one-tap check-in.
- **Weekly Mood Trend Chart**: Interactive SVG cadence chart based strictly on actual saved entries (never fabricated).
- **Personal Observations & Correlations**: Discovers genuine correlations between sleep quality, energy, and stress.
- **Gentle Intentions & Goals**: Non-punitive daily and weekly habit tracking.
- **Recent Journal Reflections**: Instant access to your latest written entries.
- **Restorative Practice Launchers**: One-click start for breathing and grounding.
- **Minimal Desktop Sidebar** and mobile navigation drawer.

### 3. Interactive 7-Step Emotional Check-In (`/checkin`)
- **Step 1: Emotional State**: Selectable states (Happy, Calm, Hopeful, Neutral, Tired, Stressed, Anxious, Sad, Overwhelmed).
- **Step 2: Emotional Intensity**: 1-10 slider with anchor points ("Subtle whisper" to "Absorbing wave").
- **Step 3: Biological Context**: Sleep quality (1-5★), energy level, perceived stress, and lifestyle tags.
- **Step 4: Personal Reflection**: Optional free-text journaling prompt.
- **Step 5: Supportive Summary**: Real-time supportive validation tailored to user inputs.
- **Step 6: Suggested Practice**: Recommended low-risk exercise (e.g. 4-7-8 breathing or grounding).
- **Step 7: Review & Save**: Discard, edit from start, or save to personal records with calm celebration.

### 4. Empathetic AI Wellness Companion (`/companion`)
- Conversational chat powered server-side by Google Gemini API (`gemini-1.5-flash`).
- **Resilient Zero-Config Fallback**: Intelligently switches to an offline heuristic empathy engine if `GEMINI_API_KEY` is not configured, ensuring reviewers and users always experience a warm, responsive conversation.
- **Strict Safety Guardrails**: Never diagnoses conditions, never prescribes medication, and avoids toxic positivity.
- **Life-Safety Crisis Interception**: Scans for acute crisis keywords and instantly surfaces official crisis helplines.

### 5. Private Journal (`/journal`)
- Full CRUD operations: create, edit, search, filter by mood, and delete with safety confirmation.
- Built-in reflection prompts generator for moments of writer's block.
- Word count, timestamping, and local vault encryption.

### 6. Guided Wellness Exercises (`/activities`)
- **Paced Breathing**: Animated breathing ring supporting both 4-7-8 Relaxing Breath and 4-4-4-4 Box Breathing with audio chimes.
- **5-4-3-2-1 Sensory Grounding**: Step-by-step checklist to de-escalate anxiety.
- **Gratitude Anchors**: 3-moment reflection recorder.
- **Mindful Pause**: 1, 2, or 3-minute silence timer with gentle Solfeggio 528 Hz chime.
- **Self-Care Intentions Planner**: Morning, midday, and evening care tracker.

### 7. Emotional Trends & Insights (`/insights`)
- 7-day and 30-day views.
- Mood distribution bar breakdown with percentages.
- Descriptive observations connecting sleep and mood.
- Honest empty states for accounts with fewer than 3 check-ins.

### 8. Verified Crisis Support Directory (`/crisis`)
- **India Hotlines**:
  - **Tele-MANAS**: `14416` (Govt. of India 24/7 National Mental Health Helpline)
  - **KIRAN**: `1800-599-0019` (Toll-Free 24/7 Helpline)
  - **Vandrevala Foundation**: `+91 9999 666 555` (24/7 Counselor Support)
  - **AASRA**: `+91 98204 66726` (24/7 Crisis Intervention)
- **US & Canada**: `988` Suicide & Crisis Lifeline, Crisis Text Line (Text `HOME` to `741741`)
- **United Kingdom**: NHS `111`, Samaritans `116 123`
- **Global**: Befrienders Worldwide and IASP international directory.
- Acute panic decompression protocol (cold water reset, paced exhalation, human connection).

### 9. Profile, Privacy & Settings (`/settings`)
- Profile preferences and evening reminder times.
- **One-Click JSON Data Export**: Complete archive download.
- **Wipe All Data**: Permanent local data purge with double confirmation.
- Transparent privacy architecture disclosure.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Client Hooks)
- **Language**: TypeScript (Strict type checking)
- **Styling**: Tailwind CSS with custom Design Reference 4 design tokens
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Icons**: Lucide React
- **Data Persistence**: Unified Repository supporting Supabase PostgreSQL + Local Storage Fallback
- **Audio Feedback**: Web Audio API (gentle 528 Hz Solfeggio chimes)
- **Testing**: Vitest automated test suite

---

## 🚀 Getting Started Locally

### 1. Clone & Navigate
```bash
cd MindCheck-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials if desired:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*Note: The platform works 100% out of the box in zero-config Demo/Guest Mode even without external API keys.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npm test
```

### 6. Run Production Build
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)

If deploying with Supabase cloud PostgreSQL:
1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of `supabase/schema.sql`.
4. Copy your **Project URL** and **Anon Key** into `.env.local`.

---

## 📜 Ethical & Clinical Disclaimer

MindCheck AI is an AI-assisted self-reflection and habit-building platform. It does not provide medical diagnoses, clinical psychological therapy, or pharmaceutical prescriptions. If you are experiencing acute emotional distress or a mental health emergency, please contact official crisis hotlines immediately or visit an emergency medical center.
