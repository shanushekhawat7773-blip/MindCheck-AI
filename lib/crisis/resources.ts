export interface CrisisResource {
  name: string;
  region: string;
  phone: string;
  sms?: string;
  website: string;
  hours: string;
  description: string;
  badge: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  // India Verified Hotlines
  {
    name: 'Tele-MANAS (Govt. of India National Mental Health Helpline)',
    region: 'India',
    phone: '14416',
    website: 'https://telemanas.mohfw.gov.in',
    hours: '24/7 Available in 20+ Languages',
    description: 'Free, confidential tele-mental health services launched by the Ministry of Health & Family Welfare, Govt. of India.',
    badge: 'Official Govt. 24/7',
  },
  {
    name: 'KIRAN Mental Health Helpline',
    region: 'India',
    phone: '1800-599-0019',
    website: 'https://disabilityaffairs.gov.in',
    hours: '24/7 Toll-Free',
    description: 'National helpline established by the Ministry of Social Justice and Empowerment offering psychological support and crisis management.',
    badge: 'Toll-Free 24/7',
  },
  {
    name: 'Vandrevala Foundation Helpline',
    region: 'India',
    phone: '+91 9999 666 555',
    website: 'https://www.vandrevalafoundation.com',
    hours: '24/7 Free Support',
    description: 'Dedicated team of clinical psychologists and trained counselors offering free, immediate emotional and suicide prevention counseling.',
    badge: '24/7 Counselor Support',
  },
  {
    name: 'AASRA Suicide Prevention Helpline',
    region: 'India',
    phone: '+91 98204 66726',
    website: 'http://www.aasra.info',
    hours: '24/7 Confidential',
    description: 'Non-profit providing compassionate, confidential, non-judgmental crisis intervention for individuals in acute distress.',
    badge: 'Confidential 24/7',
  },

  // US & Canada
  {
    name: '988 Suicide & Crisis Lifeline',
    region: 'United States & Canada',
    phone: '988',
    sms: '988',
    website: 'https://988lifeline.org',
    hours: '24/7 Free & Confidential',
    description: 'Call or text 988 to connect with trained crisis counselors across the US and Canada.',
    badge: 'Call / Text 988',
  },
  {
    name: 'Crisis Text Line',
    region: 'US / UK / Canada',
    phone: 'Text HOME to 741741',
    sms: '741741',
    website: 'https://www.crisistextline.org',
    hours: '24/7 Text Support',
    description: 'Free 24/7 text support with volunteer crisis responders.',
    badge: 'Text-Based 24/7',
  },

  // United Kingdom
  {
    name: 'Samaritans UK',
    region: 'United Kingdom & Ireland',
    phone: '116 123',
    website: 'https://www.samaritans.org',
    hours: '24/7 Free from any phone',
    description: 'Round-the-clock listening service for anyone struggling to cope or contemplating suicide.',
    badge: 'Call 116 123',
  },
  {
    name: 'NHS Mental Health Services (111)',
    region: 'United Kingdom',
    phone: '111',
    website: 'https://111.nhs.uk',
    hours: '24/7 Non-Emergency NHS',
    description: 'Call 111 (Option 2 for mental health) to speak directly with an NHS mental health triage specialist.',
    badge: 'NHS Support',
  },

  // International
  {
    name: 'Befrienders Worldwide',
    region: 'International (Worldwide Directory)',
    phone: 'Directory Lookup',
    website: 'https://www.befrienders.org',
    hours: 'Global volunteer network',
    description: 'Global suicide prevention network connecting individuals to verified local hotlines in over 30 countries.',
    badge: 'Global Directory',
  },
  {
    name: 'International Association for Suicide Prevention (IASP)',
    region: 'International',
    phone: 'Find Your Country',
    website: 'https://www.iasp.info/resources/Crisis_Centres',
    hours: 'Resource Directory',
    description: 'Official global index of verified national crisis contact points and crisis centers across all continents.',
    badge: 'Global Index',
  },
];

// Patterns indicating critical immediate danger or suicidal ideation
const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|end my life|kill myself|want to die|ending it all|self harm|cut myself|hurt(?:ing)? myself|take my own life)\b/i,
  /\b(no reason to live|better off dead|can'?t go on anymore|nothing to live for|goodbye forever)\b/i,
  /\b(overdose|hang myself|jump off|slit my)\b/i,
];

export function isCrisisMessage(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text.toLowerCase().trim();
  return CRISIS_PATTERNS.some((pattern) => pattern.test(clean));
}
