export type SectionType = "info" | "tip" | "exercise" | "code";

export interface GuideSection {
  id: string;
  type: SectionType;
  heading: string;
  body: string;
}

export interface Guide {
  order: number;
  slug: string;
  title: string;
  description: string;
  readTime: string;
  icon: string;
  sections: GuideSection[];
}

const B = {
  blue: (c: string) =>
    `<div class="callout" style="background:#EFF6FF;border:1px solid #BFDBFE"><p class="callout-label" style="color:#2563EB">🧠 Simple Explanation</p><p class="callout-text">${c}</p></div>`,
  gray: (c: string) =>
    `<div class="callout" style="background:#F8FAFC;border:1px solid #E2E8F0"><p class="callout-label" style="color:#475569">📖 Technical Detail</p><p class="callout-text">${c}</p></div>`,
  ex: (c: string) =>
    `<div class="callout" style="background:#F8FAFC;border:1px solid #E2E8F0"><p class="callout-label" style="color:#475569">💡 Example</p><p class="callout-text">${c}</p></div>`,
  green: (c: string) =>
    `<div class="callout" style="background:#F0FDF4;border:1px solid #BBF7D0"><p class="callout-label" style="color:#16A34A">🎯 Try It Yourself</p><p class="callout-text">${c}</p></div>`,
};

