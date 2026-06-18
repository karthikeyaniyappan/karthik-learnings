import type { Environment } from '@trimble-agentic-external-npm-local/agentic-chat-react';

// UUID of the Trimble agent to embed.
// Provided value is used by default; override with VITE_ASSIST_AGENT_ID if needed.
export const AGENT_ID: string =
  (import.meta.env.VITE_ASSIST_AGENT_ID as string | undefined) ??
  '887868e6-7644-42b1-882e-fa9bafdb5464';

// Target Assist environment. 'stage' is the recommended starting point.
export const ENVIRONMENT: Environment =
  (import.meta.env.VITE_ASSIST_ENVIRONMENT as Environment | undefined) ?? 'stage';

// UI theme for the embedded chat.
export const THEME: 'light' | 'dark' = 'light';
