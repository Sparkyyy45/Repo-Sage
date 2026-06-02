<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
    <img alt="Next.js" src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  </picture>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=nextauth&logoColor=white" alt="NextAuth">
  <br>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</div>

<br>

<div align="center">
  <h1>RepoSage</h1>
  <p><strong>Your first open source contribution, guided end to end.</strong></p>
  <p>Find beginner-friendly issues matched to your stack, understand the codebase with AI,<br>track your progress, and ship your first PR — all from one dashboard.</p>
</div>

<br>

---

## Features

<table>
<tr>
  <td align="center" width="25%"><b>🔍 Smart Issue Discovery</b></td>
  <td align="center" width="25%"><b>🧠 AI-Powered Analysis</b></td>
  <td align="center" width="25%"><b>📚 Interactive Guides</b></td>
  <td align="center" width="25%"><b>📊 Progress Tracking</b></td>
</tr>
<tr>
  <td>Good-first issues from across GitHub, matched to your languages and filtered by difficulty.</td>
  <td>Auto-generated architecture diagrams, onboarding guides, and a chat that answers "what do I need to change?"</td>
  <td>Six structured guides covering Git, reading codebases, PR etiquette, and the full contribution lifecycle.</td>
  <td>Save issues, mark progress through stages (Saved → Working → PR Submitted → Merged), and track learning.</td>
</tr>
</table>

---

## How it works

```
Sign in with GitHub
       │
       ▼
RepoSage scans your GitHub profile
(languages, repos, stars, commit history)
       │
       ▼
Your dashboard populates with good-first-issues
filtered and sorted by your exact stack
       │
       ▼
Click any issue → instant AI-powered context:
   ├── Architecture diagram of the repo
   ├── Personalized onboarding guide
   ├── Interactive chat: "What files need to change?"
   └── Save it, track it, start working
       │
       ▼
Follow the learning guides at your own pace
 (one section at a time, with progress)
       │
       ▼
Ship your first PR — track it through to merged 🎉
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                Next.js 16                    │
│              (App Router)                    │
│                                             │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Landing │ │Dashboard │ │  Issue Page   │ │
│  │  Page   │ │  + Feed  │ │ + AI Chat     │ │
│  └─────────┘ └──────────┘ └──────────────┘ │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Learn  │ │   Repo   │ │  Settings     │ │
│  │  Hub    │ │ Insights │ │  (AI Config)  │ │
│  └─────────┘ └──────────┘ └──────────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         API Routes                  │    │
│  │  /api/auth/[...nextauth] (NextAuth) │    │
│  │  /api/issues/feed (pagination)      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Edge Middleware             │    │
│  │    Auth guard for protected routes  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
   GitHub REST API              AI Provider
   (via Octokit)                (OpenRouter /
                                 Groq)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) — App Router, React 19, Turbopack |
| **Language** | [TypeScript](https://typescriptlang.org) — strict mode |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (base-nova) |
| **Auth** | [NextAuth v5](https://authjs.dev) — GitHub OAuth |
| **GitHub API** | [Octokit](https://octokit.github.io/rest.js/) — REST client with retry & throttling |
| **AI** | OpenRouter / Groq — LLM-powered analysis (DeepSeek V3, Qwen 2.5 Coder) |
| **Diagrams** | [Mermaid](https://mermaid.js.org) — architecture diagrams |
| **Animations** | [Framer Motion](https://motion.dev) — page transitions |
| **Storage** | `localStorage` — progress, saved issues, AI config |
| **Caching** | Upstash Redis (optional) — server-side cache |

---

## Quick Start

### Prerequisites

- **Node.js 20+** and **npm**
- A **GitHub account** (for OAuth)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/reposage.git
cd reposage
npm install
```