export const guides: Guide[] = [
  {
    order: 1,
    slug: "git-basics",
    title: "Git & GitHub for Open Source",
    description: "Start from zero. Learn the fork → clone → branch → commit → push → PR workflow step by step.",
    readTime: "25 min",
    icon: "git-branch",
    sections: [
      {
        id: "git-1",
        type: "info",
        heading: "What is Git? What is GitHub?",
        body: [
          B.blue(`Git is a tool that saves snapshots of your project over time. Think of it like "Save As" on steroids — every time you commit, Git remembers exactly what changed. If something breaks later, you can rewind to any previous snapshot. GitHub is a website where developers upload their Git repositories so they can collaborate. It's like Google Drive for code.`),
          B.gray(`Git is a distributed version control system (DVCS). It tracks changes to files in a repository (repo). Each commit creates a snapshot of the entire project state. Git stores these snapshots efficiently using cryptographic hashes (SHA-1), making it tamper-proof. GitHub is a hosting platform for Git repositories, adding collaboration features like pull requests, issues, and code reviews.`),
          B.ex(`Imagine you're writing a book. Without Git, you'd save "essay_draft1.doc", "essay_draft2.doc", "essay_final.doc". With Git, you save once (project.doc) and commit after each major change. Later you can see exactly what you changed between commit 3 and commit 7, and jump back to any version.`),
          B.green(`Open your terminal and type: <code>git --version</code>. If you see a version number, Git is installed. If you get "command not found", download it from <strong>git-scm.com</strong>. That's your first step done!`),
        ].join("\n"),
      },
      {
        id: "git-2",
        type: "info",
        heading: "Why this matters for open source",
        body: [
          B.blue(`In open source, you can't edit the original project directly. Instead, you make your own copy (fork), make changes there, and then ask the project to pull your changes in. This is called the fork-and-pull workflow, and it keeps the original project safe while letting anyone contribute.`),
          B.gray(`Open source projects use a permission model where only maintainers can push directly to the main repository. Contributors work via forks — personal copies hosted under their GitHub account. After pushing changes to their fork, they open a pull request (PR) to propose merging those changes upstream. This workflow is universal across open source.`),
          B.ex(`Think of it like a restaurant's secret recipe book. You can't walk in and edit it — but you can photocopy it (fork), write your changes on your copy, and hand it back to the chef with a note saying "try this improvement" (pull request). If the chef likes it, they update the original book.`),
          B.green(`Go to <strong>github.com/octocat/Spoon-Knife</strong> and click the "Fork" button in the top-right. GitHub will create a copy under your account. You just made your first fork!`),
        ].join("\n"),
      },
      {
        id: "git-3",
        type: "exercise",
        heading: "Installing and configuring Git",
        body: [
          B.blue(`Before you can use Git, it needs to be on your computer and know who you are. Installing is one-time. Configuring your name and email tells Git which name to attach to your commits.`),
          B.gray(`Git can be installed via package managers (Homebrew on macOS, apt on Linux, winget on Windows) or downloaded directly. After installation, <code>git config</code> sets user-level preferences stored in <code>~/.gitconfig</code>. The user.name and user.email are required — every commit is stamped with this identity.`),
          B.ex(`On macOS: <code>brew install git</code>. On Ubuntu: <code>sudo apt install git</code>. On Windows: download from git-scm.com. After install: <code>git config --global user.name "Your Name"</code> and <code>git config --global user.email "you@example.com"</code>.`),
          B.green(`Run these commands in your terminal:<br><code>git --version</code> — verify it's installed.<br><code>git config --global user.name "Your Name"</code><br><code>git config --global user.email "your@email.com"</code><br>Then run <code>git config --list</code> to see your configuration.`),
        ].join("\n"),
      },
      {
        id: "git-4",
        type: "info",
        heading: "Understanding repositories (repos)",
        body: [
          B.blue(`A repository (repo) is a folder managed by Git. It contains all your project files plus a hidden .git folder that stores the entire history. Think of it as a special folder that remembers everything that's ever happened inside it.`),
          B.gray(`Every Git repository contains a <code>.git</code> directory with the object database, references, and configuration. The working directory holds the actual files. Git tracks changes between three areas: the working directory, the staging area (index), and the commit history.`),
          B.ex(`Create your first repo: <code>mkdir my-project && cd my-project && git init</code>. Git will reply "Initialized empty Git repository". The <code>.git</code> folder was created. Your project is now a Git repo.`),
          B.green(`In your terminal:<br>1. <code>mkdir hello-git && cd hello-git</code><br>2. <code>git init</code><br>3. <code>ls -la</code> — you'll see the <code>.git</code> folder<br>4. <code>echo "# Hello Git" > README.md</code><br>5. <code>git status</code> — see your new file waiting to be tracked`),
        ].join("\n"),
      },
      {
        id: "git-5",
        type: "info",
        heading: "The three states of Git: modify, stage, commit",
        body: [
          B.blue(`When you work in a Git repo, your files go through three stages. Working Directory is where you edit files. Staging Area is where you prepare files for a snapshot. Commit is when you take the snapshot. This staging step lets you group related changes together.`),
          B.gray(`The three states map to three sections of Git internals: the working tree (actual files), the index (staged files), and the HEAD (last commit). <code>git add</code> moves changes from working tree to index. <code>git commit</code> moves index changes to HEAD. This workflow gives fine-grained control over what gets committed.`),
          B.ex(`Edit a file → <code>git add file.txt</code> (stages it) → <code>git commit -m "message"</code> (snapshots it). View the cycle with <code>git status</code> at each step.`),
          B.green(`Inside your hello-git repo:<br>1. <code>echo "Line 1" >> README.md</code><br>2. <code>git status</code> — shows "modified" in red<br>3. <code>git add README.md</code><br>4. <code>git status</code> — shows "modified" in green (staged)<br>5. <code>git commit -m "Add first line"</code><br>6. <code>git log</code> — see your first commit!`),
        ].join("\n"),
      },
      {
        id: "git-6",
        type: "tip",
        heading: "Writing good commit messages",
        body: [
          B.blue(`A commit message tells your future self (and others) what a change does and why. Good messages make project history readable. Bad messages like "fix stuff" or "update" make history useless. The convention is: a short summary line (under 50 chars), a blank line, then optional details.`),
          B.gray(`The conventional commit format is widely adopted: <code>type(scope): description</code>. Types include <code>feat</code> (new feature), <code>fix</code> (bug fix), <code>docs</code> (documentation), <code>refactor</code> (code restructure), <code>test</code> (tests), <code>chore</code> (maintenance). The body should explain what and why, not how.`),
          B.ex(`Instead of: <code>git commit -m "fixed bug"</code><br>Write: <code>git commit -m "fix: handle empty input on login form"</code><br>For larger changes, omit <code>-m</code> to open an editor and write:<br><pre>feat: add user profile page\n\n- Add profile route and component\n- Fetch user data from API\n- Display avatar and bio</pre>`),
          B.green(`Make a few commits in your hello-git repo with good messages:<br>1. <code>echo "Line 2" >> README.md && git add . && git commit -m "docs: add second line to readme"</code><br>2. Run <code>git log --oneline</code> to see your clean commit history.`),
        ].join("\n"),
      },
      {
        id: "git-7",
        type: "info",
        heading: "Branches: working on changes safely",
        body: [
          B.blue(`A branch is like a separate workspace where you can make changes without affecting the main project. The default branch is usually called <code>main</code> or <code>master</code>. When you create a branch, Git makes a copy of the code at that point. You work in your branch, and when done, merge it back.`),
          B.gray(`Branches are lightweight pointers to specific commits. Creating a branch (<code>git branch feature-x</code>) creates a new pointer. Switching to it (<code>git checkout feature-x</code> or <code>git switch feature-x</code>) updates the working directory. Branches make Git's workflow powerful — each feature, bug fix, or experiment gets its own isolated branch.`),
          B.ex(`<code>git branch feature-login</code> — creates a branch<br><code>git switch feature-login</code> — switches to it<br><code>git branch</code> — lists all branches, highlights current one<br>Make changes, commit them, then <code>git switch main</code> — your changes are isolated in feature-login.`),
          B.green(`In your hello-git repo:<br>1. <code>git checkout -b add-description</code> (create + switch)<br>2. <code>echo "A sample project" >> README.md</code><br>3. <code>git add . && git commit -m "feat: add project description"</code><br>4. <code>git checkout main</code> — notice the line disappears<br>5. <code>git checkout add-description</code> — it's back. This is branch isolation!`),
        ].join("\n"),
      },
      {
        id: "git-8",
        type: "info",
        heading: "Forking a repository on GitHub",
        body: [
          B.blue(`Forking creates your own copy of someone else's repository under your GitHub account. It's how open source contribution starts. Your fork is independent — you can make any changes without affecting the original. Later, you can propose those changes back via a pull request.`),
          B.gray(`A fork is a server-side clone. GitHub creates a copy of the entire repository (all branches, tags, history) under your account. Your fork maintains a link to the original ("upstream") repository, allowing you to sync changes. Unlike a branch, a fork lives on a different remote and can have its own collaborators.`),
          B.ex(`Visit <strong>github.com/facebook/react</strong> and click Fork. GitHub creates <strong>github.com/YOUR_USERNAME/react</strong>. You now have a personal copy of React's codebase. You can clone it, experiment, and submit changes back.`),
          B.green(`1. Go to <strong>github.com/octocat/Spoon-Knife</strong><br>2. Click "Fork" (top-right)<br>3. Select your account<br>4. Wait for GitHub to create the copy<br>5. You now have <strong>github.com/YOUR_USERNAME/Spoon-Knife</strong>`),
        ].join("\n"),
      },
      {
        id: "git-9",
        type: "code",
        heading: "Cloning a repository to your computer",
        body: [
          B.blue(`Cloning downloads a repository from GitHub to your computer so you can work on it locally. You clone your fork (your copy), not the original repo. Once cloned, you have a full local copy with all branches and history.`),
          B.gray(`<code>git clone &lt;url&gt;</code> creates a local copy of a remote repository. Git downloads all objects and refs, sets up remote tracking branches, and checks out the default branch. The URL can be HTTPS (<code>https://github.com/user/repo.git</code>) or SSH (<code>git@github.com:user/repo.git</code>). SSH is recommended once configured.`),
          B.ex(`<code>git clone https://github.com/YOUR_USERNAME/Spoon-Knife.git</code><br>This creates a folder called <code>Spoon-Knife</code> with the full project. <code>cd Spoon-Knife && git log</code> to see the full commit history. <code>git remote -v</code> shows your fork URL.`),
          B.green(`1. Go to your forked Spoon-Knife repo on GitHub<br>2. Click the green "Code" button<br>3. Copy the HTTPS URL<br>4. In terminal: <code>git clone PASTE_URL_HERE</code><br>5. <code>cd Spoon-Knife && git log --oneline</code> — you have the full history locally!`),
        ].join("\n"),
      },
      {
        id: "git-10",
        type: "info",
        heading: "Adding the upstream remote",
        body: [
          B.blue(`After cloning your fork, you need to connect it to the original repository (called "upstream"). This lets you pull in changes from the original project. Your fork is "origin", the original is "upstream". This two-remote setup is key for keeping your fork up to date.`),
          B.gray(`<code>git remote add upstream &lt;original-url&gt;</code> adds a second remote. <code>git remote -v</code> shows both remotes: origin (your fork) and upstream (the original). Later, <code>git fetch upstream</code> downloads new changes from the original without merging them, letting you sync at your own pace.`),
          B.ex(`<code>git remote add upstream https://github.com/octocat/Spoon-Knife.git</code><br><code>git remote -v</code> shows:<br><pre>origin\tgithub.com/YOU/Spoon-Knife.git (fetch)<br>origin\tgithub.com/YOU/Spoon-Knife.git (push)<br>upstream\tgithub.com/octocat/Spoon-Knife.git (fetch)<br>upstream\tgithub.com/octocat/Spoon-Knife.git (push)</pre>`),
          B.green(`In your Spoon-Knife repo on your computer:<br>1. <code>git remote add upstream https://github.com/octocat/Spoon-Knife.git</code><br>2. <code>git remote -v</code> — verify both remotes appear<br>3. <code>git fetch upstream</code> — fetches changes from original<br>4. You can now sync with the original project!`),
        ].join("\n"),
      },
      {
        id: "git-11",
        type: "info",
        heading: "Creating a branch for your change",
        body: [
          B.blue(`Always create a new branch for each change or feature. This keeps your work organized and lets you work on multiple things simultaneously. The branch name should describe what you're doing, like <code>fix-login-bug</code> or <code>add-dark-mode</code>.`),
          B.gray(`Branch from the latest upstream main: <code>git checkout -b my-feature upstream/main</code>. This ensures your branch starts from the original project's latest code, not your potentially outdated fork. Naming conventions: use kebab-case, start with type (fix/, feat/, docs/).`),
          B.ex(`<code>git fetch upstream</code><br><code>git checkout -b fix-typo-upstream main</code><br>This creates a branch called "fix-typo" starting from your local main, which tracks your fork's main. For starting from upstream: <code>git checkout -b fix-typo upstream/main</code>.`),
          B.green(`In your Spoon-Knife repo:<br>1. <code>git fetch upstream</code><br>2. <code>git checkout -b my-first-change</code><br>3. <code>git branch</code> — shows your new branch with * next to it<br>4. You're now in a safe space to make changes!`),
        ].join("\n"),
      },
      {
        id: "git-12",
        type: "exercise",
        heading: "Making changes and staging them",
        body: [
          B.blue(`After editing files, you need to tell Git which changes to include in your next commit. This is called "staging". You can stage all changes, specific files, or even specific parts of a file. Staging gives you control over what goes into each commit.`),
          B.gray(`<code>git add &lt;file&gt;</code> stages a file. <code>git add .</code> stages all changes in the current directory. <code>git add -p</code> (patch mode) lets you stage parts of a file interactively. Use <code>git reset HEAD &lt;file&gt;</code> to unstage. <code>git diff --staged</code> shows what's staged.`),
          B.ex(`1. Edit README.md: add a line<br>2. <code>git add README.md</code> — stages just this file<br>3. <code>git status</code> — shows file in green (staged)<br>4. Create a new file: <code>echo "notes" > notes.md</code><br>5. <code>git add .</code> — stages both changes<br>6. <code>git reset notes.md</code> — unstages notes.md only`),
          B.green(`In your branch:<br>1. <code>echo "I'm learning open source!" >> README.md</code><br>2. <code>git status</code> — see unstaged change<br>3. <code>git add README.md</code><br>4. <code>git status</code> — see staged change in green<br>5. <code>git diff --staged</code> — review exactly what you staged`),
        ].join("\n"),
      },
      {
        id: "git-13",
        type: "code",
        heading: "Committing your changes",
        body: [
          B.blue(`A commit is a snapshot of your staged changes. It's saved permanently in your repo's history. Every commit has a message describing what changed and why. Think of commits as save points in a game — you can always go back.`),
          B.gray(`<code>git commit -m "message"</code> creates a commit. The message should follow the conventional format. Each commit has a unique SHA-1 hash (e.g., <code>a1b2c3d</code>) that identifies it. <code>git log</code> shows history. <code>git show &lt;hash&gt;</code> shows what a commit changed.`),
          B.ex(`<code>git commit -m "docs: add learning note to readme"</code><br>Output:<br><pre>[my-first-change 1a2b3c4] docs: add learning note to readme<br>1 file changed, 1 insertion(+)</pre><br>The commit is now part of your branch's history.`),
          B.green(`1. Ensure you've staged changes: <code>git status</code><br>2. Commit: <code>git commit -m "docs: add learning progress note"</code><br>3. <code>git log --oneline</code> — see your commit in history<br>4. <code>git show HEAD</code> — see exactly what you committed`),
        ].join("\n"),
      },
      {
        id: "git-14",
        type: "info",
        heading: "Pushing to your fork",
        body: [
          B.blue(`Pushing uploads your local commits to your fork on GitHub. This makes your changes visible online. Once pushed, you can open a pull request. Think of push as "publish" — it sends your local work to the cloud.`),
          B.gray(`<code>git push origin &lt;branch-name&gt;</code> uploads your branch to the "origin" remote (your fork). If it's the first push of a new branch, use <code>-u</code> to set upstream tracking: <code>git push -u origin my-feature</code>. After that, just <code>git push</code> works.`),
          B.ex(`<code>git push -u origin my-first-change</code><br>Output:<br><pre>Enumerating objects: 5, done.<br>Counting objects: 100% (5/5), done.<br>Writing objects: 100% (3/3), 310 bytes<br>To github.com:YOUR_USERNAME/Spoon-Knife.git<br> * [new branch]      my-first-change -> my-first-change</pre>`),
          B.green(`1. <code>git push -u origin my-first-change</code><br>2. Go to your Spoon-Knife fork on GitHub<br>3. Refresh — you'll see a banner: "my-first-change had recent pushes"<br>4. Click "Compare & pull request" to start your PR journey`),
        ].join("\n"),
      },
      {
        id: "git-15",
        type: "info",
        heading: "Opening a Pull Request (PR)",
        body: [
          B.blue(`A Pull Request (PR) is how you ask the original project to include your changes. It shows your changes side by side, lets maintainers comment, and kicks off automated checks. The PR is where collaboration happens.`),
          B.gray(`On GitHub, navigate to your fork and click "Contribute" → "Open Pull Request". Set base repository (the original) as "base" and your fork's branch as "compare". Add a title and description explaining your changes. The PR triggers CI/CD checks and code review workflows.`),
          B.ex(`PR description template:<br><pre>## Summary<br>Fixed a typo in the README introduction.<br><br>## Changes<br>- Corrected "wether" to "whether"<br><br>## Related issue<br>Closes #42</pre>`),
          B.green(`1. Go to your Spoon-Knife fork on GitHub<br>2. Click "Contribute" → "Open Pull Request"<br>3. Write a title: "docs: fix typo in README"<br>4. Add a brief description<br>5. Click "Create Pull Request"<br>6. You've opened your first PR! 🎉`),
        ].join("\n"),
      },
      {
        id: "git-16",
        type: "tip",
        heading: "Responding to PR feedback",
        body: [
          B.blue(`When a maintainer requests changes, don't open a new PR. Just make changes in the same branch, commit, and push — the PR updates automatically. This keeps the entire conversation in one place and shows your progress.`),
          B.gray(`After receiving review comments, address them locally, commit, and push to the same branch. GitHub automatically updates the PR. Use <code>git commit --amend</code> to modify your last commit (if no one else has reviewed it yet), but avoid rebasing commits that others have already reviewed.`),
          B.ex(`1. Maintainer asks to fix a formatting issue<br>2. Edit the file on your branch<br>3. <code>git add . && git commit -m "fix: address review feedback"</code><br>4. <code>git push</code><br>5. The PR updates automatically with the new commit`),
          B.green(`If you have PR feedback to apply:<br>1. <code>git checkout my-first-change</code><br>2. Make the requested changes<br>3. <code>git add . && git commit -m "fix: address review"</code><br>4. <code>git push</code><br>5. Refresh your PR — changes appear automatically`),
        ].join("\n"),
      },
      {
        id: "git-17",
        type: "exercise",
        heading: "Syncing your fork with upstream",
        body: [
          B.blue(`While you work, the original project keeps moving. Other contributors merge changes. To stay up to date, sync your fork by pulling from upstream. This ensures your next change starts from the latest code.`),
          B.gray(`<code>git fetch upstream</code> downloads latest changes. <code>git checkout main</code> switches to your main branch. <code>git merge upstream/main</code> merges upstream changes. <code>git push origin main</code> updates your fork on GitHub. Then create new branches from the updated main.`),
          B.ex(`<pre>git fetch upstream<br>git checkout main<br>git merge upstream/main<br>git push origin main</pre><br>This syncs your fork's main branch with the original project.`),
          B.green(`Sync your Spoon-Knife fork:<br>1. <code>git fetch upstream</code><br>2. <code>git checkout main</code><br>3. <code>git merge upstream/main</code><br>4. <code>git push origin main</code><br>5. Your fork is now up to date! Do this before starting each new contribution.`),
        ].join("\n"),
      },
    ],
  },
  {
    order: 2,
    slug: "read-any-codebase",
    title: "How to Read Any Codebase",
    description: "Stop feeling lost in unfamiliar projects. Learn a repeatable strategy to understand any codebase quickly.",
    readTime: "10 min",
    icon: "book-open",
    sections: [
      {
        id: "read-1",
        type: "info",
        heading: "The fear of unfamiliar code",
        body: [
          B.blue(`Everyone feels lost when opening a new codebase. The key insight: you don't need to understand everything. Professional developers understand about 20% of a codebase when they start. The goal is to find the specific files related to your change.`),
          B.gray(`Cognitive load theory suggests humans can hold ~7 items in working memory. A codebase with thousands of files exceeds this. The strategy is to build a mental model gradually — starting from entry points and following the execution path. Focus on structure, not details.`),
          B.ex(`When you open an unfamiliar project, don't read every file. Instead, look at: what's the one thing this project does? Where does it start? What are the main folders? Files are organized by convention — find the patterns.`),
          B.green(`Pick any open source project you've heard of (like <strong>vercel/next.js</strong> or <strong>facebook/react</strong>). Spend 5 minutes just looking at the folder structure. Write down: what are the top-level folders? Can you guess what each does? Don't read any code yet.`),
        ].join("\n"),
      },
      {
        id: "read-2",
        type: "info",
        heading: "Start with the README and docs",
        body: [
          B.blue(`The README is your map. It tells you what the project does, how to install it, and how to contribute. Always read it first. Documentation helps you understand the architecture without diving into code. This builds your mental model before you touch a single source file.`),
          B.gray(`A well-written README explains the project's purpose, installation steps, usage examples, and architecture. Many projects also have a CONTRIBUTING.md, a docs/ folder, or a Wiki. The docs often include architecture decisions (ADRs) that explain why things are built a certain way.`),
          B.ex(`Open <strong>github.com/facebook/react</strong>. The README explains React is a "JavaScript library for building user interfaces". The CONTRIBUTING.md links to a development workflow guide. The docs folder contains architecture overviews. Read these before any source code.`),
          B.green(`Go to the Spoon-Knife repo. Read the README fully. Then check if there's a CONTRIBUTING.md. What is the project about? What setup instructions exist? Spend 5 minutes reading documentation before looking at any source code.`),
        ].join("\n"),
      },
      {
        id: "read-3",
        type: "code",
        heading: "Reading the folder structure",
        body: [
          B.blue(`Project folders follow conventions. Once you recognize the patterns, you can guess what each folder contains. Common structures tell you about the tech stack and architecture before you read a line of code.`),
          B.gray(`Common top-level conventions: <code>src/</code> (source code), <code>lib/</code> (libraries), <code>components/</code> (UI components), <code>utils/</code> (helpers), <code>tests/</code> or <code>__tests__/</code> (tests), <code>docs/</code> (documentation), <code>scripts/</code> (build/dev tools), <code>config/</code> (configuration). Package managers add <code>node_modules/</code>, <code>vendor/</code>, or similar.`),
          B.ex(`<pre>my-project/<br>├── src/          # source code<br>│   ├── components/   # UI components<br>│   ├── pages/        # routes/pages<br>│   ├── utils/        # helper functions<br>│   └── styles/       # CSS files<br>├── public/       # static assets<br>├── tests/        # test files<br>├── docs/         # documentation<br>├── package.json  # dependencies<br>└── README.md     # project info</pre>`),
          B.green(`Look at the Spoon-Knife folder structure. Run <code>ls -la</code> in the repo. What folders do you see? Can you guess what each contains based on its name? Write down your guesses.`),
        ].join("\n"),
      },
      {
        id: "read-4",
        type: "tip",
        heading: "Find the entry point and trace execution",
        body: [
          B.blue(`The entry point is where the program starts running. Find it (usually main.js, index.js, or similar) and trace how execution flows from there. You don't need to follow every path — just the one related to your change.`),
          B.gray(`Entry points are defined in <code>package.json</code> ("main" field), <code>index.js</code>, <code>app.js</code>, or <code>main.py</code>. For web apps, look at routing files. Follow the import/require chain. Most IDEs let you Ctrl+click to jump to definitions. Use this to trace the path from entry to the feature you're changing.`),
          B.ex(`In a Next.js app: <code>pages/index.js</code> → imports components → components import utilities. Follow the chain for one feature. If you're fixing the login button: pages/login.js → LoginForm component → handleSubmit function → auth API call. Only these 4 files matter.`),
          B.green(`In the Spoon-Knife project, find the main HTML file (index.html). Open it. Trace how a button click flows: find the button element, find the JavaScript function it calls, find what that function does. You just traced your first execution path!`),
        ].join("\n"),
      },
      {
        id: "read-5",
        type: "info",
        heading: "Use search to find what you need",
        body: [
          B.blue(`Don't navigate the folder tree manually — use search. Search for function names, error messages, or UI text. This is the fastest way to find relevant code. GitHub and your IDE both have powerful search.`),
          B.gray(`Use <code>grep -r "search-term"</code> or IDE search (Cmd+Shift+F on VSCode). Search for: error messages (they're unique strings), function names, API endpoints, CSS class names. GitHub's repository search bar also works. Learn regex for advanced searches.`),
          B.ex(`Searching for "404" finds error handling code. Searching for "login" finds authentication files. Searching for "border-radius" finds the CSS for rounded corners. Specific terms give specific results.`),
          B.green(`In the Spoon-Knife project, search for "octocat" across all files. How many matches? What kinds of files contain it? Now search for a CSS property like "color". See how search helps you find relevant code instantly.`),
        ].join("\n"),
      },
      {
        id: "read-6",
        type: "tip",
        heading: "Read the tests",
        body: [
          B.blue(`Tests describe how code is supposed to behave. They're often easier to read than the implementation because they show input and expected output. Reading tests teaches you what a function does and how to use it.`),
          B.gray(`Tests use assertions: <code>expect(result).toBe(expected)</code>. The test name usually describes the scenario. Tests reveal edge cases the author considered. Reading tests before implementation builds understanding of expected behavior without getting lost in implementation details.`),
          B.ex(`A test file for a sorting function:<br><pre>test("sorts numbers ascending", () => {<br>  expect(sort([3, 1, 2])).toEqual([1, 2, 3]);<br>});<br>test("handles empty array", () => {<br>  expect(sort([])).toEqual([]);<br>});</pre><br>You now know exactly what the function does without reading its implementation.`),
          B.green(`If the project has tests, find one test file. Read the test names. Can you understand what each function does just from the test names and assertions? Try it for 2-3 test files.`),
        ].join("\n"),
      },
      {
        id: "read-7",
        type: "exercise",
        heading: "Practice on a real repo",
        body: [
          B.blue(`Now apply everything together. Pick a small open source project, spend 30 minutes exploring it using the techniques you learned. Don't try to understand everything — just find the structure, entry point, and one execution path.`),
          B.gray(`Recommended starter repos: <strong>lodash</strong> (utility library, single-purpose functions), <strong>express</strong> (web framework, clear architecture), <strong>prettier</strong> (code formatter, well-organized). Small to medium repos (1K-10K files) are ideal for practice.`),
          B.ex(`Your exploration checklist:<br>1. Read README (5 min)<br>2. Scan folder structure (5 min)<br>3. Find entry point (5 min)<br>4. Trace one execution path (10 min)<br>5. Read one test file (5 min)<br>You now understand enough to make a simple change.`),
          B.green(`Pick a project and spend 30 minutes:<br>1. Read the README<br>2. List the top-level folders<br>3. Find the entry point<br>4. Search for an error message<br>5. Read one test file<br>6. Try to find where a button click is handled<br>You don't need to understand everything — just build your mental model.`),
        ].join("\n"),
      },
    ],
  },
  {
    order: 3,
    slug: "good-first-pr",
    title: "Anatomy of a Good First PR",
    description: "Learn what makes a pull request easy to review and likely to be merged — from size to description.",
    readTime: "10 min",
    icon: "git-pull-request",
    sections: [
      {
        id: "pr-1",
        type: "info",
        heading: 'What makes a PR "good"?',
        body: [
          B.blue(`A good PR is one that gets merged. Maintainers love PRs that are small, focused, well-described, and easy to review. A good PR saves the maintainer time. A bad PR wastes it. Everything you do should make the reviewer's job easier.`),
          B.gray(`Maintainers review PRs in their spare time. They balance reviewing with their own work. A PR that's easy to review gets reviewed faster. Key factors: size (smaller is better), scope (one change per PR), description (clear explanation), and tests (evidence it works). A good PR reduces cognitive load on the reviewer.`),
          B.ex(`Bad PR title: "Update stuff" (unclear, broad).<br>Good PR title: "Fix: handle empty input on search form" (specific, scoped).<br>Bad PR changes 40 files with no description.<br>Good PR changes 3 files with a clear explanation.`),
          B.green(`Look at your first PR (the one you made in Guide 1). Rate it: is the title clear? Is it small? Does the description explain why? If not, improve it. This mindset shift — "make the reviewer's life easy" — is the most important skill.`),
        ].join("\n"),
      },
      {
        id: "pr-2",
        type: "info",
        heading: "One PR = one change",
        body: [
          B.blue(`The golden rule: one pull request should do exactly one thing. Fix one bug, add one feature, or update one section of docs. When a PR does multiple things, it's harder to review and more likely to be rejected. Keep it focused.`),
          B.gray(`The principle of single responsibility applies to PRs. A PR that fixes a typo AND refactors a component AND adds a feature is hard to review because changes are interleaved. Maintainers may request splitting it. If changes are truly related, mention this in the description. Aim for < 200 lines changed.`),
          B.ex(`Bad: A PR that "fixes bugs and adds dark mode". These are unrelated.<br>Good: Split into two PRs — "fix: resolve login error on Safari" and "feat: add dark mode toggle". Each is reviewable independently.`),
          B.green(`Think of a change you'd make to a project. Is it one thing? Can you split it into smaller pieces? Practice writing PR titles that start with: "fix:", "feat:", "docs:", "refactor:", "test:". Each prefix forces you to define the type of change.`),
        ].join("\n"),
      },
      {
        id: "pr-3",
        type: "tip",
        heading: "Writing a great PR description",
        body: [
          B.blue(`The description explains what your PR does and why. It's the first thing a maintainer reads. A good description answers: What changed? Why? How did you test it? Any screenshots? Related issues?`),
          B.gray(`Use a template: <strong>Summary</strong> (what and why), <strong>Changes</strong> (list of specific changes), <strong>Testing</strong> (how you verified), <strong>Screenshots</strong> (for UI changes), <strong>Related Issues</strong> (closes #123 format). GitHub Flavored Markdown is supported — use it for formatting.`),
          B.ex(`<pre>## Summary\nUpdated the login button color to improve visibility on dark backgrounds.\n\n## Changes\n- Changed button bg from #333 to #555\n- Added hover state for better feedback\n\n## Testing\nTested on Chrome and Firefox with dark theme enabled.\n\n## Related\nCloses #42</pre>`),
          B.green(`Write a PR description for the change you planned earlier. Include: what you changed, why, and how to test it. Practice this 3 times with different hypothetical changes until it feels natural.`),
        ].join("\n"),
      },
      {
        id: "pr-4",
        type: "code",
        heading: "PR checklist before submitting",
        body: [
          B.blue(`Before clicking "Create Pull Request", run through this checklist. It catches common mistakes and saves the reviewer from pointing them out. Think of it as the "does this look right?" check.`),
          B.gray(`Checklist: (1) <code>git diff main</code> — review your changes one more time. (2) Run lint: <code>npm run lint</code> or equivalent. (3) Run tests: <code>npm test</code> or equivalent. (4) Check for debug code (<code>console.log</code>, commented code). (5) Ensure commit messages are clean. (6) Verify no sensitive data (API keys, passwords).`),
          B.ex(`Before submitting, run:<br><pre>git diff main --stat    # see which files changed<br>git diff main          # review actual changes<br>npm run lint           # check code style<br>npm test               # verify nothing broke<br>git log --oneline      # review commit history</pre>`),
          B.green(`For your next PR, create a physical or digital checklist. Before submitting, verify each item. Do this for your next 3 PRs until it becomes a habit.`),
        ].join("\n"),
      },
      {
        id: "pr-5",
        type: "info",
        heading: "Dealing with merge conflicts",
        body: [
          B.blue(`A merge conflict happens when your branch and the main branch both changed the same part of a file. Git doesn't know which version to keep, so it asks you to decide. Don't panic — conflicts are normal and fixable.`),
          B.gray(`When <code>git merge main</code> produces conflicts, Git marks the conflicting areas in files with <code><<<<<<< HEAD</code> and <code>>>>>>>> branch</code>. Edit the file to keep the correct version, remove the markers, then <code>git add</code> and <code>git commit</code>. Use <code>git status</code> to find conflicting files.`),
          B.ex(`A conflicted file looks like:<br><pre><<<<<<< HEAD<br>const color = "blue";<br>=======<br>const color = "red";<br>>>>>>>> my-branch</pre><br>Decide which to keep, delete the markers, and save.`),
          B.green(`Practice: create a conflict intentionally:<br>1. On main: edit README, commit, push<br>2. Switch to your branch, edit same line differently, commit<br>3. <code>git checkout main && git merge my-branch</code><br>4. You'll see a conflict — resolve it, then <code>git add . && git commit</code>`),
        ].join("\n"),
      },
      {
        id: "pr-6",
        type: "tip",
        heading: "What happens after you submit",
        body: [
          B.blue(`After you submit, automated checks run (tests, linting). Then a maintainer reviews your code. They might approve, request changes, or ask questions. Don't take feedback personally — it's about the code, not you. Every contributor gets review feedback.`),
          B.gray(`Typical PR lifecycle: (1) CI checks — automatic tests run. (2) Maintainer assigns reviewers. (3) Reviewers comment on specific lines. (4) You respond and make changes. (5) Re-review. (6) Approval and merge. The whole process takes anywhere from hours to weeks depending on the project's activity.`),
          B.ex(`Common review comments you might receive:<br>"Could you add a test for this case?"<br>"This function is getting long, consider splitting it."<br>"There's a typo on line 42."<br>Each is an opportunity to improve.`),
          B.green(`For your next PR, after submitting, check back after 24 hours. See if there are any comments. Respond to each one politely. If there are no comments, that's also fine — some PRs get merged silently.`),
        ].join("\n"),
      },
      {
        id: "pr-7",
        type: "info",
        heading: "When your PR gets approved",
        body: [
          B.blue(`When a maintainer approves your PR with a green checkmark, it means "this looks good to me." They may merge it immediately or wait for a second reviewer. Either way, congratulations — you just contributed to open source!`),
          B.gray(`A merge typically happens via one of: (1) "Rebase and merge" — clean linear history. (2) "Squash and merge" — all commits become one. (3) "Merge commit" — preserves branch history. The maintainer chooses. After merge, delete your branch locally and on GitHub.`),
          B.ex(`After merge, clean up:<br><pre>git checkout main<br>git pull upstream main<br>git branch -d my-feature            # delete local branch<br>git push origin --delete my-feature  # delete remote branch</pre>`),
          B.green(`When your next PR is merged, follow the cleanup steps above. Then look at your merged PR on GitHub — it now has a "Merged" badge. You're officially a contributor!`),
        ].join("\n"),
      },
      {
        id: "pr-8",
        type: "exercise",
        heading: "Your first real contribution",
        body: [
          B.blue(`You've learned the PR workflow. Now it's time to find a real issue and make your first contribution. Start with a small, low-risk change like a documentation fix or a typo. These are valued by maintainers and are great for building confidence.`),
          B.gray(`Good first contribution types: documentation improvements (fixing typos, clarifying instructions), adding tests, fixing console warnings, improving error messages, updating dependencies. Use GitHub's "good first issue" label filter. Aim for < 50 lines changed.`),
          B.ex(`Finding your first issue:<br>1. Go to github.com/search<br>2. Search for "good first issue" label<br>3. Filter by language you know<br>4. Look for issues with "help wanted" too<br>5. Read the issue carefully before commenting`),
          B.green(`1. Go to <strong>github.com/search?q=label%3A%22good+first+issue%22&type=issues</strong><br>2. Filter by a language you know<br>3. Find an issue that looks manageable<br>4. Comment: "I'd like to work on this"<br>5. Follow the workflow you learned<br>You're ready. Make your first contribution! 🎉`),
        ].join("\n"),
      },
    ],
  },
  {
    order: 4,
    slug: "talk-to-maintainers",
    title: "How to Talk to Maintainers",
    description: "Communicating effectively with project maintainers is half the battle. Learn how to ask good questions and stand out.",
    readTime: "8 min",
    icon: "message-circle",
    sections: [
      {
        id: "talk-1",
        type: "info",
        heading: "Maintainers are people too",
        body: [
          B.blue(`Maintainers are volunteers (mostly) who work on the project in their free time. They have jobs, families, and other responsibilities. Being kind, patient, and respectful makes them want to help you. Rude or demanding behavior gets ignored.`),
          B.gray(`Open source maintainers often manage dozens of issues and PRs simultaneously. They triage, review, debug, and release — all unpaid. The Linux kernel has hundreds of maintainers; smaller projects may have just one. Your empathy goes a long way.`),
          B.ex(`Before asking a question, ask yourself: "Could I find this answer in the docs, README, or existing issues?" If yes, you'll save the maintainer time by finding it yourself. If no, you have a legitimate question worth asking.`),
          B.green(`Pick an open source project you like. Read 5 issues in their issue tracker. Notice how the maintainer responds. Which communication styles get helpful responses? Which get ignored? Learn from these examples.`),
        ].join("\n"),
      },
      {
        id: "talk-2",
        type: "tip",
        heading: "How to ask a good question",
        body: [
          B.blue(`A good question includes: what you're trying to do, what you tried, what happened, and what you expected. This context lets the maintainer help you without playing 20 questions. "It doesn't work" is not a good question.`),
          B.gray(`Use the "XY Problem" framework: explain what you're ultimately trying to achieve (X), not just the specific error you hit (Y). Include relevant code snippets, error messages, and steps to reproduce. Show your research — what did you search for? What docs did you read?`),
          B.ex(`Bad: "Your library is broken, I get an error."<br>Good: "I'm trying to parse a CSV file using parseCSV() and getting a TypeError on line 42. Here's my code and the full error. I checked the docs section on parsing and searched issue #123 but couldn't find a solution."`),
          B.green(`Write a question about a hypothetical problem. Include: what you're trying to do, what you tried, the error, what you expected. Read it back — would you be able to help this person? Refine until the answer is yes.`),
        ].join("\n"),
      },
      {
        id: "talk-3",
        type: "exercise",
        heading: "Before you comment on an issue",
        body: [
          B.blue(`When you find an issue you want to work on, don't just comment "I'll work on this." First, read the entire thread. Someone may already be working on it. The maintainer may have specific requirements. Showing that you've read everything signals respect.`),
          B.gray(`Good first comment etiquette: (1) Read the full conversation. (2) If the issue has an assignee, they're working on it — find another. (3) Comment: "I'd like to pick this up if nobody else is working on it." (4) Wait for a maintainer to assign you before starting. (5) If no response in a week, gently follow up.`),
          B.ex(`Good comment: "Hi! I've read through the thread. I'd like to work on this if it's still available. I'm thinking of implementing it by adding a new option to the config. Let me know if that approach works or if you had something else in mind."`),
          B.green(`Find an open issue labeled "good first issue" in any project. Read the entire thread. Practice writing a comment that shows you've understood the problem and have a plan. Don't post it unless you actually plan to contribute — just practice.`),
        ].join("\n"),
      },
      {
        id: "talk-4",
        type: "info",
        heading: "Receiving and applying feedback",
        body: [
          B.blue(`Code reviews are about the code, not you. When a maintainer suggests changes, they're helping you improve. Say thank you, ask clarifying questions if needed, and make the changes. Defensiveness or arguments make the process unpleasant for everyone.`),
          B.gray(`Review feedback types: (1) Nitpick — style preferences, optional. (2) Required — must fix before merge. (3) Question — they don't understand something. Respond to each type appropriately. For nitpicks, you can push back politely with reasoning. For required changes, just make them.`),
          B.ex(`Good response: "Good catch, thanks! I've updated the variable name and pushed the change."<br>Bad response: "But that's how I always name variables."<br>Good question: "I understand the feedback about the function being too long. Would you prefer I split it into smaller helper functions, or is there a different pattern you have in mind?"`),
          B.green(`Think about a piece of feedback you've received (in any context). Rewrite your response to be more gracious and collaborative. Practice: "Thanks for pointing that out. Here's how I addressed it — does this look better?"`),
        ].join("\n"),
      },
      {
        id: "talk-5",
        type: "tip",
        heading: "When to follow up",
        body: [
          B.blue(`Maintainers are busy. If you haven't heard back in a week or two, a polite follow-up is appropriate. Don't @-mention them repeatedly or demand attention. A simple "Just checking in on this when you have time" works.`),
          B.gray(`Follow-up timing: after 1 week → gentle bump. After 2 weeks → bump with additional context. After 1 month → consider the PR abandoned; close and move on. Never bump more than once per week. Some projects have automated stale-bot that closes inactive PRs.`),
          B.ex(`Good follow-up: "Hi! Just wanted to check in on this PR when you have a moment. Happy to make any changes needed."<br>Bad follow-up: "Any update?" (3 hours later) "Hello??" (next day) "I need this merged NOW."`),
          B.green(`Set a reminder: if you submit a PR and don't hear back in 7 days, post one polite follow-up. If no response in 14 more days, it's acceptable to close the PR and move on. Not every PR gets merged — that's okay.`),
        ].join("\n"),
      },
      {
        id: "talk-6",
        type: "info",
        heading: "Building relationships in open source",
        body: [
          B.blue(`Open source is a community. The people you interact with today might be your colleagues tomorrow. Being helpful, responsive, and kind builds a reputation. Consistently good contributions lead to maintainer trust and eventually — commit access.`),
          B.gray(`Community building strategies: (1) Review other people's PRs — learn by reading their code. (2) Help answer questions in issues you understand. (3) Be consistent — small regular contributions > one huge PR. (4) Follow the project's communication channels (Discord, Slack, mailing list). (5) Respect project conventions and governance.`),
          B.ex(`Many open source contributors started by fixing typos, then graduated to small features, then became core maintainers. Vue.js creator Evan You started as a contributor. React's Dan Abramov started with tiny PRs. Every expert was once a beginner.`),
          B.green(`Join one open source community. Find their communication channel (Discord, Slack, forum). Lurk for a week — read conversations, understand the culture. Then introduce yourself briefly. You're now part of the community.`),
        ].join("\n"),
      },
      {
        id: "talk-7",
        type: "exercise",
        heading: "Draft your first contribution message",
        body: [
          B.blue(`You're ready to write your first contribution message. This is the comment you'll leave on an issue saying you want to work on it. Keep it simple, polite, and informative. Show that you've done your homework.`),
          B.gray(`Your message should include: (1) A greeting and introduction (if first time). (2) Reference to the issue you want to work on. (3) Brief understanding of the problem. (4) Your proposed approach (high level). (5) Any questions you have. Keep it under 150 words.`),
          B.ex(`"Hi everyone! I'd like to take a shot at this issue. From what I understand, the problem is that the search bar doesn't handle special characters. I'm thinking of adding input sanitization in the handleSearch function. Does that approach sound right? Happy to adjust based on feedback."`),
          B.green(`Write your draft message now. Use the format: greeting + understanding + approach + question. Save it somewhere. When you find the right issue, you'll be ready to post it immediately.`),
        ].join("\n"),
      },
    ],
  },
  {
    order: 5,
    slug: "labels-and-conventions",
    title: "Understanding Labels & Conventions",
    description: "Decode GitHub labels, semantic versioning, commit conventions, and project workflows at a glance.",
    readTime: "6 min",
    icon: "tags",
    sections: [
      {
        id: "labels-1",
        type: "info",
        heading: "GitHub issue labels decoded",
        body: [
          B.blue(`Labels are color-coded tags that organize issues and PRs. They tell you at a glance what an issue is about, its priority, and whether it's open for contribution. Learning to read labels helps you find the right issues to work on.`),
          B.gray(`Common labels: <strong>good first issue</strong> (beginner-friendly), <strong>help wanted</strong> (maintainers want community help), <strong>bug</strong> (something broken), <strong>enhancement</strong> (new feature request), <strong>documentation</strong> (docs related), <strong>question</strong> (not a bug, just asking). Each project may have custom labels — read their label list.`),
          B.ex(`Labels you should prioritize as a beginner:<br><table><tr><th>Label</th><th>Meaning</th><th>Difficulty</th></tr><tr><td>good first issue</td><td>Beginner-friendly</td><td>Low</td></tr><tr><td>help wanted</td><td>Open for contributors</td><td>Varies</td></tr><tr><td>documentation</td><td>Docs change</td><td>Low</td></tr><tr><td>bug</td><td>Something broken</td><td>Medium+</td></tr></table>`),
          B.green(`Visit a project you like. Click "Issues" → "Labels". Read through all the labels. Which ones indicate beginner-friendly tasks? Which ones signal high priority? Bookmark the labels page — you'll use it to filter issues.`),
        ].join("\n"),
      },
      {
        id: "labels-2",
        type: "info",
        heading: "Semantic versioning (semver)",
        body: [
          B.blue(`Version numbers like "2.1.3" follow a pattern: MAJOR.MINOR.PATCH. Major = breaking changes. Minor = new features (backward compatible). Patch = bug fixes. Understanding this tells you if an update might break your code.`),
          B.gray(`Semver rules: MAJOR version when making incompatible API changes. MINOR version when adding functionality in a backward-compatible manner. PATCH version when making backward-compatible bug fixes. Pre-release tags like <code>-alpha</code>, <code>-beta</code>, <code>-rc.1</code> indicate unstable versions.`),
          B.ex(`Version <strong>3.0.0</strong> → Major change, may break existing code.<br>Version <strong>2.5.0</strong> → New features added, existing code should work.<br>Version <strong>2.4.1</strong> → Bug fix only, safe to upgrade.<br>If a project is at <strong>0.x</strong>, anything can change at any time.`),
          B.green(`Check the version of a package you use. What does it tell you? If it's 1.x, the API is stable. If it's 0.x, expect changes. If it jumped from 1.9.0 to 2.0.0, there are breaking changes. Practice reading versions.`),
        ].join("\n"),
      },
      {
        id: "labels-3",
        type: "code",
        heading: "Conventional commits explained",
        body: [
          B.blue(`Conventional commits are a standard format for commit messages. They make history readable and enable automated versioning. The format is: <code>type(scope): description</code>. Once you learn it, you can read any project's history.`),
          B.gray(`Full specification: <code>&lt;type&gt;[optional scope]: &lt;description&gt;</code> followed by an optional body and footer. Types: <code>feat</code> (new feature), <code>fix</code> (bug fix), <code>docs</code> (documentation), <code>style</code> (formatting), <code>refactor</code> (code restructure), <code>test</code> (tests), <code>chore</code> (maintenance). The <code>!</code> after type/scope indicates breaking changes.`),
          B.ex(`<pre>feat: add user avatar upload<br>fix(auth): handle expired tokens gracefully<br>docs: update installation guide<br>refactor!: split monolith into modules<br>chore(deps): upgrade lodash to v5</pre>`),
          B.green(`Open your hello-git repo. Run <code>git log --oneline</code>. Do your messages follow conventional commits? If not, practice writing 5 commits with proper format: feat:, fix:, docs:, refactor:, chore:. This becomes habit quickly.`),
        ].join("\n"),
      },
      {
        id: "labels-4",
        type: "tip",
        heading: "Understanding CI/CD badges",
        body: [
          B.blue(`CI/CD (Continuous Integration/Continuous Deployment) badges in READMEs show the project's health: build status, test coverage, and version. A green badge means "passing". A red badge means "failing". Reading these before contributing tells you if the project is actively maintained.`),
          B.gray(`Common badges: <strong>Build</strong> (GitHub Actions, CircleCI) — does the code compile? <strong>Coverage</strong> (Codecov, Coveralls) — what % of code is tested? <strong>License</strong> — project's open source license. <strong>npm version</strong> — latest published version. Clicking a badge usually links to the full report.`),
          B.ex(`A project with a red "build" badge means the tests are failing. Your PR won't be merged until you fix them. A project with 95% test coverage values tests — your PR should include them. A project with no CI at all may be unmaintained.`),
          B.green(`Look at the README of 3 open source projects you use. Find the badges. Which are green? Which are red? What does each badge tell you about the project's health? Write down your observations.`),
        ].join("\n"),
      },
      {
        id: "labels-5",
        type: "exercise",
        heading: "Reading a project's health at a glance",
        body: [
          B.blue(`Now combine everything: labels, versioning, commits, and badges. In 30 seconds, you should be able to assess a project's health and decide if it's worth contributing to. This skill saves you from investing time in dead projects.`),
          B.gray(`Quick assessment checklist: (1) README — clear? (2) License — exists? (3) Last commit — within 6 months? (4) Open issues — being responded to? (5) Build badge — green? (6) Good first issues — labeled? (7) Recent release — within a year? 5+ "yes" answers means it's healthy.`),
          B.ex(`Healthy project: Recent commits, active issue responses, green build badge, clear contributing guide, recent release.<br>Unhealthy project: No commits in 2 years, unanswered issues, no CI, no license, stale PRs gathering dust.`),
          B.green(`Pick 2 projects: one you know is active, one you suspect might be inactive. Spend 2 minutes each assessing them using the checklist. Were you right? This skill helps you find projects worth your time.`),
        ].join("\n"),
      },
    ],
  },
  {
    order: 6,
    slug: "issue-to-merged",
    title: "From Issue to Merged",
    description: "Follow the complete lifecycle of a contribution — from finding an issue to celebrating your merged PR.",
    readTime: "10 min",
    icon: "rocket",
    sections: [
      {
        id: "lifecycle-1",
        type: "info",
        heading: "The full contribution lifecycle",
        body: [
          B.blue(`A contribution goes through stages: finding an issue → understanding it → forking → coding → PR → review → merge. Each stage has its own best practices. This guide walks you through the entire journey end to end.`),
          B.gray(`The lifecycle: (1) <strong>Discovery</strong> — find an issue you can solve. (2) <strong>Understanding</strong> — read the issue, ask clarifying questions. (3) <strong>Planning</strong> — decide your approach. (4) <strong>Implementation</strong> — write code. (5) <strong>Submission</strong> — open PR with description. (6) <strong>Review</strong> — respond to feedback. (7) <strong>Merge</strong> — celebrate! (8) <strong>Follow-up</strong> — delete branch, move on.`),
          B.ex(`A typical first contribution takes 2-3 weeks from first comment to merge. Most of that is waiting for review. The actual coding might take 1-2 hours. Patience is part of the process.`),
          B.green(`Think of a contribution you want to make. Map it to the 8 stages above. Where are you now? What's the next step? Having a clear picture of where you are reduces anxiety.`),
        ].join("\n"),
      },
      {
        id: "lifecycle-2",
        type: "info",
        heading: "Finding the right issue",
        body: [
          B.blue(`Not all issues are good for beginners. Look for issues labeled "good first issue", "help wanted", or "documentation". Avoid issues labeled "discussion", "question", or that have been open for years without activity. The right issue is clearly defined and scoped.`),
          B.gray(`Issue sources: (1) Projects you already use — you understand the context. (2) GitHub's "Explore" → "Issue" search with filters. (3) Websites like <strong>goodfirstissue.dev</strong> and <strong>up-for-grabs.net</strong>. (4) Hacktoberfest during October. Filter by language and label. Aim for issues with clear reproduction steps.`),
          B.ex(`Good issue: "Fix: search bar crashes on special characters" — clear, scoped, testable.<br>Bad issue: "We should improve performance" — vague, broad, no clear action.<br>If an issue is unclear, ask clarifying questions before starting.`),
          B.green(`Go to <strong>goodfirstissue.dev</strong> or search GitHub for "good first issue" + your language. Find 3 issues that look doable. Bookmark them. This is your starter list. Pick one and begin the process.`),
        ].join("\n"),
      },
      {
        id: "lifecycle-3",
        type: "code",
        heading: "Understanding the issue before coding",
        body: [
          B.blue(`Before writing any code, fully understand the issue. Read all comments. Try to reproduce the bug locally. Check if there are tests related to the area. Ask questions if anything is unclear. Coding without understanding leads to wasted effort.`),
          B.gray(`Understanding checklist: (1) Can I reproduce the issue? (2) Do I understand the expected behavior? (3) Do I know which files to change? (4) Are there existing tests I should look at? (5) Has anyone attempted this before? (6) Does the maintainer have a preferred approach? Answer all 6 before writing code.`),
          B.ex(`Before coding, leave a comment: "I've reproduced the issue. My plan is to modify the parseInput function in utils.js to handle special characters. Does that approach look right?" This gets maintainer buy-in before you invest hours.`),
          B.green(`For your chosen issue, go through the understanding checklist. Write down the answers. If you can't answer all 6, ask questions on the issue thread. Don't start coding until you can.`),
        ].join("\n"),
      },
      {
        id: "lifecycle-4",
        type: "tip",
        heading: "Coding with confidence",
        body: [
          B.blue(`When you start coding, work in small iterations. Make one change, test it, commit with a good message. Repeat. This prevents overwhelm and gives you a clear trail if something goes wrong. You can always fall back to a previous commit.`),
          B.gray(`Workflow: (1) Create a branch from updated main. (2) Make the smallest possible change that addresses the issue. (3) Run the existing tests to verify nothing broke. (4) Write new tests for your change. (5) Run linter. (6) Commit with conventional message. (7) Push and open PR. If your change touches more than 5 files, consider simplifying.`),
          B.ex(`Don't try to fix everything at once. If the issue is about a typo, just fix the typo. Don't also refactor the file, update dependencies, and reformat the code. Stick to the scope. Extra changes are distractions.`),
          B.green(`For your issue, define the minimal change needed. What's the smallest set of file changes that resolves the problem? Write them down. Aim for under 50 lines changed. Small PRs get merged faster.`),
        ].join("\n"),
      },
      {
        id: "lifecycle-5",
        type: "info",
        heading: "Writing tests for your change",
        body: [
          B.blue(`Tests prove your change works and prevent future regressions. Most PRs are expected to include tests. Don't skip this step — it's what separates amateur contributions from professional ones. A PR with tests is much more likely to be merged.`),
          B.gray(`Testing strategies: (1) Find the existing test file for the component you changed. (2) Add a test case that covers your change. (3) If your change fixes a bug, write a test that would have caught it. (4) Run all tests to ensure nothing broke. (5) If the project doesn't have tests, mention this in your PR and explain why manual testing is sufficient.`),
          B.ex(`For a bug fix where search crashes on special characters:<br><pre>test("handles special characters in search", () => {<br>  const result = search("!@#$");<br>  expect(result).toEqual([]); // no crash<br/>});</pre><br>This test would have caught the bug before it shipped.`),
          B.green(`Find the test file related to your issue. Read the existing tests. Write one new test for your change. Run it. See it pass. This is the most satisfying step — you've just made the project more reliable.`),
        ].join("\n"),
      },
      {
        id: "lifecycle-6",
        type: "info",
        heading: "The PR review process",
        body: [
          B.blue(`After you submit your PR, automated checks run. Then a maintainer or community member reviews your code. They may approve, request changes, or ask questions. Respond to each comment. The goal is to get to "approved" and "merged".`),
          B.gray(`Review timeline: (1) CI checks run immediately (5-10 minutes). (2) Maintainer assigns reviewers (hours to days). (3) Reviewer leaves comments (days to weeks). (4) You respond and update the PR. (5) Re-review. (6) Merge. Average time: 1-3 weeks for active projects, longer for less active ones.`),
          B.ex(`Review response flow:<br>1. Comment: "Please rename this variable for clarity."<br>2. You: fix it, commit, push<br>3. Reply in thread: "Renamed per suggestion."<br>4. PR updates automatically.<br>Simple, professional, done.`),
          B.green(`When you get your first review, respond to each comment individually. Use "Resolve conversation" when addressed. Be grateful. After each change, push. The PR updates. Track it: [Changes requested] → [Changes approved] → [Merged].`),
        ].join("\n"),
      },
      {
        id: "lifecycle-7",
        type: "exercise",
        heading: "Celebrate and contribute again",
        body: [
          B.blue(`You did it. Your PR is merged. Your code is now part of an open source project used by people around the world. Take a moment to appreciate that. Then do it again. Each contribution is easier than the last.`),
          B.gray(`After merge: (1) Update your local main: <code>git checkout main && git pull upstream main</code>. (2) Delete the branch: <code>git branch -d my-feature</code>. (3) Delete remote branch: <code>git push origin --delete my-feature</code>. (4) Update your progress tracker. (5) Look for the next issue. (6) Share your achievement (LinkedIn, Twitter, portfolio).`),
          B.ex(`Your GitHub profile now shows a merged PR. This is visible to employers. Each contribution builds your track record. After 5-10 contributions, you'll have a portfolio that demonstrates real-world collaboration skills that companies value.`),
          B.green(`Your mission: make one contribution this week. Then another next week. Set a goal of 10 contributions. After 10, you'll have the skills, confidence, and portfolio to contribute to any project. You've gone from zero to open source contributor. 🎉`),
        ].join("\n"),
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getNextGuide(slug: string): Guide | undefined {
  const current = guides.find((g) => g.slug === slug);
  if (!current) return undefined;
  return guides.find((g) => g.order === current.order + 1);
}

export function getPrevGuide(slug: string): Guide | undefined {
  const current = guides.find((g) => g.slug === slug);
  if (!current) return undefined;
  return guides.find((g) => g.order === current.order - 1);
}
