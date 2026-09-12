import { CrisisContact } from './types';

export const VERIFIED_CRISIS_RESOURCES: CrisisContact[] = [
  {
    country: 'United States & Canada',
    countryCode: 'US/CA',
    name: 'Suicide & Crisis Lifeline',
    number: '988',
    textOption: 'Text 988 or text HOME to 741741 (Crisis Text Line)',
    hours: '24/7, Free & Confidential',
    description: 'Immediate, compassionate support for anyone in distress, prevention, and crisis resources.',
    website: 'https://988lifeline.org',
    isEmergency: true,
  },
  {
    country: 'India',
    countryCode: 'IN',
    name: 'Tele-MANAS (Govt of India)',
    number: '14416 / 1800-891-4416',
    textOption: 'Toll-free 24/7 dedicated helpline across multiple languages',
    hours: '24/7, Free & Multi-lingual',
    description: 'National tele-mental health programme providing comprehensive psychological support.',
    website: 'https://telemanas.mohfw.gov.in',
    isEmergency: true,
  },
  {
    country: 'India',
    countryCode: 'IN',
    name: 'Vandrevala Foundation Helpline',
    number: '+91 9999 666 555',
    textOption: 'WhatsApp available at +91 9999 666 555',
    hours: '24/7, Free & Confidential',
    description: 'Free, confidential mental health counseling and crisis intervention by trained professionals.',
    website: 'https://www.vandrevalafoundation.com',
    isEmergency: false,
  },
  {
    country: 'India',
    countryCode: 'IN',
    name: 'KIRAN Mental Health Helpline',
    number: '1800-599-0019',
    hours: '24/7, Toll-Free',
    description: 'Ministry of Social Justice helpline for psychological first-aid and support.',
    isEmergency: false,
  },
  {
    country: 'United Kingdom',
    countryCode: 'UK',
    name: 'NHS Mental Health Services / Samaritans',
    number: '111 (NHS) / 116 123 (Samaritans)',
    textOption: 'Text SHOUT to 85258',
    hours: '24/7, Free',
    description: 'Call 111 for immediate NHS mental health triage or 116 123 to speak with Samaritans anytime.',
    website: 'https://www.samaritans.org',
    isEmergency: true,
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    name: 'Lifeline Australia',
    number: '13 11 14',
    textOption: 'Text 0477 13 11 14',
    hours: '24/7, Confidential',
    description: 'Short-term support for anyone going through personal crisis, suicide prevention.',
    website: 'https://www.lifeline.org.au',
    isEmergency: true,
  },
  {
    country: 'International / Worldwide',
    countryCode: 'GLOBAL',
    name: 'Befrienders Worldwide & Find A Helpline',
    number: 'Visit findahelpline.com',
    textOption: 'Available in 130+ countries',
    hours: '24/7 Worldwide Directory',
    description: 'Free, confidential crisis helplines and emotional support services worldwide.',
    website: 'https://findahelpline.com',
    isEmergency: true,
  },
];

const CRISIS_PATTERNS = [
  /\b(kill|killing|end|ending|take|taking)\s+(myself|my\s+life)\b/i,
  /\b(suicid(e|al|ing)?)\b/i,
  /\b(want\s+to\s+die|wanting\s+to\s+die|wish\s+i\s+(were|was)\s+dead|better\s+off\s+dead)\b/i,
  /\b(self[- ]?harm(ing)?|cut\s+myself|cutting\s+myself|hurt\s+myself|hurting\s+myself)\b/i,
  /\b(no\s+reason\s+to\s+live|don'?t\s+want\s+to\s+live|don'?t\s+want\s+to\s+be\s+here\s+anymore)\b/i,
  /\b(hang\s+myself|hanging\s+myself|overdose|overdosing)\b/i,
  /\b(can'?t\s+go\s+on\s+living|give\s+up\s+on\s+life)\b/i,
  /\b(goodbye\s+cruel\s+world)\b/i,
];

export function detectCrisisIntent(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export function sanitizeWellnessResponse(rawResponse: string): string {
  // Guardrail against diagnostic statements
  let sanitized = rawResponse
    .replace(/\byou have (major depression|depression|clinical depression)\b/gi, 'your responses indicate signs of emotional strain')
    .replace(/\byou have (generalized anxiety|anxiety disorder|anxiety)\b/gi, 'your responses suggest elevated stress or tension')
    .replace(/\byou are suffering from\b/gi, 'you are experiencing')
    .replace(/\byou need to take (antidepressants|medication|pills|xanax|prozac)\b/gi, 'you may consider discussing treatment options with a licensed physician');

  return sanitized;
}
