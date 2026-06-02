<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=150&section=header&text=Contributing%20to%20RepoSage&fontSize=50&animation=fadeIn&fontAlignY=40" alt="Contributing Banner">
</div>

<div align="center">
  <h3><strong>First of all, thank you for being here! 🙌</strong></h3>
  <p>RepoSage is a community-driven project dedicated to making open-source accessible for everyone. Whether you're fixing a typo, hunting down a bug, or architecting a massive new feature — your contributions are what make this project special.</p>
</div>

<br/>

> **Never contributed to open source before?** 
> Perfect! You are exactly who this project is for. We are committed to helping you land your first PR. Don't hesitate to ask questions if you get stuck.

---

## 📑 Table of Contents

- [🤝 Code of Conduct](#-code-of-conduct)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Development Setup](#️-development-setup)
- [🏗️ Project Structure](#-project-structure)
- [📝 Coding Guidelines](#-coding-guidelines)
- [💅 Commit Conventions](#-commit-conventions)
- [🔄 Pull Request Process](#-pull-request-process)
- [💡 Feature Requests & Bug Reports](#-feature-requests--bug-reports)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `hello@reposage.dev`.

---

## 🚀 Getting Started

1. **Find an Issue:** Browse our [open issues](https://github.com/yourusername/reposage/issues). Look for the `good first issue` or `help wanted` labels.
2. **Claim It:** Found something interesting? Drop a comment saying *"I'd like to work on this!"* so we know it's in good hands.
3. **Fork & Branch:** Fork the repository and create a new branch for your magic: `git checkout -b feat/your-amazing-feature`.

---

## 🛠️ Development Setup

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- npm or yarn
- A [GitHub account](https://github.com) (for testing the OAuth flow)

### Local Environment

```bash
# 1. Clone your fork
git clone https://github.com/yourusername/reposage.git
cd reposage

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.local.example .env.local
```

> ⚠️ **Note:** You will need to fill in `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` in `.env.local` to test logging in. See the [Quick Start in the README](README.md#2-set-up-environment-variables) for a 1-minute guide on getting those keys.

```bash
# 4. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you're good to go!

---

## 🏗️ Project Structure

A quick map to help you navigate the codebase:

```text
reposage/
├── app/           # Next.js App Router (Pages, Layouts, API routes)
├── components/    # React components (Grouped by feature domain)
│   ├── dashboard/ # Feed, filters, saved issues
│   ├── issue/     # AI Chat, Architecture diagrams, Onboarding
│   └── ui/        # shadcn/ui base primitives
├── data/          # Static content (Learning hub guides)
├── lib/           # Business logic & utilities
│   ├── github/    # Octokit API integrations
│   └── llm/       # OpenRouter/Groq AI adapters
└── public/        # Static assets (Images, icons)
```

---

## 📝 Coding Guidelines

To keep the codebase clean and maintainable, please follow these rules:

1. **Strict TypeScript:** All code must be strongly typed. Please avoid `any`.
2. **Server Components by Default:** React Server Components (RSCs) are incredibly fast. Only use `"use client"` at the top of a file if you absolutely need interactivity (e.g., `useState`, `onClick`).
3. **Follow the Vibe:** Mimic the code style of the surrounding files (naming conventions, import order).

### Naming Conventions

| What | Convention | Example |
|------|------------|---------|
| **React Components** | `PascalCase` | `IssueFeedClient` |
| **Utility Functions** | `camelCase` | `fetchProfileData` |
| **Files (React)** | `kebab-case` | `issue-feed-client.tsx` |
| **Types / Interfaces**| `PascalCase` | `IssueContext` |

---

## 💅 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/). This keeps our history clean and helps auto-generate changelogs.

**Format:**
`<type>(<scope>): <description>`

**Common Types:**
- 🌟 `feat`: A new feature
- 🐛 `fix`: A bug fix
- 📚 `docs`: Documentation changes
- 🎨 `style`: Formatting, missing semi-colons (no code changes)
- ♻️ `refactor`: Code changes that neither fix a bug nor add a feature
- 🚀 `perf`: Performance improvements
- 🧪 `test`: Adding or fixing tests
- 🔧 `chore`: Tooling, configs, dependency updates

**Examples:**
```text
feat(dashboard): add infinite scrolling to the issue feed
fix(auth): handle expired GitHub tokens gracefully
docs(readme): add troubleshooting section
```

---

## 🔄 Pull Request Process

Ready to ship? Awesome!

1. **Run Checks:** Ensure your code is clean before opening a PR.
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
2. **Push to your Fork:** Push your branch up to your GitHub fork.
3. **Open a PR:** Go to the main RepoSage repository and click "Compare & pull request".
4. **Fill out the Template:** Write a clear PR description. What does it do? How did you test it? Include screenshots/GIFs if it's a UI change!
5. **Link the Issue:** Put `Closes #123` in your PR description so GitHub automatically closes the related issue when merged.
6. **Review:** A maintainer will review your code. We might request a few changes—don't worry, this is normal! We'll guide you through it.

---

## 💡 Feature Requests & Bug Reports

- **Found a bug?** Please open an Issue and include clear steps to reproduce it, along with what you expected to happen.
- **Have a cool idea?** Open a Feature Request! Describe the problem your feature solves rather than just the implementation.

---

<div align="center">
  <strong>Thank you for making RepoSage better! 🚀</strong>
</div>
