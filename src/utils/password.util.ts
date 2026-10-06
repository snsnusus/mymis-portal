// Characters that are easy to tell apart when read aloud or copied by hand:
// no 0/o, 1/l/i.
const SUFFIX_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

const RANDOM_PASSWORD_ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*?';

/**
 * Picks `count` characters from `alphabet` using the browser's
 * cryptographically secure random number generator.
 */
const randomChars = (count: number, alphabet: string): string => {
  const values = new Uint32Array(count);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join(
    ''
  );
};

/**
 * Turns a last name into the name part of the default password:
 * lowercase, accents removed, anything other than a–z and 0–9 dropped.
 * "Dela Cruz" → "delacruz", "Peña" → "pena", "O'Brien" → "obrien".
 */
export const toPasswordNamePart = (lastName: string): string => {
  const cleaned = lastName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  return cleaned || 'employee';
};

/**
 * The formatted default password: mymis-{year}-{lastname}-{4 random chars},
 * e.g. "mymis-2026-delacruz-4k7q". `now` is a parameter so tests can fix the year.
 */
export const generateDefaultPassword = (
  lastName: string,
  now: Date = new Date()
): string =>
  `mymis-${now.getFullYear()}-${toPasswordNamePart(lastName)}-${randomChars(
    4,
    SUFFIX_ALPHABET
  )}`;

/** A fully random password, 16 characters long. */
export const generateRandomPassword = (length = 16): string =>
  randomChars(length, RANDOM_PASSWORD_ALPHABET);
