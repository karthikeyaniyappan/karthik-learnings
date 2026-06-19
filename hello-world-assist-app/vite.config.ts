import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local dev-only token proxy.
 *
 * Exchanges the Trimble Identity client id/secret for an access token using the
 * OAuth 2.0 Client Credentials grant, and exposes it at GET /api/token.
 *
 * The client secret is read from `.env` on the Node side and is NEVER bundled
 * into the browser, which is why these vars are intentionally NOT prefixed with
 * `VITE_`. This runs only during `vite dev`; a production deployment needs its
 * own server-side token endpoint.
 */
function trimbleTokenProxy(env: Record<string, string>): PluginOption {
  return {
    name: 'trimble-token-proxy',
    configureServer(server) {
      server.middlewares.use('/api/token', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const clientId = env.TRIMBLE_CLIENT_ID;
        const clientSecret = env.TRIMBLE_CLIENT_SECRET;
        const scope = env.TRIMBLE_CLIENT_NAME;
        const tokenUrl =
          env.TRIMBLE_TOKEN_URL || 'https://id.trimble.com/oauth/token';

        if (!clientId || !clientSecret || !scope) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error:
                'Missing TRIMBLE_CLIENT_ID, TRIMBLE_CLIENT_SECRET, or ' +
                'TRIMBLE_CLIENT_NAME in your .env file.',
            }),
          );
          return;
        }

        try {
          const credentials = Buffer.from(
            `${clientId}:${clientSecret}`,
          ).toString('base64');

          const upstream = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${credentials}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'client_credentials',
              scope,
            }),
          });

          const text = await upstream.text();
          res.statusCode = upstream.status;

          if (!upstream.ok) {
            console.error(
              `[Assist] Trimble token request failed (${upstream.status}): ${text}`,
            );
          }
          res.end(text);
        } catch (error) {
          console.error('[Assist] Token proxy error:', error);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: String(error) }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (prefix '') so server-side TRIMBLE_* values are available.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), trimbleTokenProxy(env)],
  };
});
