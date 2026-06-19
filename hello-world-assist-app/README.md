# Hello World - Trimble Assist

A minimal React + TypeScript (Vite) app that embeds the **Trimble Assist** chat UI
using the official React wrapper
`@trimble-agentic-external-npm-local/agentic-chat-react`.

## Prerequisites

- Node.js 18+ (built with Node 22)
- A **Trimble Artifactory token** to install the private Assist package
- An **agent id** (UUID) to embed
- A **Trimble Identity (TID) access token** for a live, authenticated chat (optional
  for just rendering the UI)

## Setup

1. **Configure the private registry.** Copy the example npmrc and add your token:

   ```bash
   cp .npmrc.example .npmrc
   # then edit .npmrc and replace YOUR_AUTH_TOKEN / YOUR_TRIMBLE_EMAIL
   ```

   Get the token from <https://artifactory.trimble.tools>: open the
   `trimble-agentic-external-npm-local` repo → **Set Me Up** (npm), or
   **Edit Profile → Generate an Identity Token**. `.npmrc` is gitignored so the
   token is never committed.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure authentication.** Copy the env example and add your Trimble
   Identity credentials:

   ```bash
   cp .env.example .env
   # set TRIMBLE_CLIENT_ID, TRIMBLE_CLIENT_SECRET, TRIMBLE_CLIENT_NAME
   ```

   How auth works: the dev server includes a small **token proxy** (in
   `vite.config.ts`). It reads these `TRIMBLE_*` values on the Node side, performs
   the OAuth 2.0 client-credentials exchange against
   `https://id.trimble.com/oauth/token`, and exposes the resulting token at
   `GET /api/token`. The browser code (`src/assist/provideToken.ts`) just fetches
   that endpoint, so **the client secret never reaches the browser**. `.env` is
   gitignored.

   - `TRIMBLE_CLIENT_NAME` is used as the OAuth `scope` (it's your registered
     Client *name*, not the id).
   - For a one-off test you can instead set `VITE_TRIMBLE_ACCESS_TOKEN` to a token
     you already minted; `provideToken` will use it and skip the proxy.
   - This proxy is for local dev only (`npm run dev`). A real deployment needs its
     own server-side token endpoint.

## Run

```bash
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # lint
```

## Where things live

- `src/App.tsx` — renders a "Hello World" header and the embedded `AgenticFullChat`.
- `src/assist/config.ts` — `agentId`, `environment` (`stage`/`prod`), and `theme`.
- `src/assist/provideToken.ts` — supplies the TID access token to the chat.

The default agent id (`887868e6-7644-42b1-882e-fa9bafdb5464`) and `stage`
environment can be overridden with `VITE_ASSIST_AGENT_ID` / `VITE_ASSIST_ENVIRONMENT`.
