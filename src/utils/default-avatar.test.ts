import { describe, expect, it } from 'vitest';
import { DEFAULT_AVATAR_STYLE, getDefaultAvatarUri } from './default-avatar';

describe('getDefaultAvatarUri', () => {
  it('returns an SVG data URI', () => {
    expect(getDefaultAvatarUri('bottts', 4)).toMatch(
      /^data:image\/svg\+xml;charset=utf-8,/
    );
  });

  it('returns the same URI for the same style and seed', () => {
    expect(getDefaultAvatarUri('bottts', 4)).toBe(
      getDefaultAvatarUri('bottts', 4)
    );
  });

  it('treats numeric and string seeds the same', () => {
    expect(getDefaultAvatarUri('bottts', 4)).toBe(
      getDefaultAvatarUri('bottts', '4')
    );
  });

  it('produces different avatars for different seeds', () => {
    expect(getDefaultAvatarUri('bottts', 4)).not.toBe(
      getDefaultAvatarUri('bottts', 5)
    );
  });

  it('produces different avatars for different styles', () => {
    expect(getDefaultAvatarUri('bottts', 4)).not.toBe(
      getDefaultAvatarUri('constellation', 4)
    );
  });

  it('uses the default style when none is chosen', () => {
    expect(getDefaultAvatarUri(null, 4)).toBe(
      getDefaultAvatarUri(DEFAULT_AVATAR_STYLE, 4)
    );
    expect(getDefaultAvatarUri(undefined, 4)).toBe(
      getDefaultAvatarUri(DEFAULT_AVATAR_STYLE, 4)
    );
  });
});
