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

3. **(Optional) Configure runtime credentials.** Copy the env example and fill in a
   token for an authenticated conversation:

   ```bash
   cp .env.example .env
   # set VITE_TRIMBLE_ACCESS_TOKEN=...
   ```

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
