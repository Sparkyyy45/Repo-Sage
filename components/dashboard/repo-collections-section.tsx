"use client";

import { useState } from "react";
import {
  Folder,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";

import {
  getCollections,
  createCollection,
  renameCollection,
  deleteCollection,
  type RepoCollection,
} from "@/lib/repo-collections";

export function RepoCollectionsSection() {
    const [newCollection, setNewCollection] = useState("");
const [collections, setCollections] = useState<RepoCollection[]>(() =>
  getCollections()
);  

 

  const refresh = () => {
    setCollections(getCollections());
  };

  const handleCreate = () => {
    const name = newCollection.trim();

    if (!name) return;

    createCollection(name);
    setNewCollection("");
    refresh();
  };

  const handleRename = (collection: RepoCollection) => {
    const name = prompt("Rename collection", collection.name);

    if (!name) return;

    renameCollection(collection.id, name);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this collection?")) return;

    deleteCollection(id);
    refresh();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="size-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">
            Repository Collections
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">
          {collections.length} collections
        </span>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          value={newCollection}
          onChange={(e) => setNewCollection(e.target.value)}
          placeholder="New collection..."
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Create
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-10 text-center">
            <FolderOpen className="mb-3 size-10 text-muted-foreground/40" />
            <p className="font-medium">No collections yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first repository collection.
            </p>
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div>
                <h3 className="font-medium">{collection.name}</h3>

                <p className="text-sm text-muted-foreground">
                  {collection.repos.length} repositories
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRename(collection)}
                  className="rounded-lg p-2 hover:bg-muted"
                  title="Rename"
                >
                  <Pencil className="size-4" />
                </button>

                <button
                  onClick={() => handleDelete(collection.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}