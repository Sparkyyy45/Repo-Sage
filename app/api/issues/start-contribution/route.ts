import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/github";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.user?.login) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { owner, name, issueNumber, issueTitle } = await req.json();
  if (!owner || !name || !issueNumber) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const octokit = createOctokit(session.accessToken);
  const userLogin = session.user.login;
  const branchName = `reposage/issue-${issueNumber}`;
  const upstreamFullName = `${owner}/${name}`.toLowerCase();

  // Check whether a repo under the user's account is genuinely a fork of
  // owner/name. Returns "match" when it is, "collision" when a repo with that
  // name exists but is not this fork, or "absent" when nothing is there.
  const inspectFork = async (
    repo: string
  ): Promise<"match" | "collision" | "absent"> => {
    try {
      const { data } = await octokit.rest.repos.get({ owner: userLogin, repo });
      const isFork =
        data.fork &&
        data.parent?.full_name.toLowerCase() === upstreamFullName;
      return isFork ? "match" : "collision";
    } catch {
      return "absent";
    }
  };

  // 1. Resolve the fork's actual repo name, verifying identity (not just that a
  // same-named repo exists) and falling back to a distinct name on collision.
  let forkRepo = name;
  let forkExists = false;

  const primary = await inspectFork(name);
  if (primary === "match") {
    forkExists = true;
  } else if (primary === "collision") {
    // A repo named `name` exists but is not this fork; use a distinct name.
    forkRepo = `${owner}-${name}`;
    forkExists = (await inspectFork(forkRepo)) === "match";
  }

  if (!forkExists) {
    const { data: created } = await octokit.rest.repos.createFork({
      owner,
      repo: name,
      // Only override the name when the default collided with another repo.
      ...(forkRepo !== name ? { name: forkRepo } : {}),
    });
    // GitHub may still rename on collision; trust the resolved name.
    forkRepo = created.name;

    let ready = false;
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      try {
        const { data } = await octokit.rest.repos.get({
          owner: userLogin,
          repo: forkRepo,
        });
        if (data.default_branch) {
          ready = true;
          break;
        }
      } catch {
        // still cloning
      }
    }
    if (!ready) {
      return Response.json(
        { error: "Fork creation is taking longer than expected. Please try again." },
        { status: 504 }
      );
    }
  }

  // 2. Get default branch SHA from original repo
  const { data: originalRepo } = await octokit.rest.repos.get({
    owner,
    repo: name,
  });
  const baseBranch = originalRepo.default_branch;

  const { data: baseRef } = await octokit.rest.git.getRef({
    owner,
    repo: name,
    ref: `heads/${baseBranch}`,
  });
  const latestCommitSha = baseRef.object.sha;

  // 3. Create branch on fork
  try {
    await octokit.rest.git.createRef({
      owner: userLogin,
      repo: forkRepo,
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    });
  } catch (err: unknown) {
    const status = err instanceof Object && "status" in err ? (err as { status: number }).status : undefined;
    if (status !== 422) throw err;
  }

  // 4. Create an empty commit so the PR shows a commit rather than "no changes"
  const { data: latestCommit } = await octokit.rest.git.getCommit({
    owner,
    repo: name,
    commit_sha: latestCommitSha,
  });

  const { data: emptyCommit } = await octokit.rest.git.createCommit({
    owner: userLogin,
    repo: forkRepo,
    message: `chore: start working on #${issueNumber}`,
    tree: latestCommit.tree.sha,
    parents: [latestCommitSha],
  });

  await octokit.rest.git.updateRef({
    owner: userLogin,
    repo: forkRepo,
    ref: `heads/${branchName}`,
    sha: emptyCommit.sha,
    force: true,
  });

  // 5. Create draft PR
  const prTitle = issueTitle
    ? `[WIP] ${issueTitle}`
    : `[WIP] Working on #${issueNumber}`;

  const prBody = `## Description

Working on #${issueNumber}.

_Started via RepoSage_

## Checklist
- [ ] Implement the changes
- [ ] Test the changes locally
- [ ] Update documentation if needed`;

  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo: name,
    title: prTitle,
    body: prBody,
    head: `${userLogin}:${branchName}`,
    base: baseBranch,
    draft: true,
  });

  const cloneCommand = `git clone git@github.com:${userLogin}/${forkRepo}.git && cd ${forkRepo} && git checkout ${branchName}`;

  return Response.json({
    cloneCommand,
    prUrl: pr.html_url,
    forkUrl: `https://github.com/${userLogin}/${forkRepo}`,
  });
}
