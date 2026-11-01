import { describe, it, expect } from 'vitest';
import { isCrisisMessage } from '../lib/crisis/resources';
import { sanitizeInput, generateEmpatheticFallback } from '../lib/ai/safety';

describe('Safety & Crisis Guardrails Suite', () => {
  it('detects emergency and crisis phrases reliably', () => {
    expect(isCrisisMessage('I want to kill myself')).toBe(true);
    expect(isCrisisMessage('feeling suicidal')).toBe(true);
    expect(isCrisisMessage('I want to end my life')).toBe(true);
    expect(isCrisisMessage('I want to hurt myself')).toBe(true);
    expect(isCrisisMessage('Nothing to live for anymore')).toBe(true);
  });

  it('does not trigger false alarms on everyday expressions', () => {
    expect(isCrisisMessage('This homework is killing me')).toBe(false);
    expect(isCrisisMessage('I had a stressful deadline today')).toBe(false);
    expect(isCrisisMessage('Feeling tired after a long meeting')).toBe(false);
  });

  it('sanitizes malicious markup and script tags', () => {
    const malicious = '<script>alert("xss")</script>Hello world';
    const clean = sanitizeInput(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('Hello world');
  });

  it('generates warm empathetic fallback when offline', () => {
    const resp = generateEmpatheticFallback('I am feeling so overwhelmed with exams');
    expect(resp.isDemoFallback).toBe(true);
    expect(resp.message).toContain('overwhelmed');
    expect(resp.suggestedActivity).toBe('grounding');
  });
});
