/**
 * Returns a Trimble Identity (TID) access token for the embedded Assist chat.
 *
 * The chat calls this every time it needs a token, so it is also the right place
 * to refresh an expired token.
 *
 * For now it reads a token from the `VITE_TRIMBLE_ACCESS_TOKEN` env var (see
 * `.env.example`). When no token is configured it returns an empty string, which
 * makes the chat show its sign-in / unauthorized state instead of crashing.
 *
 * TODO: Wire up real token retrieval once the Trimble Identity client id/secret
 * are available (e.g. exchange them for an access token via your auth backend).
 */
export const provideToken = async (): Promise<string> => {
  const token = import.meta.env.VITE_TRIMBLE_ACCESS_TOKEN as string | undefined;

  if (token && token.trim().length > 0) {
    return token;
  }

  console.warn(
    '[Assist] No TID access token configured. Set VITE_TRIMBLE_ACCESS_TOKEN ' +
      'in a .env file to authenticate the embedded chat.',
  );
  return '';
};
