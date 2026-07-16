export interface RepoItem {
  fullName: string;
  owner: string;
  name: string;
  description?: string;
  language?: string;
  stars?: number;
}

export interface RepoCollection {
  id: string;
  name: string;
  repos: RepoItem[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "reposage-repo-collections";

function readAll(): RepoCollection[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAll(collections: RepoCollection[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

export function getCollections(): RepoCollection[] {
  return readAll().sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
  );
}

export function createCollection(name: string): RepoCollection[] {
  const collections = readAll();

  collections.unshift({
    id: crypto.randomUUID(),
    name: name.trim(),
    repos: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  writeAll(collections);
  return collections;
}

export function renameCollection(
  id: string,
  name: string
): RepoCollection[] {
  const collections = readAll();

  const collection = collections.find((c) => c.id === id);

  if (collection) {
    collection.name = name.trim();
    collection.updatedAt = new Date().toISOString();
  }

  writeAll(collections);
  return collections;
}

export function deleteCollection(id: string): RepoCollection[] {
  const collections = readAll().filter((c) => c.id !== id);

  writeAll(collections);
  return collections;
}

export function addRepoToCollection(
  collectionId: string,
  repo: RepoItem
): RepoCollection[] {
  const collections = readAll();

  const collection = collections.find((c) => c.id === collectionId);

  if (!collection) return collections;

  const exists = collection.repos.some(
    (r) => r.fullName === repo.fullName
  );

  if (!exists) {
    collection.repos.push(repo);
    collection.updatedAt = new Date().toISOString();
  }

  writeAll(collections);
  return collections;
}

export function removeRepoFromCollection(
  collectionId: string,
  repoFullName: string
): RepoCollection[] {
  const collections = readAll();

  const collection = collections.find((c) => c.id === collectionId);

  if (!collection) return collections;

  collection.repos = collection.repos.filter(
    (r) => r.fullName !== repoFullName
  );

  collection.updatedAt = new Date().toISOString();

  writeAll(collections);
  return collections;
}

export function isRepoInCollection(
  collectionId: string,
  repoFullName: string
): boolean {
  const collection = readAll().find((c) => c.id === collectionId);

  if (!collection) return false;

  return collection.repos.some(
    (r) => r.fullName === repoFullName
  );
}