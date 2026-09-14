import { jwtDecode } from 'jwt-decode';

interface DecodedTokenExpiry {
  exp: number;
}

/**
 * Checks whether a JWT's `exp` claim is in the past.
 *
 * This is a client-side, best-effort check only — it does NOT verify the
 * token's signature. It exists purely to decide, cheaply and without a
 * network call, whether it's worth attempting a silent refresh on app
 * startup. The server remains the actual source of truth: a token that
 * passes this check can still be rejected by the API (e.g. revoked early
 * by the change-password endpoint's mass-revocation).
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<DecodedTokenExpiry>(token);
    const nowInSeconds = Date.now() / 1000;

    return exp < nowInSeconds;
  } catch {
    return true;
  }
};
