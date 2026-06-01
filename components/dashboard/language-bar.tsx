export function LanguageBar({
  languages,
}: {
  languages: { name: string; percentage: number; color: string | null }[];
}) {
  if (languages.length === 0) return null;

  const total = languages.reduce((s, l) => s + l.percentage, 0);
  const remainder = total < 100 ? 100 - total : 0;
  const items = remainder > 0
    ? [...languages, { name: "Other", percentage: remainder, color: null }]
    : languages;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
        Top Languages
      </h4>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {items.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color ?? "#555",
            }}
            title={`${lang.name} ${lang.percentage}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {items.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: lang.color ?? "#555" }}
            />
            <span className="text-foreground">{lang.name}</span>
            <span className="text-muted-foreground">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
