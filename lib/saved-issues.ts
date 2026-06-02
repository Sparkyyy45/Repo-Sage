export type IssueStatus = "saved" | "working" | "pr-submitted" | "merged";

export interface SavedIssue {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  repoFullName: string;
  repoName: string;
  labels: string[];
  status: IssueStatus;
  savedAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "reposage-saved-issues";

function readAll(): SavedIssue[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(issues: SavedIssue[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export function getSavedIssues(): SavedIssue[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getIssuesByStatus(status: IssueStatus): SavedIssue[] {
  return getSavedIssues().filter((i) => i.status === status);
}

export function isIssueSaved(id: number): boolean {
  return readAll().some((i) => i.id === id);
}

export function getIssueStatus(id: number): IssueStatus | null {
  return readAll().find((i) => i.id === id)?.status ?? null;
}

export function saveIssue(issue: {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  repoFullName: string;
  repoName: string;
  labels: string[];
}): SavedIssue[] {
  const all = readAll();
  if (all.some((i) => i.id === issue.id)) return all;
  const entry: SavedIssue = {
    ...issue,
    status: "saved",
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.unshift(entry);
  writeAll(all);
  return all;
}

export function removeIssue(id: number): SavedIssue[] {
  const all = readAll().filter((i) => i.id !== id);
  writeAll(all);
  return all;
}

export function updateIssueStatus(
  id: number,
  status: IssueStatus
): SavedIssue[] {
  const all = readAll();
  const issue = all.find((i) => i.id === id);
  if (issue) {
    issue.status = status;
    issue.updatedAt = new Date().toISOString();
    writeAll(all);
  }
  return all;
}
