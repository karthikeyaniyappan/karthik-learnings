/**
 * Returns a Trimble Identity (TID) access token for the embedded Assist chat.
 *
 * The chat calls this every time it needs a token, so it is also the right place
 * to refresh an expired token.
 *
 * Resolution order:
 *   1. If `VITE_TRIMBLE_ACCESS_TOKEN` is set, use it directly (handy for a quick
 *      manual test with a token you already minted).
 *   2. Otherwise call the local dev token proxy at `/api/token`, which performs
 *      the OAuth 2.0 client-credentials exchange server-side (see vite.config.ts)
 *      so the client secret never reaches the browser.
 *
 * Returns an empty string on failure, which makes the chat show its sign-in /
 * unauthorized state instead of crashing.
 */
export const provideToken = async (): Promise<string> => {
  const staticToken = import.meta.env.VITE_TRIMBLE_ACCESS_TOKEN as
    | string
    | undefined;
  if (staticToken && staticToken.trim().length > 0) {
    return staticToken;
  }

  try {
    const response = await fetch('/api/token');
    const data = (await response.json()) as {
      access_token?: string;
      error?: string;
    };

    if (!response.ok || !data.access_token) {
      console.error(
        '[Assist] Failed to obtain access token from /api/token:',
        data.error ?? `HTTP ${response.status}`,
      );
      return '';
    }

    return data.access_token;
  } catch (error) {
    console.error('[Assist] Token request to /api/token failed:', error);
    return '';
  }
};