### 2. Set up environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Then fill in the values:

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Run `openssl rand -base64 32` to generate |
| `AUTH_GITHUB_ID` | Yes | From [GitHub OAuth Apps](https://github.com/settings/developers) |
| `AUTH_GITHUB_SECRET` | Yes | Same as above |
| `OPENROUTER_API_KEY` | No* | From [OpenRouter](https://openrouter.ai/keys) — needed for AI features |
| `UPSTASH_REDIS_REST_URL` | No | From [Upstash](https://upstash.com) — for server-side caching |
| `UPSTASH_REDIS_REST_TOKEN` | No | Same as above |

\* AI features are optional. The app works without them; AI-powered analysis and chat simply show a "configure in Settings" prompt.

**GitHub OAuth setup:**

1. Go to [GitHub Settings > Developer Settings > OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL** to `http://localhost:3000`
4. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
5. Copy the Client ID and Client Secret into `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with GitHub and your dashboard will populate with matching issues.

---

## Project Structure

```
reposage/
├── app/                          # Next.js App Router pages
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth API route
│   │   └── issues/feed/          # Issue pagination API
│   ├── dashboard/                # Main dashboard + loading skeleton
│   ├── issue/[owner]/[name]/[number]/  # Issue detail + AI tools
│   ├── learn/                    # Learning hub + guides
│   │   ├── [slug]/               # Individual guide page
│   │   └── loading.tsx           # Guide listing skeleton
│   ├── repo/[owner]/[name]/      # Repo insights page
│   ├── settings/                 # AI provider configuration
│   ├── error.tsx                 # Global error boundary (rate limit handling)
│   ├── globals.css               # Tailwind + shadcn theme tokens
│   ├── layout.tsx                # Root layout (fonts, theme, toaster)
│   ├── not-found.tsx             # Custom 404 page
│   └── page.tsx                  # Landing page
│
├── components/
│   ├── dashboard/                # Issue feed, filters, profile, search, saved issues
│   ├── issue/                    # Arch diagram, AI chat, onboarding guide, header
│   ├── landing/                  # Marketing page sections (hero, features, footer, etc.)
│   ├── learn/                    # Guide reader, section nav, progress dots
│   ├── repo/                     # Skill match, activity chart, insights, file tree
│   ├── settings/                 # AI configuration form
│   └── ui/                       # shadcn primitives (button, card, skeleton, sonner)
│
├── data/
│   └── guides.ts                 # 6 educational guides (51 sections, ~500 lines)
│
├── lib/
│   ├── github/                   # Octokit client, profile, issues, repo ingestion, insights
│   ├── llm/                      # AI provider config, prompts, streaming
│   ├── repo/                     # Mermaid diagram generation
│   ├── auth.ts                   # NextAuth configuration
│   ├── env.ts                    # Zod-validated environment variables
│   ├── github.ts                 # Octokit factory
│   ├── markdown.ts               # Custom markdown-to-HTML renderer
│   ├── saved-issues.ts           # localStorage-backed issue tracking
│   └── utils.ts                  # cn() classname utility
│
├── public/                       # Static assets
├── types/                        # TypeScript type augmentation (NextAuth)
├── proxy.ts                      # Edge middleware (auth guard)
├── components.json               # shadcn/ui configuration
└── postcss.config.mjs            # PostCSS config (Tailwind v4)
```

---

## Usage Guide

### Dashboard

Your dashboard shows:
- **Welcome card** — greeting, Contribution Readiness score, top skills
- **Your Issues** — saved/bookmarked issues with status pipeline (Saved → Working → PR Submitted → Merged)
- **Recommended Issues** — good-first-issues matched to your tech stack, with difficulty and effort estimates
- **Profile sidebar** — your GitHub stats and language breakdown
- **Learning widget** — shows guide completion progress

Filter issues by difficulty (All / Beginner / Intermediate / Advanced) and sort by newest, oldest, or most comments. Use **Load More** to paginate, **Refresh** to fetch fresh data.

### Repo Insights

Search any repo (e.g. `vercel/next.js`) to get:
- **Skill match** — how your languages align with the repo
- **Beginner-friendliness score** — based on contributing docs, issue templates, recent activity
- **Improvement suggestions** — actionable tips to make the repo more beginner-friendly
- **Matching issues** — good-first-issues in that repo
- **Activity chart** — weekly commits, open PRs, last push date

### Issue Analysis

Click an issue to see:
- **Issue header** — title, state, labels, author, rendered body
- **Architecture diagram** — auto-generated Mermaid diagram of the repo structure
- **AI onboarding guide** — explains the repo, tech stack, directory layout, setup, and what to change (requires AI config)
- **AI issue chat** — interactive Q&A about the issue (requires AI config)
- **Bookmark button** — save to track progress

### Learning Hub

Six guides, one section at a time:

| Guide | Sections | What you'll learn |
|-------|----------|-------------------|
| Git & GitHub for Open Source | 17 | Forking, cloning, branching, committing, pushing, PRs |
| How to Read Any Codebase | 7 | READMEs, folder structure, entry points, tests |
| Anatomy of a Good First PR | 8 | Scope, descriptions, checklists, merge conflicts |
| How to Talk to Maintainers | 7 | Asking questions, commenting etiquette, feedback |
| Labels & Conventions | 5 | Issue labels, semver, conventional commits, CI/CD |
| From Issue to Merged | 7 | Full lifecycle — tests, review, celebration |

Each section follows a consistent 4-block format: **Simple Explanation → Technical Detail → Example → Try It Yourself**. Progress is saved to localStorage.

---

## Configuration

### AI Providers

RepoSage supports two AI providers for issue analysis and chat:

| Provider | Models | Setup |
|----------|--------|-------|
| **OpenRouter** | DeepSeek V3, Qwen 2.5 Coder, Claude Haiku, Gemini Flash | Get a key at [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Groq** | Qwen 2.5 Coder, Llama 3.3, Mixtral, Gemma 2 | Get a key at [console.groq.com/keys](https://console.groq.com/keys) |

Configure your provider and key in **Settings** (dashboard → gear icon). Your key is stored in your browser's localStorage and never sent to our servers.

---

## Roadmap

| Priority | Feature | Status |
|----------|---------|--------|
| P0 | GitHub Auth with NextAuth | ✅ Done |
| P0 | Dashboard with issue feed + filters | ✅ Done |
| P0 | Repo ingestion pipeline | ✅ Done |
| P0 | AI onboarding guide + chat | ✅ Done |
| P0 | Learning hub (6 guides) | ✅ Done |
| P0 | Issue save + track system | ✅ Done |
| P0 | Real pagination on issue feed | ✅ Done |
| P0 | Loading skeletons (all pages) | ✅ Done |
| P0 | Landing page CTA for signed-in users | ✅ Done |
| P1 | Favorites page | 🔲 Planned |
| P1 | Server-side progress sync (Redis) | 🔲 Planned |
| P1 | PR status tracking via link | 🔲 Planned |
| P2 | Weekly email digest | 🔲 Planned |
| P2 | Dark mode | 🔲 Planned |
| P2 | Search with autocomplete | 🔲 Planned |

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md) code of conduct.

---

## License

[MIT](LICENSE) © RepoSage
