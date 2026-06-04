import Image from "next/image";
import { BookOpen, Star, Users, GitFork, Code2 } from "lucide-react";
import type { ProfileData } from "@/lib/github/profile";

const LANGUAGE_COLORS_LIGHT: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

export function ProfileSidebar({ profile }: { profile: ProfileData }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src={profile.avatarUrl}
            alt=""
            width={72}
            height={72}
            className="size-[72px] rounded-full ring-4 ring-border shadow-sm"
            unoptimized
          />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {profile.name || profile.login}
          </h3>
          <p className="text-sm text-muted-foreground">@{profile.login}</p>
          {profile.bio && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3 max-w-xs">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="flex flex-col items-center rounded-xl bg-muted/50 p-2.5">
            <BookOpen className="size-3.5 text-muted-foreground" />
            <div className="mt-1 text-sm font-bold text-foreground tabular-nums">
              {profile.publicRepos}
            </div>
            <div className="text-[10px] text-muted-foreground/70">Repos</div>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-muted/50 p-2.5">
            <Star className="size-3.5 text-muted-foreground" />
            <div className="mt-1 text-sm font-bold text-foreground tabular-nums">
              {profile.totalStars}
            </div>
            <div className="text-[10px] text-muted-foreground/70">Stars</div>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-muted/50 p-2.5">
            <Users className="size-3.5 text-muted-foreground" />
            <div className="mt-1 text-sm font-bold text-foreground tabular-nums">
              {profile.followers}
            </div>
            <div className="text-[10px] text-muted-foreground/70">Followers</div>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-muted/50 p-2.5">
            <GitFork className="size-3.5 text-muted-foreground" />
            <div className="mt-1 text-sm font-bold text-foreground tabular-nums">
              {profile.following}
            </div>
            <div className="text-[10px] text-muted-foreground/70">Following</div>
          </div>
        </div>

        {profile.languages.length > 0 && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="size-3.5 text-muted-foreground" />
              <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Languages
              </h4>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted ring-1 ring-border/50">
              {profile.languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color ?? LANGUAGE_COLORS_LIGHT[lang.name] ?? "#64748B",
                  }}
                  title={`${lang.name} ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {profile.languages.slice(0, 5).map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded"
                      style={{
                        backgroundColor:
                          lang.color ?? LANGUAGE_COLORS_LIGHT[lang.name] ?? "#64748B",
                      }}
                    />
                    <span className="text-foreground font-medium">{lang.name}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
