import type { AvatarStyle } from '~/models/employee.model';
import { Avatar, Style } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json';
import bottts from '@dicebear/styles/bottts.json';
import constellation from '@dicebear/styles/constellation.json';

// Used when an employee hasn't chosen a style (avatarStyle is null).
export const DEFAULT_AVATAR_STYLE: AvatarStyle = 'avataaars';

// The order the picker will show them in (step 7).
export const AVATAR_STYLES: AvatarStyle[] = [
  'avataaars',
  'bottts',
  'constellation',
];

// Each style definition is parsed once, when this file is first imported.
const styles: Record<AvatarStyle, Style> = {
  avataaars: new Style(avataaars),
  bottts: new Style(bottts),
  constellation: new Style(constellation),
};

// Generated avatars, keyed by "style:seed". The same employee appears in the
// list, the dropdown and later the profile, so each is only generated once.
const cache = new Map<string, string>();

/**
 * Returns an SVG data URI, usable directly as an <img src> / <Avatar src>.
 * The same style and seed always produce the same picture.
 */
export const getDefaultAvatarUri = (
  style: AvatarStyle | null | undefined,
  seed: string | number
): string => {
  const resolvedStyle = style ?? DEFAULT_AVATAR_STYLE;
  const cacheKey = `${resolvedStyle}:${seed}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const svg = new Avatar(styles[resolvedStyle], {
    seed: String(seed),
  }).toString();

  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  cache.set(cacheKey, dataUri);

  return dataUri;
};
