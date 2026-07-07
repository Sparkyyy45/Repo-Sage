import type { ProfileData } from "@/lib/github/profile";
import { BookOpen, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";

const statItems = [
  { key: "publicRepos", icon: BookOpen, label: "Repositories" },
  { key: "totalStars", icon: Star, label: "Stars" },
  { key: "followers", icon: Users, label: "Followers" },
  { key: "following", icon: GitFork, label: "Following" },
] as const;

export function ProfileCard({ profile }: { profile: ProfileData }) {
  return (
    <div className="rounded-xl card-glow p-5">
      <div className="flex items-start gap-4">
        <Image
          src={profile.avatarUrl}
          alt=""
          width={56}
          height={56}
          className="size-14 rounded-full ring-2 ring-[hsl(var(--grad-1))]"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">
            {profile.name || profile.login}
          </h3>
          <p className="text-sm text-muted-foreground">@{profile.login}</p>
          {profile.bio && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statItems.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className="rounded-lg border border-border/40 p-3 bg-[linear-gradient(135deg,hsl(var(--grad-1)/0.15),hsl(var(--grad-3)/0.15))]"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3" />
              <span>{label}</span>
            </div>
            <div className="mt-1 text-xl font-semibold tabular-nums gradient-text">
              {profile[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}