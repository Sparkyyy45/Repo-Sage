# Contributing to RepoSage

Welcome! RepoSage is a tool *about* open source contribution, built *by* people who care about it. Whether you're fixing a bug, adding a feature, improving the guides, or writing documentation — your help is valuable.

**If you're new to open source contribution, this is the perfect place to start.** The codebase is intentionally small, the architecture is documented, and there are issues tagged with `good first issue` to help you find your footing.

> **🐶 Dogfooding:** We use RepoSage to understand and contribute to RepoSage. Before opening a PR, run the app, load this repo into it, and use the AI agent to understand the codebase. You'll experience exactly what our users do — and you'll write a better PR because of it.

## Table of Contents

- [First time? Start here](#first-time-start-here)
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Feature Requests & Bug Reports](#feature-requests--bug-reports)

---

## First time? Start here

1. **Set up RepoSage locally** — follow the [Quick Start](README.md#quick-start) to get the app running.
2. **Search for `good first issue`** in the [issues tab](https://github.com/Sparkyyy45/Repo-Sage/issues) — these are curated for beginners.
3. **Use RepoSage to analyze itself** — once it's running, search for `Sparkyyy45/Repo-Sage` in the repo search bar. The AI agent will generate an architecture diagram and onboarding guide for you.
4. **Find something to fix** — look for issues labeled `bug`, `docs`, or `good first issue`. Comment on the issue before you start working.
5. **Open a PR** — follow the guidelines below.

---

## Code of Conduct

This project is governed by the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms. Be respectful, inclusive, and constructive.

---

## Getting Started

1. **Find something to work on** — browse [open issues](https://github.com/Sparkyyy45/Repo-Sage/issues) or check the [Roadmap](README.md#impact--whats-next) for planned features.
2. **Claim an issue** — comment on the issue to let others know you're working on it.
3. **Fork the repo** and create a branch for your work.

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm
- A GitHub account (for OAuth testing)

### Local Setup

```bash
# Clone your fork
git clone https://github.com/Sparkyyy45/Repo-Sage.git
cd reposage

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

Fill in `.env.local` with your credentials (see [README → Quick Start](README.md#2-set-up-environment-variables) for details).

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript type check |

---

## Project Structure

```
reposage/
├── app/           # Next.js App Router pages and layouts
├── components/    # React components grouped by domain
│   ├── dashboard/ # Issue feed, filters, profile, saved issues
│   ├── issue/     # Architecture diagram, AI chat, onboarding guide
│   ├── landing/   # Marketing page sections
│   ├── learn/     # Guide reader, section nav, progress tracking
│   ├── repo/      # Repo insights, skill match, activity chart
│   ├── settings/  # AI configuration
│   └── ui/        # shadcn primitives
├── data/          # Static content (guides, educational content)
├── lib/           # Business logic, API clients, utilities
│   ├── github/    # Octokit client, profile, issues, repo ingestion
│   ├── llm/       # AI provider config, prompts, streaming
│   └── repo/      # Diagram generation
├── proxy.ts       # Edge middleware (auth guard)
└── types/         # TypeScript type augmentation
```

---

## Coding Guidelines

### General

- **TypeScript strict mode** — all code must be typed. Avoid `any`.
- **Server components by default** — use `"use client"` only when you need interactivity (hooks, event handlers, browser APIs).
- **Follow existing patterns** — mimic the code style of surrounding files (import order, formatting, naming).

### Naming

| Convention | Example |
|------------|---------|
| React components | `PascalCase` → `IssueFeedClient` |
| Utility functions | `camelCase` → `fetchProfileData` |
| Files (components) | `kebab-case` → `issue-feed-client.tsx` |
| Files (lib) | `kebab-case` → `saved-issues.ts` |
| Types/Interfaces | `PascalCase` → `IssueFeed` |
| CSS classes | Tailwind utility classes |

### Component Structure

```tsx
// 1. Imports — grouped: React, libraries, types, components, styles
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Issue } from "@/lib/github/issues";
import { IssueFeed } from "./issue-feed";

// 2. Types (co-located if not shared)
type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";

// 3. Constants
const PAGE_SIZE = 10;

// 4. Component
export function IssueFeedClient({ issues }: { issues: Issue[] }) {
  // Hooks first
  const [page, setPage] = useState(1);

  // Event handlers / callbacks
  const handleClick = () => { ... };

  // Computed values
  const visible = ...

  // JSX
  return ( ... );
}
```

### State Management

- Use **localStorage** for client-only persistent state (progress, saved issues, AI config)
- Use **React state / hooks** for ephemeral UI state
- Use **server component props** for data fetched at request time
- Do NOT add external state management libraries (no Redux, Zustand, etc.)

### AI Provider Integration

AI features (onboarding guide, issue chat) use a provider-agnostic adapter in `lib/llm/provider.ts`. To add a new provider:

1. Add the provider to the `AIProvider` type
2. Implement the model list in `ai-settings.tsx`
3. Add a case to the `buildFetchOptions` function in `lib/llm/provider.ts`

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, missing semicolons) |
| `refactor` | Code changes that neither fix bugs nor add features |
| `perf` | Performance improvements |
| `test` | Adding or fixing tests |
| `chore` | Build process, tooling, dependencies |

### Examples

```
feat(dashboard): add real pagination to issue feed
fix(auth): handle expired GitHub token gracefully
docs(readme): add quick start guide
refactor(issues): extract issue card into standalone component
```

---

## Pull Request Process

1. **Create a branch** from `main` with a descriptive name:
   ```
   git checkout -b feat/add-issue-save
   ```

2. **Make your changes** following the coding guidelines above.

3. **Run checks** before submitting:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```

4. **Write a clear PR description** explaining:
   - What problem this solves
   - How you solved it
   - Any trade-offs or design decisions
   - Screenshots if UI changes

5. **Link related issues** — reference the issue number in your PR description (e.g., `Closes #42`).

6. **Request review** — at least one approval is required before merging.

7. **Keep PRs small** — aim for single-purpose changes. A PR should do one thing well.

---

## Feature Requests & Bug Reports

- **Bug reports** — open an issue with a clear title, steps to reproduce, expected vs actual behavior, and environment details.
- **Feature requests** — open an issue describing the problem you want to solve, not just the solution. Use the "Feature Request" template.
- **Questions** — start a discussion, don't open an issue.

---

## Additional Resources

- [README.md](README.md) — project overview, features, architecture, quick start
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community guidelines
- [Next.js Docs](https://nextjs.org/docs) — framework documentation
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) — styling reference

---

*Thank you for helping make RepoSage better!*
