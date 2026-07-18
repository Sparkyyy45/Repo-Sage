"use client";

import type { Guide, SectionType } from "@/data/guides";
import { CheckCircle, ChevronLeft, ChevronRight, Circle, FileText, Lightbulb, PenLine, Target, Terminal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const typeMeta: Record<SectionType, { icon: React.ElementType; label: string; classes: string }> = {
  info: { icon: FileText, label: "Learn", classes: "bg-blue-50 text-blue-700" },
  tip: { icon: Lightbulb, label: "Tip", classes: "bg-amber-50 text-amber-700" },
  exercise: { icon: Target, label: "Try it", classes: "bg-green-50 text-green-700" },
  code: { icon: Terminal, label: "Reference", classes: "bg-gray-50 text-gray-700" },
};

const STORAGE_KEY = "reposage-learn-sections";
const NOTES_PREFIX = "reposage-learn-notes-";

function readProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(id: string, done: boolean) {
  try {
    const data = readProgress();
    if (done) data[id] = true;
    else delete data[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* noop */
  }
}

export { readProgress as getSectionProgress };

export function GuideContent({
  guide,
  nextGuide,
  prevGuide,
}: {
  guide: Guide;
  nextGuide?: Guide;
  prevGuide?: Guide;
}) {
  const [progress, setProgress] = useState<Record<string, boolean>>(readProgress);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refresh = useCallback(() => setProgress(readProgress()), []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      const id = guide.sections[index]?.id;
      setTimeout(() => {
        document.getElementById("guide-content-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (id) {
          window.dispatchEvent(new CustomEvent("section-active", { detail: id }));
        }
      }, 50);
    },
    [guide.sections]
  );

  useEffect(() => {
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const id = e.detail;
      const idx = guide.sections.findIndex((s) => s.id === id);
      if (idx >= 0) goTo(idx);
    };
    window.addEventListener("section-navigate", handler as EventListener);
    return () => window.removeEventListener("section-navigate", handler as EventListener);
  }, [guide.sections, goTo]);

  const handleMark = useCallback(
    (id: string, value: boolean) => {
      saveProgress(id, value);
      refresh();
    },
    [refresh]
  );

  const section = guide.sections[currentIndex];
  const done = guide.sections.filter((s) => progress[s.id]).length;
  const total = guide.sections.length;
  const allDone = done === total;
  const isLastSection = currentIndex === total - 1;
  const isFirstSection = currentIndex === 0;

  if (!section) return null;

  return (
    <div id="guide-content-top" className="space-y-8">
      <div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Section {currentIndex + 1} of {total}
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground/60">
            {done}/{total} complete
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/70 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-[linear-gradient(90deg,hsl(var(--grad-1)),hsl(var(--grad-3)))]"
            style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="border-t border-border/20" />

      <SectionBlock
        section={section}
        index={currentIndex}
        done={!!progress[section.id]}
        onMark={(v) => handleMark(section.id, v)}
      />

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/20">
        <button
          onClick={() => handleMark(section.id, !progress[section.id])}
          className={`inline-flex items-center gap-2 rounded-xl border-2 px-6 py-2.5 text-sm font-semibold transition-all ${
            progress[section.id]
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-border text-foreground hover:border-[hsl(var(--grad-1))] hover:bg-[hsl(var(--grad-1)/0.1)] hover:text-[hsl(258_55%_45%)]"
          }`}
        >
          {progress[section.id] ? (
            <>
              <CheckCircle className="size-4" />
              Completed
            </>
          ) : (
            <>
              <Circle className="size-4" />
              Mark complete
            </>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          {!isFirstSection && (
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </button>
          )}
          {!isLastSection && (
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="inline-flex items-center gap-1 rounded-lg gradient-primary px-4 py-2 text-xs font-medium"
            >
              Next section
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {allDone && (
        <section className="pt-6 text-center border-t border-border/20">
          <div className="inline-flex size-9 items-center justify-center rounded-full bg-green-50 text-green-600 mb-3">
            <CheckCircle className="size-4.5" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">You finished this guide</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {nextGuide
              ? `"${nextGuide.title}" is ready.`
              : "All guides done — time to make your first contribution."}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {nextGuide && (
              <Link
                href={`/learn/${nextGuide.slug}`}
                className="inline-flex items-center gap-1 rounded-lg gradient-primary px-3.5 py-1.5 text-xs font-medium"
              >
                {nextGuide.title}
                <span aria-hidden="true" className="text-sm leading-none">&rarr;</span>
              </Link>
            )}
            {!nextGuide && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded-lg gradient-primary px-3.5 py-1.5 text-xs font-medium"
              >
                Find your first issue
                <span aria-hidden="true" className="text-sm leading-none">&rarr;</span>
              </Link>
            )}
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-lg border border-border/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              All guides
            </Link>
          </div>
        </section>
      )}

      {allDone && (nextGuide || prevGuide) && (
        <nav className="flex items-center justify-between gap-4 pt-4 border-t border-border/20">
          <div>
            {prevGuide && (
              <Link
                href={`/learn/${prevGuide.slug}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span aria-hidden="true" className="text-sm leading-none">&larr;</span>
                {prevGuide.title}
              </Link>
            )}
          </div>
          <div>
            {nextGuide && (
              <Link
                href={`/learn/${nextGuide.slug}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {nextGuide.title}
                <span aria-hidden="true" className="text-sm leading-none">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

function SectionBlock({
  section,
  index,
  done,
  onMark,
}: {
  section: Guide["sections"][0];
  index: number;
  done: boolean;
  onMark: (done: boolean) => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem(`${NOTES_PREFIX}${section.id}`) ?? "";
    } catch {
      return "";
    }
  });
  const meta = typeMeta[section.type];

  return (
    <section id={`section-${section.id}`} className="scroll-mt-28 space-y-5">
      <div className="flex items-start gap-2.5">
        <h2 className="text-base font-semibold text-foreground leading-snug">
          {index + 1}. {section.heading}
        </h2>
        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.classes}`}>
          {meta.label}
        </span>
      </div>

      <div
        className="prose prose-sm max-w-none [&_.callout]:rounded-xl [&_.callout]:p-4 [&_.callout]:my-5 [&_.callout-label]:text-[10px] [&_.callout-label]:font-semibold [&_.callout-label]:uppercase [&_.callout-label]:tracking-wider [&_.callout-label]:mb-2 [&_.callout-label]:leading-none [&_.callout-text]:text-sm [&_.callout-text]:leading-[1.75] [&_.callout-text]:m-0 [&_p]:text-sm [&_p]:leading-[1.75] [&_p]:text-muted-foreground [&_p+&_p]:mt-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:text-foreground [&_pre]:rounded-lg [&_pre]:bg-muted/80 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_.workflow-grid]:my-5 [&_.workflow-grid]:grid [&_.workflow-grid]:grid-cols-[auto_1fr] [&_.workflow-grid]:gap-x-3 [&_.workflow-grid]:gap-y-1.5 [&_.workflow-grid]:text-sm"
        dangerouslySetInnerHTML={{ __html: renderBody(section.body) }}
      />

      <div className="flex items-center gap-2.5 pt-1">
        <button
          onClick={() => onMark(!done)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
            done
              ? "border-green-200/60 bg-green-50/50 text-green-600"
              : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
          }`}
        >
          {done ? (
            <>
              <CheckCircle className="size-3" />
              Completed
            </>
          ) : (
            <>
              <Circle className="size-3" />
              Mark complete
            </>
          )}
        </button>

        {section.type === "exercise" && (
          <>
            <span className="text-muted-foreground/15">|</span>
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <PenLine className="size-3" />
              {notesOpen ? "Close notes" : "Notes"}
            </button>
          </>
        )}
      </div>

      {section.type === "exercise" && notesOpen && (
        <textarea
          value={notes}
          onChange={(e) => {
            const v = e.target.value;
            setNotes(v);
            try {
              localStorage.setItem(`${NOTES_PREFIX}${section.id}`, v);
            } catch {
              /* noop */
            }
          }}
          placeholder="What did you try? Paste command output here..."
          rows={2}
          className="mt-1 w-full resize-y rounded-lg border border-border bg-muted/20 p-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--grad-1))]"
        />
      )}

      <hr className="border-border/20" />
    </section>
  );
}

function renderBody(body: string): string {
  let html = body.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    const e = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code>${e}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, (_, c) => {
    const e = c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<code>${e}</code>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  const out: string[] = [];
  let inPre = false, inDiv = false, inTable = false;

  for (const line of html.split("\n")) {
    if (line.startsWith("<pre")) { inPre = true; out.push(line); continue; }
    if (inPre) { out.push(line); if (line.includes("</pre>")) inPre = false; continue; }
    if (line.includes("<div")) { inDiv = true; out.push(line); continue; }
    if (inDiv) { out.push(line); if (line.includes("</div>")) inDiv = false; continue; }
    if (line.startsWith("<tr>")) {
      if (!inTable) { out.push('<div class="overflow-x-auto mb-4"><table>'); inTable = true; }
      out.push(line); continue;
    }
    if (inTable) { out.push("</table></div>"); inTable = false; }
    if (/^<(h|pre|table|ul|ol|li|span|strong|code)/.test(line) || line === "") {
      out.push(line); continue;
    }
    out.push(`<p>${line}</p>`);
  }
  if (inTable) out.push("</table></div>");
  if (inDiv) out.push("</div>");

  return out.join("\n");
}