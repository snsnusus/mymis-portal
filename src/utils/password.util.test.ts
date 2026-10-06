import { describe, expect, it } from 'vitest';
import {
  generateDefaultPassword,
  generateRandomPassword,
  toPasswordNamePart,
} from './password.util';

describe('toPasswordNamePart', () => {
  it.each([
    ['Dela Cruz', 'delacruz'],
    ['Peña', 'pena'],
    ["O'Brien", 'obrien'],
    ['Santos-Reyes', 'santosreyes'],
    ['  Reyes  ', 'reyes'],
  ])('turns %j into %j', (input, expected) => {
    expect(toPasswordNamePart(input)).toBe(expected);
  });

  it('falls back to "employee" when nothing usable remains', () => {
    expect(toPasswordNamePart('---')).toBe('employee');
  });
});

describe('generateDefaultPassword', () => {
  it('follows mymis-{year}-{lastname}-{4-char suffix}', () => {
    const password = generateDefaultPassword('Dela Cruz', new Date(2026, 9, 6));

    expect(password).toMatch(/^mymis-2026-delacruz-[a-z2-9]{4}$/);
  });

  it('only uses unambiguous characters in the suffix', () => {
    for (let i = 0; i < 50; i++) {
      const suffix = generateDefaultPassword('Reyes').split('-').pop();
      expect(suffix).not.toMatch(/[01ilo]/);
    }
  });
});

describe('generateRandomPassword', () => {
  it('is 16 characters by default', () => {
    expect(generateRandomPassword()).toHaveLength(16);
  });

  it('respects a custom length', () => {
    expect(generateRandomPassword(24)).toHaveLength(24);
  });

  it('is at least the API minimum of 8 characters', () => {
    expect(generateRandomPassword().length).toBeGreaterThanOrEqual(8);
  });
});
