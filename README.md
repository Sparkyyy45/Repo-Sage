# RepoSage

> Find your perfect open source issue. Understand the codebase. Start contributing.

RepoSage matches you with beginner-friendly open source issues in your stack, then explains the codebase and the issue so you can actually contribute.

## The problem it solves

Issue matchers exist. Onboarding tools exist. No one has connected them. You find an issue → you're still lost in the codebase. RepoSage is the missing layer.

## The flow

```
Sign in with GitHub
       │
       ▼
RepoSage scans your profile
(languages, repos, commit history, stars)
       │
       ▼
Shows matched good-first-issues
filtered by YOUR exact stack
       │
       ▼
You click an issue
       │
       ▼
RepoSage kicks in automatically:
  ├── Architecture diagram of that repo
  ├── AI onboarding guide
  ├── Auto-generated CONTRIBUTING.md
  └── Chat: "What does this issue actually require me to change?"
       │
       ▼
Save favorite issues
       │
       ▼
You're actually ready to contribute
```

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind v4** + **shadcn/ui** (base-nova)
- **NextAuth v5** (beta) with the GitHub provider — wired in Sprint 1
- **Octokit** for the GitHub REST API
- **OpenRouter** for AI (DeepSeek V3 + Qwen 2.5 Coder) via `@ai-sdk/openai-compatible`
- **Mermaid** for architecture diagrams (rendered client-side)
- **localStorage** for favorites, optional **Upstash Redis** for server-side cache

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

You will need:

| Key | Where to get it |
|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | https://github.com/settings/developers → New OAuth App |
| `AUTH_GITHUB_SECRET` | Same as above |
| `OPENROUTER_API_KEY` | https://openrouter.ai → Keys |
| `UPSTASH_REDIS_REST_URL` *(optional)* | https://upstash.com → Create database |
| `UPSTASH_REDIS_REST_TOKEN` *(optional)* | Same as above |

GitHub OAuth app callback URL: `http://localhost:3000/api/auth/callback/github`

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project layout

```
app/
  layout.tsx         Root layout, fonts, theme provider, toaster
  page.tsx           Landing page
  globals.css        Tailwind + shadcn theme tokens
components/
  landing/           Nav, Hero, FeatureGrid, Flow, Footer
  theme-provider.tsx Dark-by-default next-themes wrapper
  ui/                shadcn components (button, card, skeleton, sonner)
lib/
  env.ts             Zod-validated env loader
  utils.ts           cn() helper (from shadcn)
```

## Roadmap (sprints)

| # | Sprint | Status |
|---|---|---|
| 0 | Bootstrap | done |
| 1 | GitHub Auth | done |
| 2 | Profile + Issue Feed | done |
| 3 | Repo Ingestion Pipeline | in progress |
| 4 | Architecture Diagram + Onboarding Summary | pending |
| 5 | RAG Chat | pending |
| 6 | Favorites + UX Polish | pending |
| 7 | Deploy + Hardening | pending |

## License

MIT
